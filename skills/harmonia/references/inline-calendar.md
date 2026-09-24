# Inline Calendar

A compact calendar for selecting a single date or a date range within a monthly context. The component provides navigation between months and years.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use the inline calendar when users need to choose specific dates, such as scheduling events but do not need a date input or a fullscreen calendar. For filtering data by date, use a Date Picker. Make sure it is paired with clear labels and context to prevent confusion, especially when selecting critical dates.

## Behavior

The month and the year in the header are buttons. Pressing the month shows a grid of the twelve months in place of the days, and pressing the year shows a scrollable grid of years. Pressing the same button again returns to the day grid.

- While the month grid is shown, the back/forward buttons step the month.
- While the year list is shown, they are replaced by back/forward year buttons.
- Picking a month or a year shows its days. It changes only the displayed month, never the selected date.
- The years run from the `min` year to the `max` year when those are set, otherwise 100 years either side of the current one.
- The back/forward buttons are disabled at the `min` and `max` months, and the keys keep focus between the `min` and `max` days.
- With no value, the calendar opens on the current month, or on the nearest month inside `min` and `max`.

## Directive

- `x-h-calendar-inline`

## API

### Attributes

| Attribute              | Values | Required | Description                                                                                        |
| ---------------------- | ------ | -------- | -------------------------------------------------------------------------------------------------- |
| data-aria-prev-year    | string | false    | Sets the `aria-label` attribute value for the previous year button, shown with the year list.      |
| data-aria-prev-month   | string | false    | Sets the `aria-label` attribute value for the previous month button.                               |
| data-aria-next-month   | string | false    | Sets the `aria-label` attribute value for the next month button.                                   |
| data-aria-next-year    | string | false    | Sets the `aria-label` attribute value for the next year button, shown with the year list.          |
| data-aria-choose-month | string | false    | Sets the text after the month name in the month button's `aria-label`. Defaults to `choose month`. |
| data-aria-choose-year  | string | false    | Sets the text after the year in the year button's `aria-label`. Defaults to `choose year`.         |

### Model

When using `x-model`, the calendar reads and writes dates as `YYYY-MM-DD` strings (e.g. `"2025-06-09"`). Set the bound variable to a `YYYY-MM-DD` string to pre-select a date, or to an empty string for no initial selection. On every selection the model is updated to the newly selected date in the same `YYYY-MM-DD` format. Clicking the selected day again deselects it and writes an empty string. `x-model`'s event modifiers (`.lazy`, `.change`, `.blur`, `.enter`) are not supported and log an error, the model always updates immediately.

Full ISO datetime strings (e.g. from `new Date().toISOString()`) are also accepted as input, but initialising with `YYYY-MM-DD` is recommended to avoid timezone-related date drift.

In range mode the model is an object `{ start, end }` instead of a single string.

### Events

| Event  | Description                                                                                                                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Triggered when the selection changes. In single mode the selected `Date` is passed in `event.detail.date`, or `undefined` after a deselect. In range mode the `Date` endpoints are passed in `event.detail.start` and `event.detail.end`. |

### Configuration

You can pass a configuration object to the calendar as an expression or as a value.

Example:

```html
<div x-h-calendar-inline="calConfig"></div>
<script>
  Alpine.data('controller', () => ({
    calConfig: { locale: 'en-US', firstDay: 1, min: '2025-01-10', max: '2025-12-20' },
  }));
</script>
```

| Key       | Description                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locale    | The locale of the calendar as a BCP 47 language tag. If not provided, it is taken from the page's `<html lang>` attribute, then the browser locale.                                                                  |
| firstDay  | The start day of the week. `0` is Sunday.                                                                                                                                                                            |
| min       | The earliest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                                                                       |
| max       | The latest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                                                                         |
| options   | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) options.                                                          |
| delimiter | Custom separator character between day, month, and year in the display format (e.g. `"-"`). Does not affect the model value.                                                                                         |
| order     | Custom display order of the date parts as a three-character string of `Y` (year), `M` (month), `D` (day) (e.g. `"MDY"` for month-day-year). Defaults to the locale's natural order. Does not affect the model value. |
| range     | When `true`, the calendar selects a start-and-end date range instead of a single date. See Range selection.                                                                               |

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the calendar:

- `Up` / `Down` - Moves focus to the day above/below the current day.
- `Right` - Moves focus to the next day.
- `Left` - Moves focus to the previous day.
- `Enter` / `Space` - Selects the focused day. Pressing it on the already selected day deselects it (single mode).
- `Home` - Selects the first day of the month.
- `End` - Selects the last day of the month.
- `PageUp` - Selects the same or closest day of the previous month.
- `PageDown` - Selects the same or closest day of the next month.

In the month and year grids:

- `Up` / `Down` - Moves focus to the month or year above/below the current one.
- `Left` / `Right` - Moves focus to the previous/next month or year.
- `Home` / `End` - Moves focus to the first/last month or year.
- `PageUp` / `PageDown` - Moves focus 12 years back/forward in the year grid.
- `Enter` / `Space` - Shows the days of the focused month or year, with focus on the same or closest day.
- `Esc` - Returns to the days without a change.

## Accessibility

The calendar is exposed as an ARIA date grid. A visually hidden month/year heading names the grid (announced via `aria-live` as it changes), weekday columns are column headers, and each day is a grid cell with roving focus and `aria-selected` / `aria-disabled` / `aria-current="date"` (today) state. The month and year in the header are toggle buttons (`aria-pressed`) named by their text followed by their purpose, for example "September, choose month". The month and year grids are ARIA grids named by their purpose, with the displayed month or year marked `aria-selected` and the current one `aria-current="date"`. Navigation buttons are labeled (override the defaults with the `data-aria-*` attributes below).

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

### Change event

```html
<div x-data>
  <div x-h-calendar-inline @change="console.log('Selected:', $event.detail.date)"></div>
</div>
```

### Locale and first day config

```html
<div
  x-data="{
  caldate: '',
  init() {
    const d = new Date();
    this.caldate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <div x-h-calendar-inline="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
```

### Range selection {#range-selection-inline}

Set `range: true` to let the user pick a date range. The first selection sets the start, the second completes the range (picks are ordered automatically). With the keyboard, press `Enter` once to set the start and again to set the end.

In range mode the `x-model` value is an object with `start` and `end` keys (each a `YYYY-MM-DD` string), and the `change` event detail is `{ start, end }` (`Date` objects):

```js
{ start: '2025-06-09', end: '2025-06-16' }
```

```html
<div x-data="{ dateRange: { start: '', end: '' } }">
  <div x-h-calendar-inline="{ range: true, firstDay: 1 }" x-model="dateRange"></div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/inline-calendar.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
