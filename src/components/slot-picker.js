import { createCalendarWidget } from '../common/calendar';
import { Calendar, ChevronLeft, ChevronRight, createSvg } from '../common/icons';
import { eventInsidePicker, setupPopover } from '../common/picker-popover';
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
    let slotStart = '08:00';
    let slotEnd = '18:00';
    let slotStep = 60;
    let explicitSlots = null;
    let multiple = false;
    let selected = [];
    let locale = undefined;
    let disabledDates = [];
    let disabledDays = [];

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.classList.add('flex', 'items-center', 'p-1', 'border-b', 'flex-none', 'gap-2');

    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.setAttribute(Alpine.prefixed('h-button'), '');
    prevBtn.setAttribute('data-variant', 'transparent');
    prevBtn.setAttribute('data-size', 'icon');
    prevBtn.setAttribute('aria-label', el.getAttribute('data-aria-prev') || 'Previous');
    prevBtn.appendChild(createSvg({ icon: ChevronLeft, classes: 'size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': 'true', role: 'presentation' } }));

    const todayBtn = document.createElement('button');
    todayBtn.type = 'button';
    todayBtn.textContent = el.getAttribute('data-today-label') || 'Today';
    todayBtn.setAttribute(Alpine.prefixed('h-button'), '');
    todayBtn.setAttribute('data-variant', 'outline');

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.setAttribute(Alpine.prefixed('h-button'), '');
    nextBtn.setAttribute('data-variant', 'transparent');
    nextBtn.setAttribute('data-size', 'icon');
    nextBtn.setAttribute('aria-label', el.getAttribute('data-aria-next') || 'Next');
    nextBtn.appendChild(createSvg({ icon: ChevronRight, classes: 'size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': 'true', role: 'presentation' } }));

    const navGroup = document.createElement('div');
    navGroup.classList.add('flex', 'items-center', 'gap-1');
    navGroup.append(prevBtn, todayBtn, nextBtn);

    const periodLabel = document.createElement('h2');
    periodLabel.classList.add('flex-1', 'text-sm', 'font-semibold', 'text-center');
    periodLabel.setAttribute('aria-live', 'polite');

    const calControls = `hspc${uuidv4()}`;
    const calBtn = document.createElement('button');
    calBtn.type = 'button';
    calBtn.setAttribute(Alpine.prefixed('h-button'), '');
    calBtn.setAttribute('data-variant', 'transparent');
    calBtn.setAttribute('data-size', 'icon');
    calBtn.setAttribute('aria-label', el.getAttribute('data-aria-calendar') || 'Choose date');
    calBtn.setAttribute('aria-haspopup', 'dialog');
    calBtn.setAttribute('aria-expanded', 'false');
    calBtn.setAttribute('aria-controls', calControls);
    calBtn.appendChild(createSvg({ icon: Calendar, classes: 'size-4 shrink-0 pointer-events-none', attrs: { 'aria-hidden': 'true', role: 'presentation' } }));

    toolbar.append(navGroup, periodLabel, calBtn);
    el.appendChild(toolbar);
    Alpine.initTree(toolbar);

    // Scrollable content
    const scrollBody = document.createElement('div');
    scrollBody.classList.add('flex-1', 'overflow-auto', 'min-h-0');
    el.appendChild(scrollBody);

    const dayGrid = document.createElement('div');
    dayGrid.classList.add('grid', 'grid-cols-1', 'md:grid-cols-3', 'divide-y', 'md:divide-y-0', 'md:divide-x');
    scrollBody.appendChild(dayGrid);

    // Helpers

    function addDays(date, n) {
      const d = new Date(date);
      d.setDate(d.getDate() + n);
      return d;
    }

    function toDateStr(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    function timeToMins(t) {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    }

    function minsToTime(mins) {
      return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    }

    function isToday(d) {
      const t = new Date();
      return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
    }

    function slotKey(dateStr, start) {
      return `${dateStr}T${start}`;
    }

    function getSlotsForDay(dateStr) {
      if (explicitSlots) {
        return explicitSlots.filter((s) => s.date === dateStr);
      }
      const slots = [];
      const endMins = timeToMins(slotEnd);
      for (let m = timeToMins(slotStart); m < endMins; m += slotStep) {
        const start = minsToTime(m);
        slots.push({ date: dateStr, start, end: minsToTime(m + slotStep), available: true });
      }
      return slots;
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

    function normalizeIcons(slot) {
      if (slot.icons) return Array.isArray(slot.icons) ? slot.icons : [slot.icons];
      if (slot.icon) return [slot.icon];
      return [];
    }

    function makeIconBadge(icons) {
      if (!icons.length) return null;
      const badge = document.createElement('span');
      badge.classList.add('absolute', 'top-1', 'right-1', 'flex', 'items-center', 'gap-0.5', 'pointer-events-none');
      icons.forEach((icon) => {
        const img = document.createElement('img');
        img.src = icon.url;
        img.alt = icon.alt ?? '';
        img.classList.add('size-3.5', 'shrink-0', 'object-contain');
        badge.appendChild(img);
      });
      return badge;
    }

    // Selection state, applied to cells in place (no full re-render on click).

    const SELECTED_CLASSES = ['bg-primary', 'text-primary-foreground', 'border-transparent', 'hover:bg-primary-hover'];
    const UNSELECTED_CLASSES = ['hover:bg-secondary-hover', 'hover:text-secondary-foreground'];
    const cellByKey = new Map();

    function setCellSelected(cell, isSelected) {
      if (isSelected) {
        cell.classList.remove(...UNSELECTED_CLASSES);
        cell.classList.add(...SELECTED_CLASSES);
      } else {
        cell.classList.remove(...SELECTED_CLASSES);
        cell.classList.add(...UNSELECTED_CLASSES);
      }
      cell.setAttribute('aria-pressed', String(isSelected));
    }

    function sameSelection(a, b) {
      if (a.length !== b.length) return false;
      const set = new Set(a);
      return b.every((k) => set.has(k));
    }

    function selectSlot(key, dateStr, slot) {
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
          detail: { slot: { date: dateStr, start: slot.start, end: slot.end, available: true, selected: next.has(key) } },
        })
      );
    }

    // Render

    function render() {
      const days = Array.from({ length: 3 }, (_, i) => addDays(currentDate, i));

      // Heading
      const shortFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' });
      const longFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' });
      periodLabel.textContent = `${shortFmt.format(days[0])} - ${longFmt.format(days[2])}`;

      dayGrid.innerHTML = '';
      cellByKey.clear();

      const dayNameFmt = new Intl.DateTimeFormat(locale, { weekday: 'long' });
      const dateFmt = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' });

      days.forEach((day) => {
        const dateStr = toDateStr(day);
        const today = isToday(day);
        const dayLabel = `${dayNameFmt.format(day)}, ${dateFmt.format(day)}`;

        // Day column - a labeled group so the day is announced for its slots.
        const col = document.createElement('div');
        col.classList.add('flex', 'flex-col');

        // Day header: 2 rows (day name + localized date)
        const hdr = document.createElement('div');
        hdr.classList.add('sticky', 'top-0', 'border-b', 'p-2', 'text-center');
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

        const dayDisabled = isDayDisabled(dateStr, day.getDay());
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

        // Slot grid: 1 col on mobile, 2 cols on sm+
        const slotGrid = document.createElement('div');
        slotGrid.classList.add('grid', 'grid-cols-1', 'sm:grid-cols-2', 'gap-1', 'p-2');

        const slots = getSlotsForDay(dateStr);

        slots.forEach((slot) => {
          const available = slot.available !== false;
          const key = slotKey(dateStr, slot.start);
          const icons = normalizeIcons(slot);
          const timeLabel = slot.end ? `${slot.start} to ${slot.end}` : slot.start;

          const cell = available ? document.createElement('button') : document.createElement('div');
          cell.setAttribute('data-slot', 'slot-picker-cell');
          cell.classList.add('relative', 'border', 'rounded-md', 'h-10', 'flex', 'items-center', 'justify-center', 'text-sm', 'transition-colors');

          if (available) {
            cell.type = 'button';
            cell.classList.add('cursor-pointer', 'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-inset');
            // Self-describing name (day + time); selection is exposed via aria-pressed.
            cell.setAttribute('aria-label', `${dayLabel}, ${timeLabel}`);
            setCellSelected(cell, selected.includes(key));
            cellByKey.set(key, cell);
          } else {
            cell.classList.add('bg-muted/50', 'text-muted-foreground', 'cursor-not-allowed');
            cell.setAttribute('aria-disabled', 'true');
          }

          const timeSpan = document.createElement('span');
          timeSpan.textContent = slot.start;
          cell.appendChild(timeSpan);

          if (!available) {
            const srUnavailable = document.createElement('span');
            srUnavailable.classList.add('sr-only');
            srUnavailable.textContent = `, ${el.getAttribute('data-unavailable-label') || 'Not available'}`;
            cell.appendChild(srUnavailable);
          }

          const badge = makeIconBadge(icons);
          if (badge) cell.appendChild(badge);

          if (available) {
            cell.addEventListener('click', () => selectSlot(key, dateStr, slot));
          }

          slotGrid.appendChild(cell);
        });

        col.appendChild(slotGrid);
        dayGrid.appendChild(col);
      });
    }

    // Navigation: shift by 3 days
    prevBtn.addEventListener('click', () => {
      currentDate = addDays(currentDate, -3);
      render();
    });
    nextBtn.addEventListener('click', () => {
      currentDate = addDays(currentDate, 3);
      render();
    });
    todayBtn.addEventListener('click', () => {
      currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      render();
    });

    // Calendar popover: jump the first day to any date via the shared calendar widget.
    const calState = Alpine.reactive({ expanded: false });

    const calPopover = document.createElement('div');
    calPopover.setAttribute('id', calControls);
    calPopover.setAttribute('role', 'dialog');
    calPopover.setAttribute('aria-label', el.getAttribute('data-aria-calendar') || 'Choose date');
    calPopover.setAttribute('tabindex', '-1');
    calPopover.setAttribute('data-align', 'bottom-end');
    calPopover.setAttribute('data-slot', 'slot-picker-calendar');

    el.appendChild(calPopover);

    // The calendar's own change event is internal; keep it from bubbling out as a
    // slot-picker change.
    const containChange = (event) => event.stopPropagation();
    calPopover.addEventListener('change', containChange);

    let syncingCalendar = false;
    const calWidget = createCalendarWidget('x-h-slot-picker', calPopover, {
      onSelectionChanged: () => {
        if (syncingCalendar) return;
        const selectedDate = calWidget.getSelected();
        if (selectedDate) {
          currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
          render();
        }
        calState.expanded = false;
        calBtn.focus();
      },
      onEscape: () => {
        calState.expanded = false;
        calBtn.focus();
      },
      onInvalidModel: () => {},
      onModelValid: () => {},
      stopNavPropagation: true,
      tableFullWidth: false,
    });
    calWidget.setConfig({ locale });

    // Reflect the current first day in the calendar without firing a selection.
    function syncCalendarToCurrent() {
      syncingCalendar = true;
      calWidget.setSelectedAndSync(new Date(currentDate));
      calWidget.render();
      syncingCalendar = false;
    }

    setupPopover(calPopover, {
      anchor: calBtn,
      pickerState: { state: calState },
      Alpine,
      effect,
      cleanup,
      onOpen: () => {
        syncCalendarToCurrent();
        calWidget.focusDay();
      },
    });

    const closeCalendar = (event) => {
      if (event && (eventInsidePicker(calPopover, event) || eventInsidePicker(calBtn, event))) return;
      calState.expanded = false;
      removeDismiss(el, 'click', closeCalendar);
    };
    const onCalBtn = () => {
      calState.expanded = !calState.expanded;
      Alpine.nextTick(() => {
        if (calState.expanded) addDismiss(el, 'click', closeCalendar);
        else removeDismiss(el, 'click', closeCalendar);
      });
    };
    calBtn.addEventListener('click', onCalBtn);
    effect(() => calBtn.setAttribute('aria-expanded', String(calState.expanded)));

    // Config

    function setConfig(config) {
      if (!config) return;
      if (config.date !== undefined) {
        currentDate = new Date(config.date);
        currentDate.setHours(0, 0, 0, 0);
      }
      if (config.start !== undefined) slotStart = config.start;
      if (config.end !== undefined) slotEnd = config.end;
      if (config.step !== undefined) slotStep = Number(config.step);
      if (config.slots !== undefined) explicitSlots = config.slots.length ? config.slots : null;
      if (config.multiple !== undefined) multiple = !!config.multiple;
      if (config.locale !== undefined) {
        locale = config.locale;
        calWidget.setConfig({ locale });
      }
      if (config.disabledDates !== undefined) disabledDates = Array.isArray(config.disabledDates) ? config.disabledDates : [];
      if (config.disabledDays !== undefined) disabledDays = Array.isArray(config.disabledDays) ? config.disabledDays : [];
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
      Alpine.destroyTree(toolbar);
      calWidget.cleanup();
      calPopover.removeEventListener('change', containChange);
      calBtn.removeEventListener('click', onCalBtn);
      removeDismiss(el, 'click', closeCalendar);
    });
  });
}
