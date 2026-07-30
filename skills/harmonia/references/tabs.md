# Tabs

Organizes content into multiple sections, displaying only one section at a time while keeping others easily accessible through a tabbed navigation interface. Tabs help structure information without overwhelming the user.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use tabs to group related content or functionality, allowing users to switch between sections without leaving the current view.

A tab can carry one action, such as a close button, by placing `x-h-tab-action` on a `<span>` inside it.

## Directives

`x-h-tabs` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-tabs`
- `x-h-tab-bar`
- `x-h-tab-list`
- `x-h-tab`
- `x-h-tab-action`
- `x-h-tab-list-actions`
- `x-h-tab-list-action`
- `x-h-tabs-content`

## API

### Attributes

#### x-h-tabs

| Attribute        | Type                         | Required | Description                             |
| ---------------- | ---------------------------- | -------- | --------------------------------------- |
| data-orientation | `horizontal`<br />`vertical` | true     | Changes the orientation of the tab list |

#### x-h-tab-bar

| Attribute     | Type                          | Required | Description                                                                                 |
| ------------- | ----------------------------- | -------- | ------------------------------------------------------------------------------------------- |
| data-floating | boolean                       | false    | Floating style tab list.                                                                    |
| data-size     | `default`<br />`sm`<br />`lg` | false    | Height of the tab bar. Ignored when the tab bar is floating or the orientation is vertical. |

#### x-h-tab

| Attribute     | Type    | Required | Description                                                                                                                |
| ------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| id            | string  | true     | Identifies the tab. The panel's `aria-labelledby` must point at it.                                                        |
| aria-controls | string  | true     | The `id` of the tab content this tab shows.                                                                                |
| aria-selected | boolean | false    | Marks the tab as selected. Bind it to your own state. Defaults to `false` when it is left out.                             |
| aria-disabled | boolean | false    | Marks the tab unavailable while keeping it focusable and announced. It can be reached with the keyboard but not activated. |

#### x-h-tab-action

> Must be applied to a `<span>` element. A tab can only have one action.

| Attribute       | Type   | Required | Description                                        |
| --------------- | ------ | -------- | -------------------------------------------------- |
| aria-label      | string | true\*   | Accessible label for the action                    |
| aria-labelledby | string | true\*   | References an element whose text labels the action |

> **Note:**
> One of `aria-label` or `aria-labelledby` is required.

#### x-h-tabs-content

| Attribute       | Type    | Required | Description                                                                                                                             |
| --------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| id              | string  | true     | The `id` the tab's `aria-controls` points at.                                                                                           |
| aria-labelledby | string  | true     | The `id` of the tab that labels this content.                                                                                           |
| hidden          | boolean | false    | Show/hide the tab content                                                                                                               |
| tabindex        | string  | false    | Defaults to `0` so the panel is reachable. Set it to `-1` when the panel already contains focusable content, to avoid a redundant stop. |

#### x-h-tab-list-action

| Attribute    | Type                         | Required | Description                                            |
| ------------ | ---------------------------- | -------- | ------------------------------------------------------ |
| data-variant | `outline`<br />`transparent` | false    | Changes the style of the button. Default is `outline`. |

### Modifiers

#### x-h-tab-list-actions

| Modifier | Description                                                     |
| -------- | --------------------------------------------------------------- |
| end      | Tab action will be placed at the end of the tab list container. |

## Keyboard Handling

The tab list is a single Tab stop that lands on the selected tab, so reaching the content does not mean tabbing past every other tab. Once a tab has focus:

- `Right` / `Left` - Moves focus to the next or previous tab, wrapping around at both ends. Horizontal orientation only.
- `Down` / `Up` - Moves focus to the next or previous tab, wrapping around at both ends. Vertical orientation only.
- `Home` / `End` - Moves focus to the first or last tab.
- `Enter` / `Space` - Activates the focused tab.

Tabs disabled with the native `disabled` attribute are skipped. Tabs with `aria-disabled="true"` are still reached by the arrows, `Home` and `End`, and are announced as unavailable, but neither a click nor `Enter` activates them. Moving focus does not change the selection, so the tabs can be looked through before one is activated.

A tab action shares its tab's place in the tab order, so `Tab` from the focused tab moves to its action, where `Enter` / `Space` activates it. Only the action of the tab holding the tab stop is reachable this way, which keeps the tab list a single Tab stop.

## Accessibility

The tab list, tabs and panels get their `tablist`, `tab` and `tabpanel` roles automatically, and the list mirrors `data-orientation` as `aria-orientation` so the navigation axis is announced correctly.

Selection stays yours to drive. Bind `aria-selected` on each tab and `hidden` on each panel to the same value. A tab written without `aria-selected` is announced as not selected. The roving tab stop follows the selected tab, so Tab always enters the widget at the tab whose panel is showing.

Each tab needs an `id` and an `aria-controls` pointing at its panel, and each panel an `id` and an `aria-labelledby` pointing back at its tab, which is what pairs the two for a screen reader. A tab must also live inside a tab list, and a tab list inside a tabs root. The component throws when any of this is missing.

A tab action holds only whatever you put inside it, usually an icon, so it needs its own `aria-label` or `aria-labelledby` to be announced as anything more than a button. Activating it does not change the selection.

Panels are focusable by default, so Tab moves from the selected tab into its panel and the panel shows a focus ring. That stop is what makes a panel with no focusable content of its own reachable. When your panel already contains something focusable, that element is the way in, so set `tabindex="-1"` on the panel to avoid a redundant stop.

## Examples

### Sizes

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-size="sm">
    <div x-h-tab-list>
      <button id="smt1" x-h-tab aria-controls="smt1c" aria-selected="true">Tab 1</button>
      <button id="smt2" x-h-tab aria-controls="smt2c">Tab 2</button>
    </div>
  </div>
  <div x-h-tabs-content id="smt1c" aria-labelledby="smt1" hidden></div>
  <div x-h-tabs-content id="smt2c" aria-labelledby="smt2" hidden></div>
</div>
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button id="dt1" x-h-tab aria-controls="dt1c" aria-selected="true">Tab 1</button>
      <button id="dt2" x-h-tab aria-controls="dt2c">Tab 2</button>
    </div>
  </div>
  <div x-h-tabs-content id="dt1c" aria-labelledby="dt1" hidden></div>
  <div x-h-tabs-content id="dt2c" aria-labelledby="dt2" hidden></div>
</div>
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-size="lg">
    <div x-h-tab-list>
      <button id="lgt1" x-h-tab aria-controls="lgt1c" aria-selected="true">Tab 1</button>
      <button id="lgt2" x-h-tab aria-controls="lgt2c">Tab 2</button>
    </div>
  </div>
  <div x-h-tabs-content id="lgt1c" aria-labelledby="lgt1" hidden></div>
  <div x-h-tabs-content id="lgt2c" aria-labelledby="lgt2" hidden></div>
</div>
```

