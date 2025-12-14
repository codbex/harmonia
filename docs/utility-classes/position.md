# Position

Element positioning.

## Class names

| Class        | Description                              |
| ------------ | ---------------------------------------- |
| absolute     | `position: absolute;`                    |
| absolute-fit | ` top: 0; left: 0; right: 0; bottom: 0;` |
| relative     | `position: relative;`                    |

## Examples

### Scrollable tab content

<br />

<ClientOnly>
<component-container data-padding="false">
<div x-h-tabs data-orientation="horizontal" style="height:22rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="stc1" aria-controls="stc1c" aria-selected="true">Tab 1</button>
    </div>
  </div>
  <div class="relative" x-h-tabs-content id="stc1c" aria-labelledby="stc1">
    <div class="absolute-fit absolute overflow-scroll">
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media>
            <img src="/logo/harmonia.svg" alt="@harmonia" width="240px" />
          </div>
          <div x-h-info-page-title>Harmonia UI</div>
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
    <div class="absolute-fit absolute overflow-scroll">
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media>
            <img src="/logo/harmonia.svg" alt="@harmonia" width="240px" />
          </div>
          <div x-h-info-page-title>Harmonia UI</div>
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
