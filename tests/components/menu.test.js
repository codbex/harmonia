import { describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 10, y: 20, placement: 'bottom' }),
  autoUpdate: vi.fn((parent, el, update) => {
    update();
    return () => {};
  }),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import menuPlugin from '../../src/components/menu.js';
import { mountDirective } from '../test-utils.js';

describe('h-menu-trigger', () => {
  it('registers _h_menu_trigger on element', () => {
    const el = document.createElement('button');
    mountDirective(menuPlugin, 'h-menu-trigger', el, { modifiers: [] });
    expect(el._h_menu_trigger).toBeDefined();
  });

  it('sets aria-haspopup and aria-expanded for dropdown modifier', () => {
    const el = document.createElement('button');
    el.setAttribute('id', 'my-trigger');
    mountDirective(menuPlugin, 'h-menu-trigger', el, { modifiers: ['dropdown'] });
    expect(el.getAttribute('aria-haspopup')).toBe('true');
    expect(el.getAttribute('aria-expanded')).toBe('false');
    expect(el._h_menu_trigger.isDropdown).toBe(true);
  });

  it('does not set aria-haspopup without dropdown modifier', () => {
    const el = document.createElement('button');
    mountDirective(menuPlugin, 'h-menu-trigger', el, { modifiers: [] });
    expect(el.getAttribute('aria-haspopup')).toBeNull();
  });
});

