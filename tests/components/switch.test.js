import { describe, expect, it } from 'vitest';
import switchPlugin from '../../src/components/switch.js';
import { mountDirective } from '../test-utils.js';

describe('h-switch', () => {
  it('applies base classes', () => {
    const el = document.createElement('label');
    mountDirective(switchPlugin, 'h-switch', el);
    expect(el.classList.contains('bg-muted')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('h-6')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('sets tabindex=-1 and data-slot attributes', () => {
    const el = document.createElement('label');
    mountDirective(switchPlugin, 'h-switch', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('data-slot')).toBe('switch');
  });

  it('applies input-related classes', () => {
    const el = document.createElement('label');
    mountDirective(switchPlugin, 'h-switch', el);
    expect(el.classList.contains('[&>input]:absolute')).toBe(true);
    expect(el.classList.contains('[&>input]:cursor-pointer')).toBe(true);
    expect(el.classList.contains('[&>input]:appearance-none')).toBe(true);
    expect(el.classList.contains('[&>input]:size-full')).toBe(true);
  });

  it('applies before pseudo-element classes', () => {
    const el = document.createElement('label');
    mountDirective(switchPlugin, 'h-switch', el);
    expect(el.classList.contains('before:bg-background')).toBe(true);
    expect(el.classList.contains('before:rounded-full')).toBe(true);
    expect(el.classList.contains('before:transition-transform')).toBe(true);
  });

  it('applies checked state classes', () => {
    const el = document.createElement('label');
    mountDirective(switchPlugin, 'h-switch', el);
    expect(el.classList.contains('has-[input:checked]:bg-primary')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:border-primary-active')).toBe(true);
  });

  it('applies size classes', () => {
    const el = document.createElement('label');
    mountDirective(switchPlugin, 'h-switch', el);
    expect(el.classList.contains('max-w-10')).toBe(true);
    expect(el.classList.contains('min-w-10')).toBe(true);
  });
});
