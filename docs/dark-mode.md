# Dark Mode

Harmonia supports three color schemes: `light`, `dark`, and `auto`.

By default, the `auto` mode is enabled, which automatically aligns the application’s appearance with the user’s system or browser preferences. When the system color mode changes, from light to dark or vice versa, Harmonia updates the interface in real time, without requiring a page reload.

A color scheme change is also kept in sync across embedded same-origin iframes that use Harmonia, as well as across other browser tabs of the application, so the whole interface stays consistent.

## API Reference

During initialization, Harmonia automatically sets the color scheme and persists the user’s last selected preference.

To retrieve or manually configure the color scheme, use the [Theme](/utilities/theme) utility in the Utilities section.

## Examples

### Light/Dark Select

<LiveExample>

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
  Alpine.data('themeSelect', () => ({
    mode: Harmonia.getColorScheme(),
    themeChange() {
      Harmonia.setColorScheme(this.mode);
    },
  }));
</script>
```

</LiveExample>

### Light/Dark Switch

<LiveExample>

```html
<div class="hbox items-center justify-center" x-data="themeSwitch">
  <div class="flex items-center gap-2 pr-2">
    <div x-h-switch>
      <input type="checkbox" id="modeSw" x-model="darkMode" @change="toggleLightDark()" />
    </div>
    <label x-h-label for="modeSw">Dark Mode</label>
  </div>
</div>
<script type="text/javascript">
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
</script>
```

</LiveExample>

### Sync across frames

Changing the color scheme in one frame is automatically applied to every embedded same-origin iframe (and to other tabs of the application). Pick a scheme below, or use the controls inside either embedded frame, and watch the others follow.

<LiveExample>

```html
<div class="vbox gap-4" x-data="themeSync">
  <div x-h-select>
    <input x-h-select-input placeholder="Select" x-model="mode" @change="themeChange()" />
    <div x-h-select-content>
      <div x-h-select-option="'Auto'" data-value="auto"></div>
      <div x-h-select-option="'Light'" data-value="light"></div>
      <div x-h-select-option="'Dark'" data-value="dark"></div>
    </div>
  </div>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <iframe src="/harmonia/theming/theme-sync-frame.html" class="w-full rounded-md border" style="height: 11rem" title="Embedded frame A"></iframe>
    <iframe src="/harmonia/theming/theme-sync-frame.html" class="w-full rounded-md border" style="height: 11rem" title="Embedded frame B"></iframe>
  </div>
</div>
<script>
  Alpine.data('themeSync', () => ({
    mode: Harmonia.getColorScheme(),
    themeChange() {
      Harmonia.setColorScheme(this.mode);
    },
  }));
</script>
```

</LiveExample>
