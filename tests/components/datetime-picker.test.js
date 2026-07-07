import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import datetimePlugin from '../../src/components/datetime-picker.js';
import { mountDirective } from '../test-utils.js';

function createWrapperEl() {
  const el = document.createElement('div');
  const input = document.createElement('input');
  el.appendChild(input);
  document.body.appendChild(el);
  return el;
}

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);

describe('h-datetime-picker', () => {
  it('registers all three directives', () => {
    const el = createWrapperEl();
    const { alpine } = mountDirective(datetimePlugin, 'h-datetime-picker', el, { original: 'h-datetime-picker' });
    expect(alpine._directives['h-datetime-picker']).toBeDefined();
    expect(alpine._directives['h-datetime-picker-trigger']).toBeDefined();
    expect(alpine._directives['h-datetime-picker-popup']).toBeDefined();
  });

  it('sets data-slot="datetime-picker" and base classes', () => {
    const el = createWrapperEl();
    mountDirective(datetimePlugin, 'h-datetime-picker', el, { original: 'h-datetime-picker' });
    expect(el.getAttribute('data-slot')).toBe('datetime-picker');
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('sets data-slot="cell-input-datetime" with table modifier', () => {
    const el = createWrapperEl();
    mountDirective(datetimePlugin, 'h-datetime-picker', el, { original: 'h-datetime-picker', modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-datetime');
  });

  it('throws if no input child found', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(datetimePlugin, 'h-datetime-picker', el, { original: 'h-datetime-picker' })).toThrow();
  });

  it('assigns an id to the input if missing', () => {
    const el = createWrapperEl();
    mountDirective(datetimePlugin, 'h-datetime-picker', el, { original: 'h-datetime-picker' });
    expect(el._h_datetimepicker.input.hasAttribute('id')).toBe(true);
  });

  it('calls cleanup', () => {
    const el = createWrapperEl();
    const { ctx } = mountDirective(datetimePlugin, 'h-datetime-picker', el, { original: 'h-datetime-picker' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-datetime-picker-trigger', () => {
  let wrapperEl, triggerEl;

  beforeEach(() => {
    wrapperEl = document.createElement('div');
    wrapperEl._h_datetimepicker = { state: { expanded: false }, controls: 'dtp-1', inTable: false };
    triggerEl = document.createElement('button');
    triggerEl.setAttribute('aria-label', 'Choose date and time');
    wrapperEl.appendChild(triggerEl);
    document.body.appendChild(wrapperEl);
  });

  it('sets aria-haspopup="dialog", aria-controls and data-slot', () => {
    mountDirective(datetimePlugin, 'h-datetime-picker-trigger', triggerEl, { original: 'h-datetime-picker-trigger' });
    expect(triggerEl.getAttribute('aria-haspopup')).toBe('dialog');
    expect(triggerEl.getAttribute('aria-controls')).toBe('dtp-1');
    expect(triggerEl.getAttribute('data-slot')).toBe('datetime-picker-trigger');
  });

  it('throws if not a button', () => {
    const div = document.createElement('div');
    div.setAttribute('aria-label', 'x');
    wrapperEl.appendChild(div);
    expect(() => mountDirective(datetimePlugin, 'h-datetime-picker-trigger', div, { original: 'h-datetime-picker-trigger' })).toThrow();
  });

  it('a click inside the picker keeps the popover open; an outside click closes it', () => {
    const inside = document.createElement('div');
    wrapperEl.appendChild(inside);
    mountDirective(datetimePlugin, 'h-datetime-picker-trigger', triggerEl, { original: 'h-datetime-picker-trigger' });

    triggerEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datetimepicker.state.expanded).toBe(true);

    inside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datetimepicker.state.expanded).toBe(true);

    document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(wrapperEl._h_datetimepicker.state.expanded).toBe(false);
  });
});

describe('h-datetime-picker-popup', () => {
  function createPopup({ config = {}, model } = {}) {
    const wrapper = document.createElement('div');
    const input = document.createElement('input');
    wrapper.appendChild(input);
    const changeEvents = [];
    wrapper.addEventListener('change', (event) => changeEvents.push(event));
    wrapper._h_datetimepicker = { state: { expanded: false }, input, controls: 'c1' };
    const popupEl = document.createElement('div');
    popupEl.setAttribute('x-model', 'dt');
    wrapper.appendChild(popupEl);
    document.body.appendChild(wrapper);

    let modelValue = model;
    if (model !== undefined) {
      Object.defineProperty(popupEl, '_x_model', {
        value: { get: () => modelValue, set: (v) => (modelValue = v) },
        configurable: true,
      });
    }

    const { ctx } = mountDirective(datetimePlugin, 'h-datetime-picker-popup', popupEl, { original: 'h-datetime-picker-popup', expression: 'config' }, { evaluateLater: (expr) => (cb) => cb(expr === 'dt' ? modelValue : config) });

    const seg = (type) => popupEl.querySelector(`[role="spinbutton"][data-part="${type}"]`);
    const disp = (type) => {
      const s = seg(type);
      return s.tagName === 'INPUT' ? s.value : s.textContent;
    };
    const dayCell = (d) => popupEl.querySelector(`td[data-day="${d}"]`);
    const key = (target, k) => target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    const type = (target, digits) => {
      for (const ch of digits) {
        target.dispatchEvent(new InputEvent('beforeinput', { data: ch, inputType: 'insertText', bubbles: true, cancelable: true }));
      }
    };
    return { wrapper, popupEl, input, seg, disp, dayCell, key, type, ctx, changeEvents, getModel: () => modelValue };
  }

  it('builds a calendar and a time group with hour and minute spinbuttons', () => {
    const { popupEl, seg } = createPopup();
    expect(popupEl.querySelector('table')).toBeTruthy();
    expect(popupEl.querySelector('[role="group"]')).toBeTruthy();
    expect(seg('hour')).toBeTruthy();
    expect(seg('minute')).toBeTruthy();
    expect(seg('second')).toBeNull();
    expect(seg('period')).toBeNull();
  });

  it('adds a seconds segment when configured', () => {
    const { seg } = createPopup({ config: { seconds: true } });
    expect(seg('second')).toBeTruthy();
  });

  it('adds a period segment in 12-hour mode', () => {
    const { seg } = createPopup({ config: { is12Hour: true } });
    expect(seg('period')).toBeTruthy();
  });

  it('ArrowUp/Down on a segment changes and wraps the value', () => {
    const { seg, key, disp } = createPopup();
    const hour = seg('hour');
    key(hour, 'ArrowUp');
    expect(disp('hour')).toBe('00');
    expect(hour.getAttribute('aria-valuenow')).toBe('0');
    key(hour, 'ArrowDown');
    expect(disp('hour')).toBe('23');
    expect(hour.getAttribute('aria-valuenow')).toBe('23');
  });

  it('exposes numeric segments as inputs with inputmode="numeric" for the mobile keyboard', () => {
    const { seg } = createPopup();
    expect(seg('hour').tagName).toBe('INPUT');
    expect(seg('hour').getAttribute('inputmode')).toBe('numeric');
    expect(seg('minute').getAttribute('inputmode')).toBe('numeric');
  });

  it('accepts typed digits and auto-advances when the segment is full', () => {
    const { seg, disp, type } = createPopup();
    type(seg('hour'), '1'); // could still take a second digit
    expect(disp('hour')).toBe('01');
    type(seg('hour'), '4'); // 14 -> complete
    expect(disp('hour')).toBe('14');
    type(seg('minute'), '3'); // 3x > 59 -> commits and advances
    expect(disp('minute')).toBe('03');
  });

  it('restarts typing when the running value would exceed the maximum', () => {
    const { seg, disp, type } = createPopup();
    // minute: typing 7 cannot be a tens digit (>59), so it commits as 07
    type(seg('minute'), '7');
    expect(disp('minute')).toBe('07');
  });

  it('seeds the segments and main input from an ISO model', () => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-15T14:30`;
    const { disp, input } = createPopup({ model: iso });
    expect(disp('hour')).toBe('14');
    expect(disp('minute')).toBe('30');
    expect(input.value).toContain('14:30');
  });

  it('infers a seconds segment from a model value carrying seconds', () => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-15T14:30:05`;
    const { seg, disp } = createPopup({ model: iso });
    expect(seg('second')).toBeTruthy();
    expect(disp('second')).toBe('05');
  });

  it('writes a model from typed digits plus a picked day', () => {
    const now = new Date();
    const { seg, type, dayCell, getModel } = createPopup({ model: '' });
    type(seg('hour'), '14');
    type(seg('minute'), '30');
    dayCell(20).click();
    expect(getModel()).toBe(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-20T14:30`);
  });

  it('writes a YYYY-MM-DDTHH:mm model only once both date and time are set', () => {
    const now = new Date();
    const { seg, dayCell, key, getModel } = createPopup({ model: '' });
    // time only -> no date yet -> model empty
    key(seg('hour'), 'ArrowUp');
    key(seg('minute'), 'ArrowUp');
    expect(getModel()).toBe('');
    // pick a day -> now complete
    dayCell(15).click();
    expect(getModel()).toBe(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-15T00:00`);
  });

  it('dispatches a bubbling change event once user interaction completes the value', () => {
    const { seg, key, dayCell, changeEvents } = createPopup({ model: '' });
    // time only -> value still incomplete -> no event
    key(seg('hour'), 'ArrowUp');
    key(seg('minute'), 'ArrowUp');
    expect(changeEvents.length).toBe(0);
    // picking a day completes the value -> one bubbling change on the input
    dayCell(15).click();
    expect(changeEvents.length).toBe(1);
    expect(changeEvents[0].type).toBe('change');
    expect(changeEvents[0].bubbles).toBe(true);
    // adjusting a segment now changes the complete value -> another event
    key(seg('hour'), 'ArrowUp');
    expect(changeEvents.length).toBe(2);
  });

  it('does not dispatch a change event for a programmatic model update', () => {
    const now = new Date();
    const iso = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-15T14:30`;
    const { changeEvents } = createPopup({ model: iso });
    expect(changeEvents.length).toBe(0);
  });

  it('writes a 24-hour model from 12-hour segments', () => {
    const now = new Date();
    const { seg, dayCell, key, getModel } = createPopup({ config: { is12Hour: true }, model: '' });
    key(seg('hour'), 'ArrowUp'); // 01
    key(seg('minute'), 'ArrowUp'); // 00
    key(seg('period'), 'ArrowUp'); // AM
    key(seg('period'), 'ArrowUp'); // PM -> 13:00
    dayCell(10).click();
    expect(getModel()).toBe(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-10T13:00`);
  });

  it('does not close the popover when a day is selected', () => {
    const { wrapper, dayCell } = createPopup({ model: '' });
    wrapper._h_datetimepicker.state.expanded = true;
    dayCell(12).click();
    expect(wrapper._h_datetimepicker.state.expanded).toBe(true);
  });

  it('Escape on a time segment closes the popover', () => {
    const { wrapper, seg, key } = createPopup({ model: '' });
    wrapper._h_datetimepicker.state.expanded = true;
    key(seg('hour'), 'Escape');
    expect(wrapper._h_datetimepicker.state.expanded).toBe(false);
  });

  it('warns and returns early when not inside a datetime-picker', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    const consoleSpy = vi.spyOn(console, 'warn');
    mountDirective(datetimePlugin, 'h-datetime-picker-popup', orphan, { original: 'h-datetime-picker-popup', expression: '' });
    expect(consoleSpy).toHaveBeenCalled();
    expect(orphan.querySelector('table')).toBeNull();
    consoleSpy.mockRestore();
  });

  it('calls cleanup', () => {
    const { ctx } = createPopup();
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
