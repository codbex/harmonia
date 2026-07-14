import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The generator is CommonJS (like the other scripts/*.cjs); pull it in via require.
const require = createRequire(import.meta.url);
const { transform, readInputs, OUT_DIR, REF_DIR, DOCS_URL } = require('../scripts/generate-agent-docs.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Regenerate in memory from the source docs and compare to what is committed.
const { files, warnings } = transform(readInputs());

describe('agent docs (skills/harmonia)', () => {
  it('has no source docs missing their directive block', () => {
    // A directive-bearing doc without a "Component attribute(s)" block means the
    // source doc drifted from the template. Fix the doc, do not silence this.
    expect(warnings, warnings.join('\n')).toEqual([]);
  });

  it('is not stale (matches the committed output)', () => {
    for (const [rel, content] of Object.entries(files)) {
      const committed = fs.readFileSync(path.join(OUT_DIR, rel), 'utf8');
      expect(committed, `skills/harmonia/${rel} is stale - run \`npm run agent-docs:generate\``).toBe(content);
    }
  });

  it('has no orphaned reference files (a removed doc left its reference behind)', () => {
    const committed = fs
      .readdirSync(REF_DIR)
      .filter((f) => f.endsWith('.md'))
      .sort();
    const generated = Object.keys(files)
      .filter((rel) => rel.startsWith('references/'))
      .map((rel) => rel.slice('references/'.length))
      .sort();
    expect(committed).toEqual(generated);
  });

  it('does not leak VitePress-only example wrappers into references', () => {
    // <LiveExample> / <IconGallery> / <TemplateShowcase> are docs-site Vue
    // components; they must be stripped from the transcribed sections (they used
    // to leak through API Reference subsections that wrap an example).
    for (const [rel, content] of Object.entries(files)) {
      if (!rel.startsWith('references/')) continue;
      for (const tag of ['LiveExample', 'IconGallery', 'TemplateShowcase']) {
        expect(content, `skills/harmonia/${rel} leaks <${tag}>`).not.toContain(tag);
      }
    }
  });

  it('converts VitePress ::: containers instead of leaking them raw', () => {
    // ::: info/warning blocks are docs-site syntax; convertContainers() must
    // turn them into plain blockquotes (this used to leak into e.g. chip.md).
    for (const [rel, content] of Object.entries(files)) {
      if (!rel.startsWith('references/')) continue;
      for (const line of content.split('\n')) {
        expect(/^\s*:{3,}/.test(line), `skills/harmonia/${rel} leaks a raw ::: container line: "${line}"`).toBe(false);
      }
    }
  });

  it('strips <!-- skill:ignore --> regions (e.g. photo credits) from references', () => {
    // A skill:ignore region is docs-site-only prose; it must never reach a
    // reference (the carousel/bubble photo-attribution notes live in one).
    for (const [rel, content] of Object.entries(files)) {
      if (!rel.startsWith('references/')) continue;
      expect(content, `skills/harmonia/${rel} leaks a skill:ignore note`).not.toContain('via Pixabay');
      expect(content, `skills/harmonia/${rel} leaks a skill:ignore marker`).not.toContain('skill:ignore');
    }
    // The strip is scoped to the note: the examples (and their photos) remain.
    expect(files['references/carousel.md'], 'carousel reference lost its example images').toContain('ignartonosbg-mountains.jpg');
  });

  it('carries the full Examples section into each reference', () => {
    // Every example from the source doc ships in the reference (not just the
    // minimal one), so the old dangling "More examples..." teaser must be gone.
    for (const [rel, content] of Object.entries(files)) {
      expect(content, `skills/harmonia/${rel} still has the dangling docs-site teaser`).not.toContain('More examples in the docs site');
    }
    for (const name of ['### Clearable', '### Multiple', '### With groups']) {
      expect(files['references/select.md'], `select.md reference lost the "${name}" example`).toContain(name);
    }
  });

  it('carries Usage constraints and Keyboard Handling into references', () => {
    // The split layout's nesting rule lives in a ::: info container inside
    // ## Usage; losing either the section or the container drops a constraint
    // whose violation fails silently at runtime.
    expect(files['references/split.md']).toContain('MUST be direct children');
    expect(files['references/select.md']).toContain('## Keyboard Handling');
  });

  it('links every reference to its docs-site page', () => {
    for (const [rel, content] of Object.entries(files)) {
      if (!rel.startsWith('references/') || rel === 'references/utility-classes.md') continue;
      expect(content, `skills/harmonia/${rel} has no docs-site link`).toContain(`Full docs: ${DOCS_URL}/`);
    }
    expect(files['references/select.md']).toContain(`Full docs: ${DOCS_URL}/components/select.html`);
    expect(files['SKILL.md']).toContain(DOCS_URL);
    expect(files['llms.txt']).toContain(DOCS_URL);
  });

  it('generates a reference for every component', () => {
    // chart.js is documented under docs/charts/*, split.js under docs/layouts/split.
    const KNOWN_ELSEWHERE = new Set(['chart', 'split']);
    const components = fs
      .readdirSync(path.join(ROOT, 'src', 'components'))
      .filter((f) => f.endsWith('.js'))
      .map((f) => f.replace(/\.js$/, ''));
    for (const name of components) {
      if (KNOWN_ELSEWHERE.has(name)) continue;
      expect(files[`references/${name}.md`], `${name} component has no agent reference (add docs/components/${name}.md)`).toBeDefined();
    }
  });
});

describe('utility-class allowlist (references/utility-classes.md)', () => {
  const ref = files['references/utility-classes.md'];

  it('is generated from the harmonia.css safelist', () => {
    expect(ref, 'utility-classes reference was not generated').toBeTruthy();
  });

  it('lists real Harmonia utility classes', () => {
    for (const cls of ['w-1/2', 'bg-primary', 'hbox', 'size-8', '-translate-x-4', 'text-sm', 'transition-[opacity,scale]']) {
      expect(ref, `expected "${cls}" in the allowlist`).toContain(cls);
    }
  });

  it('excludes Tailwind classes not shipped in harmonia.css', () => {
    // These are valid Tailwind but never safelisted, so they must not appear -
    // that is exactly the false assumption this reference exists to prevent.
    const tokens = new Set(ref.split(/\s+/));
    for (const cls of ['h-80', 'gap-20', 'bg-red-450', 'w-96', 'text-10xl']) {
      expect(tokens.has(cls), `"${cls}" must NOT be in the allowlist`).toBe(false);
    }
  });
});
