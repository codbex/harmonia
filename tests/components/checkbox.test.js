import { beforeEach, describe, expect, it } from 'vitest';
import checkboxPlugin from '../../src/components/checkbox.js';
import { mountDirective } from '../test-utils.js';

describe('h-checkbox', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers h-checkbox directive', () => {
    const { alpine } = mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(alpine._directives['h-checkbox']).toBeDefined();
  });

  it('adds base wrapper classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('aspect-square')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('rounded-[0.438rem]')).toBe(true);
    expect(el.classList.contains('size-5')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('adds focus ring class for input', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
    expect(el.classList.contains('[&>input]:rounded-[0.438rem]')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets data-slot="checkbox"', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.getAttribute('data-slot')).toBe('checkbox');
  });

  it('appends an svg check icon', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('adds transition and shadow classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('shadow-input')).toBe(true);
    expect(el.classList.contains('transition-colors')).toBe(true);
    expect(el.classList.contains('duration-200')).toBe(true);
  });

  it('adds checked state classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('has-[input:checked]:bg-primary')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:border-primary')).toBe(true);
  });

  it('adds disabled state classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('has-[input:disabled]:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:opacity-disabled')).toBe(true);
    expect(el.classList.contains('[&:has(input:disabled)~label]:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('[&:has(input:disabled)~label]:opacity-disabled')).toBe(true);
  });
});
