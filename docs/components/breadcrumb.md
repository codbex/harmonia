# Breadcrumb

Displays the current page's location within a navigational hierarchy, helping users understand where they are and navigate back to parent pages.

## Usage

Use breadcrumbs on pages that are deeply nested within a site hierarchy. Avoid them on top-level pages where the context is already clear.

## API Reference

### Component attribute(s)

```
x-h-breadcrumb
x-h-breadcrumb-list
x-h-breadcrumb-item
x-h-breadcrumb-link
x-h-breadcrumb-page
```

### Attributes

| Attribute     | Values                      | Required | Description                                                                                                                                 |
| ------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| data-variant  | `outline`<br/>`default`     | false    | Changes the visual style of the breadcrumb.                                                                                                 |
| data-size     | `sm`<br/>`md`<br/>`default` | false    | Changes the size of the breadcrumb. Only applied when the `outline` variant is set.                                                         |
| data-overflow | `scroll`<br/>`nowrap`       | false    | `scroll` - enables horizontal scrolling, last item visible on load. `nowrap` - prevents wrapping without scrolling. Wraps items by default. |

## Examples

<ClientOnly>
<component-container>
<nav x-h-breadcrumb>
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#"><svg x-h-icon.home role="img" aria-label="home"></svg>Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Components</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-breadcrumb>
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Components</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
```

### Links as buttons

<ClientOnly>
<component-container>
<nav x-h-breadcrumb>
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <button x-h-breadcrumb-link>
        <svg x-h-icon.home role="img" aria-label="home"></svg>
        <span>Home</span>
      </button>
    </li>
    <li x-h-breadcrumb-item>
      <button x-h-breadcrumb-link>Components</button>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-breadcrumb>
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <button x-h-breadcrumb-link>
        <svg x-h-icon.home role="img" aria-label="home"></svg>
        <span>Home</span>
      </button>
    </li>
    <li x-h-breadcrumb-item>
      <button x-h-breadcrumb-link>Components</button>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
```

### Outline Variant

<ClientOnly>
<component-container>
<nav x-h-breadcrumb data-variant="outline">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Components</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-breadcrumb data-variant="outline">...</nav>
```

### In a Toolbar

<ClientOnly>
<component-container data-icons="true">
<div x-h-toolbar data-variant="transparent">
  <button x-h-button data-variant="transparent" data-size="icon" aria-label="fake side panel button"><i x-h-lucide role="img" data-lucide="panel-left"></i></button>
  <div x-h-toolbar-separator></div>
  <nav x-h-breadcrumb>
    <ol x-h-breadcrumb-list>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>
          <i x-h-lucide role="img" data-lucide="home"></i>
          <span>Home</span>
        </button>
      </li>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>Components</button>
      </li>
      <li x-h-breadcrumb-item>
        <span x-h-breadcrumb-page>Breadcrumb</span>
      </li>
    </ol>
  </nav>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="plus"></i>Add</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar data-variant="transparent">
  <button x-h-button data-variant="transparent" data-size="icon" aria-label="fake side panel button"><i x-h-lucide role="img" data-lucide="panel-left"></i></button>
  <div x-h-toolbar-separator></div>
  <nav x-h-breadcrumb>
    <ol x-h-breadcrumb-list>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>
          <i x-h-lucide role="img" data-lucide="home"></i>
          <span>Home</span>
        </button>
      </li>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>Components</button>
      </li>
      <li x-h-breadcrumb-item>
        <span x-h-breadcrumb-page>Breadcrumb</span>
      </li>
    </ol>
  </nav>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="plus"></i>Add</button>
</div>
```

<ClientOnly>
<component-container data-icons="true">
<div x-h-toolbar data-variant="transparent">
  <button x-h-button data-variant="transparent" data-size="icon" aria-label="fake side panel button"><i x-h-lucide role="img" data-lucide="panel-left"></i></button>
  <nav x-h-breadcrumb data-variant="outline">
    <ol x-h-breadcrumb-list>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>
          <i x-h-lucide role="img" data-lucide="home"></i>
          <span>Home</span>
        </button>
      </li>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>Components</button>
      </li>
      <li x-h-breadcrumb-item>
        <span x-h-breadcrumb-page>Breadcrumb</span>
      </li>
    </ol>
  </nav>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="plus"></i>Add</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-toolbar data-variant="transparent">
  <button x-h-button data-variant="transparent" data-size="icon" aria-label="fake side panel button"><i x-h-lucide role="img" data-lucide="panel-left"></i></button>
  <nav x-h-breadcrumb data-variant="outline">
    <ol x-h-breadcrumb-list>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>
          <i x-h-lucide role="img" data-lucide="home"></i>
          <span>Home</span>
        </button>
      </li>
      <li x-h-breadcrumb-item>
        <button x-h-breadcrumb-link>Components</button>
      </li>
      <li x-h-breadcrumb-item>
        <span x-h-breadcrumb-page>Breadcrumb</span>
      </li>
    </ol>
  </nav>
  <div x-h-toolbar-spacer></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="save"></i>Save</button>
  <div x-h-toolbar-separator></div>
  <button x-h-button data-variant="transparent"><i x-h-lucide role="img" data-lucide="plus"></i>Add</button>
