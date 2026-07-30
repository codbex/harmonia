import { afterEach, describe, expect, it, vi } from 'vitest';
import treePlugin from '../../src/components/tree.js';
import { mountDirective } from '../test-utils.js';

// The item detects its subtree in a microtask, so anything that depends on
// hasSubtree has to wait a tick first.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

afterEach(() => {
  document.body.innerHTML = '';
});

describe('h-tree (root)', () => {
  it('applies base classes', () => {
    const el = document.createElement('ul');
    mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
  });

  it('leaves no gap between rows, so the hover bands sit flush', () => {
    const el = document.createElement('ul');
    mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(el.classList.contains('gap-1')).toBe(false);
  });

  it('sets tabindex=-1', () => {
    const el = document.createElement('ul');
    mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets role=tree and data-slot=tree for root', () => {
    const el = document.createElement('ul');
    mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(el.getAttribute('role')).toBe('tree');
    expect(el.getAttribute('data-slot')).toBe('tree');
  });

  it('calls cleanup for root', () => {
    const el = document.createElement('ul');
    const { ctx } = mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('leaves aria-multiselectable off by default', () => {
    const el = document.createElement('ul');
    mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(el.hasAttribute('aria-multiselectable')).toBe(false);
  });
});

describe('h-tree (sub)', () => {
  function createSubtreeSetup(expanded = true) {
    const parentItem = document.createElement('li');
    parentItem._h_tree_item = { hasSubtree: true, expanded };
    const subtree = document.createElement('ul');
    parentItem.appendChild(subtree);
    document.body.appendChild(parentItem);
    return { parentItem, subtree };
  }

  it('sets role=group and data-slot=subtree for sub modifier', () => {
    const { subtree } = createSubtreeSetup();
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.getAttribute('role')).toBe('group');
    expect(subtree.getAttribute('data-slot')).toBe('subtree');
  });

  it('carries the indentation, so a nested row is a narrower box', () => {
    const { subtree } = createSubtreeSetup();
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.classList.contains('ml-3')).toBe(true);
    expect(subtree.classList.contains('pl-2')).toBe(true);
  });

  it('draws no guide line by default', () => {
    const { subtree } = createSubtreeSetup();
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.classList.contains('border-l')).toBe(false);
    expect(subtree.classList.contains('border-border')).toBe(false);
  });

  it('does not force its own width, so a nested tree cannot overflow the tree', () => {
    const { subtree } = createSubtreeSetup();
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    // width:100% ignores the left margin, so a full-width subtree is pushed past
    // the container once per level. As a flex item it stretches to fit instead.
    expect(subtree.classList.contains('w-full')).toBe(false);
    expect(subtree.classList.contains('translate-x-px')).toBe(false);
  });

  it('drops the guide line for data-line="false"', () => {
    const { subtree } = createSubtreeSetup();
    subtree.setAttribute('data-line', 'false');
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.classList.contains('border-l')).toBe(false);
  });

  it('draws the guide for data-line="true", since it is opt in', () => {
    const { subtree } = createSubtreeSetup();
    subtree.setAttribute('data-line', 'true');
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    // An ordinary border rather than a pseudo-element, so it needs no stacking
    // order and a selected row cannot paint over it.
    expect(subtree.classList.contains('border-l')).toBe(true);
    expect(subtree.classList.contains('border-border')).toBe(true);
  });

  it('hides itself when the parent item is collapsed', () => {
    const { subtree } = createSubtreeSetup(false);
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.classList.contains('hidden!')).toBe(true);
  });

  it('throws when it is not inside a tree item', () => {
    const orphan = document.createElement('ul');
    document.body.appendChild(orphan);
    expect(() => mountDirective(treePlugin, 'h-tree', orphan, { modifiers: ['sub'], original: 'x-h-tree' })).toThrow();
  });
});

// Builds a real item, optionally with a subtree, wired the way an author would.
function createItem({ expression = '', subtree = false, disabled = false } = {}) {
  const tree = document.createElement('ul');
  tree.setAttribute('data-slot', 'tree');
  document.body.appendChild(tree);

  const item = document.createElement('li');
  if (disabled) item.setAttribute('aria-disabled', 'true');
  tree.appendChild(item);
  const mounted = mountDirective(treePlugin, 'h-tree-item', item, { expression, original: 'x-h-tree-item' });

  const row = document.createElement('div');
  item.appendChild(row);
  mountDirective(treePlugin, 'h-tree-row', row, { original: 'x-h-tree-row' });

  let sub;
  if (subtree) {
    sub = document.createElement('ul');
    item.appendChild(sub);
    mountDirective(treePlugin, 'h-tree', sub, { modifiers: ['sub'] });
  }

  return { tree, item, row, sub, ctx: mounted.ctx };
}

