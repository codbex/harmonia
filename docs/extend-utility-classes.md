---
outline: deep
---

# Extend Utility Classes

Harmonia ships a **curated subset** of Tailwind utility classes, not all of Tailwind. That keeps `harmonia.css` small, but sooner or later a project needs a class that is not in it - `md:size-6`, `h-80`, `gap-20`. Adding it to Harmonia only makes sense for classes everyone needs, and running a full Tailwind build in your project would duplicate everything Harmonia already ships: the base styles, the theme variables and the whole utility subset.

Harmonia solves this with `harmonia-extend.css`, a Tailwind entry that knows exactly what `harmonia.css` provides. Compile it and you get a small **supplementary stylesheet holding only the classes you are missing** - nothing is generated twice.

You need [Tailwind CSS](https://tailwindcss.com/) v4 and its CLI in your project:

```sh
npm install -D tailwindcss @tailwindcss/cli
```

## Usage

Create a stylesheet - `extend.css` here, the name is up to you - that imports the Harmonia entry and declares the classes you want:

```css
@import '@codbex/harmonia/dist/harmonia-extend.css';

@source inline('md:size-6');
@source inline('h-80 gap-20');
```

Compile it with the Tailwind CLI:

```sh
npx @tailwindcss/cli -m -i extend.css -o extend.min.css
```

Then load the result **after** `harmonia.css`:

```html
<link href="/<path>/<to>/node_modules/@codbex/harmonia/dist/harmonia.css" rel="stylesheet" />
<!-- the generated stylesheet comes last -->
<link href="/<path>/<to>/extend.min.css" rel="stylesheet" />
```

The order matters. Both files put their classes in the same cascade layer, so a generated `md:size-6` only wins over Harmonia's own `size-6` when it comes later.

The output of the example above is well under 1 KB, because everything Harmonia already ships is excluded:

```css
@layer utilities {
  .h-80 {
    height: calc(var(--spacing) * 80);
  }
  .gap-20 {
    gap: calc(var(--spacing) * 20);
  }
  @media (width >= 48rem) {
    .md\:size-6 {
      width: calc(var(--spacing) * 6);
      height: calc(var(--spacing) * 6);
    }
  }
}
```

### Listing classes explicitly

`@source inline(...)` takes one or more space-separated class names, and supports brace alternation and numeric ranges - the same syntax Harmonia uses for its own safelist. Nothing is scanned unless you ask for it, so the generated stylesheet holds exactly the classes you list:

```css
@import '@codbex/harmonia/dist/harmonia-extend.css';

@source inline('h-{60,72,80}');
@source inline('{sm:,md:,lg:}size-{4..8}');
@source inline('aspect-4/3 backdrop-blur-lg');
```

### Scanning your project

Point `@source` at your own files instead - a folder, or a glob such as `'./src/**/*.html'` - and Tailwind works out which classes you use. Everything Harmonia already provides is skipped, so what you get is exactly the gap:

```css
@import '@codbex/harmonia/dist/harmonia-extend.css';

@source './src';
```

Add `-w` to the CLI command to regenerate on every change:

```sh
npx @tailwindcss/cli -w -i extend.css -o extend.min.css
```

## Theme variables

The entry carries the theme Harmonia adds on top of Tailwind's, so a generated class resolves the same values the library does: `md:bg-primary` and `dark:border-negative` follow your theme in both light and dark mode, `md:rounded-control` follows the control radius, and `text-2xs` or `max-w-9xl` keep the sizes Harmonia adds to the Tailwind scale.

Theme values are **referenced, not redefined**: `harmonia.css` remains the single place where they live, so your custom theme applies to the generated classes too, without you configuring anything. It also means the supplement never changes how an existing class behaves - it only adds the ones you are missing.

## Limitations

- **Do not `@apply` a class Harmonia ships.** Because those classes are excluded on purpose, `@apply p-4` in your stylesheet fails the build with `Cannot apply utility class`. Use the class in your markup, or `@apply` a class Harmonia does not ship.
- **Harmonia's own utilities are not extendable this way.** `hbox`, `vbox`, `focus-ring`, `opacity-disabled` and `svg-defaults` are defined in `harmonia.css`, so the entry cannot generate new variants of them. The responsive forms that are commonly needed, such as `md:hbox`, already ship.
- **The documented utility classes are not the whole exclusion list.** Harmonia's components use around 1500 more classes than the [utility classes](/utility-classes) pages document, and those ship in `harmonia.css` too. They are all excluded, so you never get a class twice - which also means a class missing from the generated stylesheet is one Harmonia already provides.
