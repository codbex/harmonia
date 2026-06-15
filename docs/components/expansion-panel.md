# Expansion Panel

The Expansion Panel is a container component that manages multiple collapsible panels within a layout. Unlike the [accordion](/components/accordion) component, expanded panels do not resize the container but instead fill the available space and become scrollable when needed.

## Usage

Suitable for embedded interactive content such as iframes and side panel/utility views.

## API Reference

### Component attribute(s)

```
x-h-exp-panel
x-h-exp-panel-item
x-h-exp-panel-trigger
x-h-exp-panel-content
```

### Attributes

#### x-h-exp-panel

| Attribute     | Type                          | Required | Description                                               |
| ------------- | ----------------------------- | -------- | --------------------------------------------------------- |
| data-size     | `default`<br />`md`<br />`sm` | false    | Height of the panel header items.                         |
| data-variant  | `default`<br />`transparent`  | false    | Transparent background color. Does not remove the border. |
| data-floating | boolean                       | false    | Floating style panels.                                    |

#### x-h-exp-panel-item

| Attribute | Type    | Required | Description                                                                                                         |
| --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `self`    | boolean | false    | Default expanded state. This is a two-way binding, so if a variable is provided, it will get updated automatically. |

#### x-h-exp-panel-trigger

| Attribute | Type   | Required | Description                                                                        |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| `self`    | string | true     | Sets the title of the item. Expects a string literal or a reference to a variable. |

## Examples

### Default Panels

<ClientOnly>
<component-container data-class="p-0" data-style="height:28rem">
<div x-h-exp-panel>
  <div x-h-exp-panel-item="true">
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 1</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 2</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 3'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 3</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-exp-panel>
  <div x-h-exp-panel-item="true">
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 1</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 2</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 3'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 3</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### Transparent Panels

<ClientOnly>
<component-container data-class="p-0" data-style="height:16rem">
<div x-h-exp-panel data-variant="transparent">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-exp-panel data-variant="transparent">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
```

### Floating Panels

<ClientOnly>
<component-container data-style="height:16rem">
<div x-h-exp-panel data-floating="true">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-exp-panel data-floating="true">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
```

### Transparent Floating Panels

<ClientOnly>
<component-container data-style="height:16rem">
<div x-h-exp-panel data-variant="transparent" data-floating="true">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-exp-panel data-variant="transparent" data-floating="true">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
```

### Medium Panels

<ClientOnly>
<component-container data-class="p-0" data-style="height:10rem">
<div x-h-exp-panel data-size="md">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-exp-panel data-size="md">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
```

### Small Panels

<ClientOnly>
<component-container data-class="p-0" data-style="height:10rem">
<div x-h-exp-panel data-size="sm">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-exp-panel data-size="sm">
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
  <div x-h-exp-panel-item>
    <h3 x-h-exp-panel-trigger="'Panel 2'"></h3>
    <div x-h-exp-panel-content>Panel content</div>
  </div>
</div>
```

### Two-Way Binding And Watching For Changes

In cases where the expanded state must be monitored and/or persisted, the `$watch` magic function can be used.

It can be used both inline and in a component object.

<ClientOnly>
<component-container data-class="p-0" data-style="height:16rem">
<div x-h-exp-panel x-data="{ panelOneOpen: true }">
  <div x-h-exp-panel-item="panelOneOpen" x-init="$watch('panelOneOpen', (value, oldValue) => console.log('Old value:', value, 'New value', oldValue))">
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 1</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

- #### Inline

```html
<div x-h-exp-panel x-data="{ panelOneOpen: true }">
  <div x-h-exp-panel-item="panelOneOpen" x-init="$watch('panelOneOpen', (value, oldValue) => console.log('Old value:', value, 'New value', oldValue))">
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 1</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
</div>
```

- #### Component Object

```html
<div x-h-exp-panel x-data="twoWayPanel">
  <div x-h-exp-panel-item="panelOneOpen">
    <h3 x-h-exp-panel-trigger="'Panel 1'"></h3>
    <div x-h-exp-panel-content>
      <div x-h-info-page>
        <div x-h-info-page-header>
          <div x-h-info-page-media.icon>
            <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
          </div>
          <div x-h-info-page-title>Panel 1</div>
          <div x-h-info-page-description>Just an empty panel</div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
  Alpine.data('twoWayPanel', () => ({
    panelOneOpen: true,
    init() {
      this.$watch('panelOneOpen', (value, oldValue) => {
        console.log('Old value:', value, 'New value', oldValue);
      });
    },
  }));
</script>
```
