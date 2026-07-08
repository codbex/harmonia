# Progress

Visually represents the completion status of an ongoing operation, providing users with feedback on progress and expected duration.

## Usage

Use progress bars to indicate the advancement of tasks such as uploads, downloads, or processing operations. Make sure the progress is updated in real time and, when possible, provide a percentage as an indicator of completion. Avoid using progress bars for indefinite tasks without feedback, as this can create uncertainty for users.

## API Reference

### Component attribute(s)

```
x-h-progress
```

### Attributes

| Attribute    | Type                                                         | Required | Description                                                            |
| ------------ | ------------------------------------------------------------ | -------- | ---------------------------------------------------------------------- |
| `self`       | number                                                       | true     | Sets the progress. Used as %.                                          |
| data-type    | `line`<br />`circle`                                         | false    | Renders the progress as a horizontal bar (default) or a circular ring. |
| data-loading | boolean                                                      | false    | Shows an indefinite loading animation instead of the value.            |
| data-variant | `positive`<br />`negative`<br />`warning`<br />`information` | false    | Semantic color state                                                   |

## Examples

<LiveExample data-class="vbox gap-4">

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

</LiveExample>

### Circle

<LiveExample data-class="flex items-center gap-6">

```html
<div x-h-progress="40" data-type="circle" style="width:6rem"></div>
<div x-h-progress="70" data-type="circle" data-variant="positive" style="width:6rem"></div>
```

</LiveExample>

### Circle with text

<LiveExample data-class="flex items-center gap-6">

```html
<div class="relative">
  <div x-h-progress="40" data-type="circle" style="width:5rem"></div>
  <span class="position-center absolute text-lg font-medium">40%</span>
</div>
```

</LiveExample>

### Loading

Set `data-loading` to show an indefinite animation when the completion amount is unknown. The line sweeps left to right and the circle spins.

<LiveExample data-class="vbox gap-6">

```html
<div x-h-progress="0" data-loading="true"></div>
<div x-h-progress="0" data-type="circle" data-loading="true" style="width:6rem"></div>
```

</LiveExample>
