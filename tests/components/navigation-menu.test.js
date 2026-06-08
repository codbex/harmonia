import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 10, y: 20, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
  size: vi.fn(),
}));

import menuPlugin from '../../src/components/menu.js';
import navigationMenuPlugin from '../../src/components/navigation-menu.js';
import { mountDirective } from '../test-utils.js';

afterEach(() => {
  document.body.innerHTML = '';
});

// ---------------------------------------------------------------------------
// h-nav
// ---------------------------------------------------------------------------

describe('h-nav', () => {
  it('throws if not a nav element', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'Main');
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' })).toThrow();
  });

  it('throws if aria-label is missing', () => {
    const el = document.createElement('nav');
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' })).toThrow();
  });

  it('applies base classes', () => {
    const el = document.createElement('nav');
    el.setAttribute('aria-label', 'Main');
    mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' });
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('sets data-slot="nav"', () => {
    const el = document.createElement('nav');
    el.setAttribute('aria-label', 'Main');
    mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' });
    expect(el.getAttribute('data-slot')).toBe('nav');
  });

  it('creates _h_nav with default variant when data-variant is absent', () => {
    const el = document.createElement('nav');
    el.setAttribute('aria-label', 'Main');
    mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' });
    expect(el._h_nav).toBeDefined();
    expect(el._h_nav.variant).toBe('default');
  });

  it('creates _h_nav with variant from data-variant attribute', () => {
    const el = document.createElement('nav');
    el.setAttribute('aria-label', 'Main');
    el.setAttribute('data-variant', 'outline');
    mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' });
    expect(el._h_nav.variant).toBe('outline');
  });

  it('updates _h_nav.variant when data-variant attribute changes', async () => {
    const el = document.createElement('nav');
    el.setAttribute('aria-label', 'Main');
    document.body.appendChild(el);
    mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' });
    expect(el._h_nav.variant).toBe('default');
    el.setAttribute('data-variant', 'clear');
    await Promise.resolve();
    expect(el._h_nav.variant).toBe('clear');
  });

  it('calls cleanup', () => {
    const el = document.createElement('nav');
    el.setAttribute('aria-label', 'Main');
    document.body.appendChild(el);
    const { ctx } = mountDirective(navigationMenuPlugin, 'h-nav', el, { original: 'x-h-nav' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// h-nav-list
// ---------------------------------------------------------------------------

describe('h-nav-list', () => {
  function createNavListSetup({ variant } = {}) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    if (variant) nav.setAttribute('data-variant', variant);
    const ul = document.createElement('ul');
    nav.appendChild(ul);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    return { nav, ul };
  }

  it('throws if not a ul element', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    const el = document.createElement('div');
    nav.appendChild(el);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-list', el, { original: 'x-h-nav-list' })).toThrow();
  });

  it('throws if no ancestor with _h_nav', () => {
    const container = document.createElement('div');
    const ul = document.createElement('ul');
    container.appendChild(ul);
    document.body.appendChild(container);
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' })).toThrow();
  });

  it('applies flex classes', () => {
    const { ul } = createNavListSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.classList.contains('flex')).toBe(true);
    expect(ul.classList.contains('flex-1')).toBe(true);
    expect(ul.classList.contains('list-none')).toBe(true);
    expect(ul.classList.contains('items-center')).toBe(true);
  });

  it('sets data-slot="nav-list"', () => {
    const { ul } = createNavListSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.getAttribute('data-slot')).toBe('nav-list');
  });

  it('applies gap-1 for default variant', () => {
    const { ul } = createNavListSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.classList.contains('gap-1')).toBe(true);
  });

  it('applies gap-1 for outline variant', () => {
    const { ul } = createNavListSetup({ variant: 'outline' });
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.classList.contains('gap-1')).toBe(true);
  });

  it('omits gap-1 for clear variant', () => {
    const { ul } = createNavListSetup({ variant: 'clear' });
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.classList.contains('gap-1')).toBe(false);
  });

  it('omits gap-1 for underline variant', () => {
    const { ul } = createNavListSetup({ variant: 'underline' });
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.classList.contains('gap-1')).toBe(false);
  });

  it('updates gap when data-variant changes on nav', async () => {
    const { nav, ul } = createNavListSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-list', ul, { original: 'x-h-nav-list' });
    expect(ul.classList.contains('gap-1')).toBe(true);
    nav.setAttribute('data-variant', 'clear');
    await Promise.resolve();
    expect(ul.classList.contains('gap-1')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// h-nav-item
// ---------------------------------------------------------------------------

describe('h-nav-item', () => {
  function createNavItemSetup() {
    const ul = document.createElement('ul');
    ul.setAttribute('data-slot', 'nav-list');
    const li = document.createElement('li');
    ul.appendChild(li);
    return { ul, li };
  }

  it('throws if not a li element', () => {
    const ul = document.createElement('ul');
    ul.setAttribute('data-slot', 'nav-list');
    const el = document.createElement('div');
    ul.appendChild(el);
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-item', el, { original: 'x-h-nav-item' })).toThrow();
  });

  it('throws if parent lacks data-slot="nav-list"', () => {
    const ul = document.createElement('ul');
    const li = document.createElement('li');
    ul.appendChild(li);
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-item', li, { original: 'x-h-nav-item' })).toThrow();
  });

  it('adds relative class', () => {
    const { li } = createNavItemSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-item', li, { original: 'x-h-nav-item' });
    expect(li.classList.contains('relative')).toBe(true);
  });

  it('sets data-slot="nav-item"', () => {
    const { li } = createNavItemSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-item', li, { original: 'x-h-nav-item' });
    expect(li.getAttribute('data-slot')).toBe('nav-item');
  });
});

// ---------------------------------------------------------------------------
// h-nav-trigger
// ---------------------------------------------------------------------------

describe('h-nav-trigger', () => {
  function createNavTriggerSetup({ withHover = false } = {}) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    if (withHover) nav.setAttribute('data-open-on-hover', '');
    const navItem = document.createElement('li');
    navItem.setAttribute('data-slot', 'nav-item');
    const button = document.createElement('button');
    navItem.appendChild(button);
    nav.appendChild(navItem);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    return { nav, navItem, button };
  }

  it('throws if not a button element', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    const navItem = document.createElement('li');
    navItem.setAttribute('data-slot', 'nav-item');
    const el = document.createElement('span');
    navItem.appendChild(el);
    nav.appendChild(navItem);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-trigger', el, { original: 'x-h-nav-trigger' })).toThrow();
  });

  it('throws if no ancestor with data-slot="nav-item"', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    const button = document.createElement('button');
    nav.appendChild(button);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' })).toThrow();
  });

  it('sets _h_menu_trigger with isDropdown true and navItem true', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button._h_menu_trigger).toBeDefined();
    expect(button._h_menu_trigger.isDropdown).toBe(true);
    expect(button._h_menu_trigger.navItem).toBe(true);
  });

  it('sets aria-haspopup="menu", aria-expanded="false", data-state="closed"', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.getAttribute('aria-haspopup')).toBe('menu');
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('data-state')).toBe('closed');
  });

  it('appends a chevron svg child', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    const svg = button.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('auto-generates an id when not present', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.hasAttribute('id')).toBe(true);
    expect(button.getAttribute('id')).toMatch(/^nnt/);
  });

  it('preserves an existing id', () => {
    const { button } = createNavTriggerSetup();
    button.setAttribute('id', 'my-custom-id');
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.getAttribute('id')).toBe('my-custom-id');
  });

  it('sets data-slot="nav-trigger"', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.getAttribute('data-slot')).toBe('nav-trigger');
  });

  it('calls cleanup', () => {
    const { button } = createNavTriggerSetup();
    const { ctx } = mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('setOpen(true) updates aria-expanded and data-state', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    button._h_menu_trigger.setOpen(true);
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('data-state')).toBe('open');
  });

  it('setOpen(false) updates aria-expanded and data-state', () => {
    const { button } = createNavTriggerSetup();
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    button._h_menu_trigger.setOpen(true);
    button._h_menu_trigger.setOpen(false);
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(button.getAttribute('data-state')).toBe('closed');
  });

  it('with data-open-on-hover: mouseenter on navItem calls openMenu', () => {
    vi.useFakeTimers();
    try {
      const { navItem, button } = createNavTriggerSetup({ withHover: true });
      mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
      const openMenu = vi.fn();
      button._h_menu_trigger.openMenu = openMenu;
      navItem.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      expect(openMenu).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it('with data-open-on-hover: mouseleave on navItem schedules close after 100ms timer', () => {
    vi.useFakeTimers();
    try {
      const { navItem, button } = createNavTriggerSetup({ withHover: true });
      mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
      const closeMenu = vi.fn();
      button._h_menu_trigger.closeMenu = closeMenu;
      navItem.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
      expect(closeMenu).not.toHaveBeenCalled();
      vi.advanceTimersByTime(100);
      expect(closeMenu).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });
});

// ---------------------------------------------------------------------------
// h-nav-link
// ---------------------------------------------------------------------------

describe('h-nav-link', () => {
  function createLink({ active = false } = {}) {
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    if (active) a.setAttribute('data-active', '');
    document.body.appendChild(a);
    return a;
  }

  it('throws if element is not an anchor or button', () => {
    const el = document.createElement('span');
    document.body.appendChild(el);
    expect(() => mountDirective(navigationMenuPlugin, 'h-nav-link', el, { original: 'x-h-nav-link' })).toThrow();
  });

  it('accepts a button element and sets type="button"', () => {
    const button = document.createElement('button');
    document.body.appendChild(button);
    mountDirective(navigationMenuPlugin, 'h-nav-link', button, { original: 'x-h-nav-link' });
    expect(button.getAttribute('type')).toBe('button');
    expect(button.getAttribute('data-slot')).toBe('nav-link');
  });

  it('applies no-underline and text-inherit classes', () => {
    const a = createLink();
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.classList.contains('no-underline')).toBe(true);
    expect(a.classList.contains('text-inherit')).toBe(true);
  });

  it('sets data-slot="nav-link"', () => {
    const a = createLink();
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.getAttribute('data-slot')).toBe('nav-link');
  });

  it('sets aria-current="page" when data-active is present on init', () => {
    const a = createLink({ active: true });
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.getAttribute('aria-current')).toBe('page');
  });

  it('does not set aria-current when data-active is absent on init', () => {
    const a = createLink();
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.getAttribute('aria-current')).toBeNull();
  });

  it('calls cleanup', () => {
    const a = createLink();
    const { ctx } = mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// h-nav-trigger variants
// ---------------------------------------------------------------------------

describe('h-nav-trigger variants', () => {
  function createTriggerWithVariant(variant) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    if (variant) nav.setAttribute('data-variant', variant);
    const navItem = document.createElement('li');
    navItem.setAttribute('data-slot', 'nav-item');
    const button = document.createElement('button');
    navItem.appendChild(button);
    nav.appendChild(navItem);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    return { nav, button };
  }

  it('default variant applies hover bg and open bg classes', () => {
    const { button } = createTriggerWithVariant('default');
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.classList.contains('hover:bg-secondary-hover')).toBe(true);
    expect(button.classList.contains('data-[state=open]:bg-secondary-hover')).toBe(true);
  });

  it('clear variant applies open text-primary, no hover bg', () => {
    const { button } = createTriggerWithVariant('clear');
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.classList.contains('data-[state=open]:text-primary')).toBe(true);
    expect(button.classList.contains('hover:bg-secondary-hover')).toBe(false);
    expect(button.classList.contains('data-[state=open]:bg-secondary-hover')).toBe(false);
  });

  it('underline variant applies hover:underline and open text-primary', () => {
    const { button } = createTriggerWithVariant('underline');
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.classList.contains('hover:underline')).toBe(true);
    expect(button.classList.contains('data-[state=open]:text-primary')).toBe(true);
    expect(button.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('outline variant applies border classes, no hover bg', () => {
    const { button } = createTriggerWithVariant('outline');
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.classList.contains('border')).toBe(true);
    expect(button.classList.contains('hover:border-border')).toBe(true);
    expect(button.classList.contains('data-[state=open]:border-border')).toBe(true);
    expect(button.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('updates classes when data-variant changes on nav', async () => {
    const { nav, button } = createTriggerWithVariant('default');
    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });
    expect(button.classList.contains('hover:bg-secondary-hover')).toBe(true);
    nav.setAttribute('data-variant', 'clear');
    await Promise.resolve();
    expect(button.classList.contains('hover:bg-secondary-hover')).toBe(false);
    expect(button.classList.contains('data-[state=open]:text-primary')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// h-nav-link variants
// ---------------------------------------------------------------------------

describe('h-nav-link variants', () => {
  function createLinkWithVariant(variant) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    if (variant) nav.setAttribute('data-variant', variant);
    const a = document.createElement('a');
    a.setAttribute('href', '#');
    nav.appendChild(a);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });
    return { nav, a };
  }

  it('default variant applies hover bg and active bg classes', () => {
    const { a } = createLinkWithVariant('default');
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.classList.contains('hover:bg-secondary-hover')).toBe(true);
    expect(a.classList.contains('data-[active]:bg-secondary-hover')).toBe(true);
  });

  it('clear variant applies active text-primary, no hover bg', () => {
    const { a } = createLinkWithVariant('clear');
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.classList.contains('data-[active]:text-primary')).toBe(true);
    expect(a.classList.contains('hover:bg-secondary-hover')).toBe(false);
    expect(a.classList.contains('data-[active]:bg-secondary-hover')).toBe(false);
  });

  it('underline variant applies hover:underline and active text-primary', () => {
    const { a } = createLinkWithVariant('underline');
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.classList.contains('hover:underline')).toBe(true);
    expect(a.classList.contains('data-[active]:text-primary')).toBe(true);
    expect(a.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('outline variant applies border classes, no hover bg', () => {
    const { a } = createLinkWithVariant('outline');
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.classList.contains('border')).toBe(true);
    expect(a.classList.contains('hover:border-border')).toBe(true);
    expect(a.classList.contains('data-[active]:border-border')).toBe(true);
    expect(a.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('always applies data-[active]:font-semibold regardless of variant', () => {
    for (const variant of ['default', 'clear', 'underline', 'outline']) {
      const { a } = createLinkWithVariant(variant);
      mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
      expect(a.classList.contains('data-[active]:font-semibold')).toBe(true);
      document.body.innerHTML = '';
    }
  });

  it('updates classes when data-variant changes on nav', async () => {
    const { nav, a } = createLinkWithVariant('default');
    mountDirective(navigationMenuPlugin, 'h-nav-link', a, { original: 'x-h-nav-link' });
    expect(a.classList.contains('hover:bg-secondary-hover')).toBe(true);
    nav.setAttribute('data-variant', 'underline');
    await Promise.resolve();
    expect(a.classList.contains('hover:bg-secondary-hover')).toBe(false);
    expect(a.classList.contains('hover:underline')).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// h-nav-trigger + h-menu aria-controls integration
// ---------------------------------------------------------------------------

describe('h-nav-trigger + h-menu', () => {
  it('h-menu sets aria-controls on the nav trigger pointing to the menu id', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Main');
    const navItem = document.createElement('li');
    navItem.setAttribute('data-slot', 'nav-item');
    const button = document.createElement('button');
    button.setAttribute('id', 'nav-ctrl-trigger');
    navItem.appendChild(button);
    nav.appendChild(navItem);
    document.body.appendChild(nav);
    mountDirective(navigationMenuPlugin, 'h-nav', nav, { original: 'x-h-nav' });

    mountDirective(navigationMenuPlugin, 'h-nav-trigger', button, { original: 'x-h-nav-trigger' });

    const menu = document.createElement('ul');
    navItem.appendChild(menu);

    mountDirective(menuPlugin, 'h-menu', menu, { original: 'x-h-menu', modifiers: [] });

    expect(menu.hasAttribute('id')).toBe(true);
    expect(button.getAttribute('aria-controls')).toBe(menu.getAttribute('id'));
  });
});
