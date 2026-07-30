# Bottom Navigation

A bar of top-level destinations along the bottom of the screen, each an icon over a short label, with the current one highlighted. It is the primary navigation pattern on phones, where the bottom edge is the easiest place to reach.

## Usage

Use a bottom navigation for the three to five most important destinations of an application, and keep the set the same on every screen. Each destination is a place to go, not an action to perform. When there is a need for more destinations than there can fit comfortably, or with a nested hierarchy, reach for a [Sidebar](/components/sidebar) or a [Navigation Menu](/components/navigation-menu).

Give the bar an expression naming the value that holds the current destination, and give each item its own value. The component compares the two, marks the matching item as current and writes the item's value back when it is tapped, so a single variable drives both the highlight and the navigation.

Destinations are anchors or buttons. Use an `<a>` with an `href` when each destination is a real URL, and a `<button>` when the bar swaps content in place.

Use `data-position="sticky"` to keep the bar at the bottom as the content scrolls. Reach for `fixed` only when it has to overlay the content rather than sit alongside it. On a long page, `data-hide-on-scroll` lets the bar slide out of the way while people read.

Keep labels to a single word. They can be hidden altogether with `data-labels="false"`, which leaves an icon-only bar, but then each destination needs an `aria-label`.

## Accessibility

The bar is a navigation landmark, so it needs an `aria-label` to tell it apart from the other landmarks on a page. The component throws when one is missing.

The current destination is marked with `aria-current="page"`, which is how a screen reader announces which of the destinations you are on. Because the destinations are native anchors and buttons in a list, they are reachable with Tab, operable with Enter or Space, and announced with their position in the set. Each shows the standard focus outline.

With `data-labels="false"` there is no visible text left, so every destination has to be named with `aria-label` or `aria-labelledby`. The component logs an error when one is not.

When `data-hide-on-scroll` slides the bar out of view, it also leaves the tab order and the accessibility tree, so keyboard and screen reader users are never sent to a destination nobody can see. It returns on the first scroll up, and is always visible at the top of the scroll range.

## API Reference

### Component attribute(s)

```
x-h-bottom-nav
x-h-bottom-nav-list
x-h-bottom-nav-item
x-h-bottom-nav-link
x-h-bottom-nav-label
```

### Attributes

#### x-h-bottom-nav

| Attribute           | Type    | Required | Description                                                                                                                                                                                                                                 |
| ------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self`              | any     | false    | Expression holding the value of the current destination, for example `x-h-bottom-nav="tab"`. Leave it out to drive `data-active` yourself.                                                                                                  |
| aria-label          | string  | true     | Labels the navigation landmark. Required for ARIA compliance.                                                                                                                                                                               |
| data-position       | string  | false    | `sticky` keeps the bar at the bottom as the content scrolls, `fixed` docks it to the viewport and overlays the content, `static` leaves it in normal flow. Both docking modes reserve the phone's home indicator area. Default is `static`. |
| data-floating       | boolean | false    | Floating style bottom navigation - a detached card with a full border, rounded corners and an elevation instead of a single top border. It sets no position or spacing of its own, so lift and inset it with your own classes.              |
| data-labels         | boolean | false    | Set to `false` to hide the labels, leaving an icon-only bar. Each destination then needs an `aria-label` or `aria-labelledby`.                                                                                                              |
| data-hide-on-scroll | string  | false    | Slides the bar out of view while the content scrolls down and brings it back on the first scroll up. Use `true` to follow the page, or an expression naming the scrolling element, for example `data-hide-on-scroll="$refs.panel"`.         |

#### x-h-bottom-nav-item

| Attribute   | Type    | Required | Description                                                                                                                                                  |
| ----------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `self`      | any     | false    | Expression holding this destination's value, for example `x-h-bottom-nav-item="'home'"`. Compared against the bar's value to decide the current destination. |
| data-active | boolean | false    | Marks the destination as current, setting `aria-current="page"`. Managed by the component when both it and the bar have a value, and left to you otherwise.  |

### Events

| Event  | Description                                                                                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------- |
| change | Dispatched on a destination when it is tapped. `event.detail.value` is that destination's value, and it bubbles. |

### Styling

The bar takes its height from a CSS variable, applied through a utility class of its own.

| Name                  | Type     | Description                                                                                                                        |
| --------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `--bottom-nav-height` | variable | The height of the bar. Read it to size or offset anything that has to line up with the bar, and override it to change that height. |
| `h-bottom-nav`        | class    | Sets an element's height to `--bottom-nav-height`. The bar applies it to itself.                                                   |

Read the variable rather than hard coding a value, and whatever the theme or the version sets it to, the layout stays in step. It is how the [floating action button example](#alongside-a-floating-action-button) offsets the button so it clears the bar.

```html
<div style="padding-bottom: var(--bottom-nav-height)">...</div>
```

Override it on any ancestor to change the height, on `:root` for the whole application or on a wrapper for one bar.

```html
<div style="--bottom-nav-height: 4.5rem">...</div>
```

## Examples

### Basic

<LiveExample data-class="p-0 pt-12">

```html
<nav x-h-bottom-nav="tab" x-data="{ tab: 'home' }" aria-label="Main">
  <ul x-h-bottom-nav-list>
    <li x-h-bottom-nav-item="'home'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="house"></svg>
        <span x-h-bottom-nav-label>Home</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'search'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="search"></svg>
        <span x-h-bottom-nav-label>Search</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'messages'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="messages-square"></svg>
        <span x-h-bottom-nav-label>Messages</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'profile'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
        <span x-h-bottom-nav-label>Profile</span>
      </button>
    </li>
  </ul>
