# Changelog

## v3.1.0

A release that makes an interactive list valid HTML. An interactive item used to become a button itself, which left its `ul` with no list items and cost the list its announcement. The row control is now a real button or link inside the item, written with the new `x-h-list-item-button`. It also fixes a listbox and combobox bug where a list nested inside an option turned its own rows into options, and moves the listbox into a plugin of its own. It also repairs card and dialog padding around a slot behind an `x-if`, where the template Alpine leaves in place counted as the slot that never rendered, and lets a table header draw a top and bottom rule instead of a full outline. It ships the `mt-auto` utility class along with the half steps of the padding and gap scales. There are breaking changes to interactive lists and to registering the listbox by hand.

### List

- **Breaking: the `interactive` modifier on `x-h-list-item` is removed.** It set `role="button"` on the `li`, leaving the `ul` with no list items. To migrate, wrap the row's content in a `button` or `a` carrying `x-h-list-item-button`, move `@click` and any layout classes onto it, and replace `aria-selected` on the item with `aria-current` on the control. Options and plain lists are unaffected.
- **New: `x-h-list-item-button`.** The control that makes a list interactive. It fills the row and takes its padding, so the clickable area matches the highlight, and an action button beside it keeps its own hover instead of lighting up the row.
- **New: `x-h-list` sets `role="list"`.** A `ul` loses its list semantics in Safari once the bullets are removed, taking the item count with it.
- **Fixed: a list nested inside a listbox or combobox option turned its rows into options of that popup.** The lookup walked the whole ancestor chain, so the arrow keys, `Home`, `End`, typeahead and the tab stop moved onto rows that were not options. It now stops at the enclosing list item.

### Listbox

- **Breaking: the listbox is a plugin of its own**, no longer riding along with the list plugin. Only affects ESM consumers registering components one by one: add `Alpine.plugin(Listbox)` beside `Alpine.plugin(List)`. `registerComponents` and the CDN bundle need no change.

### Card

- **Fixed: a slot behind an `x-if` cost the slot beside it its padding.** Alpine leaves the `<template>` in the card, and that sibling still counted when a slot looked for the card's edges and for its neighbours, so a header above conditional content sat against the card's bottom edge. A template from `x-if` or `x-for` is no longer counted as a slot.

### Dialog

- **Fixed: a dialog header pays the padding under it when nothing renders after it.** It left that side to the body below, so a dialog whose body is behind an `x-if` had its title against the bottom edge. The gap between a header and a footer now survives a template between them too.

### Table

- **New: the header border can be horizontal only.** `data-bordered="horizontal"` on `x-h-table-header` draws a rule above and below the head row and nothing down its sides, for a header separated from the rest of the table rather than boxed in. `data-bordered="true"` still draws the full outline.

### New utility classes

- **`mt-auto`** pushes an element to the bottom of a flex column, the way `ml-auto` and `mr-auto` push along a row. The auto margins previously covered only the horizontal sides.
- **`p-1.5`, `px-1.5`, `px-2.5`, `py-0.5` and `py-1.5`**, the half steps of the padding scale, for the tighter spacing the components themselves use. There is no half step on the single sides.
- **`gap-0.5` and `gap-1.5`**, the same half steps for the all-round gap. There are no `gap-x` or `gap-y` half steps.

## v3.0.0

A release that adds the Combobox component and brings drag and drop to the Calendar and the Slot Picker. Calendar events can be rescheduled by dragging them to another time or day, and slot picker slots can be reordered within a day or moved to another day, in both cases with the change proposed through an event and applied by the consumer. Notifications can now play a sound, a built-in chime or an audio file, per notification or as an overlay-wide default, and the new Native Notifications utility, also available as `$notifications.native`, wraps the browser's Notification API for messages shown by the operating system. The Dialog gains a fullscreen mode that fills the viewport, together with a content slot that scrolls the body while the header and the footer stay in place, and moves its padding onto that slot and its neighbours, which is a breaking change for dialog bodies that are not wrapped in the new slot. It also keeps focus inside itself while it is open, like the Backdrop now does. The Card moves its padding the same way, onto its header, content and footer, which is a breaking change for content placed straight in a card, and gains a modifier that lets a table or a list span the card from edge to edge. The Button Group can now hold a single choice, which turns a row of buttons into a segmented control that is announced as a set of options and navigated with the arrow keys. It also draws the dividers between its buttons itself rather than relying on the `outline` variant's border, which retires `x-h-button-group-separator` as a breaking change, gains a borderless mode for a group that fills a card, and no longer overwrites a `role` set on the group. It also completes the viewport height utilities, repairs keyboard navigation in a listbox whose options change, and stops a long line of code from escaping its block. The Sidebar now separates navigation from everything else it can hold, a breaking change for navigation sidebars. A destination is written as `x-h-sidebar-menu-nav`, which announces the active entry with `aria-current="page"`, while `x-h-sidebar-menu-button` makes no navigation claim and leaves `aria-current` to the author. The Chip becomes a container holding its own buttons, a breaking change that retires the button it used to be applied to: a dismissible chip was a button with another control inside it, which is invalid markup and left its close button reachable by `Tab` but impossible to activate. The Tabs take the same shape as a breaking change for every tab. Each tab now lives in an `x-h-tab-item` wrapper that draws its surface, and a tab action is a real button beside the tab instead of a span inside it, which also lifts the one-action limit, so a tab can pair a close button with a menu trigger. The Avatar becomes a control on an `a` element as well as on a `button`, and a button avatar no longer submits the form around it. The Backdrop now keeps focus inside itself while it is open, and the Expansion Panel's generated triggers no longer share a single id. The release fixes single mode in the Accordion and makes accordion item ids dynamic: items written without an explicit id all shared the same empty id, so an accordion in single mode never collapsed the previously open section. The item id is now evaluated as an Alpine expression, which is a breaking change for hard-coded ids but lets items rendered with `x-for` take their id from the iterated data. The Range's `input` and `change` events now carry their value in `event.detail.value` rather than as the whole detail, a breaking change that aligns them with every other component's change event. And components that hold their bound value themselves, among them the Rating, the single choice Button Group, the Inline Calendar and the Menu's checkbox and radio items, now reject `x-model`'s event modifiers with a console error, since `.lazy` used to silently corrupt the bound value. And the date grid shared by the Date Picker, the Datetime Picker, the Inline Calendar and the Slot Picker now starts keyboard navigation from the visibly focused day instead of the 1st of the month.

### Combobox

- **New component.** A list of options belonging to a text field, filtered as the user types. It is the pattern behind a search field, an autocomplete and a command palette.

### Calendar

- **New: events can be rescheduled by drag and drop.** Opt in to let users drag a timed event to a new time or day in the week and day views (the start time snaps to a configurable minute step and the duration is kept), move all-day pills between days, and change an event's day in the month view. Dropping never changes the calendar's data directly: the proposed change is dispatched as an event for the consumer to apply. Individual events can opt out, and every event stays reachable by keyboard, since dragging is a pointer-only convenience.
- **Fixed: `x-model.lazy` corrupted the bound value of an inline calendar.** The modifier makes Alpine listen for `change`, and the calendar's own `change` event made that listener write the event's detail object over the date string the calendar had just stored. The modifier also silently broke the model-to-view sync, since the model expression was read from the literal `x-model` attribute name. The event modifiers (`.lazy`, `.change`, `.blur`, `.enter`) are now rejected with a console error, the model always updates immediately, and a model bound with any other modifier stays in sync.

### Slot Picker

- **New: slots can be reordered and moved between days by drag and drop.** Opt in to let users drag a slot within its day to reorder it or onto another visible day to move it. While dragging, a half-transparent copy of the slot follows the pointer and the other slots part to show where it will land. Dropping never changes the picker's data directly: the proposed change is dispatched as an event for the consumer to apply. Individual slots can opt out, and unavailable slots never drag.

### Notifications

- **New: a notification can play a sound.** The `sound` argument on `$notifications.add` plays a built-in chime, a custom audio file or nothing, and the overlay's new `data-sound` attribute sets the default for every notification.
- **New: native notifications.** New utility functions, also exposed as `$notifications.native`, wrap the browser's Notification API with an availability check, permission inspection and request, and a show function that passes the standard options through.

### Dialog

- **New: fullscreen mode.** A dialog can now fill the entire viewport instead of sitting centered at a capped width, which suits long forms and multi-step tasks, especially on small screens. It is switched on with `data-fullscreen` and can be bound to an expression, so the same dialog can change modes at runtime. The new `x-h-dialog-content` slot marks the body of a dialog as the only scrolling part, keeping the header and the footer in place while the content scrolls between them.
- **New: focus stays inside an open dialog and returns to the opener when it closes.** `Tab` and `Shift+Tab` used to walk straight out of the dialog into the page behind it, which is invisible to the eye but fully reachable by keyboard, and closing dropped focus at the top of the document instead of returning it to the control that opened it. Where focus lands when a dialog opens is unchanged, and dismissal, including `Esc`, is still wired up by the consumer.
- **Breaking: the dialog surface no longer has padding of its own.** The header, the body and the footer now pad themselves, so a body that is not wrapped in `x-h-dialog-content` reaches the edges of the dialog. To migrate, wrap it: `<div x-h-dialog-content>` around whatever sits between the header and the footer, carrying over the classes it already had. A dialog laid out only from a header and a footer needs no change and looks exactly as before. Two things get easier in return. A focused control inside a scrolling body no longer has its focus ring clipped at the left and right edges, because the padding is now inside the scrolling area instead of outside it. And content that should span the full width, a calendar, a table or a list, is now a matter of the new `flush` modifier on the body (`x-h-dialog-content.flush`) instead of cancelling the surface padding with `p-0!` and re-adding it to every other part by hand.

### Card

- **Breaking: the card surface no longer has padding of its own.** The header, the content and the footer now pad themselves, so anything placed straight in a card reaches its edges. To migrate, wrap what should stay inset in `x-h-card-content`, carrying over the classes it already had. A card built from the header, content and footer slots needs no change and looks exactly as before, in every combination of the three. What gets easier is the case the card was worst at: a table, a list or a calendar that should span the full width of the card is now the new `flush` modifier on the content (`x-h-card-content.flush`), or simply a direct child of the card, instead of cancelling the surface padding with `p-0!` and putting it back on every other part by hand.

### Button Group

