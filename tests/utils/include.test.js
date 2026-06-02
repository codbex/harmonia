import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import includePlugin from '../../src/utils/include.js';
import { createMockAlpine, createMockContext } from '../test-utils.js';

// The include plugin chains .before('bind') on the Alpine.directive() return value.
// Extend the mock alpine to return a chainable object from directive().
function createChainableAlpine() {
  const base = createMockAlpine();
  const chainable = { before: vi.fn() };
  base.directive = function (name, fn) {
    base._directives[name] = fn;
    return chainable;
  };
  return base;
}

describe('h-include directive', () => {
  let alpine;
  let el;

  beforeEach(() => {
    alpine = createChainableAlpine();
    el = document.createElement('div');
    document.body.appendChild(el);
    includePlugin(alpine);

    // Reset fetch mock
    global.fetch = vi.fn();
  });

  afterEach(() => {
    if (el.parentNode) document.body.removeChild(el);
    vi.restoreAllMocks();
  });

  function invokeDirective(url, modifiers = [], contextOverrides = {}) {
    const fn = alpine._directives['h-include'];
    const effectMock = vi.fn().mockImplementation((cb) => cb());
    const evaluateLaterMock = vi.fn().mockImplementation(() => (cb) => cb(url));
    const cleanupMock = vi.fn();
    const ctx = createMockContext(alpine, {
      evaluateLater: evaluateLaterMock,
      effect: effectMock,
      cleanup: cleanupMock,
      Alpine: alpine,
      ...contextOverrides,
    });
    fn(el, { modifiers, expression: url ?? '', original: 'h-include' }, ctx);
    return { effectMock, evaluateLaterMock, cleanupMock, ctx };
  }

  it('registers the h-include directive', () => {
    expect(alpine._directives['h-include']).toBeTypeOf('function');
  });

  it('calls evaluateLater with the expression', () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200, text: async () => '<p>Hello</p>' });
    const { evaluateLaterMock } = invokeDirective('/some/path.html');
    expect(evaluateLaterMock).toHaveBeenCalledWith('/some/path.html');
  });

  it('calls effect to set up reactive URL watching', () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200, text: async () => '' });
    const { effectMock } = invokeDirective('/page.html');
    expect(effectMock).toHaveBeenCalledTimes(1);
  });

  it('clears innerHTML before fetching', () => {
    el.innerHTML = '<span>old content</span>';
    global.fetch = vi.fn().mockResolvedValue({ status: 200, text: async () => '<p>new</p>' });
    invokeDirective('/page.html');
    expect(el.innerHTML).toBe('');
  });

  it('calls fetch with the provided URL', () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200, text: async () => '<p>content</p>' });
    invokeDirective('/my/page.html');
    expect(global.fetch).toHaveBeenCalledWith('/my/page.html');
  });

  it('does not call fetch when url is null', () => {
    global.fetch = vi.fn();
    invokeDirective(null);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not call fetch when url is empty string', () => {
    global.fetch = vi.fn();
    invokeDirective('');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('sets innerHTML to fetched content on successful response', async () => {
    const htmlContent = '<p>Loaded content</p>';
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      text: async () => htmlContent,
    });
    invokeDirective('/page.html');
    await vi.waitFor(() => {
      expect(el.innerHTML).toBe(htmlContent);
    });
  });

  it('does not set innerHTML on non-200 response', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockResolvedValue({
      status: 404,
      text: async () => 'Not Found',
    });
    el.innerHTML = '';
    invokeDirective('/missing.html');
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(el.innerHTML).toBe('');
    consoleErrorSpy.mockRestore();
  });

  it('registers a cleanup callback', () => {
    global.fetch = vi.fn().mockResolvedValue({ status: 200, text: async () => '' });
    const { cleanupMock } = invokeDirective('/page.html');
    expect(cleanupMock).toHaveBeenCalledTimes(1);
  });

  it('calls Alpine.initTree for non-script children after load', async () => {
    const htmlContent = '<div class="loaded-child"></div>';
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      text: async () => htmlContent,
    });
    invokeDirective('/page.html');
    await vi.waitFor(() => {
      expect(el.querySelector('.loaded-child')).not.toBeNull();
    });
    expect(alpine.initTree).toHaveBeenCalled();
  });

  it('does not throw when fetch rejects', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
    expect(() => invokeDirective('/bad.html')).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 10));
    consoleErrorSpy.mockRestore();
  });
});
