import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import datepickerPlugin from '../../src/components/date-picker.js';
import { mountDirective } from '../test-utils.js';

function createDatePickerEl() {
  const el = document.createElement('div');
  const input = document.createElement('input');
  el.appendChild(input);
  document.body.appendChild(el);
  return el;
}

describe('h-date-picker', () => {
  it('registers h-date-picker and h-date-picker-trigger directives', () => {
    const el = createDatePickerEl();
    const { alpine } = mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(alpine._directives['h-date-picker']).toBeDefined();
    expect(alpine._directives['h-date-picker-trigger']).toBeDefined();
  });

  it('adds base classes', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('pl-3')).toBe(true);
  });

  it('sets data-slot="date-picker" when not table variant', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(el.getAttribute('data-slot')).toBe('date-picker');
  });

  it('sets data-slot="cell-input-date" with table modifier', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker', modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-date');
  });

  it('sets up _h_datepicker state', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(el._h_datepicker).toBeDefined();
    expect(el._h_datepicker.state).toBeDefined();
    expect(el._h_datepicker.state.expanded).toBe(false);
  });

  it('throws if no input child found', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' })).toThrow();
  });

  it('assigns id to input if it does not have one', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(el._h_datepicker.input.hasAttribute('id')).toBe(true);
  });

  it('uses existing input id if present', () => {
    const el = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('id', 'my-input');
    el.appendChild(input);
    document.body.appendChild(el);
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(el._h_datepicker.id).toBe('my-input');
  });

  it('calls cleanup', () => {
    const el = createDatePickerEl();
    const { ctx } = mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('styles the input element', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    const input = el.querySelector('input');
    expect(input.classList.contains('bg-transparent')).toBe(true);
    expect(input.classList.contains('outline-none')).toBe(true);
  });

  it('lets the input shrink in table mode but not by default', () => {
    const plain = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', plain, { original: 'h-date-picker' });
    expect(plain.querySelector('input').classList.contains('min-w-0')).toBe(false);

    const table = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', table, { original: 'h-date-picker', modifiers: ['table'] });
    expect(table.querySelector('input').classList.contains('min-w-0')).toBe(true);
  });

  it('gates the input-to-trigger divider on the table having horizontal borders', () => {
    const plain = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', plain, { original: 'h-date-picker' });
    expect(plain.querySelector('input').classList.contains('border-r')).toBe(true);

    const table = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', table, { original: 'h-date-picker', modifiers: ['table'] });
    const input = table.querySelector('input');
    expect(input.classList.contains('border-r')).toBe(false);
    expect(input.classList.contains('[table[data-borders=rows]_&]:border-r')).toBe(true);
    expect(input.classList.contains('[table[data-borders=both]_&]:border-r')).toBe(true);
  });

  it('sets input type to text', () => {
    const el = createDatePickerEl();
    mountDirective(datepickerPlugin, 'h-date-picker', el, { original: 'h-date-picker' });
    const input = el.querySelector('input');
    expect(input.getAttribute('type')).toBe('text');
  });
});

