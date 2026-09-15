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

## Behavior

- Panels take their `data-size` on first layout and panels without one divide the remaining space evenly. A `data-size` percentage is measured once, against the full size of the split.
- `data-min` and `data-max` are resolved again whenever the split changes size, so a percentage bound follows the container instead of pinning the panel at the width it had when it was created. A percentage here is measured against the space left once the gutters are subtracted. A panel is never made smaller than its own border and padding.
- Adding or removing a panel re-applies every panel's declared size, so sizes the user dragged are not carried across a structural change.
- Hiding a panel hands its space to the panels that stay visible. Showing it again restores the share it had before it was hidden.
- With `data-key` the sizes are written to `localStorage` shortly after each change, and restored on the next load when the same number of panels is visible.

## Keyboard Handling

Each gutter is a tab stop. When a gutter is focused:

- `Left` / `Right` - Move the gutter of a horizontal split by 10 pixels.
- `Up` / `Down` - Move the gutter of a vertical split by 10 pixels.
- `Shift` + arrow - Move the gutter by 100 pixels.
- `Home` - Move the gutter as far towards the start as the two panels allow.
- `End` - Move the gutter as far towards the end as the two panels allow.

A locked gutter is skipped by `Tab` and ignores these keys.

## Accessibility

Every gutter has its role set to "separator" with `aria-orientation` set across the split axis. The default accessible name is "Resize panel" and you can override it with the `data-gutter-label` attribute on the panel before it. The `aria-valuenow`, `aria-valuemin` and `aria-valuemax` are automatically set, indicating that panel's share of the space it divides with the next one, in percent. A locked gutter carries `aria-disabled="true"`.

## API Reference

### Component attribute(s)

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

| Attribute         | Type                     | Required | Description                                                              |
| ----------------- | ------------------------ | -------- | ------------------------------------------------------------------------ |
| data-collapse     | boolean                  | false    | Collapses the panel to its minimum size                                  |
| data-gutter-label | string                   | false    | Accessible name of the panel's resize handle. Default is `Resize panel`. |
| data-gutterless   | boolean                  | false    | Removes the resize handle. Usually paired with `data-locked`.            |
| data-hidden       | boolean                  | false    | Hides the panel.                                                         |
| data-locked       | boolean                  | false    | Locks/disables the panel's resize handle (the gutter after it).          |
| data-size         | number<br />`percentage` | false    | Initial size of the panel, in pixels (`320`) or percentage (`30%`).      |
| data-min          | number<br />`percentage` | false    | Minimum size of the panel, in pixels or as percentage.                   |
| data-max          | number<br />`percentage` | false    | Maximum size of the panel, in pixels or as percentage.                   |

## Examples

### Horizontal split (2 panels)

<LiveExample data-style="height: 12rem" data-exclude="generator">

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

</LiveExample>

### Vertical split (2 panels)

<LiveExample data-style="height: 16rem">

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

</LiveExample>

### Border-style gutter

This is useful for split-window layouts. The gutter is visually thin but provides a wider interactive area for reliable mouse and touch interaction.

<LiveExample data-class="p-0" data-style="height: 12rem">

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

</LiveExample>

### Switch the gutter style dynamically

<LiveExample data-class="p-0" data-style="height: 16rem">

```html
<div x-data="{ variant: 'handle' }" class="vbox size-full">
  <div x-h-toolbar>
    <button x-h-button data-variant="primary" @click="variant = variant === 'handle' ? 'border' : 'handle'" x-text="variant === 'handle' ? 'Use the border gutter' : 'Use the handle gutter'"></button>
  </div>
  <div x-h-split data-orientation="horizontal" :data-variant="variant">
    <div x-h-split-panel data-min="80">
      <div class="flex size-full items-center justify-center overflow-hidden">Left panel</div>
    </div>
    <div x-h-split-panel data-min="80">
      <div class="flex size-full items-center justify-center overflow-hidden">Right panel</div>
    </div>
  </div>
</div>
```

</LiveExample>

### Panel sizes and constraints

Sizes are set as pixels or as a percentage of the split. A panel without `data-size` takes an equal share of what is left. Dragging a gutter stops at each panel's minimum and maximum.

<LiveExample data-style="height: 12rem">

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle">
  <div class="rounded-md border shadow-md" x-h-split-panel data-size="200" data-min="120">
    <div class="flex size-full items-center justify-center overflow-hidden">200px, at least 120px</div>
  </div>
  <div class="rounded-md border shadow-md" x-h-split-panel data-min="15%">
    <div class="flex size-full items-center justify-center overflow-hidden">Takes the rest, at least 15%</div>
  </div>
  <div class="rounded-md border shadow-md" x-h-split-panel data-size="25%" data-max="40%">
    <div class="flex size-full items-center justify-center overflow-hidden">25%, at most 40%</div>
  </div>
</div>
```

</LiveExample>

### Fixed panel without a gutter

`data-gutterless` removes a panel's own resize handle. The first panel here has no handle after it, so it keeps the 200 pixels it was given while the other two share what is left.

<LiveExample data-style="height: 12rem">

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="handle">
  <div class="border" x-h-split-panel data-gutterless="true" data-size="200">
    <div class="flex size-full items-center justify-center overflow-hidden">Fixed 200px</div>
  </div>
  <div class="border" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Resizable</div>
  </div>
  <div class="border" x-h-split-panel>
    <div class="flex size-full items-center justify-center overflow-hidden">Resizable</div>
  </div>
</div>
```

