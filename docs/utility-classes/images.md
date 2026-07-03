# Images

CSS utility classes for adjusting images.

## Class names

| Class          | Description            |
| -------------- | ---------------------- |
| object-contain | `object-fit: contain;` |
| object-cover   | `object-fit: cover;`   |
| object-fill    | `object-fit: fill;`    |

## Examples

### Contain

<LiveExample>

```html
<img class="border border-dashed object-contain" style="width:100%;height:100px" role="presentation" src="/harmonia/logo/harmonia-square.jpg" />
```

</LiveExample>

### Cover

<LiveExample>

```html
<img class="border border-dashed object-cover" style="width:100%;height:100px" role="presentation" src="/harmonia/logo/harmonia-square.jpg" />
```

</LiveExample>

### Fill

<LiveExample data-class="flex flex-col gap-3">

```html
<img class="border border-dashed object-fill" style="width:100%;height:100px" role="presentation" src="/harmonia/logo/harmonia-square.jpg" />
```

</LiveExample>
