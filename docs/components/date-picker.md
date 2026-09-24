# Date Picker

Allows users to enter a date either by typing it directly or by selecting it from a calendar popover. The component combines text input flexibility with a visual calendar to simplify accurate date selection.

## Usage

Use the Date Picker when users need to input a specific date while providing both manual entry and visual selection options. For scenarios requiring only simple date selection, a [Calendar Inline](/components/calendar) alone may suffice.

## Behavior

The month and the year in the calendar header are buttons. Pressing the month shows a month grid in place of the days, and pressing the year shows a scrollable grid of years. Pressing the same button again returns to the days.

- While the month grid is shown, the back/forward buttons step the month.
- While the year list is shown, they are replaced by back/forward year buttons.
- Picking a month or a year shows its days and keeps the calendar open. It changes only the displayed month, never the selected date.
- The years run from the `min` year to the `max` year when those are set, otherwise 100 years either side of the current one.
- The back/forward buttons are disabled at the `min` and `max` months, and the keys keep focus between the `min` and `max` days.
- The calendar always opens on the days. With no value, it shows the current month, or the nearest month inside `min` and `max`.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the date picker:

- `Up` / `Down` - Moves focus to the day above/below the current day.
- `Right` - Moves focus to the next day.
- `Left` - Moves focus to the previous day.
- `Enter` / `Space` - Shows and moves focus the calendar. If already shown, selects the focused day. Pressing it on the already selected day deselects it and clears the value (single date mode).
- `Home` - Selects the first day of the month.
- `End` - Selects the last day of the month.
- `PageUp` - Selects the same or closest day of the previous month.
- `PageDown` - Selects the same or closest day of the next month.
- `Tab` / `Shift+Tab` - Moves between the calendar's buttons and the days. Focus stays inside the open calendar.
- `Esc` - Closes the date picker calendar and returns focus to the control that opened it.

In the month and year grids:

- `Up` / `Down` - Moves focus to the month or year above/below the current one.
- `Left` / `Right` - Moves focus to the previous/next month or year.
- `Home` / `End` - Moves focus to the first/last month or year.
- `PageUp` / `PageDown` - Moves focus 12 years back/forward in the year grid.
- `Enter` / `Space` - Shows the days of the focused month or year, with focus on the same or closest day.
- `Tab` / `Shift+Tab` - Cycles between the calendar header buttons and the grid.
- `Esc` - Returns to the days without a change. A second `Esc` closes the calendar.

## Accessibility

