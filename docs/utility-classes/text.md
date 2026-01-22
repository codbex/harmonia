# Text

CSS utility classes to style text. It is recommended that you first look at the `h-text` component and use that if possible.

## Class names

| Class         | Description                                |
| ------------- | ------------------------------------------ |
| text-xs       | Extra small font size.                     |
| text-sm       | Small font size.                           |
| text-base     | Normal font size.                          |
| text-lg       | Large font size.                           |
| text-xl       | Extra large font size.                     |
| text-left     | Align text to the left.                    |
| text-right    | Align text to the right.                   |
| text-center   | Align text to the center of the container. |
| text-justify  | Justify text.                              |
| text-ellipsis | Ellipsis on text overflow.                 |
| text-wrap     | Wrap text.                                 |
| text-nowrap   | Do not wrap text.                          |

| Class         | Description           |
| ------------- | --------------------- |
| font-bold     | Bold font weight.     |
| font-semibold | Semibold font weight. |
| font-medium   | Medium font weight.   |
| font-normal   | Normal font weight.   |
| font-light    | Light font weight.    |

| Class               | Description                                          |
| ------------------- | ---------------------------------------------------- |
| italic              | Italic font style.                                   |
| uppercase           | Transform text to be all in uppercase.               |
| lowercase           | Transform text to be all in lowercase.               |
| capitalize          | Capitalize words in text.                            |
| truncate            | Do not wrap text and use ellipsis when it overflows. |
| align-middle        | Align text in the middle of its container.           |
| whitespace-nowrap   | Prevent text from wrapping within its container.     |
| whitespace-pre      | Preserve newlines and spaces, no wrapping.           |
| whitespace-pre-wrap | Preserve newlines and spaces, wrap normally.         |

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
