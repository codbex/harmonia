# Migration

Breaking changes only, grouped by version (newest first). For the full history including features and fixes, see [CHANGELOG.md](https://github.com/codbex/harmonia/blob/main/CHANGELOG.md).

## v3.1.0

- **Breaking: the `interactive` modifier on `x-h-list-item` is removed.** It set `role="button"` on the `li`, leaving the `ul` with no list items. To migrate, wrap the row's content in a `button` or `a` carrying `x-h-list-item-button`, move `@click` and any layout classes onto it, and replace `aria-selected` on the item with `aria-current` on the control. Options and plain lists are unaffected.

- **Breaking: the listbox is a plugin of its own**, no longer riding along with the list plugin. Only affects ESM consumers registering components one by one: add `Alpine.plugin(Listbox)` beside `Alpine.plugin(List)`. `registerComponents` and the CDN bundle need no change.

## v3.0.0

- **Breaking: the dialog surface no longer has padding of its own.** The header, the body and the footer now pad themselves, so a body that is not wrapped in `x-h-dialog-content` reaches the edges of the dialog. To migrate, wrap it: `<div x-h-dialog-content>` around whatever sits between the header and the footer, carrying over the classes it already had. A dialog laid out only from a header and a footer needs no change and looks exactly as before. Two things get easier in return. A focused control inside a scrolling body no longer has its focus ring clipped at the left and right edges, because the padding is now inside the scrolling area instead of outside it. And content that should span the full width, a calendar, a table or a list, is now a matter of the new `flush` modifier on the body (`x-h-dialog-content.flush`) instead of cancelling the surface padding with `p-0!` and re-adding it to every other part by hand.

- **Breaking: the card surface no longer has padding of its own.** The header, the content and the footer now pad themselves, so anything placed straight in a card reaches its edges. To migrate, wrap what should stay inset in `x-h-card-content`, carrying over the classes it already had. A card built from the header, content and footer slots needs no change and looks exactly as before, in every combination of the three. What gets easier is the case the card was worst at: a table, a list or a calendar that should span the full width of the card is now the new `flush` modifier on the content (`x-h-card-content.flush`), or simply a direct child of the card, instead of cancelling the surface padding with `p-0!` and putting it back on every other part by hand.

- **Breaking: `x-h-button-group-separator` is removed.** The group now draws the dividers itself, so the directive has nothing left to do. To migrate, delete the `<div x-h-button-group-separator></div>` elements from your button groups. The divider appears in their place on its own.

- **Breaking: the `input` and `change` events now carry their value in `event.detail.value`.** They used to put the raw value in `event.detail`, unlike every other component, whose change events report `event.detail.value`. To migrate, read `$event.detail.value` instead of `$event.detail` in `@input` and `@change` handlers.

- **Breaking: the accordion item id is now evaluated as an Alpine expression.** `x-h-accordion-item` and the optional default-expanded id on `x-h-accordion.single` used to take their value as a literal string. Both are now evaluated, matching `x-h-accordion-trigger`. To migrate, quote hard-coded ids, so `x-h-accordion-item="itemId1"` becomes `x-h-accordion-item="'itemId1'"` and `x-h-accordion.single="itemId2"` becomes `x-h-accordion.single="'itemId2'"`. This enables `x-h-accordion-item="entry.id"` inside an `x-for`, which previously gave every row the same literal id and broke single mode.

- **Breaking: a navigation destination is now `x-h-sidebar-menu-nav`.** A menu button used to receive `aria-current="page"` whenever it was marked `data-active="true"`, on the assumption that the sidebar is the page's navigation. That is wrong for an active button that marks a selected filter, a menu trigger or anything else that is not the current page. The sidebar now has two menu button directives sharing one look and behaviour. `x-h-sidebar-menu-nav` announces the active destination with `aria-current="page"`, while `x-h-sidebar-menu-button` never touches `aria-current` and leaves it entirely to the author. The `data-slot` now says which one an element is, too. A nav carries `sidebar-menu-nav`, and a button or a nav inside a `x-h-sidebar-menu-sub` carries `sidebar-menu-sub-button` or `sidebar-menu-sub-nav` instead of the `sidebar-menu-button` every variant used to get. To migrate, write `x-h-sidebar-menu-nav` on the buttons and links that mark the current destination, keep every other menu button as it is, and update tests or CSS selecting on `data-slot=sidebar-menu-button` for the renamed elements.

- **Breaking: a chip is now a container holding its own buttons.** `x-h-chip` used to go on a `<button>`, which left a dismissible chip as a button with another control inside it. A `<button>` may not contain interactive content, and the invalid markup had real consequences: the close was a `<span>` carrying `role="button"` and a tab stop, so `Tab` reached it while `Enter` and `Space` did nothing at all, leaving a keyboard or screen reader user able to reach the close and never dismiss the chip. Its click also had to be stopped from reaching the chip around it, and the chip's hover state had to exclude it selector by selector. The chip is now a plain container, and each control inside it is a real button, so all of that goes away and keyboard operability, `disabled` and focus come from the elements themselves. To migrate, put `x-h-chip` on a `<div>`, a `<span>` or whatever non-interactive element suits the surrounding markup, move the clickable part onto a `<button x-h-chip-button>` inside it along with everything about the interaction (`@click`, `aria-pressed`, `disabled`), and leave `data-variant` on the chip, which still paints the pill. A chip that is only a label needs no button at all and is no longer announced as one. `x-h-chip-close` moves from a `<span>` to a `<button>` and keeps its required `aria-label` or `aria-labelledby`. Two smaller consequences: pointing at a dismissible chip now highlights the half under the pointer rather than the whole pill, and a label that has to be cut short takes a `truncate` class of its own, since only the element holding the text can end it with an ellipsis. A chip whose button opens a popover keeps the panel inside the chip, after that button.

- **Breaking: every tab now lives in an x-h-tab-item wrapper, and a tab action is a real button beside the tab.** `x-h-tab-action` used to go on a `<span>` inside the tab's own `<button>`. A button may not contain interactive content, and the invalid markup needed a stack of workarounds. The span carried `role="button"` and a copied tab stop, `Enter` and `Space` had to be rerouted to a synthetic click because a span has no native activation, and that click had to be stopped from also selecting the tab around it. Every tab is now wrapped in a required `x-h-tab-item`, a non-interactive element that draws the tab's surface, and each action is a real `<button>` beside the tab inside it, so all of that goes away and keyboard operability, `disabled` and focus come from the elements themselves. To migrate, wrap every `<button x-h-tab>` in a `<div x-h-tab-item>` and, where a tab has an action, move the `<span x-h-tab-action>` out of the tab button and rewrite it as a `<button x-h-tab-action>` beside it, keeping its required `aria-label` or `aria-labelledby`. Its `@click` no longer needs anything to keep it from selecting the tab. The one-action limit is gone, so a tab can hold a close button next to a menu or popover trigger, whose panel goes inside the item after the actions. An item with no actions looks exactly like one that never had any, so a list rendered with `x-for` wraps every tab the same way and gates the action with `<template x-if>`. One behavioural consequence, the actions of a disabled tab are dimmed with the rest of the tab but stay operable unless disabled themselves, so an unavailable tab can still be closed.

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
