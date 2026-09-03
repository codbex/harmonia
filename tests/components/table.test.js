import { describe, expect, it } from 'vitest';
import tablePlugin from '../../src/components/table.js';
import { createMockAlpine, mountDirective } from '../test-utils.js';

// The collapsed state has to be a tracked proxy for the aria-expanded effect to
// re-run. activeEffect is module scoped in the test utils, so a proxy from this
// instance is picked up by an effect from any mounted directive's context.
const { reactive } = createMockAlpine();

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

  it('applies the header data-bordered variant classes', () => {
    const el = document.createElement('th');
    mountDirective(tablePlugin, 'h-table-head', el);
    expect(el.classList.contains('[[data-slot=table-header][data-bordered=true]_&]:border-t')).toBe(true);
    expect(el.classList.contains('[[data-slot=table-header][data-bordered=true]_&]:border-b')).toBe(true);
    expect(el.classList.contains('[[data-slot=table-header][data-bordered=true]_&:first-child]:border-l')).toBe(true);
    expect(el.classList.contains('[[data-slot=table-header][data-bordered=true]_&:last-child]:border-r')).toBe(true);
    expect(el.classList.contains('[[data-slot=table-header][data-bordered=horizontal]_&]:border-t')).toBe(true);
    expect(el.classList.contains('[[data-slot=table-header][data-bordered=horizontal]_&]:border-b')).toBe(true);
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

  it('drops the padding around a group button', () => {
    const el = document.createElement('td');
    mountDirective(tablePlugin, 'h-table-cell', el);
    expect(el.classList.contains('[&:has([data-slot=table-group-button])]:p-0')).toBe(true);
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

  it('drops the last row border via last-of-type, not last-child', () => {
    // last-of-type targets the last <tr> even when a trailing non-<tr> sibling
    // (e.g. an Alpine x-for/x-if <template>) is the actual last child, which
    // would otherwise leave the last row bordered and collide with the
    // container border. See the customers example in the dashboard template.
    // The reset is also scoped to the last tbody, so with one tbody per group
    // the seam border above each following group header stays put.
    const el = document.createElement('tbody');
    mountDirective(tablePlugin, 'h-table-body', el);
    expect(el.classList.contains('[&:last-of-type_tr:last-of-type_td[data-slot|=table]]:border-b-0')).toBe(true);
    expect(el.classList.contains('[&:last-of-type_tr:last-of-type_th[data-slot|=table]]:border-b-0')).toBe(true);
    expect(el.classList.contains('[&:last-of-type_tr:last-child_td[data-slot|=table]]:border-b-0')).toBe(false);
    expect(el.classList.contains('[&:last-of-type_tr:last-child_th[data-slot|=table]]:border-b-0')).toBe(false);
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

describe('h-table-group', () => {
  function mountGroup(el, bindings = {}, ctxOverrides = {}) {
    return mountDirective(tablePlugin, 'h-table-group', el, { original: 'x-h-table-group', ...bindings }, { evaluate: () => false, ...ctxOverrides });
  }

  it('hides member rows through the tbody attribute, sparing the group row', () => {
    const el = document.createElement('tbody');
    mountGroup(el);
    expect(el.classList.contains('[&[data-collapsed=true]>tr:not([data-slot=table-group-row])]:hidden')).toBe(true);
  });

  it('starts expanded and leaves data-slot to h-table-body', () => {
    const el = document.createElement('tbody');
    mountGroup(el);
    expect(el._h_table_group.state.collapsed).toBe(false);
    expect(el.getAttribute('data-collapsed')).toBe('false');
    expect(el.hasAttribute('data-slot')).toBe(false);
  });

  it('mints an id for aria-controls and keeps an author-supplied one', () => {
    const el = document.createElement('tbody');
    mountGroup(el);
    expect(el.id.startsWith('tgc')).toBe(true);
    expect(el._h_table_group.controls).toBe(el.id);

    const named = document.createElement('tbody');
    named.setAttribute('id', 'orders');
    mountGroup(named);
    expect(named.id).toBe('orders');
    expect(named._h_table_group.controls).toBe('orders');
  });

  it('throws when not placed on a tbody element', () => {
    const el = document.createElement('div');
    expect(() => mountGroup(el)).toThrow();
  });

  it('starts collapsed when the expression evaluates true', () => {
    const el = document.createElement('tbody');
    mountGroup(el, { expression: 'true' }, { evaluate: () => true, evaluateLater: () => (callback) => callback(true) });
    expect(el._h_table_group.state.collapsed).toBe(true);
    expect(el.getAttribute('data-collapsed')).toBe('true');
  });

  it('reflects a collapse driven from outside', () => {
    const el = document.createElement('tbody');
    mountGroup(el);
    el._h_table_group.state.collapsed = true;
    expect(el.getAttribute('data-collapsed')).toBe('true');
    el._h_table_group.state.collapsed = false;
    expect(el.getAttribute('data-collapsed')).toBe('false');
  });

  it('follows a bound expression', () => {
    const el = document.createElement('tbody');
    let push;
    mountGroup(
      el,
      { expression: 'allCollapsed' },
      {
        evaluate: () => false,
        evaluateLater: () => (callback) => {
          push = callback;
          callback(false);
        },
      }
    );
    expect(el.getAttribute('data-collapsed')).toBe('false');
    push(true);
    expect(el.getAttribute('data-collapsed')).toBe('true');
  });
});

describe('h-table-group-row', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('tr');
    mountDirective(tablePlugin, 'h-table-group-row', el);
    expect(el.classList.contains('bg-table-header')).toBe(true);
    expect(el.classList.contains('text-table-header-foreground')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('table-group-row');
  });
});

describe('h-table-group-button', () => {
  function mountGroupButton(el, collapsed = false) {
    const group = document.createElement('tbody');
    group._h_table_group = {
      controlId: undefined,
      controls: 'tgc-test',
      state: reactive({ collapsed }),
    };
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.appendChild(el);
    row.appendChild(cell);
    group.appendChild(row);
    const mounted = mountDirective(tablePlugin, 'h-table-group-button', el, { original: 'x-h-table-group-button' });
    return { ...mounted, group };
  }

  it('applies base classes and attributes', () => {
    const el = document.createElement('button');
    mountGroupButton(el);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('justify-start')).toBe(true);
    expect(el.classList.contains('justify-between')).toBe(false);
    expect(el.classList.contains('[&[data-state=open]>svg:only-child]:rotate-180')).toBe(false);
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('table-group-button');
  });

  it('throws when not placed on a button element', () => {
    const el = document.createElement('div');
    expect(() => mountGroupButton(el)).toThrow();
  });

  it('throws when not placed inside a table group', () => {
    const el = document.createElement('button');
    expect(() => mountDirective(tablePlugin, 'h-table-group-button', el, { original: 'x-h-table-group-button' })).toThrow();
  });

  it('leads with the collapse arrow, which the author does not supply', () => {
    const el = document.createElement('button');
    el.textContent = 'Fruits';
    mountGroupButton(el);
    const svg = el.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(el.firstChild).toBe(svg);
    // The arrow turns off the button's aria-expanded rather than a class of its own.
    expect(svg.getAttribute('class')).toContain('[[aria-expanded=true]>&]:rotate-90');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
  });

  it('reports the starting state through aria-expanded', () => {
    const open = document.createElement('button');
    mountGroupButton(open, false);
    expect(open.getAttribute('aria-expanded')).toBe('true');
    const shut = document.createElement('button');
    mountGroupButton(shut, true);
    expect(shut.getAttribute('aria-expanded')).toBe('false');
  });

  it('follows a collapse driven from outside, not just a click', () => {
    const el = document.createElement('button');
    const { group } = mountGroupButton(el);
    expect(el.getAttribute('aria-expanded')).toBe('true');
    group._h_table_group.state.collapsed = true;
    expect(el.getAttribute('aria-expanded')).toBe('false');
    group._h_table_group.state.collapsed = false;
    expect(el.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggles the state and the attribute on click', () => {
    const el = document.createElement('button');
    const { group } = mountGroupButton(el);
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(group._h_table_group.state.collapsed).toBe(true);
    expect(el.getAttribute('aria-expanded')).toBe('false');
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(group._h_table_group.state.collapsed).toBe(false);
    expect(el.getAttribute('aria-expanded')).toBe('true');
  });

  it('wires the ids between the button and the group', () => {
    const el = document.createElement('button');
    const { group } = mountGroupButton(el);
    expect(el.id.startsWith('tgb')).toBe(true);
    expect(el.getAttribute('aria-controls')).toBe('tgc-test');
    expect(group.getAttribute('aria-labelledby')).toBe(el.id);

    const named = document.createElement('button');
    named.setAttribute('id', 'fruits');
    const { group: namedGroup } = mountGroupButton(named);
    expect(named.id).toBe('fruits');
    expect(namedGroup.getAttribute('aria-labelledby')).toBe('fruits');
  });

  it('registers a cleanup for the click listener', () => {
    const el = document.createElement('button');
    const { ctx } = mountGroupButton(el);
    expect(ctx.cleanup).toHaveBeenCalled();
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
