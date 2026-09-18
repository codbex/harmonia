# Card

A flexible container that organizes content into distinct sections, typically including a header, main content area, and footer. Cards provide a clear, self-contained layout for displaying related information.

## Usage

Use cards to group related information or actions in a visually distinct container, such as product details or summaries. Avoid overloading cards with excessive information.

## Behavior

The card itself has no padding. The header, the content and the footer do. By default, the header has left, right and top padding, the content has an all-around padding and the footer has a left, right and bottom padding.

A `border-b` on the header or a `border-t` on the footer draws a line and tightens that slot's own existing padding against it and adds a bottom padding to the header and top padding on the footer. Setting a custom padding is not needed. Neither border is required and neither depends on what the content is. Use one where the card looks better with a separating line.

When there is a table, list, calendar, an iframe, etc., it is recommended to set the card type to "object" (see card attributes). With that option, the header and footer sit closer to it, since the object brings its own edge. This is independent of the borders above and can combines with them.

Flush content reaches the card's corners, so it rounds its own top corners when it is the first slot in the card and its bottom corners when it is the last, matching the card's radius. Add the `overflow-hidden` class, so the content inside the content body gets its corners clipped. Otherwise, they might overflow outside the card corners.

## API Reference

### Component attribute(s)

```
x-h-card
x-h-card-header
x-h-card-title
x-h-card-description
x-h-card-action
x-h-card-content
x-h-card-footer
```

### Attributes

#### x-h-card

| Attribute | Type     | Required | Description                                                                                                              |
| --------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| data-type | `object` | false    | Tightens the header's and the footer's padding for a card whose flush content is a table, a list, calendar or an iframe. |

### Modifiers

#### x-h-card-content

| Modifier | Description                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| flush    | Removes the padding from the content, so that content like a table, a list or a calendar spans the full width of the card. |

## Examples

### Action Card

<LiveExample data-class="flex flex-col items-stretch">

```html
<div x-h-card>
  <div x-h-card-header>
    <div x-h-card-title>Random Bill</div>
    <div x-h-card-description>Billed to you</div>
    <div x-h-card-action>
      <div class="hbox items-start gap-1 text-positive">
        <span class="text-2xl">$256</span>
        <span class="text-sm" style="padding-top: 0.2rem">.16</span>
      </div>
    </div>
  </div>
  <div x-h-card-content class="vbox h-full gap-4">
    <textarea class="h-full" name="note-to-bill" x-h-textarea placeholder="Add note to bill"></textarea>
    <div class="flex items-center gap-2 pr-2">
      <span x-h-switch data-size="sm">
        <input type="checkbox" id="saveNoteSw" />
      </span>
      <label x-h-label for="saveNoteSw">Save note</label>
    </div>
  </div>
  <div x-h-card-footer class="hbox justify-end gap-2">
    <button x-h-button data-variant="link">Report</button>
    <button x-h-button>Reject</button>
    <button x-h-button data-variant="primary">Pay</button>
  </div>
</div>
```

</LiveExample>

### Login Form

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-card class="w-full max-w-sm">
  <div x-h-card-header>
    <div x-h-card-title>Login to your account</div>
    <div x-h-card-description>Enter your email below to login to your account</div>
    <div x-h-card-action>
      <button x-h-button data-variant="link">Sign Up</button>
    </div>
  </div>
  <form x-h-card-content>
    <div class="flex flex-col gap-6">
      <div class="grid gap-2">
        <label x-h-label for="email">Email</label>
        <input x-h-input id="email" type="email" placeholder="user@example.com" required />
      </div>
      <div class="grid gap-2">
        <div class="flex items-center">
          <label x-h-label for="password">Password</label>
          <a href="#" x-h-text.sm class="ml-auto hover:underline">Forgot your password?</a>
        </div>
        <input x-h-input id="password" type="password" required />
      </div>
    </div>
  </form>
  <div x-h-card-footer class="flex-col gap-2">
    <button x-h-button data-variant="primary" type="submit" class="w-full">Login</button>
    <button x-h-button class="w-full">Login with Harmonia</button>
  </div>
</div>
```

</LiveExample>

### Separated Header

Add `border-b` to the header to draw a line under it. The header tightens its own bottom padding against the line.

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-card class="w-full max-w-sm">
  <div x-h-card-header class="border-b">
    <div x-h-card-title>Storage</div>
    <div x-h-card-description>Across all your workspaces</div>
  </div>
  <div x-h-card-content class="vbox gap-2">
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Documents</span>
      <span x-h-text.muted class="tabular-nums">4.2 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Images</span>
      <span x-h-text.muted class="tabular-nums">11.8 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Backups</span>
      <span x-h-text.muted class="tabular-nums">2.1 GB</span>
    </div>
  </div>
</div>
```

