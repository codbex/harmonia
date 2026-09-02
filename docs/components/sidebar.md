# Sidebar

A vertical navigation panel used to present top-level application links or sections. Sidebars provide persistent access to primary navigation, helping users move through the interface.

## Usage

Use sidebars for main application navigation or other persistent content that benefits from being constantly accessible. Buttons must be clearly labeled and grouped logically.

## Accessibility

A menu button marked `data-active="true"` also gets `aria-current="page"`, so the destination the user is on is announced and not only coloured. The attribute is followed as it changes, which is what a bound `:data-active` needs.

A `x-h-sidebar-group-label` inside a `x-h-sidebar-group.collapsed` is the control that collapses the group, so it is given the `button` role and a tab stop, and it answers `Enter` and `Space` the way a button does. Write it as a `<button>` instead and it is left alone, since it already is one. A label in a group that does not collapse stays plain text with no role and no tab stop.

A `x-h-sidebar-header-item` is a control only when it is written as a `button` or an `a` element, so the element itself carries the role, the tab stop and the keyboard behaviour. On any other tag it stays plain text and is never given a role or a `tabindex` it cannot honour.

The sidebar itself is a plain container and takes no landmark role, since only you know whether it holds the page's navigation. Wrap it, or the `x-h-sidebar-content` inside it, in a `<nav aria-label="...">` when it does.

## API Reference

### Component attribute(s)

```
x-h-sidebar
x-h-sidebar-header
x-h-sidebar-header-item
x-h-sidebar-content
x-h-sidebar-group
x-h-sidebar-group-label
x-h-sidebar-group-actions
x-h-sidebar-group-action
x-h-sidebar-group-content
x-h-sidebar-menu
x-h-sidebar-menu-item
x-h-sidebar-menu-button
x-h-sidebar-menu-action
x-h-sidebar-menu-badge
x-h-sidebar-menu-skeleton
x-h-sidebar-separator
x-h-sidebar-menu-sub
x-h-sidebar-footer
```

### Attributes

#### x-h-sidebar

| Attribute       | Type    | Required | Description                                            |
| --------------- | ------- | -------- | ------------------------------------------------------ |
| data-collapsed  | boolean | false    | Collapses the sidebar to an icon width.                |
| data-floating   | boolean | false    | Adds border and shadow to the sidebar.                 |
| data-elevated   | boolean | false    | Adds left and right border, and shadow to the sidebar. |
| data-borderless | boolean | false    | Removes the side border (left/right).                  |

#### x-h-sidebar-menu-button

| Attribute   | Type                        | Required | Description                                                                                                                                                                                                          |
| ----------- | --------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-active | boolean                     | false    | Sets the menu button as active.                                                                                                                                                                                      |
| data-size   | `default`<br/>`sm`<br/>`lg` | false    | Sets the size of the menu button. Ignored when the sidebar is collapsed.                                                                                                                                             |
| data-logo   | boolean                     | false    | When the sidebar is collapsed, removes the button padding and makes the icon or avatar fill the button. Use it on buttons that show a brand logo in the header or footer, or a user avatar elsewhere in the sidebar. |

#### x-h-sidebar-header

| Attribute       | Type    | Required | Description            |
| --------------- | ------- | -------- | ---------------------- |
| data-borderless | boolean | false    | Removes bottom border. |

#### x-h-sidebar-menu-sub

| Attribute | Type    | Required | Description                                                                                                |
| --------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| data-line | boolean | false    | Draws a line on the left side of the menu, indicating which items are part of the menu. Default is `true`. |

#### x-h-sidebar-footer

| Attribute       | Type    | Required | Description         |
| --------------- | ------- | -------- | ------------------- |
| data-borderless | boolean | false    | Removes top border. |

### Modifiers

#### x-h-sidebar

| Modifier | Description                    |
| -------- | ------------------------------ |
| right    | Adds border to the left side.  |
| left     | Adds border to the right side. |

#### x-h-sidebar-group

| Modifier  | Type    | Required | Description                                                                                                                                                                                                                                                               |
| --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collapsed | boolean | false    | Enables collapse/expand for the group content, and adds a collapse arrow to the group label. Because the arrow lives inside the label, give the label its text as a child (a `<span>` for example) rather than with `x-text`, which would replace it. Default is `false`. |

#### x-h-sidebar-group-actions

| Modifier | Description                                                                                                                     |
| -------- | ------------------------------------------------------------------------------------------------------------------------------- |
| autohide | The actions are hidden until the group label is hovered or a button inside them is focused. They stay visible on touch devices. |

#### x-h-sidebar-menu-item

