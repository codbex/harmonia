import { describe, expect, it } from 'vitest';
import radioPlugin from '../../src/components/radio.js';
import { mountDirective } from '../test-utils.js';

describe('h-radio', () => {
  it('applies base classes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('aspect-square')).toBe(true);
    expect(el.classList.contains('bg-input-inner')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('size-5')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('sets tabindex=-1 and data-slot attributes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('data-slot')).toBe('radio');
  });

  it('applies input-related classes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:before:visible')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:opacity-50')).toBe(true);
  });

  it('applies before pseudo-element classes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('before:bg-primary')).toBe(true);
    expect(el.classList.contains('before:rounded-full')).toBe(true);
    expect(el.classList.contains('before:invisible')).toBe(true);
  });
});
