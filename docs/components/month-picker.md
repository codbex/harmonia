# Month Picker

Allows users to select a month and year, either by typing it directly or by choosing from a popup of a year header and a twelve-month grid.

## Usage

Use the Month Picker when a field represents a whole month (a reporting period, a billing month, a statement month) rather than a specific day. For a specific day use the [Date Picker](/components/date-picker) instead.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the month picker:

- `Enter` / `Space` - Opens the popup, or selects the focused month when open.
- `Left` / `Right` - Moves focus to the previous/next month, crossing into the previous/next year from January/December.
- `Up` / `Down` - Moves focus one row (three months) up/down.
- `Home` / `End` - Moves focus to January/December of the shown year.
- `PageUp` / `PageDown` - Moves focus to the same month of the previous/next year.
- `Esc` - Closes the popup.

## API Reference

### Component attribute(s)

```
x-h-month-picker
x-h-month-picker-trigger
x-h-month-picker-popup
```

### Attributes

#### x-h-month-picker

| Attribute | Values             | Required | Description                           |
| --------- | ------------------ | -------- | ------------------------------------- |
| data-size | `sm`<br/>`default` | false    | Changes the size of the month picker. |

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

Some locales, such as `bg-BG`, conventionally abbreviate months numerically, so the popup grid shows numbers there. The text input is unaffected because it uses the full month name.

### Model

The month picker reads and writes months as `YYYY-MM` strings (e.g. `"2025-06"`). The text input displays the month using the user's locale (e.g. "June 2025"). The model value is unaffected by the display format.

### Events

| Event  | Description                                                                                                                                                                                                                                                                               |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Fired on the inner input when the user picks a month from the popup or types a valid month. The event bubbles, so a listener can be placed on the `x-h-month-picker` element. Read the new value from the bound model, as the input's own value holds the formatted display text instead. |

There is no need to use `$watch` to react to user selection - listen for `change` instead. See [Listening for changes](#listening-for-changes).

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

<LiveExample>

```html
<div
  x-h-month-picker
  x-data="{
  month: '',
  init() {
    const d = new Date();
    this.month = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  }
}"
>
  <input type="text" id="month-input-1" />
  <button x-h-month-picker-trigger aria-label="Choose month"></button>
  <div x-h-month-picker-popup x-model="month"></div>
</div>
```

</LiveExample>

### Listening for changes

<LiveExample data-exclude="generator">

```html
<div x-h-month-picker x-data="{ month: '' }" @change="console.log('Selected month:', month)">
  <input type="text" id="month-input-change" />
  <button x-h-month-picker-trigger aria-label="Choose month"></button>
  <div x-h-month-picker-popup x-model="month"></div>
</div>
```

</LiveExample>

### With locale

<LiveExample data-exclude="generator">

```html
<div x-h-month-picker x-data="{ month: '2026-07' }">
  <input type="text" id="month-input-locale" />
  <button x-h-month-picker-trigger aria-label="Choose month"></button>
  <div x-h-month-picker-popup="{ locale: 'bg-BG' }" x-model="month"></div>
</div>
```

</LiveExample>

### Disabled

Set the native `disabled` attribute on the inner input to disable the whole picker.

<LiveExample>

```html
<div x-h-month-picker x-data="{ month: '2026-07' }">
  <input type="text" id="month-input-disabled" disabled />
  <button x-h-month-picker-trigger aria-label="Choose month"></button>
  <div x-h-month-picker-popup x-model="month"></div>
</div>
```

</LiveExample>

### Read-only

Set the native `readonly` attribute on the inner input. The value is shown with a muted background, and neither typing nor the popup can change it.

<LiveExample>

```html
<div x-h-month-picker x-data="{ month: '2026-07' }">
  <input type="text" id="month-input-readonly" readonly />
  <button x-h-month-picker-trigger aria-label="Choose month"></button>
  <div x-h-month-picker-popup x-model="month"></div>
</div>
```

</LiveExample>
