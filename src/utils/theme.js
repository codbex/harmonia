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
};

const setColorScheme = (mode) => {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
    localStorage.setItem(colorSchemeKey, 'dark');
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSchemeChange);
    onColorSchemeChange('dark');
  } else if (mode === 'light') {
    document.documentElement.classList.remove('dark');
    localStorage.setItem(colorSchemeKey, 'light');
    window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', colorSchemeChange);
    onColorSchemeChange('light');
  } else {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
      onColorSchemeChange('dark');
    } else {
      document.documentElement.classList.remove('dark');
      onColorSchemeChange('light');
    }
    localStorage.setItem(colorSchemeKey, 'auto');
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorSchemeChange);
  }
};

const getColorScheme = () => {
  const theme = localStorage.getItem(colorSchemeKey);
  if (theme) return theme;
  else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
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

export { addColorSchemeListener, getColorScheme, removeColorSchemeListener, setColorScheme };
