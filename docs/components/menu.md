# Menu

A structured list of options, optionally including headers, used to create navigational menus, context menus, or dropdowns. Menus organize actions or links in a clear and accessible way.

## Usage

Use menus to present a set of related actions or navigation links. Menu items should be clearly labeled and grouped logically.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the menu:

- `Up` / `Down` - Moves focus to the previous or next menu item.
- `Right` - Opens a submenu (if present) and moves focus to its first item.
- `Left` - Closes the current submenu and moves focus to its parent item.
- `Home` / `PageUp` - Moves focus to the first item in the menu.
- `End` / `PageDown` - Moves focus to the last item in the menu.
- `Enter` / `Space` - Activates the focused menu item.
- `Esc` - Closes the menu or submenu and returns focus to the controlling element.
- `Tab` - Closes the menu and submenus and sets focus to the next element.
- `Character keys (A-Z)` - Moves focus to the next item whose label starts with the typed character.

## API Reference

### Component attribute(s)

```
x-h-menu
x-h-menu-trigger
x-h-menu-item
x-h-menu-sub
x-h-menu-item-secondary
x-h-menu-separator
x-h-menu-label
x-h-menu-checkbox-item
x-h-menu-radio-item
```

::: info Trigger and menu placement
The `x-h-menu` element must be placed somewhere AFTER the `x-h-menu-trigger` and they must have the same direct parent. Otherwise, the menu will not be able to find the trigger.
:::

### Attributes

#### x-h-menu

| Attribute        | Type                                                                                                                                                                          | Required | Description                                                                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-align       | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the menu relative to the cursor or relative to the trigger if in dropdown mode.                                                                                                                                 |
| data-innerclicks | boolean                                                                                                                                                                       | false    | Prevents the menu from closing when there is a click inside it.<br/>Enabling or disabling this option on a menu or submenu does not affect its nested submenus. Each menu and submenu can be configured independently. |

#### x-h-menu-item

| Attribute     | Type       | Required | Description                                                                                                         |
| ------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| data-variant  | `negative` | false    | Semantic color of the item.                                                                                         |
| aria-disabled | boolean    | false    | Marks the item unavailable while keeping it focusable and announced.                                                |
| data-inset    | boolean    | false    | Adds padding to the item in order to align it with ones which have an icon.                                         |
| data-active   | boolean    | false    | Marks the item as active. Sets `aria-current="page"` and applies active styling. Use only inside a navigation menu. |

#### x-h-menu-sub

| Attribute     | Type    | Required | Description                                                                                        |
| ------------- | ------- | -------- | -------------------------------------------------------------------------------------------------- |
| aria-disabled | boolean | false    | Marks the subitem unavailable while keeping it focusable and announced. Its submenu will not open. |
| data-inset    | boolean | false    | Adds padding to the subitem in order to align it with ones which have an icon.                     |

#### x-h-menu-label

| Attribute  | Type    | Required | Description                                                                             |
| ---------- | ------- | -------- | --------------------------------------------------------------------------------------- |
| data-inset | boolean | false    | Adds padding to the label in order to align it with items and subitems that have icons. |

#### x-h-menu-checkbox-item

| Attribute     | Type    | Required | Description                                                          |
| ------------- | ------- | -------- | -------------------------------------------------------------------- |
| aria-disabled | boolean | false    | Marks the item unavailable while keeping it focusable and announced. |

#### x-h-menu-radio-item

| Attribute     | Type    | Required | Description                                                               |
| ------------- | ------- | -------- | ------------------------------------------------------------------------- |
| `self`        | any     | true     | Sets the value of the radio item. Expects a string literal or a variable. |
| aria-disabled | boolean | false    | Marks the item unavailable while keeping it focusable and announced.      |

### Modifiers

#### x-h-menu-trigger

| Modifier | Description                                              |
| -------- | -------------------------------------------------------- |
| dropdown | Activates dropdown mode.                                 |
| chevron  | Rotates the last icon inside the trigger at 180 degrees. |

#### x-h-menu

| Modifier | Description                    |
| -------- | ------------------------------ |
| sub      | Menu will behave as a submenu. |

## Examples

### Dropdown

<LiveExample data-class="flex flex-col items-start gap-4">

