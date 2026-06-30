# Color

CSS utility classes to apply colors to border, elements, svgs and text.

## Class names

### Background colors

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

### Text colors

| Class                       | Description                                     |
| --------------------------- | ----------------------------------------------- |
| text-background             | Set background color as text color.             |
| text-foreground             | Set foreground color as text color.             |
| text-primary                | Set primary color as text color.                |
| text-primary-foreground     | Set primary foreground color as text color.     |
| text-secondary              | Set secondary color as text color.              |
| text-secondary-foreground   | Set secondary foreground color as text color.   |
| text-muted                  | Set muted color as text color.                  |
| text-muted-foreground       | Set muted foreground color as text color.       |
| text-negative               | Set negative color as text color.               |
| text-negative-foreground    | Set negative foreground color as text color.    |
| text-positive               | Set positive color as text color.               |
| text-positive-foreground    | Set positive foreground color as text color.    |
| text-warning                | Set warning color as text color.                |
| text-warning-foreground     | Set warning foreground color as text color.     |
| text-information            | Set information color as text color.            |
| text-information-foreground | Set information foreground color as text color. |

### SVG/Icon fill colors

| Class                       | Description                                     |
| --------------------------- | ----------------------------------------------- |
| fill-none                   | Removes fill (`fill: none`).                    |
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

### Border colors

| Class                         | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| border-background             | Set background color as border color.              |
| border-foreground             | Set foreground color as border color.              |
| border-primary                | Set primary color as border color.                 |
| border-primary/50             | Set primary color as border color with 50 opacity. |
| border-primary-foreground     | Set primary foreground color as border color.      |
| border-secondary              | Set secondary color as border color.               |
| border-secondary-foreground   | Set secondary foreground color as border color.    |
| border-muted                  | Set muted color as border color.                   |
| border-muted-foreground       | Set muted foreground color as border color.        |
| border-negative               | Set negative color as border color.                |
| border-negative-foreground    | Set negative foreground color as border color.     |
| border-positive               | Set positive color as border color.                |
| border-positive-foreground    | Set positive foreground color as border color.     |
| border-warning                | Set warning color as border color.                 |
| border-warning-foreground     | Set warning foreground color as border color.      |
| border-information            | Set information color as border color.             |
| border-information-foreground | Set information foreground color as border color.  |

### Standard colors

A subset of the standard color palette is available as `bg-` and `text-` utilities for general-purpose use. The chromatic colors are provided at the `500` step; `white` and `black` have no step.

| Color  | Background class | Text class      |
| ------ | ---------------- | --------------- |
| White  | bg-white         | text-white      |
| Black  | bg-black         | text-black      |
| Red    | bg-red-500       | text-red-500    |
| Orange | bg-orange-500    | text-orange-500 |
| Yellow | bg-yellow-500    | text-yellow-500 |
| Green  | bg-green-500     | text-green-500  |
| Teal   | bg-teal-500      | text-teal-500   |
| Blue   | bg-blue-500      | text-blue-500   |
| Indigo | bg-indigo-500    | text-indigo-500 |
| Purple | bg-purple-500    | text-purple-500 |
| Pink   | bg-pink-500      | text-pink-500   |
| Gray   | bg-gray-500      | text-gray-500   |

## Examples

### Standard colors

<ClientOnly>
<component-container data-class="flex flex-wrap gap-2">
<p class="bg-white text-black border p-4">white</p>
<p class="bg-black text-white p-4">black</p>
<p class="bg-red-500 text-white p-4">red-500</p>
<p class="bg-orange-500 text-white p-4">orange-500</p>
<p class="bg-yellow-500 text-black p-4">yellow-500</p>
<p class="bg-green-500 text-white p-4">green-500</p>
<p class="bg-teal-500 text-white p-4">teal-500</p>
<p class="bg-blue-500 text-white p-4">blue-500</p>
<p class="bg-indigo-500 text-white p-4">indigo-500</p>
<p class="bg-purple-500 text-white p-4">purple-500</p>
<p class="bg-pink-500 text-white p-4">pink-500</p>
<p class="bg-gray-500 text-white p-4">gray-500</p>
</component-container>
</ClientOnly>

```html
<p class="bg-red-500 p-4 text-white">red-500</p>
<p class="p-4 text-red-500">red-500</p>
```

### Primary

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

<ClientOnly>
<component-container data-icons="true">
<p class="bg-muted text-muted-foreground p-4">Muted</p>
<p class="p-4 text-muted">Muted</p>
<svg x-h-icon class="size-8 bg-muted fill-muted-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-muted" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<p class="bg-muted p-4 text-muted-foreground">Muted</p>
<p class="p-4 text-muted">Muted</p>
<svg x-h-icon class="size-8 bg-muted fill-muted-foreground" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-muted" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```
