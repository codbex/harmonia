import { describe, expect, it } from 'vitest';
import progressPlugin from '../../src/components/progress.js';
import { mountDirective } from '../test-utils.js';

describe('h-progress', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(progressPlugin, 'h-progress', el, { expression: '50' });
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('h-2')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('div');
    mountDirective(progressPlugin, 'h-progress', el, { expression: '50' });
    expect(el.getAttribute('data-slot')).toBe('progress');
  });

  it('creates an indicator child element', () => {
    const el = document.createElement('div');
    mountDirective(progressPlugin, 'h-progress', el, { expression: '0' });
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator).toBeTruthy();
  });

  it('indicator has bg-primary class', () => {
    const el = document.createElement('div');
    mountDirective(progressPlugin, 'h-progress', el, { expression: '0' });
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.classList.contains('bg-primary')).toBe(true);
    expect(indicator.classList.contains('h-full')).toBe(true);
    expect(indicator.classList.contains('w-full')).toBe(true);
  });

  it('indicator initial transform is translateX(-100%)', () => {
    const el = document.createElement('div');
    mountDirective(progressPlugin, 'h-progress', el, { expression: '0' });
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.style.transform).toBe('translateX(-100%)');
  });
});