describe('h-menu', () => {
  function createMenuSetup() {
    const container = document.createElement('div');
    const trigger = document.createElement('button');
    trigger._h_menu_trigger = {
      isDropdown: true,
      setOpen: vi.fn(),
    };
    trigger.setAttribute('id', 'trigger-id');
    const menu = document.createElement('ul');
    menu.setAttribute('aria-label', 'Test menu');
    container.appendChild(trigger);
    container.appendChild(menu);
    document.body.appendChild(container);
    return { container, trigger, menu };
  }

  it('applies base classes to ul element', () => {
    const { menu } = createMenuSetup();
    mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });
    expect(menu.classList.contains('hidden')).toBe(true);
    expect(menu.classList.contains('fixed')).toBe(true);
    expect(menu.classList.contains('bg-popover')).toBe(true);
  });

  it('sets role and data-slot attributes', () => {
    const { menu } = createMenuSetup();
    mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });
    expect(menu.getAttribute('role')).toBe('menu');
    expect(menu.getAttribute('data-slot')).toBe('menu');
    expect(menu.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('throws if element is not a ul', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(menuPlugin, 'h-menu', el, { original: 'x-h-menu', modifiers: [] })).toThrow();
  });

  it('sets _menu close method on element', () => {
    const { menu } = createMenuSetup();
    mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });
    expect(menu._menu).toBeDefined();
    expect(typeof menu._menu.close).toBe('function');
  });

  it('calls cleanup', () => {
    const { menu } = createMenuSetup();
    const { ctx } = mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('sets aria-controls on trigger pointing to the menu id', () => {
    const { trigger, menu } = createMenuSetup();
    mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });
    expect(trigger.getAttribute('aria-controls')).toBe(menu.getAttribute('id'));
  });

  it('sets aria-labelledby on menu from trigger id when menu has no aria-label', () => {
    const container = document.createElement('div');
    const trigger = document.createElement('button');
    trigger._h_menu_trigger = {
      isDropdown: true,
      setOpen: vi.fn(),
    };
    trigger.setAttribute('id', 'ctrl-trigger');
    const menu = document.createElement('ul');
    container.appendChild(trigger);
    container.appendChild(menu);
    document.body.appendChild(container);

    mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });

    expect(menu.getAttribute('aria-labelledby')).toBe('ctrl-trigger');
  });

  it('populates openMenu and closeMenu on navItem trigger', () => {
    const container = document.createElement('div');
    const trigger = document.createElement('button');
    trigger._h_menu_trigger = {
      isDropdown: true,
      navItem: true,
      openMenu: undefined,
      closeMenu: undefined,
      setOpen: vi.fn(),
    };
    trigger.setAttribute('id', 'nav-trigger-id');
    const menu = document.createElement('ul');
    menu.setAttribute('aria-label', 'Nav menu');
    container.appendChild(trigger);
    container.appendChild(menu);
    document.body.appendChild(container);

    mountDirective(menuPlugin, 'h-menu', menu, {
      original: 'x-h-menu',
      modifiers: [],
    });

    expect(typeof trigger._h_menu_trigger.openMenu).toBe('function');
    expect(typeof trigger._h_menu_trigger.closeMenu).toBe('function');
  });

  function createOpenableMenuSetup({ items = 1, disabled = [] } = {}) {
    const container = document.createElement('div');
    const trigger = document.createElement('button');
    trigger._h_menu_trigger = {
      isDropdown: true,
      navItem: true,
      openMenu: undefined,
      closeMenu: undefined,
      setOpen: vi.fn(),
    };
    trigger.setAttribute('id', 'openable-trigger-id');
    const menu = document.createElement('ul');
    menu.setAttribute('aria-label', 'Openable menu');
    const built = [];
    for (let i = 0; i < items; i++) {
      const item = document.createElement('li');
      item.textContent = i === 0 ? 'First item' : `Item ${i}`;
      if (disabled.includes(i)) item.setAttribute('aria-disabled', 'true');
      menu.appendChild(item);
      built.push(item);
    }
    container.appendChild(trigger);
    container.appendChild(menu);
    document.body.appendChild(container);
    mountDirective(menuPlugin, 'h-menu', menu, { original: 'x-h-menu', modifiers: [] });
    for (const item of built) {
      mountDirective(menuPlugin, 'h-menu-item', item, { original: 'x-h-menu-item', modifiers: [] });
    }
    return { trigger, menu, item: built[0], items: built };
  }

  const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('focuses the menu itself on open when focusOnOpen is not set', async () => {
    const { trigger, menu } = createOpenableMenuSetup();
    trigger._h_menu_trigger.openMenu();
    await flush();
    expect(document.activeElement).toBe(menu);
  });

  it('ArrowRight on an open menu without moveInBar does nothing', async () => {
    const { trigger, menu } = createOpenableMenuSetup();
    trigger._h_menu_trigger.openMenu();
    await flush();
    trigger._h_menu_trigger.setOpen.mockClear();
    menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await flush();
    expect(menu.classList.contains('hidden')).toBe(false);
    expect(trigger._h_menu_trigger.setOpen).not.toHaveBeenCalled();
  });

  it('focusOnOpen lands on a disabled first item', async () => {
    const { trigger, items } = createOpenableMenuSetup({ items: 3, disabled: [0] });
    trigger._h_menu_trigger.focusOnOpen = 'first';
    trigger._h_menu_trigger.openMenu();
    await flush();
    expect(document.activeElement).toBe(items[0]);
  });

  it('focusOnOpen lands on a disabled last item', async () => {
    const { trigger, items } = createOpenableMenuSetup({ items: 3, disabled: [2] });
    trigger._h_menu_trigger.focusOnOpen = 'last';
    trigger._h_menu_trigger.openMenu();
    await flush();
    expect(document.activeElement).toBe(items[2]);
  });

  it('focusOnOpen still reaches the items when every one is disabled', async () => {
    const { trigger, items } = createOpenableMenuSetup({ items: 2, disabled: [0, 1] });
    trigger._h_menu_trigger.focusOnOpen = 'first';
    trigger._h_menu_trigger.openMenu();
    await flush();
    expect(document.activeElement).toBe(items[0]);
  });

  // A disabled item is dimmed and inert, but aria-disabled announces it rather
  // than hiding it, so the keyboard still reaches it and activation is what
  // refuses to act.
  describe('keyboard navigation reaches disabled items', () => {
    const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

    async function openMenu(options) {
      const setup = createOpenableMenuSetup(options);
      setup.trigger._h_menu_trigger.openMenu();
      await flush();
      return setup;
    }

    it('ArrowDown steps onto a disabled item', async () => {
      const { menu, items } = await openMenu({ items: 4, disabled: [1] });
      key(menu, 'ArrowDown');
      expect(document.activeElement).toBe(items[0]);
      key(document.activeElement, 'ArrowDown');
      expect(document.activeElement).toBe(items[1]);
    });

    it('ArrowDown wraps from a disabled last item', async () => {
      const { menu, items } = await openMenu({ items: 3, disabled: [2] });
      key(menu, 'ArrowDown');
      key(document.activeElement, 'ArrowDown');
      key(document.activeElement, 'ArrowDown');
      expect(document.activeElement).toBe(items[2]);
      key(document.activeElement, 'ArrowDown');
      expect(document.activeElement).toBe(items[0]);
    });

    it('ArrowUp steps onto a disabled item', async () => {
      const { menu, items } = await openMenu({ items: 4, disabled: [2] });
      key(menu, 'ArrowUp');
      expect(document.activeElement).toBe(items[3]);
      key(document.activeElement, 'ArrowUp');
      expect(document.activeElement).toBe(items[2]);
    });

    it('ArrowUp wraps onto a disabled first item', async () => {
      const { menu, items } = await openMenu({ items: 3, disabled: [0] });
      key(menu, 'ArrowUp');
      expect(document.activeElement).toBe(items[2]);
      key(document.activeElement, 'ArrowUp');
      expect(document.activeElement).toBe(items[1]);
      key(document.activeElement, 'ArrowUp');
      expect(document.activeElement).toBe(items[0]);
    });

    it('Home focuses the first item, disabled or not', async () => {
      const { menu, items } = await openMenu({ items: 4, disabled: [0] });
      key(menu, 'Home');
      expect(document.activeElement).toBe(items[0]);
    });

    it('End focuses the last item, disabled or not', async () => {
      const { menu, items } = await openMenu({ items: 4, disabled: [3] });
      key(menu, 'End');
      expect(document.activeElement).toBe(items[3]);
    });

    it('does not click a disabled item on Enter, and leaves the menu open', async () => {
      const { menu, items } = await openMenu({ items: 3, disabled: [1] });
      const activate = vi.fn();
      items[1].addEventListener('click', activate);
      key(menu, 'ArrowDown');
      key(document.activeElement, 'ArrowDown');
      expect(document.activeElement).toBe(items[1]);
      key(items[1], 'Enter');
      expect(activate).not.toHaveBeenCalled();
      expect(menu.classList.contains('hidden')).toBe(false);
    });

    it('still clicks an enabled item on Enter', async () => {
      const { menu, items } = await openMenu({ items: 2 });
      const activate = vi.fn();
      items[0].addEventListener('click', activate);
      key(items[0], 'Enter');
      expect(activate).toHaveBeenCalledOnce();
      expect(menu.classList.contains('scale-95')).toBe(true);
    });

    it('treats aria-disabled="false" as enabled, not as a bare attribute', async () => {
      // A bound attribute renders the literal string "false", so a presence
      // check would disable exactly the item the author meant to keep usable.
      const { items } = await openMenu({ items: 3 });
      items[1].setAttribute('aria-disabled', 'false');
      const activate = vi.fn();
      items[1].addEventListener('click', activate);
      key(items[1], 'Enter');
      expect(activate).toHaveBeenCalledOnce();
    });

    it('ignores a valueless aria-disabled, since the value carries the meaning', async () => {
      const { items } = await openMenu({ items: 3 });
      items[1].setAttribute('aria-disabled', '');
      const activate = vi.fn();
      items[1].addEventListener('click', activate);
      key(items[1], 'Enter');
      expect(activate).toHaveBeenCalledOnce();
    });

    it('typeahead matches a disabled item', async () => {
      const { menu, items } = await openMenu({ items: 3, disabled: [1] });
      items[1].textContent = 'Zebra disabled';
      items[2].textContent = 'Zebra enabled';
      key(menu, 'z');
      expect(document.activeElement).toBe(items[1]);
    });

    // Repeating a letter has to advance through the matches, not stick on the
    // first one, and wrap back round at the end.
    it('typeahead cycles through repeated matches', async () => {
      const { menu, items } = await openMenu({ items: 3 });
      items[0].textContent = 'Zebra one';
      items[1].textContent = 'Zebra two';
      items[2].textContent = 'Other';
      key(menu, 'z');
      expect(document.activeElement).toBe(items[0]);
      key(document.activeElement, 'z');
      expect(document.activeElement).toBe(items[1]);
      key(document.activeElement, 'z');
      expect(document.activeElement).toBe(items[0]);
    });

    it('still moves focus when every item is disabled', async () => {
      const { menu, items } = await openMenu({ items: 2, disabled: [0, 1] });
      menu.focus();
      key(menu, 'ArrowDown');
      expect(document.activeElement).toBe(items[0]);
      key(menu, 'End');
      expect(document.activeElement).toBe(items[1]);
    });
  });
});

