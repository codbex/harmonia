import { describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 10, y: 20, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import popoverPlugin from '../../src/components/popover.js';
import { mountDirective } from '../test-utils.js';

describe('h-popover-trigger', () => {
  it('initializes _h_popover reactive state', () => {
    const el = document.createElement('button');
    el.setAttribute('id', 'my-popover-trigger');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(el._h_popover).toBeDefined();
    expect(el._h_popover.controls).toMatch(/^hpc/);
    expect(el._h_popover.id).toBe('my-popover-trigger');
  });

  it('sets type=button attribute', () => {
    const el = document.createElement('button');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(el.getAttribute('type')).toBe('button');
  });

  it('sets aria-controls, aria-haspopup attributes', () => {
    const el = document.createElement('button');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(el.getAttribute('aria-controls')).toMatch(/^hpc/);
    expect(el.getAttribute('aria-haspopup')).toBe('dialog');
  });

  it('sets data-slot if not present', () => {
    const el = document.createElement('button');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(el.getAttribute('data-slot')).toBe('popover-trigger');
  });

  it('does not overwrite existing data-slot', () => {
    const el = document.createElement('button');
    el.setAttribute('data-slot', 'custom-slot');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(el.getAttribute('data-slot')).toBe('custom-slot');
  });

  it('adds chevron rotation classes when chevron modifier is used', () => {
    const el = document.createElement('button');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: ['chevron'], expression: '' });
    expect(el.classList.contains('[&_svg]:transition-transform')).toBe(true);
  });

  it('calls cleanup', () => {
    const el = document.createElement('button');
    const { ctx } = mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('sets expanded to false initially (no expression)', () => {
    const el = document.createElement('button');
    mountDirective(popoverPlugin, 'h-popover-trigger', el, { modifiers: [], expression: '' });
    expect(el._h_popover.expanded).toBe(false);
    expect(el.getAttribute('aria-expanded')).toBe('false');
  });
});

describe('h-popover', () => {
  function createPopoverSetup() {
    const container = document.createElement('div');
    const trigger = document.createElement('button');
    trigger._h_popover = {
      id: 'trigger-id',
      controls: 'hpc-test-id',
      expanded: false,
      auto: true,
    };
    const popoverEl = document.createElement('div');
    container.appendChild(trigger);
    container.appendChild(popoverEl);
    document.body.appendChild(container);
    return { container, trigger, popoverEl };
  }

  it('applies base classes', () => {
    const { popoverEl } = createPopoverSetup();
    mountDirective(popoverPlugin, 'h-popover', popoverEl, {
      original: 'x-h-popover',
      modifiers: [],
    });
    expect(popoverEl.classList.contains('absolute')).toBe(true);
    expect(popoverEl.classList.contains('bg-popover')).toBe(true);
    expect(popoverEl.classList.contains('hidden')).toBe(true);
    expect(popoverEl.classList.contains('rounded-md')).toBe(true);
  });

  it('sets role, tabindex, data-slot and id attributes', () => {
    const { popoverEl, trigger } = createPopoverSetup();
    mountDirective(popoverPlugin, 'h-popover', popoverEl, {
      original: 'x-h-popover',
      modifiers: [],
    });
    expect(popoverEl.getAttribute('role')).toBe('dialog');
    expect(popoverEl.getAttribute('tabindex')).toBe('-1');
    expect(popoverEl.getAttribute('data-slot')).toBe('popover');
    expect(popoverEl.getAttribute('id')).toBe(trigger._h_popover.controls);
    expect(popoverEl.getAttribute('aria-labelledby')).toBe(trigger._h_popover.id);
  });

  it('throws if no previous popover trigger element found', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(popoverPlugin, 'h-popover', el, { original: 'x-h-popover', modifiers: [] })).toThrow();
  });

  it('calls cleanup', () => {
    const { popoverEl } = createPopoverSetup();
    const { ctx } = mountDirective(popoverPlugin, 'h-popover', popoverEl, {
      original: 'x-h-popover',
      modifiers: [],
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('replaces overflow-auto with overflow-none for no-scroll modifier', () => {
    const { popoverEl } = createPopoverSetup();
    mountDirective(popoverPlugin, 'h-popover', popoverEl, {
      original: 'x-h-popover',
      modifiers: ['no-scroll'],
    });
    expect(popoverEl.classList.contains('overflow-auto')).toBe(false);
    expect(popoverEl.classList.contains('overflow-none')).toBe(true);
  });
});