describe('h-tree-item', () => {
  it('initializes _h_tree_item reactive state', () => {
    const { item } = createItem();
    expect(item._h_tree_item).toBeDefined();
    expect(typeof item._h_tree_item.expanded).toBe('boolean');
  });

  it('applies base classes', () => {
    const { item } = createItem();
    expect(item.classList.contains('group/tree-item')).toBe(true);
    expect(item.classList.contains('relative')).toBe(true);
    expect(item.classList.contains('outline-none')).toBe(true);
  });

  it('no longer lays itself out as a grid, since the row owns the layout', () => {
    const { item } = createItem();
    expect(item.classList.contains('grid')).toBe(false);
    expect(item.classList.contains('grid-cols-[auto_1fr]')).toBe(false);
  });

  it('sets role=treeitem and data-slot attributes', () => {
    const { item } = createItem();
    expect(item.getAttribute('role')).toBe('treeitem');
    expect(item.getAttribute('data-slot')).toBe('tree-item');
  });

  it('sets tabindex=0 for first tree item', () => {
    const { item } = createItem();
    expect(item.getAttribute('tabindex')).toBe('0');
  });

  it('throws when it is not a li element', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(treePlugin, 'h-tree-item', el, { expression: '', original: 'x-h-tree-item' })).toThrow();
  });

  it('calls cleanup', () => {
    const { ctx } = createItem();
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('dims its descendants through aria-disabled', () => {
    const { item } = createItem({ disabled: true });
    expect(item._h_tree_item.disabled).toBe(true);
    expect(item.classList.contains('aria-disabled:opacity-disabled')).toBe(true);
    expect(item.classList.contains('aria-disabled:pointer-events-none')).toBe(true);
  });

  it('publishes the disabled state for descendants to read', async () => {
    const { item } = createItem({ disabled: true });
    item.removeAttribute('aria-disabled');
    await flush();
    expect(item._h_tree_item.disabled).toBe(false);
  });

  describe('subtree detection', () => {
    it('reports no subtree for a leaf and omits aria-expanded', async () => {
      const { item } = createItem();
      await flush();
      expect(item._h_tree_item.hasSubtree).toBe(false);
      expect(item.hasAttribute('aria-expanded')).toBe(false);
    });

    it('detects a real subtree rather than trusting a modifier', async () => {
      const { item } = createItem({ subtree: true, expression: 'true' });
      await flush();
      expect(item._h_tree_item.hasSubtree).toBe(true);
      expect(item.getAttribute('aria-expanded')).toBe('true');
    });

    it('picks up a subtree added later, as x-if or x-for would', async () => {
      const { item } = createItem();
      await flush();
      expect(item._h_tree_item.hasSubtree).toBe(false);

      const sub = document.createElement('ul');
      item.appendChild(sub);
      mountDirective(treePlugin, 'h-tree', sub, { modifiers: ['sub'] });
      await flush();

      expect(item._h_tree_item.hasSubtree).toBe(true);
      expect(item.hasAttribute('aria-expanded')).toBe(true);
    });

    it('drops aria-expanded when the subtree goes away', async () => {
      const { item, sub } = createItem({ subtree: true });
      await flush();
      sub.remove();
      await flush();
      expect(item._h_tree_item.hasSubtree).toBe(false);
      expect(item.hasAttribute('aria-expanded')).toBe(false);
    });

    it('ignores a subtree that belongs to a nested item', async () => {
      const { item } = createItem();
      const child = document.createElement('li');
      const grandSub = document.createElement('ul');
      grandSub.setAttribute('data-slot', 'subtree');
      child.appendChild(grandSub);
      item.appendChild(child);
      await flush();
      expect(item._h_tree_item.hasSubtree).toBe(false);
    });
  });

  describe('expansion', () => {
    it('starts collapsed with no expression', async () => {
      const { item } = createItem({ subtree: true });
      await flush();
      expect(item._h_tree_item.expanded).toBe(false);
    });

    it('starts expanded for a literal true', async () => {
      const { item } = createItem({ subtree: true, expression: 'true' });
      await flush();
      expect(item._h_tree_item.expanded).toBe(true);
    });

    it('exposes expand, collapse and toggle', async () => {
      const { item } = createItem({ subtree: true });
      await flush();
      item._h_tree_item.expand();
      expect(item._h_tree_item.expanded).toBe(true);
      expect(item.getAttribute('aria-expanded')).toBe('true');
      item._h_tree_item.collapse();
      expect(item._h_tree_item.expanded).toBe(false);
      item._h_tree_item.toggle();
      expect(item._h_tree_item.expanded).toBe(true);
    });

    it('writes back to the author state when the expression is bound', async () => {
      const tree = document.createElement('ul');
      tree.setAttribute('data-slot', 'tree');
      document.body.appendChild(tree);
      const item = document.createElement('li');
      tree.appendChild(item);
      const evaluated = [];
      mountDirective(treePlugin, 'h-tree-item', item, { expression: 'open', original: 'x-h-tree-item' }, { evaluate: (expr) => evaluated.push(expr) });
      item._h_tree_item.expand();
      expect(evaluated).toContain('open = true');
      item._h_tree_item.collapse();
      expect(evaluated).toContain('open = false');
    });

    it('reports a non-assignable expression instead of failing with a bare SyntaxError', () => {
      const tree = document.createElement('ul');
      tree.setAttribute('data-slot', 'tree');
      document.body.appendChild(tree);
      const item = document.createElement('li');
      tree.appendChild(item);
      // A ternary reads fine but cannot be assigned to, so the evaluator throws
      // when the state is written back.
      const expression = "node.children ? node.expanded : ''";
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const evaluated = [];
      mountDirective(treePlugin, 'h-tree-item', item, { expression, original: 'x-h-tree-item' }, { evaluate: (expr) => evaluated.push(expr) });

      // Reported once at mount rather than on every toggle, so a repeatedly
      // clicked item does not flood the console with the same message.
      expect(error).toHaveBeenCalledTimes(1);
      const message = error.mock.calls[0][0];
      expect(message).toContain('x-h-tree-item');
      expect(message).toContain(expression);

      expect(() => item._h_tree_item.collapse()).not.toThrow();
      expect(() => item._h_tree_item.expand()).not.toThrow();
      // The invalid assignment must never reach the evaluator, since Alpine
      // rethrows the SyntaxError asynchronously where nothing can catch it.
      expect(evaluated.some((expr) => expr.includes(' = '))).toBe(false);
      expect(error).toHaveBeenCalledTimes(1);
      error.mockRestore();
    });

    it('never writes back when the item owns its own state', () => {
      const tree = document.createElement('ul');
      tree.setAttribute('data-slot', 'tree');
      document.body.appendChild(tree);
      const item = document.createElement('li');
      tree.appendChild(item);
      const evaluated = [];
      mountDirective(treePlugin, 'h-tree-item', item, { expression: 'true', original: 'x-h-tree-item' }, { evaluate: (expr) => evaluated.push(expr) });
      item._h_tree_item.collapse();
      item._h_tree_item.expand();
      expect(evaluated).toEqual([]);
    });
  });

  describe('activation', () => {
    it('dispatches a bubbling tree-item-click carrying the state', async () => {
      const { tree, item, row } = createItem({ subtree: true });
      await flush();
      const seen = [];
      tree.addEventListener('tree-item-click', (event) => seen.push(event.detail));
      row.click();
      expect(seen).toEqual([{ expanded: true, depth: 0 }]);
    });

    it('toggles a branch when its row is clicked', async () => {
      const { item, row } = createItem({ subtree: true, expression: 'true' });
      await flush();
      row.click();
      expect(item._h_tree_item.expanded).toBe(false);
    });

    it('does not toggle a disabled item', async () => {
      const { item, row } = createItem({ subtree: true, expression: 'true', disabled: true });
      await flush();
      row.click();
      expect(item._h_tree_item.expanded).toBe(true);
    });

    it('leaves the row alone when an action is clicked', async () => {
      const { item, row } = createItem({ subtree: true, expression: 'true' });
      await flush();
      const actions = document.createElement('div');
      row.appendChild(actions);
      mountDirective(treePlugin, 'h-tree-actions', actions, { modifiers: [] });
      const button = document.createElement('button');
      actions.appendChild(button);

      button.click();
      expect(item._h_tree_item.expanded).toBe(true);
    });

    it('leaves the row alone when the checkbox is clicked', async () => {
      const { item, row } = createItem({ subtree: true, expression: 'true' });
      await flush();
      const checkbox = document.createElement('span');
      checkbox.setAttribute('data-slot', 'checkbox');
      row.appendChild(checkbox);
      const input = document.createElement('input');
      input.type = 'checkbox';
      checkbox.appendChild(input);

      input.click();
      expect(item._h_tree_item.expanded).toBe(true);
    });

    it('does not collapse an ancestor when a nested row is clicked', async () => {
      const { item: parent, sub } = createItem({ subtree: true, expression: 'true' });
      const child = document.createElement('li');
      sub.appendChild(child);
      mountDirective(treePlugin, 'h-tree-item', child, { expression: '', original: 'x-h-tree-item' });
      const childRow = document.createElement('div');
      child.appendChild(childRow);
      mountDirective(treePlugin, 'h-tree-row', childRow, { original: 'x-h-tree-row' });
      await flush();

      childRow.click();
      expect(parent._h_tree_item.expanded).toBe(true);
    });

    it('moves the roving tab stop to the clicked item', async () => {
      const { tree, sub } = createItem({ subtree: true, expression: 'true' });
      const child = document.createElement('li');
      sub.appendChild(child);
      mountDirective(treePlugin, 'h-tree-item', child, { expression: '', original: 'x-h-tree-item' });
      const childRow = document.createElement('div');
      child.appendChild(childRow);
      mountDirective(treePlugin, 'h-tree-row', childRow, { original: 'x-h-tree-row' });
      await flush();

      childRow.click();
      expect(child.getAttribute('tabindex')).toBe('0');
      expect(tree.querySelector('[data-slot=tree-item]').getAttribute('tabindex')).toBe('-1');
    });
  });
});

