import { describe, expect, it, vi } from 'vitest';
import notificationsPlugin from '../../src/components/notifications.js';
import { createMockAlpine, createMockContext } from '../test-utils.js';

function makeAlpineWithStore() {
  const alpine = createMockAlpine();
  const stores = {};
  alpine.store = vi.fn((name, value) => {
    if (value !== undefined) {
      stores[name] = value;
    }
    return stores[name];
  });
  alpine.magic = vi.fn();
  alpine.nextTick = vi.fn((fn) => fn && fn());
  alpine.reactive = (obj) => obj;
  return alpine;
}

describe('notifications plugin registration', () => {
  it('registers _h_notifications store', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    expect(alpine.store).toHaveBeenCalledWith('_h_notifications', expect.any(Object));
  });

  it('registers $notifications magic helper', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    expect(alpine.magic).toHaveBeenCalledWith('notifications', expect.any(Function));
  });

  it('store has push, update, remove methods', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    expect(typeof store.push).toBe('function');
    expect(typeof store.update).toBe('function');
    expect(typeof store.remove).toBe('function');
  });

  it('store.push throws if template not provided', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    expect(() => store.push('id1', null)).toThrow('Notification must have a template ID');
  });

  it('store.push adds item to items', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    store.push('id1', 'my-template', 'top-right', 5000, {});
    expect(store.items.length).toBe(1);
    expect(store.items[0].id).toBe('id1');
  });

  it('store.update throws if no id provided', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    expect(() => store.update(null, {})).toThrow();
  });

  it('store.remove throws if no id provided', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    expect(() => store.remove(null)).toThrow();
  });

  it('store.remove filters out item', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    store.push('id1', 'tmpl1');
    store.remove('id1');
    expect(store.items.length).toBe(0);
  });
});

describe('h-notification-overlay', () => {
  function createOverlayEl() {
    const el = document.createElement('section');
    return el;
  }

  it('throws if element is not section', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    expect(() => alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, ctx)).toThrow();
  });

  it('applies base classes', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = createOverlayEl();
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, ctx);
    expect(el.classList.contains('fixed')).toBe(true);
    expect(el.classList.contains('pointer-events-none')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification-overlay');
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('creates 6 ol child elements', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = createOverlayEl();
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, createMockContext(alpine));
    const lists = el.querySelectorAll('ol');
    expect(lists.length).toBe(6);
  });

  it('top lists have common list classes and top mask', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = createOverlayEl();
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, createMockContext(alpine));
    const lists = el.querySelectorAll('ol');
    const topLists = [lists[0], lists[1], lists[2]];
    for (const list of topLists) {
      expect(list.classList.contains('flex')).toBe(true);
      expect(list.classList.contains('flex-col')).toBe(true);
      expect(list.classList.contains('overflow-visible')).toBe(true);
      expect(list.classList.contains('mask-[linear-gradient(to_bottom,black_85%,transparent)]')).toBe(true);
    }
  });

  it('bottom lists have common list classes and bottom mask', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = createOverlayEl();
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, createMockContext(alpine));
    const lists = el.querySelectorAll('ol');
    const bottomLists = [lists[3], lists[4], lists[5]];
    for (const list of bottomLists) {
      expect(list.classList.contains('flex')).toBe(true);
      expect(list.classList.contains('flex-col')).toBe(true);
      expect(list.classList.contains('overflow-visible')).toBe(true);
      expect(list.classList.contains('mask-[linear-gradient(to_top,black_85%,transparent)]')).toBe(true);
    }
  });
});

describe('h-notification-list', () => {
  it('applies base classes and attributes', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('ol');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification-list'](el, { original: 'x-h-notification-list', modifiers: [] }, ctx);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-col')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification-list');
    expect(el.getAttribute('role')).toBe('group');
  });

  it('throws if element is not ol or ul', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    expect(() => alpine._directives['h-notification-list'](el, { original: 'x-h-notification-list', modifiers: [] }, ctx)).toThrow();
  });
});

describe('h-notification', () => {
  it('applies base classes and attributes', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('li');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification'](el, { original: 'x-h-notification', modifiers: [] }, ctx);
    expect(el.classList.contains('pointer-events-auto')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification');
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('adds floating classes for floating modifier', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('li');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification'](el, { original: 'x-h-notification', modifiers: ['floating'] }, ctx);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
  });

  it('throws if element is not li', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    expect(() => alpine._directives['h-notification'](el, { original: 'x-h-notification', modifiers: [] }, ctx)).toThrow();
  });
});

describe('h-notification-title', () => {
  it('applies base classes and data-slot', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification-title'](el, { modifiers: [] }, ctx);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification-title');
  });
});

describe('h-notification-description', () => {
  it('applies base classes and data-slot', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification-description'](el, { modifiers: [] }, ctx);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification-description');
  });
});

describe('h-notification-media', () => {
  it('applies base classes and data-slot', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification-media'](el, { modifiers: [] }, ctx);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('flex-col')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification-media');
  });
});

describe('h-notification-actions', () => {
  it('applies base classes and data-slot', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('div');
    const ctx = createMockContext(alpine);
    alpine._directives['h-notification-actions'](el, { modifiers: [] }, ctx);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('notification-actions');
  });
});
