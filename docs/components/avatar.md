# Avatar

Represents a person, entity, or object using an image, icon, or text, such as a user photo, initials, or symbolic graphic. Avatars help provide visual context and identity within the interface.

## Usage

Use avatars to visually identify users or related entities in lists, profiles, or collaborative features. Choose the appropriate variant based on available data - images for personal recognition, initials or icons as fallbacks.

## API Reference

### Component attribute(s)

```
x-h-avatar
x-h-avatar-image
x-h-avatar-fallback
```

### Attributes

#### x-h-avatar

| Attribute    | Type                                                                                                                                                 | Required | Description                                                                                                               |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`                                                                          | false    | Semantic color state                                                                                                      |
| data-color   | `white`<br />`black`<br />`red`<br />`orange`<br />`yellow`<br />`green`<br />`teal`<br />`blue`<br />`indigo`<br />`purple`<br />`pink`<br />`gray` | false    | Fills the avatar solid with a [standard palette color](/utility-classes/color#standard-colors). Overrides `data-variant`. |

## Examples

### Default

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-avatar>
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</div>
```

</LiveExample>

### Big avatar

<LiveExample data-class="flex flex-col items-center" data-exclude="generator">

```html
<div x-h-avatar class="size-12">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</div>
```

</LiveExample>

### Square avatar

You can change the avatar shape by using the `rounded-` classes.

<LiveExample data-class="flex flex-col items-center" data-exclude="generator">

```html
<div x-h-avatar class="rounded-md">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</div>
```

</LiveExample>

### Text-only

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-avatar>HM</div>
```

</LiveExample>

### Icon-only

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-avatar aria-label="user">
  <svg x-h-icon data-icon="circle-user" role="presentaion"></svg>
</div>
```

</LiveExample>

### Variants

<LiveExample data-class="grid grid-cols-5 justify-items-center gap-4">

```html
<div x-h-avatar data-variant="primary">
  <svg x-h-icon data-icon="circle-user" role="img" aria-label="user"></svg>
</div>

<div x-h-avatar data-variant="information">
  <svg x-h-icon data-icon="circle-info" role="img" aria-label="info"></svg>
</div>

<div x-h-avatar data-variant="warning">
  <svg x-h-icon data-icon="circle-warning" role="img" aria-label="warning"></svg>
</div>

<div x-h-avatar data-variant="positive">
  <svg x-h-icon data-icon="circle-success" role="img" aria-label="success"></svg>
</div>

<div x-h-avatar data-variant="negative">
  <svg x-h-icon data-icon="circle-error" role="img" aria-label="error"></svg>
</div>

<div x-h-avatar data-variant="primary">PR</div>

<div x-h-avatar data-variant="information">IN</div>

<div x-h-avatar data-variant="warning">WA</div>

<div x-h-avatar data-variant="positive">PO</div>

<div x-h-avatar data-variant="negative">NE</div>
```

</LiveExample>

### Colors

Use `data-color` to fill the avatar with one of Harmonia's standard palette colors. This is independent of the semantic `data-variant` and is well suited to color-coded initials.

<LiveExample data-class="grid grid-cols-6 justify-items-center gap-4">

```html
<div x-h-avatar data-color="red">RE</div>
<div x-h-avatar data-color="orange">OR</div>
<div x-h-avatar data-color="yellow">YE</div>
<div x-h-avatar data-color="green">GR</div>
<div x-h-avatar data-color="teal">TE</div>
<div x-h-avatar data-color="blue">BL</div>
<div x-h-avatar data-color="indigo">IN</div>
<div x-h-avatar data-color="purple">PU</div>
<div x-h-avatar data-color="pink">PI</div>
<div x-h-avatar data-color="gray">GY</div>
<div x-h-avatar data-color="white">WH</div>
<div x-h-avatar data-color="black">BK</div>
```

</LiveExample>

### Interactive

To make an avatar interactive, use the `button` HTML element instead of a `span`.

<LiveExample data-class="flex flex-col items-center">

```html
<button x-h-avatar>HM</button>
```

</LiveExample>
