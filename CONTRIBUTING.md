# Contributing to Harmonia

Harmonia is a UI component library for [Alpine.js](https://alpinejs.dev/), built with Tailwind CSS v4 and bundled with esbuild.

This guide covers everything you need to report a problem, open a pull request, and write code that fits the rest of the library.

Taking part in the project, whether through an issue, a pull request, or a review, means agreeing to the [Code of Conduct](CODE_OF_CONDUCT.md). Unacceptable behaviour can be reported to support@codbex.com, and reports are handled confidentially.

## Reporting issues

Issues go to the [issue tracker](https://github.com/codbex/harmonia/issues). There are no templates to fill in, so a good report is simply one that lets someone else see what you saw.

Please include:

- **What you expected to happen** and **what actually happened**.
- **A minimal reproduction.** The smallest piece of markup that shows the problem. The live examples on the [documentation site](https://codbex.github.io/harmonia/) are the easiest starting point - copy one, cut it down until only the problem is left, and paste the result.
- **Versions.** The Harmonia version, the Alpine.js version, and whether you are using the browser build or the ESM build.
- **Your browser and operating system.** Especially if the problem looks visual or is about focus, scrolling, or touch.

If something is only wrong in the documentation, say so in the issue. Documentation fixes are welcome as pull requests too.

## Pull requests

Branch off `main` and name the branch after what it does, using a `feat/` or `fix/` prefix:

```
feat/chat-component
fix/select-close-on-select
```

Commit messages should be short and on-point. When a commit closes an issue, reference it:

```
Fixed #115
Added horizontal borders to the table header
Resolved #105 and #106
```

Harmonia does not use Conventional Commits, so there are no `feat:` or `chore:` prefixes in commit subjects. Signing off your commits with `git commit -s` is strongly preferred but nothing will block your pull request if you forget.

Before you open a pull request, run:

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Two notes about the build command:

- It regenerates the `skills/` directory, which **is** committed to the repository, so include those changes in your pull request.
- It writes to `dist/`, which is **not** committed, so you can ignore whatever appears there.

Continuous integration runs the unit suite and the end-to-end suite on every pull request to `main`. The end-to-end suite runs on Chromium, Firefox, and WebKit in CI, while locally it runs on Chromium only.

## Versioning

Harmonia follows [semantic versioning](https://semver.org/) strictly, with no exceptions.

- **MAJOR** (`4.0.0`) always carries breaking changes, usually a set of them across the library. It is the only release that may break existing usage.
- **MINOR** (`3.2.0`) adds components and features. It never breaks existing usage.
- **PATCH** (`3.1.3`) is fixes only. It never breaks existing usage.

So a breaking change forces a major bump. There is no backwards-incompatible change small enough to ride along in a minor. If a change cannot be made backwards compatible, it waits for the next major. [tests/versioning.test.js](tests/versioning.test.js) enforces this against `CHANGELOG.md`.

A breaking change is always recorded in `CHANGELOG.md` with the `- **Breaking: ...**` prefix described under [Changelog](#changelog), and the release intro paragraph says what breaks.

A version containing `alpha`, `beta` or `rc` is published to npm under the `next` tag rather than `latest`, so a prerelease never reaches consumers installing `@codbex/harmonia` by default.

## Support policy

Only the current major is fully supported. The major before it receives guaranteed security fixes, plus bug-fix backports where the change is small enough to be worth carrying across. It stays supported for as long as it remains the previous major, and for at least 12 months after its successor was released. Anything older receives nothing.

Bug fixes land in the current major first, and moving to it is the expected route to a fix. The full policy, including how to report a vulnerability, is in [SECURITY.md](SECURITY.md) and on the [Versioning and Support](https://codbex.github.io/harmonia/versioning-and-support) page.

## Writing components

Every component in Harmonia is an Alpine plugin. One file in `src/components/` default-exports a function that receives `Alpine` and registers one or more directives:

```js
export default function (Alpine) {
  Alpine.directive('h-badge', (el, { expression }, { cleanup }) => {
    // ...
  });
}
```

Consumers then write `x-h-badge` in their markup.

### Register it in both entry points

Harmonia ships two builds, and a new component has to be wired into both:

- `src/index.js` is the browser and CDN build. It calls `Alpine.plugin(...)` and registers everything automatically.
- `src/module.js` is the ESM build. It needs a named `XxxComponent` export **and** a line in `registerComponents`.

Forgetting one of the two silently breaks that build target for everyone using it, so [tests/entry-points.test.js](tests/entry-points.test.js) compares what the two entry points register and `npm test` fails when they disagree.

### Sharing state between a parent and its children

Compound components (an accordion and its items, a select and its options) communicate through a state object that the parent attaches to its own element, named `_h_<component>`:

```js
el._h_accordion = Alpine.reactive({ openItem: null });
```

Children look up the nearest ancestor carrying that object with the shared helper in [src/common/ancestor.js](src/common/ancestor.js):

```js
const state = findAncestorState(Alpine, el, '_h_accordion');
```

Use the helper rather than writing the lookup by hand and throw a clear error when nothing is found, so a misplaced child produces a useful message instead of a confusing crash.

These `_h_*` objects are for internal use only. They are not part of the public API and must never be referenced from markup or documentation.

### Building the DOM

Build elements with `createElement` and set text with `textContent`. Never use `innerHTML` or template strings containing markup, and never accept HTML from a consumer.

For icons, use `createSvg({ icon, classes, attrs })` from [src/common/icons.js](src/common/icons.js) instead of writing SVG markup inline. Other shared helpers live in `src/common/` (calendar maths, class lists, input sizing) and `src/utils/` (`uuid`, theming, breakpoint listeners, focus handling).

### Styling

Styling is driven from JavaScript, not from hand-written CSS. Directives add Tailwind utility classes with `classList.add(...)` and set `data-slot` and `data-size` attributes, which lets children adapt to an ancestor's size through selectors like `[[data-size=sm]_&]:h-8`.

Design tokens (the oklch colour variables for light and dark mode) live in [src/styles/globals.css](src/styles/globals.css). Prefer `bg-<token>` and `text-<token>` utilities over raw CSS variables, and reach for `var(--primary)` only in an inline style where no utility will do.

There are two things that are not immediately obvious:

- **Tailwind only scans `src/`.** A class name that appears solely in documentation, tests, or a comment elsewhere will not exist in the built stylesheet.
- **Dynamically composed class names are invisible to the scanner.** Something like `` `bg-${token}` `` needs a literal safelist entry in a scanned file, or the class is never generated.

Use `rem` rather than `px` everywhere, including inline styles set from JavaScript, unless `rem` isn't an option or pixels are a better fit. When you measure something with `getBoundingClientRect`, convert the result before applying it.

If you add, rename, or remove a CSS variable in `globals.css`, mirror the change in the `colorVars`, `shadowVars`, `fontVars`, or `othersVars` arrays in [docs/public/theming/generator.html](docs/public/theming/generator.html). A variable missing from those arrays falls through to a generic text input in the theme generator, so a colour would lose its colour picker.

### Cleaning up

Every event listener a directive adds must be removed in its `cleanup` callback. No listener may outlive the directive that created it. A directive/component must always clean up after itself.

### Accessibility

Accessibility is a requirement. Components need correct ARIA roles and states, full keyboard operability, and an accessible name. Follow the existing pattern of setting a sensible default `aria-label` only when the author has not already provided one.

When a state can be expressed with an `aria-*` attribute (`aria-pressed`, `aria-expanded`, `aria-selected`, `aria-checked`, `aria-disabled`, and so on), use that attribute and style from it. Do not add a `data-*` attribute for the same state.

Do NOT hardcode user-facing text. A default string such as `'Today'` is fine, as long as a consumer can override it (`el.getAttribute('data-today-label') || 'Today'`).

### Opt-in plugins

Anything that should not load by default belongs in `src/plugins/`. These get their own browser entry point and their own bundle, so CDN users add an extra `<script>` tag to opt in. They may depend on an external global, and they must stay out of `src/index.js` and out of `registerComponents`. See `src/plugins/lucide.js` for the pattern.

### Before you finish

Run `npm run build` after changing anything under `src/`. Without it, the built output, the stylesheet, and the generated skill files all go stale.

The split component is the most complicated piece of the library and it has its own guide in [SPLIT.md](SPLIT.md). Read it before touching the split layout.

## Coding style

Formatting is enforced by ESLint and Prettier, so the fastest way to match the house style is to let the tools do it:

```bash
npm run lint          # check
npm run lint:fix      # check and fix what can be fixed
npm run format        # reformat
npm run format:check  # verify formatting without changing files
```

The settings that come up most often:

- Single quotes, semicolons, two-space indentation, LF line endings.
- A 240-character print width, so lines wrap far later than you may be used to.
- Unused variables are only allowed with a leading underscore (`_unused`).
- `console` is limited to `console.warn` and `console.error`.
- `rem` rather than `px`, as described above.

Avoid reformatting or improving code your change does not need to touch. If you spot an unrelated problem or dead code, create a new issue and handle it in a separate PR.

## Documentation

Documentation lives in `docs/` and is built with [VitePress](https://vitepress.dev/). Every user-facing change should come with a documentation update in the same pull request.

Documentation is written for the people using the component, so describe what it does and how to use it, not how it works internally. Behaviour a user can observe ("adapts to light and dark mode automatically") belongs in the docs. Implementation detail does not.

### Page structure

Every page follows the same structure and [tests/docs-structure.test.js](tests/docs-structure.test.js) will fail if it does not:

```
# Title
One-paragraph description
## Usage
## Keyboard Handling   (optional)
## Accessibility       (optional)
## API Reference
## Examples
```

Under `## API Reference`, sections appear in a fixed order - `### Component attribute(s)`, then optionally `### Attributes`, `### Modifiers`, `### Model`, `### Events`, `### Configuration` and `### CSS Variables`. Example variants are `###` subsections under the single `## Examples` heading.

Run `npx vitest run tests/docs-structure.test.js` after editing documentation.

### Runnable examples

Write every runnable example as a `<LiveExample>` wrapping exactly one ` ```html ` fence:

````markdown
<LiveExample>

```html
<button x-h-button>Click me</button>
```

</LiveExample>
````

The fence is the single source of truth. VitePress highlights it for display, and `LiveExample` reads the same text and runs it live, so the code shown and the demo running can never drift apart.

Examples render inside a shadow DOM and are subject to the same Tailwind scanning rule as everything else, so they can only use classes that already exist in `src/`. For a one-off need such as a fixed height, use an inline `style` attribute.

### Generated files

Two sets of files are generated from the documentation and must never be hand-edited:

- **`skills/`** is the agent-facing transcription of the docs, rebuilt by `npm run agent-docs:generate` (and by `npm run build`). [tests/agent-docs.test.js](tests/agent-docs.test.js) fails when it is stale. To change agent-facing content, edit the source documentation and regenerate.
- **The theme generator fragments** in `docs/public/theming/` are rebuilt by `npm run theming:generate`. They are gitignored build artifacts, produced fresh during deployment. Any component documentation page with live examples is picked up automatically.

### Changelog

Any changes to the library itself, must be recorded in the `CHANGELOG.md` file. Changes to the GitHub workflows, documentation, etc. must not be mentioned there, unless they somehow affect the library itself.

When a change breaks existing usage, record it in `CHANGELOG.md` with this exact bullet prefix:

```markdown
- **Breaking: ...**
```

The migration guide shipped to consumers and coding agents is generated from those bullets, so a breaking change written any other way will not appear in it.

## Tests

Run the unit suite with:

```bash
npm test                 # run once
npm run test:watch       # watch mode
npm run test:coverage    # with coverage
npx vitest run tests/components/accordion.test.js   # a single file
npx vitest run -t "name substring"                  # a single test
```

Unit tests use Vitest with happy-dom, and mirror the layout of `src/` under `tests/`. Directives are tested **without** real Alpine. [tests/test-utils.js](tests/test-utils.js) provides `mountDirective`, `createMockAlpine`, and `createMockContext` (a small reactivity stand-in). Mount your directive with those helpers and assert on the DOM, the attributes, and the state it produces.

### End-to-end tests

End-to-end tests use Playwright and live in `tests/e2e/`:

```bash
node scripts/build.cjs && npm run tailwind   # build first
npm run test:e2e                             # run tests headless
npm run test:e2e:ui                          # interactive UI
```

The build step is required, because the suite exercises the built `dist/` output rather than `src/`. Fixtures are plain HTML files served over http, never opened from disk.

Write an end-to-end test only for what a unit test cannot see - real Alpine initialisation and `x-model` use, real CSS and layout, floating element positioning, focus and tab order, CSS transitions, pointer dragging, and theme switching. Everything else stays as a unit test.

Locally the suite runs on Chromium. CI adds Firefox and WebKit. You can try all three locally with `CI=1 npx playwright test`, but the results are only really dependable inside the CI containers. WebKit in particular usually fails on an up-to-date machine, because Playwright's bundled WebKit build is not compatible with the newer system libraries shipped with most Linux distributions. A WebKit failure on your own machine is therefore not, by itself, evidence of a bug.

## Legal

Harmonia is released under the [MIT License](LICENSE), Copyright 2026 codbex.

By submitting a contribution you agree that your work is released under that same license, and you confirm that you have the right to submit it. That means the code is yours to give - you wrote it, or you have permission from whoever did, and it is not covered by an agreement with an employer or a client that would prevent you contributing it.

If your contribution includes third-party code, it must carry a license compatible with MIT, and you must say where it came from so it can be attributed properly.

## AI coding assistants

Authors are responsible for 100% of the code they submit. Do not send a patch you cannot explain, and do not send one you have not built and tested yourself.

Write your own commit messages and pull request descriptions.

Respond to review comments yourself. If you cannot discuss your own patch with a reviewer, it will not be merged.

Everything in the Legal section applies unchanged. You are the one certifying that the contribution can be released under MIT. A tool cannot certify that for you.

Large machine-generated pull requests that no human has reviewed line by line will be closed.

If you direct a coding agent at this repository, the rules it has to follow are in the [AGENTS.md](AGENTS.md) file. `CLAUDE.md` just links to it.

## Keeping this file in sync

`CONTRIBUTING.md` and [AGENTS.md](AGENTS.md) describe the same conventions for two different audiences. This file for people, `AGENTS.md` for coding agents. They are maintained separately and duplicate each other on purpose, because each is written in the form its reader needs.

That only works if they stay in agreement. **When you change a convention in one file, make the matching change in the other, in the same pull request.** A rule that exists in one file and contradicts the other is a bug.

The exception is instructions that only make sense as constraints on a coding agent. Those stay in `AGENTS.md` alone and have no counterpart here.
