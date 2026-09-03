# Button Group

Groups related buttons into a single container to present them as a unified set of actions. This helps establish visual relationships and improves clarity when multiple actions are closely related.

## Usage

Use button groups to organize actions that share a common context or hierarchy. Choose a horizontal or vertical layout based on available space and the flow of the interface. Avoid grouping unrelated or loosely related actions.

A group can also hold a single choice, where the buttons are options and only one of them can be selected. Use it for a small, fixed set of options that fit side by side, such as a view mode or a color scheme. For longer lists, or options that need a description, use a [Select](/components/select) or radio [Tiles](/components/tile) instead.

## Behavior

Use `data-borderless` when the group sits inside a card or another bordered container. It removes the border around the group and squares its corners, so the container's own border and radius are the only ones on show. The dividers between the buttons stay.

An `x-model` on the group turns it into a single choice. Each option carries its own value with `x-h-button-group-radio`. Clicking an option selects it, updates the bound value and dispatches a `change` event. The selected option uses its variant's pressed style, so the group looks like a segmented control with no extra styling.

## Keyboard Handling

A single choice group is one stop in the tab order. Tab moves to the selected option, and Tab again leaves the group.

| Key                                 | Description                                                                                                      |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| <kbd>Right</kbd> / <kbd>Down</kbd>  | Selects the next option, or the first one after the last. Horizontal groups use Right, vertical ones use Down.   |
| <kbd>Left</kbd> / <kbd>Up</kbd>     | Selects the previous option, or the last one before the first. Horizontal groups use Left, vertical ones use Up. |
| <kbd>Home</kbd>                     | Selects the first option.                                                                                        |
| <kbd>End</kbd>                      | Selects the last option.                                                                                         |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Selects the focused option.                                                                                      |

## Accessibility

A plain button group has `role="group"`. It has no name of its own, so add an `aria-label` when the group needs one.

With an `x-model` the group becomes a `radiogroup` and every option a `radio` with `aria-checked`. Screen readers then announce it as a set of options and say which one is selected. The group has to be named for that to be useful, so give it an `aria-label` or an `aria-labelledby`. The component logs an error when both are missing. A `role` you set yourself is never changed.

The arrow keys select as they move, which is how a radio group works. Disabled options are skipped. Only the selected option is in the tab order, so Tab reaches the group once instead of once per option, and the focus outline is drawn on top of the neighboring buttons instead of being cut off by them.

## API Reference

### Component attribute(s)

```
x-h-button-group
x-h-button-group-radio
```

### Attributes

#### x-h-button-group

| Attribute        | Type                         | Required | Description                                                                                                  |
| ---------------- | ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| data-orientation | `horizontal`<br />`vertical` | false    | Changes the orientation of the button group. A vertical single choice group uses the up and down arrow keys. |
| data-borderless  | boolean                      | false    | Removes the border around the group, keeping the dividers, and squares its corners.                          |
| aria-label       | string                       | false    | Names the group. Required for a single choice group, unless `aria-labelledby` is used instead.               |

#### x-h-button-group-radio

| Attribute | Type | Required | Description                                                                                                                   |
| --------- | ---- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `self`    | any  | true     | The option's value, for example `x-h-button-group-radio="'light'"`. The option is selected when it matches the group's value. |

Use it together with `x-h-button` on the same element, which styles the option. It has to be a `<button>` inside a group that has an `x-model`, and throws otherwise.

### Model

Bind a model only on a group of options. A group of actions has no value to hold, and binding one there would announce the buttons as a choice. `x-model`'s event modifiers (`.lazy`, `.change`, `.blur`, `.enter`) are not supported and log an error, the model always updates immediately.

Bind the value of the selected option with `x-model`. Set it to an option's value to start with that option selected, or to a value none of them has to start with nothing selected. It updates on every selection, and setting it from your own code moves the selection.

### Events

| Event  | Description                                                                                                                          |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| change | Dispatched on an option when it is selected. `event.detail.value` is the option's value. It bubbles, so you can listen on the group. |

## Examples

### Horizontal

<LiveExample data-class="flex flex-wrap justify-evenly gap-4">

```html
<div x-h-button-group>
  <button x-h-button data-variant="outline">Action</button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Add button">
    <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
  </button>
</div>
<div x-h-button-group>
  <button x-h-button>Left</button>
  <button x-h-button>Right</button>
</div>
```

