# Button

Buttons can trigger an action or navigate the user to another location. They communicate intent through labeling, iconography and semantic styling.

## Usage

Use buttons to represent clear, intentional actions. Select the appropriate semantic variant to match the action’s intent, and use outline, transparent, or link variants for lower-emphasis actions. The primary button should be used for the main or suggested action. For example, the "Create" button on a "New File" dialog should be the primary one. Avoid overloading interfaces with too many primary buttons.

## API Reference

### Component attribute(s)

```
x-h-button
```

### Attributes

| Attribute    | Type                                                                                                                      | Required | Description                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline`<br />`transparent`<br />`link` | false    | Changes the color/shape of the button. Can be used to indicate different states.                           |
| data-size    | `sm`<br />`md`<br />`icon-sm`<br />`icon-md`<br />`icon`<br />`default`                                                   | false    | Changes the size of the button. When the button contains only an icon, the `icon-*` values should be used. |
| data-toggled | boolean                                                                                                                   | false    | Set the toggle state.                                                                                      |

### Modifiers

| Modifier | Description                                         |
| -------- | --------------------------------------------------- |
| addon    | Used when the button is inside an input group addon |

## Examples

### Default

<LiveExample>

```html
<button x-h-button>Default</button>
```

</LiveExample>

### Primary

<LiveExample>

```html
<button x-h-button data-variant="primary">Primary</button>
```

</LiveExample>

### Positive

<LiveExample>

```html
<button x-h-button data-variant="positive">Positive</button>
```

</LiveExample>

### Negative

<LiveExample>

```html
<button x-h-button data-variant="negative">Negative</button>
```

</LiveExample>

### Warning

<LiveExample>

```html
<button x-h-button data-variant="warning">Warning</button>
```

</LiveExample>

### Information

<LiveExample>

```html
<button x-h-button data-variant="information">Information</button>
```

</LiveExample>

### Outline

<LiveExample>

```html
<button x-h-button data-variant="outline">Outline</button>
```

</LiveExample>

### Transparent

<LiveExample>

```html
<button x-h-button data-variant="transparent">Transparent</button>
```

</LiveExample>

### Link

<LiveExample>

```html
<a x-h-button data-variant="link" href="#">Link</a>
```

</LiveExample>

### Toggle button

<LiveExample>

```html
<div x-data="{ toggled: true }">
  <button x-h-button :data-toggled="toggled" @click="toggled = !toggled">Toggle</button>
</div>
```

</LiveExample>

### Button with icons

You can include an icon directly inside the button.

<LiveExample data-class="flex flex-col items-center gap-4">

```html
<button x-h-button>
  <i x-h-lucide role="img" data-lucide="chevron-left"></i>
  Left-aligned
</button>
<button x-h-button>
  <i x-h-lucide role="img" data-lucide="chevron-right"></i>
  Right-aligned
</button>
<button x-h-button>
  <svg x-h-icon data-icon="search" role="img" aria-label="search"></svg>
  Search
</button>
```

</LiveExample>

### Button with spinner

You can include a spinner directly inside the button. The spinner will adjust its color based on the button variant.

<LiveExample data-class="flex gap-2">

```html
<button x-h-button>
  <span x-h-spinner></span>
  <span>Saving...</span>
</button>
<button x-h-button data-variant="primary">
  <span x-h-spinner></span>
  <span>Saving...</span>
</button>
```

</LiveExample>

### Icon button

<LiveExample data-class="flex flex-col items-center gap-4">

```html
<button x-h-button data-size="icon" aria-label="Icon button">
  <i x-h-lucide role="img" data-lucide="save"></i>
</button>
```

</LiveExample>

### Button sizes

#### Small

<LiveExample data-class="flex flex-col items-center gap-4">

```html
<button x-h-button data-size="sm">
  <i x-h-lucide role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-sm" aria-label="Icon button">
  <i x-h-lucide role="img" data-lucide="save"></i>
</button>
```

</LiveExample>

#### Medium

<LiveExample data-class="flex flex-col items-center gap-4">

```html
<button x-h-button data-size="md">
  <i x-h-lucide role="img" data-lucide="save"></i>
  Save
</button>
<button x-h-button data-size="icon-md" aria-label="Icon button">
  <i x-h-lucide role="img" data-lucide="save"></i>
</button>
```

</LiveExample>