- **New: a button group can hold a single choice.** Binding an `x-model` turns the buttons into mutually exclusive options, the segmented control used for something like a view mode or a color scheme. The group is announced as a set of options, is a single tab stop, and is navigated with the arrow keys. A group without an `x-model` is unchanged.
- **New: `data-borderless`.** Removes the border around the group and squares its corners, keeping the dividers between the buttons. For a group that fills a card, so the card's own border and radius are the only ones on show.
- **New: the group draws the dividers between its buttons.** They used to be a side effect of the `outline` variant's border, so a group of `transparent`, `default` or `primary` buttons had none and the buttons ran together. Groups of `outline` buttons look exactly as before.
- **Breaking: `x-h-button-group-separator` is removed.** The group now draws the dividers itself, so the directive has nothing left to do. To migrate, delete the `<div x-h-button-group-separator></div>` elements from your button groups. The divider appears in their place on its own.
- **Fixed: a `role` set on the group was overwritten.** The group wrote `role="group"` over whatever the author had put there, unlike `x-h-tile-group`, which keeps a role you set. A role set by the author is now left alone.
- **`x-model`'s event modifiers are rejected with a console error.** `.lazy` made Alpine's own listener write the `change` event's `{ value }` detail object over the value the group had just stored. The event modifiers (`.lazy`, `.change`, `.blur`, `.enter`) have nothing to defer on a single choice, the model always updates immediately.

### Range

- **Breaking: the `input` and `change` events now carry their value in `event.detail.value`.** They used to put the raw value in `event.detail`, unlike every other component, whose change events report `event.detail.value`. To migrate, read `$event.detail.value` instead of `$event.detail` in `@input` and `@change` handlers.
- **`x-model`'s event modifiers are rejected with a console error.** `.lazy`, `.change`, `.blur` and `.enter` have nothing to defer on a slider, the model always updates immediately.

### Rating

- **Fixed: `x-model.lazy` corrupted the bound value.** The modifier makes Alpine listen for `change`, and the rating's own `change` event made that listener write the event's `{ value }` detail object over the number the rating had just stored. The event modifiers (`.lazy`, `.change`, `.blur`, `.enter`) have nothing to defer on a rating, so they are now rejected with a console error, the model always updates immediately.

### Menu

- **Fixed: `x-model.lazy` corrupted the bound state of a checkbox or radio item.** The modifier makes Alpine listen for `change`, and the item's own `change` event made that listener write `undefined` over the value the item had just stored. The event modifiers (`.lazy`, `.change`, `.blur`, `.enter`) are now rejected with a console error, the model always updates immediately.

### Date Picker

- **Fixed: a modifier on the popup's `x-model` silently broke the model-to-view sync.** The model expression was read from the literal `x-model` attribute, which does not exist when the attribute name carries a modifier such as `.fill`. The expression is now found whatever the modifiers.
- **Fixed: the first key press in a freshly opened calendar acted from the 1st of the month, not from today.** When the calendar opened with nothing selected, the visible focus landed on today's cell, but the keyboard handler based itself on the 1st of the month, so the first arrow press jumped focus there instead of moving one day from today, and pressing `Enter` straight away selected the 1st rather than the day that looked focused. Navigation now starts from the cell that actually holds focus. The date grid is shared, so the fix applies equally to the datetime picker, the inline calendar and the slot picker.

### Dark Mode

- **New: a `light` area can be nested inside a `dark` page or container, not just the other way around.** The `dark` class already let you scope dark mode to part of an otherwise light page by adding it to a container element. The `light` class now does the same for a light area inside a dark page, so either scheme can sit inside the other.

### Theme

- **New: color scheme listeners also receive the selected mode.** A listener registered with `addColorSchemeListener` used to be told only the scheme being applied, `light` or `dark`, so an `auto` selection was indistinguishable from whichever scheme the system resolved it to. The selected mode now arrives as a second argument, `light`, `dark` or `auto`, which is what a light/dark/auto control needs in order to show the right option. Listeners that take a single argument are unaffected.
- **Fixed: the system color scheme listener was never detached.** `window.matchMedia()` returns a new object on every call, so the code meant to remove the auto-mode handler was removing it from a freshly created object rather than from the one that held it. An explicit `light` or `dark` choice was therefore overridden the next time the system scheme flipped, even though the saved mode still said otherwise, and selecting `auto` repeatedly stacked handlers so a single flip notified every listener once per selection.
- **Fixed: `auto` was saved after the listeners ran.** A listener that called `getColorScheme()` while handling a switch to `auto` saw the mode being replaced rather than the new one, and only in the document that made the change, since every other frame saw the new value. The `light` and `dark` paths already saved before notifying, and `auto` now matches them.

### New utility classes

- **`min-h-screen`, `min-h-dvh`, `min-h-lvh` and `min-h-svh`** are now shipped and documented, setting a minimum height of the screen size or of the dynamic, large or small viewport height. They complete the `min-h` family, which previously stopped at `min-h-0` and the fixed sizes `min-h-1` to `min-h-12`.
- **`z-20`** joins the shipped z-index utilities, filling the gap between `z-10` and `z-50`.

### Accordion

- **Breaking: the accordion item id is now evaluated as an Alpine expression.** `x-h-accordion-item` and the optional default-expanded id on `x-h-accordion.single` used to take their value as a literal string. Both are now evaluated, matching `x-h-accordion-trigger`. To migrate, quote hard-coded ids, so `x-h-accordion-item="itemId1"` becomes `x-h-accordion-item="'itemId1'"` and `x-h-accordion.single="itemId2"` becomes `x-h-accordion.single="'itemId2'"`. This enables `x-h-accordion-item="entry.id"` inside an `x-for`, which previously gave every row the same literal id and broke single mode.
- **Fixed: single mode never collapsed the previously open item.** Items written without an id all received the empty string as their id instead of a generated one, so the single-mode bookkeeping could not tell them apart and every clicked section stayed open. The same empty id also produced an empty `id` on every trigger button and an empty `aria-labelledby` on every content region, leaving the panels without an accessible name. Items without an id now each get a unique generated one.

### Expansion Panel

- **Fixed: every trigger button had the literal id `undefined`.** The generated buttons all shared that duplicate id instead of getting one of their own. Each button now gets a unique id, derived as `<item id>-trigger` when the panel item has an `id` attribute and generated otherwise.
- **Fixed: the trigger's `aria-controls` did not point at the content.** It referenced the panel item wrapper when the item had an `id` attribute, and a nonexistent id otherwise. The content region now carries its own id (`<item id>-content` when the item has an `id` attribute, generated otherwise), `aria-controls` points at it, and the content names itself after its trigger with `aria-labelledby`, which it previously lacked entirely.

### List

- **New: `x-h-list-secondary`.** A slot for the supporting text in a list item, the preview under a subject or the timestamp beside a name. It plays the text down the way a muted foreground class does, and follows the row into its selected state, where it switches to the selected foreground at a lower opacity so it stays readable while remaining quieter than the rest of the item.

### Listbox

- **Fixed: a listbox whose options changed fell out of the tab order for good.** The tab stop was handed to an option once, when the listbox first mounted, and every option is otherwise unreachable by design. Rendering the options from a filtered list therefore broke the component the first time the filter ran: the replacement options all arrived unreachable, no stop was ever restored, and because the key handling hangs off that stop the arrow keys, `Home`, `End`, typeahead and `Enter` all went dead with no visible sign. Clearing the filter did not bring it back. A listbox that starts out empty, which is what a search result list does, was never reachable at all. The stop is now re-established whenever the options change.

### Sidebar

- **Breaking: a navigation destination is now `x-h-sidebar-menu-nav`.** A menu button used to receive `aria-current="page"` whenever it was marked `data-active="true"`, on the assumption that the sidebar is the page's navigation. That is wrong for an active button that marks a selected filter, a menu trigger or anything else that is not the current page. The sidebar now has two menu button directives sharing one look and behaviour. `x-h-sidebar-menu-nav` announces the active destination with `aria-current="page"`, while `x-h-sidebar-menu-button` never touches `aria-current` and leaves it entirely to the author. The `data-slot` now says which one an element is, too. A nav carries `sidebar-menu-nav`, and a button or a nav inside a `x-h-sidebar-menu-sub` carries `sidebar-menu-sub-button` or `sidebar-menu-sub-nav` instead of the `sidebar-menu-button` every variant used to get. To migrate, write `x-h-sidebar-menu-nav` on the buttons and links that mark the current destination, keep every other menu button as it is, and update tests or CSS selecting on `data-slot=sidebar-menu-button` for the renamed elements.
- **New: a header item can be interactive.** Writing `x-h-sidebar-header-item` on a `<button>` or an `<a>` used to throw, so a logo row that links home, or a brand row that opens a popover, had to be a menu button and take on its hover, active and current page states to be clickable. The tag now decides: a button or a link gets a pointer cursor and the same focus ring as a menu button, and any other element stays the plain title row it has always been.
- **Fixed: a collapsible group or menu item collapsed from outside kept reporting itself as expanded.** `aria-expanded` was written once when the label mounted and then only from its own click handler, so binding the collapsed state to an expression and changing it elsewhere left the attribute behind. The content hid correctly while a screen reader was still told the section was open, and the collapse arrow, which turns off that attribute, went on pointing the wrong way. It now follows the state however the state changes.

### Backdrop

- **New: focus stays inside an open backdrop and returns to the opener when it closes.** `Tab` and `Shift+Tab` used to walk straight out of the scrim into the page behind it, which is invisible to the eye but fully reachable by keyboard, and closing dropped focus at the top of the document instead of returning it to the control that opened it. The backdrop remains a scrim rather than a dialog and still sets no `role` or `aria-modal` of its own.

### Text

- **Fixed: a long line in a code block painted outside the block.** The `code` modifier prevents wrapping, but nothing contained the result, so a line wider than the block spilled its text across whatever sat to the right, on the page background rather than the block's own. On a page that scrolls as a document it also widened the page itself, which on a phone pushed fixed overlays partly off screen. A code block now scrolls horizontally instead, so the line stays inside it and remains reachable.

### Chip

- **Breaking: a chip is now a container holding its own buttons.** `x-h-chip` used to go on a `<button>`, which left a dismissible chip as a button with another control inside it. A `<button>` may not contain interactive content, and the invalid markup had real consequences: the close was a `<span>` carrying `role="button"` and a tab stop, so `Tab` reached it while `Enter` and `Space` did nothing at all, leaving a keyboard or screen reader user able to reach the close and never dismiss the chip. Its click also had to be stopped from reaching the chip around it, and the chip's hover state had to exclude it selector by selector. The chip is now a plain container, and each control inside it is a real button, so all of that goes away and keyboard operability, `disabled` and focus come from the elements themselves. To migrate, put `x-h-chip` on a `<div>`, a `<span>` or whatever non-interactive element suits the surrounding markup, move the clickable part onto a `<button x-h-chip-button>` inside it along with everything about the interaction (`@click`, `aria-pressed`, `disabled`), and leave `data-variant` on the chip, which still paints the pill. A chip that is only a label needs no button at all and is no longer announced as one. `x-h-chip-close` moves from a `<span>` to a `<button>` and keeps its required `aria-label` or `aria-labelledby`. Two smaller consequences: pointing at a dismissible chip now highlights the half under the pointer rather than the whole pill, and a label that has to be cut short takes a `truncate` class of its own, since only the element holding the text can end it with an ellipsis. A chip whose button opens a popover keeps the panel inside the chip, after that button.

