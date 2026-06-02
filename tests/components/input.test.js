import { beforeEach, describe, expect, it } from 'vitest';
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
    expect(el.classList.contains('transition-colors')).toBe(true);
  });

  it('sets data-slot="input" by default', () => {
    mountDirective(inputPlugin, 'h-input', el);
    expect(el.getAttribute('data-slot')).toBe('input');
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

  it('sets inputmode="numeric" on the input', () => {
    mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    const input = el.querySelector('input');
    expect(input.getAttribute('inputmode')).toBe('numeric');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(inputPlugin, 'h-input-number', el, { original: 'h-input-number' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
