# Chip

A compact element used to represent an applied filter, a selected item, or a categorization. Chips support semantic color variants, an optional clickable body, and an optional close button for dismissal.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use chips to display user-generated input or active selections that can be reviewed and removed.

## Behavior

A chip is a container that holds its own controls, so it goes on an element that is not itself interactive, such as a `<div>`, a `<span>` or an `<li>`. A chip whose body is clickable puts `x-h-chip-button` on a `<button>` inside it, and a chip that can be dismissed adds `x-h-chip-close` on a `<button>` of its own. A chip needs neither, in which case it is a plain label.

Everything about the interaction (`@click`, `aria-pressed` and `disabled`) belongs on the buttons.

A label longer than the space available needs a `truncate` class of its own, since only the element holding the text can end it with an ellipsis.

## Directives

`x-h-chip` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-chip`
- `x-h-chip-button`
- `x-h-chip-close`

## API

### Attributes

#### x-h-chip

> Must not be applied to an interactive element such as a `<button>` or an `<a>`.

| Attribute    | Type                                                                                       | Required | Description    |
| ------------ | ------------------------------------------------------------------------------------------ | -------- | -------------- |
| data-variant | `primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline` | false    | Semantic color |

#### x-h-chip-close

> Must be applied to a `<button>` element.

| Attribute       | Type   | Required | Description                                              |
| --------------- | ------ | -------- | -------------------------------------------------------- |
| aria-label      | string | true\*   | Accessible label for the close action                    |
| aria-labelledby | string | true\*   | References an element whose text labels the close action |

> **Note:** \* One of `aria-label` or `aria-labelledby` is required.

## Keyboard Handling

A chip's controls are ordinary buttons, so `Tab` reaches each of them in the order they appear and `Enter` / `Space` activates the one that has focus. A dismissible chip is therefore two tab stops, and a `disabled` control is skipped like any other.

## Accessibility

The chip itself takes no role, since it is a container rather than a control, which leaves its buttons to be announced as buttons.

The close button holds nothing but an icon, so it needs its own `aria-label` or `aria-labelledby`. Name the thing being removed rather than the chip, so "Remove Marketing" instead of "Remove", which is what a screen reader user hears out of context.

A chip that toggles something carries `aria-pressed` on its button, which is announced as a pressed state and is styled for you.

## Examples

### Text-Only

```html
<div x-h-chip>Chip</div>
```

### Truncate Text

Give the element holding the label a `truncate` class.

```html
<div x-h-chip style="max-width:4rem">
  <span class="truncate">Truncate text</span>
</div>
```

### Icon & Text

```html
<div x-h-chip>
  <svg x-h-icon data-icon="mail" role="presentation"></svg>
  <span>Chip</span>
</div>
```

### Clickable

Put `x-h-chip-button` on a `<button>` inside the chip. A chip that toggles something carries `aria-pressed`.

```html
<div x-data="{ unread: false }">
  <div x-h-chip :data-variant="unread ? 'primary' : 'outline'">
    <button x-h-chip-button :aria-pressed="unread" @click="unread = !unread">Unread only</button>
  </div>
</div>
```

### Icon, Text & Close Button

```html
<div x-h-chip>
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### Clickable & Dismissible

The two buttons split the pill between them, each with an action of its own. These chips are applied filters, so the body turns its filter off and on while the close drops it altogether.

```html
<div x-data="{ filters: [{ label: 'Overdue', on: true }, { label: 'Unassigned', on: false }] }" class="flex gap-2">
  <template x-for="filter in filters" :key="filter.label">
    <div x-h-chip :data-variant="filter.on ? 'primary' : 'outline'">
      <button x-h-chip-button :aria-pressed="filter.on" @click="filter.on = !filter.on" x-text="filter.label"></button>
      <button x-h-chip-close :aria-label="'Remove ' + filter.label + ' filter'" @click="filters = filters.filter((f) => f !== filter)"></button>
    </div>
  </template>
</div>
```

### Outline Variant

```html
<div x-h-chip data-variant="outline">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### Primary Variant

```html
<div x-h-chip data-variant="primary">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### Information Variant

```html
<div x-h-chip data-variant="information">
  <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### Warning Variant

```html
<div x-h-chip data-variant="warning">
  <svg x-h-icon data-icon="circle-warning" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### Positive Variant

```html
<div x-h-chip data-variant="positive">
  <svg x-h-icon data-icon="circle-success" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### Negative Variant

```html
<div x-h-chip data-variant="negative">
  <svg x-h-icon data-icon="circle-error" role="presentation"></svg>
  <span>Chip</span>
  <button x-h-chip-close aria-label="remove chip"></button>
</div>
```

### With Popover

The popover panel goes inside the chip, after the button that opens it.

```html
<div x-h-chip data-variant="information">
  <button x-h-chip-button x-h-popover-trigger>
    <svg x-h-icon data-icon="circle-info" role="presentation"></svg>
    <span class="text-muted-foreground">Chip:</span>
    <span>Enabled</span>
  </button>
  <button x-h-chip-close aria-label="remove chip"></button>
  <div class="w-64 p-4" x-h-popover>Chip Popover</div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/chip.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
