# Slot Picker

An inline calendar that shows a configurable number of consecutive days (1 to 7, three by default), each with a vertical stack of selectable time slots. Slots can carry a description, a note, a status color, and stacked sub-slot tiles. Designed for touch-friendly interaction, it keeps the day columns side by side by default and offers a `responsive` modifier that collapses the columns into a single stacked column on narrow screens.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use the Slot Picker when users need to book or choose one or more time slots from an upcoming schedule, for example booking appointments, selecting meeting windows, or configuring availability. Give a slot a `description` and `note` to explain what it is, a `color` to signal its status (mirroring the Calendar's event colors), or an array of `tiles` to offer several sub-slots at the same time.

Set `days` to control how many day columns are shown (1 to 7). The picker renders only the day grid, so you build the toolbar yourself from the control directives (every example below includes one). The previous/next controls move by that number of days, and the calendar control jumps straight to any date. The chosen date becomes the first of the visible days, which avoids paging far ahead one step at a time. Set `showNowIndicator: true` to mark the current time in today's column with a red line that moves as time passes. By default, the day columns stay side by side at every width. In a narrow container they shrink to the width of their day header, and the picker scrolls sideways when they still do not fit. Add the `responsive` modifier (`x-h-slot-picker.responsive`) to make the columns stack into a single column on narrow screens instead. The picker also works the other way round, as a schedule that staff manage. Right-click (or long-press) a slot for actions, drop a booking onto a free slot, click a day header, and keep your own fields on each slot (see Behavior).

## Behavior

Changing the configuration keeps the days in view. Replacing `slots` re-renders them in place, and only a new `date` moves the visible range. `range-change` reports the first and last visible dates after initialization and whenever the range moves, so a page can load the slots for the days in view.

With `draggable: true`, slots can be reordered within a day and moved to another visible day. Only explicit `slots` drag, never generated ones. A half-transparent copy follows the pointer while the dimmed slot moves through the day lists live, showing where it will land. Disabled and out-of-range days are never targets, and applying a drop on a day with generated slots makes that day explicit. A slot with tiles drags as a whole, tiles do not drag on their own, `draggable: false` keeps a slot in place, and unavailable slots drag only when they are `clickable`. Nothing changes until you accept the `slot-drop` event by assigning `$event.detail.slots` to your `slots`. Dragging is a mouse or pen interaction, and a plain click still selects the slot.

With `dropMode: 'slot'`, a slot or tile is dropped onto another slot instead. Only slots with `droppable: true` accept it and are highlighted under the pointer. Tiles can be dragged in this mode, a drop on a tile targets its slot, and a tile never lands on its own slot. `slot-drop` then names the dragged item and the target, and a drop anywhere else dispatches nothing.

A right-click on a slot, a tile or the header of a slot with tiles dispatches `slot-contextmenu` with the slot and the pointer position, as do the `ContextMenu` key or `Shift+F10` on a focused slot (at its bottom-left corner) and a long press on a touch screen. The browser's own menu appears unless your handler cancels the event (`@slot-contextmenu.prevent`), so you decide per slot whether a Menu opens.

An unavailable slot with `clickable: true` stays a button that dispatches `slot-click` with `available: false` but can never be selected, so booked or blocked entries can open their details. With `clickableHeaders: true` each day header is a button dispatching `day-click`. `dayIcons` adds markers to a header's top corners, just like a slot's `icons`. With `firstDay` set and `days: 7`, the visible window is always the calendar week holding the chosen day, whether it comes from `date`, the today control or the date dialog.

## Directives

`x-h-slot-picker` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-slot-picker`
- `x-h-slot-picker-previous`
- `x-h-slot-picker-next`
- `x-h-slot-picker-today`
- `x-h-slot-picker-title`
- `x-h-slot-picker-calendar`

## API

### Attributes

The control directives take no attributes of their own. These apply to `x-h-slot-picker`:

| Attribute              | Values | Required | Description                                                                                             |
| ---------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------- |
| data-unavailable-label | string | false    | Overrides the "Not available" label shown for fully disabled days and announced for unavailable slots.  |
| data-aria-prev-year    | string | false    | Overrides the previous year button's `aria-label`.                                                      |
| data-aria-prev-month   | string | false    | Overrides the previous month button's `aria-label`.                                                     |
| data-aria-next-month   | string | false    | Overrides the next month button's `aria-label`.                                                         |
| data-aria-next-year    | string | false    | Overrides the next year button's `aria-label`.                                                          |
| data-aria-choose-month | string | false    | Overrides the text after the month name in the month button's `aria-label`. Defaults to `choose month`. |
| data-aria-choose-year  | string | false    | Overrides the text after the year in the year button's `aria-label`. Defaults to `choose year`.         |

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

| Key              | Default     | Description                                                                                                                                                                                                                                                                                                          |
| ---------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| date             | today       | The starting date of the visible window. Accepts a `YYYY-MM-DD` string or a `Date` object. Changing it moves the visible range. Other keys keep the days in view.                                                                                                                                                    |
| days             | `3`         | Number of day columns to show. Clamped to the range 1 to 7.                                                                                                                                                                                                                                                          |
| start            | `'08:00'`   | The first time slot of the day as `HH:MM`. Used in shorthand mode (when `slots` is not provided).                                                                                                                                                                                                                    |
| end              | `'18:00'`   | The exclusive end time as `HH:MM`. Used in shorthand mode.                                                                                                                                                                                                                                                           |
| step             | `60`        | Duration of each slot in minutes. Used in shorthand mode.                                                                                                                                                                                                                                                            |
| slots            | -           | Explicit array of slot objects (see below). When provided, it overrides `start`, `end`, and `step` on a per-day basis. Days without an entry show nothing unless `fillEmptyDays` is set, so an empty array shows every day empty.                                                                                    |
| fillEmptyDays    | `false`     | When `true`, days that have no entry in `slots` fall back to the generated `start`/`end`/`step` schedule instead of showing nothing. Use it to mix explicit per-day slots with a default schedule for the remaining days.                                                                                            |
| multiple         | `false`     | When `true`, multiple slots can be selected simultaneously.                                                                                                                                                                                                                                                          |
| locale           | user locale | BCP 47 language tag for day names and the date display (e.g. `'en-US'`, `'de-DE'`). When not provided, it is taken from the page's `<html lang>` attribute, then the browser locale.                                                                                                                                 |
| disabledDates    | `[]`        | Array of `'YYYY-MM-DD'` strings and/or `{ from, to }` range objects. Matching days show "Not available" instead of slots.                                                                                                                                                                                            |
| disabledDays     | `[]`        | Array of weekday numbers to always disable (0 = Sunday, 6 = Saturday).                                                                                                                                                                                                                                               |
| minDate          | -           | Start day. When set, the user cannot page to any day before it. Accepts a `YYYY-MM-DD` string or a `Date`. Independent of `maxDate`.                                                                                                                                                                                 |
| maxDate          | -           | End day. When set, the user cannot page to any day after it. Accepts a `YYYY-MM-DD` string or a `Date`. Independent of `minDate`.                                                                                                                                                                                    |
| showNowIndicator | `false`     | When `true`, a current-time indicator is shown in today's column and moves on its own as time passes.                                                                                                                                                                                                                |
| draggable        | `false`     | Enable reordering slots within a day and moving them to another day by drag and drop. Requires explicit `slots`. See Behavior.                                                                                                                                                                          |
| dropMode         | `'reorder'` | How a dragged slot is dropped. `'reorder'` moves it to a position in a day's list. `'slot'` drops it onto another slot: only slots with `droppable: true` accept it, tiles can be dragged too, and `slot-drop` names the dragged item and the target. Requires `draggable: true`. See Behavior.         |
| clickableHeaders | `false`     | When `true`, each day header is a button that dispatches `day-click` with the day's date.                                                                                                                                                                                                                            |
| dayIcons         | -           | Markers for the day headers: an object keyed by `YYYY-MM-DD` whose values have the shape of a slot's `icons`, `{ left, right }` arrays of `{ url, alt }` images rendered in the header's top corners.                                                                                                                |
| firstDay         | -           | First day of the week, `0` is Sunday and `1` Monday. The date dialog starts its weeks on it. When set and `days` is `7`, the visible window is always a calendar week: `date`, the today control and the date dialog move to the week containing the chosen day. Without it the chosen day is the first visible day. |

#### Slot object (explicit mode)

| Key         | Type              | Description                                                                                                                                                                                                                                                                                                                                           |
| ----------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| date        | string            | The date of the slot in `YYYY-MM-DD` format.                                                                                                                                                                                                                                                                                                          |
| start       | string            | Start time in `HH:MM` format.                                                                                                                                                                                                                                                                                                                         |
| end         | string            | End time in `HH:MM` format.                                                                                                                                                                                                                                                                                                                           |
| available   | boolean           | When `false`, the slot is shown as unavailable and, unless `clickable` is set, unclickable. A colored unavailable slot keeps its color (useful for showing a booked slot).                                                                                                                                                                            |
| description | string            | A short line rendered under the time.                                                                                                                                                                                                                                                                                                                 |
| note        | string            | A secondary line rendered under the description.                                                                                                                                                                                                                                                                                                      |
| color       | string            | Status color: one of `blue`, `red`, `green`, `yellow`, `purple`, `pink`, `indigo`, `orange`, `gray`, `teal`. An unknown value leaves the slot uncolored.                                                                                                                                                                                              |
| status      | string            | For a colored slot, `confirmed` (default) renders it filled, `unconfirmed` renders it as an outline, and `rejected` renders it as an outline with a dashed border. Ignored when no `color` is set.                                                                                                                                                    |
| icons       | `{ left, right }` | Badge images rendered in the cell's top corners. `left` and `right` are optional arrays of `{ url, alt }` objects, where `url` is the image path and `alt` is the alt text (defaults to `''`).                                                                                                                                                        |
| tiles       | Tile[]            | Sub-slots (see below). When present and non-empty, the slot renders as a labeled group and only its tiles are selectable. The slot's own `start` labels the group.                                                                                                                                                                                    |
| draggable   | boolean           | Set to `false` to exclude the slot from drag and drop when the picker has `draggable: true`.                                                                                                                                                                                                                                                          |
| clickable   | boolean           | With `available: false`, keeps the slot a focusable button that dispatches `slot-click` (with `available: false`) and `slot-contextmenu`, for example to open a booking's details. It is announced as not available and can never be selected.                                                                                                        |
| droppable   | boolean           | In `dropMode: 'slot'`, marks the slot as a drop target. Only droppable slots are highlighted and accept a drop.                                                                                                                                                                                                                                       |
| tooltip     | string            | Hover text of the slot. Replaces the default, which is the description and the note joined by a hyphen. An empty string shows no hover text.                                                                                                                                                                                                          |
| class       | string            | Extra classes added to the slot's element, for a state that `color` and `status` cannot express.                                                                                                                                                                                                                                                      |
| data        | object            | Extra `data-*` attributes: each `{ name: value }` becomes `data-name="value"` (`null` and `undefined` entries are skipped). Use lowercase or kebab-case names, since HTML lowercases attribute names. The picker's own attributes (`slot`, `key`, `date`, `start`, `tile-index`, `color`, `status`, `colored`, `dragging`, `drop-target`) always win. |

Any other field you add stays on your object, which every event hands back as `item`.

#### Tile object (sub-slots)

A tile is an individually selectable sub-slot inside a slot's `tiles` array. It inherits the slot's time unless it sets its own `start`/`end`.

| Key         | Type              | Description                                                                                                                                                        |
| ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| description | string            | The tile's primary label.                                                                                                                                          |
| note        | string            | A secondary line under the description.                                                                                                                            |
| color       | string            | Status color, same values as a slot's `color`.                                                                                                                     |
| status      | string            | For a colored tile, `confirmed` (default) renders it filled, `unconfirmed` renders it as an outline, and `rejected` renders it as an outline with a dashed border. |
| available   | boolean           | When `false`, the tile is shown as unavailable and, unless `clickable` is set, unclickable.                                                                        |
| start       | string            | Optional own start time in `HH:MM`. When set, it is shown on the tile, otherwise the group time applies.                                                           |
| end         | string            | Optional own end time in `HH:MM`.                                                                                                                                  |
| icons       | `{ left, right }` | Badge images in the tile's top corners, as on a slot.                                                                                                              |
| clickable   | boolean           | With `available: false`, keeps the tile a focusable button that dispatches `slot-click` with `available: false`. It can never be selected.                         |
| draggable   | boolean           | Set to `false` to keep the tile in place when the picker has `draggable: true` and `dropMode: 'slot'`. Tiles never drag in reorder mode.                           |
| tooltip     | string            | Hover text of the tile, replacing the default. An empty string shows no hover text.                                                                                |
| class       | string            | Extra classes added to the tile's element.                                                                                                                         |
| data        | object            | Extra `data-*` attributes, as on a slot.                                                                                                                           |

### Model

Binding an `x-model` is what makes slots selectable. With a model bound, clicking a slot toggles its selection and updates the value. Without one, slots are still clickable and emit `slot-click`, but they cannot be selected and carry no selected state.

When used with `x-model`, the bound value follows the selection mode:

- **Single mode** (`multiple: false`): a `'YYYY-MM-DDTHH:MM'` string (e.g. `'2026-06-22T09:00'`), or `null` when nothing is selected.
- **Multiple mode** (`multiple: true`): an array of `'YYYY-MM-DDTHH:MM'` strings, or an empty array.

A selected sub-slot tile uses a composite key of the form `'YYYY-MM-DDTHH:MM#index'` (e.g. `'2026-06-22T09:00#1'`), where the index is the tile's position in its slot's `tiles` array.

### Events

| Event            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| slot-click       | Dispatched on every slot or tile click, including deselection, clicks on an unavailable `clickable` slot and when no `x-model` is bound. `event.detail.slot` contains `date`, `start`, `end`, `available`, `selected` (the new state after the click), `description`, `note`, `color`, `status`, `key`, `tileIndex` (a number for a tile, `null` for a plain slot), `item` (your original slot or tile object, with every field you set) and `parent` (for a tile, the slot that holds it, otherwise `null`).                                                                                                                                                                                                   |
| slot-contextmenu | Dispatched on a contextmenu event that came from a slot, a tile or the header of a slot with tiles. `event.detail.slot` carries the same fields as `slot-click`'s, and `event.detail.x` and `event.detail.y` the position in viewport coordinates (the pointer, or the slot's bottom-left corner from the keyboard). Cancel it (`@slot-contextmenu.prevent`) to keep the browser's own menu from appearing.                                                                                                                                                                                                                                                                                                     |
| range-change     | Dispatched once after the picker initializes and whenever the visible range changes, whether through the controls, the date dialog, or a new `date` or `days` in the configuration. `event.detail.from` and `event.detail.to` are the first and last visible dates as `YYYY-MM-DD`. Replacing `slots` in the handler keeps the range, so it is the place to load the slots for the days in view.                                                                                                                                                                                                                                                                                                                |
| slot-drop        | Dispatched when a dragged slot or tile is dropped (requires the `draggable` option). `event.detail.slot` carries the same fields as `slot-click`'s detail without `selected`. In reorder mode (the default) a drop at the unchanged position dispatches nothing, `event.detail.date` is the target day as `YYYY-MM-DD`, `event.detail.index` the slot's new position within that day's slot list and `event.detail.slots` a new array with the move applied, built without mutating yours - assign it to your `slots` config to accept the move. In `dropMode: 'slot'`, `event.detail.target` carries the target slot in the same shape and there is no `date`, `index` or `slots`, so apply the move yourself. |
| day-click        | Dispatched when a day header is clicked or activated with `Enter` or `Space`, with `clickableHeaders` enabled. `event.detail.date` is the day as `YYYY-MM-DD`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### Data Slots

| Slot                      | Element                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `slot-picker`             | `x-h-slot-picker`                                           |
| `slot-picker-header`      | Day header created by `x-h-slot-picker`                     |
| `slot-picker-cell`        | Selectable slot created by `x-h-slot-picker`                |
| `slot-picker-slot`        | Slot with sub-slot tiles, created by `x-h-slot-picker`      |
| `slot-picker-slot-header` | Header of a slot with sub-slot tiles                        |
| `slot-picker-tile`        | Selectable sub-slot tile created by `x-h-slot-picker`       |
| `slot-picker-time`        | Time of a slot or tile                                      |
| `slot-picker-desc`        | Description of a slot or tile                               |
| `slot-picker-note`        | Note of a slot or tile                                      |
| `slot-picker-now`         | Current time indicator created by `x-h-slot-picker`         |
| `slot-picker-ghost`       | Copy of a slot that follows the pointer while it is dragged |
| `slot-picker-title`       | `x-h-slot-picker-title`                                     |
| `slot-picker-calendar`    | Date popover created by `x-h-slot-picker-calendar`          |

## Keyboard Handling

- `Tab` / `Shift+Tab` - Move between the slots (available ones and unavailable ones marked `clickable`), the toolbar controls and, with `clickableHeaders`, the day headers.
- `Enter` / `Space` - Activate the focused slot (select it or fire `slot-click`) or day header (`day-click`).
- `ContextMenu` / `Shift+F10` - Fire `slot-contextmenu` for the focused slot, positioned at its bottom-left corner.

Drag and drop has no keyboard equivalent, so offer the same moves through `slot-contextmenu` actions or controls of your own. The keys of the date dialog are those of the Inline Calendar.

## Accessibility

The picker is a labeled `group` (default name "Time slot picker", overridable with an `aria-label` attribute). Each day is its own `group` labeled by its header, so the day is announced for the slots inside it. When selection is enabled (an `x-model` is bound), available slots are toggle buttons with a day + time `aria-label` and `aria-pressed` reflecting selection. Without an `x-model` they are plain action buttons with the same label and no `aria-pressed`. Unavailable slots are marked `aria-disabled` with a hidden "Not available" note. An unavailable slot with `clickable: true` is a regular button instead, named with the same "Not available" suffix (overridable with `data-unavailable-label`), so it is announced as taken but stays operable. With `clickableHeaders`, each day header is a button named by the day, the date and the alt texts of its markers, and the day's group takes that name too. Selecting a slot updates the cell in place rather than re-rendering, so keyboard focus stays on the chosen slot. The `x-h-slot-picker-calendar` control opens a `dialog` containing a fully keyboard-navigable date grid, and the dialog takes its accessible name from that control. The default month and year navigation buttons labels can be overridden using the `data-aria-*` attributes. The month and year in the grid's header are toggle buttons that open a month grid or a year list in place of the days, as described in the Inline Calendar behavior. While one is shown, `Tab` cycles between the header buttons and that grid, and `Esc` returns to the days. Picking a date moves the visible range and returns focus to the control, and `Esc` closes it. While the dialog is open, `Tab` and `Shift+Tab` stay inside it. Because you supply the toolbar, give each control button an accessible name (an `aria-label` on an icon-only button, or visible text). Drag-and-drop moving is a pointer-only convenience, and every slot stays reachable through its button, `slot-click` and `slot-contextmenu`, which the `ContextMenu` key and `Shift+F10` fire as well.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

### Basic (single select) with scroll

This example enables the current-time indicator, so a red line marks the current time in today's column.
It also sets the height of the slot picker, in order to show how the overflow is handled.

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

### Multi-select with 30-minute slots

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

### Explicit slots with availability and icon badges

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

### Default schedule with per-day overrides

Provide `start`, `end`, and `step` for the default daily schedule, list `slots` only for the days you want to customize, and set `fillEmptyDays: true` so every other day still shows the default slots. A day that appears in `slots` shows only its explicit slots (it is not merged with the default schedule).

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

### Disabled weekdays and date ranges

Use `disabledDays` to block recurring days (e.g. weekends) and `disabledDates` for specific dates or ranges.

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

### Start and end day bounds

Set `minDate` to a start day and/or `maxDate` to an end day to stop the user paging outside a window. The two options are independent, so you can set just one. The previous/next buttons disable at the edges, and jumping via the calendar is clamped so the visible range always stays within the bounds.

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

### Colored slots

Give a slot a `color` to signal its status, using the same palette as the Calendar's events. Colored slots are filled by default. Set `status: 'unconfirmed'` to render one as an outline, or `status: 'rejected'` for a dashed outline.

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

### Descriptions and notes

Add a `description` and a `note` to explain what a slot is. Both render under the time.

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

### Week view

Set `days` to show up to seven day columns at once. The previous/next buttons then move by that many days. This example shows a full week by default and drops to three days below 640px, driven by the `getBreakpointListener` utility, so `days` follows the viewport width.

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

### Responsive layout

Add the `responsive` modifier to stack the day columns into a single column on narrow screens. Below the `md` breakpoint each day shows its header above its slots, and the picker scrolls through the days one after another. From `md` up the columns sit side by side again. Shrink the browser window below 768 pixels to see the columns stack.

```html
<div
  x-h-slot-picker.responsive="config"
  x-data="{
    config: {},
    selected: null,
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = { date: today, start: '09:00', end: '12:00', step: 30 };
    }
  }"
  x-model="selected"
  class="rounded-md"
  style="height: 24rem"
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

