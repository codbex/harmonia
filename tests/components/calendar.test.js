import { beforeEach, describe, expect, it, vi } from 'vitest';

import calendarPlugin from '../../src/components/calendar.js';
import { mountDirective } from '../test-utils.js';

vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

function makeEl() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

describe('h-calendar', () => {
  let el;

  beforeEach(() => {
    el = makeEl();
  });

  function mount(expression = '', contextOverrides = {}) {
    return mountDirective(calendarPlugin, 'h-calendar', el, { original: 'h-calendar', expression }, contextOverrides);
  }

  it('registers h-calendar directive', () => {
    const { alpine } = mount();
    expect(alpine._directives['h-calendar']).toBeDefined();
  });

  it('adds flex and overflow-hidden classes', () => {
    mount();
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
  });

  it('renders toolbar with Previous, Today, and Next buttons', () => {
    mount();
    const labels = Array.from(el.querySelectorAll('button')).map((b) => b.getAttribute('aria-label') || b.textContent.trim());
    expect(labels).toContain('Previous');
    expect(labels).toContain('Next');
    expect(labels.some((l) => l === 'Today')).toBe(true);
  });

  it('renders a view-switcher dropdown with Day, Week, Month, Year items', () => {
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month' }) });
    const menu = el.querySelector('ul');
    expect(menu).toBeTruthy();
    const items = Array.from(menu.querySelectorAll('li')).map((i) => i.textContent.trim());
    expect(items).toEqual(['Day', 'Week', 'Month', 'Year']);
    // The trigger button (the menu's preceding sibling) shows the current view.
    expect(menu.previousElementSibling.textContent.trim()).toBe('Month');
  });

  it('renders a period label with aria-live="polite"', () => {
    mount();
    const heading = el.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading.getAttribute('aria-live')).toBe('polite');
    expect(heading.textContent.length).toBeGreaterThan(0);
  });

  it('calls cleanup', () => {
    const { ctx } = mount();
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('defaults to month view and renders 42 day cells', () => {
    mount();
    expect(el.querySelectorAll('time').length).toBe(42);
  });

  it('marks today with bg-primary in month view', () => {
    mount();
    const todayCell = Array.from(el.querySelectorAll('time')).find((t) => t.classList.contains('bg-primary'));
    expect(todayCell).toBeTruthy();
  });

  it('accepts config with view: "day" and renders time grid', () => {
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'day', date: '2026-06-18' }) });
    // Day view has no <time> elements; renders a time gutter
    expect(el.querySelectorAll('time').length).toBe(0);
    const nums = Array.from(el.querySelectorAll('span')).filter((s) => s.textContent.trim() === '18');
    expect(nums.length).toBeGreaterThan(0);
  });

  it('accepts config with view: "year" and renders 12 mini-month titles', () => {
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'year', date: '2026-06-18' }) });
    const monthTitles = Array.from(el.querySelectorAll('.grid .text-xs.font-semibold')).filter((e) => e.textContent.trim().length > 0);
    expect(monthTitles.length).toBe(12);
  });

  it('year view marks today only once, not on adjacent-month filler days', () => {
    // Today is the 1st, so it also appears as a trailing filler day in the
    // previous month's mini-month; only the owning month should highlight it.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 1, 12, 0, 0));
    try {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'year', date: '2026-07-01' }) });
      const todayCells = el.querySelectorAll('[role="gridcell"].bg-primary');
      expect(todayCells.length).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });

  it('year view renders every mini-month as complete rows (no ragged trailing week)', () => {
    // Months that spill into a 6th week (e.g. May and Aug 2026) must still fill
    // that row with trailing next-month days rather than cutting it off.
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'year', date: '2026-01-01' }) });
    const grids = el.querySelectorAll('[role="grid"]');
    expect(grids.length).toBe(12);
    grids.forEach((grid) => {
      const cellCount = grid.querySelectorAll('[role="gridcell"]').length;
      expect(cellCount % 7).toBe(0);
    });
  });

  it('renders event pills for events in month view', () => {
    const events = [{ id: '1', title: 'Team Sync', start: '2026-06-18T10:00:00', end: '2026-06-18T11:00:00', color: 'blue' }];
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
    const pills = Array.from(el.querySelectorAll('.cursor-pointer.leading-snug')).filter((p) => p.textContent.trim() === 'Team Sync');
    expect(pills.length).toBeGreaterThan(0);
  });

  it('renders all-day events in the all-day strip of week view', () => {
    const events = [{ id: '1', title: 'Holiday', start: '2026-06-18', allDay: true, color: 'green' }];
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'week', date: '2026-06-18', events }) });
    const pills = Array.from(el.querySelectorAll('.cursor-pointer.leading-snug')).filter((p) => p.textContent.trim() === 'Holiday');
    expect(pills.length).toBeGreaterThan(0);
  });

  it('renders timed events in day-view columns', () => {
    const events = [{ id: '1', title: 'Standup', start: '2026-06-18T09:00:00', end: '2026-06-18T10:00:00', color: 'blue' }];
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'day', date: '2026-06-18', events }) });
    const pills = Array.from(el.querySelectorAll('.absolute')).filter((p) => p.querySelector('.font-medium')?.textContent.trim() === 'Standup');
    expect(pills.length).toBeGreaterThan(0);
  });

  it('shows "+N more" when a day has more than 3 events in month view', () => {
    const events = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      title: `Event ${i}`,
      start: '2026-06-18T10:00:00',
      end: '2026-06-18T11:00:00',
      color: 'blue',
    }));
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
    const moreEl = Array.from(el.querySelectorAll('.text-muted-foreground')).find((e) => /\+\d+ more/.test(e.textContent));
    expect(moreEl).toBeTruthy();
    expect(moreEl.textContent).toBe('+2 more');
  });

  it('builds the overflow label from data-more-label', () => {
    const events = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      title: `Event ${i}`,
      start: '2026-06-18T10:00:00',
      end: '2026-06-18T11:00:00',
      color: 'blue',
    }));
    el.setAttribute('data-more-label', 'noch {count}');
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
    const moreEl = el.querySelector('[data-slot="overflow-more-btn"]');
    expect(moreEl.textContent).toBe('noch 2');
  });

  it('dispatches event-click with event detail when an event pill is clicked', () => {
    const events = [{ id: 'e1', title: 'Clickable', start: '2026-06-18T09:00:00', end: '2026-06-18T10:00:00', color: 'blue' }];
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
    const handler = vi.fn();
    el.addEventListener('event-click', handler);
    const pill = Array.from(el.querySelectorAll('.cursor-pointer.leading-snug')).find((p) => p.textContent.trim() === 'Clickable');
    expect(pill).toBeTruthy();
    pill.click();
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail.event.id).toBe('e1');
  });

  it('dispatches date-click with a Date when an empty month cell is clicked', () => {
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events: [] }) });
    const handler = vi.fn();
    el.addEventListener('date-click', handler);
    const cell = el.querySelector('[datetime]')?.parentElement;
    expect(cell).toBeTruthy();
    cell.click();
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail.date).toBeInstanceOf(Date);
  });

  it('applies blue color classes to events with color: "blue"', () => {
    const events = [{ id: '1', title: 'Blue Event', start: '2026-06-18T09:00:00', end: '2026-06-18T10:00:00', color: 'blue' }];
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
    const pill = Array.from(el.querySelectorAll('.cursor-pointer.leading-snug')).find((p) => p.textContent.trim() === 'Blue Event');
    expect(pill?.className).toContain('bg-blue');
  });

  it('defaults to blue when event has no color', () => {
    const events = [{ id: '1', title: 'No Color', start: '2026-06-18T09:00:00', end: '2026-06-18T10:00:00' }];
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
    const pill = Array.from(el.querySelectorAll('.cursor-pointer.leading-snug')).find((p) => p.textContent.trim() === 'No Color');
    expect(pill?.className).toContain('bg-blue');
  });

  it('marks the active view in the dropdown with data-active', () => {
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'week' }) });
    const active = Array.from(el.querySelectorAll('ul li')).filter((i) => i.getAttribute('data-active') === 'true');
    expect(active.length).toBe(1);
    expect(active[0].textContent.trim()).toBe('Week');
  });

  it('year view mini-month title click switches to month view', () => {
    mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'year', date: '2026-01-01' }) });
    const title = el.querySelector('.grid .text-xs.font-semibold');
    expect(title).toBeTruthy();
    title.click();
    expect(el.querySelectorAll('time').length).toBe(42);
  });

  describe('initial scroll position', () => {
    // The scrollable time grid is the only flex-1 overflow-y-auto container in
    // week/day views (the all-day strip above it is max-h-18 flex-none).
    function scrollTop() {
      return el.querySelector('.overflow-y-auto.flex-1').scrollTop;
    }

    function mountGrid(config) {
      const raf = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => cb());
      try {
        mount('calConfig', { evaluateLater: () => (cb) => cb(config) });
      } finally {
        raf.mockRestore();
      }
    }

    it('defaults to 8 am when the range has no today and scrollTo is absent', () => {
      mountGrid({ view: 'day', date: '2020-06-18', events: [{ title: 'Standup', start: '2020-06-18T10:00' }] });
      expect(scrollTop()).toBe(8 * 60);
    });

    it('scrollTo "first-event" anchors on the earliest event minus a 60min buffer', () => {
      mountGrid({ view: 'day', date: '2020-06-18', scrollTo: 'first-event', events: [{ title: 'Standup', start: '2020-06-18T10:00' }] });
      expect(scrollTop()).toBe(540);
    });

    it('scrollTo "first-event" in week view picks the earliest across all visible days', () => {
      mountGrid({
        view: 'week',
        date: '2020-06-18',
        scrollTo: 'first-event',
        events: [
          { title: 'Late', start: '2020-06-18T16:00' },
          { title: 'Early', start: '2020-06-16T09:30' },
          { title: 'Mid', start: '2020-06-17T13:00' },
        ],
      });
      expect(scrollTop()).toBe(510);
    });

    it('scrollTo "first-event" ignores all-day events and falls back', () => {
      mountGrid({ view: 'day', date: '2020-06-18', scrollTo: 'first-event', events: [{ title: 'Holiday', start: '2020-06-18', allDay: true }] });
      expect(scrollTop()).toBe(8 * 60);
    });

    it('scrollTo "first-event" clamps an early-morning event to the top', () => {
      mountGrid({ view: 'day', date: '2020-06-18', scrollTo: 'first-event', events: [{ title: 'Redeye', start: '2020-06-18T00:15' }] });
      expect(scrollTop()).toBe(0);
    });

    it('ignores an invalid scrollTo value', () => {
      mountGrid({ view: 'day', date: '2020-06-18', scrollTo: 'bogus', events: [{ title: 'Standup', start: '2020-06-18T10:00' }] });
      expect(scrollTop()).toBe(8 * 60);
    });
  });

  describe('drag and drop', () => {
    const pointer = (target, type, coords = {}) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, ...coords }));

    function stubRect(node, rect) {
      node.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, ...rect });
    }

    // The initial-scroll rAF is stubbed to run synchronously so scrollTop is
    // stable before a drag starts.
    function mountDrag(config) {
      const raf = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => cb());
      try {
        mount('calConfig', { evaluateLater: () => (cb) => cb(config) });
      } finally {
        raf.mockRestore();
      }
    }

    function timedEl(title) {
      return Array.from(el.querySelectorAll('.absolute')).find((p) => p.querySelector('.font-medium')?.textContent.trim() === title);
    }

    function scrollArea() {
      return el.querySelector('.overflow-y-auto.flex-1');
    }

    const standup = { id: 'e1', title: 'Standup', start: '2026-06-18T09:00:00', end: '2026-06-18T10:00:00', color: 'blue' };

    it('is inert when draggable is not enabled', () => {
      mountDrag({ view: 'day', date: '2026-06-18', events: [standup] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 400 });
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 400 });
      expect(evEl.hasAttribute('data-dragging')).toBe(false);
      expect(evEl.style.top).toBe('540px');
      expect(drops).not.toHaveBeenCalled();
    });

    it('keeps sub-threshold moves as plain clicks', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('event-drop', drops);
      el.addEventListener('event-click', clicks);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 51, clientY: 302 });
      pointer(evEl, 'pointerup', { clientX: 51, clientY: 302 });
      expect(evEl.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
      evEl.click();
      expect(clicks).toHaveBeenCalledOnce();
    });

    it('moves a day-view event vertically in 15-minute steps and dispatches event-drop', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 365 });
      // 65px rounds to the 60-minute step and the preview follows.
      expect(evEl.getAttribute('data-dragging')).toBe('true');
      expect(evEl.classList.contains('z-20')).toBe(true);
      expect(evEl.style.top).toBe('600px');
      expect(evEl.style.left).toBe('0.125rem');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 365 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.event.id).toBe('e1');
      expect(detail.start).toBe('2026-06-18T10:00');
      expect(detail.end).toBe('2026-06-18T11:00');
      // Snap-back: the drop never mutates the calendar's own rendering.
      expect(evEl.hasAttribute('data-dragging')).toBe(false);
      expect(evEl.classList.contains('z-20')).toBe(false);
      expect(evEl.style.top).toBe('540px');
    });

    it('snaps vertical moves to a configured dragStep', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, dragStep: 60, events: [standup] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 350 });
      // 50px rounds to one 60-minute step (the default 15 would give 45 minutes).
      expect(evEl.style.top).toBe('600px');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 350 });
      expect(drops.mock.calls[0][0].detail.start).toBe('2026-06-18T10:00');
    });

    it('ignores a non-positive dragStep and keeps the 15-minute default', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, dragStep: 0, events: [standup] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 350 });
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 350 });
      expect(drops.mock.calls[0][0].detail.start).toBe('2026-06-18T09:45');
    });

    it('suppresses the trailing click after a completed drag', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const clicks = vi.fn();
      el.addEventListener('event-click', clicks);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 365 });
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 365 });
      evEl.click();
      expect(clicks).not.toHaveBeenCalled();
      evEl.click();
      expect(clicks).toHaveBeenCalledOnce();
    });

    it('moves an event across week columns and keeps its time', () => {
      mountDrag({ view: 'week', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      const colsGrid = scrollArea().lastElementChild;
      stubRect(colsGrid, { left: 0, width: 700 });
      // Thu Jun 18 is column 4 of the Sun-Sat week; x 650 is column 6 (Sat).
      pointer(evEl, 'pointerdown', { clientX: 450, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 650, clientY: 300 });
      expect(evEl.style.transform).toBe('translateX(200px)');
      pointer(evEl, 'pointerup', { clientX: 650, clientY: 300 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.start).toBe('2026-06-20T09:00');
      expect(detail.end).toBe('2026-06-20T10:00');
      expect(evEl.style.transform).toBe('');
    });

    it('does not dispatch when the event is dropped where it started', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('event-drop', drops);
      el.addEventListener('event-click', clicks);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 305 });
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 305 });
      expect(drops).not.toHaveBeenCalled();
      expect(evEl.style.top).toBe('540px');
      // The gesture was still a drag, not a click.
      evEl.click();
      expect(clicks).not.toHaveBeenCalled();
    });

    it('clamps vertical moves to the day', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: -400 });
      expect(evEl.style.top).toBe('0px');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: -400 });
      expect(drops.mock.calls[0][0].detail.start).toBe('2026-06-18T00:00');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 2300 });
      expect(evEl.style.top).toBe('1380px');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 2300 });
      expect(drops.mock.calls[1][0].detail.start).toBe('2026-06-18T23:00');
      expect(drops.mock.calls[1][0].detail.end).toBe('2026-06-19T00:00');
    });

    it('never forces an event upward when its 30-minute visual floor passes midnight', () => {
      const late = { id: 'e9', title: 'Late', start: '2026-06-18T23:55:00', end: '2026-06-18T23:59:00' };
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [late] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Late');
      expect(evEl.style.top).toBe('1435px');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 1437 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 1537 });
      expect(evEl.style.top).toBe('1435px');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 1537 });
      expect(drops).not.toHaveBeenCalled();
    });

    it('locks segments continuing from an earlier day to day changes', () => {
      const overnight = { id: 'e2', title: 'Overnight', start: '2026-06-17T22:00:00', end: '2026-06-18T02:00:00' };
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [overnight] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Overnight');
      expect(evEl.style.top).toBe('0px');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 180 });
      expect(evEl.getAttribute('data-dragging')).toBe('true');
      expect(evEl.style.top).toBe('0px');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 180 });
      expect(drops).not.toHaveBeenCalled();
    });

    it('moves a month-view event to the hovered day and keeps its time', () => {
      mountDrag({ view: 'month', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('event-drop', drops);
      el.addEventListener('event-click', clicks);
      const grid = el.querySelector('[role="grid"]');
      stubRect(grid, { left: 0, top: 0, width: 700, height: 600 });
      const cells = el.querySelectorAll('[role="gridcell"]');
      const pill = el.querySelector('.event-pill');
      pointer(pill, 'pointerdown', { clientX: 450, clientY: 250 });
      // Hover Jun 30 (row 4, col 2), then Jun 29 (row 4, col 1).
      pointer(pill, 'pointermove', { clientX: 250, clientY: 450 });
      expect(pill.getAttribute('data-dragging')).toBe('true');
      expect(pill.classList.contains('opacity-50')).toBe(true);
      expect(cells[30].getAttribute('data-drop-target')).toBe('true');
      expect(cells[30].classList.contains('bg-muted/50')).toBe(true);
      pointer(pill, 'pointermove', { clientX: 150, clientY: 450 });
      expect(cells[30].hasAttribute('data-drop-target')).toBe(false);
      expect(cells[29].getAttribute('data-drop-target')).toBe('true');
      pointer(pill, 'pointerup', { clientX: 150, clientY: 450 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.start).toBe('2026-06-29T09:00');
      expect(detail.end).toBe('2026-06-29T10:00');
      expect(cells[29].hasAttribute('data-drop-target')).toBe(false);
      expect(pill.classList.contains('opacity-50')).toBe(false);
      pill.click();
      expect(clicks).not.toHaveBeenCalled();
    });

    it('keeps date-only events date-only on a month drag', () => {
      const holiday = { id: 'e3', title: 'Holiday', start: '2026-06-18', allDay: true };
      mountDrag({ view: 'month', date: '2026-06-18', draggable: true, events: [holiday] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      stubRect(el.querySelector('[role="grid"]'), { left: 0, top: 0, width: 700, height: 600 });
      const pill = el.querySelector('.event-pill');
      pointer(pill, 'pointerdown', { clientX: 450, clientY: 250 });
      pointer(pill, 'pointermove', { clientX: 550, clientY: 250 });
      pointer(pill, 'pointerup', { clientX: 550, clientY: 250 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.start).toBe('2026-06-19');
      expect(detail.end).toBeUndefined();
    });

    it('moves all-day events across days in the week strip', () => {
      const holiday = { id: 'e4', title: 'Holiday', start: '2026-06-18', allDay: true };
      mountDrag({ view: 'week', date: '2026-06-18', draggable: true, events: [holiday] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const allDayGrid = el.querySelector('.max-h-18').lastElementChild;
      stubRect(allDayGrid, { left: 0, width: 700 });
      const pill = allDayGrid.querySelector('button');
      pointer(pill, 'pointerdown', { clientX: 450, clientY: 10 });
      pointer(pill, 'pointermove', { clientX: 550, clientY: 10 });
      expect(allDayGrid.children[5].getAttribute('data-drop-target')).toBe('true');
      pointer(pill, 'pointerup', { clientX: 550, clientY: 10 });
      expect(drops).toHaveBeenCalledOnce();
      expect(drops.mock.calls[0][0].detail.start).toBe('2026-06-19');
    });

    it('respects a per-event draggable: false', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [{ ...standup, draggable: false }] });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 400 });
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 400 });
      expect(evEl.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
    });

    it('aborts on pointercancel without dispatching or suppressing clicks', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('event-drop', drops);
      el.addEventListener('event-click', clicks);
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 300 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 365 });
      expect(evEl.style.top).toBe('600px');
      pointer(evEl, 'pointercancel', {});
      expect(evEl.style.top).toBe('540px');
      expect(drops).not.toHaveBeenCalled();
      evEl.click();
      expect(clicks).toHaveBeenCalledOnce();
    });

    it('does not attach dragging to overflow-popover pills', () => {
      const events = Array.from({ length: 5 }, (_, i) => ({
        id: String(i),
        title: `Event ${i}`,
        start: '2026-06-18T10:00:00',
        end: '2026-06-18T11:00:00',
      }));
      mountDrag({ view: 'month', date: '2026-06-18', draggable: true, events });
      const drops = vi.fn();
      el.addEventListener('event-drop', drops);
      el.querySelector('[data-slot="overflow-more-btn"]').click();
      const popover = Array.from(document.querySelectorAll('[role="dialog"]')).find((d) => !d.classList.contains('hidden'));
      const pill = popover.querySelector('button');
      pointer(pill, 'pointerdown', { clientX: 100, clientY: 100 });
      pointer(pill, 'pointermove', { clientX: 300, clientY: 300 });
      pointer(pill, 'pointerup', { clientX: 300, clientY: 300 });
      expect(pill.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
    });

    it('nudges the scroll area when dragging near its edge', () => {
      mountDrag({ view: 'day', date: '2026-06-18', draggable: true, events: [standup] });
      const area = scrollArea();
      const startScroll = area.scrollTop;
      stubRect(area, { top: 0, bottom: 200, height: 200 });
      const evEl = timedEl('Standup');
      pointer(evEl, 'pointerdown', { clientX: 50, clientY: 100 });
      pointer(evEl, 'pointermove', { clientX: 50, clientY: 190 });
      expect(area.scrollTop).toBe(startScroll + 15);
      // The scrolled distance feeds the vertical delta: 90px pointer + 15px scroll.
      expect(evEl.style.top).toBe('645px');
      pointer(evEl, 'pointerup', { clientX: 50, clientY: 190 });
    });
  });

  describe('accessibility', () => {
    it('exposes the calendar as a labeled group', () => {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18' }) });
      expect(el.getAttribute('role')).toBe('group');
      expect(el.getAttribute('aria-label')).toBe('Calendar');
    });

    it('respects an author-set aria-label', () => {
      el.setAttribute('aria-label', 'Team schedule');
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18' }) });
      expect(el.getAttribute('aria-label')).toBe('Team schedule');
    });

    it('month view is a labeled grid of 42 gridcells', () => {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18' }) });
      const grid = el.querySelector('[role="grid"]');
      expect(grid).toBeTruthy();
      expect(grid.getAttribute('aria-labelledby')).toBeTruthy();
      expect(el.querySelectorAll('[role="gridcell"]').length).toBe(42);
    });

    it('marks today with aria-current and a single roving tabindex', () => {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month' }) });
      expect(el.querySelector('[role="gridcell"][aria-current="date"]')).toBeTruthy();
      expect(el.querySelectorAll('[role="gridcell"][tabindex="0"]').length).toBe(1);
    });

    it('arrow keys move the roving focus to the adjacent day', () => {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18' }) });
      expect(el.querySelector('[role="gridcell"][tabindex="0"] time').getAttribute('datetime')).toBe('2026-06-18');
      el.querySelector('[role="grid"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      expect(el.querySelector('[role="gridcell"][tabindex="0"] time').getAttribute('datetime')).toBe('2026-06-19');
    });

    it('Enter on the focused day fires date-click', () => {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18' }) });
      const handler = vi.fn();
      el.addEventListener('date-click', handler);
      el.querySelector('[role="gridcell"][tabindex="0"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].detail.date).toBeInstanceOf(Date);
    });

    it('renders events as buttons with accessible labels including time', () => {
      const events = [{ id: '1', title: 'Team Sync', start: '2026-06-18T10:00:00', end: '2026-06-18T11:00:00', color: 'blue' }];
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
      const pill = Array.from(el.querySelectorAll('button')).find((b) => (b.getAttribute('aria-label') || '').startsWith('Team Sync'));
      expect(pill).toBeTruthy();
      expect(pill.tagName).toBe('BUTTON');
    });

    it('includes unconfirmed status in the event label', () => {
      const events = [{ id: '1', title: 'Tentative', start: '2026-06-18T10:00:00', end: '2026-06-18T11:00:00', status: 'unconfirmed' }];
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
      const pill = Array.from(el.querySelectorAll('button')).find((b) => (b.getAttribute('aria-label') || '').startsWith('Tentative'));
      expect(pill.getAttribute('aria-label')).toContain('unconfirmed');
    });

    it('includes rejected status in the event label', () => {
      const events = [{ id: '1', title: 'Declined', start: '2026-06-18T10:00:00', end: '2026-06-18T11:00:00', status: 'rejected' }];
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
      const pill = Array.from(el.querySelectorAll('button')).find((b) => (b.getAttribute('aria-label') || '').startsWith('Declined'));
      expect(pill.getAttribute('aria-label')).toContain('rejected');
    });

    it('renders a rejected event pill as a dashed outline (no fill)', () => {
      const events = [{ id: '1', title: 'Declined', start: '2026-06-18T10:00:00', end: '2026-06-18T11:00:00', color: 'blue', status: 'rejected' }];
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'month', date: '2026-06-18', events }) });
      const pill = Array.from(el.querySelectorAll('button')).find((b) => (b.getAttribute('aria-label') || '').startsWith('Declined'));
      expect(pill.className).toContain('border-blue-500');
      expect(pill.className).toContain('border-dashed');
      expect(pill.className).not.toContain('bg-blue-500');
    });

    it('year view: mini-month titles are buttons and each month is a grid', () => {
      mount('calConfig', { evaluateLater: () => (cb) => cb({ view: 'year', date: '2026-01-01' }) });
      const titleBtns = Array.from(el.querySelectorAll('button')).filter((b) => /\b\d{4}$/.test(b.getAttribute('aria-label') || ''));
      expect(titleBtns.length).toBe(12);
      expect(el.querySelectorAll('[role="grid"]').length).toBe(12);
    });
  });
});

