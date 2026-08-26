# Slot Picker

An inline calendar that shows a configurable number of consecutive days (1 to 7, three by default), each with a vertical stack of selectable time slots. Slots can carry a description, a note, a status color, and stacked sub-slot tiles. Designed for touch-friendly interaction, it keeps every day column visible by default and offers a `responsive` modifier that collapses the columns into a single stacked column on narrow screens.

## Usage

Use the Slot Picker when users need to book or choose one or more time slots from an upcoming schedule, for example booking appointments, selecting meeting windows, or configuring availability. Give a slot a `description` and `note` to explain what it is, a `color` to signal its status (mirroring the Calendar's event colors), or an array of `tiles` to offer several sub-slots at the same time.

Set `days` to control how many day columns are shown (1 to 7). The picker renders only the day grid, so you build the toolbar yourself from the control directives (every example below includes one). The previous/next controls move by that number of days, and the calendar control jumps straight to any date. The chosen date becomes the first of the visible days, which avoids paging far ahead one step at a time. Set `showNowIndicator: true` to mark the current time in today's column with a red line that moves as time passes. By default every day column stays visible at every width, so a narrow container simply shows narrower columns. Add the `responsive` modifier (`x-h-slot-picker.responsive`) to make the columns stack into a single column on narrow screens instead.

## Behavior

Set `draggable: true` in the configuration to let users reorder slots within a day and move them to another visible day by dragging them. Dragging requires explicit `slots` (there must be an array to reorder), so generated slots (shorthand mode and `fillEmptyDays` fillers) never drag:

- While a slot is dragged, a half-transparent copy of it follows the pointer, and the slot itself (dimmed) moves through the day lists live. The surrounding slots part around it by exactly its own space, always showing where the drop will land.
- A pointer just past the grid's edge still targets the nearest day. Disabled and out-of-range days are never drop targets, and releasing the slot over one snaps it back. Days whose slots are generated still accept drops, but note that applying such a drop makes the target day explicit, replacing its generated schedule.
- A slot with tiles drags as a whole. A press on a tile stays a tile interaction (click to select), so tiles cannot be dragged individually.
- Dropping never changes the picker's data directly. The slot snaps back and a `slot-drop` event is dispatched with the proposed change, including a ready-to-use `slots` array. Assign `$event.detail.slots` to your `slots` config to accept the move, or ignore the event to reject it.
- Individual slots can opt out with `draggable: false`, and unavailable slots never drag.
- Dragging is a mouse or pen interaction, and a plain click still selects the slot (or fires `slot-click`).

## Accessibility

The picker is a labeled `group` (default name "Time slot picker", overridable with an `aria-label` attribute). Each day is its own `group` labeled by its header, so the day is announced for the slots inside it. When selection is enabled (an `x-model` is bound), available slots are toggle buttons with a day + time `aria-label` and `aria-pressed` reflecting selection. Without an `x-model` they are plain action buttons with the same label and no `aria-pressed`. Unavailable slots are marked `aria-disabled` with a hidden "Not available" note. Selecting a slot updates the cell in place rather than re-rendering, so keyboard focus stays on the chosen slot. The `x-h-slot-picker-calendar` control opens a `dialog` containing a fully keyboard-navigable date grid, and the dialog takes its accessible name from that control. The default month and year navigation buttons labels can be overridden using the `data-aria-*` attributes. Picking a date moves the visible range and returns focus to the control, and `Esc` closes it. Because you supply the toolbar, give each control button an accessible name (an `aria-label` on an icon-only button, or visible text). Drag-and-drop moving is a pointer-only convenience, and every slot stays reachable through its button and `slot-click`.

## API Reference

### Component attribute(s)

```
x-h-slot-picker
x-h-slot-picker-previous
x-h-slot-picker-next
x-h-slot-picker-today
x-h-slot-picker-title
x-h-slot-picker-calendar
```

The picker renders only the day grid. You compose the toolbar yourself from the control directives (every example below shows one). Put each on an ordinary [Button](/components/button) inside an [`x-h-toolbar`](/components/toolbar), where the button supplies the icon, label, and styling and the directive supplies the behavior. `x-h-slot-picker-previous` and `-next` page the window and disable themselves at the `minDate` / `maxDate` bounds, `-today` returns to the current day, `-title` renders the current period, and `-calendar` opens the built-in date-jump dialog. Each control must be a descendant of `x-h-slot-picker`.

### Attributes

The control directives take no attributes of their own. These apply to `x-h-slot-picker`:

| Attribute              | Values | Required | Description                                                        |
| ---------------------- | ------ | -------- | ------------------------------------------------------------------ |
| data-unavailable-label | string | false    | Overrides the "Not available" label shown for fully disabled days. |
| data-aria-prev-year    | string | false    | Overrides the previous year button's `aria-label`.                 |
| data-aria-prev-month   | string | false    | Overrides the previous month button's `aria-label`.                |
| data-aria-next-month   | string | false    | Overrides the next month button's `aria-label`.                    |
| data-aria-next-year    | string | false    | Overrides the next year button's `aria-label`.                     |

### Modifiers

#### x-h-slot-picker

| Modifier   | Description                                                                                                                                 |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| responsive | Collapse the day columns into a single stacked column on narrow screens (below the `md` breakpoint). Without it the columns never collapse. |

#### x-h-slot-picker-title

| Modifier  | Description                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------ |
| text-only | Render the period text with no built-in styling, so you can style the title (or its wrapper) yourself. |

### Configuration

Pass a configuration object as an Alpine expression.

```html
<div x-h-slot-picker="myConfig"></div>
```

| Key              | Default     | Description                                                                                                                                                                                                               |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| date             | today       | The starting date of the visible window. Accepts a `YYYY-MM-DD` string or a `Date` object.                                                                                                                                |
| days             | `3`         | Number of day columns to show. Clamped to the range 1 to 7.                                                                                                                                                               |
| start            | `'08:00'`   | The first time slot of the day as `HH:MM`. Used in shorthand mode (when `slots` is not provided).                                                                                                                         |
| end              | `'18:00'`   | The exclusive end time as `HH:MM`. Used in shorthand mode.                                                                                                                                                                |
| step             | `60`        | Duration of each slot in minutes. Used in shorthand mode.                                                                                                                                                                 |
| slots            | -           | Explicit array of slot objects (see below). When provided, it overrides `start`, `end`, and `step` on a per-day basis.                                                                                                    |
| fillEmptyDays    | `false`     | When `true`, days that have no entry in `slots` fall back to the generated `start`/`end`/`step` schedule instead of showing nothing. Use it to mix explicit per-day slots with a default schedule for the remaining days. |
| multiple         | `false`     | When `true`, multiple slots can be selected simultaneously.                                                                                                                                                               |
| locale           | user locale | BCP 47 language tag for day names and the date display (e.g. `'en-US'`, `'de-DE'`). When not provided, it is taken from the page's `<html lang>` attribute, then the browser locale.                                      |
| disabledDates    | `[]`        | Array of `'YYYY-MM-DD'` strings and/or `{ from, to }` range objects. Matching days show "Not available" instead of slots.                                                                                                 |
| disabledDays     | `[]`        | Array of weekday numbers to always disable (0 = Sunday, 6 = Saturday).                                                                                                                                                    |
| minDate          | -           | Start day. When set, the user cannot page to any day before it. Accepts a `YYYY-MM-DD` string or a `Date`. Independent of `maxDate`.                                                                                      |
| maxDate          | -           | End day. When set, the user cannot page to any day after it. Accepts a `YYYY-MM-DD` string or a `Date`. Independent of `minDate`.                                                                                         |
| showNowIndicator | `false`     | When `true`, a current-time indicator is shown in today's column and moves on its own as time passes.                                                                                                                     |
| draggable        | `false`     | Enable reordering slots within a day and moving them to another day by drag and drop. Requires explicit `slots`. See [Behavior](#behavior).                                                                               |

#### Slot object (explicit mode)

| Key         | Type              | Description                                                                                                                                                                                        |
| ----------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| date        | string            | The date of the slot in `YYYY-MM-DD` format.                                                                                                                                                       |
| start       | string            | Start time in `HH:MM` format.                                                                                                                                                                      |
| end         | string            | End time in `HH:MM` format.                                                                                                                                                                        |
| available   | boolean           | When `false`, the slot is shown as unavailable and unclickable. A colored unavailable slot keeps its color (useful for showing a booked slot).                                                     |
| description | string            | A short line rendered under the time.                                                                                                                                                              |
| note        | string            | A secondary line rendered under the description.                                                                                                                                                   |
| color       | string            | Status color: one of `blue`, `red`, `green`, `yellow`, `purple`, `pink`, `indigo`, `orange`, `gray`, `teal`. An unknown value leaves the slot uncolored.                                           |
| status      | string            | For a colored slot, `confirmed` (default) renders it filled, `unconfirmed` renders it as an outline, and `rejected` renders it as an outline with a dashed border. Ignored when no `color` is set. |
| icons       | `{ left, right }` | Badge images rendered in the cell's top corners. `left` and `right` are optional arrays of `{ url, alt }` objects, where `url` is the image path and `alt` is the alt text (defaults to `''`).     |
| tiles       | Tile[]            | Sub-slots (see below). When present and non-empty, the slot renders as a labeled group and only its tiles are selectable. The slot's own `start` labels the group.                                 |
| draggable   | boolean           | Set to `false` to exclude the slot from drag and drop when the picker has `draggable: true`.                                                                                                       |

#### Tile object (sub-slots)

A tile is an individually selectable sub-slot inside a slot's `tiles` array. It inherits the slot's time unless it sets its own `start`/`end`.

| Key         | Type              | Description                                                                                                                                                        |
| ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| description | string            | The tile's primary label.                                                                                                                                          |
| note        | string            | A secondary line under the description.                                                                                                                            |
| color       | string            | Status color, same values as a slot's `color`.                                                                                                                     |
| status      | string            | For a colored tile, `confirmed` (default) renders it filled, `unconfirmed` renders it as an outline, and `rejected` renders it as an outline with a dashed border. |
| available   | boolean           | When `false`, the tile is shown as unavailable and unclickable.                                                                                                    |
| start       | string            | Optional own start time in `HH:MM`. When set, it is shown on the tile, otherwise the group time applies.                                                           |
| end         | string            | Optional own end time in `HH:MM`.                                                                                                                                  |
| icons       | `{ left, right }` | Badge images in the tile's top corners, as on a slot.                                                                                                              |

### Model

Binding an `x-model` is what makes slots selectable. With a model bound, clicking a slot toggles its selection and updates the value. Without one, slots are still clickable and emit `slot-click`, but they cannot be selected and carry no selected state.

When used with `x-model`, the bound value follows the selection mode:

- **Single mode** (`multiple: false`): a `'YYYY-MM-DDTHH:MM'` string (e.g. `'2026-06-22T09:00'`), or `null` when nothing is selected.
- **Multiple mode** (`multiple: true`): an array of `'YYYY-MM-DDTHH:MM'` strings, or an empty array.

A selected sub-slot tile uses a composite key of the form `'YYYY-MM-DDTHH:MM#index'` (e.g. `'2026-06-22T09:00#1'`), where the index is the tile's position in its slot's `tiles` array.

### Events

| Event      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| slot-click | Dispatched on every slot click, including deselection and when no `x-model` is bound (in which case `selected` is always `false`). `event.detail.slot` contains `date`, `start`, `end`, `available`, `selected` (the new state after the click), `description`, `note`, `color`, `status`, `key`, and `tileIndex` (a number for a tile, `null` for a plain slot).                                                                                                                                                                 |
| slot-drop  | Dispatched when a dragged slot is dropped at a new position (requires the `draggable` option, dropping at the unchanged position dispatches nothing). `event.detail.slot` carries the same fields as `slot-click`'s detail without `selected`. `event.detail.date` is the target day as `YYYY-MM-DD` and `event.detail.index` the slot's new position within that day's slot list. `event.detail.slots` is a new array with the move applied, built without mutating yours - assign it to your `slots` config to accept the move. |

## Examples

### Basic (single select) with scroll

This example enables the current-time indicator, so a red line marks the current time in today's column.
It also sets the height of the slot picker, in order to show how the overflow is handled.

<LiveExample data-class="p-0 overflow-visible">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = { date: today, start: '08:00', end: '17:00', step: 15, showNowIndicator: true };
    }
  }"
  x-model="selected"
  class="rounded-md"
  style="height: 28rem"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
