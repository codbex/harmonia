# Migration

Breaking changes only, grouped by version (newest first). For the full history including features and fixes, see [CHANGELOG.md](https://github.com/codbex/harmonia/blob/main/CHANGELOG.md).

## v3.0.0

- **Breaking: the accordion item id is now evaluated as an Alpine expression.** `x-h-accordion-item` and the optional default-expanded id on `x-h-accordion.single` used to take their value as a literal string. Both are now evaluated, matching `x-h-accordion-trigger`. To migrate, quote hard-coded ids, so `x-h-accordion-item="itemId1"` becomes `x-h-accordion-item="'itemId1'"` and `x-h-accordion.single="itemId2"` becomes `x-h-accordion.single="'itemId2'"`. This enables `x-h-accordion-item="entry.id"` inside an `x-for`, which previously gave every row the same literal id and broke single mode.

## v2.13.0

- **Breaking: the fade utilities take a size, and the bare names are gone.** `fade-x`, `fade-y`, `fade-t`, `fade-b`, `fade-l` and `fade-r` no longer exist. Each class now ends with a size on the spacing scale, shipped in `2`, `4` and `8` (a 0.5rem, 1rem or 2rem fade). To migrate, append `-2` to the old name, so `fade-x` becomes `fade-x-2` with the exact same 0.5rem fade.

## v2.12.0

- **Breaking: the options must now be wrapped in `x-h-select-list`.** The popup keeps the positioning and the chrome, and the new element inside it is the `listbox` and the scroll container. That is what lets an `x-h-select-search` sit above it as a sibling instead of inside the listbox, where it was an invalid child that screen readers could not account for. It also means the search stays visible while the options scroll under it. To migrate, wrap everything inside `x-h-select-content` other than the search in a `x-h-select-list`.

```html
<!-- Before -->
<div x-h-select-content>
  <div x-h-select-search></div>
  <div x-h-select-option="'Apple'" data-value="apple"></div>
</div>

<!-- After -->
<div x-h-select-content>
  <div x-h-select-search></div>
  <div x-h-select-list>
    <div x-h-select-option="'Apple'" data-value="apple"></div>
  </div>
</div>
```

- **Breaking: the trigger is a `button` instead of a `span`.** It is generated, so no markup changes, but a stylesheet selecting it by tag name has to select `[data-slot="select-input"]` instead. Being a button makes it labelable, so a `<label for="...">` pointing at `data-id` now both names it and opens the list when clicked, and it drops the `tabindex` it needed as a span.

- **Breaking: the search's combobox semantics moved onto its input.** `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-haspopup` and `aria-autocomplete` were on the wrapper element, which is neither focusable nor an input - the row itself is now a plain container. The generated input also has its own `data-slot="select-search-input"` rather than reusing the trigger's `select-input`, so a query for the trigger no longer finds the search first.

- **Breaking: `data-id` on `x-h-select-input` is back**, and it sets the id of the generated trigger so the trigger can be referenced by a `<label for>` or reached programmatically. It is unrelated to the input's own `id`, which is left alone.

## v2.10.0

- **Breaking: `getBreakpointListener` now measures the current frame by default.** Its third argument is renamed from `frame` to `topFrame` and its meaning is inverted: leaving it out measures the frame the listener runs in, and passing `true` measures the topmost frame. To migrate, pass `true` as the third argument wherever you relied on the old default. The new default matches the CSS breakpoint variants a handler is usually paired with, which resolve against the current frame, so the two no longer disagree inside an iframe.

## v2.9.0

- **Breaking: an `aria-disabled` item now stays in the arrow order.** Listbox options, select options, menu items, submenu triggers, menubar triggers, tabs and tree items marked `aria-disabled="true"` are reached by the arrow keys, `Home`, `End` and typeahead, can hold the roving tab stop, and are announced as unavailable. They still cannot be selected, activated, expanded or collapsed. Previously they were skipped, which hid them from screen reader users. Use the native `disabled` attribute, which is unchanged, when an item should be hidden rather than announced.

- **Breaking: `data-disabled` is gone from the Menu and the Select.** `x-h-menu-item`, `x-h-menu-sub` and `x-h-select-option` now read `aria-disabled="true"` like every other component. To migrate, rename the attribute. `data-disabled` is unchanged on `x-h-input-group-addon` and `x-h-field`, where it is a styling hook only.

- **Breaking: the Rating is locked with `aria-disabled="true"`.** The `disabled`, `data-disabled` and `data-readonly` attributes are gone, and the separate read-only state with them. To migrate, replace them with `aria-disabled="true"`, which requires the explicit value. This also fixes `data-readonly="false"` having made a rating read-only.

- **Breaking: a locked Rating stays a focusable slider.** It used to become `role="img"` with every value attribute stripped and no tab stop, so a keyboard user could not reach it. It now keeps `role="slider"`, its tab stop and its `aria-valuenow` / `aria-valuetext` in every state, and only refuses input.

- **Breaking: `data-label` is gone from the Rating, the Carousel, the carousel indicators, the reactions group and the dual Range.** Each sits on an element the author writes, so `aria-label` could always be set on it directly. To migrate, rename the attribute to `aria-label`. Every default name is unchanged.

- **Breaking: the audio seek slider is named with `data-seek-label`**, matching its `data-play-label` / `data-pause-label` siblings. Rename it from `data-label`.

- **Breaking: the tree has been rebuilt around a row element and `x-h-tree-button` is gone.** An item is now a `li` holding a `x-h-tree-row`, with the label in a `x-h-tree-label`. To migrate, replace the `button x-h-tree-button` with a `div x-h-tree-row`, wrap the label text in a `span x-h-tree-label`, and move the checkbox inside the row. Icons stay plain `svg` children and the subtree stays where it was, a sibling of the row inside the same `li`.

```html
<!-- Before -->
<li x-h-tree-item.expanded="true">
  <span x-h-checkbox.tree><input type="checkbox" /></span>
  <button x-h-tree-button data-indicator="warning">
    <svg x-h-lucide data-lucide="folder"></svg>
    <span>src</span>
  </button>
</li>

<!-- After -->
<li x-h-tree-item="true">
  <div x-h-tree-row>
    <span x-h-checkbox.tree><input type="checkbox" /></span>
    <svg x-h-lucide data-lucide="folder"></svg>
    <span x-h-tree-label>src</span>
    <span x-h-tree-indicator data-indicator="warning" data-dot></span>
  </div>
</li>
```

- **Breaking: the `expanded` modifier is gone.** Items now detect their own children, so one added or removed by `x-if` or `x-for` updates the chevron and `aria-expanded` on its own. The expression carries only the expanded state.

- **Breaking: group action buttons must now be wrapped in `x-h-sidebar-group-actions`.** To migrate, move each existing `x-h-sidebar-group-action` inside a `x-h-sidebar-group-actions` wrapper in the group label. A group label can now carry more than one action.

- **Breaking: the listbox is now a single tab stop.** `Tab` moves into the listbox and then past it, and the arrow keys move between the options inside, instead of every option being its own tab stop. Focus starts on the selected option, or on the first one when nothing is selected.

## v2.8.0

- **Breaking: `h-mask` and `v-mask` were renamed to `fade-x` and `fade-y`.** The old class names no longer ship. `fade-x` fades the left and right edges, `fade-y` the top and bottom, following the same `-x` / `-y` axis convention as the rest of the library. Replace any `h-mask` with `fade-x` and any `v-mask` with `fade-y`.

## v2.7.0

- **Breaking: the day grid no longer collapses on its own.** The Slot Picker previously stacked its columns into one below the `md` breakpoint and expanded to the configured day count at `md` and above. It now always shows the configured number of columns (they simply shrink on narrow containers). To restore the old auto-stacking behavior, add the new `x-h-slot-picker.responsive` modifier.

- **Breaking: a slot is selectable only with an `x-model`.** Selection is now opt-in: bind an `x-model` and slots become selectable (with `aria-pressed` and a selected state) as before. Without a model, slots are plain action buttons - they still fire the `slot-click` event but never enter a selected state, and `event.detail.slot.selected` is always `false`.

## v2.6.0

- **Breaking: the Range slider was rewritten and no longer uses `nouislider`.** It is now a native-input-backed slider styled with Tailwind, which also removes `nouislider` from the package's dependencies.

- **Breaking: markup now requires a child `<input>`.** The element must contain a native `<input>` as a direct child, from which the slider takes its value, `name`, and disabled state (the directive throws when the input is missing). The `disabled` attribute now goes on that inner input rather than on the wrapper element.

- **Breaking: configuration moved from a config object to modifiers and `data-*` attributes.** The old `x-h-range="config"` object and the `auto-hide-tips` attribute are gone. Orientation and dual handles are now `x-h-range.vertical` and `x-h-range.dual` modifiers (combinable), and the range is configured with `data-min`, `data-max`, `data-step`, `data-value`, `data-tooltips` (`true` for always visible or `auto` for on-interaction), `data-unit`, `data-label`, and `data-min-label` / `data-max-label` for the dual handles.

- **Breaking: the `x-model` shape changed.** A single slider now models a plain number instead of an array, while a `.dual` slider models a `[low, high]` array. The model updates live during dragging.

## v2.5.0

- **Breaking: you now compose the toolbar.** The Slot Picker renders only the day grid - it no longer builds its own toolbar. Build one from an `x-h-toolbar` wrapping the new control directives, each on an ordinary `x-h-button` that supplies the icon, label, and styling while the directive supplies the behavior: `x-h-slot-picker-previous` and `x-h-slot-picker-next` (page the window and disable at the `minDate` / `maxDate` bounds), `x-h-slot-picker-today` (return to the current day), `x-h-slot-picker-title` (the current period heading, an `aria-live` region), and `x-h-slot-picker-calendar` (opens a calendar popover to jump to any date). Each control must be a descendant of `x-h-slot-picker`.

- **Breaking: host label attributes removed.** Because you now own the buttons, `data-aria-prev`, `data-aria-next`, `data-aria-calendar`, and `data-today-label` were removed - put an `aria-label` or visible text on your own buttons instead. `data-unavailable-label` is the only host label attribute that remains. The calendar popover is now built lazily, only when a `x-h-slot-picker-calendar` control is present, and takes its accessible name from that control through `aria-labelledby` (generating an id when the button has none, reusing a consumer-supplied one).

- **Breaking: the slot `icons` shape changed.** Corner badges are now `icons: { left, right }`, each an optional array of `{ url, alt }` shown in the top-left and top-right corners. The old `icon: { url, alt }` and flat `icons: [...]` (top-right only) are gone.

## v2.4.0

- **Breaking: the custom `position-fit` class has been removed in favor of the standard `inset-0` utility.** It produces the same `top: 0; right: 0; bottom: 0; left: 0;`. Replace any `position-fit` with `inset-0`.

## v2.0.0

- **Breaking: date/time pickers refactored to use standard model values** instead of custom formats, so `x-model` bindings behave predictably across the picker family.

- **Breaking: icon rendering changed from a modifier to the reactive `data-icon` attribute.** `x-h-icon.home` becomes `x-h-icon data-icon="home"`. The icon now switches dynamically when `data-icon` changes at runtime.

- **Breaking: utility class `absolute-fit` renamed to `position-fit`.**

- **Breaking: built-in icons renamed:** `info.svg` -> `circle-info.svg`, `warning.svg` -> `circle-warning.svg`.

- **Breaking: form validation now defers to `:user-invalid` instead of `:invalid`.** Inputs, input-groups, and fieldsets no longer show error styling on initial load; they show it only after interaction/submit. Opt back into immediate on-load validation with `data-validate="immediate"` on an ancestor.
