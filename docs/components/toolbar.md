# Toolbar

The toolbar provides a set of actions (buttons, popovers/dropdowns and inputs) that are relevant to the current view, usually located right below the toolbar. It can also be used as a footer.

## API Reference

### Component attubute(s)

```
x-h-toolbar
x-h-toolbar-image
x-h-toolbar-title
x-h-toolbar-spacer
x-h-toolbar-separator
```

### Attubutes

#### x-h-toolbar

| Attribute     | Type                         | Required | Description                                               |
| ------------- | ---------------------------- | -------- | --------------------------------------------------------- |
| data-variant  | `default`<br />`transparent` | false    | Transparent background color. Does not remove the border. |
| data-size     | `default`<br />`sm`          | false    | Make the toolbar smaller.                                 |
| data-floating | boolean                      | false    | Floating style toolbar.                                   |

### Modifiers

#### x-h-toolbar

| Modifier | Description          |
| -------- | -------------------- |
| footer   | Footer-style toolbar |

## Examples

### Default

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-toolbar>
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar>
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
```

### Floating

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-toolbar data-floating="true">
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar data-floating="true">
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
```

### Transparent

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-toolbar data-variant="transparent">
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar data-variant="transparent">
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
```

### Small

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-toolbar data-size="sm">
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-size="xs" data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-size="xs" data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar data-size="sm">
  <span x-h-toolbar-title>Title</span>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-size="xs" data-variant="transparent"><i role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-size="xs" data-variant="transparent"><i role="img" data-lucide="plus"></i>Add</button>
</div>
```

### Footer

<br />

<ClientOnly>
<component-container>
<div x-h-toolbar.footer>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-size="sm" data-variant="primary">Apply</button>
  <button x-h-button data-size="sm" data-variant="transparent">Cancel</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar.footer>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-size="sm" data-variant="primary">Apply</button>
  <button x-h-button data-size="sm" data-variant="transparent">Cancel</button>
</div>
```

### As page header (shellbar)

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-toolbar x-data="{ showClear: false, search: '' }">
  <img x-h-toolbar-image src="/logo/harmonia.svg" alt="@harmonia" />
  <span x-h-toolbar-title class="pl-1">Harmonia</span>
  <div x-h-toolbar-spacer></div>
  <div x-h-input-group style="max-width:50%">
    <input x-h-input.group placeholder="Search..." x-model="search" x-on:keyup="(event) => { showClear = event.originalTarget.value !== '' }" />
    <div x-h-input-group-addon data-align="inline-start">
      <i role="img" data-lucide="search"></i>
    </div>
    <div x-h-input-group-addon data-align="inline-end">
      <button x-h-button.group aria-label="clear" x-show="showClear" x-on:click="showClear = false; search=''">
        <i role="img" data-lucide="x"></i>
      </button>
    </div>
  </div>
  <div x-h-toolbar-spacer></div>
  <button x-h-avatar x-h-menu-trigger.dropdown class="bg-secondary text-secondary-foreground">U</button>
  <ul x-h-menu aria-label="user dropdown" data-align="bottom-end">
    <div x-h-menu-label>Profile</div>
    <li x-h-menu-item>Set yourself as away</li>
    <li x-h-menu-sub id="pnsm">
      Pause notifications
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
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar x-data="{ showClear: false, search: '' }">
  <img x-h-toolbar-image src="/logo/harmonia.svg" alt="@harmonia" />
  <span x-h-toolbar-title class="pl-1">Harmonia</span>
  <div x-h-toolbar-spacer></div>
  <div x-h-input-group style="max-width:50%">
    <input x-h-input.group placeholder="Search..." x-model="search" x-on:keyup="(event) => { showClear = event.originalTarget.value !== '' }" />
    <div x-h-input-group-addon data-align="inline-start">
      <i role="img" data-lucide="search"></i>
    </div>
    <div x-h-input-group-addon data-align="inline-end">
      <button x-h-button.group aria-label="clear" x-show="showClear" x-on:click="showClear = false; search=''">
        <i role="img" data-lucide="x"></i>
      </button>
    </div>
  </div>
  <div x-h-toolbar-spacer></div>
  <button x-h-avatar x-h-menu-trigger.dropdown class="bg-secondary text-secondary-foreground">U</button>
  <ul x-h-menu aria-label="user dropdown" data-align="bottom-end">
    <div x-h-menu-label>Profile</div>
    <li x-h-menu-item>Set yourself as away</li>
    <li x-h-menu-sub id="pnsm">
      Pause notifications
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
</div>
```