</nav>
```

</LiveExample>

### Floating

`data-floating="true"` makes the bar a detached card. In normal flow it takes no spacing of its own, so the margin here comes from the demo wrapper.

<LiveExample>

```html
<nav x-h-bottom-nav="tab" x-data="{ tab: 'search' }" data-floating="true" aria-label="Floating">
  <ul x-h-bottom-nav-list>
    <li x-h-bottom-nav-item="'home'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="house"></svg>
        <span x-h-bottom-nav-label>Home</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'search'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="search"></svg>
        <span x-h-bottom-nav-label>Search</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'messages'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="messages-square"></svg>
        <span x-h-bottom-nav-label>Messages</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'profile'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
        <span x-h-bottom-nav-label>Profile</span>
      </button>
    </li>
  </ul>
</nav>
```

</LiveExample>

### Floating and docked

A floating bar sets no position of its own, so combine it with `data-position` and your own offset.

<LiveExample data-class="p-0" data-style="height:14rem" data-exclude="generator">

```html
<div class="vbox size-full gap-2 overflow-y-auto p-4" x-data="{ tab: 'home' }">
  <template x-for="i in 12">
    <div x-h-text x-text="`Item ${i}`"></div>
  </template>
  <nav x-h-bottom-nav="tab" data-floating="true" data-position="sticky" aria-label="Main">
    <ul x-h-bottom-nav-list>
      <li x-h-bottom-nav-item="'home'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="house"></svg>
          <span x-h-bottom-nav-label>Home</span>
        </button>
      </li>
      <li x-h-bottom-nav-item="'search'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="search"></svg>
          <span x-h-bottom-nav-label>Search</span>
        </button>
      </li>
      <li x-h-bottom-nav-item="'profile'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
          <span x-h-bottom-nav-label>Profile</span>
        </button>
      </li>
    </ul>
  </nav>
</div>
```

</LiveExample>

### Switching content

The bar's expression is an ordinary Alpine value, so the same variable that drives the highlight can drive what the screen shows.

<LiveExample data-class="p-0" data-exclude="generator">

```html
<div class="vbox size-full" x-data="{ tab: 'home' }">
  <div class="flex flex-1 items-center justify-center p-6">
    <span x-h-text x-text="`The ${tab} screen`"></span>
  </div>
  <nav x-h-bottom-nav="tab" aria-label="Main">
    <ul x-h-bottom-nav-list>
      <li x-h-bottom-nav-item="'home'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="house"></svg>
          <span x-h-bottom-nav-label>Home</span>
        </button>
      </li>
      <li x-h-bottom-nav-item="'search'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="search"></svg>
          <span x-h-bottom-nav-label>Search</span>
        </button>
      </li>
      <li x-h-bottom-nav-item="'settings'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="settings"></svg>
          <span x-h-bottom-nav-label>Settings</span>
        </button>
      </li>
    </ul>
  </nav>
