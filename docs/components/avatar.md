# Avatar

The avatar is used for presenting various images, including user profiles, user initials, images or icons.

## API Reference

### Component attubute(s)

```
x-h-avatar
x-h-avatar-image
x-h-avatar-fallback
```

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
<component-container data-js="/js/init-icons.js" data-class="flex flex-col items-center">
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
