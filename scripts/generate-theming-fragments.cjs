// Generates the theme generator preview fragments (docs/public/theming/fragments/)
// and the section index (docs/public/theming/sections.json) from the VitePress docs.
//
// The docs/ tree is the source of truth for examples: each fragment is the
// concatenation of every <LiveExample> html fence of its source doc page(s),
// so the theming preview can never drift from the documentation. Each example
// is wrapped in a plain <div> carrying the LiveExample's data-class / data-style
// (the same styling the docs demo wrapper gets), and all examples sit in one
// `vbox gap-4` container per fragment.
//
// Sources are discovered automatically: every docs/components/*.md and
// docs/layouts/*.md becomes a fragment named after the file, and every
// docs/charts/*.md becomes chart-<name>. Only the exceptions are configured
// below - COMBINED for fragments that merge several docs (or pull from outside
// those folders), and EXCLUDE for docs that need no fragment. A newly
// documented component is picked up without touching this script.
//
// sections.json carries the generator's section lists ({ previewSections,
// layoutSections, chartSections }), which generator.html fetches at init
// instead of hardcoding them; each list backs its own sidebar group. Labels
// come from each doc's H1 (chart docs lose the trailing " Chart");
// COMBINED entries set theirs explicitly. A `scripts: true` flag is added
// automatically when a fragment contains a <script> from a doc example, so its
// x-h-include gets data-js and executes it.
//
// Run with `npm run theming:generate` (not part of the build). The command also
// formats the generated files with Prettier. The output is gitignored: the
// GitHub Pages workflow (build-github-pages.yaml) generates it before building
// the docs, so locally you only need to run this when you want to use or test
// the theme generator.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const THEMING_DIR = path.join(DOCS_DIR, 'public', 'theming');
const OUT_DIR = path.join(THEMING_DIR, 'fragments');
const SECTIONS_JSON = path.join(THEMING_DIR, 'sections.json');

// Fragments that merge several docs or pull from outside the auto-discovered
// folders. A doc listed here is consumed by its fragment and excluded from
// auto-discovery. Labels are explicit because they describe the combination.
const COMBINED = {
  button: { label: 'Button', sources: ['components/button.md', 'components/button-group.md'] },
  calendar: { label: 'Calendar', sources: ['components/inline-calendar.md', 'components/calendar.md'] },
  'checkbox-radio': { label: 'Checkbox & Radio', sources: ['components/checkbox.md', 'components/radio.md'] },
  'date-time-pickers': {
    label: 'Date & Time Pickers',
    sources: ['components/date-picker.md', 'components/time-picker.md', 'components/datetime-picker.md'],
  },
  inputs: {
    label: 'Inputs & Labels',
    sources: ['components/input.md', 'components/label.md', 'components/input-group.md', 'components/input-number.md', 'components/textarea.md'],
  },
  list: { label: 'List & Listbox', sources: ['components/list.md', 'components/listbox.md'] },
  menus: { label: 'Menus & Dropdowns', sources: ['components/menu.md', 'components/menubar.md', 'components/navigation-menu.md'] },
  shadows: { label: 'Shadows', sources: ['utility-classes/shadow.md'] },
};

// Docs that deliberately have no fragment. Icons are not themable on their own
// and already appear throughout the other fragments.
const EXCLUDE = ['components/icon.md'];

