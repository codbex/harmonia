import { findAncestorState } from '../common/ancestor';
import { ChevronRight, createSvg } from '../common/icons';
import { sizeObserver } from '../common/input-size';
import { setupPopover, setupTrigger } from '../common/picker-popover';
import uuidv4 from '../utils/uuid';

// Week Picker. Reads and writes a single ISO week string `YYYY-Www`
// (e.g. "2025-W23"), matching the value format of a native `<input type="week">`.
// The popup is a month calendar whose rows are whole ISO weeks (Monday-first);
// hovering highlights a week, clicking selects it.

const WEEK_RE = /^(\d{4})-W(\d{2})$/;

function resolveLocale(config) {
  if (config && config.locale) return config.locale;
  return (typeof navigator !== 'undefined' && navigator.language) || 'en';
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

// ISO 8601 week number + week-numbering year for a local date.
function isoWeekParts(date) {
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
function mondayOfIsoWeek(year, week) {
  const jan4 = new Date(year, 0, 4);
  const jan4DayNum = (jan4.getDay() + 6) % 7;
  const week1Monday = new Date(jan4);
  week1Monday.setDate(jan4.getDate() - jan4DayNum);
  const monday = new Date(week1Monday);
  monday.setDate(week1Monday.getDate() + (week - 1) * 7);
  return monday;
}

function sameWeek(a, b) {
  return a && b && a.year === b.year && a.week === b.week;
}

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
    el.classList.add('size-full', 'h-10');
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
      'dark:has-[input[aria-invalid=true]]:ring-negative/40'
    );
    el.setAttribute('data-slot', 'week-picker');
  }
  input.classList.add(
    'bg-transparent',
    'outline-none',
    'size-full',
    'pr-1',
    'border-r',
    'border-input',
    'aria-invalid:border-negative',
    'focus-visible:ring-0',
    'disabled:pointer-events-none',
    'disabled:cursor-not-allowed',
    'disabled:opacity-disabled',
    'md:text-sm',
    'text-base',
    'truncate'
  );
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

    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'week-picker-calendar');

    let locale = resolveLocale();
    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();
    let selected = null; // { year, week }

    // Header: previous-month / month-year label / next-month.
    const header = document.createElement('div');
    header.classList.add('flex', 'items-center', 'justify-between', 'gap-1', 'px-1', 'pb-1');

    const navButtonClasses = [
      'inline-flex',
      'items-center',
      'justify-center',
      'size-7',
      'rounded-control',
      'bg-transparent',
      'hover:bg-secondary',
      'hover:text-secondary-foreground',
      'outline-none',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-2',
      'cursor-pointer',
    ];

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.classList.add(...navButtonClasses);
    prevBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-month') ? el.getAttribute('data-aria-prev-month') : 'previous month');
    prevBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'size-4 rotate-180', attrs: { 'aria-hidden': true } }));

    const monthLabel = document.createElement('span');
    monthLabel.classList.add('text-sm', 'font-medium');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.classList.add(...navButtonClasses);
    nextBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-month') ? el.getAttribute('data-aria-next-month') : 'next month');
    nextBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'size-4', attrs: { 'aria-hidden': true } }));

    header.append(prevBtn, monthLabel, nextBtn);

    // Weekday header row: a leading week-number spacer then Mon..Sun.
    const weekdaysRow = document.createElement('div');
    weekdaysRow.classList.add('grid', 'gap-1', 'mb-1', 'text-xs', 'text-muted-foreground');
    weekdaysRow.style.gridTemplateColumns = 'auto repeat(7, minmax(0, 1fr))';

    const body = document.createElement('div');
    body.classList.add('flex', 'flex-col', 'gap-1');

    el.append(header, weekdaysRow, body);

    function weekdayNames() {
      const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
      // 2020-06-01 is a Monday.
      return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2020, 5, 1 + i)));
    }

    function displayValue() {
      return selected ? `Week ${selected.week}, ${selected.year}` : '';
    }

    function renderHeader() {
      monthLabel.textContent = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(viewYear, viewMonth, 1));
    }

    function renderWeekdays() {
      weekdaysRow.replaceChildren();
      const corner = document.createElement('span');
      corner.classList.add('flex', 'items-center', 'justify-center', 'size-9', 'font-normal');
      corner.textContent = '#';
      weekdaysRow.appendChild(corner);
      for (const name of weekdayNames()) {
        const cell = document.createElement('span');
        cell.classList.add('flex', 'items-center', 'justify-center', 'size-9');
        cell.textContent = name;
        weekdaysRow.appendChild(cell);
      }
    }

    function renderGrid() {
      body.replaceChildren();
      // First Monday on or before the 1st of the visible month.
      const first = new Date(viewYear, viewMonth, 1);
      const firstDayNum = (first.getDay() + 6) % 7; // Monday = 0
      const cursor = new Date(first);
      cursor.setDate(first.getDate() - firstDayNum);

      for (let w = 0; w < 6; w++) {
        const weekParts = isoWeekParts(cursor);
        const row = document.createElement('div');
        row.classList.add('grid', 'gap-1', 'rounded-control', 'cursor-pointer', 'hover:bg-secondary', 'aria-selected:bg-primary-active!', 'aria-selected:text-primary-foreground!', 'aria-selected:hover:bg-primary-hover!');
        row.style.gridTemplateColumns = 'auto repeat(7, minmax(0, 1fr))';
        row.setAttribute('role', 'row');
        if (sameWeek(weekParts, selected)) row.setAttribute('aria-selected', 'true');

        const captured = { year: weekParts.year, week: weekParts.week };
        row.addEventListener('click', () => selectWeek(captured));

        const weekNo = document.createElement('span');
        weekNo.classList.add('flex', 'items-center', 'justify-center', 'size-9', 'text-xs', 'text-muted-foreground', 'tabular-nums');
        weekNo.textContent = String(weekParts.week);
        row.appendChild(weekNo);

        for (let d = 0; d < 7; d++) {
          const day = new Date(cursor);
          const cell = document.createElement('span');
          cell.classList.add('flex', 'items-center', 'justify-center', 'size-9', 'text-sm', 'tabular-nums');
          if (day.getMonth() !== viewMonth) cell.classList.add('text-muted-foreground/60');
          cell.textContent = String(day.getDate());
          row.appendChild(cell);
          cursor.setDate(cursor.getDate() + 1);
        }
        body.appendChild(row);
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
      render();
      syncModel(true);
    }

    function focusView(year, week) {
      const monday = mondayOfIsoWeek(year, week);
      viewYear = monday.getFullYear();
      viewMonth = monday.getMonth();
    }

    function applyModel(value) {
      const match = typeof value === 'string' && value.match(WEEK_RE);
      if (match) {
        selected = { year: Number(match[1]), week: Number(match[2]) };
        focusView(selected.year, selected.week);
      } else if (!value) {
        selected = null;
      }
      render();
      input.value = displayValue();
    }

    prevBtn.addEventListener('click', () => {
      viewMonth -= 1;
      if (viewMonth < 0) {
        viewMonth = 11;
        viewYear -= 1;
      }
      render();
    });
    nextBtn.addEventListener('click', () => {
      viewMonth += 1;
      if (viewMonth > 11) {
        viewMonth = 0;
        viewYear += 1;
      }
      render();
    });

    const onInputChange = (event) => {
      if (event && !event.isTrusted) return;
      const raw = input.value.trim();
      if (raw === '') {
        selected = null;
        syncModel(false);
        return;
      }
      const match = raw.match(WEEK_RE);
      if (!match) {
        console.error(`${original}: input value is not a valid ISO week - ${input.value}`);
        input.setCustomValidity('Input value is not a valid week.');
        return;
      }
      selected = { year: Number(match[1]), week: Number(match[2]) };
      focusView(selected.year, selected.week);
      render();
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
      onOpen: () => el.focus(),
    });

    cleanup(() => {
      input.removeEventListener('change', onInputChange);
    });
  });
}
