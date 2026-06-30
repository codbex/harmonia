import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0, placement: 'bottom' }),
  autoUpdate: vi.fn().mockReturnValue(() => {}),
  flip: vi.fn(),
  offset: vi.fn(),
  shift: vi.fn(),
}));

import slotPickerPlugin from '../../src/components/slot-picker.js';
import { mountDirective } from '../test-utils.js';

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

  function withConfig(config) {
    return { evaluateLater: () => (cb) => cb(config) };
  }

  it('registers h-slot-picker directive', () => {
    const { alpine } = mount();
    expect(alpine._directives['h-slot-picker']).toBeDefined();
  });

  it('adds flex and relative classes', () => {
    mount();
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
  });

  it('renders toolbar with Previous, Today, and Next buttons', () => {
    mount();
    const labels = Array.from(el.querySelectorAll('button')).map((b) => b.getAttribute('aria-label') || b.textContent.trim());
    expect(labels).toContain('Previous');
    expect(labels).toContain('Next');
    expect(labels.some((l) => l === 'Today')).toBe(true);
  });

  it('renders a period label with aria-live="polite"', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const h2 = el.querySelector('h2');
    expect(h2).toBeTruthy();
    expect(h2.getAttribute('aria-live')).toBe('polite');
    expect(h2.textContent.length).toBeGreaterThan(0);
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
    mount('config', withConfig({ date: FIXED_DATE }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(1);
  });

  it('deselects a slot when clicked again in single mode', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    el.querySelector('button[data-slot="slot-picker-cell"].bg-primary').click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(0);
  });

  it('single mode: clicking a second slot deselects the first', () => {
    mount('config', withConfig({ date: FIXED_DATE, multiple: false }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(1);
    Array.from(el.querySelectorAll('button[data-slot="slot-picker-cell"]'))[1].click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(1);
  });

  it('multiple mode: can select multiple slots', () => {
    mount('config', withConfig({ date: FIXED_DATE, multiple: true }));
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    Array.from(el.querySelectorAll('button[data-slot="slot-picker-cell"]'))[1].click();
    expect(el.querySelectorAll('button[data-slot="slot-picker-cell"].bg-primary').length).toBe(2);
  });

  it('slot-click detail reports selected: true after clicking', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const handler = vi.fn();
    el.addEventListener('slot-click', handler);
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    expect(handler.mock.calls[0][0].detail.slot.selected).toBe(true);
  });

  it('slot-click detail reports selected: false when deselecting', () => {
    mount('config', withConfig({ date: FIXED_DATE }));
    const handler = vi.fn();
    el.addEventListener('slot-click', handler);
    el.querySelector('button[data-slot="slot-picker-cell"]').click();
    el.querySelector('button[data-slot="slot-picker-cell"].bg-primary').click();
    expect(handler.mock.calls[1][0].detail.slot.selected).toBe(false);
  });

  it('renders icon badge with img when slot has an icon object', () => {
    const slots = [{ date: '2026-06-22', start: '09:00', end: '09:30', available: true, icon: { url: '/icons/warning.svg', alt: 'Warning' } }];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const badge = el.querySelector('button[data-slot="slot-picker-cell"] .absolute.top-1.right-1');
    expect(badge).toBeTruthy();
    const img = badge.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.src).toContain('/icons/warning.svg');
    expect(img.alt).toBe('Warning');
  });

  it('renders multiple icon imgs when slot has icons array', () => {
    const slots = [
      {
        date: '2026-06-22',
        start: '09:00',
        end: '09:30',
        available: true,
        icons: [
          { url: '/icons/a.svg', alt: 'A' },
          { url: '/icons/b.svg', alt: 'B' },
        ],
      },
    ];
    mount('config', withConfig({ date: FIXED_DATE, slots }));
    const badge = el.querySelector('button[data-slot="slot-picker-cell"] .absolute.top-1.right-1');
    expect(badge).toBeTruthy();
    const imgs = badge.querySelectorAll('img');
    expect(imgs.length).toBe(2);
    expect(imgs[0].src).toContain('/icons/a.svg');
    expect(imgs[1].src).toContain('/icons/b.svg');
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

    it('slot buttons expose aria-pressed and a day + time label', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      expect(btn.getAttribute('aria-pressed')).toBe('false');
      expect(btn.getAttribute('aria-label')).toContain('08:00');
    });

    it('sets aria-pressed true on the selected slot', () => {
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
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      btn.click();
      // The same node remains in the DOM (a full re-render would detach it).
      expect(btn.isConnected).toBe(true);
      expect(btn.classList.contains('bg-primary')).toBe(true);
      expect(btn.getAttribute('aria-pressed')).toBe('true');
    });

    it('keeps focus on the slot after selection', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = el.querySelector('button[data-slot="slot-picker-cell"]');
      btn.focus();
      btn.click();
      expect(document.activeElement).toBe(btn);
    });

    it('moves selection between cells in place in single mode', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const [first, second] = el.querySelectorAll('button[data-slot="slot-picker-cell"]');
      first.click();
      second.click();
      expect(first.isConnected).toBe(true);
      expect(first.getAttribute('aria-pressed')).toBe('false');
      expect(second.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('calendar popover', () => {
    const calButton = () => Array.from(el.querySelectorAll('button')).find((b) => b.getAttribute('aria-haspopup') === 'dialog');

    it('renders a calendar button wired to a dialog popover', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      const btn = calButton();
      expect(btn).toBeTruthy();
      expect(btn.getAttribute('aria-label')).toBe('Choose date');
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      expect(popover.getAttribute('role')).toBe('dialog');
      expect(btn.getAttribute('aria-controls')).toBe(popover.getAttribute('id'));
      expect(popover.classList.contains('hidden')).toBe(true);
    });

    it('honors a custom data-aria-calendar label', () => {
      el.setAttribute('data-aria-calendar', 'Pick a start day');
      mount('config', withConfig({ date: FIXED_DATE }));
      expect(calButton().getAttribute('aria-label')).toBe('Pick a start day');
    });

    it('jumps the first day when a date is picked from the calendar', () => {
      mount('config', withConfig({ date: FIXED_DATE }));
      calButton().click();
      const popover = el.querySelector('[data-slot="slot-picker-calendar"]');
      const day10 = popover.querySelector('td[data-day="10"]');
      expect(day10).toBeTruthy();
      day10.click();
      // The slot-picker heading (first h2) now starts on the 10th.
      expect(el.querySelector('h2').textContent).toContain('10');
    });
  });
});
