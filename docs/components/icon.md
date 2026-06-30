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
| data-link | url                      | false    | URL to the svg icon.                                                                                                                                                                                                                                                                                                                                                            |
| role      | `img`<br/>`presentation` | true     | The role of the icon. This is required as it affects the accessibility.<br />The `presentation` role excludes the icon from being visible to assistive technologies.<br />When using the `img` role, either `aria-label` or `aria-labelledby` attribute must also be provided. If not, assistive technologies will have trouble conveying to the user what the icon represents. |

### Modifiers

Harmonia includes several built-in icons. Instead of using the `data-link` attribute, you can apply the modifiers below to access them.

| Modifier       | Description                            |
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
| ellipsis       | Ellipsis icon                          |
| close          | Close/Cancel icon                      |
| bell           | Bell icon                              |
| trash          | Delete/Trash icon                      |
| mail           | Mail icon                              |
| send           | Send icon                              |
| export         | Export/Download icon                   |
| import         | Import/Upload icon                     |
| edit           | Edit icon                              |
| menu           | Menu icon                              |
| reply          | Reply icon                             |
| refresh        | Refresh icon                           |
| circle-info    | Information icon in a circle           |
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

<ClientOnly>
<component-container data-class="!p-1 hbox justify-center">
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
```

### SVG icon

<ClientOnly>
<component-container>
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### SVG icon with custom fill color

<ClientOnly>
<component-container data-class="flex gap-3">
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon class="size-8 fill-positive" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-negative" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-warning" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
<svg x-h-icon class="size-8 fill-information" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### Harmonia Icons

<ClientOnly>
<component-container src="/components/icons/grid.html" data-class="p-4"></component-container>
</ClientOnly>

```html
<svg x-h-icon.calendar role="img" aria-label="calendar"></svg>
<svg x-h-icon.check role="img" aria-label="check"></svg>
<svg x-h-icon.chevron-down role="img" aria-label="chevron down"></svg>
<svg x-h-icon.chevron-left role="img" aria-label="chevron left"></svg>
<svg x-h-icon.chevron-right role="img" aria-label="chevron right"></svg>
<svg x-h-icon.chevrons-left role="img" aria-label="chevrons left"></svg>
<svg x-h-icon.chevrons-right role="img" aria-label="chevrons right"></svg>
<svg x-h-icon.clock role="img" aria-label="clock"></svg>
<svg x-h-icon.search role="img" aria-label="search"></svg>
<svg x-h-icon.ellipsis role="img" aria-label="ellipsis"></svg>
<svg x-h-icon.minus role="img" aria-label="minus"></svg>
<svg x-h-icon.plus role="img" aria-label="plus"></svg>
<svg x-h-icon.close role="img" aria-label="close"></svg>
<svg x-h-icon.bell role="img" aria-label="bell"></svg>
<svg x-h-icon.trash role="img" aria-label="trash"></svg>
<svg x-h-icon.mail role="img" aria-label="mail"></svg>
<svg x-h-icon.send role="img" aria-label="send"></svg>
<svg x-h-icon.export role="img" aria-label="export"></svg>
<svg x-h-icon.import role="img" aria-label="import"></svg>
<svg x-h-icon.edit role="img" aria-label="edit"></svg>
<svg x-h-icon.menu role="img" aria-label="menu"></svg>
<svg x-h-icon.reply role="img" aria-label="reply"></svg>
<svg x-h-icon.refresh role="img" aria-label="refresh"></svg>
<svg x-h-icon.circle-info role="img" aria-label="information"></svg>
<svg x-h-icon.circle-warning role="img" aria-label="warning"></svg>
<svg x-h-icon.circle-error role="img" aria-label="error"></svg>
<svg x-h-icon.circle-success role="img" aria-label="success"></svg>
<svg x-h-icon.circle-unknown role="img" aria-label="unknown"></svg>
<svg x-h-icon.circle-user role="img" aria-label="user"></svg>
<svg x-h-icon.home role="img" aria-label="home"></svg>
<svg x-h-icon.star role="img" aria-label="star"></svg>
<svg x-h-icon.star-hollow role="img" aria-label="star hollow"></svg>
<svg x-h-icon.star-half role="img" aria-label="star half"></svg>
```
