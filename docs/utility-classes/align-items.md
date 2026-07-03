# Align Content

Aligns items along the cross axis of a flex or grid container.

## Class names

| Class          | Description                |
| -------------- | -------------------------- |
| items-start    | `align-items: flex-start;` |
| items-center   | `align-items: center;`     |
| items-end      | `align-items: flex-end;`   |
| items-baseline | `align-items: baseline;`   |
| items-stretch  | `align-content: stretch;`  |

## Examples

### Start

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-start gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 bg-primary px-2 pt-2 pb-12 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Center

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-center gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 bg-primary px-2 pt-2 pb-12 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### End

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-end gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 bg-primary px-2 pt-2 pb-12 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Baseline

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-baseline gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 bg-primary px-2 pt-2 pb-12 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Stretch

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-stretch gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 bg-primary px-2 pt-2 pb-12 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>
