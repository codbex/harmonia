import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import accordionPlugin from '../../src/components/accordion.js';
import { createMockAlpine, mountDirective } from '../test-utils.js';

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

  it('uses the evaluated expression as initial expandedId when single', () => {
    mountDirective(accordionPlugin, 'h-accordion', el, { modifiers: ['single'], expression: 'ids.first' }, { evaluate: () => 'item-1' });
    expect(el._h_accordion.expandedId).toBe('item-1');
  });

  it('falls back to an empty expandedId when the expression evaluates to null', () => {
    mountDirective(accordionPlugin, 'h-accordion', el, { modifiers: ['single'], expression: 'missing' }, { evaluate: () => null });
    expect(el._h_accordion.expandedId).toBe('');
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
    mountDirective(accordionPlugin, 'h-accordion-item', el, { expression: "'test-id'" }, { evaluate: () => 'test-id' });
    expect(el._h_accordionItem.id).toBe('test-id');
    expect(el._h_accordionItem.controls).toBeTruthy();
    expect(typeof el._h_accordionItem.expanded).toBe('boolean');
  });

  it('uses the evaluated expression as the id', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el, { expression: 'item.id' }, { evaluate: () => 'row-1' });
    expect(el._h_accordionItem.id).toBe('row-1');
  });

  it('generates distinct non-empty ids for items without an expression', () => {
    const sibling = document.createElement('div');
    parentEl.appendChild(sibling);
    mountDirective(accordionPlugin, 'h-accordion-item', el);
    mountDirective(accordionPlugin, 'h-accordion-item', sibling);
    expect(el._h_accordionItem.id).toBeTruthy();
    expect(sibling._h_accordionItem.id).toBeTruthy();
    expect(el._h_accordionItem.id).not.toBe(sibling._h_accordionItem.id);
  });

  it('falls back to a generated id when the expression evaluates to null', () => {
    mountDirective(accordionPlugin, 'h-accordion-item', el, { expression: 'missing' }, { evaluate: () => null });
    expect(el._h_accordionItem.id).toBeTruthy();
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

describe('single mode', () => {
  // Regression for #77: items without an expression all got the empty string
  // as id, so opening a second item never collapsed the first.
  it('collapses the previously open item when items have no explicit id', () => {
    const rootEl = document.createElement('div');
    document.body.appendChild(rootEl);
    mountDirective(accordionPlugin, 'h-accordion', rootEl, { modifiers: ['single'] });

    const items = [];
    const triggers = [];
    for (let i = 0; i < 2; i++) {
      const itemEl = document.createElement('div');
      rootEl.appendChild(itemEl);
      mountDirective(accordionPlugin, 'h-accordion-item', itemEl);
      const triggerEl = document.createElement('h3');
      itemEl.appendChild(triggerEl);
      mountDirective(accordionPlugin, 'h-accordion-trigger', triggerEl, { original: 'h-accordion-trigger', expression: '' });
      items.push(itemEl);
      triggers.push(triggerEl);
    }

    triggers[0].dispatchEvent(new Event('click'));
    expect(items[0]._h_accordionItem.expanded).toBe(true);

    triggers[1].dispatchEvent(new Event('click'));
    expect(items[1]._h_accordionItem.expanded).toBe(true);
    expect(items[0]._h_accordionItem.expanded).toBe(false);
    expect(triggers[0].querySelector('button').getAttribute('aria-expanded')).toBe('false');
    expect(triggers[1].querySelector('button').getAttribute('aria-expanded')).toBe('true');
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

describe('h-accordion-content expand and collapse', () => {
  let itemEl, contentEl;

  function mountContent() {
    const rootEl = document.createElement('div');
    itemEl = document.createElement('div');
    itemEl._h_accordionItem = createMockAlpine().reactive({ id: 'item-1', controls: 'content-1', expanded: false });
    rootEl.appendChild(itemEl);
    contentEl = document.createElement('div');
    itemEl.appendChild(contentEl);
    document.body.appendChild(rootEl);
    mountDirective(accordionPlugin, 'h-accordion-content', contentEl);
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('stops intercepting pointer events the moment the collapse starts', () => {
    mountContent();
    itemEl._h_accordionItem.expanded = true;
    expect(contentEl.classList.contains('hidden')).toBe(false);
    expect(contentEl.classList.contains('pointer-events-none')).toBe(false);
    itemEl._h_accordionItem.expanded = false;
    expect(contentEl.classList.contains('pointer-events-none')).toBe(true);
    expect(contentEl.classList.contains('hidden')).toBe(false);
    contentEl.dispatchEvent(new Event('transitionend'));
    expect(contentEl.classList.contains('hidden')).toBe(true);
  });

  it('hides via the fallback timer when transitionend never fires', () => {
    vi.useFakeTimers();
    mountContent();
    itemEl._h_accordionItem.expanded = true;
    itemEl._h_accordionItem.expanded = false;
    expect(contentEl.classList.contains('hidden')).toBe(false);
    vi.advanceTimersByTime(250);
    expect(contentEl.classList.contains('hidden')).toBe(true);
  });

  // The expanded branch used to act only when hidden was already applied, so a
  // reopen during the collapse fade did nothing and the late transitionend then
  // wedged the expanded content hidden.
  it('recovers when reopened mid-collapse and ignores the late transitionend', () => {
    mountContent();
    itemEl._h_accordionItem.expanded = true;
    itemEl._h_accordionItem.expanded = false;
    itemEl._h_accordionItem.expanded = true;
    expect(contentEl.classList.contains('opacity-0')).toBe(false);
    expect(contentEl.classList.contains('pointer-events-none')).toBe(false);
    expect(contentEl.classList.contains('pb-4')).toBe(true);
    contentEl.dispatchEvent(new Event('transitionend'));
    expect(contentEl.classList.contains('hidden')).toBe(false);
  });
});
