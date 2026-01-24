# Split

A style-only component that provides a flexible layout for dividing content into resizable panes. It is designed to work alongside other libraries to implement split view functionality.

## Usage

Use Split when you need a side-by-side layout for content, such as editors, dashboards, or comparison panels. Avoid using Split for layouts where resizable content is unnecessary, as it may add unnecessary complexity.

## API Reference

### Component attubute(s)

```
x-h-split
x-h-split-panel
x-h-split-gutter
```

### Attributes

#### x-h-split

| Attribute        | Type                         | Required | Description                               |
| ---------------- | ---------------------------- | -------- | ----------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | true     | Orientation of the layout.                |
| data-variant     | `border`<br />`handle`       | false    | Style of the gutter. Default is `handle`. |
| data-locked      | boolean                      | false    | Locks/disables the handle.                |

## Examples

### Horizontal split (2 panels)

<br />

<ClientOnly>
<component-container data-style="height: 12rem">
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Left panel</div>
  </div>
  <div x-h-split-gutter></div>
  <div class="rounded-md border shadow-md" x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Right panel</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Left panel</div>
  </div>
  <div x-h-split-gutter></div>
  <div class="rounded-md border shadow-md" x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Right panel</div>
  </div>
</div>
```

### Vertical split (2 panels)

<br />

<ClientOnly>
<component-container data-style="height: 16rem">
<div class="size-full" x-h-split data-orientation="vertical" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel style="height: 100%">
    <div class="flex size-full items-center justify-center">Left panel</div>
  </div>
  <div x-h-split-gutter></div>
  <div class="rounded-md border shadow-md" x-h-split-panel style="height: 100%">
    <div class="flex size-full items-center justify-center">Right panel</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel style="height: 100%">
    <div class="flex size-full items-center justify-center">Left panel</div>
  </div>
  <div x-h-split-gutter></div>
  <div class="rounded-md border shadow-md" x-h-split-panel style="height: 100%">
    <div class="flex size-full items-center justify-center">Right panel</div>
  </div>
</div>
```

### Border-style gutter

This is useful for split-window layouts. The gutter is visually thin but provides a wider interactive area for reliable mouse and touch interaction.

<ClientOnly>
<component-container data-padding="false" data-style="height: 12rem">
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="border" data-locked="false">
  <div x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Left panel</div>
  </div>
  <div x-h-split-gutter></div>
  <div x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Right panel</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="border" data-locked="false">
  <div x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Left panel</div>
  </div>
  <div x-h-split-gutter></div>
  <div x-h-split-panel style="width: 100%">
    <div class="flex size-full items-center justify-center">Right panel</div>
  </div>
</div>
```
