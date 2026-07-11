# Month Picker

Allows users to select a month and year, either by typing it directly or by choosing from a popup of a year header and a twelve-month grid. Reads and writes the same `YYYY-MM` value as a native `<input type="month">`.

## Usage

Use the Month Picker when a field represents a whole month (a reporting period, a billing month, a statement month) rather than a specific day. For a specific day use the [Date Picker](/components/date-picker) instead.

## Keyboard Handling

- `Enter` / `Space` - Opens the popup, or selects the focused month when open.
- `Tab` - Moves between the year navigation buttons and the month grid.
- `Esc` - Closes the popup.

## API Reference

### Component attribute(s)

```
x-h-month-picker
x-h-month-picker-trigger
x-h-month-picker-popup
```

### Attributes

#### x-h-month-picker-popup

| Attribute           | Values                                                                                                                                                                        | Required | Description                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------- |
| data-align          | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the popup relative to the picker trigger.                    |
| data-aria-prev-year | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous year button. |
| data-aria-next-year | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next year button.     |

### Modifiers

| Modifier | Description                          |
| -------- | ------------------------------------ |
| table    | Use when the input is inside a table |

### Configuration

You can pass a configuration object to the popup as an expression or as a value.

| Key    | Description                                                                                                            |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| locale | The locale of the month names as a BCP 47 language tag. If not provided, it is taken from the user's browser settings. |

### Model

The month picker reads and writes months as `YYYY-MM` strings (e.g. `"2025-06"`), matching the value format of a native `<input type="month">`. The text input displays the month using the user's locale (e.g. "June 2025"); the model value is unaffected by the display format.

## Examples

```html
<div x-h-month-picker>
  <input type="text" />
  <button x-h-month-picker-trigger aria-label="Choose month"></button>
  <div x-h-month-picker-popup x-model="reportMonth"></div>
</div>
```
