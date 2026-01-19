# Width & Height

## Class names

The width class names start with `w`.

| Class        | Description                                            |
| ------------ | ------------------------------------------------------ |
| w-auto       | Auto width.                                            |
| w-full       | 100% width.                                            |
| w-screen     | Makes the width equal to the screen size.              |
| max-w-screen | Sets maximum width to the width of the screen.         |
| max-w-dvw    | Sets maximum width to the dynamic width of the screen. |
| min-w-0      | Minimum width of 0 px.                                 |
| w-1/2        | 50% width.                                             |
| w-1/3        | 33% width.                                             |
| w-1/4        | 25% width.                                             |
| w-1/5        | 20% width.                                             |
| w-2/3        | 66% width.                                             |
| w-2/5        | 40% width.                                             |
| w-3/4        | 75% width.                                             |
| w-3/5        | 60% width.                                             |
| w-4/5        | 80% width.                                             |

The height class names start with `h`.

| Class    | Description                               |
| -------- | ----------------------------------------- |
| h-auto   | Auto height.                              |
| h-full   | 100% height.                              |
| h-screen | Makes the width equal to the screen size. |
| h-1/2    | 50% height.                               |

In case both width and height have to be applied and they must be the same, the `size-*` class can be used with a range from 4 to 12.

| Class       | Description                                                     |
| ----------- | --------------------------------------------------------------- |
| size-full   | Full size container.                                            |
| size-`4-12` | Width and height.                                               |
| min-size-4  | Minimum width and height of `var(--spacing)*4`. Used for icons. |
| tile-xs     | Extra small size container.                                     |
| tile-sm     | Small size container.                                           |
| tile-md     | Medium size container.                                          |
| tile-lg     | Large size container.                                           |

::: info
All of the classes above can be used with the `!` prefix in order to force their use in case the target element already has a certain size set.
:::

## Width examples

### Screen

<br />

<ClientOnly>
<component-container data-padding="false">
<div class="bg-primary text-primary-foreground flex justify-between w-screen">
  <span>Start</span>
  <span>End</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex w-screen justify-between bg-primary text-primary-foreground">
  <span>Start</span>
  <span>End</span>
</div>
```

::: tip
You may have to horizontally scroll the container to see the "End" label.
:::

### Full

<br />

<ClientOnly>
<component-container data-padding="false">
<div class="bg-primary text-primary-foreground w-full">Full width</div>
</component-container>
</ClientOnly>

```html
<div class="w-full bg-primary text-primary-foreground">Full width</div>
```

### Fractions

<br />

<ClientOnly>
<component-container data-class="flex flex-col gap-2">
<div class="flex gap-2">
  <div class="bg-primary text-primary-foreground w-1/2">w-1/2</div>
  <div class="bg-primary text-primary-foreground w-1/2">w-1/2</div>
</div>
<div class="flex gap-2">
  <div class="bg-primary text-primary-foreground w-2/5">w-2/5</div>
  <div class="bg-primary text-primary-foreground w-3/5">w-3/5</div>
</div>
<div class="flex gap-2">
  <div class="bg-primary text-primary-foreground w-1/3">w-1/3</div>
  <div class="bg-primary text-primary-foreground w-2/3">w-2/3</div>
</div>
<div class="flex gap-2">
  <div class="bg-primary text-primary-foreground w-1/4">w-1/4</div>
  <div class="bg-primary text-primary-foreground w-3/4">w-3/4</div>
</div>
<div class="flex gap-2">
  <div class="bg-primary text-primary-foreground w-1/5">w-1/5</div>
  <div class="bg-primary text-primary-foreground w-4/5">w-4/5</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex gap-2">
  <div class="w-1/2 bg-primary text-primary-foreground">w-1/2</div>
  <div class="w-1/2 bg-primary text-primary-foreground">w-1/2</div>
</div>
<div class="flex gap-2">
  <div class="w-2/5 bg-primary text-primary-foreground">w-2/5</div>
  <div class="w-3/5 bg-primary text-primary-foreground">w-3/5</div>
</div>
<div class="flex gap-2">
  <div class="w-1/3 bg-primary text-primary-foreground">w-1/3</div>
  <div class="w-2/3 bg-primary text-primary-foreground">w-2/3</div>
</div>
<div class="flex gap-2">
  <div class="w-1/4 bg-primary text-primary-foreground">w-1/4</div>
  <div class="w-3/4 bg-primary text-primary-foreground">w-3/4</div>
</div>
<div class="flex gap-2">
  <div class="w-1/5 bg-primary text-primary-foreground">w-1/5</div>
  <div class="w-4/5 bg-primary text-primary-foreground">w-4/5</div>
</div>
```

## Height examples

### Full

<br />

<ClientOnly>
<component-container data-padding="false">
<div class="bg-primary text-primary-foreground h-full">
Full height
</div>
</component-container>
</ClientOnly>

```html
<div class="h-full bg-primary text-primary-foreground">Full height</div>
```

### Screen

<br />

<ClientOnly>
<component-container data-padding="false">
<div class="bg-primary text-primary-foreground flex justify-between h-screen">
<span>Start</span>
<span>End</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="h-screen bg-primary text-primary-foreground">Matches screen height</div>
```

### Half

<br />

<ClientOnly>
<component-container data-class="h-12" data-padding="false">
<div class="bg-primary text-primary-foreground h-1/2">50% height</div>
</component-container>
</ClientOnly>

```html
<div class="h-1/2 bg-primary text-primary-foreground">50% height</div>
```

## Size examples

<br />

<ClientOnly>
<component-container>
<div class="bg-primary text-primary-foreground size-8 text-xs">Size 8</div>
</component-container>
</ClientOnly>

```html
<div class="size-8 bg-primary text-xs text-primary-foreground">Size 8</div>
```

<ClientOnly>
<component-container>
<div class="bg-primary text-primary-foreground size-12">Size 12</div>
</component-container>
</ClientOnly>

```html
<div class="size-12 bg-primary text-primary-foreground">Size 12</div>
```

<ClientOnly>
<component-container data-class="flex flex-col gap-3">
<div class="bg-primary text-primary-foreground tile-xs">Size Extra Small</div>
<div class="bg-primary text-primary-foreground tile-sm">Size Small</div>
<div class="bg-primary text-primary-foreground tile-md">Size Medium</div>
<div class="bg-primary text-primary-foreground tile-lg">Size Large</div>
</component-container>
</ClientOnly>

```html
<div class="tile-xs bg-primary text-primary-foreground">Size Extra Small</div>
<div class="tile-sm bg-primary text-primary-foreground">Size Small</div>
<div class="tile-md bg-primary text-primary-foreground">Size Medium</div>
<div class="tile-lg bg-primary text-primary-foreground">Size Large</div>
```
