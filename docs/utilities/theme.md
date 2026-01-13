# Theme

Utility functions for retrieving and updating the color scheme.

## API Reference

### Functions

| Property                  | Arguments                       | Returns                         | Description                                                       |
| ------------------------- | ------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| getColorScheme            | none                            | `light`<br />`dark`<br />`auto` | Retrieves the currently active color scheme.                      |
| setColorScheme            | `light`<br />`dark`<br />`auto` | none                            | Updates the application’s color scheme to the specified value.    |
| addColorSchemeListener    | callbackFunction                | none                            | Registers a callback to be invoked when the color scheme changes. |
| removeColorSchemeListener | callbackFunction                | none                            | Unregisters a previously registered callback.                     |

::: info Seting the color scheme
The `setColorScheme` function automatically persists the most recently selected color scheme to the browser’s local storage, ensuring the preference is retained and reapplied across page loads without requiring additional work.
:::

### callbackFunction

| Arguments | Description                                                   |
| --------- | ------------------------------------------------------------- |
| scheme    | The current color scheme. It can be either `light` or `dark`. |

## Examples

### In plain JS

```js
const listener = (scheme) => {
  if (scheme === 'light') {
    console.log('Switched to a light theme!');
  } else {
    console.log('Switched to a dark theme!');
  }
};
Harmonia.addColorSchemeListener(listener);

const isDark = Harmonia.getColorScheme() === 'dark';
if (isDark) {
  Harmonia.setColorScheme('light');
}

Harmonia.removeColorSchemeListener(listener);
```

### In a module

```js
import { addColorSchemeListener, getColorScheme, removeColorSchemeListener, setColorScheme } from '@codbex/harmonia';

const listener = (scheme) => {
  if (scheme === 'light') {
    console.log('Switched to a light theme!');
  } else {
    console.log('Switched to a dark theme!');
  }
};

Harmonia.addColorSchemeListener(listener);

const isDark = getColorScheme() === 'dark';
if (isDark) {
  setColorScheme('light');
}

Harmonia.removeColorSchemeListener(listener);
```
