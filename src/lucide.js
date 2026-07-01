// Browser/CDN entry for the optional Lucide plugin. Include this file (after
// Harmonia and Lucide) to opt in; it self-registers `x-h-lucide` on alpine:init.
// It is intentionally NOT part of the default `harmonia.js` bundle.
import lucide from './plugins/lucide';

function registerPlugin() {
  window.Alpine.plugin(lucide);
}

if (window.Alpine) registerPlugin();
else document.addEventListener('alpine:init', registerPlugin, { once: true });
