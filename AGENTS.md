# AGENTS.md

Harmonia is a modern UI component library for [Alpine.js](https://alpinejs.dev/), built with Tailwind CSS v4 and bundled with esbuild.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## Commands

- **Build library**: `npm run build` runs esbuild bundles, then the Tailwind CLI, then copies dist into the docs site. `npm run build:prod` skips the doc copy.
- **Tailwind only**: `npm run tailwind` (one-shot) / `npm run tailwind:watch`.
- **Tests**: `npm test` (vitest run), `npm run test:watch`, `npm run test:coverage`.
- **Single test file**: `npx vitest run tests/components/accordion.test.js`. Single test by name: `npx vitest run -t "name substring"`.
- **Lint / format**: `npm run lint` / `npm run lint:fix`; `npm run format` / `npm run format:check`.
- **Docs** (VitePress): first run `npm run docs:install`, then **rebuild the library** (`npm run build`) so the freshly built dist is copied into the docs site, then `npm run docs:dev` (live) or `docs:build` + `docs:preview`.

## Architecture

- **Component = Alpine plugin.** Each file in `src/components/*.js` default-exports `function (Alpine) { ... }` registering one or more `Alpine.directive('h-<name>', ...)` directives. New components must be wired into **both** `src/index.js` (browser/CDN build, calls `Alpine.plugin(...)`) and `src/module.js` (ESM build: named `XxxComponent` export + a line in `registerComponents`). Forgetting one silently breaks that build target. A new component must also be added to the theme generator (see the "Keep the theme generator in sync" convention).
- **Two build entry points / four bundles** (`scripts/build.cjs`): `src/index.js` → `harmonia.js` / `.min.js` (browser, `CDN:true`, auto-registers on the `alpine:init` event); `src/module.js` → `harmonia.esm.js` / `.min.js` (neutral platform, for consumers who register components manually).
- **Opt-in plugins** live in `src/plugins/*` and must NOT load by default. Pattern (see `src/plugins/lucide.js`): the plugin file default-exports the `function (Alpine) {...}`; a dedicated browser entry (`src/lucide.js`) self-registers it on `alpine:init` and gets its own `scripts/build.cjs` bundle (e.g. `dist/harmonia-lucide.js` / `.min.js`) that CDN users add as an extra `<script>`; `src/module.js` adds a named export (e.g. `lucide as Lucide`) for `Alpine.plugin(...)` but deliberately leaves it OUT of `registerComponents`; `src/index.js` is left untouched so it never enters the default bundle. Such plugins may depend on an external global (Lucide uses `window.lucide`) and must not bundle it. Docs for opt-in plugins live under `docs/plugins/` (separate "Plugins" sidebar group), not `docs/components/` or `docs/utilities/`.
- **Parent/child directives communicate via `el._h_<name>` objects.** A component attaches state to its host element as e.g. `el._h_accordion` (often `Alpine.reactive({...})`); child directives locate the ancestor with the shared `findAncestorState(Alpine, el, '_h_accordion')` helper (`src/common/ancestor.js`) and throw a descriptive `Error` when it returns undefined. Follow this pattern for new compound components (use the helper rather than re-inlining the `Alpine.findClosest(... hasOwnProperty ...)` call).
- **Styling is class-driven from JS.** Directives push Tailwind utility classes via `el.classList.add(...)` and set `data-slot` / `data-size` attributes; arbitrary-variant selectors like `[[data-size=sm]_&]:h-8` let children adapt to an ancestor's size. There is little hand-written CSS; `src/styles/globals.css` defines the design tokens (oklch CSS vars for light + `.dark`, exposed to Tailwind v4 via `@theme inline`) and imports a few component CSS files.
  - **Tailwind only scans `src/**`** - enforced by `source(none)`on`globals.css`'s `@import "tailwindcss"`, which turns off the CLI's automatic detection (it otherwise walks the whole repo, so a class name written in a comment or a markdown file leaks into the build) and leaves the single explicit `@source`glob, which resolves to`src/`because it is relative to`src/styles/`. Do not drop `source(none)`without re-adding`@source not`lines for`docs/`, `skills/`, `tests/`and`scripts/`. A utility class is in the shipped `dist/harmonia.css`only if it appears somewhere under`src/`. Two consequences: (1) classes composed dynamically (e.g. `` `bg-${token}` ``) need a literal safelist comment in a scanned file or they won't be generated; (2) docs examples can only use classes already present in `src/`, so for one-off needs like a fixed height, use an inline `style`instead of a class like`h-80` (which won't exist).
  - **The safelist is the public subset, not everything shipped.** `harmonia.css`'s `@source inline(...)` list is what consumers are documented to have; `dist/harmonia.css` is that plus every class the scan of `src/` turns up (~1500 more, including the arbitrary-variant ones). Keep both in mind when reasoning about what exists at runtime.
  - **`dist/harmonia-extend.css`** is generated from `src/styles/globals.css` (with its local `@import`s inlined) by `scripts/generate-extend-css.cjs`, for consumers to import into their own Tailwind entry and compile the classes Harmonia does not ship (see `docs/extend-utility-classes.md`). It carries the `@theme` blocks and `@custom-variant`s, then excludes everything already shipped via `@source not inline(...)`, Tailwind's exact-match candidate blocklist: the safelist patterns verbatim, plus the scan of `src/` filtered to the candidates that really compile (`compile()` for the source list, `Scanner` for the walk, `candidatesToCss` for validity - all from Tailwind itself, so the two builds cannot disagree). The `:root` token values are deliberately NOT copied: they would shadow Tailwind's inlined `--radius`/`--shadow`/`--blur` aliases and change classes `harmonia.css` already ships. Everything flows in automatically - never hand-edit it. It runs on `npm run build:prod` only (the publish path), never on `npm run build`, and nothing in the library, docs or tests reads the artifact.