| Modifier  | Type    | Required | Description                                                                                                                                                                                                                                                                                 |
| --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| collapsed | boolean | false    | Enables collapse/expand for the item's `x-h-sidebar-menu-sub`, and adds a collapse arrow to its menu button. Because the arrow lives inside the button, give the button its text as a child (a `<span>` for example) rather than with `x-text`, which would replace it. Default is `false`. |

#### x-h-sidebar-menu-action

| Modifier | Description                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------- |
| autohide | The action is hidden until its menu item is hovered or focused. It stays visible on touch devices. |

#### x-h-sidebar-menu-skeleton

| Modifier | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| icon     | Adds an icon shape to the skeleton to indicate that the items will have an icon. |

### CSS Variables

| Variable        | Default | Description                                                                                                 |
| --------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| --sidebar-width | 16rem   | Width of the sidebar when not collapsed. Set it on the sidebar itself, an ancestor, or in a theme CSS file. |

## Examples

### Sidebar header and footer

<LiveExample data-class="p-0" data-style="height:16rem" data-exclude="generator">

```html
<div x-h-sidebar>
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <span>Header popover</span>
      <svg x-h-lucide role="presentation" data-lucide="chevron-down"></svg>
    </button>
    <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
  </div>
  <div x-h-sidebar-content></div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <span>Footer popover</span>
      <svg x-h-lucide role="presentation" data-lucide="chevrons-up-down"></svg>
    </button>
    <ul x-h-menu aria-label="dropdown" data-align="top-start">
      <li x-h-menu-item>Set yourself as away</li>
      <div x-h-menu-label>Team</div>
      <li x-h-menu-item>Invite users</li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item data-variant="negative">Log out</li>
    </ul>
  </div>
</div>
```

</LiveExample>

### Sidebar header item

Use a header item for a branding or title row at the top of the sidebar, such as a logo. It lays out an icon and a label, and when the sidebar is collapsed everything except the leading icon or avatar is hidden.

<LiveExample data-class="p-0" data-style="height:16rem" data-exclude="generator">

```html
<div class="hbox size-full gap-2" x-data="{ collapsed: false }">
  <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <div x-h-sidebar-header-item>
        <svg x-h-lucide role="presentation" class="size-8" data-lucide="box"></svg>
        <span>Harmonia</span>
      </div>
    </div>
    <div x-h-sidebar-content></div>
    <div x-h-sidebar-footer data-borderless="true">
      <button x-h-sidebar-menu-button @click="collapsed = !collapsed">
        <svg x-h-icon :data-icon="collapsed ? 'chevron-right' : 'chevron-left'" role="presentation"></svg>
        <span x-text="collapsed ? 'Expand' : 'Collapse'"></span>
      </button>
    </div>
  </div>
</div>
```

</LiveExample>

### Interactive sidebar header item

Write the header item on a `button` or an `a` element to make it a control, such as a logo that links to the home page.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar>
  <div x-h-sidebar-header>
    <a x-h-sidebar-header-item href="#">
      <svg x-h-lucide role="presentation" class="size-8" data-lucide="box"></svg>
      <span>Harmonia</span>
    </a>
  </div>
  <div x-h-sidebar-content></div>
</div>
```

</LiveExample>

### Product switch header

Use a large menu button in the header as a product switcher. Has an SVG icon or avatar next to a stacked title and description, with a dropdown listing the available products.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div
  class="size-full"
  x-data="{
    product: {
        name: 'Harmonia',
        brand: 'by codbex',
        logo: '/harmonia/logo/harmonia-square.svg'
    },
    products: [{
        name: 'Harmonia',
        brand: 'by codbex',
        logo: '/harmonia/logo/harmonia-square.svg'
    }, {
        name: 'Granite ERP',
        brand: 'by codbex',
        logo: '/harmonia/icons/codbex.svg'
    }],
    onProductSelect(selected) {
        this.product = selected;
    },
    collapsed: false
}"
>
  <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <button x-h-sidebar-menu-button data-logo="true" data-size="lg" x-h-menu-trigger.dropdown>
        <svg x-h-icon class="size-9 rounded-control" :data-link="product.logo" role="presentation"></svg>
        <div class="vbox text-left">
          <span class="truncate font-medium" x-text="product.name"></span>
          <span class="truncate text-xs font-normal" x-text="product.brand"></span>
        </div>
        <svg x-h-lucide role="presentation" data-lucide="chevrons-up-down"></svg>
      </button>
      <ul x-h-menu aria-label="Products" data-align="bottom-start">
        <div x-h-menu-label>Products</div>
        <template x-for="item in products" :key="item.name">
          <li x-h-menu-item @click="onProductSelect(item)">
            <svg x-h-icon class="size-6 rounded-control" :data-link="item.logo" role="presentation"></svg>
            <span x-text="item.name"></span>
          </li>
        </template>
      </ul>
    </div>
    <div x-h-sidebar-content></div>
    <div x-h-sidebar-footer data-borderless="true">
      <button x-h-sidebar-menu-button @click="collapsed = !collapsed">
        <svg x-h-icon :data-icon="collapsed ? 'chevron-right' : 'chevron-left'" role="presentation"></svg>
        <span x-text="collapsed ? 'Expand' : 'Collapse'"></span>
      </button>
    </div>
  </div>
</div>
```

