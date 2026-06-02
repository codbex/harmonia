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

## Examples

### SVG image

<br />

<ClientOnly>
<component-container data-class="!p-1 hbox justify-center">
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
```

### SVG icon

<br />

<ClientOnly>
<component-container>
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
</component-container>
</ClientOnly>

```html
<svg x-h-icon class="size-8" data-link="/harmonia/logo/harmonia-symbolic.svg" role="presentation"></svg>
```

### SVG icon with custom fill color

<br />

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

<br />

<ClientOnly>
<component-container data-class="grid grid-cols-2 md:grid-cols-4 justify-items-center gap-4">
<div class="vbox gap-2 items-center">
  <svg x-h-icon.calendar class="size-8" role="img" aria-label="calendar"></svg>
  <span>calendar</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.check class="size-8" role="img" aria-label="check"></svg>
  <span>check</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevron-down class="size-8" role="img" aria-label="chevron down"></svg>
  <span>chevron-down</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevron-left class="size-8" role="img" aria-label="chevron left"></svg>
  <span>chevron-left</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevron-right class="size-8" role="img" aria-label="chevron right"></svg>
  <span>chevron-right</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevrons-left class="size-8" role="img" aria-label="chevrons left"></svg>
  <span>chevrons-left</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.chevrons-right class="size-8" role="img" aria-label="chevrons right"></svg>
  <span>chevrons-right</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.clock role="img" class="size-8" aria-label="clock"></svg>
  <span>clock</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.search role="img" class="size-8" aria-label="search"></svg>
  <span>search</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.ellipsis role="img" class="size-8" aria-label="ellipsis"></svg>
  <span>ellipsis</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.minus role="img" class="size-8" aria-label="minus"></svg>
  <span>minus</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.plus role="img" class="size-8" aria-label="plus"></svg>
  <span>plus</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.close role="img" class="size-8" aria-label="close"></svg>
  <span>close</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.bell role="img" class="size-8" aria-label="bell"></svg>
  <span>bell</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.trash role="img" class="size-8" aria-label="trash"></svg>
  <span>trash</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.mail role="img" class="size-8" aria-label="mail"></svg>
  <span>mail</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.send role="img" class="size-8" aria-label="send"></svg>
  <span>send</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.export role="img" class="size-8" aria-label="export"></svg>
  <span>export</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.import role="img" class="size-8" aria-label="import"></svg>
  <span>import</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.edit role="img" class="size-8" aria-label="edit"></svg>
  <span>edit</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.menu role="img" class="size-8" aria-label="menu"></svg>
  <span>menu</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.reply role="img" class="size-8" aria-label="reply"></svg>
  <span>reply</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.refresh role="img" class="size-8" aria-label="refresh"></svg>
  <span>refresh</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.circle-info role="img" class="size-8" aria-label="info"></svg>
  <span>circle-info</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.circle-warning role="img" class="size-8" aria-label="warning"></svg>
  <span>circle-warning</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.circle-error role="img" class="size-8" aria-label="error"></svg>
  <span>circle-error</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.circle-success role="img" class="size-8" aria-label="success"></svg>
  <span>circle-success</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.circle-unknown role="img" class="size-8" aria-label="unknown"></svg>
  <span>circle-unknown</span>
</div>
<div class="vbox gap-2 items-center">
  <svg x-h-icon.circle-user role="img" class="size-8" aria-label="user"></svg>
  <span>circle-user</span>
</div>
</component-container>
</ClientOnly>

```html
<svg x-h-icon.calendar class="size-8" role="img" aria-label="calendar"></svg>
<svg x-h-icon.check class="size-8" role="img" aria-label="check"></svg>
<svg x-h-icon.chevron-down class="size-8" role="img" aria-label="chevron down"></svg>
<svg x-h-icon.chevron-left class="size-8" role="img" aria-label="chevron left"></svg>
<svg x-h-icon.chevron-right class="size-8" role="img" aria-label="chevron right"></svg>
<svg x-h-icon.chevrons-left class="size-8" role="img" aria-label="chevrons left"></svg>
<svg x-h-icon.chevrons-right class="size-8" role="img" aria-label="chevrons right"></svg>
<svg x-h-icon.clock class="size-8" role="img" aria-label="clock"></svg>
<svg x-h-icon.search class="size-8" role="img" aria-label="search"></svg>
<svg x-h-icon.ellipsis class="size-8" role="img" aria-label="ellipsis"></svg>
<svg x-h-icon.minus class="size-8" role="img" aria-label="minus"></svg>
<svg x-h-icon.plus class="size-8" role="img" aria-label="plus"></svg>
<svg x-h-icon.close class="size-8" role="img" aria-label="close"></svg>
<svg x-h-icon.bell class="size-8" role="img" aria-label="bell"></svg>
<svg x-h-icon.trash class="size-8" role="img" aria-label="trash"></svg>
<svg x-h-icon.mail class="size-8" role="img" aria-label="mail"></svg>
<svg x-h-icon.send class="size-8" role="img" aria-label="send"></svg>
<svg x-h-icon.export class="size-8" role="img" aria-label="export"></svg>
<svg x-h-icon.import class="size-8" role="img" aria-label="import"></svg>
<svg x-h-icon.edit class="size-8" role="img" aria-label="edit"></svg>
<svg x-h-icon.menu class="size-8" role="img" aria-label="menu"></svg>
<svg x-h-icon.reply class="size-8" role="img" aria-label="reply"></svg>
<svg x-h-icon.refresh class="size-8" role="img" aria-label="refresh"></svg>
<svg x-h-icon.circle-info class="size-8" role="img" aria-label="information"></svg>
<svg x-h-icon.circle-warning class="size-8" role="img" aria-label="warning"></svg>
<svg x-h-icon.circle-error class="size-8" role="img" aria-label="error"></svg>
<svg x-h-icon.circle-success class="size-8" role="img" aria-label="success"></svg>
<svg x-h-icon.circle-unknown class="size-8" role="img" aria-label="unknown"></svg>
<svg x-h-icon.circle-user class="size-8" role="img" aria-label="user"></svg>
```
