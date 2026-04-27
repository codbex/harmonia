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
<script src="https://unpkg.com/@codbex/harmonia@__H_VER__/dist/harmonia.min.js"></script>
<link href="https://unpkg.com/@codbex/harmonia@__H_VER__/dist/harmonia.css" rel="stylesheet" />
```

### From npm package

```bash
npm install @codbex/harmonia
```

### From WebJar

::: code-group

```xml [Maven]
<dependency>
    <groupId>org.webjars.npm</groupId>
    <artifactId>codbex__harmonia</artifactId>
    <version>__H_VER__</version>
</dependency>
```

```[SBT / Play 2]
"org.webjars.npm" % "codbex__harmonia" % "__H_VER__"
```

```xml [Ivy]
<dependency org="org.webjars.npm" name="codbex__harmonia" rev="__H_VER__" />
```

```[Grape]
@Grapes(
    @Grab(group='org.webjars.npm', module='codbex__harmonia', version='webJarVersion.val()')
)
```

```[Gradle]
runtimeOnly("org.webjars.npm:codbex__harmonia:__H_VER__")
```

```[Buildr]
'org.webjars.npm:codbex__harmonia:jar:1.4.2'
```

```[Leiningen]
org.webjars.npm/codbex__harmonia "1.4.2"
```

:::

### Eclipse Dirigible

Harmonia is included by default in the low-code [Eclipse Dirigble](https://www.dirigible.io/) development platform as a WebJar.

## Include from a script tag

::: code-group

```html [NPM]
<script src="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.min.js"></script>
<link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
```

```html [WebJar / Dirigible]
<script src="/webjars/codbex__harmonia/dist/harmonia.min.js"></script>
<link href="/webjars/codbex__harmonia/dist/harmonia.css" rel="stylesheet" />
```

:::

## Include as a module

### Configure the importmap

::: code-group

```html [NPM]
<script type="importmap">
  {
    "imports": {
      "alpinejs": "/<path>/<to>/node_modules/alpinejs/dist/module.esm.min.js",
      "@codbex/harmonia": "/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.esm.js"
    }
  }
</script>
```

```html [WebJar / Dirigible]
<script type="importmap">
  {
    "imports": {
      "alpinejs": "/webjars/alpinejs/dist/module.esm.min.js",
      "@codbex/harmonia": "/webjars/codbex__harmonia/dist/harmonia.esm.js"
    }
  }
</script>
```

:::

### Include base styles

::: code-group

```html [NPM]
<link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
```

```html [WebJar / Dirigible]
<link href="/webjars/codbex__harmonia/dist/harmonia.css" rel="stylesheet" />
```

:::

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

### Eclipse Dirigible

There is a default font configuration included in Dirigible:

```html
<link href="/services/web/application-core/styles/fonts.css" rel="stylesheet" />
```

### Other/Custom

To use Open Sans, or any custom font, you will need to provide your own `fonts.css` file that links to your font installation or CDN. You can also configure this font in your theme for a consistent look across all components.

Here is an example `fonts.css` file:

::: code-group

```css [NPM]
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

```css [WebJar]
/* open-sans-latin-300-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-300-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-400-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-400-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-500-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-500-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-600-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-600-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-700-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-700-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-800-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 800;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-800-normal.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-cyrillic-300-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 300;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-300-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-400-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-400-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-500-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 500;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-500-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-600-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 600;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-600-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-700-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 700;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-700-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-800-normal */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-display: swap;
  font-weight: 800;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-800-normal.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-latin-300-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 300;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-300-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-400-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-400-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-500-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 500;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-500-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-600-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 600;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-600-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-700-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 700;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-700-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-latin-800-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 800;
  src: url(/webjars/fontsource__open-sans/files/open-sans-latin-800-italic.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

/* open-sans-cyrillic-300-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 300;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-300-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-400-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 400;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-400-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-500-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 500;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-500-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-600-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 600;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-600-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-700-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 700;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-700-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}

/* open-sans-cyrillic-800-italic */
@font-face {
  font-family: 'Open Sans';
  font-style: italic;
  font-display: swap;
  font-weight: 800;
  src: url(/webjars/fontsource__open-sans/files/open-sans-cyrillic-800-italic.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
```

:::

In the theme file:

::: warning
Only do this if you're using a font other than Open Sans, since these values are already set by default in Harmonia.
:::

```css
--font-sans: 'Open Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
--font-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
--font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
```

## Full example

::: code-group

```html [NPM]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script defer src="/<path>/<to>/node_modules/alpinejs/dist/cdn.min.js"></script>
    <script src="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.min.js"></script>
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

```html [WebJar]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script defer src="/webjars/alpinejs/dist/cdn.min.js"></script>
    <script src="/webjars/codbex__harmonia/dist/harmonia.min.js"></script>
    <link href="/webjars/codbex__harmonia/dist/harmonia.css" rel="stylesheet" />
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

:::

## Full example (as a module)

::: code-group

```html [NPM]
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

```html [WebJar]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="importmap">
      {
        "imports": {
          "alpinejs": "/webjars/alpinejs/dist/module.esm.min.js",
          "@codbex/harmonia": "/webjars/codbex__harmonia/dist/harmonia.esm.min.js"
        }
      }
    </script>
    <link href="/webjars/codbex__harmonia/dist/harmonia.css" rel="stylesheet" />
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

:::

## Full example (Eclipse Dirigible)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script defer src="/webjars/alpinejs/dist/cdn.min.js"></script>
    <script src="/webjars/codbex__harmonia/dist/harmonia.min.js"></script>
    <link href="/webjars/codbex__harmonia/dist/harmonia.css" rel="stylesheet" />
    <link href="/services/web/application-core/styles/fonts.css" rel="stylesheet" />
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
