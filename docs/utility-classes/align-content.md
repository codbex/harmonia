# Align Content

Aligns rows inside grids or wrapping flex layouts.

## Class names

| Class           | Description                     |
| --------------- | ------------------------------- |
| content-start   | `align-content: flex-start;`    |
| content-center  | `align-content: center;`        |
| content-end     | `align-content: flex-end;`      |
| content-between | `align-content: space-between;` |
| content-around  | `align-content: space-around;`  |
| content-evenly  | `align-content: space-evenly;`  |
| content-stretch | `align-content: stretch;`       |

## Examples

### Start

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-start gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Center

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-center gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### End

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-end gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Between

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-between gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Around

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-around gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Evenly

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-evenly gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>

### Stretch

<LiveExample data-style="height: 18rem">

```html
<div class="grid h-full grid-cols-3 content-stretch gap-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
</div>
```

</LiveExample>
