// Demo i18next setup for the live examples on the /plugins/i18next docs page.
// Loaded on every docs page right after the i18next UMD script and before
// Alpine starts, so the whole site shares one initialized instance. Keep these
// resources in sync with the "demo resources" fence in docs/plugins/i18next.md.
(function () {
  if (!window.i18next || window.i18next.isInitialized) return;
  window.i18next.init({
    // Seed from the language stored by the Harmonia i18next plugin, so pages
    // and the iframe demo start in the chosen language without a flash of the
    // default (the plugin would reconcile it after init anyway).
    lng: localStorage.getItem('codbex.harmonia.language') || 'en',
    fallbackLng: 'en',
    // Initialize synchronously so the examples never flash their raw keys.
    initImmediate: false,
    resources: {
      en: {
        translation: {
          greeting: 'Hello!',
          farewell: 'Goodbye!',
          welcome: 'Welcome, {{name}}!',
          items_one: '{{count}} item',
          items_other: '{{count}} items',
        },
      },
      de: {
        translation: {
          greeting: 'Hallo!',
          farewell: 'Auf Wiedersehen!',
          welcome: 'Willkommen, {{name}}!',
          items_one: '{{count}} Artikel',
          items_other: '{{count}} Artikel',
        },
      },
      bg: {
        translation: {
          greeting: 'Здравей!',
          farewell: 'Довиждане!',
          welcome: 'Добре дошли, {{name}}!',
          items_one: '{{count}} артикул',
          items_other: '{{count}} артикула',
        },
      },
    },
  });
})();
