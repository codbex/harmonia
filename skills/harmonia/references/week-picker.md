# Week Picker

Allows users to select a whole ISO week, either by typing it directly or by choosing from a month calendar whose rows are weeks (Monday-first). Reads and writes the same `YYYY-Www` value as a native `<input type="week">`.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use the Week Picker when a field represents a whole week (a timesheet week, a planning week, a weekly report) rather than a single day. For a specific day use the Date Picker instead.

## Directives

`x-h-week-picker` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-week-picker`
- `x-h-week-picker-trigger`
- `x-h-week-picker-popup`

## API

### Attributes

#### x-h-week-picker-popup

| Attribute            | Values                                                                                                                                                                        | Required | Description                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| data-align           | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the popup relative to the picker trigger.                     |
| data-aria-prev-month | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous month button. |
| data-aria-next-month | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next month button.     |

### Modifiers

| Modifier | Description                          |
| -------- | ------------------------------------ |
| table    | Use when the input is inside a table |

### Configuration

You can pass a configuration object to the popup as an expression or as a value.

| Key    | Description                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------- |
| locale | The locale of the calendar as a BCP 47 language tag. If not provided, it is taken from the user's browser settings. |

### Model

The week picker reads and writes weeks as ISO 8601 `YYYY-Www` strings (e.g. `"2025-W23"`), matching the value format of a native `<input type="week">`. The week-numbering year follows ISO 8601 (the week containing the year's first Thursday is week 1), so early-January and late-December weeks may carry the neighbouring year. The text input displays the selection as `Week <n>, <year>`.

## Keyboard Handling

- `Enter` / `Space` - Opens the popup, or selects the focused week when open.
- `Tab` - Moves between the month navigation buttons and the week rows.
- `Esc` - Closes the popup.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

```html
<div x-h-week-picker>
  <input type="text" />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="timesheetWeek"></div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/week-picker.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
