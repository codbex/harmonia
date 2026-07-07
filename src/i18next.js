// Browser/CDN entry for the optional i18next plugin. Include this file (after
// i18next and Harmonia) to opt in; it self-registers `x-h-translate` and the
// `$t` / `$i18n` magics on alpine:init. It is intentionally NOT part of the
// default `harmonia.js` bundle.
import i18next from './plugins/i18next';

function registerPlugin() {
  window.Alpine.plugin(i18next);
}

if (window.Alpine) registerPlugin();
else document.addEventListener('alpine:init', registerPlugin, { once: true });
