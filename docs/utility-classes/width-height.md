# Width & Height

## Class names

The width class names start with `w`.

Some width classes also support the responsive prefixes `sm:`, `md:`, `lg:`, and `xl:` (e.g. `md:w-1/2`). The classes that do are marked in the "Responsive" column below. Responsive variants do not support the `!` modifier.

| Class    | Description                                           | `!` support | Responsive |
| -------- | ----------------------------------------------------- | ----------- | ---------- |
| w-auto   | Auto width.                                           | Yes         | No         |
| w-`1-12` | Width sizes 1 to 12.                                  | Yes         | No         |
| w-full   | 100% width.                                           | Yes         | Yes        |
| w-min    | `width: min-content`                                  | Yes         | No         |
| w-max    | `width: max-content`                                  | Yes         | No         |
| w-fit    | `width: fit-content`                                  | Yes         | No         |
| w-screen | Makes the width equal to the screen size.             | Yes         | No         |
| w-dvw    | Dynamic viewport width (`100dvw`).                    | No          | No         |
| w-svw    | Small viewport width (`100svw`).                      | No          | No         |
| w-lvw    | Large viewport width (`100lvw`).                      | No          | No         |
| w-1/10   | 10% width.                                            | Yes         | Yes        |
| w-1/2    | 50% width.                                            | Yes         | Yes        |
| w-1/3    | 33% width.                                            | Yes         | Yes        |
| w-1/4    | 25% width.                                            | Yes         | Yes        |
| w-1/5    | 20% width.                                            | Yes         | Yes        |
| w-2/3    | 66% width.                                            | Yes         | Yes        |
| w-2/5    | 40% width.                                            | Yes         | Yes        |
| w-3/4    | 75% width.                                            | Yes         | Yes        |
| w-3/5    | 60% width.                                            | Yes         | Yes        |
| w-4/5    | 80% width.                                            | Yes         | Yes        |
| w-9/10   | 90% width.                                            | Yes         | Yes        |
| w-3xs    | `width: var(--container-3xs); /* 16rem (256px) */`    | No          | No         |
| w-2xs    | `width: var(--container-2xs); /* 18rem (288px) */`    | No          | No         |
| w-xs     | `width: var(--container-xs); /* 20rem (320px) */`     | No          | No         |
| w-sm     | `width: var(--container-sm); /* 24rem (384px) */`     | No          | No         |
| w-md     | `width: var(--container-md); /* 28rem (448px) */`     | No          | No         |
| w-lg     | `width: var(--container-lg); /* 32rem (512px) */`     | No          | No         |
| w-xl     | `width: var(--container-xl); /* 36rem (576px) */`     | No          | No         |
| w-2xl    | `width: var(--container-2xl); /* 42rem (672px) */`    | No          | No         |
| w-3xl    | `width: var(--container-3xl); /* 48rem (768px) */`    | No          | No         |
| w-4xl    | `width: var(--container-4xl); /* 56rem (896px) */`    | No          | No         |
| w-5xl    | `width: var(--container-5xl); /* 64rem (1024px) */`   | No          | No         |
| w-6xl    | `width: var(--container-6xl); /* 72rem (1152px) */`   | No          | No         |
| w-7xl    | `width: var(--container-7xl); /* 80rem (1280px) */`   | No          | No         |
| w-8xl    | `width: var(--container-8xl); /* 90rem (1440px) */`   | No          | No         |
| w-9xl    | `width: var(--container-9xl); /* 96rem (1536px) */`   | No          | No         |
| w-10xl   | `width: var(--container-10xl); /* 100rem (1600px) */` | No          | No         |

The minimum width class names start with `min-w`.

| Class        | Description                                               | `!` support |
| ------------ | --------------------------------------------------------- | ----------- |
| min-w-0      | Minimum width of 0 px.                                    | No          |
| min-w-`1-12` | Minimum width sizes 1 to 12.                              | No          |
| min-w-3xs    | `min-width: var(--container-3xs); /* 16rem (256px) */`    | No          |
| min-w-2xs    | `min-width: var(--container-2xs); /* 18rem (288px) */`    | No          |
| min-w-xs     | `min-width: var(--container-xs); /* 20rem (320px) */`     | No          |
| min-w-sm     | `min-width: var(--container-sm); /* 24rem (384px) */`     | No          |
| min-w-md     | `min-width: var(--container-md); /* 28rem (448px) */`     | No          |
| min-w-lg     | `min-width: var(--container-lg); /* 32rem (512px) */`     | No          |
| min-w-xl     | `min-width: var(--container-xl); /* 36rem (576px) */`     | No          |
| min-w-2xl    | `min-width: var(--container-2xl); /* 42rem (672px) */`    | No          |
| min-w-3xl    | `min-width: var(--container-3xl); /* 48rem (768px) */`    | No          |
| min-w-4xl    | `min-width: var(--container-4xl); /* 56rem (896px) */`    | No          |
| min-w-5xl    | `min-width: var(--container-5xl); /* 64rem (1024px) */`   | No          |
| min-w-6xl    | `min-width: var(--container-6xl); /* 72rem (1152px) */`   | No          |
| min-w-7xl    | `min-width: var(--container-7xl); /* 80rem (1280px) */`   | No          |
| min-w-8xl    | `min-width: var(--container-8xl); /* 90rem (1440px) */`   | No          |
| min-w-9xl    | `min-width: var(--container-9xl); /* 96rem (1536px) */`   | No          |
| min-w-10xl   | `min-width: var(--container-10xl); /* 100rem (1600px) */` | No          |

The maximum width class names start with `min-w`.

