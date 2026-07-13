import { findAncestorState } from '../common/ancestor';
import { ChevronLeft, ChevronRight, createSvg } from '../common/icons';
import { sizeObserver } from '../common/input-size';
import { createDateTimeFormatCache } from '../common/intl';
import { setupPopover, setupTrigger } from '../common/picker-popover';
import { pad2 } from '../common/time';
import uuidv4 from '../utils/uuid';

// Month Picker. Reads and writes a single `YYYY-MM` string (e.g. "2025-06"),
// matching the value format of a native `<input type="month">`. The text input
// shows a localized display (e.g. "June 2025"); selection is done from a popup
// of a year header plus a twelve-month grid.

const MONTH_RE = /^(\d{4})-(\d{2})$/;

function resolveLocale(config) {
  if (config && config.locale) return config.locale;
  return (typeof navigator !== 'undefined' && navigator.language) || 'en';
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
    el.setAttribute('data-slot', 'cell-input-month');
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
    el.setAttribute('data-slot', 'month-picker');
  }
  input.classList.add(
    'bg-transparent',
    'outline-none',
    'size-full',
    'pr-1',
    'border-r',
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
  input.setAttribute('aria-autocomplete', 'none');
  input.setAttribute('type', 'text');
}

export default function (Alpine) {
  Alpine.directive('h-month-picker', (el, { original, modifiers }, { Alpine, cleanup }) => {
    const state = Alpine.reactive({ expanded: false });
    el._h_monthpicker = {
      id: undefined,
      controls: `hmpc${uuidv4()}`,
      input: undefined,
      state,
      inTable: modifiers.includes('table'),
    };

    el._h_monthpicker.input = el.querySelector('input');
    if (!el._h_monthpicker.input || el._h_monthpicker.input.tagName !== 'INPUT') {
      throw new Error(`${original} must contain an input`);
    } else if (el._h_monthpicker.input.hasAttribute('id')) {
      el._h_monthpicker.id = el._h_monthpicker.input.getAttribute('id');
    } else {
      const id = `hmp${uuidv4()}`;
      el._h_monthpicker.input.setAttribute('id', id);
      el._h_monthpicker.id = id;
    }

    applyFrameClasses(el, el._h_monthpicker.input, el._h_monthpicker.inTable);

    const observer = sizeObserver(el);
    cleanup(() => observer.disconnect());
  });

  Alpine.directive('h-month-picker-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    const picker = findAncestorState(Alpine, el, '_h_monthpicker');
    if (!picker) {
      throw new Error(`${original} must be inside an x-h-month-picker element`);
    }
    setupTrigger(el, {
      pickerState: picker._h_monthpicker,
      Alpine,
      effect,
      cleanup,
      original,
      slot: 'month-picker-trigger',
    });
  });

  Alpine.directive('h-month-picker-popup', (el, { original, expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    const picker = findAncestorState(Alpine, el, '_h_monthpicker');
    if (!picker) {
      console.warn(`${original}: must be used inside an x-h-month-picker element`);
      return;
    }

    const { input } = picker._h_monthpicker;
    const dtf = createDateTimeFormatCache();

    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'month-picker-calendar');

    let locale = resolveLocale();
    let viewYear = new Date().getFullYear();
    let selected = null; // { year, month } with month in 1..12
    let focusedMonth = null; // 0..11, the roving-tabindex target within viewYear

    // Header: previous-year / year label / next-year.
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
    prevBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-year') ? el.getAttribute('data-aria-prev-year') : 'previous year');
    prevBtn.appendChild(createSvg({ icon: ChevronLeft, classes: 'size-4', attrs: { 'aria-hidden': true, role: 'presentation' } }));

    const yearLabel = document.createElement('h2');
    yearLabel.setAttribute('id', `hmpl${uuidv4()}`);
    yearLabel.setAttribute('aria-live', 'polite');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    applyNavButtonDirective(nextBtn);
    nextBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-year') ? el.getAttribute('data-aria-next-year') : 'next year');
    nextBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'size-4', attrs: { 'aria-hidden': true, role: 'presentation' } }));

    header.append(prevBtn, yearLabel, nextBtn);

    // Grid: twelve month cells in four rows of three, built as a table like the
    // other picker calendars.
    const table = document.createElement('table');
    table.classList.add('table-fixed', 'border-separate', 'border-spacing-1');
    table.setAttribute('role', 'grid');
    table.setAttribute('aria-labelledby', yearLabel.getAttribute('id'));
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const monthCells = [];
    for (let r = 0; r < 4; r++) {
      const row = document.createElement('tr');
      row.setAttribute('role', 'row');
      for (let c = 0; c < 3; c++) {
        const m = r * 3 + c;
        const cell = document.createElement('td');
        cell.dataset.month = String(m);
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('tabindex', '-1');
        cell.classList.add(
          'p-1',
          'h-9',
          'text-center',
          'align-middle',
          'rounded-control',
          'text-sm',
          'bg-transparent',
          'hover:bg-secondary',
          'hover:text-secondary-foreground',
          'outline-none',
          'focus-visible:ring-ring/50',
          'focus-visible:ring-[calc(var(--spacing)*0.75)]',
          'cursor-pointer',
          'aria-[current=date]:bg-secondary',
          'aria-[current=date]:text-secondary-foreground',
          'aria-selected:bg-primary-active!',
          'aria-selected:text-primary-foreground!',
          'aria-selected:hover:bg-primary-hover!'
        );
        cell.addEventListener('click', monthClick);
        monthCells.push(cell);
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }

    el.append(header, table);
    Alpine.initTree(header);

    function monthShortLabel(m) {
      return dtf(locale, { month: 'short' }).format(new Date(2020, m, 1));
    }

    function displayValue() {
      if (!selected) return '';
      return dtf(locale, { year: 'numeric', month: 'long' }).format(new Date(selected.year, selected.month - 1, 1));
    }

    // The month button holding the roving tabindex: the explicitly focused one,
    // else the selection when its year is shown, else the current month in the
    // current year, else January.
    function focusTargetIndex() {
      if (focusedMonth !== null) return focusedMonth;
      if (selected && selected.year === viewYear) return selected.month - 1;
      const now = new Date();
      if (viewYear === now.getFullYear()) return now.getMonth();
      return 0;
    }

    function render() {
      yearLabel.textContent = dtf(locale, { year: 'numeric' }).format(new Date(viewYear, 0, 1));
      const now = new Date();
      const target = focusTargetIndex();
      for (let m = 0; m < 12; m++) {
        monthCells[m].textContent = monthShortLabel(m);
        monthCells[m].setAttribute('tabindex', m === target ? '0' : '-1');
        if (selected && selected.year === viewYear && selected.month === m + 1) {
          monthCells[m].setAttribute('aria-selected', 'true');
        } else {
          monthCells[m].removeAttribute('aria-selected');
        }
        if (viewYear === now.getFullYear() && m === now.getMonth()) {
          monthCells[m].setAttribute('aria-current', 'date');
        } else {
          monthCells[m].removeAttribute('aria-current');
        }
      }
    }

    function syncModel(triggerInput) {
      input.value = displayValue();
      input.setCustomValidity('');
      if (el._x_model) {
        el._x_model.set(selected ? `${selected.year}-${pad2(selected.month)}` : '');
      }
      if (triggerInput) {
        input.dispatchEvent(new Event('change', { bubbles: true }));
        picker._h_monthpicker.state.expanded = false;
      }
    }

    function selectMonth(m) {
      selected = { year: viewYear, month: m + 1 };
      focusedMonth = m;
      render();
      syncModel(true);
    }

    function monthClick(event) {
      selectMonth(Number(event.target.dataset.month));
    }

    function parseMonthValue(value) {
      const match = typeof value === 'string' && value.match(MONTH_RE);
      if (!match) return null;
      const month = Number(match[2]);
      if (month < 1 || month > 12) return null;
      return { year: Number(match[1]), month };
    }

    function applyModel(value) {
      if (!value) {
        selected = null;
      } else {
        const parsed = parseMonthValue(value);
        if (!parsed) {
          console.error(`${original}: model value is not a valid month - ${value}`);
          input.setCustomValidity('Input value is not a valid month.');
          return;
        }
        selected = parsed;
        viewYear = selected.year;
      }
      input.setCustomValidity('');
      render();
      input.value = displayValue();
    }

    function prevYearClick(event) {
      event.stopPropagation();
      viewYear -= 1;
      render();
    }
    function nextYearClick(event) {
      event.stopPropagation();
      viewYear += 1;
      render();
    }
    prevBtn.addEventListener('click', prevYearClick);
    nextBtn.addEventListener('click', nextYearClick);

    function onKeyDown(event) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.stopPropagation();
        event.preventDefault();
        picker._h_monthpicker.state.expanded = false;
        return;
      }
      const idx = monthCells.indexOf(event.target);
      if (idx === -1) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.stopPropagation();
        event.preventDefault();
        selectMonth(idx);
        return;
      }
      let next;
      switch (event.key) {
        case 'ArrowLeft':
          next = idx - 1;
          break;
        case 'ArrowRight':
          next = idx + 1;
          break;
        case 'ArrowUp':
          next = idx - 3;
          break;
        case 'ArrowDown':
          next = idx + 3;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = 11;
          break;
        case 'PageUp':
          viewYear -= 1;
          next = idx;
          break;
        case 'PageDown':
          viewYear += 1;
          next = idx;
          break;
        default:
          return;
      }
      event.stopPropagation();
      event.preventDefault();
      if (next < 0) {
        viewYear -= 1;
        next += 12;
      } else if (next > 11) {
        viewYear += 1;
        next -= 12;
      }
      focusedMonth = next;
      render();
      monthCells[next].focus();
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
      let parsed = parseMonthValue(raw);
      if (!parsed) {
        const asDate = MONTH_RE.test(raw) ? NaN : new Date(raw);
        if (isNaN(asDate)) {
          console.error(`${original}: input value is not a valid month - ${input.value}`);
          input.setCustomValidity('Input value is not a valid month.');
          return;
        }
        parsed = { year: asDate.getFullYear(), month: asDate.getMonth() + 1 };
      }
      selected = parsed;
      viewYear = selected.year;
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
      pickerState: picker._h_monthpicker,
      Alpine,
      effect,
      cleanup,
      onOpen: () => {
        focusedMonth = null;
        render();
        monthCells[focusTargetIndex()].focus();
      },
    });

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      prevBtn.removeEventListener('click', prevYearClick);
      nextBtn.removeEventListener('click', nextYearClick);
      for (const btn of monthCells) btn.removeEventListener('click', monthClick);
      input.removeEventListener('change', onInputChange);
      Alpine.destroyTree(header);
    });
  });
}