describe('h-menu-item', () => {
  function createMenuItemSetup() {
    const container = document.createElement('div');
    const menu = document.createElement('ul');
    menu.setAttribute('role', 'menu');
    const item = document.createElement('li');
    menu.appendChild(item);
    container.appendChild(menu);
    return { container, menu, item };
  }

  it('applies base classes', () => {
    const { item } = createMenuItemSetup();
    mountDirective(menuPlugin, 'h-menu-item', item, { original: 'x-h-menu-item' });
    expect(item.classList.contains('flex')).toBe(true);
    expect(item.classList.contains('items-center')).toBe(true);
    expect(item.classList.contains('rounded-sm')).toBe(true);
  });

  it('sets role, tabindex, and data-slot', () => {
    const { item } = createMenuItemSetup();
    mountDirective(menuPlugin, 'h-menu-item', item, { original: 'x-h-menu-item' });
    expect(item.getAttribute('role')).toBe('menuitem');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.getAttribute('data-slot')).toBe('menu-item');
  });

  it('throws if element is not a li', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(menuPlugin, 'h-menu-item', el, { original: 'x-h-menu-item' })).toThrow();
  });

  it('calls cleanup', () => {
    const { item } = createMenuItemSetup();
    const { ctx } = mountDirective(menuPlugin, 'h-menu-item', item, { original: 'x-h-menu-item' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-menu-separator', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('li');
    mountDirective(menuPlugin, 'h-menu-separator', el);
    expect(el.classList.contains('bg-border')).toBe(true);
    expect(el.getAttribute('role')).toBe('presentation');
    expect(el.getAttribute('data-slot')).toBe('menu-separator');
  });
});