</LiveExample>

### Borderless sidebar

Set `data-borderless="true"` on the sidebar to drop its divider and let it blend into the page. Pairing it with a matching page background and a rounded, elevated content card produces an inset look where the sidebar reads as part of the canvas rather than a bordered panel.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div class="hbox size-full bg-sidebar">
  <div x-h-sidebar data-borderless="true">
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Application</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="house"></svg>
                <span>Home</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
                <span>Documents</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
                <span>Extensions</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="flex-1 p-2">
    <main class="size-full rounded-xl border bg-background p-4 shadow-sm">Content</main>
  </div>
</div>
```

</LiveExample>

### Borderless inset sidebar

Set `data-borderless="true"` on the sidebar to drop its divider and apply a shadow and border to the main page body.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div class="hbox size-full">
  <div x-h-sidebar data-borderless="true">
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Application</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="house"></svg>
                <span>Home</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
                <span>Documents</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
                <span>Extensions</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <main class="flex-1 border-l bg-background p-4 shadow-sm">Content</main>
</div>
```

</LiveExample>

### Floating sidebar

<LiveExample data-style="height:16rem">

```html
<div x-h-sidebar data-floating="true">
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="house"></svg>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Elevated sidebar

<LiveExample data-class="py-0" data-style="height:16rem">

```html
<div x-h-sidebar data-elevated="true">
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="house"></svg>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Sidebar content

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="house"></svg>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Sidebar right side

<LiveExample data-class="p-0" data-style="height:16rem" data-exclude="generator">

```html
<div class="hbox size-full">
  <main class="size-full"></main>
  <div x-h-sidebar.right>
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Application</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="house"></svg>
                <span>Home</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
                <span>Documents</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
                <span>Extensions</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Sidebar and main section width

<LiveExample data-style="height:16rem" data-exclude="generator">

```html
<div class="hbox size-full" style="--sidebar-width: 10rem;">
  <div x-h-sidebar>
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Application</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="house"></svg>
                <span>Home</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
                <span>Documents</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
                <span>Extensions</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <main class="w-full border-y border-r" style="max-width: calc(100% - var(--sidebar-width));"></main>
</div>
```

</LiveExample>

### Collapsed sidebar

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar data-collapsed="true">
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <svg x-h-lucide role="presentation" data-lucide="menu"></svg>
      <span>Header popover</span>
      <svg x-h-lucide role="presentation" data-lucide="chevron-down"></svg>
    </button>
    <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
  </div>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="house"></svg>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
      <span>Footer popover</span>
      <svg x-h-lucide role="presentation" data-lucide="chevrons-up-down"></svg>
    </button>
    <ul x-h-menu aria-label="dropdown" data-align="top-start">
      <li x-h-menu-item>Set yourself as away</li>
      <div x-h-menu-label>Team</div>
      <li x-h-menu-item>Invite users</li>
      <div x-h-menu-separator></div>
      <li x-h-menu-item data-variant="negative">Log out</li>
    </ul>
  </div>
</div>
```

</LiveExample>

### With avatars and logos

A leading avatar in a header item or menu button behaves like a leading icon - it stays visible when the sidebar is collapsed while the label and any trailing content are hidden. This suits branding rows and user or direct-message lists where the avatar is the recognisable element. Toggle the button below to collapse the sidebar.

<LiveExample data-class="p-0" data-style="height:20rem">

