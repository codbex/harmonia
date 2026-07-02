import { describe, expect, it } from 'vitest';
import { KNOWN_COLORS, colorClass, colorToken, colorVar, resolveColor, textColorClass } from '../../src/common/colors';

describe('colors', () => {
  it('lists the standard colors', () => {
    expect(KNOWN_COLORS).toContain('yellow');
    expect(KNOWN_COLORS).toContain('white');
    expect(KNOWN_COLORS).toContain('black');
  });

  it('tokenizes chromatic colors at the 500 step and white/black without one', () => {
    expect(colorToken('red')).toBe('red-500');
    expect(colorToken('white')).toBe('white');
    expect(colorToken('black')).toBe('black');
  });

  it('builds bg, text and var forms', () => {
    expect(colorClass('blue')).toBe('bg-blue-500');
    expect(textColorClass('blue')).toBe('text-blue-500');
    expect(textColorClass('white')).toBe('text-white');
    expect(colorVar('green')).toBe('var(--color-green-500)');
  });

  it('resolves known colors and falls back otherwise', () => {
    expect(resolveColor('red', 'yellow')).toBe('red');
    expect(resolveColor('not-a-color', 'yellow')).toBe('yellow');
    expect(resolveColor(null, 'yellow')).toBe('yellow');
  });
});
