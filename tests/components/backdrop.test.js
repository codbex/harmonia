import { beforeEach, describe, expect, it, vi } from 'vitest';
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
