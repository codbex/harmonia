# Tile

A container that presents content, previews, or shortcuts in a compact, visually distinct format. Tiles can group related information, link to pages or modules, act as selectable options that wrap a checkbox or radio, or provide an interactive preview.

## Usage

Use tiles to create visually engaging entry points to content, functionality, or related information. Ensure the purpose is clear, and avoid overloading tiles with too much information.

## API Reference

### Component attribute(s)

```
x-h-tile-group
x-h-tile
x-h-tile-header
x-h-tile-media
x-h-tile-content
x-h-tile-title
x-h-tile-description
x-h-tile-actions
x-h-tile-footer
```

### Attributes

::: info
`x-h-tile-group` sets `role="list"` by default, but leaves any `role` you set in place. For a group of selectable tiles, set `role="group"` (checkboxes) or `role="radiogroup"` (radios) plus `aria-label`/`aria-labelledby` on the group.
:::

#### x-h-tile

| Attribute    | Type                               | Required | Description                                                         |
| ------------ | ---------------------------------- | -------- | ------------------------------------------------------------------- |
| data-variant | `outline`<br/>`shadow`<br/>`muted` | false    | Changes the style of the tile. Ignored when the tile is selectable. |

::: info
When `x-h-tile` is placed on a `<label>` element it becomes a selectable tile (see [Selectable](#selectable)): it wraps a single checkbox or radio, is styled with the outline look automatically (`data-variant` is ignored), and reacts to the nested input being checked, focused, or disabled.
:::

#### x-h-tile-media

| Attribute    | Type                             | Required | Description                          |
| ------------ | -------------------------------- | -------- | ------------------------------------ |
| data-variant | `default`<br/>`icon`<br/>`image` | false    | Changes the style of the tile media. |

## Examples

### Variants

<LiveExample data-class="flex flex-col gap-4">

```html
<div x-h-tile>
  <div x-h-tile-content>
    <div x-h-tile-title>Default variant</div>
    <p x-h-tile-description>A simple tile with title, description and a single action.</p>
  </div>
  <div x-h-tile-actions>
    <button x-h-button data-size="md" data-variant="outline">Action</button>
  </div>
</div>

<div x-h-tile data-variant="outline">
  <div x-h-tile-content>
    <div x-h-tile-title>Outline variant</div>
    <p x-h-tile-description>A simple tile with title, description and a single action.</p>
  </div>
  <div x-h-tile-actions>
    <button x-h-button data-size="icon-md" data-variant="outline" aria-label="Add">
      <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
    </button>
  </div>
</div>

<div x-h-tile data-variant="muted">
  <div x-h-tile-content>
    <div x-h-tile-title>Muted variant</div>
    <p x-h-tile-description>A simple tile with title, description and a single action.</p>
  </div>
  <div x-h-tile-actions>
    <button x-h-button data-size="md" data-variant="outline">Action</button>
  </div>
</div>

<div x-h-tile data-variant="shadow">
  <div x-h-tile-content>
    <div x-h-tile-title>Shadow variant</div>
    <p x-h-tile-description>A simple tile with title, description and a single action.</p>
  </div>
  <div x-h-tile-actions>
    <button x-h-button data-size="icon-md" data-variant="outline" aria-label="Add">
      <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
    </button>
  </div>
</div>
```

</LiveExample>

### As link

<LiveExample>

```html
<a x-h-tile data-variant="outline" href="#variants">
  <div x-h-tile-media>
    <svg x-h-lucide role="img" aria-label="Link logo" data-lucide="link" class="size-5"></svg>
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Tile as link</div>
  </div>
  <div x-h-tile-actions>
    <svg x-h-lucide role="presentation" data-lucide="chevron-right" class="size-4"></svg>
  </div>
</a>
```

</LiveExample>

### With image or icon

<LiveExample data-class="flex flex-col gap-4">

```html
<div x-h-tile data-variant="outline">
  <div x-h-tile-media data-variant="icon">
    <svg x-h-lucide role="img" aria-label="Cog logo" data-lucide="cog" class="size-5"></svg>
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Account settings updated</div>
    <p x-h-tile-description>Some automatic updates have been applied to your settings</p>
  </div>
  <div x-h-tile-actions>
    <button x-h-button data-size="md" data-variant="outline">Review</button>
  </div>
</div>

<div x-h-tile data-variant="outline">
  <div x-h-tile-media>
    <div x-h-avatar class="size-10">
      <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
      <div x-h-avatar-fallback>HM</div>
    </div>
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Account settings updated</div>
    <p x-h-tile-description>Some automatic updates have been applied to your settings</p>
  </div>
  <div x-h-tile-actions>
    <button x-h-button data-size="md" data-variant="outline">Review</button>
  </div>
</div>

<div x-h-tile data-variant="outline">
  <div x-h-tile-media data-variant="image">
    <img src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Harmonia</div>
    <p x-h-tile-description>UI component library for Alpine.js</p>
  </div>
</div>
```

</LiveExample>

### In group

<LiveExample>

```html
<div x-h-tile-group class="flex">
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="aspect-square w-full" src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="aspect-square w-full" src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="aspect-square w-full" src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
</div>
```

</LiveExample>

### Sizes

Use the [tile utility classes](/utility-classes/tile) to control the size of the tile.

<LiveExample data-class="flex flex-col gap-4" data-exclude="generator">

```html
<div x-h-tile data-variant="outline" class="tile-double-md">Double length medium size custom tile</div>
```

</LiveExample>

### Selectable

A selectable tile (a.k.a Choice Card) is a `<label>` that wraps a single checkbox or radio. Clicking anywhere on the tile toggles the control, and the tile's text becomes the control's accessible name. The outline style is applied automatically, so `data-variant` is ignored on a selectable tile. Do not place buttons, links, or more than one input inside it.

<LiveExample data-class="flex flex-col gap-4">

```html
<label x-h-tile>
  <span x-h-checkbox>
    <input type="checkbox" />
  </span>
  <div x-h-tile-content>
    <div x-h-tile-title>Selectable</div>
    <p x-h-tile-description>Click on the tile to check the checkbox</p>
  </div>
</label>
```

</LiveExample>

#### Checkbox group

Group selectable tiles in an `x-h-tile-group`. For a set of checkboxes, give the group `role="group"` and a name via `aria-label` or `aria-labelledby`. The `x-h-tile-group` directive keeps any `role` you set.

<LiveExample>

```html
<div x-h-tile-group role="group" aria-label="Notifications" class="flex flex-col gap-2">
  <label x-h-tile>
    <span x-h-checkbox><input type="checkbox" /></span>
    <div x-h-tile-content>
      <div x-h-tile-title>Email</div>
      <p x-h-tile-description>News and product updates</p>
    </div>
  </label>
  <label x-h-tile>
    <span x-h-checkbox><input type="checkbox" /></span>
    <div x-h-tile-content>
      <div x-h-tile-title>SMS</div>
      <p x-h-tile-description>Account and security alerts</p>
    </div>
  </label>
</div>
```

</LiveExample>

#### Radio group

For a single choice, give the group `role="radiogroup"` and every radio the same `name`. Only one tile can be selected at a time.

<LiveExample>

```html
<div x-h-tile-group role="radiogroup" aria-label="Plan" class="flex flex-col gap-2">
  <label x-h-tile>
    <span x-h-radio>
      <input type="radio" name="plan" value="starter" checked />
    </span>
    <div x-h-tile-content>
      <div x-h-tile-title>Starter</div>
      <p x-h-tile-description>For individuals getting started</p>
    </div>
  </label>
  <label x-h-tile>
    <span x-h-radio>
      <input type="radio" name="plan" value="pro" />
    </span>
    <div x-h-tile-content>
      <div x-h-tile-title>Pro</div>
      <p x-h-tile-description>For growing teams</p>
    </div>
  </label>
</div>
```

</LiveExample>

#### Radio group invalid

Shows an invalid state. Applies both to radio and checkbox groups.s

<LiveExample>

```html
<div x-h-tile-group role="radiogroup" aria-label="Plan" class="flex flex-col gap-2">
  <label x-h-tile>
    <span x-h-radio>
      <input type="radio" name="plan" value="starter" checked aria-invalid="true" />
    </span>
    <div x-h-tile-content>
      <div x-h-tile-title>Starter</div>
      <p x-h-tile-description>For individuals getting started</p>
    </div>
  </label>
  <label x-h-tile>
    <span x-h-radio>
      <input type="radio" name="plan" value="pro" />
    </span>
    <div x-h-tile-content>
      <div x-h-tile-title>Pro</div>
      <p x-h-tile-description>For growing teams</p>
    </div>
  </label>
</div>
```

</LiveExample>
