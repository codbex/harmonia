import { createDateFormatter } from '../utils/date-format';
import uuidv4 from '../utils/uuid';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, createSvg } from './icons';
import { createDateTimeFormatCache } from './intl';

export { dateOrderMap } from '../utils/date-format';

export function toDateString(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseDateValue(value) {
  const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (isoDate) {
    return new Date(parseInt(isoDate[1]), parseInt(isoDate[2]) - 1, parseInt(isoDate[3]));
  }
  return new Date(value);
}

export function sameDay(dateA, dateB) {
  return dateA && dateB && dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
}

export function isToday(date) {
  return sameDay(date, new Date());
}

export function isDisabled(d, minDate, maxDate) {
  if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
  if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
  return false;
}

// ISO 8601 week number + week-numbering year for a local date.
export function isoWeekParts(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Monday = 0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // Thursday of this week
  const thursday = d.getTime();
  const year = d.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(year, 0, 4));
  const firstDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNum + 3);
  const week = 1 + Math.round((thursday - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return { year, week };
}

// The local Monday date that starts the given ISO week.
export function mondayOfIsoWeek(year, week) {
  const jan4 = new Date(year, 0, 4);
  const jan4DayNum = (jan4.getDay() + 6) % 7;
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - jan4DayNum);
  const monday = new Date(week1Monday);
  monday.setDate(week1Monday.getDate() + (week - 1) * 7);
  return monday;
}

/**
 * Given a focused date and a navigation key, return the date the focus should
 * move to, or null when the key is not a navigation key. Shared by the inline
 * date grid and the event calendar's month / mini-month grids so they navigate
 * identically (Home/End = month bounds, PageUp/PageDown = month).
 */
export function nextFocusDate(date, key) {
  const d = new Date(date);
  switch (key) {
    case 'Left':
    case 'ArrowLeft':
      d.setDate(d.getDate() - 1);
      return d;
    case 'Right':
    case 'ArrowRight':
      d.setDate(d.getDate() + 1);
      return d;
    case 'Up':
    case 'ArrowUp':
      d.setDate(d.getDate() - 7);
      return d;
    case 'Down':
    case 'ArrowDown':
      d.setDate(d.getDate() + 7);
      return d;
    case 'Home':
      d.setDate(1);
      return d;
    case 'End':
      d.setDate(new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate());
      return d;
    case 'PageUp':
      d.setMonth(d.getMonth() - 1);
      return d;
    case 'PageDown':
      d.setMonth(d.getMonth() + 1);
      return d;
    default:
      return null;
  }
}

/**
 * Builds the full calendar DOM (header nav buttons + 6×7 table) inside `el`,
 * wires up all shared state and logic, and returns a controller object.
 *
 * Supports single-date and (opt-in via `config.range`) date-range selection.
 * In range mode the model value and the `change` event detail are
 * `{ start, end }` instead of a single date, and `getSelected()` /
 * `formatSelectedDate()` / `parseDisplayValue()` return range shapes.
 *
 * @param {string} directiveName - used in console.error messages
 * @param {HTMLElement} el
 * @param {{
 *   Alpine:             object,
 *   onSelectionChanged: (triggerInput: boolean) => void,
 *   onEscape:           () => void,
 *   onInvalidModel:     (raw: string|object) => void,
 *   onModelValid:       (date: Date) => void,
 *   stopNavPropagation: boolean,
 *   tableFullWidth:     boolean,
 * }} callbacks - `Alpine` is used to init the header nav buttons as h-button elements
 */
