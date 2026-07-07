import { describe, expect, it } from 'vitest';
import sidebarPlugin from '../../src/components/sidebar.js';
import { mountDirective } from '../test-utils.js';

describe('h-sidebar', () => {
  it('applies base classes', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('bg-sidebar')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('sidebar');
  });

  it('adds border-r by default', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(el.classList.contains('border-r')).toBe(true);
  });

  it('adds border-l for right modifier', () => {
    const el = document.createElement('aside');
    mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: ['right'] });
    expect(el.classList.contains('border-l')).toBe(true);
  });

  it('calls cleanup', () => {
    const el = document.createElement('aside');
    const { ctx } = mountDirective(sidebarPlugin, 'h-sidebar', el, { modifiers: [] });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-sidebar-header', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('inset-shadow-[0_-1px_var(--sidebar-border)]')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-header');
  });

  it('removes inset-shadow when data-borderless=true', () => {
    const el = document.createElement('div');
    el.dataset.borderless = 'true';
    mountDirective(sidebarPlugin, 'h-sidebar-header', el);
    expect(el.classList.contains('inset-shadow-[0_-1px_var(--border)]')).toBe(false);
  });
});

describe('h-sidebar-header-item', () => {
  it('applies base classes and data-slot on a non-interactive element', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-header-item');
  });

  it('throws when set on a button or an anchor element', () => {
    const button = document.createElement('button');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-header-item', button, { original: 'x-h-sidebar-header-item' })).toThrow();
    const anchor = document.createElement('a');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-header-item', anchor, { original: 'x-h-sidebar-header-item' })).toThrow();
  });

  it('keeps a first-child avatar visible and resizes it when collapsed', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-header-item', el, { original: 'x-h-sidebar-header-item' });
    // The collapse hide rule exempts a first-child avatar so it stays visible.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>*:not(svg:first-child):not([data-slot=menu]):not([data-slot=avatar]:first-child)]:hidden!')).toBe(true);
    // and it is sized down to fit the collapsed rail.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>[data-slot=avatar]:first-child]:size-6!')).toBe(true);
  });
});

describe('h-sidebar-content', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-content', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('overflow-auto')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-content');
  });
});

describe('h-sidebar-group', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group', el, {
      modifiers: [],
      expression: 'false',
    });
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-group');
  });

  it('initializes _h_sidebar_group state', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group', el, {
      modifiers: [],
      expression: 'false',
    });
    expect(el._h_sidebar_group).toBeDefined();
    expect(el._h_sidebar_group.collapsable).toBe(false);
  });

  it('sets collapsable=true for collapsed modifier', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-group', el, {
      modifiers: ['collapsed'],
      expression: 'false',
    });
    expect(el._h_sidebar_group.collapsable).toBe(true);
  });
});

describe('h-sidebar-menu', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('ul');
    mountDirective(sidebarPlugin, 'h-sidebar-menu', el, { original: 'x-h-sidebar-menu' });
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('min-w-0')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu');
  });

  it('throws if element is not ul', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-menu', el, { original: 'x-h-sidebar-menu' })).toThrow();
  });
});

describe('h-sidebar-menu-item', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('li');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-item', el, {
      original: 'x-h-sidebar-menu-item',
      modifiers: [],
      expression: 'false',
    });
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-item');
    expect(el._h_sidebar_menu_item).toBeDefined();
  });

  it('throws if element is not li', () => {
    const el = document.createElement('div');
    expect(() =>
      mountDirective(sidebarPlugin, 'h-sidebar-menu-item', el, {
        original: 'x-h-sidebar-menu-item',
        modifiers: [],
        expression: 'false',
      })
    ).toThrow();
  });
});

describe('h-sidebar-menu-button', () => {
  it('throws unless set on a button or a link', () => {
    const el = document.createElement('div');
    expect(() => mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] })).toThrow();
  });

  it('applies base classes and data-slot on a button', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    expect(el.getAttribute('type')).toBe('button');
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-button');
    expect(el.classList.contains('flex')).toBe(true);
  });

  it('keeps a first-child avatar visible and centers it when collapsed', () => {
    const el = document.createElement('button');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-button', el, { original: 'x-h-sidebar-menu-button', modifiers: [] });
    // Exempt a first-child avatar from the collapse hide rule.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>*:not(svg:first-child):not([data-slot=menu]):not([data-slot=avatar]:first-child)]:hidden!')).toBe(true);
    // Size it to the collapsed rail, drop the button padding and center it.
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:[&>[data-slot=avatar]:first-child]:size-6!')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:has-[>[data-slot=avatar]:first-child]:p-0!')).toBe(true);
    expect(el.classList.contains('group-data-[collapsed=true]/sidebar:has-[>[data-slot=avatar]:first-child]:justify-center!')).toBe(true);
  });
});

describe('h-sidebar-separator', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-separator', el);
    expect(el.classList.contains('bg-sidebar-border')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.classList.contains('h-px')).toBe(true);
    expect(el.getAttribute('role')).toBe('none');
    expect(el.getAttribute('data-slot')).toBe('sidebar-separator');
  });
});

describe('h-sidebar-menu-badge', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(sidebarPlugin, 'h-sidebar-menu-badge', el, {
      original: 'x-h-sidebar-menu-badge',
    });
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-menu-badge');
  });

  it('throws if element is not span', () => {
    const el = document.createElement('div');
    expect(() =>
      mountDirective(sidebarPlugin, 'h-sidebar-menu-badge', el, {
        original: 'x-h-sidebar-menu-badge',
      })
    ).toThrow();
  });
});

describe('h-sidebar-footer', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-footer', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('inset-shadow-[0_1px_var(--sidebar-border)]')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-footer');
  });

  it('removes inset-shadow when data-borderless=true', () => {
    const el = document.createElement('div');
    el.dataset.borderless = 'true';
    mountDirective(sidebarPlugin, 'h-sidebar-footer', el);
    expect(el.classList.contains('inset-shadow-[0_1px_var(--border)]')).toBe(false);
  });
});
