import { afterEach, describe, expect, it, vi } from 'vitest';
import rangePlugin from '../../src/components/range.js';
import { mountDirective } from '../test-utils.js';

function createRange(attrs = {}, modifiers = [], setup) {
  const el = document.createElement('div');
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
  if (setup) setup(el);
  if (!Array.from(el.children).some((child) => child.tagName === 'INPUT')) el.appendChild(document.createElement('input'));
  const mounted = mountDirective(rangePlugin, 'h-range', el, { modifiers, original: 'x-h-range' });
  return {
    ...mounted,
    input: el.querySelector('input'),
    fill: el.querySelector('[data-slot="range-fill"]'),
    handles: [...el.querySelectorAll('[data-slot="range-handle"]')],
  };
}

const withInput =
  (attrs = {}) =>
  (el) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    for (const [name, value] of Object.entries(attrs)) input.setAttribute(name, value);
    el.appendChild(input);
    return input;
  };

const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
const pointer = (el, type, coords = {}) => el.dispatchEvent(new MouseEvent(type, { bubbles: true, ...coords }));

function stubRect(el, rect) {
  el.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, ...rect });
}

describe('h-range', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('structure', () => {
    it('sets data-slot and horizontal defaults', () => {
      const { el, fill, handles } = createRange();
      expect(el.getAttribute('data-slot')).toBe('range');
      expect(el.getAttribute('data-orientation')).toBe('horizontal');
      expect(el.classList.contains('h-2')).toBe(true);
      expect(el.classList.contains('w-full')).toBe(true);
      expect(fill.classList.contains('inset-y-0')).toBe(true);
      expect(fill.classList.contains('bg-primary')).toBe(true);
      expect(handles).toHaveLength(1);
      expect(handles[0].getAttribute('role')).toBe('slider');
      expect(handles[0].getAttribute('tabindex')).toBe('0');
      expect(handles[0].getAttribute('aria-orientation')).toBe('horizontal');
      expect(handles[0].getAttribute('aria-valuemin')).toBe('0');
      expect(handles[0].getAttribute('aria-valuemax')).toBe('100');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('0');
      expect(handles[0].getAttribute('aria-label')).toBe('Value');
      expect(el.querySelector('[data-slot="range-tooltip"]')).toBeNull();
    });

    it('applies the vertical modifier', () => {
      const { el, fill, handles } = createRange({ 'data-value': '25' }, ['vertical']);
      expect(el.getAttribute('data-orientation')).toBe('vertical');
      expect(el.classList.contains('w-2')).toBe(true);
      expect(fill.classList.contains('inset-x-0')).toBe(true);
      expect(handles[0].getAttribute('aria-orientation')).toBe('vertical');
      expect(handles[0].style.bottom).toBe('25%');
      expect(fill.style.height).toBe('25%');
    });

    it('builds two handles and a group in dual mode', () => {
      const { el, handles } = createRange({}, ['dual']);
      expect(handles).toHaveLength(2);
      expect(el.getAttribute('role')).toBe('group');
      expect(el.getAttribute('aria-label')).toBe('Range');
      expect(handles[0].getAttribute('data-index')).toBe('0');
      expect(handles[1].getAttribute('data-index')).toBe('1');
      expect(handles[0].getAttribute('aria-label')).toBe('Minimum');
      expect(handles[1].getAttribute('aria-label')).toBe('Maximum');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('0');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('100');
    });

    it('honors label overrides', () => {
      const { el, handles } = createRange({ 'data-label': 'Price', 'data-min-label': 'From', 'data-max-label': 'To' }, ['dual']);
      expect(el.getAttribute('aria-label')).toBe('Price');
      expect(handles[0].getAttribute('aria-label')).toBe('From');
      expect(handles[1].getAttribute('aria-label')).toBe('To');
    });

    it('throws without a native input child', () => {
      const el = document.createElement('div');
      expect(() => mountDirective(rangePlugin, 'h-range', el, { modifiers: [], original: 'x-h-range' })).toThrow(/must contain a native input/);
    });

    it('falls back to defaults on an invalid min/max pair', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const { handles } = createRange({ 'data-min': '50', 'data-max': '10' });
      expect(warn).toHaveBeenCalled();
      expect(handles[0].getAttribute('aria-valuemin')).toBe('0');
      expect(handles[0].getAttribute('aria-valuemax')).toBe('100');
    });
  });

  describe('initial value', () => {
    it('parses data-value and positions the handle', () => {
      const { fill, handles } = createRange({ 'data-value': '40' });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('40');
      expect(handles[0].style.insetInlineStart).toBe('40%');
      expect(fill.style.width).toBe('40%');
    });

    it('snaps data-value to the step', () => {
      const { handles } = createRange({ 'data-value': '42', 'data-step': '10' });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('40');
    });

    it('sorts a reversed dual data-value', () => {
      const { fill, handles } = createRange({ 'data-value': '80,20' }, ['dual']);
      expect(handles[0].getAttribute('aria-valuenow')).toBe('20');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('80');
      expect(fill.style.insetInlineStart).toBe('20%');
      expect(fill.style.width).toBe('60%');
    });
  });

  describe('keyboard', () => {
    it('steps with arrows and jumps with Home/End and PageUp/PageDown', () => {
      const { handles } = createRange({ 'data-value': '50' });
      key(handles[0], 'ArrowRight');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('51');
      key(handles[0], 'ArrowUp');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('52');
      key(handles[0], 'ArrowLeft');
      key(handles[0], 'ArrowDown');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
      key(handles[0], 'PageUp');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('60');
      key(handles[0], 'PageDown');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
      key(handles[0], 'Home');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('0');
      key(handles[0], 'End');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('100');
    });

    it('keeps decimal steps free of float noise', () => {
      const { handles } = createRange({ 'data-min': '0', 'data-max': '1', 'data-step': '0.1' });
      key(handles[0], 'ArrowRight');
      key(handles[0], 'ArrowRight');
      key(handles[0], 'ArrowRight');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('0.3');
    });

    it('flips horizontal arrows in RTL', () => {
      vi.stubGlobal('getComputedStyle', () => ({ direction: 'rtl' }));
      const { handles } = createRange({ 'data-value': '50' });
      key(handles[0], 'ArrowRight');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('49');
      key(handles[0], 'ArrowLeft');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
    });

    it('dispatches a change CustomEvent with the value as detail', () => {
      const { el, handles } = createRange({ 'data-value': '50' });
      const onChange = vi.fn();
      el.addEventListener('change', onChange);
      key(handles[0], 'ArrowRight');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].detail).toBe(51);
    });

    it('does not let dual handles cross', () => {
      const { el, handles } = createRange({ 'data-value': '20,80' }, ['dual']);
      const onChange = vi.fn();
      el.addEventListener('change', onChange);
      key(handles[0], 'End');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('80');
      expect(onChange.mock.calls[0][0].detail).toEqual([80, 80]);
      key(handles[1], 'Home');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('80');
    });

    it('updates the moving bounds of dual handles', () => {
      const { handles } = createRange({ 'data-value': '20,80' }, ['dual']);
      expect(handles[0].getAttribute('aria-valuemax')).toBe('80');
      expect(handles[1].getAttribute('aria-valuemin')).toBe('20');
      key(handles[0], 'ArrowRight');
      expect(handles[1].getAttribute('aria-valuemin')).toBe('21');
    });
  });

  describe('pointer', () => {
    it('jumps to the pressed position and drags live', () => {
      const { el, handles } = createRange();
      stubRect(el, { left: 0, right: 200, width: 200 });
      const onInput = vi.fn();
      const onChange = vi.fn();
      el.addEventListener('input', onInput);
      el.addEventListener('change', onChange);

      pointer(el, 'pointerdown', { clientX: 100 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
      expect(onInput).toHaveBeenCalledTimes(1);
      expect(onInput.mock.calls[0][0].detail).toBe(50);
      expect(handles[0].hasAttribute('data-active')).toBe(true);
      expect(handles[0].classList.contains('ring-4')).toBe(true);

      pointer(el, 'pointermove', { clientX: 150 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('75');
      expect(onChange).not.toHaveBeenCalled();

      pointer(el, 'pointerup');
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].detail).toBe(75);
      expect(handles[0].hasAttribute('data-active')).toBe(false);
      expect(handles[0].classList.contains('ring-4')).toBe(false);
    });

    it('does not dispatch change when the value did not move', () => {
      const { el } = createRange({ 'data-value': '50' });
      stubRect(el, { left: 0, right: 200, width: 200 });
      const onChange = vi.fn();
      el.addEventListener('change', onChange);
      pointer(el, 'pointerdown', { clientX: 100 });
      pointer(el, 'pointerup');
      expect(onChange).not.toHaveBeenCalled();
    });

    it('ignores pointer moves without a preceding press', () => {
      const { el, handles } = createRange({ 'data-value': '50' });
      stubRect(el, { left: 0, right: 200, width: 200 });
      pointer(el, 'pointermove', { clientX: 180 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
    });

    it('ignores presses while the track has no size', () => {
      const { el, handles } = createRange();
      const onInput = vi.fn();
      el.addEventListener('input', onInput);
      pointer(el, 'pointerdown', { clientX: 100 });
      expect(onInput).not.toHaveBeenCalled();
      expect(handles[0].getAttribute('aria-valuenow')).toBe('0');
    });

    it('moves the nearest handle in dual mode', () => {
      const { el, handles } = createRange({ 'data-value': '20,80' }, ['dual']);
      stubRect(el, { left: 0, right: 100, width: 100 });
      pointer(el, 'pointerdown', { clientX: 30 });
      pointer(el, 'pointerup');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('30');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('80');
      pointer(el, 'pointerdown', { clientX: 70 });
      pointer(el, 'pointerup');
      expect(handles[0].getAttribute('aria-valuenow')).toBe('30');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('70');
    });

    it('picks the high handle when overlapping handles are pressed above', () => {
      const { el, handles } = createRange({ 'data-value': '50,50' }, ['dual']);
      stubRect(el, { left: 0, right: 100, width: 100 });
      pointer(el, 'pointerdown', { clientX: 70 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('70');
    });

    it('clamps a dragged dual handle at its sibling', () => {
      const { el, handles } = createRange({ 'data-value': '20,80' }, ['dual']);
      stubRect(el, { left: 0, right: 100, width: 100 });
      pointer(el, 'pointerdown', { clientX: 25 });
      pointer(el, 'pointermove', { clientX: 95 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('80');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('80');
    });

    it('maps vertical pointers bottom-up', () => {
      const { el, handles } = createRange({}, ['vertical']);
      stubRect(el, { top: 0, bottom: 200, height: 200 });
      pointer(el, 'pointerdown', { clientY: 50 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('75');
    });

    it('mirrors horizontal pointer math in RTL', () => {
      vi.stubGlobal('getComputedStyle', () => ({ direction: 'rtl' }));
      const { el, handles } = createRange();
      stubRect(el, { left: 0, right: 200, width: 200 });
      pointer(el, 'pointerdown', { clientX: 150 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('25');
    });
  });

  describe('x-model', () => {
    const withModel = (initial) => (el) => {
      const model = { value: initial, get: vi.fn(() => model.value), set: vi.fn((v) => (model.value = v)) };
      Object.defineProperty(el, '_x_model', { value: model, configurable: true });
      return model;
    };

    it('pulls the bound value on init without writing back', () => {
      let model;
      const { handles } = createRange({}, [], (el) => {
        model = { value: 42.37, get: vi.fn(() => model.value), set: vi.fn() };
        Object.defineProperty(el, '_x_model', { value: model, configurable: true });
      });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('42');
      expect(model.set).not.toHaveBeenCalled();
    });

    it('writes numbers to the model on interaction', () => {
      let model;
      const { handles } = createRange({ 'data-value': '50' }, [], (el) => {
        model = withModel(50)(el);
      });
      key(handles[0], 'ArrowRight');
      expect(model.set).toHaveBeenCalledWith(51);
    });

    it('writes a [low, high] array in dual mode', () => {
      let model;
      const { handles } = createRange({ 'data-value': '20,80' }, ['dual'], (el) => {
        model = withModel([20, 80])(el);
      });
      key(handles[1], 'ArrowLeft');
      expect(model.set).toHaveBeenCalledWith([20, 79]);
    });

    it('reorders a reversed dual model value', () => {
      const { handles } = createRange({}, ['dual'], withModel([80, 20]));
      expect(handles[0].getAttribute('aria-valuenow')).toBe('20');
      expect(handles[1].getAttribute('aria-valuenow')).toBe('80');
    });

    it('ignores an unusable model value', () => {
      const { handles } = createRange({ 'data-value': '30' }, [], withModel('abc'));
      expect(handles[0].getAttribute('aria-valuenow')).toBe('30');
    });
  });

  describe('disabled', () => {
    it('makes handles inert while the input is disabled', () => {
      const { el, handles } = createRange({ 'data-value': '50' }, [], withInput({ disabled: '' }));
      stubRect(el, { left: 0, right: 200, width: 200 });
      expect(handles[0].getAttribute('tabindex')).toBe('-1');
      expect(handles[0].getAttribute('aria-disabled')).toBe('true');
      key(handles[0], 'ArrowRight');
      pointer(el, 'pointerdown', { clientX: 150 });
      expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
    });

    it('reacts to the input disabled attribute at runtime', async () => {
      const { input, handles } = createRange();
      input.setAttribute('disabled', '');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(handles[0].getAttribute('tabindex')).toBe('-1');
      input.removeAttribute('disabled');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(handles[0].getAttribute('tabindex')).toBe('0');
      expect(handles[0].getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('form input', () => {
    it('hides the inner input but keeps it validatable', () => {
      const { input } = createRange({ 'data-value': '40' }, [], withInput({ name: 'volume' }));
      expect(input.getAttribute('data-slot')).toBe('range-input');
      expect(input.classList.contains('absolute')).toBe(true);
      expect(input.classList.contains('inset-0')).toBe(true);
      expect(input.classList.contains('opacity-0')).toBe(true);
      expect(input.classList.contains('pointer-events-none')).toBe(true);
      expect(input.getAttribute('tabindex')).toBe('-1');
      expect(input.getAttribute('aria-hidden')).toBe('true');
      expect(input.value).toBe('40');
      expect(input.defaultValue).toBe('40');
    });

    it('warns about a type="hidden" input', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      createRange({}, [], withInput({ type: 'hidden' }));
      expect(warn).toHaveBeenCalled();
    });

    it('keeps the input value in sync with interactions', () => {
      const { el, input, handles } = createRange({ 'data-value': '40' });
      key(handles[0], 'ArrowRight');
      expect(input.value).toBe('41');
      stubRect(el, { left: 0, right: 200, width: 200 });
      pointer(el, 'pointerdown', { clientX: 100 });
      expect(input.value).toBe('50');
    });

    it('holds dual values as low,high', () => {
      const { input, handles } = createRange({ 'data-value': '20,80' }, ['dual']);
      expect(input.value).toBe('20,80');
      key(handles[1], 'ArrowLeft');
      expect(input.value).toBe('20,79');
    });

    it('follows a form reset back to the initial values', async () => {
      const form = document.createElement('form');
      document.body.appendChild(form);
      let model;
      const { el, ctx, input, handles } = createRange({ 'data-value': '40' }, [], (elem) => {
        form.appendChild(elem);
        model = { value: 40, get: vi.fn(() => model.value), set: vi.fn((v) => (model.value = v)) };
        Object.defineProperty(elem, '_x_model', { value: model, configurable: true });
      });
      const onChange = vi.fn();
      el.addEventListener('change', onChange);
      key(handles[0], 'ArrowRight');
      expect(input.value).toBe('41');

      form.dispatchEvent(new Event('reset'));
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(handles[0].getAttribute('aria-valuenow')).toBe('40');
      expect(input.value).toBe('40');
      expect(model.set).toHaveBeenCalledWith(40);
      expect(onChange.mock.calls.at(-1)[0].detail).toBe(40);

      // The reset listener is removed with the directive.
      key(handles[0], 'ArrowRight');
      ctx.cleanup.mock.calls[0][0]();
      form.dispatchEvent(new Event('reset'));
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(handles[0].getAttribute('aria-valuenow')).toBe('41');
      form.remove();
    });
  });

  describe('invalid', () => {
    it('carries the invalid and disabled styling variants', () => {
      const { el, fill, handles } = createRange();
      expect(el.classList.contains('has-[input[aria-invalid=true]]:border-negative')).toBe(true);
      expect(el.classList.contains('has-[input:user-invalid]:border-negative')).toBe(true);
      expect(el.classList.contains('[[data-validate=immediate]_&:has(input:invalid)]:border-negative')).toBe(true);
      expect(fill.classList.contains('[input[aria-invalid=true]~&]:bg-negative')).toBe(true);
      expect(fill.classList.contains('[input:user-invalid~&]:bg-negative')).toBe(true);
      expect(fill.classList.contains('[[data-validate=immediate]_input:invalid~&]:bg-negative')).toBe(true);
      expect(fill.classList.contains('[input:disabled~&]:bg-muted')).toBe(true);
      expect(handles[0].classList.contains('[input[aria-invalid=true]~&]:border-negative')).toBe(true);
      expect(handles[0].classList.contains('[input:user-invalid~&]:ring-negative/20')).toBe(true);
      expect(handles[0].classList.contains('[[data-validate=immediate]_input:invalid~&]:border-negative')).toBe(true);
      expect(handles[0].classList.contains('[input:disabled~&]:border-muted')).toBe(true);
    });

    it('mirrors the input aria-invalid onto the handles', async () => {
      const { input, handles } = createRange({}, ['dual'], withInput({ 'aria-invalid': 'true' }));
      expect(handles[0].getAttribute('aria-invalid')).toBe('true');
      expect(handles[1].getAttribute('aria-invalid')).toBe('true');
      input.removeAttribute('aria-invalid');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(handles[0].hasAttribute('aria-invalid')).toBe(false);
      input.setAttribute('aria-invalid', 'true');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(handles[1].getAttribute('aria-invalid')).toBe('true');
    });

    it('marks the handles invalid on the native invalid event and clears on valid', () => {
      const { ctx, input, handles } = createRange({ 'data-value': '50' });
      input.setCustomValidity('too high');
      input.dispatchEvent(new Event('invalid'));
      expect(handles[0].getAttribute('aria-invalid')).toBe('true');
      // Still invalid: a change leaves the mark in place.
      key(handles[0], 'ArrowRight');
      expect(handles[0].getAttribute('aria-invalid')).toBe('true');
      // Back to valid: the next change clears it.
      input.setCustomValidity('');
      key(handles[0], 'ArrowRight');
      expect(handles[0].hasAttribute('aria-invalid')).toBe(false);
      // The invalid listener is removed with the directive.
      ctx.cleanup.mock.calls[0][0]();
      input.dispatchEvent(new Event('invalid'));
      expect(handles[0].hasAttribute('aria-invalid')).toBe(false);
    });

    it('shows a failing constraint at init inside data-validate=immediate', () => {
      const { handles } = createRange({}, [], (el) => {
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-validate', 'immediate');
        wrapper.appendChild(el);
        withInput()(el).setCustomValidity('bad');
      });
      expect(handles[0].getAttribute('aria-invalid')).toBe('true');
    });

    it('lets an explicit aria-invalid on the input win over native validity', () => {
      const { handles } = createRange({}, [], (el) => {
        withInput({ 'aria-invalid': 'false' })(el).setCustomValidity('bad');
      });
      expect(handles[0].getAttribute('aria-invalid')).toBe('false');
      key(handles[0], 'ArrowRight');
      expect(handles[0].getAttribute('aria-invalid')).toBe('false');
    });
  });

  describe('tooltips', () => {
    it('renders the value with the unit suffix', () => {
      const { el, handles } = createRange({ 'data-tooltips': 'true', 'data-unit': '%', 'data-value': '30' });
      const tooltip = el.querySelector('[data-slot="range-tooltip"]');
      expect(tooltip.textContent).toBe('30%');
      expect(tooltip.classList.contains('hidden')).toBe(false);
      expect(handles[0].getAttribute('aria-valuetext')).toBe('30%');
      key(handles[0], 'ArrowRight');
      expect(tooltip.textContent).toBe('31%');
    });

    it('shows auto tooltips only while the handle has focus', () => {
      const { el, handles } = createRange({ 'data-tooltips': 'auto' });
      const tooltip = el.querySelector('[data-slot="range-tooltip"]');
      expect(tooltip.classList.contains('hidden')).toBe(true);
      handles[0].dispatchEvent(new Event('focus'));
      expect(tooltip.classList.contains('hidden')).toBe(false);
      handles[0].dispatchEvent(new Event('blur'));
      expect(tooltip.classList.contains('hidden')).toBe(true);
    });
  });

  it('stops reacting after cleanup', () => {
    const { el, ctx, handles } = createRange({ 'data-value': '50' });
    stubRect(el, { left: 0, right: 200, width: 200 });
    expect(ctx.cleanup).toHaveBeenCalledTimes(1);
    ctx.cleanup.mock.calls[0][0]();
    key(handles[0], 'ArrowRight');
    pointer(el, 'pointerdown', { clientX: 150 });
    expect(handles[0].getAttribute('aria-valuenow')).toBe('50');
  });
});
