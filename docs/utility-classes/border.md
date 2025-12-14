# Border

Add a shadow to an element.

## Class names

| Class      | Description              |
| ---------- | ------------------------ |
| box-border | `box-sizing: border-box` |
| border     | Border on all 4 sides.   |
| border-t   | Top border.              |
| border-r   | Right border.            |
| border-b   | Bottom border.           |
| border-l   | Left border.             |

## Examples

<br />

<ClientOnly>
<component-container>
<div class="grid grid-cols-3 md:grid-cols-5 gap-5">
  <div class="border text-center">Border</div>
  <div class="border-l text-center">Left border</div>
  <div class="border-t text-center">Top border</div>
  <div class="border-b text-center">Bottom border</div>
  <div class="border-r text-center">Right border</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="grid grid-cols-3 gap-5 md:grid-cols-5">
  <div class="border text-center">Border</div>
  <div class="border-l text-center">Left border</div>
  <div class="border-t text-center">Top border</div>
  <div class="border-b text-center">Bottom border</div>
  <div class="border-r text-center">Right border</div>
</div>
```
