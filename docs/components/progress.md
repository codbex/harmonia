# Progress

Visually represents the completion status of an ongoing operation, providing users with feedback on progress and expected duration.

## Usage

Use progress bars to indicate the advancement of tasks such as uploads, downloads, or processing operations. Make sure the progress is updated in real time and, when possible, provide a percentage as an indicator of completion. Avoid using progress bars for indefinite tasks without feedback, as this can create uncertainty for users.

## API Reference

### Component attubute(s)

```
x-h-progress
```

### Attributes

| Attribute | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| `self`    | number | true     | Sets the progress. Used as %. |

## Examples

<ClientOnly>
<component-container data-class="flex flex-col items-center">
<div x-h-progress="40"></div>
</component-container>
</ClientOnly>

```html
<div x-h-progress="40"></div>
```
