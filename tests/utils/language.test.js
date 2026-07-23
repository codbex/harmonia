import { afterEach, describe, expect, it } from 'vitest';
import { getLanguageStorageKey, resolveLocale, setLanguageStorageKey } from '../../src/utils/language';

const DEFAULT_KEY = 'codbex.harmonia.language';

describe('language storage key', () => {
  afterEach(() => {
    setLanguageStorageKey(DEFAULT_KEY);
  });

  it('defaults to the harmonia namespaced key', () => {
    expect(getLanguageStorageKey()).toBe(DEFAULT_KEY);
  });

  it('returns the configured key after setting it', () => {
    setLanguageStorageKey('myapp.language');
    expect(getLanguageStorageKey()).toBe('myapp.language');
  });

  it('ignores an empty or non-string key', () => {
    setLanguageStorageKey('');
    expect(getLanguageStorageKey()).toBe(DEFAULT_KEY);
    setLanguageStorageKey(null);
    expect(getLanguageStorageKey()).toBe(DEFAULT_KEY);
    setLanguageStorageKey(42);
    expect(getLanguageStorageKey()).toBe(DEFAULT_KEY);
  });
});

describe('resolveLocale', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('lang');
  });

  it('returns the explicit locale when one is given', () => {
    document.documentElement.setAttribute('lang', 'en-GB');
    expect(resolveLocale('bg-BG')).toBe('bg-BG');
  });

  it('falls back to the document <html lang> when no explicit locale', () => {
    document.documentElement.setAttribute('lang', 'de-DE');
    expect(resolveLocale()).toBe('de-DE');
    expect(resolveLocale(null)).toBe('de-DE');
    expect(resolveLocale('')).toBe('de-DE');
  });

  it('falls back to navigator.language when there is no explicit locale or <html lang>', () => {
    // happy-dom has no <html lang> by default here; navigator.language is defined.
    expect(resolveLocale()).toBe(navigator.language);
  });
});
