# Animations

Classes for animating elements. In addition to Alpine's [`x-transition`](https://alpinejs.dev/directives/transition), those can be used by custom components when extending Harmonia.

## Class names

| Class     | Description        |
| --------- | ------------------ |
| scale-95  | `scale: 95% 95%`   |
| scale-105 | `scale: 105% 105%` |

| Class        | Description                   |
| ------------ | ----------------------------- |
| duration-100 | `transition-duration: 100ms;` |
| duration-200 | `transition-duration: 200ms;` |
| duration-300 | `transition-duration: 300ms;` |

| Class       | Description                                                                |
| ----------- | -------------------------------------------------------------------------- |
| ease-out    | `transition-timing-function: var(--ease-out, cubic-bezier(0, 0, 0.2, 1));` |
| ease-linear | `transition-timing-function: linear;`                                      |

| Class             | Description                                                   |
| ----------------- | ------------------------------------------------------------- |
| -translate-x-full | `translate: -100% var(--tw-translate-y);`                     |
| translate-x-full  | `translate: 100% var(--tw-translate-y);`                      |
| -translate-y-full | `translate: var(--tw-translate-x) -100%;`                     |
| translate-y-full  | `translate: var(--tw-translate-x) 100%;`                      |
| -translate-x-4    | `translate: calc(var(--spacing) * -4) var(--tw-translate-y);` |
| translate-x-4     | `translate: calc(var(--spacing) * 4) var(--tw-translate-y);`  |
| -translate-y-4    | `translate: var(--tw-translate-x) calc(var(--spacing) * -4);` |
| translate-y-4     | `translate: var(--tw-translate-x) calc(var(--spacing) * 4);`  |

| Class                         | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| transition-all                | `transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to, opacity, box-shadow, transform, translate, scale, rotate, filter, -webkit-backdrop-filter, backdrop-filter, display, content-visibility, overlay, pointer-events;`<br />`transition-timing-function: var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));`<br />`transition-duration: var(--default-transition-duration, 150ms);` |
| transition-colors             | `transition-property: color, background-color, border-color, outline-color, text-decoration-color, fill, stroke, --tw-gradient-from, --tw-gradient-via, --tw-gradient-to;`<br />`transition-timing-function: var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));`<br />`transition-duration: var(--default-transition-duration, 150ms);`                                                                                                                                                                   |
| transition-shadow             | `transition-property: box-shadow;`<br />`transition-timing-function: var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));`<br />`transition-duration: var(--default-transition-duration, 150ms);`                                                                                                                                                                                                                                                                                                           |
| transition-opacity            | `transition-property: opacity;`<br />`transition-timing-function: var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));`<br />`transition-duration: var(--default-transition-duration, 150ms);`                                                                                                                                                                                                                                                                                                              |
| transition-transform          | `transition-property: transform, translate, scale, rotate;`<br />`transition-timing-function: var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));`<br />`transition-duration: var(--default-transition-duration, 150ms);`                                                                                                                                                                                                                                                                                  |
| transition-\[opacity,scale\]  | `transition-property: opacity, scale;`<br />`transition-timing-function: var(--default-transition-timing-function, cubic-bezier(0.4, 0, 0.2, 1));`<br />`transition-duration: var(--default-transition-duration, 150ms);`                                                                                                                                                                                                                                                                                                       |
| motion-reduce:transition-none | Disables all transitions when the "Reduce Motion" accessibility setting is enabled                                                                                                                                                                                                                                                                                                                                                                                                                                              |

## Examples

### Scale and Opacity

::: warning

Users with vestibular motion disorders often enable the "Reduce Motion" accessibility setting on their devices.

Be sure to account for this preference in your implementation, as excessive motion can cause discomfort or disorientation for affected users.

:::

<ClientOnly>
<component-container src="/utility-classes/animations/scale.html" data-class="tile-auto-sm">
</component-container>
</ClientOnly>

```html
<div class="vbox gap-4" x-data="ScaleController">
  <button x-h-button @click="toggle()" x-text="isShown ? 'Hide' : 'Show'"></button>
  <div x-h-alert class="hidden scale-95 opacity-0 transition-[opacity,scale] duration-200 ease-out motion-reduce:transition-none" x-ref="alert">
    <svg x-h-icon.circle-info role="img" aria-label="information"></svg>
    <div x-h-alert-title>Alert</div>
  </div>
</div>
<script>
  Alpine.data('ScaleController', () => ({
    isShown: false,
    toggle() {
      this.isShown = !this.isShown;
      // Use differnet logic when the user has disabled animations/enabled reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (this.isShown) {
          this.$refs.alert.classList.remove('hidden', 'scale-95', 'opacity-0');
        } else {
          this.$refs.alert.classList.add('hidden', 'scale-95', 'opacity-0');
        }
      } else if (this.isShown) {
        this.$refs.alert.classList.remove('hidden');
        Alpine.nextTick(() => {
          // Reading 'offsetHeight' forces the browser to apply pending styles first.
          // This guarantees that the animation will always happen.
          this.$refs.alert.offsetHeight;
          this.$refs.alert.classList.remove('scale-95', 'opacity-0');
        });
      } else {
        this.$refs.alert.addEventListener(
          'transitionend',
          () => {
            this.$refs.alert.classList.add('hidden');
          },
          { once: true }
        );
        this.$refs.alert.classList.add('scale-95', 'opacity-0');
      }
    },
  }));
</script>
```

### Translate

<ClientOnly>
<component-container data-class="vbox items-center gap-4">
  <div class="border">
    <svg x-h-icon class="size-12 -translate-x-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
  </div>
  <div class="border">
    <svg x-h-icon class="size-12 translate-x-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
  </div>
  <div class="border">
    <svg x-h-icon class="size-12 -translate-y-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
  </div>
  <div class="border">
    <svg x-h-icon class="size-12 translate-y-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
  </div>
</component-container>
</ClientOnly>

```html
<div class="border">
  <svg x-h-icon class="size-12 -translate-x-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</div>
<div class="border">
  <svg x-h-icon class="size-12 translate-x-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</div>
<div class="border">
  <svg x-h-icon class="size-12 -translate-y-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</div>
<div class="border">
  <svg x-h-icon class="size-12 translate-y-4" data-link="/harmonia/logo/harmonia.svg" role="img" aria-label="Harmonia logo"></svg>
</div>
```
