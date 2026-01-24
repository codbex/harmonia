# Time Picker

Allows users to select a specific time, providing a controlled and consistent input method for hours, minutes and seconds.

## Usage

Use the Time Picker when users need to input or select a time value, such as setting alarms.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate trough the date picker:

- `Up` / `Down` — Moves focus to the next/previous column item.
- `Tab` — Moves focus to the next column (hour -> minute -> second -> day period). If the "Now" buton is enabled, it will move focus to it first before looping back to the first column.
- `Shift` + `Tab` - Moves focus to the previous column.
- `Right` — Moves focus to the next column. Focuses the first item or the last focused/selected one.
- `Left` — Moves focus to the previous column. Focuses the first item or the last focused/selected one.
- `Enter` — Shows and moves focus the time picker popover. If already shown, selects the focused item from the first column.
- `Space` — Selects the focused item.
- `PageUp` / `Home` — Selects the first item in the column.
- `PageDown` / `End` — Selects the last item in the column.
- `Esc` — Closes the date picker calendar.

## API Reference

### Component attubute(s)

```
x-h-time-picker
x-h-time-picker-input
x-h-time-picker-popup
```

### Attributes

#### x-h-time-picker-popup

| Attribute           | Values                                                                                                                                                                        | Required | Description                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| data-label-hours    | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the hours list. Default value is `Select time`.        |
| data-label-minutes  | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the minutes list. Default value is `Select minute`.    |
| data-label-seconds  | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the seconds list. Default value is `Select second`.    |
| data-label-meridiem | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the meridiem list. Default value is `Select meridiem`. |
| data-label-now      | string                                                                                                                                                                        | false    | Label for the button that sets the current time as selected. Default value is `Now`.             |
| data-label-ok       | string                                                                                                                                                                        | false    | Label for the button that sets confirms and closes the popup. Default value is `OK`.             |
| data-align          | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the calendar popover relative to the trigger.                                             |

### Config

You can pass a configuration object to the time picker as an expression or as a value.

Example:

```html
<div x-h-time-picker="timeConfig">
  <input type="text" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
<script>
  Alpine.data('controller', () => ({
    timeConfig: { locale: 'en-US', seconds: false, is12Hour: true },
  }));
</script>
```

| Key      | Values  | Description                                                                                                                |
| -------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| locale   | string  | The locale of the time picker as a BCP 47 language tag. If not provided, it's automatically set from the user preferences. |
| seconds  | boolean | Include seconds in the picker.                                                                                             |
| is12Hour | boolean | Switches to a 12-hour mode. The day periods (meridiem) will always be displayed as `AM/PM` regardless of the locale.       |

## Examples

<ClientOnly>
<component-container>
<div x-data="{ timeConfig: { seconds: true, is12Hour: true } }" x-h-time-picker="timeConfig">
  <input type="text" id="tpi-1" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ timeConfig: { seconds: true, is12Hour: true } }" x-h-time-picker="timeConfig">
  <input type="text" id="tpi-1" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
```

<ClientOnly>
<component-container>
<div x-data="{ time: '13:33' }" x-h-time-picker>
  <input type="text" id="tpi-2" x-model="time" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ time: '13:33' }" x-h-time-picker>
  <input type="text" id="tpi-2" x-model="time" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
```
