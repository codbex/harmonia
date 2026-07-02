import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

// Reuse the generator's fence-aware parsing so this test and the shipped agent
// docs agree on what a doc's structure is. The generator is CommonJS.
const require = createRequire(import.meta.url);
const { outline, parseDoc, SOURCES, DOCS_DIR } = require('../scripts/generate-agent-docs.cjs');

// Collect every documentation page in the canonical doc groups.
const docs = [];
for (const src of SOURCES) {
  const dir = path.join(DOCS_DIR, src.dir);
  if (!fs.existsSync(dir)) continue;
  for (const file of fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .sort()) {
    docs.push({
      id: `${src.dir}/${file}`,
      group: src.dir,
      requireDirectives: src.requireDirectives,
      text: fs.readFileSync(path.join(dir, file), 'utf8'),
    });
  }
}

// Position of the first H2 with this exact text, or -1.
function h2Index(headings, text) {
  return headings.filter((h) => h.level === 2).findIndex((h) => h.text === text);
}

describe('documentation page structure', () => {
  it('found doc pages to check', () => {
    expect(docs.length).toBeGreaterThan(50);
  });

  describe.each(docs)('$id', (doc) => {
    const headings = outline(doc.text);
    const h2 = headings.filter((h) => h.level === 2).map((h) => h.text);
    const parsed = parseDoc(doc.text);

    it('has exactly one H1 title', () => {
      expect(headings.filter((h) => h.level === 1).length).toBe(1);
    });

    it('has a description paragraph under the title', () => {
      expect(parsed.description, 'add a one-paragraph description after the H1').not.toBe('');
    });

    it('has the required outer sections: Usage, API Reference, Examples', () => {
      expect(h2, 'missing "## Usage"').toContain('Usage');
      expect(h2, 'missing "## API Reference"').toContain('API Reference');
      expect(h2, 'missing "## Examples"').toContain('Examples');
    });

    it('orders Usage before API Reference before Examples', () => {
      const usage = h2Index(headings, 'Usage');
      const api = h2Index(headings, 'API Reference');
      const examples = h2Index(headings, 'Examples');
      expect(usage, 'Usage must come before API Reference').toBeLessThan(api);
      expect(api, 'API Reference must come before Examples').toBeLessThan(examples);
    });

    it('places Keyboard Handling and Accessibility between Usage and API Reference', () => {
      const usage = h2Index(headings, 'Usage');
      const api = h2Index(headings, 'API Reference');
      for (const optional of ['Keyboard Handling', 'Accessibility']) {
        const idx = h2Index(headings, optional);
        if (idx === -1) continue;
        expect(idx, `${optional} must come after Usage`).toBeGreaterThan(usage);
        expect(idx, `${optional} must come before API Reference`).toBeLessThan(api);
      }
    });

    it('uses canonical section names (no "Config", "Component attribute", or "Exampes")', () => {
      const texts = headings.map((h) => h.text);
      expect(texts, 'use "Configuration", not "Config"').not.toContain('Config');
      expect(texts, 'use "Component attribute(s)", not the singular').not.toContain('Component attribute');
      expect(texts, 'typo: use "Examples"').not.toContain('Exampes');
    });

    it('orders Attributes before Modifiers when both are present', () => {
      const attributes = headings.findIndex((h) => h.level === 3 && h.text === 'Attributes');
      const modifiers = headings.findIndex((h) => h.level === 3 && h.text === 'Modifiers');
      if (attributes !== -1 && modifiers !== -1) {
        expect(attributes, 'Attributes must come before Modifiers').toBeLessThan(modifiers);
      }
    });

    if (doc.requireDirectives) {
      it('documents its directives in a "Component attribute(s)" block', () => {
        expect(parsed.directives.length, 'add a "### Component attribute(s)" block listing the x-h-* directives').toBeGreaterThan(0);
      });
    }
  });
});
