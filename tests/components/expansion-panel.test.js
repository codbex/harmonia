import { beforeEach, describe, expect, it, vi } from 'vitest';
import expansionPanelPlugin from '../../src/components/expansion-panel.js';
import { mountDirective } from '../test-utils.js';

describe('h-exp-panel', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers all expansion panel directives', () => {
    const { alpine } = mountDirective(expansionPanelPlugin, 'h-exp-panel', el);
    expect(alpine._directives['h-exp-panel']).toBeDefined();
    expect(alpine._directives['h-exp-panel-item']).toBeDefined();
    expect(alpine._directives['h-exp-panel-trigger']).toBeDefined();
    expect(alpine._directives['h-exp-panel-content']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('group/exp')).toBe(true);
  });

  it('sets data-slot="exp-panel"', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel', el);
    expect(el.getAttribute('data-slot')).toBe('exp-panel');
  });
});

describe('h-exp-panel-item', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-item', el, { expression: 'false' }, { evaluate: vi.fn().mockReturnValue(false) });
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-col')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('border-b')).toBe(true);
  });

  it('sets data-slot="exp-panel-item"', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-item', el, { expression: 'false' }, { evaluate: vi.fn().mockReturnValue(false) });
    expect(el.getAttribute('data-slot')).toBe('exp-panel-item');
  });

  it('creates reactive _h_expPanelItem', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-item', el, { expression: 'false' }, { evaluate: vi.fn().mockReturnValue(false) });
    expect(el._h_expPanelItem).toBeDefined();
    expect(typeof el._h_expPanelItem.controls).toBe('string');
  });

  it('uses element id when present', () => {
    el.setAttribute('id', 'custom-id');
    mountDirective(expansionPanelPlugin, 'h-exp-panel-item', el, { expression: 'false' }, { evaluate: vi.fn().mockReturnValue(false) });
    expect(el._h_expPanelItem.controls).toBe('custom-id');
  });

  it('starts collapsed when expression is false', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-item', el, { expression: 'false' }, { evaluate: vi.fn().mockReturnValue(false) });
    // expanded is whatever evaluate returns
    expect(el._h_expPanelItem.expanded).toBe(false);
    expect(el.classList.contains('flex-[0_1_0]')).toBe(true);
  });

  it('starts expanded when expression is true', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-item', el, { expression: 'true' }, { evaluate: vi.fn().mockReturnValue(true) });
    expect(el._h_expPanelItem.expanded).toBe(true);
    expect(el.classList.contains('flex-[1_1_0]')).toBe(true);
  });
});

describe('h-exp-panel-trigger', () => {
  let panelItemEl, triggerEl;

  beforeEach(() => {
    panelItemEl = document.createElement('div');
    panelItemEl._h_expPanelItem = { id: 'item-1', controls: 'content-1', expanded: false };

    triggerEl = document.createElement('h2');
    panelItemEl.appendChild(triggerEl);
    document.body.appendChild(panelItemEl);
  });

  it('adds header layout classes', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', triggerEl, { original: 'h-exp-panel-trigger', expression: '' });
    expect(triggerEl.classList.contains('flex')).toBe(true);
    expect(triggerEl.classList.contains('h-12')).toBe(true);
    expect(triggerEl.classList.contains('bg-object-header')).toBe(true);
  });

  it('creates a button with data-slot="exp-panel-trigger"', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', triggerEl, { original: 'h-exp-panel-trigger', expression: '' });
    const btn = triggerEl.querySelector('[data-slot="exp-panel-trigger"]');
    expect(btn).toBeTruthy();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('sets aria-expanded on button', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', triggerEl, { original: 'h-exp-panel-trigger', expression: '' });
    const btn = triggerEl.querySelector('button');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('sets aria-controls on button', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', triggerEl, { original: 'h-exp-panel-trigger', expression: '' });
    const btn = triggerEl.querySelector('button');
    expect(btn.getAttribute('aria-controls')).toBe('content-1');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', triggerEl, { original: 'h-exp-panel-trigger', expression: '' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('throws if element is not a heading', () => {
    const div = document.createElement('div');
    panelItemEl.appendChild(div);
    expect(() => mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', div, { original: 'h-exp-panel-trigger', expression: '' })).toThrow();
  });

  it('throws if no exp-panel-item parent', () => {
    const orphan = document.createElement('h2');
    document.body.appendChild(orphan);
    expect(() => mountDirective(expansionPanelPlugin, 'h-exp-panel-trigger', orphan, { original: 'h-exp-panel-trigger', expression: '' })).toThrow();
  });
});

describe('h-exp-panel-content', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds flex-1 and overflow-scroll classes', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-content', el);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('overflow-scroll')).toBe(true);
  });

  it('sets data-slot="exp-panel-content"', () => {
    mountDirective(expansionPanelPlugin, 'h-exp-panel-content', el);
    expect(el.getAttribute('data-slot')).toBe('exp-panel-content');
  });
});
