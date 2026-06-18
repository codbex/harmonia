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

<ClientOnly>
<component-container data-icons="true" data-class="flex flex-col gap-4">
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
    <button x-h-button data-size="icon-md" data-variant="outline" aria-label="Icon button">
      <i role="img" data-lucide="plus"></i>
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
    <button x-h-button data-size="icon-md" data-variant="outline" aria-label="Icon button">
      <i role="img" data-lucide="plus"></i>
    </button>
  </div>
</div>
</component-container>
</ClientOnly>

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
    <button x-h-button data-size="icon-md" data-variant="outline" aria-label="Icon button">
      <i role="img" data-lucide="plus"></i>
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
    <button x-h-button data-size="icon-md" data-variant="outline" aria-label="Icon button">
      <i role="img" data-lucide="plus"></i>
    </button>
  </div>
</div>
```

### As link

<ClientOnly>
<component-container data-icons="true">
<a x-h-tile data-variant="outline" href="#variants">
  <div x-h-tile-media>
    <i role="img" data-lucide="link" class="size-5"></i>
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Tile as link</div>
  </div>
  <div x-h-tile-actions>
    <i role="img" data-lucide="chevron-right" class="size-4"></i>
  </div>
</a>
</component-container>
</ClientOnly>

```html
<a x-h-tile data-variant="outline" href="#variants">
  <div x-h-tile-media>
    <i role="img" data-lucide="link" class="size-5"></i>
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Tile as link</div>
  </div>
  <div x-h-tile-actions>
    <i role="img" data-lucide="chevron-right" class="size-4"></i>
  </div>
</a>
```

### With image or icon

<ClientOnly>
<component-container data-icons="true" data-class="flex flex-col gap-4">
<div x-h-tile data-variant="outline">
  <div x-h-tile-media data-variant="icon">
    <i role="img" data-lucide="cog" class="size-5"></i>
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
    <span x-h-avatar class="size-10">
      <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
      <div x-h-avatar-fallback>HM</div>
    </span>
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
    <img src="/logo/harmonia-square.svg" alt="@harmonia" />
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Harmonia</div>
    <p x-h-tile-description>UI component library for Alpine.js</p>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tile data-variant="outline">
  <div x-h-tile-media data-variant="icon">
    <i role="img" data-lucide="cog" class="size-5"></i>
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
    <span x-h-avatar class="size-10">
      <img x-h-avatar-image src="/logo/harmonia-square.svg" alt="@harmonia" />
      <div x-h-avatar-fallback>HM</div>
    </span>
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
    <img src="/logo/harmonia-square.svg" alt="@harmonia" />
  </div>
  <div x-h-tile-content>
    <div x-h-tile-title>Harmonia</div>
    <p x-h-tile-description>UI component library for Alpine.js</p>
  </div>
</div>
```

### In group

<ClientOnly>
<component-container data-icons="true">
<div x-h-tile-group class="flex">
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="w-full aspect-square" src="/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="w-full aspect-square" src="/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="w-full aspect-square" src="/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tile-group class="flex">
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="aspect-square w-full" src="/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="aspect-square w-full" src="/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
  <div x-h-tile data-variant="outline">
    <div x-h-tile-header>
      <img class="aspect-square w-full" src="/logo/harmonia-square.svg" alt="@harmonia" />
    </div>
    <div x-h-tile-content>
      <div x-h-tile-title>Harmonia</div>
      <p x-h-tile-description>UI component library for Alpine.js</p>
    </div>
  </div>
</div>
```

### Sizes

Use the [tile utility classes](/utility-classes/tile) to control the size of the tile.

<ClientOnly>
<component-container data-icons="true" data-class="flex flex-col gap-4">
<div x-h-tile data-variant="outline" class="tile-double-md">Double length medium size custom tile</div>
</component-container>
</ClientOnly>

### Selectable

A selectable tile (a.k.a Choice Card) is a `<label>` that wraps a single checkbox or radio. Clicking anywhere on the tile toggles the control, and the tile's text becomes the control's accessible name. The outline style is applied automatically, so `data-variant` is ignored on a selectable tile. Do not place buttons, links, or more than one input inside it.

<ClientOnly>
<component-container data-icons="true" data-class="flex flex-col gap-4">
<label x-h-tile>
  <span x-h-checkbox>
    <input type="checkbox" />
  </span>
  <div x-h-tile-content>
    <div x-h-tile-title>Selectable</div>
    <p x-h-tile-description>Click on the tile to check the checkbox</p>
  </div>
</label>
</component-container>
</ClientOnly>

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

#### Checkbox group

Group selectable tiles in an `x-h-tile-group`. For a set of checkboxes, give the group `role="group"` and a name via `aria-label` or `aria-labelledby`; `x-h-tile-group` keeps any `role` you set.

<ClientOnly>
<component-container data-icons="true">
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
</component-container>
</ClientOnly>

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

#### Radio group

For a single choice, give the group `role="radiogroup"` and every radio the same `name`. Only one tile can be selected at a time.

<ClientOnly>
<component-container data-icons="true">
<div x-h-tile-group role="radiogroup" aria-label="Plan" class="flex flex-col gap-2">
  <label x-h-tile>
    <span x-h-radio><input type="radio" name="plan" value="starter" checked /></span>
    <div x-h-tile-content>
      <div x-h-tile-title>Starter</div>
      <p x-h-tile-description>For individuals getting started</p>
    </div>
  </label>
  <label x-h-tile>
    <span x-h-radio><input type="radio" name="plan" value="pro" /></span>
    <div x-h-tile-content>
      <div x-h-tile-title>Pro</div>
      <p x-h-tile-description>For growing teams</p>
    </div>
  </label>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tile-group role="radiogroup" aria-label="Plan" class="flex flex-col gap-2">
  <label x-h-tile>
    <span x-h-radio><input type="radio" name="plan" value="starter" checked /></span>
    <div x-h-tile-content>
      <div x-h-tile-title>Starter</div>
      <p x-h-tile-description>For individuals getting started</p>
    </div>
  </label>
  <label x-h-tile>
    <span x-h-radio><input type="radio" name="plan" value="pro" /></span>
    <div x-h-tile-content>
      <div x-h-tile-title>Pro</div>
      <p x-h-tile-description>For growing teams</p>
    </div>
  </label>
</div>
```
