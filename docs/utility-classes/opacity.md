# Display

Utilities for controlling the opacity of an element.

## Class names

| Class            | Description                         |
| ---------------- | ----------------------------------- |
| opacity-0        | `opacity: 0%;`                      |
| opacity-25       | `opacity: 25%;`                     |
| opacity-50       | `opacity: 50%;`                     |
| opacity-75       | `opacity: 75%;`                     |
| opacity-100      | `opacity: 100%;`                    |
| opacity-disabled | `opacity: var(--opacity-disabled);` |

`opacity-100` is also available with the `group-hover:` and `group-focus-within:` variants (`group-hover:opacity-100`, `group-focus-within:opacity-100`). Combine them with a hidden element inside a `group` container to reveal it when the container is hovered or receives focus.

## Examples

### Primary

<LiveExample data-class="hbox gap-2">

```html
<div class="tile-sm bg-primary p-4 text-primary-foreground opacity-0">0%</div>
<div class="tile-sm bg-primary p-4 text-primary-foreground opacity-25">25%</div>
<div class="tile-sm bg-primary p-4 text-primary-foreground opacity-50">50%</div>
<div class="tile-sm bg-primary p-4 text-primary-foreground opacity-75">75%</div>
<div class="tile-sm bg-primary p-4 text-primary-foreground opacity-100">100%</div>
```

</LiveExample>
