# Theme

Utility functions for retrieving and updating the color scheme.

## API Reference

### Functions

| Property       | Arguments                       | Returns                         | Description                    |
| -------------- | ------------------------------- | ------------------------------- | ------------------------------ |
| getColorScheme | none                            | `light`<br />`dark`<br />`auto` | Gets the current color scheme. |
| setColorScheme | `light`<br />`dark`<br />`auto` | none                            | Sets the color scheme.         |

::: info Seting the color scheme
The `setColorScheme` function automatically persists the most recently selected color scheme in the browser’s local storage, eliminating the need to manually retrieve or reapply the setting on each page load.
:::

## Examples

### In plain JS

```js
const isDark = Harmonia.getColorScheme() === 'dark';
if (isDark) {
  Harmonia.setColorScheme('light');
}
```

### In a module

```js
import { getColorScheme, setColorScheme } from '@codbex/harmonia';

const isDark = getColorScheme() === 'dark';
if (isDark) {
  setColorScheme('light');
}
```