</div>
```

</LiveExample>

### Multi-select with 30-minute slots

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: [],
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = { date: today, start: '08:00', end: '12:00', step: 30, multiple: true };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Explicit slots with availability and icon badges

<LiveExample data-class="p-0 overflow-visible">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      this.config = {
        date: dateIn(0),
        multiple: true,
        slots: [
          { date: dateIn(0), start: '09:00', end: '09:30', available: true },
          { date: dateIn(0), start: '09:30', end: '10:00', available: false },
          { date: dateIn(0), start: '10:00', end: '10:30', available: true, icons: { right: [{ url: '/harmonia/logo/harmonia-circle.svg', alt: 'Harmonia' }] } },
          { date: dateIn(0), start: '10:30', end: '11:00', available: true },
          { date: dateIn(1), start: '09:00', end: '09:30', available: true },
          { date: dateIn(1), start: '09:30', end: '10:00', available: true, icons: { left: [{ url: '/harmonia/logo/harmonia-circle.svg', alt: 'Harmonia' }] } },
          { date: dateIn(1), start: '10:00', end: '10:30', available: false },
          { date: dateIn(1), start: '10:30', end: '11:00', available: true },
          { date: dateIn(2), start: '09:00', end: '09:30', available: false },
          { date: dateIn(2), start: '09:30', end: '10:00', available: true },
          { date: dateIn(2), start: '10:00', end: '10:30', available: true },
          { date: dateIn(2), start: '10:30', end: '11:00', available: false },
        ],
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
</div>
```

