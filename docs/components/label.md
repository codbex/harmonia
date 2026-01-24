# Label

Provides an accessible caption for a user interface element, most commonly paired with input controls. Labels clarify the purpose of the associated element and improve usability and accessibility.

## Usage

Use labels to clearly describe form fields, controls, or interactive elements. Each label should be concise, descriptive, and associated with its corresponding element to support screen readers and assistive technologies. Avoid using visual cues alone to indicate the purpose of a control.

## API Reference

### Component attubute(s)

```
x-h-label
```

### Modifiers

| Modifier | Description                                  |
| -------- | -------------------------------------------- |
| field    | Apply when the label is inside a form field. |

## Examples

<ClientOnly>
<component-container data-class="flex flex-col gap-1">
<label x-h-label for="labelExmpl-1">Name</label>
<input x-h-input id="labelExmpl-1" placeholder="Ivan Strashimechkarov" />
</component-container>
</ClientOnly>

<!-- prettier-ignore -->
```html
<label x-h-label for="labelExmpl-1">Name</label>
<input x-h-input id="labelExmpl-1" placeholder="Ivan Strashimechkarov" />
```

<ClientOnly>
<component-container>
<div x-h-field>
  <label x-h-label.field for="labelExmpl-2">Name</label>
  <input x-h-input id="labelExmpl-2" name="name" placeholder="Ivan Strashimechkarov" />
</div>
</component-container>
</ClientOnly>

```html
<div x-h-field>
  <label x-h-label.field for="labelExmpl-2">Name</label>
  <input x-h-input id="labelExmpl-2" name="name" placeholder="Ivan Strashimechkarov" />
</div>
```
