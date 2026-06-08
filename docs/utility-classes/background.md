# Background

CSS utility classes for controlling the size and repeat behavior of background images.

## Class names

| Class        | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| bg-auto      | `background-size: auto;` Renders the background image at its natural size. |
| bg-contain   | `background-size: contain;` Scales the image to fit within the element.    |
| bg-cover     | `background-size: cover;` Scales the image to fill the element entirely.   |
| bg-repeat    | `background-repeat: repeat;` Tiles the image in both directions.           |
| bg-repeat-x  | `background-repeat: repeat-x;` Tiles the image horizontally only.          |
| bg-repeat-y  | `background-repeat: repeat-y;` Tiles the image vertically only.            |
| bg-no-repeat | `background-repeat: no-repeat;` Renders the image once without tiling.     |

## Examples

### Background Size

#### Contain

<br />

<ClientOnly>
<component-container>
<div class="bg-contain bg-no-repeat border tile-auto-sm" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="tile-auto-sm border bg-contain bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

#### Cover

<br />

<ClientOnly>
<component-container>
<div class="tile-auto-sm border bg-cover" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="tile-auto-sm border bg-cover" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

#### Auto

<br />

<ClientOnly>
<component-container>
<div class="bg-auto bg-no-repeat border tile-auto-sm" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="tile-sm border bg-auto bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

### Background Repeat

#### Repeat

<ClientOnly>
<component-container>
<div class="tile-auto-md border bg-auto bg-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="tile-auto-md border bg-auto bg-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

#### Repeat X

<br />

<ClientOnly>
<component-container>
<div class="tile-auto-md border bg-auto bg-repeat-x" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="tile-auto-md border bg-auto bg-repeat-x" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

#### Repeat Y

<br />

<ClientOnly>
<component-container>
<div class="bg-auto bg-repeat-y border size-full aspect-square" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="size-full border bg-auto bg-repeat-y" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

#### No Repeat

<br />

<ClientOnly>
<component-container>
<div class="tile-auto-sm border bg-auto bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
</component-container>
</ClientOnly>

```html
<div class="tile-auto-sm border bg-auto bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```