describe('h-calendar-inline', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers h-calendar-inline directive', () => {
    const { alpine } = mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(alpine._directives['h-calendar-inline']).toBeDefined();
  });

  it('adds gap-2 and p-2 classes', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('p-2')).toBe(true);
  });

  it('sets tabindex="-1"', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('does not add absolute or hidden classes', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(el.classList.contains('absolute')).toBe(false);
    expect(el.classList.contains('hidden')).toBe(false);
  });

  it('does not set role="dialog"', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(el.getAttribute('role')).not.toBe('dialog');
  });

  it('appends header element with navigation buttons', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const buttons = el.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('appends a table for dates', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(el.querySelector('table')).toBeTruthy();
  });

  it('table has 6 rows of 7 cells each', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const rows = el.querySelectorAll('tbody tr');
    expect(rows.length).toBe(6);
    rows.forEach((row) => {
      expect(row.querySelectorAll('td').length).toBe(7);
    });
  });

  it('does not hijack Enter/Space pressed on a header nav button', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const nextBtn = Array.from(el.querySelectorAll('button')).find((b) => b.getAttribute('aria-label') === 'next month');
    // The grid keydown handler (on the root) must not preventDefault keys aimed at a header button.
    for (const key of ['Enter', ' ', 'ArrowRight']) {
      const ev = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      nextBtn.dispatchEvent(ev);
      expect(ev.defaultPrevented).toBe(false);
    }
  });

  it('handles Enter on a focused day cell (selects the day)', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const handler = vi.fn();
    el.addEventListener('change', handler);
    const cell = el.querySelector('td[role="gridcell"][tabindex="0"]') || el.querySelector('td[role="gridcell"][data-day]');
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    cell.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(handler).toHaveBeenCalled();
  });

  it('clicking the selected day again deselects it and writes an empty model', () => {
    let model;
    Object.defineProperty(el, '_x_model', { value: { get: () => model, set: (v) => (model = v) }, configurable: true });
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const changes = [];
    el.addEventListener('change', (event) => changes.push(event.detail));
    const cell = el.querySelector('td[data-day="10"]');

    cell.click();
    expect(model).toBeTruthy();
    expect(cell.getAttribute('aria-selected')).toBe('true');

    cell.click();
    expect(model).toBe('');
    expect(changes[1].date).toBeUndefined();
    expect(cell.getAttribute('aria-selected')).toBe('false');
  });

  it('exposes grid roles and is labelled by the month heading', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const table = el.querySelector('table');
    expect(table.getAttribute('role')).toBe('grid');
    const heading = el.querySelector('h2');
    expect(heading.getAttribute('id')).toBeTruthy();
    expect(table.getAttribute('aria-labelledby')).toBe(heading.getAttribute('id'));
    expect(el.querySelectorAll('th[role="columnheader"]').length).toBe(7);
    expect(el.querySelectorAll('td[role="gridcell"]').length).toBe(42);
    expect(el.querySelectorAll('tr[role="row"]').length).toBe(7);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('range mode: selecting two days marks the connected range', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: 'config' }, { evaluateLater: () => (cb) => cb({ range: true }) });
    const cell = (d) => el.querySelector(`td[data-day="${d}"]`);
    cell(10).click();
    cell(12).click();
    expect(cell(10).getAttribute('data-range')).toBe('start');
    expect(cell(11).getAttribute('data-range')).toBe('middle');
    expect(cell(12).getAttribute('data-range')).toBe('end');
    expect(cell(11).getAttribute('aria-selected')).toBe('true');
  });

  it('range mode: writes a {start,end} object to the model', () => {
    let model;
    Object.defineProperty(el, '_x_model', { value: { get: () => model, set: (v) => (model = v) }, configurable: true });
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: 'config' }, { evaluateLater: () => (cb) => cb({ range: true }) });
    const cell = (d) => el.querySelector(`td[data-day="${d}"]`);
    cell(5).click();
    cell(8).click();
    expect(model.start).toBeDefined();
    expect(model.end).toBeDefined();
  });

  it('navigation buttons use default aria-labels when data attributes absent', () => {
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const buttons = el.querySelectorAll('button');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('previous year');
    expect(labels).toContain('previous month');
    expect(labels).toContain('next month');
    expect(labels).toContain('next year');
  });

  it('navigation buttons use data attribute values for aria-labels when present', () => {
    el.setAttribute('data-aria-prev-year', 'Предишна година');
    el.setAttribute('data-aria-prev-month', 'Предишен месец');
    el.setAttribute('data-aria-next-month', 'Следващия месец');
    el.setAttribute('data-aria-next-year', 'Следващата година');
    mountDirective(calendarPlugin, 'h-calendar-inline', el, { original: 'h-calendar-inline', expression: '' });
    const buttons = el.querySelectorAll('button');
    const labels = Array.from(buttons).map((b) => b.getAttribute('aria-label'));
    expect(labels).toContain('Предишна година');
    expect(labels).toContain('Предишен месец');
    expect(labels).toContain('Следващия месец');
    expect(labels).toContain('Следващата година');
  });
});
