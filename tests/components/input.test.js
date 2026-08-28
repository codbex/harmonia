import { beforeEach, describe, expect, it, vi } from 'vitest';
import inputPlugin from '../../src/components/input.js';
import { mountDirective } from '../test-utils.js';

describe('h-input', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('input');
    document.body.appendChild(el);
  });

  it('registers all input-related directives', () => {
    const { alpine } = mountDirective(inputPlugin, 'h-input', el);
    expect(alpine._directives['h-input']).toBeDefined();
    expect(alpine._directives['h-input-group']).toBeDefined();
    expect(alpine._directives['h-input-group-addon']).toBeDefined();
    expect(alpine._directives['h-input-group-text']).toBeDefined();
    expect(alpine._directives['h-input-number']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(inputPlugin, 'h-input', el);
    expect(el.classList.contains('border-input')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
    expect(el.classList.contains('outline-none')).toBe(true);
    expect(el.classList.contains('transition-[color,box-shadow]')).toBe(true);
  });

  it('defers native-constraint styling to :user-invalid with an immediate opt-in', () => {
    mountDirective(inputPlugin, 'h-input', el);
    // deferred baseline (shows after interaction/submit)
    expect(el.classList.contains('user-invalid:border-negative!')).toBe(true);
    expect(el.classList.contains('user-invalid:ring-negative/20!')).toBe(true);
    // immediate opt-in, gated by a data-validate="immediate" ancestor
    expect(el.classList.contains('[[data-validate=immediate]_&:invalid]:border-negative!')).toBe(true);
    // the bare :invalid (on-load) element class is gone
    expect(el.classList.contains('invalid:border-negative!')).toBe(false);
    // aria-invalid (explicit) styling is unchanged
    expect(el.classList.contains('aria-invalid:border-negative')).toBe(true);
  });

  it('sets data-slot="input" by default', () => {
    mountDirective(inputPlugin, 'h-input', el);
    expect(el.getAttribute('data-slot')).toBe('input');
  });

  it('applies the readonly background class', () => {
    mountDirective(inputPlugin, 'h-input', el);
    expect(el.classList.contains('[&[readonly]]:bg-muted')).toBe(true);
  });

  it('adds standard input classes by default', () => {
    mountDirective(inputPlugin, 'h-input', el);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('bg-input-inner')).toBe(true);
    expect(el.classList.contains('shadow-input')).toBe(true);
  });

  it('adds group classes with group modifier', () => {
    mountDirective(inputPlugin, 'h-input', el, { modifiers: ['group'] });
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('rounded-none')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('input-group-control');
  });

  it('adds table classes with table modifier', () => {
    mountDirective(inputPlugin, 'h-input', el, { modifiers: ['table'] });
    expect(el.classList.contains('size-full')).toBe(true);
    expect(el.classList.contains('h-10')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('cell-input');
  });

  it('calls cleanup for default input (sizeObserver)', () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-input-group', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(inputPlugin, 'h-input-group', el);
    expect(el.classList.contains('border-input')).toBe(true);
    expect(el.classList.contains('bg-input-inner')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('shadow-input')).toBe(true);
  });

  it('sets role="group"', () => {
    mountDirective(inputPlugin, 'h-input-group', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets data-slot="input-group"', () => {
    mountDirective(inputPlugin, 'h-input-group', el);
    expect(el.getAttribute('data-slot')).toBe('input-group');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-group', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-input-group-addon', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('cursor-text')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('sets role="group"', () => {
    mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets data-slot="input-group-addon"', () => {
    mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(el.getAttribute('data-slot')).toBe('input-group-addon');
  });

  it('applies inline-start variant classes by default', () => {
    mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(el.classList.contains('order-first')).toBe(true);
    expect(el.classList.contains('pl-3')).toBe(true);
  });

  it('applies inline-end variant classes when data-align="inline-end"', () => {
    el.setAttribute('data-align', 'inline-end');
    mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(el.classList.contains('order-last')).toBe(true);
    expect(el.classList.contains('pr-3')).toBe(true);
  });

  it('applies block-start variant classes when data-align="block-start"', () => {
    el.setAttribute('data-align', 'block-start');
    mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(el.classList.contains('order-first')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('px-3')).toBe(true);
    expect(el.classList.contains('pt-3')).toBe(true);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-group-addon', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-input-group-text', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('span');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(inputPlugin, 'h-input-group-text', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
  });

  it('sets data-slot="label"', () => {
    mountDirective(inputPlugin, 'h-input-group-text', el);
    expect(el.getAttribute('data-slot')).toBe('label');
  });
});

describe('h-input-number', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    el.appendChild(input);
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('shadow-input')).toBe(true);
  });

  it('sets role="group"', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets data-slot="input-number"', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(el.getAttribute('data-slot')).toBe('input-number');
  });

  it('throws if no number input is found', () => {
    const divOnly = document.createElement('div');
    document.body.appendChild(divOnly);
    expect(() => mountDirective(inputPlugin, 'h-input-number', divOnly, { original: 'h-input-number' })).toThrow();
  });

  it('throws if input is not type number', () => {
    const div = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    div.appendChild(input);
    document.body.appendChild(div);
    expect(() => mountDirective(inputPlugin, 'h-input-number', div, { original: 'h-input-number' })).toThrow();
  });

  it('appends step-down and step-up buttons', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const buttons = el.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('keeps a plain divider on the buttons when not in a table', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    for (const button of el.querySelectorAll('button')) {
      expect(button.classList.contains('border-l')).toBe(true);
    }
  });

  it('step-down button has aria-label="Decrease"', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const [stepDown] = el.querySelectorAll('button');
    expect(stepDown.getAttribute('aria-label')).toBe('Decrease');
  });

  it('step-up button has aria-label="Increase"', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const buttons = el.querySelectorAll('button');
    const stepUp = buttons[buttons.length - 1];
    expect(stepUp.getAttribute('aria-label')).toBe('Increase');
  });

  it('sets inputmode="decimal" on the input', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    expect(input.getAttribute('inputmode')).toBe('decimal');
  });

  it('keeps an authored inputmode', () => {
    const input = el.querySelector('input');
    input.setAttribute('inputmode', 'numeric');
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(input.getAttribute('inputmode')).toBe('numeric');
  });

  it('assigns data-slot to both step triggers', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const [stepDown, stepUp] = el.querySelectorAll('button');
    expect(stepDown.getAttribute('data-slot')).toBe('step-down-trigger');
    expect(stepUp.getAttribute('data-slot')).toBe('step-up-trigger');
  });

  it('applies the readonly classes to the wrapper and hides the steppers', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(el.classList.contains('has-[input[readonly]]:bg-muted')).toBe(true);
    const buttons = el.querySelectorAll('button');
    for (const button of buttons) {
      expect(button.classList.contains('group-has-[input[readonly]]/input-number:hidden')).toBe(true);
    }
  });

  it('steppers change the value of an editable input', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    input.setAttribute('step', 'any');
    input.value = '4';
    const buttons = el.querySelectorAll('button');
    const stepUp = buttons[buttons.length - 1];
    stepUp.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(input.value).toBe('5');
  });

  it('steppers do not change the value of a readonly input', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    input.setAttribute('step', 'any');
    input.value = '4';
    input.setAttribute('readonly', '');
    const events = [];
    input.addEventListener('input', () => events.push('input'));
    input.addEventListener('change', () => events.push('change'));
    const [stepDown, stepUp] = [el.querySelectorAll('button')[0], el.querySelectorAll('button')[1]];
    stepDown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    stepUp.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(input.value).toBe('4');
    expect(events).toEqual([]);
  });

  it('clamps step="any" stepping to max', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    input.setAttribute('step', 'any');
    input.setAttribute('max', '5');
    input.value = '4.5';
    const buttons = el.querySelectorAll('button');
    buttons[buttons.length - 1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(input.value).toBe('5');
  });

  it('clamps step="any" stepping to min', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    input.setAttribute('step', 'any');
    input.setAttribute('min', '0');
    input.value = '0.5';
    const [stepDown] = el.querySelectorAll('button');
    stepDown.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(input.value).toBe('0');
  });

  it('skips the model writeback while the input holds a focused bad-input buffer', async () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    const original = vi.fn();
    input._x_forceModelUpdate = original;
    await new Promise((resolve) => queueMicrotask(resolve));
    Object.defineProperty(input, 'validity', { value: { badInput: true }, configurable: true });
    input.focus();
    input._x_forceModelUpdate(null);
    expect(original).not.toHaveBeenCalled();
  });

  it('delegates the writeback when the input is not in a bad-input state', async () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    const original = vi.fn();
    input._x_forceModelUpdate = original;
    await new Promise((resolve) => queueMicrotask(resolve));
    input.focus();
    input._x_forceModelUpdate(7);
    expect(original).toHaveBeenCalledWith(7);
  });

  it('delegates the writeback when bad input is left behind unfocused', async () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    const original = vi.fn();
    input._x_forceModelUpdate = original;
    await new Promise((resolve) => queueMicrotask(resolve));
    Object.defineProperty(input, 'validity', { value: { badInput: true }, configurable: true });
    input.blur();
    input._x_forceModelUpdate(42);
    expect(original).toHaveBeenCalledWith(42);
  });

  it('installs no wrapper when the input has no x-model', async () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    await new Promise((resolve) => queueMicrotask(resolve));
    expect(input._x_forceModelUpdate).toBeUndefined();
  });

  it('restores the original writeback on cleanup', async () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    const original = vi.fn();
    input._x_forceModelUpdate = original;
    await new Promise((resolve) => queueMicrotask(resolve));
    expect(input._x_forceModelUpdate).not.toBe(original);
    ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    expect(input._x_forceModelUpdate).toBe(original);
  });

  it('does not clobber a writeback reassigned after the wrap', async () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    input._x_forceModelUpdate = vi.fn();
    await new Promise((resolve) => queueMicrotask(resolve));
    const reassigned = vi.fn();
    input._x_forceModelUpdate = reassigned;
    ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    expect(input._x_forceModelUpdate).toBe(reassigned);
  });

  it('installs nothing when cleaned up before the microtask runs', async () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    const original = vi.fn();
    input._x_forceModelUpdate = original;
    ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    await new Promise((resolve) => queueMicrotask(resolve));
    expect(input._x_forceModelUpdate).toBe(original);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-input-number separator drops', () => {
  let el;
  let input;

  const mount = () => mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
  const sleep = () => new Promise((resolve) => setTimeout(resolve, 5));
  const beforeInput = (data, init = {}) => input.dispatchEvent(new InputEvent('beforeinput', { data, inputType: 'insertText', bubbles: true, ...init }));
  const inputEvent = (data, init = {}) => input.dispatchEvent(new InputEvent('input', { data, inputType: 'insertText', bubbles: true, ...init }));
  const keystroke = (data, value) => {
    beforeInput(data);
    input.value = value;
    inputEvent(data);
  };

  beforeEach(() => {
    el = document.createElement('div');
    input = document.createElement('input');
    input.setAttribute('type', 'number');
    el.appendChild(input);
    document.body.appendChild(el);
  });

  it('flags a dropped separator with the default message', async () => {
    mount();
    input.value = '123';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    expect(input.validationMessage).toBe('A typed decimal separator was not recognized.');
  });

  it('uses the data-invalid-label override', async () => {
    el.setAttribute('data-invalid-label', 'Use a dot.');
    mount();
    input.value = '123';
    beforeInput(',');
    await sleep();
    expect(input.validationMessage).toBe('Use a dot.');
  });

  it('does not flag when the separator produces an input event', async () => {
    mount();
    input.value = '12';
    beforeInput('.');
    inputEvent('.');
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('keeps the flag while digits are appended after the drop', async () => {
    mount();
    input.value = '123';
    beforeInput(',');
    await sleep();
    keystroke('5', '1235');
    expect(input.validity.customError).toBe(true);
  });

  it('flags when the next digit lands before the timer', async () => {
    mount();
    input.value = '123';
    beforeInput(',');
    keystroke('5', '1235');
    await sleep();
    expect(input.validity.customError).toBe(true);
  });

  it('an accepted separator after a dropped one cancels the pending flag', async () => {
    mount();
    input.value = '12';
    beforeInput(',');
    beforeInput('.');
    inputEvent('.');
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('a guard-blocked second separator still flags the first drop', async () => {
    mount();
    input.value = '12';
    beforeInput(',');
    input.value = '12.5';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
  });

  it('re-arming on a repeated dropped separator flags once', async () => {
    mount();
    input.value = '12';
    beforeInput(',');
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
  });

  it('clears the flag when a keystroke shrinks or replaces the value', async () => {
    mount();
    input.value = '1235';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    keystroke('7', '7');
    expect(input.validity.customError).toBe(false);
  });

  it('clears the flag on delete edits', async () => {
    mount();
    input.value = '1235';
    beforeInput(',');
    await sleep();
    input.value = '123';
    input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward', bubbles: true }));
    expect(input.validity.customError).toBe(false);
  });

  it('never arms on paste and clears on paste input events', async () => {
    mount();
    input.value = '123';
    input.dispatchEvent(new InputEvent('beforeinput', { data: '1,5', inputType: 'insertFromPaste', bubbles: true }));
    await sleep();
    expect(input.validity.customError).toBe(false);
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    input.value = '15';
    input.dispatchEvent(new InputEvent('input', { data: '15', inputType: 'insertFromPaste', bubbles: true }));
    expect(input.validity.customError).toBe(false);
  });

  it('clears the flag when the widget steppers fire', async () => {
    mount();
    input.setAttribute('step', 'any');
    input.value = '1235';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    const buttons = el.querySelectorAll('button');
    buttons[buttons.length - 1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(input.validity.customError).toBe(false);
  });

  it('clears the flag on empty-inputType input events', async () => {
    mount();
    input.value = '1235';
    beforeInput(',');
    await sleep();
    input.value = '1236';
    input.dispatchEvent(new InputEvent('input', { inputType: '', bubbles: true }));
    expect(input.validity.customError).toBe(false);
  });

  it('does not arm while the input holds bad input', async () => {
    mount();
    input.value = '12,';
    beforeInput('.');
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('does not arm when the value already contains a separator', async () => {
    mount();
    input.value = '12.5';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('does not arm during composition', async () => {
    mount();
    input.value = '12';
    beforeInput(',', { isComposing: true });
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('does not arm on readonly inputs', async () => {
    mount();
    input.setAttribute('readonly', '');
    input.value = '12';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('clears the flag on form reset', async () => {
    const form = document.createElement('form');
    document.body.appendChild(form);
    form.appendChild(el);
    mount();
    input.value = '123';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    form.dispatchEvent(new Event('reset'));
    expect(input.validity.customError).toBe(false);
  });

  it('leaves consumer-set custom validity alone', async () => {
    mount();
    input.setCustomValidity('mine');
    input.value = '12';
    input.dispatchEvent(new InputEvent('input', { inputType: 'deleteContentBackward', bubbles: true }));
    await sleep();
    expect(input.validationMessage).toBe('mine');
  });

  it('survives an eventless programmatic rewrite between keystrokes', async () => {
    mount();
    input.value = '005';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    input.value = '5';
    keystroke('6', '56');
    expect(input.validity.customError).toBe(true);
  });

  it('cleanup cancels a pending timer', async () => {
    const { ctx } = mount();
    input.value = '12';
    beforeInput(',');
    ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('cleanup clears an already set flag', async () => {
    const { ctx } = mount();
    input.value = '12';
    beforeInput(',');
    await sleep();
    expect(input.validity.customError).toBe(true);
    ctx.cleanup.mock.calls.forEach(([fn]) => fn());
    expect(input.validity.customError).toBe(false);
  });

  it('pairs a multi-character insert containing a separator', async () => {
    mount();
    beforeInput('1,5');
    input.value = '1,5';
    inputEvent('1,5');
    await sleep();
    expect(input.validity.customError).toBe(false);
  });

  it('flags a dropped multi-character insert containing a separator', async () => {
    mount();
    beforeInput('1,5');
    await sleep();
    expect(input.validity.customError).toBe(true);
  });
});

describe('h-input-number (table modifier)', () => {
  let el;

  const mount = () => mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number', modifiers: ['table'] });

  beforeEach(() => {
    el = document.createElement('div');
    const input = document.createElement('input');
    input.setAttribute('type', 'number');
    el.appendChild(input);
    document.body.appendChild(el);
  });

  it('sets data-slot="cell-input-number"', () => {
    mount();
    expect(el.getAttribute('data-slot')).toBe('cell-input-number');
  });

  it('lets the input shrink so the steppers cannot overflow it', () => {
    mount();
    const input = el.querySelector('input');
    expect(input.classList.contains('min-w-0')).toBe(true);
    expect(input.classList.contains('flex-1')).toBe(true);
  });

  it('stacks the two steppers in a vertical column', () => {
    mount();
    const steppers = el.querySelector('[data-slot="step-controls"]');
    expect(steppers).not.toBeNull();
    expect(steppers.classList.contains('flex-col')).toBe(true);
    const buttons = steppers.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    // Plus on top, Minus below.
    expect(buttons[0].getAttribute('aria-label')).toBe('Increase');
    expect(buttons[1].getAttribute('aria-label')).toBe('Decrease');
  });

  it('hides the stepper column when the input is readonly', () => {
    mount();
    const steppers = el.querySelector('[data-slot="step-controls"]');
    expect(steppers.classList.contains('group-has-[input[readonly]]/input-number:hidden')).toBe(true);
  });

  it('gates the inner dividers on the table having horizontal borders', () => {
    mount();
    const steppers = el.querySelector('[data-slot="step-controls"]');
    // The input-to-steppers divider is only drawn for rows/both, never plain.
    expect(steppers.classList.contains('border-l')).toBe(false);
    expect(steppers.classList.contains('[table[data-borders=rows]_&]:border-l')).toBe(true);
    expect(steppers.classList.contains('[table[data-borders=both]_&]:border-l')).toBe(true);
    // The divider between the two stacked buttons is gated the same way.
    const stepDown = el.querySelector('button[aria-label="Decrease"]');
    expect(stepDown.classList.contains('border-t')).toBe(false);
    expect(stepDown.classList.contains('[table[data-borders=rows]_&]:border-t')).toBe(true);
    expect(stepDown.classList.contains('[table[data-borders=both]_&]:border-t')).toBe(true);
  });

  it('steppers change the value of an editable input', () => {
    mount();
    const input = el.querySelector('input');
    input.setAttribute('step', 'any');
    input.value = '4';
    const stepUp = el.querySelector('button[aria-label="Increase"]');
    stepUp.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(input.value).toBe('5');
  });
});
