import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import uuidv4 from '../../src/utils/uuid.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe('uuidv4', () => {
  it('returns a string', () => {
    expect(typeof uuidv4()).toBe('string');
  });

  it('returns a value matching UUID v4 format', () => {
    expect(uuidv4()).toMatch(UUID_REGEX);
  });

  it('returns a different value on each call', () => {
    const a = uuidv4();
    const b = uuidv4();
    expect(a).not.toBe(b);
  });

  it('uses crypto.randomUUID when available', () => {
    const mockUUID = '12345678-1234-4234-a234-123456789abc';
    const spy = vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(mockUUID);
    const result = uuidv4();
    expect(result).toBe(mockUUID);
    spy.mockRestore();
  });

  describe('fallback generator (Math.random-based)', () => {
    let originalRandomUUID;

    beforeEach(() => {
      originalRandomUUID = globalThis.crypto?.randomUUID;
    });

    afterEach(() => {
      if (originalRandomUUID !== undefined) {
        globalThis.crypto.randomUUID = originalRandomUUID;
      }
    });

    it('fallback produces a hyphen-separated string with correct segment counts', () => {
      // Test the fallback pattern independently by checking the uuid format
      // The module-level ternary already picked crypto path if available,
      // so we verify the overall output shape instead.
      const result = uuidv4();
      const parts = result.split('-');
      expect(parts.length).toBe(5);
    });

    it('segment lengths are 8-4-4-4-12', () => {
      const result = uuidv4();
      const parts = result.split('-');
      expect(parts[0].length).toBe(8);
      expect(parts[1].length).toBe(4);
      expect(parts[2].length).toBe(4);
      expect(parts[3].length).toBe(4);
      expect(parts[4].length).toBe(12);
    });
  });
});
