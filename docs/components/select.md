# Select

Allows users to choose one or more items from a predefined list of options. This component provides a compact way to present choices without overwhelming the interface.

## Usage

Use the Select component without a search option when there are a limited number of options, ideally 12 or fewer. For longer lists, enable the search feature.

## Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the select:

- `Up` / `Down` - Moves focus to the previous or next option.
- `Home` / `Page Up` - Moves focus to the first option.
- `End` / `Page Down` - Moves focus to the last option.
- `Enter` / `Space` - Selects the focused option. If the list is closed, opens it.
- `Esc` - Closes the list without changing the current selection.
- `Tab` - Closes the list and moves focus to the next focusable element.
- `Character keys (A-Z)` - Moves focus to the next option starting with the typed character, cycling through the matches when the same character is repeated. When the select has a search, the character goes to the search input instead.

Options the search has filtered out are skipped, since they are not on screen. Disabled options stay reachable and are announced as unavailable, but they cannot be chosen.

## Accessibility

The select follows the WAI-ARIA listbox pattern. The trigger is a button exposed as a `combobox` that reports its popup state through `aria-haspopup` and `aria-expanded`, the list is a `listbox`, and each option is an `option` whose accessible name comes from its label. A roving tab stop moves between the options while the list is open. Groups are exposed as `role="group"` named by their label, and a multiple select marks the list `aria-multiselectable`.

The native input is kept out of the accessibility tree, so the trigger is the element assistive technologies see and everything you set on the input for naming and state is applied to the trigger for you. Give the select a name with `aria-label` or `aria-labelledby` on the `x-h-select-input` input, or place it in an `x-h-field` next to an `x-h-label`, which is picked up automatically. An explicit `aria-labelledby` wins over the field label. The `disabled`, `required` and `aria-invalid` attributes are mirrored onto the trigger as well, so the select is announced as disabled, required or invalid.

Use `data-id` when you want to reference the trigger itself, for example from a `<label for="...">`, which additionally lets a click on the label open the list. Prefer `aria-labelledby` for the name, since it is honoured more consistently than a `<label>` pointing at a button.

The search is its own `combobox`, named "Search" by default. Set an `aria-label` on the `x-h-select-search` element to name it something else.

An option disabled with `aria-disabled="true"` keeps its place in the arrow order so screen readers announce it as unavailable, but it cannot be selected by keyboard or by mouse.

## API Reference

### Component attribute(s)

```
x-h-select
x-h-select-input
x-h-select-content
x-h-select-search
x-h-select-list
x-h-select-group
x-h-select-label
x-h-select-option
x-h-select-separator
```

### Attributes

#### x-h-select

| Attribute      | Type               | Required | Description                                                                                                                                                            |
| -------------- | ------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-size      | `sm`<br/>`default` | false    | Changes the size of the select button.                                                                                                                                 |
| data-clearable | boolean            | false    | When set to `true`, allows the current selection to be cleared by clicking the already-selected option again. By default, re-clicking a selected option has no effect. |

#### x-h-select-input

| Attribute | Type   | Required | Description                                                                                                                                                               |
| --------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-id   | string | false    | Sets the `id` of the select trigger, so it can be referenced by a `<label for="...">` or reached programmatically. Not to be confused with the `id` of the input element. |

#### x-h-select-content

| Attribute  | Type                                                                                                                                                                          | Required | Description                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| data-align | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the select body relative to the trigger. |

#### x-h-select-option

| Attribute        | Type    | Required | Description                                                                                                                |
| ---------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| `self`           | string  | false    | Sets the label of the option. Either a string literal or a variable.                                                       |
| data-value       | string  | false    | Sets the value of the option.                                                                                              |
| data-description | string  | false    | Sets a secondary line of text shown under the label in a muted color. Included in the search only when the search opts in. |
| aria-disabled    | boolean | false    | Marks the option unavailable while keeping it focusable and announced.                                                     |

To show a leading icon or image, place an `<svg>` or `<img>` element directly inside the option. It is always positioned first, before the label. Set the appropriate accessibility attributes on it yourself (an empty `alt` for a decorative image, or an `aria-label` for a meaningful one).

#### x-h-select-search

