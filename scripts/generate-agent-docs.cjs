// Generates the agent-facing skill (skills/harmonia/) from the VitePress docs
// and the utility-class safelist.
//
// The docs/ tree is the source of truth for components: this script transcribes
// each directive-bearing doc into an agent-optimized reference file, builds the
// SKILL.md router (with a generated component index) and an llms.txt index.
// It strips VitePress-only markup (<ClientOnly>, <component-container>,
// frontmatter) and keeps the ```html example blocks, which are already written
// in the exact syntax a consumer types.
//
// The utility-class reference (references/utility-classes.md) is generated from
// src/styles/harmonia.css - the authoritative Tailwind safelist - so agents get
// the exact set of available classes rather than assuming all of Tailwind.
//
// Run with `npm run agent-docs:generate`; it also runs automatically on build.
// The pure transform() is exported so tests/agent-docs.test.js can assert the
// committed output is not stale without touching the filesystem.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const OUT_DIR = path.join(ROOT, 'skills', 'harmonia');
const REF_DIR = path.join(OUT_DIR, 'references');

// The authoritative safelist of available utility classes. Only what this file
// compiles into harmonia.css exists at runtime, so the utility-class reference
// is generated from it (not the docs, which can drift, nor dist/harmonia.css,
// which also contains undocumented internal classes).
const HARMONIA_CSS = path.join(ROOT, 'src', 'styles', 'harmonia.css');
const UTILITY_LABEL = 'Utility classes';

// Doc subdirectories to transcribe, in index order. `requireDirectives` marks
// the directive-bearing groups where a missing directive block signals drift.
const SOURCES = [
  { dir: 'components', label: 'Components', requireDirectives: true },
  { dir: 'charts', label: 'Charts', requireDirectives: true },
  { dir: 'layouts', label: 'Layouts', requireDirectives: true },
  { dir: 'utilities', label: 'Utilities', requireDirectives: false },
  { dir: 'plugins', label: 'Plugins', requireDirectives: false },
];

// ---------------------------------------------------------------------------
// Markdown parsing helpers (fence-aware, section-driven; never line-count based)
// ---------------------------------------------------------------------------

