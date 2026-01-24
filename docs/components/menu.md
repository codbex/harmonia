# Menu

A structured list of options, optionally including headers, used to create navigational menus, context menus, or dropdowns. Menus organize actions or links in a clear and accessible way.

## Usage

Use menus to present a set of related actions or navigation links. Menu items should be clearly labeled and grouped logically.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the menu:

- `Up` / `Down` — Moves focus to the previous or next menu item.
- `Right` — Opens a submenu (if present) and moves focus to its first item.
- `Left` — Closes the current submenu and moves focus to its parent item.
- `Home` / `PageUp` — Moves focus to the first item in the menu.
- `End` / `PageDown` — Moves focus to the last item in the menu.
- `Enter` / `Space` — Activates the focused menu item.
- `Esc` — Closes the menu or submenu and returns focus to the controlling element.
- `Tab` — Closes the menu and submenus and sets focus to the next element.
- `Character keys (A–Z)` — Moves focus to the next item whose label starts with the typed character.

## API Reference

### Component attubute(s)

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

| Attribute  | Type                                                                                                                                                                          | Required | Description                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------- |
| data-align | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the menu relative to the cursor or relative to the trigger if in dropdown mode. |

#### x-h-menu-item

| Attribute     | Type       | Required | Description                                                                 |
| ------------- | ---------- | -------- | --------------------------------------------------------------------------- |
| data-variant  | `negative` | false    | Semantic color of the item.                                                 |
| data-disabled | boolean    | false    | Disabled the item.                                                          |
| data-inset    | boolean    | false    | Adds padding to the item in order to align it with ones which have an icon. |

#### x-h-menu-sub

| Attribute     | Type    | Required | Description                                                                    |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------ |
| data-disabled | boolean | false    | Disabled the subitem.                                                          |
| data-inset    | boolean | false    | Adds padding to the subitem in order to align it with ones which have an icon. |

#### x-h-menu-label

| Attribute  | Type    | Required | Description                                                                             |
| ---------- | ------- | -------- | --------------------------------------------------------------------------------------- |
| data-inset | boolean | false    | Adds padding to the label in order to align it with items and subitems that have icons. |

#### x-h-menu-radio-item

| Attribute | Type | Required | Description                                                               |
| --------- | ---- | -------- | ------------------------------------------------------------------------- |
| `self`    | any  | true     | Sets the value of the radio item. Expects a string literal or a variable. |

### Modifiers

#### x-h-menu-trigger

| Modifier | Description              |
| -------- | ------------------------ |
| dropdown | Activates dropdown mode. |

#### x-h-menu

| Modifier | Description                    |
| -------- | ------------------------------ |
| sub      | Menu will behave as a submenu. |

## Examples

### Dropdown

<br />

<ClientOnly>
<component-container data-class="flex flex-col items-start gap-4">
<button x-h-button x-h-menu-trigger.dropdown>Dropdown</button>
<ul x-h-menu aria-label="dropdown">
  <div x-h-menu-label>Profile</div>
  <li x-h-menu-item>Set yourself as away</li>
  <li x-h-menu-sub id="pnsm">
    <span>Pause notifications</span>
    <ul x-h-menu.sub aria-labelledby="pnsm">
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
</component-container>
</ClientOnly>

```html
<button x-h-button x-h-menu-trigger.dropdown>Dropdown</button>
<ul x-h-menu aria-label="dropdown">
  <div x-h-menu-label>Profile</div>
  <li x-h-menu-item>Set yourself as away</li>
  <li x-h-menu-sub id="pnsm">
    <span>Pause notifications</span>
    <ul x-h-menu.sub aria-labelledby="pnsm">
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

### Contextmenu

<br />

<ClientOnly>
<component-container data-html="/components/menu/menu.html" data-class="border-dashed" data-padding="false">
</component-container>
</ClientOnly>

```html
<div x-h-menu-trigger class="flex items-center justify-center p-12">Right click for context menu</div>
<ul x-h-menu aria-label="context menu" x-data="{ checkbox: { autosave: true }, radioItems: [{ label: 'Radio 1', value: 'r1' }, { label: 'Radio 2', value: 'r2' }], radioSelected: 'r1' }">
  <li x-h-menu-item>
    <i role="img" data-lucide="save"></i>
    Save
    <span x-h-menu-item-secondary>Ctrl+S</span>
  </li>
  <li x-h-menu-item data-variant="negative">
    <i role="img" data-lucide="trash"></i>
    Delete
    <span x-h-menu-item-secondary>Del</span>
  </li>
  <li x-h-menu-separator></li>
  <div x-h-menu-label data-inset="false">Other items</div>
  <li x-h-menu-item data-inset="true">Menu Item 1</li>
  <li x-h-menu-sub data-inset="true" id="submenu1">
    Submenu
    <ul x-h-menu.sub aria-labelledby="submenu1">
      <li x-h-menu-item>Subitem 1</li>
      <li x-h-menu-item>Subitem 2</li>
      <li x-h-menu-item>Subitem 3</li>
      <li x-h-menu-sub id="submenu2">
        Sub-submenu
        <ul x-h-menu.sub aria-labelledby="submenu2">
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
