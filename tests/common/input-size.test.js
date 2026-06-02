import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { sizeObserver } from '../../src/common/input-size.js';

describe('sizeObserver', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  it('returns a MutationObserver instance', () => {
    const observer = sizeObserver(el);
    expect(observer).toBeInstanceOf(MutationObserver);
    observer.disconnect();
  });

  it('adds h-9 class when no data-size attribute is set', () => {
    const observer = sizeObserver(el);
    expect(el.classList.contains('h-9')).toBe(true);
    observer.disconnect();
  });

  it('does not add h-6.5 when no data-size attribute is set', () => {
    const observer = sizeObserver(el);
    expect(el.classList.contains('h-6.5')).toBe(false);
    observer.disconnect();
  });

  it('adds h-6.5 class when data-size is sm', () => {
    el.setAttribute('data-size', 'sm');
    const observer = sizeObserver(el);
    expect(el.classList.contains('h-6.5')).toBe(true);
    observer.disconnect();
  });

  it('does not add h-9 when data-size is sm', () => {
    el.setAttribute('data-size', 'sm');
    const observer = sizeObserver(el);
    expect(el.classList.contains('h-9')).toBe(false);
    observer.disconnect();
  });

  it('adds h-9 and removes h-6.5 when data-size is not sm', () => {
    el.setAttribute('data-size', 'lg');
    const observer = sizeObserver(el);
    expect(el.classList.contains('h-9')).toBe(true);
    expect(el.classList.contains('h-6.5')).toBe(false);
    observer.disconnect();
  });

  it('reacts to data-size attribute change to sm', async () => {
    const observer = sizeObserver(el);
    el.setAttribute('data-size', 'sm');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('h-6.5')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(false);
    observer.disconnect();
  });

  it('reacts to data-size attribute change from sm to default', async () => {
    el.setAttribute('data-size', 'sm');
    const observer = sizeObserver(el);
    el.setAttribute('data-size', 'md');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('h-9')).toBe(true);
    expect(el.classList.contains('h-6.5')).toBe(false);
    observer.disconnect();
  });
});
