import { describe, expect, it } from 'vitest';
import tagPlugin from '../../src/components/tag.js';
import { mountDirective } from '../test-utils.js';

describe('h-tag', () => {
  it('applies base classes', () => {
    const el = document.createElement('span');
    mountDirective(tagPlugin, 'h-tag', el);
    expect(el.classList.contains('bg-muted')).toBe(true);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('h-5')).toBe(true);
    expect(el.classList.contains('rounded-sm')).toBe(true);
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('pointer-events-none')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('span');
    mountDirective(tagPlugin, 'h-tag', el);
    expect(el.getAttribute('data-slot')).toBe('tag');
  });

  it('applies select-none class', () => {
    const el = document.createElement('span');
    mountDirective(tagPlugin, 'h-tag', el);
    expect(el.classList.contains('select-none')).toBe(true);
  });
});

describe('h-tag-group', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tagPlugin, 'h-tag-group', el);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tag-group');
  });
});
