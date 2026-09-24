# Label

Provides an accessible caption for a user interface element, most commonly paired with input controls. Labels clarify the purpose of the associated element and improve usability and accessibility.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use labels to clearly describe form fields, controls, or interactive elements. Each label should be concise, descriptive, and associated with its corresponding element to support screen readers and assistive technologies. Avoid using visual cues alone to indicate the purpose of a control.

## Directive

- `x-h-label`

## API

### Attributes

| Attribute      | Values            | Required | Description                                                                                                                                                                    |
| -------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| data-indicator | `start`<br/>`end` | false    | Shows a red asterisk before (`start`) or after (`end`) the label text. Inside an `x-h-field` it appears only while the field contains a control with the `required` attribute. |

## Examples

```html
<div x-h-field>
  <label x-h-label for="labelExmpl">Name</label>
  <input x-h-input id="labelExmpl" name="name" placeholder="Ivan Strashimechkarov" />
</div>
```

### Required indicator

Set `data-indicator` to mark a required field with a red asterisk. Inside an `x-h-field`, the asterisk appears only while the field contains a control with the `required` attribute. Outside a field the asterisk always shows while the attribute is set.

```html
<div x-h-field-group>
  <div x-h-field>
    <label x-h-label for="indicatorName" data-indicator="end">Name</label>
    <input x-h-input id="indicatorName" name="name" placeholder="Ivan Strashimechkarov" required />
  </div>
  <div x-h-field>
    <label x-h-label for="indicatorEmail" data-indicator="start">Email</label>
    <input x-h-input id="indicatorEmail" type="email" name="email" placeholder="ivan@example.com" required />
  </div>
  <div x-h-field>
    <label x-h-label for="indicatorNickname" data-indicator="end">Nickname</label>
    <input x-h-input id="indicatorNickname" name="nickname" placeholder="Vanko" />
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/label.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
