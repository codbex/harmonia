import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import calendarPlugin from '../../src/components/calendar.js';
import { mountDirective } from '../test-utils.js';

// happy-dom does not implement window.matchMedia
vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

describe('h-calendar', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers h-calendar directive', () => {
    const { alpine } = mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(alpine._directives['h-calendar']).toBeDefined();
  });

  it('adds border and rounded-control classes', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('adds shadow-input class when not inside a datepicker', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(el.classList.contains('shadow-input')).toBe(true);
  });

  it('appends header element with navigation buttons', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    const buttons = el.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('appends a table for dates', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    const table = el.querySelector('table');
    expect(table).toBeTruthy();
  });

  it('table has 6 rows of 7 cells each', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(6);
    rows.forEach((row) => {
      expect(row.querySelectorAll('td').length).toBe(7);
    });
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('navigation buttons use default aria-labels when data attributes absent', () => {
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    const buttons = el.querySelectorAll('button');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('previous year');
    expect(labels).toContain('previous month');
    expect(labels).toContain('next month');
    expect(labels).toContain('next year');
  });

  it('navigation buttons use data attribute values for aria-labels when present', () => {
    el.setAttribute('data-aria-prev-year', 'Предишна година');
    el.setAttribute('data-aria-prev-month', 'Предишен месец');
    el.setAttribute('data-aria-next-month', 'Следващия месец');
    el.setAttribute('data-aria-next-year', 'Следващата година');
    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    const buttons = el.querySelectorAll('button');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Предишна година');
    expect(labels).toContain('Предишен месец');
    expect(labels).toContain('Следващия месец');
    expect(labels).toContain('Следващата година');
  });

  it('adds absolute and hidden classes when inside a datepicker', () => {
    const wrapper = document.createElement('div');
    wrapper._h_datepicker = {
      state: { expanded: false },
      input: { addEventListener: vi.fn(), value: '', setCustomValidity: vi.fn() },
      controls: 'ctrl-1',
    };
    el = document.createElement('div');
    wrapper.appendChild(el);
    document.body.appendChild(wrapper);

    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(el.classList.contains('absolute')).toBe(true);
    expect(el.classList.contains('hidden')).toBe(true);
  });

  it('sets role="dialog" when inside a datepicker', () => {
    const wrapper = document.createElement('div');
    wrapper._h_datepicker = {
      state: { expanded: false },
      input: { addEventListener: vi.fn(), value: '', setCustomValidity: vi.fn() },
      controls: 'ctrl-1',
    };
    el = document.createElement('div');
    wrapper.appendChild(el);
    document.body.appendChild(wrapper);

    mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression: '' });
    expect(el.getAttribute('role')).toBe('dialog');
    expect(el.getAttribute('data-slot')).toBe('date-picker-calendar');
  });

  it('parses manual input that includes a locale suffix (e.g. bg-BG "18.06.2027 г.")', () => {
    // Regression test: buildInputParser must include trailing locale literals (like " г.") in its
    // regex so that the value the formatter produces can be round-tripped back through the parser.
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      value: '18.06.2027 г.',
      setCustomValidity: vi.fn(),
    };
    wrapper._h_datepicker = {
      state: { expanded: false },
      input,
      controls: 'ctrl-1',
    };
    const calEl = document.createElement('div');
    wrapper.appendChild(calEl);
    document.body.appendChild(wrapper);

    const modelSet = vi.fn();
    Object.defineProperty(calEl, '_x_model', {
      value: { get: () => '', set: modelSet },
      configurable: true,
    });

    mountDirective(
      calendarPlugin,
      'h-calendar',
      calEl,
      {
        original: 'h-calendar',
        expression: 'config',
      },
      {
        evaluateLater: () => (cb) => cb({ locale: 'bg-BG' }),
      }
    );

    const consoleSpy = vi.spyOn(console, 'error');
    inputChangeHandler();

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(modelSet).toHaveBeenCalledWith('2027-06-18');
    consoleSpy.mockRestore();
  });

  it('does not error when a calendar day click fires a synthetic change event (ar-SA)', () => {
    // Regression: dayClick -> modelChange(true) dispatches a synthetic change event on the input.
    // Fix: onInputChange skips non-trusted events (isTrusted: false) so it never tries to
    // parse the locale-formatted value that was just set by the code itself.
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      value: '١٩\u200F/٦\u200F/٢٠٢٦',
      setCustomValidity: vi.fn(),
    };
    wrapper._h_datepicker = { state: { expanded: false }, input, controls: 'ctrl-1' };
    const calEl = document.createElement('div');
    wrapper.appendChild(calEl);
    document.body.appendChild(wrapper);
    Object.defineProperty(calEl, '_x_model', { value: { get: () => '', set: vi.fn() }, configurable: true });

    mountDirective(
      calendarPlugin,
      'h-calendar',
      calEl,
      { original: 'h-calendar', expression: 'config' },
      {
        evaluateLater: () => (cb) => cb({ locale: 'ar-SA' }),
      }
    );

    const consoleSpy = vi.spyOn(console, 'error');
    inputChangeHandler({ isTrusted: false });
    expect(consoleSpy).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('parses pasted Arabic-Indic date input (ar-SA "١٩\u200F/٦\u200F/٢٠٢٦")', () => {
    // Regression: pasting a locale-formatted ar-SA date (Arabic-Indic digits + RTL marks) into the
    // input was failing with "input value is not a valid date". Fix: buildInputParser strips
    // invisible directional marks and builds a digit normalizer; parseDisplayValue applies both
    // so that Arabic-Indic dates round-trip correctly to a Gregorian Date.
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      value: '١٩\u200F/٦\u200F/٢٠٢٦',
      setCustomValidity: vi.fn(),
    };
    wrapper._h_datepicker = { state: { expanded: false }, input, controls: 'ctrl-1' };
    const calEl = document.createElement('div');
    wrapper.appendChild(calEl);
    document.body.appendChild(wrapper);

    const modelSet = vi.fn();
    Object.defineProperty(calEl, '_x_model', { value: { get: () => '', set: modelSet }, configurable: true });

    mountDirective(
      calendarPlugin,
      'h-calendar',
      calEl,
      { original: 'h-calendar', expression: 'config' },
      {
        evaluateLater: () => (cb) => cb({ locale: 'ar-SA' }),
      }
    );

    const consoleSpy = vi.spyOn(console, 'error');
    inputChangeHandler({ isTrusted: true });

    expect(consoleSpy).not.toHaveBeenCalled();
    expect(modelSet).toHaveBeenCalledWith('2026-06-19');
    consoleSpy.mockRestore();
  });
});
