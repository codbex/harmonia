import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import weekPickerPlugin from '../../src/components/week-picker.js';
import { mountDirective } from '../test-utils.js';

function createWrapper() {
  const el = document.createElement('div');
  const input = document.createElement('input');
  el.appendChild(input);
  document.body.appendChild(el);
  return el;
}

describe('h-week-picker', () => {
  it('registers the three week-picker directives', () => {
    const el = createWrapper();
    const { alpine } = mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' });
    expect(alpine._directives['h-week-picker']).toBeDefined();
    expect(alpine._directives['h-week-picker-trigger']).toBeDefined();
    expect(alpine._directives['h-week-picker-popup']).toBeDefined();
  });

  it('throws when the wrapper has no input', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' })).toThrow();
  });

  it('sets data-slot="week-picker" (standalone) and forces the input to type=text', () => {
    const el = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker' });
    expect(el.getAttribute('data-slot')).toBe('week-picker');
    expect(el.querySelector('input').getAttribute('type')).toBe('text');
  });

  it('sets data-slot="cell-input-week" with the table modifier', () => {
    const el = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', el, { original: 'h-week-picker', modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-week');
  });
});

describe('h-week-picker-trigger', () => {
  let wrapper;
  let trigger;

  beforeEach(() => {
    wrapper = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', wrapper, { original: 'h-week-picker' });
    trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose week');
    wrapper.appendChild(trigger);
  });

  it('sets data-slot + aria-haspopup="dialog"', () => {
    mountDirective(weekPickerPlugin, 'h-week-picker-trigger', trigger, { original: 'h-week-picker-trigger' });
    expect(trigger.getAttribute('data-slot')).toBe('week-picker-trigger');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });
});

describe('h-week-picker-popup', () => {
  let wrapper;
  let popup;

  beforeEach(() => {
    wrapper = createWrapper();
    mountDirective(weekPickerPlugin, 'h-week-picker', wrapper, { original: 'h-week-picker' });
    popup = document.createElement('div');
    wrapper.appendChild(popup);
  });

  it('renders six week rows', () => {
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });
    expect(popup.querySelectorAll('[role="row"]').length).toBe(6);
  });

  it('selecting a week writes a YYYY-Www model value and closes', () => {
    popup._x_model = {
      value: '',
      get() {
        return this.value;
      },
      set(v) {
        this.value = v;
      },
    };
    popup.setAttribute('x-model', 'form.week');
    mountDirective(weekPickerPlugin, 'h-week-picker-popup', popup, { original: 'h-week-picker-popup' });

    popup.querySelector('[role="row"]').click();

    expect(popup._x_model.value).toMatch(/^\d{4}-W\d{2}$/);
    expect(wrapper._h_weekpicker.state.expanded).toBe(false);
    expect(wrapper.querySelector('input').value).toMatch(/^Week \d+, \d{4}$/);
  });
});
