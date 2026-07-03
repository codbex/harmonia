# Tabs

Organizes content into multiple sections, displaying only one section at a time while keeping others easily accessible through a tabbed navigation interface. Tabs help structure information without overwhelming the user.

## Usage

Use tabs to group related content or functionality, allowing users to switch between sections without leaving the current view.

## API Reference

### Component attribute(s)

```
x-h-tabs
x-h-tab-bar
x-h-tab-list
x-h-tab
x-h-tab-action
x-h-tab-list-actions
x-h-tab-list-action
x-h-tabs-content
```

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

#### x-h-tabs-content

| Attribute | Type    | Required | Description               |
| --------- | ------- | -------- | ------------------------- |
| hidden    | boolean | false    | Show/hide the tab content |

#### x-h-tab-list-action

| Attribute    | Type                         | Required | Description                                            |
| ------------ | ---------------------------- | -------- | ------------------------------------------------------ |
| data-variant | `outline`<br />`transparent` | false    | Changes the style of the button. Default is `outline`. |

### Modifiers

#### x-h-tab-list-actions

| Modifier | Description                                                     |
| -------- | --------------------------------------------------------------- |
| end      | Tab action will be placed at the end of the tab list container. |

## Examples

### Sizes

<ClientOnly>
<component-container data-class="p-0">
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
</component-container>
</ClientOnly>

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

### Scrollable tab content

<ClientOnly>
<component-container data-class="p-0">
<div x-h-tabs data-orientation="horizontal" style="height:10rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button id="stce" x-h-tab aria-controls="stcec" aria-selected="true">Tab 1</button>
    </div>
  </div>
  <div class="relative" x-h-tabs-content id="stcec" aria-labelledby="stce">
    <div class="position-fit absolute overflow-auto">
      <img src="/logo/harmonia.svg" alt="@harmonia" width="240px" />
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal" style="height:22rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button id="stce" x-h-tab aria-controls="stcec" aria-selected="true">Tab 1</button>
    </div>
  </div>
  <div class="relative" x-h-tabs-content id="stcec" aria-labelledby="stce">
    <div class="position-fit absolute overflow-auto">
      <img src="/logo/harmonia.svg" alt="@harmonia" width="240px" />
    </div>
  </div>
</div>
```

### Horizontal tabs

<ClientOnly>
<component-container src="/components/tabs/horizontal.html" data-class="p-0">
</component-container>
</ClientOnly>

<<< @/public/components/tabs/horizontal.html

### Horizontal tabs with icon and close button

<ClientOnly>
<component-container src="/components/tabs/horizontal-button.html" data-class="p-0" >
</component-container>
</ClientOnly>

<<< @/public/components/tabs/horizontal-button.html

### Horizontal tabs with actions

<ClientOnly>
<component-container data-class="p-0">
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hitwa1" aria-controls="hitwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hitwa1c" aria-labelledby="hitwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hitwa1" aria-controls="hitwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hitwa1c" aria-labelledby="hitwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Horizontal tabs with actions (end)

<ClientOnly>
<component-container data-class="p-0">
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hitwae1" aria-controls="hitwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hitwae1c" aria-labelledby="hitwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="hitwae1" aria-controls="hitwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hitwae1c" aria-labelledby="hitwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Horizontal float tabs

<ClientOnly>
<component-container src="/components/tabs/horizontal-floating.html">
</component-container>
</ClientOnly>

<<< @/public/components/tabs/horizontal-floating.html

### Horizontal float tabs that fit to size

You can make the tab bar fit to the size of the tab list by adding the `w-max` class.

<ClientOnly>
<component-container>
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
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true" class="w-max">
    <div x-h-tab-list>
      <button x-h-tab id="ht1" aria-controls="ht1c" aria-selected="true">Sign In</button>
      <button x-h-tab id="ht2" aria-controls="ht2c">Sign Up</button>
    </div>
  </div>
  <div x-h-tabs-content id="ht1c" aria-labelledby="ht1">
    <div class="p-2">Sign In</div>
  </div>
  <div x-h-tabs-content id="ht2c" aria-labelledby="ht2" hidden="true">
    <div class="p-2">Sign Up</div>
  </div>
</div>
```

