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
    expect(el.classList.contains('text-card-foreground')).toBe(true);
    expect(el.classList.contains('rounded-xl')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('shadow-sm')).toBe(true);
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

  it('sets data-slot="card-header"', () => {
    mountDirective(cardPlugin, 'h-card-header', el);
    expect(el.getAttribute('data-slot')).toBe('card-header');
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

  it('sets data-slot="card-footer"', () => {
    mountDirective(cardPlugin, 'h-card-footer', el);
    expect(el.getAttribute('data-slot')).toBe('card-footer');
  });
});