### Disabled tabs

`Tab 2` uses the native `disabled` attribute, so the arrow keys step straight over it. `Tab 3` uses `aria-disabled`, so the arrows land on it and it is announced as unavailable, but it cannot be activated.

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button id="dis1" x-h-tab aria-controls="dis1c" aria-selected="true">Tab 1</button>
      <button id="dis2" x-h-tab aria-controls="dis2c" disabled>Tab 2</button>
      <button id="dis3" x-h-tab aria-controls="dis3c" aria-disabled="true">Tab 3</button>
      <button id="dis4" x-h-tab aria-controls="dis4c">Tab 4</button>
    </div>
  </div>
  <div x-h-tabs-content id="dis1c" aria-labelledby="dis1"></div>
  <div x-h-tabs-content id="dis2c" aria-labelledby="dis2" hidden></div>
  <div x-h-tabs-content id="dis3c" aria-labelledby="dis3" hidden></div>
  <div x-h-tabs-content id="dis4c" aria-labelledby="dis4" hidden></div>
</div>
```

### Scrollable tab content

```html
<div x-h-tabs data-orientation="horizontal" style="height:10rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button id="stce" x-h-tab aria-controls="stcec" aria-selected="true">Tab 1</button>
    </div>
  </div>
  <div class="relative" x-h-tabs-content id="stcec" aria-labelledby="stce">
    <div class="absolute inset-0 overflow-auto">
      <img src="/harmonia/logo/harmonia.svg" alt="@harmonia" width="240px" />
    </div>
  </div>
</div>
```

### Horizontal tabs

```html
<div x-h-tabs data-orientation="horizontal" x-data="{ activeTabId: 'hit1' }">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hit1" aria-controls="hit1c" :aria-selected="activeTabId === 'hit1'" @click="activeTabId = 'hit1'">Tab 1</button>
      <button x-h-tab id="hit2" aria-controls="hit2c" :aria-selected="activeTabId === 'hit2'" @click="activeTabId = 'hit2'">Tab 2</button>
      <button x-h-tab id="hit3" aria-controls="hit3c" :aria-selected="activeTabId === 'hit3'" @click="activeTabId = 'hit3'">Tab 3</button>
    </div>
  </div>
  <div x-h-tabs-content id="hit1c" aria-labelledby="hit1" :hidden="activeTabId !== 'hit1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="hit2c" aria-labelledby="hit2" :hidden="activeTabId !== 'hit2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="hit3c" aria-labelledby="hit3" :hidden="activeTabId !== 'hit3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Horizontal tabs with icon and close button

