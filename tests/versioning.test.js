import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Reuse the generator's changelog parsing so this test and the shipped
// migration reference agree on what counts as a breaking change. CommonJS.
const require = createRequire(import.meta.url);
const { extractBreakingChanges } = require('../scripts/generate-agent-docs.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Harmonia follows strict semantic versioning: only a MAJOR may break existing
// usage. Releases before this predate the rule and are deliberately exempt.
// v3.1.0 is the last release that shipped a breaking change in a minor.
const ENFORCE_FROM = '3.1.1';

const parse = (v) => v.replace(/^v/, '').split('-')[0].split('.').map(Number);
const compare = (a, b) => {
  const x = parse(a);
  const y = parse(b);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};

describe('versioning policy', () => {
  const changelog = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const breaking = extractBreakingChanges(changelog).filter((v) => v.bullets.length > 0);

  it('ships breaking changes in major releases only', () => {
    const offenders = breaking
      .filter((v) => compare(v.version, ENFORCE_FROM) >= 0)
      .filter((v) => {
        const [, minor, patch] = parse(v.version);
        return minor !== 0 || patch !== 0;
      })
      .map((v) => `${v.version} has ${v.bullets.length} breaking change(s) but is not a major release`);

    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('still records the breaking changes that predate the rule', () => {
    // Guards the cutoff itself: if this stops finding them, the parser or the
    // changelog changed shape and the test above would pass for the wrong reason.
    const legacy = breaking.filter((v) => compare(v.version, ENFORCE_FROM) < 0);
    expect(legacy.length).toBeGreaterThan(0);
  });
});