### Tabs

- **Breaking: every tab now lives in an x-h-tab-item wrapper, and a tab action is a real button beside the tab.** `x-h-tab-action` used to go on a `<span>` inside the tab's own `<button>`. A button may not contain interactive content, and the invalid markup needed a stack of workarounds. The span carried `role="button"` and a copied tab stop, `Enter` and `Space` had to be rerouted to a synthetic click because a span has no native activation, and that click had to be stopped from also selecting the tab around it. Every tab is now wrapped in a required `x-h-tab-item`, a non-interactive element that draws the tab's surface, and each action is a real `<button>` beside the tab inside it, so all of that goes away and keyboard operability, `disabled` and focus come from the elements themselves. To migrate, wrap every `<button x-h-tab>` in a `<div x-h-tab-item>` and, where a tab has an action, move the `<span x-h-tab-action>` out of the tab button and rewrite it as a `<button x-h-tab-action>` beside it, keeping its required `aria-label` or `aria-labelledby`. Its `@click` no longer needs anything to keep it from selecting the tab. The one-action limit is gone, so a tab can hold a close button next to a menu or popover trigger, whose panel goes inside the item after the actions. An item with no actions looks exactly like one that never had any, so a list rendered with `x-for` wraps every tab the same way and gates the action with `<template x-if>`. One behavioural consequence, the actions of a disabled tab are dimmed with the rest of the tab but stay operable unless disabled themselves, so an unavailable tab can still be closed.

### Avatar

- **New: an avatar can be a link.** `x-h-avatar` already became a control on a `<button>` and now does the same on an `<a>`, so an avatar that leads somewhere is a real link rather than a plain avatar wrapped in one. On any other tag it stays plain and is never given a role or a `tabindex` it cannot honor.
- **Fixed: a button avatar submitted the form around it.** No `type` was ever set, so a `<button x-h-avatar>` fell back to the browser's `submit` default. It now gets `type="button"` unless the author has set a type.

### Docs and tooling

- **The Claude Code plugin marketplace is renamed from `harmonia` to `codbex`.** The plugin now installs as `harmonia@codbex` rather than `harmonia@harmonia`, so the identifier reads as the Harmonia plugin from codbex. A marketplace name cannot be aliased the way a plugin name can, so an existing install has to be replaced. Run `/plugin marketplace remove harmonia`, then `/plugin marketplace add codbex/harmonia` and `/plugin install harmonia@codbex`.

## v2.14.2

A bugfix release for the Number Input and the One-Time Password Input. A Number Input entry the browser cannot represent yet is no longer wiped mid-typing, and a separator keystroke the browser drops now marks the input as invalid instead of letting the digits silently merge into a different number. Mobile keyboards get a decimal key, and the step controls respect `min` and `max` with `step="any"`. The One-Time Password Input now refills its cells when the bound model is set externally. There are no breaking changes.

### Number Input

- **Fixed: an entry the browser could not represent yet was wiped mid-typing.** With `x-model.number` bound, a keystroke that put the field into an in-progress state, for example a decimal separator the browser's region settings reject, made the input report an empty value. The immediate model writeback then wrote the empty value back, and the browser discarded the visible text, so the whole entry disappeared under the user's cursor. The sync is now skipped while the focused field holds such an entry, the text survives, and the model stays `null` until the entry becomes a valid number, matching what a plain form would receive. Binding a model is now documented on the component page.
- **New: a dropped decimal separator keystroke marks the input as invalid.** When the browser's region settings do not accept the typed separator, the keystroke is dropped without any signal, so typing `123,5` on a browser expecting dots silently became `1235`. The component now detects the dropped keystroke and reports it through native custom validity, which shows the invalid styling and blocks form submission until the entry is revised. Grouping separators are treated the same way, and `data-invalid-label` overrides the message.
- **Fixed: decimals could not be typed on iOS.** The input now defaults to `inputmode="decimal"`, whose keypad includes the region's decimal separator key. The previous `numeric` keypad has no separator key on iOS at all. An author-set `inputmode` still wins.
- **Fixed: the step controls ignored `min` and `max` when `step` is `any`.** The manual stepping used for `step="any"` now clamps to the bounds, like native stepping does for regular steps.
- **Fixed: the increase button carried no `data-slot`.** The `step-up-trigger` slot was set on the decrease button instead, which already had `step-down-trigger`. Both buttons now expose their own hooks.

### One-Time Password Input

- **Fixed: setting the bound model externally never updated the cells.** The model was resolved once before the inner input's `x-model` had initialized, so the external direction was dead. The hidden input followed the model while the visible cells kept the old digits, most visibly when an app cleared the code after a rejected attempt and the stale digits stayed on screen. The cells now follow every external model write, as the documented model contract promises.

## v2.14.1

A bugfix release that makes the Time Picker follow programmatic model writes, completing the v2.14.0 fix that only covered clearing. There are no breaking changes.

### Time Picker

- **Fixed: setting the bound model programmatically did not update the popup selection.** Only the input text followed the model, while the popup kept its previous selection. Opening it showed the old time (or nothing) highlighted instead of the model's value, changing a single part was silently dropped because the selection never became complete, and once it was complete a pick recombined with the stale leftover parts, writing a time mixed from two values. The popup now re-reads the model on every write, so the selection always matches what the input shows.

## v2.14.0

A release that makes picker values deselectable and makes the Select follow its bound model. Emptying a date picker's input now clears the value instead of erroring, the already selected day, month or week can be clicked again to deselect it, and clearing a picker programmatically no longer leaves stale state behind. The Select's mode now tracks the model's type instead of being read once at init, so a property that only becomes an array after mount still gets a multiple select, and programmatic writes to the bound property are reflected without user interaction. The Badge indicator is no longer cut off in WebKit browsers, its gap is now drawn as a surface-colored ring. There are no breaking changes.

### Select

- **Fixed: a select whose bound model was not yet an array locked into single mode and could corrupt the model.** The mode was read once at init, so a reusable dialog whose record starts empty never became a multiple select even after the property was set to an array, the trigger and the checkmarks never reflected the new values, and a toggle then ran the single-select path, replacing the bound array with a plain string. The mode now follows the model's type, and any programmatic write to the bound property repaints the trigger, the checkmarks and the validity state immediately.

### Date Picker

- **New: deleting the input text clears the value.** Committing an emptied input used to be rejected with a console error, leaving the input blank while the model kept the old date and a stuck validation message blocked native `required` reporting. It now clears the model, and in range mode both ends are unset.
- **New: clicking the already selected day deselects it and clears the value.** Single date mode only, a re-click in range mode keeps starting a new range. Works with `Enter` and `Space` too.
- **Fixed: clearing the bound model programmatically left a stale "not a valid date" message**, so native validation could not report the now empty required field.

### Badge

- **Fixed: the badge indicator was cut off at its host's edge in WebKit browsers (Safari, GNOME Web).** WebKit limits a clip-path to the element's own bounds, so the cut-out that carved the gap around the indicator also discarded everything the indicator painted outside its host. The gap is now a ring painted in the surface color behind the indicator. It follows the surface automatically inside sidebars, toolbars, cards, popovers, muted tiles and the bottom navigation, including hover and active states of sidebar menu buttons and bottom navigation links, and the `--badge-ring` CSS variable overrides it on surfaces the detection does not cover.

### Datetime Picker

- **New: clicking the selected day deselects it.** The model returns to an empty string until a day is picked again, matching the existing `Backspace` segment clearing.

### Inline Calendar

- **New: clicking the selected day deselects it and writes an empty model.** The `change` event's `detail.date` is `undefined` after a deselect.

### Month Picker

- **New: clicking the already selected month deselects it and clears the value.** Deleting the input text has always cleared the value too, and is now documented.

### Week Picker

- **New: clicking the already selected week deselects it and clears the value.** Deleting the input text has always cleared the value too, and is now documented.

### Time Picker

- **Fixed: clearing the bound model left the popup stale.** The old hour and minute stayed highlighted with the OK button enabled, and the next pick recombined the stale parts into a full time. A cleared model now resets the selection.

## v2.13.0

A release that makes the Tabs show where they overflow. The tab list now fades the edge that hides more tabs and keeps the selected tab in view, and the fade mask utilities behind it now take a size. It also fixes two multiple-select bugs, where deselecting an option corrupted the bound array and selecting one did not update the trigger, and makes closing animations across the library robust, so they can no longer swallow clicks or leave an invisible layer stuck over the page. There is a breaking change to the fade utility class names.

### Tabs

- **New: the tab list shows where it overflows.** When the tabs outgrow their list, the edge that hides more tabs fades out, updating as the list scrolls or resizes. The selected tab is also brought into view automatically, both when it first renders and when the selection changes.

### Masks

- **Breaking: the fade utilities take a size, and the bare names are gone.** `fade-x`, `fade-y`, `fade-t`, `fade-b`, `fade-l` and `fade-r` no longer exist. Each class now ends with a size on the spacing scale, shipped in `2`, `4` and `8` (a 0.5rem, 1rem or 2rem fade). To migrate, append `-2` to the old name, so `fade-x` becomes `fade-x-2` with the exact same 0.5rem fade.

### Select

- **Fixed: deselecting an option of a multiple select corrupted the bound array.** Instead of removing the value, each deselect pushed a nested one-element array into the model, so the array never shrank and anything gating on its length kept firing.
- **Fixed: selecting an option of a multiple select did not update the trigger.** No `change` event was dispatched on select, so the trigger label and the validity state only caught up on the next deselect.

### Closing animations

- **Fixed: a closing overlay or popup could swallow clicks or get stuck invisible.** While a close animation ran, the element kept intercepting pointer events, so a click right after closing a dialog hit the still-fading overlay instead of the page. The class that hides the element was also only restored by the browser's `transitionend` event, which is not guaranteed to arrive (an interrupted animation or a hidden tab can drop it), leaving an invisible layer covering the page. And reopening during the fade could leave the element stuck hidden while its state said open. Closing now turns off pointer events immediately, a fallback finishes the close when the event never comes, and reopening mid-fade recovers cleanly. This applies to the dialog overlay, backdrop, sheet, menu, popover, select, the date and time pickers, tooltip, accordion and notifications.

