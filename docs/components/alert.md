# Alert

Communicates important information to the user about a situation or task that requires attention. Alerts can be used to highlight status changes or show critical messages.

## Usage

Use alerts to surface timely or important information that impacts the user’s current context. Avoid overusing alerts for non-critical content, as this can reduce their effectiveness.

## API Reference

### Component attribute(s)

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

| Modifier        | Description                                            |
| --------------- | ------------------------------------------------------ |
| <s>floating</s> | Deprecated. Will be removed in the next major version. |

## Examples

### Alert with icon, title and actions

<LiveExample>

```html
<div x-h-alert>
  <svg x-h-lucide role="presentation" data-lucide="files"></svg>
  <div x-h-alert-title>No description!</div>
  <div x-h-alert-actions>
    <button x-h-button data-size="icon-sm" data-variant="outline" aria-label="Close">
      <svg x-h-icon data-icon="close" role="presentation"></svg>
    </button>
  </div>
</div>
```

</LiveExample>

### Alert with icon, title and description

<LiveExample>

```html
<div x-h-alert>
  <svg x-h-lucide role="presentation" data-lucide="mail"></svg>
  <div x-h-alert-title>Mail Sent</div>
  <div x-h-alert-description>Your mail has been sent</div>
</div>
```

</LiveExample>

### Information variant

<LiveExample>

```html
<div x-h-alert data-variant="information">
  <svg x-h-lucide role="presentation" data-lucide="info"></svg>
  <div x-h-alert-title>Information</div>
  <div x-h-alert-description>Information variant description</div>
</div>
```

</LiveExample>

### Warning variant

<LiveExample>

```html
<div x-h-alert data-variant="warning">
  <svg x-h-lucide role="presentation" data-lucide="circle-alert"></svg>
  <div x-h-alert-title>Warning</div>
  <div x-h-alert-description>Warning variant description</div>
</div>
```

</LiveExample>

### Negative variant

<LiveExample>

```html
<div x-h-alert data-variant="negative">
  <svg x-h-lucide role="presentation" data-lucide="circle-x"></svg>
  <div x-h-alert-title>Negative</div>
  <div x-h-alert-description>Negative variant description</div>
</div>
```

</LiveExample>

### Positive variant

<LiveExample>

```html
<div x-h-alert data-variant="positive">
  <svg x-h-lucide role="presentation" data-lucide="circle-check"></svg>
  <div x-h-alert-title>Positive</div>
  <div x-h-alert-description>Positive variant description</div>
</div>
```

</LiveExample>
