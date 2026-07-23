import { describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({
    x: 10,
    y: 20,
    placement: 'top',
    middlewareData: { arrow: { x: 5, y: undefined } },
  }),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  arrow: vi.fn(),
}));

import tooltipPlugin from '../../src/components/tooltip.js';
import { mountDirective } from '../test-utils.js';

describe('h-tooltip-trigger', () => {
  it('initializes _h_tooltip reactive state', () => {
    const el = document.createElement('button');
    mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    expect(el._h_tooltip).toBeDefined();
    expect(el._h_tooltip.shown).toBe(false);
    expect(el._h_tooltip.controls).toMatch(/^htp/);
  });

  it('sets aria-describedby to controls value', () => {
    const el = document.createElement('button');
    mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    expect(el.getAttribute('aria-describedby')).toBe(el._h_tooltip.controls);
  });

  it('assigns existing id to _h_tooltip.id', () => {
    const el = document.createElement('button');
    el.setAttribute('id', 'my-trigger');
    mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    expect(el._h_tooltip.id).toBe('my-trigger');
  });

  it('generates id if not present', () => {
    const el = document.createElement('button');
    mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    expect(el._h_tooltip.id).toMatch(/^htt/);
    expect(el.getAttribute('id')).toBe(el._h_tooltip.id);
  });

  it('calls cleanup', () => {
    const el = document.createElement('button');
    const { ctx } = mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('dismisses on Escape while shown', () => {
    const el = document.createElement('button');
    mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    el.dispatchEvent(new Event('focus'));
    expect(el._h_tooltip.shown).toBe(true);
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el._h_tooltip.shown).toBe(false);
  });

  it('ignores other keys and only listens for keydown while shown', () => {
    const el = document.createElement('button');
    mountDirective(tooltipPlugin, 'h-tooltip-trigger', el);
    // While hidden, Escape does nothing (no keydown listener attached yet).
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el._h_tooltip.shown).toBe(false);
    // While shown, non-Escape keys leave it open.
    el.dispatchEvent(new Event('pointerenter'));
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(el._h_tooltip.shown).toBe(true);
  });
});

describe('h-tooltip', () => {
  function createTooltipSetup() {
    const container = document.createElement('div');
    const trigger = document.createElement('button');
    trigger._h_tooltip = {
      id: 'trigger-id',
      controls: 'htp-test-id',
      shown: false,
    };
    const tooltipEl = document.createElement('div');
    container.appendChild(trigger);
    container.appendChild(tooltipEl);
    document.body.appendChild(container);
    return { container, trigger, tooltipEl };
  }

  it('applies base classes', () => {
    const { tooltipEl } = createTooltipSetup();
    mountDirective(tooltipPlugin, 'h-tooltip', tooltipEl, { original: 'x-h-tooltip' });
    expect(tooltipEl.classList.contains('absolute')).toBe(true);
    expect(tooltipEl.classList.contains('bg-foreground')).toBe(true);
    expect(tooltipEl.classList.contains('text-background')).toBe(true);
    expect(tooltipEl.classList.contains('z-50')).toBe(true);
    expect(tooltipEl.classList.contains('rounded-md')).toBe(true);
    expect(tooltipEl.classList.contains('text-xs')).toBe(true);
  });

  it('sets data-slot, role, and id attributes', () => {
    const { tooltipEl, trigger } = createTooltipSetup();
    mountDirective(tooltipPlugin, 'h-tooltip', tooltipEl, { original: 'x-h-tooltip' });
    expect(tooltipEl.getAttribute('data-slot')).toBe('tooltip');
    expect(tooltipEl.getAttribute('role')).toBe('tooltip');
    expect(tooltipEl.getAttribute('id')).toBe(trigger._h_tooltip.controls);
  });

  it('appends an arrow element marked aria-hidden', () => {
    const { tooltipEl } = createTooltipSetup();
    mountDirective(tooltipPlugin, 'h-tooltip', tooltipEl, { original: 'x-h-tooltip' });
    const arrow = tooltipEl.querySelector('span');
    expect(arrow).toBeTruthy();
    expect(arrow.classList.contains('absolute')).toBe(true);
    expect(arrow.classList.contains('bg-foreground')).toBe(true);
    expect(arrow.classList.contains('rotate-45')).toBe(true);
    expect(arrow.getAttribute('aria-hidden')).toBe('true');
  });

  it('throws if no previous tooltip trigger found', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(tooltipPlugin, 'h-tooltip', el, { original: 'x-h-tooltip' })).toThrow();
  });

  it('calls cleanup', () => {
    const { tooltipEl } = createTooltipSetup();
    const { ctx } = mountDirective(tooltipPlugin, 'h-tooltip', tooltipEl, { original: 'x-h-tooltip' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