</div>
```

</LiveExample>

### With a badge

A destination anchors a [Badge](/components/badge) indicator, so an unread count or a dot can sit on its icon.

<LiveExample data-class="p-0 pt-12" data-exclude="generator">

```html
<nav x-h-bottom-nav="tab" x-data="{ tab: 'home' }" aria-label="Main">
  <ul x-h-bottom-nav-list>
    <li x-h-bottom-nav-item="'home'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="house"></svg>
        <span x-h-bottom-nav-label>Home</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'messages'">
      <button x-h-bottom-nav-link>
        <span class="relative">
          <svg x-h-lucide role="presentation" data-lucide="messages-square"></svg>
          <span x-h-badge-indicator>12</span>
        </span>
        <span x-h-bottom-nav-label>Messages</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'alerts'">
      <button x-h-bottom-nav-link>
        <span class="relative">
          <svg x-h-lucide role="presentation" data-lucide="bell"></svg>
          <span x-h-badge-indicator data-dot="true" data-variant="negative"></span>
        </span>
        <span x-h-bottom-nav-label>Alerts</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'profile'">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
        <span x-h-bottom-nav-label>Profile</span>
      </button>
    </li>
  </ul>
</nav>
```

</LiveExample>

Wrapping the icon in a `relative` span anchors the indicator to the icon rather than to the whole destination. Leave the wrapper out and the badge sits in the corner of the tap target instead.

### Icon only

`data-labels="false"` hides the labels. The labels stay in the markup, so each destination keeps an accessible name without an extra attribute, but naming them explicitly is clearer.

<LiveExample data-class="p-0 pt-12" data-exclude="generator">

```html
<nav x-h-bottom-nav="tab" x-data="{ tab: 'search' }" data-labels="false" aria-label="Main">
  <ul x-h-bottom-nav-list>
    <li x-h-bottom-nav-item="'home'">
      <button x-h-bottom-nav-link aria-label="Home">
        <svg x-h-lucide role="presentation" data-lucide="house"></svg>
        <span x-h-bottom-nav-label>Home</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'search'">
      <button x-h-bottom-nav-link aria-label="Search">
        <svg x-h-lucide role="presentation" data-lucide="search"></svg>
        <span x-h-bottom-nav-label>Search</span>
      </button>
    </li>
    <li x-h-bottom-nav-item="'profile'">
      <button x-h-bottom-nav-link aria-label="Profile">
        <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
        <span x-h-bottom-nav-label>Profile</span>
      </button>
    </li>
  </ul>
</nav>
```

</LiveExample>

### Links

Use anchors when each destination is a real URL. The current one is still marked from the bar's value, so a server-rendered page can set that value once and the bar highlights the right destination.

<LiveExample data-class="p-0 pt-12" data-exclude="generator">

```html
<nav x-h-bottom-nav="page" x-data="{ page: 'components' }" aria-label="Documentation">
  <ul x-h-bottom-nav-list>
    <li x-h-bottom-nav-item="'components'">
      <a x-h-bottom-nav-link href="#">
        <svg x-h-lucide role="presentation" data-lucide="blocks"></svg>
        <span x-h-bottom-nav-label>Components</span>
      </a>
    </li>
    <li x-h-bottom-nav-item="'layouts'">
      <a x-h-bottom-nav-link href="#">
        <svg x-h-lucide role="presentation" data-lucide="layout-dashboard"></svg>
        <span x-h-bottom-nav-label>Layouts</span>
      </a>
    </li>
    <li x-h-bottom-nav-item="'charts'">
      <a x-h-bottom-nav-link href="#">
        <svg x-h-lucide role="presentation" data-lucide="chart-no-axes-combined"></svg>
        <span x-h-bottom-nav-label>Charts</span>
      </a>
    </li>
  </ul>
</nav>
```

</LiveExample>

### Docked to the bottom

`data-position="sticky"` keeps the bar at the bottom as the content scrolls past it. Scroll to the end and the last row appears above the bar rather than under it.

<LiveExample data-class="p-0" data-style="height:14rem" data-exclude="generator">

```html
<div x-data="{ tab: 'home' }" class="size-full">
  <div class="vbox size-full gap-2 overflow-y-auto pt-6">
    <template x-for="i in 12">
      <div class="px-6" x-h-text x-text="`Item ${i}`"></div>
    </template>
    <nav x-h-bottom-nav="tab" data-position="sticky" aria-label="Main">
      <ul x-h-bottom-nav-list>
        <li x-h-bottom-nav-item="'home'">
          <button x-h-bottom-nav-link>
            <svg x-h-lucide role="presentation" data-lucide="house"></svg>
            <span x-h-bottom-nav-label>Home</span>
          </button>
        </li>
        <li x-h-bottom-nav-item="'search'">
          <button x-h-bottom-nav-link>
            <svg x-h-lucide role="presentation" data-lucide="search"></svg>
            <span x-h-bottom-nav-label>Search</span>
          </button>
        </li>
        <li x-h-bottom-nav-item="'profile'">
          <button x-h-bottom-nav-link>
            <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
            <span x-h-bottom-nav-label>Profile</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>
