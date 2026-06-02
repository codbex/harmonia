import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getBreakpointListener } from '../../src/utils/breakpoint-listener.js';

function createMockMql(matches = false) {
  const listeners = {};
  return {
    matches,
    addEventListener: vi.fn((event, cb) => {
      listeners[event] = cb;
    }),
    removeEventListener: vi.fn((event, cb) => {
      if (listeners[event] === cb) delete listeners[event];
    }),
    _listeners: listeners,
  };
}

describe('getBreakpointListener', () => {
  let mockMql;
  let originalMatchMedia;

  beforeEach(() => {
    mockMql = createMockMql(false);
    originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue(mockMql);
    // In happy-dom top === window, so both paths use the same mock
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('calls matchMedia with the correct query for default breakpoint', () => {
    const handler = vi.fn();
    // frame=false (default) uses top.matchMedia; in happy-dom top === window
    getBreakpointListener(handler);
    expect(window.matchMedia).toHaveBeenCalledWith('(width <= 768px)');
  });

  it('calls window.matchMedia with a custom numeric breakpoint', () => {
    const handler = vi.fn();
    getBreakpointListener(handler, 1024);
    expect(window.matchMedia).toHaveBeenCalledWith('(width <= 1024px)');
  });

  it('calls window.matchMedia with a string breakpoint as-is', () => {
    const handler = vi.fn();
    getBreakpointListener(handler, '60em');
    expect(window.matchMedia).toHaveBeenCalledWith('(width <= 60em)');
  });

  it('calls handler immediately with mql.matches value (false)', () => {
    const handler = vi.fn();
    mockMql.matches = false;
    getBreakpointListener(handler, 768);
    expect(handler).toHaveBeenCalledWith(false);
  });

  it('calls handler immediately with mql.matches value (true)', () => {
    const handler = vi.fn();
    mockMql.matches = true;
    getBreakpointListener(handler, 768);
    expect(handler).toHaveBeenCalledWith(true);
  });

  it('registers a change event listener on the mql', () => {
    const handler = vi.fn();
    getBreakpointListener(handler, 768);
    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('returns an object with remove function', () => {
    const handler = vi.fn();
    const result = getBreakpointListener(handler, 768);
    expect(typeof result.remove).toBe('function');
  });

  it('calls handler with event.matches when change event fires', () => {
    const handler = vi.fn();
    getBreakpointListener(handler, 768);
    handler.mockClear();
    const changeCallback = mockMql.addEventListener.mock.calls[0][1];
    changeCallback({ matches: true });
    expect(handler).toHaveBeenCalledWith(true);
  });

  it('calls handler with false when change event fires with matches=false', () => {
    const handler = vi.fn();
    getBreakpointListener(handler, 768);
    handler.mockClear();
    const changeCallback = mockMql.addEventListener.mock.calls[0][1];
    changeCallback({ matches: false });
    expect(handler).toHaveBeenCalledWith(false);
  });

  it('remove() calls removeEventListener on the mql', () => {
    const handler = vi.fn();
    const result = getBreakpointListener(handler, 768);
    result.remove();
    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', result._onWidthChange);
  });

  it('remove() removes the same callback that was registered', () => {
    const handler = vi.fn();
    const result = getBreakpointListener(handler, 768);
    const registeredCb = mockMql.addEventListener.mock.calls[0][1];
    result.remove();
    const removedCb = mockMql.removeEventListener.mock.calls[0][1];
    expect(removedCb).toBe(registeredCb);
  });

  it('uses window.matchMedia when frame=true (same as top in happy-dom)', () => {
    const handler = vi.fn();
    // frame=true uses window.matchMedia; in happy-dom top === window so both paths hit the same mock
    getBreakpointListener(handler, 768, true);
    expect(window.matchMedia).toHaveBeenCalledWith('(width <= 768px)');
  });
});
