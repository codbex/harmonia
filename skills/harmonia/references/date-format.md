# Date Format

A behavior-only directive that renders a date value as a locale-aware date string into the element's text content, plus a `$dateFormat` magic that exposes the same formatting engine for use directly in Alpine expressions. It shares the same formatting engine used by the date picker and date-time picker, so display output is consistent across the library.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Bind a date value through the directive expression, or place the directive on an element that already contains an ISO date and it will reformat that text in place. Formatting is controlled with `data-*` attributes, and the output updates reactively when the bound value or any formatting attribute changes. On a `<time>` element a machine-readable `datetime` attribute is also kept in sync.

Use the `$dateFormat` magic when you want a formatted date inline in an expression (for example `x-text` or `:title`) rather than as an element's whole text content.

When no locale is set explicitly, the directive and the magic inherit it from the page's `<html lang>` attribute (then the browser locale), so declaring the page language once formats every date accordingly.

## Directive

- `x-h-date-format`

## API

### Arguments

| Attribute              | Type                                    | Required | Description                                                                                                                                                |
| ---------------------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| expression             | Date \| string \| number \| {start,end} | false    | The value to format (a `Date`, timestamp, ISO `YYYY-MM-DD` string, or a range object). When omitted, the element's own text content is used as the source. |
| `data-locale`          | string                                  | false    | BCP-47 locale tag (e.g. `en-GB`). When omitted, the locale is taken from the page's `<html lang>` attribute, then the browser locale.                      |
| `data-order`           | string                                  | false    | Field order expressed with `Y`/`M`/`D`, e.g. `DMY`. Defaults to the locale's order.                                                                        |
| `data-delimiter`       | string                                  | false    | Overrides the locale's field separator (e.g. `-`).                                                                                                         |
| `data-options`         | string (JSON)                           | false    | An `Intl.DateTimeFormat` options object, as JSON (e.g. `{"dateStyle":"long"}`).                                                                            |
| `data-range`           | boolean                                 | false    | When `"true"`, the value is treated as a `{ start, end }` object.                                                                                          |
| `data-range-separator` | string                                  | false    | String placed between start and end in range output. Defaults to `-`.                                                                                      |

### Magic properties

The utility also registers a [magic method](https://alpinejs.dev/globals/alpine-data#using-magic-properties) called `$dateFormat` for formatting dates inline in Alpine expressions.

| Property           | Type     | Description                                                                                                                                                                        |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$dateFormat`      | function | `$dateFormat(value, config?)` returns the formatted string for a date value, or a formatted range when `value` is a `{ start, end }` object. Empty or invalid input returns `''`.  |
| `$dateFormat.with` | function | `$dateFormat.with(config?)` returns a reusable formatter object exposing `format`, `parse`, `formatRange` and `parseRange`, for cases that also need to parse input into a `Date`. |

#### Arguments

- `$dateFormat(value, config?)`

| Argument | Type                                    | Required | Description                                                                                                                                                                                                                                                                       |
| -------- | --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| value    | Date \| string \| number \| {start,end} | true     | The value to format (a `Date`, timestamp, ISO `YYYY-MM-DD` string, or a `{ start, end }` range object).                                                                                                                                                                           |
| config   | object                                  | false    | Formatting options: `locale`, `order`, `delimiter`, `options` (an `Intl.DateTimeFormat` options object) and `rangeSeparator`. Mirrors the directive's `data-*` attributes. When `locale` is omitted it falls back to the page's `<html lang>` attribute, then the browser locale. |

### Functions

The formatting engine is also exported as a plain function, so it can be used outside Alpine (for example in application code or a build step). It returns the same reusable formatter object as `$dateFormat.with`.

| Property            | Arguments | Returns | Description                                                                                                                                                      |
| ------------------- | --------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| createDateFormatter | config    | object  | Returns a reusable formatter exposing `format`, `parse`, `formatRange` and `parseRange`. Import it from the package or read it off the global `Harmonia` object. |

The `config` argument accepts the same keys described above (`locale`, `order`, `delimiter`, `options` and `rangeSeparator`). Unlike the directive and magic, this plain function does not read the page's `<html lang>`. When `locale` is omitted it defers directly to the JavaScript engine's default locale.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

### Format a bound date

```html
<div x-data="{ date: '2026-06-19' }" class="vbox gap-2">
  <input x-h-input type="date" x-model="date" />
  <p>Formatted: <time x-h-date-format="date" data-locale="en-GB"></time></p>
</div>
```

### Reformat existing content in place

With no expression, the element's current text is used as the source value.

```html
<time x-h-date-format data-locale="fr-FR">2026-06-19</time>
```

### Custom order and delimiter

```html
<span x-h-date-format="'2026-06-19'" data-order="DMY" data-delimiter="<"></span>
```

### Intl options

```html
<span x-h-date-format="'2026-06-19'" data-options='{ "dateStyle": "long" }'></span>
```

### Full ISO date-time string

Any value the `Date` constructor understands is accepted, including a full ISO 8601 timestamp. Pair it with `data-options` to show the time as well as the date.

```html
<p>Meeting: <time x-h-date-format="'2026-06-19T14:30:00'" data-locale="en-GB" data-options='{ "dateStyle": "long", "timeStyle": "short" }'></time></p>
```

### Format a range

```html
<span x-h-date-format="{ start: '2026-06-01', end: '2026-06-07' }" data-range="true" data-locale="en-US"></span>
```

### Format inline with the magic

Use `$dateFormat` when you need a formatted date inside an expression rather than as an element's whole text content.

```html
<div x-data="{ date: '2026-06-19' }" class="vbox gap-2">
  <input x-h-input type="date" x-model="date" />
  <p x-text="`Selected: ${$dateFormat(date, { locale: 'en-GB' })}`"></p>
</div>
```

### Parse input with the magic factory

`$dateFormat.with(config)` returns a reusable formatter, so you can format a date and parse the string back into a `Date`.

```html
<div x-data="{ formatter: $dateFormat.with({ order: 'DMY', delimiter: '/' }) }" class="vbox gap-2">
  <p x-text="formatter.format(new Date(2026, 5, 19))"></p>
  <p x-text="'Parsed month index: ' + formatter.parse('19/06/2026').getMonth()"></p>
</div>
```

### In plain JS

The `createDateFormatter` function works without Alpine. Import it from the package, or read it off the global `Harmonia` object when using the browser build.

```js
import { createDateFormatter } from '@codbex/harmonia';
// browser build: const { createDateFormatter } = Harmonia;

const fmt = createDateFormatter({ locale: 'en-GB', order: 'DMY' });

fmt.format(new Date(2026, 5, 19)); // "19/06/2026"
fmt.parse('19/06/2026'); // Date for 19 June 2026
fmt.formatRange(new Date(2026, 5, 1), new Date(2026, 5, 7)); // "01/06/2026 - 07/06/2026"
```

Full docs: https://www.codbex.com/harmonia/utilities/date-format.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