describe('h-menu-label', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('li');
    mountDirective(menuPlugin, 'h-menu-label', el);
    expect(el.classList.contains('font-semibold')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('menu-label');
  });
});

describe('h-menu-item-secondary', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(menuPlugin, 'h-menu-item-secondary', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('ml-auto')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('menu-item-secondary');
  });
});

describe('h-menu-checkbox-item', () => {
  function createCheckboxItemSetup() {
    const container = document.createElement('div');
    const menu = document.createElement('ul');
    menu.setAttribute('role', 'menu');
    const item = document.createElement('li');
    menu.appendChild(item);
    container.appendChild(menu);
    return { container, menu, item };
  }

  it('applies base classes and attributes', () => {
    const { item } = createCheckboxItemSetup();
    mountDirective(menuPlugin, 'h-menu-checkbox-item', item, { original: 'x-h-menu-checkbox-item' });
    expect(item.classList.contains('flex')).toBe(true);
    expect(item.getAttribute('role')).toBe('menuitemcheckbox');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.getAttribute('data-slot')).toBe('menu-checkbox-item');
  });

  it('throws if element is not li or div', () => {
    const el = document.createElement('span');
    expect(() => mountDirective(menuPlugin, 'h-menu-checkbox-item', el, { original: 'x-h-menu-checkbox-item' })).toThrow();
  });
});

