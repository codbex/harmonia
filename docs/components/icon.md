# Icon

Renders an SVG graphic, either from a link or a set of built-in icons, that can represent an action, status, or decorative element. By default, it applies the fill-current class, allowing the icon to inherit the current text color.

## Usage

Icons work best when paired with clear labels or context, and should not be the sole method of conveying information. They can be used as small interface symbols or full SVG illustrations, depending on the design needs.

## API Reference

### Component attubute(s)

```
x-h-icon
```

### Attributes

| Attribute | Type                     | Required | Description                                                                                                                                                                                                                                                                                                                                                                     |
| --------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-link | url                      | false    | URL to the svg icon.                                                                                                                                                                                                                                                                                                                                                            |
| role      | `img`<br/>`presentation` | true     | The role of the icon. This is required as it affects the accessibility.<br />The `presentation` role excludes the icon from being visible to assistive technologies.<br />When using the `img` role, either `aria-label` or `aria-labelledby` attribute must also me provided. If not, assistive technologies will have trouble conveying to the user what the icon represents. |

### Modifiers

Harmonia includes several built-in icons. Instead of using the `data-link` attribute, you can apply the modifiers below to access them.

| Modifier       | Description         |
| -------------- | ------------------- |
| calendar       | Calendar icon       |
| check          | Calendar icon       |
| chevron-down   | Chevron down icon   |
| chevron-left   | Chevron left icon   |
| chevron-right  | Chevron right icon  |
| chevrons-left  | Chevrons left icon  |
| chevrons-right | Chevrons right icon |
| clock          | Clock icon          |
| search         | Search icon         |
| ellipsis       | Ellipsis icon       |

## Examples

### SVG image

<br />

<ClientOnly>
<component-container data-class="!p-1 hbox justify-center">
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
```

### SVG icon

<br />

<ClientOnly>
<component-container>
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### SVG icon with custom fill color

<br />

<ClientOnly>
<component-container data-class="flex gap-3">
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Harmonia Icons

<br />

<ClientOnly>
<component-container data-class="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-4">
<div class="vbox gap-2 items-center">
  <svg x-h-icon.calendar role="img" aria-label="calendar"></svg>
  <span>calendar</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.check role="img" aria-label="check"></svg>
  <span>check</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevron-down role="img" aria-label="chevron down"></svg>
  <span>chevron-down</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevron-left role="img" aria-label="chevron left"></svg>
  <span>chevron-left</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevron-right role="img" aria-label="chevron right"></svg>
  <span>chevron-right</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevrons-left role="img" aria-label="chevrons left"></svg>
  <span>chevrons-left</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevrons-right role="img" aria-label="chevrons right"></svg>
  <span>chevrons-right</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.clock role="img" aria-label="clock"></svg>
  <span>clock</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.search role="img" aria-label="search"></svg>
  <span>search</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.ellipsis role="img" aria-label="ellipsis"></svg>
  <span>ellipsis</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.minus role="img" aria-label="minus"></svg>
  <span>minus</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.plus role="img" aria-label="plus"></svg>
  <span>plus</span>
</div>
</component-container>
</ClientOnly>

```html
<svg x-h-icon.calendar role="img" aria-label="calendar"></svg>
<svg x-h-icon.check role="img" aria-label="check"></svg>
<svg x-h-icon.chevron-down role="img" aria-label="chevron down"></svg>
<svg x-h-icon.chevron-left role="img" aria-label="chevron left"></svg>
<svg x-h-icon.chevron-right role="img" aria-label="chevron right"></svg>
<svg x-h-icon.chevrons-left role="img" aria-label="chevrons left"></svg>
<svg x-h-icon.chevrons-right role="img" aria-label="chevrons right"></svg>
<svg x-h-icon.clock role="img" aria-label="clock"></svg>
<svg x-h-icon.search role="img" aria-label="search"></svg>
<svg x-h-icon.ellipsis role="img" aria-label="ellipsis"></svg>
<svg x-h-icon.minus role="img" aria-label="minus"></svg>
<svg x-h-icon.plus role="img" aria-label="plus"></svg>
```