## v2.12.0

An accessibility release for the Select. Its trigger is now a real button that can be named and referenced, the options moved into their own `x-h-select-list` so the search no longer sits inside the listbox, and the native input is no longer `display:none`, which is what stopped a `required` select from ever reporting itself. It also ships the `hidden!` and `tracking-tight` utility classes. There are breaking changes to the select's markup.

### Select

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
- **Fixed: the select could not be given an accessible name.** The native input is kept out of the accessibility tree, so an `aria-label` or `aria-labelledby` written on it did nothing, and outside an `x-h-field` the trigger had no name at all. Both attributes are now applied to the trigger, with a field label as the fallback. `disabled`, `required` and `aria-invalid` are mirrored there too, so the select is announced as disabled, required or invalid.
- **Fixed: a `required` select silently blocked form submission.** The native input was `display:none`, so the browser could not focus it to report the failed constraint and `:user-invalid` could never match. It is now visually hidden while still rendered, out of the tab order and the accessibility tree, so native validation behaves like every other control and the invalid styling appears after a submit attempt.
- **Fixed: a disabled select could still be opened from the keyboard.** Disabling the input only removed pointer events, leaving the trigger focusable and operable with Enter. The trigger is now disabled with it.
- **Fixed: an unnamed select left `aria-labelledby="undefined"` on the listbox**, pointing it at an id that cannot exist.
- **Fixed: `x-h-select-group` was not exposed as a group.** It carried an `aria-labelledby` on an element with no role, so the listbox owned a generic element and the group's label was dropped.
- **Fixed: a multiple select did not announce itself as one.** The listbox now carries `aria-multiselectable`.
- **Fixed: the search input had no accessible name.** It is named "Search" by default, overridable with an `aria-label` on the `x-h-select-search` element.

### New utility classes

- **`hidden!`**, the `!important` form of `hidden`, for when a `display` rule cannot be outranked otherwise.
- **`tracking-tight`**, tightening the letter spacing to `--tracking-tight`.

## v2.11.1

A bugfix release that fixes the Badge Indicator's cut-out inside a dialog or any other scaled container, and lets a Sidebar menu button or header item truncate a label split across two lines. There are no breaking changes.

### Badge

- **Fixed: the indicator's cut-out sat slightly off the indicator inside a dialog.** The gap was measured from client rectangles, which an ancestor's `transform` scales, while the cut-out is drawn in the host's untransformed coordinates - so a panel opening at `scale(0.95)` measured 5% small, and no resize followed to correct it. The geometry now comes from the layout box, which no transform touches.

### Sidebar

- **Fixed: a menu button or header item could not truncate a label wrapped in an element.** Wrapping two lines in a `div` left it at the flex default of `min-width: auto`, so it refused to shrink and the text ran past the button's edge without an ellipsis, pushing an `x-h-sidebar-menu-badge` out of view. Both slots now clear the minimum width of a direct `div` child, so `truncate` works on a nested line with no extra classes. Markup that already sets `min-w-0` by hand is unaffected.

## v2.11.0

A release that adds `harmonia-extend.css`, letting a project compile the Tailwind utility classes Harmonia does not ship without duplicating what it already provides. It also gives the Bubble three more color variants including one painted from your own CSS variables, adds an elevated Sidebar style, ships the `border-x` and `border-y` utility classes, and fixes the last step of a Step Indicator stretching. There are no breaking changes.

### Extend Utility Classes

- **New: `dist/harmonia-extend.css`**, a Tailwind CSS v4 entry a project imports into its own stylesheet to generate exactly the utility classes Harmonia is missing - listed explicitly or found by scanning the project - with nothing Harmonia already ships generated a second time. See [Extend Utility Classes](docs/extend-utility-classes.md) for usage.

### Bubble

- **New `positive` and `information` variants**, so `data-variant` now covers the same semantic colors as the rest of the library alongside the existing `primary`, `secondary`, `warning`, `negative`, `outline` and `transparent`.
- **New `custom` variant**, painted from the `--bg-bubble` and `--fg-bubble` CSS variables instead of a semantic token, for a bubble colored per conversation or per participant. Set them on the bubble itself, on an ancestor, or in your theme CSS file.

### Sidebar

- **New `data-elevated` attribute** styles the sidebar with a border on its left and right plus a shadow. Like `data-floating` it is reactive, so toggling the attribute at runtime updates the sidebar. When both are set, `data-floating` wins.

### New utility classes

- **`border-x` and `border-y`** are now shipped and documented, adding a border on the left and right or the top and bottom.

### Step Indicator

- **Fixed: the last step stretched to fill the remaining space.** A step grew unless it was the last child of the indicator, so the collapsed-mode `x-h-step-indicator-counter` and `x-h-step-indicator-progress`, which sit after the last step, made that step grow too. A step now grows only when another step follows it.

### Coding agents

- **New Migration reference in the agent-readable skill** that ships in the package and in the Claude Code plugin. It lists the breaking changes only, grouped by version, so an agent upgrading a project between Harmonia versions gets the changes it has to act on without reading through every feature and fix.

## v2.10.0

A release that fixes a crash when a Harmonia page runs inside an iframe belonging to another origin and corrects the Week Picker's month navigation. The one breaking change is the frame `getBreakpointListener` measures. See "Breakpoint listener" below to migrate.

### Breakpoint listener

- **Breaking: `getBreakpointListener` now measures the current frame by default.** Its third argument is renamed from `frame` to `topFrame` and its meaning is inverted: leaving it out measures the frame the listener runs in, and passing `true` measures the topmost frame. To migrate, pass `true` as the third argument wherever you relied on the old default. The new default matches the CSS breakpoint variants a handler is usually paired with, which resolve against the current frame, so the two no longer disagree inside an iframe.
- **Fixed: a page inside an iframe from another origin crashed on load.** The listener read `matchMedia` off the topmost frame, which is a restricted proxy when the embedding page belongs to another origin, so the read threw `Permission denied to access property "matchMedia" on cross-origin object`. Because Alpine does not trap the error, it aborted the rest of the initialization and left every component after it dead. The topmost frame is now only read when asked for, and falls back to the current frame when it is unreachable.

### Week Picker

- **Fixed: `PageUp` and `PageDown` did not reliably move a whole month.** The focused week's Monday was stepped by a month and then snapped back to the start of its ISO week, which could land inside the month already on screen, leaving the header unchanged and moving focus to a different row. `PageDown` was affected on roughly 37% of dates and `PageUp` on 22%, where it could skip a month outright. Both now move the visible month by exactly one and keep focus on the same row.

## v2.9.0

A release that adds the new **Backdrop**, **Bottom Navigation**, **Floating Action Button** and **One-Time Password Input** components, rebuilds the **Tree** around a proper row, reworks the Sidebar's group and menu actions, and fixes how every component treats `aria-disabled`. The five breaking changes are the Tree rewrite, the Sidebar group actions, the `aria-disabled` keyboard behaviour, the removal of `data-disabled` from the Menu and the Select, and the removal of `data-label` in favor of `aria-label`, all covered below.

### New component: Bottom Navigation

- **Bottom Navigation** (`x-h-bottom-nav`) - a bar of top-level destinations along the bottom of the screen, for the primary navigation of an application on a phone.
- **New `--bottom-nav-height` theme variable and `h-bottom-nav` utility class**, so the layout around the bar can clear it without hard coding the value.

### New component: Floating Action Button

- **Floating Action Button** (`x-h-fab`) - a prominent, elevated button for the single most important action of a screen.

### New component: Backdrop

- **Backdrop** (`x-h-backdrop`) - a full-screen scrim that dims the page and animates its content in and out, for use behind command palettes, custom modals, or any panel that should sit above the rest of the interface.

### New component: One-Time Password Input

- **One-Time Password Input** (`x-h-otp`) - turns a native input into one or more groups of single-character cells for entering a verification code or PIN.

### Accessibility: `aria-disabled` no longer hides an item from the keyboard

- **Breaking: an `aria-disabled` item now stays in the arrow order.** Listbox options, select options, menu items, submenu triggers, menubar triggers, tabs and tree items marked `aria-disabled="true"` are reached by the arrow keys, `Home`, `End` and typeahead, can hold the roving tab stop, and are announced as unavailable. They still cannot be selected, activated, expanded or collapsed. Previously they were skipped, which hid them from screen reader users. Use the native `disabled` attribute, which is unchanged, when an item should be hidden rather than announced.
- Descendants of a disabled tree item are reachable too, and none of them can be activated.
- **Breaking: `data-disabled` is gone from the Menu and the Select.** `x-h-menu-item`, `x-h-menu-sub` and `x-h-select-option` now read `aria-disabled="true"` like every other component. To migrate, rename the attribute. `data-disabled` is unchanged on `x-h-input-group-addon` and `x-h-field`, where it is a styling hook only.
- **A disabled submenu trigger is now genuinely inert.** Neither hover, click, `ArrowRight` nor `Enter` opens it.
- **Fixed: `Enter` and `Space` could activate a disabled menu item.** Activating one is now a complete no-op, and it no longer closes the menu.
- **Fixed: an `aria-disabled` tab was fully clickable.** Tabs are now dimmed and pointer-inert, and a click or `Enter` no longer reaches the author's own selection handler.

### Rating

- **Breaking: the Rating is locked with `aria-disabled="true"`.** The `disabled`, `data-disabled` and `data-readonly` attributes are gone, and the separate read-only state with them. To migrate, replace them with `aria-disabled="true"`, which requires the explicit value. This also fixes `data-readonly="false"` having made a rating read-only.
- **Breaking: a locked Rating stays a focusable slider.** It used to become `role="img"` with every value attribute stripped and no tab stop, so a keyboard user could not reach it. It now keeps `role="slider"`, its tab stop and its `aria-valuenow` / `aria-valuetext` in every state, and only refuses input.
- **Fixed: a locked Rating destroyed the accessible name.** The score was written into `aria-label` on every render, overwriting the author's own name, and with `aria-labelledby` the score was never announced at all. The score now stays in `aria-valuetext` and the name is never touched.
- **New: `data-value-label` makes the announced score translatable.** `{value}` and `{max}` are substituted, defaulting to `{value} of {max} stars`.

### Translatable generated text

Strings that embed a number in English prose used to be hardcoded. Each is now a template with `{token}` placeholders substituted, so a translation can reorder the numbers rather than only replace words around them.

