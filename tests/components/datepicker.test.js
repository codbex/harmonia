import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import datepickerPlugin from '../../src/components/datepicker.js';
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
});
