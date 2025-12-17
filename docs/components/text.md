# Text

Applies styles to headings and text sections.

## API Reference

### Component attubute(s)

```
x-h-text
```

### Modifiers

| Modifier    | Description                                                      |
| ----------- | ---------------------------------------------------------------- |
| h\{1-6\}    | Applies a heading style to the element. Sizes 1 to 6.            |
| blockquote  | Applies a quotation style to the element.                        |
| code-inline | Applies an inline code block style (single line) to the element. |
| code        | Applies a code block style (multiline) to the element.           |
| lead        | Applies a lead style to the element.                             |
| lg          | Large text                                                       |
| sm          | Small text                                                       |
| xs          | Extra small text                                                 |
| muted       | Applies a muted style to the element. Can be used on a label.    |

## Examples

<ClientOnly>
<component-container data-class="flex flex-col gap-4">
<p x-h-text.h1>Heading 1</p>
<p x-h-text.h2>Heading 2</p>
<p x-h-text.h3>Heading 3</p>
<p x-h-text.h4>Heading 4</p>
<p x-h-text.h5>Heading 5</p>
<p x-h-text.h6>Heading 6</p>
<p x-h-text.blockquote>A quote from a comment</p>
<p x-h-text.code-inline>console.log('Hello, Harmonia!');</p>
<p x-h-text.code x-text="`function sayHello() {
  console.log('Hello, Harmonia!');
}`"></p>
<p x-h-text.lead>Lead text</p>
<p x-h-text.lg>Large text</p>
<p x-h-text>Normal text</p>
<p x-h-text.sm>Small text</p>
<p x-h-text.xs>Extra small text</p>
<p x-h-text.muted>Muted text</p>
</component-container>
</ClientOnly>

```html
<p x-h-text.h1>Heading 1</p>
<p x-h-text.h2>Heading 2</p>
<p x-h-text.h3>Heading 3</p>
<p x-h-text.h4>Heading 4</p>
<p x-h-text.h5>Heading 5</p>
<p x-h-text.h6>Heading 6</p>
<p x-h-text.blockquote>A quote from a comment</p>
<p x-h-text.code-inline>console.log('Hello, Harmonia!');</p>
<p
  x-h-text.code
  x-text="`function sayHello() {
  console.log('Hello, Harmonia!');
}`"
></p>
<p x-h-text.lead>Lead text</p>
<p x-h-text.lg>Large text</p>
<p x-h-text>Normal text</p>
<p x-h-text.sm>Small text</p>
<p x-h-text.xs>Extra small text</p>
<p x-h-text.muted>Muted text</p>
```