describe('h-date-picker-trigger', () => {
  let wrapperEl, triggerEl;

  beforeEach(() => {
    wrapperEl = document.createElement('div');
    wrapperEl._h_datepicker = {
      state: { expanded: false },
      controls: 'cal-1',
      id: 'dp-input',
      inTable: false,
    };

    triggerEl = document.createElement('button');
    triggerEl.setAttribute('aria-label', 'Open calendar');
    wrapperEl.appendChild(triggerEl);
    document.body.appendChild(wrapperEl);
  });

  it('throws if element is not a button', () => {
    const div = document.createElement('div');
    div.setAttribute('aria-label', 'Open calendar');
    wrapperEl.appendChild(div);
    expect(() => mountDirective(datepickerPlugin, 'h-date-picker-trigger', div, { original: 'h-date-picker-trigger' })).toThrow();
  });

  it('throws if no aria-label or aria-labelledby', () => {
    const btn = document.createElement('button');
    wrapperEl.appendChild(btn);
    expect(() => mountDirective(datepickerPlugin, 'h-date-picker-trigger', btn, { original: 'h-date-picker-trigger' })).toThrow();
  });

  it('throws if not inside a datepicker', () => {
    const orphan = document.createElement('button');
    orphan.setAttribute('aria-label', 'Open calendar');
    document.body.appendChild(orphan);
    expect(() => mountDirective(datepickerPlugin, 'h-date-picker-trigger', orphan, { original: 'h-date-picker-trigger' })).toThrow();
  });

  it('adds base classes', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(triggerEl.classList.contains('cursor-pointer')).toBe(true);
    expect(triggerEl.classList.contains('inline-flex')).toBe(true);
    expect(triggerEl.classList.contains('h-full')).toBe(true);
    expect(triggerEl.classList.contains('outline-none')).toBe(true);
  });

  it('keeps the square rounded trigger and stays non-shrinking when not in a table', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(triggerEl.classList.contains('rounded-r-control')).toBe(true);
    expect(triggerEl.classList.contains('min-w-6')).toBe(false);
  });

  it('lets the trigger shrink below its square in table mode', () => {
    wrapperEl._h_datepicker.inTable = true;
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    // Shrinkable down to a tappable floor, and never pinned with shrink-0.
    expect(triggerEl.classList.contains('min-w-6')).toBe(true);
    expect(triggerEl.classList.contains('shrink-0')).toBe(false);
    expect(triggerEl.classList.contains('rounded-r-control')).toBe(false);
  });

  it('keeps the icon from distorting when the trigger narrows', () => {
    wrapperEl._h_datepicker.inTable = true;
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    const svg = triggerEl.querySelector('svg');
    expect(svg.classList.contains('shrink-0')).toBe(true);
  });

  it('sets data-slot="date-picker-trigger"', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(triggerEl.getAttribute('data-slot')).toBe('date-picker-trigger');
  });

  it('sets aria-controls', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(triggerEl.getAttribute('aria-controls')).toBe('cal-1');
  });

  it('sets aria-haspopup="dialog"', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(triggerEl.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('sets initial aria-expanded="false"', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(triggerEl.getAttribute('aria-expanded')).toBe('false');
  });

  it('appends an svg icon', () => {
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    const svg = triggerEl.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('readonly input: a click does not open the popover and the trigger is aria-disabled', () => {
    const input = document.createElement('input');
    input.setAttribute('readonly', '');
    wrapperEl.insertBefore(input, triggerEl);
    wrapperEl._h_datepicker.input = input;
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });

    expect(triggerEl.getAttribute('aria-disabled')).toBe('true');
    expect(triggerEl.classList.contains('[input[readonly]~&]:pointer-events-none')).toBe(true);

    triggerEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(false);
  });

  it('editable input: a click still opens the popover and no aria-disabled is set', () => {
    const input = document.createElement('input');
    wrapperEl.insertBefore(input, triggerEl);
    wrapperEl._h_datepicker.input = input;
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });

    expect(triggerEl.hasAttribute('aria-disabled')).toBe(false);

    // Non-bubbling click: the mock Alpine's nextTick is synchronous, so a
    // bubbling click would reach the just-added outside-click dismiss listener
    // and close the popover again within the same dispatch.
    triggerEl.dispatchEvent(new MouseEvent('click'));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(true);
  });

  it('toggling readonly at runtime updates aria-disabled on the trigger', async () => {
    const input = document.createElement('input');
    wrapperEl.insertBefore(input, triggerEl);
    wrapperEl._h_datepicker.input = input;
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });

    input.setAttribute('readonly', '');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(triggerEl.getAttribute('aria-disabled')).toBe('true');

    input.removeAttribute('readonly');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(triggerEl.hasAttribute('aria-disabled')).toBe(false);
  });

  it('disabled input: a click does not open the popover, also when toggled after init', async () => {
    const input = document.createElement('input');
    wrapperEl.insertBefore(input, triggerEl);
    wrapperEl._h_datepicker.input = input;
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });

    input.setAttribute('disabled', '');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(triggerEl.getAttribute('aria-disabled')).toBe('true');
    triggerEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(false);

    input.removeAttribute('disabled');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(triggerEl.hasAttribute('aria-disabled')).toBe(false);
    triggerEl.dispatchEvent(new MouseEvent('click'));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(true);
  });

  it('range mode: a click inside the picker keeps the popover open; an outside click closes it', () => {
    wrapperEl._h_datepicker.range = true;
    const inside = document.createElement('div');
    wrapperEl.appendChild(inside);
    mountDirective(datepickerPlugin, 'h-date-picker-trigger', triggerEl, { original: 'h-date-picker-trigger' });

    triggerEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(true);

    inside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datepicker.state.expanded).toBe(false);
  });

  it('range mode: a click inside a shadow tree keeps the popover open (composedPath, not retargeted target)', () => {
    // In the docs, examples render inside a shadow-DOM component-container. A click
    // bubbling out of the shadow tree gets its target retargeted to the host, which
    // the picker does not contain - so the outside-click handler must use
    // composedPath() to recognise the click as originating inside the picker.
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'open' });

    const shadowWrapper = document.createElement('div');
    shadowWrapper._h_datepicker = { state: { expanded: false }, controls: 'c', id: 'i', inTable: false, range: true };
    const shadowTrigger = document.createElement('button');
    shadowTrigger.setAttribute('aria-label', 'open');
    const inside = document.createElement('div');
    shadowWrapper.append(shadowTrigger, inside);
    root.appendChild(shadowWrapper);

    mountDirective(datepickerPlugin, 'h-date-picker-trigger', shadowTrigger, { original: 'h-date-picker-trigger' });

    shadowTrigger.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(shadowWrapper._h_datepicker.state.expanded).toBe(true);

    inside.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(shadowWrapper._h_datepicker.state.expanded).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(shadowWrapper._h_datepicker.state.expanded).toBe(false);
  });
});