```html
<div
  x-h-tabs
  data-orientation="horizontal"
  x-data="{
    tabs: [{ id: 'hib1', title: 'Tab 1' }, { id: 'hib2', title: 'Tab 2' }, { id: 'hib3', title: 'Tab 3' }],
    activeTabId: 'hib1',
    close(id) {
      const index = this.tabs.findIndex((tab) => tab.id === id);
      this.tabs.splice(index, 1);
      if (this.activeTabId === id) this.activeTabId = this.tabs[Math.min(index, this.tabs.length - 1)]?.id;
    },
  }"
>
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <template x-for="tab in tabs" :key="tab.id">
        <button x-h-tab :id="tab.id" :aria-controls="`${tab.id}c`" :aria-selected="activeTabId === tab.id" @click="activeTabId = tab.id">
          <svg x-h-lucide role="presentation" data-lucide="file"></svg>
          <span x-text="tab.title"></span>
          <span x-h-tab-action :aria-label="`close ${tab.title}`" @click="close(tab.id)">
            <svg x-h-icon data-icon="close" role="presentation"></svg>
          </span>
        </button>
      </template>
    </div>
  </div>
  <template x-for="tab in tabs" :key="tab.id">
    <div x-h-tabs-content :id="`${tab.id}c`" :aria-labelledby="tab.id" :hidden="activeTabId !== tab.id">
      <div class="p-2" x-text="`${tab.title} Content`"></div>
    </div>
  </template>
</div>
```

### Horizontal tabs with actions

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hitwa1" aria-controls="hitwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hitwa1c" aria-labelledby="hitwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Horizontal tabs with actions (end)

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hitwae1" aria-controls="hitwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="tab bar menu button">
        <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hitwae1c" aria-labelledby="hitwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Horizontal float tabs

```html
<div x-h-tabs data-orientation="horizontal" x-data="{ activeTabId: 'ht1' }">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="ht1" aria-controls="ht1c" :aria-selected="activeTabId === 'ht1'" @click="activeTabId = 'ht1'">Tab 1</button>
      <button x-h-tab id="ht2" aria-controls="ht2c" :aria-selected="activeTabId === 'ht2'" @click="activeTabId = 'ht2'">Tab 2</button>
      <button x-h-tab id="ht3" aria-controls="ht3c" :aria-selected="activeTabId === 'ht3'" @click="activeTabId = 'ht3'">Tab 3</button>
    </div>
  </div>
  <div x-h-tabs-content id="ht1c" aria-labelledby="ht1" :hidden="activeTabId !== 'ht1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="ht2c" aria-labelledby="ht2" :hidden="activeTabId !== 'ht2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="ht3c" aria-labelledby="ht3" :hidden="activeTabId !== 'ht3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Horizontal float tabs that fit to size

You can make the tab bar fit to the size of the tab list by adding the `w-max` class.

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true" class="w-max">
    <div x-h-tab-list>
      <button x-h-tab id="htfts1" aria-controls="htfts1c" aria-selected="true">Sign In</button>
      <button x-h-tab id="htfts2" aria-controls="htfts2c">Sign Up</button>
    </div>
  </div>
  <div x-h-tabs-content id="htfts1c" aria-labelledby="htfts1">
    <div class="p-2">Sign In</div>
  </div>
  <div x-h-tabs-content id="htfts2c" aria-labelledby="htfts2" hidden="true">
    <div class="p-2">Sign Up</div>
  </div>
</div>
```

### Horizontal float tabs with icon and close button

```html
<div x-h-tabs data-orientation="horizontal" x-data="{ activeTabId: 'hbt1' }">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hbt1" aria-controls="hbt1c" :aria-selected="activeTabId === 'hbt1'" @click="activeTabId = 'hbt1'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
      <button x-h-tab id="hbt2" aria-controls="hbt2c" :aria-selected="activeTabId === 'hbt2'" @click="activeTabId = 'hbt2'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 2
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
      <button x-h-tab id="hbt3" aria-controls="hbt3c" :aria-selected="activeTabId === 'hbt3'" @click="activeTabId = 'hbt3'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 3
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hbt1c" aria-labelledby="hbt1" :hidden="activeTabId !== 'hbt1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="hbt2c" aria-labelledby="hbt2" :hidden="activeTabId !== 'hbt2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="hbt3c" aria-labelledby="hbt3" :hidden="activeTabId !== 'hbt3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Horizontal float tabs with actions

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hftwa1" aria-controls="hftwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hftwa1c" aria-labelledby="hftwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Horizontal float tabs with actions (end)

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hftwae1" aria-controls="hftwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hftwae1c" aria-labelledby="hftwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical tabs

```html
<div x-h-tabs data-orientation="vertical" x-data="{ activeTabId: 'vit1' }">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vit1" aria-controls="vit1c" :aria-selected="activeTabId === 'vit1'" @click="activeTabId = 'vit1'">Tab 1</button>
      <button x-h-tab id="vit2" aria-controls="vit2c" :aria-selected="activeTabId === 'vit2'" @click="activeTabId = 'vit2'">Tab 2</button>
      <button x-h-tab id="vit3" aria-controls="vit3c" :aria-selected="activeTabId === 'vit3'" @click="activeTabId = 'vit3'">Tab 3</button>
    </div>
  </div>
  <div x-h-tabs-content id="vit1c" aria-labelledby="vit1" :hidden="activeTabId !== 'vit1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="vit2c" aria-labelledby="vit2" :hidden="activeTabId !== 'vit2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="vit3c" aria-labelledby="vit3" :hidden="activeTabId !== 'vit3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Vertical tabs with icon and close button

