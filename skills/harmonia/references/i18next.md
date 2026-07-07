# i18next

An optional plugin that binds the [i18next](https://www.i18next.com/) internationalization library to Alpine and Harmonia. It adds the `x-h-translate` directive, which renders a translation into the element's text content, and two magics: `$t`, which returns a translated string anywhere an Alpine expression runs (including `Alpine.data` objects), and `$i18n`, which exposes the current language reactively along with switching helpers. Everything re-renders automatically when the language changes or translation resources load, and languages switched through `$i18n.changeLanguage` propagate to other same-origin tabs and iframes the way the color mode does.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

This plugin is opt-in, so you load it yourself. Load i18next and Harmonia first, then add the plugin.

### CDN

The UMD build of i18next creates the `window.i18next` global itself:

```html
<script src="https://unpkg.com/i18next@26/dist/umd/i18next.min.js"></script>
<script src="https://unpkg.com/@codbex/harmonia/dist/harmonia.min.js"></script>
<!-- opt in: registers x-h-translate, $t and $i18n on alpine:init -->
<script src="https://unpkg.com/@codbex/harmonia/dist/harmonia-i18next.min.js"></script>
```

### ESM

The ESM build of i18next does not create the global, so assign it yourself before Alpine starts:

```js
import { I18next } from '@codbex/harmonia';
import Alpine from 'alpinejs';
import i18next from 'i18next';

window.i18next = i18next; // the plugin reads the global; i18next is never bundled
Alpine.plugin(I18next);
Alpine.start();
```

### Initializing i18next

Initialize i18next as usual. The plugin does not interfere with your configuration:

```js
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: {
    en: { translation: { greeting: 'Hello!' } },
    de: { translation: { greeting: 'Hallo!' } },
  },
});
```

Initialization is asynchronous: until it completes, translated elements show their fallback text (or their key when no fallback is provided), then re-render as soon as i18next reports `initialized`. Translations also re-render on `languageChanged`, `loaded` and on resource bundle changes (`added` / `removed`), including when you call `i18next.changeLanguage(...)` directly on the global.

### Language synchronization across tabs and iframes

Languages switched through `$i18n.changeLanguage` are saved to localStorage (under the `codbex.harmonia.language` key by default) and propagate to every other same-origin document that uses the plugin, exactly like the color mode does. Embedded iframes and other browser tabs follow immediately. A document that loads later (an iframe added to the page, a new tab, a reload) adopts the stored language as soon as its own i18next instance initializes, overriding the configured `lng`. Calling `i18next.changeLanguage(...)` directly on the global updates only the current document.

The storage key is configurable through the `Harmonia.plugins.i18next` object, for example to keep the languages of two apps on one origin separate. Only documents using the same key stay in sync. Set it before Alpine starts:

```html
<script src="https://unpkg.com/@codbex/harmonia/dist/harmonia-i18next.min.js"></script>
<script>
  Harmonia.plugins.i18next.setLanguageStorageKey('myapp.language');
</script>
```

With the ESM build, import the functions instead:

```js
import { setLanguageStorageKey } from '@codbex/harmonia';

setLanguageStorageKey('myapp.language');
```

Because the stored language is applied after i18next initializes, a page briefly renders in its configured `lng` first. To start in the stored language directly, seed the init with it:

```js
i18next.init({
  lng: localStorage.getItem(Harmonia.plugins.i18next.getLanguageStorageKey()) || 'en',
  // ...
});
```

## Directive

- `x-h-translate`

## API

Besides the directive, the plugin registers two [magic properties](https://alpinejs.dev/globals/alpine-data#using-magic-properties): `$t` for translating and `$i18n` for reading and switching the language.

### Arguments

| Attribute  | Type            | Required | Description                                                                                                                       |
| ---------- | --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------- |
| expression | string or array | true     | The translation key, e.g. `x-h-translate="'app.title'"`, or a `[key, options]` array to pass interpolation and plural parameters. |

### Attributes

| Attribute       | Type   | Required | Description                                                                                                                                                                                                                                     |
| --------------- | ------ | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-fallback` | string | false    | Fallback text shown while the key cannot be resolved, without pre-filling the element. Takes precedence over the element's initial text content. Passed to i18next as `defaultValue`, so a `defaultValue` in the expression options still wins. |

When the key cannot be resolved and no fallback is provided, the key itself is rendered.

### Magic properties

- `$t` function

Returns the translated string for a key. It works inline (`x-text="$t('app.title')"`) and inside [Alpine.data](https://alpinejs.dev/globals/alpine-data) objects (`this.$t('app.title')`), and any effect that uses it re-runs when the language or the loaded resources change. While i18next is not available or not yet initialized, it returns the key itself.

- `$i18n` object

| Property       | Type     | Description                                                                                             |
| -------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| language       | string   | The current language. Reactive, e.g. `:data-variant="$i18n.language === 'de' ? 'primary' : 'outline'"`. |
| languages      | array    | The language fallback chain, most specific first. Reactive.                                             |
| isInitialized  | boolean  | Whether i18next has finished initializing. Reactive.                                                    |
| changeLanguage | function | Switches the language, persists it, and propagates it to other same-origin tabs and iframes.            |
| exists         | function | Whether a key resolves in the current language.                                                         |
| dir            | function | The text direction of the current (or a given) language.                                                |

#### Arguments

- `$t` function

| Argument | Type   | Required | Description                                                                                       |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------------- |
| key      | string | true     | The translation key.                                                                              |
| options  | object | false    | Passed straight to `i18next.t`: interpolation values, `count` for plurals, `ns`, `lng` and so on. |

```js
this.$t('welcome', { name: 'Ada' });
```

- `changeLanguage` function

| Argument | Type   | Required | Description                                                                   |
| -------- | ------ | -------- | ----------------------------------------------------------------------------- |
| lng      | string | true     | The language to switch to. Returns the promise from `i18next.changeLanguage`. |

```js
this.$i18n.changeLanguage('de');
```

- `exists` function

| Argument | Type   | Required | Description                          |
| -------- | ------ | -------- | ------------------------------------ |
| key      | string | true     | The translation key to check.        |
| options  | object | false    | Passed straight to `i18next.exists`. |

- `dir` function

| Argument | Type   | Required | Description                                                                                     |
| -------- | ------ | -------- | ----------------------------------------------------------------------------------------------- |
| lng      | string | false    | The language to get the direction for. Defaults to the current one. Returns `'ltr'` or `'rtl'`. |

### Configuration

The plugin adds an `i18next` object to `Harmonia.plugins` (the ESM build exports the same functions by name) for configuring the language synchronization:

| Function              | Description                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------- |
| setLanguageStorageKey | Sets the localStorage key under which the language is persisted and synchronized. Call it before Alpine starts. |
| getLanguageStorageKey | Returns the current storage key, `codbex.harmonia.language` by default.                                         |

- `setLanguageStorageKey` function

| Argument | Type   | Required | Description                                                   |
| -------- | ------ | -------- | ------------------------------------------------------------- |
| key      | string | true     | The localStorage key. Empty or non-string values are ignored. |

```js
Harmonia.plugins.i18next.setLanguageStorageKey('myapp.language');
```

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

> **Note:**
> The live examples on this page share the docs site's single i18next instance, so switching the language in one example updates every example on the page. The instance is initialized with these demo resources:

```js
i18next.init({
  lng: 'en',
  fallbackLng: 'en',
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
```

### Basic translation

Point `x-h-translate` at a key with an expression:

```html
<div x-data class="vbox items-start gap-1">
  <p x-h-translate="'greeting'"></p>
  <p x-h-translate="'farewell'"></p>
</div>
```

### Fallback text

The element's initial text content is shown while the key cannot be resolved. It also keeps the element readable before i18next finishes initializing. The `data-fallback` attribute does the same without pre-filling the element and wins over the text content:

```html
<div x-data class="vbox items-start gap-1">
  <p x-h-translate="'missing.key'">This translation does not exist yet</p>
  <p x-h-translate="'missing.key'" data-fallback="Neither does this one"></p>
  <p x-h-translate="'missing.key'"></p>
</div>
```

Without a fallback, the key itself is rendered (the third line above).

### Translating with $t

The `$t` magic returns the translated string, so it can feed `x-text`, attribute bindings or any other expression:

```html
<div x-data class="vbox items-start gap-1">
  <span x-text="$t('greeting')"></span>
</div>
```

It is also available as `this.$t` inside component objects:

```js
Alpine.data('cart', () => ({
  get checkoutLabel() {
    return this.$t('farewell');
  },
}));
```

### Interpolation and plurals

Pass options through the `[key, options]` expression form of the directive, or as the second argument of `$t`. Both stay reactive, so the text follows the bound values:

```html
<div x-data="{ name: 'Ada', count: 1 }" class="vbox items-start gap-2">
  <input x-h-input type="text" x-model="name" aria-label="Name" />
  <span x-h-translate="['welcome', { name }]"></span>
  <span x-text="$t('items', { count })"></span>
  <div class="hbox gap-2">
    <button x-h-button data-size="sm" @click="count++">More</button>
    <button x-h-button data-size="sm" data-variant="outline" @click="count = Math.max(0, count - 1)">Fewer</button>
  </div>
</div>
```

### Language switcher

`$i18n.language` is reactive, so the active language can drive styling, and `$i18n.changeLanguage` re-renders every translation on the page:

```html
<div x-data class="vbox items-start gap-3">
  <div class="hbox gap-2">
    <button x-h-button :data-variant="$i18n.language === 'en' ? 'primary' : 'outline'" @click="$i18n.changeLanguage('en')">English</button>
    <button x-h-button :data-variant="$i18n.language === 'de' ? 'primary' : 'outline'" @click="$i18n.changeLanguage('de')">Deutsch</button>
    <button x-h-button :data-variant="$i18n.language === 'bg' ? 'primary' : 'outline'" @click="$i18n.changeLanguage('bg')">Български</button>
  </div>
  <p x-h-translate="'greeting'"></p>
</div>
```

### Reactive key

The directive's expression is reactive, so switching the key re-renders the element:

```html
<div x-data="{ key: 'greeting' }" class="vbox items-start gap-2">
  <div class="hbox gap-2">
    <button x-h-button data-size="sm" @click="key = 'greeting'">greeting</button>
    <button x-h-button data-size="sm" data-variant="outline" @click="key = 'farewell'">farewell</button>
  </div>
  <p x-h-translate="key"></p>
</div>
```

### Cross frame synchronization

The frame below is a separate document with its own i18next instance, embedded in an iframe. Switching the language here updates the frame, switching it inside the frame updates this page (and every other example on it), and the frame comes up in the stored language when it loads:

```html
<div x-data class="vbox items-start gap-3">
  <div class="hbox gap-2">
    <button x-h-button :data-variant="$i18n.language === 'en' ? 'primary' : 'outline'" @click="$i18n.changeLanguage('en')">English</button>
    <button x-h-button :data-variant="$i18n.language === 'de' ? 'primary' : 'outline'" @click="$i18n.changeLanguage('de')">Deutsch</button>
    <button x-h-button :data-variant="$i18n.language === 'bg' ? 'primary' : 'outline'" @click="$i18n.changeLanguage('bg')">Български</button>
  </div>
  <p x-h-translate="'greeting'"></p>
  <iframe src="/harmonia/i18next/i18next-frame.html" title="Harmonia page in an iframe" class="w-full rounded-md border border-border" style="height: 12rem"></iframe>
</div>
```

Full docs: https://www.codbex.com/harmonia/plugins/i18next.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