```html
<button x-h-button x-h-menu-trigger.dropdown>Dropdown</button>
<ul x-h-menu>
  <div x-h-menu-label>Profile</div>
  <li x-h-menu-item>Set yourself as away</li>
  <li x-h-menu-sub>
    <span>Pause notifications</span>
    <ul x-h-menu.sub>
      <li x-h-menu-item>15 minutes</li>
      <li x-h-menu-item>30 minutes</li>
      <li x-h-menu-item>1 hour</li>
      <li x-h-menu-item>2 hours</li>
      <li x-h-menu-item>4 hours</li>
      <li x-h-menu-item>1 day</li>
    </ul>
  </li>
  <div x-h-menu-label>Team</div>
  <li x-h-menu-item>Invite users</li>
  <div x-h-menu-separator></div>
  <li x-h-menu-item data-variant="negative">Log out</li>
</ul>
```

</LiveExample>

### Disabled items

Every kind of item is disabled with `aria-disabled="true"`. It needs the explicit value, so an attribute bound to a false expression leaves the item usable. A disabled item is dimmed and cannot be clicked or activated, but the arrow keys and typeahead still reach it so screen readers announce it as unavailable. A disabled subitem is announced as a submenu that never opens.

<LiveExample data-class="flex flex-col items-start gap-4">

```html
<button x-h-button x-h-menu-trigger.dropdown>Disabled items</button>
<ul x-h-menu x-data="{ checkbox: { autosave: true }, radioSelected: 'r1' }">
  <li x-h-menu-item>Rename</li>
  <li x-h-menu-item aria-disabled="true">Duplicate</li>
  <li x-h-menu-sub aria-disabled="true">
    <span>Move to</span>
    <ul x-h-menu.sub>
      <li x-h-menu-item>Archive</li>
    </ul>
  </li>
  <div x-h-menu-separator></div>
  <div x-h-menu-checkbox-item x-model="checkbox.autosave" aria-disabled="true">Auto-Save</div>
  <div x-h-menu-separator></div>
  <li x-h-menu-radio-item="'r1'" name="dg1" x-model="radioSelected">Everyone</li>
  <li x-h-menu-radio-item="'r2'" name="dg1" x-model="radioSelected" aria-disabled="true">Admins only</li>
  <div x-h-menu-separator></div>
  <li x-h-menu-item data-variant="negative" aria-disabled="true">Delete</li>
</ul>
```

</LiveExample>

### Contextmenu

<LiveExample data-class="border-dashed p-0">

```html
<div x-h-menu-trigger class="flex items-center justify-center p-12">Right click for context menu</div>
<ul x-h-menu aria-label="context menu" x-data="{ checkbox: { autosave: true }, radioItems: [{ label: 'Radio 1', value: 'r1' }, { label: 'Radio 2', value: 'r2' }], radioSelected: 'r1' }">
  <li x-h-menu-item>
    <svg x-h-lucide role="presentation" data-lucide="save"></svg>
    <span>Save</span>
    <span x-h-menu-item-secondary>Ctrl+S</span>
  </li>
  <li x-h-menu-item data-variant="negative">
    <svg x-h-lucide role="presentation" data-lucide="trash"></svg>
    <span>Delete</span>
    <span x-h-menu-item-secondary>Del</span>
  </li>
  <div x-h-menu-separator></div>
  <div x-h-menu-label data-inset="false">Other items</div>
  <li x-h-menu-item data-inset="true">Menu Item 1</li>
  <li x-h-menu-sub data-inset="true">
    <span>Submenu</span>
    <ul x-h-menu.sub>
      <li x-h-menu-item>Subitem 1</li>
      <li x-h-menu-item>Subitem 2</li>
      <li x-h-menu-item>Subitem 3</li>
      <li x-h-menu-sub>
        <span>Sub-submenu</span>
        <ul x-h-menu.sub>
          <li x-h-menu-item>Subitem 1</li>
          <li x-h-menu-item>Subitem 2</li>
          <li x-h-menu-item>Subitem 3</li>
        </ul>
      </li>
    </ul>
  </li>
  <div x-h-menu-separator></div>
  <div x-h-menu-label data-inset="true">Checkbox Items</div>
  <div x-h-menu-checkbox-item x-model="checkbox.autosave">Auto-Save</div>
  <div x-h-menu-separator></div>
  <div x-h-menu-label data-inset="true">Radio Items</div>
  <template x-for="radio in radioItems">
    <li x-h-menu-radio-item="radio.value" name="rg1" x-model="radioSelected" x-text="radio.label"></li>
  </template>
</ul>
```

</LiveExample>
