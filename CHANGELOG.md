# Changelog

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

- The custom `position-fit` class has been removed in favor of the standard `inset-0` utility, which produces the same `top: 0; right: 0; bottom: 0; left: 0;`. Replace any `position-fit` with `inset-0`.

### Documentation

- The date and time related components (Calendar, the pickers, Inline Calendar) are now grouped together in the components list and landing page, so the related pickers are easy to find instead of being scattered across the alphabetical list.

### Consistent focus rings

- Focus rings across components (dialog, select, tree, calendar, time and slot pickers, table cells, and the pickers) now use a spacing-relative ring width, so the focus outline is consistent everywhere.

## 2.3.1

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

- **Date/time pickers refactored to use standard model values** instead of custom formats, so `x-model` bindings behave predictably across the picker family.
- **Icon rendering changed from a modifier to the reactive `data-icon` attribute.** `x-h-icon.home` becomes `x-h-icon data-icon="home"`. The icon now switches dynamically when `data-icon` changes at runtime.
- **Utility class `absolute-fit` renamed to `position-fit`.**
- **Built-in icons renamed:** `info.svg` -> `circle-info.svg`, `warning.svg` -> `circle-warning.svg`.
- **Form validation now defers to `:user-invalid` instead of `:invalid`.** Inputs, input-groups, and fieldsets no longer show error styling on initial load; they show it only after interaction/submit. Opt back into immediate on-load validation with `data-validate="immediate"` on an ancestor.

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
