# Responsive

A behavior-only directive that adds or removes classes based on the element's **own** width. Unlike Tailwind's viewport prefixes (`md:`, `lg:`), which react to the size of the viewport, responsive reacts to the size of the element itself, so a component can adapt to the space it is actually given (a narrow sidebar, a resized panel, a grid cell) without every combination needing a prefixed class in the bundle.

## Usage

Pass an array of condition objects. Each condition has an operator (`op`), a pixel `width`, and a way to react: a list of `classes`, a `callback` function, or both. While the element's width satisfies a condition, that condition's classes are applied. When it no longer satisfies it, they are removed. The element's width is watched continuously, so the classes update as the element grows or shrinks. The directive only ever touches the classes you list, so any other classes on the element are left untouched. Conditions are independent predicates, not exclusive breakpoints, so more than one can match at the same time and all of their classes apply.

A `callback` receives a single boolean argument, `true` when the condition currently matches and `false` when it does not. It is called once on mount with the initial state and then once each time that state flips, so it does not fire on every resize while the condition stays on one side of its breakpoint. `classes` and `callback` are each optional, but every condition must have at least one of them.

By default the width being watched is the element's own. When a condition applies a class that collapses that box (for example `hidden`, which sets `display: none`), the element would measure as zero pixels wide and could never grow back. For those cases add the `parent` modifier so the element's parent is measured instead, giving a stable signal that is not affected by the classes toggled on the element.

## API Reference

### Component attribute(s)

```
x-h-responsive
```

### Arguments

| Attribute    | Type                                         | Required | Description                                                                        |
| ------------ | -------------------------------------------- | -------- | ---------------------------------------------------------------------------------- |
| `expression` | `Array<{ op, width, classes?, callback? }>`  | true     | The list of width conditions. Each entry describes how to react at a given width.  |
| `op`         | `'>='` \| `'>'` \| `'<'` \| `'<='` \| `'=='` | true     | How the element's width is compared against `width`. `>` and `<` are strict.       |
| `width`      | number                                       | true     | The breakpoint in pixels. Must be a number.                                        |
| `classes`    | string[]                                     | false    | The classes to apply while the condition matches.                                  |
| `callback`   | function                                     | false    | Called with a boolean when the condition's match state changes, and once on mount. |

Each condition must have at least one of `classes` or `callback`.

### Modifiers

| Modifier | Description                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `parent` | Measure the width of the element's parent instead of the element itself. Use it when a toggled class collapses the element's own box (`hidden`). |

## Examples

### Row vs column

Below a width of 400px the container stacks its items vertically with a larger gap. At or above 400px it lays them out in a row. Drag the slider to resize the container and watch the layout switch.

<LiveExample>

```html
<div x-data="{ w: 500 }" class="vbox gap-4">
  <div x-h-range x-model.number="w" data-min="200" data-max="600" data-label="Width">
    <input type="text" name="volume" />
  </div>
  <div
    class="rounded-md border p-4"
    :style="`width: ${w}px;`"
    x-h-responsive="[
      { op: '>=', width: 400, classes: ['hbox', 'gap-2'] },
      { op: '<',  width: 400, classes: ['vbox', 'gap-1'] }
    ]"
  >
    <button x-h-button data-variant="primary">Save</button>
    <button x-h-button data-variant="outline">Cancel</button>
    <button x-h-button data-variant="ghost">Reset</button>
  </div>
</div>
```

</LiveExample>

### Hiding content in tight spaces

A heading grows as more room becomes available and disappears entirely once the container gets too narrow. Because `hidden` collapses the heading's own box, the `parent` modifier is used so the container's width keeps driving the conditions and the heading reappears when there is room again.

<LiveExample>

```html
<div x-data="{ w: 500 }" class="vbox gap-4">
  <div x-h-range x-model.number="w" data-min="200" data-max="600" data-label="Width">
    <input type="text" name="volume" />
  </div>
  <div class="rounded-md border p-4" :style="`width: ${w}px;`">
    <span
      class="text-base"
      x-h-responsive.parent="[
        { op: '>=', width: 480, classes: ['text-xl'] },
        { op: '<',  width: 320, classes: ['hidden'] }
      ]"
    >
      Dashboard overview
    </span>
  </div>
  <p class="text-sm">The heading grows past 480px and disappears entirely below 320px.</p>
</div>
```

</LiveExample>

### Reacting with a callback

Instead of toggling classes, a condition can run a `callback` when its match state changes. Here the callback records whether the container is wide, so the label below reflects the current layout without needing a class for it. It updates once on load and once each time the 400px breakpoint is crossed.

<LiveExample>

```html
<div x-data="{ w: 500, wide: true }" class="vbox gap-4">
  <div x-h-range x-model.number="w" data-min="200" data-max="600" data-label="Width">
    <input type="text" name="volume" />
  </div>
  <div
    class="rounded-md border p-4"
    :style="`width: ${w}px;`"
    x-h-responsive="[
      { op: '>=', width: 400, callback: (matched) => wide = matched }
    ]"
  >
    <span x-text="wide ? 'Wide layout' : 'Narrow layout'"></span>
  </div>
</div>
```

</LiveExample>
