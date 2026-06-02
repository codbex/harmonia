import { describe, it, expect, vi } from 'vitest';
import { mountDirective } from '../test-utils.js';
import sidebarPlugin from '../../src/components/sidebar.js';

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
    expect(el.classList.contains('border-b')).toBe(true);
    expect(el.classList.contains('h-12')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-header');
  });

  it('removes border-b when data-borderless=true', () => {
    const el = document.createElement('div');
    el.dataset.borderless = 'true';
    mountDirective(sidebarPlugin, 'h-sidebar-header', el);
    expect(el.classList.contains('border-b')).toBe(false);
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
    expect(() =>
      mountDirective(sidebarPlugin, 'h-sidebar-menu', el, { original: 'x-h-sidebar-menu' })
    ).toThrow();
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

describe('h-sidebar-separator', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(sidebarPlugin, 'h-sidebar-separator', el);
    expect(el.classList.contains('bg-border')).toBe(true);
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
    expect(el.classList.contains('border-t')).toBe(true);
    expect(el.classList.contains('h-12')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('sidebar-footer');
  });

  it('removes border-t when data-borderless=true', () => {
    const el = document.createElement('div');
    el.dataset.borderless = 'true';
    mountDirective(sidebarPlugin, 'h-sidebar-footer', el);
    expect(el.classList.contains('border-t')).toBe(false);
  });
});
