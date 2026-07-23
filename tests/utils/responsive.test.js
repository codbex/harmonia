import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import responsivePlugin from '../../src/utils/responsive';
import { mountDirective } from '../test-utils';

// The directive reads config through evaluateLater; this override feeds it a value.
const withValue = (value) => ({ evaluateLater: () => (cb) => cb(value) });

// Give the element a fixed measured width so apply() is deterministic.
function widthOf(el, width) {
  el.getBoundingClientRect = () => ({ width, height: 0, top: 0, left: 0, right: width, bottom: 0 });
}

// Capture the ResizeObserver so tests can fire its callback manually
// (happy-dom does not run layout, so it never fires on its own).
let observers;
let OriginalResizeObserver;

beforeEach(() => {
  observers = [];
  OriginalResizeObserver = global.ResizeObserver;
  global.ResizeObserver = class {
    constructor(cb) {
      this.cb = cb;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      observers.push(this);
    }
  };
  // The observer callback is rAF-debounced; run frames synchronously so the
  // class toggle happens inside the test (happy-dom never paints on its own).
  vi.stubGlobal('requestAnimationFrame', (cb) => {
    cb();
    return 1;
  });
  vi.stubGlobal('cancelAnimationFrame', () => {});
});

afterEach(() => {
  global.ResizeObserver = OriginalResizeObserver;
  vi.unstubAllGlobals();
});

function mount(el, config, original = 'x-h-responsive', modifiers = []) {
  return mountDirective(responsivePlugin, 'h-responsive', el, { expression: 'cfg', original, modifiers }, withValue(config));
}