- **Carousel** - `data-item-label` names each slide. `{index}` and `{count}` are substituted, defaulting to `{index} of {count}`.
- **Bubble** - `data-valuetext-label` sets the position announced on the audio seek slider. `{current}` and `{duration}` are substituted, defaulting to `{current} of {duration}`.
- **Calendar** - `data-more-label` sets the month-view overflow button. `{count}` is substituted, defaulting to `+{count} more`.
- **Charts** - a new `seriesLabel` config key names a series that has no `name` of its own, defaulting to `Series {index}`. A new `tableLabels` key sets the column headers of the hidden data table, replacing the hardcoded `Category`, `Segment` and `Value`.

### Accessible names: `data-label` removed where `aria-label` already works

- **Breaking: `data-label` is gone from the Rating, the Carousel, the carousel indicators, the reactions group and the dual Range.** Each sits on an element the author writes, so `aria-label` could always be set on it directly. To migrate, rename the attribute to `aria-label`. Every default name is unchanged.
- **`data-label` stays where the element is generated**, for the single Range's handle and the dual Range's `data-min-label` / `data-max-label`. On a dual Range `data-label` no longer names the group, so move that one to `aria-label`.
- **Breaking: the audio seek slider is named with `data-seek-label`**, matching its `data-play-label` / `data-pause-label` siblings. Rename it from `data-label`.
- **Fixed: the Carousel ignored `aria-labelledby`**, overwriting it with the default name. It now honors either attribute.

### Tree

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
- **Rows align across the whole tree**, with chevrons, checkboxes, icons and labels lining up on branch and leaf rows alike.
- **Nested items are indented**, and `data-line="true"` on a nested `x-h-tree.sub` adds a connecting line down its left side.
- **New: `x-h-tree-actions`** holds one or more buttons at the end of a row, with an `autohide` modifier. **`x-h-tree-action`** is the icon button to put inside it.
- **New: `x-h-tree-indicator`** marks a row's status at its right edge, as a colour dot or a short badge.
- **New: a `tree-item-click` event**, dispatched on an item by click, `Enter` or `Space` and bubbling to the tree. With `expand()`, `collapse()` and `toggle()` on the item state, it is how selection is driven. The tree keeps no selection model of its own.
- **New keyboard behaviour.** Typing letters moves focus to the next matching item. `Space` toggles the focused row's checkbox when it has one and otherwise activates the item, while `Enter` always activates.
- **Checkboxes are a size smaller inside a tree**, matching the density of a row.

### Sidebar

- **Breaking: group action buttons must now be wrapped in `x-h-sidebar-group-actions`.** To migrate, move each existing `x-h-sidebar-group-action` inside a `x-h-sidebar-group-actions` wrapper in the group label. A group label can now carry more than one action.
- **`autohide` is now touch-aware.** Both `x-h-sidebar-group-actions` and `x-h-sidebar-menu-action` reveal their actions only for fine pointers, so they stay visible on touch devices instead of being permanently hidden. The menu action was also recentered vertically and now tracks the menu button height.
- **`data-size` is ignored while collapsed**, so a large logo button collapses to the same compact icon as the rest.
- **New `--sidebar-ring` theme variable** sets the focus outline color used within the sidebar (light and dark), joining the other `--sidebar-*` tokens in the theme generator.

### Menu

- **Disabling an item requires the explicit `"true"` value.** `x-h-menu-item` and `x-h-menu-sub` previously treated the attribute as set whenever it was present, so a `"false"` value still disabled the item. The attribute itself is now `aria-disabled`, covered above.

### List

- **List headers and items now round correctly at the top and bottom**, matching the container's corners in more layouts.
- **Breaking: the listbox is now a single tab stop.** `Tab` moves into the listbox and then past it, and the arrow keys move between the options inside, instead of every option being its own tab stop. Focus starts on the selected option, or on the first one when nothing is selected.
- **New: options can be disabled with `aria-disabled="true"`.** A disabled option cannot be selected, but the arrow keys, `Home`, `End` and typeahead still reach it.
- **New: typeahead.** Typing a character moves focus to the next option whose label starts with it.
- **`Home` and `End` no longer scroll the page** while they move focus, and `PageUp` and `PageDown` now act as aliases for them instead of doing nothing.
- **Arrow keys cross group boundaries reliably**, and focus can no longer land on a group header.

## v2.8.0

A release that expands the utility classes with single-side edge fades and grid column-line placement. The one breaking change is the mask utilities rename covered below.

### Mask utilities: renamed and expanded

- **Breaking: `h-mask` and `v-mask` were renamed to `fade-x` and `fade-y`.** The old class names no longer ship. `fade-x` fades the left and right edges, `fade-y` the top and bottom, following the same `-x` / `-y` axis convention as the rest of the library. Replace any `h-mask` with `fade-x` and any `v-mask` with `fade-y`.
- **New single-edge fades.** `fade-t`, `fade-b`, `fade-l`, and `fade-r` each fade a single edge (top, bottom, left, right), for hinting at more content in one direction while keeping the opposite edge sharp.

### New grid utilities: column start and end

- **`col-start-1-12` and `col-end-1-12`** position a grid item by the column line it starts and ends at (a four-column grid has lines 1 to 5), complementing the existing `col-span-*`. Both accept the `sm`, `md`, `lg`, and `xl` breakpoint prefixes.

## v2.7.2

Bugfix release

### Fixed Split panel percentage min/max not tracking the container on resize

A Split panel whose `data-min` or `data-max` was given as a percentage resolved that percentage to a fixed pixel size only once, at the width the page happened to have when the panel first rendered. Shrinking the window afterwards left the panel pinned at that stale floor, so it stopped shrinking with the container and overflowed horizontally (reloading at the narrow width appeared to fix it). Percentage `min` and `max` are now re-resolved against the current container size on every layout pass, so a panel keeps shrinking and growing with the space it is given.

## v2.7.1

Bugfix release

### Fixed SVG and Avatar styling in the sidebar menu button

When there was an SVG or Avatar inside a sidebar menu button and the sidebar was in collapsed mode, both elements scaled to fit the button size, which obscured the active button indicator. Added a size limit to those elements fixed the issue.

## v2.7.0

A release that adds a new **Responsive** utility directive for container-query-style class toggling, opens up the date formatting engine through a `$dateFormat` magic and a public `createDateFormatter` function, and configures every date and time component to honor the page's `<html lang>`. It also brings a collapsed mode to the Step Indicator, richer options and search to the Select, keyboard support to the Tooltip, and a documented set of z-index utility classes. The breaking changes are all in the Slot Picker: its day grid no longer collapses to one column on its own, and a slot is now selectable only when you bind an `x-model`. See "Slot Picker" below to migrate.

### New utility: Responsive

- **Responsive** (`x-h-responsive`) - a behavior-only directive that adds or removes classes based on the element's **own** width rather than the viewport, so a component can adapt to the space it is actually given (a sidebar, a resized panel, a grid cell) without every combination needing a viewport-prefixed class in the bundle. Pass an array of `{ op, width, classes?, callback? }` conditions where `op` is one of `>=`, `>`, `<`, `<=`, `==` and `width` is a number of pixels. Conditions are independent predicates, so more than one can match at once, and the directive only ever touches the classes you list.
- **A `callback` alternative to classes.** Each condition may carry a `callback` function instead of (or alongside) `classes`. It is called with a single boolean, `true` when the condition currently matches and `false` when it does not, once on mount with the initial state and then once each time that state flips, so it does not fire on every resize while the width stays on one side of the breakpoint. `classes` and `callback` are each optional, but every condition must have at least one of them.
- **`.parent` modifier** measures the element's parent instead of itself, for when a toggled class collapses the element's own box (for example `hidden`, which would otherwise report a width of 0 and never recover).

### Date Format

- **New `$dateFormat` magic.** `$dateFormat(value, config?)` returns a formatted date string inline in Alpine expressions (for example inside `x-text` or `:title`), or a formatted range when `value` is a `{ start, end }` object, with empty or invalid input returning `''`. `$dateFormat.with(config?)` returns a reusable formatter object exposing `format`, `parse`, `formatRange`, and `parseRange` for cases that also need to parse a string back into a `Date`. The config accepts the same `locale`, `order`, `delimiter`, `options`, and `rangeSeparator` keys as the directive's `data-*` attributes.
- **`createDateFormatter` is now public.** The formatting engine is exported from the package (`import { createDateFormatter } from '@codbex/harmonia'`) and exposed on the browser global (`Harmonia.createDateFormatter`), so it can be used outside Alpine, in application code or a build step. It returns the same reusable formatter as `$dateFormat.with`.
- **Locale now follows `<html lang>`.** When no locale is set explicitly, the `x-h-date-format` directive and the `$dateFormat` magic now inherit the locale from the page's `<html lang>` attribute, then the browser locale, so declaring the page language once formats every date accordingly. The plain `createDateFormatter` function deliberately does not read `<html lang>` and defers directly to the JavaScript engine's default locale when no `locale` is given.

### Component enhancements

- **Slot Picker** - see the breaking changes below, plus a new `x-h-slot-picker.responsive` modifier that opts back into collapsing the day columns into a single stacked column below the `md` breakpoint, and a new `x-h-slot-picker-title.text-only` modifier that drops the built-in title styling (the text, `data-slot`, and `aria-live` region stay) so you can style the heading yourself.
- **Select** - options gain a `data-description` attribute that renders a secondary muted line below the label (linked with `aria-describedby`), and an `<svg>` or `<img>` placed inside an option now renders as a leading icon before the label. The search control gains `data-include-desc="true"`, which extends matching to option descriptions for the `contains` and `contains-each` filters.
- **Step Indicator** - a new collapsed mode, toggled with `data-collapsed="true"` on `x-h-step-indicator`, shows only the active step in a compact column and works in both orientations. Two new directives are visible only while collapsed: `x-h-step-indicator-counter` renders a "Step X of Y" label (localizable with `data-step-label` and `data-of-label`, totals counted automatically from the registered items) and `x-h-step-indicator-progress` renders a thin `role="progressbar"` bar filling to the current step.
- **Toolbar** - a new `data-variant="clear"` paints the toolbar with the page background color instead of the header background, for a sticky toolbar layered over scrolling content.
- **Tooltip** - the tooltip now shows on keyboard focus, not just pointer hover, and can be dismissed with `Escape` while keeping the trigger focused. Its element now carries `role="tooltip"` and the decorative arrow is `aria-hidden`.

### Slot Picker

- **Breaking: the day grid no longer collapses on its own.** The Slot Picker previously stacked its columns into one below the `md` breakpoint and expanded to the configured day count at `md` and above. It now always shows the configured number of columns (they simply shrink on narrow containers). To restore the old auto-stacking behavior, add the new `x-h-slot-picker.responsive` modifier.
- **Breaking: a slot is selectable only with an `x-model`.** Selection is now opt-in: bind an `x-model` and slots become selectable (with `aria-pressed` and a selected state) as before. Without a model, slots are plain action buttons - they still fire the `slot-click` event but never enter a selected state, and `event.detail.slot.selected` is always `false`.

