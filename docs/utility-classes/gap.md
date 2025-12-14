# Gap

Adds a gap to flex and grid layout items.

## Class names

| Class        | Description                            |
| ------------ | -------------------------------------- |
| gap-`1-12`   | All-round gap size. From 1 to 12.      |
| gap-x-`1-12` | Left and right gap size. From 1 to 12. |
| gap-y-`1-12` | Top and bottom gap size. From 1 to 12. |

## Examples

### Grid gap

<br />

<ClientOnly>
<component-container>
<div class="grid grid-cols-4 gap-2">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
  <span class="bg-primary text-primary-foreground p-2">7</span>
  <span class="bg-primary text-primary-foreground p-2">8</span>
</div>
</component-container>
</ClientOnly>

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

### Different horizontal and vertical grid gap

<br />

<ClientOnly>
<component-container>
<div class="grid grid-cols-4 gap-x-1 gap-y-4">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
  <span class="bg-primary text-primary-foreground p-2">5</span>
  <span class="bg-primary text-primary-foreground p-2">6</span>
  <span class="bg-primary text-primary-foreground p-2">7</span>
  <span class="bg-primary text-primary-foreground p-2">8</span>
</div>
</component-container>
</ClientOnly>

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

### Flex gap

<br />

<ClientOnly>
<component-container>
<div class="hbox gap-2">
  <span class="bg-primary text-primary-foreground p-2">1</span>
  <span class="bg-primary text-primary-foreground p-2">2</span>
  <span class="bg-primary text-primary-foreground p-2">3</span>
  <span class="bg-primary text-primary-foreground p-2">4</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="hbox gap-2">
  <span class="bg-primary p-2 text-primary-foreground">1</span>
  <span class="bg-primary p-2 text-primary-foreground">2</span>
  <span class="bg-primary p-2 text-primary-foreground">3</span>
  <span class="bg-primary p-2 text-primary-foreground">4</span>
</div>
```

### Flex wrap gap

<br />

<ClientOnly>
<component-container>
<div class="hbox flex-wrap gap-2">
  <span class="bg-primary text-primary-foreground py-2 px-12">1</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">2</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">3</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">4</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">5</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">6</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">7</span>
  <span class="bg-primary text-primary-foreground py-2 px-12">8</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="hbox gap-2">
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