describe('x-h-responsive directive', () => {
  it('applies classes for conditions matching the initial width', () => {
    const el = document.createElement('div');
    widthOf(el, 1000);
    mount(el, [
      { op: '>=', width: 900, classes: ['hbox', 'gap-2'] },
      { op: '<', width: 900, classes: ['vbox', 'gap-4'] },
    ]);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(false);
    expect(el.classList.contains('gap-4')).toBe(false);
  });

  it('toggles classes when the observed width crosses a threshold', () => {
    const el = document.createElement('div');
    widthOf(el, 1000);
    mount(el, [
      { op: '>=', width: 900, classes: ['hbox', 'gap-2'] },
      { op: '<', width: 900, classes: ['vbox', 'gap-4'] },
    ]);
    expect(el.classList.contains('hbox')).toBe(true);

    // Shrink below the threshold and fire the observer callback.
    widthOf(el, 500);
    observers[0].cb();

    expect(el.classList.contains('hbox')).toBe(false);
    expect(el.classList.contains('gap-2')).toBe(false);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('gap-4')).toBe(true);
  });

  it('treats >= as inclusive and > as strict at the exact boundary', () => {
    const inclusive = document.createElement('div');
    widthOf(inclusive, 900);
    mount(inclusive, [{ op: '>=', width: 900, classes: ['a'] }]);
    expect(inclusive.classList.contains('a')).toBe(true);

    const strict = document.createElement('div');
    widthOf(strict, 900);
    mount(strict, [{ op: '>', width: 900, classes: ['b'] }]);
    expect(strict.classList.contains('b')).toBe(false);
  });

  it('matches == only at the exact width', () => {
    const el = document.createElement('div');
    widthOf(el, 640);
    mount(el, [{ op: '==', width: 640, classes: ['exact'] }]);
    expect(el.classList.contains('exact')).toBe(true);

    widthOf(el, 641);
    observers[0].cb();
    expect(el.classList.contains('exact')).toBe(false);
  });

  it('unions classes from all simultaneously-matching conditions', () => {
    const el = document.createElement('div');
    widthOf(el, 1000);
    mount(el, [
      { op: '>=', width: 500, classes: ['wide'] },
      { op: '>=', width: 900, classes: ['wider'] },
    ]);
    expect(el.classList.contains('wide')).toBe(true);
    expect(el.classList.contains('wider')).toBe(true);
  });

  it('never removes classes the author set outside the directive', () => {
    const el = document.createElement('div');
    el.classList.add('author-class');
    widthOf(el, 500);
    mount(el, [{ op: '>=', width: 900, classes: ['hbox'] }]);
    // Condition does not match, so nothing is added, and the author class stays.
    expect(el.classList.contains('hbox')).toBe(false);
    expect(el.classList.contains('author-class')).toBe(true);

    // Now match, then unmatch; only the directive's own class is removed.
    widthOf(el, 1000);
    observers[0].cb();
    expect(el.classList.contains('hbox')).toBe(true);
    widthOf(el, 500);
    observers[0].cb();
    expect(el.classList.contains('hbox')).toBe(false);
    expect(el.classList.contains('author-class')).toBe(true);
  });

  it('observes the element and disconnects on cleanup', () => {
    const el = document.createElement('div');
    widthOf(el, 800);
    const { ctx } = mount(el, [{ op: '>=', width: 900, classes: ['hbox'] }]);
    expect(observers[0].observe).toHaveBeenCalledWith(el);

    // The directive registers a cleanup that disconnects the observer.
    const cleanupFn = ctx.cleanup.mock.calls.at(-1)[0];
    cleanupFn();
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it('throws with the directive name when the config is not an array', () => {
    const el = document.createElement('div');
    widthOf(el, 800);
    expect(() => mount(el, { op: '>=', width: 900, classes: ['hbox'] })).toThrow(/x-h-responsive expects an array/);
  });

  it('throws on an unknown operator', () => {
    const el = document.createElement('div');
    widthOf(el, 800);
    expect(() => mount(el, [{ op: '=>', width: 900, classes: ['hbox'] }])).toThrow(/unknown operator/);
  });

  it('throws when width is not a number', () => {
    const el = document.createElement('div');
    widthOf(el, 800);
    expect(() => mount(el, [{ op: '>=', width: '900px', classes: ['hbox'] }])).toThrow(/"width" must be a number/);
  });

  it('throws when a condition has neither classes nor callback', () => {
    const el = document.createElement('div');
    widthOf(el, 800);
    expect(() => mount(el, [{ op: '>=', width: 900, classes: [] }])).toThrow(/needs "classes" or "callback"/);
    expect(() => mount(el, [{ op: '>=', width: 900 }])).toThrow(/needs "classes" or "callback"/);
  });

  it('uses the author-chosen prefix in error messages via original', () => {
    const el = document.createElement('div');
    widthOf(el, 800);
    expect(() => mount(el, [{ op: '=>', width: 900, classes: ['hbox'] }], 'data-h-responsive')).toThrow(/^data-h-responsive:/);
  });

  describe('parent modifier', () => {
    it('measures and observes the parent instead of the element', () => {
      const parent = document.createElement('div');
      const el = document.createElement('div');
      parent.appendChild(el);
      widthOf(parent, 1000);
      widthOf(el, 100); // element itself is narrow; parent is wide

      mount(el, [{ op: '>=', width: 900, classes: ['hbox'] }], 'x-h-responsive', ['parent']);

      // Parent width (1000) satisfies >= 900, even though the element is 100.
      expect(el.classList.contains('hbox')).toBe(true);
      expect(observers[0].observe).toHaveBeenCalledWith(parent);
    });

    it('recovers after a collapsing class hides the element (the reported bug)', () => {
      const parent = document.createElement('div');
      const el = document.createElement('div');
      parent.appendChild(el);
      widthOf(parent, 300);
      // Without the parent modifier a `hidden` element would report 0 and stay
      // hidden; measuring the parent keeps the signal alive.
      widthOf(el, 0);

      mount(el, [{ op: '<', width: 320, classes: ['hidden'] }], 'x-h-responsive', ['parent']);
      expect(el.classList.contains('hidden')).toBe(true);

      // Parent grows past the threshold: the element must be shown again.
      widthOf(parent, 400);
      observers[0].cb();
      expect(el.classList.contains('hidden')).toBe(false);
    });

    it('falls back to the element when it has no parent', () => {
      const el = document.createElement('div'); // not attached to any parent
      widthOf(el, 1000);
      mount(el, [{ op: '>=', width: 900, classes: ['hbox'] }], 'x-h-responsive', ['parent']);
      expect(el.classList.contains('hbox')).toBe(true);
      expect(observers[0].observe).toHaveBeenCalledWith(el);
    });
  });

  describe('callback', () => {
    it('fires once on mount with the initial match state', () => {
      const matches = document.createElement('div');
      widthOf(matches, 1000);
      const onMatch = vi.fn();
      mount(matches, [{ op: '>=', width: 900, callback: onMatch }]);
      expect(onMatch).toHaveBeenCalledTimes(1);
      expect(onMatch).toHaveBeenCalledWith(true);

      const misses = document.createElement('div');
      widthOf(misses, 500);
      const onMiss = vi.fn();
      mount(misses, [{ op: '>=', width: 900, callback: onMiss }]);
      expect(onMiss).toHaveBeenCalledTimes(1);
      expect(onMiss).toHaveBeenCalledWith(false);
    });

    it('fires once per transition, not on every resize', () => {
      const el = document.createElement('div');
      widthOf(el, 1000);
      const cb = vi.fn();
      mount(el, [{ op: '>=', width: 900, callback: cb }]);
      expect(cb.mock.calls).toEqual([[true]]); // mount

      // Still matching: a resize that does not cross the threshold must not re-fire.
      widthOf(el, 950);
      observers[0].cb();
      expect(cb.mock.calls).toEqual([[true]]);

      // Flip below the threshold: one more call with false.
      widthOf(el, 500);
      observers[0].cb();
      expect(cb.mock.calls).toEqual([[true], [false]]);

      // Flip back above: one more call with true.
      widthOf(el, 1000);
      observers[0].cb();
      expect(cb.mock.calls).toEqual([[true], [false], [true]]);
    });

    it('toggles classes and fires the callback on the same transition', () => {
      const el = document.createElement('div');
      widthOf(el, 500);
      const cb = vi.fn();
      mount(el, [{ op: '>=', width: 900, classes: ['hbox'], callback: cb }]);
      expect(el.classList.contains('hbox')).toBe(false);
      expect(cb.mock.calls).toEqual([[false]]);

      widthOf(el, 1000);
      observers[0].cb();
      expect(el.classList.contains('hbox')).toBe(true);
      expect(cb.mock.calls).toEqual([[false], [true]]);
    });

    it('never touches classList for a callback-only condition', () => {
      const el = document.createElement('div');
      el.classList.add('author-class');
      widthOf(el, 1000);
      const cb = vi.fn();
      mount(el, [{ op: '>=', width: 900, callback: cb }]);
      widthOf(el, 500);
      observers[0].cb();
      // Only the author's class remains; the directive added/removed nothing.
      expect([...el.classList]).toEqual(['author-class']);
    });

    it('allows a condition with only a callback and no classes', () => {
      const el = document.createElement('div');
      widthOf(el, 1000);
      expect(() => mount(el, [{ op: '>=', width: 900, callback: () => {} }])).not.toThrow();
    });

    it('throws when callback is not a function', () => {
      const el = document.createElement('div');
      widthOf(el, 800);
      expect(() => mount(el, [{ op: '>=', width: 900, callback: 'nope' }])).toThrow(/"callback" must be a function/);
      // The author-chosen prefix is used in the message.
      expect(() => mount(el, [{ op: '>=', width: 900, callback: 42 }], 'data-h-responsive')).toThrow(/^data-h-responsive: "callback"/);
    });

    it('lets a throwing callback propagate rather than swallowing it', () => {
      const el = document.createElement('div');
      widthOf(el, 1000);
      const boom = () => {
        throw new Error('boom');
      };
      expect(() => mount(el, [{ op: '>=', width: 900, callback: boom }])).toThrow(/boom/);
    });
  });
});
