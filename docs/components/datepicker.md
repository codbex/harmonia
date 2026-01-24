# Date Picker

Allows users to enter a date either by typing it directly or by selecting it from a calendar popover. The component combines text input flexibility with a visual calendar to simplify accurate date selection.

## Usage

Use the Date Picker when users need to input a specific date while providing both manual entry and visual selection options. For scenarios requiring only simple date selection, a [Calendar](/components/calendar) alone may suffice.

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
