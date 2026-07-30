import { describe, expect, it } from 'vitest';
import { getFirstChar, isPrintableCharacter } from '../../src/common/typeahead.js';

describe('isPrintableCharacter', () => {
  it('accepts a single visible character', () => {
    expect(isPrintableCharacter('a')).toBe(true);
    expect(isPrintableCharacter('7')).toBe(true);
    expect(isPrintableCharacter('!')).toBe(true);
  });

  it('rejects whitespace, so Space stays available as an activation key', () => {
    expect(isPrintableCharacter(' ')).toBe(false);
  });

  it('rejects named keys, which arrive as multi-character strings', () => {
    expect(isPrintableCharacter('Enter')).toBe(false);
    expect(isPrintableCharacter('ArrowDown')).toBe(false);
    expect(isPrintableCharacter('')).toBe(false);
  });
});

describe('getFirstChar', () => {
  it('lowercases the first character so matching is case insensitive', () => {
    expect(getFirstChar('Apple')).toBe('a');
    expect(getFirstChar('apple')).toBe('a');
  });

  it('skips the surrounding whitespace and newlines of formatted markup', () => {
    expect(getFirstChar('\n  Banana\n')).toBe('b');
  });

  it('returns an empty string when there is nothing to match', () => {
    expect(getFirstChar('')).toBe('');
    expect(getFirstChar('   \n  ')).toBe('');
  });
});
