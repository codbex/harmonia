import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import focusPlugin from '../../src/utils/focus.js';
import { createMockAlpine, createMockContext } from '../test-utils.js';

describe('h-focus directive', () => {
  let alpine;
  let el;
  let rafCallbacks;

  beforeEach(() => {
    alpine = createMockAlpine();
    el = document.createElement('input');
    document.body.appendChild(el);
    focusPlugin(alpine);
    // The directive defers el.focus() to the next frame so the element is visible
    // first; capture the scheduled callbacks so tests can flush them synchronously.
    rafCallbacks = [];
    vi.stubGlobal('requestAnimationFrame', (cb) => {
      rafCallbacks.push(cb);
      return rafCallbacks.length;
    });
  });

  function flushFrame() {
    rafCallbacks.forEach((cb) => cb());
    rafCallbacks = [];
  }

  afterEach(() => {
    document.body.removeChild(el);
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function invokeDirective(expression, value, contextOverrides = {}) {
    const fn = alpine._directives['h-focus'];
    const evaluateLaterMock = vi.fn().mockImplementation(() => (cb) => cb(value));
    const effectMock = vi.fn().mockImplementation((fn) => fn());
    const ctx = createMockContext(alpine, {
      evaluateLater: evaluateLaterMock,
      effect: effectMock,
      ...contextOverrides,
    });
    fn(el, { expression, modifiers: [] }, ctx);
    return { evaluateLaterMock, effectMock, ctx };
  }

  it('registers the h-focus directive', () => {
    expect(alpine._directives['h-focus']).toBeTypeOf('function');
  });

  it('calls evaluateLater with the expression', () => {
    const { evaluateLaterMock } = invokeDirective('isFocused', true);
    expect(evaluateLaterMock).toHaveBeenCalledWith('isFocused');
  });

  it('calls effect to set up the reactive watcher', () => {
    const { effectMock } = invokeDirective('isFocused', false);
    expect(effectMock).toHaveBeenCalledTimes(1);
  });

  it('calls el.focus() when evaluated value is true', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', true);
    flushFrame();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('defers el.focus() to the next animation frame', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', true);
    expect(focusSpy).not.toHaveBeenCalled();
    flushFrame();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call el.focus() when evaluated value is false', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', false);
    flushFrame();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('does not call el.focus() when evaluated value is null', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', null);
    flushFrame();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('does not call el.focus() when evaluated value is 0', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', 0);
    flushFrame();
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('calls el.focus() when evaluated value is a truthy non-boolean', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', 1);
    flushFrame();
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
