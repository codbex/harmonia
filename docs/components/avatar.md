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

| Attribute    | Type                                                         | Required | Description          |
| ------------ | ------------------------------------------------------------ | -------- | -------------------- |
| data-variant | `positive`<br />`negative`<br />`warning`<br />`information` | false    | Semantic color state |

## Examples

### Default

<LiveExample data-class="flex flex-col items-center">

```html
<span x-h-avatar>
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
```

</LiveExample>

### Big avatar

<LiveExample data-class="flex flex-col items-center">

```html
<span x-h-avatar class="size-12">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
```

</LiveExample>

### Square avatar

You can change the avatar shape by using the `rounded-` classes.

<LiveExample data-class="flex flex-col items-center">

```html
<span x-h-avatar class="rounded-md">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
```

</LiveExample>

### Text-only

<LiveExample data-class="flex flex-col items-center">

```html
<span x-h-avatar>HM</span>
```

</LiveExample>

### Icon-only

<LiveExample data-class="flex flex-col items-center">

```html
<span x-h-avatar aria-label="camera">
  <i x-h-lucide role="img" data-lucide="camera"></i>
</span>
```

</LiveExample>

### Variants

<LiveExample data-class="grid grid-cols-4 justify-items-center gap-4">

```html
<span x-h-avatar data-variant="information">
  <svg x-h-icon data-icon="circle-info" role="img" aria-label="info"></svg>
</span>

<span x-h-avatar data-variant="warning">
  <svg x-h-icon data-icon="circle-warning" role="img" aria-label="warning"></svg>
</span>

<span x-h-avatar data-variant="positive">
  <svg x-h-icon data-icon="circle-success" role="img" aria-label="success"></svg>
</span>

<span x-h-avatar data-variant="negative">
  <svg x-h-icon data-icon="circle-error" role="img" aria-label="error"></svg>
</span>

<span x-h-avatar data-variant="information">IN</span>

<span x-h-avatar data-variant="warning">WA</span>

<span x-h-avatar data-variant="positive">PO</span>

<span x-h-avatar data-variant="negative">NE</span>
```

</LiveExample>

### Interactive

To make an avatar interactive, use the `button` HTML element instead of a `span`.

<LiveExample data-class="flex flex-col items-center">

```html
<button x-h-avatar>HM</button>
```

</LiveExample>
