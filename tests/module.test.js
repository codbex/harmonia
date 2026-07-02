import { describe, expect, it } from 'vitest';
import * as Harmonia from '../src/module.js';

// Exports that are not auto-registered plugins.
const NON_PLUGIN_EXPORTS = new Set(['version', 'registerComponents', 'default', 'getBreakpointListener', 'getColorScheme', 'getSystemColorScheme', 'setColorScheme', 'addColorSchemeListener', 'removeColorSchemeListener']);

// Plugins exported for manual opt-in that must stay OUT of registerComponents.
const OPT_IN_PLUGINS = new Set([Harmonia.Lucide]);

function collectRegistered() {
  const registered = new Set();
  Harmonia.registerComponents((plugin) => registered.add(plugin));
  return registered;
}

describe('registerComponents', () => {
  it('registers the chip component (regression for the index/module sync bug)', () => {
    expect(collectRegistered().has(Harmonia.Chip)).toBe(true);
  });

  it('registers every exported component plugin', () => {
    const registered = collectRegistered();
    for (const [name, value] of Object.entries(Harmonia)) {
      if (NON_PLUGIN_EXPORTS.has(name) || typeof value !== 'function' || OPT_IN_PLUGINS.has(value)) continue;
      expect(registered.has(value), `${name} should be registered by registerComponents`).toBe(true);
    }
  });

  it('does not auto-register the opt-in Lucide plugin', () => {
    expect(collectRegistered().has(Harmonia.Lucide)).toBe(false);
  });
});
