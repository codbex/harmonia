import { findAncestorState } from '../common/ancestor';
import { ChevronRight, createSvg } from '../common/icons';
import { sizeObserver } from '../common/input-size';
import { setupPopover, setupTrigger } from '../common/picker-popover';
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

function pad2(value) {
  return String(value).padStart(2, '0');
}

// The wrapper + input frame shared with the date picker (kept in sync visually).
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
      'dark:has-[input[aria-invalid=true]]:ring-negative/40'
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

    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'month-picker-calendar');

    let locale = resolveLocale();
    let viewYear = new Date().getFullYear();
    let selected = null; // { year, month } with month in 1..12

    // Header: previous-year / year label / next-year.
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
    prevBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-year') ? el.getAttribute('data-aria-prev-year') : 'previous year');
    const prevIcon = createSvg({ icon: ChevronRight, classes: 'size-4 rotate-180', attrs: { 'aria-hidden': true } });
    prevBtn.appendChild(prevIcon);

    const yearLabel = document.createElement('span');
    yearLabel.classList.add('text-sm', 'font-medium', 'tabular-nums');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.classList.add(...navButtonClasses);
    nextBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-year') ? el.getAttribute('data-aria-next-year') : 'next year');
    nextBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'size-4', attrs: { 'aria-hidden': true } }));

    header.append(prevBtn, yearLabel, nextBtn);

    // Grid: twelve month buttons in a 3-column layout.
    const grid = document.createElement('div');
    grid.classList.add('grid', 'grid-cols-3', 'gap-1');
    grid.setAttribute('role', 'grid');

    const monthButtons = [];
    for (let m = 0; m < 12; m++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.dataset.month = String(m);
      btn.setAttribute('role', 'gridcell');
      btn.classList.add(
        'h-9',
        'rounded-control',
        'text-sm',
        'bg-transparent',
        'hover:bg-secondary',
        'hover:text-secondary-foreground',
        'outline-none',
        'focus-visible:ring-ring/50',
        'focus-visible:ring-2',
        'cursor-pointer',
        'aria-selected:bg-primary-active!',
        'aria-selected:text-primary-foreground!',
        'aria-selected:hover:bg-primary-hover!'
      );
      btn.addEventListener('click', () => selectMonth(m));
      monthButtons.push(btn);
      grid.appendChild(btn);
    }

    el.append(header, grid);

    function monthShortLabel(m) {
      return new Intl.DateTimeFormat(locale, { month: 'short' }).format(new Date(2020, m, 1));
    }

    function displayValue() {
      if (!selected) return '';
      return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(new Date(selected.year, selected.month - 1, 1));
    }

    function render() {
      yearLabel.textContent = String(viewYear);
      for (let m = 0; m < 12; m++) {
        monthButtons[m].textContent = monthShortLabel(m);
        const isSelected = selected && selected.year === viewYear && selected.month === m + 1;
        if (isSelected) {
          monthButtons[m].setAttribute('aria-selected', 'true');
        } else {
          monthButtons[m].removeAttribute('aria-selected');
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
      render();
      syncModel(true);
    }

    function applyModel(value) {
      const match = typeof value === 'string' && value.match(MONTH_RE);
      if (match) {
        selected = { year: Number(match[1]), month: Number(match[2]) };
        viewYear = selected.year;
      } else if (!value) {
        selected = null;
      }
      render();
      input.value = displayValue();
    }

    prevBtn.addEventListener('click', () => {
      viewYear -= 1;
      render();
    });
    nextBtn.addEventListener('click', () => {
      viewYear += 1;
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
      const match = raw.match(MONTH_RE);
      const parsed = match ? new Date(Number(match[1]), Number(match[2]) - 1, 1) : new Date(raw);
      if (isNaN(parsed)) {
        console.error(`${original}: input value is not a valid month - ${input.value}`);
        input.setCustomValidity('Input value is not a valid month.');
        return;
      }
      selected = { year: parsed.getFullYear(), month: parsed.getMonth() + 1 };
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
        const target = selected && selected.year === viewYear ? monthButtons[selected.month - 1] : monthButtons[new Date().getMonth()];
        if (target) target.focus();
      },
    });

    cleanup(() => {
      input.removeEventListener('change', onInputChange);
    });
  });
}
