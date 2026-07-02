import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The generator is CommonJS (like the other scripts/*.cjs); pull it in via require.
const require = createRequire(import.meta.url);
const { transform, readInputs, OUT_DIR, REF_DIR } = require('../scripts/generate-agent-docs.cjs');

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
