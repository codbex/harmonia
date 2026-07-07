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

<LiveExample>

```html
<div class="tile-auto-sm border bg-contain bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>

#### Cover

<LiveExample>

```html
<div class="tile-auto-sm border bg-cover" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>

#### Auto

<LiveExample>

```html
<div class="tile-auto-sm border bg-auto bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>

### Background Repeat

#### Repeat

<LiveExample>

```html
<div class="tile-auto-md border bg-auto bg-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>

#### Repeat X

<LiveExample>

```html
<div class="tile-auto-md border bg-auto bg-repeat-x" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>

#### Repeat Y

<LiveExample>

```html
<div class="aspect-square size-full border bg-auto bg-repeat-y" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>

#### No Repeat

<LiveExample>

```html
<div class="tile-auto-sm border bg-auto bg-no-repeat" style="background-image: url('/harmonia/logo/harmonia-square.jpg');"></div>
```

</LiveExample>