| Class        | Description                                               | `!` support |
| ------------ | --------------------------------------------------------- | ----------- |
| max-w-screen | Sets maximum width to the width of the screen.            | No          |
| max-w-dvw    | Sets maximum width to the dynamic width of the screen.    | No          |
| max-w-`1-12` | Maximum width sizes 1 to 12.                              | No          |
| max-w-3xs    | `max-width: var(--container-3xs); /* 16rem (256px) */`    | No          |
| max-w-2xs    | `max-width: var(--container-2xs); /* 18rem (288px) */`    | No          |
| max-w-xs     | `max-width: var(--container-xs); /* 20rem (320px) */`     | No          |
| max-w-sm     | `max-width: var(--container-sm); /* 24rem (384px) */`     | No          |
| max-w-md     | `max-width: var(--container-md); /* 28rem (448px) */`     | No          |
| max-w-lg     | `max-width: var(--container-lg); /* 32rem (512px) */`     | No          |
| max-w-xl     | `max-width: var(--container-xl); /* 36rem (576px) */`     | No          |
| max-w-2xl    | `max-width: var(--container-2xl); /* 42rem (672px) */`    | No          |
| max-w-3xl    | `max-width: var(--container-3xl); /* 48rem (768px) */`    | No          |
| max-w-4xl    | `max-width: var(--container-4xl); /* 56rem (896px) */`    | No          |
| max-w-5xl    | `max-width: var(--container-5xl); /* 64rem (1024px) */`   | No          |
| max-w-6xl    | `max-width: var(--container-6xl); /* 72rem (1152px) */`   | No          |
| max-w-7xl    | `max-width: var(--container-7xl); /* 80rem (1280px) */`   | No          |
| max-w-8xl    | `max-width: var(--container-8xl); /* 90rem (1440px) */`   | No          |
| max-w-9xl    | `max-width: var(--container-9xl); /* 96rem (1536px) */`   | No          |
| max-w-10xl   | `max-width: var(--container-10xl); /* 100rem (1600px) */` | No          |

The height class names start with `h`.

| Class    | Description                                | `!` support |
| -------- | ------------------------------------------ | ----------- |
| h-auto   | Auto height.                               | Yes         |
| h-`1-12` | Height sizes 1 to 12.                      | Yes         |
| h-full   | 100% height.                               | Yes         |
| h-min    | `height: min-content`                      | Yes         |
| h-max    | `height: max-content`                      | Yes         |
| h-fit    | `height: fit-content`                      | Yes         |
| h-screen | Makes the height equal to the screen size. | Yes         |
| h-dvh    | Dynamic viewport height (`100dvh`).        | No          |
| h-lvh    | Large viewport height (`100lvh`).          | No          |
| h-svh    | Small viewport height (`100svh`).          | No          |
| h-1/2    | 50% height.                                | Yes         |

The minimum and maximum height class names start with `min-h` and `max-h`.

| Class        | Description                   | `!` support |
| ------------ | ----------------------------- | ----------- |
| max-h-`1-12` | Maximum height sizes 1 to 12. | No          |
| min-h-`1-12` | Minimum height sizes 1 to 12. | No          |

In case both width and height have to be applied and they must be the same, the `size-*` class can be used with a range from 1 to 12.

| Class       | Description                                                     | `!` support |
| ----------- | --------------------------------------------------------------- | ----------- |
| size-full   | Full size container.                                            | Yes         |
| size-fit    | Fit the container size to content.                              | Yes         |
| size-`1-12` | Width and height sizes 1 to 12.                                 | Yes         |
| min-size-4  | Minimum width and height of `var(--spacing)*4`. Used for icons. | No          |

::: info
Some of the classes above can be used with the `!` prefix (for `!important`) in order to force their use in case the target element already has a certain size. The class names which support this are marked with "Yes" in the "`!` support" column.
:::

## Width examples

### Screen

<LiveExample data-class="p-0 overflow-scroll">

```html
<div class="flex w-screen justify-between bg-primary text-primary-foreground">
  <span>Start</span>
  <span>End</span>
</div>
```

</LiveExample>

::: tip
You may have to horizontally scroll the container to see the "End" label.
:::

### Full

<LiveExample data-class="p-0">

```html
<div class="w-full bg-primary text-primary-foreground">Full width</div>
```

</LiveExample>

### Fractions

<LiveExample data-class="flex flex-col gap-2">

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
<div class="flex gap-2">
  <div class="w-1/10 bg-primary text-primary-foreground">w-1/10</div>
  <div class="w-9/10 bg-primary text-primary-foreground">w-9/10</div>
</div>
```

</LiveExample>

### Sizes

<LiveExample data-class="flex flex-col gap-2 overflow-scroll">

```html
<div class="w-xs bg-primary text-primary-foreground">Extra small width</div>
<div class="w-sm bg-primary text-primary-foreground">Small width</div>
<div class="w-md bg-primary text-primary-foreground">Medium width</div>
<div class="w-lg bg-primary text-primary-foreground">Large width</div>
<div class="w-xl bg-primary text-primary-foreground">Extra large width</div>
```

</LiveExample>

## Height examples

### Full

<LiveExample data-class="p-0">

```html
<div class="h-full bg-primary text-primary-foreground">Full height</div>
```

</LiveExample>

### Screen

<LiveExample data-class="p-0">

```html
<div class="flex h-screen justify-between bg-primary text-primary-foreground">
  <span>Start</span>
  <span>End</span>
</div>
```

</LiveExample>

### Half

<LiveExample data-class="p-0 h-12">

```html
<div class="h-1/2 bg-primary text-primary-foreground">50% height</div>
```

</LiveExample>

## Size examples

<LiveExample>

```html
<div class="size-8 bg-primary text-xs text-primary-foreground">Size 8</div>
```

</LiveExample>

<LiveExample>

```html
<div class="size-12 bg-primary text-primary-foreground">Size 12</div>
```

</LiveExample>
