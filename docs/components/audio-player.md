# Audio Player

An accessible player for a single audio source with a play/pause button, a seek slider and an elapsed/total time readout. It wraps a native `<audio>` element, which stays in the page as the playback engine, and comes in three visual variants.

## Usage

Use the audio player when you need to offer audio playback (music, voice notes, podcast episodes, sound previews, etc). Wrap an `<audio>` element in `x-h-audio-player` and give it a `src`, or add `<source>` children so the browser can pick a format it supports. For a recording inside a chat message use the [Bubble](/components/bubble) audio attachment instead, which renders the same controls in the message's colors.

## Behavior

The native controls are hidden and the `<audio>` element keeps driving playback, so its properties and events (`currentTime`, `volume`, `@play`, `@ended` and the rest) work as usual and can be bound from Alpine. Unless you set `preload` yourself it defaults to `metadata`, so the total duration shows before playback starts. When the track ends the player returns to the start.

## Keyboard Handling

The seek slider is focusable and supports:

- `Right` / `Up` - Seek forward by five seconds.
- `Left` / `Down` - Seek back by five seconds.
- `Home` - Jump to the start.
- `End` - Jump to the end.

The play/pause control is a regular button, so `Space` and `Enter` toggle playback.

## Accessibility

The player is a `role="group"` named "Audio player" by default, which you can override with your own `aria-label` or `aria-labelledby`. The play/pause button's accessible name follows the playback state and is localizable with `data-play-label` and `data-pause-label`. The seek slider exposes `role="slider"` with `aria-valuemin` / `aria-valuemax` / `aria-valuenow`, is named with `data-seek-label`, and announces its position as time (for example "0:25 of 1:40") through an `aria-valuetext` built from `data-valuetext-label`. Pointer dragging, track clicks and full keyboard operation are all supported.

## API Reference

### Component attribute(s)

```
x-h-audio-player
```

### Attributes

#### x-h-audio-player

Apply to an element that contains an `<audio>` element with a `src` (or `<source>` children).

| Attribute            | Type                                          | Required | Description                                                                                                                                  |
| -------------------- | --------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| data-variant         | `secondary`<br />`outline`<br />`transparent` | false    | Visual style. Defaults to `secondary`.                                                                                                       |
| data-play-label      | string                                        | false    | Accessible name for the play button. Defaults to `Play`.                                                                                     |
| data-pause-label     | string                                        | false    | Accessible name for the button while playing. Defaults to `Pause`.                                                                           |
| data-seek-label      | string                                        | false    | Accessible name for the seek slider. Defaults to `Seek`.                                                                                     |
| data-valuetext-label | string                                        | false    | Template for the position announced on the seek slider. `{current}` and `{duration}` are substituted. Defaults to `{current} of {duration}`. |

### Data Slots

| Slot                  | Element                                         |
| --------------------- | ----------------------------------------------- |
| `audio-player`        | `x-h-audio-player`                              |
| `audio-player-native` | The `<audio>` element inside `x-h-audio-player` |
| `audio-player-play`   | Play/pause button created by `x-h-audio-player` |
| `audio-player-seek`   | Seek slider created by `x-h-audio-player`       |
| `audio-player-time`   | Time readout created by `x-h-audio-player`      |

## Examples

### Basic

<LiveExample>

```html
<div x-h-audio-player>
  <audio src="/harmonia/audio/chime.wav"></audio>
</div>
```

</LiveExample>

### Variants

<LiveExample>

```html
<div class="vbox w-full gap-4">
  <div x-h-audio-player data-variant="secondary">
    <audio src="/harmonia/audio/chime.wav"></audio>
  </div>
  <div x-h-audio-player data-variant="outline">
    <audio src="/harmonia/audio/chime.wav"></audio>
  </div>
  <div x-h-audio-player data-variant="transparent">
    <audio src="/harmonia/audio/chime.wav"></audio>
  </div>
</div>
```

</LiveExample>

### Source elements

Leave out `src` and list `<source>` children instead, from the preferred format down, so the browser plays the first one it supports.

<LiveExample>

```html
<div x-h-audio-player>
  <audio>
    <source src="/harmonia/audio/chime.wav" type="audio/wav" />
  </audio>
</div>
```

</LiveExample>

### Localized labels

<LiveExample>

```html
<div x-h-audio-player aria-label="Audioplayer" data-play-label="Abspielen" data-pause-label="Pausieren" data-seek-label="Position" data-valuetext-label="{current} von {duration}">
  <audio src="/harmonia/audio/chime.wav"></audio>
</div>
```

</LiveExample>

### Custom accessible name

<LiveExample>

```html
<div class="vbox w-full gap-2">
  <p id="audio-player-title" class="text-sm font-medium">Episode 12 - Getting started</p>
  <div x-h-audio-player aria-labelledby="audio-player-title">
    <audio src="/harmonia/audio/chime.wav"></audio>
  </div>
</div>
```

</LiveExample>