### Locale

- **Date and time components now honor `<html lang>`.** When no `locale` is configured, the Calendar, Inline Calendar, Date Picker, Month Picker, Week Picker, Time Picker, and Slot Picker now resolve their locale from the page's `<html lang>` attribute before falling back to the browser locale. A page marked `<html lang="de-DE">` on an English browser now renders German month and day names by default. Setting `locale` explicitly is unchanged.

### New utility classes

- New `z-1`, `z-10`, `z-50`, and `z-60` z-index utility classes are now shipped and documented on a new Z-Index utility classes page: `z-10` raises an element above normal flow, `z-50` matches the overlay layer used by popovers, dropdowns, and dialogs, and `z-60` sits above overlays for topmost elements such as notifications. As with any z-index, they only affect positioned elements.

### Dependencies

- Bumped `@floating-ui/dom` to `^1.8.0`.

### Documentation

- New Responsive utility page and a new Z-Index utility classes page, both added to the navigation.
- The Date Format page documents the `$dateFormat` magic, the public `createDateFormatter` function, and the `<html lang>` locale fallback, with runnable examples for inline formatting, parsing through the factory, and plain-JS use.
- The agent-readable skill that ships in the package was regenerated to match the updated docs.

## v2.6.0

A release that rewrites the **Range** slider from scratch to drop the third-party `nouislider` dependency, so the slider is now a native-input-backed, Tailwind-styled control with a smaller footprint. It also brings invalid-state styling to more components, two newly exposed focus utility classes, and a bundle-size optimization that shrinks the JavaScript output. The only breaking change is the Range rewrite. See "Range" below to migrate.

### Range

- **Breaking: the Range slider was rewritten and no longer uses `nouislider`.** It is now a native-input-backed slider styled with Tailwind, which also removes `nouislider` from the package's dependencies.
- **Breaking: markup now requires a child `<input>`.** The element must contain a native `<input>` as a direct child, from which the slider takes its value, `name`, and disabled state (the directive throws when the input is missing). The `disabled` attribute now goes on that inner input rather than on the wrapper element.
- **Breaking: configuration moved from a config object to modifiers and `data-*` attributes.** The old `x-h-range="config"` object and the `auto-hide-tips` attribute are gone. Orientation and dual handles are now `x-h-range.vertical` and `x-h-range.dual` modifiers (combinable), and the range is configured with `data-min`, `data-max`, `data-step`, `data-value`, `data-tooltips` (`true` for always visible or `auto` for on-interaction), `data-unit`, `data-label`, and `data-min-label` / `data-max-label` for the dual handles.
- **Breaking: the `x-model` shape changed.** A single slider now models a plain number instead of an array, while a `.dual` slider models a `[low, high]` array. The model updates live during dragging.
- **New styling hooks.** The slider exposes `data-slot` values (`range`, `range-input`, `range-fill`, `range-handle`, `range-tooltip`) that replace the old `.harmonia-slider` and `noUi-*` selectors, so any custom CSS keyed on those old classes must be retargeted.
- Each handle is a `role="slider"` with the full `aria-value*` set and an accessible label, is fully keyboard operable (arrow keys step, PageUp / PageDown jump by ten steps, Home and End go to the bounds, all RTL-aware), and dual handles cannot cross. The slider dispatches `input` during dragging and `change` on release, integrates with native forms (submitted value, form reset, and constraint validation), and shows its invalid state on submit or immediately when an ancestor opts in with `data-validate="immediate"`.

### Invalid state improvements

- **Checkbox and Radio** - an invalid checkbox or radio (native `:invalid` / `:user-invalid` state or `aria-invalid="true"`) now renders with a negative-colored fill or indicator, matching the error styling of the other inputs.
- **Tile** - a tile group whose input is invalid now shows a negative border, so an invalid radio or checkbox group built from tiles is visually flagged.
- **Calendar** - the calendar's slider handles now mirror the invalid state of their underlying input through `aria-invalid`, so the error is announced on the focusable handle that assistive technology actually reaches.

### New utility classes

- New `focus-ring` and `focus-outline` utility classes, the same focus indicators Harmonia components use internally, are now exposed so custom focusable elements can match the built-in focus styling. `focus-ring` colors the border and draws a translucent ring, `focus-outline` draws a focus outline (pair it with an outline color such as `outline-ring/50`), and both apply only on `:focus-visible`. Documented on a new Focus Indicator utilities page.

### Bundle size

- Long, repeated Tailwind class strings (the disabled, invalid, and picker-wrapper variants) that were duplicated inline across many components are now consolidated into shared constants that the components import. Identical class strings already collapse to a single CSS rule, so this leaves the rendered output unchanged and purely shrinks the JavaScript bundle. Dropping `nouislider` and its stylesheet reduces the footprint further.

### Documentation

- New Invalid state examples for the Checkbox, Radio, Select, File Upload, Input Group, and Tile, and new Disabled examples for the Button, Tabs, and Step Indicator.
- A new Focus Indicator page under the utility classes documents `focus-ring` and `focus-outline`.
- The agent-readable skill that ships in the package was regenerated to match the updated docs.

## v2.5.0

A release that adds two new components - a chat-style **Bubble** and a **Carousel** - and reworks the **Slot Picker** so you compose its toolbar yourself from small control directives. The Slot Picker also gains colored slots, selectable sub-slot tiles, a configurable day count, and an optional now indicator, and the Calendar gains a rejected event status. The breaking changes are all in the Slot Picker: it no longer renders a toolbar of its own, its host-level label attributes were removed, and the slot `icons` shape changed. See "Slot Picker" below to migrate.

### New component: Bubble

- **Bubble** (`x-h-bubble`) - a chat message surface with left or right alignment (`data-align`) and six semantic color variants (`data-variant`: primary, secondary, warning, negative, outline, transparent), both reactive at runtime. You compose a message from optional parts placed inside it: `x-h-bubble-header`, `x-h-bubble-content`, `x-h-bubble-footer`, an image (`x-h-bubble-image`, which requires `alt`), a two-column `x-h-bubble-gallery` with a `x-h-bubble-gallery-more` "+N" overlay, a file attachment (`x-h-bubble-file`), a link preview (`x-h-bubble-link`), and a `x-h-bubble-reactions` pill that overlaps the bubble edge and flips side with the alignment.
- **Audio attachments** - `x-h-bubble-audio` turns any `<audio>` into a custom, accessible player with a play/pause button and a `role="slider"` seek track that shows the current and total time. The slider is keyboard operable (Left/Right and Up/Down seek by five seconds, Home and End jump to the start and end) and supports pointer dragging, and its labels are localizable (`data-play-label`, `data-pause-label`, `data-label`).

### New component: Carousel

- **Carousel** (`x-h-carousel`) - a horizontal slideshow that shows one slide at a time with wraparound looping. Compose it from `x-h-carousel-content` (the track), one `x-h-carousel-item` per slide, `x-h-carousel-control` buttons with a `.previous` or `.next` modifier, and an `x-h-carousel-indicators` container that generates one dot per slide. Configure it with `data-autoplay`, `data-interval` (default 5000ms), `data-loop`, `data-start`, and `data-label`.
- Full keyboard support (Left/Right move between slides, Home/End jump to the first and last), a `region` role with `aria-roledescription="carousel"`, per-slide `group` roles, and controls that disable themselves at the ends when looping is off. Autoplay pauses automatically on hover and focus, slide transitions honor the reduced-motion preference, and a `change` event fires on the host with the new slide index in `event.detail.value`.

### Slot Picker

- **Breaking: you now compose the toolbar.** The Slot Picker renders only the day grid - it no longer builds its own toolbar. Build one from an `x-h-toolbar` wrapping the new control directives, each on an ordinary `x-h-button` that supplies the icon, label, and styling while the directive supplies the behavior: `x-h-slot-picker-previous` and `x-h-slot-picker-next` (page the window and disable at the `minDate` / `maxDate` bounds), `x-h-slot-picker-today` (return to the current day), `x-h-slot-picker-title` (the current period heading, an `aria-live` region), and `x-h-slot-picker-calendar` (opens a calendar popover to jump to any date). Each control must be a descendant of `x-h-slot-picker`.
- **Breaking: host label attributes removed.** Because you now own the buttons, `data-aria-prev`, `data-aria-next`, `data-aria-calendar`, and `data-today-label` were removed - put an `aria-label` or visible text on your own buttons instead. `data-unavailable-label` is the only host label attribute that remains. The calendar popover is now built lazily, only when a `x-h-slot-picker-calendar` control is present, and takes its accessible name from that control through `aria-labelledby` (generating an id when the button has none, reusing a consumer-supplied one).
- **Breaking: the slot `icons` shape changed.** Corner badges are now `icons: { left, right }`, each an optional array of `{ url, alt }` shown in the top-left and top-right corners. The old `icon: { url, alt }` and flat `icons: [...]` (top-right only) are gone.
- **Configurable window** - a `days` config key (default 3, up to 7) sets how many days are visible, and the previous and next controls page by that amount.
- **Now indicator** - a `showNowIndicator` config key draws a red current-time line in today's column that repositions itself and survives midnight.
- **Colored slots** - slots accept `color`, `status` (`confirmed`, `unconfirmed`, or `rejected`), `description`, and `note`. A colored slot keeps its color when unavailable and shows a color-matched ring when selected, a rejected slot renders with a dashed outline, and the palette matches the Calendar.
- **Sub-slot tiles** - a slot can carry a `tiles` array of individually selectable cells grouped under the slot's time label.
- **Richer `slot-click`** - `event.detail.slot` now also carries `description`, `note`, `color`, `status`, `key`, and `tileIndex`.

### Component enhancements

- **Calendar** - events accept a new `rejected` status, rendered as an outlined pill with a dashed border and announced as "rejected" to assistive technology, alongside the existing `confirmed` and `unconfirmed` statuses.

### New icons

- `file`, `link`, `play`, and `pause`, with the matching `File`, `Link`, `Play`, and `Pause` ESM constants.

### Documentation

- New **Coding Agents** page documenting the agent-readable skill that ships inside the package and the Claude Code plugin, so coding agents reach for the right `x-h-*` directives.
- Bubble and Carousel were added to the components list and navigation, and the docs site gained social preview cards (OpenGraph and Twitter metadata).

## v2.4.0

A release that adds two new date pickers - Month Picker and Week Picker - and makes the number input and the date and time pickers behave well inside table cells. It also fixes step indicators whose steps are generated dynamically. The only breaking change is the removal of the custom `position-fit` utility, which is replaced by the standard `inset-0` class.

