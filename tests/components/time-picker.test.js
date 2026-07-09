import { describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 10, y: 20, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  arrow: vi.fn(),
}));

vi.mock('../../src/common/input-size.js', () => ({
  sizeObserver: vi.fn().mockReturnValue({ disconnect: vi.fn() }),
}));

import timepickerPlugin from '../../src/components/time-picker.js';
import { mountDirective } from '../test-utils.js';

describe('h-time-picker', () => {
  it('initializes _h_timepicker reactive state', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    expect(el._h_timepicker).toBeDefined();
    expect(el._h_timepicker.expanded).toBe(false);
    expect(el._h_timepicker.controls).toMatch(/^htpc/);
    expect(typeof el._h_timepicker.close).toBe('function');
  });

  it('initializes _h_time parts state', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    expect(el._h_time).toBeDefined();
    expect(el._h_time.parts.hour).toBeNull();
    expect(el._h_time.parts.minute).toBeNull();
    expect(el._h_time.parts.second).toBeNull();
    expect(el._h_time.parts.period).toBeNull();
  });

  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('border-input')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('time-picker');
  });

  it('applies table-specific classes for table modifier', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: ['table'],
      expression: '',
    });
    expect(el.getAttribute('data-slot')).toBe('cell-input-time');
    expect(el.classList.contains('h-10')).toBe(true);
  });

  it('sets tabindex=-1', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('appends a clock icon svg', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('calls cleanup', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('applies the readonly classes', () => {
    const el = document.createElement('div');
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    expect(el.classList.contains('has-[input[readonly]]:bg-muted')).toBe(true);
    expect(el.classList.contains('has-[input[readonly]]:cursor-default')).toBe(true);
  });

  it('readonly input: click and Enter do not open the popover', () => {
    const el = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('readonly', '');
    el.appendChild(input);
    document.body.appendChild(el);
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el._h_timepicker.expanded).toBe(false);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el._h_timepicker.expanded).toBe(false);
  });

  it('disabled input: a click does not open the popover, also when toggled after init', () => {
    const el = document.createElement('div');
    const input = document.createElement('input');
    el.appendChild(input);
    document.body.appendChild(el);
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });

    input.disabled = true;
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el._h_timepicker.expanded).toBe(false);

    input.disabled = false;
    el.dispatchEvent(new MouseEvent('click'));
    expect(el._h_timepicker.expanded).toBe(true);
  });

  it('editable input: a click opens the popover', () => {
    const el = document.createElement('div');
    const input = document.createElement('input');
    el.appendChild(input);
    document.body.appendChild(el);
    mountDirective(timepickerPlugin, 'h-time-picker', el, {
      modifiers: [],
      expression: '',
    });
    // Non-bubbling click: the mock Alpine's nextTick is synchronous, so a
    // bubbling click would reach the just-added outside-click dismiss listener
    // and close the popover again within the same dispatch.
    el.dispatchEvent(new MouseEvent('click'));
    expect(el._h_timepicker.expanded).toBe(true);
  });
});

describe('h-time-picker-input', () => {
  function createTimePickerInputSetup() {
    const container = document.createElement('div');
    const timepicker = document.createElement('div');
    timepicker._h_timepicker = {
      id: 'tp-id',
      controls: 'htpc-test',
      expanded: false,
      is12Hour: false,
      seconds: false,
      focusInput: undefined,
      close: vi.fn(),
    };
    timepicker._h_time = {
      changed: undefined,
      model: undefined,
      parts: { hour: null, minute: null, second: null, period: null },
    };
    const input = document.createElement('input');
    input.type = 'text';
    timepicker.appendChild(input);
    container.appendChild(timepicker);
    document.body.appendChild(container);
    return { container, timepicker, input };
  }

  it('applies base classes', () => {
    const { input } = createTimePickerInputSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-input', input, {
      original: 'x-h-time-picker-input',
    });
    expect(input.classList.contains('cursor-pointer')).toBe(true);
    expect(input.classList.contains('bg-transparent')).toBe(true);
    expect(input.classList.contains('outline-none')).toBe(true);
  });

  it('sets ARIA attributes', () => {
    const { input, timepicker } = createTimePickerInputSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-input', input, {
      original: 'x-h-time-picker-input',
    });
    expect(input.getAttribute('aria-autocomplete')).toBe('none');
    expect(input.getAttribute('aria-controls')).toBe(timepicker._h_timepicker.controls);
    expect(input.getAttribute('aria-haspopup')).toBe('dialog');
    expect(input.getAttribute('type')).toBe('text');
    expect(input.getAttribute('data-slot')).toBe('time-picker-input');
  });

  it('throws if element is not an input', () => {
    const el = document.createElement('div');
    expect(() =>
      mountDirective(timepickerPlugin, 'h-time-picker-input', el, {
        original: 'x-h-time-picker-input',
      })
    ).toThrow();
  });

  it('calls cleanup', () => {
    const { input } = createTimePickerInputSetup();
    const { ctx } = mountDirective(timepickerPlugin, 'h-time-picker-input', input, {
      original: 'x-h-time-picker-input',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('sets focusInput and changed functions on timepicker', () => {
    const { input, timepicker } = createTimePickerInputSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-input', input, {
      original: 'x-h-time-picker-input',
    });
    expect(typeof timepicker._h_timepicker.focusInput).toBe('function');
    expect(typeof timepicker._h_time.changed).toBe('function');
  });

  it('dispatches a bubbling change event on the input when the time changes', () => {
    const { input, timepicker } = createTimePickerInputSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-input', input, {
      original: 'x-h-time-picker-input',
    });
    const events = [];
    timepicker.addEventListener('change', (event) => events.push(event));
    timepicker._h_time.changed();
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('change');
    expect(events[0].bubbles).toBe(true);
    expect(events[0].target).toBe(input);
  });
});

