# Alert

Communicates important information to the user about a situation or task that requires attention. Alerts can be used to highlight status changes or show critical messages but they can also be used as notification popups.

## Usage

Use alerts to surface timely or important information that impacts the user’s current context. Avoid overusing alerts for non-critical content, as this can reduce their effectiveness.

## API Reference

### Component attubute(s)

```
x-h-alert
x-h-alert-title
x-h-alert-description
x-h-alert-actions
```

### Attributes

#### x-h-alert

| Attribute    | Type                                                         | Required | Description          |
| ------------ | ------------------------------------------------------------ | -------- | -------------------- |
| data-variant | `positive`<br />`negative`<br />`warning`<br />`information` | false    | Semantic color state |

### Modifiers

#### x-h-alert

| Modifier | Description                 |
| -------- | --------------------------- |
| floating | Adds a shadow to the alert. |

## Examples

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert.floating>
  <i role="img" data-lucide="files"></i>
  <div x-h-alert-title>Floating</div>
  <div x-h-alert-description>Usually used as a notification</div>
  <div x-h-alert-actions>
    <button x-h-button data-size="icon-sm" data-variant="outline" class="rounded-full" aria-label="Close"><i role="img" data-lucide="x"></i></button>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert.floating>
  <i role="img" data-lucide="files"></i>
  <div x-h-alert-title>Floating</div>
  <div x-h-alert-description>Usually used as a notification</div>
  <div x-h-alert-actions>
    <button x-h-button data-size="icon-sm" data-variant="outline"><i role="img" data-lucide="x"></i></button>
  </div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert>
  <i role="img" data-lucide="files"></i>
  <div x-h-alert-title>No description!</div>
  <div x-h-alert-actions>
    <button x-h-button data-size="icon-sm" data-variant="outline" aria-label="Close"><i role="img" data-lucide="x"></i></button>
  </div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert>
  <i role="img" data-lucide="files"></i>
  <div x-h-alert-title>No description!</div>
  <div x-h-alert-actions>
    <button x-h-button data-size="icon-sm" data-variant="outline" aria-label="Close"><i role="img" data-lucide="x"></i></button>
  </div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert>
  <i role="img" data-lucide="mail"></i>
  <div x-h-alert-title>Mail Sent</div>
  <div x-h-alert-description>You mail has been sent</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert>
  <i role="img" data-lucide="mail"></i>
  <div x-h-alert-title>Mail Sent</div>
  <div x-h-alert-description>You mail has been sent</div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert data-variant="information">
  <i role="img" data-lucide="info"></i>
  <div x-h-alert-title>Information</div>
  <div x-h-alert-description>Information variant description</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert data-variant="information">
  <i role="img" data-lucide="info"></i>
  <div x-h-alert-title>Information</div>
  <div x-h-alert-description>Information variant description</div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert data-variant="warning">
  <i role="img" data-lucide="circle-alert"></i>
  <div x-h-alert-title>Warning</div>
  <div x-h-alert-description>Warning variant description</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert data-variant="warning">
  <i role="img" data-lucide="circle-alert"></i>
  <div x-h-alert-title>Warning</div>
  <div x-h-alert-description>Warning variant description</div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert data-variant="negative">
  <i role="img" data-lucide="circle-x"></i>
  <div x-h-alert-title>Negative</div>
  <div x-h-alert-description>Negative variant description</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert data-variant="negative">
  <i role="img" data-lucide="circle-x"></i>
  <div x-h-alert-title>Negative</div>
  <div x-h-alert-description>Negative variant description</div>
</div>
```

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<div x-h-alert data-variant="positive">
  <i role="img" data-lucide="circle-check"></i>
  <div x-h-alert-title>Positive</div>
  <div x-h-alert-description>Positive variant description</div>
</div>
</component-container>
</ClientOnly>

```html
<div x-h-alert data-variant="positive">
  <i role="img" data-lucide="circle-check"></i>
  <div x-h-alert-title>Positive</div>
  <div x-h-alert-description>Positive variant description</div>
</div>
```
