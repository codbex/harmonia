# Place Content

Justifies and aligns content at the same time. Applies to both flex and grid layouts.

## Class names

| Class                 | Description                     |
| --------------------- | ------------------------------- |
| place-content-start   | `place-content: start;`         |
| place-content-center  | `place-content: center;`        |
| place-content-end     | `place-content: end;`           |
| place-content-between | `place-content: space-between;` |
| place-content-around  | `place-content: space-around;`  |
| place-content-evenly  | `place-content: space-evenly;`  |
| place-content-stretch | `place-content: stretch;`       |

## Examples

### Start

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-start gap-4" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Center

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-center gap-4" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### End

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-end gap-4" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Between

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-between gap-4" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Around

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-around gap-4" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Evenly

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-evenly gap-4" style="grid-template-columns: repeat(2,2rem);">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Stretch

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-2 place-content-stretch gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>
