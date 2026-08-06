// @vitest-environment node
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

// The generator is CommonJS (like the other scripts/*.cjs); pull it in via require.
const require = createRequire(import.meta.url);
const { transform, flatten, collectShippedClasses, ENTRY } = require('../scripts/generate-extend-css.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const harmoniaCss = fs.readFileSync(path.join(ROOT, 'src', 'styles', 'harmonia.css'), 'utf8');

// Regenerate in memory from the stylesheets; the artifact itself only exists
// after `npm run build:prod`, so nothing here reads dist/.
const source = flatten(ENTRY);
const shipped = await collectShippedClasses(source);
const entry = transform(source, shipped);

const count = (text, needle) => text.split(needle).length - 1;

// Compile the generated entry the way a consuming project does: the extra CSS
// stands in for the consumer's own stylesheet, `candidates` for the classes
// their markup uses.
async function compileEntry(candidates, extra = '') {
  const { compile } = await import('tailwindcss');
  const compiler = await compile(`${entry}\n${extra}`, {
    base: path.join(ROOT, 'dist'),
    loadStylesheet: async (id) => {
      const file = require.resolve(id);
      return { path: file, base: path.dirname(file), content: fs.readFileSync(file, 'utf8') };
    },
  });
  return { css: compiler.build(candidates), root: compiler.root, sources: compiler.sources };
}

describe('extend entry (dist/harmonia-extend.css)', () => {
  it('blocklists every safelist pattern, verbatim', () => {
    // Mirroring the patterns rather than expanding them keeps Tailwind's own
    // expander as the single authority on what the safelist covers.
    const safelisted = [...harmoniaCss.matchAll(/@source\s+inline\(\s*"([\s\S]*?)"\s*\)/g)].map((m) => m[1]);
    expect(safelisted.length).toBeGreaterThan(100);
    for (const pattern of safelisted) expect(entry).toContain(`@source not inline("${pattern}");`);
  });

  it('blocklists the classes the components use beyond the safelist', () => {
    // harmonia.css is safelist + whatever its build scans out of src/, so the
    // scanned half has to be excluded too or a consumer scanning their own
    // project would regenerate it.
    expect(shipped.length).toBeGreaterThan(1000);
    for (const cls of ['hbox', 'vbox', 'container', 'grow', 'rounded', 'leading-tight', 'shadow-button', 'bg-popover', 'border-input', 'p-1.5', 'size-3.5', 'transition-[color,box-shadow]']) {
      expect(shipped, `expected ${cls} to be blocklisted`).toContain(cls);
    }
    // Scanner noise must NOT be blocklisted: a consumer may define these names.
    for (const noise of ['com', 'dark', 'const', 'element', 'true']) {
      expect(shipped, `expected ${noise} not to be blocklisted`).not.toContain(noise);
    }
    // A `{`/`}` would be read as a brace pattern, so those never make the list.
    expect(shipped.filter((c) => /[{}]/.test(c))).toEqual([]);
    expect(shipped).toEqual([...shipped].sort()); // stable output across runs
  });

  it('carries the theme and the dark variant', () => {
    expect(entry).toContain('@import "tailwindcss/theme.css" layer(theme);');
    expect(entry).toContain('@import "tailwindcss/utilities.css" layer(utilities) source(none);');
    expect(entry).toContain('@custom-variant dark (&:where(.dark, .dark *));');
    // `inline` values are substituted into the utilities, so nothing has to be
    // emitted for them; a plain `@theme` block is copied as-is because its
    // utilities read `var(--key)`.
    expect(entry).toContain('@theme inline reference {');
    expect(entry).toMatch(/^@theme \{$/m);
    expect(entry).toContain('--color-primary: var(--primary);');
    expect(entry).toContain('--text-2xs: 0.625rem;');
  });

  it("imports Tailwind's theme before any Harmonia @theme block", () => {
    // Tailwind emits one consolidated `:root` rule where it finds the first
    // `@theme`; this ordering keeps that rule inside `@layer theme`.
    expect(entry.indexOf('@import "tailwindcss/theme.css"')).toBeLessThan(entry.indexOf('@theme inline reference {'));
  });

  it('drops the token values, so nothing shadows a Harmonia or Tailwind value', () => {
    // Copying `:root` into a @theme would shadow Tailwind's own inlined
    // --radius/--shadow/--blur, changing classes harmonia.css already ships.
    for (const dropped of ['--primary: oklch(', '--leading-tight: 1.2', '--radius: 0.625rem', '--spacing: 0.25rem']) {
      expect(entry, `expected the entry not to contain ${dropped}`).not.toContain(dropped);
    }
  });

  it('drops everything that is not theme or blocklist', () => {
    // Blocklist entries are class names, and those legitimately contain things
    // like `[data-slot=...]`, so check the CSS with the blocklist taken out.
    const rules = entry
      .split('\n')
      .filter((line) => !line.startsWith('@source not inline('))
      .join('\n');
    for (const dropped of ['@import "tailwindcss";', '@import "./harmonia.css"', '@layer base', '@utility ', '.dark {', '.tile-sm', '[data-slot=', '::-webkit-scrollbar']) {
      expect(rules, `expected the entry not to contain ${dropped}`).not.toContain(dropped);
    }
    expect(rules).not.toMatch(/^:root/m);
    // The only `@source` statements are the blocklist; a glob would scan Harmonia's own sources.
    expect(entry).not.toMatch(/^@source (?!not inline\()/m);
  });

  describe('compiled output', () => {
    let css;
    let compiled;
    beforeAll(async () => {
      compiled = await compileEntry(['size-8', 'p-4', 'flex', 'bg-primary', 'text-8xl', 'md:size-6', 'h-80', 'gap-20', 'container', 'grow', 'p-1.5', 'bg-popover', 'md:bg-primary', 'bg-lime-500', 'rounded', 'md:leading-tight', 'dark:h-80']);
      css = compiled.css;
    });

    it('scans nothing on its own', () => {
      // Without source(none) the CLI auto-detects the whole working directory,
      // so an explicit `@source inline(...)` list would silently pick up every
      // other class the project uses. Sources are the importing sheet's to declare.
      expect(compiled.root).toBe('none');
      expect(compiled.sources).toEqual([]);
    });

    it('emits the classes Harmonia does not ship', () => {
      expect(css).toContain('.h-80 {');
      expect(css).toContain('.gap-20 {');
      expect(css).toMatch(/@media \(width >= 48rem\)/);
      expect(css).toContain('.md\\:size-6 {');
    });

    it('emits nothing Harmonia already ships', () => {
      // From the safelist, and from what the components use beyond it.
      for (const already of ['.size-8 {', '.p-4 {', '.flex {', '.bg-primary {', '.text-8xl {', '.container {', '.grow {', '.rounded {', '.p-1\\.5 {', '.bg-popover {']) {
        expect(css, `expected ${already} to be blocklisted`).not.toContain(already);
      }
    });

    it('resolves Harmonia tokens without re-declaring them', () => {
      // `@theme inline` means the utility inlines `var(--primary)` itself, so the
      // value keeps coming from harmonia.css - a custom theme still applies.
      expect(css).toMatch(/\.md\\:bg-primary \{\s*background-color: var\(--primary\);/);
      expect(css).not.toContain('--primary: oklch(');
    });

    it('keeps every emitted theme variable inside @layer theme', () => {
      // Harmonia declares its tokens unlayered, which beats any layer. That is
      // what makes a token Tailwind emits here (e.g. its own --leading-tight:
      // 1.25) lose against harmonia.css's 1.2 at runtime.
      const themeLayer = /@layer theme \{\s*:root, :host \{([\s\S]*?)\n {2}\}\n\}/.exec(css);
      expect(themeLayer).not.toBeNull();
      expect(themeLayer[1]).toContain('--leading-tight: 1.25;');
      // Nothing outside that rule declares a variable, bar Tailwind's own --tw-*.
      expect(css.replace(themeLayer[0], '')).not.toMatch(/^\s*--(?!tw-)/m);
    });

    it("cannot generate variants of Harmonia's own utilities", async () => {
      // The entry does not copy the `@utility` definitions (they `@apply`
      // blocklisted classes, which is a hard error), so `hbox` and friends are
      // unknown here. The responsive forms that are needed ship already.
      const { css: extra } = await compileEntry(['2xl:hbox', '2xl:focus-ring']);
      expect(extra).not.toContain('hbox');
      expect(extra).not.toContain('focus-ring');
    });

    it('emits theme variables Harmonia never uses', () => {
      // --color-lime-500 is pruned from harmonia.css entirely, so the supplement
      // has to carry it or `bg-lime-500` would resolve to nothing.
      expect(css).toContain('--color-lime-500:');
      expect(css).toMatch(/\.bg-lime-500 \{\s*background-color: var\(--color-lime-500\);/);
    });

    it("keeps Harmonia's class-based dark variant", () => {
      expect(css).toContain('.dark\\:h-80:where(.dark, .dark *)');
      expect(css).not.toContain('prefers-color-scheme');
    });

    it('emits no preflight and no component styles', () => {
      expect(css).not.toContain('@layer base');
      expect(css).not.toContain('-moz-tab-size');
      expect(css).not.toContain('data-slot');
    });
  });

  it('fails on a Harmonia class applied in the consumer stylesheet', async () => {
    // A blocklisted class cannot be `@apply`-ed. That is documented, but assert
    // the failure is loud rather than a silently missing declaration.
    await expect(compileEntry([], `.card { @apply p-4; }`)).rejects.toThrow(/p-4/);
  });
});
