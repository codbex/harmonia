# Testing

Every Harmonia component marks its element with a `data-slot` attribute, and so do the key elements a component creates on its own, such as the trigger button of a select or the gutter of a split. The values are part of the public API, so they are the stable way to find a Harmonia element in a test, a script or a stylesheet.

## Selecting elements

Select a Harmonia element by its `data-slot` value. Every component page lists the values it produces in the **Data Slots** table of its API Reference.

A page usually holds more than one instance of a component, so scope the selector to an id or to an element you already hold:

```html
<div id="country" x-h-select>
  <input x-h-select-input placeholder="Country" />
  <div x-h-select-content>
    <div x-h-select-list>
      <div x-h-select-option="'Germany'" data-value="de"></div>
      <div x-h-select-option="'France'" data-value="fr"></div>
    </div>
  </div>
</div>
```

In an end-to-end test, for example with [Playwright](https://playwright.dev/):

```js
await page.locator('#country [data-slot="select-input"]').click();
await page.locator('#country [data-slot="select-option"]', { hasText: 'France' }).click();
```

In a script or a unit test:

```js
const trigger = document.querySelector('#country [data-slot="select-input"]');
const card = event.target.closest('[data-slot="card"]');
```

## Stability

The `data-slot` values are public API. A value is only renamed or removed in a major release, and every such change is listed in the changelog. See [Versioning and Support](/versioning-and-support).

Tailwind classes, tag names and the position of an element in the DOM are not part of the public API and may change in any release. Do not select Harmonia elements by them.

## Rules

- Do not set or change `data-slot` on an element that carries a Harmonia directive. The component sets it.
- Some directives add behavior to an element that another component owns, for example `x-h-menu-trigger` or `x-h-tooltip-trigger` on an `x-h-button`. They leave the slot of that element unchanged, so `<button x-h-button x-h-menu-trigger>` is still `[data-slot="button"]`.
- Utilities such as `x-h-focus` or `x-h-template` set no slot.

## Styling with data-slot

`data-slot` is also a supported styling hook. Plain CSS works with any build:

```css
[data-slot='card-title'] {
  letter-spacing: 0.01em;
}
```

A Tailwind arbitrary variant such as `[&_[data-slot=card-title]]:tracking-wide` only works when your own Tailwind build compiles it. See [Extend Utility Classes](/extend-utility-classes).
