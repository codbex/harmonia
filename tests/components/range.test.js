import { describe, it, expect, vi } from 'vitest';

vi.mock('nouislider', () => ({
  create: vi.fn().mockReturnValue({
    on: vi.fn(),
    off: vi.fn(),
    set: vi.fn(),
    destroy: vi.fn(),
    updateOptions: vi.fn(),
  }),
}));

import { mountDirective } from '../test-utils.js';
import rangePlugin from '../../src/components/range.js';
import { create } from 'nouislider';

describe('h-range', () => {
  it('applies harmonia-slider class', () => {
    const el = document.createElement('div');
    mountDirective(rangePlugin, 'h-range', el, { expression: '{}' }, {
      evaluate: vi.fn().mockReturnValue({ start: [50], range: { min: 0, max: 100 } }),
    });
    expect(el.classList.contains('harmonia-slider')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('div');
    mountDirective(rangePlugin, 'h-range', el, { expression: '{}' }, {
      evaluate: vi.fn().mockReturnValue({ start: [50], range: { min: 0, max: 100 } }),
    });
    expect(el.getAttribute('data-slot')).toBe('range');
  });

  it('calls nouislider create with the element and options', () => {
    const el = document.createElement('div');
    const options = { start: [50], range: { min: 0, max: 100 } };
    mountDirective(rangePlugin, 'h-range', el, { expression: 'opts' }, {
      evaluate: vi.fn().mockReturnValue(options),
    });
    expect(create).toHaveBeenCalledWith(el, options);
  });

  it('registers change listener and cleanup when x_model present', () => {
    const el = document.createElement('div');
    const mockSet = vi.fn();
    const mockGet = vi.fn().mockReturnValue([50]);
    el._x_model = { set: mockSet, get: mockGet };
    el.noUiSlider = { on: vi.fn(), off: vi.fn() };

    const { ctx } = mountDirective(rangePlugin, 'h-range', el, { expression: '{}' }, {
      evaluate: vi.fn().mockReturnValue({ start: [50], range: { min: 0, max: 100 } }),
    });

    expect(el.noUiSlider.on).toHaveBeenCalled();
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
