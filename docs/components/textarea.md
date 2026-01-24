# Textarea

Provides a multi-line input field for users to enter longer text. Textareas should always be paired with a label to clearly communicate the expected content and ensure accessibility.

## Usage

Use textareas for capturing extended input, such as comments, descriptions, or messages. The label should be descriptive. Provide optional hints or validation to guide proper entry. Avoid leaving textareas unlabeled, as this can confuse users and reduce accessibility.

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
