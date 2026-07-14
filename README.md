<p align="center">
  <a href="https://codbex.com/harmonia/" rel="noopener" target="_blank"><img width="256" height="256" src="docs/public/logo/harmonia.svg" alt="Harmonia logo"></a>
</p>

<h1 align="center">Harmonia</h1>

Harmonia is a modern UI Component Library for Alpine.js

## About

Harmonia is a modern UI component library for [Alpine.js](https://alpinejs.dev/), built with [Tailwind CSS v4](https://tailwindcss.com/) and bundled with [esbuild](https://esbuild.github.io/). It ships more than 60 components, plus charts, layouts, utilities and opt-in plugins. Every component is accessible (ARIA roles/states, keyboard operability, accessible names), themeable through oklch design tokens (automatic light and dark mode), and driven by simple `x-h-*` Alpine directives. Harmonia also ships an agent-readable skill so coding agents can use every component correctly.

- Live docs and component gallery: https://codbex.com/harmonia/
- Installation (CDN, npm, WebJar): see [docs/installation.md](docs/installation.md)

## Coding agents

Harmonia ships an agent-readable skill so coding agents (Hermes, Claude Code and others) know how to use every component. After `npm install @codbex/harmonia`, it lives at `node_modules/@codbex/harmonia/skills/harmonia/` (a `SKILL.md` router plus one reference file per component, and an `llms.txt` index).

**Claude Code plugin.** Install it so the skill is discovered automatically:

```
/plugin marketplace add codbex/harmonia
/plugin install harmonia@harmonia
```

**Manual (any agent that reads `.claude/skills`, `.hermes/skills`, etc.).**

Expose the shipped skill in your project.

For Claude on Linux/macOS:

```sh
ln -s node_modules/@codbex/harmonia/skills/harmonia .claude/skills/harmonia
```

For Claude on Windows:

```sh
cp -r node_modules/@codbex/harmonia/skills/harmonia .claude/skills/harmonia
```

For Hermes on Linux/macOS:

```sh
ln -s node_modules/@codbex/harmonia/skills/harmonia .hermes/skills/harmonia
```

For Hermes on Windows:

```sh
cp -r node_modules/@codbex/harmonia/skills/harmonia .hermes/skills/harmonia
```

Either way, point your agent at `skills/harmonia/SKILL.md` to start.

## Getting started

```sh
# 1. Install dependencies
npm install

# 2. Build the library
npm run build

# 3. Run the tests
npm test
```

The build writes to `dist/`: four JS bundles (`harmonia.js` / `.min.js` for the browser and CDN, `harmonia.esm.js` / `.min.js` for bundlers) plus the compiled `harmonia.css`.

## Commands

| Command                       | Description                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `npm run build`               | Bundle the library (esbuild), compile Tailwind, generate the agent docs, and copy `dist/` into the docs site. |
| `npm run build:prod`          | Same as `build` but skips copying `dist/` into the docs site.                                                 |
| `npm run tailwind`            | Compile `src/styles/globals.css` into `dist/harmonia.css` (one-shot).                                         |
| `npm run tailwind:watch`      | Same as above, in watch mode.                                                                                 |
| `npm run icons:generate`      | Regenerate `src/common/icon-data.js` from the SVGs in `icons/` (also runs on every build).                    |
| `npm run agent-docs:generate` | Regenerate the agent skill in `skills/harmonia/` from `docs/**` (also runs on every build).                   |
| `npm run theming:generate`    | Rebuild the theme-generator fragments and `sections.json` from the doc examples.                              |
| `npm test`                    | Run the test suite once (vitest).                                                                             |
| `npm run test:watch`          | Run the tests in watch mode.                                                                                  |
| `npm run test:coverage`       | Run the tests with a coverage report.                                                                         |
| `npm run lint`                | Lint `src/` and `scripts/` with ESLint.                                                                       |
| `npm run lint:fix`            | Lint and auto-fix.                                                                                            |
| `npm run format`              | Format the repo with Prettier.                                                                                |
| `npm run format:check`        | Check formatting without writing.                                                                             |
| `npm run docs:install`        | Install the docs-site dependencies (run once, before building the docs).                                      |
| `npm run docs:dev`            | Start the VitePress docs site in live-reload mode.                                                            |
| `npm run docs:build`          | Build the static docs site.                                                                                   |
| `npm run docs:preview`        | Preview the built docs site locally.                                                                          |

Run a single test file with `npx vitest run tests/components/accordion.test.js`, or a single test by name with `npx vitest run -t "name substring"`.

## Project structure

```
harmonia/
  src/                  Library source
    components/         One file per component, each default-exports a function (Alpine) that registers x-h-* directives
    common/             Shared non-directive helpers (icons, calendar math, class-list, colors, ...)
    utils/              Cross-cutting utilities (uuid, theme, focus, template, include, breakpoint-listener, ...)
    plugins/            Opt-in plugins (lucide, i18next) that do NOT load by default
    styles/             globals.css (design tokens), harmonia.css (utility-class safelist), component CSS
    index.js            Browser/CDN entry point (auto-registers on alpine:init)
    module.js           ESM entry point (consumers register components manually)
  icons/                The single source of truth for the icon registry
  scripts/              Build and code-generation scripts (build.cjs, generate-icons.cjs, ...)
  tests/                Vitest suite, mirroring the src/ layout
  dist/                 Build output (generated)
  skills/               Agent skill (generated from docs/**)
  docs/                 VitePress documentation site
```

Two source entry points produce four bundles (see [scripts/build.cjs](scripts/build.cjs)): `src/index.js` builds `harmonia.js` / `.min.js` for browsers and CDNs, and `src/module.js` builds `harmonia.esm.js` / `.min.js` for bundlers. A new component must be wired into **both** entry points, or it silently breaks one build target.

Tailwind only scans `src/**`, so a utility class ships in `dist/harmonia.css` only if it appears somewhere under `src/`. For the deep architectural conventions see [AGENTS.md](AGENTS.md). The most intricate component (split) is documented in [SPLIT.md](SPLIT.md).

## Documentation

The documentation is a [VitePress](https://vitepress.dev/) site under `docs/`, with pages grouped by kind: `docs/components/`, `docs/layouts/`, `docs/charts/`, `docs/utilities/` and `docs/plugins/`. Static assets (images, photos, templates, the theme generator) live under `docs/public/`.

Every doc page follows one canonical structure enforced by [tests/docs-structure.test.js](tests/docs-structure.test.js). See the Documentation section of [AGENTS.md](AGENTS.md) for the details.

To run the docs locally:

```sh
# 1. Install the docs dependencies (once)
npm run docs:install

# 2. Build the library so the fresh dist/ is copied into the docs site
npm run build

# 3a. Live development server
npm run docs:dev

# 3b. Or build and preview the static site
npm run docs:build
npm run docs:preview
```

Rebuild the library (`npm run build`) whenever you want the docs site to pick up changes to `dist/`.

## Example apps (templates)

Full, self-contained example apps live under `docs/public/templates/`. They show what Harmonia can do and how to assemble many components into complete, real-world UIs, so they double as end-to-end references:

- **granite-erp** - a multi-page ERP-style admin app (`index.html` + `pages/` + `js/`).
- **onyx-chat** - a multi-page chat app (`index.html` + `pages/` + `js/`).
- **slate** - a single-page dashboard.

They are served by the docs site, so with `npm run docs:dev` running you can open them under the site's `/templates/` path (or open the HTML files directly in a browser).

## Common workflows

### Add a component

1. Create `src/components/<name>.js` that default-exports `function (Alpine) { ... }` registering one or more `Alpine.directive('h-<name>', ...)` directives.
2. Wire it into **both** [src/index.js](src/index.js) (browser/CDN build) and [src/module.js](src/module.js) (ESM build). Forgetting one silently breaks that build target.
3. Add a doc page at `docs/components/<name>.md` following the canonical page structure.
4. Add an info card to the [docs/components.md](docs/components.md) grid: an `<a class="card">` entry with an `<svg-icon class="card-media" src="./images/<name>.svg">`, an `<h3>` title, and a one-line description.
5. Keep the theme generator in sync.

See [AGENTS.md](AGENTS.md) for the full checklist and conventions.

### Add an icon

Drop a new SVG into `icons/` (the file name becomes the icon name), then run:

```sh
npm run icons:generate
```

This regenerates `src/common/icon-data.js` (it also runs automatically on every `npm run build`). Use the icon via the `x-h-icon` directive with `data-icon="<name>"`, or build SVGs in JS with `createSvg` from [src/common/icons.js](src/common/icons.js).

### Add a documentation example

Wrap a single ` ```html ` fence in a `<LiveExample>`. The fence is the single source of truth: VitePress highlights it for display, and `LiveExample` runs that same code live, so the shown code and the running demo can never drift. Alpine shorthands (`@click`, `:attr`, `{{ }}`) work directly inside the fence. Examples render in a shadow DOM and can only use classes present in `src/`. For a one-off need like a fixed height, use an inline `style`.

### Theme-generator fragments are auto-generated

The theme generator (`docs/public/theming/generator.html`) loads one HTML fragment per component. Those fragments and their `sections.json` index are **gitignored build artifacts** rebuilt from the doc examples by:

```sh
npm run theming:generate
```

Never hand-edit or commit them. New doc examples are picked up automatically. To keep a single example out of the theme generator (while keeping it in the docs), set `data-exclude="generator"` on its `<LiveExample>` (use `data-exclude="skill"` to exclude it from the agent skill instead, or `data-exclude="all"` for both).

### Keep prose out of the generated agent skill

The agent skill in `skills/harmonia/` is generated from `docs/**` by [scripts/generate-agent-docs.cjs](scripts/generate-agent-docs.cjs) and must not be hand-edited. To keep a piece of docs prose (for example a photo-attribution note) visible on the docs site but out of the generated skill, wrap it in a `<!-- skill:ignore -->` ... `<!-- /skill:ignore -->` region. The markers are HTML comments (invisible on the rendered site), the generator drops the whole region. It is the prose counterpart of `data-exclude="skill"` on a `<LiveExample>`.

## Testing

Tests use [Vitest](https://vitest.dev/) with the happy-dom environment. Directives are tested **without** a real Alpine runtime, using the helpers in `tests/test-utils.js` (`mountDirective`, `createMockAlpine`, `createMockContext`). Mirror the `src/` layout under `tests/`.

```sh
npm test                                           # run everything once
npx vitest run tests/components/accordion.test.js  # a single file
npx vitest run -t "name substring"                 # a single test by name
npm run test:coverage                              # with coverage
```

## Contributing

Conventions live in [AGENTS.md](AGENTS.md). The split component has its own guide in [SPLIT.md](SPLIT.md). Formatting is enforced by ESLint (flat config) and Prettier, so run `npm run lint` and `npm run format:check` before committing. After editing anything under `src/**`, run `npm run build` so the generated `dist/`, CSS and skill stay in sync.

## License

Harmonia is [MIT licensed](LICENSE).
