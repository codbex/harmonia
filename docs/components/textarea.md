# Textarea

Displays a textarea field. It should be paired with a label.

## API Reference

### Component attubute(s)

```
x-h-textarea
```

### Modifiers

| Modifier | Description                                     |
| -------- | ----------------------------------------------- |
| group    | Used when the textarea is inside an input group |

## Examples

<ClientOnly>
<component-container data-class="flex flex-col gap-4">
<textarea x-h-textarea placeholder="Comment..."></textarea>
</component-container>
</ClientOnly>

```html
<textarea x-h-textarea placeholder="Comment..."></textarea>
```

### Without resize handle

<br />

<ClientOnly>
<component-container>
<textarea x-h-textarea class="resize-none"></textarea>
</component-container>
</ClientOnly>

```html
<textarea x-h-textarea class="resize-none"></textarea>
```
