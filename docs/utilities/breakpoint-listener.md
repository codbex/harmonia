# Breakpoint Listener

The `getBreakpointListener` function creates a breakpoint listener using media queries.

## API Reference

### Arguments

| Attribute  | Type     | Required | Description                                                                                                                 |
| ---------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| handler    | function | true     | Handler function that will be called when the breakpoint threshold has been met\*. Called immediately after initialization. |
| breakpoint | integer  | false    | The desired breakpoint in pixels. By default, it's 768px.                                                                   |

::: info Threshold event
The handler function is invoked only when the window width crosses the specified breakpoint—either becoming narrower or wider—rather than on every resize event. A boolean value is passed as the first argument, indicating the direction of the change.
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
