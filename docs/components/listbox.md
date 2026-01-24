# Listbox

A single-selection list component with support for grouped options, functionally similar to an HTML `<select>` element. Listboxes allow users to choose one item from a structured set of choices.

## Usage

Use listboxes when users need to select a single option from a clearly defined set of choices. Options should be grouped logically if applicable, and provide descriptive labels to support accessibility.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the list:

- `Up` / `Down` — Moves focus to the previous or next visible item in the tree.
- `Home` — Moves focus to the first item in the listbox.
- `End` — Moves focus to the last item in the listbox.
- `Enter` / `Space` — Selects the focused item.

## Related components

[List](/components/list)

## API Reference

### Component attubute(s)

```
x-h-listbox
```

## Examples

<ClientOnly>
<component-container>
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
</component-container>
</ClientOnly>

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
