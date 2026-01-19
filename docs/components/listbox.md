# Listbox

The listbox component is a single-select listbox with grouped options. It is functionally similar to an HTML select element.

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
