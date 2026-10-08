# Theme Customization

Harmonia gives you complete control over the look and feel of your interface through **CSS variables**. This makes it easy to create fully customized themes that reflect your brand’s identity, without breaking consistency or spending hours rewriting styles.

You can define these variables manually in your own CSS file or `<style>` block, or speed things up using Harmonia’s **Theme Generator** to design, preview, and export a theme in minutes.

## CSS Theme Structure

Every Harmonia theme includes both **light** and **dark** variants.

- Light theme values are applied under the `:root` and `:host` pseudo-class selectors.
- Dark theme values are defined under the `.dark` CSS class selector.
- The same light values are also applied under the `.light` CSS class selector, letting a light-scheme area be nested inside a dark-scheme page or container (and a `.dark` area inside a `.light` one).

This structure makes it simple to switch between themes dynamically and keep the design consistent.

### Example

```css
:root,
:host,
.light {
  --background: oklch(1 0 0);
  --foreground: oklch(0.3211 0 0);
  ...
}

.dark {
  --background: oklch(0.1776 0 0);
  --foreground: oklch(1 0 0);
  ...
}
```

## CSS Variables

Harmonia ships with a **default set of theme variables** in the base CSS file. This means you don’t need to redefine every variable, just override the ones you care about.

For example, if you only want to change your **primary brand color**, your custom theme CSS can be as simple as:

```css
:root,
:host,
.light {
  --primary: oklch(...);
  --primary-foreground: oklch(...);
  --primary-hover: oklch(...);
  --primary-active: oklch(...);
}

.dark {
  --primary: oklch(...);
  --primary-foreground: oklch(...);
  --primary-hover: oklch(...);
  --primary-active: oklch(...);
}
```

This approach keeps theming lightweight, flexible, and easy to maintain.

### Colors

| Property                       | Description                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| --background                   | Base background color for the application.                                                  |
| --foreground                   | Base foreground (text and icon) color.                                                      |
| --card                         | Background color used for card components (card, alert).                                    |
| --card-foreground              | Foreground color used within card components.                                               |
| --popover                      | Background color for popovers and floating surfaces.                                        |
| --popover-foreground           | Foreground color for content displayed in popovers.                                         |
| --primary                      | Primary brand color. Used for key actions, active states, selections, and focus indicators. |
| --primary-foreground           | Foreground color displayed on primary surfaces.                                             |
| --primary-hover                | Color applied to primary elements on hover.                                                 |
| --primary-active               | Color applied to primary elements when active or selected.                                  |
| --secondary                    | Secondary color used for less prominent actions or elements.                                |
| --secondary-foreground         | Foreground color displayed on secondary surfaces.                                           |
| --secondary-hover              | Color applied to secondary elements on hover.                                               |
| --secondary-active             | Color applied to secondary elements when active or selected.                                |
| --muted                        | Subdued color used for disabled states, placeholders, icons, and low-emphasis UI elements.  |
| --muted-foreground             | Foreground color used on muted surfaces.                                                    |
| --split-handle                 | Default color for split view gutter handle.                                                 |
| --border                       | Default color for borders and dividers.                                                     |
| --input-border                 | Border color for all input components, including text fields, selects, and date pickers.    |
| --input-background             | Background color for input components.                                                      |
| --ring                         | Color used for focus outlines and accessibility indicators.                                 |
| --negative                     | Color representing destructive or error states.                                             |
| --negative-foreground          | Foreground color displayed on negative surfaces.                                            |
| --negative-hover               | Hover state color for negative actions.                                                     |
| --negative-active              | Active or selected state color for negative actions.                                        |
| --positive                     | Color representing success or affirmative states.                                           |
| --positive-foreground          | Foreground color displayed on positive surfaces.                                            |
| --positive-hover               | Hover state color for positive actions.                                                     |
| --positive-active              | Active or selected state color for positive actions.                                        |
| --warning                      | Color representing warning or cautionary states.                                            |
| --warning-foreground           | Foreground color displayed on warning surfaces.                                             |
| --warning-hover                | Hover state color for warning actions.                                                      |
| --warning-active               | Active or selected state color for warning actions.                                         |
| --information                  | Color representing informational or neutral states.                                         |
| --information-foreground       | Foreground color displayed on informational surfaces.                                       |
| --information-hover            | Hover state color for informational elements.                                               |
| --information-active           | Active or selected state color for informational elements.                                  |
| --sidebar                      | Background color for the sidebar component.                                                 |
| --sidebar-foreground           | Default foreground color within the sidebar.                                                |
| --sidebar-primary              | Primary color used for selected or emphasized sidebar items.                                |
| --sidebar-primary-foreground   | Foreground color for primary sidebar elements.                                              |
| --sidebar-secondary            | Secondary color used for sidebar elements.                                                  |
| --sidebar-secondary-foreground | Foreground color for secondary sidebar elements.                                            |
| --sidebar-border               | Border color used within the sidebar.                                                       |
| --sidebar-ring                 | Color used for focus outlines within the sidebar.                                           |
| --object-header                | Background color for object headers, toolbars, and tab bars.                                |
| --object-header-foreground     | Foreground color used within object headers.                                                |
| --table-header                 | Background color for table headers.                                                         |
| --table-header-foreground      | Foreground color for table header content.                                                  |
| --table-hover                  | Background color applied to table cells, rows, or columns on hover.                         |
| --table-hover-foreground       | Foreground color applied to hovered table elements.                                         |
| --table-active                 | Background color applied to active or selected table elements.                              |
| --table-active-foreground      | Foreground color applied to active or selected table elements.                              |
| --chart-color-1                | First chart color. Defaults to the standard blue.                                           |
| --chart-color-2                | Second chart color. Defaults to the standard red.                                           |
| --chart-color-3                | Third chart color. Defaults to the standard green.                                          |
| --chart-color-4                | Fourth chart color. Defaults to the standard orange.                                        |
| --chart-color-5                | Fifth chart color. Defaults to the standard purple.                                         |
| --chart-color-6                | Sixth chart color. Defaults to the standard teal.                                           |
| --chart-color-7                | Seventh chart color. Defaults to the standard pink.                                         |
| --chart-color-8                | Eighth chart color. Defaults to the standard indigo.                                        |
| --chart-color-9                | Ninth chart color. Defaults to the standard yellow.                                         |
| --chart-color-10               | Tenth chart color. Defaults to the standard gray.                                           |
| --chart-color-11               | Eleventh chart color. Defaults to the standard white.                                       |
| --chart-color-12               | Twelfth chart color. Defaults to the standard black.                                        |

