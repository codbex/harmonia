import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import monthPickerPlugin from '../../src/components/month-picker.js';
import { mountDirective } from '../test-utils.js';

function createWrapper() {
  const el = document.createElement('div');
  const input = document.createElement('input');
  el.appendChild(input);
  document.body.appendChild(el);
  return el;
}

describe('h-month-picker', () => {
  it('registers the three month-picker directives', () => {
    const el = createWrapper();
    const { alpine } = mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' });
    expect(alpine._directives['h-month-picker']).toBeDefined();
    expect(alpine._directives['h-month-picker-trigger']).toBeDefined();
    expect(alpine._directives['h-month-picker-popup']).toBeDefined();
  });

  it('throws when the wrapper has no input', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    expect(() => mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' })).toThrow();
  });

  it('sets data-slot="month-picker" (standalone) and forces the input to type=text', () => {
    const el = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker' });
    expect(el.getAttribute('data-slot')).toBe('month-picker');
    expect(el.querySelector('input').getAttribute('type')).toBe('text');
    expect(el.querySelector('input').getAttribute('id')).toBeTruthy();
  });

  it('sets data-slot="cell-input-month" with the table modifier', () => {
    const el = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', el, { original: 'h-month-picker', modifiers: ['table'] });
    expect(el.getAttribute('data-slot')).toBe('cell-input-month');
  });
});

describe('h-month-picker-trigger', () => {
  let wrapper;
  let trigger;

  beforeEach(() => {
    wrapper = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', wrapper, { original: 'h-month-picker' });
    trigger = document.createElement('button');
    trigger.setAttribute('aria-label', 'Choose month');
    wrapper.appendChild(trigger);
  });

  it('sets data-slot + aria-haspopup="dialog"', () => {
    mountDirective(monthPickerPlugin, 'h-month-picker-trigger', trigger, { original: 'h-month-picker-trigger' });
    expect(trigger.getAttribute('data-slot')).toBe('month-picker-trigger');
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('throws when not a button', () => {
    const div = document.createElement('div');
    div.setAttribute('aria-label', 'Choose month');
    wrapper.appendChild(div);
    expect(() => mountDirective(monthPickerPlugin, 'h-month-picker-trigger', div, { original: 'h-month-picker-trigger' })).toThrow();
  });
});

describe('h-month-picker-popup', () => {
  let wrapper;
  let popup;

  beforeEach(() => {
    wrapper = createWrapper();
    mountDirective(monthPickerPlugin, 'h-month-picker', wrapper, { original: 'h-month-picker' });
    popup = document.createElement('div');
    wrapper.appendChild(popup);
  });

  it('renders a twelve-month grid', () => {
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });
    expect(popup.querySelectorAll('[data-month]').length).toBe(12);
  });

  it('selecting a month writes a YYYY-MM model value and closes', () => {
    popup._x_model = {
      value: '',
      get() {
        return this.value;
      },
      set(v) {
        this.value = v;
      },
    };
    popup.setAttribute('x-model', 'form.month');
    mountDirective(monthPickerPlugin, 'h-month-picker-popup', popup, { original: 'h-month-picker-popup' });

    popup.querySelector('[data-month="5"]').click(); // June (0-based)

    expect(popup._x_model.value).toMatch(/^\d{4}-06$/);
    expect(wrapper._h_monthpicker.state.expanded).toBe(false);
    expect(wrapper.querySelector('input').value).not.toBe('');
  });
});
