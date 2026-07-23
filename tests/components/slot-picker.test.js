import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
      // Always dayCount columns with vertical dividers, at every width.
      expect(grid.classList.contains('grid-cols-5')).toBe(true);
      expect(grid.classList.contains('divide-x')).toBe(true);
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
});
