import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import backdropPlugin from '../../src/components/backdrop.js';
import { mountDirective } from '../test-utils.js';

// happy-dom does not implement window.matchMedia
vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

describe('h-backdrop', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers the backdrop directive', () => {
    const { alpine } = mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(alpine._directives['h-backdrop']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('inset-0')).toBe(true);
    expect(el.classList.contains('z-50')).toBe(true);
    expect(el.classList.contains('bg-black/60')).toBe(true);
    expect(el.classList.contains('opacity-0')).toBe(true);
    expect(el.classList.contains('*:scale-95')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets data-slot="backdrop"', () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(el.getAttribute('data-slot')).toBe('backdrop');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(backdropPlugin, 'h-backdrop', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('disconnects the observer and removes the transitionend listener on cleanup', () => {
    const disconnectSpy = vi.spyOn(MutationObserver.prototype, 'disconnect');
    const removeSpy = vi.spyOn(el, 'removeEventListener');
    const { ctx } = mountDirective(backdropPlugin, 'h-backdrop', el);
    const cleanupFn = ctx.cleanup.mock.calls[0][0];
    cleanupFn();
    expect(disconnectSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('transitionend', expect.any(Function));
    disconnectSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

describe('h-backdrop open and close', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // MutationObserver callbacks need a task turn to be delivered.
  const flush = () => new Promise((r) => setTimeout(r, 0));

  it('stops intercepting pointer events the moment the close starts', async () => {
    mountDirective(backdropPlugin, 'h-backdrop', el);
    el.setAttribute('data-open', 'true');
    await flush();
    expect(el.classList.contains('pointer-events-none')).toBe(false);
    el.setAttribute('data-open', 'false');
    await flush();
    expect(el.classList.contains('pointer-events-none')).toBe(true);
    expect(el.classList.contains('hidden')).toBe(false);
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(true);
  });

  it('hides via the fallback timer when transitionend never fires', async () => {
    vi.useFakeTimers();
    mountDirective(backdropPlugin, 'h-backdrop', el);
    el.setAttribute('data-open', 'true');
    await vi.advanceTimersByTimeAsync(0);
    el.setAttribute('data-open', 'false');
    await vi.advanceTimersByTimeAsync(0);
    expect(el.classList.contains('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(250);
    expect(el.classList.contains('hidden')).toBe(true);
  });

  // A transitionend from the abandoned close arriving between the reopen and
  // Alpine's nextTick used to pass the old opacity-0 class guard and wedge the
  // open backdrop hidden.
  it('ignores a late transitionend from an abandoned close after reopening', async () => {
    const { alpine } = mountDirective(backdropPlugin, 'h-backdrop', el);
    el.setAttribute('data-open', 'true');
    await flush();
    el.setAttribute('data-open', 'false');
    await flush();
    const pending = [];
    alpine.nextTick = (fn) => pending.push(fn);
    el.setAttribute('data-open', 'true');
    await flush();
    el.dispatchEvent(new Event('transitionend'));
    expect(el.classList.contains('hidden')).toBe(false);
    pending.forEach((fn) => fn());
    expect(el.classList.contains('opacity-0')).toBe(false);
  });
});

describe('h-backdrop-item', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers the backdrop-item directive', () => {
    const { alpine } = mountDirective(backdropPlugin, 'h-backdrop-item', el);
    expect(alpine._directives['h-backdrop-item']).toBeDefined();
  });

  it('adds the transition classes', () => {
    mountDirective(backdropPlugin, 'h-backdrop-item', el);
    expect(el.classList.contains('transition-[opacity,scale]')).toBe(true);
    expect(el.classList.contains('motion-reduce:transition-none')).toBe(true);
    expect(el.classList.contains('duration-200')).toBe(true);
    expect(el.classList.contains('ease-out')).toBe(true);
  });
});
