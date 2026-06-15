# Tile

## Class names

The width class names start with `tile`. They can be used for creating tile-like elements for dashboards.

| Class          | Description                               |
| -------------- | ----------------------------------------- |
| tile-sm        | Small size container.                     |
| tile-md        | Medium size container.                    |
| tile-lg        | Large size container.                     |
| tile-xl        | Extra large size container.               |
| tile-double-sm | Small size, double width container.       |
| tile-double-md | Medium size, double width container.      |
| tile-double-lg | Large size, double width container.       |
| tile-double-xl | Extra large, double width size container. |
| tile-auto-sm   | Small size, auto width container.         |
| tile-auto-md   | Medium size, auto width container.        |
| tile-auto-lg   | Large size, auto width container.         |
| tile-auto-xl   | Extra large, auto width size container.   |

## Examples

<ClientOnly>
<component-container data-class="flex flex-col gap-3">
<div class="bg-primary text-primary-foreground tile-sm">Small</div>
<div class="bg-primary text-primary-foreground tile-md">Medium</div>
<div class="bg-primary text-primary-foreground tile-lg">Large</div>
<div class="bg-primary text-primary-foreground tile-xl">Extra Large</div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm bg-primary text-primary-foreground">Small</div>
<div class="tile-md bg-primary text-primary-foreground">Medium</div>
<div class="tile-lg bg-primary text-primary-foreground">Large</div>
<div class="tile-xl bg-primary text-primary-foreground">Extra Large</div>
```

### Double width

<ClientOnly>
<component-container data-class="flex flex-col gap-3">
<div class="bg-primary text-primary-foreground tile-double-sm">Small Double</div>
<div class="bg-primary text-primary-foreground tile-double-md">Medium Double</div>
<div class="bg-primary text-primary-foreground tile-double-lg">Large Double</div>
<div class="bg-primary text-primary-foreground tile-double-xl">Extra Large Double</div>
</component-container>
</ClientOnly>

```html
<div class="tile-double-sm bg-primary text-primary-foreground">Small Double</div>
<div class="tile-double-md bg-primary text-primary-foreground">Medium Double</div>
<div class="tile-double-lg bg-primary text-primary-foreground">Large Double</div>
<div class="tile-double-xl bg-primary text-primary-foreground">Extra Large Double</div>
```

### Auto width

<ClientOnly>
<component-container data-class="flex flex-col gap-3">
<div class="bg-primary text-primary-foreground tile-auto-sm">Small Auto</div>
<div class="bg-primary text-primary-foreground tile-auto-md">Medium Auto</div>
<div class="bg-primary text-primary-foreground tile-auto-lg">Large Auto</div>
<div class="bg-primary text-primary-foreground tile-auto-xl">Extra Large Auto</div>
</component-container>
</ClientOnly>

```html
<div class="tile-auto-sm bg-primary text-primary-foreground">Small Auto</div>
<div class="tile-auto-md bg-primary text-primary-foreground">Medium Auto</div>
<div class="tile-auto-lg bg-primary text-primary-foreground">Large Auto</div>
<div class="tile-auto-xl bg-primary text-primary-foreground">Extra Large Auto</div>
```
