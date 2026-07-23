// Storage key under which the i18next plugin persists the chosen language to
// propagate it across same-origin tabs and iframes. Configurable so multiple
// apps on one origin can namespace their languages (or share one on purpose).
// Set it before Alpine starts so the stored language is adopted from the
// right key when the plugin registers.
let languageStorageKey = 'codbex.harmonia.language';

const setLanguageStorageKey = (key) => {
  if (typeof key === 'string' && key) languageStorageKey = key;
};

const getLanguageStorageKey = () => languageStorageKey;

// Resolve the locale for date formatting when the caller has not set one
// explicitly: prefer the document's declared language (`<html lang>`), then the
// browser locale, and finally `undefined` so Intl uses its own engine default.
// Guarded so it is safe to call outside a browser.
function resolveLocale(explicit) {
  if (explicit) return explicit;
  const lang = typeof document !== 'undefined' && document.documentElement && document.documentElement.lang;
  if (lang) return lang;
  return (typeof navigator !== 'undefined' && navigator.language) || undefined;
}

export { getLanguageStorageKey, resolveLocale, setLanguageStorageKey };
