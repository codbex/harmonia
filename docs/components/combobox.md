# Combobox

A list of options that belongs to a text field, filtered as the user types. Focus stays in the field, so the user can keep typing while the arrow keys move through the results and `Enter` picks one.

## Usage

Use a combobox when the set of choices is too long to browse and the user is expected to narrow it down by typing, as in a search field, an autocomplete, or a command palette. The defining feature is that the user types into a text field, so reach for a combobox only when that is what you want. For a command palette, pair it with a [Backdrop](/components/backdrop).

For anything opened from a button rather than typed into, use [Menu](/components/menu) instead, which is the better fit for a dropdown and handles the trigger, the popover and the keyboard for you. When the user should read through a fixed set of choices, use [Listbox](/components/listbox), and for a form control that behaves like a native `<select>`, use [Select](/components/select).

Give the directive the text field that drives it, and fill the popup with an [x-h-list](/components/list) of options exactly as a listbox does. The component handles moving through the options and activating one, while filtering, showing and hiding the popup stay yours.

Activating an option clicks it, so the `@click` you already write for the mouse serves the keyboard too.

## Keyboard Handling

The combobox is not a stop in the tab order of its own. It is reached through its text field, and only takes the keys that field does not need for editing:

- `Up` / `Down` - Moves the highlight to the previous or next option, wrapping around at the ends. The first press enters the list from the near end.
- `Enter` - Activates the highlighted option by clicking it. A disabled option is left alone.

Everything else goes to the field, typing, `Home` and `End` included. Nothing is highlighted until the user presses an arrow key, so `Enter` before that is left alone too and you are free to bind your own handler for it, for example to open the first result.

The highlight is dropped again as soon as focus leaves the field and the list, so returning to the field starts unmarked just like the first visit and a handler bound to `Enter` behaves the same way every time. Moving between the field and the list, which is what clicking an option does, counts as staying.

## Accessibility

The component gives the text field the `combobox` role, points its `aria-controls` at the popup, and sets `aria-autocomplete="list"`, in each case only when you have not set the attribute yourself. As the user moves through the options it keeps `aria-activedescendant` on the field pointing at the highlighted one, which is what lets a screen reader announce the option while the cursor stays in the field. The attribute is removed when the highlight is dropped, so it never names an option once focus has moved on.

Two things remain yours, because only you know them: bind `aria-expanded` on the field to whether the popup is showing, and give the field an accessible name with `aria-label` or a matching `<label>`.

The component never writes `aria-selected`. When a persistent selection is meaningful, bind it yourself and `x-h-list-item` will style the selected option.

## API Reference

### Component attribute(s)

```
x-h-combobox
```

### Attributes

#### x-h-combobox

| Attribute      | Type                                   | Required | Description                                                                                                                                                                                                                                                                     |
| -------------- | -------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self`         | element                                | true     | The text field that drives the combobox. The component reads the keyboard from it and reports the highlighted option on it.                                                                                                                                                     |
| `data-variant` | `listbox`<br />`popover`<br />`inline` | false    | The style of the panel. `listbox` (the default) is the bordered panel shared with a listbox. `popover` gives it the surface, shadow and rounded corners of a popover. `inline` removes the background, border, shadow and rounded corners for nesting inside another component. |

## Examples

Type to filter the options, use the arrow keys to move through them, and press `Enter` to pick the highlighted one. Nothing is highlighted until an arrow key is pressed.

<LiveExample data-class="flex flex-col">

```html
<div x-data="{ query: '', picked: '', fruits: ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Peach'] }">
  <input x-h-input x-ref="fruit" type="text" placeholder="Search fruit..." aria-label="Search fruit" x-model="query" />
  <div x-h-combobox="$refs.fruit" class="mt-4">
    <ul x-h-list>
      <template x-for="fruit in fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase()))" :key="fruit">
        <li x-h-list-item @click="picked = fruit" :aria-selected="picked === fruit" x-text="fruit"></li>
      </template>
    </ul>
  </div>
  <p x-h-text.sm.muted class="mt-4" x-text="picked ? 'Picked: ' + picked : 'Nothing picked yet'"></p>
