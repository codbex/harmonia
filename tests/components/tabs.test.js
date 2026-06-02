import { describe, expect, it } from 'vitest';
import tabsPlugin from '../../src/components/tabs.js';
import { mountDirective } from '../test-utils.js';

describe('h-tabs', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tabs', el);
    expect(el.classList.contains('group/tabs')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tabs');
  });

  it('includes horizontal and vertical orientation classes', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tabs', el);
    expect(el.classList.contains('data-[orientation=horizontal]:flex-col')).toBe(true);
    expect(el.classList.contains('data-[orientation=vertical]:flex-row')).toBe(true);
  });
});

describe('h-tab-bar', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-bar', el);
    expect(el.classList.contains('group/tab-bar')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tab-bar');
  });
});

describe('h-tab-list', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-list', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('scrollbar-none')).toBe(true);
    expect(el.getAttribute('role')).toBe('tablist');
    expect(el.getAttribute('data-slot')).toBe('tab-list');
  });
});

describe('h-tab', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('button');
    el.setAttribute('id', 'tab-1');
    el.setAttribute('aria-controls', 'panel-1');
    mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' });
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.getAttribute('role')).toBe('tab');
    expect(el.getAttribute('data-slot')).toBe('tab');
  });

  it('throws if no id attribute', () => {
    const el = document.createElement('button');
    el.setAttribute('aria-controls', 'panel-1');
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow();
  });

  it('throws if no aria-controls attribute', () => {
    const el = document.createElement('button');
    el.setAttribute('id', 'tab-1');
    expect(() => mountDirective(tabsPlugin, 'h-tab', el, { original: 'x-h-tab' })).toThrow();
  });
});

describe('h-tab-action', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('button');
    mountDirective(tabsPlugin, 'h-tab-action', el);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('ml-auto')).toBe(true);
    expect(el.getAttribute('role')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('tab-action');
  });
});

describe('h-tab-list-actions', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-list-actions', el, { modifiers: [] });
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tab-list-actions');
  });

  it('adds end alignment classes for end modifier', () => {
    const el = document.createElement('div');
    mountDirective(tabsPlugin, 'h-tab-list-actions', el, { modifiers: ['end'] });
    expect(el.classList.contains('group-data-[orientation=horizontal]/tabs:ml-auto')).toBe(true);
  });
});

describe('h-tabs-content', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'panel-1');
    el.setAttribute('aria-labelledby', 'tab-1');
    mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' });
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('outline-none')).toBe(true);
    expect(el.getAttribute('role')).toBe('tabpanel');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('data-slot')).toBe('tabs-content');
  });

  it('throws if no id attribute', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-labelledby', 'tab-1');
    expect(() => mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' })).toThrow();
  });

  it('throws if no aria-labelledby attribute', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'panel-1');
    expect(() => mountDirective(tabsPlugin, 'h-tabs-content', el, { original: 'x-h-tabs-content' })).toThrow();
  });
});