describe('h-time-picker-popup', () => {
  function createTimepickerPopupSetup() {
    const container = document.createElement('div');
    const timepicker = document.createElement('div');
    timepicker._h_timepicker = {
      id: 'tp-id',
      controls: 'htpc-test',
      expanded: false,
      is12Hour: false,
      seconds: false,
      close: vi.fn(),
    };
    timepicker._h_time = {
      changed: vi.fn(),
      model: { get: vi.fn().mockReturnValue(''), set: vi.fn() },
      parts: { hour: null, minute: null, second: null, period: null },
    };
    const popup = document.createElement('div');
    timepicker.appendChild(popup);
    container.appendChild(timepicker);
    document.body.appendChild(container);
    return { container, timepicker, popup };
  }

  it('applies base classes', () => {
    const { popup } = createTimepickerPopupSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-popup', popup, {});
    expect(popup.classList.contains('overflow-hidden')).toBe(true);
    expect(popup.classList.contains('border')).toBe(true);
    expect(popup.classList.contains('rounded-control')).toBe(true);
    expect(popup.classList.contains('absolute')).toBe(true);
    expect(popup.classList.contains('bg-popover')).toBe(true);
    expect(popup.classList.contains('hidden')).toBe(true);
  });

  it('sets role, aria-modal, tabindex, data-slot, and id attributes', () => {
    const { popup, timepicker } = createTimepickerPopupSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-popup', popup, {});
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.getAttribute('aria-modal')).toBe('true');
    expect(popup.getAttribute('tabindex')).toBe('-1');
    expect(popup.getAttribute('data-slot')).toBe('time-picker-popup');
    expect(popup.getAttribute('id')).toBe(timepicker._h_timepicker.controls);
    expect(popup.getAttribute('aria-labelledby')).toBe(timepicker._h_timepicker.id);
  });

  it('creates hours, minutes, seconds, period lists', () => {
    const { popup } = createTimepickerPopupSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-popup', popup, {});
    const hoursList = popup.querySelector('[data-type="hours"]');
    const minutesList = popup.querySelector('[data-type="minutes"]');
    const secondsList = popup.querySelector('[data-type="seconds"]');
    const periodList = popup.querySelector('[data-type="period"]');
    expect(hoursList).toBeTruthy();
    expect(minutesList).toBeTruthy();
    expect(secondsList).toBeTruthy();
    expect(periodList).toBeTruthy();
  });

  it('creates 24 hour options and 60 minute options', () => {
    const { popup } = createTimepickerPopupSetup();
    mountDirective(timepickerPlugin, 'h-time-picker-popup', popup, {});
    const hours = popup.querySelectorAll('[data-type="hours"] [role="option"]');
    const minutes = popup.querySelectorAll('[data-type="minutes"] [role="option"]');
    expect(hours.length).toBe(24);
    expect(minutes.length).toBe(60);
  });

  it('calls cleanup', () => {
    const { popup } = createTimepickerPopupSetup();
    const { ctx } = mountDirective(timepickerPlugin, 'h-time-picker-popup', popup, {});
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
