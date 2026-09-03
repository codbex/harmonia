import { afterEach, describe, expect, it, vi } from 'vitest';
import { getNativeNotificationPermission, isNativeNotificationSupported, requestNativeNotificationPermission, showNativeNotification } from '../../src/utils/native-notifications.js';

function stubNotification({ permission = 'granted', requestPermission = vi.fn().mockResolvedValue('granted'), throwOnConstruct = false } = {}) {
  class NotificationStub {
    static permission = permission;
    static requestPermission = requestPermission;
    constructor(title, options) {
      if (throwOnConstruct) throw new Error('Illegal constructor');
      this.title = title;
      this.options = options;
    }
  }
  window.Notification = NotificationStub;
  return NotificationStub;
}

afterEach(() => {
  delete window.Notification;
  vi.restoreAllMocks();
});

describe('isNativeNotificationSupported', () => {
  it('returns false when the Notification API is missing', () => {
    expect(isNativeNotificationSupported()).toBe(false);
  });

  it('returns true when the Notification API is available', () => {
    stubNotification();
    expect(isNativeNotificationSupported()).toBe(true);
  });
});

describe('getNativeNotificationPermission', () => {
  it('returns "unsupported" when the Notification API is missing', () => {
    expect(getNativeNotificationPermission()).toBe('unsupported');
  });

  it.each(['default', 'granted', 'denied'])('passes through the "%s" permission', (permission) => {
    stubNotification({ permission });
    expect(getNativeNotificationPermission()).toBe(permission);
  });
});

describe('requestNativeNotificationPermission', () => {
  it('resolves "unsupported" when the Notification API is missing', async () => {
    await expect(requestNativeNotificationPermission()).resolves.toBe('unsupported');
  });

  it('resolves the permission returned by the browser', async () => {
    const requestPermission = vi.fn().mockResolvedValue('denied');
    stubNotification({ requestPermission });
    await expect(requestNativeNotificationPermission()).resolves.toBe('denied');
    expect(requestPermission).toHaveBeenCalledTimes(1);
  });
});

describe('showNativeNotification', () => {
  it('throws when no title is provided', () => {
    expect(() => showNativeNotification()).toThrow(/must have a title/);
  });

  it('throws for a missing title even when the API is unsupported', () => {
    expect(() => showNativeNotification('')).toThrow(/must have a title/);
  });

  it('returns null when the Notification API is missing', () => {
    expect(showNativeNotification('Hello')).toBeNull();
  });

  it.each(['default', 'denied'])('returns null without constructing when permission is "%s"', (permission) => {
    stubNotification({ permission });
    expect(showNativeNotification('Hello')).toBeNull();
  });

  it('constructs and returns the notification when permission is granted', () => {
    const NotificationStub = stubNotification();
    const options = { body: 'Body text', icon: '/icon.jpg', image: '/image.jpg', badge: '/badge.png' };
    const result = showNativeNotification('Hello', options);
    expect(result).toBeInstanceOf(NotificationStub);
    expect(result.title).toBe('Hello');
    expect(result.options).toEqual(options);
  });

  it('returns null and warns once when the constructor throws', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    stubNotification({ throwOnConstruct: true });
    expect(showNativeNotification('Hello')).toBeNull();
    expect(showNativeNotification('Hello again')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
