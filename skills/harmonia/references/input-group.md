# Input Group

Combines an input or textarea field with related elements, such as buttons, icons, or labels, to create a cohesive and interactive form control. Input Groups help visually associate related functionality with a single field.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use Input Groups when you want to attach supplementary actions or indicators to a form field, such as a submit button, a search icon, or a unit label. Make sure the grouping is intuitive and does not compromise accessibility or clarity of the main input.

## Directives

`x-h-input-group` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-input-group`
- `x-h-input-group-addon`
- `x-h-input-group-text`

## API

### Attributes

#### x-h-input-group

| Attribute | Values             | Required | Description                    |
| --------- | ------------------ | -------- | ------------------------------ |
| data-size | `sm`<br/>`default` | false    | Changes the size of the input. |

#### x-h-input-group-addon

| Attribute     | Values                                                            | Required | Description                                       |
| ------------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------- |
| data-align    | `inline-start`<br/>`inline-end`<br/>`block-start`<br/>`block-end` | false    | Aligns the addon relative to the group. See note. |
| data-disabled | boolean                                                           | false    | Disables the addon.                               |

> **Note:** Focus Navigation
> In order to achieve proper focus navigation, place the group addon after the input and then set the align prop to position it.

## Examples

### Search bar

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="Search..." />
  <div x-h-input-group-addon data-align="inline-start">
    <svg x-h-lucide role="presentation" data-lucide="search"></svg>
  </div>
  <div x-h-input-group-addon data-align="inline-end">12 results</div>
</div>
```

### Search bar with tags

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="Search..." />
  <div x-h-input-group-addon data-align="inline-start">
    <svg x-h-lucide role="presentation" data-lucide="search"></svg>
  </div>
  <div x-h-input-group-addon data-align="inline-end">
    <div x-h-tag-group>
      <div x-h-tag>Ctrl</div>
      <span>+</span>
      <div x-h-tag>F</div>
    </div>
  </div>
</div>
```

### Search bar with buttons and popover

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="https://..." />
  <div x-h-input-group-addon data-align="inline-start">
    <button x-h-button.addon x-h-popover-trigger data-size="icon-sm" aria-label="info">
      <svg x-h-lucide role="presentation" data-lucide="info"></svg>
    </button>
    <div class="p-4" x-h-popover>This is a popover with some info.</div>
  </div>
  <div x-h-input-group-addon data-align="inline-end">
    <button x-h-button.addon>Go</button>
  </div>
</div>
```

### Search bar with spinner

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="Searching..." disabled />
  <div x-h-input-group-addon data-align="inline-end">
    <span x-h-spinner></span>
  </div>
</div>
```

### Disabled

Set the native `disabled` attribute on the grouped input and `data-disabled="true"` on the addon(s).

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="Search..." disabled />
  <div x-h-input-group-addon data-align="inline-start" data-disabled="true">
    <svg x-h-lucide role="presentation" data-lucide="search"></svg>
  </div>
  <div x-h-input-group-addon data-align="inline-end" data-disabled="true">12 results</div>
</div>
```

### Textarea with top and bottom toolbars

```html
<div x-h-input-group>
  <textarea x-h-textarea.group placeholder="Message..."></textarea>
  <div x-h-input-group-addon data-align="block-start" class="border-b">
    <button x-h-button.addon data-size="icon-sm" data-variant="transparent" aria-label="make bold">
      <svg x-h-lucide role="presentation" data-lucide="bold"></svg>
    </button>
    <button x-h-button.addon data-size="icon-sm" data-variant="transparent" aria-label="make italic">
      <svg x-h-lucide role="presentation" data-lucide="italic"></svg>
    </button>
    <button x-h-button.addon data-size="icon-sm" data-variant="transparent" aria-label="make underline">
      <svg x-h-lucide role="presentation" data-lucide="italic"></svg>
    </button>
    <span x-h-separator data-orientation="vertical"></span>
    <button x-h-button.addon data-size="icon-sm" data-variant="transparent" aria-label="make underline">
      <svg x-h-lucide role="presentation" data-lucide="link"></svg>
    </button>
  </div>
  <div x-h-input-group-addon data-align="block-end" class="border-t">
    <button id="attachFile" x-h-button.addon x-h-menu-trigger.dropdown data-size="icon-sm" data-variant="outline" class="rounded-full" aria-label="Attach">
      <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
    </button>
    <ul x-h-menu data-align="top-start" aria-labelledby="attachFile">
      <li x-h-menu-item>List</li>
      <li x-h-menu-item>Text snippet</li>
      <li x-h-menu-item>Upload file</li>
    </ul>
    <span x-h-input-group-text class="ml-auto">0/300</span>
    <button x-h-button.addon data-size="icon-sm" data-variant="primary" class="rounded-full" aria-label="Send">
      <svg x-h-lucide role="presentation" data-lucide="arrow-up"></svg>
    </button>
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/input-group.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
