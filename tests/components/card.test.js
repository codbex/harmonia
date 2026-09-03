import { beforeEach, describe, expect, it } from 'vitest';
import cardPlugin from '../../src/components/card.js';
import { mountDirective } from '../test-utils.js';

describe('h-card', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('registers all card directives', () => {
    const { alpine } = mountDirective(cardPlugin, 'h-card', el);
    expect(alpine._directives['h-card']).toBeDefined();
    expect(alpine._directives['h-card-header']).toBeDefined();
    expect(alpine._directives['h-card-title']).toBeDefined();
    expect(alpine._directives['h-card-description']).toBeDefined();
    expect(alpine._directives['h-card-action']).toBeDefined();
    expect(alpine._directives['h-card-content']).toBeDefined();
    expect(alpine._directives['h-card-footer']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(cardPlugin, 'h-card', el);
    expect(el.classList.contains('bg-card')).toBe(true);
    expect(el.classList.contains('[--badge-ring:var(--card)]')).toBe(true);
    expect(el.classList.contains('text-card-foreground')).toBe(true);
    expect(el.classList.contains('rounded-xl')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('shadow-sm')).toBe(true);
  });

  it('leaves the padding and the spacing to the header, content and footer', () => {
    mountDirective(cardPlugin, 'h-card', el);
    expect(el.classList.contains('py-6')).toBe(false);
    expect(el.classList.contains('gap-4')).toBe(false);
  });

  it('sets data-slot="card"', () => {
    mountDirective(cardPlugin, 'h-card', el);
    expect(el.getAttribute('data-slot')).toBe('card');
  });
});

describe('h-card-header', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds grid and gap classes', () => {
    mountDirective(cardPlugin, 'h-card-header', el);
    expect(el.classList.contains('grid')).toBe(true);
    expect(el.classList.contains('px-6')).toBe(true);
  });

  it('pads the top, and the bottom only when it is the last rendered slot', () => {
    mountDirective(cardPlugin, 'h-card-header', el);
    expect(el.classList.contains('pt-6')).toBe(true);
    expect(el.classList.contains('last-rendered:pb-6')).toBe(true);
  });

  it('sets data-slot="card-header"', () => {
    mountDirective(cardPlugin, 'h-card-header', el);
    expect(el.getAttribute('data-slot')).toBe('card-header');
  });

  it('leaves the rows implicit so a lone title gets no gap under it', () => {
    // A declared second row exists even when nothing is placed in it, and the
    // gap before that empty track is still drawn, which left 0.5rem of dead
    // space under a header holding only a title. The rows are placed as the
    // children need them instead, sized by auto-rows-min.
    mountDirective(cardPlugin, 'h-card-header', el);
    expect(el.classList.contains('auto-rows-min')).toBe(true);
    expect(el.classList.contains('grid-rows-[auto_auto]')).toBe(false);
  });

  it('uses a shrinkable minmax(0,1fr) track for the action grid', () => {
    // A plain 1fr track is minmax(auto,1fr), whose min-content floor stops the
    // title column from shrinking and pushes the card-action out of bounds on a
    // narrow card. minmax(0,1fr) lets it shrink so the action stays inside.
    mountDirective(cardPlugin, 'h-card-header', el);
    expect(el.classList.contains('has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]')).toBe(true);
    expect(el.classList.contains('has-data-[slot=card-action]:grid-cols-[1fr_auto]')).toBe(false);
  });
});

describe('h-card-title', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds font-semibold', () => {
    mountDirective(cardPlugin, 'h-card-title', el);
    expect(el.classList.contains('font-semibold')).toBe(true);
    expect(el.classList.contains('leading-none')).toBe(true);
  });

  it('sets data-slot="card-title"', () => {
    mountDirective(cardPlugin, 'h-card-title', el);
    expect(el.getAttribute('data-slot')).toBe('card-title');
  });
});

describe('h-card-description', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds text-muted-foreground and text-sm', () => {
    mountDirective(cardPlugin, 'h-card-description', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
  });

  it('sets data-slot="card-description"', () => {
    mountDirective(cardPlugin, 'h-card-description', el);
    expect(el.getAttribute('data-slot')).toBe('card-description');
  });
});

describe('h-card-action', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds positioning classes', () => {
    mountDirective(cardPlugin, 'h-card-action', el);
    expect(el.classList.contains('col-start-2')).toBe(true);
    expect(el.classList.contains('row-span-2')).toBe(true);
    expect(el.classList.contains('self-start')).toBe(true);
  });

  it('sets data-slot="card-action"', () => {
    mountDirective(cardPlugin, 'h-card-action', el);
    expect(el.getAttribute('data-slot')).toBe('card-action');
  });
});

describe('h-card-content', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds px-6', () => {
    mountDirective(cardPlugin, 'h-card-content', el);
    expect(el.classList.contains('px-6')).toBe(true);
  });

  it('pays 16 between two slots and 24 against a card edge', () => {
    mountDirective(cardPlugin, 'h-card-content', el);
    expect(el.classList.contains('py-4')).toBe(true);
    expect(el.classList.contains('first-rendered:pt-6')).toBe(true);
    expect(el.classList.contains('last-rendered:pb-6')).toBe(true);
  });

  it('drops the padding with the flush modifier', () => {
    mountDirective(cardPlugin, 'h-card-content', el, { modifiers: ['flush'] });
    for (const padding of ['px-6', 'py-4', 'first-rendered:pt-6', 'last-rendered:pb-6']) {
      expect(el.classList.contains(padding)).toBe(false);
    }
    expect(el.getAttribute('data-slot')).toBe('card-content');
  });

  it('sets data-slot="card-content"', () => {
    mountDirective(cardPlugin, 'h-card-content', el);
    expect(el.getAttribute('data-slot')).toBe('card-content');
  });
});

describe('h-card-footer', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds flex, items-center, and px-6', () => {
    mountDirective(cardPlugin, 'h-card-footer', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('px-6')).toBe(true);
  });

  it('pads the bottom, and the top only where no content pays for it', () => {
    mountDirective(cardPlugin, 'h-card-footer', el);
    expect(el.classList.contains('pb-6')).toBe(true);
    expect(el.classList.contains('first-rendered:pt-6')).toBe(true);
    expect(el.classList.contains('[[data-slot=card-header]~&:not([data-slot=card-content]~*)]:pt-4')).toBe(true);
  });

  it('sets data-slot="card-footer"', () => {
    mountDirective(cardPlugin, 'h-card-footer', el);
    expect(el.getAttribute('data-slot')).toBe('card-footer');
  });
});
