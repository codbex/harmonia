import { describe, expect, it } from 'vitest';
import listPlugin from '../../src/components/list.js';
import { mountDirective } from '../test-utils.js';

describe('h-listbox', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(listPlugin, 'h-listbox', el);
    expect(el.classList.contains('bg-input-inner')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('outline-none')).toBe(true);
  });

  it('sets role and data-slot attributes', () => {
    const el = document.createElement('div');
    mountDirective(listPlugin, 'h-listbox', el);
    expect(el.getAttribute('role')).toBe('listbox');
    expect(el.getAttribute('data-slot')).toBe('listbox');
  });

  it('calls cleanup on teardown', () => {
    const el = document.createElement('div');
    const { ctx } = mountDirective(listPlugin, 'h-listbox', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-list', () => {
  it('applies base classes', () => {
    const el = document.createElement('ul');
    mountDirective(listPlugin, 'h-list', el);
    expect(el.classList.contains('divide-solid')).toBe(true);
    expect(el.classList.contains('divide-y')).toBe(true);
  });

  it('sets role and data-slot attributes', () => {
    const el = document.createElement('ul');
    mountDirective(listPlugin, 'h-list', el);
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('data-slot')).toBe('list');
  });
});

describe('h-list-header', () => {
  it('applies base classes', () => {
    const container = document.createElement('div');
    const list = document.createElement('ul');
    list.setAttribute('data-slot', 'list');
    const header = document.createElement('li');
    list.appendChild(header);
    container.appendChild(list);

    mountDirective(listPlugin, 'h-list-header', header, {
      original: 'x-h-list-header',
    });
    expect(header.classList.contains('font-medium')).toBe(true);
    expect(header.classList.contains('flex')).toBe(true);
  });

  it('sets role and data-slot attributes', () => {
    const container = document.createElement('div');
    const list = document.createElement('ul');
    list.setAttribute('data-slot', 'list');
    const header = document.createElement('li');
    list.appendChild(header);
    container.appendChild(list);

    mountDirective(listPlugin, 'h-list-header', header, {
      original: 'x-h-list-header',
    });
    expect(header.getAttribute('role')).toBe('presentation');
    expect(header.getAttribute('data-slot')).toBe('list-header');
  });

  it('throws if not inside a list', () => {
    const header = document.createElement('li');
    expect(() =>
      mountDirective(listPlugin, 'h-list-header', header, {
        original: 'x-h-list-header',
      })
    ).toThrow();
  });

  it('assigns id to header and aria-labelledby to parent list', () => {
    const container = document.createElement('div');
    const list = document.createElement('ul');
    list.setAttribute('data-slot', 'list');
    const header = document.createElement('li');
    list.appendChild(header);
    container.appendChild(list);

    mountDirective(listPlugin, 'h-list-header', header, {
      original: 'x-h-list-header',
    });
    expect(header.getAttribute('id')).toBeTruthy();
    expect(list.getAttribute('aria-labelledby')).toBe(header.getAttribute('id'));
  });
});

describe('h-list-item', () => {
  it('applies base classes', () => {
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el);
    expect(el.classList.contains('min-h-11')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el);
    expect(el.getAttribute('data-slot')).toBe('list-item');
  });

  it('sets tabindex -1 when not in listbox and no interactive modifier', () => {
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el, { modifiers: [] });
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets role=option and tabindex=0 when inside listbox', () => {
    const container = document.createElement('div');
    const listbox = document.createElement('div');
    listbox.setAttribute('data-slot', 'listbox');
    const list = document.createElement('ul');
    const item = document.createElement('li');
    list.appendChild(item);
    listbox.appendChild(list);
    container.appendChild(listbox);

    mountDirective(listPlugin, 'h-list-item', item, { modifiers: [] });
    expect(item.getAttribute('role')).toBe('option');
    expect(item.getAttribute('tabindex')).toBe('0');
  });

  it('applies interactive classes when interactive modifier used', () => {
    const el = document.createElement('li');
    mountDirective(listPlugin, 'h-list-item', el, { modifiers: ['interactive'] });
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.classList.contains('focus:bg-table-hover')).toBe(true);
  });
});
