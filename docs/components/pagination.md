# Pagination

Pagination allows users to separate their content into discrete pages, making it easier to digest and navigate through. Pagination is commonly used for tables, card grids and tiles.

## API Reference

### Component attubute(s)

```
x-h-pagination
x-h-pagination-content
x-h-pagination-item
x-h-pagination-link
x-h-pagination-link-label
x-h-pagination-ellipsis
```

### Attributes

#### x-h-pagination-link

| Attribute | Type    | Required | Description                                            |
| --------- | ------- | -------- | ------------------------------------------------------ |
| `self`    | boolean | false    | Set to true when the link is the currently active one. |

### Modifiers

#### x-h-pagination-link

| Modifier | Description                                                                  |
| -------- | ---------------------------------------------------------------------------- |
| previous | Used when the link will lead to the previous page instead of a specific one. |
| next     | Used when the link will lead to the next page instead of a specific one.     |

## Examples

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center">
<nav x-h-pagination>
  <ul x-h-pagination-content>
    <li x-h-pagination-item>
      <a x-h-pagination-link.previous href="#">
        <i role="img" data-lucide="chevron-left"></i>
        <span x-h-pagination-link-label>Previous</span>
      </a>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link="false" href="#">1</a>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link="true" href="#">2</a>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link="false" href="#">3</a>
    </li>
    <li x-h-pagination-item>
      <span x-h-pagination-ellipsis></span>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link.next href="#">
        <span x-h-pagination-link-label>Next</span>
        <i role="img" data-lucide="chevron-right"></i>
      </a>
    </li>
  </ul>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-pagination>
  <ul x-h-pagination-content>
    <li x-h-pagination-item>
      <a x-h-pagination-link.previous href="#">
        <i role="img" data-lucide="chevron-left"></i>
        <span x-h-pagination-link-label>Previous</span>
      </a>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link="false" href="#">1</a>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link="true" href="#">2</a>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link="false" href="#">3</a>
    </li>
    <li x-h-pagination-item>
      <span x-h-pagination-ellipsis></span>
    </li>
    <li x-h-pagination-item>
      <a x-h-pagination-link.next href="#">
        <span x-h-pagination-link-label>Next</span>
        <i role="img" data-lucide="chevron-right"></i>
      </a>
    </li>
  </ul>
</nav>
```
