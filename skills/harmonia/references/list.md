# List

A container that displays a collection of related items in a structured format. Lists help organize content clearly and improve readability by grouping similar elements together.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use lists to present multiple related items, such as options, tasks, or entries. Avoid using lists for grouping unrelated content.

## Behavior

An item is a container rather than a control, so a list is made interactive by putting a real button or link inside the item with `x-h-list-item-button`. Everything about the interaction (`@click`, `href`, `aria-current` and `disabled`) belongs on that control.

The control fills the row and takes the row's padding, so the area that responds to a click is the area that lights up. The item is what paints, which is why the highlight still spans the full width.

A button placed beside the control, for an action on the row rather than the row itself, is an ordinary `x-h-button` and stays outside `x-h-list-item-button`. It gets its own hover and leaves the row alone, so the two never light up at once.

Which row is the current one stays yours to manage. Bind `aria-current` on the control to mark it, since the list never changes it. Use `page` for a list of destinations and a bound boolean for a list you select from.

## Directives

`x-h-list` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-list`
- `x-h-list-item`
- `x-h-list-item-button`
- `x-h-list-secondary`
- `x-h-list-header`

## API

### Attributes

#### x-h-list-item-button

| Attribute     | Type    | Required | Description                                                                                                                            |
| ------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| aria-current  | string  | false    | Marks the row as the current one, which highlights it. Use `page` in a list of destinations, or bind a boolean elsewhere.              |
| aria-disabled | boolean | false    | Marks the control unavailable while keeping it focusable and announced. On a button, `disabled` removes it from the tab order instead. |

## Keyboard Handling

The row control is a native button or link, so it behaves like one and the list adds nothing of its own. Each control is a separate tab stop and the arrow keys are not used. For a group that `Tab` enters once and the arrow keys move through, use the Listbox component instead.

- `Tab` / `Shift+Tab` - Moves focus to the next or previous control, including any action button beside a row control.
- `Enter` / `Space` - Activates the focused button. A link activates on `Enter`.

## Accessibility

An item is always a list item, whether the list is interactive or not, so the list is announced as a list and with its item count. This is why the control goes inside the item rather than on it.

An item that holds only an icon needs an `aria-label` on its control, naming the row rather than the icon.

## Examples

```html
<ul x-h-list>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
```

### Interactive with disabled items

```html
<ul x-h-list x-data="{ selected: 3 }">
  <template x-for="item in [1, 2, 3, 4, 5]" :key="item">
    <li x-h-list-item>
      <button x-h-list-item-button :aria-current="selected === item" @click="selected = item" :disabled="item === 4 || item === 2" x-text="'List Item ' + item"></button>
    </li>
  </template>
</ul>
```

### With secondary text

```html
<ul x-h-list x-data="{ selected: 2 }">
  <template x-for="item in [1, 2, 3]" :key="item">
    <li x-h-list-item>
      <button x-h-list-item-button class="items-start" :aria-current="selected === item" @click="selected = item">
        <div class="vbox min-w-0 flex-1">
          <span x-text="'List Item ' + item"></span>
          <span x-h-list-secondary class="text-sm" x-text="'Secondary line for item ' + item"></span>
        </div>
      </button>
    </li>
  </template>
</ul>
```

### Interactive with a row action

```html
<ul x-h-list x-data="{ selected: 1, saved: null }">
  <template x-for="item in [1, 2, 3]" :key="item">
    <li x-h-list-item>
      <button x-h-list-item-button>
        <svg x-h-icon class="size-6" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
        <span x-text="'List Item ' + item"></span>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" :aria-label="'Save list item ' + item" @click="saved = item">
        <svg x-h-lucide role="presentation" data-lucide="save"></svg>
      </button>
    </li>
  </template>
</ul>
```

### As links

```html
<ul x-h-list>
  <li x-h-list-item>
    <a x-h-list-item-button href="/harmonia/components/list.html" aria-current="page">List</a>
  </li>
  <li x-h-list-item>
    <a x-h-list-item-button href="/harmonia/components/listbox.html">Listbox</a>
  </li>
  <li x-h-list-item>
    <a x-h-list-item-button href="/harmonia/components/combobox.html">Combobox</a>
  </li>
</ul>
```

### With header

```html
<ul x-h-list>
  <li x-h-list-header>Group 1</li>
  <li x-h-list-item>List Item 1</li>
  <li x-h-list-item>List Item 2</li>
  <li x-h-list-item>List Item 3</li>
</ul>
```

### With icons and buttons

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

Full docs: https://www.codbex.com/harmonia/components/list.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