### Load slots for the visible range

Handle `range-change` to load the slots for the days in view. The event reports the first and last visible dates once after the picker initializes and again whenever the user pages or picks a date, so one handler covers the initial load and every move. Assigning the loaded `slots` keeps the days in view. Here `loadSlots` stands in for a request to your API and generates two slots for each visible day.

```html
<div
  x-data="{
    config: {},
    selected: null,
    range: '',
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = { date: today, slots: [] };
    },
    loadSlots({ from, to }) {
      const slots = [];
      const day = new Date(from);
      while (day.toISOString().slice(0, 10) <= to) {
        const date = day.toISOString().slice(0, 10);
        slots.push({ date, start: '09:00', end: '09:30' }, { date, start: '11:00', end: '11:30', description: 'Consultation', color: 'blue' });
        day.setUTCDate(day.getUTCDate() + 1);
      }
      this.config.slots = slots;
      this.range = from + ' to ' + to;
    }
  }"
>
  <div x-h-slot-picker="config" x-model="selected" class="rounded-md" @range-change="loadSlots($event.detail)">
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
  <p class="border-t p-3 text-center text-sm text-muted-foreground">Loaded slots for <span x-text="range" class="font-medium text-foreground"></span></p>
</div>
```

### Sub-slots (tiles)

Give a slot an array of `tiles` to offer several options at the same time (for example parallel rooms or providers). The slot's time labels the group and each tile is selected on its own.

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

