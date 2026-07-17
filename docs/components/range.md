# Range

Lets users select a numeric value, or a range between two values, by dragging a handle along a track. Supports horizontal and vertical orientations, step snapping, optional value tooltips, and binds through `x-model`. The slider wraps a native input, so the value participates in forms and validation.

## Usage

Use range sliders for selecting numeric values within a defined range, such as volume, price, or time intervals. Avoid using sliders for exact numeric input as precision can be difficult with dragging alone. For precise values, pair the slider with a visible readout or an [Input](/components/input).

The element must contain a native `<input>` as a direct child. The slider hides it and keeps its value in sync (`low,high` in dual mode), while the input carries everything form-related: the submitted `name`, the `disabled` state, constraints, custom validity, and `aria-invalid`. A form reset restores the slider to its initial values.

## Keyboard Handling

Each handle is focusable and supports:

- `Right` / `Up` - Increase the value by one step (`Right` and `Left` swap in right-to-left layouts).
- `Left` / `Down` - Decrease the value by one step.
- `Page Up` / `Page Down` - Increase or decrease the value by ten steps.
- `Home` - Set the minimum value.
- `End` - Set the maximum value.

In dual mode the two handles cannot cross, so `Home` on the upper handle stops at the lower handle's value and `End` on the lower handle stops at the upper handle's value.

## Accessibility

Every handle exposes `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` and `aria-orientation`. When `data-unit` is set, a matching `aria-valuetext` (e.g. "42%") is announced as well. In dual mode the element itself becomes a `role="group"` named by `data-label`, and the handles receive the `data-min-label` / `data-max-label` names. While the inner input is invalid (or carries `aria-invalid`), the handles are marked `aria-invalid` so the state is announced. Pointer dragging, track clicks, and full keyboard operation are all supported, and pressing the track moves the nearest handle.

## API Reference

### Component attribute(s)

```
x-h-range
```

### Attributes

| Attribute      | Values            | Required | Description                                                                                                  |
| -------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| data-min       | number            | false    | Lowest selectable value (default: `0`).                                                                      |
| data-max       | number            | false    | Highest selectable value (default: `100`).                                                                   |
| data-step      | number            | false    | Step the values snap to (default: `1`).                                                                      |
| data-value     | number            | false    | Initial value when no `x-model` is bound. In dual mode, two comma-separated values (e.g. `"20,80"`).         |
| data-tooltips  | `true`<br/>`auto` | false    | Shows the current value in a tooltip at each handle. With `auto`, only while a handle is dragged or focused. |
| data-unit      | string            | false    | Suffix appended to tooltip text and `aria-valuetext` (e.g. `"%"`).                                           |
| data-label     | string            | false    | Accessible name for the handle (default: `"Value"`), or for the group in dual mode (default: `"Range"`).     |
| data-min-label | string            | false    | Accessible name for the lower handle in dual mode (default: `"Minimum"`).                                    |
| data-max-label | string            | false    | Accessible name for the upper handle in dual mode (default: `"Maximum"`).                                    |

### Modifiers

| Modifier | Description                                                   |
| -------- | ------------------------------------------------------------- |
| vertical | Renders a vertical slider. Give the element a height.         |
| dual     | Renders two handles for selecting a range between two values. |

### Model

Bind a number with `x-model`, or an array of two numbers (`[low, high]`) in dual mode. The model updates live while a handle is dragged. Values coming from the model are clamped to the `data-min` / `data-max` bounds and snapped to `data-step` for display.

### Events

| Event  | Description                                                                                       |
| ------ | ------------------------------------------------------------------------------------------------- |
| input  | Fired continuously while a handle moves. The current value is in `event.detail`.                  |
| change | Fired when a handle is released or after a keyboard change. The final value is in `event.detail`. |

### Validation timing

By default this control shows native-constraint errors only after the user attempts to submit the form, since the inner input is never edited directly. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` on the inner input always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

### Default

<LiveExample>

```html
<div x-data="{ volume: 40 }" class="flex items-center gap-4">
  <div x-h-range x-model="volume" data-label="Volume">
    <input type="text" name="volume" />
  </div>
  <span class="w-12 text-right" x-text="volume"></span>
</div>
```

</LiveExample>

### Dual handles

<LiveExample>

```html
<div x-data="{ price: [20, 80] }" class="flex items-center gap-4">
  <div x-h-range.dual x-model="price" data-label="Price range">
    <input type="text" name="price" />
  </div>
  <span class="w-12 text-right" x-text="price[0] + '-' + price[1]"></span>
</div>
```

</LiveExample>

### Vertical

<LiveExample data-class="flex items-start gap-8">

```html
<div x-h-range.vertical data-value="30" data-label="Balance" style="height: 10rem">
  <input type="text" name="balance" />
</div>
<div x-h-range.vertical.dual data-value="20,60" data-label="Working hours" style="height: 10rem">
  <input type="text" name="hours" />
</div>
```

</LiveExample>

### Tooltips

Set `data-tooltips="true"` for always-visible value tooltips, or `data-tooltips="auto"` to show them only while a handle is dragged or focused.

<LiveExample data-class="flex flex-col gap-10 pt-8">

```html
<div x-h-range data-value="40" data-tooltips="true" data-unit="%" data-label="Humidity">
  <input type="text" name="humidity" />
</div>
<div x-h-range.dual data-value="20,80" data-tooltips="auto" data-unit="%" data-label="Brightness range">
  <input type="text" name="brightness" />
</div>
```

</LiveExample>

### Steps and bounds

<LiveExample data-class="flex flex-col gap-4">

```html
<div x-data="{ rating: 6 }" class="flex items-center gap-4">
  <div x-h-range x-model="rating" data-min="1" data-max="8" data-step="1" data-label="Rating">
    <input type="text" name="rating" />
  </div>
  <span class="w-12 text-right" x-text="rating"></span>
</div>
<div x-data="{ opacity: 0.5 }" class="flex items-center gap-4">
  <div x-h-range x-model="opacity" data-min="0" data-max="1" data-step="0.1" data-label="Opacity">
    <input type="text" name="opacity" />
  </div>
  <span class="w-12 text-right" x-text="opacity"></span>
</div>
```

</LiveExample>

### Invalid

Reacts to the native invalid state or to the `aria-invalid` attribute set on the inner input. Native errors appear after a submit attempt: drag the second slider above 50 and press Submit, then drag it back to clear the error.

<LiveExample data-class="flex flex-col gap-6">

```html
<div x-h-range data-value="40" data-label="Volume">
  <input type="text" name="volume" aria-invalid="true" />
</div>
<form x-data @submit.prevent class="flex flex-col items-start gap-4">
  <div x-h-range data-value="40" data-label="Budget" @input="$refs.budget.setCustomValidity($event.detail > 50 ? 'Keep the budget at 50 or below' : '')">
    <input type="text" name="budget" x-ref="budget" />
  </div>
  <button x-h-button type="submit">Submit</button>
</form>
```

</LiveExample>

### Disabled

Set the native `disabled` attribute on the inner input to disable the slider.

<LiveExample>

```html
<div x-h-range data-value="40" data-label="Volume">
  <input type="text" name="volume" disabled />
</div>
```

</LiveExample>
