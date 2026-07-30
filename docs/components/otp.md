# One-Time Password Input

`x-h-otp` turns a native input into one or more groups of single-character cells for entering a verification code or PIN. The inner input keeps carrying the value, the field name, and any native constraints, so the code submits and validates as one string.

## Usage

Wrap a native `<input>` in an element carrying `x-h-otp`, then add an `x-h-otp-group` for each run of cells. Every group declares its own `data-length`, and the full code is the groups read left to right. Put an `x-h-otp-separator` between two groups to show a visual break, with whatever text you want as its content.

The input stays in the markup but is visually hidden. It holds the joined value, the `name` submitted with the form, and constraints such as `required`. Bind `x-model` to it to read the code. The control matches the height of a standard [Input](/components/input) and takes the same `data-size` on the root, which applies to every group.

Typing fills the cells left to right and advances automatically, including across group boundaries, and pasting a full code distributes it across all of them.

## Keyboard Handling

- `0-9` (and letters when alphanumeric) - Fill the focused cell and move to the next one.
- `Backspace` - Clear the focused cell, or clear the previous cell and move back when the focused one is already empty.
- `Delete` - Clear the focused cell without moving.
- `Left` / `Right` - Move between cells, following the writing direction.
- `Home` / `End` - Jump to the first or last cell.
- `Tab` - Move out of the control, which is a single tab stop from the outside.

Pasting works from any cell and fills forward from it, so a partially entered code can be corrected without clearing it first.

## Accessibility

The cells are grouped in a `role="group"` labelled "One-time password" by default. Set an `aria-label` or `aria-labelledby` on the element to give it a more meaningful name. Each cell gets its own label ("Digit 1 of 6") counting across every group, so screen readers announce the position in the whole code, and `data-cell-label` overrides the template. Separators are decorative and hidden from assistive technologies.

The inner input's `disabled`, `readonly`, `required`, and `aria-invalid` states are mirrored onto every cell, so the control announces and styles correctly without duplicating those attributes on the groups.

## API Reference

### Component attribute(s)

```
x-h-otp
x-h-otp-group
x-h-otp-separator
```

### Attributes

#### x-h-otp

| Attribute       | Type                          | Required | Description                                                                                                                  |
| --------------- | ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| data-type       | `numeric`<br />`alphanumeric` | false    | Characters the cells accept. Defaults to `numeric`.                                                                          |
| data-mask       | boolean                       | false    | Hides the entered characters, for a PIN.                                                                                     |
| data-value      | string                        | false    | Initial code. Falls back to the inner input's own value.                                                                     |
| data-cell-label | string                        | false    | Template for each cell's accessible name. `{index}` and `{length}` are substituted. Defaults to `Digit {index} of {length}`. |
| data-size       | `sm`                          | false    | Renders smaller cells. Applies to every group.                                                                               |

#### x-h-otp-group

| Attribute   | Type   | Required | Description                    |
| ----------- | ------ | -------- | ------------------------------ |
| data-length | number | true     | Number of cells in this group. |

### Model

Bind a string with `x-model` on the inner input. The value is the concatenated code with no separators, and it updates on every character, paste, and clear. Setting it externally refills the cells, and characters outside the configured type are ignored.

### Events

Events are dispatched on the inner input, except `complete` which is dispatched on the root.

| Event    | Description                                                                              |
| -------- | ---------------------------------------------------------------------------------------- |
| input    | Fired on every change to the code.                                                       |
| change   | Fired alongside `input` when the user edits or pastes.                                   |
| complete | Fired once when the last empty cell is filled. The full code is in `event.detail.value`. |

### Validation timing

By default this control shows native-constraint errors only after the user attempts to submit the form, since the inner input is never edited directly. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` on the inner input always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

### Basic

<LiveExample data-exclude="generator">

```html
<div x-h-otp>
  <input name="code" />
  <div x-h-otp-group data-length="6"></div>
</div>
```

</LiveExample>

### Grouped

<LiveExample>

```html
<div x-h-otp>
  <input name="grouped" />
  <div x-h-otp-group data-length="3"></div>
  <div x-h-otp-separator>-</div>
  <div x-h-otp-group data-length="3"></div>
</div>
```

</LiveExample>

### PIN

<LiveExample>

```html
<div x-h-otp data-mask aria-label="PIN">
  <input name="pin" />
  <div x-h-otp-group data-length="4"></div>
</div>
```

</LiveExample>

### Alphanumeric

<LiveExample data-exclude="generator">

```html
<div x-h-otp data-type="alphanumeric">
  <input name="serial" />
  <div x-h-otp-group data-length="4"></div>
  <div x-h-otp-separator>-</div>
  <div x-h-otp-group data-length="4"></div>
</div>
```

</LiveExample>

### Small

<LiveExample data-exclude="generator">

```html
<div x-h-otp data-size="sm">
  <input name="small" />
  <div x-h-otp-group data-length="3"></div>
  <div x-h-otp-separator>-</div>
  <div x-h-otp-group data-length="3"></div>
</div>
```

</LiveExample>

### Binding a value

<LiveExample data-exclude="generator">

```html
<div x-data="{ code: '' }">
  <div x-h-otp>
    <input name="verification" x-model="code" />
    <div x-h-otp-group data-length="3"></div>
    <div x-h-otp-separator>-</div>
    <div x-h-otp-group data-length="3"></div>
  </div>
  <p class="mt-4 text-sm text-muted-foreground">Code: <span x-text="code || 'empty'"></span></p>
</div>
```

</LiveExample>

### Reacting to completion

<LiveExample data-exclude="generator">

```html
<div x-data="{ status: 'Waiting for the full code' }">
  <div x-h-otp @complete="status = 'Submitted ' + $event.detail.value">
    <input name="confirm" />
    <div x-h-otp-group data-length="4"></div>
  </div>
  <p class="mt-4 text-sm text-muted-foreground" x-text="status"></p>
</div>
```

</LiveExample>

### Disabled

<LiveExample>

```html
<div x-h-otp data-value="4821">
  <input name="disabled-code" disabled />
  <div x-h-otp-group data-length="3"></div>
  <div x-h-otp-separator>-</div>
  <div x-h-otp-group data-length="3"></div>
</div>
```

</LiveExample>

### In a field

<LiveExample data-exclude="generator">

```html
<div x-h-field>
  <label x-h-label>Verification code</label>
  <div x-h-otp>
    <input name="required-code" required minlength="6" />
    <div x-h-otp-group data-length="6"></div>
  </div>
  <p x-h-field-description>Enter the six-digit code we sent you.</p>
</div>
```

</LiveExample>
