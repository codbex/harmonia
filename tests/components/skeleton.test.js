import { describe, it, expect } from 'vitest';
import { mountDirective } from '../test-utils.js';
import skeletonPlugin from '../../src/components/skeleton.js';

describe('h-skeleton', () => {
  it('applies base classes for default (no modifier)', () => {
    const el = document.createElement('div');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: [] });
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('animate-pulse')).toBe(true);
    expect(el.classList.contains('rounded-md')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('div');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('skeleton');
  });

  it('adds rounded-control and default height for control modifier', () => {
    const el = document.createElement('div');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: ['control'] });
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(true);
  });

  it('adds h-6.5 for control modifier with size=sm', () => {
    const el = document.createElement('div');
    el.setAttribute('data-size', 'sm');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: ['control'] });
    expect(el.classList.contains('h-6.5')).toBe(true);
  });

  it('adds h-8 for control modifier with size=md', () => {
    const el = document.createElement('div');
    el.setAttribute('data-size', 'md');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: ['control'] });
    expect(el.classList.contains('h-8')).toBe(true);
  });

  it('adds rounded-lg for card modifier', () => {
    const el = document.createElement('div');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: ['card'] });
    expect(el.classList.contains('rounded-lg')).toBe(true);
  });

  it('adds rounded-full and avatar classes for avatar modifier', () => {
    const el = document.createElement('div');
    mountDirective(skeletonPlugin, 'h-skeleton', el, { modifiers: ['avatar'] });
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('size-8')).toBe(true);
    expect(el.classList.contains('aspect-square')).toBe(true);
  });
});