</LiveExample>

### Separated Footer

Add `border-t` to the footer to draw a line above it. The footer tightens its vertical padding.

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-card class="w-full max-w-sm">
  <div x-h-card-header>
    <div x-h-card-title>Storage</div>
    <div x-h-card-description>Across all your workspaces</div>
  </div>
  <div x-h-card-content class="vbox gap-2">
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Documents</span>
      <span x-h-text.muted class="tabular-nums">4.2 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Images</span>
      <span x-h-text.muted class="tabular-nums">11.8 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Backups</span>
      <span x-h-text.muted class="tabular-nums">2.1 GB</span>
    </div>
  </div>
  <div x-h-card-footer class="justify-end border-t">
    <button x-h-button data-variant="link">Manage storage</button>
  </div>
</div>
```

</LiveExample>

### Separated Header and Footer

Use both borders when the content between them is expected to scroll, so neither edge appears to run underneath it.

<LiveExample data-class="flex flex-col items-center">

```html
<div x-h-card class="w-full max-w-sm">
  <div x-h-card-header class="border-b">
    <div x-h-card-title>Storage</div>
    <div x-h-card-description>Across all your workspaces</div>
  </div>
  <div x-h-card-content class="vbox gap-2 overflow-y-auto" style="height: 5rem">
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Documents</span>
      <span x-h-text.muted class="tabular-nums">4.2 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Images</span>
      <span x-h-text.muted class="tabular-nums">11.8 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Backups</span>
      <span x-h-text.muted class="tabular-nums">2.1 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Exports</span>
      <span x-h-text.muted class="tabular-nums">0.9 GB</span>
    </div>
    <div class="flex items-center justify-between">
      <span x-h-text.sm>Trash</span>
      <span x-h-text.muted class="tabular-nums">0.4 GB</span>
    </div>
  </div>
  <div x-h-card-footer class="justify-end border-t">
    <button x-h-button data-variant="link">Manage storage</button>
  </div>
</div>
```

</LiveExample>

### Flush Content

Add the `flush` modifier and the `overflow-hidden` class to the content, so a table, a list, a calendar or an iframe that reaches the edges of the card gets clipped to the rounded corners. `data-type="object"` on the card brings the header and the footer closer to the object that fills it.

<LiveExample data-class="flex flex-col items-stretch">

```html
<div x-h-card data-type="object">
  <div x-h-card-header>
    <div x-h-card-title>Recent orders</div>
    <div x-h-card-description>Your latest transactions</div>
  </div>
  <div x-h-card-content.flush class="overflow-hidden">
    <div x-h-table-container>
      <table x-h-table>
        <caption class="sr-only">
          Recent orders
        </caption>
        <thead x-h-table-header data-bordered="horizontal">
          <tr x-h-table-row>
            <th x-h-table-head scope="col">Customer</th>
            <th x-h-table-head scope="col">Status</th>
            <th x-h-table-head scope="col" class="text-right">Amount</th>
          </tr>
        </thead>
        <tbody x-h-table-body>
          <tr x-h-table-row data-hoverable="true">
            <td x-h-table-cell>Olivia Davis</td>
            <td x-h-table-cell><span x-h-badge data-variant="positive">Paid</span></td>
            <td x-h-table-cell class="text-right">$256.16</td>
          </tr>
          <tr x-h-table-row data-hoverable="true">
            <td x-h-table-cell>Noah Bennett</td>
            <td x-h-table-cell><span x-h-badge data-variant="warning">Pending</span></td>
            <td x-h-table-cell class="text-right">$1,024.00</td>
          </tr>
          <tr x-h-table-row data-hoverable="true">
            <td x-h-table-cell>Mia Fletcher</td>
            <td x-h-table-cell><span x-h-badge data-variant="negative">Refunded</span></td>
            <td x-h-table-cell class="text-right">$64.90</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```

</LiveExample>

### Interactive List

<LiveExample data-class="flex flex-col items-stretch">

```html
<div x-h-card data-type="object" x-data="{ selected: 'Design' }">
  <div x-h-card-header class="border-b">
    <div x-h-card-title>Workspaces</div>
    <div x-h-card-description>Pick the one to open on start</div>
  </div>
  <div x-h-card-content.flush class="overflow-hidden">
    <ul x-h-list>
      <template x-for="name in ['Design', 'Engineering', 'Marketing']" :key="name">
        <li x-h-list-item>
          <button x-h-list-item-button :aria-current="selected === name" @click="selected = name" x-text="name"></button>
        </li>
      </template>
    </ul>
  </div>
</div>
```

</LiveExample>
