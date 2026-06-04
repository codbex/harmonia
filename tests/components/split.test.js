import { describe, expect, it, vi } from 'vitest';
import splitPlugin from '../../src/components/split.js';
import { mountDirective } from '../test-utils.js';

describe('h-split', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-orientation', 'horizontal');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
    expect(el.classList.contains('min-h-0')).toBe(true);
  });

  it('initializes _h_split state on element', () => {
    const el = document.createElement('div');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split).toBeDefined();
    expect(el._h_split.panels).toBeInstanceOf(Array);
    expect(typeof el._h_split.addPanel).toBe('function');
    expect(typeof el._h_split.removePanel).toBe('function');
  });

  it('calls cleanup', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(splitPlugin, 'h-split', el, {});
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('state reflects horizontal orientation', () => {
    const el = document.createElement('div');
    el.setAttribute('data-orientation', 'horizontal');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split.state.isHorizontal).toBe(true);
  });

  it('state reflects vertical orientation', () => {
    const el = document.createElement('div');
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split.state.isHorizontal).toBe(false);
  });

  it('state reflects border variant', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'border');
    mountDirective(splitPlugin, 'h-split', el, {});
    expect(el._h_split.state.isBorder).toBe(true);
  });
});

describe('h-split-panel', () => {
  function createSplitPanelSetup() {
    const container = document.createElement('div');
    const split = document.createElement('div');
    split._h_split = {
      state: { isHorizontal: true, isBorder: false },
      panels: [],
      addPanel: vi.fn(),
      removePanel: vi.fn(),
      panelHidden: vi.fn(),
      gutterHidden: vi.fn(),
      panelChange: vi.fn(),
      resetInit: vi.fn(),
      normalize: vi.fn().mockReturnValue(null),
      saveSizes: vi.fn(),
    };
    const panel = document.createElement('div');
    split.appendChild(panel);
    container.appendChild(split);
    document.body.appendChild(container);
    return { container, split, panel };
  }

  it('applies base classes', () => {
    const { panel } = createSplitPanelSetup();
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(panel.classList.contains('flex')).toBe(true);
    expect(panel.classList.contains('shrink')).toBe(true);
    expect(panel.getAttribute('data-slot')).toBe('split-panel');
    expect(panel.getAttribute('tabindex')).toBe('-1');
  });

  it('calls addPanel on the split parent', () => {
    const { panel, split } = createSplitPanelSetup();
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(split._h_split.addPanel).toHaveBeenCalled();
  });

  it('calls cleanup', () => {
    const { panel } = createSplitPanelSetup();
    const { ctx } = mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('throws if not inside a split element', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(splitPlugin, 'h-split-panel', el, { original: 'x-h-split-panel' })).toThrow();
  });

  it('applies hidden class on init when data-hidden is true', () => {
    const { panel } = createSplitPanelSetup();
    panel.setAttribute('data-hidden', 'true');
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(panel.classList.contains('hidden')).toBe(true);
  });

  it('does not apply hidden class on init when data-hidden is not set', () => {
    const { panel } = createSplitPanelSetup();
    mountDirective(splitPlugin, 'h-split-panel', panel, { original: 'x-h-split-panel' });
    expect(panel.classList.contains('hidden')).toBe(false);
  });
});