describe('h-tree-row', () => {
  it('applies the flex row classes', () => {
    const { row } = createItem();
    expect(row.classList.contains('flex')).toBe(true);
    expect(row.classList.contains('items-center')).toBe(true);
    expect(row.classList.contains('rounded-md')).toBe(true);
    expect(row.getAttribute('data-slot')).toBe('tree-row');
  });

  it('throws if not inside a tree item', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(treePlugin, 'h-tree-row', el, { original: 'x-h-tree-row' })).toThrow();
  });

  it('puts the chevron first so everything after it lines up', () => {
    const { row } = createItem();
    expect(row.firstElementChild.tagName.toLowerCase()).toBe('svg');
  });

  it('keeps the chevron column on a leaf, hidden rather than absent', async () => {
    const { row } = createItem();
    await flush();
    const chevron = row.firstElementChild;
    expect(chevron.classList.contains('invisible')).toBe(true);
    expect(chevron.classList.contains('size-4')).toBe(true);
  });

  it('shows the chevron once the item has a subtree', async () => {
    const { row } = createItem({ subtree: true });
    await flush();
    expect(row.firstElementChild.classList.contains('invisible')).toBe(false);
  });

  it('places the checkbox after the chevron, not before it', async () => {
    const { row } = createItem();
    const checkbox = document.createElement('span');
    checkbox.setAttribute('data-slot', 'checkbox');
    row.appendChild(checkbox);
    await flush();
    expect(row.firstElementChild.tagName.toLowerCase()).toBe('svg');
    expect(checkbox.previousElementSibling).toBe(row.firstElementChild);
  });

  it('leaves indentation to the subtree, so every row is padded the same', () => {
    const { row } = createItem();
    // The subtree insets the whole row rather than the row padding its content,
    // which is what keeps a selected row's band from crossing a guide line.
    expect(row.classList.contains('pl-1')).toBe(true);
    expect(row.style.getPropertyValue('--h-tree-indent')).toBe('');
  });

  it('still reports its depth, which is part of the item state', async () => {
    const { sub } = createItem({ subtree: true, expression: 'true' });
    const child = document.createElement('li');
    sub.appendChild(child);
    mountDirective(treePlugin, 'h-tree-item', child, { expression: '', original: 'x-h-tree-item' });

    expect(child._h_tree_item.depth).toBe(1);
  });

  it('scopes focus and selection to its own item, not to nested ones', () => {
    const { row } = createItem();
    // A group-* variant matches every descendant, so a focused branch would ring
    // its children's rows too. The direct-child selector cannot.
    expect(row.classList.contains('group-focus/tree-item:ring-[calc(var(--spacing)*0.75)]')).toBe(false);
    expect(row.classList.contains('[[data-slot=tree-item]:focus-visible>&]:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
    expect(row.classList.contains('[[data-slot=tree-item][aria-selected=true]>&]:bg-primary')).toBe(true);
  });

  it('darkens rather than greys a selected row on hover', () => {
    const { row } = createItem();
    expect(row.classList.contains('[[data-slot=tree-item][aria-selected=true]>&]:hover:bg-primary-active')).toBe(true);
  });

  it('yields its hover while the pointer is on an action', () => {
    const { row } = createItem();
    // Two hover backgrounds at once would read as one large highlight rather
    // than a button on a row.
    expect(row.classList.contains('has-[[data-slot=tree-action]:hover]:bg-transparent!')).toBe(true);
    expect(row.classList.contains('[[data-slot=tree-item][aria-selected=true]>&]:has-[[data-slot=tree-action]:hover]:bg-primary!')).toBe(true);
  });

  it('never reaches into the button component to correct it', () => {
    const { row } = createItem();
    // The row may know about its own tree-action slot, but naming another
    // component's slot or variant would break silently when that one changes.
    expect([...row.classList].filter((c) => c.includes('data-slot=button'))).toEqual([]);
  });

  it('mirrors the expanded state so the chevron can rotate', async () => {
    const { row } = createItem({ subtree: true, expression: 'true' });
    await flush();
    expect(row.getAttribute('data-expanded')).toBe('true');
  });
});

