# Table

Organizes data into rows and columns, with each row representing a single item and each column representing a specific attribute. Tables provide a structured way to display complex or tabular information clearly.

## Usage

Use tables to present datasets, lists, or records where a clear relationship between rows and columns is important. Headers must be descriptive and for large datasets, consider features like sorting or filtering. Do NOT use tables for layout purposes.

## API Reference

### Component attribute(s)

```
x-h-table-container
x-h-table
x-h-table-container
x-h-table-header
x-h-table-head
x-h-table-cell
x-h-table-cell-button
x-h-table-body
x-h-table-row
x-h-table-caption
x-h-table-footer
```

### Attributes

#### x-h-table-container

| Attribute   | Type    | Required | Description                 |
| ----------- | ------- | -------- | --------------------------- |
| data-border | boolean | false    | Adds a border to the table. |

#### x-h-table

| Attribute    | Type                              | Required | Description                                        |
| ------------ | --------------------------------- | -------- | -------------------------------------------------- |
| data-borders | `rows`<br />`columns`<br />`both` | false    | Adds borders between rows, columns or both.        |
| data-fixed   | boolean                           | false    | Fixed table layout. Incompatible with scroll mode. |

#### x-h-table-header

| Attribute     | Type    | Required | Description                      |
| ------------- | ------- | -------- | -------------------------------- |
| data-bordered | boolean | false    | Adds a border around the header. |

#### x-h-table-row

| Attribute      | Type       | Required | Description                       |
| -------------- | ---------- | -------- | --------------------------------- |
| data-state     | `selected` | false    | Sets a selected state to the row. |
| data-hoverable | boolean    | false    | Makes the row hoverable.          |
| data-activable | boolean    | false    | Makes the row activable.          |

#### x-h-table-head

| Attribute      | Type    | Required | Description                      |
| -------------- | ------- | -------- | -------------------------------- |
| data-hoverable | boolean | false    | Makes the header cell hoverable. |
| data-activable | boolean | false    | Makes the header cell activable. |

#### x-h-table-cell

| Attribute      | Type    | Required | Description               |
| -------------- | ------- | -------- | ------------------------- |
| data-hoverable | boolean | false    | Makes the cell hoverable. |
| data-activable | boolean | false    | Makes the cell activable. |

### Modifiers

#### x-h-table-container

| Modifier | Description                           |
| -------- | ------------------------------------- |
| scroll   | Adds scroll ability to the container. |

## Examples

### Table with scroll

<ClientOnly>
<component-container src="/components/table/full.html" data-class="p-0 border-0" >
</component-container>
</ClientOnly>

<<< @/public/components/table/full.html

### Table with caption

<ClientOnly>
<component-container>
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="both" data-fixed="true">
    <caption x-h-table-caption>
      Fruits & Vegetables
    </caption>
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row data-state="selected">
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="both">
    <caption x-h-table-caption>
      Fruits & Vegetables
    </caption>
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with row borders

<ClientOnly>
<component-container>
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="rows" data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="rows" data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with column borders

<ClientOnly>
<component-container>
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="columns" data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="columns" data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with no borders

<ClientOnly>
<component-container>
<div x-h-table-container>
  <table x-h-table data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container>
  <table x-h-table data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with bordered header

Set `data-bordered="true"` on the header to outline the whole head row. Use it on its own, not together with the table's other border options.

<ClientOnly>
<component-container>
<div x-h-table-container>
  <table x-h-table data-fixed="true">
    <thead x-h-table-header data-bordered="true">
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container>
  <table x-h-table data-fixed="true">
    <thead x-h-table-header data-bordered="true">
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Item</th>
        <th x-h-table-head scope="col">Type</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-head>Cucumber</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Banana</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Asparagus</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Onion</td>
        <td x-h-table-cell>Vegetable</td>
      </tr>
      <tr x-h-table-row>
        <td x-h-table-head>Apple</td>
        <td x-h-table-cell>Fruit</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with inner borders and no container

<ClientOnly>
<component-container>
<table x-h-table data-borders="both" data-fixed="true">
  <thead x-h-table-header>
    <tr x-h-table-row>
      <th x-h-table-head scope="col">Item</th>
      <th x-h-table-head scope="col">Type</th>
    </tr>
  </thead>
  <tbody x-h-table-body>
    <tr x-h-table-row>
      <td x-h-table-head>Cucumber</td>
      <td x-h-table-cell>Vegetable</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Banana</td>
      <td x-h-table-cell>Fruit</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Asparagus</td>
      <td x-h-table-cell>Vegetable</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Onion</td>
      <td x-h-table-cell>Vegetable</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Apple</td>
      <td x-h-table-cell>Fruit</td>
    </tr>
  </tbody>
</table>
</component-container>
</ClientOnly>

```html
<table x-h-table data-borders="both" data-fixed="true">
  <thead x-h-table-header>
    <tr x-h-table-row>
      <th x-h-table-head scope="col">Item</th>
      <th x-h-table-head scope="col">Type</th>
    </tr>
  </thead>
  <tbody x-h-table-body>
    <tr x-h-table-row>
      <td x-h-table-head>Cucumber</td>
      <td x-h-table-cell>Vegetable</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Banana</td>
      <td x-h-table-cell>Fruit</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Asparagus</td>
      <td x-h-table-cell>Vegetable</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Onion</td>
      <td x-h-table-cell>Vegetable</td>
    </tr>
    <tr x-h-table-row>
      <td x-h-table-head>Apple</td>
      <td x-h-table-cell>Fruit</td>
    </tr>
  </tbody>
</table>
```

