# Tree

Displays hierarchical data in a structured, expandable format, allowing users to explore nested items efficiently. Each row can carry an icon, a checkbox, actions and a status indicator, so a tree can serve as anything from a simple outline to a full file explorer.

## Usage

Use tree components for file systems, category hierarchies, or any dataset with nested relationships. Avoid overly deep or complex trees that could overwhelm users or reduce usability.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the tree:

- `Up` / `Down` - Moves focus to the previous or next visible item in the tree. Focus does not wrap at either end.
- `Right` - Expands the focused item to reveal its children. If already expanded, moves focus to the first child.
- `Left` - Collapses the focused item. If already collapsed, moves focus to its parent.
- `Home` / `End` - Moves focus to the first or last visible item in the tree.
- `Enter` - Activates the focused item, expanding or collapsing it when it has children.
- `Space` - Toggles the focused item's checkbox, or activates the item when it has none.
- Typing letters - Moves focus to the next item whose label starts with what was typed. The buffer clears after a short pause.

Disabled items and everything nested inside them stay reachable by the arrow keys and typeahead, and are announced as unavailable. `Enter`, `Space`, expanding, collapsing and clicking do nothing on them.

## Accessibility

The tree follows the WAI-ARIA tree pattern. The root has `role="tree"`, each item is a `treeitem` that reports its expanded state through `aria-expanded`, and each subtree is a `group`. A roving tab stop keeps the whole tree a single entry in the page's Tab order.

Only items that actually have children report `aria-expanded`, so assistive technology never announces a leaf as collapsible.

Set `aria-disabled="true"` on `x-h-tree-item` to disable an item. One attribute disables the whole item. It is dimmed together with everything inside it and its checkbox is disabled too, but it keeps its place in the arrow order so it is announced rather than hidden. Neither the item nor anything nested inside it can be activated, expanded or collapsed.

Action buttons inside a row each need their own accessible name, either an `aria-label` or an `aria-labelledby`, since they carry an icon and no text. `x-h-tree-action` logs an error when neither is set. Indicators are decorative by default and hidden from assistive technology, so give the row's label the meaning instead, or put an `aria-label` on the indicator when it carries information nothing else conveys.

## API Reference

### Component attribute(s)

```
x-h-tree
x-h-tree-item
x-h-tree-row
x-h-tree-label
x-h-tree-actions
x-h-tree-action
x-h-tree-indicator
```

### Attributes

#### x-h-tree

| Attribute            | Type    | Required | Description                                                                                              |
| -------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------- |
| aria-multiselectable | boolean | false    | Announces the tree as multi-selectable. Set it when the items carry checkboxes.                          |
| data-line            | boolean | false    | On a nested tree, draws the line on its left side that connects the items inside it. Default is `false`. |

#### x-h-tree-item

| Attribute     | Type    | Required | Description                                                                                                              |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| `self`        | any     | false    | Expression holding the expanded state. A literal `true` only sets the initial state.                                     |
| aria-disabled | boolean | false    | Marks the item and everything inside it unavailable, including its checkbox. They stay keyboard-reachable and announced. |
| aria-selected | boolean | false    | Marks the item as selected and highlights its row.                                                                       |

#### x-h-tree-indicator

| Attribute      | Type                                                         | Required | Description                                                             |
| -------------- | ------------------------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| data-indicator | `positive`<br />`negative`<br />`warning`<br />`information` | false    | The colour of the indicator.                                            |
| data-dot       | boolean                                                      | false    | Renders a plain colour dot instead of a badge. Leave the element empty. |

### Modifiers

#### x-h-tree

| Modifier | Description                   |
| -------- | ----------------------------- |
| sub      | Used when the tree is nested. |

#### x-h-tree-actions

| Modifier | Description                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------ |
| autohide | Reveals the actions only while the row is hovered, focused or selected. They stay reachable by the keyboard. |

### Events

