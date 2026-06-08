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

| Attribute    | Type                                                         | Required | Description                   |
| ------------ | ------------------------------------------------------------ | -------- | ----------------------------- |
| `self`       | number                                                       | true     | Sets the progress. Used as %. |
| data-variant | `positive`<br />`negative`<br />`warning`<br />`information` | false    | Semantic color state          |

## Examples

<ClientOnly>
<component-container data-class="vbox gap-4">
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
</component-container>
</ClientOnly>

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