### Clickable slots without selection

Selection is enabled by binding `x-model`. Leave it off to use the picker purely as a set of clickable actions: each slot still fires a `slot-click` event you can react to, but nothing is ever marked selected. Here the clicked slot is shown below the picker.

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

### Drag and drop

Enable `draggable: true` and handle `slot-drop` to let users rearrange the schedule. While dragging, a half-transparent copy of the slot follows the pointer and the other slots part to show where it will land - within the same day (reorder) or on another day. The dragged slot snaps back until your handler applies the change. `$event.detail.slots` has the move applied but the slot keeps its original time, so a real handler adjusts it to the new position before assigning - that is the place for your own scheduling rules. Here `onDrop` preserves the slot's duration and starts it where its new predecessor ends (dropped at the top of a day, it ends where the next slot starts), so dragging the 11:00 Consultation after the 14:00 slot makes it start at 14:30. The gray "Fixed" slot opts out with `draggable: false`.

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

### Context menu on slots

The `slot-contextmenu` event can be used to open a Menu. The browser's own context menu is not canceled automatically, so if you do not want the default menu, you have to cancel the original event yourself using the `prevent` modifier or call the `preventDefault()` function on the event object. Blocked slots are not clickable but can still get a menu on a right-click.

```html
<div
  x-data="{
    config: {},
    menuAt: null,
    hit: null,
    last: 'None yet',
    init() {
      const today = new Date().toISOString().slice(0, 10);
      this.config = {
        date: today,
        slots: [
          { date: today, start: '09:00', end: '09:30' },
          { date: today, start: '09:30', end: '10:00', available: false, clickable: true, color: 'blue', description: 'Anna Berg', note: 'Follow-up', tooltip: 'Prefers mornings' },
          { date: today, start: '10:00', end: '10:30', available: false, color: 'gray', description: 'Blocked' },
          { date: today, start: '10:30', end: '11:00' },
        ],
      };
    },
    openMenu(detail) {
      this.hit = detail.slot;
      this.menuAt = { x: detail.x, y: detail.y };
    },
    act(action) {
      this.last = action + ': ' + this.hit.date + ' ' + this.hit.start;
    }
  }"
>
  <div x-h-slot-picker="config" class="rounded-md" @slot-contextmenu.prevent="openMenu($event.detail)" @slot-click="last = 'Opened: ' + $event.detail.slot.date + ' ' + $event.detail.slot.start">
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
  <ul x-h-menu="menuAt" aria-label="Slot actions">
    <template x-if="hit && hit.available">
      <li x-h-menu-item @click="act('Book appointment')">Book appointment</li>
    </template>
    <template x-if="hit && hit.available">
      <li x-h-menu-item @click="act('Block')">Block</li>
    </template>
    <template x-if="hit && !hit.available && hit.item.clickable">
      <li x-h-menu-item @click="act('Move booking')">Move booking</li>
    </template>
    <template x-if="hit && !hit.available && hit.item.clickable">
      <li x-h-menu-item data-variant="negative" @click="act('Cancel booking')">Cancel booking</li>
    </template>
    <template x-if="hit && !hit.available && !hit.item.clickable">
      <li x-h-menu-item @click="act('Unblock')">Unblock</li>
    </template>
  </ul>
  <p class="border-t p-3 text-center text-sm text-muted-foreground">Last action: <span x-text="last" class="font-medium text-foreground"></span></p>
</div>
```

