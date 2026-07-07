// Browser/CDN entry for the optional i18next plugin. Include this file (after
// i18next and Harmonia) to opt in; it self-registers `x-h-translate` and the
// `$t` / `$i18n` magics on alpine:init. It is intentionally NOT part of the
// default `harmonia.js` bundle.
import i18next from './plugins/i18next';
import { getLanguageStorageKey, setLanguageStorageKey } from './utils/language';

// Optional plugin APIs live in their own object under Harmonia.plugins, not
// on the Harmonia object itself. The guards keep this working when the main
// bundle has not run (yet).
window.Harmonia = window.Harmonia || {};
window.Harmonia.plugins = window.Harmonia.plugins || {};
window.Harmonia.plugins.i18next = { getLanguageStorageKey, setLanguageStorageKey };

function registerPlugin() {
  window.Alpine.plugin(i18next);
}

if (window.Alpine) registerPlugin();
else document.addEventListener('alpine:init', registerPlugin, { once: true });
