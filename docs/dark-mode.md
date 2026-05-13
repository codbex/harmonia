# Dark Mode

Harmonia supports three color schemes: `light`, `dark`, and `auto`.

By default, the `auto` mode is enabled, which automatically aligns the application’s appearance with the user’s system or browser preferences. When the system color mode changes, from light to dark or vice versa, Harmonia updates the interface in real time, without requiring a page reload.

## API Reference

During initialization, Harmonia automatically sets the color scheme and persists the user’s last selected preference.

To retrieve or manually configure the color scheme, use the [Theme](/utilities/theme) utility in the Utilities section.

## Examples

### Light/Dark Select

<br />

<ClientOnly>
<component-container src="/theming/select.html">
</component-container>
</ClientOnly>

```html
<div class="hbox items-center justify-center" x-data="themeSelect">
  <div x-h-select>
    <input x-h-select-input placeholder="Select" x-model="mode" @change="themeChange()" />
    <div x-h-select-content>
      <div x-h-select-option="'Auto'" data-value="auto"></div>
      <div x-h-select-option="'Light'" data-value="light"></div>
      <div x-h-select-option="'Dark'" data-value="dark"></div>
    </div>
  </div>
</div>
<script>
  document.addEventListener('alpine:init', () => {
    Alpine.data('themeSelect', () => ({
      mode: Harmonia.getColorScheme(),
      themeChange() {
        Harmonia.setColorScheme(this.mode);
      },
    }));
  });
</script>
```

### Light/Dark Switch

<br />

<ClientOnly>
<component-container src="/theming/switch.html">
</component-container>
</ClientOnly>

```html
<div class="hbox items-center justify-center" x-data="themeSwitch">
  <div class="flex items-center gap-2 pr-2">
    <div x-h-switch>
      <input type="checkbox" id="modeSw" x-model="darkMode" @change="toggleLightDark()" />
    </div>
    <label x-h-label for="modeSw">Dark Mode</label>
  </div>
</div>
<script>
  document.addEventListener('alpine:init', () => {
    function isDarkMode() {
      const colorScheme = Harmonia.getColorScheme();
      if (colorScheme === 'dark') {
        return true;
      } else if (colorScheme === 'light') {
        return false;
      } else {
        return Harmonia.getSystemColorScheme() === 'dark';
      }
    }
    Alpine.data('themeSwitch', () => ({
      darkMode: isDarkMode(),
      toggleLightDark() {
        Harmonia.setColorScheme(this.darkMode ? 'dark' : 'light');
      },
    }));
  });
</script>
```
