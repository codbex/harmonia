# Accordion

Allows users to show and hide sections of related content.

## API Reference

### Component attubute(s)

```
x-h-accordion
x-h-accordion-item
x-h-accordion-trigger
x-h-accordion-content
```

### Attributes

#### x-h-accordion

| Attribute    | Type                          | Required | Description                           |
| ------------ | ----------------------------- | -------- | ------------------------------------- |
| data-size    | `default`<br />`md`<br />`sm` | false    | Height of the accordion header items. |
| data-variant | `default`<br />`toolbar`      | false    | Toolbar-style accordion header items. |

#### x-h-accordion-item

| Attribute | Type   | Required | Description                                                             |
| --------- | ------ | -------- | ----------------------------------------------------------------------- |
| `self`    | string | false    | Sets the ID of the item. Useful when setting the default expanded item. |

#### x-h-accordion-trigger

| Attribute | Type   | Required | Description                                                                        |
| --------- | ------ | -------- | ---------------------------------------------------------------------------------- |
| `self`    | string | true     | Sets the title of the item. Expects a string literal or a reference to a variable. |

### Modifiers

#### x-h-accordion

| Modifier | Type   | Required | Description                                                                                                                                 |
| -------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| single   | string | false    | Used when the accordion must show only one section at a time. Optionally, the id of the item that should be expanded by default can be set. |

#### x-h-accordion-item

| Modifier | Type   | Required | Description                                                                                                                |
| -------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| default  | string | false    | Accordion items are collapsed by default. If included, the item will be expanded by default. Ther can be only one default. |

## Examples

### Show only one section at a time

<br />

<ClientOnly>
<component-container>
<div x-h-accordion.single="itemId2">
  <div x-h-accordion-item="itemId1">
    <h3 x-h-accordion-trigger="'Accordion Item 1'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div x-h-accordion-item="itemId2">
    <h3 x-h-accordion-trigger="'Accordion Item 2'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-accordion.single="itemId2">
  <div x-h-accordion-item="itemId1">
    <h3 x-h-accordion-trigger="'Accordion Item 1'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div x-h-accordion-item="itemId2">
    <h3 x-h-accordion-trigger="'Accordion Item 2'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
</div>
```

### Default section

<br />

<ClientOnly>
<component-container>
<div x-h-accordion>
  <div x-h-accordion-item>
    <h3 x-h-accordion-trigger="'Accordion Item 1'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div x-h-accordion-item.default>
    <h3 x-h-accordion-trigger="'Accordion Item 2'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-accordion>
  <div x-h-accordion-item>
    <h3 x-h-accordion-trigger="'Accordion Item 1'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div x-h-accordion-item.default>
    <h3 x-h-accordion-trigger="'Accordion Item 2'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
</div>
```

### Toolbar style with medium size

<br />

<ClientOnly>
<component-container>
<div x-h-accordion data-variant="header" data-size="md">
  <div x-h-accordion-item>
    <h3 x-h-accordion-trigger="'Accordion Item 1'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div x-h-accordion-item>
    <h3 x-h-accordion-trigger="'Accordion Item 2'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-accordion data-variant="header" data-size="md">
  <div x-h-accordion-item>
    <h3 x-h-accordion-trigger="'Accordion Item 1'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
  <div x-h-accordion-item.default>
    <h3 x-h-accordion-trigger="'Accordion Item 2'"></h3>
    <div x-h-accordion-content>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  </div>
</div>
```
