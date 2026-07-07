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

export { getLanguageStorageKey, setLanguageStorageKey };
