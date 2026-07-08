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

#### x-h-badge

| Attribute    | Type                                                                                       | Required | Description    |
| ------------ | ------------------------------------------------------------------------------------------ | -------- | -------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline` | false    | Semantic color |

#### x-h-badge-indicator

| Attribute     | Type                                                                        | Required | Description                                                           |
| ------------- | --------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------- |
| data-variant  | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information` | false    | Semantic color (defaults to `primary`)                                |
| data-size     | `default`<br />`sm`                                                         | false    | Indicator size (defaults to `default`)                                |
| data-position | `top-right`<br />`top-left`<br />`bottom-left`<br />`bottom-right`          | false    | Corner of the host the indicator anchors to (defaults to `top-right`) |
| data-dot      | `true`                                                                      | false    | Renders a small dot without content instead of a labelled badge       |
| data-ping     | `true`                                                                      | false    | Adds a pulsing ping animation behind the indicator                    |

## Examples

### Badge

<LiveExample data-class="flex flex-col gap-4">

```html
<div x-h-badge>Badge</div>
<div x-h-badge data-variant="primary">Primary</div>
<div x-h-badge data-variant="positive"><svg x-h-icon data-icon="check" role="presentation"></svg>Positive</div>
<div x-h-badge data-variant="negative"><svg x-h-icon data-icon="close" role="presentation"></svg>Negative</div>
<div x-h-badge data-variant="warning"><svg x-h-icon data-icon="circle-warning" role="presentation"></svg>Warning</div>
<div x-h-badge data-variant="information"><svg x-h-icon data-icon="circle-info" role="presentation"></svg>Information</div>
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
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator>121</span>
</button>
```

</LiveExample>

- Button badge as dot

<LiveExample>

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with badge dot">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-dot="true"></span>
</button>
```

</LiveExample>

- Avatar with badge

<LiveExample>

```html
<div x-h-avatar class="relative">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
  <span x-h-badge-indicator data-dot="true"></span>
</div>
```

</LiveExample>

- Small avatar with small badge

<LiveExample data-exclude="generator">

```html
<div x-h-avatar class="relative size-5!">
  <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  <div x-h-avatar-fallback>HM</div>
  <span x-h-badge-indicator data-dot="true" data-size="sm"></span>
</div>
```

</LiveExample>

- Dot badge with ping animation

<LiveExample>

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with badge dot ping">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
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

- Small size

The `data-size="sm"` variant renders a more compact indicator, both for labelled badges and dots.

<LiveExample data-class="flex gap-6" data-exclude="generator">

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with small badge">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-size="sm">9</span>
</button>
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Icon button with small badge dot">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-size="sm" data-dot="true"></span>
</button>
```

</LiveExample>

- Positions

Use `data-position` to anchor the indicator to any corner of the host.

<LiveExample data-class="flex gap-6" data-exclude="generator">

```html
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Badge top-right">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-position="top-right" data-dot="true"></span>
</button>
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Badge top-left">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-position="top-left" data-dot="true"></span>
</button>
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Badge bottom-left">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-position="bottom-left" data-dot="true"></span>
</button>
<button class="relative" x-h-button data-variant="outline" data-size="icon" aria-label="Badge bottom-right">
  <svg x-h-icon data-icon="bell" role="presentation"></svg>
  <span x-h-badge-indicator data-position="bottom-right" data-dot="true"></span>
</button>
```

</LiveExample>
