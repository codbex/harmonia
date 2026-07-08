# Alert

Communicates important information to the user about a situation or task that requires attention. Alerts can be used to highlight status changes or show critical messages.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use alerts to surface timely or important information that impacts the user’s current context. Avoid overusing alerts for non-critical content, as this can reduce their effectiveness.

## Directives

`x-h-alert` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-alert`
- `x-h-alert-title`
- `x-h-alert-description`
- `x-h-alert-actions`

## API

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

### Alert with icon, title and description

```html
<div x-h-alert>
  <svg x-h-lucide role="presentation" data-lucide="mail"></svg>
  <div x-h-alert-title>Mail Sent</div>
  <div x-h-alert-description>Your mail has been sent</div>
</div>
```

### Information variant

```html
<div x-h-alert data-variant="information">
  <svg x-h-lucide role="presentation" data-lucide="info"></svg>
  <div x-h-alert-title>Information</div>
  <div x-h-alert-description>Information variant description</div>
</div>
```

### Warning variant

```html
<div x-h-alert data-variant="warning">
  <svg x-h-lucide role="presentation" data-lucide="circle-alert"></svg>
  <div x-h-alert-title>Warning</div>
  <div x-h-alert-description>Warning variant description</div>
</div>
```

### Negative variant

```html
<div x-h-alert data-variant="negative">
  <svg x-h-lucide role="presentation" data-lucide="circle-x"></svg>
  <div x-h-alert-title>Negative</div>
  <div x-h-alert-description>Negative variant description</div>
</div>
```

### Positive variant

```html
<div x-h-alert data-variant="positive">
  <svg x-h-lucide role="presentation" data-lucide="circle-check"></svg>
  <div x-h-alert-title>Positive</div>
  <div x-h-alert-description>Positive variant description</div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/alert.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
