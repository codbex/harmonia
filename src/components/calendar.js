import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { createCalendarWidget, isToday, nextFocusDate, parseDateValue, sameDay, toDateString } from '../common/calendar';
import { ChevronDown, ChevronLeft, ChevronRight, createSvg } from '../common/icons';
import { createDateTimeFormatCache } from '../common/intl';
import uuidv4 from '../utils/uuid';

export default function (Alpine) {
  Alpine.directive('h-calendar-inline', (el, { expression }, { effect, evaluateLater, cleanup }) => {
    el.classList.add('gap-2', 'p-2', 'overflow-visible', 'data-[invalid=true]:inset-ring-negative/20', 'dark:data-[invalid=true]:inset-ring-negative/40');
    el.setAttribute('tabindex', '-1');

    const widget = createCalendarWidget('x-h-calendar-inline', el, {
      Alpine,
      onSelectionChanged: () => el.setAttribute('data-invalid', 'false'),
      onEscape: () => {},
      onInvalidModel: () => el.setAttribute('data-invalid', 'true'),
      onModelValid: () => {},
      stopNavPropagation: false,
      tableFullWidth: true,
    });

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() => {
        getConfig((config) => {
          widget.setConfig(config);
        });
      });
    } else {
      widget.setConfig({});
    }

    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      const modelExpression = el.getAttribute('x-model');
      const evaluateModel = evaluateLater(modelExpression);

      effect(() => {
        evaluateModel((value) => widget.applyModel(value));
      });
    }

    cleanup(() => widget.cleanup());
  });

  Alpine.directive('h-calendar', (el, { expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    let view = 'month';
    let focusDate = new Date();
    focusDate.setHours(0, 0, 0, 0);
    // The day with keyboard focus within the grid (roving tabindex anchor).
    let focusedDay = new Date(focusDate);
    // Set when a keyboard action triggered the re-render, so we restore focus.
    let pendingFocus = false;
    let events = [];
    let locale = navigator.language || 'en-US';
    let firstDay = 0;
    let showNowIndicator = true;
    let showViewSwitcher = true;
    let currentTrimAll = null;

    el.classList.add('flex', 'flex-col', 'h-full', 'overflow-hidden');
    el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Calendar');

    // === Toolbar ===
    const toolbar = document.createElement('div');
    toolbar.classList.add('flex', 'items-center', 'p-1', 'md:p-2', 'border-b', 'flex-none', 'gap-1', 'md:gap-2');

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
    periodLabel.classList.add('flex-1', 'text-xs', 'md:text-sm', 'font-semibold', 'text-center', 'leading-tight', 'line-clamp-3');
    periodLabel.setAttribute('aria-live', 'polite');
    periodLabel.setAttribute('id', `hcl${uuidv4()}`);

    const VIEW_OPTIONS = [
      { key: 'day', label: el.getAttribute('data-day-label') || 'Day' },
      { key: 'week', label: el.getAttribute('data-week-label') || 'Week' },
      { key: 'month', label: el.getAttribute('data-month-label') || 'Month' },
      { key: 'year', label: el.getAttribute('data-year-label') || 'Year' },
    ];

    // View switcher: a dropdown built from the h-menu directive.
    const viewSwitcher = document.createElement('div');

    const viewTriggerLabel = document.createElement('span');
    const viewTrigger = document.createElement('button');
    viewTrigger.type = 'button';
    viewTrigger.setAttribute(Alpine.prefixed('h-button'), '');
    viewTrigger.setAttribute('data-variant', 'outline');
    viewTrigger.setAttribute(`${Alpine.prefixed('h-menu-trigger')}.dropdown.chevron`, '');
    viewTrigger.append(viewTriggerLabel, createSvg({ icon: ChevronDown, classes: 'size-4 shrink-0 opacity-70', attrs: { 'aria-hidden': 'true', role: 'presentation' } }));

    const viewMenu = document.createElement('ul');
    viewMenu.setAttribute(Alpine.prefixed('h-menu'), '');
    viewMenu.setAttribute('aria-label', el.getAttribute('data-aria-views') || 'Change view');
    const viewItems = {};
    VIEW_OPTIONS.forEach(({ key, label }) => {
      const li = document.createElement('li');
      li.textContent = label;
      li.setAttribute(Alpine.prefixed('h-menu-item'), '');
      li.addEventListener('click', () => switchView(key));
      viewMenu.appendChild(li);
      viewItems[key] = li;
    });

    viewSwitcher.append(viewTrigger, viewMenu);

    toolbar.append(navGroup, periodLabel, viewSwitcher);
    el.appendChild(toolbar);
    Alpine.initTree(toolbar);

    const viewArea = document.createElement('div');
    viewArea.classList.add('flex', 'flex-col', 'flex-1', 'min-h-0', 'overflow-hidden');
    el.appendChild(viewArea);

    // Shared popover for "+N more" overflow in month view
    const overflowPopover = document.createElement('div');
    overflowPopover.classList.add('fixed', 'hidden', 'bg-popover', 'text-popover-foreground', 'border', 'rounded-md', 'shadow-md', 'w-auto', 'flex', 'flex-col');
    overflowPopover.setAttribute('role', 'dialog');
    document.body.appendChild(overflowPopover);
    let overflowAutoUpdate = null;
    let overflowOutsideHandler = null;
    let overflowKeydownHandler = null;
    let overflowTrigger = null;

    function closeOverflowPopover(restoreFocus = false) {
      overflowPopover.classList.add('hidden');
      if (overflowAutoUpdate) {
        overflowAutoUpdate();
        overflowAutoUpdate = null;
      }
      if (overflowOutsideHandler) {
        document.removeEventListener('click', overflowOutsideHandler, true);
        overflowOutsideHandler = null;
      }
      if (overflowKeydownHandler) {
        document.removeEventListener('keydown', overflowKeydownHandler);
        overflowKeydownHandler = null;
      }
      const trigger = overflowTrigger;
      overflowTrigger = null;
      if (restoreFocus && trigger && trigger.isConnected) trigger.focus();
    }

    function showOverflowPopover(anchor, day, dayEvs) {
      overflowPopover.innerHTML = '';
      overflowTrigger = anchor;
      overflowPopover.setAttribute('aria-label', dtf(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(day));

      const heading = document.createElement('div');
      heading.classList.add('text-xs', 'font-semibold', 'shrink-0', 'py-1', 'px-2');
      heading.textContent = dtf(locale, { weekday: 'long', month: 'long', day: 'numeric' }).format(day);
      overflowPopover.appendChild(heading);

      const list = document.createElement('div');
      list.classList.add('overflow-y-auto', 'flex', 'flex-col', 'gap-1', 'max-h-48', 'px-2', 'pt-1', 'pb-2');
      dayEvs.forEach((ev) => list.appendChild(makeEventPill(ev)));
      overflowPopover.appendChild(list);

      overflowPopover.classList.remove('hidden');
      // Move focus into the popover so keyboard users land on the event list.
      list.firstChild?.focus();

      function updatePosition() {
        computePosition(anchor, overflowPopover, {
          placement: 'bottom-start',
          strategy: 'fixed',
          middleware: [offset(4), flip(), shift({ padding: 4 })],
        }).then(({ x, y }) => {
          Object.assign(overflowPopover.style, { left: `${x}px`, top: `${y}px` });
        });
      }
      if (overflowAutoUpdate) overflowAutoUpdate();
      overflowAutoUpdate = autoUpdate(anchor, overflowPopover, updatePosition);

      overflowOutsideHandler = (e) => {
        if (!overflowPopover.contains(e.target) && e.target !== anchor) closeOverflowPopover();
      };
      overflowKeydownHandler = (e) => {
        if (e.key === 'Escape') closeOverflowPopover(true);
      };
      setTimeout(() => {
        document.addEventListener('click', overflowOutsideHandler, true);
        document.addEventListener('keydown', overflowKeydownHandler);
      }, 0);
    }

    const monthGridObserver = new ResizeObserver(() => currentTrimAll?.());
    monthGridObserver.observe(el);

    // === Helpers ===

    // Reused across all views; Intl formatters are memoized per locale+options.
    const dtf = createDateTimeFormatCache();

    const isTodayDate = isToday;

    function getWeekStart(d) {
      const copy = new Date(d);
      const diff = (copy.getDay() - firstDay + 7) % 7;
      copy.setDate(copy.getDate() - diff);
      copy.setHours(0, 0, 0, 0);
      return copy;
    }

    function getLocalizedWeekdayNames(style) {
      const fmt = dtf(locale, { weekday: style });
      // Oct 4, 2020 is a Sunday; dayIdx 0-6 maps Sunday-Saturday
      return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2020, 9, 4 + ((firstDay + i) % 7))));
    }

    function formatPeriodLabel() {
      if (view === 'year') return String(focusDate.getFullYear());
      if (view === 'month') return dtf(locale, { month: 'long', year: 'numeric' }).format(focusDate);
      if (view === 'day') return dtf(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(focusDate);
      // week
      const ws = getWeekStart(focusDate);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      const monthFmt = dtf(locale, { month: 'long' });
      if (ws.getMonth() === we.getMonth()) {
        return `${monthFmt.format(ws)} ${ws.getDate()} - ${we.getDate()}, ${we.getFullYear()}`;
      }
      return `${monthFmt.format(ws)} ${ws.getDate()} - ${monthFmt.format(we)} ${we.getDate()}, ${we.getFullYear()}`;
    }

    function eventSpansDay(ev, day) {
      const ds = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
      const de = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
      return ev.startDate <= de && ev.endDate >= ds;
    }

    function eventsForDay(day) {
      return events.filter((ev) => eventSpansDay(ev, day));
    }

    function parseEventDate(str) {
      if (!str) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return parseDateValue(str);
      return new Date(str);
    }

    const EVENT_COLORS = {
      blue: { filled: ['bg-blue-500', 'text-white'], outlined: ['border', 'border-blue-500', 'text-blue-600'] },
      red: { filled: ['bg-red-500', 'text-white'], outlined: ['border', 'border-red-500', 'text-red-600'] },
      green: { filled: ['bg-green-500', 'text-white'], outlined: ['border', 'border-green-500', 'text-green-600'] },
      yellow: { filled: ['bg-yellow-300', 'text-foreground'], outlined: ['border', 'border-yellow-300', 'text-yellow-600'] },
      purple: { filled: ['bg-purple-500', 'text-white'], outlined: ['border', 'border-purple-500', 'text-purple-600'] },
      pink: { filled: ['bg-pink-400', 'text-white'], outlined: ['border', 'border-pink-400', 'text-pink-600'] },
      indigo: { filled: ['bg-indigo-500', 'text-white'], outlined: ['border', 'border-indigo-500', 'text-indigo-600'] },
      orange: { filled: ['bg-orange-400', 'text-white'], outlined: ['border', 'border-orange-400', 'text-orange-600'] },
      gray: { filled: ['bg-gray-400', 'text-white'], outlined: ['border', 'border-gray-400', 'text-gray-600'] },
      teal: { filled: ['bg-teal-400', 'text-white'], outlined: ['border', 'border-teal-400', 'text-teal-600'] },
    };

    function colorClasses(color, status) {
      const palette = EVENT_COLORS[color] || EVENT_COLORS.blue;
      return status === 'unconfirmed' ? palette.outlined : palette.filled;
    }

    function normalizeEvent(ev) {
      const startDate = parseEventDate(ev.start) || new Date();
      const rawEnd = parseEventDate(ev.end);
      const endDate = rawEnd || new Date(startDate);
      if (!ev.end && ev.allDay) endDate.setHours(23, 59, 59, 999);
      return {
        ...ev,
        id: ev.id ?? `cal-ev-${Math.random().toString(36).slice(2)}`,
        color: ev.color || 'blue',
        status: ev.status === 'unconfirmed' ? 'unconfirmed' : 'confirmed',
        startDate,
        endDate,
        allDay: ev.allDay ?? false,
      };
    }

    function eventAriaLabel(ev) {
      const parts = [ev.title];
      if (ev.allDay) {
        parts.push('all day');
      } else {
        const timeFmt = dtf(locale, { hour: 'numeric', minute: '2-digit' });
        parts.push(`${timeFmt.format(ev.startDate)} to ${timeFmt.format(ev.endDate)}`);
      }
      if (ev.status === 'unconfirmed') parts.push('unconfirmed');
      return parts.join(', ');
    }

    function makeEventPill(ev) {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.classList.add(
        'text-xs',
        'px-1',
        'py-0.5',
        'rounded',
        'cursor-pointer',
        'leading-snug',
        'hbox',
        'items-center',
        'w-full',
        'text-left',
        'outline-ring/50',
        'focus-visible:outline-[calc(var(--spacing)*0.75)]',
        'focus-visible:outline',
        ...colorClasses(ev.color, ev.status)
      );
      pill.setAttribute('aria-label', eventAriaLabel(ev));
      const span = document.createElement('span');
      span.classList.add('truncate');
      span.textContent = ev.title;
      pill.appendChild(span);
      if (ev.description) pill.title = ev.description;
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        el.dispatchEvent(new CustomEvent('event-click', { detail: { event: ev }, bubbles: true }));
      });
      return pill;
    }

    function trimMonthCell(cell, day, dayEvs) {
      const pills = Array.from(cell.querySelectorAll('.event-pill'));
      cell.querySelector('button[data-slot="overflow-more-btn"]')?.remove();
      pills.forEach((p) => p.classList.remove('hidden'));
      if (pills.length === 0) return;

      // In real layout, compare viewport rects; in test/no-layout env, fall back to 3 visible
      let overflowIdx;
      if (cell.clientHeight > 0) {
        const cellBottom = cell.getBoundingClientRect().bottom;
        overflowIdx = pills.findIndex((p) => p.getBoundingClientRect().bottom > cellBottom);
      } else {
        overflowIdx = pills.length > 3 ? 3 : -1;
      }
      if (overflowIdx === -1) return;

      pills.slice(overflowIdx).forEach((p) => p.classList.add('hidden'));
      let hiddenCount = pills.length - overflowIdx;

      const more = document.createElement('button');
      more.type = 'button';
      more.classList.add(
        'text-xs',
        'text-muted-foreground',
        'px-1',
        'text-left',
        'w-full',
        'rounded',
        'hover:text-foreground',
        'cursor-pointer',
        'outline-ring/50',
        'focus-visible:outline-[calc(var(--spacing)*0.75)]',
        'focus-visible:outline'
      );
      more.setAttribute('data-slot', 'overflow-more-btn');
      more.textContent = `+${hiddenCount} more`;
      more.addEventListener('click', (e) => {
        e.stopPropagation();
        showOverflowPopover(more, day, dayEvs);
      });
      cell.appendChild(more);

      // If the more button itself overflows, sacrifice one more pill for it
      const cellBottom = cell.getBoundingClientRect().bottom;
      if (cell.clientHeight > 0 && more.getBoundingClientRect().bottom > cellBottom && overflowIdx > 0) {
        pills[overflowIdx - 1].classList.add('hidden');
        hiddenCount++;
        more.textContent = `+${hiddenCount} more`;
      }
    }

    function setConfig(config) {
      locale = config.locale || navigator.language || 'en-US';
      if (config.firstDay !== undefined) firstDay = config.firstDay;
      if (config.showNowIndicator !== undefined) showNowIndicator = config.showNowIndicator;
      if (config.views !== undefined) {
        showViewSwitcher = config.views;
        viewSwitcher.classList.toggle('hidden', !showViewSwitcher);
      }
      events = (config.events || []).map(normalizeEvent);
      if (config.view && ['month', 'week', 'day', 'year'].includes(config.view)) view = config.view;
      if (config.date) {
        const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(config.date);
        if (m) {
          focusDate = new Date(+m[1], +m[2] - 1, +m[3]);
          focusDate.setHours(0, 0, 0, 0);
        }
      }
      focusedDay = new Date(focusDate);
      render();
    }

    function navigate(dir) {
      const d = new Date(focusDate);
      if (view === 'day') d.setDate(d.getDate() + dir);
      else if (view === 'week') d.setDate(d.getDate() + dir * 7);
      else if (view === 'month') d.setMonth(d.getMonth() + dir);
      else d.setFullYear(d.getFullYear() + dir);
      focusDate = d;
      focusedDay = new Date(d);
      render();
    }

    function goToToday() {
      focusDate = new Date();
      focusDate.setHours(0, 0, 0, 0);
      focusedDay = new Date(focusDate);
      render();
    }

    function switchView(v) {
      view = v;
      render();
    }

    function updateViewSwitcher() {
      const current = VIEW_OPTIONS.find((o) => o.key === view);
      viewTriggerLabel.textContent = current ? current.label : '';
      VIEW_OPTIONS.forEach(({ key }) => {
        if (key === view) viewItems[key].setAttribute('data-active', 'true');
        else viewItems[key].removeAttribute('data-active');
      });
    }

    // === Render ===

    function render() {
      periodLabel.textContent = formatPeriodLabel();
      updateViewSwitcher();
      viewArea.innerHTML = '';
      if (view === 'month') renderMonth();
      else if (view === 'week') renderWeek();
      else if (view === 'day') renderDay();
      else renderYear();
    }

    function renderMonth() {
      // Weekday header row
      const weekdayHeader = document.createElement('div');
      weekdayHeader.classList.add('grid', 'grid-cols-7', 'flex-none', 'text-xs', 'font-medium', 'text-center', 'text-muted-foreground');
      weekdayHeader.setAttribute('role', 'row');
      const shortNames = getLocalizedWeekdayNames('short');
      const fullNames = getLocalizedWeekdayNames('long');
      shortNames.forEach((name, idx) => {
        const cell = document.createElement('div');
        cell.classList.add('py-2');
        cell.setAttribute('role', 'columnheader');
        cell.setAttribute('aria-label', fullNames[idx]);
        cell.textContent = name;
        weekdayHeader.appendChild(cell);
      });
      viewArea.appendChild(weekdayHeader);

      // 6×7 day grid: role=grid with 6 role=row, each 7 role=gridcell
      const grid = document.createElement('div');
      grid.classList.add('flex', 'flex-col', 'flex-1', 'border-t', 'overflow-hidden');
      grid.setAttribute('role', 'grid');
      grid.setAttribute('aria-labelledby', periodLabel.getAttribute('id'));

      const year = focusDate.getFullYear();
      const month = focusDate.getMonth();
      const gridStart = getWeekStart(new Date(year, month, 1));
      const dayLabelFmt = dtf(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const dayCells = [];

      for (let r = 0; r < 6; r++) {
        const rowEl = document.createElement('div');
        rowEl.classList.add('grid', 'grid-cols-7', 'flex-1', 'min-h-0');
        if (r < 5) rowEl.classList.add('border-b');
        rowEl.setAttribute('role', 'row');

        for (let c = 0; c < 7; c++) {
          const d = new Date(gridStart);
          d.setDate(gridStart.getDate() + r * 7 + c);

          const cell = document.createElement('div');
          cell.classList.add('p-1', 'overflow-hidden', 'flex', 'flex-col', 'gap-1', 'min-h-0', 'outline-none', 'focus-visible:ring-[calc(var(--spacing)*0.75)]', 'focus-visible:ring-ring/50', 'focus-visible:ring-inset');
          if (c < 6) cell.classList.add('border-r');
          cell.setAttribute('role', 'gridcell');

          const isCurrentMonth = d.getMonth() === month;
          const isToday = isTodayDate(d);

          if (!isToday && isCurrentMonth) cell.classList.add('hover:bg-muted/50', 'cursor-pointer');

          const dayNum = document.createElement('time');
          dayNum.setAttribute('datetime', toDateString(d));
          dayNum.setAttribute('aria-hidden', 'true');
          dayNum.classList.add('text-xs', 'font-medium', 'flex', 'items-center', 'justify-center', 'size-5', 'rounded-full', 'self-start', 'shrink-0');
          dayNum.textContent = d.getDate();

          if (isToday) dayNum.classList.add('bg-primary', 'text-primary-foreground');
          else if (!isCurrentMonth) dayNum.classList.add('text-muted-foreground/40');
          else dayNum.classList.add('text-foreground');

          cell.appendChild(dayNum);

          const dayEvs = eventsForDay(d);
          const capturedDay = new Date(d);

          const labelParts = [dayLabelFmt.format(d)];
          if (isToday) labelParts.push('today');
          if (dayEvs.length) labelParts.push(`${dayEvs.length} event${dayEvs.length === 1 ? '' : 's'}`);
          cell.setAttribute('aria-label', labelParts.join(', '));
          if (isToday) cell.setAttribute('aria-current', 'date');
          cell.setAttribute('tabindex', sameDay(d, focusedDay) ? '0' : '-1');
          cell._date = capturedDay;
          dayCells.push(cell);

          dayEvs.forEach((ev) => {
            const pill = makeEventPill(ev);
            pill.classList.add('event-pill');
            cell.appendChild(pill);
          });
          cell._trimFn = () => trimMonthCell(cell, capturedDay, dayEvs);

          cell.addEventListener('click', (e) => {
            if (e.target === cell || e.target === dayNum || e.target.tagName === 'TIME') {
              el.dispatchEvent(new CustomEvent('date-click', { detail: { date: new Date(d) }, bubbles: true }));
            }
          });

          rowEl.appendChild(cell);
        }
        grid.appendChild(rowEl);
      }

      grid.addEventListener('keydown', onMonthKeydown);
      viewArea.appendChild(grid);
      currentTrimAll = () => dayCells.forEach((c) => c._trimFn?.());
      currentTrimAll();

      if (pendingFocus) {
        pendingFocus = false;
        const target = dayCells.find((c) => sameDay(c._date, focusedDay));
        if (target) target.focus();
      }
    }

    function onMonthKeydown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const cell = e.target.closest && e.target.closest('[role="gridcell"]');
        if (cell && e.target === cell) {
          e.preventDefault();
          el.dispatchEvent(new CustomEvent('date-click', { detail: { date: new Date(cell._date) }, bubbles: true }));
        }
        return;
      }
      const target = nextFocusDate(focusedDay, e.key);
      if (!target) return;
      e.preventDefault();
      focusedDay = target;
      focusDate = new Date(target);
      focusDate.setHours(0, 0, 0, 0);
      pendingFocus = true;
      render();
    }

    function renderTimeGrid(days) {
      const HOUR_H = 60;
      const HOURS = 24;
      const cols = days.length;
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();

      // Day header row
      const dayHeader = document.createElement('div');
      dayHeader.classList.add('flex', 'border-b', 'flex-none');
      const hSpacer = document.createElement('div');
      hSpacer.classList.add('w-14', 'flex-none', 'border-r');
      dayHeader.appendChild(hSpacer);
      const dayHeaderGrid = document.createElement('div');
      dayHeaderGrid.classList.add('grid', 'flex-1');
      dayHeaderGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      const shortDayFmt = dtf(locale, { weekday: 'short' });
      days.forEach((day) => {
        const hCell = document.createElement('div');
        hCell.classList.add('py-1', 'vbox', 'md:hbox', 'items-center', 'justify-center', 'gap-1', 'text-xs', 'border-r', 'last:border-r-0');
        const abbr = document.createElement('span');
        abbr.classList.add('text-muted-foreground');
        abbr.textContent = shortDayFmt.format(day) + ' ';
        const num = document.createElement('span');
        num.classList.add('font-semibold');
        if (isTodayDate(day)) num.classList.add('flex', 'items-center', 'justify-center', 'bg-primary', 'text-primary-foreground', 'rounded-full', 'aspect-square', 'size-5');
        else num.classList.add('text-foreground');
        num.textContent = day.getDate();
        hCell.append(abbr, num);
        dayHeaderGrid.appendChild(hCell);
      });
      dayHeader.appendChild(dayHeaderGrid);
      viewArea.appendChild(dayHeader);

      // All-day strip
      const allDayRow = document.createElement('div');
      allDayRow.classList.add('flex', 'border-b', 'flex-none', 'max-h-18', 'overflow-y-auto');
      const allDayLabel = document.createElement('div');
      allDayLabel.classList.add('w-14', 'flex-none', 'text-xs', 'text-right', 'pr-2', 'py-1', 'text-muted-foreground', 'border-r');
      allDayLabel.textContent = 'All day';
      allDayRow.appendChild(allDayLabel);
      const allDayGrid = document.createElement('div');
      allDayGrid.classList.add('grid', 'flex-1');
      allDayGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      days.forEach((day) => {
        const adCell = document.createElement('div');
        adCell.classList.add('border-r', 'last:border-r-0', 'p-0.5', 'space-y-0.5', 'min-h-[28px]');
        events.filter((ev) => ev.allDay && eventSpansDay(ev, day)).forEach((ev) => adCell.appendChild(makeEventPill(ev)));
        allDayGrid.appendChild(adCell);
      });
      allDayRow.appendChild(allDayGrid);
      viewArea.appendChild(allDayRow);

      // Scrollable time grid
      const scrollArea = document.createElement('div');
      scrollArea.classList.add('flex', 'flex-1', 'min-h-0', 'overflow-y-auto');

      // Time gutter
      const gutter = document.createElement('div');
      gutter.classList.add('w-14', 'flex-none', 'border-r', 'select-none');
      gutter.style.height = `${HOURS * HOUR_H}px`;
      const timeFmt = dtf(locale, { hour: 'numeric' });
      for (let h = 0; h < HOURS; h++) {
        const row = document.createElement('div');
        row.classList.add('relative', 'text-xs', 'text-muted-foreground', 'pr-2');
        row.style.height = `${HOUR_H}px`;
        if (h > 0) {
          const span = document.createElement('span');
          span.classList.add('absolute', 'right-2', '-top-2');
          span.textContent = timeFmt.format(new Date(2000, 0, 1, h));
          row.appendChild(span);
        }
        gutter.appendChild(row);
      }
      scrollArea.appendChild(gutter);

      // Day columns
      const colsGrid = document.createElement('div');
      colsGrid.classList.add('grid', 'flex-1');
      colsGrid.style.gridTemplateColumns = `repeat(${cols}, minmax(0, 1fr))`;
      colsGrid.style.height = `${HOURS * HOUR_H}px`;

      const colDayFmt = dtf(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      days.forEach((day) => {
        const col = document.createElement('div');
        col.classList.add('border-r', 'last:border-r-0', 'relative');
        col.style.height = `${HOURS * HOUR_H}px`;
        col.setAttribute('role', 'group');
        col.setAttribute('aria-label', colDayFmt.format(day));

        // Hour grid lines
        for (let h = 0; h < HOURS; h++) {
          const line = document.createElement('div');
          line.classList.add('absolute', 'inset-x-0', 'border-t', 'border-muted/50');
          line.style.top = `${h * HOUR_H}px`;
          col.appendChild(line);
        }

        // Current-time indicator
        if (showNowIndicator && isTodayDate(day)) {
          const indicator = document.createElement('div');
          indicator.classList.add('absolute', 'inset-x-0', 'z-10', 'pointer-events-none', 'flex', 'items-center');
          indicator.style.top = `${(nowMins / 60) * HOUR_H}px`;
          const dot = document.createElement('div');
          dot.classList.add('size-2.5', 'rounded-full', 'bg-red-500', 'flex-none', '-ml-1.5');
          const timeLine = document.createElement('div');
          timeLine.classList.add('flex-1', 'h-px', 'bg-red-500');
          indicator.append(dot, timeLine);
          col.appendChild(indicator);
        }

        // Timed events - compute overlap columns so concurrent events share width
        const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
        const timedEvs = events
          .filter((ev) => !ev.allDay && eventSpansDay(ev, day))
          .map((ev) => {
            const startMins = Math.max((ev.startDate - startOfDay) / 60000, 0);
            const endMins = Math.min((ev.endDate - startOfDay) / 60000, HOURS * 60);
            return { ev, startMins, endMins, durMins: Math.max(endMins - startMins, 30) };
          });

        // Greedy column assignment: sort by start, place each event in the first
        // column whose last event has already ended.
        timedEvs.sort((a, b) => a.startMins - b.startMins);
        const colEnds = [];
        timedEvs.forEach((item) => {
          let c = colEnds.findIndex((end) => end <= item.startMins);
          if (c === -1) c = colEnds.length;
          colEnds[c] = item.endMins;
          item.slotCol = c;
        });

        // For each event, slotTotal = max(slotCol+1) across all events it overlaps with.
        timedEvs.forEach((item) => {
          let maxCol = item.slotCol;
          for (const other of timedEvs) {
            if (other !== item && other.startMins < item.endMins && other.endMins > item.startMins) {
              if (other.slotCol > maxCol) maxCol = other.slotCol;
            }
          }
          item.slotTotal = maxCol + 1;
        });

        timedEvs.forEach(({ ev, startMins, durMins, slotCol, slotTotal }) => {
          const evEl = document.createElement('button');
          evEl.type = 'button';
          evEl.classList.add(
            'absolute',
            'rounded',
            'px-1.5',
            'py-0.5',
            'cursor-pointer',
            'overflow-hidden',
            'text-xs',
            'text-left',
            'outline-ring/50',
            'focus-visible:outline-[calc(var(--spacing)*0.75)]',
            'focus-visible:outline',
            ...colorClasses(ev.color, ev.status)
          );
          evEl.setAttribute('aria-label', eventAriaLabel(ev));
          const pct = 100 / slotTotal;
          evEl.style.top = `${(startMins / 60) * HOUR_H}px`;
          evEl.style.height = `${(durMins / 60) * HOUR_H}px`;
          evEl.style.left = `calc(${slotCol * pct}% + 0.125rem)`;
          evEl.style.width = `calc(${pct}% - 0.25rem)`;

          evEl.title = ev.title;

          const titleEl = document.createElement('div');
          titleEl.classList.add('font-medium', 'truncate', 'leading-tight');
          titleEl.textContent = ev.title;
          evEl.appendChild(titleEl);

          if (durMins >= 45) {
            const timeEl = document.createElement('div');
            timeEl.classList.add('opacity-80', 'leading-tight');
            timeEl.textContent = dtf(locale, { hour: 'numeric', minute: '2-digit' }).format(ev.startDate);
            evEl.appendChild(timeEl);
          }

          evEl.addEventListener('click', (e) => {
            e.stopPropagation();
            el.dispatchEvent(new CustomEvent('event-click', { detail: { event: ev }, bubbles: true }));
          });
          col.appendChild(evEl);
        });

        // Empty slot click → date-click event
        col.addEventListener('click', (e) => {
          if (e.target === col) {
            const rect = col.getBoundingClientRect();
            const totalMins = Math.floor((((e.clientY - rect.top) / HOUR_H) * 60) / 15) * 15;
            const h = Math.min(Math.floor(totalMins / 60), 23);
            const m = totalMins % 60;
            const clickDate = new Date(day);
            clickDate.setHours(h, m, 0, 0);
            el.dispatchEvent(
              new CustomEvent('date-click', {
                detail: { date: clickDate, time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` },
                bubbles: true,
              })
            );
          }
        });

        colsGrid.appendChild(col);
      });

      scrollArea.appendChild(colsGrid);
      viewArea.appendChild(scrollArea);

      // Scroll to current time (−60min buffer) or 8 am on other days
      const hasToday = days.some((d) => isTodayDate(d));
      const scrollTarget = hasToday ? Math.max((nowMins - 60) * (HOUR_H / 60), 0) : 8 * HOUR_H;
      requestAnimationFrame(() => {
        scrollArea.scrollTop = scrollTarget;
      });
    }

    function renderWeek() {
      const ws = getWeekStart(focusDate);
      renderTimeGrid(
        Array.from({ length: 7 }, (_, i) => {
          const d = new Date(ws);
          d.setDate(ws.getDate() + i);
          return d;
        })
      );
    }

    function renderDay() {
      renderTimeGrid([new Date(focusDate)]);
    }

    function renderYear() {
      const scrollWrap = document.createElement('div');
      scrollWrap.classList.add('overflow-y-auto', 'flex-1', 'p-6');
      const grid = document.createElement('div');
      grid.classList.add('grid', 'gap-8', 'max-w-5xl', 'mx-auto');
      grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(11.25rem, 1fr))';
      const year = focusDate.getFullYear();
      for (let m = 0; m < 12; m++) grid.appendChild(renderMiniMonth(year, m));
      scrollWrap.appendChild(grid);
      viewArea.appendChild(scrollWrap);
    }

    function renderMiniMonth(year, month) {
      const wrap = document.createElement('div');
      wrap.classList.add('vbox', 'gap-1');

      const titleId = `hmm${uuidv4()}`;
      const monthName = dtf(locale, { month: 'long' }).format(new Date(year, month, 1));
      const title = document.createElement('button');
      title.type = 'button';
      title.setAttribute('id', titleId);
      title.classList.add('text-xs', 'font-semibold', 'cursor-pointer', 'hover:text-primary', 'rounded', 'outline-ring/50', 'focus-visible:outline-[calc(var(--spacing)*0.75)]', 'focus-visible:outline');
      title.textContent = monthName;
      title.setAttribute('aria-label', `${monthName} ${year}`);
      title.addEventListener('click', () => {
        focusDate = new Date(year, month, 1);
        focusedDay = new Date(focusDate);
        switchView('month');
      });
      wrap.appendChild(title);

      const hdr = document.createElement('div');
      hdr.classList.add('grid', 'grid-cols-7', 'text-xs', 'text-center', 'text-muted-foreground');
      hdr.setAttribute('aria-hidden', 'true');
      getLocalizedWeekdayNames('narrow').forEach((n) => {
        const c = document.createElement('div');
        c.textContent = n;
        hdr.appendChild(c);
      });
      wrap.appendChild(hdr);

      const daysGrid = document.createElement('div');
      daysGrid.classList.add('grid', 'grid-cols-7', 'text-xs', 'text-center', 'gap-0.5');
      daysGrid.setAttribute('role', 'grid');
      daysGrid.setAttribute('aria-labelledby', titleId);
      const firstOfMonth = new Date(year, month, 1);
      const gridStart = getWeekStart(firstOfMonth);
      const dayLabelFmt = dtf(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

      const miniCells = [];
      let miniFocus = new Date(year, month, 1);

      // Render 5 rows, or a full 6th row (with trailing days) only when the month
      // spills past the fifth week, so every mini-month is a complete grid.
      const leadingDays = (firstOfMonth.getDay() - firstDay + 7) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const totalCells = leadingDays + daysInMonth > 35 ? 42 : 35;

      for (let i = 0; i < totalCells; i++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);

        const isCurrentMonth = d.getMonth() === month;
        // Only the owning month marks today; trailing/leading filler days from
        // adjacent months are decorative and must not be highlighted.
        const isToday = isCurrentMonth && isTodayDate(d);
        const hasEvents = isCurrentMonth && eventsForDay(d).length > 0;

        const cell = document.createElement('div');
        cell.setAttribute('role', 'gridcell');
        cell.classList.add('relative', 'rounded-xs', 'leading-none', 'outline-none', 'p-1.5');
        cell.textContent = d.getDate();

        if (isToday) cell.classList.add('bg-primary', 'text-primary-foreground', 'font-semibold', 'hover:bg-primary-hover');
        else if (!isCurrentMonth) cell.classList.add('text-foreground', 'opacity-50');
        else cell.classList.add('text-foreground', 'hover:bg-secondary-hover');

        if (hasEvents && !isToday) {
          const dot = document.createElement('div');
          dot.classList.add('absolute', 'bottom-0', 'left-1/2', '-translate-x-1/2', 'size-1', 'rounded-full', 'bg-primary');
          cell.appendChild(dot);
        }

        if (isCurrentMonth) {
          const captured = new Date(d);
          cell.classList.add('cursor-pointer', 'focus-visible:bg-secondary-hover', '[[aria-current]:focus-visible]:bg-primary-hover');
          const labelParts = [dayLabelFmt.format(d)];
          if (isToday) labelParts.push('today');
          if (hasEvents) labelParts.push('has events');
          cell.setAttribute('aria-label', labelParts.join(', '));
          if (isToday) cell.setAttribute('aria-current', 'date');
          cell.setAttribute('tabindex', d.getDate() === 1 ? '0' : '-1');
          miniCells.push({ el: cell, date: captured });
          cell.addEventListener('click', () => {
            focusDate = new Date(captured);
            focusedDay = new Date(captured);
            switchView('day');
          });
        } else {
          cell.setAttribute('aria-hidden', 'true');
        }

        daysGrid.appendChild(cell);
      }

      daysGrid.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          focusDate = new Date(miniFocus);
          focusedDay = new Date(miniFocus);
          switchView('day');
          return;
        }
        const t = nextFocusDate(miniFocus, e.key);
        if (!t || t.getMonth() !== month || t.getFullYear() !== year) return;
        e.preventDefault();
        const entry = miniCells.find((c) => sameDay(c.date, t));
        if (!entry) return;
        miniFocus = new Date(t);
        miniCells.forEach((c) => c.el.setAttribute('tabindex', sameDay(c.date, miniFocus) ? '0' : '-1'));
        entry.el.focus();
      });

      wrap.appendChild(daysGrid);
      return wrap;
    }

    // === Wire toolbar buttons ===

    function onPrev() {
      navigate(-1);
    }
    function onNext() {
      navigate(1);
    }
    function onToday() {
      goToToday();
    }

    prevBtn.addEventListener('click', onPrev);
    nextBtn.addEventListener('click', onNext);
    todayBtn.addEventListener('click', onToday);

    // === Config ===

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() =>
        getConfig((cfg) => {
          if (cfg) setConfig(cfg);
        })
      );
    } else {
      setConfig({});
    }

    cleanup(() => {
      prevBtn.removeEventListener('click', onPrev);
      nextBtn.removeEventListener('click', onNext);
      todayBtn.removeEventListener('click', onToday);
      monthGridObserver.disconnect();
      closeOverflowPopover();
      overflowPopover.remove();
      Alpine.destroyTree(toolbar);
    });
  });
}