| Event           | Description                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| tree-item-click | Dispatched on an item when it is activated by click, `Enter` or `Space`. `event.detail` carries `expanded` and `depth`, and it bubbles. |

## Examples

### File browser

<LiveExample data-exclude="generator">

```html
<ul x-h-tree aria-label="Project files">
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>src</span>
    </div>
    <ul x-h-tree.sub data-line="true">
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>index.js</span>
        </div>
      </li>
      <li x-h-tree-item="true">
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
          <span x-h-tree-label>components</span>
        </div>
        <ul x-h-tree.sub data-line="true">
          <li x-h-tree-item>
            <div x-h-tree-row>
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span x-h-tree-label>button.js</span>
            </div>
          </li>
          <li x-h-tree-item>
            <div x-h-tree-row>
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span x-h-tree-label>tree.js</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li x-h-tree-item>
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>tests</span>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>tree.test.js</span>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Icons

An icon before the label and another after it are plain `svg` children. The label takes the space between them, so the trailing icon sits at the right edge.

<LiveExample data-exclude="generator">

```html
<ul x-h-tree aria-label="Documents">
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>Shared</span>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>Proposal.md</span>
          <svg x-h-lucide role="presentation" data-lucide="lock" aria-label="Read only"></svg>
        </div>
      </li>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>Notes.md</span>
          <svg x-h-lucide role="presentation" data-lucide="users" aria-label="Shared with others"></svg>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Indicators

An indicator marks a row's status at its right edge. Leave the element empty and add `data-dot` for a plain dot, or put a letter or two inside it for a badge.

<LiveExample data-exclude="generator">

```html
<ul x-h-tree aria-label="Changed files">
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>src</span>
      <span x-h-tree-indicator data-indicator="warning" data-dot></span>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>tree.js</span>
          <span x-h-tree-indicator data-indicator="warning" aria-label="Modified">M</span>
        </div>
      </li>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>row.js</span>
          <span x-h-tree-indicator data-indicator="positive" aria-label="Added">A</span>
        </div>
      </li>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>button.js</span>
          <span x-h-tree-indicator data-indicator="negative" data-dot></span>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Actions

Put `x-h-tree-action` buttons in an actions group at the end of the row. Clicks inside it never reach the row, so an action never expands or collapses the item. Add the `autohide` modifier to reveal them only on hover, focus or selection.

An action takes its colour from the row it sits on rather than setting its own, so it stays legible on a plain row and on a selected one alike.

<LiveExample data-exclude="generator">

```html
<ul x-h-tree aria-label="Playlists">
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>Playlists</span>
      <div x-h-tree-actions.autohide>
        <button x-h-tree-action aria-label="New playlist">
          <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
        </button>
      </div>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="music"></svg>
          <span x-h-tree-label>Morning</span>
          <div x-h-tree-actions.autohide>
            <button x-h-tree-action aria-label="Play Morning">
              <svg x-h-lucide role="presentation" data-lucide="play"></svg>
            </button>
          </div>
        </div>
      </li>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="music"></svg>
          <span x-h-tree-label>Focus</span>
          <div x-h-tree-actions>
            <button x-h-tree-action aria-label="Play Focus">
              <svg x-h-lucide role="presentation" data-lucide="play"></svg>
            </button>
          </div>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Actions with a menu

A dropdown menu works like anywhere else. Keep the trigger and its menu together inside the actions group.

<LiveExample data-exclude="generator">