### New components: Month Picker and Week Picker

- **Month Picker** (`x-h-month-picker`) - a text input paired with a popup that has a year header and a 12-month grid for selecting a month and year. The model is a `YYYY-MM` string. Supports `x-model`, the `table` modifier, a `locale` configuration key, and the trigger/popup, data-slot, and ARIA wiring shared with the date picker.
- **Week Picker** (`x-h-week-picker`) - a text input paired with a Monday-first month calendar whose rows are whole ISO weeks, for selecting a single week. The model is a `YYYY-Www` ISO week string, with the same `x-model`, `table` modifier, `locale`, and accessibility support.

### Table-cell input improvements

- **Number Input** (`x-h-input-number.table`) - inside a table the step buttons now stack into a single narrow column (plus over minus) instead of sitting side by side, so they no longer overflow or cover the value in a narrow cell. The input shrinks and the value truncates gracefully.
- **Date, Datetime, Month, and Week Pickers** (`.table`) - the trigger button may now shrink below its square shape, down to a still-tappable minimum, when the cell is cramped, keeping the value readable instead of forcing overflow.
- **Inner dividers** - the divider between the input and its trigger or step buttons now follows the table's border style: it is shown only when the table draws horizontal row lines (`data-borders="rows"` or `"both"`) and hidden when the table has no borders or only column borders.

### Step Indicator fix

- Items whose step number is an expression - for example generated with `x-for` from a loop index - now resolve to the correct step. Previously the item's step was read in a way that broke dynamically generated steps.

### Utility classes

- **Breaking: the custom `position-fit` class has been removed in favor of the standard `inset-0` utility.** It produces the same `top: 0; right: 0; bottom: 0; left: 0;`. Replace any `position-fit` with `inset-0`.

### Documentation

- The date and time related components (Calendar, the pickers, Inline Calendar) are now grouped together in the components list and landing page, so the related pickers are easy to find instead of being scattered across the alphabetical list.

### Consistent focus rings

- Focus rings across components (dialog, select, tree, calendar, time and slot pickers, table cells, and the pickers) now use a spacing-relative ring width, so the focus outline is consistent everywhere.

## v2.3.1

Bugfix release

### Fixed Avatar fallback

The avatar fallback directive has it'w own background, which interfered with the avatar color set using the `data-color` attribute. The fallback background is now transparent.

### Fixed input dropdown in form fields

The `x-h-field` directive added a `transform-gpu` class to every field wrapper, which sets `transform: translateZ(0)` - and any non-none transform creates a new stacking context (plus a containing block for the absolutely-positioned dropdown).

Any input dropdown is a descendant of that field, so its `z-50` class only competed inside the field's own stacking context, and it could never escape it. Every sibling `x-h-field` below was also a stacking context (all effectively at level 0), and sibling stacking contexts at the same level paint in DOM order. Later fields therefore painted on top of the open dropdown.

The fix was to remove the `transform-gpu` class.

## v2.3.0

A release that adds read-only support to the text-like inputs, makes the disabled opacity themeable through a new `--opacity-disabled` variable, ensures every input reacts to `disabled` and `readonly` being toggled at runtime, and fills the documentation with Disabled and Read-only examples for all inputs. No breaking changes.

### Read-only support for text-like inputs

- **Input, Textarea, Number Input, Date Picker, Datetime Picker, Time Picker** - the native `readonly` attribute on the (inner) input is now styled: the value is shown with a muted background, normal text color, and a default cursor, clearly distinct from the dimmed disabled look. Read-only is fully dynamic, so toggling the attribute at runtime updates the styling.
- **Date, Datetime, and Time Picker** - a read-only picker is locked: the trigger no longer opens the popover with mouse or keyboard, and it exposes `aria-disabled` (kept in sync when the attribute is toggled at runtime), so the value cannot be changed while it stays selectable and readable.
- **Number Input** - a read-only number input hides its step buttons entirely, and the steppers no longer change the value.

### Themeable disabled opacity

- New `--opacity-disabled` variable in the light and dark themes (default `0.5`), exposed as an `opacity-disabled` utility class. All components now dim disabled elements with it instead of the hardcoded `opacity-50`, so themes can tune how muted disabled controls look. Documented under Custom Themes and the opacity utilities, and available in the theme generator.

### Disabled state improvements

- **Checkbox, Radio, Switch** - a label following a disabled control is now dimmed and shows the not-allowed cursor, matching how the text input dims its content.
- **File Upload** - now reacts to the `disabled` attribute being set or removed after the initial render. Previously the dimmed, non-interactive state was applied only when the input was disabled at initialization.
- **Rating** - the `disabled`, `data-disabled`, and `data-readonly` attributes are now fully reactive: toggling them at runtime switches the role between `slider` and `img`, updates `tabindex`, the ARIA value attributes, and the dimming, and restores interactivity when they are removed.
- **Date and Datetime Picker** - the trigger is now also locked when the input is disabled. Previously it could still be opened with the keyboard, since only pointer events were blocked.

### Documentation

- Every input page gains a Disabled example (Input, Textarea, Number Input, Input Group, Checkbox, Radio, Switch, Select, File Upload, Range, Date Picker, Datetime Picker, Time Picker), and the text-like inputs gain a Read-only example showing the muted read-only look.

## v2.2.0

A release that adds a menubar component, rebuilds the charts as scalable vector graphics with two new chart types and an export utility, and brings smaller component, icon, and utility additions. No breaking changes to the documented API. Custom CSS that targeted the charts' old div-based internals may need updating, since charts now render as SVG.

### New component: Menubar

- **Menubar** (`x-h-menubar`) - a horizontal bar of always-visible command menus, like the "File Edit View" menus found in desktop applications. Each top-level item opens a dropdown powered by the existing Menu component, so submenus, labels, separators, and checkbox and radio items all work inside. While a menu is open, hovering or focusing a sibling trigger switches to that menu without an extra click, just like in desktop applications. The bar is a single Tab stop with full keyboard operation: `Left` / `Right` move across the top-level items (switching the open menu along the way), `Down` / `Enter` / `Space` and `Up` open the focused menu at its first or last item, and `Home` / `End` jump to the ends of the bar.

### Charts rebuilt as SVG

- All charts are now drawn as SVG vector graphics instead of styled divs, so they stay crisp at any size and zoom level and can be exported. The configuration objects, theming, tooltips (including click-to-pin), events, legends, and accessible data tables all work as before.
- **New chart types** - **Polar Area** (`x-h-chart-polar-area`) compares magnitudes with equal-angle slices that reach further from the center as their value grows, and **Radar** (`x-h-chart-radar`) compares several quantitative dimensions at once, drawing each series as a closed shape across the axes. Both come with docs, configuration references, and events.
- **Chart Export** - new `chartToSvg` and `chartToImage` functions (on the `Harmonia` global and as named ESM exports) capture a chart exactly as currently rendered, including the active light or dark theme colors. `chartToSvg` returns standalone SVG markup that looks identical at any size, and `chartToImage` resolves with a PNG (or JPEG/WebP) data URL with configurable background, pixel density, format, and quality. Documented under Utilities.
- **New `data-font-size` attribute** on every chart element (`xs` default, `sm`, `base`, `lg`) scales all chart text, such as labels, axis ticks, and the legend.

### Component enhancements

- **Sidebar** - new `data-logo` attribute on menu buttons. When the sidebar is collapsed, it removes the button padding and makes the leading icon or avatar fill the button. Use it on buttons that show a brand logo in the header or footer, or a user avatar elsewhere in the sidebar.
- **Lucide plugin** - `data-lucide` is now reactive on `<svg>` placeholders: changing it (for example via `:data-lucide`) re-renders the icon in place, just like the icon component's `data-icon`. A re-render removes only the classes the previous icon introduced, while author-set classes are kept.

### New icons

- `eye`, `eye-off`, and `inbox`, with the matching `Eye`, `EyeOff`, and `Inbox` ESM constants.

### New utility classes

- SVG paint utilities matching the standard palette: `fill-*` and `stroke-*` for `white`, `black`, and the ten palette colors at the 500 step.

### Fixes

- **Include** - inline scripts in a fragment loaded with `data-js` now execute synchronously when the fragment is inserted. Previously Alpine initialized the inserted markup between scripts, so registrations from any script after the first were not picked up.

## v2.1.2

A patch release that makes the icon component's `data-link` attribute reactive and keeps leading icons visible in collapsed sidebars. No breaking changes.

### Component enhancements

- **Icon** - the `data-link` attribute is now reactive: bind it with `:data-link` and the SVG is fetched again and replaced whenever the value changes, just like `data-icon`. Classes on the fetched SVG's root element are merged with the classes already on the icon instead of replacing them, and a re-render removes only the classes the previous SVG introduced while author-set classes are kept. Out-of-order responses from rapid link changes are discarded, a failed fetch leaves the current icon intact, and removing `data-link` falls back to rendering `data-icon`.
- **Sidebar** - a leading SVG icon in a menu button now stays visible when the sidebar is collapsed, filling the button the same way a leading avatar does. This makes product logos loaded with the icon component usable in product switch headers.

## v2.1.1

A patch release that synchronizes the i18next plugin's language across tabs and iframes, adds bubbling `change` events to the time and datetime pickers, and brings small docs improvements. No breaking changes.

### i18next: language synchronization across tabs and iframes

- Languages switched through `$i18n.changeLanguage` are now persisted to localStorage (under `codbex.harmonia.language` by default) and propagate to every other same-origin document that uses the plugin, embedded iframes and other browser tabs alike, exactly like the color mode does. Calling `i18next.changeLanguage(...)` directly on the global still updates only the current document.
- A document that loads after a change (a late iframe, a new tab, a reload) adopts the stored language as soon as its own i18next instance initializes, overriding the configured `lng`. The docs show how to seed `i18next.init` from the stored key to avoid the brief flash of the default language.
- The `Harmonia` global gains a `plugins` container where opt-in plugin bundles expose their APIs: the i18next bundle registers `Harmonia.plugins.i18next` with `setLanguageStorageKey` / `getLanguageStorageKey` for configuring the storage key (also named exports of the ESM build). Only documents using the same key sync with each other.
- The plugin docs add a live "Cross frame synchronization" example that embeds a real second Harmonia page in an iframe, driving and following the language of the parent page.

### Component enhancements

- **Time Picker** - the `change` event fired after a popup selection now bubbles, so it can be handled on the `x-h-time-picker` element itself.
- **Datetime Picker** - fires a bubbling `change` event on its input whenever the combined date and time value changes.
- The date, time, and datetime picker docs gain an Events section and a "Listening for changes" example, so reacting to a selection needs no `$watch`.

