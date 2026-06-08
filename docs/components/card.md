# Card

A flexible container that organizes content into distinct sections, typically including a header, main content area, and footer. Cards provide a clear, self-contained layout for displaying related information.

## Usage

Use cards to group related information or actions in a visually distinct container, such as product details or summaries. Avoid overloading cards with excessive information.

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

## Exampes

### Action Card

<ClientOnly>
<component-container data-class="flex flex-col items-stretch">
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
</component-container>
</ClientOnly>

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

<ClientOnly>
<component-container data-class="flex flex-col items-center">
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
</component-container>
</ClientOnly>

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