describe('h-tree-label', () => {
  it('absorbs the slack and truncates', () => {
    const el = document.createElement('span');
    mountDirective(treePlugin, 'h-tree-label', el, {});
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('truncate')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tree-label');
  });

  it('lets clicks through to the row', () => {
    const el = document.createElement('span');
    mountDirective(treePlugin, 'h-tree-label', el, {});
    expect(el.classList.contains('pointer-events-none')).toBe(true);
  });
});

describe('h-tree-actions', () => {
  it('clusters the actions at their natural size', () => {
    const el = document.createElement('div');
    mountDirective(treePlugin, 'h-tree-actions', el, { modifiers: [] });
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tree-actions');
  });

  it('stays visible by default', () => {
    const el = document.createElement('div');
    mountDirective(treePlugin, 'h-tree-actions', el, { modifiers: [] });
    expect(el.classList.contains('sr-only')).toBe(false);
  });

  it('hides with autohide but stays reachable, so sr-only rather than hidden', () => {
    const el = document.createElement('div');
    mountDirective(treePlugin, 'h-tree-actions', el, { modifiers: ['autohide'] });
    expect(el.classList.contains('sr-only')).toBe(true);
    expect(el.classList.contains('hidden')).toBe(false);
    expect(el.classList.contains('group-hover/tree-item:not-sr-only')).toBe(true);
    expect(el.classList.contains('focus-within:not-sr-only')).toBe(true);
  });
});

