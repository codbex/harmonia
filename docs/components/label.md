# Label

Provides an accessible caption for a user interface element, most commonly paired with input controls. Labels clarify the purpose of the associated element and improve usability and accessibility.

## Usage

Use labels to clearly describe form fields, controls, or interactive elements. Each label should be concise, descriptive, and associated with its corresponding element to support screen readers and assistive technologies. Avoid using visual cues alone to indicate the purpose of a control.

## API Reference

### Component attribute(s)

```
x-h-label
```

## Examples

<ClientOnly>
<component-container>
<div x-h-field>
  <label x-h-label for="labelExmpl">Name</label>
  <input x-h-input id="labelExmpl" name="name" placeholder="Ivan Strashimechkarov" />
</div>
</component-container>
</ClientOnly>

```html
<div x-h-field>
  <label x-h-label for="labelExmpl">Name</label>
  <input x-h-input id="labelExmpl" name="name" placeholder="Ivan Strashimechkarov" />
</div>
```
