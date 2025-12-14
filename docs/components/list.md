# List

The list component is a container displaying a list of items.

## API Reference

### Component attubute(s)

```
x-h-list
x-h-list-item
x-h-list-header
```

### Modifiers

#### x-h-list-item

| Modifier    | Description                                     |
| ----------- | ----------------------------------------------- |
| interactive | Makes the list item interactive and selectable. |

## Examples

<ClientOnly>
<component-container>
<ul x-h-list>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
</component-container>
</ClientOnly>

```html
<ul x-h-list>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
```

### Interactive

<br />

<ClientOnly>
<component-container>
<ul x-h-list>
  <li x-h-list-item.interactive>List Item 1</li>
  <li x-h-list-item.interactive>List Item 2</li>
  <li x-h-list-item.interactive aria-selected="true">List Item 3</li>
</ul>
</component-container>
</ClientOnly>

```html
<ul x-h-list>
  <li x-h-list-item.interactive>List Item 1</li>
  <li x-h-list-item.interactive>List Item 2</li>
  <li x-h-list-item.interactive aria-selected="true">List Item 3</li>
</ul>
```

### With header

<br />

<ClientOnly>
<component-container>
<ul x-h-list>
<li x-h-list-header>Group 1</li>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
</component-container>
</ClientOnly>

```html
<ul x-h-list>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
```

### With icons and buttons

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<ul x-h-list>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 1
    <div class="flex-1"></div>
    <button x-h-button data-variant="outline" data-size="icon-xs" aria-label="Icon button">
      <i role="img" data-lucide="save"></i>
    </button>
  </li>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 2
  </li>
  <li x-h-list-item aria-selected="true">
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 3
  </li>
</ul>
</component-container>
</ClientOnly>

```html
<ul x-h-list>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 1
    <div class="flex-1"></div>
    <button x-h-button data-variant="outline" data-size="icon-xs" aria-label="Icon button">
      <i role="img" data-lucide="save"></i>
    </button>
  </li>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 2
  </li>
  <li x-h-list-item aria-selected="true">
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 3
  </li>
</ul>
```
