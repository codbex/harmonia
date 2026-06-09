# Date Picker

Allows users to enter a date either by typing it directly or by selecting it from a calendar popover. The component combines text input flexibility with a visual calendar to simplify accurate date selection.

## Usage

Use the Date Picker when users need to input a specific date while providing both manual entry and visual selection options. For scenarios requiring only simple date selection, a [Calendar](/components/calendar) alone may suffice.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the date picker:

- `Up` / `Down` - Moves focus to the day above/below the current day.
- `Right` - Moves focus to the next day.
- `Left` - Moves focus to the previous day.
- `Enter` / `Space` - Shows and moves focus the calendar. If already shown, selects the focused day.
- `Home` - Selects the first day of the month.
- `End` - Selects the last day of the month.
- `PageUp` - Selects the same or closest day of the previous month.
- `PageDown` - Selects the same or closest day of the next month.
- `Esc` - Closes the date picker calendar.

## API Reference

### Component attribute(s)

```
x-h-date-picker
x-h-date-picker-trigger
x-h-calendar
```

### Attributes

#### x-h-date-picker

| Attribute | Values             | Required | Description                          |
| --------- | ------------------ | -------- | ------------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the date picker. |

### Modifiers

| Modifier | Description                          |
| -------- | ------------------------------------ |
| table    | Use when the input is inside a table |

#### x-h-calendar

See [Calendar](/components/calendar)

### Model

The date picker reads and writes dates as `YYYY-MM-DD` strings (e.g. `"2025-06-09"`), matching the value format of a native `<input type="date">`. The display format shown in the text input is separate and can be customised via the `options` key in the calendar config.

### Display format

By default the input displays the date using the user's locale. To customise it, pass [Intl.DateTimeFormat options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) via the `options` key on `x-h-calendar`. The model value always remains `YYYY-MM-DD` regardless of the display format.

```html
<div x-h-date-picker ...>
  <input type="text" />
  <button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-calendar="{ options: { day: '2-digit', month: '2-digit', year: 'numeric' } }" x-model="date"></div>
</div>
```

Manual input typed by the user is parsed using the configured display format. For formats where the month appears as a word rather than a number, parsing falls back to the browser's native `Date` constructor.

## Examples

<ClientOnly>
<component-container>
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
  <div x-h-calendar x-model="date"></div>
</div>
</component-container>
</ClientOnly>

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
  <div x-h-calendar x-model="date"></div>
</div>
```

### With custom display format

<ClientOnly>
<component-container>
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
  <div x-h-calendar="{ options: { day: '2-digit', month: 'long', year: 'numeric' } }" x-model="date"></div>
</div>
</component-container>
</ClientOnly>

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
  <div x-h-calendar="{ options: { day: '2-digit', month: 'long', year: 'numeric' } }" x-model="date"></div>
</div>
```
