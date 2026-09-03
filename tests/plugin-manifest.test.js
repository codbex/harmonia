import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// The sync script is CommonJS (like the other scripts/*.cjs); pull it in via require.
const require = createRequire(import.meta.url);
const { transform, MANIFEST, VERSION } = require('../scripts/sync-plugin-version.cjs');

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const committed = fs.readFileSync(MANIFEST, 'utf8');
const plugin = JSON.parse(committed);
const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'));

// The identifier Claude Code lists the plugin under, derived from the manifests
// rather than hardcoded, so a rename only has to happen in one place.
const identifier = `${marketplace.plugins[0].name}@${marketplace.name}`;

describe('Claude Code plugin manifest', () => {
  it('carries package.json version (not stale)', () => {
    // This is the release gate: build-and-publish.yaml runs `npm run test` before
    // `npm run build:prod`, so a stale manifest stops the job before npm publish.
    expect(committed, '.claude-plugin/plugin.json is stale - run `npm run plugin-version:sync`').toBe(transform(committed, VERSION));
  });

  it('agrees with the marketplace entry about the plugin name', () => {
    expect(marketplace.plugins[0].name).toBe(plugin.name);
  });

  it('documents the identifier it actually installs as', () => {
    for (const rel of ['README.md', 'docs/agent-skill.md']) {
      expect(read(rel), `${rel} does not document \`/plugin install ${identifier}\``).toContain(`/plugin install ${identifier}`);
    }
  });

  it('is enabled under that identifier in this repo', () => {
    // .claude/settings.json is Harmonia's own dogfooding config; a renamed
    // marketplace leaves the old key behind and silently disables the plugin.
    const settings = JSON.parse(read('.claude/settings.json'));
    expect(Object.keys(settings.enabledPlugins)).toEqual([identifier]);
  });
});
