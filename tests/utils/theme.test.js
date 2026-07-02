import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Must stub window.matchMedia BEFORE the theme module is imported, since it calls
// initColorScheme() at module level which calls window.matchMedia.

const colorSchemeKey = 'codbex.harmonia.colorMode';

function createMatchMediaMock(matches = false) {
  return vi.fn().mockImplementation(() => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

// Set up mock before dynamic import
vi.stubGlobal('matchMedia', createMatchMediaMock(false));

const { setColorScheme, getColorScheme, getSystemColorScheme, addColorSchemeListener, removeColorSchemeListener } = await import('../../src/utils/theme.js');

describe('getColorScheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.matchMedia = createMatchMediaMock(false);
  });

  it('returns "auto" when localStorage has no saved scheme', () => {
    expect(getColorScheme()).toBe('auto');
  });

  it('returns "dark" when localStorage has dark', () => {
    localStorage.setItem(colorSchemeKey, 'dark');
    expect(getColorScheme()).toBe('dark');
  });

  it('returns "light" when localStorage has light', () => {
    localStorage.setItem(colorSchemeKey, 'light');
    expect(getColorScheme()).toBe('light');
  });

  it('returns "auto" when localStorage has auto', () => {
    localStorage.setItem(colorSchemeKey, 'auto');
    expect(getColorScheme()).toBe('auto');
  });
});

describe('getSystemColorScheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns "dark" when prefers-color-scheme:dark matches', () => {
    window.matchMedia = createMatchMediaMock(true);
    expect(getSystemColorScheme()).toBe('dark');
  });

  it('returns "light" when prefers-color-scheme:dark does not match', () => {
    window.matchMedia = createMatchMediaMock(false);
    expect(getSystemColorScheme()).toBe('light');
  });
});

describe('setColorScheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.matchMedia = createMatchMediaMock(false);
  });

  it('sets dark class on documentElement when mode is "dark"', () => {
    setColorScheme('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('saves "dark" to localStorage when mode is "dark"', () => {
    setColorScheme('dark');
    expect(localStorage.getItem(colorSchemeKey)).toBe('dark');
  });

  it('removes dark class from documentElement when mode is "light"', () => {
    document.documentElement.classList.add('dark');
    setColorScheme('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('saves "light" to localStorage when mode is "light"', () => {
    setColorScheme('light');
    expect(localStorage.getItem(colorSchemeKey)).toBe('light');
  });

  it('saves "auto" to localStorage when mode is "auto"', () => {
    setColorScheme('auto');
    expect(localStorage.getItem(colorSchemeKey)).toBe('auto');
  });

  it('adds dark class when mode is "auto" and system prefers dark', () => {
    window.matchMedia = createMatchMediaMock(true);
    setColorScheme('auto');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when mode is "auto" and system prefers light', () => {
    document.documentElement.classList.add('dark');
    window.matchMedia = createMatchMediaMock(false);
    setColorScheme('auto');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('addColorSchemeListener / removeColorSchemeListener', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.matchMedia = createMatchMediaMock(false);
  });

  it('listener is called when setColorScheme is called with "dark"', () => {
    const cb = vi.fn();
    addColorSchemeListener(cb);
    setColorScheme('dark');
    expect(cb).toHaveBeenCalledWith('dark');
    removeColorSchemeListener(cb);
  });

  it('listener is called when setColorScheme is called with "light"', () => {
    const cb = vi.fn();
    addColorSchemeListener(cb);
    setColorScheme('light');
    expect(cb).toHaveBeenCalledWith('light');
    removeColorSchemeListener(cb);
  });

  it('listener is removed and not called after removeColorSchemeListener', () => {
    const cb = vi.fn();
    addColorSchemeListener(cb);
    removeColorSchemeListener(cb);
    setColorScheme('dark');
    expect(cb).not.toHaveBeenCalled();
  });

  it('multiple listeners all receive the scheme change', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    addColorSchemeListener(cb1);
    addColorSchemeListener(cb2);
    setColorScheme('light');
    expect(cb1).toHaveBeenCalledWith('light');
    expect(cb2).toHaveBeenCalledWith('light');
    removeColorSchemeListener(cb1);
    removeColorSchemeListener(cb2);
  });

  it('removeColorSchemeListener only removes the specified callback', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    addColorSchemeListener(cb1);
    addColorSchemeListener(cb2);
    removeColorSchemeListener(cb1);
    setColorScheme('dark');
    expect(cb1).not.toHaveBeenCalled();
    expect(cb2).toHaveBeenCalledWith('dark');
    removeColorSchemeListener(cb2);
  });
});

describe('storage event sync', () => {
  // Simulate another same-origin document (iframe or tab) writing the saved scheme.
  function dispatchStorage(key, newValue) {
    let event;
    if (typeof StorageEvent === 'function') {
      event = new StorageEvent('storage', { key, newValue });
    } else {
      event = new Event('storage');
      Object.assign(event, { key, newValue });
    }
    window.dispatchEvent(event);
  }

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    window.matchMedia = createMatchMediaMock(false);
  });

  it('adds the dark class when another document switches to "dark"', () => {
    dispatchStorage(colorSchemeKey, 'dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes the dark class when another document switches to "light"', () => {
    document.documentElement.classList.add('dark');
    dispatchStorage(colorSchemeKey, 'light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('notifies registered listeners on a storage change', () => {
    const cb = vi.fn();
    addColorSchemeListener(cb);
    dispatchStorage(colorSchemeKey, 'dark');
    expect(cb).toHaveBeenCalledWith('dark');
    removeColorSchemeListener(cb);
  });

  it('does not re-persist to localStorage (no feedback loop)', () => {
    dispatchStorage(colorSchemeKey, 'dark');
    expect(localStorage.getItem(colorSchemeKey)).toBeNull();
  });

  it('ignores storage events for unrelated keys', () => {
    const cb = vi.fn();
    addColorSchemeListener(cb);
    dispatchStorage('some.other.key', 'dark');
    expect(cb).not.toHaveBeenCalled();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    removeColorSchemeListener(cb);
  });

  it('ignores storage events with a null newValue (e.g. localStorage cleared)', () => {
    const cb = vi.fn();
    addColorSchemeListener(cb);
    dispatchStorage(colorSchemeKey, null);
    expect(cb).not.toHaveBeenCalled();
    removeColorSchemeListener(cb);
  });
});
