import { beforeEach, describe, expect, it } from 'vitest';
import infoPagePlugin from '../../src/components/info-page.js';
import { mountDirective } from '../test-utils.js';

describe('h-info-page', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers all info-page directives', () => {
    const { alpine } = mountDirective(infoPagePlugin, 'h-info-page', el);
    expect(alpine._directives['h-info-page']).toBeDefined();
    expect(alpine._directives['h-info-page-header']).toBeDefined();
    expect(alpine._directives['h-info-page-media']).toBeDefined();
    expect(alpine._directives['h-info-page-title']).toBeDefined();
    expect(alpine._directives['h-info-page-description']).toBeDefined();
    expect(alpine._directives['h-info-page-content']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(infoPagePlugin, 'h-info-page', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('justify-center')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('border-dashed')).toBe(true);
    expect(el.classList.contains('text-center')).toBe(true);
  });

  it('sets data-slot="info-page"', () => {
    mountDirective(infoPagePlugin, 'h-info-page', el);
    expect(el.getAttribute('data-slot')).toBe('info-page');
  });
});

describe('h-info-page-header', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(infoPagePlugin, 'h-info-page-header', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('text-center')).toBe(true);
  });

  it('sets data-slot="info-page-header"', () => {
    mountDirective(infoPagePlugin, 'h-info-page-header', el);
    expect(el.getAttribute('data-slot')).toBe('info-page-header');
  });
});

describe('h-info-page-media', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(infoPagePlugin, 'h-info-page-media', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('adds bg-transparent without icon modifier', () => {
    mountDirective(infoPagePlugin, 'h-info-page-media', el);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('bg-muted')).toBe(false);
  });

  it('adds icon classes with icon modifier', () => {
    mountDirective(infoPagePlugin, 'h-info-page-media', el, { modifiers: ['icon'] });
    expect(el.classList.contains('bg-muted')).toBe(true);
    expect(el.classList.contains('size-10')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
  });

  it('sets data-slot="info-page-media"', () => {
    mountDirective(infoPagePlugin, 'h-info-page-media', el);
    expect(el.getAttribute('data-slot')).toBe('info-page-media');
  });
});

describe('h-info-page-title', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('h2');
  });

  it('adds text-lg, font-medium, tracking-tight', () => {
    mountDirective(infoPagePlugin, 'h-info-page-title', el);
    expect(el.classList.contains('text-lg')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('tracking-tight')).toBe(true);
  });

  it('sets data-slot="info-page-title"', () => {
    mountDirective(infoPagePlugin, 'h-info-page-title', el);
    expect(el.getAttribute('data-slot')).toBe('info-page-title');
  });
});

describe('h-info-page-description', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('p');
  });

  it('adds text-muted-foreground and text-sm/relaxed', () => {
    mountDirective(infoPagePlugin, 'h-info-page-description', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-sm/relaxed')).toBe(true);
  });

  it('sets data-slot="info-page-description"', () => {
    mountDirective(infoPagePlugin, 'h-info-page-description', el);
    expect(el.getAttribute('data-slot')).toBe('info-page-description');
  });
});

describe('h-info-page-content', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(infoPagePlugin, 'h-info-page-content', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
  });

  it('sets data-slot', () => {
    mountDirective(infoPagePlugin, 'h-info-page-content', el);
    expect(el.getAttribute('data-slot')).toBe('info-page-content');
  });
});