```html
<ul x-h-tree aria-label="Reports">
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>Reports</span>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>Q1.pdf</span>
          <div x-h-tree-actions>
            <button x-h-tree-action x-h-menu-trigger.dropdown aria-label="Q1.pdf actions">
              <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
            </button>
            <ul x-h-menu aria-label="Q1.pdf actions">
              <li x-h-menu-item>Rename</li>
              <li x-h-menu-item>Duplicate</li>
              <div x-h-menu-separator></div>
              <li x-h-menu-item data-variant="negative">Delete</li>
            </ul>
          </div>
        </div>
      </li>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>Q2.pdf</span>
          <div x-h-tree-actions>
            <button x-h-tree-action x-h-menu-trigger.dropdown aria-label="Q2.pdf actions">
              <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
            </button>
            <ul x-h-menu aria-label="Q2.pdf actions">
              <li x-h-menu-item>Rename</li>
              <li x-h-menu-item>Duplicate</li>
              <div x-h-menu-separator></div>
              <li x-h-menu-item data-variant="negative">Delete</li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Selection

Listen for `tree-item-click` on the tree and decide what selected means. Here each item carries a value and the most recently activated one is highlighted.

<LiveExample>

```html
<ul x-h-tree aria-label="Settings" x-data="{ selected: 'general' }" @tree-item-click="selected = $event.target.dataset.value">
  <li x-h-tree-item="true" data-value="workspace">
    <div x-h-tree-row>
      <svg x-h-lucide role="presentation" data-lucide="cog"></svg>
      <span x-h-tree-label>Workspace</span>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item data-value="general" :aria-selected="selected === 'general'">
        <div x-h-tree-row>
          <span x-h-tree-label>General</span>
        </div>
      </li>
      <li x-h-tree-item data-value="members" :aria-selected="selected === 'members'">
        <div x-h-tree-row>
          <span x-h-tree-label>Members</span>
        </div>
      </li>
      <li x-h-tree-item data-value="billing" :aria-selected="selected === 'billing'">
        <div x-h-tree-row>
          <span x-h-tree-label>Billing</span>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Multiple selection

Place a checkbox in the row and bind its checked state yourself. The disabled item shows the cascade, since its checkbox is disabled by the item rather than by hand.

<LiveExample>

```html
<ul x-h-tree aria-label="Documents" aria-multiselectable="true" x-data="{ selected: ['readme'] }">
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <span x-h-checkbox.tree>
        <input type="checkbox" x-model="selected" value="docs" />
      </span>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>Documents</span>
    </div>
    <ul x-h-tree.sub>
      <li x-h-tree-item>
        <div x-h-tree-row>
          <span x-h-checkbox.tree>
            <input type="checkbox" x-model="selected" value="readme" />
          </span>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>README.md</span>
        </div>
      </li>
      <li x-h-tree-item aria-disabled="true">
        <div x-h-tree-row>
          <span x-h-checkbox.tree>
            <input type="checkbox" x-model="selected" value="archive" />
          </span>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>archive.zip</span>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Parent checkbox states

A parent checkbox that reflects its children is a matter of driving the native `indeterminate` property. Set it with `x-effect` and the checkbox renders the partial state for you.

<LiveExample data-exclude="generator">

```html
<ul
  x-h-tree
  aria-label="Permissions"
  aria-multiselectable="true"
  x-data="{
    children: ['read', 'write', 'delete'],
    selected: ['read'],
    get all() { return this.children.every((c) => this.selected.includes(c)) },
    get some() { return this.children.some((c) => this.selected.includes(c)) },
    toggleAll(checked) { this.selected = checked ? [...this.children] : [] },
  }"
>
  <li x-h-tree-item="true">
    <div x-h-tree-row>
      <span x-h-checkbox.tree>
        <input type="checkbox" :checked="all" x-effect="$el.indeterminate = some && !all" @change="toggleAll($event.target.checked)" />
      </span>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>All permissions</span>
    </div>
    <ul x-h-tree.sub>
      <template x-for="child in children" :key="child">
        <li x-h-tree-item>
          <div x-h-tree-row>
            <span x-h-checkbox.tree>
              <input type="checkbox" x-model="selected" :value="child" />
            </span>
            <span x-h-tree-label x-text="child"></span>
          </div>
        </li>
      </template>
    </ul>
  </li>
