import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
}));

import slotPickerPlugin from '../../src/components/slot-picker.js';
import { createMockAlpine, mountDirective } from '../test-utils.js';

vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false, addListener: vi.fn(), removeListener: vi.fn() }));

const FIXED_DATE = '2026-06-22';

function makeEl() {
  const el = document.createElement('div');
  document.body.appendChild(el);
  return el;
}

describe('h-slot-picker', () => {
  let el;

  beforeEach(() => {
    el = makeEl();
  });

  function mount(expression = '', contextOverrides = {}) {
    return mountDirective(slotPickerPlugin, 'h-slot-picker', el, { original: 'h-slot-picker', expression }, contextOverrides);
  }

  function mountResponsive(expression = '', contextOverrides = {}) {
    return mountDirective(slotPickerPlugin, 'h-slot-picker', el, { original: 'h-slot-picker', expression, modifiers: ['responsive'] }, contextOverrides);
  }

  function withConfig(config) {
    return { evaluateLater: () => (cb) => cb(config) };
  }

  // Selection is opt-in on a bound x-model. Stub one so selection tests exercise
  // the selectable path (mirrors the real x-model directive attaching el._x_model).
  function withModel(target = el, initial = null) {
    target._x_model = {
      value: initial,
      get() {
        return this.value;
      },
      set(v) {
        this.value = v;
      },
    };
    target.setAttribute('x-model', 'selected');
  }

  it('registers h-slot-picker and its control directives', () => {
    const { alpine } = mount();
    ['h-slot-picker', 'h-slot-picker-previous', 'h-slot-picker-next', 'h-slot-picker-today', 'h-slot-picker-title', 'h-slot-picker-calendar'].forEach((name) => {
      expect(alpine._directives[name]).toBeDefined();
    });
  });

  it('adds flex and relative classes', () => {
    mount();
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
  });

  it('sets data-slot="slot-picker"', () => {
    mount();
    expect(el.getAttribute('data-slot')).toBe('slot-picker');
  });

  it('exposes a navigation API on el._h_slot_picker and renders no toolbar of its own', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const api = el._h_slot_picker;
    expect(typeof api.previous).toBe('function');
    expect(typeof api.next).toBe('function');
    expect(typeof api.today).toBe('function');
    expect(typeof api.registerCalendar).toBe('function');
    expect(api).toHaveProperty('title');
    expect(api).toHaveProperty('canPrev');
    expect(api).toHaveProperty('canNext');
    expect(api).toHaveProperty('calendarControlsId');
    // The consumer owns the toolbar: the picker builds no title control and no calendar trigger.
    expect(el.querySelector('[data-slot="slot-picker-title"]')).toBeNull();
    expect(Array.from(el.querySelectorAll('button')).some((b) => b.getAttribute('aria-haspopup') === 'dialog')).toBe(false);
  });

  it('computes a period title in the navigation API', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    expect(el._h_slot_picker.title.length).toBeGreaterThan(0);
  });

  it('renders 3 day columns with headers', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
    expect(headers.length).toBe(3);
  });

  it('each day header has a day name row and a date row', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const header = el.querySelector('[data-slot="slot-picker-header"]');
    const rows = header.children;
    expect(rows.length).toBe(2);
    expect(rows[0].textContent.trim().length).toBeGreaterThan(0);
    expect(rows[1].textContent.trim().length).toBeGreaterThan(0);
  });

  describe("today's header", () => {
    const TODAY_LINE = 'inset-shadow-[0_-.188rem_var(--primary)]';
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2026, 5, 22, 12)); // FIXED_DATE, a Monday
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it('marks today with a bottom line instead of coloring the day name', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const headers = Array.from(el.querySelectorAll('[data-slot="slot-picker-header"]'));
      expect(headers[0].classList.contains(TODAY_LINE)).toBe(true);
      expect(headers[1].classList.contains(TODAY_LINE)).toBe(false);
      expect(headers[2].classList.contains(TODAY_LINE)).toBe(false);
      // The day name keeps the normal text color on every theme.
      expect(el.querySelectorAll('[data-slot="slot-picker-header"] .text-primary').length).toBe(0);
    });

    it('draws no line when today is a disabled day', () => {
      mount('config', withConfig({ date: FIXED_DATE, disabledDays: [1] }));
      const header = el.querySelector('[data-slot="slot-picker-header"]');
      expect(header.classList.contains(TODAY_LINE)).toBe(false);
    });
  });

  it('renders 30 available slot cells for default shorthand (08:00-18:00, 60 min, 3 days)', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const slotBtns = el.querySelectorAll('button[data-slot="slot-picker-cell"]');
    expect(slotBtns.length).toBe(30); // 10 slots x 3 days
  });

  it('renders correct slot count for step: 30 (20 per day, 3 days = 60)', () => {
    mount('config', withConfig({ date: FIXED_DATE, step: 30 }));
    const slotBtns = el.querySelectorAll('button[data-slot="slot-picker-cell"]');
    expect(slotBtns.length).toBe(60);
  });

  it('renders only the slots defined in explicit slots for each day', () => {
    const slots = [
      { date: '2026-06-22', start: '09:00', end: '09:30', available: true },
      { date: '2026-06-22', start: '10:00', end: '10:30', available: true },
      { date: '2026-06-23', start: '09:00', end: '09:30', available: false },
    ];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(2);
    expect(el.querySelectorAll('div[data-slot="slot-picker-cell"]').length).toBe(1);
  });

  it('slot cells display the start time as centered text', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const firstBtn = el.querySelector('button[data-slot="slot-picker-cell"]');
    expect(firstBtn.textContent.trim()).toBe('08:00');
  });

  it('unavailable slots render as non-interactive divs', () => {
    const slots = [{ date: '2026-06-22', start: '09:00', end: '09:30', available: false }];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const unavailable = el.querySelectorAll('div[data-slot="slot-picker-cell"]');
    expect(unavailable.length).toBe(1);
    expect(unavailable[0].tagName).toBe('DIV');
  });

  it('dispatches slot-click when an available slot is clicked', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const handler = vi.fn();
    el.addEventListener('slot-click', handler);
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(handler).toHaveBeenCalledOnce();
    const { slot } = handler.mock.calls[0][0].detail;
    expect(slot).toHaveProperty('date');
    expect(slot).toHaveProperty('start');
    expect(slot).toHaveProperty('end');
    expect(slot.available).toBe(true);
  });

  it('selects a slot on click (applies bg-primary)', () => {
    withModel();
    mount('config', withConfig({ date: FIXED_DATE }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(1);
  });

  it('deselects a slot when clicked again in single mode', () => {
    withModel();
    mount('config', withConfig({ date: FIXED_DATE }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    el.querySelector('button[data-slot="slot-picker-cell"].bg-primary').click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(0);
  });

  it('single mode: clicking a second slot deselects the first', () => {
    withModel();
    mount('config', withConfig({ date: FIXED_DATE, multiple: false }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(1);
    Array.from(el.querySelectorAll('button[data-slot="slot-picker-cell"]'))[1].click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(1);
  });

  it('multiple mode: can select multiple slots', () => {
    withModel();
    mount('config', withConfig({ date: FIXED_DATE, multiple: true }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    Array.from(el.querySelectorAll('button[data-slot="slot-picker-cell"]'))[1].click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(2);
  });

  it('slot-click detail reports selected: true after clicking', () => {
    withModel();
    mount('config', withConfig({ date: FIXED_DATE }));
    const handler = vi.fn();
    el.addEventListener('slot-click', handler);
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(handler.mock.calls[0][0].detail.slot.selected).toBe(true);
  });

  it('slot-click detail reports selected: false when deselecting', () => {
    withModel();
    mount('config', withConfig({ date: FIXED_DATE }));
    const handler = vi.fn();
    el.addEventListener('slot-click', handler);
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    el.querySelector('button[data-slot="slot-picker-cell"].bg-primary').click();
    expect(handler.mock.calls[1][0].detail.slot.selected).toBe(false);
  });

  it('renders a top-right badge with imgs from icons.right', () => {
    const slots = [
      {
        date: '2026-06-22',
        start: '09:00',
        end: '09:30',
        available: true,
        icons: {
          right: [{ url: '/icons/a.svg', alt: 'A' }, { url: '/icons/b.svg' }],
        },
      },
    ];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const badge = el.querySelector('button[data-slot="slot-picker-cell"] .absolute.top-1.right-1');
    expect(badge).toBeTruthy();
    const imgs = badge.querySelectorAll('img');
    expect(imgs.length).toBe(2);
    expect(imgs[0].src).toContain('/icons/a.svg');
    expect(imgs[0].alt).toBe('A');
    expect(imgs[1].src).toContain('/icons/b.svg');
    expect(imgs[1].alt).toBe('');
  });

  it('renders a top-left badge from icons.left', () => {
    const slots = [{ date: '2026-06-22', start: '09:00', end: '09:30', available: true, icons: { left: [{ url: '/icons/warning.svg', alt: 'Warning' }] } }];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const badge = el.querySelector('button[data-slot="slot-picker-cell"] .absolute.top-1.left-1');
    expect(badge).toBeTruthy();
    const img = badge.querySelector('img');
    expect(img.src).toContain('/icons/warning.svg');
    expect(img.alt).toBe('Warning');
    expect(el.querySelector('button[data-slot="slot-picker-cell"] .absolute.top-1.right-1')).toBeNull();
  });

  it('renders badges in both corners when icons.left and icons.right are set', () => {
    const slots = [
      {
        date: '2026-06-22',
        start: '09:00',
        end: '09:30',
        available: true,
        icons: {
          left: [{ url: '/icons/l.svg', alt: 'L' }],
          right: [{ url: '/icons/r.svg', alt: 'R' }],
        },
      },
    ];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
    expect(cell.querySelector('.absolute.top-1.left-1 img').src).toContain('/icons/l.svg');
    expect(cell.querySelector('.absolute.top-1.right-1 img').src).toContain('/icons/r.svg');
  });

  it('wraps a bare icon object given as a side value', () => {
    const slots = [{ date: '2026-06-22', start: '09:00', end: '09:30', available: true, icons: { right: { url: '/icons/a.svg', alt: 'A' } } }];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const imgs = el.querySelectorAll('button[data-slot="slot-picker-cell"] .absolute.top-1.right-1 img');
    expect(imgs.length).toBe(1);
    expect(imgs[0].src).toContain('/icons/a.svg');
  });

  it('ignores the removed icon key and array form of icons', () => {
    const slots = [
      { date: '2026-06-22', start: '09:00', end: '09:30', available: true, icon: { url: '/icons/a.svg', alt: 'A' } },
      { date: '2026-06-22', start: '09:30', end: '10:00', available: true, icons: [{ url: '/icons/b.svg', alt: 'B' }] },
    ];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    expect(el.querySelector('.absolute.top-1.left-1')).toBeNull();
    expect(el.querySelector('.absolute.top-1.right-1')).toBeNull();
  });

  it('renders tile icons inside the tile cell', () => {
    const slots = [
      {
        date: '2026-06-22',
        start: '09:00',
        end: '10:00',
        tiles: [{ description: 'Room A', icons: { right: [{ url: '/icons/a.svg', alt: 'A' }] } }],
      },
    ];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const tile = el.querySelector('button[data-slot="slot-picker-tile"]');
    const img = tile.querySelector('.absolute.top-1.right-1 img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('/icons/a.svg');
  });

  it('shows "Not available" placeholder for a day in disabledDates', () => {
    mount('config', withConfig({ date: FIXED_DATE, disabledDates: [FIXED_DATE] }));
    const cols = el.querySelectorAll('[data-slot="slot-picker-header"]');
    expect(cols[0].nextElementSibling.textContent.trim()).toBe('Not available');
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(20); // only 2 days have slots
  });

  it('shows "Not available" for days matching disabledDays (weekday numbers)', () => {
    // FIXED_DATE is 2026-06-22 (Monday = 1). Disabling Monday should disable the first column.
    mount('config', withConfig({ date: FIXED_DATE, disabledDays: [1] }));
    const firstColBody = el.querySelectorAll('[data-slot="slot-picker-header"]')[0].nextElementSibling;
    expect(firstColBody.textContent.trim()).toBe('Not available');
  });

  it('shows "Not available" for days inside a disabledDates range', () => {
    mount('config', withConfig({ date: FIXED_DATE, disabledDates: [{ from: FIXED_DATE, to: '2026-06-23' }] }));
    const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
    expect(headers[0].nextElementSibling.textContent.trim()).toBe('Not available');
    expect(headers[1].nextElementSibling.textContent.trim()).toBe('Not available');
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(10); // only day 3 has slots
  });

  it('respects data-unavailable-label attribute', () => {
    el.setAttribute('data-unavailable-label', 'Closed');
    mount('config', withConfig({ date: FIXED_DATE, disabledDates: [FIXED_DATE] }));
    const firstColBody = el.querySelectorAll('[data-slot="slot-picker-header"]')[0].nextElementSibling;
    expect(firstColBody.textContent.trim()).toBe('Closed');
  });

  it('calls cleanup', () => {
    const { ctx } = mount();
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  describe('fillEmptyDays', () => {
    it('keeps days without explicit slots empty by default', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true }];
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      // Only the one explicit slot on day 1; days 2 and 3 render nothing.
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(1);
    });

    it('fills days without explicit slots using the default start/end/step schedule', () => {
      const slots = [
        { date: FIXED_DATE, start: '09:00', end: '09:30', available: true },
        { date: FIXED_DATE, start: '10:00', end: '10:30', available: true },
      ];
      mount('config', withConfig({ date: FIXED_DATE, slots, fillEmptyDays: true }));
      // day 1: 2 explicit; days 2 and 3: default 08:00-18:00 / 60 min = 10 each.
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(22);
    });

    it('honors a custom default schedule for the filled days', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true }];
      mount('config', withConfig({ date: FIXED_DATE, slots, fillEmptyDays: true, start: '08:00', end: '12:00', step: 30 }));
      // day 1: 1 explicit; days 2 and 3: 08:00-12:00 / 30 min = 8 each.
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(17);
    });

    it('does not merge a day that has explicit slots with the default schedule', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true }];
      mount('config', withConfig({ date: FIXED_DATE, slots, fillEmptyDays: true }));
      // day 1 shows only its 1 explicit slot (not the 10 default), days 2 and 3: 10 each.
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(21);
    });
  });

  describe('empty slots array', () => {
    it('shows every day empty for an empty slots array', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots: [] }));
      expect(el.querySelectorAll('[data-slot="slot-picker-cell"]').length).toBe(0);
    });

    it('fills every day from the default schedule for an empty slots array with fillEmptyDays', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots: [], fillEmptyDays: true }));
      // Every day is empty, so each falls back to 08:00-18:00 / 60 min = 10 slots.
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(30);
    });

    it('empties every day when the slots array becomes empty at runtime', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true }];
      const cfg = createMockAlpine().reactive({ value: { date: FIXED_DATE, slots } });
      mount('config', { evaluateLater: () => (cb) => cb(cfg.value) });
      expect(el.querySelectorAll('[data-slot="slot-picker-cell"]').length).toBe(1);
      cfg.value = { slots: [] };
      expect(el.querySelectorAll('[data-slot="slot-picker-cell"]').length).toBe(0);
    });

    it('uses the generated schedule when slots is null', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots: null }));
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(30);
    });
  });

  describe('start and end day bounds', () => {
    const canPrev = () => el._h_slot_picker.canPrev;
    const canNext = () => el._h_slot_picker.canNext;

    it('reports both directions navigable when no bounds are set', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      expect(canPrev()).toBe(true);
      expect(canNext()).toBe(true);
    });

    it('reports canPrev false at the start day', () => {
      // Window starts on FIXED_DATE, which is the earliest allowed day.
      mount('config', withConfig({ date: FIXED_DATE, minDate: FIXED_DATE }));
      expect(canPrev()).toBe(false);
      expect(canNext()).toBe(true);
    });

    it('reports canNext false when the end day is the last visible day', () => {
      // FIXED_DATE window shows 22/23/24; end day 24 is the last visible day.
      mount('config', withConfig({ date: FIXED_DATE, maxDate: '2026-06-24' }));
      expect(canNext()).toBe(false);
      expect(canPrev()).toBe(true);
    });

    it('clamps the window forward so it never starts before the start day', () => {
      mount('config', withConfig({ date: '2026-06-20', minDate: FIXED_DATE }));
      // Window is pulled forward to begin on the start day (22nd).
      expect(el._h_slot_picker.title).toContain('22');
      expect(canPrev()).toBe(false);
    });

    it('clamps the window back so its last day never exceeds the end day', () => {
      mount('config', withConfig({ date: '2026-06-30', maxDate: '2026-06-24' }));
      // Window is pulled back so the last of the three days is the end day (24th).
      expect(el._h_slot_picker.title).toContain('24');
      expect(canNext()).toBe(false);
    });

    it('marks days outside the bounds as unavailable when the range is narrower than the window', () => {
      // Only FIXED_DATE is allowed; the other two days of the window fall outside.
      mount('config', withConfig({ date: FIXED_DATE, minDate: FIXED_DATE, maxDate: FIXED_DATE }));
      const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
      expect(headers[1].nextElementSibling.textContent.trim()).toBe('Not available');
      expect(headers[2].nextElementSibling.textContent.trim()).toBe('Not available');
      // Only the single in-range day renders slots (default 08:00-18:00 / 60 min).
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"]').length).toBe(10);
    });

    it('treats start and end days independently', () => {
      mount('config', withConfig({ date: FIXED_DATE, minDate: '2026-06-01', maxDate: '2026-12-31' }));
      // Neither edge is reached, so both directions stay navigable.
      expect(canPrev()).toBe(true);
      expect(canNext()).toBe(true);
    });
  });

  describe('dates west of UTC', () => {
    // A YYYY-MM-DD value read as UTC midnight would land on the previous day here.
    const originalTz = process.env.TZ;
    beforeAll(() => {
      process.env.TZ = 'America/New_York';
    });
    afterAll(() => {
      if (originalTz === undefined) delete process.env.TZ;
      else process.env.TZ = originalTz;
    });
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2026, 5, 22, 12));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    const firstHeader = () => el.querySelector('[data-slot="slot-picker-header"]').textContent;
    function mountCalendar() {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Choose date');
      el.appendChild(btn);
      mountDirective(slotPickerPlugin, 'h-slot-picker-calendar', btn, { original: 'h-slot-picker-calendar' });
      return (d) => el.querySelector(`[data-slot="slot-picker-calendar"] td[data-day="${d}"]`).getAttribute('aria-disabled');
    }

    it('runs in a timezone west of UTC', () => {
      expect(new Date(2026, 0, 1).getTimezoneOffset()).toBe(300);
    });

    it('starts the window on the date and keeps the maxDate day', () => {
      mount('config', withConfig({ date: FIXED_DATE, maxDate: '2026-06-24' }));
      expect(firstHeader()).toContain('June 22');
      expect(el._h_slot_picker.canNext).toBe(false);
    });

    it('clamps the window to the minDate day', () => {
      mount('config', withConfig({ date: '2026-06-20', minDate: FIXED_DATE }));
      expect(firstHeader()).toContain('June 22');
      expect(el._h_slot_picker.canPrev).toBe(false);
    });

    it('disables the days before minDate in the calendar popover', () => {
      mount('config', withConfig({ date: FIXED_DATE, minDate: FIXED_DATE }));
      const disabled = mountCalendar();
      expect([disabled(21), disabled(22)]).toEqual(['true', 'false']);
    });

    it('keeps the calendar bounds when only the locale changes, and drops them when cleared', () => {
      const cfg = createMockAlpine().reactive({ value: { date: FIXED_DATE, minDate: FIXED_DATE } });
      mount('config', { evaluateLater: () => (cb) => cb(cfg.value) });
      const disabled = mountCalendar();
      cfg.value = { locale: 'de-DE' };
      expect(disabled(21)).toBe('true');
      cfg.value = { minDate: null };
      expect(disabled(21)).toBe('false');
    });
  });

  describe('accessibility', () => {
    it('exposes the picker as a labeled group', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      expect(el.getAttribute('role')).toBe('group');
      expect(el.getAttribute('aria-label')).toBe('Time slot picker');
    });

    it('respects an author-set aria-label', () => {
      el.setAttribute('aria-label', 'Booking slots');
      mount('config', withConfig({ date: FIXED_DATE }));
      expect(el.getAttribute('aria-label')).toBe('Booking slots');
    });

    it('wraps each day column in a group labeled by its header', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const header = el.querySelector('[data-slot="slot-picker-header"]');
      const col = header.parentElement;
      expect(header.id).toBeTruthy();
      expect(col.getAttribute('role')).toBe('group');
      expect(col.getAttribute('aria-labelledby')).toBe(header.id);
    });

    it('slot buttons expose aria-pressed and a day + time label when selectable', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(btn.getAttribute('aria-pressed')).toBe('false');
      expect(btn.getAttribute('aria-label')).toContain('08:00');
    });

    it('sets aria-pressed true on the selected slot', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      btn.click();
      expect(btn.getAttribute('aria-pressed')).toBe('true');
    });

    it('marks unavailable slots disabled with a hidden label', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: false }];
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('div[data-slot="slot-picker-cell"]');
      expect(cell.getAttribute('aria-disabled')).toBe('true');
      expect(cell.querySelector('.sr-only').textContent).toContain('Not available');
    });
  });

  describe('in-place selection', () => {
    it('updates the clicked cell in place instead of rebuilding it', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      btn.click();
      // The same node remains in the DOM (a full re-render would detach it).
      expect(btn.isConnected).toBe(true);
      expect(btn.classList.contains('bg-primary')).toBe(true);
      expect(btn.getAttribute('aria-pressed')).toBe('true');
    });

    it('keeps focus on the slot after selection', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      btn.focus();
      btn.click();
      expect(document.activeElement).toBe(btn);
    });

    it('moves selection between cells in place in single mode', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE }));
      const [first, second] = el.querySelectorAll('button[data-slot="slot-picker-cell"]');
      first.click();
      second.click();
      expect(first.isConnected).toBe(true);
      expect(first.getAttribute('aria-pressed')).toBe('false');
      expect(second.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('selection requires a model', () => {
    // Without a bound x-model the slots are plain action buttons: clickable and
    // event-emitting, but never selectable and carrying no aria-pressed.
    it('dispatches slot-click with selected: false when no model is bound', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const handler = vi.fn();
      el.addEventListener('slot-click', handler);
      el.querySelector('button[data-slot="slot-picker-cell"]').click();
      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].detail.slot.selected).toBe(false);
    });

    it('never applies a selected style when no model is bound', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      el.querySelector('button[data-slot="slot-picker-cell"]').click();
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(0);
    });

    it('adds no aria-pressed attribute to slots when no model is bound', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(btn.hasAttribute('aria-pressed')).toBe(false);
      btn.click();
      expect(btn.hasAttribute('aria-pressed')).toBe(false);
    });

    it('repeated clicks never accumulate a selection without a model', () => {
      mount('config', withConfig({ date: FIXED_DATE, multiple: true }));
      const handler = vi.fn();
      el.addEventListener('slot-click', handler);
      const [first, second] = el.querySelectorAll('button[data-slot="slot-picker-cell"]');
      first.click();
      second.click();
      first.click();
      expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(0);
      expect(handler).toHaveBeenCalledTimes(3);
      handler.mock.calls.forEach((call) => expect(call[0].detail.slot.selected).toBe(false));
    });

    it('keeps available cells interactive (button with hover styling) without a model', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(btn.tagName).toBe('BUTTON');
      expect(btn.classList.contains('hover:bg-secondary-hover')).toBe(true);
    });

    it('does not write the model when selection is off (guards the default path stays selectable)', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      btn.click();
      expect(btn.getAttribute('aria-pressed')).toBe('true');
      expect(el._x_model.get()).toBe('2026-06-22T08:00');
    });

    it('tiles honor the model gate', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '10:00', tiles: [{ description: 'Room A', available: true }] }];
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const handler = vi.fn();
      el.addEventListener('slot-click', handler);
      const tile = el.querySelector('button[data-slot="slot-picker-tile"]');
      tile.click();
      expect(handler.mock.calls[0][0].detail.slot.selected).toBe(false);
      expect(tile.classList.contains('bg-primary')).toBe(false);
      expect(tile.hasAttribute('aria-pressed')).toBe(false);
    });
  });

  describe('calendar popover', () => {
    // The consumer supplies the calendar trigger; it registers with the picker, which
    // owns the popover. Mount the parent, then mount an x-h-slot-picker-calendar button.
    function mountCalendar(attrs = {}) {
      const btn = document.createElement('button');
      Object.entries(attrs).forEach(([k, v]) => btn.setAttribute(k, v));
      el.appendChild(btn);
      mountDirective(slotPickerPlugin, 'h-slot-picker-calendar', btn, { original: 'h-slot-picker-calendar' });
      return btn;
    }

    it('does not create the calendar popover until a trigger registers', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      // No calendar control: the picker builds no popover or month grid.
      expect(el.querySelector('[data-slot="slot-picker-calendar"]')).toBeNull();
      mountCalendar({ 'aria-label': 'Choose date' });
      expect(el.querySelector('[data-slot="slot-picker-calendar"]')).not.toBeNull();
    });

    it('wires a registered calendar trigger to the dialog popover', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = mountCalendar({ 'aria-label': 'Choose date' });
      expect(btn.getAttribute('aria-haspopup')).toBe('dialog');
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      expect(popover.getAttribute('role')).toBe('dialog');
      expect(btn.getAttribute('aria-controls')).toBe(popover.getAttribute('id'));
      expect(popover.classList.contains('hidden')).toBe(true);
    });

    it('names the dialog via aria-labelledby pointing at the trigger, generating an id when absent', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = mountCalendar({ 'aria-label': 'Pick a start day' });
      expect(btn.id).toBeTruthy();
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      expect(popover.getAttribute('aria-labelledby')).toBe(btn.id);
      expect(popover.hasAttribute('aria-label')).toBe(false);
    });

    it('reuses a consumer-supplied id on the trigger for aria-labelledby', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = mountCalendar({ id: 'my-cal', 'aria-label': 'Pick a start day' });
      expect(btn.id).toBe('my-cal');
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      expect(popover.getAttribute('aria-labelledby')).toBe('my-cal');
    });

    it('jumps the first day when a date is picked from the calendar', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = mountCalendar({ 'aria-label': 'Choose date' });
      btn.click();
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      const day10 = popover.querySelector('td[data-day="10"]');
      expect(day10).toBeTruthy();
      day10.click();
      // The picker's period title now starts on the 10th.
      expect(el._h_slot_picker.title).toContain('10');
    });

    it('forwards the host data-aria-* labels onto the popover calendar nav buttons', () => {
      el.setAttribute('data-aria-prev-year', 'Go back a year');
      el.setAttribute('data-aria-prev-month', 'Go back a month');
      el.setAttribute('data-aria-next-month', 'Go forward a month');
      el.setAttribute('data-aria-next-year', 'Go forward a year');
      mount('config', withConfig({ date: FIXED_DATE }));
      mountCalendar({ 'aria-label': 'Choose date' });
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      const labels = Array.from(popover.querySelectorAll('button')).map((b) => b.getAttribute('aria-label'));
      expect(labels).toEqual(expect.arrayContaining(['Go back a year', 'Go back a month', 'Go forward a month', 'Go forward a year']));
    });

    it('falls back to default English nav labels when the host sets none', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      mountCalendar({ 'aria-label': 'Choose date' });
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      const labels = Array.from(popover.querySelectorAll('button')).map((b) => b.getAttribute('aria-label'));
      expect(labels).toEqual(expect.arrayContaining(['previous year', 'previous month', 'next month', 'next year']));
    });

    it('forwards the host data-aria-choose-* labels onto the popover calendar view toggles', () => {
      el.setAttribute('data-aria-choose-month', 'pick a month');
      el.setAttribute('data-aria-choose-year', 'pick a year');
      mount('config', withConfig({ date: FIXED_DATE }));
      mountCalendar({ 'aria-label': 'Choose date' });
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      const labels = Array.from(popover.querySelectorAll('button[aria-pressed]')).map((b) => b.getAttribute('aria-label'));
      expect(labels).toHaveLength(2);
      expect(labels.some((l) => l.endsWith(', pick a month'))).toBe(true);
      expect(labels.some((l) => l.endsWith(', pick a year'))).toBe(true);
    });
  });

  describe('toolbar control directives', () => {
    // A reactive stand-in for the picker API that the controls locate via el._h_slot_picker.
    function withPicker(overrides = {}) {
      const api = createMockAlpine().reactive({
        title: 'June',
        canPrev: true,
        canNext: true,
        calendarControlsId: 'cal-1',
        previous: vi.fn(),
        next: vi.fn(),
        today: vi.fn(),
        registerCalendar: vi.fn(),
        ...overrides,
      });
      el._h_slot_picker = api;
      return api;
    }
    function mountControl(name, controlEl) {
      return mountDirective(slotPickerPlugin, name, controlEl, { original: name });
    }
    function childButton() {
      const b = document.createElement('button');
      el.appendChild(b);
      return b;
    }

    it('controls throw when mounted outside a slot picker', () => {
      const orphan = document.createElement('button');
      document.body.appendChild(orphan);
      ['h-slot-picker-previous', 'h-slot-picker-next', 'h-slot-picker-today', 'h-slot-picker-title', 'h-slot-picker-calendar'].forEach((name) => {
        expect(() => mountControl(name, orphan)).toThrow();
      });
    });

    it('previous control click calls api.previous', () => {
      const api = withPicker();
      const btn = childButton();
      mountControl('h-slot-picker-previous', btn);
      btn.click();
      expect(api.previous).toHaveBeenCalledTimes(1);
    });

    it('next control click calls api.next', () => {
      const api = withPicker();
      const btn = childButton();
      mountControl('h-slot-picker-next', btn);
      btn.click();
      expect(api.next).toHaveBeenCalledTimes(1);
    });

    it('today control click calls api.today', () => {
      const api = withPicker();
      const btn = childButton();
      mountControl('h-slot-picker-today', btn);
      btn.click();
      expect(api.today).toHaveBeenCalledTimes(1);
    });

    it('previous control reflects canPrev on disabled and updates reactively', () => {
      const api = withPicker({ canPrev: true });
      const btn = childButton();
      mountControl('h-slot-picker-previous', btn);
      expect(btn.disabled).toBe(false);
      expect(btn.getAttribute('aria-disabled')).toBe('false');
      api.canPrev = false;
      expect(btn.disabled).toBe(true);
      expect(btn.getAttribute('aria-disabled')).toBe('true');
    });

    it('next control reflects canNext on disabled and updates reactively', () => {
      const api = withPicker({ canNext: false });
      const btn = childButton();
      mountControl('h-slot-picker-next', btn);
      expect(btn.disabled).toBe(true);
      api.canNext = true;
      expect(btn.disabled).toBe(false);
    });

    it('title control renders api.title with aria-live, default styling, and updates reactively', () => {
      const api = withPicker({ title: 'June 22' });
      const h2 = document.createElement('h2');
      el.appendChild(h2);
      mountControl('h-slot-picker-title', h2);
      expect(h2.textContent).toBe('June 22');
      expect(h2.getAttribute('aria-live')).toBe('polite');
      expect(h2.getAttribute('data-slot')).toBe('slot-picker-title');
      ['flex-1', 'text-sm', 'font-semibold', 'text-center', 'leading-tight'].forEach((cls) => {
        expect(h2.classList.contains(cls)).toBe(true);
      });
      api.title = 'June 27';
      expect(h2.textContent).toBe('June 27');
    });

    it('title control with the text-only modifier applies no styling classes but keeps text, data-slot, and aria-live', () => {
      const api = withPicker({ title: 'June 22' });
      const h2 = document.createElement('h2');
      el.appendChild(h2);
      mountDirective(slotPickerPlugin, 'h-slot-picker-title', h2, { original: 'h-slot-picker-title', modifiers: ['text-only'] });
      ['flex-1', 'text-sm', 'font-semibold', 'text-center', 'leading-tight'].forEach((cls) => {
        expect(h2.classList.contains(cls)).toBe(false);
      });
      expect(h2.textContent).toBe('June 22');
      expect(h2.getAttribute('data-slot')).toBe('slot-picker-title');
      expect(h2.getAttribute('aria-live')).toBe('polite');
      api.title = 'June 27';
      expect(h2.textContent).toBe('June 27');
    });

    it('calendar control registers itself with the picker', () => {
      const api = withPicker();
      const btn = childButton();
      mountControl('h-slot-picker-calendar', btn);
      expect(api.registerCalendar).toHaveBeenCalledWith(btn, expect.objectContaining({ effect: expect.any(Function), cleanup: expect.any(Function) }));
    });
  });

  describe('number of days', () => {
    it('renders the configured number of day columns', () => {
      mount('config', withConfig({ date: FIXED_DATE, days: 5 }));
      expect(el.querySelectorAll('[data-slot="slot-picker-header"]').length).toBe(5);
    });

    it('clamps days above 7 down to 7', () => {
      mount('config', withConfig({ date: FIXED_DATE, days: 10 }));
      expect(el.querySelectorAll('[data-slot="slot-picker-header"]').length).toBe(7);
    });

    it('clamps days below 1 up to 1', () => {
      mount('config', withConfig({ date: FIXED_DATE, days: 0 }));
      expect(el.querySelectorAll('[data-slot="slot-picker-header"]').length).toBe(1);
    });

    it('does not collapse the day grid by default (no responsive classes)', () => {
      mount('config', withConfig({ date: FIXED_DATE, days: 5 }));
      const grid = el.querySelector('.grid');
      // Always dayCount columns with vertical dividers, at every width. A
      // column never gets narrower than its header's unwrapped rows, the grid's
      // box grows with its columns, and slot content never sizes a column.
      expect(grid.style.gridTemplateColumns).toBe('repeat(5,minmax(min-content,1fr))');
      expect(grid.classList.contains('min-w-min')).toBe(true);
      expect(grid.classList.contains('divide-x')).toBe(true);
      expect(el.querySelector('[data-slot="slot-picker-header"]').classList.contains('whitespace-nowrap')).toBe(true);
      expect(grid.firstElementChild.children[1].classList.contains('contain-inline-size')).toBe(true);
      // No single-column collapse, no md: breakpoint switches.
      expect(grid.classList.contains('grid-cols-1')).toBe(false);
      expect(grid.classList.contains('md:grid-cols-5')).toBe(false);
      expect(grid.classList.contains('divide-y')).toBe(false);
    });

    it('applies the responsive collapse classes when the responsive modifier is set', () => {
      mountResponsive('config', withConfig({ date: FIXED_DATE, days: 5 }));
      const grid = el.querySelector('.grid');
      // Single-column base + md: switches to dayCount columns with vertical dividers.
      expect(grid.classList.contains('grid-cols-1')).toBe(true);
      expect(grid.classList.contains('md:grid-cols-5')).toBe(true);
      expect(grid.classList.contains('divide-y')).toBe(true);
      expect(grid.classList.contains('md:divide-y-0')).toBe(true);
      expect(grid.classList.contains('md:divide-x')).toBe(true);
      // The default layout's content-sized columns stay out of it.
      expect(grid.style.gridTemplateColumns).toBe('');
      expect(grid.classList.contains('min-w-min')).toBe(false);
      expect(el.querySelector('[data-slot="slot-picker-header"]').classList.contains('whitespace-nowrap')).toBe(false);
    });

    it('moves the window by the configured number of days on next', () => {
      mount('config', withConfig({ date: FIXED_DATE, days: 5 }));
      // 22 + 5 = 27
      el._h_slot_picker.next();
      expect(el._h_slot_picker.title).toContain('27');
    });

    it('reports canNext false when the end day is the last of N visible days', () => {
      // days:5 from the 22nd shows 22..26; end day 26 is the last visible day.
      mount('config', withConfig({ date: FIXED_DATE, days: 5, maxDate: '2026-06-26' }));
      expect(el._h_slot_picker.canNext).toBe(false);
    });
  });

  describe('descriptions and notes', () => {
    const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, description: 'Consultation', note: 'Bring documents' }];

    it('renders the description and note under the time', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.querySelector('[data-slot="slot-picker-desc"]').textContent).toBe('Consultation');
      expect(cell.querySelector('[data-slot="slot-picker-note"]').textContent).toBe('Bring documents');
    });

    it('sets a title with the description and note as a truncation fallback', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.title).toContain('Consultation');
      expect(cell.title).toContain('Bring documents');
    });

    it('includes the description in the accessible name', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.getAttribute('aria-label')).toContain('Consultation');
    });
  });

  describe('color', () => {
    const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, color: 'blue' }];

    it('applies the color fill classes to a confirmed (default) colored slot', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.classList.contains('bg-blue-500')).toBe(true);
    });

    it('renders an unconfirmed colored slot as an outline (no fill)', () => {
      const outlined = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, color: 'blue', status: 'unconfirmed' }];
      mount('config', withConfig({ date: FIXED_DATE, slots: outlined }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.classList.contains('bg-blue-500')).toBe(false);
      expect(cell.classList.contains('border-blue-500')).toBe(true);
      expect(cell.classList.contains('text-blue-600')).toBe(true);
    });

    it('renders a rejected colored slot as a dashed outline (no fill)', () => {
      const rejected = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, color: 'blue', status: 'rejected' }];
      mount('config', withConfig({ date: FIXED_DATE, slots: rejected }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.classList.contains('bg-blue-500')).toBe(false);
      expect(cell.classList.contains('border-blue-500')).toBe(true);
      expect(cell.classList.contains('text-blue-600')).toBe(true);
      expect(cell.classList.contains('border-dashed')).toBe(true);
    });

    it('carries a transparent border on an unselected filled colored slot', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      // The border width is present up front so selection only swaps the color
      // (no layout shift); it starts transparent while unselected.
      expect(cell.classList.contains('border')).toBe(true);
      expect(cell.classList.contains('border-transparent')).toBe(true);
      expect(cell.classList.contains('border-background')).toBe(false);
    });

    it('shows a color-matched ring and a contrasting border on selection (like the active step)', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      cell.click();
      expect(cell.classList.contains('ring-[calc(var(--spacing)*0.75)]')).toBe(true);
      expect(cell.classList.contains('ring-blue-500/50')).toBe(true);
      expect(cell.classList.contains('border-background')).toBe(true);
      expect(cell.classList.contains('border-transparent')).toBe(false);
      expect(cell.classList.contains('bg-blue-500')).toBe(true);
      expect(cell.classList.contains('bg-primary')).toBe(false);
      expect(cell.classList.contains('ring-primary')).toBe(false);
      expect(cell.classList.contains('ring-inset')).toBe(false);
      expect(cell.getAttribute('aria-pressed')).toBe('true');
    });

    it('removes the ring and border color on deselect', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      cell.click();
      cell.click();
      expect(cell.classList.contains('ring-[calc(var(--spacing)*0.75)]')).toBe(false);
      expect(cell.classList.contains('ring-blue-500/50')).toBe(false);
      expect(cell.classList.contains('border-background')).toBe(false);
      expect(cell.classList.contains('border-transparent')).toBe(true);
      expect(cell.getAttribute('aria-pressed')).toBe('false');
    });

    it('adds the ring but not the border when selecting an unconfirmed colored slot', () => {
      withModel();
      const outlined = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, color: 'blue', status: 'unconfirmed' }];
      mount('config', withConfig({ date: FIXED_DATE, slots: outlined }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      cell.click();
      expect(cell.classList.contains('ring-blue-500/50')).toBe(true);
      // The outline keeps its own colored border; no border-background is added.
      expect(cell.classList.contains('border-blue-500')).toBe(true);
      expect(cell.classList.contains('border-background')).toBe(false);
    });

    it('adds the ring but not the border when selecting a rejected colored slot', () => {
      withModel();
      const rejected = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, color: 'blue', status: 'rejected' }];
      mount('config', withConfig({ date: FIXED_DATE, slots: rejected }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      cell.click();
      expect(cell.classList.contains('ring-blue-500/50')).toBe(true);
      expect(cell.classList.contains('border-blue-500')).toBe(true);
      expect(cell.classList.contains('border-dashed')).toBe(true);
      expect(cell.classList.contains('border-background')).toBe(false);
    });

    it('keeps the color on an unavailable slot instead of muting it', () => {
      const booked = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: false, color: 'red' }];
      mount('config', withConfig({ date: FIXED_DATE, slots: booked }));
      const cell = el.querySelector('div[data-slot="slot-picker-cell"]');
      expect(cell.classList.contains('bg-red-500')).toBe(true);
      expect(cell.classList.contains('bg-muted/50')).toBe(false);
    });

    it('leaves an unknown color uncolored', () => {
      const bad = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, color: 'chartreuse' }];
      mount('config', withConfig({ date: FIXED_DATE, slots: bad }));
      const cell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(cell.dataset.colored).toBeUndefined();
      expect(cell.classList.contains('border')).toBe(true);
    });
  });

  describe('sub-slots (tiles)', () => {
    const slots = [
      {
        date: FIXED_DATE,
        start: '09:00',
        end: '10:00',
        tiles: [
          { description: 'Room A', available: true },
          { description: 'Room B', available: true },
          { description: 'Room C', available: false },
        ],
      },
    ];

    it('renders a group container with a header and tile cells', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const group = el.querySelector('[data-slot="slot-picker-slot"]');
      expect(group).toBeTruthy();
      expect(group.getAttribute('role')).toBe('group');
      const header = group.querySelector('[data-slot="slot-picker-slot-header"]');
      expect(header.textContent).toContain('09:00');
      expect(group.getAttribute('aria-labelledby')).toBe(header.id);
      expect(group.querySelectorAll('button[data-slot="slot-picker-tile"]').length).toBe(2);
      expect(group.querySelectorAll('div[data-slot="slot-picker-tile"]').length).toBe(1);
    });

    it('does not render the parent slot as a selectable cell', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      expect(el.querySelectorAll('[data-slot="slot-picker-cell"]').length).toBe(0);
    });

    it('reports a composite key and tileIndex on tile click', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE, multiple: true, slots }));
      const handler = vi.fn();
      el.addEventListener('slot-click', handler);
      const tiles = el.querySelectorAll('button[data-slot="slot-picker-tile"]');
      tiles[1].click();
      const { slot } = handler.mock.calls[0][0].detail;
      expect(slot.key).toBe('2026-06-22T09:00#1');
      expect(slot.tileIndex).toBe(1);
      expect(slot.description).toBe('Room B');
      expect(slot.selected).toBe(true);
    });

    it('gives each tile a distinct key', () => {
      mount('config', withConfig({ date: FIXED_DATE, multiple: true, slots }));
      const handler = vi.fn();
      el.addEventListener('slot-click', handler);
      const tiles = el.querySelectorAll('button[data-slot="slot-picker-tile"]');
      tiles[0].click();
      tiles[1].click();
      expect(handler.mock.calls[0][0].detail.slot.key).not.toBe(handler.mock.calls[1][0].detail.slot.key);
    });
  });

  describe('event detail', () => {
    it('includes the new fields on a plain slot click', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: true, description: 'Consult', note: 'Note', color: 'green', status: 'unconfirmed' }];
      mount('config', withConfig({ date: FIXED_DATE, slots }));
      const handler = vi.fn();
      el.addEventListener('slot-click', handler);
      el.querySelector('button[data-slot="slot-picker-cell"]').click();
      const { slot } = handler.mock.calls[0][0].detail;
      expect(slot).toMatchObject({ date: FIXED_DATE, start: '09:00', end: '09:30', description: 'Consult', note: 'Note', color: 'green', status: 'unconfirmed', tileIndex: null });
      expect(slot.key).toBe('2026-06-22T09:00');
    });
  });

  describe('drag and drop', () => {
    const pointer = (target, type, coords = {}) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, ...coords }));

    function stubRect(node, rect) {
      node.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, ...rect });
    }

    function dayColumns() {
      return Array.from(el.querySelector('.overflow-auto').firstElementChild.children);
    }

    // Three 100px-wide side-by-side day columns: 22, 23, 24 June 2026.
    function stubColumns() {
      const cols = dayColumns();
      cols.forEach((col, i) => stubRect(col, { left: i * 100, right: (i + 1) * 100, top: 0, bottom: 500, width: 100, height: 500 }));
      return cols;
    }

    function slotList(colIdx) {
      return dayColumns()[colIdx].querySelector('[data-slot="slot-picker-header"]').nextElementSibling;
    }

    function slotNodes(colIdx) {
      return Array.from(slotList(colIdx).children).filter((n) => n.matches('[data-slot="slot-picker-cell"], [data-slot="slot-picker-slot"]'));
    }

    // Stub each slot node of a column as a 40px-spaced band (midpoints at 68,
    // 108, 148, ...). Stubs are own-property functions on the original nodes:
    // they do not move when a node is relocated and do not survive cloning, so
    // all midpoints stay static for a whole drag and expected indices derive
    // from the original geometry.
    function stubSlots(colIdx) {
      slotNodes(colIdx).forEach((n, j) => stubRect(n, { left: colIdx * 100, right: colIdx * 100 + 100, top: 50 + j * 40, bottom: 86 + j * 40, width: 100, height: 36 }));
    }

    function ghost() {
      return el.querySelector('[data-slot="slot-picker-ghost"]');
    }

    const baseSlots = () => [
      { date: FIXED_DATE, start: '09:00', end: '09:30' },
      { date: FIXED_DATE, start: '10:00', end: '10:30' },
    ];

    function firstCell() {
      return el.querySelector('button[data-slot="slot-picker-cell"]');
    }

    it('is inert when draggable is not enabled', () => {
      mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 50 });
      pointer(cell, 'pointerup', { clientX: 150, clientY: 50 });
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(ghost()).toBeNull();
      expect(drops).not.toHaveBeenCalled();
    });

    it('moves a slot to another day with a ghost, a live placeholder, and index and slots in the detail', () => {
      const slots = baseSlots();
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 250, clientY: 60 });
      // The ghost follows the pointer while the dimmed original is parked in
      // the hovered day's list.
      const g = ghost();
      expect(g).toBeTruthy();
      expect(g.parentNode).toBe(el);
      expect(g.getAttribute('aria-hidden')).toBe('true');
      ['absolute', 'opacity-50', 'pointer-events-none', 'z-50', 'shadow-lg'].forEach((c) => expect(g.classList.contains(c)).toBe(true));
      expect(cell.getAttribute('data-dragging')).toBe('true');
      expect(cell.classList.contains('opacity-50')).toBe(true);
      expect(cell.parentNode).toBe(slotList(2));
      pointer(cell, 'pointerup', { clientX: 250, clientY: 60 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.slot).toMatchObject({ date: FIXED_DATE, start: '09:00', end: '09:30', tileIndex: null });
      expect(detail.slot.key).toBe('2026-06-22T09:00');
      expect(detail.date).toBe('2026-06-24');
      expect(detail.index).toBe(0);
      expect(detail.slots).toEqual([slots[1], { ...slots[0], date: '2026-06-24' }]);
      expect(detail.slots).not.toBe(slots);
      expect(slots[0].date).toBe(FIXED_DATE);
      // Snap-back: ghost gone, the slot restored to its home position and look.
      expect(ghost()).toBeNull();
      expect(cell.parentNode).toBe(slotList(0));
      expect(slotNodes(0)[0]).toBe(cell);
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(cell.classList.contains('opacity-50')).toBe(false);
    });

    it('reorders a slot down within its day', () => {
      const slots = [...baseSlots(), { date: FIXED_DATE, start: '11:00', end: '11:30' }];
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      stubColumns();
      stubSlots(0);
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const [c0, c1, c2] = slotNodes(0);
      pointer(c0, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(c0, 'pointermove', { clientX: 50, clientY: 120 });
      // Past cell 1's midpoint (108): the placeholder parks between 10:00 and 11:00.
      expect(slotNodes(0)).toEqual([c1, c0, c2]);
      pointer(c0, 'pointerup', { clientX: 50, clientY: 120 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.date).toBe(FIXED_DATE);
      expect(detail.index).toBe(1);
      expect(detail.slots).toEqual([slots[1], { ...slots[0] }, slots[2]]);
      expect(slotNodes(0)).toEqual([c0, c1, c2]);
    });

    it('reorders a slot up within its day', () => {
      const slots = [...baseSlots(), { date: FIXED_DATE, start: '11:00', end: '11:30' }];
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      stubColumns();
      stubSlots(0);
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const [c0, c1, c2] = slotNodes(0);
      pointer(c2, 'pointerdown', { clientX: 50, clientY: 140 });
      pointer(c2, 'pointermove', { clientX: 50, clientY: 60 });
      // Above cell 0's midpoint (68): the placeholder parks first.
      expect(slotNodes(0)).toEqual([c2, c0, c1]);
      pointer(c2, 'pointerup', { clientX: 50, clientY: 60 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.date).toBe(FIXED_DATE);
      expect(detail.index).toBe(0);
      expect(detail.slots).toEqual([{ ...slots[2] }, slots[0], slots[1]]);
    });

    it('inserts between existing slots on a cross-day move', () => {
      const slots = [
        { date: FIXED_DATE, start: '09:00', end: '09:30' },
        { date: '2026-06-23', start: '09:00', end: '09:30' },
        { date: '2026-06-23', start: '10:00', end: '10:30' },
      ];
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      stubColumns();
      stubSlots(1);
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 100 });
      expect(cell.parentNode).toBe(slotList(1));
      expect(slotNodes(1)[1]).toBe(cell);
      pointer(cell, 'pointerup', { clientX: 150, clientY: 100 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.date).toBe('2026-06-23');
      expect(detail.index).toBe(1);
      expect(detail.slots).toEqual([slots[1], { ...slots[0], date: '2026-06-23' }, slots[2]]);
    });

    it('does not dispatch on a same-position drop and suppresses the trailing click', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      stubSlots(0);
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('slot-drop', drops);
      el.addEventListener('slot-click', clicks);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 60, clientY: 60 });
      pointer(cell, 'pointerup', { clientX: 60, clientY: 60 });
      expect(drops).not.toHaveBeenCalled();
      cell.click();
      expect(clicks).not.toHaveBeenCalled();
      cell.click();
      expect(clicks).toHaveBeenCalledOnce();
    });

    it('dispatches nothing after a round trip back to the original position', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      stubSlots(0);
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const [c0, c1] = slotNodes(0);
      pointer(c0, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(c0, 'pointermove', { clientX: 50, clientY: 120 });
      expect(slotNodes(0)).toEqual([c1, c0]);
      pointer(c0, 'pointermove', { clientX: 50, clientY: 60 });
      expect(slotNodes(0)).toEqual([c0, c1]);
      pointer(c0, 'pointerup', { clientX: 50, clientY: 60 });
      expect(drops).not.toHaveBeenCalled();
    });

    it('keeps sub-threshold moves as plain clicks', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      const clicks = vi.fn();
      el.addEventListener('slot-click', clicks);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(cell, 'pointermove', { clientX: 52, clientY: 51 });
      pointer(cell, 'pointerup', { clientX: 52, clientY: 51 });
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(ghost()).toBeNull();
      cell.click();
      expect(clicks).toHaveBeenCalledOnce();
    });

    it('leaves the selection untouched by a drag', () => {
      withModel();
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      const cell = firstCell();
      cell.click();
      expect(cell.getAttribute('aria-pressed')).toBe('true');
      expect(el._x_model.get()).toBe('2026-06-22T09:00');
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 50 });
      pointer(cell, 'pointerup', { clientX: 150, clientY: 50 });
      expect(cell.getAttribute('aria-pressed')).toBe('true');
      expect(el._x_model.get()).toBe('2026-06-22T09:00');
    });

    it('respects a per-slot draggable: false', () => {
      const slots = baseSlots();
      slots[0].draggable = false;
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 50 });
      pointer(cell, 'pointerup', { clientX: 150, clientY: 50 });
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
    });

    it('never drags unavailable slots', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: false }] }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = el.querySelector('[data-slot="slot-picker-cell"]');
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 50 });
      pointer(cell, 'pointerup', { clientX: 150, clientY: 50 });
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
    });

    it('never targets a disabled day column', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots(), disabledDates: ['2026-06-23'] }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 60 });
      // The disabled middle day is no target: the placeholder stays home.
      expect(cell.parentNode).toBe(slotList(0));
      expect(slotNodes(0)[0]).toBe(cell);
      pointer(cell, 'pointerup', { clientX: 150, clientY: 60 });
      expect(drops).not.toHaveBeenCalled();
    });

    it('restores the placeholder and dispatches nothing on a drop outside every column', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 60 });
      expect(cell.parentNode).toBe(slotList(1));
      pointer(cell, 'pointermove', { clientX: -50, clientY: 60 });
      expect(cell.parentNode).toBe(slotList(0));
      expect(slotNodes(0)[0]).toBe(cell);
      pointer(cell, 'pointerup', { clientX: -50, clientY: 60 });
      expect(drops).not.toHaveBeenCalled();
      expect(ghost()).toBeNull();
    });

    it('clamps the pointer into the day grid so edges still target the nearest day', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      stubRect(el.querySelector('.overflow-auto').firstElementChild, { left: 0, right: 300, top: 0, bottom: 500, width: 300, height: 500 });
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      // Far below the grid over column 1's x range: clamps to column 1.
      pointer(cell, 'pointermove', { clientX: 150, clientY: 700 });
      expect(cell.parentNode).toBe(slotList(1));
      pointer(cell, 'pointerup', { clientX: 150, clientY: 700 });
      expect(drops).toHaveBeenCalledOnce();
      expect(drops.mock.calls[0][0].detail.date).toBe('2026-06-23');
    });

    it('never drags generated slots', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, start: '09:00', end: '11:00', step: 60 }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 60 });
      pointer(cell, 'pointerup', { clientX: 150, clientY: 60 });
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(ghost()).toBeNull();
      expect(drops).not.toHaveBeenCalled();
    });

    it('keeps fillEmptyDays fillers inert but accepts drops on their day', () => {
      const raw = { date: FIXED_DATE, start: '08:00', end: '08:30' };
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, fillEmptyDays: true, start: '09:00', end: '11:00', step: 60, slots: [raw] }));
      stubColumns();
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      // Generated fillers on other days do not drag.
      const filler = slotNodes(1)[0];
      pointer(filler, 'pointerdown', { clientX: 150, clientY: 60 });
      pointer(filler, 'pointermove', { clientX: 250, clientY: 60 });
      pointer(filler, 'pointerup', { clientX: 250, clientY: 60 });
      expect(filler.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
      // The explicit slot can drop on a generated day: the visual position
      // appends past the fillers while the proposed array simply gains the
      // day's only explicit slot.
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 60 });
      pointer(cell, 'pointerup', { clientX: 150, clientY: 60 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.date).toBe('2026-06-23');
      expect(detail.index).toBe(2);
      expect(detail.slots).toEqual([{ ...raw, date: '2026-06-23' }]);
    });

    it('drags a tiled slot as a whole from its header, never from a tile', () => {
      const slots = [{ date: FIXED_DATE, start: '09:00', end: '10:00', tiles: [{ description: 'Room A' }, { description: 'Room B' }] }];
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      stubColumns();
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('slot-drop', drops);
      el.addEventListener('slot-click', clicks);
      const group = el.querySelector('[data-slot="slot-picker-slot"]');
      const header = group.querySelector('[data-slot="slot-picker-slot-header"]');
      const tile = group.querySelector('[data-slot="slot-picker-tile"]');

      // A press on a tile never starts a group drag.
      pointer(tile, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(tile, 'pointermove', { clientX: 150, clientY: 50 });
      pointer(tile, 'pointerup', { clientX: 150, clientY: 50 });
      expect(group.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
      tile.click();
      expect(clicks).toHaveBeenCalledOnce();

      // A press on the header drags the whole group.
      pointer(header, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(group, 'pointermove', { clientX: 150, clientY: 50 });
      expect(group.getAttribute('data-dragging')).toBe('true');
      expect(group.parentNode).toBe(slotList(1));
      pointer(group, 'pointerup', { clientX: 150, clientY: 50 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.slot).toMatchObject({ date: FIXED_DATE, start: '09:00', end: '10:00', tileIndex: null });
      expect(detail.date).toBe('2026-06-23');
      expect(detail.index).toBe(0);
      expect(detail.slots).toEqual([{ ...slots[0], date: '2026-06-23' }]);
      // Group drags never suppress the next tile click.
      tile.click();
      expect(clicks).toHaveBeenCalledTimes(2);
    });

    it('aborts on pointercancel without dispatching or suppressing clicks', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      const drops = vi.fn();
      const clicks = vi.fn();
      el.addEventListener('slot-drop', drops);
      el.addEventListener('slot-click', clicks);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 50 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 50 });
      expect(ghost()).toBeTruthy();
      expect(cell.parentNode).toBe(slotList(1));
      pointer(cell, 'pointercancel', {});
      expect(ghost()).toBeNull();
      expect(cell.parentNode).toBe(slotList(0));
      expect(cell.hasAttribute('data-dragging')).toBe(false);
      expect(drops).not.toHaveBeenCalled();
      cell.click();
      expect(clicks).toHaveBeenCalledOnce();
    });

    it('positions the ghost from the pointer and the grab offset in rem', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      stubSlots(0);
      stubRect(el, { left: 0, top: 0, width: 300, height: 600 });
      const cell = firstCell();
      // Grab at (50, 60) on the 100x36 cell at (0, 50): offset (50, 10).
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 200 });
      const g = ghost();
      expect(g.style.width).toBe('6.25rem');
      expect(g.style.height).toBe('2.25rem');
      expect(g.style.left).toBe('6.25rem');
      expect(g.style.top).toBe('11.875rem');
      // The cell's own `relative` must not survive on the clone, where it
      // would win over `absolute` and leave the ghost in the flow.
      expect(g.classList.contains('relative')).toBe(false);
      pointer(cell, 'pointerup', { clientX: 150, clientY: 200 });
    });

    it('nudges the scroll body when dragging near its edges', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      const scrollBody = el.querySelector('.overflow-auto');
      stubRect(scrollBody, { top: 0, bottom: 500, height: 500, width: 300 });
      scrollBody.scrollTop = 100;
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
      pointer(cell, 'pointermove', { clientX: 50, clientY: 490 });
      expect(scrollBody.scrollTop).toBe(115);
      pointer(cell, 'pointermove', { clientX: 50, clientY: 10 });
      expect(scrollBody.scrollTop).toBe(100);
      pointer(cell, 'pointerup', { clientX: 50, clientY: 10 });
    });

    it('nudges the scroll body sideways when dragging near its left and right edges', () => {
      mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
      stubColumns();
      const scrollBody = el.querySelector('.overflow-auto');
      stubRect(scrollBody, { left: 0, right: 300, top: 0, bottom: 500, width: 300, height: 500 });
      scrollBody.scrollLeft = 100;
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 150, clientY: 200 });
      pointer(cell, 'pointermove', { clientX: 290, clientY: 200 });
      expect(scrollBody.scrollLeft).toBe(115);
      pointer(cell, 'pointermove', { clientX: 10, clientY: 200 });
      expect(scrollBody.scrollLeft).toBe(100);
      // Away from both edges it stays put.
      pointer(cell, 'pointermove', { clientX: 150, clientY: 200 });
      expect(scrollBody.scrollLeft).toBe(100);
      pointer(cell, 'pointerup', { clientX: 150, clientY: 200 });
    });

    it('keeps the now indicator safe while a drag parks a slot elsewhere', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2026, 5, 22, 10, 30, 0));
      try {
        const slots = [
          { date: FIXED_DATE, start: '09:00', end: '09:30' },
          { date: FIXED_DATE, start: '12:00', end: '12:30' },
          { date: FIXED_DATE, start: '23:00', end: '23:30' },
        ];
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, showNowIndicator: true, slots }));
        stubColumns();
        const cell = slotNodes(0)[2];
        pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(cell, 'pointermove', { clientX: 150, clientY: 60 });
        expect(cell.parentNode).toBe(slotList(1));
        // The 12:00 boundary tick fires while the 23:00 slot is parked in
        // another column. It must not throw and must keep the indicator in
        // today's list.
        expect(() => vi.advanceTimersByTime(90 * 60000)).not.toThrow();
        expect(el.querySelector('[data-slot="slot-picker-now"]').parentNode).toBe(slotList(0));
        pointer(cell, 'pointerup', { clientX: 150, clientY: 60 });
      } finally {
        vi.useRealTimers();
      }
    });

    it('targets stacked responsive columns by their vertical rects', () => {
      const slots = [
        { date: FIXED_DATE, start: '09:00', end: '09:30' },
        { date: '2026-06-23', start: '09:30', end: '10:00' },
      ];
      mountResponsive('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
      const cols = dayColumns();
      cols.forEach((col, i) => stubRect(col, { left: 0, right: 300, top: i * 200, bottom: (i + 1) * 200, width: 300, height: 200 }));
      const drops = vi.fn();
      el.addEventListener('slot-drop', drops);
      const cell = firstCell();
      pointer(cell, 'pointerdown', { clientX: 150, clientY: 100 });
      pointer(cell, 'pointermove', { clientX: 150, clientY: 300 });
      expect(cell.parentNode).toBe(slotList(1));
      pointer(cell, 'pointerup', { clientX: 150, clientY: 300 });
      expect(drops).toHaveBeenCalledOnce();
      const detail = drops.mock.calls[0][0].detail;
      expect(detail.date).toBe('2026-06-23');
      expect(detail.index).toBe(1);
      expect(detail.slots).toEqual([slots[1], { ...slots[0], date: '2026-06-23' }]);
    });
  });

  describe('now indicator', () => {
    // FIXED_DATE (2026-06-22) is "today" and the first visible column.
    const setNow = (h, m) => vi.setSystemTime(new Date(2026, 5, 22, h, m, 0));
    const indicators = () => el.querySelectorAll('[data-slot="slot-picker-now"]');
    const dayList = (i) => el.querySelectorAll('[data-slot="slot-picker-header"]')[i].nextElementSibling;
    const indicatorIndex = (i) => Array.from(dayList(i).children).findIndex((n) => n.getAttribute('data-slot') === 'slot-picker-now');

    beforeEach(() => {
      vi.useFakeTimers();
      setNow(10, 30);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('is off by default and schedules no timer', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      expect(indicators().length).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    });

    it('stays off with an explicit showNowIndicator: false', () => {
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: false }));
      expect(indicators().length).toBe(0);
      expect(vi.getTimerCount()).toBe(0);
    });

    it("renders exactly once and only in today's column", () => {
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      expect(indicators().length).toBe(1);
      expect(dayList(0).contains(indicators()[0])).toBe(true);
      expect(dayList(1).querySelector('[data-slot="slot-picker-now"]')).toBeNull();
      expect(dayList(2).querySelector('[data-slot="slot-picker-now"]')).toBeNull();
    });

    it('renders a decorative dot + line row', () => {
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      const indicator = indicators()[0];
      expect(indicator.getAttribute('aria-hidden')).toBe('true');
      expect(indicator.classList.contains('pointer-events-none')).toBe(true);
      const [dot, line] = indicator.children;
      expect(dot.classList.contains('bg-red-500')).toBe(true);
      expect(dot.classList.contains('rounded-full')).toBe(true);
      expect(line.classList.contains('bg-red-500')).toBe(true);
      expect(line.classList.contains('h-px')).toBe(true);
      expect(line.classList.contains('flex-1')).toBe(true);
    });

    it('sits below every slot that has already started (10:30 -> between 10:00 and 11:00)', () => {
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      const kids = Array.from(dayList(0).children);
      const idx = indicatorIndex(0);
      expect(idx).toBe(3); // after 08:00, 09:00, 10:00
      expect(kids[idx - 1].textContent).toContain('10:00');
      expect(kids[idx + 1].textContent).toContain('11:00');
    });

    it('counts a slot starting exactly now as started', () => {
      setNow(10, 0);
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      const kids = Array.from(dayList(0).children);
      const idx = indicatorIndex(0);
      expect(idx).toBe(3);
      expect(kids[idx - 1].textContent).toContain('10:00');
    });

    it('is the first child before the schedule starts', () => {
      setNow(7, 0);
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      expect(dayList(0).firstElementChild.getAttribute('data-slot')).toBe('slot-picker-now');
    });

    it('is the last child after the schedule ends', () => {
      setNow(19, 30);
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      expect(dayList(0).lastElementChild.getAttribute('data-slot')).toBe('slot-picker-now');
    });

    it('positions tile groups by their slot start', () => {
      const slots = [
        { date: FIXED_DATE, start: '09:00', end: '10:00', tiles: [{ description: 'Room A', available: true }] },
        { date: FIXED_DATE, start: '11:00', end: '11:30', available: true },
      ];
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true, slots }));
      const order = Array.from(dayList(0).children).map((n) => n.getAttribute('data-slot'));
      expect(order).toEqual(['slot-picker-slot', 'slot-picker-now', 'slot-picker-cell']);
    });

    it('is the only child of an empty today column', () => {
      const slots = [{ date: '2026-06-23', start: '09:00', end: '09:30', available: true }];
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true, slots }));
      expect(dayList(0).children.length).toBe(1);
      expect(dayList(0).firstElementChild.getAttribute('data-slot')).toBe('slot-picker-now');
    });

    it('does not render when today is outside the visible window', () => {
      mount('config', withConfig({ date: '2026-06-25', showNowIndicator: true }));
      expect(indicators().length).toBe(0);
    });

    it('does not render when today is disabled', () => {
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true, disabledDates: [FIXED_DATE] }));
      expect(indicators().length).toBe(0);
    });

    it('moves itself at the next slot boundary without re-rendering', () => {
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      const indicator = indicators()[0];
      const firstCell = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(indicatorIndex(0)).toBe(3);

      vi.advanceTimersByTime(30 * 60 * 1000); // 11:00
      expect(indicators()[0]).toBe(indicator);
      expect(indicatorIndex(0)).toBe(4);
      expect(el.contains(firstCell)).toBe(true); // cells were not rebuilt

      vi.advanceTimersByTime(60 * 60 * 1000); // 12:00, timer re-armed
      expect(indicatorIndex(0)).toBe(5);
    });

    it('hops to the new today column after midnight', () => {
      setNow(17, 30);
      mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      expect(dayList(0).lastElementChild.getAttribute('data-slot')).toBe('slot-picker-now');

      vi.advanceTimersByTime(7 * 60 * 60 * 1000); // 00:30 on 2026-06-23
      expect(indicators().length).toBe(1);
      expect(dayList(1).contains(indicators()[0])).toBe(true);
      expect(dayList(0).querySelector('[data-slot="slot-picker-now"]')).toBeNull();
    });

    it('appears at midnight when today was not visible but tomorrow is', () => {
      setNow(23, 30);
      mount('config', withConfig({ date: '2026-06-23', showNowIndicator: true }));
      expect(indicators().length).toBe(0);
      expect(vi.getTimerCount()).toBe(1);

      vi.advanceTimersByTime(60 * 60 * 1000); // 00:30 on 2026-06-23
      expect(indicators().length).toBe(1);
      expect(dayList(0).contains(indicators()[0])).toBe(true);
    });

    it('clears its timer on cleanup', () => {
      const { ctx } = mount('config', withConfig({ date: FIXED_DATE, showNowIndicator: true }));
      expect(vi.getTimerCount()).toBe(1);
      ctx.cleanup.mock.calls.forEach(([fn]) => fn());
      expect(vi.getTimerCount()).toBe(0);

      const idx = indicatorIndex(0);
      vi.advanceTimersByTime(2 * 60 * 60 * 1000);
      expect(indicatorIndex(0)).toBe(idx); // nothing moved after teardown
    });
  });

  describe('visible range', () => {
    const firstHeader = () => el.querySelector('[data-slot="slot-picker-header"]').textContent;
    const tick = () => new Promise((resolve) => queueMicrotask(resolve));
    const detail = (handler, i = 0) => handler.mock.calls[i][0].detail;

    // Pin today to June 22 so the today control is deterministic. Only Date is
    // faked: the deferred initial range-change still runs as a real microtask.
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(new Date(2026, 5, 22, 12));
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    // Mount with a reactive config and let the deferred initial range-change
    // pass, so a handler added afterwards sees only the moves under test.
    async function mountReactive(initial) {
      const cfg = createMockAlpine().reactive({ value: initial });
      mount('config', { evaluateLater: () => (cb) => cb(cfg.value) });
      await tick();
      return cfg;
    }

    function listen() {
      const handler = vi.fn();
      el.addEventListener('range-change', handler);
      return handler;
    }

    it('keeps the visible range when slots are replaced after paging', async () => {
      const cfg = await mountReactive({ date: FIXED_DATE, slots: [] });
      el._h_slot_picker.next();
      expect(firstHeader()).toContain('June 25');
      cfg.value = { date: FIXED_DATE, slots: [{ date: '2026-06-25', start: '09:00', end: '09:30' }] };
      expect(firstHeader()).toContain('June 25');
      expect(el.querySelectorAll('[data-slot="slot-picker-cell"]').length).toBe(1);
    });

    it('keeps the visible range when days changes after paging', async () => {
      const cfg = await mountReactive({ date: FIXED_DATE });
      el._h_slot_picker.next();
      cfg.value = { date: FIXED_DATE, days: 5 };
      expect(firstHeader()).toContain('June 25');
      expect(el.querySelectorAll('[data-slot="slot-picker-header"]').length).toBe(5);
    });

    it('moves the visible range when date changes', async () => {
      const cfg = await mountReactive({ date: FIXED_DATE });
      el._h_slot_picker.next();
      cfg.value = { date: '2026-07-01' };
      expect(firstHeader()).toContain('July 1');
    });

    it('compares a Date value by day, so a new Date object for the same day keeps the range', async () => {
      const cfg = await mountReactive({ date: new Date(2026, 5, 22) });
      el._h_slot_picker.next();
      cfg.value = { date: new Date(2026, 5, 22) };
      expect(firstHeader()).toContain('June 25');
      cfg.value = { date: new Date(2026, 6, 1) };
      expect(firstHeader()).toContain('July 1');
    });

    it('dispatches range-change once after init, after the directive has run', async () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const handler = listen();
      expect(handler).not.toHaveBeenCalled();
      await tick();
      expect(handler).toHaveBeenCalledOnce();
      expect(detail(handler)).toEqual({ from: '2026-06-22', to: '2026-06-24' });
    });

    it('dispatches a bubbling range-change on next, previous and today', async () => {
      await mountReactive({ date: '2026-06-01' });
      const handler = listen();
      el._h_slot_picker.next();
      el._h_slot_picker.previous();
      el._h_slot_picker.today();
      await tick();
      expect(detail(handler, 0)).toEqual({ from: '2026-06-04', to: '2026-06-06' });
      expect(detail(handler, 1)).toEqual({ from: '2026-06-01', to: '2026-06-03' });
      expect(detail(handler, 2)).toEqual({ from: '2026-06-22', to: '2026-06-24' });
      expect(handler.mock.calls[2][0].bubbles).toBe(true);
      expect(handler).toHaveBeenCalledTimes(3);
    });

    it('dispatches range-change when date or days changes in the config, not when slots change', async () => {
      const cfg = await mountReactive({ date: FIXED_DATE });
      const handler = listen();
      cfg.value = { date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30' }] };
      await tick();
      expect(handler).not.toHaveBeenCalled();
      cfg.value = { date: FIXED_DATE, days: 5 };
      await tick();
      expect(detail(handler, 0)).toEqual({ from: '2026-06-22', to: '2026-06-26' });
      cfg.value = { date: '2026-07-01', days: 5 };
      await tick();
      expect(detail(handler, 1)).toEqual({ from: '2026-07-01', to: '2026-07-05' });
      expect(handler).toHaveBeenCalledTimes(2);
    });

    // A handler loading the slots of the new range assigns to the configuration. Dispatched
    // inside the configuration effect, that assignment would never re-run it.
    it('dispatches range-change for a date change outside the configuration effect, a microtask later', async () => {
      const cfg = await mountReactive({ date: FIXED_DATE, slots: [] });
      const handler = listen();
      cfg.value = { date: '2026-07-01', slots: [] };
      expect(firstHeader()).toContain('July 1');
      expect(handler).not.toHaveBeenCalled();
      await tick();
      expect(detail(handler)).toEqual({ from: '2026-07-01', to: '2026-07-03' });
    });

    it('dispatches nothing when today is pressed while today is already the first visible day', async () => {
      await mountReactive({ date: FIXED_DATE });
      const handler = listen();
      el._h_slot_picker.today();
      await tick();
      expect(handler).not.toHaveBeenCalled();
    });

    it('dispatches range-change when a date is picked in the calendar dialog', async () => {
      await mountReactive({ date: FIXED_DATE });
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Choose date');
      el.appendChild(btn);
      mountDirective(slotPickerPlugin, 'h-slot-picker-calendar', btn, { original: 'h-slot-picker-calendar' });
      const handler = listen();
      btn.click();
      el.querySelector('[data-slot="slot-picker-calendar"] td[data-day="10"]').click();
      await tick();
      expect(detail(handler)).toEqual({ from: '2026-06-10', to: '2026-06-12' });
    });
  });

  describe('managing slots (#146)', () => {
    const pointer = (target, type, coords = {}) => target.dispatchEvent(new MouseEvent(type, { bubbles: true, ...coords }));
    const rightClick = (node, coords = {}) => {
      const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true, ...coords });
      node.dispatchEvent(event);
      return event;
    };
    const touchDown = (node, coords = {}) => node.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch', isPrimary: true, ...coords }));
    const tick = () => new Promise((resolve) => queueMicrotask(resolve));

    function stubRect(node, rect) {
      node.getBoundingClientRect = () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0, ...rect });
    }

    function dayColumns() {
      return Array.from(el.querySelector('.overflow-auto').firstElementChild.children);
    }

    // Three 100px-wide side-by-side day columns: 22, 23, 24 June 2026.
    function stubColumns() {
      dayColumns().forEach((col, i) => stubRect(col, { left: i * 100, right: (i + 1) * 100, top: 0, bottom: 500, width: 100, height: 500 }));
    }

    function slotList(colIdx) {
      return dayColumns()[colIdx].querySelector('[data-slot="slot-picker-header"]').nextElementSibling;
    }

    function slotNodes(colIdx) {
      return Array.from(slotList(colIdx).children).filter((n) => n.matches('[data-slot="slot-picker-cell"], [data-slot="slot-picker-slot"]'));
    }

    // Each slot node of a column as a 40px-spaced band: 50-86, 90-126, 130-166, ...
    function stubSlots(colIdx) {
      slotNodes(colIdx).forEach((n, j) => stubRect(n, { left: colIdx * 100, right: colIdx * 100 + 100, top: 50 + j * 40, bottom: 86 + j * 40, width: 100, height: 36 }));
    }

    const ghost = () => el.querySelector('[data-slot="slot-picker-ghost"]');
    const firstCell = () => el.querySelector('[data-slot="slot-picker-cell"]');
    const listen = (name) => {
      const handler = vi.fn();
      el.addEventListener(name, handler);
      return handler;
    };
    const detail = (handler, i = 0) => handler.mock.calls[i][0].detail;

    function mountCalendar() {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Choose date');
      el.appendChild(btn);
      mountDirective(slotPickerPlugin, 'h-slot-picker-calendar', btn, { original: 'h-slot-picker-calendar' });
      return btn;
    }

    const baseSlots = () => [
      { date: FIXED_DATE, start: '09:00', end: '09:30' },
      { date: FIXED_DATE, start: '10:00', end: '10:30' },
    ];

    const tiledSlots = () => [{ date: FIXED_DATE, start: '09:00', end: '10:00', tiles: [{ description: 'Room A' }, { description: 'Room B', available: false }] }];

    describe('event detail carries the original objects', () => {
      it('passes the slot object as item and null as parent on a slot click', () => {
        const slots = baseSlots();
        mount('config', withConfig({ date: FIXED_DATE, slots }));
        const handler = listen('slot-click');
        firstCell().click();
        expect(detail(handler).slot.item).toBe(slots[0]);
        expect(detail(handler).slot.parent).toBeNull();
      });

      it('passes the tile object as item and its slot as parent on a tile click', () => {
        const slots = tiledSlots();
        mount('config', withConfig({ date: FIXED_DATE, slots }));
        const handler = listen('slot-click');
        el.querySelector('button[data-slot="slot-picker-tile"]').click();
        expect(detail(handler).slot.item).toBe(slots[0].tiles[0]);
        expect(detail(handler).slot.parent).toBe(slots[0]);
      });

      it('passes item on a reorder drop', () => {
        const slots = baseSlots();
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
        stubColumns();
        stubSlots(0);
        const drops = listen('slot-drop');
        const cell = firstCell();
        pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(cell, 'pointermove', { clientX: 50, clientY: 140 });
        pointer(cell, 'pointerup', { clientX: 50, clientY: 140 });
        expect(drops).toHaveBeenCalledOnce();
        expect(detail(drops).slot.item).toBe(slots[0]);
        expect(detail(drops).slots).toHaveLength(2);
      });
    });

    describe('data attributes and consumer class/data', () => {
      it('marks cells with their date, start and key', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
        const cell = firstCell();
        expect(cell.getAttribute('data-key')).toBe('2026-06-22T09:00');
        expect(cell.getAttribute('data-date')).toBe(FIXED_DATE);
        expect(cell.getAttribute('data-start')).toBe('09:00');
        expect(cell.hasAttribute('data-tile-index')).toBe(false);
      });

      it('marks tiles with their index and the group with the slot key', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: tiledSlots() }));
        const group = el.querySelector('[data-slot="slot-picker-slot"]');
        expect(group.getAttribute('data-key')).toBe('2026-06-22T09:00');
        expect(group.getAttribute('data-date')).toBe(FIXED_DATE);
        expect(group.getAttribute('data-start')).toBe('09:00');
        const tiles = el.querySelectorAll('[data-slot="slot-picker-tile"]');
        expect(tiles[1].getAttribute('data-key')).toBe('2026-06-22T09:00#1');
        expect(tiles[1].getAttribute('data-tile-index')).toBe('1');
        expect(tiles[1].getAttribute('data-start')).toBe('09:00');
      });

      it('adds the consumer class and data attributes to a cell and a group', () => {
        const slots = [
          { date: FIXED_DATE, start: '09:00', end: '09:30', class: 'italic custom-slot', data: { id: 42, owner: 'anna', nothing: null, skipped: undefined } },
          { date: FIXED_DATE, start: '10:00', end: '11:00', class: 'custom-group', data: { id: 7 }, tiles: [{ description: 'A', class: 'custom-tile', data: { seat: 1 } }] },
        ];
        mount('config', withConfig({ date: FIXED_DATE, slots }));
        const cell = firstCell();
        expect(cell.classList.contains('italic')).toBe(true);
        expect(cell.classList.contains('custom-slot')).toBe(true);
        expect(cell.getAttribute('data-id')).toBe('42');
        expect(cell.getAttribute('data-owner')).toBe('anna');
        expect(cell.hasAttribute('data-nothing')).toBe(false);
        expect(cell.hasAttribute('data-skipped')).toBe(false);
        const group = el.querySelector('[data-slot="slot-picker-slot"]');
        expect(group.classList.contains('custom-group')).toBe(true);
        expect(group.getAttribute('data-id')).toBe('7');
        const tile = el.querySelector('[data-slot="slot-picker-tile"]');
        expect(tile.classList.contains('custom-tile')).toBe(true);
        expect(tile.getAttribute('data-seat')).toBe('1');
      });

      it("lets the picker's own attributes win over consumer data", () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', data: { slot: 'x', key: 'y', date: 'z' } }] }));
        const cell = firstCell();
        expect(cell.getAttribute('data-slot')).toBe('slot-picker-cell');
        expect(cell.getAttribute('data-key')).toBe('2026-06-22T09:00');
        expect(cell.getAttribute('data-date')).toBe(FIXED_DATE);
      });
    });

    describe('clickable unavailable slots', () => {
      const booking = (extra = {}) => ({ date: FIXED_DATE, start: '09:00', end: '09:30', available: false, clickable: true, description: 'Anna', ...extra });

      it('renders as a focusable button announced as not available and never selectable', () => {
        withModel();
        mount('config', withConfig({ date: FIXED_DATE, slots: [booking()] }));
        const cell = firstCell();
        expect(cell.tagName).toBe('BUTTON');
        expect(cell.getAttribute('type')).toBe('button');
        expect(cell.hasAttribute('aria-disabled')).toBe(false);
        expect(cell.getAttribute('aria-label')).toMatch(/Anna, Not available$/);
        expect(cell.querySelector('.sr-only')).toBeNull();
        expect(cell.classList.contains('cursor-pointer')).toBe(true);
        expect(cell.classList.contains('cursor-not-allowed')).toBe(false);
        expect(cell.classList.contains('bg-muted/50')).toBe(true);
        expect(cell.classList.contains('bg-background')).toBe(false);
        const handler = listen('slot-click');
        cell.click();
        expect(detail(handler).slot).toMatchObject({ available: false, selected: false, key: '2026-06-22T09:00' });
        expect(cell.hasAttribute('aria-pressed')).toBe(false);
        expect(cell.classList.contains('bg-primary')).toBe(false);
        expect(el._x_model.get()).toBeNull();
      });

      it('keeps its color when colored and uses the data-unavailable-label override', () => {
        el.setAttribute('data-unavailable-label', 'Booked');
        mount('config', withConfig({ date: FIXED_DATE, slots: [booking({ color: 'red' })] }));
        const cell = firstCell();
        expect(cell.getAttribute('data-colored')).toBe('true');
        expect(cell.getAttribute('data-color')).toBe('red');
        expect(cell.classList.contains('bg-muted/50')).toBe(false);
        expect(cell.getAttribute('aria-label')).toMatch(/, Booked$/);
      });

      it('applies to tiles too', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '10:00', tiles: [{ description: 'Anna', available: false, clickable: true }] }] }));
        const tile = el.querySelector('[data-slot="slot-picker-tile"]');
        expect(tile.tagName).toBe('BUTTON');
        const handler = listen('slot-click');
        tile.click();
        expect(detail(handler).slot).toMatchObject({ available: false, selected: false, tileIndex: 0 });
      });

      it('leaves an inert unavailable slot as it was', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: false }] }));
        const cell = firstCell();
        expect(cell.tagName).toBe('DIV');
        expect(cell.getAttribute('aria-disabled')).toBe('true');
        expect(cell.classList.contains('cursor-not-allowed')).toBe(true);
        expect(cell.querySelector('.sr-only').textContent).toBe(', Not available');
      });
    });

    describe('tooltip', () => {
      it('replaces the description and note as the hover text', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', description: 'Anna', note: 'Follow-up', tooltip: 'Patient note' }] }));
        expect(firstCell().getAttribute('title')).toBe('Patient note');
      });

      it('keeps the default hover text when no tooltip is set', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', description: 'Anna', note: 'Follow-up' }] }));
        expect(firstCell().getAttribute('title')).toBe('Anna - Follow-up');
      });

      it('shows no hover text for an empty tooltip', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', description: 'Anna', tooltip: '' }] }));
        expect(firstCell().hasAttribute('title')).toBe(false);
      });

      it('applies to a tile and to the header of a slot with tiles', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '10:00', tooltip: 'Shared slot', tiles: [{ description: 'Anna', tooltip: 'Patient note' }] }] }));
        expect(el.querySelector('[data-slot="slot-picker-tile"]').getAttribute('title')).toBe('Patient note');
        expect(el.querySelector('[data-slot="slot-picker-slot-header"]').getAttribute('title')).toBe('Shared slot');
      });
    });

    describe('context menu', () => {
      it('dispatches slot-contextmenu with the slot and the pointer position on right-click', () => {
        const slots = baseSlots();
        mount('config', withConfig({ date: FIXED_DATE, slots }));
        const handler = listen('slot-contextmenu');
        const native = rightClick(firstCell(), { clientX: 40, clientY: 70 });
        expect(handler).toHaveBeenCalledOnce();
        const { slot, x, y } = detail(handler);
        expect(slot).toMatchObject({ key: '2026-06-22T09:00', start: '09:00', selected: false, tileIndex: null });
        expect(slot.item).toBe(slots[0]);
        expect([x, y]).toEqual([40, 70]);
        expect(handler.mock.calls[0][0].bubbles).toBe(true);
        expect(handler.mock.calls[0][0].cancelable).toBe(true);
        expect(native.defaultPrevented).toBe(false);
      });

      it('cancels the native contextmenu only when the page cancels slot-contextmenu', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
        el.addEventListener('slot-contextmenu', (e) => e.preventDefault());
        expect(rightClick(firstCell(), { clientX: 1, clientY: 1 }).defaultPrevented).toBe(true);
      });

      it('reports the selected state of the slot', () => {
        withModel(el, '2026-06-22T09:00');
        mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
        const handler = listen('slot-contextmenu');
        rightClick(firstCell(), { clientX: 1, clientY: 1 });
        expect(detail(handler).slot.selected).toBe(true);
      });

      it('resolves a group header to the parent slot and a tile to the tile', () => {
        const slots = tiledSlots();
        mount('config', withConfig({ date: FIXED_DATE, slots }));
        const handler = listen('slot-contextmenu');
        rightClick(el.querySelector('[data-slot="slot-picker-slot-header"]'), { clientX: 1, clientY: 1 });
        expect(detail(handler, 0).slot).toMatchObject({ tileIndex: null, key: '2026-06-22T09:00' });
        expect(detail(handler, 0).slot.item).toBe(slots[0]);
        rightClick(el.querySelectorAll('[data-slot="slot-picker-tile"]')[1], { clientX: 1, clientY: 1 });
        expect(detail(handler, 1).slot).toMatchObject({ tileIndex: 1, available: false });
        expect(detail(handler, 1).slot.item).toBe(slots[0].tiles[1]);
        expect(detail(handler, 1).slot.parent).toBe(slots[0]);
      });

      it('works on an inert unavailable slot and ignores a right-click outside any slot', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: [{ date: FIXED_DATE, start: '09:00', end: '09:30', available: false }] }));
        const handler = listen('slot-contextmenu');
        rightClick(firstCell(), { clientX: 1, clientY: 1 });
        expect(detail(handler).slot.available).toBe(false);
        rightClick(el.querySelector('[data-slot="slot-picker-header"]'), { clientX: 1, clientY: 1 });
        rightClick(el, { clientX: 1, clientY: 1 });
        expect(handler).toHaveBeenCalledOnce();
      });

      it('dispatches from the ContextMenu key and Shift+F10 at the cell bottom-left and swallows the native follow-up', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
        const cell = firstCell();
        stubRect(cell, { left: 10, right: 110, top: 50, bottom: 86, width: 100, height: 36 });
        const handler = vi.fn((e) => e.preventDefault());
        el.addEventListener('slot-contextmenu', handler);
        const key = new KeyboardEvent('keydown', { key: 'ContextMenu', bubbles: true, cancelable: true });
        cell.dispatchEvent(key);
        expect(key.defaultPrevented).toBe(true);
        expect(detail(handler)).toMatchObject({ x: 10, y: 86 });
        // Chrome fires a native contextmenu on keyup for the same gesture.
        const native = rightClick(cell, { clientX: 10, clientY: 86 });
        expect(handler).toHaveBeenCalledOnce();
        expect(native.defaultPrevented).toBe(true);
        // A real right-click afterwards is not swallowed by a stale flag.
        pointer(cell, 'pointerdown', { button: 2, clientX: 20, clientY: 60 });
        rightClick(cell, { clientX: 20, clientY: 60 });
        expect(handler).toHaveBeenCalledTimes(2);
        cell.dispatchEvent(new KeyboardEvent('keydown', { key: 'F10', shiftKey: true, bubbles: true, cancelable: true }));
        expect(handler).toHaveBeenCalledTimes(3);
        expect(detail(handler, 2)).toMatchObject({ x: 10, y: 86 });
      });

      it('ignores other keys and F10 without Shift', () => {
        mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
        const handler = listen('slot-contextmenu');
        for (const init of [{ key: 'F10' }, { key: 'Enter' }, { key: 'F9', shiftKey: true }]) {
          const key = new KeyboardEvent('keydown', { ...init, bubbles: true, cancelable: true });
          firstCell().dispatchEvent(key);
          expect(key.defaultPrevented).toBe(false);
        }
        expect(handler).not.toHaveBeenCalled();
      });

      describe('long press', () => {
        beforeEach(() => vi.useFakeTimers());
        afterEach(() => vi.useRealTimers());

        it('fires after half a second, suppresses the following click and aborts a pending drag', () => {
          mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: baseSlots() }));
          stubColumns();
          stubSlots(0);
          const cell = firstCell();
          const menus = listen('slot-contextmenu');
          const clicks = listen('slot-click');
          touchDown(cell, { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(499);
          expect(menus).not.toHaveBeenCalled();
          vi.advanceTimersByTime(1);
          expect(menus).toHaveBeenCalledOnce();
          expect(detail(menus)).toMatchObject({ x: 50, y: 60, slot: { key: '2026-06-22T09:00' } });
          // The press can no longer turn into a drag, and the click that follows the release is swallowed.
          pointer(cell, 'pointermove', { clientX: 50, clientY: 140 });
          expect(ghost()).toBeNull();
          pointer(cell, 'pointerup', { clientX: 50, clientY: 140 });
          cell.click();
          expect(clicks).not.toHaveBeenCalled();
          // A late native contextmenu does not dispatch twice.
          rightClick(cell, { clientX: 50, clientY: 60 });
          expect(menus).toHaveBeenCalledOnce();
          // The next click is a normal click again.
          cell.click();
          expect(clicks).toHaveBeenCalledOnce();
        });

        it('is cancelled by a release, by movement past the drag threshold and by a native contextmenu', () => {
          mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
          const cell = firstCell();
          const menus = listen('slot-contextmenu');
          touchDown(cell, { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(300);
          pointer(cell, 'pointerup', { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(500);
          expect(menus).not.toHaveBeenCalled();
          touchDown(cell, { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(300);
          pointer(cell, 'pointermove', { clientX: 60, clientY: 60 });
          vi.advanceTimersByTime(500);
          expect(menus).not.toHaveBeenCalled();
          touchDown(cell, { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(300);
          rightClick(cell, { clientX: 50, clientY: 60 });
          expect(menus).toHaveBeenCalledOnce();
          vi.advanceTimersByTime(500);
          expect(menus).toHaveBeenCalledOnce();
        });

        it('ignores a mouse press and a small movement keeps the press alive', () => {
          mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
          const cell = firstCell();
          const menus = listen('slot-contextmenu');
          pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(600);
          expect(menus).not.toHaveBeenCalled();
          touchDown(cell, { clientX: 50, clientY: 60 });
          pointer(cell, 'pointermove', { clientX: 52, clientY: 61 });
          vi.advanceTimersByTime(500);
          expect(menus).toHaveBeenCalledOnce();
        });

        it('keeps the click and the mousedown of the release from the page, so a menu opened by the press stays open', () => {
          mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
          const cell = firstCell();
          const outside = vi.fn();
          document.addEventListener('click', outside);
          const clicks = listen('slot-click');
          touchDown(cell, { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(500);
          pointer(cell, 'pointerup', { clientX: 50, clientY: 60 });
          // The compatibility mouse events of the release. The mousedown would move
          // focus to the slot, the click would be an outside click for the menu.
          const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
          cell.dispatchEvent(down);
          expect(down.defaultPrevented).toBe(true);
          cell.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
          expect(clicks).not.toHaveBeenCalled();
          expect(outside).not.toHaveBeenCalled();
          // The next click is a normal click again, and reaches the page.
          cell.click();
          expect(clicks).toHaveBeenCalledOnce();
          expect(outside).toHaveBeenCalledOnce();
          document.removeEventListener('click', outside);
        });

        it('swallows the release click of a long press on a tile group too, which has no click handler of its own', () => {
          mount('config', withConfig({ date: FIXED_DATE, slots: tiledSlots() }));
          const header = el.querySelector('[data-slot="slot-picker-slot-header"]');
          const outside = vi.fn();
          document.addEventListener('click', outside);
          const menus = listen('slot-contextmenu');
          touchDown(header, { clientX: 50, clientY: 60 });
          vi.advanceTimersByTime(500);
          expect(menus).toHaveBeenCalledOnce();
          pointer(header, 'pointerup', { clientX: 50, clientY: 60 });
          header.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          expect(outside).not.toHaveBeenCalled();
          header.click();
          expect(outside).toHaveBeenCalledOnce();
          document.removeEventListener('click', outside);
        });

        it('removes its host listeners and the timer on cleanup', () => {
          const { ctx } = mount('config', withConfig({ date: FIXED_DATE, slots: baseSlots() }));
          touchDown(firstCell(), { clientX: 1, clientY: 1 });
          ctx.cleanup.mock.calls.forEach(([fn]) => fn());
          expect(vi.getTimerCount()).toBe(0);
          const handler = listen('slot-contextmenu');
          rightClick(firstCell(), { clientX: 1, clientY: 1 });
          expect(handler).not.toHaveBeenCalled();
        });
      });

      it('clears a stuck click suppression on the next press', () => {
        const slots = [
          { date: FIXED_DATE, start: '09:00', end: '09:30' },
          { date: FIXED_DATE, start: '10:00', end: '10:30', draggable: false },
        ];
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots }));
        stubColumns();
        stubSlots(0);
        const [first, second] = slotNodes(0);
        // A reorder drag whose pointerup lands outside the dragged cell: the
        // browser then fires no click on it and the suppression would stay.
        pointer(first, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(first, 'pointermove', { clientX: 50, clientY: 140 });
        pointer(el, 'pointerup', { clientX: 50, clientY: 140 });
        const clicks = listen('slot-click');
        pointer(second, 'pointerdown', { clientX: 50, clientY: 100 });
        second.click();
        expect(clicks).toHaveBeenCalledOnce();
      });
    });

    describe('drop onto a slot (dropMode: slot)', () => {
      const slotModeSlots = () => [
        { date: FIXED_DATE, start: '09:00', end: '09:30', available: false, clickable: true, color: 'blue', description: 'Anna' },
        { date: FIXED_DATE, start: '10:00', end: '10:30', droppable: true },
        { date: FIXED_DATE, start: '11:00', end: '11:30' },
      ];

      it('highlights the droppable slot under the pointer without moving the source and reports both on drop', () => {
        const slots = slotModeSlots();
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', slots }));
        stubColumns();
        stubSlots(0);
        const drops = listen('slot-drop');
        const [booking, free, plain] = slotNodes(0);
        pointer(booking, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(booking, 'pointermove', { clientX: 50, clientY: 100 });
        expect(ghost()).toBeTruthy();
        expect(booking.getAttribute('data-dragging')).toBe('true');
        expect(slotNodes(0)).toEqual([booking, free, plain]);
        expect(free.getAttribute('data-drop-target')).toBe('true');
        expect(free.classList.contains('ring-ring/50')).toBe(true);
        expect(free.classList.contains('ring-[calc(var(--spacing)*0.75)]')).toBe(true);
        pointer(booking, 'pointermove', { clientX: 50, clientY: 140 });
        expect(free.hasAttribute('data-drop-target')).toBe(false);
        expect(free.classList.contains('ring-ring/50')).toBe(false);
        expect(free.classList.contains('ring-[calc(var(--spacing)*0.75)]')).toBe(false);
        expect(plain.hasAttribute('data-drop-target')).toBe(false);
        pointer(booking, 'pointermove', { clientX: 50, clientY: 100 });
        pointer(booking, 'pointerup', { clientX: 50, clientY: 100 });
        expect(drops).toHaveBeenCalledOnce();
        const d = detail(drops);
        expect(d.slot).toMatchObject({ key: '2026-06-22T09:00', available: false, tileIndex: null });
        expect(d.slot.item).toBe(slots[0]);
        expect(d.target).toMatchObject({ key: '2026-06-22T10:00', start: '10:00', available: true });
        expect(d.target.item).toBe(slots[1]);
        expect(d).not.toHaveProperty('date');
        expect(d).not.toHaveProperty('index');
        expect(d).not.toHaveProperty('slots');
        expect(free.hasAttribute('data-drop-target')).toBe(false);
        expect(ghost()).toBeNull();
        expect(booking.hasAttribute('data-dragging')).toBe(false);
        expect(slotNodes(0)).toEqual([booking, free, plain]);
      });

      it('dispatches nothing when released over a non-target, over the source or outside the grid', () => {
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', slots: slotModeSlots() }));
        stubColumns();
        stubSlots(0);
        const drops = listen('slot-drop');
        const [booking] = slotNodes(0);
        for (const end of [
          { clientX: 50, clientY: 140 },
          { clientX: 50, clientY: 70 },
          { clientX: 50, clientY: 400 },
        ]) {
          pointer(booking, 'pointerdown', { clientX: 50, clientY: 60 });
          pointer(booking, 'pointermove', { clientX: 50, clientY: 100 });
          pointer(booking, 'pointermove', end);
          pointer(booking, 'pointerup', end);
        }
        expect(drops).not.toHaveBeenCalled();
        expect(el.querySelector('[data-drop-target]')).toBeNull();
      });

      it('keeps the width ring of a selected colored target after the highlight leaves', () => {
        withModel(el, '2026-06-22T10:00');
        const slots = slotModeSlots();
        slots[1].color = 'blue';
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', slots }));
        stubColumns();
        stubSlots(0);
        const [booking, free] = slotNodes(0);
        expect(free.getAttribute('aria-pressed')).toBe('true');
        expect(free.classList.contains('ring-blue-500/50')).toBe(true);
        pointer(booking, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(booking, 'pointermove', { clientX: 50, clientY: 100 });
        expect(free.classList.contains('ring-ring/50')).toBe(true);
        pointer(booking, 'pointermove', { clientX: 50, clientY: 140 });
        expect(free.classList.contains('ring-ring/50')).toBe(false);
        expect(free.classList.contains('ring-[calc(var(--spacing)*0.75)]')).toBe(true);
        expect(free.classList.contains('ring-blue-500/50')).toBe(true);
        pointer(booking, 'pointerup', { clientX: 50, clientY: 140 });
      });

      it('drags a tile onto a slot but never onto its own group', () => {
        const slots = [
          { date: FIXED_DATE, start: '09:00', end: '10:00', droppable: true, tiles: [{ description: 'Anna', available: false, clickable: true }, { description: 'Free seat' }] },
          { date: FIXED_DATE, start: '11:00', end: '11:30', droppable: true },
        ];
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', slots }));
        stubColumns();
        stubSlots(0);
        const [group, free] = slotNodes(0);
        const tile = el.querySelector('[data-slot="slot-picker-tile"]');
        const drops = listen('slot-drop');
        pointer(tile, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(tile, 'pointermove', { clientX: 50, clientY: 70 });
        expect(ghost()).toBeTruthy();
        expect(tile.getAttribute('data-dragging')).toBe('true');
        expect(group.hasAttribute('data-dragging')).toBe(false);
        expect(group.hasAttribute('data-drop-target')).toBe(false);
        pointer(tile, 'pointermove', { clientX: 50, clientY: 100 });
        expect(free.getAttribute('data-drop-target')).toBe('true');
        pointer(tile, 'pointerup', { clientX: 50, clientY: 100 });
        expect(drops).toHaveBeenCalledOnce();
        const d = detail(drops);
        expect(d.slot).toMatchObject({ tileIndex: 0, key: '2026-06-22T09:00#0', available: false });
        expect(d.slot.item).toBe(slots[0].tiles[0]);
        expect(d.slot.parent).toBe(slots[0]);
        expect(d.target.item).toBe(slots[1]);
      });

      it('treats a drop on a group with tiles as a drop on that group and still drags the group from its header', () => {
        const slots = [
          { date: FIXED_DATE, start: '09:00', end: '09:30', droppable: true },
          { date: FIXED_DATE, start: '10:00', end: '11:00', droppable: true, tiles: [{ description: 'Anna' }] },
        ];
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', slots }));
        stubColumns();
        stubSlots(0);
        const [cell, group] = slotNodes(0);
        const drops = listen('slot-drop');
        pointer(cell, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(cell, 'pointermove', { clientX: 50, clientY: 100 });
        expect(group.getAttribute('data-drop-target')).toBe('true');
        pointer(cell, 'pointerup', { clientX: 50, clientY: 100 });
        expect(detail(drops, 0).target.item).toBe(slots[1]);
        const header = group.querySelector('[data-slot="slot-picker-slot-header"]');
        pointer(header, 'pointerdown', { clientX: 50, clientY: 100 });
        pointer(header, 'pointermove', { clientX: 50, clientY: 60 });
        expect(cell.getAttribute('data-drop-target')).toBe('true');
        pointer(header, 'pointerup', { clientX: 50, clientY: 60 });
        expect(detail(drops, 1).slot.item).toBe(slots[1]);
        expect(detail(drops, 1).slot.tileIndex).toBeNull();
        expect(detail(drops, 1).target.item).toBe(slots[0]);
      });

      it('never drags tiles in reorder mode', () => {
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, slots: [{ date: FIXED_DATE, start: '09:00', end: '10:00', tiles: [{ description: 'Anna' }] }, ...baseSlots().slice(1)] }));
        stubColumns();
        const tile = el.querySelector('[data-slot="slot-picker-tile"]');
        pointer(tile, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(tile, 'pointermove', { clientX: 50, clientY: 140 });
        expect(ghost()).toBeNull();
        pointer(tile, 'pointerup', { clientX: 50, clientY: 140 });
      });

      it('never drags an inert unavailable slot but drags a clickable one', () => {
        const slots = [
          { date: FIXED_DATE, start: '09:00', end: '09:30', available: false },
          { date: FIXED_DATE, start: '10:00', end: '10:30', available: false, clickable: true },
        ];
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', slots }));
        stubColumns();
        stubSlots(0);
        const [inert, booking] = slotNodes(0);
        pointer(inert, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(inert, 'pointermove', { clientX: 50, clientY: 140 });
        expect(ghost()).toBeNull();
        pointer(inert, 'pointerup', { clientX: 50, clientY: 140 });
        pointer(booking, 'pointerdown', { clientX: 50, clientY: 100 });
        pointer(booking, 'pointermove', { clientX: 50, clientY: 140 });
        expect(ghost()).toBeTruthy();
        pointer(booking, 'pointerup', { clientX: 50, clientY: 140 });
      });

      it('leaves the now indicator and the order alone after a drag', () => {
        mount('config', withConfig({ date: FIXED_DATE, draggable: true, dropMode: 'slot', showNowIndicator: true, slots: slotModeSlots() }));
        stubColumns();
        stubSlots(0);
        const before = slotNodes(0);
        const [booking] = before;
        pointer(booking, 'pointerdown', { clientX: 50, clientY: 60 });
        pointer(booking, 'pointermove', { clientX: 50, clientY: 100 });
        pointer(booking, 'pointerup', { clientX: 50, clientY: 100 });
        expect(slotNodes(0)).toEqual(before);
        const indicator = el.querySelector('[data-slot="slot-picker-now"]');
        if (indicator) expect(indicator.parentNode).toBe(slotList(0));
      });
    });

    describe('clickable day headers and markers', () => {
      it('renders plain div headers that dispatch nothing by default', () => {
        mount('config', withConfig({ date: FIXED_DATE }));
        const header = el.querySelector('[data-slot="slot-picker-header"]');
        expect(header.tagName).toBe('DIV');
        expect(Array.from(header.children).map((c) => c.tagName)).toEqual(['DIV', 'DIV']);
        const handler = listen('day-click');
        header.click();
        expect(handler).not.toHaveBeenCalled();
      });

      it('renders button headers that dispatch day-click with the date when clickableHeaders is set', () => {
        mount('config', withConfig({ date: FIXED_DATE, clickableHeaders: true }));
        const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
        const header = headers[1];
        expect(header.tagName).toBe('BUTTON');
        expect(header.getAttribute('type')).toBe('button');
        expect(header.classList.contains('w-full')).toBe(true);
        expect(header.classList.contains('cursor-pointer')).toBe(true);
        expect(header.classList.contains('sticky')).toBe(true);
        // The same hover as an uncolored slot cell.
        expect(header.classList.contains('hover:bg-secondary-hover')).toBe(true);
        expect(header.classList.contains('hover:text-secondary-foreground')).toBe(true);
        expect(header.classList.contains('transition-colors')).toBe(true);
        expect(Array.from(header.children).map((c) => c.tagName)).toEqual(['SPAN', 'SPAN']);
        expect(header.children[0].classList.contains('block')).toBe(true);
        expect(header.textContent).toContain('June 23');
        const col = header.parentElement;
        expect(col.getAttribute('aria-labelledby')).toBe(header.id);
        const handler = listen('day-click');
        header.click();
        expect(handler).toHaveBeenCalledOnce();
        expect(detail(handler)).toEqual({ date: '2026-06-23' });
        expect(handler.mock.calls[0][0].bubbles).toBe(true);
      });

      it('keeps a disabled day header plain and silent when clickableHeaders is set', () => {
        // 22 June 2026 is a Monday. Tuesday is disabled by weekday, Wednesday is past maxDate.
        // minDate anchors the window on Monday, which the maxDate clamp would otherwise pull back.
        mount('config', withConfig({ date: FIXED_DATE, clickableHeaders: true, disabledDays: [2], minDate: FIXED_DATE, maxDate: '2026-06-23' }));
        const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
        expect(headers[0].tagName).toBe('BUTTON');
        expect(headers[1].tagName).toBe('DIV');
        expect(headers[2].tagName).toBe('DIV');
        expect(Array.from(headers[1].children).map((c) => c.tagName)).toEqual(['DIV', 'DIV']);
        expect(headers[1].classList.contains('cursor-pointer')).toBe(false);
        expect(headers[1].nextElementSibling.textContent.trim()).toBe('Not available');
        const handler = listen('day-click');
        headers[1].click();
        headers[2].click();
        expect(handler).not.toHaveBeenCalled();
        headers[0].click();
        expect(detail(handler)).toEqual({ date: FIXED_DATE });
      });

      it('renders corner markers only for days with dayIcons, like a cell', () => {
        mount(
          'config',
          withConfig({ date: FIXED_DATE, dayIcons: { '2026-06-23': { left: { url: '/icons/late.svg', alt: 'Running late' }, right: [{ url: '/icons/hours.svg' }, { url: '/icons/holiday.svg', alt: 'Holiday' }] }, '2026-06-24': 'nope' } })
        );
        const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
        expect(headers[0].children.length).toBe(2);
        expect(headers[2].children.length).toBe(2);
        const badges = headers[1].querySelectorAll(':scope > span.absolute');
        expect(badges.length).toBe(2);
        expect(badges[0].classList.contains('left-1')).toBe(true);
        expect(badges[0].classList.contains('top-1')).toBe(true);
        expect(badges[1].classList.contains('right-1')).toBe(true);
        const left = badges[0].querySelectorAll('img');
        expect(left.length).toBe(1);
        expect(left[0].getAttribute('src')).toBe('/icons/late.svg');
        expect(left[0].getAttribute('alt')).toBe('Running late');
        expect(left[0].classList.contains('size-3.5')).toBe(true);
        const right = badges[1].querySelectorAll('img');
        expect(right.length).toBe(2);
        expect(right[0].getAttribute('alt')).toBe('');
        expect(right[1].getAttribute('alt')).toBe('Holiday');
        // The name and date rows stay as they are, so the header keeps its height.
        expect(
          Array.from(headers[1].children)
            .slice(0, 2)
            .map((c) => c.tagName)
        ).toEqual(['DIV', 'DIV']);
        // Only a header with markers reserves room for them beside its rows.
        expect(headers[1].classList.contains('px-5')).toBe(true);
        expect(headers[0].classList.contains('px-5')).toBe(false);
        expect(headers[2].classList.contains('px-5')).toBe(false);
      });

      it('puts the markers inside a button header too', () => {
        mount('config', withConfig({ date: FIXED_DATE, clickableHeaders: true, dayIcons: { [FIXED_DATE]: { right: [{ url: '/icons/late.svg', alt: 'Running late' }] } } }));
        const header = el.querySelector('[data-slot="slot-picker-header"]');
        const badge = header.querySelector(':scope > span.absolute');
        expect(badge.classList.contains('right-1')).toBe(true);
        expect(badge.querySelector('img').getAttribute('alt')).toBe('Running late');
        expect(header.textContent).toContain('June 22');
      });
    });

    describe('firstDay and week alignment', () => {
      const firstHeader = () => el.querySelector('[data-slot="slot-picker-header"]').textContent;

      // Pin today to Wednesday, June 24 2026.
      beforeEach(() => {
        vi.useFakeTimers({ toFake: ['Date'] });
        vi.setSystemTime(new Date(2026, 5, 24, 12));
      });
      afterEach(() => {
        vi.useRealTimers();
      });

      it('starts a seven-day window on the configured first day', () => {
        mount('config', withConfig({ date: '2026-06-24', days: 7, firstDay: 1 }));
        expect(firstHeader()).toContain('June 22');
        expect(el.querySelectorAll('[data-slot="slot-picker-header"]').length).toBe(7);
      });

      it('aligns to Sunday for firstDay 0 and not at all without firstDay or with fewer days', () => {
        mount('config', withConfig({ date: '2026-06-24', days: 7, firstDay: 0 }));
        expect(firstHeader()).toContain('June 21');
        el.remove();
        el = makeEl();
        mount('config', withConfig({ date: '2026-06-24', days: 7 }));
        expect(firstHeader()).toContain('June 24');
        el.remove();
        el = makeEl();
        mount('config', withConfig({ date: '2026-06-24', days: 5, firstDay: 1 }));
        expect(firstHeader()).toContain('June 24');
      });

      it('aligns the default window (today) and reads a string first day', () => {
        mount('config', withConfig({ days: 7, firstDay: '1' }));
        expect(firstHeader()).toContain('June 22');
      });

      it('moves the today control and the date dialog to the week of the chosen day', async () => {
        mount('config', withConfig({ date: '2026-06-01', days: 7, firstDay: 1 }));
        const btn = mountCalendar();
        await tick();
        const ranges = listen('range-change');
        el._h_slot_picker.today();
        expect(firstHeader()).toContain('June 22');
        await tick();
        expect(detail(ranges, 0)).toEqual({ from: '2026-06-22', to: '2026-06-28' });
        btn.click();
        el.querySelector('[data-slot="slot-picker-calendar"] td[data-day="10"]').click();
        await tick();
        expect(detail(ranges, 1)).toEqual({ from: '2026-06-08', to: '2026-06-14' });
      });

      it('keeps the last week aligned at maxDate and marks the days after it unavailable', () => {
        // 7 November 2026 is a Saturday. The week holding it is the last one.
        mount('config', withConfig({ date: '2026-11-02', days: 7, firstDay: 1, maxDate: '2026-11-07' }));
        expect(firstHeader()).toContain('November 2');
        const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
        expect(headers[6].textContent).toContain('November 8');
        expect(headers[6].nextElementSibling.textContent.trim()).toBe('Not available');
        expect(headers[5].nextElementSibling.textContent.trim()).not.toBe('Not available');
        expect(el._h_slot_picker.canNext).toBe(false);
        el._h_slot_picker.next();
        expect(firstHeader()).toContain('November 2');
      });

      it('keeps the first week aligned at minDate and marks the days before it unavailable', () => {
        // 24 June 2026 is a Wednesday. The week holding it is the first one.
        mount('config', withConfig({ date: '2026-06-24', days: 7, firstDay: 1, minDate: '2026-06-24' }));
        expect(firstHeader()).toContain('June 22');
        const headers = el.querySelectorAll('[data-slot="slot-picker-header"]');
        expect(headers[0].nextElementSibling.textContent.trim()).toBe('Not available');
        expect(headers[1].nextElementSibling.textContent.trim()).toBe('Not available');
        expect(headers[2].nextElementSibling.textContent.trim()).not.toBe('Not available');
        expect(el._h_slot_picker.canPrev).toBe(false);
        el._h_slot_picker.previous();
        expect(firstHeader()).toContain('June 22');
      });

      it('aligns a picker that becomes a week view through the configuration', () => {
        const cfg = createMockAlpine().reactive({ value: { date: '2026-06-24', days: 3 } });
        mount('config', { evaluateLater: () => (cb) => cb(cfg.value) });
        expect(firstHeader()).toContain('June 24');
        cfg.value = { date: '2026-06-24', days: 7, firstDay: 1 };
        expect(firstHeader()).toContain('June 22');
      });

      it('starts the date dialog weeks on the first day and follows a change back to Sunday', () => {
        const cfg = createMockAlpine().reactive({ value: { date: '2026-06-24', locale: 'en-US', firstDay: 1 } });
        mount('config', { evaluateLater: () => (cb) => cb(cfg.value) });
        mountCalendar();
        const abbrs = () => Array.from(el.querySelectorAll('[data-slot="slot-picker-calendar"] th')).map((th) => th.getAttribute('abbr'));
        expect(abbrs()[0]).toBe('Mon');
        cfg.value = { date: '2026-06-24', locale: 'en-US', firstDay: 0 };
        expect(abbrs()[0]).toBe('Sun');
      });

      it('keeps the dialog on Sunday weeks without firstDay', () => {
        mount('config', withConfig({ date: '2026-06-24', locale: 'en-US' }));
        mountCalendar();
        expect(el.querySelector('[data-slot="slot-picker-calendar"] th').getAttribute('abbr')).toBe('Sun');
      });
    });
  });
});
