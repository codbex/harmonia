import { describe, expect, it } from 'vitest';
import treePlugin from '../../src/components/tree.js';
import { mountDirective } from '../test-utils.js';

describe('h-tree (root)', () => {
  it('applies base classes', () => {
    const el = document.createElement('ul');
    mountDirective(treePlugin, 'h-tree', el, { modifiers: [] });
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
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
});

describe('h-tree (sub)', () => {
  function createSubtreeSetup() {
    const container = document.createElement('div');
    const parentItem = document.createElement('li');
    parentItem._h_tree_item = {
      hasSubtree: true,
      expanded: true,
    };
    const subtree = document.createElement('ul');
    parentItem.appendChild(subtree);
    container.appendChild(parentItem);
    document.body.appendChild(container);
    return { container, parentItem, subtree };
  }

  it('sets role=group and data-slot=subtree for sub modifier', () => {
    const { subtree } = createSubtreeSetup();
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.getAttribute('role')).toBe('group');
    expect(subtree.getAttribute('data-slot')).toBe('subtree');
  });

  it('applies additional sub-tree classes', () => {
    const { subtree } = createSubtreeSetup();
    mountDirective(treePlugin, 'h-tree', subtree, { modifiers: ['sub'] });
    expect(subtree.classList.contains('relative')).toBe(true);
    expect(subtree.classList.contains('pl-4')).toBe(true);
  });
});

describe('h-tree-item', () => {
  function createTreeItemSetup() {
    const container = document.createElement('div');
    const tree = document.createElement('ul');
    tree.setAttribute('data-slot', 'tree');
    const item = document.createElement('li');
    tree.appendChild(item);
    container.appendChild(tree);
    document.body.appendChild(container);
    return { container, tree, item };
  }

  it('initializes _h_tree_item reactive state', () => {
    const { item } = createTreeItemSetup();
    mountDirective(treePlugin, 'h-tree-item', item, {
      modifiers: [],
      expression: 'false',
    });
    expect(item._h_tree_item).toBeDefined();
    expect(typeof item._h_tree_item.expanded).toBe('boolean');
  });

  it('applies base classes', () => {
    const { item } = createTreeItemSetup();
    mountDirective(treePlugin, 'h-tree-item', item, {
      modifiers: [],
      expression: 'false',
    });
    expect(item.classList.contains('group/tree-item')).toBe(true);
    expect(item.classList.contains('relative')).toBe(true);
    expect(item.classList.contains('outline-none')).toBe(true);
  });

  it('sets role=treeitem and data-slot attributes', () => {
    const { item } = createTreeItemSetup();
    mountDirective(treePlugin, 'h-tree-item', item, {
      modifiers: [],
      expression: 'false',
    });
    expect(item.getAttribute('role')).toBe('treeitem');
    expect(item.getAttribute('data-slot')).toBe('tree-item');
  });

  it('sets tabindex=0 for first tree item', () => {
    const { item } = createTreeItemSetup();
    mountDirective(treePlugin, 'h-tree-item', item, {
      modifiers: [],
      expression: 'false',
    });
    expect(item.getAttribute('tabindex')).toBe('0');
  });

  it('sets hasSubtree=true for expanded modifier', () => {
    const { item } = createTreeItemSetup();
    mountDirective(treePlugin, 'h-tree-item', item, {
      modifiers: ['expanded'],
      expression: 'true',
    });
    expect(item._h_tree_item.hasSubtree).toBe(true);
  });

  it('calls cleanup', () => {
    const { item } = createTreeItemSetup();
    const { ctx } = mountDirective(treePlugin, 'h-tree-item', item, {
      modifiers: [],
      expression: 'false',
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-tree-button', () => {
  function createTreeButtonSetup(hasSubtree = false) {
    const container = document.createElement('div');
    const item = document.createElement('li');
    item._h_tree_item = {
      hasSubtree,
      expanded: true,
    };
    const button = document.createElement('button');
    item.appendChild(button);
    container.appendChild(item);
    document.body.appendChild(container);
    return { container, item, button };
  }

  it('applies base classes', () => {
    const { button } = createTreeButtonSetup();
    mountDirective(treePlugin, 'h-tree-button', button, { original: 'x-h-tree-button' });
    expect(button.classList.contains('flex')).toBe(true);
    expect(button.classList.contains('w-full')).toBe(true);
    expect(button.classList.contains('items-center')).toBe(true);
    expect(button.classList.contains('rounded-md')).toBe(true);
    expect(button.classList.contains('text-sm')).toBe(true);
  });

  it('sets data-slot, tabindex, and role attributes', () => {
    const { button } = createTreeButtonSetup();
    mountDirective(treePlugin, 'h-tree-button', button, { original: 'x-h-tree-button' });
    expect(button.getAttribute('data-slot')).toBe('tree-button');
    expect(button.getAttribute('tabindex')).toBe('-1');
    expect(button.getAttribute('role')).toBe('presentation');
  });

  it('prepends chevron svg for items with subtree', () => {
    const { button } = createTreeButtonSetup(true);
    mountDirective(treePlugin, 'h-tree-button', button, { original: 'x-h-tree-button' });
    const svg = button.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('adds before:size-4 class for items without subtree', () => {
    const { button } = createTreeButtonSetup(false);
    mountDirective(treePlugin, 'h-tree-button', button, { original: 'x-h-tree-button' });
    expect(button.classList.contains('before:size-4')).toBe(true);
  });

  it('throws if not inside a tree item', () => {
    const el = document.createElement('button');
    expect(() => mountDirective(treePlugin, 'h-tree-button', el, { original: 'x-h-tree-button' })).toThrow();
  });

  it('sets data-expanded attribute via effect', () => {
    const { button } = createTreeButtonSetup(false);
    mountDirective(treePlugin, 'h-tree-button', button, { original: 'x-h-tree-button' });
    expect(button.getAttribute('data-expanded')).toBe('true');
  });
});
