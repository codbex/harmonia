# Listbox

A single-selection list component with support for grouped options, functionally similar to an HTML `<select>` element. Listboxes allow users to choose one item from a structured set of choices.

## Usage

Use listboxes when users need to select a single option from a clearly defined set of choices. Options should be grouped logically if applicable, and provide descriptive labels to support accessibility. For a non-interactive, display-only collection, use the [List](/components/list) component instead.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the list:

- `Up` / `Down` - Moves focus to the previous or next visible item in the tree.
- `Home` - Moves focus to the first item in the listbox.
- `End` - Moves focus to the last item in the listbox.
- `Enter` / `Space` - Selects the focused item.

## API Reference

### Component attribute(s)

```
x-h-listbox
```

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
