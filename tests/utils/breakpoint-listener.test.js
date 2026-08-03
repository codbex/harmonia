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
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('calls matchMedia with the correct query for default breakpoint', () => {
    const handler = vi.fn();
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

  it('uses the top frame when topFrame=true', () => {
    const handler = vi.fn();
    const topMql = createMockMql(false);
    const topMatchMedia = vi.fn().mockReturnValue(topMql);
    vi.stubGlobal('top', { matchMedia: topMatchMedia });

    getBreakpointListener(handler, 768, true);

    expect(topMatchMedia).toHaveBeenCalledWith('(width <= 768px)');
    expect(window.matchMedia).not.toHaveBeenCalled();
  });

  // A cross-origin ancestor makes `top` a restricted proxy: reading `matchMedia` off
  // it throws. happy-dom iframes are same-origin, so the throw has to be stubbed.
  const stubCrossOriginTop = () =>
    vi.stubGlobal('top', {
      get matchMedia() {
        throw new DOMException('Permission denied to access property "matchMedia" on cross-origin object', 'SecurityError');
      },
    });

  it('never touches the top frame by default, so a cross-origin ancestor cannot throw', () => {
    const handler = vi.fn();
    stubCrossOriginTop();

    expect(() => getBreakpointListener(handler)).not.toThrow();
    expect(window.matchMedia).toHaveBeenCalledWith('(width <= 768px)');
    expect(handler).toHaveBeenCalledWith(false);
  });

  it('falls back to this frame when topFrame=true but the top frame is cross-origin', () => {
    const handler = vi.fn();
    stubCrossOriginTop();

    const listener = getBreakpointListener(handler, 1024, true);

    expect(window.matchMedia).toHaveBeenCalledWith('(width <= 1024px)');
    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(handler).toHaveBeenCalledWith(false);
    // still a working listener, not a half-built one
    listener.remove();
    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
