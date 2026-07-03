# Badge

Displays a short label used to convey the semantic status of an object. Badges use color and, optionally, an icon to provide quick visual cues and reinforce meaning at a glance.

## Usage

Use badges to highlight status, category, or state in a compact and non-intrusive way. Select the appropriate semantic variant to match the context and intent. Avoid overusing badges or relying on color alone and ensure the meaning remains clear through text or iconography. The outline variant can be used when a more subtle visual emphasis is required.

## API Reference

### Component attribute(s)

```
x-h-badge
x-h-badge-indicator
```

### Attributes

| Attribute    | Type                                                                                       | Required | Description    |
| ------------ | ------------------------------------------------------------------------------------------ | -------- | -------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline` | false    | Semantic color |

## Examples

### Badge

<LiveExample data-class="flex flex-col gap-4">

```html
<div x-h-badge>Badge</div>
<div x-h-badge data-variant="primary">Primary</div>
<div x-h-badge data-variant="positive"><i x-h-lucide role="img" data-lucide="check"></i>Positive</div>
<div x-h-badge data-variant="negative"><i x-h-lucide role="img" data-lucide="x"></i>Negative</div>
<div x-h-badge data-variant="warning"><i x-h-lucide role="img" data-lucide="siren"></i>Warning</div>
<div x-h-badge data-variant="information"><i x-h-lucide role="img" data-lucide="info"></i>Information</div>
<div x-h-badge data-variant="outline">Outline</div>
<a x-h-badge href="#">Link</a>
```

</LiveExample>

### Badge Indicator

The badge indicator can be used on any element as long as it that element's position is relative (or has the `relative` class).

- Button badge with text

<LiveExample>

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with badge">
  <svg x-h-icon data-icon="bell" role="img" aria-label="bell"></svg>
  <span x-h-badge-indicator>121</span>
</button>
```

</LiveExample>

- Button badge as dot

<LiveExample>

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with badge dot">
  <svg x-h-icon data-icon="bell" role="img" aria-label="bell"></svg>
  <span x-h-badge-indicator data-dot="true"></span>
</button>
```

</LiveExample>

- Avatar with badge

<LiveExample>

```html
<span x-h-avatar class="relative">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
  <span x-h-badge-indicator data-dot="true"></span>
</span>
```

</LiveExample>

- Dot badge with ping animation

<LiveExample>

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with badge dot ping">
  <svg x-h-icon data-icon="bell" role="img" aria-label="bell"></svg>
  <span x-h-badge-indicator data-dot="true" data-ping="true"></span>
</button>
```

</LiveExample>

- Negative variant badge indicator

<LiveExample>

```html
<button class="relative" x-h-button data-variant="outline">
  Tasks
  <span x-h-badge-indicator data-variant="negative">4</span>
</button>
```

</LiveExample>
