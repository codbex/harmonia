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

  it('renders the line bar for data-type="line" and when the attribute is absent', () => {
    for (const type of [null, 'line', 'default']) {
      const el = document.createElement('div');
      if (type !== null) el.setAttribute('data-type', type);
      mountDirective(progressPlugin, 'h-progress', el, { expression: '40' }, { evaluateLater: () => (cb) => cb(40) });
      expect(el.classList.contains('h-2')).toBe(true);
      expect(el.classList.contains('w-full')).toBe(true);
      const indicator = el.querySelector('[data-slot="progress-indicator"]');
      expect(indicator.style.transform).toBe('translateX(-60%)');
    }
  });
});

describe('h-progress circle', () => {
  function mountCircle(value, attrs = {}) {
    const el = document.createElement('div');
    el.setAttribute('data-type', 'circle');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    mountDirective(progressPlugin, 'h-progress', el, { expression: String(value) }, { evaluateLater: () => (cb) => cb(value) });
    return el;
  }

  it('applies circular container classes', () => {
    const el = mountCircle('40');
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('w-10')).toBe(true);
    expect(el.classList.contains('aspect-square')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('progress');
  });

  it('paints a conic-gradient that tracks the value and masks the center', () => {
    const el = mountCircle('40');
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.style.transform).toBe('');
    expect(indicator.style.background).toContain('conic-gradient');
    expect(indicator.style.background).toContain('40%');
    expect(indicator.style.mask).toContain('radial-gradient');
  });

  it('clamps the value to 0-100', () => {
    expect(mountCircle('-20').querySelector('[data-slot="progress-indicator"]').style.background).toContain('0%');
    expect(mountCircle('150').querySelector('[data-slot="progress-indicator"]').style.background).toContain('100%');
  });

  it('uses the variant color in the gradient', () => {
    const el = mountCircle('40', { 'data-variant': 'positive' });
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.style.background).toContain('var(--positive)');
  });

  it('falls back to primary when no variant is set', () => {
    const el = mountCircle('40');
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.style.background).toContain('var(--primary)');
  });

  it('loading freezes the ring to a 30% arc and spins it', () => {
    const el = mountCircle('80', { 'data-loading': 'true' });
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    // Same ring (conic-gradient + mask), pinned to 30% rather than the value.
    expect(indicator.style.background).toContain('conic-gradient');
    expect(indicator.style.background).toContain('30%');
    expect(indicator.style.background).not.toContain('80%');
    expect(indicator.style.mask).toContain('radial-gradient');
    expect(indicator.classList.contains('animate-spin')).toBe(true);
  });

  it('does not spin when not loading', () => {
    const el = mountCircle('80');
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.style.background).toContain('80%');
    expect(indicator.classList.contains('animate-spin')).toBe(false);
  });
});

describe('h-progress loading', () => {
  it('line indicator carries the indeterminate sweep classes', () => {
    const el = document.createElement('div');
    mountDirective(progressPlugin, 'h-progress', el, { expression: '0' });
    const indicator = el.querySelector('[data-slot="progress-indicator"]');
    expect(indicator.classList.contains('[[data-loading=true]>&]:w-[30%]')).toBe(true);
    expect(indicator.classList.contains('[[data-loading=true]>&]:flex-none')).toBe(true);
    expect(indicator.classList.contains('[[data-loading=true]>&]:animate-progress-loading')).toBe(true);
  });
});
