# Pagination

Divides content into discrete pages, allowing users to navigate large datasets or collections more easily. Pagination improves readability and helps users focus on manageable portions of content.

## Usage

Use pagination for tables, card grids, lists, or other content-heavy interfaces where displaying all items at once would overwhelm the user. Avoid excessive page counts without additional navigation aids, such as "jump to page" or filtering options.

## API Reference

### Component attribute(s)

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

<LiveExample data-class="flex flex-col items-center">

```html
<nav x-h-pagination>
  <ul x-h-pagination-content>
    <li x-h-pagination-item>
      <a x-h-pagination-link.previous href="#">
        <svg x-h-lucide role="presentation" data-lucide="chevron-left"></svg>
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
        <svg x-h-lucide role="presentation" data-lucide="chevron-right"></svg>
      </a>
    </li>
  </ul>
</nav>
```

</LiveExample>