```html
<div class="hbox size-full gap-2" x-data="{ collapsed: false }">
  <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <div x-h-sidebar-header-item>
        <div x-h-avatar class="rounded-control" data-variant="primary">
          <svg x-h-lucide role="img" aria-label="Onyx Chat Logo" data-lucide="messages-square"></svg>
        </div>
        <div class="vbox">
          <span class="truncate">Onyx Chat</span>
          <span class="truncate text-sm font-normal">Onyx Labs</span>
        </div>
      </div>
    </div>
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Channels</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-logo="true">
                <svg x-h-icon data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
                <span>Harmonia</span>
                <span x-h-sidebar-menu-badge>1</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Direct messages</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-logo="true" data-active="true">
                <div x-h-avatar data-color="orange">AM</div>
                <span>Ava Morgan</span>
                <span x-h-sidebar-menu-badge>3</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-logo="true">
                <div x-h-avatar data-color="green">LC</div>
                <span>Liam Chen</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div x-h-sidebar-footer data-borderless="true">
      <button x-h-sidebar-menu-button @click="collapsed = !collapsed">
        <svg x-h-icon :data-icon="collapsed ? 'chevron-right' : 'chevron-left'" role="presentation"></svg>
        <span x-text="collapsed ? 'Expand' : 'Collapse'"></span>
      </button>
    </div>
  </div>
</div>
```

</LiveExample>

### Big Avatars with secondary text

Same as the previous one but with `data-size="lg"` applied to the menu elements and with a secondary text below the label.

<LiveExample data-class="p-0" data-style="height:24rem" data-exclude="generator">

```html
<div class="hbox size-full gap-2" x-data="{ collapsed: false }">
  <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <div x-h-sidebar-header-item>
        <div x-h-avatar class="rounded-control" data-variant="primary">
          <svg x-h-lucide role="img" aria-label="Onyx Chat Logo" data-lucide="messages-square"></svg>
        </div>
        <div class="vbox">
          <span class="truncate">Onyx Chat</span>
          <span class="truncate text-sm font-normal">Onyx Labs</span>
        </div>
      </div>
    </div>
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Channels</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-size="lg" data-logo="true">
                <svg x-h-icon data-link="/harmonia/logo/harmonia-square.svg" role="presentation"></svg>
                <div class="vbox">
                  <span class="truncate">Harmonia</span>
                  <span class="truncate opacity-75">Main channel</span>
                </div>
                <span x-h-sidebar-menu-badge>1</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Direct messages</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-size="lg" data-logo="true" data-active="true">
                <div x-h-avatar data-color="orange">AM</div>
                <div class="vbox">
                  <span class="truncate">Ava Morgan</span>
                  <span class="truncate opacity-75">Secondary informaton (can be anything)</span>
                </div>
                <span x-h-sidebar-menu-badge>3</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-size="lg" data-logo="true">
                <div x-h-avatar data-color="green">LC</div>
                <span>Liam Chen</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div x-h-sidebar-footer data-borderless="true">
      <button x-h-sidebar-menu-button @click="collapsed = !collapsed">
        <svg x-h-icon :data-icon="collapsed ? 'chevron-right' : 'chevron-left'" role="presentation"></svg>
        <span x-text="collapsed ? 'Expand' : 'Collapse'"></span>
      </button>
    </div>
  </div>
</div>
```

</LiveExample>

### Sidebar skeleton

<LiveExample data-class="p-0" data-exclude="generator">

