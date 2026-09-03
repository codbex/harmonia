# Progress

Visually represents the completion status of an ongoing operation, providing users with feedback on progress and expected duration.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use progress bars to indicate the advancement of tasks such as uploads, downloads, or processing operations. Make sure the progress is updated in real time and, when possible, provide a percentage as an indicator of completion. Avoid using progress bars for indefinite tasks without feedback, as this can create uncertainty for users.

## Directive

- `x-h-progress`

## API

### Attributes

| Attribute    | Type                                                         | Required | Description                                                            |
| ------------ | ------------------------------------------------------------ | -------- | ---------------------------------------------------------------------- |
| `self`       | number                                                       | true     | Sets the progress. Used as %.                                          |
| data-type    | `line`<br />`circle`                                         | false    | Renders the progress as a horizontal bar (default) or a circular ring. |
| data-loading | boolean                                                      | false    | Shows an indefinite loading animation instead of the value.            |
| data-variant | `positive`<br />`negative`<br />`warning`<br />`information` | false    | Semantic color state                                                   |

## Accessibility

The component gives the element the `progressbar` role and keeps `aria-valuenow` in step with the value, alongside the fixed `aria-valuemin="0"` and `aria-valuemax="100"` that make a percentage meaningful. The value is clamped to that range and rounded, so it is announced the same way it is drawn.

With `data-loading` there is no value to announce, so `aria-valuenow` is dropped and `aria-busy="true"` takes its place. That is the difference between a screen reader saying the work is still running and it reading out a stalled zero. Toggling `data-loading` at runtime switches between the two.

Give the element an accessible name with `aria-label` or `aria-labelledby` when what it measures is not already clear from the text next to it.

## Examples

```html
<p x-h-text.muted>Default/Primary</p>
<div x-h-progress="40"></div>
<p x-h-text.muted>Information</p>
<div x-h-progress="40" data-variant="information"></div>
<p x-h-text.muted>Warning</p>
<div x-h-progress="40" data-variant="warning"></div>
<p x-h-text.muted>Positive</p>
<div x-h-progress="40" data-variant="positive"></div>
<p x-h-text.muted>Negative</p>
<div x-h-progress="40" data-variant="negative"></div>
```

### Circle

```html
<div x-h-progress="40" data-type="circle" style="width:6rem"></div>
<div x-h-progress="70" data-type="circle" data-variant="positive" style="width:6rem"></div>
```

### Circle with text

```html
<div class="relative">
  <div x-h-progress="40" data-type="circle" style="width:5rem"></div>
  <span class="position-center absolute text-lg font-medium">40%</span>
</div>
```

### Loading

Set `data-loading` to show an indefinite animation when the completion amount is unknown. The line sweeps left to right and the circle spins.

```html
<div x-h-progress="0" data-loading="true"></div>
<div x-h-progress="0" data-type="circle" data-loading="true" style="width:6rem"></div>
```

Full docs: https://www.codbex.com/harmonia/components/progress.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
