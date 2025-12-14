# Table

A table contains a set of line items and usually comprises rows (with each row showing one line item) and columns.

## API Reference

### Component attubute(s)

```
x-h-table-container
x-h-table
x-h-table-container
x-h-table-header
x-h-table-head
x-h-table-cell
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

<br />

<ClientOnly>
<component-container data-html="/components/table/full.html" data-class="border-0" data-padding="false">
</component-container>
</ClientOnly>

```html
<div x-h-table-container.scroll data-border="true" style="max-height: 688px">
  <table x-h-table data-borders="both" x-data="tableData">
    <caption x-h-table-caption>
      Fruits & Vegetables
    </caption>
    <thead x-h-table-header>
      <tr x-h-table-row>
        <th x-h-table-head scope="col">Invoice Number</th>
        <th x-h-table-head scope="col" data-hoverable="true" data-activable="true">
          <div class="flex items-center justify-between">Invoice Date<i role="img" class="size-4" data-lucide="arrow-up-down"></i></div>
        </th>
        <th x-h-table-head scope="col">Customer Name</th>
        <th x-h-table-head scope="col">Due Date</th>
        <th x-h-table-head scope="col">Amount Total</th>
        <th x-h-table-head scope="col">Status</th>
        <th x-h-table-head scope="col">Outstanding Balance</th>
        <th x-h-table-head scope="col">Created By</th>
        <th x-h-table-head scope="col">Last Sent</th>
        <th x-h-table-head scope="col">Tax Amount</th>
        <th x-h-table-head scope="col">Category</th>
        <th x-h-table-head scope="col">Currency</th>
      </tr>
    </thead>
    <tbody x-h-table-body>
      <template x-for="invoice in invoices">
        <tr x-h-table-row data-hoverable="true" data-activable="true">
          <th x-h-table-head x-text="invoice.invoiceNumber"></th>
          <td x-h-table-cell x-text="invoice.invoiceDate"></td>
          <td x-h-table-cell x-text="invoice.customerName"></td>
          <td x-h-table-cell x-text="invoice.dueDate"></td>
          <td x-h-table-cell x-text="invoice.amountTotal"></td>
          <td x-h-table-cell x-text="invoice.status"></td>
          <td x-h-table-cell x-text="invoice.outstandingBalance"></td>
          <td x-h-table-cell x-text="invoice.createdBy"></td>
          <td x-h-table-cell x-text="invoice.lastSent"></td>
          <td x-h-table-cell x-text="invoice.taxAmount"></td>
          <td x-h-table-cell x-text="invoice.category"></td>
          <td x-h-table-cell x-text="invoice.currency"></td>
        </tr>
      </template>
    </tbody>
    <tfoot x-h-table-footer>
      <tr x-h-table-row>
        <th x-h-table-head scope="row">Total Invoices</th>
        <td x-h-table-cell colspan="11" x-text="invoices.length"></td>
      </tr>
    </tfoot>
  </table>
</div>
<script type="text/javascript">
  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const names = ['Ivan Strashimechkarov', 'Anna Petrova', 'John Doe', 'Maria Gonzalez', 'Liam Smith', 'Emma Johnson', 'Noah Brown', 'Olivia Davis', 'William Wilson', 'Sophia Moore'];

  const categories = ['Consulting', 'Software', 'Design', 'Training', 'Marketing'];
  const statuses = ['paid', 'unpaid', 'overdue', 'partial'];

  function generateInvoices() {
    const baseDate = new Date();
    const invoices = [];
    for (let i = 0; i < 50; i++) {
      const invoiceDate = new Date(baseDate.getTime());
      invoiceDate.setDate(invoiceDate.getDate() + randomInt(0, 240));

      const dueDate = new Date(invoiceDate.getTime());
      dueDate.setDate(dueDate.getDate() + 20);

      const amountTotal = parseFloat(randomFloat(500, 5000).toFixed(2));
      const taxAmount = parseFloat((amountTotal * 0.1).toFixed(2));

      const status = randomChoice(statuses);

      let outstandingBalance;
      if (status === 'partial') {
        outstandingBalance = parseFloat((amountTotal * randomFloat(0.1, 0.65)).toFixed(2));
      } else if (status === 'paid') {
        outstandingBalance = 0.0;
      } else {
        outstandingBalance = amountTotal;
      }

      const invoice = {
        invoiceNumber: `INV-${String(i + 1).padStart(2, '0')}`,
        invoiceDate: formatDate(invoiceDate),
        customerName: randomChoice(names),
        dueDate: formatDate(dueDate),
        amountTotal: amountTotal,
        status: status,
        outstandingBalance: outstandingBalance,
        createdBy: 'admin',
        lastSent: formatDate(invoiceDate),
        taxAmount: taxAmount,
        category: randomChoice(categories),
        currency: 'EUR',
      };

      invoices.push(invoice);
    }
    return invoices;
  }
  lucide.createIcons();
  Alpine.data('tableData', () => ({
    invoices: generateInvoices(),
  }));
</script>
```

### Table with caption

<br />

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

<br />

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

<br />

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

<br />

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

### Table with inner borders and no container

<br />

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
