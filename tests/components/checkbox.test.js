import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import checkboxPlugin from '../../src/components/checkbox.js';
import treePlugin from '../../src/components/tree.js';
import { mountDirective } from '../test-utils.js';

describe('h-checkbox', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers h-checkbox directive', () => {
    const { alpine } = mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(alpine._directives['h-checkbox']).toBeDefined();
  });

  it('adds base wrapper classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('aspect-square')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('rounded-[0.438rem]')).toBe(true);
    expect(el.classList.contains('size-5')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('adds focus ring class for input', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
    expect(el.classList.contains('[&>input]:rounded-[0.438rem]')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('sets data-slot="checkbox"', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.getAttribute('data-slot')).toBe('checkbox');
  });

  it('appends an svg check icon', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    const svg = el.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('adds transition and shadow classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('shadow-input')).toBe(true);
    expect(el.classList.contains('transition-colors')).toBe(true);
    expect(el.classList.contains('duration-200')).toBe(true);
  });

  it('adds checked state classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('has-[input:checked]:bg-primary')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:border-primary')).toBe(true);
  });

  it('adds disabled state classes', () => {
    mountDirective(checkboxPlugin, 'h-checkbox', el);
    expect(el.classList.contains('has-[input:disabled]:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:opacity-disabled')).toBe(true);
  });
});

describe('h-checkbox.tree', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  // The modifier reads the tree item's reactive state, so the item has to be a
  // real mounted h-tree-item ancestor (findAncestorState walks parentElement).
  function createTreeCheckbox({ disabled = false, modifiers = ['tree'] } = {}) {
    const item = document.createElement('li');
    if (disabled) item.setAttribute('aria-disabled', 'true');
    document.body.appendChild(item);
    mountDirective(treePlugin, 'h-tree-item', item, { modifiers: [], expression: 'false' });

    const wrapper = document.createElement('span');
    const input = document.createElement('input');
    input.type = 'checkbox';
    wrapper.appendChild(input);
    item.appendChild(wrapper);
    mountDirective(checkboxPlugin, 'h-checkbox', wrapper, { modifiers, original: 'x-h-checkbox' });
    return { item, wrapper, input };
  }

  it('disables the input inside a disabled tree item', () => {
    const { input } = createTreeCheckbox({ disabled: true });
    expect(input.disabled).toBe(true);
  });

  it('sizes itself down for the denser tree row', () => {
    const { wrapper } = createTreeCheckbox();
    expect(wrapper.classList.contains('size-4')).toBe(true);
    expect(wrapper.classList.contains('size-5')).toBe(false);
    expect(wrapper.classList.contains('rounded-[0.35rem]')).toBe(true);
    expect(wrapper.classList.contains('[&>input]:rounded-[0.35rem]')).toBe(true);
  });

  it('leaves the input enabled inside an enabled tree item', () => {
    const { input } = createTreeCheckbox({ disabled: false });
    expect(input.disabled).toBe(false);
  });

  it('follows the item when aria-disabled changes at runtime', async () => {
    const { item, input } = createTreeCheckbox({ disabled: false });
    item.setAttribute('aria-disabled', 'true');
    // MutationObserver callbacks are microtasks.
    await new Promise((r) => setTimeout(r, 0));
    expect(input.disabled).toBe(true);
    item.removeAttribute('aria-disabled');
    await new Promise((r) => setTimeout(r, 0));
    expect(input.disabled).toBe(false);
  });

  it('throws when used outside a tree item', () => {
    const wrapper = document.createElement('span');
    document.body.appendChild(wrapper);
    expect(() => mountDirective(checkboxPlugin, 'h-checkbox', wrapper, { modifiers: ['tree'], original: 'x-h-checkbox' })).toThrow();
  });

  it('does nothing without the tree modifier, even inside a disabled item', () => {
    const { input } = createTreeCheckbox({ disabled: true, modifiers: [] });
    expect(input.disabled).toBe(false);
  });
});