describe('h-date-picker-popup', () => {
  function createPopupSetup() {
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      value: '',
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
    return { wrapper, calEl, input, getHandler: () => inputChangeHandler };
  }

  it('registers h-date-picker-popup directive', () => {
    const { calEl } = createPopupSetup();
    const { alpine } = mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    expect(alpine._directives['h-date-picker-popup']).toBeDefined();
  });

  it('adds absolute and hidden classes', () => {
    const { calEl } = createPopupSetup();
    mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    expect(calEl.classList.contains('absolute')).toBe(true);
    expect(calEl.classList.contains('hidden')).toBe(true);
  });

  it('sets role="dialog" and data-slot="date-picker-calendar"', () => {
    const { calEl } = createPopupSetup();
    mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    expect(calEl.getAttribute('role')).toBe('dialog');
    expect(calEl.getAttribute('data-slot')).toBe('date-picker-calendar');
  });

  it('does not add shadow-input class', () => {
    const { calEl } = createPopupSetup();
    mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    expect(calEl.classList.contains('shadow-input')).toBe(false);
  });

  it('appends header with navigation buttons', () => {
    const { calEl } = createPopupSetup();
    mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    expect(calEl.querySelectorAll('button').length).toBeGreaterThanOrEqual(4);
  });

  it('appends a table with 6 rows of 7 cells', () => {
    const { calEl } = createPopupSetup();
    mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    const rows = calEl.querySelectorAll('tbody tr');
    expect(rows.length).toBe(6);
    rows.forEach((row) => expect(row.querySelectorAll('td').length).toBe(7));
  });

  it('warns and returns early when not inside a datepicker', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    const consoleSpy = vi.spyOn(console, 'warn');
    mountDirective(datepickerPlugin, 'h-date-picker-popup', orphan, { original: 'h-date-picker-popup', expression: '' });
    expect(consoleSpy).toHaveBeenCalled();
    expect(orphan.querySelector('table')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('calls cleanup', () => {
    const { calEl } = createPopupSetup();
    const { ctx } = mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: '' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('parses manual input that includes a locale suffix (e.g. bg-BG "18.06.2027 г.")', () => {
    // Regression: buildInputParser must include trailing locale literals (like " г.") in its
    // regex so that the value the formatter produces can be round-tripped back through the parser.
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      value: '18.06.2027 г.',
      setCustomValidity: vi.fn(),
    };
    wrapper._h_datepicker = { state: { expanded: false }, input, controls: 'ctrl-1' };
    const calEl = document.createElement('div');
    wrapper.appendChild(calEl);
    document.body.appendChild(wrapper);

    const modelSet = vi.fn();
    Object.defineProperty(calEl, '_x_model', {
      value: { get: () => '', set: modelSet },
      configurable: true,
    });

    mountDirective(
      datepickerPlugin,
      'h-date-picker-popup',
      calEl,
      {
        original: 'h-date-picker-popup',
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
    // Regression: dayClick -> modelChange(true) -> onSelectionChanged fires synthetic change on input.
    // onInputChange must skip non-trusted events (isTrusted: false) to avoid parsing errors.
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      value: '١٩\u200F/٦\u200F/٢٠٢٦',
      setCustomValidity: vi.fn(),
    };
    wrapper._h_datepicker = { state: { expanded: false }, input, controls: 'ctrl-1' };
    const calEl = document.createElement('div');
    wrapper.appendChild(calEl);
    document.body.appendChild(wrapper);
    Object.defineProperty(calEl, '_x_model', { value: { get: () => '', set: vi.fn() }, configurable: true });

    mountDirective(
      datepickerPlugin,
      'h-date-picker-popup',
      calEl,
      { original: 'h-date-picker-popup', expression: 'config' },
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
    // invisible directional marks and builds a digit normalizer; parseDisplayValue applies both.
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
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
      datepickerPlugin,
      'h-date-picker-popup',
      calEl,
      { original: 'h-date-picker-popup', expression: 'config' },
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

  function createRangePopup() {
    const wrapper = document.createElement('div');
    let inputChangeHandler;
    const input = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') inputChangeHandler = handler;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      value: '',
      setCustomValidity: vi.fn(),
    };
    const state = { expanded: true };
    wrapper._h_datepicker = { state, input, controls: 'ctrl-1' };
    const calEl = document.createElement('div');
    wrapper.appendChild(calEl);
    document.body.appendChild(wrapper);

    let model;
    const modelSet = vi.fn((v) => (model = v));
    Object.defineProperty(calEl, '_x_model', {
      value: { get: () => model, set: modelSet },
      configurable: true,
    });

    mountDirective(datepickerPlugin, 'h-date-picker-popup', calEl, { original: 'h-date-picker-popup', expression: 'config' }, { evaluateLater: () => (cb) => cb({ range: true, locale: 'en-US', order: 'YMD', delimiter: '-' }) });

    const cell = (day) => calEl.querySelector(`td[data-day="${day}"]`);
    return { calEl, input, state, modelSet, getModel: () => model, getHandler: () => inputChangeHandler, cell };
  }

  it('range mode: a partial pick keeps the popover open and writes a partial model', () => {
    const { cell, state, getModel } = createRangePopup();
    cell(5).click();
    expect(state.expanded).toBe(true);
    expect(getModel().start).toBeDefined();
    expect(getModel().end).toBeUndefined();
  });

  it('range mode: completing a range fills the input, closes the popover and writes {start,end}', () => {
    const { cell, state, input, getModel } = createRangePopup();
    cell(5).click();
    cell(9).click();
    expect(state.expanded).toBe(false);
    expect(input.value).toContain(' - ');
    expect(input.dispatchEvent).toHaveBeenCalled();
    expect(getModel().start).toBeDefined();
    expect(getModel().end).toBeDefined();
  });

  it('range mode: typing a range string parses both ends into the model', () => {
    const { input, getHandler, modelSet } = createRangePopup();
    input.value = '2026-06-10 - 2026-06-20';
    const consoleSpy = vi.spyOn(console, 'error');
    getHandler()({ isTrusted: true });
    expect(consoleSpy).not.toHaveBeenCalled();
    expect(modelSet).toHaveBeenCalledWith({ start: '2026-06-10', end: '2026-06-20' });
    consoleSpy.mockRestore();
  });

  it('range mode: an invalid range string sets a validity error', () => {
    const { input, getHandler } = createRangePopup();
    input.value = 'not a date - also bad';
    const consoleSpy = vi.spyOn(console, 'error');
    getHandler()({ isTrusted: true });
    expect(input.setCustomValidity).toHaveBeenCalledWith('Input value is not a valid date range.');
    consoleSpy.mockRestore();
  });
});
