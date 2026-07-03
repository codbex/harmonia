# Sheet

The sheet component is a side panel that overlays the window content and is shown on one side of the screen. It can be used for displaying additional content like settings, input forms, cookie notices or other components like a [Sidebar](/components/sidebar).

## Usage

Use sheets to present supplementary information or interactive content without navigating away from the main interface. Avoid overloading sheets with too much content, as the available space is limited.

## API Reference

### Component attribute(s)

```
x-h-sheet
x-h-sheet-overlay
```

### Attributes

#### x-h-sheet-overlay

| Attribute | Type    | Required | Description                                                                                                               |
| --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `self`    | boolean | true     | Show/hide the sheet. This is a two-way bind. When the user clicks on the overlay, the sheet will be automatically hidden. |

#### x-h-sheet

| Attribute  | Type                                      | Required | Description                                                  |
| ---------- | ----------------------------------------- | -------- | ------------------------------------------------------------ |
| data-align | `top`<br/>`right`<br/>`bottom`<br/>`left` | false    | Aligns the sheet to one side of the screen. Default is left. |

## Examples

### Sheet with Sidebar

<ClientOnly>
<component-container src="/components/sheet/with-sidebar.html">
</component-container>
</ClientOnly>

<<< @/public/components/sheet/with-sidebar.html

### Alignment

<ClientOnly>
<component-container>
<div x-data="{ isOpen: false, side: 'left' }">
  <div x-h-sheet-overlay="isOpen">
    <div x-h-sheet x-bind:data-align="side">
      <div class="flex flex-col gap-2 p-2">
        <button x-h-button x-on:click="side = 'top'">Top</button>
        <button x-h-button x-on:click="side = 'right'">Right</button>
        <button x-h-button x-on:click="side = 'bottom'">Bottom</button>
        <button x-h-button x-on:click="side = 'left'">Left</button>
        <button x-h-button x-on:click="isOpen = false">Close</button>
      </div>
    </div>
  </div>

<button x-h-button x-on:click="isOpen = true">Open</button>

</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ isOpen: false, side: 'left' }">
  <div x-h-sheet-overlay="isOpen">
    <div x-h-sheet :data-align="side">
      <div class="flex flex-col gap-2 p-2">
        <button x-h-button @click="side = 'top'">Top</button>
        <button x-h-button @click="side = 'right'">Right</button>
        <button x-h-button @click="side = 'bottom'">Bottom</button>
        <button x-h-button @click="side = 'left'">Left</button>
        <button x-h-button @click="isOpen = false">Close</button>
      </div>
    </div>
  </div>

  <button x-h-button @click="isOpen = true">Open</button>
</div>
```
