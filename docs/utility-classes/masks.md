# Masks

Fade out the edges of an element with a mask, typically to hint that there is more content to scroll to.

## Class names

Each class ends with a size on the spacing scale, where one step is 0.25rem. The available sizes are `2`, `4` and `8`, giving a 0.5rem, 1rem or 2rem fade.

| Class          | Description                         |
| -------------- | ----------------------------------- |
| fade-x-`2,4,8` | Fades out the left and right edges. |
| fade-y-`2,4,8` | Fades out the top and bottom edges. |
| fade-l-`2,4,8` | Fades out the left edge.            |
| fade-r-`2,4,8` | Fades out the right edge.           |
| fade-t-`2,4,8` | Fades out the top edge.             |
| fade-b-`2,4,8` | Fades out the bottom edge.          |

## Examples

### Horizontal

<LiveExample data-class="p-0">

```html
<div class="w-full bg-primary fade-x-2 p-4 text-sm whitespace-nowrap text-primary-foreground">Fade horizontally</div>
```

</LiveExample>

### Vertical

<LiveExample data-class="p-0">

```html
<div class="w-full bg-primary fade-y-2 p-4 text-sm whitespace-nowrap text-primary-foreground">Fade vertically</div>
```

</LiveExample>

### Sizes

A larger size makes a wider, softer ramp. This example compares the three sizes on the same element.

<LiveExample data-class="p-0">

```html
<div class="vbox w-full gap-2">
  <div class="w-full bg-primary fade-x-2 p-4 text-sm whitespace-nowrap text-primary-foreground">Fade 2 (0.5rem)</div>
  <div class="w-full bg-primary fade-x-4 p-4 text-sm whitespace-nowrap text-primary-foreground">Fade 4 (1rem)</div>
  <div class="w-full bg-primary fade-x-8 p-4 text-sm whitespace-nowrap text-primary-foreground">Fade 8 (2rem)</div>
</div>
```

</LiveExample>

### Single edge

Fade a single side with `fade-t-*`, `fade-b-*`, `fade-l-*` or `fade-r-*`. This example fades only the bottom, hinting at more content below while keeping the top edge sharp.

<LiveExample data-class="p-0">

```html
<div class="w-full bg-primary fade-b-2 p-4 text-sm whitespace-nowrap text-primary-foreground">Fade bottom</div>
```

</LiveExample>
