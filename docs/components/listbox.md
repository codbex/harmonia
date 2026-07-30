# Listbox

A single-selection list component with support for grouped options, functionally similar to an HTML `<select>` element. Listboxes allow users to choose one item from a structured set of choices.

## Usage

Use listboxes when users need to select a single option from a clearly defined set of choices. Options should be grouped logically if applicable, and provide descriptive labels to support accessibility. For a non-interactive, display-only collection, use the [List](/components/list) component instead.

The listbox is a single stop in the page's tab order. `Tab` moves into it and then straight past it, while the arrow keys move between the options inside.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the listbox:

- `Up` / `Down` - Moves focus to the previous or next option, crossing group boundaries and stopping at the ends.
- `Home` / `PageUp` - Moves focus to the first option.
- `End` / `PageDown` - Moves focus to the last option.
- `Enter` / `Space` - Selects the focused option.
- `Character keys (A-Z)` - Moves focus to the next option whose label starts with the typed character. Typing the same character again moves to the following match.

Disabled options stay reachable. The arrow keys, `Home`, `End` and typeahead all land on them and screen readers announce them as unavailable, but `Enter` does not select them.

## API Reference

### Component attribute(s)

```
x-h-listbox
```

### Attributes

#### x-h-list-item

| Attribute     | Type    | Required | Description                                                                                                                  |
| ------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| aria-disabled | boolean | false    | Marks the option unavailable while keeping it focusable and announced. It can be reached with the keyboard but not selected. |
| aria-selected | boolean | false    | Marks the option as selected. The selected option is the one that receives focus first.                                      |

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

<LiveExample>

```html
<div x-h-listbox>
  <ul x-h-list>
    <li x-h-list-header>Group 1</li>
    <li x-h-list-item>List Item 1</li>
    <li x-h-list-item>List Item 2</li>
    <li x-h-list-item>List Item 3</li>
  </ul>
  <ul x-h-list>
    <li x-h-list-header>Group 2</li>
    <li x-h-list-item>List Item 1</li>
    <li x-h-list-item>List Item 2</li>
    <li x-h-list-item>List Item 3</li>
  </ul>
</div>
```

</LiveExample>

### Disabled options

A disabled option is dimmed and cannot be selected, but the keyboard still moves through it so screen reader users know it is there. A mouse click passes over it.

<LiveExample>

```html
<div x-h-listbox>
  <ul x-h-list>
    <li x-h-list-item>Standard delivery</li>
    <li x-h-list-item aria-disabled="true">Express delivery</li>
    <li x-h-list-item aria-selected="true">Collect in store</li>
  </ul>
</div>
```

</LiveExample>
