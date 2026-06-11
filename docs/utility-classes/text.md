# Text

CSS utility classes to style text. It is recommended that you first look at the `h-text` component and use that if possible.

## Class names

Text size classes also support responsive prefixes `sm:`, `md:`, `lg:`, and `xl:` (e.g. `md:text-lg`). Responsive variants do not support the `!` modifier.

| Class     | Description                                                            | `!` support |
| --------- | ---------------------------------------------------------------------- | ----------- |
| text-xs   | Extra small text (0.75rem / 12px).                                     | Yes         |
| text-sm   | Small text (0.875rem / 14px). Common for labels and secondary content. | Yes         |
| text-base | Default body text size (1rem / 16px).                                  | Yes         |
| text-lg   | Large text (1.125rem / 18px).                                          | Yes         |
| text-xl   | Extra large text (1.25rem / 20px).                                     | Yes         |
| text-2xl  | 1.5rem / 24px.                                                         | Yes         |
| text-3xl  | 1.875rem / 30px.                                                       | Yes         |
| text-4xl  | 2.25rem / 36px.                                                        | Yes         |
| text-5xl  | 3rem / 48px.                                                           | Yes         |
| text-6xl  | 3.75rem / 60px.                                                        | Yes         |
| text-7xl  | 4.5rem / 72px.                                                         | Yes         |
| text-8xl  | 6rem / 96px.                                                           | Yes         |
| text-9xl  | 8rem / 128px.                                                          | Yes         |

| Class         | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| text-left     | Aligns text to the left edge of its container.                                      |
| text-right    | Aligns text to the right edge of its container.                                     |
| text-center   | Centers text horizontally within its container.                                     |
| text-justify  | Stretches each line to fill the full width of its container.                        |
| text-ellipsis | Sets `text-overflow: ellipsis`. Requires `overflow-hidden` and `whitespace-nowrap`. |
| text-wrap     | Allows text to wrap onto multiple lines when it exceeds the container width.        |
| text-nowrap   | Prevents text from wrapping.                                                        |

| Class          | Description                                             | `!` support |
| -------------- | ------------------------------------------------------- | ----------- |
| font-extrabold | Extra bold weight (800). Maximum emphasis.              | Yes         |
| font-bold      | Bold weight (700). Strong visual emphasis.              | Yes         |
| font-semibold  | Semi-bold weight (600). Moderate emphasis.              | Yes         |
| font-medium    | Medium weight (500). Slightly heavier than normal.      | Yes         |
| font-normal    | Normal/regular weight (400). The default body weight.   | Yes         |
| font-light     | Light weight (300). Thinner strokes, softer appearance. | Yes         |

| Class      | Description                                                                                | `!` support |
| ---------- | ------------------------------------------------------------------------------------------ | ----------- |
| font-sans  | Applies the application's sans-serif typeface. Standard choice for UI and body text.       | Yes         |
| font-serif | Applies the application's serif typeface. Suited for headings and editorial content.       | Yes         |
| font-mono  | Applies the application's monospace typeface. Used for code, paths, and technical strings. | Yes         |

| Class           | Description                                      | `!` support |
| --------------- | ------------------------------------------------ | ----------- |
| leading-none    | `line-height: 1` — no extra space between lines. | Yes         |
| leading-tight   | `line-height: var(--leading-tight)` (1.2).       | Yes         |
| leading-normal  | `line-height: var(--leading-normal)`             | Yes         |
| leading-snug    | `line-height: var(--leading-snug)`               | Yes         |
| leading-relaxed | `line-height: var(--leading-relaxed)`            | Yes         |
| leading-4       | `line-height: calc(var(--spacing) * 4)`          | Yes         |
| leading-5       | `line-height: calc(var(--spacing) * 5)`          | Yes         |
| leading-6       | `line-height: calc(var(--spacing) * 6)`          | Yes         |
| leading-7       | `line-height: calc(var(--spacing) * 7)`          | Yes         |
| leading-8       | `line-height: calc(var(--spacing) * 8)`          | Yes         |

| Class               | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| italic              | Renders text in italic style.                                                                   |
| underline           | Underlines the text (`text-decoration: underline`).                                             |
| no-underline        | Removes text underline (`text-decoration: none`).                                               |
| line-through        | Strikes through the text (`text-decoration: line-through`).                                     |
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

<ClientOnly>
<component-container data-class="vbox gap-2">
<p class="text-xs">Extra small</p>
<p class="text-sm">Small</p>
<p class="text-base">Base</p>
<p class="text-lg">Large</p>
<p class="text-xl">Extra large</p>
<p class="text-2xl">Extra large (x2)</p>
<p class="text-3xl">Extra large (x3)</p>
<p class="text-4xl">Extra large (x4)</p>
<p class="text-5xl">Extra large (x5)</p>
<p class="text-6xl">Extra large (x6)</p>
<p class="text-7xl">Extra large (x7)</p>
<p class="text-8xl">Extra large (x8)</p>
<p class="text-9xl">Extra large (x9)</p>
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
<p class="text-5xl">Extra large (x5)</p>
<p class="text-6xl">Extra large (x6)</p>
<p class="text-7xl">Extra large (x7)</p>
<p class="text-8xl">Extra large (x8)</p>
<p class="text-9xl">Extra large (x9)</p>
```

### Line Height

<ClientOnly>
<component-container data-class="vbox gap-2 divide-y">
<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-none</p>
    <p class="leading-none">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-tight</p>
    <p class="leading-tight">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-snug</p>
    <p class="leading-snug">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-relaxed</p>
    <p class="leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-4</p>
    <p class="leading-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-6</p>
    <p class="leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>

<div class="py-2">
    <p class="font-medium text-muted-foreground">leading-8</p>
    <p class="leading-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
</div>
</component-container>
</ClientOnly>

```html
<p class="leading-none">...</p>
<p class="leading-tight">...</p>
<p class="leading-snug">...</p>
<p class="leading-relaxed">...</p>
<p class="leading-4">...</p>
<p class="leading-6">...</p>
<p class="leading-8">...</p>
```
