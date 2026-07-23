# Carousel

A slideshow that cycles through a set of slides one at a time, with previous/next controls, indicator dots, keyboard navigation, wraparound looping, and optional autoplay.

## Usage

Use a carousel to present a small, ordered set of equally important items in a limited space, such as featured images or promotional highlights. Keep the number of slides low and give each slide meaningful content, since only one is visible at a time. Wrap the slides in `x-h-carousel-content` and mark each with `x-h-carousel-item`. Add `x-h-carousel-control.previous` / `x-h-carousel-control.next` buttons and an empty `x-h-carousel-indicators` container, which fills itself with one dot per slide. Avoid autoplay for essential content, since it can move on before a user has finished reading.

## Keyboard Handling

When the carousel region is focused, it behaves like a set of slides:

- `Left` - Go to the previous slide.
- `Right` - Go to the next slide.
- `Home` - Go to the first slide.
- `End` - Go to the last slide.

The previous/next controls and indicator dots are ordinary buttons and are reachable with `Tab`.

## Accessibility

The carousel exposes `role="region"` with `aria-roledescription="carousel"` and a default accessible name of "Carousel", which you can localize with `data-label` or override with your own `aria-label`. Each slide is a `role="group"` with `aria-roledescription="slide"` and a default "N of M" label, and is marked `aria-hidden` while off screen. The controls get default names ("Previous slide" / "Next slide") and the generated indicator dots ("Slide N", localizable with `data-slide-label`). The active dot carries `aria-current`. Autoplay pauses while the carousel is hovered or focused so users are not rushed. The slide animation is disabled when the user prefers reduced motion.

## API Reference

### Component attribute(s)

```
x-h-carousel
x-h-carousel-content
x-h-carousel-item
x-h-carousel-control
x-h-carousel-indicators
```

### Attributes

#### x-h-carousel

| Attribute     | Type    | Required | Description                                                                                       |
| ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------- |
| data-autoplay | boolean | false    | Auto-advances the slides. Pauses on hover and focus.                                              |
| data-interval | number  | false    | Milliseconds between auto-advances (default: `5000`). Only applies with `data-autoplay`.          |
| data-loop     | boolean | false    | Wraps around at the ends. On by default. Set `data-loop="false"` to stop at the first/last slide. |
| data-start    | number  | false    | Zero-based index of the slide shown first (default: `0`).                                         |
| data-label    | string  | false    | Accessible name for the carousel region (default: `"Carousel"`).                                  |

#### x-h-carousel-indicators

| Attribute        | Type   | Required | Description                                                                  |
| ---------------- | ------ | -------- | ---------------------------------------------------------------------------- |
| data-label       | string | false    | Accessible name for the indicator group (default: `"Choose slide"`).         |
| data-slide-label | string | false    | Prefix for each dot's accessible name (default: `"Slide"`, as in `Slide 1`). |

The `x-h-carousel-control` buttons take a default `aria-label` per direction. Override it with your own `aria-label`.

### Modifiers

#### x-h-carousel-control

| Modifier | Type    | Required | Description                                       |
| -------- | ------- | -------- | ------------------------------------------------- |
| previous | boolean | false    | Makes the control go to the previous slide.       |
| next     | boolean | false    | Makes the control go to the next slide (default). |

### Events

| Event  | Description                                                                               |
| ------ | ----------------------------------------------------------------------------------------- |
| change | Fired when the active slide changes. The new zero-based index is in `event.detail.value`. |

## Examples

### Basic

<LiveExample>

```html
<div id="carousel-basic" x-h-carousel class="rounded-lg">
  <div x-h-carousel-content>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-mountains.jpg" alt="Mountains" class="size-full object-cover" />
    </div>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-fences.jpg" alt="Fences" class="size-full object-cover" />
    </div>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-foxtail-grass.jpg" alt="Foxtail grass" class="size-full object-cover" />
    </div>
  </div>
  <button x-h-carousel-control.previous></button>
  <button x-h-carousel-control.next></button>
  <div x-h-carousel-indicators></div>
</div>
```

</LiveExample>

<!-- skill:ignore -->

::: info
Photos by ignartonosbg via Pixabay.
:::

<!-- /skill:ignore -->

### Autoplay

<LiveExample  data-exclude="generator">

```html
<div id="carousel-autoplay" x-h-carousel data-autoplay data-interval="3000" class="rounded-lg">
  <div x-h-carousel-content>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-orange-juice.jpg" alt="Orange juice" class="size-full object-cover" />
    </div>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-mountain.jpg" alt="Mountain" class="size-full object-cover" />
    </div>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-mountains.jpg" alt="Mountains" class="size-full object-cover" />
    </div>
  </div>
  <button x-h-carousel-control.previous></button>
  <button x-h-carousel-control.next></button>
  <div x-h-carousel-indicators></div>
</div>
```

</LiveExample>

### Without looping

With `data-loop="false"` the carousel stops at the first and last slide, and the controls disable themselves at the ends.

<LiveExample  data-exclude="generator">

```html
<div id="carousel-no-loop" x-h-carousel data-loop="false" class="rounded-lg">
  <div x-h-carousel-content>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-fences.jpg" alt="Fences" class="size-full object-cover" />
    </div>
    <div x-h-carousel-item>
      <img src="/harmonia/photos/ignartonosbg-foxtail-grass.jpg" alt="Foxtail grass" class="size-full object-cover" />
    </div>
  </div>
  <button x-h-carousel-control.previous></button>
  <button x-h-carousel-control.next></button>
  <div x-h-carousel-indicators></div>
</div>
```

</LiveExample>

### Text slides

The slides can hold any content, not just images.

<LiveExample data-exclude="generator">

```html
<div id="carousel-text" x-h-carousel class="rounded-lg border">
  <div x-h-carousel-content>
    <div x-h-carousel-item class="flex items-center justify-center bg-secondary p-10 text-center" style="height: 12rem">
      <span class="text-lg font-medium">First slide</span>
    </div>
    <div x-h-carousel-item class="flex items-center justify-center bg-secondary p-10 text-center" style="height: 12rem">
      <span class="text-lg font-medium">Second slide</span>
    </div>
    <div x-h-carousel-item class="flex items-center justify-center bg-secondary p-10 text-center" style="height: 12rem">
      <span class="text-lg font-medium">Third slide</span>
    </div>
  </div>
  <button x-h-carousel-control.previous></button>
  <button x-h-carousel-control.next></button>
  <div x-h-carousel-indicators></div>
</div>
```

</LiveExample>
