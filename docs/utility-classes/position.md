# Position

Element positioning.

## Class names

| Class           | Description                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| fixed           | `position: fixed;`                                                                                                                               |
| sticky          | `position: sticky;`                                                                                                                              |
| absolute        | `position: absolute;`                                                                                                                            |
| relative        | `position: relative;`                                                                                                                            |
| top-0           | `top: 0;`                                                                                                                                        |
| right-0         | `right: 0;`                                                                                                                                      |
| bottom-0        | `bottom: 0;`                                                                                                                                     |
| left-0          | `left: 0;`                                                                                                                                       |
| position-fit    | ` top: 0; left: 0; right: 0; bottom: 0;` Fills the relative parent. Combine with `absolute` or `fixed`.                                          |
| position-center | `top: 50%; left: 50%; transform: translate(-50%, -50%);` Centers the element within its positioned ancestor. Combine with `absolute` or `fixed`. |

## Examples

### Centered overlay

<ClientOnly>
<component-container>
<div class="relative border rounded-control" style="width:100%;height:8rem">
  <span class="position-center absolute font-medium">Centered</span>
</div>
</component-container>
</ClientOnly>

```html
<div class="relative" style="height:8rem">
  <span class="position-center absolute font-medium">Centered</span>
</div>
```

### Scrollable tab content

<ClientOnly>
<component-container data-class="p-0">
<div x-h-tabs data-orientation="horizontal" style="height:22rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="stc1" aria-controls="stc1c" aria-selected="true">Tab 1</button>
    </div>
  </div>
  <div class="relative" x-h-tabs-content id="stc1c" aria-labelledby="stc1">
    <div class="position-fit absolute overflow-auto">
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media>
            <img src="/logo/harmonia.svg" alt="@harmonia" width="240px" />
          </div>
          <div x-h-info-page-title>Harmonia</div>
          <div x-h-info-page-description>UI component library for Alpine.js</div>
        </div>
        <div x-h-info-page-content>
          <button x-h-button data-variant="primary">GitHub Page</button>
        </div>
      </div>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal" style="height:22rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="stc1" aria-controls="stc1c" aria-selected="true">Tab 1</button>
    </div>
  </div>
  <div class="relative" x-h-tabs-content id="stc1c" aria-labelledby="stc1">
    <div class="position-fit absolute overflow-auto">
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media>
            <img src="/logo/harmonia.svg" alt="@harmonia" width="240px" />
          </div>
          <div x-h-info-page-title>Harmonia</div>
          <div x-h-info-page-description>UI component library for Alpine.js</div>
        </div>
        <div x-h-info-page-content>
          <button x-h-button data-variant="primary">GitHub Page</button>
        </div>
      </div>
    </div>
  </div>
</div>
```
