# Card

A flexible container that organizes content into distinct sections, typically including a header, main content area, and footer. Cards provide a clear, self-contained layout for displaying related information.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use cards to group related information or actions in a visually distinct container, such as product details or summaries. Avoid overloading cards with excessive information.

## Directives

`x-h-card` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-card`
- `x-h-card-header`
- `x-h-card-title`
- `x-h-card-description`
- `x-h-card-action`
- `x-h-card-content`
- `x-h-card-footer`

## API

### Modifiers

#### x-h-card-content

| Modifier | Description                                                                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------------- |
| flush    | Removes the padding from the content, so that content like a table, a list or a calendar spans the full width of the card. |

## Examples

### Action Card

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

### Login Form

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

### Flush Content

The card itself has no padding, the header, the content and the footer pad themselves. Add the `flush` modifier to the content so a table, a list or a calendar reaches the edges of the card, and `overflow-hidden` to the card so it is clipped to the rounded corners. A `border-b` on the header separates it from content that starts right below it.

```html
<div x-h-card class="overflow-hidden">
  <div x-h-card-header class="border-b">
    <div x-h-card-title>Recent orders</div>
    <div x-h-card-description>Your latest transactions</div>
  </div>
  <div x-h-card-content.flush>
    <div x-h-table-container>
      <table x-h-table>
        <caption class="sr-only">
          Recent orders
        </caption>
        <thead x-h-table-header>
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

### Interactive List

```html
<div x-h-card class="overflow-hidden" x-data="{ selected: 'Design' }">
  <div x-h-card-header class="border-b">
    <div x-h-card-title>Workspaces</div>
    <div x-h-card-description>Pick the one to open on start</div>
  </div>
  <div x-h-card-content.flush>
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

Full docs: https://www.codbex.com/harmonia/components/card.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
