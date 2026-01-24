# Spinner

A visual indicator that signals an ongoing operation or process. Unlike a progress bar, the spinner does not convey the completion status, only that work is in progress.

## Usage

Use spinners to indicate loading, processing, or other indefinite tasks where the duration is unknown. Avoid using spinners for very short operations, as brief displays can be distracting or unnecessary. Pair with text or context when needed to clarify what is loading.

## API Reference

### Component attubute(s)

```
x-h-spinner
```

## Examples

<ClientOnly>
<component-container data-class="flex flex-col items-center gap-4">
<span x-h-spinner></span>
<span x-h-spinner class="size-8"></span>
<span x-h-spinner class="size-12"></span>
</component-container>
</ClientOnly>

```html
<span x-h-spinner></span>
<span x-h-spinner class="size-8"></span>
<span x-h-spinner class="size-12"></span>
```
