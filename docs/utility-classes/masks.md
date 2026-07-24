# Masks

Fade out the edges of an element with a mask, typically to hint that there is more content to scroll to.

## Class names

| Class  | Description                         |
| ------ | ----------------------------------- |
| fade-x | Fades out the left and right edges. |
| fade-y | Fades out the top and bottom edges. |
| fade-l | Fades out the left edge.            |
| fade-r | Fades out the right edge.           |
| fade-t | Fades out the top edge.             |
| fade-b | Fades out the bottom edge.          |

## Examples

### Horizontal

<LiveExample data-class="p-0">

```html
<div class="fade-x w-full bg-primary p-4 text-sm whitespace-nowrap text-primary-foreground">Fade horizontally</div>
```

</LiveExample>

### Vertical

<LiveExample data-class="p-0">

```html
<div class="fade-y w-full bg-primary p-4 text-sm whitespace-nowrap text-primary-foreground">Fade vertically</div>
```

</LiveExample>

### Single edge

Fade a single side with `fade-t`, `fade-b`, `fade-l` or `fade-r`. This example fades only the bottom, hinting at more content below while keeping the top edge sharp.

<LiveExample data-class="p-0">

```html
<div class="fade-b w-full bg-primary p-4 text-sm whitespace-nowrap text-primary-foreground">Fade bottom</div>
```

</LiveExample>