### New utility classes

- `mx-auto`.

### Docs and tooling

- Typing `/` inside a live example input (a date, for instance) no longer opens the docs search box. The search hotkey handler saw the shadow host instead of the inner input, so editable origins are now detected through the composed event path.

## v2.1.0

A release that adds translations through an opt-in i18next plugin, ships two new full application templates (Granite ERP and Onyx Chat), extends the badge indicator and avatar and rebuilds the skill generator. No breaking changes.

### New plugin: i18next (opt-in)

- Optional binding glue for [i18next](https://www.i18next.com/): the `x-h-translate` directive renders translations into an element's text content, and the `$t` / `$i18n` magics translate and switch languages from expressions and `Alpine.data` objects. Everything re-renders reactively on language changes and resource loads, including when `i18next.changeLanguage()` is called directly on the global. Uses `window.i18next` (never bundled) and ships as a separate bundle (`dist/harmonia-i18next.js` / `.min.js`) that CDN users add as an extra `<script>`; ESM consumers get an `I18next` export. It is deliberately left out of the default bundle and default registration. Documented under "Plugins".
- `x-h-translate` takes the key from its expression (a string, or a `[key, options]` array for interpolation and plurals). The element's initial text content, or a `data-fallback` attribute, provides fallback text shown while the key cannot be resolved (not yet initialized, or missing from the loaded resources); it rides i18next's own `defaultValue` option, so an explicit `defaultValue` in the options still wins.
- `$i18n` exposes a reactive `language` (plus `languages`, `isInitialized`, `changeLanguage`, `exists`, and `dir`), so language-switcher UIs can highlight the active language.

### New templates

- **Granite ERP** (`docs/public/templates/granite-erp/`) - a multi-page ERP app split across one shell, two scripts, and thirteen page fragments (dashboard, inbox, approvals, invoices with a detail view, bills, customers, vendors, inventory, documents, reports, settings, not-found), routed client-side with Pinecone Router.
- **Onyx Chat** (`docs/public/templates/onyx-chat/`) - a team chat app with channels, direct messages, reactions, and simulated replies across one shell, two scripts, and six page fragments; it showcases collapsed-sidebar avatars, badge-indicator presence colors, and notifications.
- The template showcase on the docs home page now supports multi-file templates with per-file tabs and a description.

### Component enhancements

- **Badge indicator** - new `data-position` attribute (`top-right` default, `top-left`, `bottom-left`, `bottom-right`) anchors the indicator to any corner of the host, with tuned offsets on `rounded-full` hosts; new `data-size="sm"` renders a compact indicator for both labelled badges and dots. Position, size, variant, and dot all react to attribute changes.
- **Avatar** - new `primary` variant, and a new `data-color` attribute that fills the avatar solid with one of the twelve standard palette colors (overrides `data-variant`; `white` and `yellow` get a dark foreground for contrast; the secondary hover styling on button avatars is suppressed). Icons inside avatars are now colored through `currentColor`, replacing the per-variant svg fill classes.
- **Sidebar** - a leading avatar in header items and menu buttons now behaves like a leading icon and stays visible when the sidebar is collapsed; the docs add "Product switch header" and "Collapsed with avatars" patterns.
- **Lucide plugin** - `<svg x-h-lucide>` placeholders are now rendered in place, so Alpine directives on the icon (`x-show`, `:class`, `x-transition`, `@click`, ...) keep working; any other tag is still replaced by the rendered svg, and combining such a placeholder with another directive now throws a descriptive authoring error instead of silently breaking.

### New utility classes and tokens

- New `text-2xs` type scale step (`0.625rem`), including responsive variants.
- `self-{start,center,end,stretch}`, documented on a new "Align Self" page.
- `h-mask` / `v-mask` - fade out the horizontal/vertical edges of overflowing content, documented on a new "Masks" page (generalized from the breadcrumb-internal `h-mask-bc`).
- `tabular-nums`, `select-none`, `wrap-{break-word,anywhere}`, `rounded-control`, `shrink-0`.
- `bg-card`, `bg-background`, `border-border`, `hover:bg-muted`, `group-hover:opacity-100`, and `group-focus-within:opacity-100`.

### Docs and tooling

- **Live examples are single-source.** New `LiveExample` and `IconGallery` doc components run the exact fenced code they display, so the shown code and the running demo can never drift; `component-container` no longer fetches fragment files and rejects inline markup with a descriptive error. The per-example HTML fragment files under `docs/public/components/` are gone.
- **Agent docs generator** - strips the VitePress wrapper tags from transcribed docs, expands `<<< @/path` file snippets (so multi-file templates transcribe fully), converts `::: info` style containers to blockquotes, and links every reference back to the full docs; a test guards against wrapper tags leaking into `skills/`.
- `.claude-plugin` homepage now points to https://www.codbex.com/harmonia/.

## v2.0.0

A major release that grows the component set, adds first-class charting, ships an AI agent skill + Claude Code plugin, introduces an opt-in Lucide icon plugin, and refactors the date/time pickers, icons, and form validation. Includes breaking renames, so the version is bumped to 2.0.0.

### Breaking changes

- **Breaking: date/time pickers refactored to use standard model values** instead of custom formats, so `x-model` bindings behave predictably across the picker family.
- **Breaking: icon rendering changed from a modifier to the reactive `data-icon` attribute.** `x-h-icon.home` becomes `x-h-icon data-icon="home"`. The icon now switches dynamically when `data-icon` changes at runtime.
- **Breaking: utility class `absolute-fit` renamed to `position-fit`.**
- **Breaking: built-in icons renamed:** `info.svg` -> `circle-info.svg`, `warning.svg` -> `circle-warning.svg`.
- **Breaking: form validation now defers to `:user-invalid` instead of `:invalid`.** Inputs, input-groups, and fieldsets no longer show error styling on initial load; they show it only after interaction/submit. Opt back into immediate on-load validation with `data-validate="immediate"` on an ancestor.

### New components

- **Charts** - a new `x-h-chart-*` family: `line`, `bar`, `doughnut`, `pie`, and `scatter`. Driven by a single reactive config object, theme-aware, with docs and theming fragments for each type.
- **Datetime Picker** (`x-h-datetime-picker`) - combined date + time selection.
- **File Upload** (`x-h-file-upload`).
- **Rating** (`x-h-rating`) - star rating input (ships new `star`, `star-half`, `star-hollow` icons).
- **Slot Picker** (`x-h-slot-picker`) - time-slot selection.
- **Inline Calendar** - documented calendar usage rendered inline rather than in a popover.

### New plugin: Lucide (opt-in)

- Optional `x-h-lucide` directive that renders [Lucide](https://lucide.dev/) icons via the `window.lucide` global. Ships as a separate bundle (`dist/harmonia-lucide.js` / `.min.js`) that CDN users add as an extra `<script>`; ESM consumers get a `Lucide` export. It is deliberately left out of the default bundle and default registration. Documented under a new "Plugins" section.
- Fixed a re-initialization bug where the directive attribute was copied onto the rendered SVG, causing a spurious "no icon name found" error.

### AI agent tooling

- **Harmonia skill** (`skills/harmonia/`) - a generated agent-facing knowledge base (a `SKILL.md` router, one `references/<name>.md` per component, `llms.txt`, and a `utility-classes.md` allowlist) so coding agents can author correct Harmonia markup. Generated from the docs by `scripts/generate-agent-docs.cjs` on every build; the package now ships the `skills/` directory.
- **Claude Code plugin** (`.claude-plugin/`) - the skill doubles as an installable Claude Code plugin (`plugin.json` + `marketplace.json`).
- Added `AGENTS.md` / `CLAUDE.md` with architecture, conventions, and testing guidance.

### New template

- **Slate Dashboard** (`docs/public/templates/slate-dashboard.html`) - a full, working, theme-aware dashboard showcasing the breadth of the library (sidebar navigation switching views, toolbar, breadcrumb, cards, all chart types, a filterable/paginated customers table, a functional add-customer dialog with inline validation, functional notifications, and a working theme switcher). Linked from a new "Templates" section on the docs home page.

### Component enhancements

- **Popover** - the trigger now supports two-way open-state binding (`x-h-popover-trigger="open"`) that stays automatic (toggle on click, dismiss on outside click) while remaining settable from elsewhere; adding your own `@click` switches it to fully manual control. New `data-max-w` attribute caps the popover width at a container-size token, clamped so it can never overflow the viewport.
- **Progress** - new circular variant (`data-type="circle"`) with an indeterminate `data-loading` spinner and `data-variant` colors, plus a `progress-loading` keyframe animation.
- **Sidebar** - new `data-borderless` mode and reactive border handling; menu-badge support.
- **Icon** - respects an author-supplied `fill-*` class instead of always forcing `fill-current`.
- **Inputs / input-groups / fieldsets** - validation moved to `:user-invalid` with the `data-validate="immediate"` opt-in (see breaking changes); transition utilities consolidated to `transition-[color,box-shadow]`.
- **Calendar** - substantial refactor with locale-aware parsing (including Arabic and other locale date strings), configurable order and delimiter options, and shared calendar math extracted to `src/common/`.

### New utility classes and tokens

- Responsive `col-span-1..12` and `row-span-1..12`.
- `line-clamp-1..6`.
- `whitespace-pre-line`.
- `position-fit` (renamed from `absolute-fit`) and new `position-center` helper.
- `{top,left,right,bottom}-0`.
- Sizing scales extended to start at 1 (was 4): `size-*`, `h-*`, `w-*`, `min-h-*`, `max-h-*`, `min-w-*`, `max-w-*`.
- Sidebar color utilities: `bg-sidebar`, `text-sidebar-foreground`.
- Standard palette utilities for general use: `bg-white/black`, `text-white/black`, and `{bg,text}-{red,orange,yellow,green,blue,purple,pink,indigo,gray,teal}-500`.

### Build and infrastructure

- Icon data map is now generated from `icons/*.svg` at build time via `scripts/generate-icons.cjs` (`npm run icons:generate`); new `ellipsis` icon added.
- `npm run build` now also runs `agent-docs:generate` and builds the Lucide bundles.
- Tailwind no longer scans `tests/` (prevents test literals from leaking classes into the shipped CSS).
- New shared helpers under `src/common/` (`ancestor`, `chart`, `colors`, `intl`, `picker-popover`, `time`, `icon-data`) and `src/utils/` (`date-format`, `dismiss`), plus a `date-format` Alpine plugin.
- New test suites for charts, pickers, file-upload, rating, slot-picker, colors, time, date-format, dismiss, the ESM module surface, the generated agent docs, and doc structure.
