# Sidebar

The sidebar is used as a top-level application navigation list.

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
x-h-sidebar-menu-sub-item
x-h-sidebar-menu-sub-button
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

#### x-h-sidebar-menu-sub-button

| Attribute   | Type          | Required | Description                           |
| ----------- | ------------- | -------- | ------------------------------------- |
| data-active | boolean       | false    | Sets the menu sub button as active.   |
| data-size   | `sm`<br/>`md` | false    | Sets the size of the menu sub button. |

#### x-h-sidebar-header

| Attribute       | Type    | Required | Description            |
| --------------- | ------- | -------- | ---------------------- |
| data-borderless | boolean | false    | Removes bottom border. |

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

#### x-h-sidebar-group-label

| Modifier | Description                  |
| -------- | ---------------------------- |
| action   | Makes the label interactive. |

#### x-h-sidebar-menu-action

| Modifier | Description                             |
| -------- | --------------------------------------- |
| autohide | The action will be shown only on hover. |

#### x-h-sidebar-menu-skeleton

| Modifier | Description                                                                      |
| -------- | -------------------------------------------------------------------------------- |
| icon     | Adds an icon shape to the skeleton to indicate that the items will have an icon. |

#### x-h-sidebar-menu-sub

| Modifier | Description                                                                         |
| -------- | ----------------------------------------------------------------------------------- |
| flat     | Removes all offsets and makes the sub items appear on the same level as the parent. |

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
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </button>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              Extensions
            </button>
          </div>
        </div>
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
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </button>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              Extensions
            </button>
          </div>
        </div>
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
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </button>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              Extensions
            </button>
          </div>
        </div>
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
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </button>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              Extensions
            </button>
          </div>
        </div>
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

### Sidebar right side

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-padding="false" data-style="height:16rem">
<div x-h-sidebar.right class="float-right">
  <div x-h-sidebar-content>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label>Application</div>
      <div x-h-sidebar-group-content>
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </button>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              Extensions
            </button>
          </div>
        </div>
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
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </button>
          </div>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button data-active="false">
              <i role="img" data-lucide="blocks"></i>
              Extensions
            </button>
          </div>
        </div>
      </div>
    </div>
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
      <div x-h-sidebar-group-label.action>Skeleton</div>
      <div x-h-sidebar-group-content>
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
        </div>
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
      <div x-h-sidebar-group-label.action>Skeleton</div>
      <div x-h-sidebar-group-content>
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
          <div x-h-sidebar-menu-item>
            <div x-h-sidebar-menu-skeleton.icon></div>
          </div>
        </div>
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
<div x-h-sidebar>
  <div x-h-sidebar-header>
    <button x-h-sidebar-menu-button x-h-popover-trigger.chevron>
      <span>Header popover</span>
      <i role="img" data-lucide="chevron-down"></i>
    </button>
    <div class="p-4" x-h-popover data-align="bottom-start">Header popover content</div>
  </div>
  <div x-h-sidebar-content>
    <div x-h-sidebar-group x-h-collapsible="true">
      <div x-h-sidebar-group-label>
        Application
        <div x-h-sidebar-group-action x-h-collapsible-trigger.chevron>
          <span class="sr-only">Expand</span>
          <i role="img" data-lucide="chevron-down"></i>
        </div>
      </div>
      <div x-h-sidebar-group-content x-h-collapsible-content>
        <div x-h-sidebar-menu>
          <div x-h-sidebar-menu-item>
            <button x-h-sidebar-menu-button>
              <i role="img" data-lucide="house"></i>
              Home
            </button>
            <div x-h-sidebar-menu-badge>11</div>
          </div>
          <div x-h-sidebar-menu-item>
            <a x-h-sidebar-menu-button href="#">
              <i role="img" data-lucide="file-text"></i>
              Documents
            </a>
            <div x-h-sidebar-menu-action.autohide>
              <i role="img" data-lucide="info"></i>
              <span class="sr-only">Info</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div x-h-sidebar-separator></div>
    <div x-h-sidebar-group>
      <div x-h-sidebar-group-label.action>Skeleton</div>
      <div x-h-sidebar-group-content>
        <div x-h-sidebar-menu>
          <template x-for="i in 5">
            <div x-h-sidebar-menu-item :key="i">
              <div x-h-sidebar-menu-skeleton.icon></div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div x-h-sidebar-separator></div>
    <div x-h-sidebar-group>
      <div x-h-sidebar-menu>
        <div x-h-sidebar-menu-item x-h-collapsible>
          <button x-h-sidebar-menu-button x-h-collapsible-trigger.chevron.90>
            <i role="img" data-lucide="list-tree"></i>
            <span>With subitems (Tree mode)</span>
            <i role="img" data-lucide="chevron-right"></i>
          </button>
          <ul x-h-sidebar-menu-sub x-h-collapsible-content>
            <li x-h-sidebar-menu-sub-item>
              <button x-h-sidebar-menu-sub-button data-active="true">
                <span>Sub Item 1</span>
              </button>
            </li>
            <li x-h-sidebar-menu-sub-item x-h-collapsible>
              <button x-h-sidebar-menu-sub-button x-h-collapsible-trigger.chevron.90>
                <span>Sub Item 2</span>
                <i role="img" data-lucide="chevron-right"></i>
              </button>
              <ul x-h-sidebar-menu-sub x-h-collapsible-content>
                <li x-h-sidebar-menu-sub-item>
                  <button x-h-sidebar-menu-sub-button>
                    <span>Sub Item 3</span>
                  </button>
                </li>
                <li x-h-sidebar-menu-sub-item>
                  <button x-h-sidebar-menu-sub-button data-active="true">
                    <span>Sub Item 4 </span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div x-h-sidebar-separator></div>
    <div x-h-sidebar-group>
      <div x-h-sidebar-menu>
        <div x-h-sidebar-menu-item x-data="{ expand: false }">
          <button x-h-sidebar-menu-button @click="expand = !expand">
            <i role="img" data-lucide="list-tree"></i>
            <span>With subitems (Flat mode)</span>
            <i role="img" data-lucide="chevron-right" :class="{ 'rotate-90': expand }"></i>
          </button>
          <ul x-h-sidebar-menu-sub.flat x-show="expand">
            <li x-h-sidebar-menu-sub-item>
              <button x-h-sidebar-menu-sub-button data-active="true">
                <span>Sub Item 1</span>
              </button>
            </li>
            <li x-h-sidebar-menu-sub-item>
              <button x-h-sidebar-menu-sub-button>
                <span>Sub Item 2</span>
              </button>
            </li>
            <li x-h-sidebar-menu-sub-item>
              <button x-h-sidebar-menu-sub-button>
                <span>Sub Item 3</span>
              </button>
            </li>
            <li x-h-sidebar-menu-sub-item>
              <button x-h-sidebar-menu-sub-button>
                <span>Sub Item 4</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
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