```

</LiveExample>

### Hides on scroll

`data-hide-on-scroll` slides the bar out of view while the content scrolls down and brings it back on the first scroll up. Point it at the element that scrolls with a template ref, or use `true` to follow the page instead.

<LiveExample data-class="p-0" data-style="height:16rem" data-exclude="generator">

```html
<div class="relative size-full overflow-hidden" style="transform: translate(0)" x-data="{ tab: 'home' }">
  <div class="vbox size-full gap-2 overflow-y-auto py-6" x-ref="panel">
    <template x-for="i in 40">
      <div class="px-6" x-h-text x-text="`Item ${i}`"></div>
    </template>
    <nav x-h-bottom-nav="tab" data-position="fixed" data-hide-on-scroll="$refs.panel" aria-label="Main">
      <ul x-h-bottom-nav-list>
        <li x-h-bottom-nav-item="'home'">
          <button x-h-bottom-nav-link>
            <svg x-h-lucide role="presentation" data-lucide="house"></svg>
            <span x-h-bottom-nav-label>Home</span>
          </button>
        </li>
        <li x-h-bottom-nav-item="'search'">
          <button x-h-bottom-nav-link>
            <svg x-h-lucide role="presentation" data-lucide="search"></svg>
            <span x-h-bottom-nav-label>Search</span>
          </button>
        </li>
        <li x-h-bottom-nav-item="'profile'">
          <button x-h-bottom-nav-link>
            <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
            <span x-h-bottom-nav-label>Profile</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
</div>
```

</LiveExample>

### Alongside a floating action button

A bottom navigation carries the destinations and a [Floating Action Button](/components/fab) carries the primary action, so the two often appear together. Offset the button so it clears the bar.

<LiveExample data-class="p-0" data-style="height:16rem" data-exclude="generator">

```html
<div class="relative size-full overflow-hidden" style="transform: translate(0)" x-data="{ tab: 'messages' }">
  <div class="vbox size-full gap-2 overflow-y-auto" x-ref="panel">
    <div class="vbox gap-4 p-4">
      <template x-for="i in 12">
        <div x-h-text x-text="`Message ${i}`"></div>
      </template>
    </div>
  </div>
  <button x-h-fab="$refs.panel" data-hide-on-scroll="true" class="absolute" style="right: 1rem; bottom: calc(var(--bottom-nav-height) + 1rem)" data-variant="primary" data-shape="round" aria-label="Compose">
    <svg x-h-lucide role="presentation" data-lucide="pencil"></svg>
  </button>
  <nav x-h-bottom-nav="tab" data-position="fixed" aria-label="Main" data-hide-on-scroll="$refs.panel">
    <ul x-h-bottom-nav-list>
      <li x-h-bottom-nav-item="'home'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="house"></svg>
          <span x-h-bottom-nav-label>Home</span>
        </button>
      </li>
      <li x-h-bottom-nav-item="'messages'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="messages-square"></svg>
          <span x-h-bottom-nav-label>Messages</span>
        </button>
      </li>
      <li x-h-bottom-nav-item="'profile'">
        <button x-h-bottom-nav-link>
          <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
          <span x-h-bottom-nav-label>Profile</span>
        </button>
      </li>
    </ul>
  </nav>
</div>
```

</LiveExample>

### Driving the active state yourself

Leave the expressions out and the nav will not change the state. Set `data-active` on the item you want highlighted.

<LiveExample data-class="p-0 pt-12" data-exclude="generator">

```html
<nav x-h-bottom-nav aria-label="Main">
  <ul x-h-bottom-nav-list>
    <li x-h-bottom-nav-item>
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="house"></svg>
        <span x-h-bottom-nav-label>Home</span>
      </button>
    </li>
    <li x-h-bottom-nav-item data-active="true">
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="search"></svg>
        <span x-h-bottom-nav-label>Search</span>
      </button>
    </li>
    <li x-h-bottom-nav-item>
      <button x-h-bottom-nav-link>
        <svg x-h-lucide role="presentation" data-lucide="circle-user"></svg>
        <span x-h-bottom-nav-label>Profile</span>
      </button>
    </li>
  </ul>
</nav>
```

</LiveExample>
