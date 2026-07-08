# Menubar

A horizontal bar of always-visible command menus, like the "File Edit View" menus found in desktop applications. Each top-level item opens a dropdown [Menu](/components/menu). Unlike the [Navigation Menu](/components/navigation-menu), a menubar is not used for site navigation but for grouping actions that must stay easily accessible.

## Usage

Place a `x-h-menubar-trigger` button next to a `x-h-menu` inside each `x-h-menubar-item` to get a dropdown per top-level item. All dropdowns are powered by the existing Menu component, so all menu features - submenus, labels, separators, checkbox and radio items - are available inside them. Clicking a trigger toggles its menu. While a menu is open, hovering or focusing a sibling trigger switches to that menu without an extra click, just like in desktop applications.

::: info aria-label is required
`x-h-menubar` requires an `aria-label` attribute so assistive technologies can announce what the menubar controls.
:::

## Keyboard Handling

The menubar is a single Tab stop. Once it has focus, the top-level items are operated with the keys below:

- `Left` / `Right` - Moves focus to the previous or next top-level item, wrapping around. If a menu is open, the newly focused item's menu opens instead.
- `Down` / `Enter` / `Space` - Opens the focused item's menu and moves focus to its first item.
- `Up` - Opens the focused item's menu and moves focus to its last item.
- `Home` / `End` - Moves focus to the first or last top-level item.

Once a menu is open, the full Menu keyboard handling applies:

- `Up` / `Down` - Moves focus to the previous or next menu item.
- `Right` - Opens a submenu (if present) and moves focus to its first item. Otherwise closes the menu and opens the next top-level menu.
- `Left` - Closes the current submenu and moves focus to its parent item. At the top level of a menu it opens the previous top-level menu.
- `Home` / `PageUp` - Moves focus to the first item in the menu.
- `End` / `PageDown` - Moves focus to the last item in the menu.
- `Enter` / `Space` - Activates the focused menu item.
- `Esc` - Closes the menu or submenu and returns focus to the trigger.
- `Tab` - Closes the menu and moves focus to the next element.
- `Character keys (A-Z)` - Moves focus to the next item whose label starts with the typed character.

## Accessibility

The menubar follows the WAI-ARIA menubar pattern. The bar has `role="menubar"` with horizontal orientation, every trigger is a `menuitem` that reports its popup state through `aria-haspopup` and `aria-expanded`, and a roving tab stop keeps the whole bar a single entry in the page's Tab order.

## API Reference

### Component attribute(s)

```
x-h-menubar
x-h-menubar-item
x-h-menubar-trigger
```

::: info Trigger and menu placement
`x-h-menubar-trigger` acts as a menu trigger for the `x-h-menu` that follows it. The `x-h-menu` must be placed somewhere after the `x-h-menubar-trigger` and they must share the same direct parent (`x-h-menubar-item`). Do not add `x-h-menu-trigger` as the menubar trigger sets up the trigger interface itself.
:::

### Attributes

#### x-h-menubar

| Attribute    | Type                        | Required | Description                                                                 |
| ------------ | --------------------------- | -------- | --------------------------------------------------------------------------- |
| aria-label   | string                      | true     | Labels the menubar. Required for ARIA compliance.                           |
| data-variant | `outline`<br/>`default`     | false    | Changes the visual style of the menubar.                                    |
| data-size    | `sm`<br/>`md`<br/>`default` | false    | Changes the size of the menubar triggers. The sizes match the button sizes. |

## Examples

### Basic

<LiveExample data-class="flex flex-col items-start">

