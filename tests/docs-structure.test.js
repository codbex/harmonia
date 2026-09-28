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

// Directives that set no data-slot of their own, so a page documenting only
// these needs no "Data Slots" table.
const NO_DATA_SLOT = new Set([
  // Add-ons: they sit on an element another component owns, which keeps that
  // component's slot.
  'x-h-backdrop-item',
  'x-h-button-group-radio',
  'x-h-file-upload',
  'x-h-menu-trigger',
  'x-h-slot-picker-calendar',
  'x-h-slot-picker-next',
  'x-h-slot-picker-previous',
  'x-h-slot-picker-today',
  'x-h-table-group',
  'x-h-tooltip-trigger',
  // Behaviour utilities.
  'x-h-date-format',
  'x-h-focus',
  'x-h-include',
  'x-h-responsive',
  'x-h-template',
  'x-h-translate',
]);

// The H3 headings inside "## API Reference", in order.
function apiSubsections(headings) {
  const start = headings.findIndex((h) => h.level === 2 && h.text === 'API Reference');
  if (start === -1) return [];
  const end = headings.findIndex((h, i) => i > start && h.level <= 2);
  return headings.slice(start + 1, end === -1 ? undefined : end).filter((h) => h.level === 3);
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

    it('places Behavior, Keyboard Handling and Accessibility between Usage and API Reference', () => {
      const usage = h2Index(headings, 'Usage');
      const api = h2Index(headings, 'API Reference');
      for (const optional of ['Behavior', 'Keyboard Handling', 'Accessibility']) {
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

    if (parsed.directives.some((d) => !NO_DATA_SLOT.has(d))) {
      it('lists its data-slot values in a "Data Slots" section, last in API Reference', () => {
        const subsections = apiSubsections(headings).map((h) => h.text);
        expect(subsections, 'add a "### Data Slots" table under "## API Reference"').toContain('Data Slots');
        expect(subsections.at(-1), '"### Data Slots" must be the last section of "## API Reference"').toBe('Data Slots');
      });
    }
  });
});