</div>
```

### Sizes

Sizes are only applied when the `outline` variant is set.

<ClientOnly>
<component-container data-class="flex flex-col gap-3">
<nav x-h-breadcrumb data-variant="outline">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Components</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Default</span>
    </li>
  </ol>
</nav>
<nav x-h-breadcrumb data-variant="outline" data-size="md">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Components</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Medium</span>
    </li>
  </ol>
</nav>
<nav x-h-breadcrumb data-variant="outline" data-size="sm">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Components</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Small</span>
    </li>
  </ol>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-breadcrumb data-variant="outline">...</nav>
<nav x-h-breadcrumb data-variant="outline" data-size="md">...</nav>
<nav x-h-breadcrumb data-variant="outline" data-size="sm">...</nav>
```

### Scroll Overflow

<ClientOnly>
<component-container>
<nav x-h-breadcrumb data-overflow="scroll">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#"><svg x-h-icon.home role="img" aria-label="home"></svg>Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 1</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 2</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 3</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 4</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 5</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 6</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 7</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 8</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
<br />
<nav x-h-breadcrumb data-overflow="scroll" data-variant="outline">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#"><svg x-h-icon.home role="img" aria-label="home"></svg>Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 1</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 2</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 3</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 4</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 5</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 6</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 7</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 8</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-breadcrumb data-overflow="scroll">...</nav>
<nav x-h-breadcrumb data-overflow="scroll" data-variant="outline">...</nav>
```

### Popover Overflow With `nowrap`

<ClientOnly>
<component-container>
<nav x-h-breadcrumb data-overflow="nowrap">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#"><svg x-h-icon.home role="img" aria-label="home"></svg>Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <button x-h-breadcrumb-link x-h-menu-trigger.dropdown>
        <svg x-h-icon.ellipsis role="img" aria-label="ellipsis"></svg>
        <span class="sr-only">Breadcrumb overflow menu</span>
      </button>
      <ul x-h-menu>
        <li x-h-menu-item>
          <a href="#">Page 1</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 2</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 3</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 4</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 5</a>
        </li>
      </ul>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 6</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 7</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 8</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
</component-container>
</ClientOnly>

```html
<nav x-h-breadcrumb data-overflow="nowrap">
  <ol x-h-breadcrumb-list>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#"><svg x-h-icon.home role="img" aria-label="home"></svg>Home</a>
    </li>
    <li x-h-breadcrumb-item>
      <button x-h-breadcrumb-link x-h-menu-trigger.dropdown>
        <svg x-h-icon.ellipsis role="img" aria-label="ellipsis"></svg>
        <span class="sr-only">Breadcrumb overflow menu</span>
      </button>
      <ul x-h-menu>
        <li x-h-menu-item>
          <a href="#">Page 1</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 2</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 3</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 4</a>
        </li>
        <li x-h-menu-item>
          <a href="#">Page 5</a>
        </li>
      </ul>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 6</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 7</a>
    </li>
    <li x-h-breadcrumb-item>
      <a x-h-breadcrumb-link href="#">Page 8</a>
    </li>
    <li x-h-breadcrumb-item>
      <span x-h-breadcrumb-page>Breadcrumb</span>
    </li>
  </ol>
</nav>
```

### Dynamic items with `x-for`

<ClientOnly>
<component-container src="/components/breadcrumb/dynamic.html"></component-container>
</ClientOnly>

```html
<div
  x-data="{
  crumbs: [
    { label: 'Home', href: '#home' },
    { label: 'Components', href: '#components' },
    { label: 'Breadcrumb', href: '#breadcrumb' }
  ]
}"
>
  <nav x-h-breadcrumb>
    <ol x-h-breadcrumb-list>
      <template x-for="(item, index) in crumbs" :key="item.href">
        <li x-h-breadcrumb-item>
          <template x-if="index < crumbs.length - 1">
            <a x-h-breadcrumb-link :href="item.href" x-text="item.label"></a>
          </template>
          <template x-if="index === crumbs.length - 1">
            <span x-h-breadcrumb-page x-text="item.label"></span>
          </template>
        </li>
      </template>
    </ol>
  </nav>
</div>
```
