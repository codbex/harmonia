import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import i18nextPlugin from '../../src/plugins/i18next';
import { createMockAlpine, createMockContext, mountDirective } from '../test-utils';

// Minimal i18next global stub: translation lookup with {{name}} interpolation,
// an event emitter for the instance and (optionally) its resource store, and
// a changeLanguage that emits 'languageChanged' like the real library.
function mockI18next({ language = 'en', initialized = true, withStore = true } = {}) {
  const handlers = {};
  const data = {
    en: { greeting: 'Hello', farewell: 'Bye', welcome: 'Welcome, {{name}}!', rich: '<b>Hi</b>' },
    de: { greeting: 'Hallo', farewell: 'Tschuess', welcome: 'Willkommen, {{name}}!' },
  };
  const api = {
    isInitialized: initialized,
    language,
    get languages() {
      return api.language === 'en' ? ['en'] : [api.language, 'en'];
    },
    on(event, cb) {
      (handlers[event] || (handlers[event] = [])).push(cb);
    },
    off(event, cb) {
      handlers[event] = (handlers[event] || []).filter((h) => h !== cb);
    },
    emit(event, ...args) {
      for (const cb of [...(handlers[event] || [])]) cb(...args);
    },
    t: vi.fn((key, options) => {
      if (!api.isInitialized) return undefined;
      const raw = (data[api.language] || {})[key];
      if (raw === undefined) return options?.defaultValue !== undefined ? options.defaultValue : key;
      return raw.replace(/{{(\w+)}}/g, (_, name) => String(options?.[name] ?? ''));
    }),
    exists: vi.fn((key) => (data[api.language] || {})[key] !== undefined),
    changeLanguage: vi.fn((lng) => {
      api.language = lng;
      api.emit('languageChanged', lng);
      return Promise.resolve();
    }),
    dir: vi.fn(() => 'ltr'),
    _handlers: handlers,
    _data: data,
  };
  if (withStore) api.store = makeStore();
  return api;
}

function makeStore() {
  const handlers = {};
  return {
    on(event, cb) {
      (handlers[event] || (handlers[event] = [])).push(cb);
    },
    emit(event, ...args) {
      for (const cb of [...(handlers[event] || [])]) cb(...args);
    },
    _handlers: handlers,
  };
}

function setup({ expression = '', text = '', attrs = {}, value } = {}) {
  const el = document.createElement('span');
  if (text) el.textContent = text;
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  const overrides = expression ? { evaluateLater: () => (cb) => cb(typeof value === 'function' ? value() : value) } : {};
  const mounted = mountDirective(i18nextPlugin, 'h-translate', el, { expression, original: 'x-h-translate' }, overrides);
  return { el, ...mounted };
}

// Register the plugin on a bare mock and return the magic instances plus the
// tracking effect from the mock context (the plugin's reactive tick uses the
// mock's Proxy-based reactive, so i18next events genuinely re-run effects).
function setupMagics() {
  const alpine = createMockAlpine();
  i18nextPlugin(alpine);
  const ctx = createMockContext(alpine);
  return { alpine, ctx, t: alpine._magics.t(), i18n: alpine._magics.i18n() };
}