```html
<div x-h-tabs data-orientation="vertical" x-data="{ activeTabId: 'vib1' }">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vib1" aria-controls="vib1c" :aria-selected="activeTabId === 'vib1'" @click="activeTabId = 'vib1'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
      <button x-h-tab id="vib2" aria-controls="vib2c" :aria-selected="activeTabId === 'vib2'" @click="activeTabId = 'vib2'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 2
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
      <button x-h-tab id="vib3" aria-controls="vib3c" :aria-selected="activeTabId === 'vib3'" @click="activeTabId = 'vib3'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 3
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vib1c" aria-labelledby="vib1" :hidden="activeTabId !== 'vib1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="vib2c" aria-labelledby="vib2" :hidden="activeTabId !== 'vib2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="vib3c" aria-labelledby="vib3" :hidden="activeTabId !== 'vib3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Vertical tabs with actions

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vitwa1" aria-controls="vitwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vitwa1c" aria-labelledby="vitwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical tabs with actions (end)

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vitwae1" aria-controls="vitwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vitwae1c" aria-labelledby="vitwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical float tabs

```html
<div x-h-tabs data-orientation="vertical" x-data="{ activeTabId: 'vt1' }">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vt1" aria-controls="vt1c" :aria-selected="activeTabId === 'vt1'" @click="activeTabId = 'vt1'">Tab 1</button>
      <button x-h-tab id="vt2" aria-controls="vt2c" :aria-selected="activeTabId === 'vt2'" @click="activeTabId = 'vt2'">Tab 2</button>
      <button x-h-tab id="vt3" aria-controls="vt3c" :aria-selected="activeTabId === 'vt3'" @click="activeTabId = 'vt3'">Tab 3</button>
    </div>
  </div>
  <div x-h-tabs-content id="vt1c" aria-labelledby="vt1" :hidden="activeTabId !== 'vt1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="vt2c" aria-labelledby="vt2" :hidden="activeTabId !== 'vt2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="vt3c" aria-labelledby="vt3" :hidden="activeTabId !== 'vt3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Vertical float tabs with icon and close button

```html
<div x-h-tabs data-orientation="vertical" x-data="{ activeTabId: 'vbt1' }">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vbt1" aria-controls="vbt1c" :aria-selected="activeTabId === 'vbt1'" @click="activeTabId = 'vbt1'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
      <button x-h-tab id="vbt2" aria-controls="vbt2c" :aria-selected="activeTabId === 'vbt2'" @click="activeTabId = 'vbt2'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 2
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
      <button x-h-tab id="vbt3" aria-controls="vbt3c" :aria-selected="activeTabId === 'vbt3'" @click="activeTabId = 'vbt3'">
        <svg x-h-lucide role="presentation" data-lucide="file"></svg>
        Tab 3
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vbt1c" aria-labelledby="vbt1" :hidden="activeTabId !== 'vbt1'">
    <div class="p-2">Tab 1 Content</div>
  </div>
  <div x-h-tabs-content id="vbt2c" aria-labelledby="vbt2" :hidden="activeTabId !== 'vbt2'">
    <div class="p-2">Tab 2 Content</div>
  </div>
  <div x-h-tabs-content id="vbt3c" aria-labelledby="vbt3" :hidden="activeTabId !== 'vbt3'">
    <div class="p-2">Tab 3 Content</div>
  </div>
</div>
```

### Vertical float tabs with actions

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vftwa1" aria-controls="vftwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <svg x-h-lucide role="presentation" data-lucide="plus"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vftwa1c" aria-labelledby="vftwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical float tabs with actions (end)

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vftwae1" aria-controls="vftwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action aria-label="close tab">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action data-variant="outline" aria-label="menu button">
        <svg x-h-lucide role="presentation" data-lucide="ellipsis"></svg>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vftwae1c" aria-labelledby="vftwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/tabs.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