</div>
```

</LiveExample>

### Grouped options

Options can be split across several lists with a header on each, exactly as in a listbox. The arrow keys cross the group boundaries.

<LiveExample data-class="flex flex-col" data-exclude="generator">

```html
<div
  x-data="{
    query: '',
    picked: '',
    groups: [
      { label: 'Fruit', items: ['Apple', 'Apricot', 'Banana', 'Cherry'] },
      { label: 'Vegetables', items: ['Artichoke', 'Broccoli', 'Carrot'] }
    ],
    match(items) { return items.filter((i) => i.toLowerCase().includes(this.query.toLowerCase())) }
  }"
>
  <input x-h-input x-ref="produce" type="text" placeholder="Search produce..." aria-label="Search produce" x-model="query" />
  <div x-h-combobox="$refs.produce" class="mt-4">
    <template x-for="group in groups.filter((g) => match(g.items).length)" :key="group.label">
      <ul x-h-list>
        <li x-h-list-header x-text="group.label"></li>
        <template x-for="item in match(group.items)" :key="item">
          <li x-h-list-item @click="picked = item" :aria-selected="picked === item" x-text="item"></li>
        </template>
      </ul>
    </template>
  </div>
  <p x-h-text.sm.muted class="mt-4" x-text="picked ? 'Picked: ' + picked : 'Nothing picked yet'"></p>
</div>
```

</LiveExample>

### Popover variant

A combobox popup usually floats over the page, and `data-variant="popover"` gives the panel the surface, shadow and rounded corners of a popover. Positioning stays yours, here through a `relative` wrapper and an absolutely placed panel that shows while there is something to search for.

<LiveExample data-class="flex flex-col" data-style="min-height: 16rem">

```html
<div x-data="{ query: '', picked: '', fruits: ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Peach'] }">
  <div class="relative">
    <input x-h-input x-ref="pofruit" type="text" placeholder="Search fruit..." aria-label="Search fruit" x-model="query" :aria-expanded="query !== ''" />
    <div x-h-combobox="$refs.pofruit" data-variant="popover" class="absolute z-50 mt-4 w-full" x-show="query">
      <ul x-h-list>
        <template x-for="fruit in fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase()))" :key="fruit">
          <li x-h-list-item @click="picked = fruit; query = ''" :aria-selected="picked === fruit" x-text="fruit"></li>
        </template>
      </ul>
    </div>
  </div>
  <p x-h-text.sm.muted class="mt-4" x-text="picked ? 'Picked: ' + picked : 'Type to search'"></p>
</div>
```

</LiveExample>

### Inline variant

`data-variant="inline"` removes the background, border, shadow and rounded corners, so the panel blends into a component that draws its own frame, as the popup of a command palette does.

<LiveExample data-class="flex flex-col">

```html
<div x-data="{ query: '', picked: '', fruits: ['Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Peach'] }">
  <div class="overflow-hidden rounded-control border">
    <div class="p-2">
      <input x-h-input x-ref="infruit" type="text" placeholder="Search fruit..." aria-label="Search fruit" x-model="query" />
    </div>
    <div x-h-combobox="$refs.infruit" data-variant="inline">
      <ul x-h-list>
        <template x-for="fruit in fruits.filter((f) => f.toLowerCase().includes(query.toLowerCase()))" :key="fruit">
          <li x-h-list-item class="px-5" @click="picked = fruit" :aria-selected="picked === fruit" x-text="fruit"></li>
        </template>
      </ul>
    </div>
  </div>
  <p x-h-text.sm.muted class="mt-4" x-text="picked ? 'Picked: ' + picked : 'Nothing picked yet'"></p>
</div>
```

</LiveExample>
