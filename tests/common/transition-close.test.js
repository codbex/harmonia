import { afterEach, describe, expect, it, vi } from 'vitest';
import { transitionClose } from '../../src/common/transition-close.js';

describe('transitionClose', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs finish when the element itself ends a transition', () => {
    const el = document.createElement('div');
    const finish = vi.fn();
    transitionClose(el, finish);
    el.dispatchEvent(new Event('transitionend'));
    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('ignores a transitionend bubbling up from a child', () => {
    const el = document.createElement('div');
    const child = document.createElement('span');
    el.appendChild(child);
    const finish = vi.fn();
    transitionClose(el, finish);
    child.dispatchEvent(new Event('transitionend', { bubbles: true }));
    expect(finish).not.toHaveBeenCalled();
  });

  it('runs finish from the fallback timer when no event arrives', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    const finish = vi.fn();
    const closer = transitionClose(el, finish);
    closer.schedule();
    vi.advanceTimersByTime(249);
    expect(finish).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('cancel disarms a scheduled fallback', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    const finish = vi.fn();
    const closer = transitionClose(el, finish);
    closer.schedule();
    closer.cancel();
    vi.advanceTimersByTime(300);
    expect(finish).not.toHaveBeenCalled();
  });

  it('rescheduling restarts the fallback instead of stacking timers', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    const finish = vi.fn();
    const closer = transitionClose(el, finish);
    closer.schedule();
    vi.advanceTimersByTime(200);
    closer.schedule();
    vi.advanceTimersByTime(200);
    expect(finish).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    expect(finish).toHaveBeenCalledTimes(1);
  });

  it('dispose removes the listener and clears the timer', () => {
    vi.useFakeTimers();
    const el = document.createElement('div');
    const finish = vi.fn();
    const closer = transitionClose(el, finish);
    closer.schedule();
    closer.dispose();
    vi.advanceTimersByTime(300);
    el.dispatchEvent(new Event('transitionend'));
    expect(finish).not.toHaveBeenCalled();
  });
});
