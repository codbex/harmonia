# Bubble

A chat message bubble with left and right alignment, semantic color variants, and optional previews for image, audio, file and link attachments. The bubble is only the message surface. Avatars, sender rows and message lists are composed around it with the layout utilities and other components.

## Usage

Every part of the bubble is optional. Place any combination of `x-h-bubble-header`, `x-h-bubble-content`, `x-h-bubble-footer`, attachment previews and `x-h-bubble-reactions` inside an `x-h-bubble` element. Use `data-align="right"` for sent messages and the default left alignment for received ones. A `<time>` element inside the header is automatically de-emphasized.

## Accessibility

The bubble itself is a plain container and gets no role. Give the surrounding message list `role="log"` with `aria-live="polite"` so new messages are announced, and use `<time datetime="...">` for timestamps. The reactions element defaults to `role="group"` with an accessible name of "Reactions", which you can localize with `data-label` or override with your own `aria-label`. Images must carry an `alt` attribute. Audio attachments render a custom player: the play/pause button and the seek slider (`role="slider"`, operable with the arrow, Home and End keys) get accessible names you can localize with `data-play-label`, `data-pause-label` and `data-label`.

## API Reference

### Component attribute(s)

```
x-h-bubble
x-h-bubble-header
x-h-bubble-content
x-h-bubble-footer
x-h-bubble-image
x-h-bubble-gallery
x-h-bubble-gallery-more
x-h-bubble-audio
x-h-bubble-file
x-h-bubble-link
x-h-bubble-reactions
```

### Attributes

#### x-h-bubble

| Attribute    | Type                                                                                        | Required | Description                                                             |
| ------------ | ------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| data-align   | `left`<br />`right`                                                                         | false    | Message side. Defaults to `left` (received). Use `right` for sent ones. |
| data-variant | `primary`<br />`secondary`<br />`warning`<br />`negative`<br />`outline`<br />`transparent` | false    | Semantic color style. Defaults to `secondary`.                          |

#### x-h-bubble-audio

Apply to an `<audio>` element with a `src` (or a `<source>` child). It renders a custom player (play/pause button, seek slider and time readout) and hides the native controls.

| Attribute        | Type   | Required | Description                                                        |
| ---------------- | ------ | -------- | ------------------------------------------------------------------ |
| data-play-label  | string | false    | Accessible name for the play button. Defaults to `Play`.           |
| data-pause-label | string | false    | Accessible name for the button while playing. Defaults to `Pause`. |
| data-label       | string | false    | Accessible name for the seek slider. Defaults to `Seek`.           |

#### x-h-bubble-reactions

| Attribute  | Type   | Required | Description                                                       |
| ---------- | ------ | -------- | ----------------------------------------------------------------- |
| data-label | string | false    | Accessible name for the reactions group. Defaults to `Reactions`. |

## Examples

### Basic conversation

<LiveExample>

```html
<div class="vbox w-full gap-2">
  <div x-h-bubble>
    <div x-h-bubble-header>John Doe <time datetime="11:46">11:46</time></div>
    <div x-h-bubble-content>That's awesome. I think our users will really appreciate the improvements.</div>
    <div x-h-bubble-footer>
      <svg x-h-icon data-icon="check" role="presentation"></svg>
      Delivered
    </div>
  </div>
  <div x-h-bubble data-align="right" data-variant="primary">
    <div x-h-bubble-header>You <time datetime="11:47">11:47</time></div>
    <div x-h-bubble-content>Thanks! The new version ships next week.</div>
  </div>
</div>
```

</LiveExample>

### Variants

<LiveExample>

```html
<div class="vbox w-full gap-2">
  <div x-h-bubble data-variant="primary">
    <div x-h-bubble-content>Primary</div>
  </div>
  <div x-h-bubble>
    <div x-h-bubble-content>Secondary (default)</div>
  </div>
  <div x-h-bubble data-variant="warning">
    <div x-h-bubble-content>Warning</div>
  </div>
  <div x-h-bubble data-variant="negative">
    <div x-h-bubble-content>Negative</div>
  </div>
  <div x-h-bubble data-variant="outline">
    <div x-h-bubble-content>Outline</div>
  </div>
  <div x-h-bubble data-variant="transparent">
    <div x-h-bubble-content>Transparent</div>
  </div>
</div>
```

</LiveExample>

### With avatar

<LiveExample data-exclude="generator">

