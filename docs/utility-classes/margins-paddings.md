# Margins & Paddings

## Class names

The margin class names start with `m` and have a range of 0 to 12.

| Class     | Description                                       | `!` support |
| --------- | ------------------------------------------------- | ----------- |
| m-`0-12`  | Add a margin on all sides. `m-0` means no margin. | Yes         |
| ml-`0-12` | Add a margin on the left side.                    | Yes         |
| ml-auto   | Automatic margin on the left.                     | Yes         |
| mr-`0-12` | Add a margin on the right side.                   | Yes         |
| mr-auto   | Automatic margin on the right.                    | Yes         |
| mt-`0-12` | Adds a top margin.                                | Yes         |
| mb-`0-12` | Add a bottom margin.                              | Yes         |
| mx-`0-12` | Add a margin on the left and right sides.         | Yes         |
| my-`0-12` | Add a top and bottom margin.                      | Yes         |

The padding class names start with `p` and have a range of 0 to 12.

| Class     | Description                                         | `!` support |
| --------- | --------------------------------------------------- | ----------- |
| p-`0-12`  | Add a padding on all sides. `p-0` means no padding. | Yes         |
| pl-`0-12` | Add a padding on the left side.                     | Yes         |
| pl-auto   | Automatic padding on the left.                      | Yes         |
| pr-`0-12` | Add a padding on the right side.                    | Yes         |
| pr-auto   | Automatic padding on the right.                     | Yes         |
| pt-`0-12` | Adds a top padding.                                 | Yes         |
| pb-`0-12` | Add a bottom padding.                               | Yes         |
| px-`0-12` | Add a padding on the left and right sides.          | Yes         |
| py-`0-12` | Add a top and bottom padding.                       | Yes         |

::: info Responsive margins and paddings
You can use the standard `sm`, `md`, `lg` and `xl` breakpoints for padding and margin classes (with the exception of side-specific ones - `mt-*`, `pt-*`, `ml-*`, `pl-*`, etc.).
:::

::: tip Forcing a padding or a margin on a component
Many components already have margins and paddings set, so you may have to add `!` to the beginning of the class name to apply the `!important` css declaration to force its use.
:::

## Margin examples

### All-Round Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary m-4">m-4</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="m-4 bg-secondary text-secondary">m-4</div>
</div>
```

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary m-8">m-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="m-8 bg-secondary text-secondary">m-8</div>
</div>
```

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary m-12">m-12</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="m-12 bg-secondary text-secondary">m-12</div>
</div>
```

### Left Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary ml-8">ml-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="ml-8 bg-secondary text-secondary">ml-8</div>
</div>
```

### Right Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary mr-8">mr-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="mr-8 bg-secondary text-secondary">mr-8</div>
</div>
```

### Double-Sided Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary mx-8">mx-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="mx-8 bg-secondary text-secondary">mx-8</div>
</div>
```

### Top Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary mt-8">mt-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="mt-8 bg-secondary text-secondary">mt-8</div>
</div>
```

### Bottom Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary mb-8">mb-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="mb-8 bg-secondary text-secondary">mb-8</div>
</div>
```

### Responsive Margin

Responsive left and right margin based on the screen size.

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary mx-0 sm:mx-2 md:mx-4 lg:mx-8 xl:mx-12">Responsive</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="mx-0 bg-secondary text-secondary sm:mx-2 md:mx-4 lg:mx-8 xl:mx-12">Responsive</div>
</div>
```

### Top & Bottom Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary">
  <div class="bg-secondary text-secondary my-8">my-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary">
  <div class="my-8 bg-secondary text-secondary">my-8</div>
</div>
```

### Left Auto Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary flex">
  <div class="bg-secondary text-secondary px-2">Left content</div>
  <div class="bg-secondary text-secondary ml-auto">ml-auto</div>
  <div class="bg-secondary text-secondary px-2">Right content</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex bg-primary">
  <div class="bg-secondary px-2 text-secondary">Left content</div>
  <div class="ml-auto bg-secondary text-secondary">ml-auto</div>
  <div class="bg-secondary px-2 text-secondary">Right content</div>
</div>
```

### Right Auto Margin

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary flex">
  <div class="bg-secondary text-secondary px-2">Left content</div>
  <div class="bg-secondary text-secondary mr-auto">ml-auto</div>
  <div class="bg-secondary text-secondary px-2">Right content</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="flex bg-primary">
  <div class="bg-secondary px-2 text-secondary">Left content</div>
  <div class="mr-auto bg-secondary text-secondary">ml-auto</div>
  <div class="bg-secondary px-2 text-secondary">Right content</div>
</div>
```

## Padding examples

### All-Round Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary p-4">
  <div class="bg-secondary text-secondary">p-4</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary p-4">
  <div class="bg-secondary text-secondary">p-4</div>
</div>
```

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary p-8">
  <div class="bg-secondary text-secondary">p-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary p-8">
  <div class="bg-secondary text-secondary">p-8</div>
</div>
```

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary p-12">
  <div class="bg-secondary text-secondary">p-12</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary p-12">
  <div class="bg-secondary text-secondary">p-12</div>
</div>
```

### Left Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary pl-8">
  <div class="bg-secondary text-secondary">pl-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary pl-8">
  <div class="bg-secondary text-secondary">pl-8</div>
</div>
```

### Right Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary pr-8">
  <div class="bg-secondary text-secondary">pr-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary pr-8">
  <div class="bg-secondary text-secondary">pr-8</div>
</div>
```

### Double-Sided Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary px-8">
  <div class="bg-secondary text-secondary">px-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary px-8">
  <div class="bg-secondary text-secondary">px-8</div>
</div>
```

### Responsive Margin

Responsive left and right padding based on the screen size.

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary px-0 sm:px-2 md:px-4 lg:px-8 xl:px-12">
  <div class="bg-secondary text-secondary">Responsive</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary px-0 sm:px-2 md:px-4 lg:px-8 xl:px-12">
  <div class="bg-secondary text-secondary">Responsive</div>
</div>
```

### Top Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary pt-8">
  <div class="bg-secondary text-secondary">pt-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary pt-8">
  <div class="bg-secondary text-secondary">pt-8</div>
</div>
```

### Bottom Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary pb-8">
  <div class="bg-secondary text-secondary">pb-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary pb-8">
  <div class="bg-secondary text-secondary">pb-8</div>
</div>
```

### Top & Bottom Padding

<ClientOnly>
<component-container data-class="p-0 flex flex-col items-stretch">
<div class="bg-primary py-8">
  <div class="bg-secondary text-secondary">py-8</div>
</div>
</component-container>
</ClientOnly>

```html
<div class="bg-primary py-8">
  <div class="bg-secondary text-secondary">py-8</div>
</div>
```