### Drop a slot onto another slot

Set `dropMode: 'slot'` and mark the free slots `droppable: true`. The bookings are unavailable but `clickable`, so they stay draggable. Drag one onto a free slot, which is highlighted while the pointer is over it. Nothing changes until `onDrop` applies the move, here by giving the target the booking and freeing the old slot, comparing by the original objects in `slot.item` and `target.item`. The blocked slot is neither draggable nor a target.

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      const free = (date, start, end) => ({ date, start, end, droppable: true });
      const booked = (date, start, end, patient) => ({ date, start, end, available: false, clickable: true, color: 'blue', description: patient });
      this.config = {
        date: dateIn(0),
        draggable: true,
        dropMode: 'slot',
        slots: [
          booked(dateIn(0), '09:00', '09:30', 'Anna Berg'),
          free(dateIn(0), '09:30', '10:00'),
          { date: dateIn(0), start: '10:00', end: '10:30', available: false, color: 'gray', description: 'Blocked' },
          free(dateIn(1), '09:00', '09:30'),
          booked(dateIn(1), '09:30', '10:00', 'Tom Reed'),
          free(dateIn(2), '09:00', '09:30'),
          free(dateIn(2), '09:30', '10:00'),
        ],
      };
    },
    onDrop({ slot, target }) {
      const from = slot.item;
      const to = target.item;
      this.config.slots = this.config.slots.map((s) => {
        if (s === to) return { date: to.date, start: to.start, end: to.end, available: false, clickable: true, color: from.color, description: from.description };
        if (s === from) return { date: from.date, start: from.start, end: from.end, droppable: true };
        return s;
      });
    }
  }"
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