### Horizontal float tabs with icon and close button

<ClientOnly>
<component-container src="/components/tabs/horizontal-button-floating.html" >
</component-container>
</ClientOnly>

<<< @/public/components/tabs/horizontal-button-floating.html

### Horizontal float tabs with actions

<ClientOnly>
<component-container>
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hftwa1" aria-controls="hftwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hftwa1c" aria-labelledby="hftwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hftwa1" aria-controls="hftwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hftwa1c" aria-labelledby="hftwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Horizontal float tabs with actions (end)

<ClientOnly>
<component-container>
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hftwae1" aria-controls="hftwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hftwae1c" aria-labelledby="hftwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="horizontal">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="hftwae1" aria-controls="hftwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="hftwae1c" aria-labelledby="hftwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical tabs

<ClientOnly>
<component-container src="/components/tabs/vertical.html" data-class="p-0">
</component-container>
</ClientOnly>

<<< @/public/components/tabs/vertical.html

### Vertical tabs with icon and close button

<ClientOnly>
<component-container src="/components/tabs/vertical-button.html" data-class="p-0" >
</component-container>
</ClientOnly>

<<< @/public/components/tabs/vertical-button.html

### Vertical tabs with actions

<ClientOnly>
<component-container data-class="p-0">
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vitwa1" aria-controls="vitwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vitwa1c" aria-labelledby="vitwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vitwa1" aria-controls="vitwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vitwa1c" aria-labelledby="vitwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical tabs with actions (end)

<ClientOnly>
<component-container data-class="p-0">
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vitwae1" aria-controls="vitwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vitwae1c" aria-labelledby="vitwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar>
    <div x-h-tab-list>
      <button x-h-tab id="vitwae1" aria-controls="vitwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vitwae1c" aria-labelledby="vitwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical float tabs

<ClientOnly>
<component-container src="/components/tabs/vertical-floating.html" >
</component-container>
</ClientOnly>

<<< @/public/components/tabs/vertical-floating.html

### Vertical float tabs with icon and close button

<ClientOnly>
<component-container src="/components/tabs/vertical-button-floating.html">
</component-container>
</ClientOnly>

<<< @/public/components/tabs/vertical-button-floating.html

### Vertical float tabs with actions

<ClientOnly>
<component-container>
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vftwa1" aria-controls="vftwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vftwa1c" aria-labelledby="vftwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vftwa1" aria-controls="vftwa1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions>
      <button x-h-tab-list-action data-variant="transparent" aria-label="add tab button">
        <i x-h-lucide role="img" data-lucide="plus"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vftwa1c" aria-labelledby="vftwa1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```

### Vertical float tabs with actions (end)

<ClientOnly>
<component-container>
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vftwae1" aria-controls="vftwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action data-variant="outline" aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vftwae1c" aria-labelledby="vftwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-tabs data-orientation="vertical" style="height:8rem">
  <div x-h-tab-bar data-floating="true">
    <div x-h-tab-list>
      <button x-h-tab id="vftwae1" aria-controls="vftwae1c" aria-selected="true">
        Tab 1
        <span x-h-tab-action>
          <i x-h-lucide role="img" data-lucide="x"></i>
        </span>
      </button>
    </div>
    <div x-h-tab-list-actions.end>
      <button x-h-tab-list-action data-variant="outline" aria-label="menu button">
        <i x-h-lucide role="img" data-lucide="ellipsis"></i>
      </button>
    </div>
  </div>
  <div x-h-tabs-content id="vftwae1c" aria-labelledby="vftwae1">
    <div class="p-2">Tab 1 Content</div>
  </div>
</div>
```
