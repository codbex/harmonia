import { findAncestorState } from '../common/ancestor';
import { createCalendarWidget } from '../common/calendar';
import { eventInsidePicker, setupPopover, setupTrigger } from '../common/picker-popover';
import uuidv4 from '../utils/uuid';
import { sizeObserver } from './../common/input-size';

export default function (Alpine) {
  Alpine.directive('h-date-picker', (el, { original, modifiers }, { Alpine, cleanup }) => {
    const state = Alpine.reactive({
      expanded: false,
    });
    el._h_datepicker = {
      id: undefined,
      controls: `hdpc${uuidv4()}`,
      input: undefined,
      state,
      inTable: modifiers.includes('table'),
      range: false,
    };
    el._h_datepicker.input = el.querySelector('input');
    if (!el._h_datepicker.input || el._h_datepicker.input.tagName !== 'INPUT') {
      throw new Error(`${original} must contain an input`);
    } else if (el._h_datepicker.input.hasAttribute('id')) {
      el._h_datepicker.id = el._h_datepicker.input.getAttribute('id');
    } else {
      const id = `hdp${uuidv4()}`;
      el._h_datepicker.input.setAttribute('id', id);
      el._h_datepicker.id = id;
    }

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
    if (el._h_datepicker.inTable) {
      el.classList.add(
        'size-full',
        'h-10',
        'has-[input:focus-visible]:inset-ring-ring/50',
        'has-[input:focus-visible]:inset-ring-2',
        'has-[input[aria-invalid=true]]:inset-ring-negative/20',
        'dark:has-[input[aria-invalid=true]]:inset-ring-negative/40',
        'has-[input:user-invalid]:inset-ring-negative/20!',
        'dark:has-[input:user-invalid]:inset-ring-negative/40!',
        '[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/20!',
        'dark:[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/40!'
      );
      el.setAttribute('data-slot', 'cell-input-date');
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
      el.setAttribute('data-slot', 'date-picker');
    }

    el._h_datepicker.input.classList.add(
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
    el._h_datepicker.input.setAttribute('aria-autocomplete', 'none');
    el._h_datepicker.input.setAttribute('type', 'text');

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-date-picker-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    const datepicker = findAncestorState(Alpine, el, '_h_datepicker');
    if (!datepicker) {
      throw new Error(`${original} must be inside an date-picker element`);
    }
    setupTrigger(el, {
      pickerState: datepicker._h_datepicker,
      Alpine,
      effect,
      cleanup,
      original,
      slot: 'date-picker-trigger',
      // In range mode a click inside the picker (e.g. picking the range start)
      // must keep the popover open until the range is complete. Single mode is
      // unchanged: any click closes it.
      stayOpenInside: (event) => datepicker._h_datepicker.range && eventInsidePicker(datepicker, event),
    });
  });

  Alpine.directive('h-date-picker-popup', (el, { original, expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    const datepicker = findAncestorState(Alpine, el, '_h_datepicker');
    if (!datepicker) {
      console.warn(`${original}: must be used inside an x-h-date-picker element`);
      return;
    }

    const { input } = datepicker._h_datepicker;

    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'date-picker-calendar');

    const widget = createCalendarWidget('x-h-date-picker-popup', el, {
      onSelectionChanged: (triggerInput) => {
        input.value = widget.formatSelectedDate() ?? '';
        input.setCustomValidity('');
        if (triggerInput) {
          input.dispatchEvent(new Event('change', { bubbles: true }));
          datepicker._h_datepicker.state.expanded = false;
        }
      },
      onEscape: () => {
        datepicker._h_datepicker.state.expanded = false;
      },
      onInvalidModel: () => input.setCustomValidity('Input value is not a valid date.'),
      onModelValid: () => {
        input.value = widget.formatSelectedDate() ?? '';
      },
      stopNavPropagation: true,
      tableFullWidth: false,
    });

    const onInputChange = (event) => {
      if (event && !event.isTrusted) return;
      const parsed = widget.parseDisplayValue(input.value);
      if (widget.isRange()) {
        const { start, end } = parsed;
        if (!start || isNaN(start) || (end && isNaN(end))) {
          console.error(`${original}: input value is not a valid date range - ${input.value}`);
          input.setCustomValidity('Input value is not a valid date range.');
          return;
        }
        const current = widget.getSelected();
        if (!widget.isSameDay(current.start, start) || !widget.isSameDay(current.end, end)) {
          widget.setSelectedAndSync({ start, end });
          widget.render();
        }
        input.setCustomValidity('');
        return;
      }
      if (isNaN(parsed)) {
        console.error(`${original}: input value is not a valid date - ${input.value}`);
        input.setCustomValidity('Input value is not a valid date.');
        return;
      }
      if (!widget.getSelected() || !widget.isSameDay(widget.getSelected(), parsed)) {
        widget.setSelectedAndSync(parsed);
        widget.render();
      }
      input.setCustomValidity('');
    };
    input.addEventListener('change', onInputChange);

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() => {
        getConfig((config) => {
          widget.setConfig(config);
          datepicker._h_datepicker.range = widget.isRange();
        });
      });
    } else {
      widget.setConfig({});
      datepicker._h_datepicker.range = widget.isRange();
    }

    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      const modelExpression = el.getAttribute('x-model');
      const evaluateModel = evaluateLater(modelExpression);

      effect(() => {
        evaluateModel((value) => {
          if (widget.applyModel(value)) input.value = '';
        });
      });
    }

    setupPopover(el, {
      anchor: datepicker,
      pickerState: datepicker._h_datepicker,
      Alpine,
      effect,
      cleanup,
      onOpen: () => widget.focusDay(),
    });

    cleanup(() => {
      widget.cleanup();
      input.removeEventListener('change', onInputChange);
    });
  });
}
