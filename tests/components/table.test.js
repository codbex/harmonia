import { describe, expect, it } from 'vitest';
import tablePlugin from '../../src/components/table.js';
import { mountDirective } from '../test-utils.js';

describe('h-table-container', () => {
  it('applies base classes (non-scroll)', () => {
    const el = document.createElement('div');
    mountDirective(tablePlugin, 'h-table-container', el, { modifiers: [] });
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('overflow-x-auto')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table');
  });

  it('applies scroll classes for scroll modifier', () => {
    const el = document.createElement('div');
    mountDirective(tablePlugin, 'h-table-container', el, { modifiers: ['scroll'] });
    expect(el.classList.contains('overflow-scroll')).toBe(true);
  });

  it('adds border classes when data-border=true', () => {
    const el = document.createElement('div');
    el.setAttribute('data-border', 'true');
    mountDirective(tablePlugin, 'h-table-container', el, { modifiers: [] });
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-md')).toBe(true);
  });
});

describe('h-table', () => {
  it('applies base classes', () => {
    const el = document.createElement('table');
    mountDirective(tablePlugin, 'h-table', el);
    expect(el.classList.contains('group')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('caption-bottom')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table');
  });

  it('adds table-fixed when data-fixed=true', () => {
    const el = document.createElement('table');
    el.setAttribute('data-fixed', 'true');
    mountDirective(tablePlugin, 'h-table', el);
    expect(el.classList.contains('table-fixed')).toBe(true);
  });

  it('adds row border classes for rows borders', () => {
    const el = document.createElement('table');
    el.setAttribute('data-borders', 'rows');
    mountDirective(tablePlugin, 'h-table', el);
    expect(el.classList.contains('[&_tr_td[data-slot|=table]]:border-b')).toBe(true);
  });

  it('adds column border classes for columns borders', () => {
    const el = document.createElement('table');
    el.setAttribute('data-borders', 'columns');
    mountDirective(tablePlugin, 'h-table', el);
    expect(el.classList.contains('[&_tr[data-slot|=table]]:divide-x')).toBe(true);
  });
});

describe('h-table-header', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('thead');
    mountDirective(tablePlugin, 'h-table-header', el);
    expect(el.classList.contains('bg-table-header')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-header');
  });
});

describe('h-table-head', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('th');
    mountDirective(tablePlugin, 'h-table-head', el);
    expect(el.classList.contains('h-10')).toBe(true);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('text-left')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-head');
  });
});

describe('h-table-cell', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('td');
    mountDirective(tablePlugin, 'h-table-cell', el);
    expect(el.classList.contains('p-2')).toBe(true);
    expect(el.classList.contains('align-middle')).toBe(true);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-cell');
  });
});

describe('h-table-cell-button', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('button');
    mountDirective(tablePlugin, 'h-table-cell-button', el);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('cell-input-button');
  });
});

describe('h-table-body', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('tbody');
    mountDirective(tablePlugin, 'h-table-body', el);
    expect(el.getAttribute('data-slot')).toBe('table-body');
  });
});

describe('h-table-row', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('tr');
    mountDirective(tablePlugin, 'h-table-row', el);
    expect(el.classList.contains('data-[state=selected]:bg-table-active')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-row');
  });
});

describe('h-table-caption', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('caption');
    mountDirective(tablePlugin, 'h-table-caption', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('border-t')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-caption');
  });
});

describe('h-table-footer', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('tfoot');
    mountDirective(tablePlugin, 'h-table-footer', el);
    expect(el.classList.contains('bg-table-header')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-footer');
  });
});