export function createCalendarWidget(directiveName, el, callbacks) {
  let date = new Date();
  let selected = undefined;
  let focusedDay = undefined;

  let rangeMode = false;
  let rangeStart = undefined;
  let rangeEnd = undefined;
  let rangeSeparator = ' - ';

  let locale = undefined;
  let delimiter = undefined;
  let dateOrder = undefined;
  let dateFormatter = createDateFormatter();
  // Memoized Intl.DateTimeFormat instances (keyed by locale+options), reused across renders.
  const dtf = createDateTimeFormatCache();
  let firstDay = 0;
  let minDate = undefined;
  let maxDate = undefined;

  function modelChange(triggerInput = false) {
    if (rangeMode) {
      el.dispatchEvent(new CustomEvent('change', { detail: { start: rangeStart, end: rangeEnd } }));
      if (el._x_model) {
        el._x_model.set({ start: rangeStart ? toDateString(rangeStart) : undefined, end: rangeEnd ? toDateString(rangeEnd) : undefined });
      }
    } else {
      el.dispatchEvent(new CustomEvent('change', { detail: { date: selected } }));
      if (el._x_model) {
        el._x_model.set(toDateString(selected));
      }
    }
    callbacks.onSelectionChanged(triggerInput);
  }

  function setFromModel() {
    const value = el._x_model.get();
    if (rangeMode) {
      const start = value && value.start ? parseDateValue(value.start) : undefined;
      const end = value && value.end ? parseDateValue(value.end) : undefined;
      if ((start && isNaN(start)) || (end && isNaN(end))) {
        console.error(`${directiveName}: model value is not a valid date range - ${JSON.stringify(value)}`);
        callbacks.onInvalidModel(value);
        return;
      }
      rangeStart = start;
      rangeEnd = end;
      if (rangeStart) {
        date = new Date(rangeStart);
        callbacks.onModelValid(rangeStart);
      }
      return;
    }
    selected = parseDateValue(value);
    if (isNaN(selected)) {
      console.error(`${directiveName}: input value is not a valid date - ${value}`);
      callbacks.onInvalidModel(value);
    } else {
      date = new Date(selected);
      callbacks.onModelValid(selected);
    }
  }

  function hasModelValue() {
    if (!Object.prototype.hasOwnProperty.call(el, '_x_model')) return false;
    const value = el._x_model.get();
    if (rangeMode) return !!(value && (value.start || value.end));
    return !!value;
  }

  function checkForModel() {
    if (hasModelValue()) {
      setFromModel();
    }
  }

  function isDisabledInternal(d) {
    return isDisabled(d, minDate, maxDate);
  }

  function getWeekdayNames() {
    const fmt = dtf(locale, { weekday: 'short' });
    return Array.from({ length: 7 }, (_, i) => {
      const weekday = (i + firstDay) % 7;
      return fmt.format(new Date(2020, 9, weekday + 4));
    });
  }

  function getFullWeekdayNames() {
    const fmt = dtf(locale, { weekday: 'long' });
    return Array.from({ length: 7 }, (_, i) => {
      const weekday = (i + firstDay) % 7;
      return fmt.format(new Date(2020, 9, weekday + 4));
    });
  }

  // --- DOM construction ---

  const header = document.createElement('div');
  header.classList.add('hbox', 'gap-2', 'items-center', 'justify-between', 'overflow-visible');
  // The nav buttons reuse the button component (transparent icon variant);
  // the header subtree is initialized as a whole after it is appended.
  function applyNavButtonDirective(btn) {
    btn.setAttribute(callbacks.Alpine.prefixed('h-button'), '');
    btn.setAttribute('data-variant', 'transparent');
    btn.setAttribute('data-size', 'icon');
  }

  const previousYearBtn = document.createElement('button');
  applyNavButtonDirective(previousYearBtn);
  previousYearBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-year') ? el.getAttribute('data-aria-prev-year') : 'previous year');
  previousYearBtn.setAttribute('type', 'button');
  previousYearBtn.appendChild(createSvg({ icon: ChevronsLeft, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  previousYearBtn.addEventListener('click', (event) => {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    date.setFullYear(date.getFullYear() - 1);
    render();
  });
  header.appendChild(previousYearBtn);

  const previousMonthBtn = document.createElement('button');
  applyNavButtonDirective(previousMonthBtn);
  previousMonthBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-month') ? el.getAttribute('data-aria-prev-month') : 'previous month');
  previousMonthBtn.setAttribute('type', 'button');
  previousMonthBtn.appendChild(createSvg({ icon: ChevronLeft, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  previousMonthBtn.addEventListener('click', (event) => {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    date.setMonth(date.getMonth() - 1);
    render();
  });
  header.appendChild(previousMonthBtn);

  const headerLabel = document.createElement('h2');
  headerLabel.classList.add('min-w-[8rem]', 'text-center', 'truncate');
  headerLabel.setAttribute('id', `hdpl${uuidv4()}`);
  headerLabel.setAttribute('aria-live', 'polite');
  header.appendChild(headerLabel);

  const nextMonthBtn = document.createElement('button');
  applyNavButtonDirective(nextMonthBtn);
  nextMonthBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-month') ? el.getAttribute('data-aria-next-month') : 'next month');
  nextMonthBtn.setAttribute('type', 'button');
  nextMonthBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  nextMonthBtn.addEventListener('click', (event) => {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    date.setMonth(date.getMonth() + 1);
    render();
  });
  header.appendChild(nextMonthBtn);

  const nextYearBtn = document.createElement('button');
  applyNavButtonDirective(nextYearBtn);
  nextYearBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-year') ? el.getAttribute('data-aria-next-year') : 'next year');
  nextYearBtn.setAttribute('type', 'button');
  nextYearBtn.appendChild(createSvg({ icon: ChevronsRight, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  nextYearBtn.addEventListener('click', (event) => {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    date.setFullYear(date.getFullYear() + 1);
    render();
  });
  header.appendChild(nextYearBtn);
  el.appendChild(header);
  callbacks.Alpine.initTree(header);

  const datesTable = document.createElement('table');
  datesTable.classList.add('table-fixed', 'border-separate', 'border-spacing-1', 'flex-1');
  if (callbacks.tableFullWidth) datesTable.classList.add('w-full');
  // Grid roles make the roving tabindex / aria-selected / aria-current valid and
  // let screen readers announce an interactive date grid rather than a static table.
  datesTable.setAttribute('role', 'grid');
  datesTable.setAttribute('aria-labelledby', headerLabel.getAttribute('id'));
  const thead = document.createElement('thead');
  datesTable.appendChild(thead);
  const theadRow = document.createElement('tr');
  theadRow.setAttribute('role', 'row');
  thead.appendChild(theadRow);
  const tbody = document.createElement('tbody');
  datesTable.appendChild(tbody);
  el.appendChild(datesTable);

  function setWeekdayHeaders() {
    const names = getWeekdayNames();
    const fullNames = getFullWeekdayNames();
    theadRow.replaceChildren();
    for (let i = 0; i < 7; i++) {
      const th = document.createElement('th');
      th.setAttribute('role', 'columnheader');
      th.setAttribute('scope', 'col');
      th.setAttribute('abbr', names[i]);
      th.setAttribute('aria-label', fullNames[i]);
      th.classList.add('text-sm', 'font-medium');
      th.innerText = names[i];
      theadRow.appendChild(th);
    }
  }

  const dayCells = [];
  for (let r = 0; r < 6; r++) {
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');
    for (let d = 0; d < 7; d++) {
      const cell = document.createElement('td');
      cell.setAttribute('role', 'gridcell');
      // Additional component styles in 'src/styles/calendar.css' and in 'src/styles/common.css'
      cell.classList.add(
        'cursor-pointer',
        'text-sm',
        'align-middle',
        'text-center',
        'size-8',
        'rounded-control',
        'outline-none',
        'duration-100',
        'transition-all',
        'motion-reduce:transition-none',
        'hover:bg-secondary-hover',
        'hover:text-secondary-foreground',
        'focus:bg-secondary-hover',
        'focus:aria-[current=date]:bg-secondary-hover',
        'focus:text-secondary-foreground',
        'aria-[current=date]:bg-secondary',
        'hover:aria-[current=date]:bg-secondary-hover',
        'aria-[current=date]:text-secondary-foreground',
        'aria-selected:not-data-[range=middle]:bg-primary-active!',
        'aria-selected:not-data-[range=middle]:hover:bg-primary-hover!',
        'aria-selected:not-data-[range=middle]:focus:bg-primary-hover!',
        'aria-selected:not-data-[range=middle]:text-primary-foreground!',
        'data-[range=start]:rounded-r-none',
        'data-[range=end]:rounded-l-none',
        'aria-disabled:pointer-events-none',
        'aria-disabled:opacity-disabled'
      );
      cell.setAttribute('tabindex', '-1');
      dayCells.push(row.appendChild(cell));
    }
    tbody.appendChild(row);
  }

  // --- Core rendering ---

  // Commit a day selection. `triggerInput` is forwarded to onSelectionChanged on a
  // complete selection (clicks pass true so a datepicker closes; keyboard passes
  // false so it stays open). A partial range pick never triggers it.
  function selectDay(d, triggerInput) {
    if (!rangeMode) {
      selected = new Date(d);
      modelChange(triggerInput);
      return;
    }
    // Start a new range when nothing is started yet or a full range already exists.
    if (!rangeStart || rangeEnd) {
      rangeStart = new Date(d);
      rangeEnd = undefined;
      modelChange(false);
      return;
    }
    // Second pick completes the range, ordered so start <= end.
    if (d < rangeStart) {
      rangeEnd = rangeStart;
      rangeStart = new Date(d);
    } else {
      rangeEnd = new Date(d);
    }
    modelChange(triggerInput);
  }

  function dayClick(event) {
    if (event.target.getAttribute('aria-disabled') === 'true') return;
    focusedDay = new Date(event.target.dataset.year, event.target.dataset.month, event.target.dataset.day);
    selectDay(focusedDay, true);
    render();
  }

  // Set aria-selected plus, in range mode, a data-range position (start|middle|end)
  // used for the connected range styling. A lone start (no end yet) or a single-day
  // range is treated as both endpoints.
  function setSelectionState(cell, curr) {
    if (!rangeMode) {
      cell.setAttribute('aria-selected', selected && sameDay(selected, curr) ? 'true' : 'false');
      cell.removeAttribute('data-range');
      return;
    }
    const start = rangeStart;
    const end = rangeEnd || rangeStart;
    const inRange = start && curr >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) && curr <= new Date(end.getFullYear(), end.getMonth(), end.getDate());
    cell.setAttribute('aria-selected', inRange ? 'true' : 'false');
    if (!inRange) {
      cell.removeAttribute('data-range');
      return;
    }
    const isStart = sameDay(curr, start);
    const isEnd = sameDay(curr, end);
    cell.setAttribute('data-range', isStart && isEnd ? 'single' : isStart ? 'start' : isEnd ? 'end' : 'middle');
  }

  function render(fromNav = false) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const days = end.getDate();

    const prevEndDay = new Date(year, month, 1);
    prevEndDay.setDate(prevEndDay.getDate() - 1);

    let lastPrevMonthDay = prevEndDay.getDate();
    let startDay = (start.getDay() - firstDay + 7) % 7;

    headerLabel.innerText = dtf(locale, { month: 'long', year: 'numeric' }).format(start);

    let cellIndex = 0;

    function updateDateCell(cell, dayNum) {
      cell.setAttribute('tabindex', '-1');
      cell.setAttribute('aria-disabled', 'true');
      cell.removeAttribute('data-day');
      cell.removeAttribute('data-month');
      cell.removeAttribute('data-year');
      cell.removeAttribute('aria-selected');
      cell.removeAttribute('aria-current');
      cell.removeAttribute('data-range');
      cell.innerText = dayNum < 10 ? `0${dayNum}` : dayNum;
      cell.removeEventListener('click', dayClick);
    }

    for (let d = startDay - 1; d >= 0; d--) {
      updateDateCell(dayCells[d], lastPrevMonthDay);
      lastPrevMonthDay--;
      cellIndex++;
    }

    for (let d = 1; d <= days; d++) {
      const curr = new Date(year, month, d);
      const focusable = focusedDay && sameDay(focusedDay, curr);
      dayCells[cellIndex].setAttribute('data-day', d);
      dayCells[cellIndex].setAttribute('data-month', month);
      dayCells[cellIndex].setAttribute('data-year', year);
      dayCells[cellIndex].setAttribute('tabindex', focusable ? '0' : '-1');
      setSelectionState(dayCells[cellIndex], curr);
      dayCells[cellIndex].setAttribute('aria-disabled', isDisabledInternal(curr));
      if (fromNav && focusable) dayCells[cellIndex].focus();
      if (sameDay(new Date(), curr)) {
        dayCells[cellIndex].setAttribute('aria-current', 'date');
        if (focusedDay === undefined) dayCells[cellIndex].setAttribute('tabindex', '0');
      } else {
        dayCells[cellIndex].removeAttribute('aria-current');
      }
      dayCells[cellIndex].innerText = d < 10 ? `0${d}` : d;
      dayCells[cellIndex].addEventListener('click', dayClick);
      cellIndex++;
    }

    let lastDayNum = 1;
    for (cellIndex; cellIndex < 42; cellIndex++) {
      updateDateCell(dayCells[cellIndex], lastDayNum);
      lastDayNum++;
    }
  }

  function focusDay() {
    if (selected || rangeStart) {
      for (let d = 0; d < dayCells.length; d++) {
        if (dayCells[d].getAttribute('aria-selected') === 'true') {
          dayCells[d].focus();
          return;
        }
      }
    }
    for (let d = 0; d < dayCells.length; d++) {
      if (dayCells[d].hasAttribute('aria-current')) {
        dayCells[d].focus();
        return;
      }
    }
  }

  function onKeyDown(event) {
    // Escape works anywhere in the calendar (e.g. to close a datepicker popover).
    if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      callbacks.onEscape();
      return;
    }

    // Day navigation and selection only apply when a day cell has focus; the
    // header nav buttons keep their native Enter/Space/arrow behavior.
    if (!dayCells.includes(event.target)) return;
    event.stopPropagation();

    if (!focusedDay) focusedDay = selected || rangeEnd || rangeStart || new Date(date.getFullYear(), date.getMonth(), 1);

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isDisabledInternal(focusedDay)) {
        selectDay(focusedDay, false);
        render(true);
      }
      return;
    }

    const newDay = nextFocusDate(focusedDay, event.key);
    if (!newDay) return;
    event.preventDefault();

    if (newDay.getMonth() !== date.getMonth()) {
      date = newDay;
      focusedDay = newDay;
      render(true);
      return;
    }

    focusedDay = newDay;
    render(true);
  }

  el.addEventListener('keydown', onKeyDown);

  // --- Public API ---

  function setConfig(config) {
    rangeMode = !!config.range;
    if (config.rangeSeparator !== undefined) rangeSeparator = config.rangeSeparator;
    if (config.locale) locale = config.locale;
    if (config.delimiter !== undefined) delimiter = config.delimiter;
    if (config.order !== undefined) dateOrder = config.order;
    if (config.firstDay) firstDay = config.firstDay;
    dateFormatter = createDateFormatter({ locale, options: config.options, delimiter, order: dateOrder, rangeSeparator });
    if (config.min) minDate = new Date(config.min);
    if (config.max) maxDate = new Date(config.max);
    setWeekdayHeaders();
    checkForModel();
    render();
  }

  function clearSelected() {
    selected = undefined;
    rangeStart = undefined;
    rangeEnd = undefined;
    render();
  }

  function setSelectedAndSync(d) {
    if (rangeMode) {
      rangeStart = d && d.start ? d.start : undefined;
      rangeEnd = d && d.end ? d.end : undefined;
      if (rangeStart) date = new Date(rangeStart);
    } else {
      selected = d;
      date = new Date(d);
    }
    modelChange(false);
  }

  // Single entry point for external x-model changes. Updates internal state and
  // re-renders when the model differs from the current selection (or clears it
  // when the model is empty). Returns true when it cleared to an empty selection.
  function applyModel(value) {
    if (rangeMode) {
      if (!value || (!value.start && !value.end)) {
        clearSelected();
        return true;
      }
      const start = value.start ? parseDateValue(value.start) : undefined;
      const end = value.end ? parseDateValue(value.end) : undefined;
      if (!sameDay(rangeStart, start) || !sameDay(rangeEnd, end)) {
        checkForModel();
        render();
      }
      return false;
    }
    if (!value) {
      clearSelected();
      return true;
    }
    const parsed = parseDateValue(value);
    if (!selected || !sameDay(selected, parsed)) {
      checkForModel();
      render();
    }
    return false;
  }

  function formatSelectedDate() {
    if (rangeMode) return dateFormatter.formatRange(rangeStart, rangeEnd);
    return selected ? dateFormatter.format(selected) : undefined;
  }

  function parseDisplayValue(value) {
    return rangeMode ? dateFormatter.parseRange(value) : dateFormatter.parse(value);
  }

  return {
    render,
    focusDay,
    setConfig,
    checkForModel,
    clearSelected,
    setSelectedAndSync,
    applyModel,
    formatSelectedDate,
    parseDisplayValue,
    isSameDay: (a, b) => sameDay(a, b),
    isRange: () => rangeMode,
    getSelected: () => (rangeMode ? { start: rangeStart, end: rangeEnd } : selected),
    cleanup() {
      el.removeEventListener('keydown', onKeyDown);
      for (let d = 0; d < dayCells.length; d++) {
        dayCells[d].removeEventListener('click', dayClick);
      }
      callbacks.Alpine.destroyTree(header);
    },
  };
}
