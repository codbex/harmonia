import { describe, it, expect } from 'vitest';
import { mountDirective } from '../test-utils.js';
import spinnerPlugin from '../../src/components/spinner.js';

describe('h-spinner', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(spinnerPlugin, 'h-spinner', el);
    expect(el.classList.contains('size-4')).toBe(true);
    expect(el.classList.contains('border-2')).toBe(true);
    expect(el.classList.contains('border-primary')).toBe(true);
    expect(el.classList.contains('!border-t-transparent')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('animate-spin')).toBe(true);
  });

  it('sets role=status and data-slot attributes', () => {
    const el = document.createElement('div');
    mountDirective(spinnerPlugin, 'h-spinner', el);
    expect(el.getAttribute('role')).toBe('status');
    expect(el.getAttribute('data-slot')).toBe('spinner');
  });

  it('sets default aria-label if not provided', () => {
    const el = document.createElement('div');
    mountDirective(spinnerPlugin, 'h-spinner', el);
    expect(el.getAttribute('aria-label')).toBe('Loading');
  });

  it('does not override existing aria-label', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Custom loading');
    mountDirective(spinnerPlugin, 'h-spinner', el);
    expect(el.getAttribute('aria-label')).toBe('Custom loading');
  });

  it('adds inline-block class for span elements', () => {
    const el = document.createElement('span');
    mountDirective(spinnerPlugin, 'h-spinner', el);
    expect(el.classList.contains('inline-block')).toBe(true);
  });

  it('does not add inline-block for non-span elements', () => {
    const el = document.createElement('div');
    mountDirective(spinnerPlugin, 'h-spinner', el);
    expect(el.classList.contains('inline-block')).toBe(false);
  });
});
