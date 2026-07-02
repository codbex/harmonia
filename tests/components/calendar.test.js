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
