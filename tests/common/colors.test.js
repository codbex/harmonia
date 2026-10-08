import { describe, expect, it } from 'vitest';
import { CHART_COLORS, KNOWN_COLORS, colorClass, colorToken, colorVar, fillClass, resolveColor, strokeClass, textColorClass } from '../../src/common/colors';

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

  it('lists the twelve chart colors', () => {
    expect(CHART_COLORS).toHaveLength(12);
    expect(CHART_COLORS[0]).toBe('color-1');
    expect(CHART_COLORS[11]).toBe('color-12');
  });

  it('tokenizes a chart color to its theme key and variable', () => {
    expect(colorToken('color-1')).toBe('chart-1');
    expect(fillClass('color-3')).toBe('fill-chart-3');
    expect(strokeClass('color-12')).toBe('stroke-chart-12');
    expect(colorVar('color-12')).toBe('var(--chart-color-12)');
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
    expect(resolveColor('color-1', 'yellow')).toBe('yellow');
    expect(resolveColor(null, 'yellow')).toBe('yellow');
  });
});
