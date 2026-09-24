import { createDateFormatter } from '../utils/date-format';
import { resolveLocale } from '../utils/language';
import uuidv4 from '../utils/uuid';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, createSvg } from './icons';
import { createDateTimeFormatCache } from './intl';
import { createMonthGrid, monthGridCellClasses, monthGridStep } from './month-grid';

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

// A YYYY-MM-DD min or max is a local day. An empty or invalid value sets no bound.
function parseBound(value) {
  if (!value) return undefined;
  const d = parseDateValue(value);
  return isNaN(d) ? undefined : d;
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

// The header aria-labels createCalendarWidget reads off the element it builds into (the
// previous/next month and year buttons and the month/year view toggles). Components that build
// the widget into an internal element rather than a consumer-supplied one (slot-picker,
// datetime-picker) forward these from the element the author sets them on, so the buttons
// localize instead of using their English defaults.
export function forwardCalendarNavAria(from, to) {
  for (const attr of ['data-aria-prev-year', 'data-aria-prev-month', 'data-aria-next-month', 'data-aria-next-year', 'data-aria-choose-month', 'data-aria-choose-year']) {
    if (from.hasAttribute(attr)) to.setAttribute(attr, from.getAttribute(attr));
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
 * The header's month and year toggles swap the day table for a month or a
 * year grid. Picking from either only changes the displayed month, never the
 * selection, and returns to the day table.
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
 *   cycleSelectionTab?: boolean,
 * }} callbacks - `Alpine` is used to init the header nav buttons as h-button elements.
 *   `cycleSelectionTab` wraps Tab between the header and a month/year grid, for popover hosts.
 */
export function createCalendarWidget(directiveName, el, callbacks) {
  let date = new Date();
  let selected = undefined;
  let focusedDay = undefined;

  let rangeMode = false;
  let rangeStart = undefined;
  let rangeEnd = undefined;
  let rangeSeparator = ' - ';

  let locale = resolveLocale();
  let delimiter = undefined;
  let dateOrder = undefined;
  let dateFormatter = createDateFormatter({ locale });
  // Memoized Intl.DateTimeFormat instances (keyed by locale+options), reused across renders.
  const dtf = createDateTimeFormatCache();
  let firstDay = 0;
  let minDate = undefined;
  let maxDate = undefined;

  // 'day', or the 'month' / 'year' grid shown in place of the day table.
  let view = 'day';
  // Roving tab stops of the month and year grids.
  let focusedMonth = 0;
  let focusedYear = 0;

  function modelChange(triggerInput = false) {
    if (rangeMode) {
      el.dispatchEvent(new CustomEvent('change', { detail: { start: rangeStart, end: rangeEnd } }));
      if (el._x_model) {
        el._x_model.set({ start: rangeStart ? toDateString(rangeStart) : undefined, end: rangeEnd ? toDateString(rangeEnd) : undefined });
      }
    } else {
      el.dispatchEvent(new CustomEvent('change', { detail: { date: selected } }));
      if (el._x_model) {
        el._x_model.set(selected ? toDateString(selected) : '');
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

  // The year buttons show only while the year grid does, in place of the month buttons.
  const previousYearBtn = document.createElement('button');
  applyNavButtonDirective(previousYearBtn);
  previousYearBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-year') ? el.getAttribute('data-aria-prev-year') : 'previous year');
  previousYearBtn.setAttribute('type', 'button');
  previousYearBtn.hidden = true;
  previousYearBtn.appendChild(createSvg({ icon: ChevronsLeft, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  previousYearBtn.addEventListener('click', onPreviousYear);
  header.appendChild(previousYearBtn);

  const previousMonthBtn = document.createElement('button');
  applyNavButtonDirective(previousMonthBtn);
  previousMonthBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-month') ? el.getAttribute('data-aria-prev-month') : 'previous month');
  previousMonthBtn.setAttribute('type', 'button');
  previousMonthBtn.appendChild(createSvg({ icon: ChevronLeft, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  previousMonthBtn.addEventListener('click', onPreviousMonth);
  header.appendChild(previousMonthBtn);

  // Names the day grid and announces every change of the displayed month.
  const headerLabel = document.createElement('h2');
  headerLabel.classList.add('sr-only');
  headerLabel.setAttribute('id', `hdpl${uuidv4()}`);
  headerLabel.setAttribute('aria-live', 'polite');
  header.appendChild(headerLabel);

  const chooseMonthLabel = el.hasAttribute('data-aria-choose-month') ? el.getAttribute('data-aria-choose-month') : 'choose month';
  const chooseYearLabel = el.hasAttribute('data-aria-choose-year') ? el.getAttribute('data-aria-choose-year') : 'choose year';

  function createViewToggle(onClick) {
    const btn = document.createElement('button');
    btn.setAttribute(callbacks.Alpine.prefixed('h-button'), '');
    btn.setAttribute('data-variant', 'outline');
    btn.setAttribute('data-size', 'md');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', onClick);
    return btn;
  }

  const monthToggle = createViewToggle(onMonthToggle);
  const yearToggle = createViewToggle(onYearToggle);
  const viewToggles = document.createElement('div');
  viewToggles.setAttribute(callbacks.Alpine.prefixed('h-button-group'), '');
  // A group role would add a second group to hosts that have one (the datetime picker's time editor).
  viewToggles.setAttribute('role', 'none');
  viewToggles.append(monthToggle, yearToggle);
  header.appendChild(viewToggles);

  const nextMonthBtn = document.createElement('button');
  applyNavButtonDirective(nextMonthBtn);
  nextMonthBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-month') ? el.getAttribute('data-aria-next-month') : 'next month');
  nextMonthBtn.setAttribute('type', 'button');
  nextMonthBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  nextMonthBtn.addEventListener('click', onNextMonth);
  header.appendChild(nextMonthBtn);

  const nextYearBtn = document.createElement('button');
  applyNavButtonDirective(nextYearBtn);
  nextYearBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-year') ? el.getAttribute('data-aria-next-year') : 'next year');
  nextYearBtn.setAttribute('type', 'button');
  nextYearBtn.hidden = true;
  nextYearBtn.appendChild(createSvg({ icon: ChevronsRight, classes: 'opacity-70 size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': true, role: 'presentation' } }));
  nextYearBtn.addEventListener('click', onNextYear);
  header.appendChild(nextYearBtn);
  el.appendChild(header);
  callbacks.Alpine.initTree(header);

  // A step is blocked once the displayed month is at the min/max month, so a
  // calendar showing a value outside them can still step back toward them.
  function monthStepBlocked(delta) {
    const shown = new Date(date.getFullYear(), date.getMonth(), 1);
    if (delta < 0) return !!minDate && shown <= new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    return !!maxDate && shown >= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
  }

  function yearStepBlocked(delta) {
    const [first, last] = yearRange();
    return delta < 0 ? date.getFullYear() <= first : date.getFullYear() >= last;
  }

  function stepMonth(event, delta) {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    if (monthStepBlocked(delta)) return;
    // Built on the 1st, so a 31st cannot overflow past a shorter month.
    date = new Date(date.getFullYear(), date.getMonth() + delta, 1);
    focusedMonth = date.getMonth();
    render();
  }

  function stepYear(event, delta) {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    if (yearStepBlocked(delta)) return;
    date = clampMonth(new Date(date.getFullYear() + delta, date.getMonth(), 1));
    focusedYear = date.getFullYear();
    render();
    revealYear(false);
  }

  function onPreviousMonth(event) {
    stepMonth(event, -1);
  }
  function onNextMonth(event) {
    stepMonth(event, 1);
  }
  function onPreviousYear(event) {
    stepYear(event, -1);
  }
  function onNextYear(event) {
    stepYear(event, 1);
  }
  function onMonthToggle(event) {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    setView(view === 'month' ? 'day' : 'month');
  }
  function onYearToggle(event) {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    setView(view === 'year' ? 'day' : 'year');
  }

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
        'outline-ring/50',
        'focus-outline',
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

  // --- Month and year grids ---

  // Years offered either side of this year when no min/max bounds them.
  const YEAR_SPAN = 100;

  // Built on first use and detached while the day table shows, so the day view
  // DOM stays one table of 42 cells.
  let monthGrid = undefined;
  let monthGridBox = undefined;
  let yearScroller = undefined;
  let yearTable = undefined;
  let yearCells = [];
  let yearCellsRange = undefined;
  // The day table's size in rem, which a grid takes so the calendar never changes size.
  let daySize = undefined;

  // The day size goes on a block the table fills, as for the year list, since
  // WebKit draws a fixed-layout table narrower than an inline width it is given.
  function ensureMonthGrid() {
    if (!monthGrid) {
      monthGrid = createMonthGrid({ onPick: pickMonth, stopPropagation: callbacks.stopNavPropagation });
      monthGrid.table.setAttribute('aria-label', chooseMonthLabel);
      monthGrid.table.classList.add('w-full', 'h-full');
      monthGridBox = document.createElement('div');
      if (callbacks.tableFullWidth) monthGridBox.classList.add('w-full');
      monthGridBox.appendChild(monthGrid.table);
    }
    return monthGridBox;
  }

  function ensureYearGrid() {
    if (!yearScroller) {
      yearScroller = document.createElement('div');
      yearScroller.classList.add('overflow-y-auto', 'border', 'rounded-control');
      if (callbacks.tableFullWidth) yearScroller.classList.add('w-full');
      // Firefox would otherwise make the scroll container a tab stop of its own.
      yearScroller.setAttribute('tabindex', '-1');
      yearTable = document.createElement('table');
      yearTable.classList.add('w-full', 'table-fixed', 'border-separate', 'border-spacing-1');
      yearTable.setAttribute('role', 'grid');
      yearTable.setAttribute('aria-label', chooseYearLabel);
      yearScroller.appendChild(yearTable);
      yearScroller.addEventListener('click', onYearClick);
    }
    return yearScroller;
  }

  // The years the grid offers - the min/max years when set, otherwise YEAR_SPAN
  // years either side of this year, widened to the displayed year.
  function yearRange() {
    const thisYear = new Date().getFullYear();
    const shown = date.getFullYear();
    const first = minDate ? minDate.getFullYear() : Math.min(thisYear - YEAR_SPAN, shown);
    const last = maxDate ? maxDate.getFullYear() : Math.max(thisYear + YEAR_SPAN, shown);
    return [first, Math.max(first, last)];
  }

  function buildYearCells([first, last]) {
    const body = document.createElement('tbody');
    yearCells = [];
    for (let rowStart = first; rowStart <= last; rowStart += 3) {
      const row = document.createElement('tr');
      row.setAttribute('role', 'row');
      for (let y = rowStart; y < rowStart + 3 && y <= last; y++) {
        const cell = document.createElement('td');
        cell.setAttribute('data-year', String(y));
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', '-1');
        cell.classList.add(...monthGridCellClasses);
        yearCells.push(row.appendChild(cell));
      }
      body.appendChild(row);
    }
    yearTable.replaceChildren(body);
    yearCellsRange = [first, last];
  }

  // Whole months outside min/max cannot be picked.
  function monthOutOfBounds(year, month) {
    return isDisabled(new Date(year, month + 1, 0), minDate, undefined) || isDisabled(new Date(year, month, 1), undefined, maxDate);
  }

  // The 1st of the min/max month when `d` lies in a month before/after it, otherwise `d`.
  function clampMonth(d) {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), 1)) return new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) return new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);
    return d;
  }

  // The min/max day when `d` lies before/after it, otherwise `d`.
  function clampDay(d) {
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    return d;
  }

  function renderMonthGrid() {
    const year = date.getFullYear();
    monthGrid.render({ year, locale, selectedMonth: date.getMonth(), focusedMonth, isDisabled: (m) => monthOutOfBounds(year, m) });
  }

  function renderYearGrid() {
    const range = yearRange();
    const rebuild = !yearCellsRange || yearCellsRange[0] !== range[0] || yearCellsRange[1] !== range[1];
    const hadFocus = rebuild && yearTable.contains(focusedElement());
    if (rebuild) buildYearCells(range);
    focusedYear = Math.min(Math.max(focusedYear, range[0]), range[1]);
    const shown = date.getFullYear();
    const thisYear = new Date().getFullYear();
    const fmt = dtf(locale, { year: 'numeric' });
    for (const cell of yearCells) {
      const y = Number(cell.getAttribute('data-year'));
      cell.textContent = fmt.format(new Date(y, 0, 1));
      cell.setAttribute('tabindex', y === focusedYear ? '0' : '-1');
      if (y === shown) cell.setAttribute('aria-selected', 'true');
      else cell.removeAttribute('aria-selected');
      if (y === thisYear) cell.setAttribute('aria-current', 'date');
      else cell.removeAttribute('aria-current');
    }
    if (hadFocus) focusYearCell();
  }

  function yearTabStop() {
    return yearCells.find((cell) => cell.getAttribute('tabindex') === '0');
  }

  // Scroll the tab stop into the center of the viewbox.
  function revealYear(center) {
    const cell = yearTabStop();
    if (!cell || !yearScroller.clientHeight) return;
    const box = yearScroller.getBoundingClientRect();
    const rect = cell.getBoundingClientRect();
    if (center) yearScroller.scrollTop += rect.top - box.top - (box.height - rect.height) / 2;
    else if (rect.top < box.top) yearScroller.scrollTop += rect.top - box.top;
    else if (rect.bottom > box.bottom) yearScroller.scrollTop += rect.bottom - box.bottom;
  }

  function focusYearCell() {
    yearTabStop()?.focus({ preventScroll: true });
    revealYear(false);
  }

  // The element holding focus, looked up in the calendar's own root so a
  // calendar rendered inside a shadow tree is seen too.
  function focusedElement() {
    const root = el.getRootNode();
    return 'activeElement' in root ? root.activeElement : document.activeElement;
  }

  function measureDays() {
    const width = datesTable.offsetWidth;
    const height = datesTable.offsetHeight;
    if (!width || !height) return;
    const base = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    daySize = { width: `${width / base}rem`, height: `${height / base}rem` };
  }

  function applyDaySize(node) {
    if (!daySize) return;
    node.style.height = daySize.height;
    if (!callbacks.tableFullWidth) node.style.width = daySize.width;
  }

  function viewElement(v) {
    if (v === 'month') return monthGridBox;
    if (v === 'year') return yearScroller;
    return datesTable;
  }

  // Switches between the day table and a month/year grid. When focus sits in
  // anything being hidden, it moves to the toggle of the grid involved, or with
  // `focusDays` into the day table, as a pick does.
  function setView(next, focusDays = false) {
    if (next === view) return;
    const toggle = (next === 'day' ? view : next) === 'month' ? monthToggle : yearToggle;
    const hiding = [viewElement(view)];
    if (next === 'year') hiding.push(previousMonthBtn, nextMonthBtn);
    if (view === 'year') hiding.push(previousYearBtn, nextYearBtn);
    const active = focusedElement();
    const lostFocus = !!active && hiding.some((node) => node.contains(active));

    if (view === 'day') measureDays();
    else viewElement(view).remove();

    view = next;
    datesTable.hidden = view !== 'day';
    previousMonthBtn.hidden = nextMonthBtn.hidden = view === 'year';
    previousYearBtn.hidden = nextYearBtn.hidden = view !== 'year';
    if (view === 'month') {
      focusedMonth = date.getMonth();
      const box = ensureMonthGrid();
      applyDaySize(box);
      datesTable.after(box);
    } else if (view === 'year') {
      focusedYear = date.getFullYear();
      const scroller = ensureYearGrid();
      applyDaySize(scroller);
      datesTable.after(scroller);
    }

    render(focusDays);
    if (view === 'year') revealYear(true);
    if (lostFocus && !focusDays) toggle.focus();
  }

  // A pick keeps the same day of the month, or the closest one, as PageUp and
  // PageDown do, and moves focus onto it.
  function showPickedMonth() {
    const base = focusedDay || selected || rangeEnd || rangeStart || new Date();
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    focusedDay = new Date(date.getFullYear(), date.getMonth(), Math.min(base.getDate(), lastDay));
    setView('day', true);
  }

  function pickMonth(month) {
    date = new Date(date.getFullYear(), month, 1);
    showPickedMonth();
  }

  function pickYear(year) {
    // Keep the month inside min/max, which the year alone may not.
    date = clampMonth(new Date(year, date.getMonth(), 1));
    showPickedMonth();
  }

  function onYearClick(event) {
    if (callbacks.stopNavPropagation) event.stopPropagation();
    const cell = event.target.closest && event.target.closest('td[data-year]');
    if (cell) pickYear(Number(cell.getAttribute('data-year')));
  }

  function onMonthGridKeyDown(event) {
    const index = monthGrid.cells.indexOf(event.target);
    if (event.key === 'Enter' || event.key === ' ') {
      event.stopPropagation();
      event.preventDefault();
      if (event.target.getAttribute('aria-disabled') !== 'true') pickMonth(index);
      return;
    }
    const step = monthGridStep(index, event.key);
    if (!step) return;
    event.stopPropagation();
    event.preventDefault();
    // The month grid picks a month of the displayed year, so it never moves the year.
    if (step.yearDelta) return;
    focusedMonth = step.index;
    render();
    monthGrid.cells[step.index].focus();
  }

  function onYearGridKeyDown(event) {
    const year = Number(event.target.getAttribute('data-year'));
    if (event.key === 'Enter' || event.key === ' ') {
      event.stopPropagation();
      event.preventDefault();
      pickYear(year);
      return;
    }
    const [first, last] = yearCellsRange;
    const steps = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3, PageUp: -12, PageDown: 12 };
    let next;
    if (event.key === 'Home') next = first;
    else if (event.key === 'End') next = last;
    else if (Object.prototype.hasOwnProperty.call(steps, event.key)) next = year + steps[event.key];
    else return;
    event.stopPropagation();
    event.preventDefault();
    focusedYear = Math.min(Math.max(next, first), last);
    render();
    focusYearCell();
  }

  // Popover hosts wrap Tab between the header and the grid while one shows,
  // since focus has nowhere else to go in them. The stops in between follow the
  // natural order: previous, the toggles, next, the grid.
  function cycleSelectionTab(event) {
    const container = viewElement(view);
    const first = view === 'month' ? previousMonthBtn : previousYearBtn;
    if (!event.shiftKey && container.contains(event.target)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && event.target === first) {
      event.preventDefault();
      if (view === 'month') monthGrid.cells[focusedMonth].focus();
      else focusYearCell();
    }
  }

  // --- Core rendering ---

  // Commit a day selection. `triggerInput` is forwarded to onSelectionChanged on a
  // complete selection (clicks pass true so a datepicker closes; keyboard passes
  // false so it stays open). A partial range pick never triggers it.
  function selectDay(d, triggerInput) {
    if (!rangeMode) {
      // Re-selecting the selected day deselects it and clears the value.
      if (selected && sameDay(selected, d)) {
        selected = undefined;
      } else {
        selected = new Date(d);
      }
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
    focusedDay = new Date(event.target.getAttribute('data-year'), event.target.getAttribute('data-month'), event.target.getAttribute('data-day'));
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

    // With the focused day in another month the grid would have no tab stop at
    // all, so the selection, today or the 1st takes it, and arrows start there.
    if (view === 'day' && !dayCells.some((cell) => cell.getAttribute('tabindex') === '0')) {
      const inView = (d) => d && d.getFullYear() === year && d.getMonth() === month;
      let stop = [selected, rangeEnd, rangeStart, new Date()].find(inView) || start;
      if (inView(clampDay(stop))) stop = clampDay(stop);
      focusedDay = new Date(year, month, stop.getDate());
      dayCells[startDay + stop.getDate() - 1].setAttribute('tabindex', '0');
    }

    renderNavButtons();
    renderViewToggles();
    if (view === 'month') renderMonthGrid();
    else if (view === 'year') renderYearGrid();
  }

  function renderNavButtons() {
    const steps = [
      [previousMonthBtn, monthStepBlocked(-1)],
      [nextMonthBtn, monthStepBlocked(1)],
      [previousYearBtn, yearStepBlocked(-1)],
      [nextYearBtn, yearStepBlocked(1)],
    ];
    // aria-disabled at a min/max limit keeps a focused button focused. It still
    // takes the click, so the handler stops it before it can close a popover.
    for (const [btn, blocked] of steps) {
      if (blocked) btn.setAttribute('aria-disabled', 'true');
      else btn.removeAttribute('aria-disabled');
    }
  }

  function renderViewToggles() {
    const monthText = dtf(locale, { month: 'long' }).format(date);
    const yearText = dtf(locale, { year: 'numeric' }).format(date);
    monthToggle.textContent = monthText;
    yearToggle.textContent = yearText;
    // The visible text leads the name, the purpose follows it.
    monthToggle.setAttribute('aria-label', `${monthText}, ${chooseMonthLabel}`);
    yearToggle.setAttribute('aria-label', `${yearText}, ${chooseYearLabel}`);
    monthToggle.setAttribute('aria-pressed', String(view === 'month'));
    yearToggle.setAttribute('aria-pressed', String(view === 'year'));
    // Year-first locales (ja, zh, hu) read the pair in their own order.
    const parts = dtf(locale, { month: 'long', year: 'numeric' }).formatToParts(date);
    const yearFirst = parts.findIndex((p) => p.type === 'year') < parts.findIndex((p) => p.type === 'month');
    const first = yearFirst ? yearToggle : monthToggle;
    if (viewToggles.firstElementChild !== first) viewToggles.prepend(first);
  }

  function focusDay() {
    // A popover closed while a month/year grid showed reopens on its days.
    setView('day');
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
    // A month holding neither, such as the nearest one inside min/max.
    dayCells.find((cell) => cell.getAttribute('tabindex') === '0')?.focus();
  }

  function onKeyDown(event) {
    // Escape works anywhere in the calendar (e.g. to close a datepicker popover).
    // A month/year grid closes first, back to the day table.
    if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      if (view !== 'day') setView('day');
      else callbacks.onEscape();
      return;
    }

    if (view !== 'day') {
      if (event.key === 'Tab' && callbacks.cycleSelectionTab) cycleSelectionTab(event);
      else if (view === 'month' && monthGrid.cells.includes(event.target)) onMonthGridKeyDown(event);
      else if (view === 'year' && event.target.hasAttribute('data-year') && yearTable.contains(event.target)) onYearGridKeyDown(event);
      return;
    }

    // Day navigation and selection only apply when a day cell has focus; the
    // header nav buttons keep their native Enter/Space/arrow behavior.
    if (!dayCells.includes(event.target)) return;
    // Tab bubbles on, so the focus trap of a popover host sees it.
    if (event.key === 'Tab') return;
    event.stopPropagation();

    // Base navigation on the cell that actually holds focus (today's cell gets
    // the initial tabindex stop), not the 1st of the month, or the first arrow
    // press teleports focus. Adjacent-month cells carry no data-day and are
    // click-focusable despite tabindex -1, hence the fallback chain.
    if (!focusedDay) {
      focusedDay = event.target.hasAttribute('data-day')
        ? new Date(event.target.getAttribute('data-year'), event.target.getAttribute('data-month'), event.target.getAttribute('data-day'))
        : selected || rangeEnd || rangeStart || new Date(date.getFullYear(), date.getMonth(), 1);
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isDisabledInternal(focusedDay)) {
        selectDay(focusedDay, false);
        render(true);
      }
      return;
    }

    const step = nextFocusDate(focusedDay, event.key);
    if (!step) return;
    event.preventDefault();
    // Focus stops at the min/max days, like the month buttons at their months.
    const newDay = clampDay(step);

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
    locale = resolveLocale(config.locale);
    if (config.delimiter !== undefined) delimiter = config.delimiter;
    if (config.order !== undefined) dateOrder = config.order;
    if (config.firstDay) firstDay = config.firstDay;
    dateFormatter = createDateFormatter({ locale, options: config.options, delimiter, order: dateOrder, rangeSeparator });
    // Each call carries the whole config, so a bound left out is cleared.
    minDate = parseBound(config.min);
    maxDate = parseBound(config.max);
    setWeekdayHeaders();
    checkForModel();
    // Without a value the calendar shows the nearest month inside min/max.
    if (!hasModelValue()) date = clampMonth(date);
    render();
  }

  function clearSelected() {
    selected = undefined;
    rangeStart = undefined;
    rangeEnd = undefined;
    render();
  }

  // Clears the selection AND writes the empty value to the model, unlike
  // clearSelected, which only follows a model that is already empty.
  function clearSelectedAndSync() {
    selected = undefined;
    rangeStart = undefined;
    rangeEnd = undefined;
    render();
    modelChange(false);
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

  // The display format as a typing hint, twice in range mode, or `undefined` without a pattern.
  function getPlaceholder() {
    const hint = dateFormatter.placeholder;
    return hint && rangeMode ? `${hint}${rangeSeparator}${hint}` : hint;
  }

  return {
    render,
    focusDay,
    setConfig,
    checkForModel,
    clearSelected,
    clearSelectedAndSync,
    setSelectedAndSync,
    applyModel,
    formatSelectedDate,
    parseDisplayValue,
    getPlaceholder,
    isSameDay: (a, b) => sameDay(a, b),
    isRange: () => rangeMode,
    getSelected: () => (rangeMode ? { start: rangeStart, end: rangeEnd } : selected),
    cleanup() {
      el.removeEventListener('keydown', onKeyDown);
      for (let d = 0; d < dayCells.length; d++) {
        dayCells[d].removeEventListener('click', dayClick);
      }
      previousYearBtn.removeEventListener('click', onPreviousYear);
      previousMonthBtn.removeEventListener('click', onPreviousMonth);
      nextMonthBtn.removeEventListener('click', onNextMonth);
      nextYearBtn.removeEventListener('click', onNextYear);
      monthToggle.removeEventListener('click', onMonthToggle);
      yearToggle.removeEventListener('click', onYearToggle);
      monthGrid?.destroy();
      yearScroller?.removeEventListener('click', onYearClick);
      callbacks.Alpine.destroyTree(header);
    },
  };
}
