let colorSchemeKey = 'codbex.harmonia.colorMode';
let savedScheme = localStorage.getItem(colorSchemeKey);

const callbacks = [];

const onColorSchemeChange = (scheme) => {
  for (let i = 0; i < callbacks.length; i++) {
    callbacks[i](scheme);
  }
};

const colorSchemeChange = (event) => {
  if (event.matches) {
    document.documentElement.classList.add('dark');
    onColorSchemeChange('dark');
  } else {
    document.documentElement.classList.remove('dark');
    onColorSchemeChange('light');
  }
};

// Applies a color scheme mode to this document: toggles the `dark` class, manages the
// auto `matchMedia` change listener, and notifies registered listeners. localStorage is
// written only when `persist` is true (storage-event driven updates must not re-persist,
// to avoid bouncing the change back to the frames it came from).
const applyMode = (mode, persist) => {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSchemeChange);
    if (persist) localStorage.setItem(colorSchemeKey, 'dark');
    onColorSchemeChange('dark');
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark');
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSchemeChange);
    if (persist) localStorage.setItem(colorSchemeKey, 'light');
    onColorSchemeChange('light');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      onColorSchemeChange('dark');
    } else {
      document.documentElement.classList.remove('dark');
      onColorSchemeChange('light');
    }
    if (persist) localStorage.setItem(colorSchemeKey, 'auto');
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorSchemeChange);
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
  if (savedScheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedScheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorSchemeChange);
  }
  window.addEventListener('storage', onStorage);
};

const setColorScheme = (mode) => {
  applyMode(mode, true);
};

const getColorScheme = () => {
  const theme = localStorage.getItem(colorSchemeKey);
  if (theme) return theme;
  return 'auto';
};

const getSystemColorScheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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

initColorScheme();

export { addColorSchemeListener, getColorScheme, getSystemColorScheme, removeColorSchemeListener, setColorScheme };
