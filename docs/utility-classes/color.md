# Color

CSS utility classes to apply colors to elements, svgs and text.

## Class names

| Class          | Description                                |
| -------------- | ------------------------------------------ |
| bg-background  | Background color.                          |
| bg-foreground  | Set foreground color as background color.  |
| bg-primary     | Set primary color as background color..    |
| bg-secondary   | Set secondary color as background color.   |
| bg-muted       | Set muted color as background color.       |
| bg-negative    | Set negative color as background color.    |
| bg-positive    | Set positive color as background color.    |
| bg-warning     | Set warning color as background color.     |
| bg-information | Set information color as background color. |

| Class                       | Description                                     |
| --------------------------- | ----------------------------------------------- |
| text-background             | Set background color as text color.             |
| text-foreground             | Set foreground color as text color.             |
| text-primary                | Set primary color as text color.                |
| text-primary-foreground     | Set primary foreground color as text color.     |
| text-secondary              | Set secondary color as text color.              |
| text-secondary-foreground   | Set secondary foreground color as text color.   |
| text-muted-foreground       | Set muted foreground color as text color.       |
| text-negative               | Set negative color as text color.               |
| text-negative-foreground    | Set negative foreground color as text color.    |
| text-positive               | Set positive color as text color.               |
| text-positive-foreground    | Set positive foreground color as text color.    |
| text-warning                | Set warning color as text color.                |
| text-warning-foreground     | Set warning foreground color as text color.     |
| text-information            | Set information color as text color.            |
| text-information-foreground | Set information foreground color as text color. |

| Class                       | Description                                     |
| --------------------------- | ----------------------------------------------- |
| fill-current                | Set current color as fill color.                |
| fill-primary                | Set primary color as fill color.                |
| fill-primary-foreground     | Set primary foreground color as fill color.     |
| fill-secondary              | Set secondary color as fill color.              |
| fill-secondary-foreground   | Set secondary foreground color as fill color.   |
| fill-muted                  | Set muted color as fill color.                  |
| fill-muted-foreground       | Set muted foreground color as fill color.       |
| fill-negative               | Set negative color as fill color.               |
| fill-negative-foreground    | Set negative foreground color as fill color.    |
| fill-positive               | Set positive color as fill color.               |
| fill-positive-foreground    | Set positive foreground color as fill color.    |
| fill-warning                | Set warning color as fill color.                |
| fill-warning-foreground     | Set warning foreground color as fill color.     |
| fill-information            | Set information color as fill color.            |
| fill-information-foreground | Set information foreground color as fill color. |

## Examples

### Primary

<br />

<ClientOnly>
<component-container>
<p class="bg-primary text-primary-foreground p-4">Primary</p>
<p class="text-primary p-4">Primary</p>
<svg x-h-icon class="size-8 bg-primary fill-primary-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-primary" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-primary p-4 text-primary-foreground">Primary</p>
<p class="p-4 text-primary">Primary</p>
<svg x-h-icon class="size-8 bg-primary fill-primary-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-primary" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Negative

<br />

<ClientOnly>
<component-container>
<p class="bg-negative text-negative-foreground p-4">Negative</p>
<p class="text-negative p-4">Negative</p>
<svg x-h-icon class="size-8 bg-negative fill-negative-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-negative p-4 text-negative-foreground">Negative</p>
<p class="p-4 text-negative">Negative</p>
<svg x-h-icon class="size-8 bg-negative fill-negative-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Positive

<br />

<ClientOnly>
<component-container>
<p class="bg-positive text-positive-foreground p-4">Positive</p>
<p class="text-positive p-4">Positive</p>
<svg x-h-icon class="size-8 bg-positive fill-positive-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-positive p-4 text-positive-foreground">Positive</p>
<p class="p-4 text-positive">Positive</p>
<svg x-h-icon class="size-8 bg-positive fill-positive-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Warning

<br />

<ClientOnly>
<component-container>
<p class="bg-warning text-warning-foreground p-4">Warning</p>
<p class="text-warning p-4">Warning</p>
<svg x-h-icon class="size-8 bg-warning fill-warning-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-warning p-4 text-warning-foreground">Warning</p>
<p class="p-4 text-warning">Warning</p>
<svg x-h-icon class="size-8 bg-warning fill-warning-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Information

<br />

<ClientOnly>
<component-container>
<p class="bg-information text-information-foreground p-4">Information</p>
<p class="text-information p-4">Information</p>
<svg x-h-icon class="size-8 bg-information fill-information-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-information p-4 text-information-foreground">Information</p>
<p class="p-4 text-information">Information</p>
<svg x-h-icon class="size-8 bg-information fill-information-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Muted

<br />

<ClientOnly>
<component-container data-js="/js/init-icons.js">
<p class="bg-muted text-muted-foreground p-4">Muted</p>
<svg x-h-icon class="size-8 bg-muted fill-muted-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-muted" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-muted p-4 text-muted-foreground">Muted</p>
<svg x-h-icon class="size-8 bg-muted fill-muted-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-muted" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```
