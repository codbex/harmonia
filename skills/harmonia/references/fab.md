# Floating Action Button

A floating action button presents the single most important action of a screen as a prominent, elevated button that can stay pinned to a bottom corner while the rest of the page scrolls beneath it.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use one floating action button per screen, for the action people reach for most, like composing a message, creating a record or adding a new item. Because it is always visible and always in the same place, it earns that prominence only when the action behind it is genuinely primary. For anything less, use a regular Button.

The non-extended FABs carry only an icon, so the icon has to be unambiguous. When the action needs words to be clear, use the `extended` size, which pairs the icon with a visible label. Keep that label to one or two words.

Positioning is opt-in. By default the button sits in normal flow, so you can place it with your own layout, for example absolutely inside a scrollable panel or a card. Set `data-position` to pin it to the bottom left or bottom right of the viewport, 1rem from each edge.

On a long page the button can get out of the way while people read. Set `data-hide-on-scroll="true"` and it slides out of view on the way down and comes back on the first scroll up. Point it at the element that scrolls with a template ref (`x-h-fab="$refs.panel"`) or leave the expression out to follow the page.

## Directive

- `x-h-fab`

## API

### Attributes

| Attribute           | Type                                                                                                      | Required | Description                                                                                                                                                                      |
| ------------------- | --------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self`              | element                                                                                                   | false    | The element that scrolls, for `data-hide-on-scroll`. Pass it with a template ref, for example `x-h-fab="$refs.panel"`. Leave the expression out to follow the page instead.      |
| data-size           | `sm`<br />`default`<br />`lg`<br />`extended`                                                             | false    | Changes the size of the button. `sm`, `default` and `lg` hold an icon only, while `extended` is a pill that holds an icon and a label.                                           |
| data-variant        | `default`<br />`primary`<br />`positive`<br />`negative`<br />`warning`<br />`information`<br />`outline` | false    | Changes the color of the button. Can be used to indicate the intent of the action.                                                                                               |
| data-shape          | `round`                                                                                                   | false    | Makes the button fully round, turning the icon-only sizes into circles and giving the `extended` size stadium ends.                                                              |
| data-position       | `bottom-right`<br />`bottom-left`<br />`static`                                                           | false    | Pins the button to a bottom corner of the viewport, 1rem from each edge. `static` applies no positioning, leaving the button in normal flow. Default is `static`.                |
| data-hide-on-scroll | boolean                                                                                                   | false    | When set to `true`, slides the button out of view while the content scrolls down and brings it back on the first scroll up. It always comes back at the top of the scroll range. |

## Accessibility

Non-extended floating action buttons show no text, so they must be given an accessible name through `aria-label` or `aria-labelledby`. The component logs an error when neither is present. The `extended` size already has a visible label and needs no extra attribute.

The button is a native `button` element, so it is focusable, operable with the keyboard, and shows the standard focus outline. A pinned button sits above page content but below dialogs, sheets, and notifications, so an open modal is never obscured. Leave enough room around a pinned button that it does not cover content people still need to reach.

When the `data-hide-on-scroll` attribute is set to `true` and the button is scrolled out of view, it leaves the tab order and the accessibility tree, so keyboard and screen reader users are never sent to a button nobody can see. It returns on the first scroll up, and it is always visible at the top of the scroll range.

## Examples

### Default

```html
<button x-h-fab aria-label="Create">
  <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
</button>
```

### Round

```html
<button x-h-fab data-shape="round" aria-label="Create">
  <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
</button>
```

### Primary

```html
<button x-h-fab data-variant="primary" aria-label="Create">
  <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
</button>
```

### Positive

```html
<button x-h-fab data-variant="positive" aria-label="Confirm">
  <svg x-h-lucide role="presentation" data-lucide="check"></svg>
</button>
```

### Negative

```html
<button x-h-fab data-variant="negative" aria-label="Delete">
  <svg x-h-lucide role="presentation" data-lucide="trash"></svg>
</button>
```

### Warning

```html
<button x-h-fab data-variant="warning" aria-label="Review">
  <svg x-h-lucide role="presentation" data-lucide="circle-alert"></svg>
</button>
```

### Information

```html
<button x-h-fab data-variant="information" aria-label="Details">
  <svg x-h-lucide role="presentation" data-lucide="info"></svg>
</button>
```

### Outline

```html
<button x-h-fab data-variant="outline" aria-label="Edit">
  <svg x-h-lucide role="presentation" data-lucide="pencil"></svg>
</button>
```

### Extended

The extended size pairs the icon with a visible label, so it needs no `aria-label`.

```html
<button x-h-fab data-variant="primary" data-size="extended">
  <svg x-h-lucide role="presentation" data-lucide="pencil"></svg>
  <span>Compose</span>
</button>
<button x-h-fab data-variant="primary" data-size="extended" data-shape="round">
  <svg x-h-lucide role="presentation" data-lucide="pencil"></svg>
  <span>Compose</span>
</button>
```

### Sizes

```html
<button x-h-fab data-size="sm" aria-label="Create">
  <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
</button>
<button x-h-fab aria-label="Create">
  <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
</button>
<button x-h-fab data-size="lg" aria-label="Create">
  <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
</button>
```

### Pinned to a corner

Setting `data-position` pins the button to a bottom corner of the viewport. The demo below scopes it to the box instead, so you can try both corners without the button covering this page.

> **Note:**
> A pinned button is normally fixed to the viewport. What keeps it inside the box below is the `transform: translate(0)` on the wrapper. Any element with a transform becomes the reference for the fixed positioning of everything inside it. Use the same trick when you want a floating action button scoped to one region of a page rather than to the whole window/viewport.

```html
<div class="relative size-full overflow-hidden" style="transform: translate(0)" x-data="{ corner: 'bottom-right' }">
  <div class="vbox items-start gap-2 p-6">
    <button x-h-button data-size="sm" @click="corner = 'bottom-left'">Bottom left</button>
    <button x-h-button data-size="sm" @click="corner = 'bottom-right'">Bottom right</button>
  </div>

  <button x-h-fab data-variant="primary" data-shape="round" :data-position="corner" aria-label="Create">
    <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
  </button>
</div>
```

### Inside a scrollable panel

Without `data-position` the button stays in normal flow, so you can place it yourself. Here it is positioned absolutely inside a panel, staying put while the content behind it scrolls.

```html
<div class="relative size-full overflow-hidden">
  <div class="vbox size-full gap-2 overflow-y-auto p-6">
    <template x-for="i in 20">
      <div x-h-text x-text="`Item ${i}`"></div>
    </template>
  </div>
  <button class="absolute" style="right: 1rem; bottom: 1rem" data-variant="primary" x-h-fab data-shape="round" aria-label="Add item">
    <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
  </button>
</div>
```

### Hides on scroll

`data-hide-on-scroll="true"` slides the button out of view while the content scrolls down and brings it back on the first scroll up. Point it at the element that scrolls with a template ref, or leave the expression out to follow the page instead.
The ref names the scrolling element, so it does not have to be an ancestor of the button. Here it is a sibling. Scroll the panel down and the button slides away, scroll back up and it returns.

```html
<div x-data class="relative size-full overflow-hidden">
  <div class="vbox size-full gap-2 overflow-y-auto p-6" x-ref="panel">
    <template x-for="i in 40">
      <div x-h-text x-text="`Item ${i}`"></div>
    </template>
  </div>
  <button class="absolute" style="right: 1rem; bottom: 1rem" data-variant="primary" x-h-fab="$refs.panel" data-hide-on-scroll="true" data-shape="round" aria-label="Add item">
    <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
  </button>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/fab.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