The calendar popup is a modal `dialog` holding the same ARIA date grid as the [Inline Calendar](/components/inline-calendar#accessibility), including its month and year toggle buttons and grids.

## API Reference

### Component attribute(s)

```
x-h-date-picker
x-h-date-picker-trigger
x-h-date-picker-popup
```

### Attributes

#### x-h-date-picker

| Attribute | Values             | Required | Description                          |
| --------- | ------------------ | -------- | ------------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the date picker. |

#### x-h-date-picker-popup

| Attribute              | Values                                                                                                                                                                        | Required | Description                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------- |
| data-align             | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the calendar popup relative to the date picker trigger.                                     |
| data-aria-prev-year    | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous year button.                                |
| data-aria-prev-month   | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous month button.                               |
| data-aria-next-month   | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next month button.                                   |
| data-aria-next-year    | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next year button.                                    |
| data-aria-choose-month | string                                                                                                                                                                        | false    | Sets the text after the month name in the month button's `aria-label`. Defaults to `choose month`. |
| data-aria-choose-year  | string                                                                                                                                                                        | false    | Sets the text after the year in the year button's `aria-label`. Defaults to `choose year`.         |

### Modifiers

| Modifier | Description                          |
| -------- | ------------------------------------ |
| table    | Use when the input is inside a table |

### Configuration

You can pass a configuration object to the popup as an expression or as a value.

| Key            | Description                                                                                                                                                                                                                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| locale         | The locale of the calendar as a BCP 47 language tag. If not provided, it is taken from the page's `<html lang>` attribute, then the browser locale.                                                                                                                                                                |
| firstDay       | The start day of the week. `0` is Sunday.                                                                                                                                                                                                                                                                          |
| min            | The earliest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                                                                                                                                                                     |
| max            | The latest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                                                                                                                                                                       |
| options        | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) options.                                                                                                                                                        |
| delimiter      | Custom separator character between day, month, and year in the display format (e.g. `"-"`). Does not affect the model value.                                                                                                                                                                                       |
| order          | Custom display order of the date parts as a three-character string of `Y` (year), `M` (month), `D` (day) (e.g. `"MDY"` for month-day-year). Defaults to the locale's natural order. Does not affect the model value.                                                                                               |
| range          | When `true`, the picker selects a start-and-end date range instead of a single date. See [Range selection](#range-selection).                                                                                                                                                                                      |
| rangeSeparator | Text placed between the two dates in the display input when `range` is enabled. Defaults to `" - "`.                                                                                                                                                                                                               |
| placeholder    | When `true`, shows the display format as the input's placeholder, in the locale's own letters (for example `mm/dd/yyyy`, `TT.MM.JJJJ` or `年/月/日`). In range mode the format shows twice, joined by `rangeSeparator`. A format with a month name has no pattern to show, so the input keeps its own placeholder. |

### Model

The date picker reads and writes dates as `YYYY-MM-DD` strings (e.g. `"2025-06-09"`), matching the value format of a native `<input type="date">`. The display format shown in the text input is separate and can be customised via the `options` key in the calendar config.

To clear the value, delete the text in the input, click the already selected day in the calendar (single date mode), or set the bound model to an empty string. In range mode a cleared model has both `start` and `end` unset, and clicking a day of an existing range starts a new range instead of deselecting.

### Events

| Event  | Description                                                                                                                                                                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Fired on the inner input when the user picks a date from the calendar or types a valid date. The event bubbles, so a listener can be placed on the `x-h-date-picker` element. Read the new value from the bound model, as the input's own value holds the formatted display text instead. |

There is no need to use `$watch` to react to user selection - listen for `change` instead. See [Listening for changes](#listening-for-changes).

### Display format

By default the input displays the date using the user's locale. To customise it, pass [Intl.DateTimeFormat options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) via the `options` key on `x-h-date-picker-popup`. The model value always remains `YYYY-MM-DD` regardless of the display format.

```html
<div x-h-date-picker ...>
  <input type="text" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup="{ options: { day: '2-digit', month: '2-digit', year: 'numeric' } }" x-model="date"></div>
</div>
```

Manual input typed by the user is parsed using the configured display format. For formats where the month appears as a word rather than a number, parsing falls back to the browser's native `Date` constructor.

### Range selection

Set `range: true` on the popup config to let the user pick a start-and-end date range. The first click selects the start, the second completes the range (picks are ordered automatically, so clicking an earlier day second still produces a valid range). With the keyboard, press `Enter` once to set the start and again to set the end.

In range mode the model value is an object with `start` and `end` keys (each a `YYYY-MM-DD` string), and the input displays both dates joined by the `rangeSeparator` (default `" - "`):

```js
{ start: '2025-06-09', end: '2025-06-16' }
```

<LiveExample data-exclude="generator">

```html
<div x-h-date-picker x-data="{ range: { start: '', end: '' } }">
  <input type="text" id="date-input-range" />
  <button x-h-date-picker-trigger aria-label="Choose date range"></button>
  <div x-h-date-picker-popup="{ range: true }" x-model="range"></div>
</div>
```

</LiveExample>

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

<LiveExample>

```html
<div
  x-h-date-picker
  x-data="{
  date: '',
  init() {
    const d = new Date();
    this.date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <input type="text" id="date-input-1" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup x-model="date"></div>
</div>
```

</LiveExample>

### Listening for changes

<LiveExample data-exclude="generator">

```html
<div x-h-date-picker x-data="{ date: '' }" @change="console.log('Selected date:', date)">
  <input type="text" id="date-input-change" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup x-model="date"></div>
</div>
```

</LiveExample>

### With locale

With a fixed locale, the display format is known, so a placeholder can be set on the input directly.

<LiveExample data-exclude="generator">

```html
<div x-h-date-picker x-data="{ date: '' }">
  <input type="text" id="date-input-locale" placeholder="дд.мм.гггг г." />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup="{ locale: 'bg-BG', firstDay: 1 }" x-model="date"></div>
</div>
```

</LiveExample>

### With a year-first locale

In a locale that writes the year before the month, such as Japanese, Chinese or Hungarian, the year button comes before the month button.

<LiveExample data-exclude="generator">

```html
<div
  x-h-date-picker
  x-data="{
  date: '',
  init() {
    const d = new Date();
    this.date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <input type="text" id="date-input-year-first" />
  <button x-h-date-picker-trigger aria-label="日付を選択"></button>
  <div x-h-date-picker-popup="{ locale: 'ja-JP' }" x-model="date"></div>
</div>
```

</LiveExample>

### With translated labels

Translate the trigger's `aria-label` and the calendar's `data-aria-*` labels along with the locale, so screen readers announce every button in the page's language.

<LiveExample data-exclude="generator">

```html
<div
  x-h-date-picker
  x-data="{
  date: '',
  init() {
    const d = new Date();
    this.date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <input type="text" id="date-input-labels" />
  <button x-h-date-picker-trigger aria-label="Изберете дата"></button>
  <div
    x-h-date-picker-popup="{ locale: 'bg-BG', firstDay: 1 }"
    x-model="date"
    data-aria-prev-year="предишна година"
    data-aria-prev-month="предишен месец"
    data-aria-next-month="следващ месец"
    data-aria-next-year="следваща година"
    data-aria-choose-month="изберете месец"
    data-aria-choose-year="изберете година"
  ></div>
</div>
```

</LiveExample>

### With custom display format

<LiveExample data-exclude="generator">

```html
<div
  x-h-date-picker
  x-data="{
  date: '',
  init() {
    const d = new Date();
    this.date = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <input type="text" id="date-input-2" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup="{ options: { day: '2-digit', month: 'long', year: 'numeric' }, order: 'DMY' }" x-model="date"></div>
</div>
```

</LiveExample>

### With min and max dates

Days before `min` and after `max` cannot be selected. The month grid disables the months outside the range, and the year list holds only the years inside it.

<LiveExample data-exclude="generator">

```html
<div x-h-date-picker x-data="{ date: '2026-07-09' }">
  <input type="text" id="date-input-min-max" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup="{ min: '2026-07-01', max: '2026-08-31' }" x-model="date"></div>
</div>
```

</LiveExample>

### Date of birth

With `min` far in the past and `max` set to today, the year list runs from 1900 to the current year, so a birth year is a few presses away. With `placeholder: true`, the empty input shows the format to type in the page's locale.

<LiveExample data-exclude="generator">

```html
<div
  x-h-field
  x-data="{
  date: '',
  today: '',
  init() {
    const d = new Date();
    this.today = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <label x-h-label for="date-input-birth">Date of birth</label>
  <div x-h-date-picker>
    <input type="text" id="date-input-birth" />
    <button x-h-date-picker-trigger aria-label="Choose date of birth"></button>
    <div x-h-date-picker-popup="{ min: '1900-01-01', max: today, placeholder: true }" x-model="date"></div>
  </div>
</div>
```

</LiveExample>

### Small size

<LiveExample data-exclude="generator">

```html
<div x-h-date-picker data-size="sm" x-data="{ date: '2026-07-09' }">
  <input type="text" id="date-input-sm" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup x-model="date"></div>
</div>
```

</LiveExample>

### Invalid

Reacts to the native invalid state or to the `aria-invalid` attribute.

<LiveExample>

```html
<div x-h-date-picker x-data="{ date: '2026-07-09' }">
  <input type="text" id="date-input-invalid" aria-invalid="true" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup x-model="date"></div>
</div>
```

</LiveExample>

### Disabled

Set the native `disabled` attribute on the inner input to disable the whole picker.

<LiveExample>

```html
<div x-h-date-picker x-data="{ date: '2026-07-09' }">
  <input type="text" id="date-input-disabled" disabled />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup x-model="date"></div>
</div>
```

</LiveExample>

### Read-only

Set the native `readonly` attribute on the inner input. The value is shown with a muted background, and neither typing nor the calendar popover can change it.

<LiveExample>

```html
<div x-h-date-picker x-data="{ date: '2026-07-09' }">
  <input type="text" id="date-input-readonly" readonly />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-date-picker-popup x-model="date"></div>
</div>
```

</LiveExample>