describe('h-tree-action', () => {
  function mountAction(tag = 'button', attrs = { 'aria-label': 'Delete' }) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    mountDirective(treePlugin, 'h-tree-action', el, { original: 'x-h-tree-action' });
    return el;
  }

  it('applies its base classes and slot', () => {
    const el = mountAction();
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('size-6')).toBe(true);
    expect(el.classList.contains('rounded-sm')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tree-action');
  });

  it('takes its colour from the row rather than setting its own', () => {
    const el = mountAction();
    // This is what keeps it legible on a selected row without the row having to
    // reach in and correct it.
    expect(el.classList.contains('text-inherit')).toBe(true);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('text-foreground')).toBe(false);
  });

  it('uses opaque colours on hover, which no theme can render invisible', () => {
    const el = mountAction();
    // A translucent tint would vanish on a theme whose selected row colour is
    // already at the end of its range, e.g. a black primary.
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(true);
    expect(el.classList.contains('active:bg-secondary-active')).toBe(true);
    expect([...el.classList].filter((c) => c.includes('bg-foreground/'))).toEqual([]);
  });

  it('stays lit while its dropdown is open', () => {
    const el = mountAction();
    expect(el.classList.contains('aria-[expanded=true]:bg-secondary-active')).toBe(true);
  });

  it('sets type=button on a button element', () => {
    const el = mountAction('button');
    expect(el.getAttribute('type')).toBe('button');
    expect(el.hasAttribute('role')).toBe(false);
  });

  it('gives a non-button element the button role', () => {
    const el = mountAction('span');
    expect(el.getAttribute('role')).toBe('button');
    expect(el.hasAttribute('type')).toBe(false);
  });

  it('errors when it has no accessible name, since it is icon only', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountAction('button', {});
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('stays quiet when labelled by aria-labelledby', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountAction('button', { 'aria-labelledby': 'someid' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('h-tree-indicator', () => {
  it('renders as a badge and hides itself from assistive tech', () => {
    const el = document.createElement('span');
    el.setAttribute('data-indicator', 'warning');
    mountDirective(treePlugin, 'h-tree-indicator', el, {});
    expect(el.getAttribute('data-slot')).toBe('tree-indicator');
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.classList.contains('data-[indicator=warning]:text-warning')).toBe(true);
  });

  it('draws the dot inside the badge box, so both forms share a column', () => {
    const el = document.createElement('span');
    el.setAttribute('data-indicator', 'positive');
    el.setAttribute('data-dot', '');
    mountDirective(treePlugin, 'h-tree-indicator', el, {});
    // The box stays min-w-4 either way and the dot is drawn by a pseudo-element.
    expect(el.classList.contains('min-w-4')).toBe(true);
    expect(el.classList.contains('data-[dot]:size-2')).toBe(false);
    expect(el.classList.contains('data-[dot]:before:size-2')).toBe(true);
    expect(el.classList.contains('data-[dot]:before:rounded-full')).toBe(true);
    // bg-current so the dot follows the same colour rules as the letter form.
    expect(el.classList.contains('data-[dot]:before:bg-current')).toBe(true);
  });

  it('defers to the row foreground once the item is selected', () => {
    const el = document.createElement('span');
    el.setAttribute('data-indicator', 'warning');
    mountDirective(treePlugin, 'h-tree-indicator', el, {});
    expect(el.classList.contains('[[data-slot=tree-item][aria-selected=true]_&]:text-primary-foreground!')).toBe(true);
  });

  it('leaves an author supplied label alone', () => {
    const el = document.createElement('span');
    el.setAttribute('aria-label', 'Modified');
    mountDirective(treePlugin, 'h-tree-indicator', el, {});
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });
});

describe('h-tree keyboard navigation', () => {
  function keydown(el, key) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    el.dispatchEvent(event);
    return event;
  }

  // Builds a flat or nested tree of real directives. `nested` maps a parent
  // index to how many children hang under it, so collapsed-branch and
  // disabled-ancestor cases can both be expressed.
  async function createTree({ count = 3, disabled = [], nested = {}, collapsed = [], labels } = {}) {
    const tree = document.createElement('ul');
    document.body.appendChild(tree);
    mountDirective(treePlugin, 'h-tree', tree, { modifiers: [] });

    const items = [];
    const mountItem = (parent, label, isDisabled, expanded) => {
      const item = document.createElement('li');
      // Set before mounting: the item reads aria-disabled to seed its state.
      if (isDisabled) item.setAttribute('aria-disabled', 'true');
      parent.appendChild(item);
      mountDirective(treePlugin, 'h-tree-item', item, { expression: expanded ? 'true' : 'false', original: 'x-h-tree-item' });
      const row = document.createElement('div');
      item.appendChild(row);
      mountDirective(treePlugin, 'h-tree-row', row, { original: 'x-h-tree-row' });
      const span = document.createElement('span');
      span.textContent = label;
      row.appendChild(span);
      mountDirective(treePlugin, 'h-tree-label', span, {});
      items.push(item);
      return item;
    };

    for (let i = 0; i < count; i++) {
      const childCount = nested[i] ?? 0;
      const expanded = !collapsed.includes(i);
      const item = mountItem(tree, labels?.[i] ?? `Item ${i + 1}`, disabled.includes(i), expanded);
      if (childCount > 0) {
        const sub = document.createElement('ul');
        item.appendChild(sub);
        mountDirective(treePlugin, 'h-tree', sub, { modifiers: ['sub'] });
        for (let c = 0; c < childCount; c++) {
          mountItem(sub, `Item ${i + 1}.${c + 1}`, false, true);
        }
      }
    }
    // Let every item settle its hasSubtree and aria-expanded state.
    await flush();
    return { tree, items };
  }

  const tabIndexes = (items) => items.map((item) => item.getAttribute('tabindex'));
  const labelOf = (el) => el?.querySelector?.('[data-slot=tree-label]')?.textContent ?? null;

  // A disabled item is dimmed and inert, but aria-disabled announces it rather
  // than hiding it, so the keyboard still reaches it and activation is what
  // refuses to act. Contrast with collapsed branches below, which really are
  // off screen and so stay unreachable.
  describe('disabled items', () => {
    it('ArrowDown moves onto a disabled item', async () => {
      const { tree, items } = await createTree({ count: 3, disabled: [1] });
      keydown(tree, 'ArrowDown');
      expect(document.activeElement).toBe(items[1]);
      expect(tabIndexes(items)).toEqual(['-1', '0', '-1']);
    });

    it('ArrowUp moves onto a disabled item', async () => {
      const { tree, items } = await createTree({ count: 3, disabled: [1] });
      keydown(tree, 'End');
      keydown(tree, 'ArrowUp');
      expect(document.activeElement).toBe(items[1]);
    });

    it('Home and End land on the first and last item, disabled or not', async () => {
      const { tree, items } = await createTree({ count: 4, disabled: [0, 3] });
      keydown(tree, 'End');
      expect(document.activeElement).toBe(items[3]);
      keydown(tree, 'Home');
      expect(document.activeElement).toBe(items[0]);
    });

    it('reaches descendants of a disabled parent', async () => {
      // The children are dimmed but on screen, so skipping them would hide them
      // from exactly the users aria-disabled is meant to inform.
      const { tree } = await createTree({ count: 2, disabled: [0], nested: { 0: 2 } });
      keydown(tree, 'Home');
      expect(labelOf(document.activeElement)).toBe('Item 1');
      keydown(tree, 'ArrowDown');
      expect(labelOf(document.activeElement)).toBe('Item 1.1');
    });

    it('still moves focus when every item is disabled', async () => {
      const { tree, items } = await createTree({ count: 3, disabled: [0, 1, 2] });
      keydown(tree, 'ArrowDown');
      expect(document.activeElement).toBe(items[1]);
      keydown(tree, 'End');
      expect(document.activeElement).toBe(items[2]);
    });

    it('Enter and Space do not activate a disabled item', async () => {
      const { tree, items } = await createTree({ count: 2, disabled: [1] });
      const activate = vi.fn();
      items[1]._h_tree_item.activate = activate;
      keydown(tree, 'End');
      expect(document.activeElement).toBe(items[1]);
      keydown(items[1], 'Enter');
      keydown(items[1], ' ');
      expect(activate).not.toHaveBeenCalled();
    });

    it('Enter does not activate a descendant of a disabled item', async () => {
      const { tree, items } = await createTree({ count: 1, disabled: [0], nested: { 0: 1 } });
      const child = items[1];
      const activate = vi.fn();
      child._h_tree_item.activate = activate;
      keydown(tree, 'End');
      expect(document.activeElement).toBe(child);
      keydown(child, 'Enter');
      expect(activate).not.toHaveBeenCalled();
    });

    it('a click on a descendant of a disabled item does not activate it', async () => {
      const { items } = await createTree({ count: 1, disabled: [0], nested: { 0: 1 } });
      const child = items[1];
      const activate = vi.fn();
      child._h_tree_item.activate = activate;
      child.querySelector('[data-slot=tree-row]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(activate).not.toHaveBeenCalled();
    });

    it('ArrowRight does not expand a disabled item', async () => {
      const { tree, items } = await createTree({ count: 1, disabled: [0], nested: { 0: 1 }, collapsed: [0] });
      keydown(tree, 'Home');
      expect(document.activeElement).toBe(items[0]);
      keydown(items[0], 'ArrowRight');
      expect(items[0].getAttribute('aria-expanded')).toBe('false');
    });

    it('ArrowLeft does not collapse a disabled item', async () => {
      const { tree, items } = await createTree({ count: 1, disabled: [0], nested: { 0: 1 } });
      keydown(tree, 'Home');
      expect(document.activeElement).toBe(items[0]);
      keydown(items[0], 'ArrowLeft');
      expect(items[0].getAttribute('aria-expanded')).toBe('true');
    });
  });

  describe('collapsed branches', () => {
    it('skips items inside a collapsed branch', async () => {
      const { tree } = await createTree({ count: 2, nested: { 0: 2 }, collapsed: [0] });
      keydown(tree, 'End');
      expect(labelOf(document.activeElement)).toBe('Item 2');
    });

    it('recovers when the tab stop is stranded in a branch that collapsed', async () => {
      const { tree, items } = await createTree({ count: 2, nested: { 0: 2 } });
      const child = items[1];
      items.forEach((i) => i.setAttribute('tabindex', '-1'));
      child.setAttribute('tabindex', '0');
      items[0].setAttribute('aria-expanded', 'false');

      keydown(tree, 'ArrowDown');
      expect(labelOf(document.activeElement)).toBe('Item 2');
    });
  });

  describe('activation', () => {
    it('Enter toggles an expandable item', async () => {
      const { tree, items } = await createTree({ count: 1, nested: { 0: 1 } });
      keydown(tree, 'Enter');
      expect(items[0]._h_tree_item.expanded).toBe(false);
    });

    it('Enter does not toggle a disabled item', async () => {
      const { tree, items } = await createTree({ count: 2, disabled: [0], nested: { 0: 1 } });
      keydown(tree, 'Enter');
      expect(items[0].getAttribute('aria-expanded')).toBe('true');
    });

    it('ArrowRight expands a collapsed branch without a synthetic click', async () => {
      const { tree, items } = await createTree({ count: 1, nested: { 0: 1 }, collapsed: [0] });
      keydown(tree, 'ArrowRight');
      expect(items[0]._h_tree_item.expanded).toBe(true);
    });

    it('ArrowRight moves into an already expanded branch', async () => {
      const { tree } = await createTree({ count: 1, nested: { 0: 1 } });
      keydown(tree, 'ArrowRight');
      expect(labelOf(document.activeElement)).toBe('Item 1.1');
    });

    it('ArrowLeft collapses an expanded branch', async () => {
      const { tree, items } = await createTree({ count: 1, nested: { 0: 1 } });
      keydown(tree, 'ArrowLeft');
      expect(items[0]._h_tree_item.expanded).toBe(false);
    });

    it('ArrowLeft climbs to the parent from a leaf', async () => {
      const { tree } = await createTree({ count: 1, nested: { 0: 1 } });
      keydown(tree, 'ArrowRight');
      keydown(tree, 'ArrowLeft');
      expect(labelOf(document.activeElement)).toBe('Item 1');
    });

    it('Space toggles the row checkbox instead of expanding', async () => {
      const { tree, items } = await createTree({ count: 1, nested: { 0: 1 } });
      const wrapper = document.createElement('span');
      wrapper.setAttribute('data-slot', 'checkbox');
      const input = document.createElement('input');
      input.type = 'checkbox';
      wrapper.appendChild(input);
      items[0].querySelector('[data-slot=tree-row]').appendChild(wrapper);

      keydown(tree, ' ');
      expect(input.checked).toBe(true);
      expect(items[0]._h_tree_item.expanded).toBe(true);
    });

    it('Space falls back to activation when there is no checkbox', async () => {
      const { tree, items } = await createTree({ count: 1, nested: { 0: 1 } });
      keydown(tree, ' ');
      expect(items[0]._h_tree_item.expanded).toBe(false);
    });
  });

  describe('typeahead', () => {
    it('jumps to the next item starting with the typed letter', async () => {
      const { tree } = await createTree({ count: 3, labels: ['Alpha', 'Beta', 'Gamma'] });
      keydown(tree, 'g');
      expect(labelOf(document.activeElement)).toBe('Gamma');
    });

    it('matches a multi letter prefix', async () => {
      const { tree } = await createTree({ count: 3, labels: ['Bravo', 'Beta', 'Alpha'] });
      keydown(tree, 'b');
      keydown(tree, 'e');
      expect(labelOf(document.activeElement)).toBe('Beta');
    });

    it('wraps past the end of the tree', async () => {
      const { tree } = await createTree({ count: 3, labels: ['Alpha', 'Beta', 'Gamma'] });
      keydown(tree, 'End');
      keydown(tree, 'a');
      expect(labelOf(document.activeElement)).toBe('Alpha');
    });

    it('leaves focus alone when nothing matches', async () => {
      const { tree, items } = await createTree({ count: 2, labels: ['Alpha', 'Beta'] });
      keydown(tree, 'Home');
      keydown(tree, 'z');
      expect(document.activeElement).toBe(items[0]);
    });

    it('ignores keys pressed with a modifier, so shortcuts still work', async () => {
      const { tree, items } = await createTree({ count: 2, labels: ['Alpha', 'Beta'] });
      keydown(tree, 'Home');
      const event = new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, bubbles: true, cancelable: true });
      tree.dispatchEvent(event);
      expect(document.activeElement).toBe(items[0]);
    });
  });

  describe('preventDefault', () => {
    it('prevents the default for horizontal arrows', async () => {
      const { tree } = await createTree({ count: 2, nested: { 0: 1 } });
      expect(keydown(tree, 'ArrowRight').defaultPrevented).toBe(true);
      expect(keydown(tree, 'ArrowLeft').defaultPrevented).toBe(true);
    });

    it('prevents the default for vertical arrows and Home/End', async () => {
      const { tree } = await createTree({ count: 3 });
      for (const key of ['ArrowDown', 'ArrowUp', 'Home', 'End']) {
        expect(keydown(tree, key).defaultPrevented).toBe(true);
      }
    });
  });
});
