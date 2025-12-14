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

<br />

<ClientOnly>
<component-container >
<img class="object-contain border border-dashed" style="width:100%;height:100px" role="presentation" src="/logo/harmonia-square.jpg">
</component-container>
</ClientOnly>

```html
<img class="border border-dashed object-contain" style="width:100%;height:100px" role="presentation" src="/logo/harmonia-square.jpg" />
```

### Cover

<br />

<ClientOnly>
<component-container>
<img class="object-cover border border-dashed" style="width:100%;height:100px" role="presentation" src="/logo/harmonia-square.jpg">
</component-container>
</ClientOnly>

```html
<img class="border border-dashed object-cover" style="width:100%;height:100px" role="presentation" src="/logo/harmonia-square.jpg" />
```

### Fill

<br />

<ClientOnly>
<component-container data-class="flex flex-col gap-3">
<img class="object-fill border border-dashed" style="width:100%;height:100px" role="presentation" src="/logo/harmonia-square.jpg">
</component-container>
</ClientOnly>

```html
<img class="border border-dashed object-fill" style="width:100%;height:100px" role="presentation" src="/logo/harmonia-square.jpg" />
```
