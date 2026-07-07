// Optional, opt-in plugin: binding glue for the i18next internationalization
// library. Registers the `x-h-translate` directive, which renders a
// translation into the element's text content, and the `$t` / `$i18n` magics
// for use in expressions and Alpine.data objects. Everything re-renders
// reactively when the language changes or translation resources load. i18next
// is treated as an external global (`window.i18next`) and is never bundled;
// ESM consumers assign `window.i18next` themselves before Alpine starts.

export default function (Alpine) {
  // One reactive cell shared by the directive and both magics. Every i18next
  // event that can change a translation bumps it, so any Alpine effect that
  // read a translation re-runs.
  const state = Alpine.reactive({ tick: 0 });
  let bound = false;
  let boundStore = null;
  let warned = false;

  const bump = () => {
    state.tick++;
  };

  // Resolve the i18next global and, on first success, attach the event
  // listeners exactly once. The lookup is lazy (per use, not at plugin
  // registration) so ESM consumers can assign window.i18next after
  // Alpine.plugin() as long as it happens before Alpine starts. The listeners
  // are plugin level, not element level (like the theme utility's storage
  // listener), so they live for the lifetime of the page; the directive
  // itself adds none.
  function resolve() {
    const i18next = typeof window === 'undefined' ? undefined : window.i18next;
    if (!i18next || typeof i18next.on !== 'function') return null;
    if (!bound) {
      bound = true;
      for (const event of ['initialized', 'languageChanged', 'loaded']) i18next.on(event, bump);
      // The resource store ('added' / 'removed' events) is created during
      // init(), so bind it when it appears and rebind if a re-init replaces it.
      const bindStore = () => {
        const store = i18next.store;
        if (!store || store === boundStore || typeof store.on !== 'function') return;
        boundStore = store;
        store.on('added', bump);
        store.on('removed', bump);
      };
      bindStore();
      i18next.on('initialized', bindStore);
    }
    return i18next;
  }

  function missing(caller) {
    if (caller) {
      console.error(`${caller}: the global "i18next" library is not available. Load i18next before using x-h-translate.`);
    } else if (!warned) {
      warned = true;
      console.error('Harmonia i18next plugin: the global "i18next" library is not available. Load i18next before using $t or $i18n.');
    }
  }

  // Translate a key, reading the reactive tick so any Alpine effect calling
  // this re-runs on language or resource changes. `fallback` is what renders
  // while the key cannot be resolved (i18next missing or not yet initialized,
  // or the key absent from the loaded resources); without one, the key itself
  // is the last resort. The fallback rides i18next's own defaultValue option,
  // so a defaultValue passed by the caller in `options` keeps precedence.
  function translate(key, options, fallback) {
    void state.tick;
    if (key === null || key === undefined || key === '') return fallback === undefined ? '' : fallback;
    const i18next = resolve();
    if (!i18next || typeof i18next.t !== 'function') {
      if (!i18next) missing();
      return fallback === undefined ? String(key) : fallback;
    }
    const result = i18next.t(key, fallback === undefined ? options : { defaultValue: fallback, ...options });
    return result === null || result === undefined ? (fallback === undefined ? String(key) : fallback) : result;
  }

  Alpine.magic('t', () => (key, options) => translate(key, options));

  // Reactive i18n surface for language switcher UIs: the getters read the
  // tick, so bindings like `:selected="$i18n.language === 'de'"` stay in sync.
  const i18n = {
    get language() {
      void state.tick;
      const i18next = resolve();
      if (!i18next) missing();
      return i18next ? i18next.language : undefined;
    },
    get languages() {
      void state.tick;
      const i18next = resolve();
      return (i18next && i18next.languages) || [];
    },
    get isInitialized() {
      void state.tick;
      const i18next = resolve();
      return !!(i18next && i18next.isInitialized);
    },
    changeLanguage(lng) {
      const i18next = resolve();
      if (!i18next) {
        missing();
        return Promise.resolve(undefined);
      }
      return i18next.changeLanguage(lng);
    },
    exists(key, options) {
      void state.tick;
      const i18next = resolve();
      return !!(i18next && typeof i18next.exists === 'function' && i18next.exists(key, options));
    },
    dir(lng) {
      void state.tick;
      const i18next = resolve();
      return i18next && typeof i18next.dir === 'function' ? i18next.dir(lng) : 'ltr';
    },
  };

  Alpine.magic('i18n', () => i18n);

  Alpine.directive('h-translate', (el, { expression, original }, { effect, evaluateLater }) => {
    if (!resolve()) {
      missing(original);
      return;
    }

    if (!expression) {
      console.error(`${original}: no translation key found. Pass the key as the expression, e.g. x-h-translate="'app.title'".`);
      return;
    }

    // The element's initial text content is not a key; it is the fallback
    // shown while the key cannot be resolved. The data-fallback attribute
    // does the same without pre-filling the element and wins over the text.
    // The initial text must be captured before the first render replaces it.
    const initialText = el.textContent.trim();
    const fallback = () => (el.hasAttribute('data-fallback') ? el.getAttribute('data-fallback') : initialText || undefined);

    // The expression may evaluate to a key string or to a [key, options]
    // array carrying interpolation and plural parameters.
    const getValue = evaluateLater(expression);

    function render(value) {
      let key = value;
      let options;
      if (Array.isArray(value)) [key, options] = value;
      el.textContent = translate(key, options, fallback());
    }

    effect(() => {
      // Read the tick here as well, so language changes re-render even when
      // the expression callback resolves asynchronously.
      void state.tick;
      getValue(render);
    });
  });
}
