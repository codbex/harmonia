# Sidebar

A vertical navigation panel used to present top-level application links or sections. Sidebars provide persistent access to primary navigation, helping users move through the interface.

## Usage

Use sidebars for main application navigation or other persistent content that benefits from being constantly accessible. Buttons must be clearly labeled and grouped logically.

## API Reference

### Component attubute(s)

```
x-h-sidebar
x-h-sidebar-header
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

| Attribute      | Type    | Required | Description                             |
| -------------- | ------- | -------- | --------------------------------------- |
| data-collapsed | boolean | false    | Collapses the sidebar to an icon width. |
| data-floating  | boolean | false    | Adds border and shadow to the sidebar.  |

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

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-padding="false" data-style="height:16rem">
<div x-h-sidebar>
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <span>Header popover</span>
      <i role="img" data-lucide="chevron-down"></i>
    </button>
    <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
  </div>
  <div x-h-sidebar-content></div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <span>Footer popover</span>
      <i role="img" data-lucide="chevrons-up-down"></i>
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
</component-container>
</ClientOnly>

```html
<div x-h-sidebar>
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <span>Header popover</span>
      <i role="img" data-lucide="chevron-down"></i>
    </button>
    <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
  </div>
  <div x-h-sidebar-content></div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <span>Footer popover</span>
      <i role="img" data-lucide="chevrons-up-down"></i>
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

### Sidebar content

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-padding="false" data-style="height:16rem">
<div x-h-sidebar>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <i role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-sidebar>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <i role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

### Sidebar right side

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-padding="false" data-style="height:16rem">
<div x-h-sidebar.right class="float-right">
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <i role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-sidebar.right class="float-right">
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <ul x-h-sidebar-menu>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="true">
              <i role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

### Collapsed sidebar

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-padding="false" data-style="height:16rem">
<div x-h-sidebar data-collapsed="true">
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <i role="img" data-lucide="menu"></i>
      <span>Header popover</span>
      <i role="img" data-lucide="chevron-down"></i>
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
              <i role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <i role="img" data-lucide="circle-user"></i>
      <span>Footer popover</span>
      <i role="img" data-lucide="chevrons-up-down"></i>
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
</component-container>
</ClientOnly>

```html
<div x-h-sidebar data-collapsed="true">
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <i role="img" data-lucide="menu"></i>
      <span>Header popover</span>
      <i role="img" data-lucide="chevron-down"></i>
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
              <i role="img" data-lucide="house"></i>
              <span>Home</span>
              <span x-h-sidebar-menu-badge>11</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              <span>Documents</span>
            </button>
          </li>
          <li x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              <span>Extensions</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div x-h-sidebar-footer>
    <button x-h-sidebar-menu-button x-h-menu-trigger.dropdown>
      <i role="img" data-lucide="circle-user"></i>
      <span>Footer popover</span>
      <i role="img" data-lucide="chevrons-up-down"></i>
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

### Sidebar skeleton

<br />

<ClientOnly>
<component-container data-padding="false">
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
</component-container>
</ClientOnly>

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

### Full example

<br />

<ClientOnly>
<component-container data-html="/components/sidebar/full.html" data-padding="false">
</component-container>
</ClientOnly>

```html
<div x-data="app">
  <div x-h-sidebar>
    <div x-h-sidebar-header>
      <button type="button" x-h-sidebar-menu-button x-h-popover-trigger.chevron>
        <span>Header popover</span>
        <i role="img" data-lucide="chevron-down"></i>
      </button>
      <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
    </div>

    <div x-h-sidebar-content>
      <div x-h-sidebar-group>
        <div x-h-sidebar-group-label>
          <span>General</span>
          <button x-h-sidebar-group-action aria-label="Add">
            <i role="img" data-lucide="plus"></i>
          </button>
        </div>
        <div x-h-sidebar-group-content>
          <ul x-h-sidebar-menu>
            <li x-h-sidebar-menu-item>
              <button type="button" x-h-sidebar-menu-button :data-active="active === 'dashboard'" @click="changeActive('dashboard')">
                <i role="img" data-lucide="layout-dashboard"></i>
                <span>Dashboard</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <a x-h-sidebar-menu-button href="#full-example" :data-active="active === 'analytics'" @click="changeActive('analytics')">
                <i role="img" data-lucide="chart-no-axes-combined"></i>
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
                <i role="img" data-lucide="folder"></i>
                <span>Files</span>
                <span x-h-sidebar-menu-badge>11</span>
              </button>
            </li>
            <li x-h-sidebar-menu-item>
              <a x-h-sidebar-menu-button href="#full-example" :data-active="active === 'docs'" @click="changeActive('docs')">
                <i role="img" data-lucide="file-text"></i>
                <span>Documents</span>
              </a>
              <button type="button" x-h-sidebar-menu-action.autohide>
                <i role="img" data-lucide="info"></i>
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
              <i role="img" data-lucide="list-tree"></i>
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
              <i role="img" data-lucide="list-tree"></i>
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
        <i role="img" data-lucide="chevrons-up-down"></i>
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
  document.addEventListener('alpine:init', () => {
    Alpine.data('app', () => ({
      active: 'dashboard',
      changeActive(active) {
        this.active = active;
      },
    }));
  });
</script>
```
