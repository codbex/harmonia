# Include

The include directive makes it easy to fetch and insert an external HTML fragment inside an element. The request is restricted to the same domain, protocol and port as the application.

::: warning

- Only use on trusted content and never on dynamic/user-provided content!<br />
- Dynamically rendering HTML from third parties can easily lead to XSS vulnerabilities.<br />
- Executing untrusted JavaScript code poses significant security risks and should be strictly avoided.

:::

::: info
The directive executes before any binding.
:::

## API Reference

### Component attribute(s)

```
x-h-include
```

### Arguments

| Attribute | Type   | Required | Description                         |
| --------- | ------ | -------- | ----------------------------------- |
| `self`    | string | true     | Relative path to the HTML fragment. |

### Attributes

| Attribute | Type    | Required | Description                                                                                                                                     |
| --------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| data-js   | boolean | false    | By default, the directive does not execute any JavaScript code.<br />If the fragment includes a script that should execute, set this to `true`. |

### Modifiers

| Modifier  | Description           |
| --------- | --------------------- |
| <s>js</s> | Replaced by `data-js` |

### Events

| Event             | Bubbles | Detail    | Description                                                                                                    |
| ----------------- | ------- | --------- | -------------------------------------------------------------------------------------------------------------- |
| `fragment:loaded` | No      | `{ url }` | Dispatched on the element after the fragment is inserted into the DOM and Alpine has initialized the new tree. |

## Examples

<ClientOnly>
<component-container>
  <div x-h-include="'/harmonia/components/include/fragment.html'"></div>
</component-container>
</ClientOnly>

```html
<div x-h-include="'/harmonia/components/include/fragment.html'"></div>
```

### Reacting after load

Because `fragment:loaded` does not bubble, attach the listener directly to the element:

```html
<div x-h-include="'/harmonia/components/include/fragment.html'" @fragment:loaded="onFragmentLoaded($event.detail.url)"></div>
```

Or in plain JavaScript:

```js
const el = document.querySelector('#my-include');
el.addEventListener('fragment:loaded', (e) => {
  console.log('Loaded:', e.detail.url);
});
```
