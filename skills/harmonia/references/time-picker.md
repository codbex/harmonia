# Time Picker

Allows users to select a specific time, providing a controlled and consistent input method for hours, minutes and seconds.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use the Time Picker when users need to input or select a time value, such as setting alarms.

## Directives

`x-h-time-picker` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-time-picker`
- `x-h-time-picker-input`
- `x-h-time-picker-popup`

## API

### Attributes

#### x-h-time-picker

| Attribute | Values             | Required | Description                          |
| --------- | ------------------ | -------- | ------------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the time picker. |

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

### Modifiers

#### x-h-time-picker

| Modifier | Description                          |
| -------- | ------------------------------------ |
| table    | Use when the input is inside a table |

### Model

When using `x-model` on `x-h-time-picker-input`, the time picker reads and writes times as `HH:MM` strings in 24-hour format (e.g. `"13:30"`). With seconds enabled, the format is `HH:MM:SS` (e.g. `"13:30:45"`).

The `is12Hour` option only affects the popup display - the model value is always in 24-hour format regardless of the display mode.

### Events

| Event  | Description                                                                                                                                                                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Fired on the `x-h-time-picker-input` element when the user selects a time from the popup. The event bubbles, so a listener can be placed on the `x-h-time-picker` element. Read the new value from the bound model, as the input's own value holds the display text. |

There is no need to use `$watch` to react to user selection - listen for `change` instead. See Listening for changes.

### Configuration

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

| Key      | Values  | Description                                                                                                                                                                            |
| -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locale   | string  | The locale of the time picker as a BCP 47 language tag. If not provided, it is taken from the page's `<html lang>` attribute, then the browser locale.                                 |
| seconds  | boolean | Include seconds in the picker.                                                                                                                                                         |
| is12Hour | boolean | Set to `true` to switch the popup to 12-hour display mode. The day periods (meridiem) are always displayed as `AM/PM`. Defaults to `false`. The model value remains in 24-hour format. |

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See Fieldset for details.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the time picker:

- `Up` / `Down` - Moves focus to the next/previous column item.
- `Tab` - Moves focus to the next column (hour -> minute -> second -> day period). If the "Now" button is enabled, it will move focus to it first before looping back to the first column.
- `Shift` + `Tab` - Moves focus to the previous column.
- `Right` - Moves focus to the next column. Focuses the first item or the last focused/selected one.
- `Left` - Moves focus to the previous column. Focuses the first item or the last focused/selected one.
- `Enter` - Shows and moves focus the time picker popover. If already shown, selects the focused item from the first column.
- `Space` - Selects the focused item.
- `PageUp` / `Home` - Selects the first item in the column.
- `PageDown` / `End` - Selects the last item in the column.
- `Esc` - Closes the time picker popover.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

```html
<div x-data="{ timeConfig: { seconds: true, is12Hour: true } }" x-h-time-picker="timeConfig">
  <input type="text" id="tpi-1" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
```

```html
<div x-data="{ time: '13:33' }" x-h-time-picker>
  <input type="text" id="tpi-2" x-model="time" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
```

### Listening for changes

```html
<div x-data="{ time: '' }" x-h-time-picker @change="console.log('Selected time:', time)">
  <input type="text" id="tpi-3" x-model="time" x-h-time-picker-input />
  <div x-h-time-picker-popup></div>
</div>
```

### Invalid

Reacts to the native invalid state or to the `aria-invalid` attribute.

```html
<div x-data="{ time: '13:33' }" x-h-time-picker>
  <input type="text" id="tpi-invalid" x-model="time" x-h-time-picker-input aria-invalid="true" />
  <div x-h-time-picker-popup></div>
</div>
```

### Disabled

Set the native `disabled` attribute on the inner input to disable the whole picker.

```html
<div x-data="{ time: '13:33' }" x-h-time-picker>
  <input type="text" id="tpi-disabled" x-model="time" x-h-time-picker-input disabled />
  <div x-h-time-picker-popup></div>
</div>
```

### Read-only

Set the native `readonly` attribute on the inner input. The value is shown with a muted background, and the popup cannot be opened.

```html
<div x-data="{ time: '13:33' }" x-h-time-picker>
  <input type="text" id="tpi-readonly" x-model="time" x-h-time-picker-input readonly />
  <div x-h-time-picker-popup></div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/time-picker.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
