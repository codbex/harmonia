import { describe, expect, it } from 'vitest';
import toolbarPlugin from '../../src/components/toolbar.js';
import { mountDirective } from '../test-utils.js';

describe('h-toolbar', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(toolbarPlugin, 'h-toolbar', el, { modifiers: [] });
    expect(el.classList.contains('bg-object-header')).toBe(true);
    expect(el.classList.contains('text-object-header-foreground')).toBe(true);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('h-12')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('toolbar');
  });

  it('applies border-b by default', () => {
    const el = document.createElement('div');
    mountDirective(toolbarPlugin, 'h-toolbar', el, { modifiers: [] });
    expect(el.classList.contains('border-b')).toBe(true);
  });

  it('applies border-t for footer modifier', () => {
    const el = document.createElement('div');
    mountDirective(toolbarPlugin, 'h-toolbar', el, { modifiers: ['footer'] });
    expect(el.classList.contains('border-t')).toBe(true);
    expect(el.classList.contains('border-b')).toBe(false);
  });
});

describe('h-toolbar-image', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('img');
    mountDirective(toolbarPlugin, 'h-toolbar-image', el);
    expect(el.classList.contains('size-8')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('toolbar-image');
  });
});

describe('h-toolbar-branding', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(toolbarPlugin, 'h-toolbar-branding', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-col')).toBe(true);
    expect(el.classList.contains('pl-2')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('toolbar-branding');
  });
});

describe('h-toolbar-title', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(toolbarPlugin, 'h-toolbar-title', el);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('toolbar-title');
  });
});

describe('h-toolbar-subtitle', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(toolbarPlugin, 'h-toolbar-subtitle', el);
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.classList.contains('font-normal')).toBe(true);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('toolbar-subtitle');
  });
});

describe('h-toolbar-spacer', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(toolbarPlugin, 'h-toolbar-spacer', el);
    expect(el.classList.contains('flex-[1_auto]')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('data-slot')).toBe('toolbar-spacer');
  });
});

describe('h-toolbar-separator', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(toolbarPlugin, 'h-toolbar-separator', el);
    expect(el.classList.contains('w-px')).toBe(true);
    expect(el.classList.contains('h-8')).toBe(true);
    expect(el.classList.contains('border-l')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('toolbar-separator');
  });
});