function docTitle(src) {
  const text = fs.readFileSync(path.join(DOCS_DIR, src), 'utf8');
  const m = text.match(/^# (.+)$/m);
  if (!m) throw new Error(`generate-theming-fragments: ${src} has no H1 title`);
  return m[1].trim();
}

function discoverFragments() {
  const consumed = new Set([...Object.values(COMBINED).flatMap((c) => c.sources), ...EXCLUDE]);
  const fragments = {};
  for (const [name, config] of Object.entries(COMBINED)) fragments[name] = { ...config, group: 'preview' };
  for (const dir of ['components', 'layouts']) {
    for (const file of fs.readdirSync(path.join(DOCS_DIR, dir)).sort()) {
      if (!file.endsWith('.md') || consumed.has(`${dir}/${file}`)) continue;
      const src = `${dir}/${file}`;
      fragments[file.replace(/\.md$/, '')] = { label: docTitle(src), sources: [src], group: dir === 'layouts' ? 'layout' : 'preview' };
    }
  }
  for (const file of fs.readdirSync(path.join(DOCS_DIR, 'charts')).sort()) {
    if (!file.endsWith('.md') || consumed.has(`charts/${file}`)) continue;
    const src = `charts/${file}`;
    fragments[`chart-${file.replace(/\.md$/, '')}`] = { label: docTitle(src).replace(/ Chart$/, ''), sources: [src], group: 'chart' };
  }
  return fragments;
}

// Extracts every LiveExample block's html fence with the wrapper attributes.
// An example carrying data-exclude="generator" (or "all", which also excludes
// it from the agent-docs skill) is left out of the fragment.
function extractExamples(mdText, rel) {
  const examples = [];
  const blockRe = /<LiveExample\b([^>]*)>([\s\S]*?)<\/LiveExample>/g;
  let m;
  while ((m = blockRe.exec(mdText)) !== null) {
    const exclude = (m[1].match(/data-exclude="([^"]*)"/) || [])[1] || '';
    if (exclude.split(/\s+/).some((token) => token === 'generator' || token === 'all')) continue;
    const fences = [...m[2].matchAll(/```html\n([\s\S]*?)\n?```/g)];
    if (!fences.length) {
      console.warn(`generate-theming-fragments: ${rel}: LiveExample without an inline html fence skipped`);
      continue;
    }
    if (fences.length > 1) {
      console.warn(`generate-theming-fragments: ${rel}: LiveExample with ${fences.length} fences; only the first is used`);
    }
    const dataClass = (m[1].match(/data-class="([^"]*)"/) || [])[1] || '';
    const dataStyle = (m[1].match(/data-style="([^"]*)"/) || [])[1] || '';
    examples.push({ code: fences[0][1].trimEnd(), dataClass, dataStyle });
  }
  return examples;
}

function buildFragment(name, sources) {
  const parts = [];
  for (const src of sources) {
    const abs = path.join(DOCS_DIR, src);
    if (!fs.existsSync(abs)) throw new Error(`generate-theming-fragments: ${name}: source doc ${src} does not exist`);
    const examples = extractExamples(fs.readFileSync(abs, 'utf8'), src);
    if (!examples.length) throw new Error(`generate-theming-fragments: ${name}: ${src} has no usable LiveExample`);
    for (const ex of examples) {
      const cls = ex.dataClass ? ` class="${ex.dataClass}"` : '';
      const style = ex.dataStyle ? ` style="${ex.dataStyle}"` : '';
      parts.push(`  <div${cls}${style}>\n${ex.code.replace(/^/gm, '    ')}\n  </div>`);
    }
  }
  const header = `<!-- Generated from ${sources.join(', ')} by scripts/generate-theming-fragments.cjs. Do not edit by hand; run \`npm run theming:generate\`. -->`;
  return `${header}\n<div class="vbox gap-4">\n${parts.join('\n\n')}\n</div>\n`;
}

function main() {
  const fragments = discoverFragments();
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const ids = new Map(); // id -> fragments using it
  const previewSections = [];
  const layoutSections = [];
  const chartSections = [];
  const groups = { preview: previewSections, layout: layoutSections, chart: chartSections };
  for (const [name, { label, sources, group }] of Object.entries(fragments)) {
    const html = buildFragment(name, sources);
    fs.writeFileSync(path.join(OUT_DIR, `${name}.html`), html);
    const section = { label, value: name };
    if (html.includes('<script')) section.scripts = true;
    groups[group].push(section);
    for (const idMatch of html.matchAll(/\bid="([^"]+)"/g)) {
      if (!ids.has(idMatch[1])) ids.set(idMatch[1], []);
      ids.get(idMatch[1]).push(name);
    }
  }
  // Alphabetical by label; Shadows (a utility, not a component) stays last.
  previewSections.sort((a, b) => (a.value === 'shadows') - (b.value === 'shadows') || a.label.localeCompare(b.label));
  layoutSections.sort((a, b) => a.label.localeCompare(b.label));
  chartSections.sort((a, b) => a.label.localeCompare(b.label));
  fs.writeFileSync(SECTIONS_JSON, JSON.stringify({ previewSections, layoutSections, chartSections }, null, 2) + '\n');
  // Fragments are untracked build artifacts, so stale files from renamed or
  // removed docs are deleted outright to keep local previews correct.
  for (const file of fs.readdirSync(OUT_DIR)) {
    if (file.endsWith('.html') && !fragments[file.replace(/\.html$/, '')]) {
      fs.unlinkSync(path.join(OUT_DIR, file));
      console.warn(`generate-theming-fragments: deleted stale fragment ${file} (no source doc)`);
    }
  }
  // All fragments are mounted in the generator at once (x-show, not x-if), so an
  // id reused across fragments is a real duplicate on that page.
  for (const [id, frags] of ids) {
    if (frags.length > 1) console.warn(`generate-theming-fragments: duplicate id "${id}" in ${[...new Set(frags)].join(', ')}`);
  }
  console.log(`generate-theming-fragments: wrote ${Object.keys(fragments).length} fragments and sections.json to docs/public/theming`);
}

main();
