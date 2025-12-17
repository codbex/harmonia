# Breakpoint Listener

The `getBreakpointListener` function creates a breakpoint listener using media queries.

## API Reference

### Arguments

| Attribute  | Type     | Required | Description                                                                                                                 |
| ---------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| handler    | function | true     | Handler function that will be called when the breakpoint threshold has been met\*. Called immediately after initialization. |
| breakpoint | integer  | false    | The desired breakpoint in pixels. By default, it's 768px.                                                                   |

::: info Threshold event
The handler function is called only when the window width becomes either narrower or wider then the specified breakpoint, not on every resize event. A boolean is passed as the first argument to the handler, so you can use it to determine if the window has become narrower or wider.
:::

### Returns

#### Object

| Property | Type     | Description                                                                |
| -------- | -------- | -------------------------------------------------------------------------- |
| remove   | function | Use this function to remove the event listener when it's no longer needed. |

## Examples

### In plain JS

```js
const breakpointListener = Harmonia.getBreakpointListener((matches) => {
  if (matches) {
    console.log('Window is either equal or smaller then the breakpoint');
  } else {
    console.log('Window is bigger then the breakpoint');
  }
}, 1184);

// When no longer needed
breakpointListener.remove();
```

### In a module

```js
import { getBreakpointListener } from '@codbex/harmonia';

const breakpointListener = getBreakpointListener((matches) => {
  if (matches) {
    console.log('Window is either equal or smaller then the breakpoint');
  } else {
    console.log('Window is bigger then the breakpoint');
  }
}, 1184);

// When no longer needed
breakpointListener.remove();
```