</LiveExample>

### Collapse a panel

`data-collapse` snaps the panel to its `data-min` and remembers the size it had, so clearing the attribute restores it. The gutter can still drag the panel open, which leaves the attribute as it is.

<LiveExample data-class="p-0" data-style="height: 16rem">

```html
<div x-data="{ collapsed: true }" class="vbox size-full">
  <div x-h-toolbar>
    <button x-h-button data-variant="primary" @click="collapsed = !collapsed" x-text="collapsed ? 'Expand' : 'Collapse'"></button>
  </div>
  <div x-h-split data-orientation="horizontal" data-variant="border">
    <div x-h-split-panel data-size="240" data-min="56" :data-collapse="collapsed">
      <div class="flex size-full items-center justify-center overflow-hidden">Sidebar</div>
    </div>
    <div x-h-split-panel>
      <div class="flex size-full items-center justify-center overflow-hidden">Main panel</div>
    </div>
  </div>
</div>
```

</LiveExample>

### Lock the layout

`data-locked` on the split disables every gutter. When placed on a single panel, it disables only the gutter after that panel. The layout below starts locked and unlocking it leaves the first panel's own lock in place, so only the boundary between the second and third panel moves.

<LiveExample data-class="p-0" data-style="height: 16rem">

```html
<div x-data="{ locked: true }" class="vbox size-full">
  <div x-h-toolbar>
    <button x-h-button data-variant="primary" @click="locked = !locked" x-text="locked ? 'Unlock the layout' : 'Lock the layout'"></button>
  </div>
  <div x-h-split data-orientation="horizontal" data-variant="handle" :data-locked="locked">
    <div x-h-split-panel data-locked="true">
      <div class="flex size-full items-center justify-center overflow-hidden">Locked</div>
    </div>
    <div x-h-split-panel>
      <div class="flex size-full items-center justify-center overflow-hidden">Resizable</div>
    </div>
    <div x-h-split-panel>
      <div class="flex size-full items-center justify-center overflow-hidden">Resizable</div>
    </div>
  </div>
</div>
```

</LiveExample>

### Nested splits

<LiveExample data-class="p-0" data-style="height: 16rem">

```html
<div class="size-full" x-h-split data-orientation="horizontal" data-variant="border">
  <div x-h-split-panel data-size="30%" data-min="15%">
    <div class="flex size-full items-center justify-center overflow-hidden">Left panel</div>
  </div>
  <div x-h-split-panel>
    <div class="size-full" x-h-split data-orientation="vertical" data-variant="border">
      <div x-h-split-panel>
        <div class="flex size-full items-center justify-center overflow-hidden">Top panel</div>
      </div>
      <div x-h-split-panel data-min="80">
        <div class="flex size-full items-center justify-center overflow-hidden">Bottom panel, at least 80px tall</div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Hide panels based on screen size

You can use the [Breakpoint Listener](/utilities/breakpoint-listener) in order to hide a panel (or panels) based on screen size.
In the following example, the left and right panels will hide if the screen is less than 1024 pixels wide.

<LiveExample data-class="p-0" data-style="height: 16rem" data-exclude="generator">

```html
<div x-data="ResponsiveSplitController" class="size-full">
  <div x-h-split class="size-full" data-orientation="horizontal" data-variant="border">
    <div x-h-split-panel :data-hidden="panelVisibility.left">
      <div class="overflow-auto">Left panel</div>
    </div>
    <div x-h-split-panel>
      <div class="overflow-auto">Center panel</div>
    </div>
    <div x-h-split-panel :data-hidden="panelVisibility.right">
      <div class="overflow-auto">Right panel</div>
    </div>
  </div>
</div>

<script type="text/javascript">
  Alpine.data('ResponsiveSplitController', () => ({
    panelVisibility: {
      left: true,
      right: true,
    },
    init() {
      const breakpointListener = Harmonia.getBreakpointListener((matches) => {
        this.panelVisibility.left = matches;
        this.panelVisibility.right = matches;
      }, 1024);
    },
  }));
</script>
```

</LiveExample>

### Dynamically add/remove panels

You can use the `x-for` directive to add or remove panels dynamically.

<LiveExample data-class="p-0" data-style="height: 36rem" data-exclude="generator">

```html
<div x-data="DynamicSplitController" class="vbox size-full">
  <div x-h-toolbar>
    <button x-h-button data-variant="primary" @click="add()">Add</button>
    <div x-h-toolbar-spacer></div>
    <button x-h-button data-variant="negative" @click="remove()">Remove</button>
  </div>
  <div x-h-split data-orientation="vertical" data-variant="border">
    <template x-for="panel in panels" x-bind:key="panel.id">
      <div x-h-split-panel>
        <div class="overflow-auto" x-text="panel.name"></div>
      </div>
    </template>
  </div>
</div>

<script>
  Alpine.data('DynamicSplitController', () => ({
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
</script>
```

</LiveExample>

### Dynamically create layout

You can use the [Template](/utilities/template) directive to create layouts dynamically and recursively (nested panels).

<LiveExample data-class="p-0" data-style="height: 28rem" data-exclude="generator">

```html
<div x-data="RecursiveSplitController" class="vbox size-full">
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
          <div class="overflow-auto" x-text="panel.name"></div>
        </template>
      </div>
    </template>
  </div>
</div>

<script>
  Alpine.data('RecursiveSplitController', () => ({
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
</script>
```

</LiveExample>