| Attribute         | Type                                                           | Required | Description                                                                                                                                                                                     |
| ----------------- | -------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-filter       | `starts-with`<br />`contains`<br />`contains-each`<br />`none` | false    | Defines the search matching strategy. Use `none` to disable built-in filtering and implement custom search behavior. With the 'contains-each' filter, search terms are separated using space.   |
| data-include-desc | boolean                                                        | false    | When set to `true`, the option descriptions are also matched against the search. Applies to the `contains` and `contains-each` filters. The `starts-with` filter always matches the label only. |

### Modifiers

#### x-h-select

| Modifier | Description                                 |
| -------- | ------------------------------------------- |
| table    | Use when the select input is inside a table |

### Validation timing

By default this control shows native-constraint errors (for example `required`) only after the user interacts with it or attempts to submit, not on page load. To validate on load instead, set `data-validate="immediate"` on a wrapping `x-h-fieldset`, `x-h-field`, or any ancestor element. Setting `aria-invalid="true"` yourself always shows the error immediately. See [Fieldset](/components/fieldset#validation-timing) for details.

## Examples

### With a label

Inside an `x-h-field`, an `x-h-label` names the select automatically. Point its `for` at the `data-id` of the trigger as well, and clicking the label opens the list.

<LiveExample>

```html
<div x-h-field>
  <label x-h-label for="fruit-trigger">Fruit</label>
  <div x-h-select>
    <input x-h-select-input data-id="fruit-trigger" placeholder="Select" />
    <div x-h-select-content>
      <div x-h-select-list>
        <div x-h-select-option="'Apple'" data-value="apple"></div>
        <div x-h-select-option="'Banana'" data-value="banana"></div>
        <div x-h-select-option="'Grapes'" data-value="grapes"></div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### With model

<LiveExample data-exclude="generator">

```html
<div x-data="selectData">
  <div x-h-select>
    <input x-h-select-input :placeholder="placeholder" x-model="selected" aria-label="Fruit" />
    <div x-h-select-content>
      <div x-h-select-search></div>
      <div x-h-select-list>
        <div x-h-select-group>
          <div x-h-select-label>Fruits</div>
          <template x-for="option in items">
            <div x-h-select-option="option.label" :data-value="option.value"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  Alpine.data('selectData', () => ({
    getOriginalItems() {
      return [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Blueberry', value: 'blueberry' },
        { label: 'Grapes', value: 'grapes' },
        { label: 'Pineapple', value: 'pineapple' },
        { label: 'Jamaican tangelo', value: 'jamaicanTangelo' },
      ];
    },
    selected: 'banana',
    placeholder: 'Select',
    items: [],
    addFromSearch(event) {
      let nItems = this.getOriginalItems();
      nItems.forEach((element) => {
        element.label = `${event.target.value}${element.label}`;
      });
      this.items = nItems;
    },
    init() {
      this.items = this.getOriginalItems();
    },
  }));
</script>
```

</LiveExample>

### With descriptions and icons

Give an option a secondary line of text with `data-description`, and a leading icon by placing an `<svg>` (or `<img>`) directly inside it. Set `data-include-desc="true"` on the search to match the descriptions as well as the labels. Try searching for "monthly" or "instant".

<LiveExample>

```html
<div x-data="{ plan: 'pro' }">
  <div x-h-select>
    <input x-h-select-input placeholder="Select a plan" x-model="plan" aria-label="Plan" />
    <div x-h-select-content>
      <div x-h-select-search data-filter="contains" data-include-desc="true"></div>
      <div x-h-select-list>
        <div x-h-select-option="'Free'" data-value="free" data-description="For personal projects">
          <svg x-h-icon data-icon="home" role="presentation"></svg>
        </div>
        <div x-h-select-option="'Pro'" data-value="pro" data-description="For small teams, billed monthly">
          <svg x-h-icon data-icon="star" role="presentation"></svg>
        </div>
        <div x-h-select-option="'Enterprise'" data-value="enterprise" data-description="Instant onboarding and priority support">
          <svg x-h-icon data-icon="bell" role="presentation"></svg>
        </div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Clearable

<LiveExample data-exclude="generator">

```html
<div x-data="{ selected: 'opt-1' }">
  <div x-h-select data-clearable="true">
    <input x-h-select-input placeholder="Select" x-model="selected" aria-label="Option" />
    <div x-h-select-content>
      <div x-h-select-list>
        <div x-h-select-option="'Option 1'" data-value="opt-1"></div>
        <div x-h-select-option="'Option 2'" data-value="opt-2"></div>
        <div x-h-select-option="'Option 3'" data-value="opt-3"></div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Multiple

The input automatically switches modes based on the model. If you want to select multiple items, pass an array as the model.

<LiveExample>

```html
<div x-data="selectMultipleData">
  <div x-h-select>
    <input x-h-select-input :placeholder="placeholder" x-model="selected" aria-label="Fruits" />
    <div x-h-select-content>
      <div x-h-select-search></div>
      <div x-h-select-list>
        <div x-h-select-group>
          <div x-h-select-label>Fruits</div>
          <template x-for="option in items">
            <div x-h-select-option="option.label" :data-value="option.value"></div>
          </template>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  Alpine.data('selectMultipleData', () => ({
    getOriginalItems() {
      return [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' },
        { label: 'Blueberry', value: 'blueberry' },
        { label: 'Grapes', value: 'grapes' },
        { label: 'Pineapple', value: 'pineapple' },
        { label: 'Jamaican tangelo', value: 'jamaicanTangelo' },
      ];
    },
    selected: ['apple', 'banana'],
    placeholder: 'Select',
    items: [],
    addFromSearch(event) {
      let nItems = this.getOriginalItems();
      nItems.forEach((element) => {
        element.label = `${event.target.value}${element.label}`;
      });
      this.items = nItems;
    },
    init() {
      this.items = this.getOriginalItems();
    },
  }));
</script>
```

</LiveExample>

### No model

<LiveExample data-exclude="generator">

```html
<div x-h-select>
  <input x-h-select-input placeholder="Select" aria-label="Option" />
  <div x-h-select-content>
    <div x-h-select-list>
      <div x-h-select-option="'Option 1'" data-value="1"></div>
      <div x-h-select-option="'Option 2'" data-value="2"></div>
      <div x-h-select-option="'Option 3'" data-value="3"></div>
      <div x-h-select-option="'Option 4'" data-value="4" aria-disabled="true"></div>
      <div x-h-select-option="'Option 5'" data-value="5"></div>
    </div>
  </div>
</div>
```

</LiveExample>

### Invalid

Reacts to the native invalid state or to the `aria-invalid` attribute.

<LiveExample>

```html
<div x-h-select>
  <input x-h-select-input placeholder="Select" aria-label="Option" aria-invalid="true" />
  <div x-h-select-content>
    <div x-h-select-list>
      <div x-h-select-option="'Option 1'" data-value="1"></div>
      <div x-h-select-option="'Option 2'" data-value="2"></div>
      <div x-h-select-option="'Option 3'" data-value="3"></div>
    </div>
  </div>
</div>
```

</LiveExample>

### Disabled

Set the native `disabled` attribute on the `x-h-select-input` input to disable the whole select. To disable a single option, use `aria-disabled="true"` on it instead. A disabled option is dimmed and cannot be chosen, but the arrow keys still reach it so screen readers announce it as unavailable.

<LiveExample data-class="flex flex-col items-start gap-4">

```html
<div x-h-select>
  <input x-h-select-input placeholder="Select" aria-label="Disabled select" disabled />
  <div x-h-select-content>
    <div x-h-select-list>
      <div x-h-select-option="'Option 1'" data-value="1"></div>
      <div x-h-select-option="'Option 2'" data-value="2"></div>
      <div x-h-select-option="'Option 3'" data-value="3"></div>
    </div>
  </div>
</div>
<div x-h-select>
  <input x-h-select-input placeholder="Select" aria-label="Option" />
  <div x-h-select-content>
    <div x-h-select-list>
      <div x-h-select-option="'Option 1'" data-value="1"></div>
      <div x-h-select-option="'Option 2'" data-value="2" aria-disabled="true"></div>
      <div x-h-select-option="'Option 3'" data-value="3"></div>
    </div>
  </div>
</div>
```

</LiveExample>

### With groups

<LiveExample>

```html
<div x-h-select>
  <input x-h-select-input placeholder="Select" aria-label="Option" />
  <div x-h-select-content>
    <div x-h-select-list>
      <div x-h-select-group>
        <div x-h-select-label>First two options</div>
        <div x-h-select-option="'Option 1'" data-value="1"></div>
        <div x-h-select-option="'Option 2'" data-value="2"></div>
      </div>
      <div x-h-select-group>
        <div x-h-select-label>The rest</div>
        <div x-h-select-option="'Option 3'" data-value="3"></div>
        <div x-h-select-option="'Option 4'" data-value="4"></div>
        <div x-h-select-separator></div>
        <div x-h-select-option="'Option 5'" data-value="5"></div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>
