// Writes package.json's version into .claude-plugin/plugin.json, which used to
// be a hand-maintained duplicate that regularly went stale. Claude Code needs
// that version as a literal string in the manifest (it is what tells installed
// users an update exists), so it cannot be derived at read time.
//
// Only the version value is rewritten, never the whole manifest: the file is not
// in .prettierignore, so `npm run format:check` covers it, and re-serializing it
// with JSON.stringify would reflow the one-line `keywords` array.
//
// Guarded by tests/plugin-manifest.test.js, which fails the suite (and with it
// the publish workflow) when the committed manifest is stale.

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const MANIFEST = path.join(ROOT, '.claude-plugin', 'plugin.json');
const VERSION = require(path.join(ROOT, 'package.json')).version;

const VERSION_RE = /("version":\s*")[^"]*(")/;

function transform(source, version) {
  if (!VERSION_RE.test(source)) {
    throw new Error('sync-plugin-version: no "version" field found in .claude-plugin/plugin.json');
  }
  return source.replace(VERSION_RE, `$1${version}$2`);
}

function main() {
  const source = fs.readFileSync(MANIFEST, 'utf8');
  const next = transform(source, VERSION);
  if (next === source) {
    console.log(`sync-plugin-version: .claude-plugin/plugin.json already at ${VERSION}`);
    return;
  }
  fs.writeFileSync(MANIFEST, next);
  console.log(`sync-plugin-version: wrote version ${VERSION} to .claude-plugin/plugin.json`);
}

module.exports = { transform, MANIFEST, VERSION };

if (require.main === module) main();
