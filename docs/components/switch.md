# Switch

Allows users to toggle a binary state, such as true/false or on/off. Functionally, switches serve the same purpose as checkboxes but emphasize immediate, interactive state changes.

## Usage

Use switches for settings or options that can be turned on or off instantly, especially when the change takes effect immediately. Make sure the associated label clearly indicates the action. Avoid using switches for independent yes/no choices that do not have immediate effect. [Checkboxes](/components/checkbox) are more appropriate in that case.

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
