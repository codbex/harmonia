# Calendar

Harmonia provides two calendar components:

- **`x-h-calendar-inline`** - a compact date-picker calendar for selecting a single date.
- **`x-h-calendar`** - a full multi-view event calendar with month, week, day, and year views.

---

## Inline Calendar

Allows users to view and select dates within a monthly context. The component provides navigation between months and years.

### Usage

Use the inline calendar when users need to choose specific dates, such as scheduling events but do not need a date input or a fullscreen calendar. For filtering data by date, use a [Date Picker](/components/date-picker). Make sure it is paired with clear labels and context to prevent confusion, especially when selecting critical dates.

### Keyboard Handling

The user can use the following keyboard shortcuts in order to navigate through the calendar:

- `Up` / `Down` - Moves focus to the day above/below the current day.
- `Right` - Moves focus to the next day.
- `Left` - Moves focus to the previous day.
- `Enter` / `Space` - Selects the focused day.
- `Home` - Selects the first day of the month.
- `End` - Selects the last day of the month.
- `PageUp` - Selects the same or closest day of the previous month.
- `PageDown` - Selects the same or closest day of the next month.

### Accessibility

The calendar is exposed as an ARIA date grid: the month/year heading names the grid (announced via `aria-live` as it changes), weekday columns are column headers, and each day is a grid cell with roving focus and `aria-selected` / `aria-disabled` / `aria-current="date"` (today) state. Navigation buttons are labeled (override the defaults with the `data-aria-*` attributes below).

### API Reference

#### Component attribute(s)

```
x-h-calendar-inline
```

#### Attributes

| Attribute            | Values | Required | Description                                                          |
| -------------------- | ------ | -------- | -------------------------------------------------------------------- |
| data-aria-prev-year  | string | false    | Sets the `aria-label` attribute value for the previous year button.  |
| data-aria-prev-month | string | false    | Sets the `aria-label` attribute value for the previous month button. |
| data-aria-next-month | string | false    | Sets the `aria-label` attribute value for the next month button.     |
| data-aria-next-year  | string | false    | Sets the `aria-label` attribute value for the next year button.      |

#### Model

When using `x-model`, the calendar reads and writes dates as `YYYY-MM-DD` strings (e.g. `"2025-06-09"`). Set the bound variable to a `YYYY-MM-DD` string to pre-select a date, or to an empty string for no initial selection. On every selection the model is updated to the newly selected date in the same `YYYY-MM-DD` format.

Full ISO datetime strings (e.g. from `new Date().toISOString()`) are also accepted as input, but initialising with `YYYY-MM-DD` is recommended to avoid timezone-related date drift.