</LiveExample>

### Vertical

<LiveExample data-class="flex justify-evenly gap-4">

```html
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-variant="outline">Top</button>
  <button x-h-button data-variant="outline">Center</button>
  <button x-h-button data-variant="outline">Bottom</button>
</div>
<div x-h-button-group data-orientation="vertical">
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom in">
    <svg x-h-lucide role="presentation" data-lucide="zoom-in"></svg>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Fit to screen">
    <svg x-h-lucide role="presentation" data-lucide="fullscreen"></svg>
  </button>
  <button x-h-button data-size="icon" data-variant="outline" aria-label="Zoom out">
    <svg x-h-lucide role="presentation" data-lucide="zoom-out"></svg>
  </button>
</div>
```

</LiveExample>

### Borderless

Filling a card, so the card's own border and corners are the only ones visible.

<LiveExample data-class="flex justify-center" data-style="width: 100%">

```html
<div x-data="{ density: 'cosy' }" class="w-full" style="max-width: 26rem">
  <div x-h-card class="w-full overflow-hidden">
    <div x-h-button-group x-model="density" class="w-full" data-borderless="true" aria-label="Density">
      <button x-h-button data-variant="transparent" class="flex-1" x-h-button-group-radio="'compact'">Compact</button>
      <button x-h-button data-variant="transparent" class="flex-1" x-h-button-group-radio="'cosy'">Cosy</button>
      <button x-h-button data-variant="transparent" class="flex-1" x-h-button-group-radio="'roomy'">Roomy</button>
    </div>
  </div>
</div>
```

</LiveExample>

### Single choice

Only one option can be selected at a time. The bound value is the value of the selected option.

<LiveExample data-class="flex flex-col items-center gap-4" data-exclude="generator">

```html
<div x-data="{ view: 'list' }">
  <div x-h-button-group x-model="view" aria-label="View">
    <button x-h-button data-variant="outline" x-h-button-group-radio="'list'">List</button>
    <button x-h-button data-variant="outline" x-h-button-group-radio="'grid'">Grid</button>
    <button x-h-button data-variant="outline" x-h-button-group-radio="'table'">Table</button>
  </div>
  <p x-h-text.muted class="mt-2">Showing the <span x-text="view"></span> view</p>
</div>
```

</LiveExample>

### Single choice with icons

Put the icon above the label with a `vbox`, and let the options share the width with `flex-1`. The buttons need `h-auto` to grow past the standard button height.

<LiveExample data-class="flex justify-center" data-style="width: 100%">

```html
<div x-data="{ scheme: 'light' }" class="w-full" style="max-width: 22rem">
  <div x-h-button-group x-model="scheme" class="w-full" aria-label="Color scheme">
    <button x-h-button data-variant="outline" class="h-auto flex-1 py-3" x-h-button-group-radio="'light'">
      <div class="vbox items-center gap-1">
        <svg x-h-lucide class="size-5" role="presentation" data-lucide="sun"></svg>
        <span class="font-normal">Light</span>
      </div>
    </button>
    <button x-h-button data-variant="outline" class="h-auto flex-1 py-3" x-h-button-group-radio="'dark'">
      <div class="vbox items-center gap-1">
        <svg x-h-lucide class="size-5" role="presentation" data-lucide="moon"></svg>
        <span class="font-normal">Dark</span>
      </div>
    </button>
    <button x-h-button data-variant="outline" class="h-auto flex-1 py-3" x-h-button-group-radio="'auto'">
      <div class="vbox items-center gap-1">
        <svg x-h-lucide class="size-5" role="presentation" data-lucide="sun-moon"></svg>
        <span class="font-normal">Auto</span>
      </div>
    </button>
  </div>
</div>
```

</LiveExample>

### Single choice vertical

A vertical group is navigated with the up and down arrow keys.

<LiveExample data-class="flex justify-center" data-exclude="generator">

```html
<div x-data="{ align: 'left' }">
  <div x-h-button-group x-model="align" data-orientation="vertical" aria-label="Alignment">
    <button x-h-button data-variant="outline" x-h-button-group-radio="'left'">Left</button>
    <button x-h-button data-variant="outline" x-h-button-group-radio="'center'">Center</button>
    <button x-h-button data-variant="outline" x-h-button-group-radio="'right'">Right</button>
  </div>
</div>
```

</LiveExample>