describe('h-menu-radio-item', () => {
  function createRadioItemSetup() {
    const container = document.createElement('div');
    const menu = document.createElement('ul');
    menu.setAttribute('role', 'menu');
    const item = document.createElement('li');
    menu.appendChild(item);
    container.appendChild(menu);
    return { container, menu, item };
  }

  it('applies base classes and attributes', () => {
    const { item } = createRadioItemSetup();
    mountDirective(menuPlugin, 'h-menu-radio-item', item, {
      original: 'x-h-menu-radio-item',
      expression: '"option1"',
    });
    expect(item.classList.contains('flex')).toBe(true);
    expect(item.getAttribute('role')).toBe('menuitemradio');
    expect(item.getAttribute('tabindex')).toBe('-1');
    expect(item.getAttribute('data-slot')).toBe('menu-radio-item');
  });

  it('throws if not li or div', () => {
    const el = document.createElement('span');
    expect(() =>
      mountDirective(menuPlugin, 'h-menu-radio-item', el, {
        original: 'x-h-menu-radio-item',
        expression: '"option1"',
      })
    ).toThrow();
  });
});

describe('h-menu-sub', () => {
  function createSubSetup({ disabled = false } = {}) {
    const container = document.createElement('div');
    const menu = document.createElement('ul');
    menu.setAttribute('role', 'menu');
    const sub = document.createElement('li');
    if (disabled) sub.setAttribute('aria-disabled', 'true');
    menu.appendChild(sub);
    container.appendChild(menu);
    document.body.appendChild(container);
    mountDirective(menuPlugin, 'h-menu-sub', sub, { original: 'x-h-menu-sub' });
    // The nested x-h-menu claims these when it mounts. Stubbing them keeps the
    // test to the trigger, which is where the disabled guard lives.
    const open = vi.fn();
    sub._menu_sub.open = open;
    sub._menu_sub.close = vi.fn();
    return { menu, sub, open };
  }

  // A disabled subitem is announced as a submenu that cannot be opened, so it
  // keeps aria-haspopup and the tab stop but never expands.
  it('does not open on mouseenter, click or focus when disabled', () => {
    const { sub, open } = createSubSetup({ disabled: true });
    sub.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    sub.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    sub.dispatchEvent(new FocusEvent('focus'));
    expect(open).not.toHaveBeenCalled();
    expect(sub.getAttribute('aria-expanded')).toBe('false');
  });

  it('does not open on ArrowRight or Enter when disabled', () => {
    const { sub, open } = createSubSetup({ disabled: true });
    sub.dispatchEvent(new FocusEvent('focus'));
    for (const key of ['ArrowRight', 'Enter', ' ']) {
      sub.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
    }
    expect(open).not.toHaveBeenCalled();
    expect(sub.getAttribute('aria-expanded')).toBe('false');
  });

  it('stays focusable when disabled, so it is still announced', () => {
    const { sub } = createSubSetup({ disabled: true });
    sub.dispatchEvent(new FocusEvent('focus'));
    expect(sub.getAttribute('tabindex')).toBe('0');
    expect(sub.getAttribute('aria-haspopup')).toBe('true');
  });

  it('still opens on mouseenter when enabled', () => {
    const { sub, open } = createSubSetup();
    sub.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    expect(open).toHaveBeenCalledOnce();
    expect(sub.getAttribute('aria-expanded')).toBe('true');
  });
});
