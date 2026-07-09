# Switch

Allows users to toggle a binary state, such as true/false or on/off. Functionally, switches serve the same purpose as checkboxes but emphasize immediate, interactive state changes.

## Usage

Use switches for settings or options that can be turned on or off instantly, especially when the change takes effect immediately. Make sure the associated label clearly indicates the action. Avoid using switches for independent yes/no choices that do not have immediate effect. [Checkboxes](/components/checkbox) are more appropriate in that case.

## API Reference

### Component attribute(s)

```
x-h-switch
```

### Attributes

| Attribute | Type               | Required | Description                  |
| --------- | ------------------ | -------- | ---------------------------- |
| data-size | `default`<br/>`sm` | false    | Sets the size of the switch. |

## Examples

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-switch>
    <input type="checkbox" id="sw" />
  </span>
  <label x-h-label for="sw">Just switch</label>
</div>
```

</LiveExample>

<LiveExample data-exclude="generator">

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-switch data-size="sm">
    <input type="checkbox" id="sws" />
  </span>
  <label x-h-label for="sws">Just switch</label>
</div>
```

</LiveExample>

### Disabled

<LiveExample>

```html
<div x-h-field data-orientation="horizontal">
  <span x-h-switch>
    <input type="checkbox" id="swd" checked disabled />
  </span>
  <label x-h-label for="swd">Disabled switch</label>
</div>
```

</LiveExample>
