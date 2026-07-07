# Align Self

Overrides the container's `items-*` alignment for an individual flex or grid item.

## Class names

| Class        | Description               |
| ------------ | ------------------------- |
| self-start   | `align-self: flex-start;` |
| self-center  | `align-self: center;`     |
| self-end     | `align-self: flex-end;`   |
| self-stretch | `align-self: stretch;`    |

## Examples

### Start

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-center gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 self-start bg-primary p-2 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Center

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-start gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 self-center bg-primary p-2 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### End

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-start gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 self-end bg-primary p-2 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>

### Stretch

<LiveExample data-style="height: 18rem">

```html
<div class="flex h-full items-start gap-4">
  <span class="flex-1 bg-primary p-2 text-primary-foreground">1</span>
  <span class="flex-1 self-stretch bg-primary p-2 text-primary-foreground">2</span>
  <span class="flex-1 bg-primary p-2 text-primary-foreground">3</span>
</div>
```

</LiveExample>
