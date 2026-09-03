# Gap

Adds a gap to flex and grid layout items.

## Class names

The all-round `gap` class also supports responsive prefixes `sm:`, `md:`, `lg:`, and `xl:` (e.g. `md:gap-4`). Responsive variants do not support the `!` modifier.

Two half steps, `gap-0.5` and `gap-1.5`, are available on the all-round gap only. They take neither a responsive prefix nor the `!` modifier, and there is no `gap-x` or `gap-y` equivalent.

| Class        | Description                            | `!` support |
| ------------ | -------------------------------------- | ----------- |
| gap-`1-12`   | All-round gap size. From 1 to 12.      | Yes         |
| gap-0.5      | All-round gap size of 0.5.             | No          |
| gap-1.5      | All-round gap size of 1.5.             | No          |
| gap-x-`1-12` | Left and right gap size. From 1 to 12. | No          |
| gap-y-`1-12` | Top and bottom gap size. From 1 to 12. | No          |

## Examples

### Grid gap

<LiveExample>

```html
<div class="grid grid-cols-4 gap-2">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
  <span class="bg-primary p-2 text-primary-foreground">7</span>
  <span class="bg-primary p-2 text-primary-foreground">8</span>
</div>
```

</LiveExample>

### Different horizontal and vertical grid gap

<LiveExample>

```html
<div class="grid grid-cols-4 gap-x-1 gap-y-4">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
  <span class="bg-primary p-2 text-primary-foreground">5</span>
  <span class="bg-primary p-2 text-primary-foreground">6</span>
  <span class="bg-primary p-2 text-primary-foreground">7</span>
  <span class="bg-primary p-2 text-primary-foreground">8</span>
</div>
```

</LiveExample>

### Flex gap

<LiveExample>

```html
<div class="hbox gap-2">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

</LiveExample>

### Flex wrap gap

<LiveExample>

```html
<div class="hbox flex-wrap gap-2">
  <span class="bg-primary px-12 py-2 text-primary-foreground">1</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">2</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">3</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">4</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">5</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">6</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">7</span>
  <span class="bg-primary px-12 py-2 text-primary-foreground">8</span>
</div>
```

</LiveExample>

### Half-step gap

<LiveExample>

```html
<div class="vbox gap-4">
  <div class="hbox gap-0.5">
    <span class="bg-primary p-2 text-primary-foreground">gap-0.5</span>
    <span class="bg-primary p-2 text-primary-foreground">gap-0.5</span>
    <span class="bg-primary p-2 text-primary-foreground">gap-0.5</span>
  </div>
  <div class="hbox gap-1.5">
    <span class="bg-primary p-2 text-primary-foreground">gap-1.5</span>
    <span class="bg-primary p-2 text-primary-foreground">gap-1.5</span>
    <span class="bg-primary p-2 text-primary-foreground">gap-1.5</span>
  </div>
</div>
```

</LiveExample>
