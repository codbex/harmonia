# Dark Mode

Harmonia supports three color schemes: `light`, `dark`, and `auto`.

By default, the `auto` mode is enabled, which automatically aligns the application’s appearance with the user’s system or browser preferences. When the system color mode changes, from light to dark or vice versa, Harmonia updates the interface in real time, without requiring a page reload.

A color scheme change is also kept in sync across embedded same-origin iframes that use Harmonia, as well as across other browser tabs of the application, so the whole interface stays consistent.

## API Reference

During initialization, Harmonia automatically sets the color scheme and persists the user’s last selected preference.

To retrieve or manually configure the color scheme, use the [Theme](/utilities/theme) utility in the Utilities section.

## Examples

### Light/Dark Select

<ClientOnly>
<component-container src="/theming/select.html">
</component-container>
</ClientOnly>

<<< @/public/theming/select.html

### Light/Dark Switch

<ClientOnly>
<component-container src="/theming/switch.html">
</component-container>
</ClientOnly>

<<< @/public/theming/switch.html

### Sync across frames

Changing the color scheme in one frame is automatically applied to every embedded same-origin iframe (and to other tabs of the application). Pick a scheme below, or use the controls inside either embedded frame, and watch the others follow.

<ClientOnly>
<component-container src="/theming/sync.html">
</component-container>
</ClientOnly>

<<< @/public/theming/sync.html
