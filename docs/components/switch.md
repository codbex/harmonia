# Switch

The switch lets the user set a binary value such as “true/false”. Functionally, it's the same as the checkbox component.

## API Reference

### Component attubute(s)

```
x-h-switch
```

### Attributes

| Attribute | Type               | Required | Description                  |
| --------- | ------------------ | -------- | ---------------------------- |
| data-size | `default`<br/>`sm` | false    | Sets the size of the switch. |

## Examples

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex items-center gap-3 justify-center">
<span x-h-switch>
  <input type="checkbox" id="sw" />
</span>
<label x-h-label for="sw">Just switch</label>
</component-container>
</ClientOnly>

```html
<div class="flex items-center gap-3">
  <span x-h-switch>
    <input type="checkbox" id="sw" />
  </span>
  <label x-h-label for="sw">Just switch</label>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex items-center gap-3 justify-center">
<span x-h-switch data-size="sm">
  <input type="checkbox" id="sws" />
</span>
<label x-h-label for="sws">Just switch</label>
</component-container>
</ClientOnly>

```html
<div class="flex items-center gap-3">
  <span x-h-switch data-size="sm">
    <input type="checkbox" id="sws" />
  </span>
  <label x-h-label for="sws">Just switch</label>
</div>
```