```html
<div class="hbox w-full items-end gap-2">
  <span x-h-avatar>
    <img x-h-avatar-image src="/harmonia/logo/harmonia-square.svg" alt="@harmonia" />
  </span>
  <div x-h-bubble>
    <div x-h-bubble-header>Harmonia <time datetime="11:46">11:46</time></div>
    <div x-h-bubble-content>Welcome to the chat!</div>
  </div>
</div>
```

</LiveExample>

### Image attachment

<LiveExample data-exclude="generator">

```html
<div x-h-bubble>
  <div x-h-bubble-header>John Doe <time datetime="11:46">11:46</time></div>
  <img x-h-bubble-image class="w-3xs" src="/harmonia/photos/ignartonosbg-mountain.jpg" alt="Sheet component preview" />
  <div x-h-bubble-footer>Delivered</div>
</div>
```

</LiveExample>

<!-- skill:ignore -->

::: info
Photos by ignartonosbg via Pixabay.
:::

<!-- /skill:ignore -->

### Image gallery

<LiveExample data-exclude="generator">

```html
<div x-h-bubble>
  <div x-h-bubble-header>John Doe <time datetime="11:46">11:46</time></div>
  <div x-h-bubble-gallery class="w-3xs">
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-fences.jpg" alt="Photo preview" />
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-foxtail-grass.jpg" alt="Photo preview" />
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-mountains.jpg" alt="Photo preview" />
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-orange-juice.jpg" alt="Photo preview" />
  </div>
</div>
```

</LiveExample data-exclude="generator">

### Gallery with more indicator

When a message carries more photos than the four shown, wrap the fourth tile in `x-h-bubble-gallery-more` and overlay a `<button>` with a label. The label text is yours to author, so it can be localized (for example `+3` or `3 more`). Give the button a descriptive `aria-label`, since the terse label alone does not convey the action.

<LiveExample>

```html
<div x-h-bubble>
  <div x-h-bubble-header>John Doe <time datetime="11:46">11:46</time></div>
  <div x-h-bubble-gallery class="w-3xs">
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-fences.jpg" alt="Photo preview" />
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-foxtail-grass.jpg" alt="Photo preview" />
    <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-mountains.jpg" alt="Photo preview" />
    <div x-h-bubble-gallery-more>
      <img x-h-bubble-image src="/harmonia/photos/ignartonosbg-orange-juice.jpg" alt="Photo preview" />
      <button aria-label="Show 3 more photos">+3</button>
    </div>
  </div>
</div>
```

</LiveExample>

### Audio attachment

<LiveExample>

```html
<div x-h-bubble>
  <div x-h-bubble-header>John Doe <time datetime="11:48">11:48</time></div>
  <audio x-h-bubble-audio src="/harmonia/audio/chime.wav"></audio>
</div>
```

</LiveExample>

### File attachment

<LiveExample>

```html
<div x-h-bubble>
  <div x-h-bubble-file>
    <svg x-h-icon data-icon="file" role="presentation"></svg>
    <div class="vbox min-w-0">
      <span class="truncate font-medium">Quarterly-report.pdf</span>
      <span class="text-xs opacity-75">PDF, 2.4 MB</span>
    </div>
    <button x-h-button data-size="icon-sm" data-variant="transparent" aria-label="Download">
      <svg x-h-icon data-icon="export" role="presentation"></svg>
    </button>
  </div>
  <div x-h-bubble-footer>Delivered</div>
</div>
```

</LiveExample>

### Link preview

<LiveExample>

```html
<div x-h-bubble>
  <div x-h-bubble-content>Check out the project page</div>
  <a x-h-bubble-link class="w-3xs" href="https://github.com/codbex/codbex-harmonia" target="_blank">
    <img src="/harmonia/preview.png" alt="Harmonia project preview" />
    <div class="vbox gap-1 p-2">
      <span class="font-medium">Harmonia</span>
      <span class="hbox items-center gap-1 text-xs opacity-75">
        <svg x-h-icon class="size-3" data-icon="link" role="presentation"></svg>
        codbex.com/harmonia/
      </span>
    </div>
  </a>
</div>
```

</LiveExample>

### Reactions

<LiveExample>

```html
<div class="vbox w-full gap-2">
  <div x-h-bubble>
    <div x-h-bubble-content>We just shipped version 2.4!</div>
    <div x-h-bubble-reactions>
      <button>🎉 3</button>
      <button>👍 1</button>
    </div>
  </div>
  <div x-h-bubble data-align="right" data-variant="primary">
    <div x-h-bubble-content>Congratulations team!</div>
    <div x-h-bubble-reactions data-label="Reactions to your message">
      <button>❤️ 2</button>
    </div>
  </div>
</div>
```

</LiveExample>
