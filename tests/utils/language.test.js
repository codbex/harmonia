import { afterEach, describe, expect, it } from 'vitest';
import { getLanguageStorageKey, setLanguageStorageKey } from '../../src/utils/language';

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
