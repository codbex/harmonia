# List

A container that displays a collection of related items in a structured format. Lists help organize content clearly and improve readability by grouping similar elements together.

## Usage

Use lists to present multiple related items, such as options, tasks, or entries. Avoid using lists for grouping unrelated content.

## Accessibility

An item without the `interactive` modifier is display-only and takes no part in the tab order. A plain list of them is announced as a list, with its item count.

## Keyboard Handling

An interactive item is a control in its own right, so `Tab` moves between interactive items the same way it moves between buttons, and the arrow keys are not used. For a group that `Tab` enters once and the arrow keys move through, use the [Listbox](/components/listbox) component instead.

- `Tab` / `Shift+Tab` - Moves focus to the next or previous interactive item.
- `Enter` / `Space` - Activates the focused item.

Selection state stays yours to manage. Bind `aria-selected` to mark a row as selected, since the list never changes it.

## API Reference

### Component attribute(s)

```
x-h-list
x-h-list-item
x-h-list-secondary
x-h-list-header
```

### Attributes

#### x-h-list-item

| Attribute     | Type    | Required | Description                                                                                                              |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| aria-disabled | boolean | false    | Marks an interactive item unavailable while keeping it focusable and announced. Has no effect on a non-interactive item. |

### Modifiers

#### x-h-list-item

| Modifier    | Description                                                                                                             |
| ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| interactive | Turns the item into a button, so it gains a tab stop, activates on click, `Enter`, and `Space`, and is styled to match. |

## Examples

<LiveExample data-exclude="generator">

```html
<ul x-h-list>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
```

</LiveExample>

### Interactive with disabled items

<LiveExample>

```html
<ul x-h-list x-data="{ selected: 3 }">
  <template x-for="item in [1, 2, 3, 4, 5]" :key="item">
    <li x-h-list-item.interactive :aria-selected="selected === item" @click="selected = item" :aria-disabled="item === 4 || item === 2" x-text="'List Item ' + item"></li>
  </template>
</ul>
```

</LiveExample>

### With secondary text

<LiveExample>

```html
<ul x-h-list x-data="{ selected: 2 }">
  <template x-for="item in [1, 2, 3]" :key="item">
    <li x-h-list-item.interactive class="items-start" :aria-selected="selected === item" @click="selected = item">
      <div class="vbox min-w-0 flex-1">
        <span x-text="'List Item ' + item"></span>
        <span x-h-list-secondary class="text-sm" x-text="'Secondary line for item ' + item"></span>
      </div>
    </li>
  </template>
</ul>
```

</LiveExample>

### With header

<LiveExample>

```html
<ul x-h-list>
  <li x-h-list-header>Group 1</li>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
```

</LiveExample>

### With icons and buttons

<LiveExample>

```html
<ul x-h-list>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 1
    <div class="flex-1"></div>
    <button x-h-button data-variant="outline" data-size="icon-sm" aria-label="Save button">
      <svg x-h-lucide role="presentation" data-lucide="save"></svg>
    </button>
  </li>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 2
  </li>
  <li x-h-list-item>
    <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
    List Item 3
  </li>
</ul>
```

</LiveExample>