</LiveExample>

### Default schedule with per-day overrides

Provide `start`, `end`, and `step` for the default daily schedule, list `slots` only for the days you want to customize, and set `fillEmptyDays: true` so every other day still shows the default slots. A day that appears in `slots` shows only its explicit slots (it is not merged with the default schedule).

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      this.config = {
        date: dateIn(0),
        start: '09:00',
        end: '17:00',
        step: 60,
        fillEmptyDays: true,
        slots: [
          { date: dateIn(0), start: '10:00', end: '10:30', available: true },
          { date: dateIn(0), start: '10:30', end: '11:00', available: true },
          { date: dateIn(0), start: '11:00', end: '11:30', available: false },
        ],
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Disabled weekdays and date ranges

Use `disabledDays` to block recurring days (e.g. weekends) and `disabledDates` for specific dates or ranges.

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      this.config = {
        date: dateIn(0),
        start: '09:00',
        end: '17:00',
        step: 60,
        disabledDays: [0, 6],
        disabledDates: [
          dateIn(5),
          { from: dateIn(5), to: dateIn(10) },
        ],
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Start and end day bounds

Set `minDate` to a start day and/or `maxDate` to an end day to stop the user paging outside a window. The two options are independent, so you can set just one. The previous/next buttons disable at the edges, and jumping via the calendar is clamped so the visible range always stays within the bounds.

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      this.config = {
        date: dateIn(0),
        start: '09:00',
        end: '17:00',
        step: 60,
        minDate: dateIn(0),
        maxDate: dateIn(10),
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Colored slots

Give a slot a `color` to signal its status, using the same palette as the Calendar's events. Colored slots are filled by default. Set `status: 'unconfirmed'` to render one as an outline, or `status: 'rejected'` for a dashed outline.

<LiveExample data-class="p-0 overflow-visible">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = {
        date: today,
        multiple: true,
        slots: [
          { date: today, start: '09:00', end: '09:30', available: true, color: 'green' },
          { date: today, start: '09:30', end: '10:00', available: true, color: 'blue', status: 'unconfirmed' },
          { date: today, start: '10:00', end: '10:30', available: false, color: 'red' },
          { date: today, start: '10:30', end: '11:00', available: true, color: 'purple' },
          { date: today, start: '11:00', end: '11:30', available: true, color: 'red', status: 'rejected' },
        ],
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Descriptions and notes

Add a `description` and a `note` to explain what a slot is. Both render under the time.

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = {
        date: today,
        slots: [
          { date: today, start: '09:00', end: '09:45', available: true, description: 'Consultation', note: 'Bring your documents' },
          { date: today, start: '10:00', end: '10:45', available: true, description: 'Follow-up', note: 'Room 2', color: 'teal' },
          { date: today, start: '11:00', end: '11:45', available: true, description: 'Screening' },
        ],
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Week view

Set `days` to show up to seven day columns at once. The previous/next buttons then move by that many days. This example shows a full week by default and drops to three days below 640px, driven by the `getBreakpointListener` utility, so `days` follows the viewport width.

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div x-h-slot-picker="config" x-data="WeekViewController" x-model="selected" class="rounded-md">
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
</div>

<script type="text/javascript">
  Alpine.data('WeekViewController', () => ({
    config: {},
    selected: null,
    init() {
      const today = new Date().toISOString().slice(0, 10);
      // Show a full week by default, and drop to three days on narrow screens.
      // getBreakpointListener fires immediately with the current state and again
      // on every crossing of the 640px width, so days follows the viewport.
      Harmonia.getBreakpointListener((matches) => {
        this.config = { date: today, days: matches ? 3 : 7, start: '09:00', end: '13:00', step: 60 };
      }, 640);
    },
  }));
</script>
```

</LiveExample>

### Sub-slots (tiles)

Give a slot an array of `tiles` to offer several options at the same time (for example parallel rooms or providers). The slot's time labels the group and each tile is selected on its own.

<LiveExample data-class="p-0 overflow-visible">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: [],
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = {
        date: today,
        multiple: true,
        slots: [
          {
            date: today,
            start: '09:00',
            end: '10:00',
            tiles: [
              { description: 'Room A', note: 'Dr. Smith', color: 'blue', available: true },
              { description: 'Room B', note: 'Dr. Jones', color: 'green', status: 'unconfirmed', available: true },
              { description: 'Room C', note: 'Fully booked', color: 'red', available: false },
            ],
          },
          {
            date: today,
            start: '10:00',
            end: '11:00',
            tiles: [
              { description: 'Room A', note: 'Dr. Smith', available: true },
              { description: 'Room B', note: 'Dr. Jones', available: true },
            ],
          },
        ],
      };
    }
  }"
  x-model="selected"
  class="rounded-md"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
  </div>
</div>
```

</LiveExample>

### Clickable slots without selection

Selection is enabled by binding `x-model`. Leave it off to use the picker purely as a set of clickable actions: each slot still fires a `slot-click` event you can react to, but nothing is ever marked selected. Here the clicked slot is shown below the picker.

<LiveExample data-class="p-0 overflow-visible" data-exclude="generator">

```html
<div
  x-data="{
    config: {},
    last: 'None yet',
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = { date: today, start: '09:00', end: '13:00', step: 30 };
    }
  }"
>
  <div x-h-slot-picker="config" class="rounded-md" @slot-click="last = $event.detail.slot.date + ' ' + $event.detail.slot.start">
    <div x-h-toolbar data-variant="transparent">
      <div x-h-button-group>
        <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
          <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
        </button>
        <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
          <svg x-h-icon data-icon="calendar" role="presentation"></svg>
        </button>
        <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
          <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
        </button>
      </div>
      <div x-h-slot-picker-title></div>
      <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
    </div>
  </div>
  <p class="border-t p-3 text-center text-sm text-muted-foreground">Last clicked: <span x-text="last" class="font-medium text-foreground"></span></p>
</div>
```

</LiveExample>

### Drag and drop

Enable `draggable: true` and handle `slot-drop` to let users rearrange the schedule. While dragging, a half-transparent copy of the slot follows the pointer and the other slots part to show where it will land - within the same day (reorder) or on another day. The dragged slot snaps back until your handler applies the change. `$event.detail.slots` has the move applied but the slot keeps its original time, so a real handler adjusts it to the new position before assigning - that is the place for your own scheduling rules. Here `onDrop` preserves the slot's duration and starts it where its new predecessor ends (dropped at the top of a day, it ends where the next slot starts), so dragging the 11:00 Consultation after the 14:00 slot makes it start at 14:30. The gray "Fixed" slot opts out with `draggable: false`.

<LiveExample data-class="p-0 overflow-visible">

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      this.config = {
        date: dateIn(0),
        draggable: true,
        slots: [
          { date: dateIn(0), start: '09:00', end: '09:30' },
          { date: dateIn(0), start: '10:00', end: '10:30', description: 'Fixed', color: 'gray', draggable: false },
          { date: dateIn(0), start: '11:00', end: '11:30', description: 'Consultation', color: 'blue' },
          { date: dateIn(1), start: '09:30', end: '10:00', color: 'green' },
          { date: dateIn(2), start: '14:00', end: '14:30' },
        ],
      };
    },
    onDrop({ date, index, slots }) {
      const toMins = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const toTime = (mins) => String(Math.floor(mins / 60)).padStart(2, '0') + ':' + String(mins % 60).padStart(2, '0');
      const day = slots.filter((s) => s.date === date);
      const moved = day[index];
      const duration = toMins(moved.end) - toMins(moved.start);
      const prev = day[index - 1];
      const next = day[index + 1];
      if (prev || next) {
        const start = prev ? toMins(prev.end) : toMins(next.start) - duration;
        moved.start = toTime(start);
        moved.end = toTime(start + duration);
      }
      this.config.slots = slots;
    }
  }"
  x-model="selected"
  class="rounded-md"
  @slot-drop="onDrop($event.detail)"
>
  <div x-h-toolbar data-variant="transparent">
    <div x-h-button-group>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Previous" x-h-slot-picker-previous>
        <svg x-h-icon data-icon="chevron-left" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Choose date" x-h-slot-picker-calendar>
        <svg x-h-icon data-icon="calendar" role="presentation"></svg>
      </button>
      <button x-h-button data-variant="outline" data-size="icon" aria-label="Next" x-h-slot-picker-next>
        <svg x-h-icon data-icon="chevron-right" role="presentation"></svg>
      </button>
    </div>
    <div x-h-slot-picker-title></div>
    <button x-h-button data-variant="outline" x-h-slot-picker-today>Today</button>
  </div>
</div>
```

</LiveExample>
