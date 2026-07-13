import { findAncestorState } from '../common/ancestor';
import { isoWeekParts, mondayOfIsoWeek } from '../common/calendar';
import { ChevronLeft, ChevronRight, createSvg } from '../common/icons';
import { sizeObserver } from '../common/input-size';
import { createDateTimeFormatCache } from '../common/intl';
import { setupPopover, setupTrigger } from '../common/picker-popover';
import { pad2 } from '../common/time';
import uuidv4 from '../utils/uuid';

// Week Picker. Reads and writes a single ISO week string `YYYY-Www`
// (e.g. "2025-W23"), matching the value format of a native `<input type="week">`.
// The popup is a month calendar whose rows are whole ISO weeks (Monday-first);
// hovering highlights a week, clicking or Enter/Space selects it.

const WEEK_RE = /^(\d{4})-W(\d{2})$/;

function resolveLocale(config) {
  if (config && config.locale) return config.locale;
  return (typeof navigator !== 'undefined' && navigator.language) || 'en';
}

function sameWeek(a, b) {
  return !!(a && b && a.year === b.year && a.week === b.week);
}

// A `{ year, week }` pair only when the week actually exists in that
// ISO week-numbering year (e.g. rejects week 53 of a 52-week year).
function validWeekParts(year, week) {
  const parts = isoWeekParts(mondayOfIsoWeek(year, week));
  return parts.year === year && parts.week === week ? { year, week } : null;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// The wrapper + input frame shared with the date picker (kept in sync with it).
function applyFrameClasses(el, input, inTable) {
  el.classList.add(
    'overflow-hidden',
    'border-input',
    'flex',
    'items-center',
    'transition-[color,box-shadow]',
    'motion-reduce:transition-none',
    'duration-200',
    'outline-none',
    'pl-3',
    'min-w-0',
    'has-[input:disabled]:pointer-events-none',
    'has-[input:disabled]:cursor-not-allowed',
    'has-[input:disabled]:opacity-disabled',
    'has-[input[readonly]]:bg-muted'
  );
  if (inTable) {
    el.classList.add(
      'size-full',
      'h-10',
      'has-[input:focus-visible]:inset-ring-ring/50',
      'has-[input:focus-visible]:inset-ring-[calc(var(--spacing)*0.75)]',
      'has-[input[aria-invalid=true]]:inset-ring-negative/20',
      'dark:has-[input[aria-invalid=true]]:inset-ring-negative/40',
      'has-[input:user-invalid]:inset-ring-negative/20!',
      'dark:has-[input:user-invalid]:inset-ring-negative/40!',
      '[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/20!',
      'dark:[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/40!'
    );
    el.setAttribute('data-slot', 'cell-input-week');
  } else {
    el.classList.add(
      'w-full',
      'rounded-control',
      'border',
      'bg-input-inner',
      'shadow-input',
      'has-[input:focus-visible]:border-ring',
      'has-[input:focus-visible]:ring-ring/50',
      'has-[input:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
      'has-[input[aria-invalid=true]]:ring-negative/20',
      'has-[input[aria-invalid=true]]:border-negative',
      'dark:has-[input[aria-invalid=true]]:ring-negative/40',
      'has-[input:user-invalid]:ring-negative/20',
      'has-[input:user-invalid]:border-negative',
      'dark:has-[input:user-invalid]:ring-negative/40',
      '[[data-validate=immediate]_&:has(input:invalid)]:ring-negative/20',
      '[[data-validate=immediate]_&:has(input:invalid)]:border-negative',
      'dark:[[data-validate=immediate]_&:has(input:invalid)]:ring-negative/40'
    );
    el.setAttribute('data-slot', 'week-picker');
  }
  input.classList.add(
    'bg-transparent',
    'outline-none',
    'size-full',
    'pr-1',
    'border-input',
    'aria-invalid:border-negative',
    'user-invalid:border-negative',
    '[[data-validate=immediate]_&:invalid]:border-negative',
    'focus-visible:ring-0',
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-disabled',
    'md:text-sm',
    'text-base',
    'truncate'
  );
  if (inTable) {
    // The input-to-trigger divider shows only when the table has horizontal borders.
    input.classList.add('min-w-0', '[table[data-borders=rows]_&]:border-r', '[table[data-borders=both]_&]:border-r');
  } else {
    input.classList.add('border-r');
  }
  input.setAttribute('aria-autocomplete', 'none');
  input.setAttribute('type', 'text');
}

export default function (Alpine) {
  Alpine.directive('h-week-picker', (el, { original, modifiers }, { Alpine, cleanup }) => {
    const state = Alpine.reactive({ expanded: false });
    el._h_weekpicker = {
      id: undefined,
      controls: `hwpc${uuidv4()}`,
      input: undefined,
      state,
      inTable: modifiers.includes('table'),
    };

    el._h_weekpicker.input = el.querySelector('input');
    if (!el._h_weekpicker.input || el._h_weekpicker.input.tagName !== 'INPUT') {
      throw new Error(`${original} must contain an input`);
    } else if (el._h_weekpicker.input.hasAttribute('id')) {
      el._h_weekpicker.id = el._h_weekpicker.input.getAttribute('id');
    } else {
      const id = `hwp${uuidv4()}`;
      el._h_weekpicker.input.setAttribute('id', id);
      el._h_weekpicker.id = id;
    }

    applyFrameClasses(el, el._h_weekpicker.input, el._h_weekpicker.inTable);

    const observer = sizeObserver(el);
    cleanup(() => observer.disconnect());
  });

  Alpine.directive('h-week-picker-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    const picker = findAncestorState(Alpine, el, '_h_weekpicker');
    if (!picker) {
      throw new Error(`${original} must be inside an x-h-week-picker element`);
    }
    setupTrigger(el, {
      pickerState: picker._h_weekpicker,
      Alpine,
      effect,
      cleanup,
      original,
      slot: 'week-picker-trigger',
    });
  });

  Alpine.directive('h-week-picker-popup', (el, { original, expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    const picker = findAncestorState(Alpine, el, '_h_weekpicker');
    if (!picker) {
      console.warn(`${original}: must be used inside an x-h-week-picker element`);
      return;
    }

    const { input } = picker._h_weekpicker;
    const dtf = createDateTimeFormatCache();
    const weekLabel = el.getAttribute('data-week-label') || 'Week';
    const weekColumnLabel = el.getAttribute('data-week-column-label') || 'Week number';
    const displayRe = new RegExp(`^${escapeRegExp(weekLabel)}\\s+(\\d{1,2}),\\s*(\\d{4})$`, 'i');

    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'week-picker-calendar');

    let locale = resolveLocale();
    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();
    let selected = null; // { year, week }
    let focusedMonday = null; // Date (always a Monday), the roving-tabindex target

    // Header: previous-month / month-year label / next-month.
    const header = document.createElement('div');
    header.classList.add('flex', 'items-center', 'justify-between', 'gap-2');

    // The nav buttons reuse the button component (transparent icon variant);
    // the header subtree is initialized as a whole after it is appended.
    function applyNavButtonDirective(btn) {
      btn.setAttribute(Alpine.prefixed('h-button'), '');
      btn.setAttribute('data-variant', 'transparent');
      btn.setAttribute('data-size', 'icon');
    }

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    applyNavButtonDirective(prevBtn);
    prevBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-month') ? el.getAttribute('data-aria-prev-month') : 'previous month');
    prevBtn.appendChild(createSvg({ icon: ChevronLeft, classes: 'size-4', attrs: { 'aria-hidden': true, role: 'presentation' } }));

    const monthLabel = document.createElement('h2');
    monthLabel.classList.add('text-base');
    monthLabel.setAttribute('id', `hwpl${uuidv4()}`);
    monthLabel.setAttribute('aria-live', 'polite');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    applyNavButtonDirective(nextBtn);
    nextBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-month') ? el.getAttribute('data-aria-next-month') : 'next month');
    nextBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'size-4', attrs: { 'aria-hidden': true, role: 'presentation' } }));

    header.append(prevBtn, monthLabel, nextBtn);

    // Grid: a weekday header row plus six selectable whole-week rows, built as
    // a table like the other picker calendars. Backgrounds, radii and rings do
    // not render on tr, so the row hover/selected/focus highlight is painted on
    // the cells via group-* variants; with zero horizontal spacing the cell
    // backgrounds form one continuous bar, rounded at the row's outer edges.
    const table = document.createElement('table');
    table.classList.add('border-separate', 'border-spacing-x-0', 'border-spacing-y-1');
    table.setAttribute('role', 'grid');
    table.setAttribute('aria-labelledby', monthLabel.getAttribute('id'));

    const thead = document.createElement('thead');
    const weekdaysRow = document.createElement('tr');
    weekdaysRow.classList.add('text-sm', 'text-muted-foreground');
    weekdaysRow.setAttribute('role', 'row');
    thead.appendChild(weekdaysRow);

    const tbody = document.createElement('tbody');

    const rowCellClasses = [
      'size-9',
      'text-center',
      'align-middle',
      'tabular-nums',
      'first:rounded-l-control',
      'last:rounded-r-control',
      'group-hover:bg-secondary',
      'group-focus-visible:bg-secondary-hover',
      'group-aria-selected:bg-primary-active!',
      'group-hover:group-aria-selected:bg-primary-hover!',
    ];

    const weekRows = [];
    for (let w = 0; w < 6; w++) {
      const row = document.createElement('tr');
      row.classList.add('group', 'cursor-pointer', 'outline-none');
      row.setAttribute('role', 'row');
      row.setAttribute('tabindex', '-1');
      row.addEventListener('click', rowClick);

      const weekNo = document.createElement('th');
      weekNo.classList.add(...rowCellClasses, 'text-xs', 'font-normal', 'text-muted-foreground', '[[aria-selected=true]>&]:text-primary-foreground/80');
      weekNo.setAttribute('scope', 'row');
      weekNo.setAttribute('role', 'rowheader');
      row.appendChild(weekNo);

      for (let d = 0; d < 7; d++) {
        const cell = document.createElement('td');
        cell.classList.add(...rowCellClasses, 'text-sm', 'group-hover:text-secondary-foreground', 'group-aria-selected:text-primary-foreground!');
        cell.setAttribute('role', 'gridcell');
        row.appendChild(cell);
      }
      tbody.appendChild(row);
      weekRows.push(row);
    }

    table.append(thead, tbody);
    el.append(header, table);
    Alpine.initTree(header);

    function displayValue() {
      return selected ? `${weekLabel} ${selected.week}, ${selected.year}` : '';
    }

    function renderHeader() {
      monthLabel.textContent = dtf(locale, { month: 'long', year: 'numeric' }).format(new Date(viewYear, viewMonth, 1));
    }

    function renderWeekdays() {
      weekdaysRow.replaceChildren();
      const corner = document.createElement('th');
      corner.classList.add('size-9', 'text-center', 'align-middle', 'font-normal');
      corner.setAttribute('scope', 'col');
      corner.setAttribute('role', 'columnheader');
      corner.setAttribute('aria-label', weekColumnLabel);
      corner.textContent = '#';
      weekdaysRow.appendChild(corner);
      const shortFmt = dtf(locale, { weekday: 'short' });
      const longFmt = dtf(locale, { weekday: 'long' });
      for (let i = 0; i < 7; i++) {
        // 2020-06-01 is a Monday.
        const day = new Date(2020, 5, 1 + i);
        const cell = document.createElement('th');
        cell.classList.add('size-9', 'text-center', 'align-middle', 'font-normal');
        cell.setAttribute('scope', 'col');
        cell.setAttribute('role', 'columnheader');
        cell.setAttribute('abbr', shortFmt.format(day));
        cell.setAttribute('aria-label', longFmt.format(day));
        cell.textContent = shortFmt.format(day);
        weekdaysRow.appendChild(cell);
      }
    }

    function renderGrid() {
      // First Monday on or before the 1st of the visible month.
      const first = new Date(viewYear, viewMonth, 1);
      const firstDayNum = (first.getDay() + 6) % 7; // Monday = 0
      const cursor = new Date(first);
      cursor.setDate(first.getDate() - firstDayNum);

      const todayParts = isoWeekParts(new Date());
      const focusedParts = focusedMonday ? isoWeekParts(focusedMonday) : null;
      const rowParts = [];

      for (let w = 0; w < 6; w++) {
        const weekParts = isoWeekParts(cursor);
        rowParts.push(weekParts);
        const row = weekRows[w];
        row.dataset.year = String(weekParts.year);
        row.dataset.week = String(weekParts.week);
        row.setAttribute('aria-label', `${weekLabel} ${weekParts.week}, ${weekParts.year}`);
        if (sameWeek(weekParts, selected)) {
          row.setAttribute('aria-selected', 'true');
        } else {
          row.removeAttribute('aria-selected');
        }
        if (sameWeek(weekParts, todayParts)) {
          row.setAttribute('aria-current', 'date');
        } else {
          row.removeAttribute('aria-current');
        }

        row.firstChild.textContent = String(weekParts.week);
        for (let d = 1; d <= 7; d++) {
          const cell = row.children[d];
          cell.classList.toggle('text-muted-foreground/60', cursor.getMonth() !== viewMonth);
          cell.textContent = String(cursor.getDate());
          cursor.setDate(cursor.getDate() + 1);
        }
      }

      // Roving tabindex: the focused week, else the selection, else the current
      // week when visible, else the first row.
      let target = rowParts.findIndex((p) => sameWeek(p, focusedParts));
      if (target === -1) target = rowParts.findIndex((p) => sameWeek(p, selected));
      if (target === -1) target = rowParts.findIndex((p) => sameWeek(p, todayParts));
      if (target === -1) target = 0;
      for (let w = 0; w < 6; w++) {
        weekRows[w].setAttribute('tabindex', w === target ? '0' : '-1');
      }
    }

    function render() {
      renderHeader();
      renderWeekdays();
      renderGrid();
    }

    function syncModel(triggerInput) {
      input.value = displayValue();
      input.setCustomValidity('');
      if (el._x_model) {
        el._x_model.set(selected ? `${selected.year}-W${pad2(selected.week)}` : '');
      }
      if (triggerInput) {
        input.dispatchEvent(new Event('change', { bubbles: true }));
        picker._h_weekpicker.state.expanded = false;
      }
    }

    function selectWeek(weekParts) {
      selected = weekParts;
      focusedMonday = mondayOfIsoWeek(weekParts.year, weekParts.week);
      renderGrid();
      syncModel(true);
    }

    function rowClick(event) {
      const row = event.currentTarget;
      selectWeek({ year: Number(row.dataset.year), week: Number(row.dataset.week) });
    }

    function focusView(year, week) {
      const monday = mondayOfIsoWeek(year, week);
      viewYear = monday.getFullYear();
      viewMonth = monday.getMonth();
    }

    function applyModel(value) {
      if (!value) {
        selected = null;
      } else {
        const match = typeof value === 'string' && value.match(WEEK_RE);
        const parsed = match && validWeekParts(Number(match[1]), Number(match[2]));
        if (!parsed) {
          console.error(`${original}: model value is not a valid ISO week - ${value}`);
          input.setCustomValidity('Input value is not a valid week.');
          return;
        }
        selected = parsed;
        focusView(selected.year, selected.week);
      }
      input.setCustomValidity('');
      render();
      input.value = displayValue();
    }

    function prevMonthClick(event) {
      event.stopPropagation();
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      renderHeader();
      renderGrid();
    }
    function nextMonthClick(event) {
      event.stopPropagation();
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      renderHeader();
      renderGrid();
    }
    prevBtn.addEventListener('click', prevMonthClick);
    nextBtn.addEventListener('click', nextMonthClick);

    // Focus the given Monday's week row, moving the visible month when the week
    // is not among the six rendered rows.
    function focusWeekRow(monday) {
      focusedMonday = monday;
      const parts = isoWeekParts(monday);
      let row = weekRows.find((r) => Number(r.dataset.year) === parts.year && Number(r.dataset.week) === parts.week);
      if (!row) {
        viewYear = monday.getFullYear();
        viewMonth = monday.getMonth();
        renderHeader();
        renderGrid();
        row = weekRows.find((r) => Number(r.dataset.year) === parts.year && Number(r.dataset.week) === parts.week);
      } else {
        renderGrid();
      }
      if (row) row.focus();
    }

    function onKeyDown(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.stopPropagation();
        event.preventDefault();
        picker._h_weekpicker.state.expanded = false;
        return;
      }
      const row = event.target;
      if (!weekRows.includes(row)) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.stopPropagation();
        event.preventDefault();
        selectWeek({ year: Number(row.dataset.year), week: Number(row.dataset.week) });
        return;
      }
      const monday = mondayOfIsoWeek(Number(row.dataset.year), Number(row.dataset.week));
      const next = new Date(monday);
      switch (event.key) {
        case 'ArrowUp':
          next.setDate(next.getDate() - 7);
          break;
        case 'ArrowDown':
          next.setDate(next.getDate() + 7);
          break;
        case 'PageUp':
          next.setMonth(next.getMonth() - 1);
          break;
        case 'PageDown':
          next.setMonth(next.getMonth() + 1);
          break;
        case 'Home':
          next.setTime(mondayOfIsoWeek(Number(weekRows[0].dataset.year), Number(weekRows[0].dataset.week)).getTime());
          break;
        case 'End':
          next.setTime(mondayOfIsoWeek(Number(weekRows[5].dataset.year), Number(weekRows[5].dataset.week)).getTime());
          break;
        default:
          return;
      }
      event.stopPropagation();
      event.preventDefault();
      const parts = isoWeekParts(next);
      focusWeekRow(mondayOfIsoWeek(parts.year, parts.week));
    }
    el.addEventListener('keydown', onKeyDown);

    const onInputChange = (event) => {
      if (event && !event.isTrusted) return;
      const raw = input.value.trim();
      if (raw === '') {
        selected = null;
        syncModel(false);
        return;
      }
      // Accept the model format (`2025-W24`) and the display format (`Week 24, 2025`).
      let match = raw.match(WEEK_RE);
      let parsed = match && validWeekParts(Number(match[1]), Number(match[2]));
      if (!parsed && (match = raw.match(displayRe))) {
        parsed = validWeekParts(Number(match[2]), Number(match[1]));
      }
      if (!parsed) {
        console.error(`${original}: input value is not a valid ISO week - ${input.value}`);
        input.setCustomValidity('Input value is not a valid week.');
        return;
      }
      selected = parsed;
      focusView(selected.year, selected.week);
      renderHeader();
      renderGrid();
      syncModel(false);
    };
    input.addEventListener('change', onInputChange);

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() => {
        getConfig((config) => {
          locale = resolveLocale(config);
          render();
          input.value = displayValue();
        });
      });
    } else {
      render();
    }

    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      const evaluateModel = evaluateLater(el.getAttribute('x-model'));
      effect(() => {
        evaluateModel((value) => applyModel(value));
      });
    }

    setupPopover(el, {
      anchor: picker,
      pickerState: picker._h_weekpicker,
      Alpine,
      effect,
      cleanup,
      onOpen: () => {
        focusedMonday = null;
        renderGrid();
        const target = weekRows.find((row) => row.getAttribute('tabindex') === '0');
        if (target) target.focus();
      },
    });

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      prevBtn.removeEventListener('click', prevMonthClick);
      nextBtn.removeEventListener('click', nextMonthClick);
      for (const row of weekRows) row.removeEventListener('click', rowClick);
      input.removeEventListener('change', onInputChange);
      Alpine.destroyTree(header);
    });
  });
}
