# Calendar

Allows users to view and select dates within a monthly or yearly context. The component provides navigation between months and years.

## Usage

Use the calendar when users need to choose specific dates, such as scheduling events. For filtering data by date, use a [Date Picker](/components/datepicker). Make sure it is paired with clear labels and context to prevent confusion, especially when selecting critical dates.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the calendar:

- `Up` / `Down` — Moves focus to the day above/below the current day.
- `Right` — Moves focus to the next day.
- `Left` — Moves focus to the previous day.
- `Enter` / `Space` — Selects the focused day.
- `Home` — Selects the first day of the month.
- `End` — Selects the last day of the month.
- `PageUp` — Selects the same or closest day of the previous month.
- `PageDown` — Selects the same or closest day of the next month.

## API Reference

### Component attubute(s)

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

### Events

| Event  | Description                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------------- |
| change | Triggered when the value or model has changed. The date is passed in the `event.detail` object under the `date` key. |

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

| Key        | Description                                                                                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locale     | The locale of the calendar as a BCP 47 language tag. If not provided, it's automatically set from the user preferences.                                     |
| firstDay   | The start day of the week. `0` is Sunday.                                                                                                                   |
| min        | The earliest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                              |
| max        | The latest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                |
| modelAsIso | The value saved in the model will be an ISO 8601 datetime string, regardless of locale and the format displayed in the input.                               |
| options    | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) options. |

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
<div x-data="{ caldate: new Date().toISOString() }">
  <div x-h-calendar="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ caldate: new Date().toISOString() }">
  <div x-h-calendar="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
```
