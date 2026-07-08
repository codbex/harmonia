# Sidebar

A vertical navigation panel used to present top-level application links or sections. Sidebars provide persistent access to primary navigation, helping users move through the interface.

## Usage

Use sidebars for main application navigation or other persistent content that benefits from being constantly accessible. Buttons must be clearly labeled and grouped logically.

## API Reference

### Component attribute(s)

```
x-h-sidebar
x-h-sidebar-header
x-h-sidebar-header-item
x-h-sidebar-content
x-h-sidebar-group
x-h-sidebar-group-label
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

| Attribute       | Type    | Required | Description                             |
| --------------- | ------- | -------- | --------------------------------------- |
| data-collapsed  | boolean | false    | Collapses the sidebar to an icon width. |
| data-floating   | boolean | false    | Adds border and shadow to the sidebar.  |
| data-borderless | boolean | false    | Removes the side border (left/right).   |

#### x-h-sidebar-menu-button

| Attribute   | Type                        | Required | Description                       |
| ----------- | --------------------------- | -------- | --------------------------------- |
| data-active | boolean                     | false    | Sets the menu button as active.   |
| data-size   | `default`<br/>`sm`<br/>`lg` | false    | Sets the size of the menu button. |

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

| Modifier  | Type    | Required | Description                                                        |
| --------- | ------- | -------- | ------------------------------------------------------------------ |
| collapsed | boolean | false    | Enables collapse/expand for the group content. Default is `false`. |

#### x-h-sidebar-menu-action

| Modifier | Description                             |
| -------- | --------------------------------------- |
| autohide | The action will be shown only on hover. |

#### x-h-sidebar-menu-skeleton

| Modifier | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| icon     | Adds an icon shape to the skeleton to indicate that the items will have an icon. |

## Examples

### Sidebar header and footer

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar>
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <span>Header popover</span>
      <i x-h-lucide role="img" data-lucide="chevron-down"></i>
    </button>
    <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
  </div>
  <div x-h-sidebar-content></div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <span>Footer popover</span>
      <i x-h-lucide role="img" data-lucide="chevrons-up-down"></i>
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

Use a header item for a non-interactive branding or title row at the top of the sidebar, such as a logo. It lays out an icon and a label, and when the sidebar is collapsed everything except the leading icon or avatar is hidden. It must not be a `button` or `a` element (it will throw). For an interactive header row use `x-h-sidebar-menu-button` instead.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div class="hbox size-full gap-2" x-data="{ collapsed: false }">
  <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <div x-h-sidebar-header-item>
        <i x-h-lucide role="img" class="size-6" data-lucide="box"></i>
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

### Product switch header

Use a large menu button in the header as a product switcher. Has an SVG icon or avatar next to a stacked title and description, with a dropdown listing the available products.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div class="size-full" x-data="{
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
}">
   <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <button x-h-sidebar-menu-button data-size="lg" x-h-menu-trigger.dropdown>
        <svg x-h-icon class="size-9 rounded-control" :data-link="product.logo" role="presentation"></svg>
        <div class="vbox min-w-0 text-left">
          <span class="truncate font-medium" x-text="product.name"></span>
          <span class="truncate text-xs font-normal" x-text="product.brand"></span>
        </div>
        <i x-h-lucide role="img" data-lucide="chevrons-up-down"></i>
      </button>
      <ul x-h-menu aria-label="Products" data-align="bottom-start">
        <div x-h-menu-label>Products</div>
        <template x-for="item in products" :key="item.name">
        <li x-h-menu-item @click="onProductSelect(item)">
          <svg x-h-icon class="size-6 rounded-control" :data-link="item.logo" role="presentation"></svg>
          <span x-text="item.name"></span>
        </li>
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
                <i x-h-lucide role="img" data-lucide="house"></i>
                <span>Home</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <i x-h-lucide role="img" data-lucide="file-text"></i>
                <span>Documents</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <i x-h-lucide role="img" data-lucide="blocks"></i>
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
                <i x-h-lucide role="img" data-lucide="house"></i>
                <span>Home</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="false">
                <i x-h-lucide role="img" data-lucide="file-text"></i>
                <span>Documents</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <i x-h-lucide role="img" data-lucide="blocks"></i>
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
              <i x-h-lucide role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i x-h-lucide role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <i x-h-lucide role="img" data-lucide="blocks"></i>
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

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar.right class="float-right">
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i x-h-lucide role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i x-h-lucide role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <i x-h-lucide role="img" data-lucide="blocks"></i>
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

### Collapsed sidebar

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div x-h-sidebar data-collapsed="true">
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <i x-h-lucide role="img" data-lucide="menu"></i>
      <span>Header popover</span>
      <i x-h-lucide role="img" data-lucide="chevron-down"></i>
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
              <i x-h-lucide role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i x-h-lucide role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i x-h-lucide role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <i x-h-lucide role="img" data-lucide="circle-user"></i>
      <span>Footer popover</span>
      <i x-h-lucide role="img" data-lucide="chevrons-up-down"></i>
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

### Collapsed with avatars

A leading avatar in a header item or menu button behaves like a leading icon - it stays visible when the sidebar is collapsed while the label and any trailing content are hidden. This suits branding rows and user or direct-message lists where the avatar is the recognisable element. Toggle the button below to collapse the sidebar.

<LiveExample data-class="p-0" data-style="height:16rem">

```html
<div class="hbox size-full gap-2" x-data="{ collapsed: false }">
  <div x-h-sidebar :data-collapsed="collapsed">
    <div x-h-sidebar-header>
      <div x-h-sidebar-header-item>
        <div x-h-avatar class="rounded-control" data-variant="primary">
          <i x-h-lucide role="img" data-lucide="messages-square"></i>
        </div>
        <div class="vbox min-w-0">
          <span class="truncate">Onyx Chat</span>
          <span class="truncate text-sm font-normal">Onyx Labs</span>
        </div>
      </div>
    </div>
    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>Direct messages</div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button data-active="true">
                <div x-h-avatar class="size-6! rounded-control text-xs" data-color="orange">AM</div>
                <span>Ava Morgan</span>
                <span x-h-sidebar-menu-badge>3</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <button x-h-sidebar-menu-button>
                <div x-h-avatar class="size-6! rounded-control text-xs" data-color="green">LC</div>
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

