# Calendar

Allows users to view and select dates within a monthly or yearly context. The component provides navigation between months and years.

## Usage

Use the calendar when users need to choose specific dates, such as scheduling events. For filtering data by date, use a [Date Picker](/components/datepicker). Make sure it is paired with clear labels and context to prevent confusion, especially when selecting critical dates.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the calendar:

- `Up` / `Down` - Moves focus to the day above/below the current day.
- `Right` - Moves focus to the next day.
- `Left` - Moves focus to the previous day.
- `Enter` / `Space` - Selects the focused day.
- `Home` - Selects the first day of the month.
- `End` - Selects the last day of the month.
- `PageUp` - Selects the same or closest day of the previous month.
- `PageDown` - Selects the same or closest day of the next month.

## API Reference

### Component attribute(s)

```
x-h-calendar
```

### Attributes

| Attribute            | Values                                                                                                                                                                        | Required | Description                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| data-aria-prev-year  | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous year button.  |
| data-aria-prev-month | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous month button. |
| data-aria-next-month | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next month button.     |
| data-aria-next-year  | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next year button.      |
| data-align           | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the calendar popover relative to the trigger.                 |

### Model

When using `x-model`, the calendar reads and writes dates as `YYYY-MM-DD` strings (e.g. `"2025-06-09"`). Set the bound variable to a `YYYY-MM-DD` string to pre-select a date, or to an empty string for no initial selection. On every selection the model is updated to the newly selected date in the same `YYYY-MM-DD` format.

Full ISO datetime strings (e.g. from `new Date().toISOString()`) are also accepted as input, but initialising with `YYYY-MM-DD` is recommended to avoid timezone-related date drift.

### Events

| Event  | Description                                                                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Triggered when the selected date changes. The selected `Date` object is passed in `event.detail.date`. |

### Config

You can pass a configuration object to the calendar as an expression or as a value.

Example:

```html
<div x-h-calendar="calConfig"></div>
<script>
  Alpine.data('controller', () => ({
    calConfig: { locale: 'en-US', firstDay: 1, min: '2025-01-10', max: '2025-12-20' },
  }));
</script>
```

| Key      | Description                                                                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locale   | The locale of the calendar as a BCP 47 language tag. If not provided, it's automatically set from the user preferences.                                     |
| firstDay | The start day of the week. `0` is Sunday.                                                                                                                   |
| min      | The earliest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                              |
| max      | The latest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                |
| options  | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) options. |

## Examples

<ClientOnly>
<component-container>
<div x-data>
  <div x-h-calendar @change="console.log('Selected:', $event.detail.date)"></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data>
  <div x-h-calendar @change="console.log('Selected:', $event.detail.date)"></div>
</div>
```

<ClientOnly>
<component-container>
<div
  x-data="{
  caldate: '',
  init() {
    const d = new Date();
    this.caldate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <div x-h-calendar="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
</component-container>
</ClientOnly>

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
  <div x-h-calendar="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
```
