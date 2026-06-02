import { beforeEach, describe, expect, it, vi } from 'vitest';
import accordionPlugin from '../../src/components/accordion.js';
import { mountDirective } from '../test-utils.js';

// happy-dom does not implement window.matchMedia
vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

describe('h-accordion', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('registers all accordion directives', () => {
    const { alpine } = mountDirective(accordionPlugin, 'h-accordion', el);
    expect(alpine._directives['h-accordion']).toBeDefined();
    expect(alpine._directives['h-accordion-item']).toBeDefined();
    expect(alpine._directives['h-accordion-trigger']).toBeDefined();
    expect(alpine._directives['h-accordion-content']).toBeDefined();
  });

  it('sets data-slot="accordion"', () => {
    mountDirective(accordionPlugin, 'h-accordion', el);
    expect(el.getAttribute('data-slot')).toBe('accordion');
  });

  it('creates a non-single accordion state by default', () => {
    mountDirective(accordionPlugin, 'h-accordion', el);
    expect(el._h_accordion).toEqual({ single: false });
  });

  it('creates a single accordion state with single modifier', () => {
    mountDirective(accordionPlugin, 'h-accordion', el, { modifiers: ['single'], expression: '' });
    expect(el._h_accordion.single).toBe(true);
    expect(el._h_accordion.expandedId).toBe('');
  });

  it('uses expression as initial expandedId when single', () => {
    mountDirective(accordionPlugin, 'h-accordion', el, { modifiers: ['single'], expression: 'item-1' });
    expect(el._h_accordion.expandedId).toBe('item-1');
  });
});

describe('h-accordion-item', () => {
  let parentEl, el;

  beforeEach(() => {
    parentEl = document.createElement('div');
    parentEl._h_accordion = { single: false };
    el = document.createElement('div');
    parentEl.appendChild(el);
    document.body.appendChild(parentEl);
  });

  it('adds border classes', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el);
    expect(el.classList.contains('border-b')).toBe(true);
    expect(el.classList.contains('last:border-b-0')).toBe(true);
  });

  it('sets data-slot="accordion-item"', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el);
    expect(el.getAttribute('data-slot')).toBe('accordion-item');
  });

  it('creates reactive _h_accordionItem with id and controls', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el, { expression: 'test-id' });
    expect(el._h_accordionItem.id).toBe('test-id');
    expect(el._h_accordionItem.controls).toBeTruthy();
    expect(typeof el._h_accordionItem.expanded).toBe('boolean');
  });

  it('throws if no accordion parent', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(accordionPlugin, 'h-accordion-item', orphan, { original: 'h-accordion-item' })).toThrow();
  });

  it('is not expanded by default', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el);
    expect(el._h_accordionItem.expanded).toBe(false);
  });

  it('is expanded with default modifier', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el, { modifiers: ['default'] });
    expect(el._h_accordionItem.expanded).toBe(true);
  });
});

describe('h-accordion-trigger', () => {
  let rootEl, itemEl, triggerEl;

  beforeEach(() => {
    rootEl = document.createElement('div');
    rootEl._h_accordion = { single: false };

    itemEl = document.createElement('div');
    itemEl._h_accordionItem = { id: 'item-1', controls: 'content-1', expanded: false };
    rootEl.appendChild(itemEl);

    triggerEl = document.createElement('h2');
    itemEl.appendChild(triggerEl);

    document.body.appendChild(rootEl);
  });

  it('adds layout classes to the trigger header', () => {
    mountDirective(accordionPlugin, 'h-accordion-trigger', triggerEl, { original: 'h-accordion-trigger', expression: '' });
    expect(triggerEl.classList.contains('flex')).toBe(true);
    expect(triggerEl.classList.contains('h-12')).toBe(true);
  });

  it('creates a button child with data-slot="accordion-trigger"', () => {
    mountDirective(accordionPlugin, 'h-accordion-trigger', triggerEl, { original: 'h-accordion-trigger', expression: '' });
    const btn = triggerEl.querySelector('[data-slot="accordion-trigger"]');
    expect(btn).toBeTruthy();
    expect(btn.tagName).toBe('BUTTON');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(accordionPlugin, 'h-accordion-trigger', triggerEl, { original: 'h-accordion-trigger', expression: '' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('sets aria-expanded on the button', () => {
    mountDirective(accordionPlugin, 'h-accordion-trigger', triggerEl, { original: 'h-accordion-trigger', expression: '' });
    const btn = triggerEl.querySelector('button');
    expect(btn.getAttribute('aria-expanded')).toBe('false');
  });

  it('throws if element is not a heading', () => {
    const div = document.createElement('div');
    itemEl.appendChild(div);
    expect(() => mountDirective(accordionPlugin, 'h-accordion-trigger', div, { original: 'h-accordion-trigger', expression: '' })).toThrow();
  });

  it('throws if no accordion-item parent', () => {
    const orphanHeader = document.createElement('h2');
    rootEl.appendChild(orphanHeader);
    expect(() => mountDirective(accordionPlugin, 'h-accordion-trigger', orphanHeader, { original: 'h-accordion-trigger', expression: '' })).toThrow();
  });
});

describe('h-accordion-content', () => {
  let rootEl, itemEl, contentEl;

  beforeEach(() => {
    rootEl = document.createElement('div');
    itemEl = document.createElement('div');
    itemEl._h_accordionItem = { id: 'item-1', controls: 'content-1', expanded: false };
    rootEl.appendChild(itemEl);

    contentEl = document.createElement('div');
    itemEl.appendChild(contentEl);

    document.body.appendChild(rootEl);
  });

  it('adds base classes', () => {
    mountDirective(accordionPlugin, 'h-accordion-content', contentEl);
    expect(contentEl.classList.contains('overflow-hidden')).toBe(true);
    expect(contentEl.classList.contains('text-sm')).toBe(true);
    expect(contentEl.classList.contains('hidden')).toBe(true);
  });

  it('sets data-slot="accordion-content"', () => {
    mountDirective(accordionPlugin, 'h-accordion-content', contentEl);
    expect(contentEl.getAttribute('data-slot')).toBe('accordion-content');
  });

  it('sets id and aria-labelledby from parent item', () => {
    mountDirective(accordionPlugin, 'h-accordion-content', contentEl);
    expect(contentEl.getAttribute('id')).toBe('content-1');
    expect(contentEl.getAttribute('aria-labelledby')).toBe('item-1');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(accordionPlugin, 'h-accordion-content', contentEl);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
