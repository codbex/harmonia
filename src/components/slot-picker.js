import { findAncestorState } from '../common/ancestor';
import { createCalendarWidget, forwardCalendarNavAria, isToday, toDateString } from '../common/calendar';
import { colorClasses, EVENT_COLORS, ringClass } from '../common/event-colors';
import { createDateTimeFormatCache } from '../common/intl';
import { eventInsidePicker, setupPopover } from '../common/picker-popover';
import { minsToTime, timeToMins } from '../common/time';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import uuidv4 from '../utils/uuid';

export default function (Alpine) {
  Alpine.directive('h-slot-picker', (el, { expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    el.classList.add('relative', 'flex', 'flex-col', 'bg-background', 'text-foreground');
    el.setAttribute('data-slot', 'slot-picker');
    // Expose the picker as a labeled group; respect an author-provided aria-label.
    el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Time slot picker');

    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    let dayCount = 3;
    let slotStart = '08:00';
    let slotEnd = '18:00';
    let slotStep = 60;
    let explicitSlots = null;
    let fillEmptyDays = false;
    let multiple = false;
    let selected = [];
    let locale = undefined;
    let disabledDates = [];
    let disabledDays = [];
    let minDate = null;
    let maxDate = null;
    let showNowIndicator = false;

    // The picker renders no toolbar of its own. Consumers compose one from an
    // x-h-toolbar wrapping the x-h-slot-picker-* control directives, which reach
    // this shared API. Publish it before anything else so child directives find
    // it when Alpine initializes them after this parent.
    const calControls = `hspc${uuidv4()}`;
    let calAnchor = null;

    const state = Alpine.reactive({ title: '', canPrev: true, canNext: true });
    state.calendarControlsId = calControls;
    state.previous = () => {
      currentDate = addDays(currentDate, -dayCount);
      clampCurrentDate();
      render();
    };
    state.next = () => {
      currentDate = addDays(currentDate, dayCount);
      clampCurrentDate();
      render();
    };
    state.today = () => {
      currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      clampCurrentDate();
      render();
    };
    el._h_slot_picker = state;

    // Scrollable content
    const scrollBody = document.createElement('div');
    scrollBody.classList.add('flex-1', 'overflow-auto', 'min-h-0');
    el.appendChild(scrollBody);

    const dayGrid = document.createElement('div');
    scrollBody.appendChild(dayGrid);

    // Helpers

    function addDays(date, n) {
      const d = new Date(date);
      d.setDate(d.getDate() + n);
      return d;
    }

    function toMidnight(value) {
      const d = new Date(value);
      d.setHours(0, 0, 0, 0);
      return d;
    }

    // A day is out of range when it falls before the start day or after the end
    // day. The two bounds are independent - either, both, or neither may be set.
    function isDayOutOfRange(d) {
      if (minDate && d < minDate) return true;
      if (maxDate && d > maxDate) return true;
      return false;
    }

    // Keep the visible window inside the configured bounds so the user can never
    // page to days before the start day or after the end day.
    function clampCurrentDate() {
      if (minDate && currentDate < minDate) currentDate = new Date(minDate);
      if (maxDate) {
        const maxStart = addDays(maxDate, -(dayCount - 1));
        if (currentDate > maxStart) currentDate = maxStart;
      }
      // A range narrower than the visible window can push the start below the start
      // day; anchor at minDate and let render disable the overflowing days.
      if (minDate && currentDate < minDate) currentDate = new Date(minDate);
    }

    function updateNavState() {
      state.canPrev = !(!!minDate && currentDate <= minDate);
      state.canNext = !(!!maxDate && addDays(currentDate, dayCount - 1) >= maxDate);
    }

    function slotKey(dateStr, start) {
      return `${dateStr}T${start}`;
    }

    function tileKey(dateStr, start, i) {
      return `${slotKey(dateStr, start)}#${i}`;
    }

    function generateDaySlots(dateStr) {
      const slots = [];
      const endMins = timeToMins(slotEnd);
      for (let m = timeToMins(slotStart); m < endMins; m += slotStep) {
        const start = minsToTime(m);
        slots.push({ date: dateStr, start, end: minsToTime(m + slotStep), available: true });
      }
      return slots;
    }

    function getSlotsForDay(dateStr) {
      if (explicitSlots) {
        const daySlots = explicitSlots.filter((s) => s.date === dateStr);
        // Explicit slots override a day; days without any fall back to the
        // generated start/end/step schedule only when `fillEmptyDays` is set.
        if (daySlots.length || !fillEmptyDays) return daySlots;
      }
      return generateDaySlots(dateStr);
    }

    function isDayDisabled(dateStr, dayOfWeek) {
      if (disabledDays.includes(dayOfWeek)) return true;
      for (const entry of disabledDates) {
        if (typeof entry === 'string') {
          if (entry === dateStr) return true;
        } else if (entry.from !== undefined && entry.to !== undefined) {
          if (dateStr >= entry.from && dateStr <= entry.to) return true;
        }
      }
      return false;
    }

    function normalizeIcons(item) {
      const list = (v) => (Array.isArray(v) ? v : v ? [v] : []);
      return { left: list(item.icons?.left), right: list(item.icons?.right) };
    }

    function makeIconBadge(icons, sideClass) {
      if (!icons.length) return null;
      const badge = document.createElement('span');
      badge.classList.add('absolute', 'top-1', sideClass, 'flex', 'items-center', 'gap-0.5', 'pointer-events-none');
      icons.forEach((icon) => {
        const img = document.createElement('img');
        img.src = icon.url;
        img.alt = icon.alt ?? '';
        img.classList.add('size-3.5', 'shrink-0', 'object-contain');
        badge.appendChild(img);
      });
      return badge;
    }

    // A slot/tile is colored only when it names one of the known event colors.
    function resolveColor(color) {
      return color && EVENT_COLORS[color] ? color : null;
    }

    // Selection state, applied to cells in place (no full re-render on click).

    const SELECTED_UNCOLORED = ['bg-primary', 'text-primary-foreground', 'border-transparent', 'hover:bg-primary-hover'];
    const UNSELECTED_UNCOLORED = ['hover:bg-secondary-hover', 'hover:text-secondary-foreground'];
    const cellByKey = new Map();

    function setCellSelected(cell, isSelected) {
      if (cell.dataset.colored === 'true') {
        // Colored cells keep their fill/outline; selection is a color-matched
        // outset ring at 50% opacity (like the button's focus ring).
        const ring = ['ring-2', ringClass(cell.dataset.color)];
        if (isSelected) cell.classList.add(...ring);
        else cell.classList.remove(...ring);
      } else if (isSelected) {
        cell.classList.remove(...UNSELECTED_UNCOLORED);
        cell.classList.add(...SELECTED_UNCOLORED);
      } else {
        cell.classList.remove(...SELECTED_UNCOLORED);
        cell.classList.add(...UNSELECTED_UNCOLORED);
      }
      cell.setAttribute('aria-pressed', String(isSelected));
    }

    function sameSelection(a, b) {
      if (a.length !== b.length) return false;
      const set = new Set(a);
      return b.every((k) => set.has(k));
    }

    function selectSlot(key, payload) {
      const prev = selected;
      if (!multiple) {
        selected = prev.includes(key) ? [] : [key];
      } else {
        selected = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      }

      // Update only the cells whose selected state actually changed, in place.
      const next = new Set(selected);
      const prevSet = new Set(prev);
      const changed = new Set([...prev.filter((k) => !next.has(k)), ...selected.filter((k) => !prevSet.has(k))]);
      changed.forEach((k) => {
        const cell = cellByKey.get(k);
        if (cell) setCellSelected(cell, next.has(k));
      });

      const modelVal = multiple ? [...selected] : (selected[0] ?? null);
      if (el._x_model) el._x_model.set(modelVal);

      el.dispatchEvent(
        new CustomEvent('slot-click', {
          bubbles: true,
          detail: { slot: { ...payload, key, selected: next.has(key) } },
        })
      );
    }

    // Build a selectable cell shared by top-level slots and sub-slot tiles. `item`
    // supplies the look (color, description, note, icons, availability); `payload`
    // is the data dispatched on `slot-click`.
    function buildCell({ key, ariaLabel, visibleTime, item, dataSlot, isTile, payload }) {
      const available = item.available !== false;
      const color = resolveColor(item.color);
      const icons = normalizeIcons(item);

      const cell = available ? document.createElement('button') : document.createElement('div');
      cell.setAttribute('data-slot', dataSlot);
      cell.classList.add('relative', 'flex', 'flex-col', 'items-center', 'justify-center', 'gap-0.5', 'rounded-md', 'px-2', 'py-1', 'text-center', 'text-sm', 'transition-colors');
      cell.classList.add(isTile ? 'min-h-9' : 'min-h-10');

      if (color) {
        // status: 'unconfirmed' outlines the cell, 'rejected' outlines it with a
        // dashed border, anything else fills it.
        cell.classList.add(...colorClasses(color, item.status));
        cell.dataset.colored = 'true';
        cell.dataset.color = color;
      } else {
        cell.classList.add('border');
      }

      if (available) {
        cell.type = 'button';
        cell.classList.add('cursor-pointer', 'focus-visible:outline-none', 'focus-visible:ring-[calc(var(--spacing)*0.75)]', 'focus-visible:ring-ring', 'focus-visible:ring-inset');
        cell.setAttribute('aria-label', ariaLabel);
        setCellSelected(cell, selected.includes(key));
        cellByKey.set(key, cell);
      } else {
        // Unavailable colored cells keep their status color (e.g. a booked slot);
        // uncolored ones fall back to the muted style.
        if (!color) cell.classList.add('bg-muted/50', 'text-muted-foreground');
        cell.classList.add('cursor-not-allowed');
        cell.setAttribute('aria-disabled', 'true');
      }

      if (visibleTime) {
        const timeSpan = document.createElement('span');
        timeSpan.setAttribute('data-slot', 'slot-picker-time');
        timeSpan.classList.add('text-sm', 'font-medium', 'leading-tight');
        timeSpan.textContent = visibleTime;
        cell.appendChild(timeSpan);
      }

      if (item.description) {
        const desc = document.createElement('span');
        desc.setAttribute('data-slot', 'slot-picker-desc');
        desc.classList.add('text-sm', 'line-clamp-1');
        desc.textContent = item.description;
        cell.appendChild(desc);
      }

      if (item.note) {
        const note = document.createElement('span');
        note.setAttribute('data-slot', 'slot-picker-note');
        note.classList.add('text-xs', 'line-clamp-1');
        note.textContent = item.note;
        cell.appendChild(note);
      }

      // Keep the full text reachable for pointer users when a line-clamp truncates it.
      const titleText = [item.description, item.note].filter(Boolean).join(' - ');
      if (titleText) cell.title = titleText;

      if (!available) {
        const srUnavailable = document.createElement('span');
        srUnavailable.classList.add('sr-only');
        srUnavailable.textContent = `, ${el.getAttribute('data-unavailable-label') || 'Not available'}`;
        cell.appendChild(srUnavailable);
      }

      const leftBadge = makeIconBadge(icons.left, 'left-1');
      if (leftBadge) cell.appendChild(leftBadge);
      const rightBadge = makeIconBadge(icons.right, 'right-1');
      if (rightBadge) cell.appendChild(rightBadge);

      if (available) {
        cell.addEventListener('click', () => selectSlot(key, payload));
      }

      return cell;
    }

    // Build a group container for a slot that holds sub-slot tiles. The slot's own
    // time labels the group; each tile is an individually selectable cell.
    function buildGroup({ dateStr, dayLabel, slot }) {
      const groupTime = slot.end ? `${slot.start} to ${slot.end}` : slot.start;

      const container = document.createElement('div');
      container.setAttribute('data-slot', 'slot-picker-slot');
      container.classList.add('relative', 'flex', 'flex-col', 'overflow-hidden', 'rounded-md', 'border');
      container.setAttribute('role', 'group');
      const headerId = `hspg${uuidv4()}`;
      container.setAttribute('aria-labelledby', headerId);

      const header = document.createElement('div');
      header.setAttribute('data-slot', 'slot-picker-slot-header');
      header.setAttribute('id', headerId);
      header.classList.add('text-center', 'px-2', 'py-1', 'text-sm', 'font-medium');

      const headerTime = document.createElement('span');
      headerTime.textContent = slot.start;
      header.appendChild(headerTime);
      if (slot.description) {
        const headerDesc = document.createElement('span');
        headerDesc.classList.add('text-muted-foreground', 'truncate');
        headerDesc.textContent = slot.description;
        header.appendChild(headerDesc);
      }
      container.appendChild(header);

      const tileWrap = document.createElement('div');
      // Padding + gap give each tile's outset selection ring room inside the
      // group's overflow-hidden bounds.
      tileWrap.classList.add('flex', 'flex-col', 'gap-1', 'p-1');

      slot.tiles.forEach((tile, i) => {
        const key = tileKey(dateStr, slot.start, i);
        const tileTime = tile.start ? (tile.end ? `${tile.start} to ${tile.end}` : tile.start) : groupTime;
        const descPart = tile.description ? `, ${tile.description}` : `, Option ${i + 1}`;
        const cell = buildCell({
          key,
          ariaLabel: `${dayLabel}, ${tileTime}${descPart}`,
          visibleTime: tile.start || null,
          item: tile,
          dataSlot: 'slot-picker-tile',
          isTile: true,
          payload: {
            date: dateStr,
            start: tile.start ?? slot.start,
            end: tile.end ?? slot.end,
            available: tile.available !== false,
            description: tile.description ?? null,
            note: tile.note ?? null,
            color: tile.color ?? null,
            status: tile.status ?? null,
            tileIndex: i,
          },
        });
        tileWrap.appendChild(cell);
      });

      container.appendChild(tileWrap);
      return container;
    }

    // Now indicator: a red dot + hairline row inside today's slot list, sitting
    // below every slot that has already started. A single timeout aimed at the
    // next slot boundary (or midnight) keeps it moving without polling.

    let nowTimer = null;
    let nowIndicatorEl = null;
    let todaySlotList = null;
    let todayEntries = [];
    let renderedTodayStr = null;

    function buildNowIndicator() {
      const indicator = document.createElement('div');
      indicator.setAttribute('data-slot', 'slot-picker-now');
      indicator.setAttribute('aria-hidden', 'true');
      // -mx-2 cancels the slot list's p-2 so the line runs edge to edge.
      indicator.classList.add('flex', 'items-center', 'pointer-events-none', '-mx-2', 'overflow-visible', 'h-px');
      const dot = document.createElement('div');
      dot.classList.add('size-2', 'rounded-full', 'bg-red-500', 'flex-none');
      const line = document.createElement('div');
      line.classList.add('flex-1', 'h-px', 'bg-red-500');
      indicator.append(dot, line);
      return indicator;
    }

    // Insert the indicator before the first upcoming slot and return the
    // minutes-since-midnight of its next move: that slot's start, or midnight
    // when nothing is upcoming.
    function positionNowIndicator() {
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const next = todayEntries.find((e) => e.startMins > nowMins);
      todaySlotList.insertBefore(nowIndicatorEl, next ? next.el : null);
      return next ? next.startMins : 24 * 60;
    }

    // setHours rolls a boundary of 1440 over to next-day 00:00.
    function scheduleNowTick(boundaryMins) {
      clearTimeout(nowTimer);
      const now = new Date();
      const target = new Date(now);
      target.setHours(0, boundaryMins, 0, 0);
      nowTimer = setTimeout(nowTick, Math.max(target - now, 1000));
    }

    function nowTick() {
      // Crossing midnight changes which column is today, so re-render; otherwise
      // move only the indicator element, which never disturbs keyboard focus.
      if (!todaySlotList || toDateString(new Date()) !== renderedTodayStr) render();
      else scheduleNowTick(positionNowIndicator());
    }

    // Render

    const dtf = createDateTimeFormatCache();

    function render() {
      const days = Array.from({ length: dayCount }, (_, i) => addDays(currentDate, i));

      // Reset the now-indicator bookkeeping; today's column repopulates it below.
      const now = new Date();
      clearTimeout(nowTimer);
      nowIndicatorEl = null;
      todaySlotList = null;
      todayEntries = [];
      renderedTodayStr = toDateString(now);

      // Heading: exposed as reactive state; an x-h-slot-picker-title control renders it.
      const shortFmt = dtf(locale, { day: 'numeric', month: 'short' });
      const longFmt = dtf(locale, { day: 'numeric', month: 'short', year: 'numeric' });
      state.title = days.length === 1 ? longFmt.format(days[0]) : `${shortFmt.format(days[0])} - ${longFmt.format(days[days.length - 1])}`;

      dayGrid.className = '';
      dayGrid.classList.add('grid', 'grid-cols-1', `md:grid-cols-${dayCount}`, 'divide-y', 'md:divide-y-0', 'md:divide-x');

      dayGrid.innerHTML = '';
      cellByKey.clear();

      const dayNameFmt = dtf(locale, { weekday: 'long' });
      const dateFmt = dtf(locale, { day: 'numeric', month: 'long' });

      days.forEach((day) => {
        const dateStr = toDateString(day);
        const today = isToday(day);
        const dayLabel = `${dayNameFmt.format(day)}, ${dateFmt.format(day)}`;

        // Day column - a labeled group so the day is announced for its slots.
        const col = document.createElement('div');
        col.classList.add('flex', 'flex-col');

        // Day header: 2 rows (day name + localized date)
        const hdr = document.createElement('div');
        hdr.classList.add('sticky', 'top-0', 'border-b', 'p-2', 'text-center', 'bg-background', 'z-10');
        hdr.setAttribute('data-slot', 'slot-picker-header');
        const headerId = `hsp${uuidv4()}`;
        hdr.setAttribute('id', headerId);
        col.setAttribute('role', 'group');
        col.setAttribute('aria-labelledby', headerId);

        const nameEl = document.createElement('div');
        nameEl.classList.add('text-sm', 'font-semibold', 'leading-tight');
        nameEl.textContent = dayNameFmt.format(day);

        const dateEl = document.createElement('div');
        dateEl.classList.add('text-xs', 'text-muted-foreground');
        dateEl.textContent = dateFmt.format(day);

        const dayDisabled = isDayDisabled(dateStr, day.getDay()) || isDayOutOfRange(day);
        if (today && !dayDisabled) nameEl.classList.add('text-primary');

        hdr.append(nameEl, dateEl);
        col.appendChild(hdr);

        if (dayDisabled) {
          const placeholder = document.createElement('div');
          placeholder.classList.add('flex', 'flex-1', 'items-center', 'justify-center', 'py-4', 'text-sm', 'text-muted-foreground');
          placeholder.textContent = el.getAttribute('data-unavailable-label') || 'Not available';
          col.appendChild(placeholder);
          dayGrid.appendChild(col);
          return;
        }

        // Slot list: a chronological vertical stack per day.
        const slotList = document.createElement('div');
        slotList.classList.add('flex', 'flex-col', 'gap-1', 'p-2');

        const slots = getSlotsForDay(dateStr);
        const trackNow = showNowIndicator && today;

        slots.forEach((slot) => {
          let node;
          if (Array.isArray(slot.tiles) && slot.tiles.length) {
            node = buildGroup({ dateStr, dayLabel, slot });
          } else {
            const key = slotKey(dateStr, slot.start);
            const timeLabel = slot.end ? `${slot.start} to ${slot.end}` : slot.start;
            const descPart = slot.description ? `, ${slot.description}` : '';
            node = buildCell({
              key,
              ariaLabel: `${dayLabel}, ${timeLabel}${descPart}`,
              visibleTime: slot.start,
              item: slot,
              dataSlot: 'slot-picker-cell',
              isTile: false,
              payload: {
                date: dateStr,
                start: slot.start,
                end: slot.end,
                available: slot.available !== false,
                description: slot.description ?? null,
                note: slot.note ?? null,
                color: slot.color ?? null,
                status: slot.status ?? null,
                tileIndex: null,
              },
            });
          }
          slotList.appendChild(node);
          // The now indicator is positioned against these start times; a start-less
          // slot counts as already started (timeToMins would throw on it).
          if (trackNow) todayEntries.push({ el: node, startMins: slot.start ? timeToMins(slot.start) : -1 });
        });

        if (trackNow) {
          todaySlotList = slotList;
          nowIndicatorEl = buildNowIndicator();
        }

        col.appendChild(slotList);
        dayGrid.appendChild(col);
      });

      // Place the indicator and arm a single timeout for its next move. When today
      // is not visible but tomorrow is, the midnight tick re-renders so the
      // indicator appears in the new today column.
      if (showNowIndicator) {
        if (todaySlotList) scheduleNowTick(positionNowIndicator());
        else if (days.some((d) => toDateString(d) === toDateString(addDays(now, 1)))) scheduleNowTick(24 * 60);
      }

      updateNavState();
    }

    // Calendar popover: jump the first day to any date via the shared calendar widget.
    // Built lazily on the first x-h-slot-picker-calendar registration, so a picker whose
    // toolbar has no calendar control never creates the popover or its month grid.
    let calState = null;
    let calPopover = null;
    let calWidget = null;
    let closeCalendar = null;
    let syncCalendarToCurrent;
    // The calendar's own change event is internal, so keep it from bubbling out as a
    // slot-picker change. Defined once, wired only when the popover is built.
    const containChange = (event) => event.stopPropagation();

    function createCalPopover() {
      if (calPopover) return;

      calState = Alpine.reactive({ expanded: false });

      calPopover = document.createElement('div');
      calPopover.setAttribute('id', calControls);
      calPopover.setAttribute('role', 'dialog');
      calPopover.setAttribute('tabindex', '-1');
      calPopover.setAttribute('data-align', 'bottom-end');
      calPopover.setAttribute('data-slot', 'slot-picker-calendar');
      // Stay hidden until the registered trigger's setupPopover takes over.
      calPopover.classList.add('hidden');
      el.appendChild(calPopover);
      calPopover.addEventListener('change', containChange);

      // Forward the host's calendar nav labels onto the popover so the widget's prev/next
      // month/year buttons can be localized. Without this they fall back to English.
      forwardCalendarNavAria(el, calPopover);

      let syncingCalendar = false;
      calWidget = createCalendarWidget('x-h-slot-picker', calPopover, {
        Alpine,
        onSelectionChanged: () => {
          if (syncingCalendar) return;
          const selectedDate = calWidget.getSelected();
          if (selectedDate) {
            currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            clampCurrentDate();
            render();
          }
          calState.expanded = false;
          calAnchor?.focus();
        },
        onEscape: () => {
          calState.expanded = false;
          calAnchor?.focus();
        },
        onInvalidModel: () => {},
        onModelValid: () => {},
        stopNavPropagation: true,
        tableFullWidth: false,
      });
      // Catch up on any locale/bounds config applied before this widget existed.
      calWidget.setConfig({ locale, min: minDate ?? undefined, max: maxDate ?? undefined });

      // Reflect the current first day in the calendar without firing a selection.
      syncCalendarToCurrent = () => {
        syncingCalendar = true;
        calWidget.setSelectedAndSync(new Date(currentDate));
        calWidget.render();
        syncingCalendar = false;
      };

      closeCalendar = (event) => {
        if (event && (eventInsidePicker(calPopover, event) || eventInsidePicker(calAnchor, event))) return;
        calState.expanded = false;
        removeDismiss(el, 'click', closeCalendar);
      };
    }

    // An x-h-slot-picker-calendar control registers its button here. The picker owns the
    // popover, widget, and dismiss. It builds the popover on first use, anchors it to the
    // trigger, names the dialog after the trigger, and wires the toggle using the control's
    // own effect/cleanup so teardown follows it.
    state.registerCalendar = (button, ctx) => {
      createCalPopover();
      calAnchor = button;
      if (!button.id) button.id = `hspb${uuidv4()}`;
      button.setAttribute('aria-haspopup', 'dialog');
      button.setAttribute('aria-controls', calControls);
      // The dialog takes its accessible name from the trigger button.
      calPopover.setAttribute('aria-labelledby', button.id);
      setupPopover(calPopover, {
        anchor: button,
        pickerState: { state: calState },
        Alpine,
        effect: ctx.effect,
        cleanup: ctx.cleanup,
        onOpen: () => {
          syncCalendarToCurrent();
          calWidget.focusDay();
        },
      });
      const onCalBtn = () => {
        calState.expanded = !calState.expanded;
        Alpine.nextTick(() => {
          if (calState.expanded) addDismiss(el, 'click', closeCalendar);
          else removeDismiss(el, 'click', closeCalendar);
        });
      };
      button.addEventListener('click', onCalBtn);
      ctx.effect(() => button.setAttribute('aria-expanded', String(calState.expanded)));
      ctx.cleanup(() => button.removeEventListener('click', onCalBtn));
    };

    // Config

    function setConfig(config) {
      if (!config) return;
      if (config.date !== undefined) {
        currentDate = new Date(config.date);
        currentDate.setHours(0, 0, 0, 0);
      }
      if (config.days !== undefined) {
        const n = Math.round(Number(config.days));
        dayCount = Number.isFinite(n) ? Math.min(7, Math.max(1, n)) : 3;
      }
      if (config.start !== undefined) slotStart = config.start;
      if (config.end !== undefined) slotEnd = config.end;
      if (config.step !== undefined) slotStep = Number(config.step);
      if (config.slots !== undefined) explicitSlots = config.slots.length ? config.slots : null;
      if (config.fillEmptyDays !== undefined) fillEmptyDays = !!config.fillEmptyDays;
      if (config.multiple !== undefined) multiple = !!config.multiple;
      if (config.showNowIndicator !== undefined) showNowIndicator = !!config.showNowIndicator;
      if (config.locale !== undefined) {
        locale = config.locale;
        if (calWidget) calWidget.setConfig({ locale });
      }
      if (config.disabledDates !== undefined) disabledDates = Array.isArray(config.disabledDates) ? config.disabledDates : [];
      if (config.disabledDays !== undefined) disabledDays = Array.isArray(config.disabledDays) ? config.disabledDays : [];
      let boundsChanged = false;
      if (config.minDate !== undefined) {
        minDate = config.minDate ? toMidnight(config.minDate) : null;
        boundsChanged = true;
      }
      if (config.maxDate !== undefined) {
        maxDate = config.maxDate ? toMidnight(config.maxDate) : null;
        boundsChanged = true;
      }
      // Mirror the bounds onto the calendar popover so out-of-range days can't be picked there either.
      if (boundsChanged && calWidget) calWidget.setConfig({ locale, min: minDate ?? undefined, max: maxDate ?? undefined });
      clampCurrentDate();
    }

    if (expression) {
      const evaluate = evaluateLater(expression);
      effect(() =>
        evaluate((config) => {
          setConfig(config);
          render();
        })
      );
    } else {
      render();
    }

    // x-model: sync selection from an external value. A click already updates
    // cells in place and writes the model, so skip the rebuild when nothing changed.
    effect(() => {
      if (!el._x_model) return;
      const val = el._x_model.get();
      const desired = val === null || val === undefined || val === '' ? [] : Array.isArray(val) ? val.map(String) : [String(val)];
      if (sameSelection(desired, selected)) return;
      selected = desired;
      render();
    });

    cleanup(() => {
      clearTimeout(nowTimer);
      if (calPopover) {
        calWidget.cleanup();
        calPopover.removeEventListener('change', containChange);
        removeDismiss(el, 'click', closeCalendar);
      }
    });
  });

  Alpine.directive('h-slot-picker-previous', (el, { original }, { effect, cleanup, Alpine }) => {
    const host = findAncestorState(Alpine, el, '_h_slot_picker');
    if (!host) throw new Error(`${original} must be inside a slot picker`);
    const api = host._h_slot_picker;
    const onClick = () => api.previous();
    el.addEventListener('click', onClick);
    effect(() => {
      const disabled = !api.canPrev;
      el.disabled = disabled;
      el.setAttribute('aria-disabled', String(disabled));
    });
    cleanup(() => el.removeEventListener('click', onClick));
  });

  Alpine.directive('h-slot-picker-next', (el, { original }, { effect, cleanup, Alpine }) => {
    const host = findAncestorState(Alpine, el, '_h_slot_picker');
    if (!host) throw new Error(`${original} must be inside a slot picker`);
    const api = host._h_slot_picker;
    const onClick = () => api.next();
    el.addEventListener('click', onClick);
    effect(() => {
      const disabled = !api.canNext;
      el.disabled = disabled;
      el.setAttribute('aria-disabled', String(disabled));
    });
    cleanup(() => el.removeEventListener('click', onClick));
  });

  Alpine.directive('h-slot-picker-today', (el, { original }, { cleanup, Alpine }) => {
    const host = findAncestorState(Alpine, el, '_h_slot_picker');
    if (!host) throw new Error(`${original} must be inside a slot picker`);
    const api = host._h_slot_picker;
    const onClick = () => api.today();
    el.addEventListener('click', onClick);
    cleanup(() => el.removeEventListener('click', onClick));
  });

  Alpine.directive('h-slot-picker-title', (el, { original }, { effect, Alpine }) => {
    const host = findAncestorState(Alpine, el, '_h_slot_picker');
    if (!host) throw new Error(`${original} must be inside a slot picker`);
    const api = host._h_slot_picker;
    el.classList.add('flex-1', 'text-sm', 'font-semibold', 'text-center');
    if (!el.hasAttribute('aria-live')) el.setAttribute('aria-live', 'polite');
    el.setAttribute('data-slot', 'slot-picker-title');
    effect(() => {
      el.textContent = api.title;
    });
  });

  Alpine.directive('h-slot-picker-calendar', (el, { original }, { effect, cleanup, Alpine }) => {
    const host = findAncestorState(Alpine, el, '_h_slot_picker');
    if (!host) throw new Error(`${original} must be inside a slot picker`);
    host._h_slot_picker.registerCalendar(el, { effect, cleanup });
  });
}
