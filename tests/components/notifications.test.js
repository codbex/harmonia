import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { playNotificationSound } from '../../src/common/notification-sound.js';
import notificationsPlugin from '../../src/components/notifications.js';
import { createMockAlpine, createMockContext } from '../test-utils.js';

vi.mock('../../src/common/notification-sound.js', () => ({ playNotificationSound: vi.fn() }));

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
    // The message used to say "must be a button", which is not what is checked.
    expect(() => alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, ctx)).toThrow(/must be a section element/);
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

describe('$notifications magic', () => {
  function getMagic() {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const magic = alpine.magic.mock.calls[0][1]();
    return { alpine, magic, store: alpine.store('_h_notifications') };
  }

  it('add forwards the sound option to the store', () => {
    const { magic, store } = getMagic();
    magic.add({ template: 'tmpl1', timeout: 0, sound: '/audio/ping.mp3' });
    expect(store.items[0].sound).toBe('/audio/ping.mp3');
  });

  it('exposes the native notification helpers', () => {
    const { magic } = getMagic();
    expect(typeof magic.native.isSupported).toBe('function');
    expect(typeof magic.native.getPermission).toBe('function');
    expect(typeof magic.native.requestPermission).toBe('function');
    expect(typeof magic.native.show).toBe('function');
  });
});

describe('h-notification-overlay sound', () => {
  function setupOverlayWithTemplate(attrs = {}) {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('section');
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    const tpl = document.createElement('template');
    tpl.setAttribute('id', 'basic');
    tpl.content.appendChild(document.createElement('li'));
    el.appendChild(tpl);
    document.body.appendChild(el);
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, createMockContext(alpine));
    return { alpine, el, store: alpine.store('_h_notifications') };
  }

  beforeEach(() => {
    playNotificationSound.mockClear();
  });

  it('stores the sound option on the pushed item', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    store.push('id1', 'tmpl1', 'top-right', 0, {}, true);
    expect(store.items[0].sound).toBe(true);
  });

  it('plays the chime for sound: true', () => {
    const { store } = setupOverlayWithTemplate();
    store.push('id1', 'basic', 'top-right', 0, {}, true);
    expect(playNotificationSound).toHaveBeenCalledWith(true);
  });

  it('per-notification URL wins over the overlay default', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': 'true' });
    store.push('id1', 'basic', 'top-right', 0, {}, '/audio/ping.mp3');
    expect(playNotificationSound).toHaveBeenCalledWith('/audio/ping.mp3');
  });

  it('sound: false silences a notification despite the overlay default', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': 'true' });
    store.push('id1', 'basic', 'top-right', 0, {}, false);
    expect(playNotificationSound).not.toHaveBeenCalled();
  });

  it('stays silent without a sound option or overlay default', () => {
    const { store } = setupOverlayWithTemplate();
    store.push('id1', 'basic', 'top-right', 0, {});
    expect(playNotificationSound).not.toHaveBeenCalled();
  });

  it('a bare data-sound attribute plays the chime by default', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': '' });
    store.push('id1', 'basic', 'top-right', 0, {});
    expect(playNotificationSound).toHaveBeenCalledWith(true);
  });

  it('data-sound="true" plays the chime by default', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': 'true' });
    store.push('id1', 'basic', 'top-right', 0, {});
    expect(playNotificationSound).toHaveBeenCalledWith(true);
  });

  it('a data-sound URL plays that file by default', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': '/audio/ping.mp3' });
    store.push('id1', 'basic', 'top-right', 0, {});
    expect(playNotificationSound).toHaveBeenCalledWith('/audio/ping.mp3');
  });

  it('data-sound="false" turns the default sound off', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': 'false' });
    store.push('id1', 'basic', 'top-right', 0, {});
    expect(playNotificationSound).not.toHaveBeenCalled();
  });

  it('per-notification sound still plays despite data-sound="false"', () => {
    const { store } = setupOverlayWithTemplate({ 'data-sound': 'false' });
    store.push('id1', 'basic', 'top-right', 0, {}, true);
    expect(playNotificationSound).toHaveBeenCalledWith(true);
  });

  it('does not play sound for items replayed on overlay mount', () => {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const store = alpine.store('_h_notifications');
    store.push('id1', 'basic', 'top-right', 0, {}, true);
    const el = document.createElement('section');
    el.setAttribute('data-sound', 'true');
    const tpl = document.createElement('template');
    tpl.setAttribute('id', 'basic');
    tpl.content.appendChild(document.createElement('li'));
    el.appendChild(tpl);
    document.body.appendChild(el);
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, createMockContext(alpine));
    expect(el.querySelector('li[id="id1"]')).not.toBeNull();
    expect(playNotificationSound).not.toHaveBeenCalled();
  });
});

describe('h-notification-overlay toast removal', () => {
  function setupRemoval() {
    const alpine = makeAlpineWithStore();
    notificationsPlugin(alpine);
    const el = document.createElement('section');
    document.body.appendChild(el);
    alpine._directives['h-notification-overlay'](el, { original: 'x-h-notification-overlay', modifiers: [] }, createMockContext(alpine));
    const store = alpine.store('_h_notifications');
    const listener = store.listeners[store.listeners.length - 1];
    const toast = document.createElement('li');
    toast.id = 'toast-1';
    toast._h_animation_class = 'translate-x-full';
    el.querySelector('ol').appendChild(toast);
    return { alpine, listener, toast };
  }

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fades the toast out click-transparent and removes it on transitionend', () => {
    const { alpine, listener, toast } = setupRemoval();
    listener.removed('toast-1');
    expect(toast.classList.contains('opacity-0')).toBe(true);
    expect(toast.classList.contains('pointer-events-none')).toBe(true);
    expect(toast.isConnected).toBe(true);
    toast.dispatchEvent(new Event('transitionend'));
    expect(toast.isConnected).toBe(false);
    expect(alpine.destroyTree).toHaveBeenCalledWith(toast);
  });

  it('removes the toast via the fallback timer when transitionend never fires', () => {
    vi.useFakeTimers();
    const { alpine, listener, toast } = setupRemoval();
    listener.removed('toast-1');
    vi.advanceTimersByTime(250);
    expect(toast.isConnected).toBe(false);
    expect(alpine.destroyTree).toHaveBeenCalledTimes(1);
    // The timer and the event are idempotent between each other.
    toast.dispatchEvent(new Event('transitionend'));
    expect(alpine.destroyTree).toHaveBeenCalledTimes(1);
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