### Table with cell button

The cell button can be used to trigger some action.

<ClientOnly>
<component-container>
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="both" data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Header 1</th>
        <th x-h-table-head scope="col">Header 2</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-cell>Normal cell</td>
        <td x-h-table-cell>
          <button x-h-table-cell-button>Cell button</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container data-border="true">
  <table x-h-table data-borders="both" data-fixed="true">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Header 1</th>
        <th x-h-table-head scope="col">Header 2</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-cell>Normal cell</td>
        <td x-h-table-cell>
          <button x-h-table-cell-button>Cell button</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Table with inputs

You can use input, dropdown, select, date and time pickers inside a table by using the `table` modifier.

<ClientOnly>
<component-container data-class="p-0 border-0">
<div x-h-table-container.scroll data-border="true">
  <table x-h-table data-borders="both">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Input</th>
        <th x-h-table-head scope="col">Dropdown</th>
        <th x-h-table-head scope="col">Select</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-cell>
          <input x-h-input.table placeholder="Name" />
        </td>
        <td x-h-table-cell>
          <button x-h-table-cell-button x-h-menu-trigger.dropdown>
            <span>Dropdown</span>
            <svg x-h-icon data-icon="chevron-down" role="img" aria-label="chevron down"></svg>
          </button>
          <ul x-h-menu aria-label="dropdown">
            <li x-h-menu-item>Item 1</li>
            <li x-h-menu-item>Item 2</li>
            <li x-h-menu-item>Item 3</li>
          </ul>
        </td>
        <td x-h-table-cell>
          <div x-h-select.table>
            <input x-h-select-input placeholder="Select" />
            <div x-h-select-content>
              <div x-h-select-option="'Option 1'" data-value="1"></div>
              <div x-h-select-option="'Option 2'" data-value="2"></div>
              <div x-h-select-option="'Option 3'" data-value="3"></div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container.scroll data-border="true">
  <table x-h-table data-borders="both">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Input</th>
        <th x-h-table-head scope="col">Dropdown</th>
        <th x-h-table-head scope="col">Select</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-cell>
          <input x-h-input.table placeholder="Name" />
        </td>
        <td x-h-table-cell>
          <button x-h-table-cell-button x-h-menu-trigger.dropdown>
            <span>Dropdown</span>
            <svg x-h-icon data-icon="chevron-down" role="img" aria-label="chevron down"></svg>
          </button>
          <ul x-h-menu aria-label="dropdown">
            <li x-h-menu-item>Item 1</li>
            <li x-h-menu-item>Item 2</li>
            <li x-h-menu-item>Item 3</li>
          </ul>
        </td>
        <td x-h-table-cell>
          <div x-h-select.table>
            <input x-h-select-input placeholder="Select" />
            <div x-h-select-content>
              <div x-h-select-option="'Option 1'" data-value="1"></div>
              <div x-h-select-option="'Option 2'" data-value="2"></div>
              <div x-h-select-option="'Option 3'" data-value="3"></div>
            </div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

<ClientOnly>
<component-container data-class="p-0 border-0">
<div x-h-table-container.scroll data-border="true">
  <table x-h-table data-borders="both">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Number</th>
        <th x-h-table-head scope="col">Date</th>
        <th x-h-table-head scope="col">Time</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-cell>
          <div x-h-input-number.table>
            <input type="number" min="0" max="10" step="2" value="4" />
          </div>
        </td>
        <td x-h-table-cell>
          <div x-h-date-picker.table x-data="{ date: new Date().toISOString() }">
            <input type="text" id="tableDate" />
            <button x-h-date-picker-trigger aria-label="Choose date"></button>
            <div x-h-date-picker-popup x-model="date"></div>
          </div>
        </td>
        <td x-h-table-cell>
          <div x-data="{ timeConfig: { is12Hour: true } }" x-h-time-picker.table="timeConfig">
            <input type="text" id="tableTime" x-h-time-picker-input />
            <div x-h-time-picker-popup></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-table-container.scroll data-border="true">
  <table x-h-table data-borders="both">
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Number</th>
        <th x-h-table-head scope="col">Date</th>
        <th x-h-table-head scope="col">Time</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <tr x-h-table-row>
        <td x-h-table-cell>
          <div x-h-input-number.table>
            <input type="number" min="0" max="10" step="2" value="4" />
          </div>
        </td>
        <td x-h-table-cell>
          <div x-h-date-picker.table x-data="{ date: new Date().toISOString() }">
            <input type="text" id="tableDate" />
            <button x-h-date-picker-trigger aria-label="Choose date"></button>
            <div x-h-date-picker-popup x-model="date"></div>
          </div>
        </td>
        <td x-h-table-cell>
          <div x-data="{ timeConfig: { is12Hour: true } }" x-h-time-picker.table="timeConfig">
            <input type="text" id="tableTime" x-h-time-picker-input />
            <div x-h-time-picker-popup></div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```
