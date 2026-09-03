// Checked per call, not at import time, so this module is safe to import in
// server bundles and in browsers without the Notification API.
const isNativeNotificationSupported = () => typeof window !== 'undefined' && typeof window.Notification !== 'undefined';

const getNativeNotificationPermission = () => {
  if (!isNativeNotificationSupported()) return 'unsupported';
  return window.Notification.permission;
};

const requestNativeNotificationPermission = () => {
  if (!isNativeNotificationSupported()) return Promise.resolve('unsupported');
  return window.Notification.requestPermission();
};

let warned = false;

const showNativeNotification = (title, options) => {
  if (!title) {
    throw new Error('Native notification must have a title');
  }
  if (!isNativeNotificationSupported() || window.Notification.permission !== 'granted') return null;
  try {
    return new window.Notification(title, options);
  } catch {
    // Some platforms (e.g. Chrome on Android) only allow notifications from a
    // service worker, so the constructor itself throws there.
    if (!warned) {
      warned = true;
      console.warn('Native notifications cannot be constructed on this platform');
    }
    return null;
  }
};

export { getNativeNotificationPermission, isNativeNotificationSupported, requestNativeNotificationPermission, showNativeNotification };