```html
<ul x-h-menubar aria-label="Text editor">
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>File</button>
    <ul x-h-menu>
      <li x-h-menu-item>New File <span x-h-menu-item-secondary>Ctrl+N</span></li>
      <li x-h-menu-item>Open <span x-h-menu-item-secondary>Ctrl+O</span></li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Save <span x-h-menu-item-secondary>Ctrl+S</span></li>
      <li x-h-menu-item>Save As <span x-h-menu-item-secondary>Ctrl+Shift+S</span></li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Exit</li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Edit</button>
    <ul x-h-menu>
      <li x-h-menu-item>Undo <span x-h-menu-item-secondary>Ctrl+Z</span></li>
      <li x-h-menu-item>Redo <span x-h-menu-item-secondary>Ctrl+Y</span></li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Cut <span x-h-menu-item-secondary>Ctrl+X</span></li>
      <li x-h-menu-item>Copy <span x-h-menu-item-secondary>Ctrl+C</span></li>
      <li x-h-menu-item>Paste <span x-h-menu-item-secondary>Ctrl+V</span></li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Help</button>
    <ul x-h-menu>
      <li x-h-menu-item>Documentation</li>
      <li x-h-menu-item>Check for Updates</li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>About</li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Outline

The `outline` variant wraps the menubar in a border. The first and last triggers round only their outer corners so they align with the border.

<LiveExample data-class="flex flex-col items-start">

```html
<ul x-h-menubar aria-label="Text editor" data-variant="outline">
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>File</button>
    <ul x-h-menu>
      <li x-h-menu-item>New File <span x-h-menu-item-secondary>Ctrl+N</span></li>
      <li x-h-menu-item>Open <span x-h-menu-item-secondary>Ctrl+O</span></li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Save <span x-h-menu-item-secondary>Ctrl+S</span></li>
      <li x-h-menu-item>Save As <span x-h-menu-item-secondary>Ctrl+Shift+S</span></li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Exit</li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Edit</button>
    <ul x-h-menu>
      <li x-h-menu-item>Undo <span x-h-menu-item-secondary>Ctrl+Z</span></li>
      <li x-h-menu-item>Redo <span x-h-menu-item-secondary>Ctrl+Y</span></li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Cut <span x-h-menu-item-secondary>Ctrl+X</span></li>
      <li x-h-menu-item>Copy <span x-h-menu-item-secondary>Ctrl+C</span></li>
      <li x-h-menu-item>Paste <span x-h-menu-item-secondary>Ctrl+V</span></li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Help</button>
    <ul x-h-menu>
      <li x-h-menu-item>Documentation</li>
      <li x-h-menu-item>Check for Updates</li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>About</li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Sizes

The `data-size` attribute changes the height of the triggers and matches the button sizes.

<LiveExample data-class="flex flex-col items-start gap-3" data-exclude="generator">

```html
<ul x-h-menubar aria-label="Default size" data-variant="outline">
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>File</button>
    <ul x-h-menu>
      <li x-h-menu-item>New Note</li>
      <li x-h-menu-item>Duplicate</li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Edit</button>
    <ul x-h-menu>
      <li x-h-menu-item>Undo</li>
      <li x-h-menu-item>Redo</li>
    </ul>
  </li>
</ul>
<ul x-h-menubar aria-label="Medium size" data-variant="outline" data-size="md">
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>File</button>
    <ul x-h-menu>
      <li x-h-menu-item>New Note</li>
      <li x-h-menu-item>Duplicate</li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Edit</button>
    <ul x-h-menu>
      <li x-h-menu-item>Undo</li>
      <li x-h-menu-item>Redo</li>
    </ul>
  </li>
</ul>
<ul x-h-menubar aria-label="Small size" data-variant="outline" data-size="sm">
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>File</button>
    <ul x-h-menu>
      <li x-h-menu-item>New Note</li>
      <li x-h-menu-item>Duplicate</li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>Edit</button>
    <ul x-h-menu>
      <li x-h-menu-item>Undo</li>
      <li x-h-menu-item>Redo</li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### With submenus and checkbox items

<LiveExample data-class="flex flex-col items-start">

```html
<ul x-h-menubar aria-label="Project" x-data="{ view: { statusbar: true, minimap: false } }">
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>File</button>
    <ul x-h-menu>
      <li x-h-menu-item>New Project</li>
      <li x-h-menu-sub>
        <span>Open Recent</span>
        <ul x-h-menu.sub>
          <li x-h-menu-item>harmonia</li>
          <li x-h-menu-item>website</li>
          <li x-h-menu-item>playground</li>
        </ul>
      </li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item data-variant="negative">Close Project</li>
    </ul>
  </li>
  <li x-h-menubar-item>
    <button x-h-menubar-trigger>View</button>
    <ul x-h-menu>
      <div x-h-menu-label>Appearance</div>
      <div x-h-menu-checkbox-item x-model="view.statusbar">Status Bar</div>
      <div x-h-menu-checkbox-item x-model="view.minimap">Minimap</div>
      <div x-h-menu-separator></div>
      <li x-h-menu-item>Zoom In <span x-h-menu-item-secondary>Ctrl++</span></li>
      <li x-h-menu-item>Zoom Out <span x-h-menu-item-secondary>Ctrl+-</span></li>
    </ul>
  </li>
</ul>
```

</LiveExample>
