import { describe, expect, it } from 'vitest';
import paginationPlugin from '../../src/components/pagination.js';
import { mountDirective } from '../test-utils.js';

describe('h-pagination', () => {
  it('applies base classes', () => {
    const el = document.createElement('nav');
    mountDirective(paginationPlugin, 'h-pagination', el);
    expect(el.classList.contains('mx-auto')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('justify-center')).toBe(true);
  });

  it('sets role, aria-label, and data-slot attributes', () => {
    const el = document.createElement('nav');
    mountDirective(paginationPlugin, 'h-pagination', el);
    expect(el.getAttribute('role')).toBe('navigation');
    expect(el.getAttribute('aria-label')).toBe('pagination');
    expect(el.getAttribute('data-slot')).toBe('pagination');
  });
});

describe('h-pagination-content', () => {
  it('applies base classes', () => {
    const el = document.createElement('ul');
    mountDirective(paginationPlugin, 'h-pagination-content', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('ul');
    mountDirective(paginationPlugin, 'h-pagination-content', el);
    expect(el.getAttribute('data-slot')).toBe('pagination-content');
  });
});

describe('h-pagination-item', () => {
  it('sets data-slot attribute', () => {
    const el = document.createElement('li');
    mountDirective(paginationPlugin, 'h-pagination-item', el);
    expect(el.getAttribute('data-slot')).toBe('pagination-item');
  });
});

describe('h-pagination-link', () => {
  it('applies base classes', () => {
    const el = document.createElement('a');
    mountDirective(paginationPlugin, 'h-pagination-link', el, {
      modifiers: [],
      expression: 'false',
    });
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('pagination-link');
  });

  it('adds previous classes for previous modifier', () => {
    const el = document.createElement('a');
    mountDirective(paginationPlugin, 'h-pagination-link', el, {
      modifiers: ['previous'],
      expression: '',
    });
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.classList.contains('px-2.5')).toBe(true);
    expect(el.classList.contains('sm:pl-2.5')).toBe(true);
  });

  it('adds next classes for next modifier', () => {
    const el = document.createElement('a');
    mountDirective(paginationPlugin, 'h-pagination-link', el, {
      modifiers: ['next'],
      expression: '',
    });
    expect(el.classList.contains('sm:pr-2.5')).toBe(true);
  });
});

describe('h-pagination-link-label', () => {
  it('applies hidden and sm:block classes', () => {
    const el = document.createElement('span');
    mountDirective(paginationPlugin, 'h-pagination-link-label', el);
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('sm:block')).toBe(true);
  });
});

describe('h-pagination-ellipsis', () => {
  it('applies base classes and sets data-slot', () => {
    const el = document.createElement('span');
    mountDirective(paginationPlugin, 'h-pagination-ellipsis', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('justify-center')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('pagination-ellipsis');
  });

  it('appends an svg icon', () => {
    const el = document.createElement('span');
    mountDirective(paginationPlugin, 'h-pagination-ellipsis', el);
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
