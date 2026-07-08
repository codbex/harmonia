import { afterEach, describe, expect, it, vi } from 'vitest';

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
import menubarPlugin from '../../src/components/menubar.js';
import { mountDirective } from '../test-utils.js';

afterEach(() => {
  document.body.innerHTML = '';
});

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function keydown(el, key) {
  el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

function createMenubar({ triggers = 2 } = {}) {
  const bar = document.createElement('ul');
  bar.setAttribute('aria-label', 'Application');
  document.body.appendChild(bar);
  mountDirective(menubarPlugin, 'h-menubar', bar, { original: 'x-h-menubar' });
  const buttons = [];
  const labels = ['File', 'Edit', 'View', 'Help'];
  for (let i = 0; i < triggers; i++) {
    const li = document.createElement('li');
    bar.appendChild(li);
    mountDirective(menubarPlugin, 'h-menubar-item', li, { original: 'x-h-menubar-item' });
    const button = document.createElement('button');
    button.textContent = labels[i] ?? `Menu ${i}`;
    li.appendChild(button);
    mountDirective(menubarPlugin, 'h-menubar-trigger', button, { original: 'x-h-menubar-trigger' });
    buttons.push(button);
  }
  return { bar, buttons };
}

// ---------------------------------------------------------------------------
// h-menubar
// ---------------------------------------------------------------------------

describe('h-menubar', () => {
  it('throws if not a ul element', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Application');
    expect(() => mountDirective(menubarPlugin, 'h-menubar', el, { original: 'x-h-menubar' })).toThrow();
  });

  it('throws if aria-label is missing', () => {
    const el = document.createElement('ul');
    expect(() => mountDirective(menubarPlugin, 'h-menubar', el, { original: 'x-h-menubar' })).toThrow();
  });

  it('sets role="menubar" and horizontal orientation', () => {
    const { bar } = createMenubar();
    expect(bar.getAttribute('role')).toBe('menubar');
    expect(bar.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('sets data-slot="menubar"', () => {
    const { bar } = createMenubar();
    expect(bar.getAttribute('data-slot')).toBe('menubar');
  });

  it('applies base classes', () => {
    const { bar } = createMenubar();
    for (const cls of ['flex', 'w-fit', 'list-none', 'items-center', 'rounded-control']) {
      expect(bar.classList.contains(cls)).toBe(true);
    }
  });

  it('applies gap-1 between the triggers without a variant', () => {
    const { bar } = createMenubar();
    expect(bar.classList.contains('gap-1')).toBe(true);
  });

  it('has no padding classes', () => {
    const { bar } = createMenubar();
    expect(bar.classList.contains('p-1')).toBe(false);
    expect(bar.classList.contains('px-2')).toBe(false);
    expect(bar.classList.contains('px-3')).toBe(false);
  });

  it('has no border and no size classes without a variant', () => {
    const { bar } = createMenubar();
    expect(bar.classList.contains('border')).toBe(false);
    expect(bar.classList.contains('h-9')).toBe(false);
  });

  it('applies border and trigger corner classes without a gap for the outline variant', () => {
    const el = document.createElement('ul');
    el.setAttribute('aria-label', 'Application');
    el.setAttribute('data-variant', 'outline');
    mountDirective(menubarPlugin, 'h-menubar', el, { original: 'x-h-menubar' });
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('[&>li:first-of-type>[data-slot=menubar-trigger]]:rounded-l-control')).toBe(true);
    expect(el.classList.contains('[&>li:last-of-type>[data-slot=menubar-trigger]]:rounded-r-control')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(false);
    expect(el.classList.contains('h-9')).toBe(false);
  });

  it('updates the variant classes when data-variant changes', async () => {
    const { bar } = createMenubar();
    bar.setAttribute('data-variant', 'outline');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bar.classList.contains('border')).toBe(true);
    expect(bar.classList.contains('gap-1')).toBe(false);
    bar.removeAttribute('data-variant');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(bar.classList.contains('border')).toBe(false);
    expect(bar.classList.contains('[&>li:first-of-type>[data-slot=menubar-trigger]]:rounded-l-control')).toBe(false);
    expect(bar.classList.contains('gap-1')).toBe(true);
  });

  it('creates _h_menubar state with no open trigger', () => {
    const { bar } = createMenubar();
    expect(bar._h_menubar).toBeDefined();
    expect(bar._h_menubar.open).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// h-menubar-item
// ---------------------------------------------------------------------------

describe('h-menubar-item', () => {
  it('throws if not a li element', () => {
    const ul = document.createElement('ul');
    ul.setAttribute('data-slot', 'menubar');
    const el = document.createElement('div');
    ul.appendChild(el);
    expect(() => mountDirective(menubarPlugin, 'h-menubar-item', el, { original: 'x-h-menubar-item' })).toThrow();
  });

  it('throws if parent lacks data-slot="menubar"', () => {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    ul.appendChild(li);
    expect(() => mountDirective(menubarPlugin, 'h-menubar-item', li, { original: 'x-h-menubar-item' })).toThrow();
  });

  it('sets role="none", relative class and data-slot', () => {
    const ul = document.createElement('ul');
    ul.setAttribute('data-slot', 'menubar');
    const li = document.createElement('li');
    ul.appendChild(li);
    mountDirective(menubarPlugin, 'h-menubar-item', li, { original: 'x-h-menubar-item' });
    expect(li.getAttribute('role')).toBe('none');
    expect(li.classList.contains('relative')).toBe(true);
    expect(li.getAttribute('data-slot')).toBe('menubar-item');
  });
});

// ---------------------------------------------------------------------------
// h-menubar-trigger
// ---------------------------------------------------------------------------

describe('h-menubar-trigger', () => {
  it('throws if not a button element', () => {
    const { bar } = createMenubar({ triggers: 0 });
    const li = document.createElement('li');
    bar.appendChild(li);
    const el = document.createElement('span');
    li.appendChild(el);
    expect(() => mountDirective(menubarPlugin, 'h-menubar-trigger', el, { original: 'x-h-menubar-trigger' })).toThrow();
  });

  it('throws if no ancestor with _h_menubar', () => {
    const container = document.createElement('div');
    const button = document.createElement('button');
    container.appendChild(button);
    document.body.appendChild(container);
    expect(() => mountDirective(menubarPlugin, 'h-menubar-trigger', button, { original: 'x-h-menubar-trigger' })).toThrow();
  });

  it('sets menuitem role and popup attributes', () => {
    const { buttons } = createMenubar();
    expect(buttons[0].getAttribute('role')).toBe('menuitem');
    expect(buttons[0].getAttribute('aria-haspopup')).toBe('menu');
    expect(buttons[0].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[0].getAttribute('data-state')).toBe('closed');
    expect(buttons[0].getAttribute('data-slot')).toBe('menubar-trigger');
    expect(buttons[0].getAttribute('type')).toBe('button');
  });

  it('auto-generates an id when not present', () => {
    const { buttons } = createMenubar();
    expect(buttons[0].getAttribute('id')).toMatch(/^mbt/);
  });

  it('preserves an existing id', () => {
    const { bar } = createMenubar({ triggers: 0 });
    const li = document.createElement('li');
    bar.appendChild(li);
    const button = document.createElement('button');
    button.setAttribute('id', 'my-custom-id');
    li.appendChild(button);
    mountDirective(menubarPlugin, 'h-menubar-trigger', button, { original: 'x-h-menubar-trigger' });
    expect(button.getAttribute('id')).toBe('my-custom-id');
  });

  it('uses the button height classes driven by the menubar data-size', () => {
    const { buttons } = createMenubar();
    expect(buttons[0].classList.contains('h-9')).toBe(true);
    expect(buttons[0].classList.contains('[[data-slot=menubar][data-size=md]_&]:h-8')).toBe(true);
    expect(buttons[0].classList.contains('[[data-slot=menubar][data-size=sm]_&]:h-6.5')).toBe(true);
  });

  it('does not append a chevron svg', () => {
    const { buttons } = createMenubar();
    expect(buttons[0].querySelector('svg')).toBeNull();
  });

  it('publishes the menu trigger contract', () => {
    const { buttons } = createMenubar();
    expect(buttons[0]._h_menu_trigger).toBeDefined();
    expect(buttons[0]._h_menu_trigger.isDropdown).toBe(true);
    expect(buttons[0]._h_menu_trigger.navItem).toBe(true);
    expect(typeof buttons[0]._h_menu_trigger.moveInBar).toBe('function');
    expect(typeof buttons[0]._h_menu_trigger.setOpen).toBe('function');
  });

  it('gives the first trigger tabindex 0 and later ones -1', () => {
    const { buttons } = createMenubar({ triggers: 3 });
    expect(buttons[0].getAttribute('tabindex')).toBe('0');
    expect(buttons[1].getAttribute('tabindex')).toBe('-1');
    expect(buttons[2].getAttribute('tabindex')).toBe('-1');
  });

  it('setOpen(true) updates attributes and marks the trigger as open on the bar', () => {
    const { bar, buttons } = createMenubar();
    buttons[0]._h_menu_trigger.setOpen(true);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[0].getAttribute('data-state')).toBe('open');
    expect(bar._h_menubar.open).toBe(buttons[0]);
  });

  it('setOpen(false) clears the bar state only for the open trigger', () => {
    const { bar, buttons } = createMenubar();
    buttons[0]._h_menu_trigger.setOpen(true);
    buttons[1]._h_menu_trigger.setOpen(false);
    expect(bar._h_menubar.open).toBe(buttons[0]);
    buttons[0]._h_menu_trigger.setOpen(false);
    expect(bar._h_menubar.open).toBeNull();
  });

  it('opening one trigger closes the previously open one', () => {
    const { bar, buttons } = createMenubar();
    const closeMenu = vi.fn(() => buttons[0]._h_menu_trigger.setOpen(false));
    buttons[0]._h_menu_trigger.closeMenu = closeMenu;
    buttons[0]._h_menu_trigger.setOpen(true);
    buttons[1]._h_menu_trigger.setOpen(true);
    expect(closeMenu).toHaveBeenCalledOnce();
    expect(bar._h_menubar.open).toBe(buttons[1]);
  });

  it('mouseenter opens the menu only while another menu is open', () => {
    const { buttons } = createMenubar();
    const openMenu = vi.fn();
    buttons[1]._h_menu_trigger.openMenu = openMenu;
    buttons[1].dispatchEvent(new MouseEvent('mouseenter'));
    expect(openMenu).not.toHaveBeenCalled();
    buttons[0]._h_menu_trigger.setOpen(true);
    buttons[1].dispatchEvent(new MouseEvent('mouseenter'));
    expect(openMenu).toHaveBeenCalledOnce();
  });

  it('mouseenter on the already open trigger does nothing', () => {
    const { buttons } = createMenubar();
    const openMenu = vi.fn();
    buttons[0]._h_menu_trigger.openMenu = openMenu;
    buttons[0]._h_menu_trigger.setOpen(true);
    buttons[0].dispatchEvent(new MouseEvent('mouseenter'));
    expect(openMenu).not.toHaveBeenCalled();
  });

  it('ArrowRight and ArrowLeft move the roving tab stop with wrapping', () => {
    const { buttons } = createMenubar({ triggers: 3 });
    keydown(buttons[0], 'ArrowRight');
    expect(document.activeElement).toBe(buttons[1]);
    expect(buttons[1].getAttribute('tabindex')).toBe('0');
    expect(buttons[0].getAttribute('tabindex')).toBe('-1');
    keydown(buttons[1], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons[0]);
    keydown(buttons[0], 'ArrowLeft');
    expect(document.activeElement).toBe(buttons[2]);
    keydown(buttons[2], 'ArrowRight');
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('ArrowRight opens the next menu when a menu is already open', () => {
    const { buttons } = createMenubar();
    const openMenu = vi.fn();
    buttons[1]._h_menu_trigger.openMenu = openMenu;
    buttons[0]._h_menu_trigger.setOpen(true);
    keydown(buttons[0], 'ArrowRight');
    expect(openMenu).toHaveBeenCalledOnce();
    expect(buttons[1]._h_menu_trigger.focusOnOpen).toBe('first');
  });

  it('ArrowRight does not open the next menu when nothing is open', () => {
    const { buttons } = createMenubar();
    const openMenu = vi.fn();
    buttons[1]._h_menu_trigger.openMenu = openMenu;
    keydown(buttons[0], 'ArrowRight');
    expect(openMenu).not.toHaveBeenCalled();
  });

  it('ArrowDown opens the menu focusing the first item', () => {
    const { buttons } = createMenubar();
    const openMenu = vi.fn();
    buttons[0]._h_menu_trigger.openMenu = openMenu;
    keydown(buttons[0], 'ArrowDown');
    expect(openMenu).toHaveBeenCalledOnce();
    expect(buttons[0]._h_menu_trigger.focusOnOpen).toBe('first');
  });

  it('ArrowUp opens the menu focusing the last item', () => {
    const { buttons } = createMenubar();
    const openMenu = vi.fn();
    buttons[0]._h_menu_trigger.openMenu = openMenu;
    keydown(buttons[0], 'ArrowUp');
    expect(openMenu).toHaveBeenCalledOnce();
    expect(buttons[0]._h_menu_trigger.focusOnOpen).toBe('last');
  });

  it('Home and End focus the first and last trigger', () => {
    const { buttons } = createMenubar({ triggers: 3 });
    keydown(buttons[1], 'End');
    expect(document.activeElement).toBe(buttons[2]);
    expect(buttons[2].getAttribute('tabindex')).toBe('0');
    keydown(buttons[2], 'Home');
    expect(document.activeElement).toBe(buttons[0]);
    expect(buttons[0].getAttribute('tabindex')).toBe('0');
  });

  it('Enter marks the first item for focus and lets the native click open the menu', () => {
    const { buttons } = createMenubar();
    keydown(buttons[0], 'Enter');
    expect(buttons[0]._h_menu_trigger.focusOnOpen).toBe('first');
  });

  it('Escape closes the trigger menu only when it is open', () => {
    const { buttons } = createMenubar();
    const closeMenu = vi.fn(() => buttons[0]._h_menu_trigger.setOpen(false));
    buttons[0]._h_menu_trigger.closeMenu = closeMenu;
    keydown(buttons[0], 'Escape');
    expect(closeMenu).not.toHaveBeenCalled();
    buttons[0]._h_menu_trigger.setOpen(true);
    keydown(buttons[0], 'Escape');
    expect(closeMenu).toHaveBeenCalledOnce();
  });

  it('focusing a trigger re-points the roving tab stop', () => {
    const { buttons } = createMenubar({ triggers: 3 });
    buttons[2].dispatchEvent(new Event('focus'));
    expect(buttons[2].getAttribute('tabindex')).toBe('0');
    expect(buttons[0].getAttribute('tabindex')).toBe('-1');
  });

  it('moveInBar closes the current menu and opens the neighbor', () => {
    const { buttons } = createMenubar({ triggers: 3 });
    const closeMenu = vi.fn(() => buttons[0]._h_menu_trigger.setOpen(false));
    const openMenu = vi.fn();
    buttons[0]._h_menu_trigger.closeMenu = closeMenu;
    buttons[1]._h_menu_trigger.openMenu = openMenu;
    buttons[0]._h_menu_trigger.setOpen(true);
    buttons[0]._h_menu_trigger.moveInBar('next');
    expect(closeMenu).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(buttons[1]);
    expect(buttons[1]._h_menu_trigger.focusOnOpen).toBe('first');
    expect(openMenu).toHaveBeenCalledOnce();
  });

  it('cleanup removes listeners and clears the open state', () => {
    const bar = document.createElement('ul');
    bar.setAttribute('aria-label', 'Application');
    document.body.appendChild(bar);
    mountDirective(menubarPlugin, 'h-menubar', bar, { original: 'x-h-menubar' });
    const li = document.createElement('li');
    bar.appendChild(li);
    const button = document.createElement('button');
    li.appendChild(button);
    const { ctx } = mountDirective(menubarPlugin, 'h-menubar-trigger', button, { original: 'x-h-menubar-trigger' });
    button._h_menu_trigger.setOpen(true);
    expect(ctx.cleanup).toHaveBeenCalledOnce();
    ctx.cleanup.mock.calls[0][0]();
    expect(bar._h_menubar.open).toBeNull();
    const openMenu = vi.fn();
    button._h_menu_trigger.openMenu = openMenu;
    keydown(button, 'ArrowDown');
    expect(openMenu).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// h-menubar-trigger + h-menu integration
// ---------------------------------------------------------------------------

describe('h-menubar-trigger + h-menu', () => {
  function createIntegratedMenubar() {
    const { bar, buttons } = createMenubar({ triggers: 2 });
    const itemLabels = [
      ['New', 'Open'],
      ['Undo', 'Redo'],
    ];
    const menus = buttons.map((button, index) => {
      const menu = document.createElement('ul');
      button.parentElement.appendChild(menu);
      for (const label of itemLabels[index]) {
        const li = document.createElement('li');
        li.textContent = label;
        menu.appendChild(li);
      }
      mountDirective(menuPlugin, 'h-menu', menu, { original: 'x-h-menu', modifiers: [] });
      for (const li of menu.children) {
        mountDirective(menuPlugin, 'h-menu-item', li, { original: 'x-h-menu-item', modifiers: [] });
      }
      return menu;
    });
    return { bar, buttons, menus };
  }

  it('populates openMenu and closeMenu and links aria-controls', () => {
    const { buttons, menus } = createIntegratedMenubar();
    expect(typeof buttons[0]._h_menu_trigger.openMenu).toBe('function');
    expect(typeof buttons[0]._h_menu_trigger.closeMenu).toBe('function');
    expect(buttons[0].getAttribute('aria-controls')).toBe(menus[0].getAttribute('id'));
    expect(menus[0].getAttribute('aria-labelledby')).toBe(buttons[0].getAttribute('id'));
  });

  it('clicking the trigger opens the menu', async () => {
    const { buttons, menus } = createIntegratedMenubar();
    buttons[0].click();
    await flush();
    expect(buttons[0].getAttribute('data-state')).toBe('open');
    expect(menus[0].classList.contains('hidden')).toBe(false);
  });

  it('focusOnOpen focuses the first menu item', async () => {
    const { buttons, menus } = createIntegratedMenubar();
    buttons[0]._h_menu_trigger.focusOnOpen = 'first';
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    expect(document.activeElement).toBe(menus[0].children[0]);
  });

  it('opening a second menu closes the first one', async () => {
    const { bar, buttons } = createIntegratedMenubar();
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    buttons[1]._h_menu_trigger.openMenu();
    await flush();
    expect(buttons[0].getAttribute('data-state')).toBe('closed');
    expect(buttons[1].getAttribute('data-state')).toBe('open');
    expect(bar._h_menubar.open).toBe(buttons[1]);
  });

  it('hovering a sibling trigger switches the open menu', async () => {
    const { buttons } = createIntegratedMenubar();
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    buttons[1].dispatchEvent(new MouseEvent('mouseenter'));
    await flush();
    expect(buttons[0].getAttribute('data-state')).toBe('closed');
    expect(buttons[1].getAttribute('data-state')).toBe('open');
  });

  it('ArrowRight inside an open menu moves to the next menu', async () => {
    const { buttons, menus } = createIntegratedMenubar();
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    keydown(menus[0], 'ArrowRight');
    await flush();
    expect(buttons[0].getAttribute('data-state')).toBe('closed');
    expect(buttons[1].getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menus[1].children[0]);
  });

  it('ArrowLeft inside an open menu moves to the previous menu with wrap', async () => {
    const { buttons, menus } = createIntegratedMenubar();
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    keydown(menus[0], 'ArrowLeft');
    await flush();
    expect(buttons[0].getAttribute('data-state')).toBe('closed');
    expect(buttons[1].getAttribute('data-state')).toBe('open');
    expect(document.activeElement).toBe(menus[1].children[0]);
  });

  it('reopens a menu that is still fading out after close', async () => {
    const { buttons, menus } = createIntegratedMenubar();
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    buttons[0]._h_menu_trigger.closeMenu();
    buttons[0]._h_menu_trigger.openMenu();
    await flush();
    expect(buttons[0].getAttribute('data-state')).toBe('open');
    expect(menus[0].classList.contains('scale-95')).toBe(false);
    expect(menus[0].classList.contains('opacity-0')).toBe(false);
  });
});
