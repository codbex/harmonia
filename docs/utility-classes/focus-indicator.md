# Focus Indicator

Utility classes for the standard Harmonia focus indicator. Both apply their styles only while the element has visible focus, so the indicator shows up during keyboard navigation without flashing on mouse clicks. They are the same classes Harmonia components use internally, letting custom focusable elements match the look of the built-in ones.

## Class names

| Class         | Description                                                                                                                              |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| focus-ring    | Colors the element's border with the theme ring color and draws a translucent ring around it. Best for bordered controls such as inputs. |
| focus-outline | Draws an outline around the element. It sets no color, so pair it with an outline color class such as `outline-ring/50`.                 |

## Examples

Move focus with the Tab key to show the indicators.

<LiveExample data-class="hbox gap-4">

```html
<button class="cursor-pointer rounded-md border focus-ring bg-input-inner px-4 py-2">Focus ring</button>
<button class="cursor-pointer rounded-md bg-primary px-4 py-2 text-primary-foreground focus-outline outline-ring/50">Focus outline</button>
```

</LiveExample>
