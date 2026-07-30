# Skeleton

A placeholder component used to indicate that content is loading. Skeletons provide a visual cue to users, reducing perceived wait times and improving the overall experience.

## Usage

Use skeletons to temporarily fill the space of content that is being fetched or rendered. Make sure the placeholder visually resembles the final content layout to maintain context. Avoid overusing skeletons for static or instant-loading content, as this can create unnecessary visual noise.

A skeleton is only a background, a pulse and a radius, so it can also be written with plain utility classes when the runtime has not loaded yet. See [Without the runtime](#without-the-runtime).

## API Reference

### Component attribute(s)

```
x-h-skeleton
```

### Attributes

| Attribute | Type                          | Required | Description                                                                   |
| --------- | ----------------------------- | -------- | ----------------------------------------------------------------------------- |
| data-size | `sm`<br />`md`<br />`default` | false    | Height of the skeleton. Works only when combined with the `control` modifier. |

### Modifiers

| Modifier | Description                                             |
| -------- | ------------------------------------------------------- |
| control  | Takes the shape of a control (like inputs and buttons). |
| card     | Takes the shape of a card or tile.                      |
| avatar   | Takes the shape of an avatar component.                 |

## Examples

### Using the component

<LiveExample>

```html
<div class="flex flex-col gap-2">
  <div x-h-skeleton.avatar></div>
  <div x-h-skeleton.card class="tile-sm"></div>
  <div x-h-skeleton.control class="w-1/2"></div>
  <div x-h-skeleton class="h-12 w-full"></div>
</div>
```

</LiveExample>

### Without the runtime

The directive only adds classes, so the same placeholders can be written by hand. This is useful for markup that is served before Alpine initializes, where no directive has run yet.

Every shape is `bg-secondary animate-pulse` plus a radius: `rounded-md` by default, `rounded-lg` for a card, `rounded-full` for an avatar, and `rounded-control` with a matching height for a control.

<LiveExample data-exclude="generator">

```html
<div class="flex flex-col gap-2">
  <div class="size-8 animate-pulse rounded-full bg-secondary"></div>
  <div class="tile-sm animate-pulse rounded-lg bg-secondary"></div>
  <div class="h-9 w-1/2 animate-pulse rounded-control bg-secondary"></div>
  <div class="h-12 w-full animate-pulse rounded-md bg-secondary"></div>
</div>
```

</LiveExample>
