# Split

The split component provides a flexible layout for dividing content into resizable panels.

### Key Features

- **Horizontal and Vertical Modes**
  Supports both horizontal and vertical orientations.

- **Automatic Gutter Generation**
  Gutters are created automatically between panels, eliminating manual setup and ensuring consistent spacing and resizing behavior.

- **Dynamic Panel Resizing**
  Panels can be resized interactively through draggable gutters, delivering a smooth and responsive user experience.

- **Flexible Size Constraints**
  Each panel supports configurable minimum and maximum sizes, defined in either pixels or percentages.

- **Initial Panel Sizing**
  Default panel sizes can be specified to control the initial layout state.

- **Panel Visibility Control**
  Panels can be programmatically shown or hidden, allowing dynamic layout adjustments based on user interaction or application state.

- **Locking Capabilities**
  Individual panels or the entire layout can be locked to prevent resizing.

## Usage

Use Split when you need a side-by-side layout for content, such as editors, dashboards, or comparison panels. Avoid using Split for layouts where resizable content is unnecessary, as it will only add complexity.

::: info Element hierarchy
The panel elements MUST be direct children of the split element. Otherwise, there will be some collisions with the styles.
:::

## API Reference

### Component attubute(s)

```
x-h-split
x-h-split-panel
```

### Attributes

#### x-h-split

| Attribute        | Type                         | Required | Description                                                      |
| ---------------- | ---------------------------- | -------- | ---------------------------------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | true     | Orientation of the layout.                                       |
| data-variant     | `border`<br />`handle`       | false    | Style of the gutter. Default is `handle`.                        |
| data-locked      | boolean                      | false    | Locks/disables the resize handles.                               |
| data-key         | string                       | false    | Stores the layout state in localStorage under the specified key. |

#### x-h-split-panel

| Attribute     | Type    | Required | Description                              |
| ------------- | ------- | -------- | ---------------------------------------- |
| data-collapse | boolean | false    | Collapses the panel to the minimum size. |
| data-hidden   | boolean | false    | Hides the panel.                         |
| data-locked   | boolean | false    | Locks/disables the resize handle.        |
| data-size     | boolean | false    | Initial size of the panel.               |
| data-min      | boolean | false    | Minimum size of the panel.               |
| data-max      | boolean | false    | Naximum size of the panel.               |

## Examples

### Horizontal split (2 panels)

<br />

<ClientOnly>
<component-container data-style="height: 12rem">
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Left panel</div>
  </div>
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Right panel</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Left panel</div>
  </div>
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Right panel</div>
  </div>
</div>
```

### Vertical split (2 panels)

<br />

<ClientOnly>
<component-container data-style="height: 16rem">
<div class="size-full" x-h-split data-orientation="vertical" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Top panel</div>
  </div>
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Bottom panel</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="size-full" x-h-split data-orientation="vertical" data-variant="handle" data-locked="false">
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Top panel</div>
  </div>
  <div class="rounded-md border shadow-md" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Bottom panel</div>
  </div>
</div>
```

### Border-style gutter

This is useful for split-window layouts. The gutter is visually thin but provides a wider interactive area for reliable mouse and touch interaction.

<ClientOnly>
<component-container data-padding="false" data-style="height: 12rem">
<div class="size-full" x-h-split data-orientation="vertical" data-variant="border" data-locked="false">
  <div x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Left panel</div>
  </div>
  <div x-h-split-panel >
    <div class="flex size-full items-center justify-center overflow-hidden">Right panel</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div class="size-full" x-h-split data-orientation="vertical" data-variant="border" data-locked="false">
  <div x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Left panel</div>
  </div>
  <div x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Right panel</div>
  </div>
</div>
```

### Hide panels based on screen size

You can use the [Breakpoint Listener](/utilities/breakpoint-listener) in order to hide a panel (or panels) based on screen size.
In the following example, the left and right panels will hide if the screen is less then 1024 pixels wide.

<ClientOnly>
<component-container data-padding="false" data-style="height: 16rem" data-html="/components/layout/layout.html">
</component-container>
</ClientOnly>

```html
<div x-data="app" class="size-full">
  <div x-h-split class="size-full" data-orientation="horizontal" data-variant="border">
    <div x-h-split-panel :data-hidden="panelVisiblility.left">
      <div class="overflow-scroll">Left panel</div>
    </div>
    <div x-h-split-panel>
      <div class="overflow-scroll">Cener panel</div>
    </div>
    <div x-h-split-panel :data-hidden="panelVisiblility.right">
      <div class="overflow-scroll">Right panel</div>
    </div>
  </div>
</div>

<script>
  document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
      panelVisiblility: {
        left: true,
        right: true,
      },
      init() {
        const breakpointListener = getBreakpointListener((matches) => {
          this.panelVisiblility.left = matches;
          this.panelVisiblility.right = matches;
        }, 1024);
      },
    }));
  });
</script>
```

### Dynamically add/remove panels

You can use the `x-for` directive to add or remove panels dynamically.

<ClientOnly>
<component-container data-padding="false" data-style="height: 28rem" data-html="/components/layout/dynamic.html">
</component-container>
</ClientOnly>

```html
<div x-data="app" class="vbox size-full">
  <div x-h-toolbar>
    <button x-h-button data-variant="primary" @click="add()">Add</button>
    <div x-h-toolbar-spacer></div>
    <button x-h-button data-variant="negative" @click="remove()">Remove</button>
  </div>
  <div x-h-split data-orientation="vertical" data-variant="border">
    <template x-for="panel in panels" x-bind:key="panel.id">
      <div x-h-split-panel>
        <div class="overflow-scroll" x-text="panel.name"></div>
      </div>
    </template>
  </div>
</div>

<script>
  document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
      panels: [
        {
          name: 'Panel 1',
          id: 1,
        },
        {
          name: 'Panel 2',
          id: 2,
        },
      ],
      add() {
        this.panels.push({
          name: `Panel ${this.panels.length + 1}`,
          id: this.panels.length + 1,
        });
      },
      remove() {
        this.panels.pop();
      },
    }));
  });
</script>
```

### Dynamically create layout

You can use the [Template](/utilities/template) directive to create layouts dynamically.

<ClientOnly>
<component-container data-padding="false" data-style="height: 28rem" data-html="/components/layout/dynamic-recursive.html">
</component-container>
</ClientOnly>

```html
<div x-data="app" class="vbox size-full">
  <div x-h-split data-orientation="horizontal" data-variant="border">
    <template x-for="panel in panels" :key="panel.id">
      <template x-h-template="$refs.panelTemplate" x-data="{ panel: panel }"></template>
    </template>
    <template x-ref="panelTemplate">
      <div x-h-split-panel>
        <template x-if="panel.children">
          <div x-h-split data-orientation="vertical" data-variant="border">
            <template x-for="childPanel in panel.children" :key="childPanel.id">
              <template x-h-template="$refs.panelTemplate" x-data="{ panel: childPanel }"></template>
            </template>
          </div>
        </template>
        <template x-if="!panel.children">
          <div class="overflow-scroll" x-text="panel.name"></div>
        </template>
      </div>
    </template>
  </div>
</div>

<script>
  document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
      panels: [
        {
          name: 'Left',
          id: 1,
        },
        {
          id: 2,
          children: [
            {
              name: 'Top',
              id: 'top',
            },
            {
              name: 'Bottom',
              id: 'bottom',
            },
          ],
        },
        {
          name: 'Right',
          id: 3,
        },
      ],
    }));
  });
</script>
```
