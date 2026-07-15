import { describe, expect, it } from 'vitest';
import { EVENT_COLORS, colorClasses, ringClass } from '../../src/common/event-colors';

describe('event-colors', () => {
  it('returns the filled variant for confirmed / default / unknown status', () => {
    expect(colorClasses('blue', 'confirmed')).toEqual(['bg-blue-500', 'text-white']);
    expect(colorClasses('blue', undefined)).toEqual(['bg-blue-500', 'text-white']);
    expect(colorClasses('blue', 'whatever')).toEqual(['bg-blue-500', 'text-white']);
  });

  it('returns the outlined variant for unconfirmed', () => {
    expect(colorClasses('blue', 'unconfirmed')).toEqual(['border', 'border-blue-500', 'text-blue-600']);
  });

  it('returns the outlined variant plus a dashed border for rejected', () => {
    expect(colorClasses('blue', 'rejected')).toEqual(['border', 'border-blue-500', 'text-blue-600', 'border-dashed']);
    expect(colorClasses('green', 'rejected')).toEqual(['border', 'border-green-500', 'text-green-600', 'border-dashed']);
  });

  it('does not mutate the shared outlined palette when building the rejected variant', () => {
    colorClasses('blue', 'rejected');
    expect(EVENT_COLORS.blue.outlined).toEqual(['border', 'border-blue-500', 'text-blue-600']);
    expect(colorClasses('blue', 'unconfirmed')).not.toContain('border-dashed');
  });

  it('falls back to blue for an unknown color', () => {
    expect(colorClasses('not-a-color', 'confirmed')).toEqual(['bg-blue-500', 'text-white']);
    expect(colorClasses('not-a-color', 'rejected')).toEqual(['border', 'border-blue-500', 'text-blue-600', 'border-dashed']);
    expect(ringClass('not-a-color')).toBe('ring-blue-500/50');
  });
});