describe('i18next plugin', () => {
  beforeEach(() => {
    window.i18next = mockI18next();
  });

  afterEach(() => {
    delete window.i18next;
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('x-h-translate directive', () => {
    it('registers the h-translate directive', () => {
      const { alpine } = setup({ expression: "'greeting'", value: 'greeting' });
      expect(alpine._directives['h-translate']).toBeTypeOf('function');
    });

    it('renders the translation for a key expression into the text content', () => {
      const { el } = setup({ expression: "'greeting'", value: 'greeting' });
      expect(el.textContent).toBe('Hello');
    });

    it('logs an error and leaves the element untouched when there is no expression', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { el } = setup({ text: 'Fallback text' });
      expect(el.textContent).toBe('Fallback text');
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('x-h-translate'));
    });

    it('passes interpolation options through the [key, options] form', () => {
      const { el } = setup({ expression: "['welcome', { name }]", value: ['welcome', { name: 'Ada' }] });
      expect(el.textContent).toBe('Welcome, Ada!');
      expect(window.i18next.t).toHaveBeenCalledWith('welcome', { name: 'Ada' });
    });

    it('renders the initial text content as a fallback when the key is missing', () => {
      const { el } = setup({ expression: "'nope'", value: 'nope', text: 'Not translated yet' });
      expect(el.textContent).toBe('Not translated yet');
      expect(window.i18next.t).toHaveBeenCalledWith('nope', { defaultValue: 'Not translated yet' });
    });

    it('renders the data-fallback attribute when the key is missing', () => {
      const { el } = setup({ expression: "'nope'", value: 'nope', attrs: { 'data-fallback': 'From the attribute' } });
      expect(el.textContent).toBe('From the attribute');
    });

    it('prefers data-fallback over the initial text content', () => {
      const { el } = setup({ expression: "'nope'", value: 'nope', text: 'From the text', attrs: { 'data-fallback': 'From the attribute' } });
      expect(el.textContent).toBe('From the attribute');
    });

    it('ignores the fallback when the key resolves', () => {
      const { el } = setup({ expression: "'greeting'", value: 'greeting', text: 'From the text', attrs: { 'data-fallback': 'From the attribute' } });
      expect(el.textContent).toBe('Hello');
    });

    it('lets a defaultValue in the expression options win over the markup fallback', () => {
      const { el } = setup({ expression: "['nope', { defaultValue: 'From options' }]", value: ['nope', { defaultValue: 'From options' }], attrs: { 'data-fallback': 'From the attribute' } });
      expect(el.textContent).toBe('From options');
    });

    it('renders the key itself when it is missing and there is no fallback', () => {
      const { el } = setup({ expression: "'nope'", value: 'nope' });
      expect(el.textContent).toBe('nope');
    });

    it('re-renders when the language changes', async () => {
      const { el } = setup({ expression: "'greeting'", value: 'greeting' });
      expect(el.textContent).toBe('Hello');
      await window.i18next.changeLanguage('de');
      expect(el.textContent).toBe('Hallo');
    });

    it('re-renders an expression-driven element with the current expression value', () => {
      let key = 'greeting';
      const { el } = setup({ expression: 'key', value: () => key });
      expect(el.textContent).toBe('Hello');
      key = 'farewell';
      window.i18next.emit('languageChanged', 'en');
      expect(el.textContent).toBe('Bye');
    });

    it('renders the fallback before init and the translation after the initialized event', () => {
      window.i18next = mockI18next({ initialized: false });
      const { el } = setup({ expression: "'greeting'", value: 'greeting', text: 'Loading' });
      expect(el.textContent).toBe('Loading');
      window.i18next.isInitialized = true;
      window.i18next.emit('initialized');
      expect(el.textContent).toBe('Hello');
    });

    it('renders the key before init when no fallback is provided', () => {
      window.i18next = mockI18next({ initialized: false });
      const { el } = setup({ expression: "'greeting'", value: 'greeting' });
      expect(el.textContent).toBe('greeting');
    });

    it('writes translations as text, never as markup', () => {
      const { el } = setup({ expression: "'rich'", value: 'rich' });
      expect(el.textContent).toBe('<b>Hi</b>');
      expect(el.querySelector('b')).toBeNull();
    });

    it('renders an empty string for a null or empty key', () => {
      const { el } = setup({ expression: 'key', value: null });
      expect(el.textContent).toBe('');
    });

    it('renders the fallback for a null key when one is provided', () => {
      const { el } = setup({ expression: 'key', value: null, text: 'Pick one' });
      expect(el.textContent).toBe('Pick one');
    });

    it('logs an error and leaves the element untouched when the global is missing', () => {
      delete window.i18next;
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { el } = setup({ expression: "'greeting'", value: 'greeting', text: 'Untouched fallback' });
      expect(el.textContent).toBe('Untouched fallback');
      expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('x-h-translate'));
    });

    it('attaches the i18next listeners once per registration, not per element', () => {
      const alpine = createMockAlpine();
      i18nextPlugin(alpine);
      const fn = alpine._directives['h-translate'];
      for (let i = 0; i < 2; i++) {
        const el = document.createElement('span');
        document.body.appendChild(el);
        fn(el, { modifiers: [], expression: "'greeting'", original: 'x-h-translate' }, createMockContext(alpine, { evaluateLater: () => (cb) => cb('greeting') }));
      }
      expect(window.i18next._handlers.languageChanged).toHaveLength(1);
      expect(window.i18next._handlers.loaded).toHaveLength(1);
    });

    it('adds no event listeners to the element itself', () => {
      const el = document.createElement('span');
      const addSpy = vi.spyOn(el, 'addEventListener');
      document.body.appendChild(el);
      mountDirective(i18nextPlugin, 'h-translate', el, { expression: "'greeting'", original: 'x-h-translate' }, { evaluateLater: () => (cb) => cb('greeting') });
      expect(addSpy).not.toHaveBeenCalled();
    });

    it('binds the resource store created by a late init and re-renders on added', () => {
      window.i18next = mockI18next({ initialized: false, withStore: false });
      const { el } = setup({ expression: "'greeting'", value: 'greeting' });
      expect(el.textContent).toBe('greeting');
      window.i18next.store = makeStore();
      window.i18next.isInitialized = true;
      window.i18next.emit('initialized');
      expect(window.i18next.store._handlers.added).toHaveLength(1);
      window.i18next._data.en.greeting = 'Hi there';
      window.i18next.store.emit('added', 'en', 'translation');
      expect(el.textContent).toBe('Hi there');
    });
  });

  describe('$t magic', () => {
    it('translates a key and passes options through', () => {
      const { t } = setupMagics();
      expect(t('greeting')).toBe('Hello');
      expect(t('welcome', { name: 'Ada' })).toBe('Welcome, Ada!');
      expect(window.i18next.t).toHaveBeenCalledWith('welcome', { name: 'Ada' });
    });

    it('is reactive across language changes inside an effect', async () => {
      const { t, ctx } = setupMagics();
      let seen;
      ctx.effect(() => {
        seen = t('greeting');
      });
      expect(seen).toBe('Hello');
      await window.i18next.changeLanguage('de');
      expect(seen).toBe('Hallo');
    });

    it('falls back to the key and logs a single error when the global is missing', () => {
      delete window.i18next;
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { t } = setupMagics();
      expect(t('greeting')).toBe('greeting');
      expect(t('farewell')).toBe('farewell');
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('$i18n magic', () => {
    it('exposes the current language reactively', async () => {
      const { i18n, ctx } = setupMagics();
      let seen;
      ctx.effect(() => {
        seen = i18n.language;
      });
      expect(seen).toBe('en');
      await window.i18next.changeLanguage('de');
      expect(seen).toBe('de');
    });

    it('delegates changeLanguage and returns its promise', async () => {
      const { i18n } = setupMagics();
      await expect(i18n.changeLanguage('de')).resolves.toBeUndefined();
      expect(window.i18next.changeLanguage).toHaveBeenCalledWith('de');
      expect(i18n.language).toBe('de');
    });

    it('delegates exists, dir, languages and isInitialized', () => {
      const { i18n } = setupMagics();
      expect(i18n.exists('greeting')).toBe(true);
      expect(i18n.exists('nope')).toBe(false);
      expect(i18n.dir()).toBe('ltr');
      expect(i18n.languages).toEqual(['en']);
      expect(i18n.isInitialized).toBe(true);
    });

    it('degrades gracefully when the global is missing', async () => {
      delete window.i18next;
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { i18n } = setupMagics();
      expect(i18n.language).toBeUndefined();
      expect(i18n.languages).toEqual([]);
      expect(i18n.isInitialized).toBe(false);
      expect(i18n.exists('greeting')).toBe(false);
      expect(i18n.dir()).toBe('ltr');
      await expect(i18n.changeLanguage('de')).resolves.toBeUndefined();
      expect(errorSpy).toHaveBeenCalledTimes(1);
    });
  });
});
