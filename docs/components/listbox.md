# Listbox

The listbox component is a single-select listbox with grouped options. It is functionally similar to an HTML select element.

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