- **Icons**: `src/common/icons.js` is an integer-indexed registry; build SVGs with `createSvg({ icon, classes, attrs })` rather than inlining markup. Other shared non-directive helpers live in `src/common/` (calendar math, class-list, input-size); cross-cutting utilities (`uuid`, `theme`, `breakpoint-listener`, `focus`, `template`, `include`) live in `src/utils/`. Note `focus`/`template`/`include` are themselves registered as Alpine plugins.

## Testing

- **happy-dom** environment; `tests/setup.js` patches `innerText`.
- Directives are tested **without real Alpine**. `tests/test-utils.js` provides `mountDirective(plugin, 'h-name', el, bindings, ctxOverrides)` plus `createMockAlpine` / `createMockContext`, a minimal Proxy-based `reactive`/`effect` implementation. Use these helpers and assert on the DOM, attributes, and `el._h_*` state the directive produces. Mirror the `src/` layout under `tests/` (`tests/components`, `tests/common`, `tests/utils`).

## Conventions

- ESLint flat config (`eslint.config.js`): browser globals + `Alpine` readonly for `src`; unused vars allowed only with a `_` prefix; `console` limited to `warn`/`error`. Prettier enforces formatting (with organize-imports + tailwindcss plugins).
- `SPLIT.md` documents the most intricate component (`src/components/split.js`); read it before touching split layout/drag/persistence logic.
- **Never use an em dash or en dash** anywhere (prose, docs, code comments, commit messages, markdown tables, numeric ranges). Always use a plain hyphen (e.g. `0.2-0.9`) or reword.
- **Use `rem`, not `px`** in styles, including inline styles set from JS; convert measured pixel values (`getBoundingClientRect`) to rem.
- **Build DOM with `createElement` / `textContent`, never HTML strings.** No `innerHTML` or template-string markup, and components must not accept HTML from consumers.
- **Theme color variables**: Harmonia semantic tokens are `var(--primary)`, `var(--negative)`, etc. with no `--color-` prefix (they are `@theme inline`, so the `--color-*` form is not emitted at runtime). The standard palette does carry the prefix: `var(--color-red-500)`, `var(--color-white)`. Prefer `bg-<token>` / `text-<token>` utilities; use the raw CSS var only for inline styles (e.g. the chart pie's `conic-gradient`).
- **All components must be accessible** to users with disabilities: proper ARIA roles/states, keyboard operability, and accessible names (follow the existing pattern of setting a sensible default `aria-label` only when the author has not already set one).
- **Every event listener added inside a directive must be removed in its `cleanup`** (the function passed to Alpine's `cleanup(() => ...)`). No listener may outlive the directive's lifecycle.
- **No hardcoded user-facing titles/labels in components.** A default fallback string is fine, but there must always be a way for the consumer to override the text (e.g. `el.getAttribute('data-today-label') || 'Today'`).
- **Keep the theme generator in sync.** The theme generator lives at `docs/public/theming/generator.html` and loads one HTML fragment per component from `docs/public/theming/fragments/`, with its section lists coming from `docs/public/theming/sections.json`. It must always reflect the current library:
  - **Fragments and sections.json are generated from the docs - never hand-edit or commit them.** They are gitignored build artifacts: the GitHub Pages workflow (`.github/workflows/build-github-pages.yaml`) runs `npm run theming:generate` before building the docs, so the deployed site always gets fresh fragments. The command (`scripts/generate-theming-fragments.cjs`, separate from the library build) rebuilds every fragment from the `<LiveExample>` fences of its source doc page(s) and rewrites `sections.json` (labels from each doc's H1, plus an automatic `scripts: true` flag when a fragment carries a `<script>` from a doc example). No need to rerun it after doc changes; run it locally only to use or test the theme generator (e.g. via `docs:dev`). Every `docs/components/*.md` and `docs/layouts/*.md` is auto-discovered as a fragment named after the file (`docs/charts/*.md` becomes `chart-<name>`), so a new component with doc examples appears in the generator without further wiring; only fragments that merge several docs (or pull from outside those folders) are configured in the script's `COMBINED` map, and doc pages that need no fragment in `EXCLUDE`. To keep a single example out of its fragment (while keeping it in the docs), set `data-exclude="generator"` on its `<LiveExample>` (`data-exclude="skill"` excludes it from the agent-docs skill instead, and `data-exclude="all"` from both).
  - **Every add, change, or rename of a CSS variable** in `src/styles/globals.css` must be mirrored in `generator.html`'s `colorVars` / `shadowVars` / `fontVars` / `othersVars` arrays, which bucket the `:root` / `.dark` variables into the generator's Colors/Shadows/Fonts/Others panels. A new variable left out of these arrays falls into the generic "Others" text input instead of its proper panel (e.g. a color var would lose its color picker); a removed/renamed variable must be deleted/updated there too.

## Documentation

- Component docs (`docs/**`) stay user-facing: describe what a component does and how to use it, not implementation internals (e.g. do not write "drawn with HTML/CSS, no SVG"). Small user-relevant behaviors (e.g. "adapts to light and dark mode automatically") are fine.
- **Every doc page follows one canonical structure, enforced by `tests/docs-structure.test.js`** (the source of truth for doc layout): `# Title` -> one-paragraph description -> `## Usage` -> optional `## Keyboard Handling` / `## Accessibility` -> `## API Reference` -> `## Examples`. Under API Reference: `### Component attribute(s)` (always, plural) then optional `### Attributes` (per-directive `#### x-h-<name>` sub-tables), `### Modifiers` (after Attributes), `### Model`, `### Events`, `### Configuration` (never `Config`). Example variants are `###` subsections under a single `## Examples`. The test also checks section order and canonical names; run `npx vitest run tests/docs-structure.test.js` after editing docs.
- **Write every runnable example with `<LiveExample>` wrapping ONE ```html fence.** The fence is the single source of truth: VitePress highlights it for display, and `LiveExample` (`docs/.vitepress/theme/LiveExample.vue`) reads that same text and runs it live inside a shadow-DOM `component-container`. So the shown code and the running demo can never drift. Inline the markup in the fence; only for a genuinely standalone artifact (e.g. a full-page template shown in an iframe) use `<<< @/public/...` to pull a file into the fence. Pass `data-class` / `data-style` on `<LiveExample>` to style the demo wrapper. Examples still render in a shadow DOM, so they can only use classes present in `src/` (see the Tailwind scanning note above); for a one-off size like a fixed height, use an inline `style`.
- **Shorthands work in a `LiveExample` fence.** VitePress compiles markdown through Vue, which hijacks the `@event` / `:attr` shorthands (and `{{ }}`) at build time - evaluating them in the page's Vue scope and stripping them before Alpine runs. A ```html fence is rendered as inert, escaped text that Vue never compiles, so inside `LiveExample`you write Alpine's normal`@click`/`:attr`/`{{ }}`directly (no`x-on:`/`x-bind:`long forms, no external`src`fragment). This is why`LiveExample` replaced the old inline-`component-container`-plus-duplicate-code-block pattern.
- **`component-container` is internal - never author it in a doc.** It renders markup handed to its `_code` property (that is what `LiveExample` and `IconGallery` do); written inline in markdown with children it **throws**, on purpose. Inline authoring cannot work: VitePress compiles the page through Vue, which hijacks Alpine's `@` / `:` shorthands (and `{{ }}`) in the children before Alpine runs. `v-pre` would stop that, but Vue strips `v-pre` at compile time, so the element cannot detect (or require) it at runtime - hence the throw on any inline children instead. For a runnable example use `<LiveExample>` (wraps one ```html fence); for a bespoke live widget with no visible code, write a small Vue component that builds markup and assigns `\_code`(see`IconGallery.vue`).
- **Agent docs are generated from `docs/**`, not hand-written.** `scripts/generate-agent-docs.cjs`transcribes each doc into`skills/harmonia/`(the`SKILL.md`router, one`references/<name>.md`per doc, and`llms.txt`), which ships in the npm package and doubles as a Claude Code plugin (`.claude-plugin/`). It runs on every `npm run build`; `tests/agent-docs.test.js`fails if`skills/`is stale or a component lacks a reference. So the source docs are the single source of truth: to change agent-facing content, edit the doc (or the generator's parser/template) and rerun`npm run agent-docs:generate`. Do not hand-edit files under `skills/`. The generator relies on the doc template (an `## API Reference`section with a`Component attribute(s)`block and ```html example blocks); a doc that drops the directive block trips a build warning and the test. The one reference NOT built from`docs/\*\*`is`references/utility-classes.md`: it is generated from `src/styles/harmonia.css`(the Tailwind`@source inline`safelist plus`@utility`/`.class`rules), which is the authoritative list of shipped utility classes - so adding or removing a utility class there automatically updates the agent allowlist. To keep a piece of docs prose (e.g. a photo-attribution note) visible on the docs site but out of the generated skill, wrap it in a`<!-- skill:ignore -->`...`<!-- /skill:ignore -->`region; the generator drops the whole region (the prose counterpart of`data-exclude="skill"`on a`<LiveExample>`).
