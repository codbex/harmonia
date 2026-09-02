let colorSchemeKey = 'codbex.harmonia.colorMode';

const callbacks = [];

// The MediaQueryList the auto-mode handler is attached to, or null when auto mode is not
// active. `window.matchMedia()` returns a new object on every call, so the handler can only
// be detached from the exact object it was attached to, which means that object has to be
// kept rather than rebuilt.
let systemQuery = null;

// True only in a browser. Guarded so this module can be imported by a server
// bundle (Astro, Next, SvelteKit) without touching a browser API at load time.
const hasDom = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const readSavedScheme = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(colorSchemeKey);
};

// `scheme` is what the document now shows, `mode` is what the user selected. The two differ
// only under `auto`, where the mode cannot be recovered from the scheme.
const onColorSchemeChange = (scheme, mode) => {
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i](scheme, mode);
  }
};

// Attached only while the saved mode is `auto`, so a system-driven flip always changes the
// resolved scheme within an unchanged `auto` selection.
const colorSchemeChange = (event) => {
  if (event.matches) {
    document.documentElement.classList.add('dark');
    onColorSchemeChange('dark', 'auto');
  } else {
    document.documentElement.classList.remove('dark');
    onColorSchemeChange('light', 'auto');
  }
};

const watchSystem = () => {
  if (systemQuery || !window.matchMedia) return;
  systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
  systemQuery.addEventListener('change', colorSchemeChange);
};

const unwatchSystem = () => {
  if (!systemQuery) return;
  systemQuery.removeEventListener('change', colorSchemeChange);
  systemQuery = null;
};

// Applies a color scheme mode to this document: toggles the `dark` class, manages the
// auto `matchMedia` change listener, and notifies registered listeners. localStorage is
// written only when `persist` is true (storage-event driven updates must not re-persist,
// to avoid bouncing the change back to the frames it came from).
const applyMode = (mode, persist) => {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
    unwatchSystem();
    if (persist) localStorage.setItem(colorSchemeKey, 'dark');
    onColorSchemeChange('dark', 'dark');
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark');
    unwatchSystem();
    if (persist) localStorage.setItem(colorSchemeKey, 'light');
    onColorSchemeChange('light', 'light');
  } else {
    let scheme;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      scheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      scheme = 'light';
    }
    watchSystem();
    // Persisted before notifying, like the two branches above, so a listener that calls
    // getColorScheme() already sees the new mode.
    if (persist) localStorage.setItem(colorSchemeKey, 'auto');
    onColorSchemeChange(scheme, 'auto');
  }
};

// Keeps this frame in sync when another same-origin document (an embedded iframe or another
// browser tab) changes the saved color scheme. The `storage` event never fires in the document
// that made the change, so applying without re-persisting cannot create a feedback loop.
const onStorage = (event) => {
  if (event.key !== colorSchemeKey) return;
  const mode = event.newValue;
  if (mode !== 'dark' && mode !== 'light' && mode !== 'auto') return;
  applyMode(mode, false);
};

const initColorScheme = () => {
  const savedScheme = readSavedScheme();
  if (savedScheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedScheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    watchSystem();
  }
  window.addEventListener('storage', onStorage);
};

const setColorScheme = (mode) => {
  if (!hasDom()) return;
  applyMode(mode, true);
};

const getColorScheme = () => {
  const theme = readSavedScheme();
  if (theme) return theme;
  return 'auto';
};

const getSystemColorScheme = () => {
  if (hasDom() && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const addColorSchemeListener = (callback) => {
  callbacks.push(callback);
};

const removeColorSchemeListener = (callback) => {
  for (let i = 0; i < callbacks.length; i++) {
    if (callbacks[i] === callback) {
      callbacks.splice(i, 1);
      return;
    }
  }
};

if (hasDom()) initColorScheme();

export { addColorSchemeListener, getColorScheme, getSystemColorScheme, removeColorSchemeListener, setColorScheme };
