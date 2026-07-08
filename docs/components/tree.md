# Tree

Displays hierarchical data in a structured, expandable format, allowing users to explore nested items efficiently. Tree components provide a clear and intuitive way to navigate complex relationships or grouped content.

## Usage

Use tree components for file systems, category hierarchies, or any dataset with nested relationships. Avoid overly deep or complex trees that could overwhelm users or reduce usability.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the tree:

- `Up` / `Down` - Moves focus to the previous or next visible item in the tree.
- `Right` - Expands the focused node to reveal its children. If expanded, moves focus to the first child.
- `Left` - Collapses the focused node and moves focus to its parent.
- `Enter` / `Space` - Selects the focused item.

## API Reference

### Component attribute(s)

```
x-h-tree
x-h-tree-item
x-h-tree-button
```

### Attributes

#### x-h-tree

| Attribute   | Type    | Required | Description                                                               |
| ----------- | ------- | -------- | ------------------------------------------------------------------------- |
| data-border | boolean | false    | Adds a right border to the subtree, indicating which items are inside it. |

#### x-h-button

| Attribute      | Type                                                         | Required | Description                                        |
| -------------- | ------------------------------------------------------------ | -------- | -------------------------------------------------- |
| data-indicator | `positive`<br />`negative`<br />`warning`<br />`information` | false    | Adds an indicator on the right side of the button. |

### Modifiers

#### x-h-tree

| Modifier | Description                   |
| -------- | ----------------------------- |
| sub      | Used when the tree is nested. |

#### x-h-tree-item

| Attribute | Type    | Required | Description                      |
| --------- | ------- | -------- | -------------------------------- |
| expanded  | boolean | false    | Sets the default expanded state. |

## Examples

### File browser

<LiveExample>

```html
<ul x-h-tree>
  <li x-h-tree-item.expanded="true">
    <button x-h-tree-button data-indicator="positive">
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span>Folder 1</span>
    </button>
    <ul x-h-tree.sub data-border="true">
      <li x-h-tree-item>
        <button x-h-tree-button>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span>File 1</span>
        </button>
      </li>
      <li x-h-tree-item.expanded="true">
        <button x-h-tree-button>
          <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
          <span>Folder 2</span>
        </button>
        <ul x-h-tree.sub data-border="true">
          <li x-h-tree-item>
            <button x-h-tree-button>
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>File 2</span>
            </button>
          </li>
          <li x-h-tree-item>
            <button x-h-tree-button>
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>File 3</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </li>
  <li x-h-tree-item.expanded="true">
    <button x-h-tree-button data-indicator="negative">
      <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
      <span>Folder 3</span>
    </button>
    <ul x-h-tree.sub data-border="true">
      <li x-h-tree-item>
        <button x-h-tree-button>
          <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
          <span>File 4</span>
        </button>
      </li>
      <li x-h-tree-item.expanded="true">
        <button x-h-tree-button>
          <svg x-h-lucide role="presentation" data-lucide="folder"></svg>
          <span>Folder 4</span>
        </button>
        <ul x-h-tree.sub data-border="true">
          <li x-h-tree-item>
            <button x-h-tree-button>
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>File 5</span>
            </button>
          </li>
          <li x-h-tree-item>
            <button x-h-tree-button>
              <svg x-h-lucide role="presentation" data-lucide="file-text"></svg>
              <span>File 6</span>
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

</LiveExample>
