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

<br />

<ClientOnly>
<component-container data-class="flex flex-col items-center">
<span x-h-avatar>
  <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
</component-container>
</ClientOnly>

```html
<span x-h-avatar>
  <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
```

### Big avatar

<br />

<ClientOnly>
<component-container data-class="flex flex-col items-center">
<span x-h-avatar class="size-12">
  <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
</component-container>
</ClientOnly>

```html
<span x-h-avatar class="size-12">
  <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
```

### Square avatar

You can change the avatar shape by using the `rounded-` classes.

<ClientOnly>
<component-container data-class="flex flex-col items-center">
<span x-h-avatar class="rounded-md">
  <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
</component-container>
</ClientOnly>

```html
<span x-h-avatar class="rounded-md">
  <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
</span>
```

### Text-only

<br />

<ClientOnly>
<component-container data-class="flex flex-col items-center">
<span x-h-avatar>HM</span>
</component-container>
</ClientOnly>

```html
<span x-h-avatar>HM</span>
```

### Icon-only

<br />

<ClientOnly>
<component-container data-icons="true" data-class="flex flex-col items-center">
<span x-h-avatar aria-label="camera">
  <i role="img" data-lucide="camera"></i>
</span>
</component-container>
</ClientOnly>

```html
<span x-h-avatar aria-label="camera">
  <i role="img" data-lucide="camera"></i>
</span>
```

### Variants

<br />

<ClientOnly>
<component-container data-icons="true" data-class="grid grid-cols-4 justify-items-center gap-4">
<span x-h-avatar data-variant="information">
  <svg x-h-icon.circle-info role="img" aria-label="info"></svg>
</span>

<span x-h-avatar data-variant="warning">
  <svg x-h-icon.circle-warning role="img" aria-label="warning"></svg>
</span>

<span x-h-avatar data-variant="positive">
  <svg x-h-icon.circle-success role="img" aria-label="success"></svg>
</span>

<span x-h-avatar data-variant="negative">
  <svg x-h-icon.circle-error role="img" aria-label="error"></svg>
</span>

<span x-h-avatar data-variant="information">IN</span>

<span x-h-avatar data-variant="warning">WA</span>

<span x-h-avatar data-variant="positive">PO</span>

<span x-h-avatar data-variant="negative">NE</span>
</component-container>
</ClientOnly>

```html
<span x-h-avatar data-variant="information">
  <svg x-h-icon.circle-info role="img" aria-label="info"></svg>
</span>

<span x-h-avatar data-variant="warning">
  <svg x-h-icon.circle-info role="img" aria-label="warning"></svg>
</span>

<span x-h-avatar data-variant="positive">
  <svg x-h-icon.circle-success role="img" aria-label="success"></svg>
</span>

<span x-h-avatar data-variant="negative">
  <svg x-h-icon.circle-error role="img" aria-label="error"></svg>
</span>

<span x-h-avatar data-variant="information">IN</span>

<span x-h-avatar data-variant="warning">WA</span>

<span x-h-avatar data-variant="positive">PO</span>

<span x-h-avatar data-variant="negative">NE</span>
```

### Interactive

To make an avatar interactive, use the `button` HTML element instead of a `span`.

<ClientOnly>
<component-container data-class="flex flex-col items-center">
<button x-h-avatar>HM</button>
</component-container>
</ClientOnly>

```html
<button x-h-avatar>HM</button>
```