In [range mode](#range-selection-inline) the model is an object `{ start, end }` instead of a single string.

#### Events

| Event  | Description                                                                                                                                                                                              |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| change | Triggered when the selection changes. In single mode the selected `Date` is passed in `event.detail.date`; in range mode the `Date` endpoints are passed in `event.detail.start` and `event.detail.end`. |

#### Config

You can pass a configuration object to the calendar as an expression or as a value.

Example:

```html
<div x-h-calendar-inline="calConfig"></div>
<script>
  Alpine.data('controller', () => ({
    calConfig: { locale: 'en-US', firstDay: 1, min: '2025-01-10', max: '2025-12-20' },
  }));
</script>
```

| Key       | Description                                                                                                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locale    | The locale of the calendar as a BCP 47 language tag. If not provided, it's automatically set from the user preferences.                                                                                              |
| firstDay  | The start day of the week. `0` is Sunday.                                                                                                                                                                            |
| min       | The earliest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                                                                       |
| max       | The latest date selectable. Must be provided in the standard ISO 8601 format - `YYYY-MM-DD`.                                                                                                                         |
| options   | [Intl.DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat#options) options.                                                          |
| delimiter | Custom separator character between day, month, and year in the display format (e.g. `"-"`). Does not affect the model value.                                                                                         |
| order     | Custom display order of the date parts as a three-character string of `Y` (year), `M` (month), `D` (day) (e.g. `"MDY"` for month-day-year). Defaults to the locale's natural order. Does not affect the model value. |
| range     | When `true`, the calendar selects a start-and-end date range instead of a single date. See [Range selection](#range-selection-inline).                                                                               |

### Examples

#### Change event

<ClientOnly>
<component-container data-class="p-0">
<div x-data>
  <div x-h-calendar-inline @change="console.log('Selected:', $event.detail.date)"></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data>
  <div x-h-calendar-inline @change="console.log('Selected:', $event.detail.date)"></div>
</div>
```

#### Locale and first day config

<ClientOnly>
<component-container data-class="p-0">
<div
  x-data="{
  caldate: '',
  init() {
    const d = new Date();
    this.caldate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <div x-h-calendar-inline="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
</component-container>
</ClientOnly>

```html
<div
  x-data="{
  caldate: '',
  init() {
    const d = new Date();
    this.caldate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}"
>
  <div x-h-calendar-inline="{ locale: 'en-US', firstDay: 1 }" x-model="caldate"></div>
</div>
```

#### Range selection {#range-selection-inline}

Set `range: true` to let the user pick a date range. The first selection sets the start, the second completes the range (picks are ordered automatically). With the keyboard, press `Enter` once to set the start and again to set the end.

In range mode the `x-model` value is an object with `start` and `end` keys (each a `YYYY-MM-DD` string), and the `change` event detail is `{ start, end }` (`Date` objects):

```js
{ start: '2025-06-09', end: '2025-06-16' }
```

<ClientOnly>
<component-container data-class="p-0">
<div x-data="{ dateRange: { start: '', end: '' } }">
  <div x-h-calendar-inline="{ range: true, firstDay: 1 }" x-model="dateRange"></div>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ dateRange: { start: '', end: '' } }">
  <div x-h-calendar-inline="{ range: true, firstDay: 1 }" x-model="dateRange"></div>
</div>
```

---

## Event Calendar

A full multi-view event calendar with month, week, day, and year views. Events are supplied through a reactive config object.

The component renders its own toolbar (previous/next navigation, Today button, and view switcher). The host element must have a defined height (e.g. `style="height: 600px"`) because the week and day views contain a scrollable time grid.

### Usage

Use `x-h-calendar` when users need to view and navigate a schedule - appointments, team calendars, project timelines, and so on.

### Keyboard Handling

In the month view (and within each year-view mini-month) the day cells form an ARIA grid with roving focus:

- `Up` / `Down` - Move focus a week earlier/later.
- `Left` / `Right` - Move focus to the previous/next day (crossing month boundaries).
- `Home` / `End` - Move focus to the first/last day of the month.
- `PageUp` / `PageDown` - Move focus to the previous/next month.
- `Enter` / `Space` - Fire `date-click` for the focused day (year view: open that day in day view).

Events are buttons in the tab order; activate them to fire `event-click`. In the month view, the "+N more" overflow opens a dialog that moves focus to its event list and returns focus to the trigger on `Escape`.

### Accessibility

The calendar is a labeled `group` (default name "Calendar"; set an `aria-label` attribute to override). The toolbar period heading is an `aria-live` region; the month grid uses `role="grid"`/`row`/`gridcell` with `aria-current="date"` on today and full keyboard navigation; events are `button`s whose accessible label includes the title, time (or "all day"), and status (e.g. "unconfirmed"). The week/day time grid's empty-slot "click to pick a time" is a pointer-only convenience.

### API Reference

#### Component attribute(s)

```
x-h-calendar
```

#### Attributes

| Attribute        | Values | Required | Description                                                                  |
| ---------------- | ------ | -------- | ---------------------------------------------------------------------------- |
| data-aria-prev   | string | false    | Sets the `aria-label` for the previous-period navigation button.             |
| data-aria-next   | string | false    | Sets the `aria-label` for the next-period navigation button.                 |
| data-aria-views  | string | false    | Sets the `aria-label` for the view switcher menu (default: `"Change view"`). |
| data-today-label | string | false    | Sets the text label for the Today button (default: `"Today"`).               |
| data-day-label   | string | false    | Sets the label for the Day view option (default: `"Day"`).                   |
| data-week-label  | string | false    | Sets the label for the Week view option (default: `"Week"`).                 |
| data-month-label | string | false    | Sets the label for the Month view option (default: `"Month"`).               |
| data-year-label  | string | false    | Sets the label for the Year view option (default: `"Year"`).                 |

#### Events

| Event       | Description                                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| event-click | Fired when the user clicks an event. The original event object is passed in `$event.detail.event`.                                                                                               |
| date-click  | Fired when the user clicks an empty date cell or time slot. The clicked `Date` is in `$event.detail.date`; for time-grid views the slot time string (`"HH:MM"`) is also in `$event.detail.time`. |

#### Config

Pass a configuration object to the directive as an expression.

```html
<div x-h-calendar="calConfig" style="height: 600px"></div>
```

| Key              | Description                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| events           | Array of event objects. See [Event object](#event-object) below.                                                                                             |
| view             | Initial view: `"month"` (default), `"week"`, `"day"`, or `"year"`.                                                                                           |
| date             | Initial focus date in `YYYY-MM-DD` format. Defaults to today.                                                                                                |
| locale           | BCP 47 language tag for formatting. Defaults to the user's browser locale.                                                                                   |
| firstDay         | First day of the week. `0` = Sunday (default), `1` = Monday.                                                                                                 |
| showNowIndicator | Show the current-time indicator in week and day views. Defaults to `true`. Set to `false` to hide it.                                                        |
| views            | Show the view-switcher button group in the toolbar. Defaults to `true`. Set to `false` to lock the calendar to the view set in `view` and hide the switcher. |

#### Event object

Each item in the `events` array supports the following fields:

| Field       | Type    | Required | Description                                                                                                  |
| ----------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| id          | string  | false    | Unique identifier for the event. Auto-generated if omitted.                                                  |
| title       | string  | true     | Display title of the event.                                                                                  |
| start       | string  | true     | Start datetime as an ISO string (`"YYYY-MM-DDTHH:MM:SS"`) or date (`"YYYY-MM-DD"` for all-day).              |
| end         | string  | false    | End datetime. Defaults to `start`. For all-day events, defaults to end of the start day.                     |
| allDay      | boolean | false    | When `true`, the event appears in the all-day strip of week/day views. Defaults to `false`.                  |
| color       | string  | false    | Color key: `blue` (default), `red`, `green`, `yellow`, `purple`, `pink`, `indigo`, `orange`, `gray`, `teal`. |
| status      | string  | false    | Pill style: `confirmed` (default) renders a filled pill; `unconfirmed` renders an outlined pill.             |
| description | string  | false    | Shown as a tooltip on event pills.                                                                           |

### Examples

#### Month view

<ClientOnly>
<component-container data-class="p-0">
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    this.cal = {
      view: 'month',
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T10:00:00', end: today + 'T11:00:00', color: 'blue' },
        { id: '2', title: 'Company Meeting', start: today + 'T10:00:00', end: today + 'T11:00:00', status: 'unconfirmed', color: 'blue' },
        { id: '3', title: 'All Hands', start: today, allDay: true, color: 'green' },
        { id: '4', title: 'Off-site', start: today + 'T08:00:00', end: tomorrow + 'T18:00:00', color: 'purple' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-click="console.log('event clicked:', $event.detail.event)"
  @date-click="console.log('date clicked:', $event.detail.date)"
></div>
</component-container>
</ClientOnly>

```html
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    this.cal = {
      view: 'month',
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T10:00:00', end: today + 'T11:00:00', color: 'blue' },
        { id: '2', title: 'Company Meeting', start: today + 'T10:00:00', end: today + 'T11:00:00', status: 'unconfirmed', color: 'blue' },
        { id: '3', title: 'All Hands', start: today, allDay: true, color: 'green' },
        { id: '4', title: 'Off-site', start: today + 'T08:00:00', end: tomorrow + 'T18:00:00', color: 'purple' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-click="console.log('event clicked:', $event.detail.event)"
  @date-click="console.log('date clicked:', $event.detail.date)"
></div>
```

#### Week view

<ClientOnly>
<component-container data-class="p-0">
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    this.cal = {
      view: 'week',
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T09:00:00', end: today + 'T10:00:00', color: 'blue' },
        { id: '2', title: 'Design Review', start: today + 'T09:30:00', end: today + 'T10:30:00', color: 'purple' },
        { id: '3', title: 'Lunch with Client', start: today + 'T12:00:00', end: today + 'T13:30:00', color: 'green' },
        { id: '4', title: 'Off-site', start: today, end: tomorrow, allDay: true, color: 'orange' },
        { id: '5', title: 'Budget Review', start: today + 'T15:00:00', end: today + 'T16:00:00', color: 'red', status: 'unconfirmed' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-click="console.log('event clicked:', $event.detail.event)"
  @date-click="console.log('date clicked:', $event.detail.date, $event.detail.time)"
></div>
</component-container>
</ClientOnly>

```html
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    this.cal = {
      view: 'week',
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T09:00:00', end: today + 'T10:00:00', color: 'blue' },
        { id: '2', title: 'Design Review', start: today + 'T09:30:00', end: today + 'T10:30:00', color: 'purple' },
        { id: '3', title: 'Lunch with Client', start: today + 'T12:00:00', end: today + 'T13:30:00', color: 'green' },
        { id: '4', title: 'Off-site', start: today, end: tomorrow, allDay: true, color: 'orange' },
        { id: '5', title: 'Budget Review', start: today + 'T15:00:00', end: today + 'T16:00:00', color: 'red', status: 'unconfirmed' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-click="console.log('event clicked:', $event.detail.event)"
  @date-click="console.log('date clicked:', $event.detail.date, $event.detail.time)"
></div>
```

#### Day view

<ClientOnly>
<component-container data-class="p-0">
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    this.cal = {
      view: 'day',
      events: [
        { id: '1', title: 'Stand-up', start: today + 'T09:00:00', end: today + 'T09:15:00', color: 'blue' },
        { id: '2', title: 'Sprint Planning', start: today + 'T10:00:00', end: today + 'T12:00:00', color: 'indigo' },
        { id: '3', title: 'Lunch', start: today + 'T12:00:00', end: today + 'T13:00:00', color: 'green' },
        { id: '4', title: '1:1 with Manager', start: today + 'T14:00:00', end: today + 'T14:30:00', color: 'teal' },
        { id: '5', title: 'Code Review', start: today + 'T14:00:00', end: today + 'T15:00:00', color: 'orange' },
        { id: '6', title: 'Release Call', start: today + 'T16:00:00', end: today + 'T17:00:00', color: 'red', status: 'unconfirmed' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-click="console.log('event clicked:', $event.detail.event)"
  @date-click="console.log('date clicked:', $event.detail.date, $event.detail.time)"
></div>
</component-container>
</ClientOnly>

```html
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    this.cal = {
      view: 'day',
      events: [
        { id: '1', title: 'Stand-up', start: today + 'T09:00:00', end: today + 'T09:15:00', color: 'blue' },
        { id: '2', title: 'Sprint Planning', start: today + 'T10:00:00', end: today + 'T12:00:00', color: 'indigo' },
        { id: '3', title: 'Lunch', start: today + 'T12:00:00', end: today + 'T13:00:00', color: 'green' },
        { id: '4', title: '1:1 with Manager', start: today + 'T14:00:00', end: today + 'T14:30:00', color: 'teal' },
        { id: '5', title: 'Code Review', start: today + 'T14:00:00', end: today + 'T15:00:00', color: 'orange' },
        { id: '6', title: 'Release Call', start: today + 'T16:00:00', end: today + 'T17:00:00', color: 'red', status: 'unconfirmed' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-click="console.log('event clicked:', $event.detail.event)"
  @date-click="console.log('date clicked:', $event.detail.date, $event.detail.time)"
></div>
```

#### Year view

<ClientOnly>
<component-container data-class="p-0">
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    this.cal = {
      view: 'year',
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T10:00:00', end: today + 'T11:00:00', color: 'blue' },
        { id: '2', title: 'All Hands', start: today, allDay: true, color: 'green' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
></div>
</component-container>
</ClientOnly>

```html
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    this.cal = {
      view: 'year',
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T10:00:00', end: today + 'T11:00:00', color: 'blue' },
        { id: '2', title: 'All Hands', start: today, allDay: true, color: 'green' },
      ],
    };
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
></div>
```
