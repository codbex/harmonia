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

  function createOpenableMenuSetup() {
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
    const item = document.createElement('li');
    item.textContent = 'First item';
    menu.appendChild(item);
    container.appendChild(trigger);
    container.appendChild(menu);
    document.body.appendChild(container);
    mountDirective(menuPlugin, 'h-menu', menu, { original: 'x-h-menu', modifiers: [] });
    mountDirective(menuPlugin, 'h-menu-item', item, { original: 'x-h-menu-item', modifiers: [] });
    return { trigger, menu, item };
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
