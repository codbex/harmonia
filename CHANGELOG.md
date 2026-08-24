# Changelog

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
