import { findAncestorState } from '../common/ancestor';
import { createCalendarWidget, forwardCalendarNavAria, isToday, toDateString } from '../common/calendar';
import { capturePointer, DRAG_THRESHOLD, releasePointer } from '../common/drag';
import { colorClasses, EVENT_COLORS, ringClass } from '../common/event-colors';
import { createDateTimeFormatCache } from '../common/intl';
import { eventInsidePicker, setupPopover } from '../common/picker-popover';
import { minsToTime, timeToMins } from '../common/time';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import { resolveLocale } from '../utils/language';
import uuidv4 from '../utils/uuid';

export default function (Alpine) {
  Alpine.directive('h-slot-picker', (el, { expression, modifiers }, { effect, evaluateLater, cleanup, Alpine }) => {
    el.classList.add('relative', 'flex', 'flex-col', 'bg-background', 'text-foreground');
    el.setAttribute('data-slot', 'slot-picker');
    // Expose the picker as a labeled group. Respect an author-provided aria-label.
    el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Time slot picker');

    // `.responsive` opts into collapsing the day columns into a single stacked
    // column on narrow screens. Without it the columns never collapse.
    const responsive = modifiers.includes('responsive');

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
    let locale = resolveLocale();
    let disabledDates = [];
    let disabledDays = [];
    let minDate = null;
    let maxDate = null;
    let showNowIndicator = false;
    let draggable = false;
    // Set when a drag just completed so the click that follows it does not select.
    let suppressClick = false;
    // Ends any in-flight drag gesture (its move/up listeners live on window).
    let abortDrag = null;

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
      // day. Anchor at minDate and let render disable the overflowing days.
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
        // Explicit slots override a day. Days without any fall back to the
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

    // A colored slot is "filled" (solid background) for any status other than the
    // two outline statuses - the same split colorClasses() uses. Only filled
    // colored slots get the selected border while outlined ones (unconfirmed/rejected)
    // keep the ring alone.
    function isFilledStatus(status) {
      return status !== 'unconfirmed' && status !== 'rejected';
    }

    // Selection state, applied to cells in place (no full re-render on click).

    // Selection is opt-in: a slot is selectable only when the consumer bound an
    // x-model. Without one, cells stay clickable action buttons (they still fire
    // slot-click) but never enter a selected state. Read live so it does not
    // depend on x-model's directive-init order relative to this one.
    const hasModel = () => Object.prototype.hasOwnProperty.call(el, '_x_model');

    const SELECTED_UNCOLORED = ['bg-primary', 'text-primary-foreground', 'border-transparent', 'hover:bg-primary-hover'];
    const UNSELECTED_UNCOLORED = ['hover:bg-secondary-hover', 'hover:text-secondary-foreground'];
    const cellByKey = new Map();

    function setCellSelected(cell, isSelected) {
      if (cell.getAttribute('data-colored') === 'true') {
        // Colored cells keep their fill/outline; selection is a color-matched
        // outset ring at 50% opacity (like the button's focus ring).
        const ring = ['ring-[calc(var(--spacing)*0.75)]', ringClass(cell.getAttribute('data-color'))];
        if (isSelected) cell.classList.add(...ring);
        else cell.classList.remove(...ring);
        // Filled colored cells also gain a contrasting border on selection
        // (like the step indicator's active marker: ring = fill, border = text).
        // The transparent border is already on the cell (buildCell) so recoloring
        // it causes no layout shift. Outlined statuses keep their own border.
        if (isFilledStatus(cell.getAttribute('data-status'))) {
          cell.classList.toggle('border-transparent', !isSelected);
          cell.classList.toggle('border-background', isSelected);
        }
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
      // Without a bound model the slot is a plain action button: announce the
      // click but never track selection or write a model. `selected` is always
      // false here because the slot can never enter the selection set.
      if (!hasModel()) {
        el.dispatchEvent(
          new CustomEvent('slot-click', {
            bubbles: true,
            detail: { slot: { ...payload, key, selected: false } },
          })
        );
        return;
      }

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
      el._x_model.set(modelVal);

      el.dispatchEvent(
        new CustomEvent('slot-click', {
          bubbles: true,
          detail: { slot: { ...payload, key, selected: next.has(key) } },
        })
      );
    }

    // Build a selectable cell shared by top-level slots and sub-slot tiles. `item`
    // supplies the look (color, description, note, icons, availability).
    // `payload` is the data dispatched on `slot-click`.
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
        cell.setAttribute('data-colored', 'true');
        cell.setAttribute('data-color', color);
        cell.setAttribute('data-status', item.status || '');
        // A filled colored cell has no border of its own. Carry a transparent one
        // so selection can recolor it (to border-background) without a layout
        // shift. Outlined statuses already have their own border from colorClasses.
        if (isFilledStatus(item.status)) cell.classList.add('border', 'border-transparent');
      } else {
        cell.classList.add('border');
      }

      if (available) {
        cell.type = 'button';
        cell.classList.add('bg-background', 'cursor-pointer', 'focus-visible:outline-none', 'focus-visible:ring-[calc(var(--spacing)*0.75)]', 'focus-visible:ring-ring/50');
        cell.setAttribute('aria-label', ariaLabel);
        if (hasModel()) {
          setCellSelected(cell, selected.includes(key));
        } else if (!color) {
          // No model: a plain action button. Keep the interactive hover styling
          // but add no aria-pressed and no selected fill/ring. Colored cells
          // already carry their base color from colorClasses above.
          cell.classList.add(...UNSELECTED_UNCOLORED);
        }
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
        cell.addEventListener('click', () => {
          if (suppressClick) {
            suppressClick = false;
            return;
          }
          selectSlot(key, payload);
        });
      }

      return cell;
    }

    // === Drag and drop ===
    // Sortable rescheduling: while a slot is dragged, a half-opacity ghost clone
    // follows the pointer and the slot itself (dimmed) relocates live through
    // the day lists as the placeholder, so the surrounding slots part exactly
    // where the drop would land. The picker's own data never changes: a
    // completed drag dispatches `slot-drop` with the proposed day, position,
    // and a ready-to-assign `slots` array, and the consumer applies it (or
    // ignores the event to reject the move).

    const SLOT_SELECTOR = '[data-slot="slot-picker-cell"], [data-slot="slot-picker-slot"]';

    // Dragging needs an array to reorder, so only slots taken directly from the
    // consumer's `slots` config qualify (generated slots are fresh objects each
    // render and never match).
    function canDrag(item) {
      return draggable && item.available !== false && item.draggable !== false && !!explicitSlots && explicitSlots.includes(item);
    }

    // The slot nodes of a day list in display order: cells and tile groups only,
    // skipping the now indicator (and the dragged node when `except` is given).
    function slotChildren(list, except) {
      return Array.from(list.children).filter((c) => c !== except && c.matches(SLOT_SELECTOR));
    }

    // The proposed new slots array for a drop: the consumer's array with the
    // dragged raw slot removed, shallow-copied onto the target date, and spliced
    // in before the target day's index-th slot (after the day's last slot when
    // index runs past it, at the array end when the day has no explicit slots).
    // Never mutates the consumer's array or objects.
    function buildProposedSlots(raw, date, index) {
      const next = explicitSlots.filter((s) => s !== raw);
      const dayPositions = [];
      next.forEach((s, i) => {
        if (s.date === date) dayPositions.push(i);
      });
      const at = !dayPositions.length ? next.length : index >= dayPositions.length ? dayPositions[dayPositions.length - 1] + 1 : dayPositions[index];
      next.splice(at, 0, { ...raw, date });
      return next;
    }

    // The slot/tile payload dispatched on slot-click and slot-drop.
    function slotPayload(dateStr, slot) {
      return {
        date: dateStr,
        start: slot.start,
        end: slot.end,
        available: slot.available !== false,
        description: slot.description ?? null,
        note: slot.note ?? null,
        color: slot.color ?? null,
        status: slot.status ?? null,
        tileIndex: null,
      };
    }

    // Enabled day columns of the current render, hit-tested by rect so day
    // targeting works for both the side-by-side and the stacked responsive
    // layout. Disabled and out-of-range days are never listed, so they can
    // never become drop targets.
    let dayCols = [];

    function resolveDayColumn(x, y) {
      // Clamp the pointer into the day grid so a drag just past an edge (for
      // example below a short column) still targets the nearest day, like the
      // calendar's cell resolution. Skipped without layout (test environments).
      const grid = dayGrid.getBoundingClientRect();
      if (grid.width > 0 && grid.height > 0) {
        x = Math.min(Math.max(x, grid.left), grid.right - 1);
        y = Math.min(Math.max(y, grid.top), grid.bottom - 1);
      }
      for (const c of dayCols) {
        const r = c.el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0 && x >= r.left && x < r.right && y >= r.top && y < r.bottom) return c;
      }
      return null;
    }

    function attachSlotDrag(node, { raw, payload, key, suppress = false, canStart }) {
      node.addEventListener('pointerdown', (e) => {
        if (e.button > 0) return;
        if (canStart && !canStart(e)) return;
        suppressClick = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const srcRect = node.getBoundingClientRect();
        const homeList = node.parentNode;
        // The restore anchor must be a slot, not the now indicator, which can
        // move on its own while the drag is in flight.
        let homeNext = node.nextElementSibling;
        while (homeNext && !homeNext.matches(SLOT_SELECTOR)) homeNext = homeNext.nextElementSibling;
        const origIdx = slotChildren(homeList).indexOf(node);
        let dragging = false;
        let ghost = null;
        let toRem = null;
        let pending = null;

        const place = (list, ref) => {
          if (node.parentNode === list && node.nextSibling === ref) return;
          list.insertBefore(node, ref);
        };
        const restoreHome = () => place(homeList, homeNext && homeNext.parentNode === homeList ? homeNext : null);

        const move = (me) => {
          if (!node.isConnected) return finish(false);
          if (!dragging) {
            if (Math.abs(me.clientX - startX) < DRAG_THRESHOLD && Math.abs(me.clientY - startY) < DRAG_THRESHOLD) return;
            dragging = true;
            const base = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            toRem = (px) => `${px / base}rem`;
            // Clone before dimming the source so the ghost keeps the slot's
            // resting look.
            ghost = node.cloneNode(true);
            ghost.setAttribute('data-slot', 'slot-picker-ghost');
            ghost.setAttribute('aria-hidden', 'true');
            ghost.setAttribute('inert', '');
            // Cells carry `relative`, which would win over `absolute` and leave
            // the ghost in the flow.
            ghost.classList.remove('relative');
            ghost.classList.add('absolute', 'opacity-50', 'pointer-events-none', 'z-50', 'shadow-lg');
            ghost.style.width = toRem(srcRect.width);
            ghost.style.height = toRem(srcRect.height);
            el.appendChild(ghost);
            node.setAttribute('data-dragging', 'true');
            node.classList.add('opacity-50');
          }
          // Nudge the scroll body when the pointer nears its edges, before any
          // rect reads so the same move lands consistently.
          const sRect = scrollBody.getBoundingClientRect();
          if (sRect.height > 0) {
            if (me.clientY < sRect.top + 40) scrollBody.scrollTop -= 15;
            else if (me.clientY > sRect.bottom - 40) scrollBody.scrollTop += 15;
          }
          const elRect = el.getBoundingClientRect();
          ghost.style.left = toRem(me.clientX - elRect.left - (startX - srcRect.left));
          ghost.style.top = toRem(me.clientY - elRect.top - (startY - srcRect.top));
          const target = resolveDayColumn(me.clientX, me.clientY);
          if (!target) {
            restoreHome();
            pending = null;
            return;
          }
          const kids = slotChildren(target.list, node);
          const ref =
            kids.find((k) => {
              const r = k.getBoundingClientRect();
              return r.top + r.height / 2 > me.clientY;
            }) ?? null;
          place(target.list, ref);
          pending = { date: target.date, index: ref ? kids.indexOf(ref) : kids.length };
        };

        const finish = (commit) => {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          window.removeEventListener('pointercancel', cancel);
          abortDrag = null;
          releasePointer(node, e);
          if (!dragging) return;
          ghost.remove();
          restoreHome();
          node.removeAttribute('data-dragging');
          node.classList.remove('opacity-50');
          // The drag may have parked the node past the now indicator. Re-seat it.
          if (nowIndicatorEl && todaySlotList) positionNowIndicator();
          if (!commit) return;
          if (suppress) suppressClick = true;
          if (!pending || !node.isConnected) return;
          // Reinserting at the original position leaves the order unchanged.
          if (pending.date === payload.date && pending.index === origIdx) return;
          if (!explicitSlots || !explicitSlots.includes(raw)) return;
          el.dispatchEvent(
            new CustomEvent('slot-drop', {
              bubbles: true,
              detail: { slot: { ...payload, key }, date: pending.date, index: pending.index, slots: buildProposedSlots(raw, pending.date, pending.index) },
            })
          );
        };
        const up = () => finish(true);
        const cancel = () => finish(false);

        // Relocating the node clears pointer capture (removal from the tree),
        // so the gesture listeners must live on window. Capture stays on as a
        // best effort against text selection and stray hovers.
        capturePointer(node, e);
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', cancel);
        abortDrag = () => finish(false);
      });
    }

    // Build a group container for a slot that holds sub-slot tiles. The slot's own
    // time labels the group. Each tile is an individually selectable cell.
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
      header.classList.add('text-center', 'px-2', 'py-1.5', 'text-sm', 'font-medium', 'border-b');

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
      tileWrap.classList.add('flex', 'flex-col', 'gap-1.5', 'p-1.5');

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
      // A dragged slot can be parked in another column mid-drag, so anchor only
      // on entries still in today's list.
      const next = todayEntries.find((e) => e.startMins > nowMins && e.el.parentNode === todaySlotList);
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
      // Crossing midnight changes which column is today, so re-render. Otherwise
      // move only the indicator element, which never disturbs keyboard focus.
      if (!todaySlotList || toDateString(new Date()) !== renderedTodayStr) render();
      else scheduleNowTick(positionNowIndicator());
    }

    // Render

    const dtf = createDateTimeFormatCache();

    function render() {
      const days = Array.from({ length: dayCount }, (_, i) => addDays(currentDate, i));

      // Reset the now-indicator bookkeeping. Today's column repopulates it below.
      const now = new Date();
      clearTimeout(nowTimer);
      nowIndicatorEl = null;
      todaySlotList = null;
      todayEntries = [];
      renderedTodayStr = toDateString(now);

      // Heading: exposed as reactive state. `x-h-slot-picker-title` control renders it.
      const shortFmt = dtf(locale, { day: 'numeric', month: 'short' });
      const longFmt = dtf(locale, { day: 'numeric', month: 'short', year: 'numeric' });
      state.title = days.length === 1 ? longFmt.format(days[0]) : `${shortFmt.format(days[0])} - ${longFmt.format(days[days.length - 1])}`;

      dayGrid.className = '';
      if (responsive) {
        // Opt-in: collapse to a single stacked column below md, then dayCount
        // columns at md and up (md: switches the dividers from horizontal to vertical).
        dayGrid.classList.add('grid', 'grid-cols-1', `md:grid-cols-${dayCount}`, 'divide-y', 'md:divide-y-0', 'md:divide-x');
      } else {
        // Default: never collapse. Always dayCount columns with vertical dividers.
        // Columns shrink to fit on a narrow container.
        dayGrid.classList.add('grid', `grid-cols-${dayCount}`, 'divide-x');
      }

      dayGrid.innerHTML = '';
      cellByKey.clear();
      dayCols = [];

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
        hdr.classList.add('sticky', 'top-0', 'border-b', 'p-2', 'text-center', 'bg-background', 'z-1');
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
        dayCols.push({ el: col, date: dateStr, list: slotList });

        const slots = getSlotsForDay(dateStr);
        const trackNow = showNowIndicator && today;

        slots.forEach((slot) => {
          let node;
          if (Array.isArray(slot.tiles) && slot.tiles.length) {
            node = buildGroup({ dateStr, dayLabel, slot });
            if (canDrag(slot)) {
              // The group drags as a whole. A press that starts on a tile stays
              // a tile interaction, and no click suppression is needed because
              // the container has no click handler of its own.
              attachSlotDrag(node, {
                raw: slot,
                payload: slotPayload(dateStr, slot),
                key: slotKey(dateStr, slot.start),
                canStart: (e) => !e.target.closest('[data-slot="slot-picker-tile"]'),
              });
            }
          } else {
            const key = slotKey(dateStr, slot.start);
            const timeLabel = slot.end ? `${slot.start} to ${slot.end}` : slot.start;
            const descPart = slot.description ? `, ${slot.description}` : '';
            const payload = slotPayload(dateStr, slot);
            node = buildCell({
              key,
              ariaLabel: `${dayLabel}, ${timeLabel}${descPart}`,
              visibleTime: slot.start,
              item: slot,
              dataSlot: 'slot-picker-cell',
              isTile: false,
              payload,
            });
            if (canDrag(slot)) attachSlotDrag(node, { raw: slot, payload, key, suppress: true });
          }
          slotList.appendChild(node);
          // The now indicator is positioned against these start times. A start-less
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
      if (config.draggable !== undefined) draggable = !!config.draggable;
      if (config.locale !== undefined) {
        locale = resolveLocale(config.locale);
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
      if (!hasModel()) return;
      const val = el._x_model.get();
      const desired = val === null || val === undefined || val === '' ? [] : Array.isArray(val) ? val.map(String) : [String(val)];
      if (sameSelection(desired, selected)) return;
      selected = desired;
      render();
    });

    cleanup(() => {
      abortDrag?.();
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

  Alpine.directive('h-slot-picker-title', (el, { original, modifiers }, { effect, Alpine }) => {
    const host = findAncestorState(Alpine, el, '_h_slot_picker');
    if (!host) throw new Error(`${original} must be inside a slot picker`);
    const api = host._h_slot_picker;
    // `.text-only` suppresses all built-in styling so the consumer can style the
    // title (or its wrapper) themselves. The text, data-slot, and aria-live remain.
    if (!modifiers.includes('text-only')) el.classList.add('flex-1', 'text-sm', 'font-semibold', 'text-center', 'leading-tight', 'line-clamp-3');
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