</ul>
```

</LiveExample>

### Building a tree from data

Render a tree of any depth from JSON by pairing `x-for` with the template directive, which lets a template render itself for every level of children.

<LiveExample data-exclude="generator">

```html
<div x-data="fileTree">
  <ul x-h-tree aria-label="Project" @tree-item-click="active = $event.target.dataset.value">
    <template x-for="node in nodes" :key="node.id">
      <template x-h-template="$refs.nodeTemplate" x-data="{ node }"></template>
    </template>
  </ul>

  <template x-ref="nodeTemplate">
    <li x-h-tree-item="node.expanded" :data-value="node.id" :aria-selected="active === node.id">
      <div x-h-tree-row>
        <svg x-h-lucide role="presentation" :data-lucide="node.children ? 'folder' : 'file-text'"></svg>
        <span x-h-tree-label x-text="node.label"></span>
        <template x-if="node.status">
          <span x-h-tree-indicator :data-indicator="node.status" data-dot></span>
        </template>
      </div>

      <template x-if="node.children">
        <ul x-h-tree.sub data-line="true">
          <template x-for="child in node.children" :key="child.id">
            <template x-h-template="$refs.nodeTemplate" x-data="{ node: child }"></template>
          </template>
        </ul>
      </template>
    </li>
  </template>
</div>
<script>
  Alpine.data('fileTree', () => ({
    active: 'tree.js',
    nodes: [
      {
        id: 'src',
        label: 'src',
        expanded: true,
        children: [
          { id: 'index.js', label: 'index.js' },
          {
            id: 'components',
            label: 'components',
            expanded: true,
            children: [
              { id: 'tree.js', label: 'tree.js', status: 'warning' },
              { id: 'button.js', label: 'button.js' },
            ],
          },
        ],
      },
      {
        id: 'tests',
        label: 'tests',
        children: [{ id: 'tree.test.js', label: 'tree.test.js', status: 'positive' }],
      },
      { id: 'readme', label: 'README.md' },
    ],
  }));
</script>
```

</LiveExample>

### Everything together

<LiveExample data-exclude="generator">

```html
<ul x-h-tree aria-label="Repository" aria-multiselectable="true" x-data="{ selected: [], active: 'tree.js' }" @tree-item-click="active = $event.target.dataset.value">
  <li x-h-tree-item="true" data-value="src">
    <div x-h-tree-row>
      <span x-h-checkbox.tree>
        <input type="checkbox" x-model="selected" value="src" />
      </span>
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span x-h-tree-label>src</span>
      <div x-h-tree-actions.autohide>
        <button x-h-tree-action aria-label="New file in src">
          <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
        </button>
      </div>
      <span x-h-tree-indicator data-indicator="warning" data-dot></span>
    </div>
    <ul x-h-tree.sub data-line="true">
      <li x-h-tree-item data-value="tree.js" :aria-selected="active === 'tree.js'">
        <div x-h-tree-row>
          <span x-h-checkbox.tree>
            <input type="checkbox" x-model="selected" value="tree.js" />
          </span>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>tree.js</span>
          <div x-h-tree-actions.autohide>
            <button x-h-tree-action x-h-menu-trigger.dropdown aria-label="tree.js actions">
              <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
            </button>
            <ul x-h-menu aria-label="tree.js actions">
              <li x-h-menu-item>Rename</li>
              <li x-h-menu-item data-variant="negative">Delete</li>
            </ul>
          </div>
          <span x-h-tree-indicator data-indicator="warning" aria-label="Modified">M</span>
        </div>
      </li>
      <li x-h-tree-item data-value="row.js" :aria-selected="active === 'row.js'">
        <div x-h-tree-row>
          <span x-h-checkbox.tree>
            <input type="checkbox" x-model="selected" value="row.js" />
          </span>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>row.js</span>
          <span x-h-tree-indicator data-indicator="positive" aria-label="Added">A</span>
        </div>
      </li>
      <li x-h-tree-item aria-disabled="true" data-value="legacy.js">
        <div x-h-tree-row>
          <span x-h-checkbox.tree>
            <input type="checkbox" x-model="selected" value="legacy.js" />
          </span>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span x-h-tree-label>legacy.js</span>
        </div>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>
