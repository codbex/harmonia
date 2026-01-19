# Date Picker

The datepicker allows the user to enter a date either through text input, or by choosing a date from a calendar popover.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the date picker:

- `Up` / `Down` — Moves focus to the day above/below the current day.
- `Right` — Moves focus to the next day.
- `Left` — Moves focus to the previous day.
- `Enter` / `Space` — Shows and moves focus the calendar. If already shown, selects the focused day.
- `Home` — Selects the first day of the month.
- `End` — Selects the last day of the month.
- `PageUp` — Selects the same or closest day of the previous month.
- `PageDown` — Selects the same or closest day of the next month.
- `Esc` — Closes the date picker calendar.

## API Reference

### Component attubute(s)

```
x-h-date-picker
x-h-date-picker-trigger
x-h-calendar
```

### Attributes

#### x-h-calendar

See [Calendar](/components/calendar)

## Examples

<ClientOnly>
<component-container>
<div x-h-date-picker x-data="{ date: new Date().toISOString() }">
  <input type="text" id="date-input-1" />
  <button x-h-button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-calendar x-model="date"></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-date-picker x-data="{ date: new Date().toISOString() }">
  <input type="text" id="date-input-1" />
  <button x-h-button x-h-date-picker-trigger aria-label="Choose date"></button>
  <div x-h-calendar x-model="date"></div>
</div>
```
