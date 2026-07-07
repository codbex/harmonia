# Changelog

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