### Clickable day headers with markers

Set `clickableHeaders: true` to make each day header a button that dispatches `day-click` with the day's date, for example to open the editor for that day's working hours. `dayIcons` puts small markers in a header's top corners, an image with an alt text each, with the same `{ left, right }` shape as a slot's `icons`.

```html
<div
  x-data="{
    config: {},
    last: 'None yet',
    init() {
      const dateIn = (days) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        return d.toISOString().slice(0, 10);
      };
      this.config = {
        date: dateIn(0),
        start: '09:00',
        end: '12:00',
        step: 60,
        clickableHeaders: true,
        dayIcons: {
          [dateIn(1)]: { right: [{ url: '/harmonia/logo/harmonia-circle.svg', alt: 'Working hours changed' }] },
          [dateIn(2)]: {
            left: [{ url: '/harmonia/logo/harmonia-symbolic.svg', alt: 'Holiday' }],
            right: [{ url: '/harmonia/logo/harmonia-circle.svg', alt: 'Running late' }],
          },
        },
      };
    }
  }"
>
  <div x-h-slot-picker="config" class="rounded-md" @day-click="last = $event.detail.date">
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
  <p class="border-t p-3 text-center text-sm text-muted-foreground">Last day clicked: <span x-text="last" class="font-medium text-foreground"></span></p>
</div>
```

### Week starting on Monday

With `days: 7` and `firstDay: 1` the visible window is the Monday to Sunday week containing the date, the today control returns to the current week, and the date dialog starts its weeks on Monday and opens the week of the picked day.

```html
<div
  x-h-slot-picker="config"
  x-data="{
    config: {},
    init() {
      this.config = { date: new Date().toISOString().slice(0, 10), days: 7, firstDay: 1, start: '09:00', end: '12:00', step: 60 };
    }
  }"
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

Full docs: https://www.codbex.com/harmonia/components/slot-picker.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