<LiveExample data-class="p-0">

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

### Full example

<LiveExample data-class="p-0">

```html
<div x-data="SidebarController">
  <div x-h-sidebar>
    <div x-h-sidebar-header>
      <button type="button" x-h-sidebar-menu-button x-h-popover-trigger.chevron>
        <span>Header popover</span>
        <i x-h-lucide role="img" data-lucide="chevron-down"></i>
      </button>
      <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
    </div>

    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>
          <span>General</span>
          <button x-h-sidebar-group-action aria-label="Add">
            <i x-h-lucide role="img" data-lucide="plus"></i>
          </button>
        </div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button type="button" x-h-sidebar-menu-button :data-active="active === 'dashboard'" @click="changeActive('dashboard')">
                <i x-h-lucide role="img" data-lucide="layout-dashboard"></i>
                <span>Dashboard</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <a x-h-sidebar-menu-button href="#full-example" :data-active="active === 'analytics'" @click="changeActive('analytics')">
                <i x-h-lucide role="img" data-lucide="chart-no-axes-combined"></i>
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
                <i x-h-lucide role="img" data-lucide="folder"></i>
                <span>Files</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <a x-h-sidebar-menu-button href="#full-example" :data-active="active === 'docs'" @click="changeActive('docs')">
                <i x-h-lucide role="img" data-lucide="file-text"></i>
                <span>Documents</span>
              </a>
              <button type="button" x-h-sidebar-menu-action.autohide>
                <i x-h-lucide role="img" data-lucide="info"></i>
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
              <i x-h-lucide role="img" data-lucide="list-tree"></i>
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
              <i x-h-lucide role="img" data-lucide="list-tree"></i>
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
        <i x-h-lucide role="img" data-lucide="chevrons-up-down"></i>
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
