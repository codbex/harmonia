# Icon

Renders an SVG graphic, either from a link or a set of built-in icons, that can represent an action, status, or decorative element. By default, it applies the fill-current class, allowing the icon to inherit the current text color.

## Usage

Icons work best when paired with clear labels or context, and should not be the sole method of conveying information. They can be used as small interface symbols or full SVG illustrations, depending on the design needs.

## API Reference

### Component attribute(s)

```
x-h-icon
```

### Attributes

| Attribute | Type                     | Required | Description                                                                                                                                                                                                                                                                                                                                                                     |
| --------- | ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-icon | string                   | false    | Name of a built-in icon to render (see the list below). Reactive, can be binded with `:data-icon` and the rendered icon updates whenever the value changes. Ignored when `data-link` is set.                                                                                                                                                                                    |
| data-link | url                      | false    | URL to the svg icon. Reactive, can be binded with `:data-link` and the icon is fetched again and replaced whenever the value changes.                                                                                                                                                                                                                                           |
| role      | `img`<br/>`presentation` | true     | The role of the icon. This is required as it affects the accessibility.<br />The `presentation` role excludes the icon from being visible to assistive technologies.<br />When using the `img` role, either `aria-label` or `aria-labelledby` attribute must also be provided. If not, assistive technologies will have trouble conveying to the user what the icon represents. |

::: info
Icons do not have a size by default. When placed directly inside components, like button, menu and sidebar, they will automatically have their size set. However, if placed directly inside components like cards, info pages, etc. or `<div>` and `<span>` elements, then it's recommended to use a size class on them (`size-4` being the default recommended one) as they will otherwise be randomly sized.
:::

### Built-in icons

Harmonia includes several built-in icons. Instead of using the `data-link` attribute, set `data-icon` to one of the names below to render it.

| Name           | Description                            |
| -------------- | -------------------------------------- |
| calendar       | Calendar icon                          |
| check          | Check icon                             |
| chevron-down   | Chevron down icon                      |
| chevron-left   | Chevron left icon                      |
| chevron-right  | Chevron right icon                     |
| chevrons-left  | Chevrons left icon                     |
| chevrons-right | Chevrons right icon                    |
| clock          | Clock icon                             |
| search         | Search icon                            |
| eye            | Show/Eye icon                          |
| eye-off        | Hide/Eye off icon                      |
| ellipsis       | Ellipsis icon                          |
| minus          | Minus icon                             |
| plus           | Plus icon                              |
| close          | Close/Cancel icon                      |
| bell           | Bell icon                              |
| trash          | Delete/Trash icon                      |
| mail           | Mail icon                              |
| inbox          | Inbox icon                             |
| send           | Send icon                              |
| export         | Export/Download icon                   |
| import         | Import/Upload icon                     |
| file           | File icon                              |
| link           | Link icon                              |
| edit           | Edit icon                              |
| menu           | Menu icon                              |
| reply          | Reply icon                             |
| refresh        | Refresh icon                           |
| play           | Play icon                              |
| pause          | Pause icon                             |
| circle-info    | Information icon in a circle           |
| circle-warning | Warning icon in a circle               |
| circle-error   | Error icon in a circle                 |
| circle-success | Success icon in a circle               |
| circle-unknown | Unknown/Question mark icon in a circle |
| circle-user    | User icon in a circle                  |
| home           | Home icon                              |
| star           | Filled star icon                       |
| star-hollow    | Hollow/outline star icon               |
| star-half      | Half-filled star icon                  |

## Examples

### SVG image

<LiveExample data-class="!p-1 hbox justify-center">

```html
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
```

</LiveExample>

### SVG icon

<LiveExample>

```html
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

</LiveExample>

### SVG icon with custom fill color

<LiveExample data-class="flex gap-3">

```html
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

</LiveExample>

### Harmonia Icons

The icons below ship with Harmonia. Reference one by its name with `data-icon`, or click an icon in the preview to copy its markup.

<IconGallery>

```html
<svg x-h-icon data-icon="calendar" role="img" aria-label="calendar"></svg>
<svg x-h-icon data-icon="check" role="img" aria-label="check"></svg>
<svg x-h-icon data-icon="chevron-down" role="img" aria-label="chevron down"></svg>
<svg x-h-icon data-icon="chevron-left" role="img" aria-label="chevron left"></svg>
<svg x-h-icon data-icon="chevron-right" role="img" aria-label="chevron right"></svg>
<svg x-h-icon data-icon="chevrons-left" role="img" aria-label="chevrons left"></svg>
<svg x-h-icon data-icon="chevrons-right" role="img" aria-label="chevrons right"></svg>
<svg x-h-icon data-icon="clock" role="img" aria-label="clock"></svg>
<svg x-h-icon data-icon="search" role="img" aria-label="search"></svg>
<svg x-h-icon data-icon="eye" role="img" aria-label="eye"></svg>
<svg x-h-icon data-icon="eye-off" role="img" aria-label="eye off"></svg>
<svg x-h-icon data-icon="ellipsis" role="img" aria-label="ellipsis"></svg>
<svg x-h-icon data-icon="minus" role="img" aria-label="minus"></svg>
<svg x-h-icon data-icon="plus" role="img" aria-label="plus"></svg>
<svg x-h-icon data-icon="close" role="img" aria-label="close"></svg>
<svg x-h-icon data-icon="bell" role="img" aria-label="bell"></svg>
<svg x-h-icon data-icon="trash" role="img" aria-label="trash"></svg>
<svg x-h-icon data-icon="mail" role="img" aria-label="mail"></svg>
<svg x-h-icon data-icon="inbox" role="img" aria-label="inbox"></svg>
<svg x-h-icon data-icon="send" role="img" aria-label="send"></svg>
<svg x-h-icon data-icon="export" role="img" aria-label="export"></svg>
<svg x-h-icon data-icon="import" role="img" aria-label="import"></svg>
<svg x-h-icon data-icon="file" role="img" aria-label="file"></svg>
<svg x-h-icon data-icon="link" role="img" aria-label="link"></svg>
<svg x-h-icon data-icon="edit" role="img" aria-label="edit"></svg>
<svg x-h-icon data-icon="menu" role="img" aria-label="menu"></svg>
<svg x-h-icon data-icon="reply" role="img" aria-label="reply"></svg>
<svg x-h-icon data-icon="refresh" role="img" aria-label="refresh"></svg>
<svg x-h-icon data-icon="play" role="img" aria-label="play"></svg>
<svg x-h-icon data-icon="pause" role="img" aria-label="pause"></svg>
<svg x-h-icon data-icon="circle-info" role="img" aria-label="information"></svg>
<svg x-h-icon data-icon="circle-warning" role="img" aria-label="warning"></svg>
<svg x-h-icon data-icon="circle-error" role="img" aria-label="error"></svg>
<svg x-h-icon data-icon="circle-success" role="img" aria-label="success"></svg>
<svg x-h-icon data-icon="circle-unknown" role="img" aria-label="unknown"></svg>
<svg x-h-icon data-icon="circle-user" role="img" aria-label="user"></svg>
<svg x-h-icon data-icon="home" role="img" aria-label="home"></svg>
<svg x-h-icon data-icon="star" role="img" aria-label="star"></svg>
<svg x-h-icon data-icon="star-hollow" role="img" aria-label="star hollow"></svg>
<svg x-h-icon data-icon="star-half" role="img" aria-label="star half"></svg>
```

</IconGallery>
