import { beforeAll, describe, expect, it } from 'vitest';
import * as Harmonia from '../src/module.js';

// `src/index.js` (browser/CDN) and `src/module.js` (ESM) import the same
// component modules, so a plugin registered by both is the same function
// object. Comparing identities catches a component wired into one entry point
// but not the other.
const moduleRegistered = new Set();
Harmonia.registerComponents((plugin) => moduleRegistered.add(plugin));

const indexRegistered = new Set();

// Map plugin -> named export of src/module.js, for readable failure messages.
const pluginNames = new Map();
for (const [name, value] of Object.entries(Harmonia)) {
  if (typeof value === 'function') pluginNames.set(value, name);
}

beforeAll(async () => {
  const previousAlpine = window.Alpine;
  const previousHarmonia = window.Harmonia;
  // src/index.js registers synchronously at import time when window.Alpine is
  // already set, and overwrites window.Harmonia.
  window.Alpine = { plugin: (plugin) => indexRegistered.add(plugin) };
  await import('../src/index.js');
  window.Alpine = previousAlpine;
  window.Harmonia = previousHarmonia;
});

describe('entry point registration', () => {
  it('collected registrations from both entry points', () => {
    expect(moduleRegistered.size).toBeGreaterThan(50);
    expect(indexRegistered.size).toBeGreaterThan(50);
  });

  it('registers the same plugins in both entry points', () => {
    // The two files order their calls differently on purpose, so compare sets.
    for (const plugin of moduleRegistered) {
      const name = pluginNames.get(plugin) || 'a plugin';
      expect(indexRegistered.has(plugin), `${name} is registered by src/module.js but not by src/index.js`).toBe(true);
    }
    for (const plugin of indexRegistered) {
      const name = pluginNames.get(plugin);
      const message = name
        ? `${name} is registered by src/index.js but not by src/module.js (add it to registerComponents)`
        : 'a plugin registered by src/index.js is absent from src/module.js (add both the named export and the registerComponents line)';
      expect(moduleRegistered.has(plugin), message).toBe(true);
    }
  });
});
