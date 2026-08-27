# Calendar

A full multi-view event calendar with month, week, day, and year views. Events are supplied through a reactive config object.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use `x-h-calendar` when users need to view and navigate a schedule - appointments, team calendars, project timelines, and so on.

## Behavior

Set `draggable: true` in the configuration to let users reschedule events by dragging them:

- **Week and day views** - dragging a timed event vertically moves its start time in steps of `dragStep` minutes (`15` by default), and dragging it onto another day column (week view) moves it to that day. The duration is kept. Events that continue from an earlier day can only be moved between days.
- **Week view all-day strip** - all-day pills can be dragged onto another day column.
- **Month view** - dragging an event pill onto another day cell changes only its day and keeps its time. The hovered target cell is highlighted while dragging.
- **Year view** - no drag and drop.

Dropping never changes the calendar's data directly. The event snaps back and an `event-drop` event is dispatched with the proposed new `start` and `end` values. Apply them to your event object to accept the move, or ignore the event to reject it. Individual events can opt out with `draggable: false`. Dragging is a mouse or pen interaction, and a plain click still fires `event-click`.

## Directive

- `x-h-calendar`

## API

### Attributes

| Attribute        | Values | Required | Description                                                                                         |
| ---------------- | ------ | -------- | --------------------------------------------------------------------------------------------------- |
| data-aria-prev   | string | false    | Sets the `aria-label` for the previous-period navigation button.                                    |
| data-aria-next   | string | false    | Sets the `aria-label` for the next-period navigation button.                                        |
| data-aria-views  | string | false    | Sets the `aria-label` for the view switcher menu (Defaults to `"Change view"`).                     |
| data-today-label | string | false    | Sets the text label for the Today button (Defaults to `"Today"`).                                   |
| data-more-label  | string | false    | Template for the month-view overflow button. `{count}` is substituted. Defaults to `+{count} more`. |
| data-day-label   | string | false    | Sets the label for the Day view option (Defaults to `"Day"`).                                       |
| data-week-label  | string | false    | Sets the label for the Week view option (Defaults to `"Week"`).                                     |
| data-month-label | string | false    | Sets the label for the Month view option (Defaults to `"Month"`).                                   |
| data-year-label  | string | false    | Sets the label for the Year view option (Defaults to `"Year"`).                                     |

### Events

| Event       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event-click | Fired when the user clicks an event. The original event object is passed in `$event.detail.event`.                                                                                                                                                                                                                                                                                                                                                                                                   |
| date-click  | Fired when the user clicks an empty date cell or time slot. The clicked `Date` is in `$event.detail.date`. For time-grid views the slot time string (`"HH:MM"`) is also in `$event.detail.time`.                                                                                                                                                                                                                                                                                                     |
| event-drop  | Fired when a dragged event is dropped on a new day or time (requires the `draggable` option). `$event.detail.event` is the event object. `$event.detail.start` and `$event.detail.end` hold the proposed new values in the same string shape as the event's own fields (`"YYYY-MM-DDTHH:MM"`, or `"YYYY-MM-DD"` when the original value was date-only and the time of day is unchanged). `detail.end` is `undefined` when the event has no `end`. Assign the values to your event to apply the move. |

### Configuration

Pass a configuration object to the directive as an expression.

```html
<div x-h-calendar="calConfig" style="height: 600px"></div>
```

| Key              | Description                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| events           | Array of event objects. See Event object below.                                                                                                                                  |
| view             | Initial view. The options are `"month"` (default), `"week"`, `"day"`, or `"year"`.                                                                                                                |
| date             | Initial focus date in `YYYY-MM-DD` format. Defaults to today.                                                                                                                                     |
| locale           | BCP 47 language tag for formatting. When not provided, it is taken from the page's `<html lang>` attribute, then the browser locale.                                                              |
| firstDay         | First day of the week. `0` = Sunday (default), `1` = Monday.                                                                                                                                      |
| showNowIndicator | Show the current-time indicator in week and day views. Defaults to `true`. Set to `false` to hide it.                                                                                             |
| views            | Show the view-switcher button group in the toolbar. Defaults to `true`. Set to `false` to lock the calendar to the view set in `view` and hide the switcher.                                      |
| scrollTo         | Where week and day views scroll to on load - `"now"` anchors on the current time, `"first-event"` anchors on the earliest event in view. Falls back to `"now"` when the view has no timed events. |
| draggable        | Enable drag-and-drop rescheduling of events in the month, week, and day views. Defaults to `false`. See Behavior.                                                                    |
| dragStep         | Minutes value, used as a step when a timed event is dragged vertically in the week and day views. Defaults to `15`.                                                                               |

