# Text

CSS utility classes to style text. It is recommended that you first look at the `h-text` component and use that if possible.

## Class names

| Class         | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| text-xs       | Extra small text (0.75rem / 12px).                                                  |
| text-sm       | Small text (0.875rem / 14px). Common for labels and secondary content.              |
| text-base     | Default body text size (1rem / 16px).                                               |
| text-lg       | Large text (1.125rem / 18px).                                                       |
| text-xl       | Extra large text (1.25rem / 20px).                                                  |
| text-left     | Aligns text to the left edge of its container.                                      |
| text-right    | Aligns text to the right edge of its container.                                     |
| text-center   | Centers text horizontally within its container.                                     |
| text-justify  | Stretches each line to fill the full width of its container.                        |
| text-ellipsis | Sets `text-overflow: ellipsis`. Requires `overflow-hidden` and `whitespace-nowrap`. |
| text-wrap     | Allows text to wrap onto multiple lines when it exceeds the container width.        |
| text-nowrap   | Prevents text from wrapping.                                                        |

| Class         | Description                                             |
| ------------- | ------------------------------------------------------- |
| font-bold     | Bold weight (700). Strong visual emphasis.              |
| font-semibold | Semi-bold weight (600). Moderate emphasis.              |
| font-medium   | Medium weight (500). Slightly heavier than normal.      |
| font-normal   | Normal/regular weight (400). The default body weight.   |
| font-light    | Light weight (300). Thinner strokes, softer appearance. |

| Class      | Description                                                                                |
| ---------- | ------------------------------------------------------------------------------------------ |
| font-sans  | Applies the application's sans-serif typeface. Standard choice for UI and body text.       |
| font-serif | Applies the application's serif typeface. Suited for headings and editorial content.       |
| font-mono  | Applies the application's monospace typeface. Used for code, paths, and technical strings. |

| Class               | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| italic              | Renders text in italic style.                                                                   |
| uppercase           | Transforms all characters to uppercase.                                                         |
| lowercase           | Transforms all characters to lowercase.                                                         |
| capitalize          | Capitalizes the first letter of each word.                                                      |
| truncate            | Combines `overflow: hidden`, `text-overflow: ellipsis`, and `white-space: nowrap` in one class. |
| align-middle        | Sets `vertical-align: middle`. Aligns an inline element to the middle of the surrounding text.  |
| whitespace-nowrap   | Prevents text from wrapping, equivalent to `white-space: nowrap`.                               |
| whitespace-pre      | Preserves whitespace and newlines; text does not wrap (`white-space: pre`).                     |
| whitespace-pre-wrap | Preserves whitespace and newlines; text wraps normally (`white-space: pre-wrap`).               |

## Examples

### Text size

<br />

<ClientOnly>
<component-container>
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">Extra large (x2)</p>
<p class="text-3xl">Extra large (x3)</p>
<p class="text-4xl">Extra large (x4)</p>
</component-container>
</ClientOnly>

```html
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">Extra large (x2)</p>
<p class="text-3xl">Extra large (x3)</p>
<p class="text-4xl">Extra large (x4)</p>
```
