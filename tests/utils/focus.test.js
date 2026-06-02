import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import focusPlugin from '../../src/utils/focus.js';
import { createMockAlpine, createMockContext } from '../test-utils.js';

describe('h-focus directive', () => {
  let alpine;
  let el;

  beforeEach(() => {
    alpine = createMockAlpine();
    el = document.createElement('input');
    document.body.appendChild(el);
    focusPlugin(alpine);
  });

  afterEach(() => {
    document.body.removeChild(el);
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
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });

  it('does not call el.focus() when evaluated value is false', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', false);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('does not call el.focus() when evaluated value is null', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', null);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('does not call el.focus() when evaluated value is 0', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', 0);
    expect(focusSpy).not.toHaveBeenCalled();
  });

  it('calls el.focus() when evaluated value is a truthy non-boolean', () => {
    const focusSpy = vi.spyOn(el, 'focus');
    invokeDirective('isActive', 1);
    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
