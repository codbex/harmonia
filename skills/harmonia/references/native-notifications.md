# Native Notifications

Utility functions for showing operating system notifications through the browser's Notification API.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use these functions to notify the user outside the page, for example when a long-running task finishes while they are on another tab or in another application. First check availability with `isNativeNotificationSupported`, then ask for permission with `requestNativeNotificationPermission`, and show notifications with `showNativeNotification` once the permission is `granted`.

These helpers are fully independent from the Notifications component, so you decide when a message should appear inside the page and when it should go to the operating system. They are also available inside Alpine markup through the `$notifications.native` magic object.

`showNativeNotification` returns the created `Notification` instance, so you can attach an `onclick` handler or call `close()` on it. When the API is unavailable or permission has not been granted, it returns `null` and shows nothing.

> **Note:** User gesture
> Call `requestNativeNotificationPermission` from a user gesture such as a button click. Most browsers ignore permission requests that are not triggered by one.

> **Note:** Permission persistence
> The browser remembers the user's decision, so the permission prompt only appears while the permission is in its `default` state. Once denied, notifications can only be re-enabled from the browser's site settings.

## API

### Functions

| Property                            | Arguments          | Returns                                                   | Description                                                                                                                                                                                                                                                                                                               |
| ----------------------------------- | ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isNativeNotificationSupported       | none               | boolean                                                   | Whether the browser supports the Notification API.                                                                                                                                                                                                                                                                        |
| getNativeNotificationPermission     | none               | `granted`<br />`denied`<br />`default`<br />`unsupported` | The current notification permission. `unsupported` is returned when the browser has no Notification API.                                                                                                                                                                                                                  |
| requestNativeNotificationPermission | none               | `Promise` resolving to the permission                     | Asks the user for permission to show notifications. Resolves to `unsupported` when the browser has no Notification API.                                                                                                                                                                                                   |
| showNativeNotification              | title<br />options | `Notification` or `null`                                  | Shows a native notification. `options` is the standard [Notification options object](https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification#options) (`body`, `icon`, `image`, `badge`, `tag`, `silent` and more), passed to the browser unchanged. Returns `null` when unsupported or not permitted. |

> **Note:** Images
> `icon` shows a small image next to the notification text, `image` shows a large picture in the notification body and `badge` provides a monochrome icon for places like the Android status bar. Support for `image` varies by platform. Chromium-based browsers show it, while others ignore it gracefully. Use raster formats such as PNG or JPEG, as some platforms do not render SVG icons.

## Examples

### In plain JS

```js
async function notifyExportFinished() {
  if (!Harmonia.isNativeNotificationSupported()) return;
  if (Harmonia.getNativeNotificationPermission() === 'default') {
    await Harmonia.requestNativeNotificationPermission();
  }
  const notification = Harmonia.showNativeNotification('Export finished', {
    body: 'Your report is ready to download.',
    icon: '/images/logo.jpg',
    image: '/images/report-preview.jpg',
  });
  if (notification) {
    notification.onclick = () => window.focus();
  }
}
```

### In a module

```js
import { getNativeNotificationPermission, isNativeNotificationSupported, requestNativeNotificationPermission, showNativeNotification } from '@codbex/harmonia';

async function notifyExportFinished() {
  if (!isNativeNotificationSupported()) return;
  if (getNativeNotificationPermission() === 'default') {
    await requestNativeNotificationPermission();
  }
  const notification = showNativeNotification('Export finished', {
    body: 'Your report is ready to download.',
    icon: '/images/logo.jpg',
    image: '/images/report-preview.jpg',
  });
  if (notification) {
    notification.onclick = () => window.focus();
  }
}
```

Full docs: https://www.codbex.com/harmonia/utilities/native-notifications.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
