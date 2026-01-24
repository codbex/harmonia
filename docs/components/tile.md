# Tile

A container that presents content, previews, or shortcuts in a compact, visually distinct format. Tiles can group related information, link to pages or modules, or provide an interactive preview.

## Usage

Use tiles to create visually engaging entry points to content, functionality, or related information. Ensure the purpose is clear, and avoid overloading tiles with too much information.

## API Reference

### Component attubute(s)

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

#### x-h-tile

| Attribute    | Type                               | Required | Description                    |
| ------------ | ---------------------------------- | -------- | ------------------------------ |
| data-variant | `outline`<br/>`shadow`<br/>`muted` | false    | Changes the style of the tile. |

#### x-h-tile-media

| Attribute    | Type                             | Required | Description                          |
| ------------ | -------------------------------- | -------- | ------------------------------------ |
| data-variant | `default`<br/>`icon`<br/>`image` | false    | Changes the style of the tile media. |

## Examples

### Variants

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col gap-4">
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

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
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

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js" data-class="flex flex-col gap-4">
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

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
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
