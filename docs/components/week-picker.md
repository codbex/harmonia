# Week Picker

Allows users to select a whole ISO week, either by typing it directly or by choosing from a month calendar whose rows are weeks (Monday-first).

## Usage

Use the Week Picker when a field represents a whole week (a timesheet week, a planning week, a weekly report) rather than a single day. For a specific day use the [Date Picker](/components/date-picker) instead.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the week picker:

- `Enter` / `Space` - Opens the popup, or selects the focused week when open.
- `Up` / `Down` - Moves focus to the previous/next week, moving the visible month when needed.
- `Home` / `End` - Moves focus to the first/last visible week.
- `PageUp` / `PageDown` - Moves focus to the same week of the previous/next month.
- `Esc` - Closes the popup.

## API Reference

### Component attribute(s)

```
x-h-week-picker
x-h-week-picker-trigger
x-h-week-picker-popup
```

### Attributes

#### x-h-week-picker

| Attribute | Values             | Required | Description                          |
| --------- | ------------------ | -------- | ------------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the week picker. |

#### x-h-week-picker-popup

| Attribute              | Values                                                                                                                                                                        | Required | Description                                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| data-align             | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the popup relative to the picker trigger.                                                                       |
| data-aria-prev-month   | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the previous month button.                                                   |
| data-aria-next-month   | string                                                                                                                                                                        | false    | Sets the `aria-label` attribute value for the next month button.                                                       |
| data-week-label        | string                                                                                                                                                                        | false    | Sets the text placed before the week number in the input display value and in the week row labels. Defaults to `Week`. |
| data-week-column-label | string                                                                                                                                                                        | false    | Sets the accessible label of the week number column header (shown as `#`). Defaults to `Week number`.                  |

### Modifiers

| Modifier | Description                          |
| -------- | ------------------------------------ |
| table    | Use when the input is inside a table |

### Configuration

You can pass a configuration object to the popup as an expression or as a value.

| Key    | Description                                                                                                                                         |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| locale | The locale of the calendar as a BCP 47 language tag. If not provided, it is taken from the page's `<html lang>` attribute, then the browser locale. |

### Model

The week picker reads and writes weeks as ISO 8601 `YYYY-Www` strings (e.g. `"2025-W23"`). The week-numbering year follows ISO 8601 (the week containing the year's first Thursday is week 1), so early-January and late-December weeks may carry the neighbouring year. The text input displays the selection as `Week <n>, <year>` by default. The `Week` text can be customised via `data-week-label` on the popup.

### Events

| Event  | Description                                                                                                                                                                                                                                                                            |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Fired on the inner input when the user picks a week from the popup or types a valid week. The event bubbles, so a listener can be placed on the `x-h-week-picker` element. Read the new value from the bound model, as the input's own value holds the formatted display text instead. |

There is no need to use `$watch` to react to user selection - listen for `change` instead. See [Listening for changes](#listening-for-changes).

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

<LiveExample>

```html
<div x-h-week-picker x-data="{ week: '' }">
  <input type="text" id="week-input-1" />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="week"></div>
</div>
```

</LiveExample>

### Listening for changes

<LiveExample data-exclude="generator">

```html
<div x-h-week-picker x-data="{ week: '' }" @change="console.log('Selected week:', week)">
  <input type="text" id="week-input-change" />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="week"></div>
</div>
```

</LiveExample>

### With locale

<LiveExample data-exclude="generator">

```html
<div x-h-week-picker x-data="{ week: '2026-W07' }">
  <input type="text" id="week-input-locale" />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup="{ locale: 'bg-BG' }" x-model="week"></div>
</div>
```

</LiveExample>

### Preselected value

<LiveExample data-exclude="generator">

```html
<div x-h-week-picker x-data="{ week: '2026-W07' }">
  <input type="text" id="week-input-preselected" />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="week"></div>
</div>
```

</LiveExample>

### Invalid

Reacts to the native invalid state or to the `aria-invalid` attribute.

<LiveExample>

```html
<div x-h-week-picker x-data="{ week: '2026-W07' }">
  <input type="text" id="week-input-invalid" aria-invalid="true" />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="week"></div>
</div>
```

</LiveExample>

### Disabled

Set the native `disabled` attribute on the inner input to disable the whole picker.

<LiveExample>

```html
<div x-h-week-picker x-data="{ week: '2026-W07' }">
  <input type="text" id="week-input-disabled" disabled />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="week"></div>
</div>
```

</LiveExample>

### Read-only

Set the native `readonly` attribute on the inner input. The value is shown with a muted background, and neither typing nor the popup can change it.

<LiveExample>

```html
<div x-h-week-picker x-data="{ week: '2026-W07' }">
  <input type="text" id="week-input-readonly" readonly />
  <button x-h-week-picker-trigger aria-label="Choose week"></button>
  <div x-h-week-picker-popup x-model="week"></div>
</div>
```

</LiveExample>
