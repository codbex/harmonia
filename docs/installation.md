# Installation

You can include **Harmonia** in your project in two ways:

- **Using a `<script>` tag** – quick and easy for adding Harmonia to an existing HTML page.
- **Importing as a module** – ideal for modern JavaScript workflows with bundlers like Vite, Webpack, or Rollup.

::: info
As a prerequsite, you must have Alpine.js already installed.
:::

## Install Harmonia

### From CDN

```html
<script src="https://unpkg.com/@codbex/harmonia@<version>/dist/harmonia.min.js"></script>
<link href="https://unpkg.com/@codbex/harmonia@<version>/dist/harmonia.css" rel="stylesheet" />
```

### From npm package

```bash
npm install @codbex/harmonia
```

## Include from a script tag

```html
<script src="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.min.js"></script>
<link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
```

## Include as a module

### Configure the importmap

```html
<script type="importmap">
  {
    "imports": {
      "alpinejs": "/<path>/<to>/node_modules/alpinejs/dist/module.esm.min.js",
      "@codbex/harmonia": "/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.esm.js"
    }
  }
</script>
```

### Include base styles

```html
<link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
```

### Initialize component(s)

::: code-group

```js [Automatic]
import Alpine from 'alpinejs';
import registerComponents from '@codbex/harmonia';

registerComponents(Alpine.plugin);

Alpine.start();
```

```js [Manual]
import Alpine from 'alpinejs';
import { Card, Button, ... } from '@codbex/harmonia';

Alpine.plugin(Card);
Alpine.plugin(Button);
...

Alpine.start();
```

:::

## Configure fonts

By default, Harmonia uses the **Open Sans** font, but no fonts are included in the package itself. This gives you full flexibility to choose the fonts that match your brand.

To use Open Sans, or any custom font, you’ll need to provide your own `fonts.css` file that links to your font installation or CDN. You can also configure this font in your theme for a consistent look across all components.

Here is an example `fonts.css` file:

```css
/* open-sans-latin-300-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-300-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-400-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-400-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-500-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-500-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-600-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-600-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-700-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-700-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-800-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 800;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-800-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-cyrillic-300-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-300-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-400-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-400-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-500-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-500-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-600-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-600-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-700-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-700-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-800-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 800;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-800-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-latin-300-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 300;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-300-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-400-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-400-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-500-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 500;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-500-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-600-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 600;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-600-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-700-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 700;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-700-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-800-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 800;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-latin-800-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-cyrillic-300-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 300;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-300-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-400-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-400-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-500-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 500;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-500-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-600-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 600;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-600-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-700-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 700;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-700-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-800-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 800;
  src: url(/<path>/<to>/node_modules/@fontsource/open-sans/files/open-sans-cyrillic-800-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

## Full example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script defer src="/<path>/<to>/node_modules/alpinejs/dist/cdn.min.js"></script>
    <script src="/<path>/<to>node_modules/@codbex/harmonia/dist/harmonia.min.js"></script>
    <link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
    <link href="/<path>/<to>/fonts.css" rel="stylesheet" />
  </head>
  <body class="hbox h-screen items-center justify-center" x-data>
    <button x-h-button>Button</button>
    <script>
      document.addEventListener('alpine:init', () => {
        // Your code
      });
    </script>
  </body>
</html>
```

## Full example (as a module)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="importmap">
      {
        "imports": {
          "alpinejs": "/<path>/<to>/node_modules/alpinejs/dist/module.esm.min.js",
          "@codbex/harmonia": "/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.esm.min.js"
        }
      }
    </script>
    <link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
    <link href="/<path>/<to>/fonts.css" rel="stylesheet" />
  </head>
  <body class="hbox h-screen items-center justify-center" x-data>
    <button x-h-button>Button</button>
    <script type="module">
      import Alpine from 'alpinejs';
      import registerComponents from '@codbex/harmonia';

      registerComponents(Alpine.plugin);

      Alpine.start();
    </script>
  </body>
</html>
```