```html
<div x-h-sidebar>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Skeleton</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </li>
          <li x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </li>
          <li x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </li>
          <li x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </li>
          <li x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Group actions

A group label can carry one or more action buttons. Wrap them in `x-h-sidebar-group-actions` and place one `x-h-sidebar-group-action` button per action inside it. Each button needs its own accessible name, either an `aria-label` or an `sr-only` span. Group actions are not supported on a collapsable group label. Add the `autohide` modifier to keep the actions hidden until the group label is hovered or a button inside them is focused, while staying visible on touch devices.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>
        <span>Projects</span>
        <div x-h-sidebar-group-actions.autohide>
          <button x-h-sidebar-group-action aria-label="Add project">
            <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
          </button>
          <button x-h-sidebar-group-action aria-label="Sort projects">
            <svg x-h-lucide role="presentation" data-lucide="arrow-up-down"></svg>
          </button>
          <button x-h-sidebar-group-action aria-label="More options">
            <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
          </button>
        </div>
      </div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
              <span>Harmonia</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
              <span>Website</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Full example

<LiveExample data-class="p-0">

```html
<div x-data="SidebarController">
  <div x-h-sidebar>
    <div x-h-sidebar-header>
      <button type="button" x-h-sidebar-menu-button x-h-popover-trigger.chevron>
        <span>Header popover</span>
        <svg x-h-lucide role="presentation" data-lucide="chevron-down"></svg>
      </button>
      <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
    </div>

    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>
          <span>General</span>
          <div x-h-sidebar-group-actions.autohide>
            <button x-h-sidebar-group-action aria-label="Add">
              <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
            </button>
            <button x-h-sidebar-group-action aria-label="More">
              <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
            </button>
          </div>
        </div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button type="button" x-h-sidebar-menu-button :data-active="active === 'dashboard'" @click="changeActive('dashboard')">
                <svg x-h-lucide role="presentation" data-lucide="layout-dashboard"></svg>
                <span>Dashboard</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <a x-h-sidebar-menu-button href="#full-example" :data-active="active === 'analytics'" @click="changeActive('analytics')">
                <svg x-h-lucide role="presentation" data-lucide="chart-no-axes-combined"></svg>
                <span>Analytics</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div x-h-sidebar-group.collapsed="false">
        <div x-h-sidebar-group-label>Application</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button type="button" x-h-sidebar-menu-button :data-active="active === 'files'" @click="changeActive('files')">
                <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
                <span>Files</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <a x-h-sidebar-menu-button href="#full-example" :data-active="active === 'docs'" @click="changeActive('docs')">
                <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
                <span>Documents</span>
              </a>
              <button type="button" x-h-sidebar-menu-action.autohide>
                <svg x-h-lucide role="presentation" data-lucide="info"></svg>
                <span class="sr-only">Info</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div x-h-sidebar-separator></div>

      <div x-h-sidebar-group>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button type="button" x-h-sidebar-menu-button :data-active="active === 'tree'" @click="changeActive('tree')">
              <svg x-h-lucide role="presentation" data-lucide="list-tree"></svg>
              <span>Tree</span>
            </button>
            <ul x-h-sidebar-menu-sub>
              <li x-h-sidebar-menu-item>
                <button type="button" x-h-sidebar-menu-button :data-active="active === 'tree_i1_l1'" @click="changeActive('tree_i1_l1')">
                  <span>Item 1 (L1)</span>
                </button>
              </li>
              <li x-h-sidebar-menu-item>
                <button type="button" x-h-sidebar-menu-button :data-active="active === 'tree_i2_l1'" @click="changeActive('tree_i2_l1')">
                  <span>Item 2 (L1)</span>
                </button>
                <ul x-h-sidebar-menu-sub>
                  <li x-h-sidebar-menu-item>
                    <button type="button" x-h-sidebar-menu-button :data-active="active === 'tree_i1_l2'" @click="changeActive('tree_i1_l2')">
                      <span>Item 1 (L2)</span>
                    </button>
                  </li>
                  <li x-h-sidebar-menu-item>
                    <button type="button" x-h-sidebar-menu-button :data-active="active === 'tree_i2_l2'" @click="changeActive('tree_i2_l2')">
                      <span>Item 2 (L2)</span>
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div x-h-sidebar-separator></div>

      <div x-h-sidebar-group>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item.collapsed>
            <button type="button" x-h-sidebar-menu-button>
              <svg x-h-lucide role="presentation" data-lucide="list-tree"></svg>
              <span>Tree (Collapsable)</span>
            </button>
            <ul x-h-sidebar-menu-sub>
              <li x-h-sidebar-menu-item>
                <button type="button" x-h-sidebar-menu-button>
                  <span>Item 1 (L1)</span>
                </button>
              </li>
              <li x-h-sidebar-menu-item.collapsed="false">
                <button type="button" x-h-sidebar-menu-button>
                  <span>Item 2 (L1)</span>
                </button>
                <ul x-h-sidebar-menu-sub>
                  <li x-h-sidebar-menu-item>
                    <button type="button" x-h-sidebar-menu-button>
                      <span>Item 1 (L2)</span>
                    </button>
                  </li>
                  <li x-h-sidebar-menu-item>
                    <button type="button" x-h-sidebar-menu-button>
                      <span>Item 2 (L2)</span>
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <div x-h-sidebar-separator></div>

      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Skeleton</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <template x-for="i in 5">
              <li x-h-sidebar-menu-item :key="i">
                <div x-h-sidebar-menu-skeleton.icon></div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <div x-h-sidebar-footer>
      <button type="button" x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
        <span>Footer popover</span>
        <svg x-h-lucide role="presentation" data-lucide="chevrons-up-down"></svg>
      </button>
      <ul x-h-menu aria-label="dropdown" data-align="top-start">
        <li x-h-menu-item>Set yourself as away</li>
        <div x-h-menu-label>Team</div>
        <li x-h-menu-item>Invite users</li>
        <div x-h-menu-separator></div>
        <li x-h-menu-item data-variant="negative">Log out</li>
      </ul>
    </div>
  </div>
</div>
<script type="text/javascript">
  Alpine.data('SidebarController', () => ({
    active: 'dashboard',
    changeActive(active) {
      this.active = active;
    },
  }));
</script>
```

</LiveExample>