### Event object

Each item in the `events` array supports the following fields:

| Field       | Type                                                                                                                       | Required | Description                                                                                                                                                    |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id          | string                                                                                                                     | false    | Unique identifier for the event. Auto-generated if omitted.                                                                                                    |
| title       | string                                                                                                                     | true     | Display title of the event.                                                                                                                                    |
| start       | string                                                                                                                     | true     | Start datetime as an ISO string (`"YYYY-MM-DDTHH:MM:SS"`) or date (`"YYYY-MM-DD"` for all-day).                                                                |
| end         | string                                                                                                                     | false    | End datetime. Defaults to `start`. For all-day events, defaults to end of the start day.                                                                       |
| allDay      | boolean                                                                                                                    | false    | When `true`, the event appears in the all-day strip of week/day views. Defaults to `false`.                                                                    |
| color       | `blue`<br />`red`<br />`green`<br />`yellow`<br />`purple`<br />`pink`<br />`indigo`<br />`orange`<br />`gray`<br />`teal` | false    | Color key.                                                                                                                                                     |
| status      | string                                                                                                                     | false    | Pill style. `confirmed` (default) renders a filled pill, `unconfirmed` renders an outlined pill, and `rejected` renders an outlined pill with a dashed border. |
| description | string                                                                                                                     | false    | Shown as a tooltip on event pills.                                                                                                                             |
| draggable   | boolean                                                                                                                    | false    | Set to `false` to exclude the event from drag and drop when the calendar has `draggable: true`.                                                                |

## Keyboard Handling

In the month view (and within each year-view mini-month) the day cells form an ARIA grid with roving focus:

- `Up` / `Down` - Move focus a week earlier/later.
- `Left` / `Right` - Move focus to the previous/next day (crossing month boundaries).
- `Home` / `End` - Move focus to the first/last day of the month.
- `PageUp` / `PageDown` - Move focus to the previous/next month.
- `Enter` / `Space` - Fire `date-click` for the focused day (year view - open that day in day view).

Events are buttons in the tab order. Activate them to fire `event-click`. In the month view, the "+N more" overflow opens a dialog that moves focus to its event list and returns focus to the trigger on `Escape`.

## Accessibility

The calendar is a labeled `group` (default name "Calendar", overridable with an `aria-label` attribute). The toolbar period heading is an `aria-live` region. The month grid uses `role="grid"`/`row`/`gridcell` with `aria-current="date"` on today and full keyboard navigation. Events are `button`s whose accessible label includes the title, time (or "all day"), and status (e.g. "unconfirmed"). The week/day time grid's empty-slot "click to pick a time" is a pointer-only convenience. Drag-and-drop rescheduling is a pointer-only convenience as well, and every event stays reachable through its button and `event-click`.

## Examples

### Month view

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
        { id: '5', title: 'Vendor Call', start: today + 'T13:00:00', end: today + 'T14:00:00', status: 'rejected', color: 'red' },
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

### Week view

```html
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    this.cal = {
      view: 'week',
      scrollTo: 'first-event',
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

### Day view

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

### Year view

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

### Drag and drop

Enable rescheduling with `draggable: true` and apply the change in an `@event-drop` handler. The "Public Holiday" event opts out with `draggable: false`.

```html
<div
  x-data="{
  cal: {},
  init() {
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10);
    this.cal = {
      view: 'week',
      scrollTo: 'first-event',
      draggable: true,
      events: [
        { id: '1', title: 'Team Sync', start: today + 'T09:00:00', end: today + 'T10:00:00', color: 'blue' },
        { id: '2', title: 'Design Review', start: today + 'T11:00:00', end: today + 'T12:30:00', color: 'purple' },
        { id: '3', title: 'Off-site', start: tomorrow, allDay: true, color: 'orange' },
        { id: '4', title: 'Public Holiday', start: today, allDay: true, color: 'gray', draggable: false },
      ],
    };
  },
  onDrop(detail) {
    const ev = this.cal.events.find((e) => e.id === detail.event.id);
    ev.start = detail.start;
    if (detail.end) ev.end = detail.end;
  }
}"
  x-h-calendar="cal"
  style="height: 560px"
  @event-drop="onDrop($event.detail)"
></div>
```

Full docs: https://www.codbex.com/harmonia/components/calendar.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