Charts paint their series and slices with `--chart-color-1` to `--chart-color-12`, so a theme can give them its own palette:

```css
:root,
:host,
.light {
  --chart-color-1: oklch(0.55 0.2 280);
  --chart-color-2: oklch(0.7 0.17 60);
  --chart-color-3: oklch(0.65 0.15 170);
}

.dark {
  --chart-color-1: oklch(0.7 0.17 280);
  --chart-color-2: oklch(0.78 0.15 60);
  --chart-color-3: oklch(0.75 0.13 170);
}
```

### Fonts

| Property          | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| --font-sans       | Ordered list of sans-serif font families, listed by priority. |
| --font-serif      | Ordered list of serif font families, listed by priority.      |
| --font-mono       | Ordered list of monospace font families, listed by priority.  |
| --tracking-normal | Default letter-spacing value used across the application.     |

### Shadows

| Property        | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| --shadow-xs     | Extra-small shadow for subtle elevation (e.g., 0 1px rgb(0 0 0 / 0.05)). |
| --shadow-sm     | Small shadow for low-elevation surfaces.                                 |
| --shadow-md     | Medium shadow for standard elevated surfaces.                            |
| --shadow-lg     | Large shadow for high-elevation surfaces.                                |
| --shadow-xl     | Extra-large shadow for prominent elevated elements.                      |
| --shadow-button | Shadow applied to button components.                                     |
| --shadow-input  | Shadow applied to input components, such as text fields and selects.     |

### Radius & Spacing

| Property         | Description                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| --radius-control | Border radius applied to all interactive control components, such as buttons, inputs, popovers, calendars, and listboxes. |
| --radius         | Base radius value used to derive small, medium, large, and extra-large border radius variants.                            |
| --spacing        | Base spacing unit used to calculate paddings and margins throughout the interface.                                        |

### Opacity

| Property           | Description                                                               |
| ------------------ | ------------------------------------------------------------------------- |
| --opacity-disabled | Opacity applied to disabled controls and their labels. Defaults to `0.5`. |
