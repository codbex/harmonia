import { describe, it, expect } from 'vitest';
import { mountDirective } from '../test-utils.js';
import separatorPlugin from '../../src/components/separator.js';

describe('h-separator', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(separatorPlugin, 'h-separator', el);
    expect(el.classList.contains('bg-border')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('sets role=none and data-slot attributes', () => {
    const el = document.createElement('div');
    mountDirective(separatorPlugin, 'h-separator', el);
    expect(el.getAttribute('role')).toBe('none');
    expect(el.getAttribute('data-slot')).toBe('separator');
  });

  it('applies horizontal orientation class', () => {
    const el = document.createElement('div');
    mountDirective(separatorPlugin, 'h-separator', el);
    expect(el.classList.contains('data-[orientation=horizontal]:h-px')).toBe(true);
    expect(el.classList.contains('data-[orientation=horizontal]:w-full')).toBe(true);
  });

  it('applies vertical orientation class', () => {
    const el = document.createElement('div');
    mountDirective(separatorPlugin, 'h-separator', el);
    expect(el.classList.contains('data-[orientation=vertical]:h-full')).toBe(true);
    expect(el.classList.contains('data-[orientation=vertical]:w-px')).toBe(true);
  });
});