function computeFenceMask(lines) {
  const mask = new Array(lines.length).fill(false);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*```/.test(lines[i])) {
      mask[i] = true; // the fence toggle line itself is not a heading
      inFence = !inFence;
      continue;
    }
    mask[i] = inFence;
  }
  return mask;
}

function headingAt(lines, mask, i) {
  if (mask[i]) return null;
  const m = /^(#{1,6})\s+(.*)$/.exec(lines[i]);
  return m ? { level: m[1].length, text: m[2].trim() } : null;
}

// End index (exclusive) of the section opened by the heading at startIdx:
// the next heading whose level is <= the start heading's level.
function sectionEnd(lines, mask, startIdx) {
  const start = headingAt(lines, mask, startIdx);
  for (let i = startIdx + 1; i < lines.length; i++) {
    const h = headingAt(lines, mask, i);
    if (h && h.level <= start.level) return i;
  }
  return lines.length;
}

function findHeading(lines, mask, { level, match, from = 0, to = lines.length }) {
  for (let i = from; i < to; i++) {
    const h = headingAt(lines, mask, i);
    if (!h) continue;
    if (level && h.level !== level) continue;
    if (match && !match.test(h.text)) continue;
    return i;
  }
  return -1;
}

// Converts VitePress-internal markdown links to plain text: `[Menu](/components/menu)`
// and `[range mode](#anchor)` become broken pointers in a standalone reference,
// so keep the label and drop the target. Real http(s) links are left intact.
function stripInternalLinks(md) {
  return md.replace(/\[([^\]]+)\]\((\/|\.\/|\.\.\/|#)[^)]*\)/g, '$1');
}

function extractTitleAndDescription(lines, mask) {
  const ti = findHeading(lines, mask, { level: 1 });
  const title = ti >= 0 ? headingAt(lines, mask, ti).text : null;
  let i = ti + 1;
  while (i < lines.length && lines[i].trim() === '') i++;
  const buf = [];
  while (i < lines.length && lines[i].trim() !== '' && !headingAt(lines, mask, i)) {
    buf.push(lines[i].trim());
    i++;
  }
  return { title, description: stripInternalLinks(buf.join(' ').trim()) };
}

function extractDirectives(lines, headingIdx) {
  let i = headingIdx + 1;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i >= lines.length || !/^\s*```/.test(lines[i])) return [];
  i++;
  const out = [];
  while (i < lines.length && !/^\s*```/.test(lines[i])) {
    const t = lines[i].trim();
    if (t) out.push(t);
    i++;
  }
  return out;
}

// Returns { directives, apiDetails } from every "API Reference" section, at any
// heading level (a few docs, e.g. calendar, nest one per variant). Directives
// are unioned across all "Component attribute(s)" blocks; apiDetails is those
// sections verbatim MINUS the directive blocks (which we render separately).
function extractApi(lines, mask) {
  const directives = [];
  const parts = [];

  for (let i = 0; i < lines.length; i++) {
    const h = headingAt(lines, mask, i);
    if (!h || !/component attribute/i.test(h.text)) continue;
    for (const d of extractDirectives(lines, i)) {
      if (!directives.includes(d)) directives.push(d);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const h = headingAt(lines, mask, i);
    if (!h || !/api reference/i.test(h.text)) continue;
    const end = sectionEnd(lines, mask, i);
    const excludes = [];
    for (let j = i + 1; j < end; j++) {
      const hh = headingAt(lines, mask, j);
      if (hh && /component attribute/i.test(hh.text)) excludes.push([j, sectionEnd(lines, mask, j)]);
    }
    const detail = [];
    for (let j = i + 1; j < end; j++) {
      if (excludes.some(([s, e]) => j >= s && j < e)) continue;
      detail.push(lines[j]);
    }
    const trimmed = detail.join('\n').trim();
    if (trimmed) parts.push(trimmed);
    i = end - 1;
  }

  return { directives, apiDetails: stripInternalLinks(parts.join('\n\n')) };
}

// Collects every ```html block in the doc (fence-aware), each tagged with the
// nearest preceding heading. Docs title their example sections inconsistently
// ("Examples", "Button Variants", "Tree examples"), so we scan the whole doc
// rather than a single named section. Attribute tables live in ``` / ```js
// blocks, so only ```html is picked up.
function extractExampleBlocks(lines, mask) {
  const blocks = [];
  let lastHeading = null;
  let i = 0;
  while (i < lines.length) {
    const h = headingAt(lines, mask, i);
    if (h) lastHeading = h.text;
    if (/^\s*```html\s*$/.test(lines[i])) {
      i++;
      const buf = [];
      while (i < lines.length && !/^\s*```/.test(lines[i])) {
        buf.push(lines[i]);
        i++;
      }
      blocks.push({ code: buf.join('\n').replace(/\s+$/, ''), name: lastHeading });
    }
    i++;
  }
  return blocks;
}

// The most useful minimal example: prefer script-free blocks, then the shortest.
function pickMinimalExample(blocks) {
  if (!blocks.length) return null;
  const scriptFree = blocks.filter((b) => !/<script/i.test(b.code));
  const pool = scriptFree.length ? scriptFree : blocks;
  return pool.slice().sort((a, b) => a.code.split('\n').length - b.code.split('\n').length)[0];
}

function parseDoc(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const mask = computeFenceMask(lines);
  const { title, description } = extractTitleAndDescription(lines, mask);
  const { directives, apiDetails } = extractApi(lines, mask);
  const blocks = extractExampleBlocks(lines, mask);
  const example = pickMinimalExample(blocks);
  const otherNames = [];
  for (const b of blocks) {
    if (b === example) continue;
    if (b.name && !otherNames.includes(b.name)) otherNames.push(b.name);
  }
  const hasModel = blocks.some((b) => /x-model/.test(b.code));
  return {
    title,
    description,
    directives,
    apiDetails,
    example: example ? example.code : null,
    exampleNames: otherNames,
    hasModel,
  };
}

// Fence-aware heading outline of a doc: [{ level, text }] in document order.
// Exported for tests/docs-structure.test.js so it shares this file's parsing.
function outline(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const mask = computeFenceMask(lines);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const h = headingAt(lines, mask, i);
    if (h) out.push(h);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------

function firstSentence(text) {
  if (!text) return '';
  const m = /^(.*?[.!?])(\s|$)/.exec(text);
  return (m ? m[1] : text).trim();
}

function renderReference(doc) {
  const out = [];
  out.push(`# ${doc.title}`);
  out.push('');
  if (doc.description) {
    out.push(doc.description);
    out.push('');
  }
  out.push('Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.');
  out.push('');

  if (doc.directives.length === 1) {
    out.push('## Directive');
    out.push('');
    out.push(`- \`${doc.directives[0]}\``);
    out.push('');
  } else if (doc.directives.length > 1) {
    out.push('## Directives');
    out.push('');
    out.push(`\`${doc.directives[0]}\` is the root. The directives compose one component and must be nested as shown in the Example below (the library throws at runtime when a required ancestor is missing):`);
    out.push('');
    for (const d of doc.directives) out.push(`- \`${d}\``);
    out.push('');
  }

  if (doc.apiDetails) {
    out.push('## API');
    out.push('');
    out.push(doc.apiDetails);
    out.push('');
  }

  if (doc.hasModel) {
    out.push('## Binding');
    out.push('');
    out.push('Binds through Alpine `x-model`. See the Example for the expected value shape.');
    out.push('');
  }

  if (doc.example) {
    out.push('## Example');
    out.push('');
    out.push('```html');
    out.push(doc.example);
    out.push('```');
    out.push('');
    if (doc.exampleNames.length) {
      out.push(`More examples in the docs site: ${doc.exampleNames.join(', ')}.`);
      out.push('');
    }
  }

  out.push('## Notes');
  out.push('');
  out.push('- Directive values are Alpine expressions, so quote string literals: `x-h-...="\'Label\'"`.');
  out.push('- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.');
  out.push('');

  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

const SKILL_FRONTMATTER = `---
name: harmonia
description: How to build UIs with the Harmonia Alpine.js component library (@codbex/harmonia). Use when adding, wiring, or styling Harmonia UI components (x-h-* directives such as buttons, dialogs, selects, tables, date pickers) in a project that depends on @codbex/harmonia.
---`;

function renderSkill(index) {
  const out = [];
  out.push(SKILL_FRONTMATTER);
  out.push('');
  out.push('<!-- AUTO-GENERATED by scripts/generate-agent-docs.cjs from docs/. Edit that script (or the source docs), then run `npm run build`. -->');
  out.push('');
  out.push('# Harmonia');
  out.push('');
  out.push(
    'Harmonia is a UI component library for [Alpine.js](https://alpinejs.dev/), built with Tailwind CSS. Components are Alpine directives: you add `x-h-*` attributes to plain HTML elements and the library upgrades them. There is no JSX and no component-tag syntax.'
  );
  out.push('');
  out.push('## How to use this skill');
  out.push('');
  out.push(
    'Find the component in the index below and open its file under `references/`. Each reference lists the directive set, its attributes, whether it binds with `x-model`, and a minimal working example you can adapt. Load only the reference(s) you need.'
  );
  out.push('');
  out.push('## Setup');
  out.push('');
  out.push('Harmonia requires Alpine.js as a peer dependency and ships a CSS file that must be linked.');
  out.push('');
  out.push('### Script tag (auto-registers on `alpine:init`)');
  out.push('');
  out.push('```html');
  out.push('<script src="/path/to/node_modules/@codbex/harmonia/dist/harmonia.min.js"></script>');
  out.push('<link href="/path/to/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />');
  out.push('<script defer src="/path/to/node_modules/alpinejs/dist/cdn.min.js"></script>');
  out.push('```');
  out.push('');
  out.push('### ES module (register manually)');
  out.push('');
  out.push('```js');
  out.push("import Alpine from 'alpinejs';");
  out.push("import registerComponents from '@codbex/harmonia';");
  out.push('');
  out.push('registerComponents(Alpine.plugin); // register every component');
  out.push('Alpine.start();');
  out.push('```');
  out.push('');
  out.push("Import the CSS (`@codbex/harmonia/dist/harmonia.css`) too. For selective registration, import named exports (`import { Button, Card } from '@codbex/harmonia'`) and call `Alpine.plugin(Button)` per component.");
  out.push('');
  out.push('## Conventions that apply to every component');
  out.push('');
  out.push('- **Directive prefix.** Alpine directives registered as `h-<name>` are written as `x-h-<name>` in HTML (for example `x-h-button`, `x-h-date-picker`).');
  out.push(
    '- **Values are Alpine expressions.** A string literal must be quoted inside the attribute value: `x-h-accordion-trigger="\'Section title\'"`, not `x-h-accordion-trigger="Section title"`. A bare word is read as a variable reference.'
  );
  out.push(
    '- **Compound components nest.** Many components are a set of directives (root plus children). They must be nested as the reference example shows; the library throws a descriptive error at runtime if a required ancestor is missing.'
  );
  out.push('- **Modifiers are dot suffixes.** For example `x-h-accordion.single`, `x-h-accordion-item.default`.');
  out.push(
    '- **Styling is attribute-driven.** Common attributes are `data-size` (for example `sm` / `md`), `data-variant` (for example `primary` / `negative`), and `data-align` for popovers/menus. See each reference for the exact values.'
  );
  out.push(
    '- **Utility classes are a curated subset, NOT all of Tailwind.** Only the classes compiled into `harmonia.css` exist; an arbitrary Tailwind class that is not shipped (for example `h-80`, `gap-20`, `bg-red-450`) silently does nothing. Before using any utility class, confirm it is in the [Utility classes](references/utility-classes.md) reference, and for a one-off value with no matching class use an inline `style`.'
  );
  out.push('- **Form controls use `x-model`.** Inputs, selects, checkboxes, radios, ranges, switches, and the date/time pickers bind their value with Alpine `x-model`.');
  out.push('- **Light and dark modes** are handled automatically.');
  out.push('- **Accessibility.** Components set sensible ARIA roles and a default `aria-label` only when the author has not set one; provide your own labels where the content is not self-describing.');
  out.push('');
  out.push('## Component index');
  out.push('');
  out.push(index.trim());
  out.push('');
  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

function renderIndex(groups) {
  const out = [];
  for (const group of groups) {
    if (!group.entries.length) continue;
    out.push(`### ${group.label}`);
    out.push('');
    out.push('| Name | Description | Reference |');
    out.push('| ---- | ----------- | --------- |');
    for (const e of group.entries) {
      out.push(`| ${e.title} | ${e.summary} | [${e.slug}](${e.href}) |`);
    }
    out.push('');
  }
  return out.join('\n');
}

function renderLlms(groups) {
  const out = [];
  out.push('# Harmonia');
  out.push('');
  out.push('> A UI component library for Alpine.js (@codbex/harmonia). Components are `x-h-*` directives added to plain HTML. Full usage per component is in the linked reference files; start from SKILL.md.');
  out.push('');
  for (const group of groups) {
    if (!group.entries.length) continue;
    out.push(`## ${group.label}`);
    out.push('');
    for (const e of group.entries) {
      out.push(`- [${e.title}](${e.href}): ${e.summary}`);
    }
    out.push('');
  }
  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

// ---------------------------------------------------------------------------
// Utility-class allowlist, parsed from src/styles/harmonia.css
// ---------------------------------------------------------------------------

// Split a brace group's inner text on top-level commas, ignoring commas inside
// an arbitrary-value bracket (e.g. `[opacity,scale]` stays one option).
function splitOptions(inner) {
  const out = [];
  let cur = '';
  let depth = 0;
  for (const ch of inner) {
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

// Expand a brace group's options, turning numeric ranges like `0..12` into each
// number and leaving everything else literal.
function expandRange(options) {
  const out = [];
  for (const o of options) {
    const range = /^(\d+)\.\.(\d+)$/.exec(o);
    if (range) {
      for (let n = Number(range[1]); n <= Number(range[2]); n++) out.push(String(n));
    } else {
      out.push(o);
    }
  }
  return out;
}

// Expand a Tailwind `@source inline(...)` pattern into `{ prefixSet, baseClasses,
// important }`. A pure variant-prefix group (every non-empty option ends with `:`,
// e.g. `{sm:,md:,lg:,xl:}` or `{max-sm:,...}`) is pulled OUT as `prefixSet` rather
// than folded into the class strings, and the `{!,}` important group collapses to
// the base class while flagging `important`. The remaining groups form the
// `baseClasses` those modifiers apply to, so callers can report exactly which
// classes are responsive-enabled or `!`-enabled instead of losing that association.
function expandPattern(pattern) {
  const groups = [];
  let prefixSet = null;
  let important = false;
  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === '{') {
      let j = i + 1;
      let inner = '';
      while (j < pattern.length && pattern[j] !== '}') {
        inner += pattern[j];
        j++;
      }
      const options = splitOptions(inner);
      const nonEmpty = options.filter((o) => o !== '');
      if (nonEmpty.length && nonEmpty.every((o) => o.endsWith(':'))) {
        prefixSet = nonEmpty;
        groups.push(['']);
      } else if (options.length === 2 && options.includes('!') && options.includes('')) {
        important = true;
        groups.push(['']);
      } else {
        groups.push(expandRange(options));
      }
      i = j + 1;
    } else {
      let lit = '';
      while (i < pattern.length && pattern[i] !== '{') {
        lit += pattern[i];
        i++;
      }
      groups.push([lit]);
    }
  }
  let baseClasses = [''];
  for (const opts of groups) {
    const next = [];
    for (const prefix of baseClasses) for (const o of opts) next.push(prefix + o);
    baseClasses = next;
  }
  return { prefixSet, baseClasses, important };
}

// Parse harmonia.css into the available class names: `tailwind` (from
// `@source inline`), `custom` (Harmonia-only, from `@utility` and `.class`
// rules), and `prefixGroups` (each variant-prefix family mapped to the exact set
// of classes it may be applied to, so the reference can say which classes are
// responsive-enabled rather than leaving it vague).
function parseUtilityCss(cssText) {
  const tailwind = new Set();
  const custom = new Set();
  const prefixGroups = new Map(); // key: prefixes joined -> { prefixes: string[], classes: Set }
  const important = new Set(); // classes that accept a trailing `!`

  let m;
  const sourceRe = /@source\s+inline\(\s*"([^"]*)"\s*\)/g;
  while ((m = sourceRe.exec(cssText))) {
    const { prefixSet, baseClasses, important: isImportant } = expandPattern(m[1]);
    for (const cls of baseClasses) if (cls) tailwind.add(cls);
    if (prefixSet) {
      const key = prefixSet.join(' ');
      if (!prefixGroups.has(key)) prefixGroups.set(key, { prefixes: prefixSet, classes: new Set() });
      const group = prefixGroups.get(key);
      for (const cls of baseClasses) if (cls) group.classes.add(cls);
    }
    if (isImportant) for (const cls of baseClasses) if (cls) important.add(cls);
  }

  const utilRe = /@utility\s+([A-Za-z0-9_-]+)/g;
  while ((m = utilRe.exec(cssText))) custom.add(m[1]);

  for (const line of cssText.split('\n')) {
    const trimmed = line.trim();
    const mm = /^\.([A-Za-z0-9_-]+)/.exec(trimmed);
    if (mm) custom.add(mm[1]);
    // A `.class\!` rule (e.g. `.leading-tight\!`) declares an important variant.
    const im = /^\.([A-Za-z0-9_-]+)\\!/.exec(trimmed);
    if (im) important.add(im[1]);
  }

  for (const c of custom) tailwind.delete(c);
  return { tailwind, custom, prefixGroups, important };
}

function renderUtilityClasses(cssText) {
  const { tailwind, custom, prefixGroups, important } = parseUtilityCss(cssText);
  const out = [];
  out.push('# Utility classes');
  out.push('');
  out.push(
    'Harmonia ships a curated subset of Tailwind utility classes. **Only the classes listed on this page are compiled into `harmonia.css` and exist at runtime.** A Tailwind class that is not listed here - for example `h-80`, `gap-20`, or `bg-red-450` - is NOT available and does nothing. When you need a value that has no matching class, use an inline `style` instead of guessing a class name.'
  );
  out.push('');
  out.push('This list is generated from `src/styles/harmonia.css` (the Tailwind safelist), so it is exhaustive and authoritative.');
  out.push('');
  out.push('## Modifiers');
  out.push('');
  out.push('- **Negative:** the negated forms that ship are listed explicitly in the sections below with the `-` already shown (for example `-translate-x-4`). No other class accepts a leading `-`.');
  out.push('');
  out.push('### Important (`!`)');
  out.push('');
  out.push('Append `!` to raise the specificity so the class wins (for example `w-full!`, `p-4!`). The `!` suffix is available on exactly these classes and no others:');
  out.push('');
  out.push('```');
  out.push([...important].sort().join(' '));
  out.push('```');
  out.push('');
  out.push('### Responsive prefixes');
  out.push('');
  out.push(
    'A breakpoint prefix works ONLY on the classes listed under it - prefixing any other class does nothing. Write it before the class (for example `md:grid-cols-3`, `lg:w-1/2`, `max-md:rounded-none`). Responsive variants are available for exactly these classes and no others.'
  );
  out.push('');
  // Min-width families (sm:/md:/...) before max-width families (max-sm:/...).
  const groups = [...prefixGroups.values()].sort((a, b) => {
    const am = a.prefixes[0].startsWith('max-') ? 1 : 0;
    const bm = b.prefixes[0].startsWith('max-') ? 1 : 0;
    return am - bm || a.prefixes[0].localeCompare(b.prefixes[0]);
  });
  for (const group of groups) {
    const label = group.prefixes.map((p) => `\`${p}\``).join(' ');
    const kind = group.prefixes[0].startsWith('max-') ? 'apply up to that breakpoint (max-width)' : 'apply at that breakpoint and up (min-width)';
    out.push(`${label} ${kind}:`);
    out.push('');
    out.push('```');
    out.push([...group.classes].sort().join(' '));
    out.push('```');
    out.push('');
  }
  out.push('## Harmonia-specific utilities');
  out.push('');
  out.push('Unique to Harmonia (not Tailwind):');
  out.push('');
  out.push('```');
  out.push([...custom].sort().join(' '));
  out.push('```');
  out.push('');
  out.push('## Tailwind utility subset');
  out.push('');
  out.push('```');
  out.push([...tailwind].sort().join(' '));
  out.push('```');
  out.push('');
  return (
    out
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trimEnd() + '\n'
  );
}

// ---------------------------------------------------------------------------
// Pure transform: inputs -> { files, warnings }
// inputs: [{ category, label, requireDirectives, slug, text }]
// ---------------------------------------------------------------------------

function transform(inputs) {
  const files = {};
  const warnings = [];
  const seen = new Map();
  const groupsByLabel = new Map();

  const componentInputs = inputs.filter((i) => i.category !== 'utility-css');
  const ordered = [...componentInputs].sort((a, b) => (a.category === b.category ? a.slug.localeCompare(b.slug) : 0));

  for (const input of ordered) {
    const doc = parseDoc(input.text);
    if (!doc.title) {
      throw new Error(`generate-agent-docs: ${input.category}/${input.slug}.md has no H1 title`);
    }
    if (seen.has(input.slug)) {
      throw new Error(`generate-agent-docs: duplicate slug "${input.slug}" (${input.category} vs ${seen.get(input.slug)})`);
    }
    seen.set(input.slug, input.category);

    if (input.requireDirectives && doc.directives.length === 0) {
      warnings.push(`${input.category}/${input.slug}.md is missing a "Component attribute(s)" block (expected directives)`);
    }

    files[`references/${input.slug}.md`] = renderReference(doc);

    if (!groupsByLabel.has(input.label)) groupsByLabel.set(input.label, { label: input.label, entries: [] });
    groupsByLabel.get(input.label).entries.push({
      slug: input.slug,
      title: doc.title,
      summary: firstSentence(doc.description) || doc.title,
      href: `references/${input.slug}.md`,
    });
  }

  // Preserve SOURCES order for the groups.
  const groups = [];
  for (const src of SOURCES) {
    const g = groupsByLabel.get(src.label);
    if (g) groups.push(g);
  }

  // Utility classes: generated from the harmonia.css safelist (see readInputs).
  const utilityCss = inputs.find((i) => i.category === 'utility-css');
  if (utilityCss) {
    files['references/utility-classes.md'] = renderUtilityClasses(utilityCss.text);
    groups.push({
      label: UTILITY_LABEL,
      entries: [
        {
          slug: 'utility-classes',
          title: 'Utility classes',
          summary: 'The complete allowlist of Tailwind utility classes available in harmonia.css (not the full Tailwind set).',
          href: 'references/utility-classes.md',
        },
      ],
    });
  }

  files['SKILL.md'] = renderSkill(renderIndex(groups));
  files['llms.txt'] = renderLlms(groups);

  return { files, warnings };
}

// ---------------------------------------------------------------------------
// I/O wrapper
// ---------------------------------------------------------------------------

function readInputs() {
  const inputs = [];
  for (const src of SOURCES) {
    const dir = path.join(DOCS_DIR, src.dir);
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith('.md'))
      .sort();
    for (const file of files) {
      inputs.push({
        category: src.dir,
        label: src.label,
        requireDirectives: src.requireDirectives,
        slug: file.replace(/\.md$/, ''),
        text: fs.readFileSync(path.join(dir, file), 'utf8'),
      });
    }
  }
  if (fs.existsSync(HARMONIA_CSS)) {
    inputs.push({ category: 'utility-css', slug: 'utility-classes', text: fs.readFileSync(HARMONIA_CSS, 'utf8') });
  }
  return inputs;
}

function main() {
  const inputs = readInputs();
  const { files, warnings } = transform(inputs);

  fs.rmSync(REF_DIR, { recursive: true, force: true });
  fs.mkdirSync(REF_DIR, { recursive: true });

  let refCount = 0;
  for (const [rel, content] of Object.entries(files)) {
    const dest = path.join(OUT_DIR, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, content);
    if (rel.startsWith('references/')) refCount++;
  }

  for (const w of warnings) console.warn(`generate-agent-docs: WARNING - ${w}`);
  console.warn(`generate-agent-docs: wrote ${refCount} references to ${path.relative(ROOT, REF_DIR)}${warnings.length ? ` (${warnings.length} warning(s))` : ''}`);
}

module.exports = { transform, parseDoc, outline, readInputs, SOURCES, OUT_DIR, REF_DIR, DOCS_DIR };

if (require.main === module) main();
