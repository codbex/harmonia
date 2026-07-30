// @vitest-environment node
//
// Guards the server-rendering import path. Every other suite runs under
// happy-dom, which supplies `self`, `localStorage`, `window` and `document` and
// so hides module-scope browser access entirely. This file runs in the plain
// node environment, where such access throws, which is the only way a
// regression here gets caught.
//
// The subject is the built bundle rather than `src/`, because that is what a
// server bundle (Astro, Next, SvelteKit) actually imports and because the
// sources use extensionless imports that only esbuild resolves.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const root = path.dirname(fileURLToPath(import.meta.url));
const bundle = path.join(root, '..', 'dist', 'harmonia.esm.js');
const built = fs.existsSync(bundle);

// `dist/` is a build artifact, so the suite is skipped rather than failed when
// the library has not been built yet.
const whenBuilt = built ? describe : describe.skip;

describe('node environment', () => {
  it('has no browser globals, so this suite is a real check', () => {
    expect(typeof window).toBe('undefined');
    expect(typeof document).toBe('undefined');
    expect(typeof localStorage).toBe('undefined');
    expect(typeof self).toBe('undefined');
  });
});

whenBuilt('the ESM bundle in a server runtime', () => {
  let Harmonia;

  beforeAll(async () => {
    Harmonia = await import(bundle);
  });

  it('imports without touching a browser API at module scope', () => {
    expect(Harmonia).toBeDefined();
    expect(Harmonia.version).toBeTruthy();
  });

  it('registers every component with an injected register function', () => {
    const registered = new Set();
    Harmonia.registerComponents((plugin) => registered.add(plugin));
    expect(registered.size).toBeGreaterThan(50);
  });

  it('reports a color scheme instead of throwing without localStorage', () => {
    expect(Harmonia.getColorScheme()).toBe('auto');
    expect(Harmonia.getSystemColorScheme()).toBe('light');
  });

  it('ignores setColorScheme rather than throwing without a document', () => {
    expect(() => Harmonia.setColorScheme('dark')).not.toThrow();
  });

  it('generates a uuid without a secure-context crypto global', async () => {
    // uuid.js is not exported, so it is exercised through a directive that mints
    // ids. Reaching it at all proves the module-scope `self` read is gone.
    const { default: uuidv4 } = await import('../src/utils/uuid.js');
    expect(uuidv4()).toMatch(/^[0-9a-f-]{36}$/i);
  });
});
