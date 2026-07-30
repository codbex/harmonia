# Rating

Lets users view and set a star rating. Supports half-star precision, keyboard input, and binds to a number through `x-model`.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use a Rating to capture or display a subjective score, such as a product review or a satisfaction level. Keep the scale small and consistent (five stars is the familiar default) and label what is being rated. Set `aria-disabled="true"` to show an existing average or a score the user cannot change. For choosing one option from a set that is not a score, use Radio instead.

## Directive

- `x-h-rating`

## API

### Attributes

| Attribute        | Values                      | Required | Description                                                                                                                  |
| ---------------- | --------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| data-max         | number                      | false    | Number of stars (Defaults to `5`).                                                                                           |
| data-precision   | `half`<br/>`full`           | false    | Smallest selectable increment (Defaults to `half`).                                                                          |
| data-size        | `sm`<br/>`default`<br/>`lg` | false    | Size of the stars (Defaults to `default`).                                                                                   |
| data-color       | string                      | false    | Star color, one of Harmonia's standard colors (e.g. `red`, `green`, `blue`). Defaults to `yellow`. |
| data-value       | number                      | false    | Initial value when no `x-model` is bound.                                                                                    |
| aria-disabled    | boolean                     | false    | Locks and dims the rating while keeping it focusable and announced.                                                          |
| data-value-label | string                      | false    | Template for the announced value. `{value}` and `{max}` are substituted. Defaults to `{value} of {max} stars`.               |
| data-aria-empty  | string                      | false    | Text announced when the value is 0 (Defaults to `"No rating"`).                                                              |

### Model

Bind a number with `x-model`. The value updates on selection (click, drag, or keyboard) and is rounded to the configured precision. Clicking the current value again clears the rating to `0`.

### Events

| Event  | Description                                                             |
| ------ | ----------------------------------------------------------------------- |
| change | Fired when the value changes. The new value is in `event.detail.value`. |

## Keyboard Handling

The rating is focusable and behaves like a slider:

- `Right` / `Up` - Increase the rating by one step.
- `Left` / `Down` - Decrease the rating by one step.
- `Home` - Clear the rating (set to 0).
- `End` - Set the maximum rating.

The step is half a star by default, or a whole star when `data-precision="full"`.

A disabled rating keeps its place in the tab order and still announces its score, but none of these keys change it.

## Accessibility

The rating is always a focusable `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` and a descriptive `aria-valuetext` (e.g. "3.5 of 5 stars"). Setting `aria-disabled="true"` stops it accepting input but leaves it in the tab order, so a screen reader user can still reach it and hear the score. The star icons themselves are decorative.

Use `aria-disabled` for a score the user cannot change, including a display-only average. `aria-readonly` is not a supported property of the `slider` role, so browsers do not announce it and the component does not read it.

The rating is named "Rating" by default. Set an `aria-label` or `aria-labelledby` describing what is being rated. The name is yours in every state, since the score is announced from `aria-valuetext` rather than folded into the label.

Both the announced score and the empty state are templates, so they can be translated. See `data-value-label` and `data-aria-empty`.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

### Default (half-star)

```html
<div x-data="{ score: 2.5 }" class="flex items-center gap-3">
  <div x-h-rating x-model="score"></div>
  <span x-text="score"></span>
</div>
```

### Whole stars

```html
<div x-data="{ score: 3 }">
  <div x-h-rating x-model="score" data-precision="full"></div>
</div>
```

### Custom color

```html
<div x-data="{ score: 4 }">
  <div x-h-rating x-model="score" data-color="red"></div>
</div>
```

### Display only

A score the user cannot change, such as an average. It is locked and dimmed, but stays focusable and announces itself as "Average rating, 4.5 of 5 stars".

```html
<div x-h-rating aria-disabled="true" data-value="4.5" data-max="5" aria-label="Average rating"></div>
```

### Translated

`data-value-label` is a template, so the numbers can go wherever the language needs them.

```html
<div x-data="{ score: 2.5 }">
  <div x-h-rating x-model="score" aria-label="Bewertung" data-value-label="{value} von {max} Sternen" data-aria-empty="Keine Bewertung"></div>
</div>
```

### Larger, ten stars

```html
<div x-data="{ score: 7 }">
  <div x-h-rating x-model="score" data-max="10" data-size="lg"></div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/rating.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
