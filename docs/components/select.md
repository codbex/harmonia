# Select

The select component is used to select an item from a predefined list. It should be used when there are 12 or less items to choose from.

## API Reference

### Component attubute(s)

```
x-h-select
x-h-select-trigger
x-h-select-content
x-h-select-search
x-h-select-group
x-h-select-label
x-h-select-option
x-h-select-separator
```

### Attributes

#### x-h-select-trigger

| Attribute    | Type                                          | Required | Description                                   |
| ------------ | --------------------------------------------- | -------- | --------------------------------------------- |
| data-variant | `default`<br />`secondary`<br />`transparent` | false    | Changes the color/shape of the select button. |
| data-size    | `default`<br />`xs`<br />`sm`<br />`lg`<br /> | false    | Changes the size of the select button.        |

#### x-h-select-content

| Attribute  | Type                                                                                                                                                                          | Required | Description                                     |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------- |
| data-align | `bottom-start`<br/>`bottom`<br/>`bottom-end`<br/>`right-start`<br/>`right`<br/>`right-end`<br/>`left-start`<br/>`left`<br/>`left-end`<br/>`top-start`<br/>`top`<br/>`top-end` | false    | Aligns the select body relative to the trigger. |

#### x-h-select-option

| Attribute     | Type    | Required | Description                                                          |
| ------------- | ------- | -------- | -------------------------------------------------------------------- |
| `self`        | string  | false    | Sets the label of the option. Either a string literal or a variable. |
| data-disabled | boolean | false    | Disables the option.                                                 |

### Modifiers

#### x-h-select-search

| Modifier      | Description                                                                               |
| ------------- | ----------------------------------------------------------------------------------------- |
| starts-with   | Search input will use the 'starts-with' filter.                                           |
| contains      | Search input will use the 'contains' filter.                                              |
| contains-each | Search input will use the 'contains-each' filter. Search terms are separated using space. |
| none          | Search input will not use a filter. Usefull when creating a custom search.                |

## Examples

### With model

<br />

<ClientOnly>
<component-container data-html="/components/select/model.html">
</component-container>
</ClientOnly>

```html
<div x-h-select x-data="selectData">
  <button x-h-select-trigger :placeholder="placeholder" x-model="selected"></button>
  <div x-h-select-content>
    <div x-h-select-search></div>
    <div x-h-select-group>
      <div x-h-select-label>Fruits</div>
      <template x-for="option in items">
        <div x-h-select-option="option.label" :value="option.value"></div>
      </template>
    </div>
  </div>
</div>
<script>
  const originalItems = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' },
    { label: 'Jamaican tangelo', value: 'jamaicanTangelo' },
  ];
  Alpine.data('selectData', () => ({
    selected: 'banana',
    placeholder: 'Select',
    items: structuredClone(originalItems),
    addFromSearch(event) {
      let nItems = structuredClone(originalItems);
      nItems.forEach((element) => {
        element.label = `${event.target.value}${element.label}`;
      });
      this.items = nItems;
    },
  }));
</script>
```

### Multiple

The input automatically switches modes based on the model. If you want to select multiple items, pass an array as the model.

<ClientOnly>
<component-container data-html="/components/select/multiple.html">
</component-container>
</ClientOnly>

```html
<div x-h-select x-data="selectData">
  <button x-h-select-trigger :placeholder="placeholder" x-model="selected"></button>
  <div x-h-select-content>
    <div x-h-select-search></div>
    <div x-h-select-group>
      <div x-h-select-label>Fruits</div>
      <template x-for="option in items">
        <div x-h-select-option="option.label" :value="option.value"></div>
      </template>
    </div>
  </div>
</div>
<script>
  const originalItems = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Grapes', value: 'grapes' },
    { label: 'Pineapple', value: 'pineapple' },
    { label: 'Jamaican tangelo', value: 'jamaicanTangelo' },
  ];
  Alpine.data('selectData', () => ({
    selected: ['apple', 'banana'],
    placeholder: 'Select',
    items: structuredClone(originalItems),
    addFromSearch(event) {
      let nItems = structuredClone(originalItems);
      nItems.forEach((element) => {
        element.label = `${event.target.value}${element.label}`;
      });
      this.items = nItems;
    },
  }));
</script>
```

### No model

<br />

<ClientOnly>
<component-container>
<div x-h-select>
  <button x-h-select-trigger placeholder="Select"></button>
  <div x-h-select-content>
    <div x-h-select-option="'Option 1'" value="1"></div>
    <div x-h-select-option="'Option 2'" value="2"></div>
    <div x-h-select-option="'Option 3'" value="3"></div>
    <div x-h-select-option="'Option 4'" value="4" data-disabled="true"></div>
    <div x-h-select-option="'Option 5'" value="5"></div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-select>
  <button x-h-select-trigger placeholder="Select"></button>
  <div x-h-select-content>
    <div x-h-select-option="'Option 1'" value="1"></div>
    <div x-h-select-option="'Option 2'" value="2"></div>
    <div x-h-select-option="'Option 3'" value="3"></div>
    <div x-h-select-option="'Option 4'" value="4" data-disabled="true"></div>
    <div x-h-select-option="'Option 5'" value="5"></div>
  </div>
</div>
```

### With groups

<br />

<ClientOnly>
<component-container>
<div x-h-select>
  <button x-h-select-trigger placeholder="Select"></button>
  <div x-h-select-content>
    <div x-h-select-group>
      <div x-h-select-label>First two options</div>
      <div x-h-select-option="'Option 1'" value="1"></div>
      <div x-h-select-option="'Option 2'" value="2"></div>
    </div>
    <div x-h-select-group>
      <div x-h-select-label>The rest</div>
      <div x-h-select-option="'Option 3'" value="3"></div>
      <div x-h-select-option="'Option 4'" value="4"></div>
      <div x-h-select-separator></div>
      <div x-h-select-option="'Option 5'" value="5"></div>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-select>
  <button x-h-select-trigger placeholder="Select"></button>
  <div x-h-select-content>
    <div x-h-select-group>
      <div x-h-select-label>First two options</div>
      <div x-h-select-option="'Option 1'" value="1"></div>
      <div x-h-select-option="'Option 2'" value="2"></div>
    </div>
    <div x-h-select-group>
      <div x-h-select-label>The rest</div>
      <div x-h-select-option="'Option 3'" value="3"></div>
      <div x-h-select-option="'Option 4'" value="4"></div>
      <div x-h-select-separator></div>
      <div x-h-select-option="'Option 5'" value="5"></div>
    </div>
  </div>
</div>
```
