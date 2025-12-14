# Input Group

Groups an input or textarea field with other elements.

## API Reference

### Component attubute(s)

```
x-h-input-group
x-h-input-group-addon
x-h-input-group-text
```

### Attributes

#### x-h-input-group-addon

| Attribute     | Values                                                            | Required | Description                                       |
| ------------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------- |
| data-align    | `inline-start`<br/>`inline-end`<br/>`block-start`<br/>`block-end` | false    | Aligns the addon relative to the group. See note. |
| data-disabled | boolean                                                           | false    | Disables the addon.                               |

::: info Focus Navigation
In order to achieve proper focus navigation, place the group addon after the input and then set the align prop to position it.
:::

## Examples

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-input-group>
  <input x-h-input.group placeholder="Search..." />
  <div x-h-input-group-addon data-align="inline-start">
    <i role="img" data-lucide="search"></i>
  </div>
  <div x-h-input-group-addon data-align="inline-end">12 results</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="Search..." />
  <div x-h-input-group-addon data-align="inline-start">
    <i role="img" data-lucide="search"></i>
  </div>
  <div x-h-input-group-addon data-align="inline-end">12 results</div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-input-group>
  <input x-h-input.group placeholder="https://..." />
  <div x-h-input-group-addon data-align="inline-start">
    <button x-h-button.group x-h-popover-trigger data-size="icon-xs" aria-label="info"><i role="img" data-lucide="info"></i></button>
    <div class="p-4" x-h-popover>This is a popover with some info.</div>
  </div>
  <div x-h-input-group-addon data-align="inline-end">
    <button x-h-button.group>Go</button>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="https://..." />
  <div x-h-input-group-addon data-align="inline-start">
    <button x-h-button.group x-h-popover-trigger data-size="icon-xs" aria-label="info"><i role="img" data-lucide="info"></i></button>
    <div class="p-4" x-h-popover>This is a popover with some info.</div>
  </div>
  <div x-h-input-group-addon data-align="inline-end">
    <button x-h-button.group>Go</button>
  </div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-input-group>
  <input x-h-input.group placeholder="Searching..." disabled />
  <div x-h-input-group-addon data-align="inline-end">
    <span x-h-spinner></span>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-input-group>
  <input x-h-input.group placeholder="Searching..." disabled />
  <div x-h-input-group-addon data-align="inline-end">
    <span x-h-spinner></span>
  </div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-input-group>
  <textarea x-h-textarea.group placeholder="Message..."></textarea>
  <div x-h-input-group-addon data-align="block-start" class="border-b">
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make bold">
      <i role="img" data-lucide="bold"></i>
    </button>
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make italic">
      <i role="img" data-lucide="italic"></i>
    </button>
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make underline">
      <i role="img" data-lucide="italic"></i>
    </button>
    <span x-h-separator data-orientation="vertical"></span>
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make underline">
      <i role="img" data-lucide="link"></i>
    </button>
  </div>
  <div x-h-input-group-addon data-align="block-end" class="border-t">
    <button id="attachFile" x-h-button.group x-h-menu-trigger.dropdown data-size="icon-xs" data-variant="outline" class="rounded-full" aria-label="Attach">
      <i role="img" data-lucide="plus"></i>
    </button>
    <ul x-h-menu data-align="top-start" aria-labelledby="attachFile">
      <li x-h-menu-item>List</li>
      <li x-h-menu-item>Text snipplet</li>
      <li x-h-menu-item>Upload file</li>
    </ul>
    <span x-h-input-group-text class="ml-auto">0/300</span>
    <button x-h-button.group data-size="icon-xs" data-variant="primary" class="rounded-full" aria-label="Send">
      <i role="img" data-lucide="arrow-up"></i>
    </button>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-input-group>
  <textarea x-h-textarea.group placeholder="Message..."></textarea>
  <div x-h-input-group-addon data-align="block-start" class="border-b">
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make bold">
      <i role="img" data-lucide="bold"></i>
    </button>
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make italic">
      <i role="img" data-lucide="italic"></i>
    </button>
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make underline">
      <i role="img" data-lucide="italic"></i>
    </button>
    <span x-h-separator data-orientation="vertical"></span>
    <button x-h-button.group data-size="icon-xs" data-variant="transparent" aria-label="make underline">
      <i role="img" data-lucide="link"></i>
    </button>
  </div>
  <div x-h-input-group-addon data-align="block-end" class="border-t">
    <button id="attachFile" x-h-button.group x-h-menu-trigger.dropdown data-size="icon-xs" data-variant="outline" class="rounded-full" aria-label="Attach">
      <i role="img" data-lucide="plus"></i>
    </button>
    <ul x-h-menu data-align="top-start" aria-labelledby="attachFile">
      <li x-h-menu-item>List</li>
      <li x-h-menu-item>Text snipplet</li>
      <li x-h-menu-item>Upload file</li>
    </ul>
    <span x-h-input-group-text class="ml-auto">0/300</span>
    <button x-h-button.group data-size="icon-xs" data-variant="primary" class="rounded-full" aria-label="Send">
      <i role="img" data-lucide="arrow-up"></i>
    </button>
  </div>
</div>
```
