import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { createCalendarWidget, dateOrderMap, forwardCalendarNavAria, isDisabled, isoWeekParts, mondayOfIsoWeek, nextFocusDate, parseDateValue, sameDay, toDateString } from '../../src/common/calendar';
import { createMockAlpine } from '../test-utils.js';

const noop = () => {};
const defaultCallbacks = {
  Alpine: createMockAlpine(),
  onSelectionChanged: noop,
  onEscape: noop,
  onInvalidModel: noop,
  onModelValid: noop,
  stopNavPropagation: false,
  tableFullWidth: true,
};

describe('nextFocusDate', () => {
  const base = new Date(2026, 5, 15); // 2026-06-15

  it('moves by a day for arrow left/right', () => {
    expect(toDateString(nextFocusDate(base, 'ArrowRight'))).toBe('2026-06-16');
    expect(toDateString(nextFocusDate(base, 'ArrowLeft'))).toBe('2026-06-14');
  });

  it('moves by a week for arrow up/down', () => {
    expect(toDateString(nextFocusDate(base, 'ArrowDown'))).toBe('2026-06-22');
    expect(toDateString(nextFocusDate(base, 'ArrowUp'))).toBe('2026-06-08');
  });

  it('Home/End jump to the first/last of the month', () => {
    expect(toDateString(nextFocusDate(base, 'Home'))).toBe('2026-06-01');
    expect(toDateString(nextFocusDate(base, 'End'))).toBe('2026-06-30');
  });

  it('PageUp/PageDown change the month', () => {
    expect(toDateString(nextFocusDate(base, 'PageUp'))).toBe('2026-05-15');
    expect(toDateString(nextFocusDate(base, 'PageDown'))).toBe('2026-07-15');
  });

  it('returns null for non-navigation keys', () => {
    expect(nextFocusDate(base, 'a')).toBeNull();
    expect(nextFocusDate(base, 'Enter')).toBeNull();
  });

  it('does not mutate the input date', () => {
    nextFocusDate(base, 'ArrowRight');
    expect(toDateString(base)).toBe('2026-06-15');
  });
});

describe('isoWeekParts', () => {
  it('returns the ISO week of a mid-year Monday', () => {
    expect(isoWeekParts(new Date(2025, 5, 9))).toEqual({ year: 2025, week: 24 });
  });

  it('assigns early January to the previous ISO year when week 53 spills over', () => {
    expect(isoWeekParts(new Date(2027, 0, 1))).toEqual({ year: 2026, week: 53 });
    expect(isoWeekParts(new Date(2021, 0, 1))).toEqual({ year: 2020, week: 53 });
  });

  it('assigns late December to the next ISO year when it belongs to week 1', () => {
    expect(isoWeekParts(new Date(2024, 11, 30))).toEqual({ year: 2025, week: 1 });
  });

  it('starts week 1 on the week containing the first Thursday', () => {
    expect(isoWeekParts(new Date(2026, 0, 1))).toEqual({ year: 2026, week: 1 });
  });
});

describe('mondayOfIsoWeek', () => {
  it('returns the Monday starting the given ISO week', () => {
    expect(toDateString(mondayOfIsoWeek(2025, 24))).toBe('2025-06-09');
  });

  it('handles week 1 starting in the previous calendar year', () => {
    expect(toDateString(mondayOfIsoWeek(2025, 1))).toBe('2024-12-30');
  });

  it('round-trips with isoWeekParts across the year', () => {
    for (let offset = 0; offset < 400; offset += 17) {
      const d = new Date(2024, 0, 1 + offset);
      const parts = isoWeekParts(d);
      const monday = mondayOfIsoWeek(parts.year, parts.week);
      expect(monday.getDay()).toBe(1);
      expect(isoWeekParts(monday)).toEqual(parts);
      expect(monday <= d).toBe(true);
      expect((d - monday) / 86400000).toBeLessThan(7);
    }
  });
});

describe('toDateString', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(toDateString(new Date(2026, 5, 19))).toBe('2026-06-19');
  });

  it('pads single-digit month and day', () => {
    expect(toDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('parseDateValue', () => {
  it('parses ISO YYYY-MM-DD without timezone drift', () => {
    const d = parseDateValue('2026-06-19');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
  });

  it('falls back to Date constructor for non-ISO strings', () => {
    const d = parseDateValue('June 19, 2026');
    expect(d.getMonth()).toBe(5);
  });
});

describe('sameDay', () => {
  it('returns true for the same date', () => {
    expect(sameDay(new Date(2026, 5, 19), new Date(2026, 5, 19))).toBe(true);
  });

  it('returns false for different dates', () => {
    expect(sameDay(new Date(2026, 5, 19), new Date(2026, 5, 20))).toBe(false);
  });

  it('returns falsy when either argument is null/undefined', () => {
    expect(sameDay(null, new Date())).toBeFalsy();
    expect(sameDay(new Date(), undefined)).toBeFalsy();
  });
});

describe('isDisabled', () => {
  const min = new Date(2026, 0, 1);
  const max = new Date(2026, 11, 31);

  it('returns false when within range', () => {
    expect(isDisabled(new Date(2026, 5, 15), min, max)).toBe(false);
  });

  it('returns true when before min', () => {
    expect(isDisabled(new Date(2025, 11, 31), min, max)).toBe(true);
  });

  it('returns true when after max', () => {
    expect(isDisabled(new Date(2027, 0, 1), min, max)).toBe(true);
  });

  it('returns false when no bounds set', () => {
    expect(isDisabled(new Date(2026, 5, 15), undefined, undefined)).toBe(false);
  });
});

describe('dateOrderMap', () => {
  it('maps Y M D to year month day', () => {
    expect(dateOrderMap.Y).toBe('year');
    expect(dateOrderMap.M).toBe('month');
    expect(dateOrderMap.D).toBe('day');
  });
});

describe('createCalendarWidget', () => {
  function makeEl() {
    const el = document.createElement('div');
    document.body.appendChild(el);
    return el;
  }

  it('appends header and table to el', () => {
    const el = makeEl();
    createCalendarWidget('test', el, defaultCallbacks);
    expect(el.querySelector('div')).toBeTruthy();
    expect(el.querySelector('table')).toBeTruthy();
  });

  it('creates 4 navigation buttons and 2 view toggles', () => {
    const el = makeEl();
    createCalendarWidget('test', el, defaultCallbacks);
    expect(el.querySelectorAll('button:not([aria-pressed])').length).toBe(4);
    expect(el.querySelectorAll('button[aria-pressed]').length).toBe(2);
  });

  it('Tab on a day bubbles on, so a popover host can trap it', () => {
    const el = makeEl();
    createCalendarWidget('test', el, defaultCallbacks).setConfig({ locale: 'en-US' });
    const reached = vi.fn();
    document.addEventListener('keydown', reached);
    el.querySelector('td[data-day="1"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    el.querySelector('td[data-day="1"]').dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    document.removeEventListener('keydown', reached);
    expect(reached).toHaveBeenCalledTimes(1);
    expect(reached.mock.calls[0][0].key).toBe('Tab');
  });

  it('day cells show a focus outline, which leaves the range bar box-shadow alone', () => {
    const el = makeEl();
    createCalendarWidget('test', el, defaultCallbacks);
    const cells = el.querySelectorAll('td[role=gridcell]');
    expect(cells).toHaveLength(42);
    for (const cell of cells) {
      expect(cell.classList.contains('focus-outline')).toBe(true);
      expect(cell.classList.contains('outline-ring/50')).toBe(true);
      expect(cell.classList.contains('outline-none')).toBe(false);
    }
  });

  it('nav buttons reuse the button component and the header is initialized as an Alpine tree', () => {
    const el = makeEl();
    const alpine = createMockAlpine();
    createCalendarWidget('test', el, { ...defaultCallbacks, Alpine: alpine });
    const buttons = el.querySelectorAll('button:not([aria-pressed])');
    buttons.forEach((btn) => {
      expect(btn.hasAttribute('x-h-button')).toBe(true);
      expect(btn.getAttribute('data-variant')).toBe('transparent');
      expect(btn.getAttribute('data-size')).toBe('icon');
      expect(btn.getAttribute('type')).toBe('button');
    });
    expect(alpine.initTree).toHaveBeenCalledWith(buttons[0].parentElement);
  });

  it('view toggles are outline md buttons in a button group without a group role', () => {
    const el = makeEl();
    createCalendarWidget('test', el, defaultCallbacks);
    const toggles = el.querySelectorAll('button[aria-pressed]');
    toggles.forEach((btn) => {
      expect(btn.hasAttribute('x-h-button')).toBe(true);
      expect(btn.getAttribute('data-variant')).toBe('outline');
      expect(btn.getAttribute('data-size')).toBe('md');
      expect(btn.getAttribute('type')).toBe('button');
    });
    const group = toggles[0].parentElement;
    expect(group.hasAttribute('x-h-button-group')).toBe(true);
    expect(group.getAttribute('role')).toBe('none');
  });

  it('renders 42 day cells (6 rows × 7 columns)', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({});
    const cells = el.querySelectorAll('tbody td');
    expect(cells.length).toBe(42);
  });

  it('adds w-full to table when tableFullWidth is true', () => {
    const el = makeEl();
    createCalendarWidget('test', el, { ...defaultCallbacks, tableFullWidth: true });
    expect(el.querySelector('table').classList.contains('w-full')).toBe(true);
  });

  it('does not add w-full to table when tableFullWidth is false', () => {
    const el = makeEl();
    createCalendarWidget('test', el, { ...defaultCallbacks, tableFullWidth: false });
    expect(el.querySelector('table').classList.contains('w-full')).toBe(false);
  });

  it('calls onEscape when Escape is pressed', () => {
    const el = makeEl();
    let escaped = false;
    const widget = createCalendarWidget('test', el, {
      ...defaultCallbacks,
      onEscape: () => {
        escaped = true;
      },
    });
    widget.setConfig({});
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(escaped).toBe(true);
  });

  it('formatSelectedDate returns undefined with no selection', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({});
    expect(widget.formatSelectedDate()).toBeUndefined();
  });

  it('buildInputParser handles bg-BG locale suffix in regex (regression)', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ locale: 'bg-BG' });
    // bg-BG formats as "18.06.2026 г." - the parser must handle the trailing suffix
    const parsed = widget.parseDisplayValue('18.06.2027 г.');
    expect(parsed.getFullYear()).toBe(2027);
    expect(parsed.getMonth()).toBe(5);
    expect(parsed.getDate()).toBe(18);
  });

  it('buildInputParser sets inputParser to null for non-Gregorian calendars (e.g. fa-IR)', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ locale: 'fa-IR' });
    // fa-IR uses Persian calendar - parseDisplayValue falls back to new Date()
    // which may return Invalid Date for a Gregorian string, but it shouldn't throw
    expect(() => widget.parseDisplayValue('1405/03/29')).not.toThrow();
  });

  it('buildInputParser builds digitNormalizer for ar-SA (Arabic-Indic digits)', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ locale: 'ar-SA' });
    // ar-SA date '١٩\u200F/٦\u200F/٢٠٢٦' should parse to 2026-06-19
    const parsed = widget.parseDisplayValue('١٩\u200F/٦\u200F/٢٠٢٦');
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(5);
    expect(parsed.getDate()).toBe(19);
  });

  it('setConfig with custom delimiter produces formatted output using that delimiter', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ locale: 'en-US', delimiter: '-' });
    // Force selection to get formatSelectedDate result
    widget.setSelectedAndSync(new Date(2026, 5, 19));
    const formatted = widget.formatSelectedDate();
    expect(formatted).toContain('-');
    expect(formatted).not.toContain('/');
  });

  it('cleanup removes keydown listener', () => {
    const el = makeEl();
    let escaped = false;
    const widget = createCalendarWidget('test', el, {
      ...defaultCallbacks,
      onEscape: () => {
        escaped = true;
      },
    });
    widget.setConfig({});
    widget.cleanup();
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(escaped).toBe(false);
  });
});

describe('createCalendarWidget range mode', () => {
  const now = new Date();
  const ds = (day) => toDateString(new Date(now.getFullYear(), now.getMonth(), day));

  function makeEl(model) {
    const el = document.createElement('div');
    document.body.appendChild(el);
    if (model !== undefined) {
      let val = model;
      Object.defineProperty(el, '_x_model', {
        value: {
          get: () => val,
          set: (v) => {
            val = v;
          },
        },
        configurable: true,
      });
    }
    return el;
  }

  const cell = (el, day) => el.querySelector(`td[data-day="${day}"]`);

  it('isRange reflects the config flag', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({});
    expect(widget.isRange()).toBe(false);
    widget.setConfig({ range: true });
    expect(widget.isRange()).toBe(true);
  });

  it('two clicks select an ordered start and end', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 10).click();
    let sel = widget.getSelected();
    expect(toDateString(sel.start)).toBe(ds(10));
    expect(sel.end).toBeUndefined();

    cell(el, 20).click();
    sel = widget.getSelected();
    expect(toDateString(sel.start)).toBe(ds(10));
    expect(toDateString(sel.end)).toBe(ds(20));
  });

  it('orders the range when the second pick is before the first', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 20).click();
    cell(el, 10).click();
    const sel = widget.getSelected();
    expect(toDateString(sel.start)).toBe(ds(10));
    expect(toDateString(sel.end)).toBe(ds(20));
  });

  it('a third click starts a new range', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 10).click();
    cell(el, 20).click();
    cell(el, 5).click();
    const sel = widget.getSelected();
    expect(toDateString(sel.start)).toBe(ds(5));
    expect(sel.end).toBeUndefined();
  });

  it('marks in-range cells with aria-selected and data-range positions', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 10).click();
    cell(el, 12).click();

    expect(cell(el, 10).getAttribute('aria-selected')).toBe('true');
    expect(cell(el, 10).getAttribute('data-range')).toBe('start');
    expect(cell(el, 11).getAttribute('aria-selected')).toBe('true');
    expect(cell(el, 11).getAttribute('data-range')).toBe('middle');
    expect(cell(el, 12).getAttribute('aria-selected')).toBe('true');
    expect(cell(el, 12).getAttribute('data-range')).toBe('end');
    expect(cell(el, 9).getAttribute('aria-selected')).toBe('false');
    expect(cell(el, 9).hasAttribute('data-range')).toBe(false);
  });

  it('marks a lone start (no end yet) as a single endpoint', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 10).click();
    expect(cell(el, 10).getAttribute('aria-selected')).toBe('true');
    expect(cell(el, 10).getAttribute('data-range')).toBe('single');
  });

  it('reads a {start,end} model object', () => {
    const el = makeEl({ start: '2026-06-10', end: '2026-06-20' });
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });
    const sel = widget.getSelected();
    expect(toDateString(sel.start)).toBe('2026-06-10');
    expect(toDateString(sel.end)).toBe('2026-06-20');
  });

  it('writes a {start,end} object to the model', () => {
    const el = makeEl(undefined);
    let written;
    Object.defineProperty(el, '_x_model', {
      value: { get: () => written, set: (v) => (written = v) },
      configurable: true,
    });
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 5).click();
    expect(written).toEqual({ start: ds(5), end: undefined });
    cell(el, 8).click();
    expect(written).toEqual({ start: ds(5), end: ds(8) });
  });

  it('formats and parses a range with the default separator', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true, locale: 'en-US', order: 'YMD', delimiter: '-' });
    widget.setSelectedAndSync({ start: new Date(2026, 5, 10), end: new Date(2026, 5, 20) });

    const formatted = widget.formatSelectedDate();
    expect(formatted).toBe('2026-6-10 - 2026-6-20');

    const parsed = widget.parseDisplayValue(formatted);
    expect(toDateString(parsed.start)).toBe('2026-06-10');
    expect(toDateString(parsed.end)).toBe('2026-06-20');
  });

  it('honors a custom rangeSeparator', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true, locale: 'en-US', order: 'YMD', delimiter: '-', rangeSeparator: ' to ' });
    widget.setSelectedAndSync({ start: new Date(2026, 5, 10), end: new Date(2026, 5, 20) });

    expect(widget.formatSelectedDate()).toBe('2026-6-10 to 2026-6-20');
    const parsed = widget.parseDisplayValue('2026-6-10 to 2026-6-20');
    expect(toDateString(parsed.start)).toBe('2026-06-10');
    expect(toDateString(parsed.end)).toBe('2026-06-20');
  });

  it('formatSelectedDate returns only the start while mid-selection', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true, locale: 'en-US', order: 'YMD', delimiter: '-' });
    widget.setSelectedAndSync({ start: new Date(2026, 5, 10), end: undefined });
    expect(widget.formatSelectedDate()).toBe('2026-6-10');
  });

  it('selects a range via the keyboard (Enter sets start, then end)', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });
    const c = () => el.querySelector('td[data-day]');

    c().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    let sel = widget.getSelected();
    expect(sel.start).toBeDefined();
    expect(sel.end).toBeUndefined();

    c().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    c().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    sel = widget.getSelected();
    expect(sel.end).toBeDefined();
    expect(sel.end.getTime()).toBeGreaterThan(sel.start.getTime());
  });

  it('clearSelected wipes the range', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });
    cell(el, 10).click();
    cell(el, 12).click();
    widget.clearSelected();
    const sel = widget.getSelected();
    expect(sel.start).toBeUndefined();
    expect(sel.end).toBeUndefined();
  });

  it('applyModel returns true and clears when the model is empty', () => {
    const el = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });
    cell(el, 10).click();
    expect(widget.applyModel(undefined)).toBe(true);
    expect(widget.getSelected().start).toBeUndefined();
  });
});

describe('createCalendarWidget deselect and clear', () => {
  const now = new Date();
  const ds = (day) => toDateString(new Date(now.getFullYear(), now.getMonth(), day));

  function makeEl() {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let val;
    Object.defineProperty(el, '_x_model', {
      value: {
        get: () => val,
        set: (v) => {
          val = v;
        },
      },
      configurable: true,
    });
    return { el, getModel: () => val };
  }

  const cell = (el, day) => el.querySelector(`td[data-day="${day}"]`);

  it('clicking the selected day again deselects it and writes an empty model', () => {
    const { el, getModel } = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({});
    const changes = [];
    el.addEventListener('change', (event) => changes.push(event.detail));

    cell(el, 10).click();
    expect(getModel()).toBe(ds(10));
    expect(cell(el, 10).getAttribute('aria-selected')).toBe('true');

    cell(el, 10).click();
    expect(getModel()).toBe('');
    expect(widget.getSelected()).toBeUndefined();
    expect(cell(el, 10).getAttribute('aria-selected')).toBe('false');
    expect(changes[1].date).toBeUndefined();
    // The deselected day stays the roving tab stop.
    expect(cell(el, 10).getAttribute('tabindex')).toBe('0');
  });

  it('Enter on the selected day deselects it and keeps the tab stop', () => {
    const { el, getModel } = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({});

    cell(el, 10).click();
    cell(el, 10).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(getModel()).toBe('');
    expect(widget.getSelected()).toBeUndefined();
    expect(cell(el, 10).getAttribute('tabindex')).toBe('0');
  });

  // Range mode must never toggle: the second pick on the same day completes a
  // single-day range.
  it('range mode still completes a single-day range on a same-day re-click', () => {
    const { el, getModel } = makeEl();
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ range: true });

    cell(el, 10).click();
    cell(el, 10).click();
    expect(getModel()).toEqual({ start: ds(10), end: ds(10) });
  });

  it('clearSelectedAndSync writes an empty single model and reports the change', () => {
    const { el, getModel } = makeEl();
    const onSelectionChanged = vi.fn();
    const widget = createCalendarWidget('test', el, { ...defaultCallbacks, onSelectionChanged });
    widget.setConfig({});

    cell(el, 10).click();
    onSelectionChanged.mockClear();
    widget.clearSelectedAndSync();
    expect(getModel()).toBe('');
    expect(widget.getSelected()).toBeUndefined();
    expect(cell(el, 10).getAttribute('aria-selected')).toBe('false');
    expect(onSelectionChanged).toHaveBeenCalledWith(false);
  });

  it('clearSelectedAndSync writes an empty range model', () => {
    const { el, getModel } = makeEl();
    const widget = createCalendarWidget('test', el, { ...defaultCallbacks });
    widget.setConfig({ range: true });

    cell(el, 10).click();
    cell(el, 12).click();
    widget.clearSelectedAndSync();
    expect(getModel()).toEqual({ start: undefined, end: undefined });
    const sel = widget.getSelected();
    expect(sel.start).toBeUndefined();
    expect(sel.end).toBeUndefined();
  });
});

describe('createCalendarWidget month and year selection', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 8, 24, 12));
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  function setup({ model, config = {}, callbacks = {}, attrs = {} } = {}) {
    const el = document.createElement('div');
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    document.body.appendChild(el);
    let val = model;
    if (model !== undefined) {
      Object.defineProperty(el, '_x_model', {
        value: {
          get: () => val,
          set: (v) => {
            val = v;
          },
        },
        configurable: true,
      });
    }
    const widget = createCalendarWidget('test', el, { ...defaultCallbacks, ...callbacks });
    widget.setConfig({ locale: 'en-US', ...config });
    const find = (label) => [...el.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === label);
    const toggles = () => [...el.querySelectorAll('button[aria-pressed]')];
    const ui = {
      prevYear: find('previous year'),
      prevMonth: find('previous month'),
      nextMonth: find('next month'),
      nextYear: find('next year'),
      monthToggle: () => toggles().find((b) => b.getAttribute('aria-label').endsWith(', choose month')),
      yearToggle: () => toggles().find((b) => b.getAttribute('aria-label').endsWith(', choose year')),
      heading: el.querySelector('h2'),
      dayTable: el.querySelector('table'),
      monthGrid: () => el.querySelector('table[aria-label="choose month"]'),
      yearGrid: () => el.querySelector('table[aria-label="choose year"]'),
      // Day cells carry data-month / data-year too, so these look inside the grids.
      month: (m) => el.querySelector(`table[aria-label="choose month"] td[data-month="${m}"]`),
      year: (y) => el.querySelector(`table[aria-label="choose year"] td[data-year="${y}"]`),
      day: (d) => el.querySelector(`td[data-day="${d}"]`),
    };
    return { el, widget, ui, getModel: () => val };
  }

  const key = (target, k, init = {}) => {
    const event = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
  };

  describe('day view', () => {
    it('shows the month buttons and hides the year buttons, keeping all four in the DOM', () => {
      const { ui } = setup();
      expect(ui.prevMonth.hidden).toBe(false);
      expect(ui.nextMonth.hidden).toBe(false);
      expect(ui.prevYear.hidden).toBe(true);
      expect(ui.nextYear.hidden).toBe(true);
    });

    it('keeps the day DOM contract: one grid table labelled by the live heading', () => {
      const { el, ui } = setup();
      expect(el.querySelectorAll('table').length).toBe(1);
      expect(el.querySelectorAll('td[role="gridcell"]').length).toBe(42);
      expect(ui.dayTable.getAttribute('role')).toBe('grid');
      expect(ui.dayTable.getAttribute('aria-labelledby')).toBe(ui.heading.id);
      expect(ui.heading.getAttribute('aria-live')).toBe('polite');
      expect(ui.heading.classList.contains('sr-only')).toBe(true);
      expect(ui.heading.textContent).toBe('September 2026');
    });

    it('keeps the widget API', () => {
      const { widget } = setup();
      expect(Object.keys(widget).sort()).toEqual(
        [
          'render',
          'focusDay',
          'setConfig',
          'checkForModel',
          'clearSelected',
          'clearSelectedAndSync',
          'setSelectedAndSync',
          'applyModel',
          'formatSelectedDate',
          'parseDisplayValue',
          'getPlaceholder',
          'isSameDay',
          'isRange',
          'getSelected',
          'cleanup',
        ].sort()
      );
    });

    it('steps from the 31st to the next month without skipping it', () => {
      const { ui } = setup({ model: '2026-01-31' });
      ui.nextMonth.click();
      expect(ui.heading.textContent).toBe('February 2026');
      ui.prevMonth.click();
      ui.prevMonth.click();
      expect(ui.heading.textContent).toBe('December 2025');
    });

    it('always has a day tab stop, falling back to the selection, today or the 1st', () => {
      const { el, ui } = setup({ model: '2025-03-10' });
      const stops = () => [...el.querySelectorAll('td[tabindex="0"]')].map((c) => c.getAttribute('data-day'));
      expect(stops()).toEqual(['10']);
      ui.nextMonth.click();
      expect(stops()).toEqual(['1']);
      // Arrows start from the tab stop.
      key(ui.day(1), 'ArrowRight');
      expect(stops()).toEqual(['2']);
    });

    it('still gives today the tab stop when nothing is focused or selected', () => {
      const { el } = setup();
      expect([...el.querySelectorAll('td[tabindex="0"]')].map((c) => c.getAttribute('data-day'))).toEqual(['24']);
    });
  });

  describe('view toggles', () => {
    it('show the month and year, with the purpose after the visible text', () => {
      const { ui } = setup({ model: '2026-01-31' });
      expect(ui.monthToggle().textContent).toBe('January');
      expect(ui.monthToggle().getAttribute('aria-label')).toBe('January, choose month');
      expect(ui.yearToggle().textContent).toBe('2026');
      expect(ui.yearToggle().getAttribute('aria-label')).toBe('2026, choose year');
      expect(ui.monthToggle().getAttribute('aria-pressed')).toBe('false');
      expect(ui.yearToggle().getAttribute('aria-pressed')).toBe('false');
    });

    it('take their purpose from data-aria-choose-month / data-aria-choose-year', () => {
      const { el } = setup({ attrs: { 'data-aria-choose-month': 'изберете месец', 'data-aria-choose-year': 'изберете година' } });
      const labels = [...el.querySelectorAll('button[aria-pressed]')].map((b) => b.getAttribute('aria-label'));
      expect(labels).toEqual(['September, изберете месец', '2026, изберете година']);
    });

    it('put the year first for a year-first locale', () => {
      const { el } = setup({ config: { locale: 'ja-JP' } });
      const [first] = el.querySelectorAll('button[aria-pressed]');
      expect(first.getAttribute('aria-label')).toMatch(/choose year$/);
    });

    it('open a lazily built month grid in place of the day table, and close it again', () => {
      const { el, ui } = setup({ model: '2026-01-31' });
      expect(ui.monthGrid()).toBeNull();
      ui.monthToggle().click();
      expect(ui.monthToggle().getAttribute('aria-pressed')).toBe('true');
      expect(ui.dayTable.hidden).toBe(true);
      expect(ui.dayTable.nextElementSibling).toBe(ui.monthGrid());
      expect(ui.month(0).getAttribute('aria-selected')).toBe('true');
      expect(ui.month(0).getAttribute('tabindex')).toBe('0');
      expect(ui.month(0).getAttribute('aria-label')).toBe('January 2026');
      expect(ui.month(8).getAttribute('aria-current')).toBe('date');
      expect(ui.heading.textContent).toBe('January 2026');

      ui.monthToggle().click();
      expect(ui.monthToggle().getAttribute('aria-pressed')).toBe('false');
      expect(ui.dayTable.hidden).toBe(false);
      expect(ui.monthGrid()).toBeNull();
      expect(el.querySelectorAll('td[role="gridcell"]').length).toBe(42);
      expect(el.querySelectorAll('[aria-selected="true"]').length).toBe(1);
    });

    it('switch straight from one grid to the other', () => {
      const { ui } = setup();
      ui.monthToggle().click();
      ui.yearToggle().click();
      expect(ui.monthToggle().getAttribute('aria-pressed')).toBe('false');
      expect(ui.yearToggle().getAttribute('aria-pressed')).toBe('true');
      expect(ui.monthGrid()).toBeNull();
      expect(ui.yearGrid()).not.toBeNull();
      expect(ui.dayTable.hidden).toBe(true);
    });
  });

  describe('month view', () => {
    it('keeps the month buttons, which step the displayed month across years', () => {
      const { ui } = setup({ model: '2026-11-15' });
      ui.monthToggle().click();
      expect(ui.prevMonth.hidden).toBe(false);
      expect(ui.prevYear.hidden).toBe(true);
      ui.nextMonth.click();
      expect(ui.month(11).getAttribute('aria-selected')).toBe('true');
      expect(ui.month(11).getAttribute('tabindex')).toBe('0');
      expect(ui.heading.textContent).toBe('December 2026');
      ui.nextMonth.click();
      expect(ui.month(0).getAttribute('aria-selected')).toBe('true');
      expect(ui.yearToggle().textContent).toBe('2027');
      expect(ui.heading.textContent).toBe('January 2027');
    });

    it('a click picks the month, focuses the closest day and never touches the model', () => {
      const changes = [];
      const { el, ui, getModel } = setup({ model: '2026-01-31' });
      el.addEventListener('change', (event) => changes.push(event));
      ui.day(31).click();
      ui.day(31).click();
      changes.length = 0;
      const before = getModel();
      ui.monthToggle().click();
      ui.month(1).click();
      expect(ui.heading.textContent).toBe('February 2026');
      expect(ui.dayTable.hidden).toBe(false);
      expect(ui.monthGrid()).toBeNull();
      expect(document.activeElement).toBe(ui.day(28));
      expect(ui.monthToggle().getAttribute('aria-pressed')).toBe('false');
      expect(getModel()).toBe(before);
      expect(changes).toEqual([]);
    });

    it('Enter and Space pick the focused month', () => {
      const { ui } = setup({ model: '2026-01-15' });
      ui.monthToggle().click();
      key(ui.month(4), 'Enter');
      expect(ui.heading.textContent).toBe('May 2026');
      expect(document.activeElement).toBe(ui.day(15));
      ui.monthToggle().click();
      key(ui.month(6), ' ');
      expect(ui.heading.textContent).toBe('July 2026');
    });

    it('arrow keys move the tab stop within the displayed year and never move the year', () => {
      const { ui } = setup({ model: '2026-01-15' });
      ui.monthToggle().click();
      ui.month(0).focus();
      expect(key(ui.month(0), 'ArrowRight').defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(ui.month(1));
      key(ui.month(1), 'ArrowDown');
      expect(document.activeElement).toBe(ui.month(4));
      key(ui.month(4), 'End');
      expect(document.activeElement).toBe(ui.month(11));
      // The edges stop the keys instead of crossing into another year.
      for (const k of ['ArrowRight', 'ArrowDown', 'PageUp', 'PageDown']) {
        expect(key(ui.month(11), k).defaultPrevented).toBe(true);
        expect(document.activeElement).toBe(ui.month(11));
      }
      key(ui.month(11), 'Home');
      expect(document.activeElement).toBe(ui.month(0));
      key(ui.month(0), 'ArrowLeft');
      key(ui.month(0), 'ArrowUp');
      expect(document.activeElement).toBe(ui.month(0));
      expect(ui.heading.textContent).toBe('January 2026');
      expect(ui.yearToggle().textContent).toBe('2026');
    });

    it('disables whole months outside min/max, which cannot be picked', () => {
      const { ui } = setup({ model: '2026-05-15', config: { min: '2026-03-15', max: '2026-10-10' } });
      ui.monthToggle().click();
      expect(ui.month(1).getAttribute('aria-disabled')).toBe('true');
      expect(ui.month(2).hasAttribute('aria-disabled')).toBe(false);
      expect(ui.month(9).hasAttribute('aria-disabled')).toBe(false);
      expect(ui.month(10).getAttribute('aria-disabled')).toBe('true');
      ui.month(1).click();
      key(ui.month(1), 'Enter');
      expect(ui.monthGrid()).not.toBeNull();
      expect(ui.heading.textContent).toBe('May 2026');
    });
  });

  describe('year view', () => {
    it('shows the year buttons instead of the month buttons', () => {
      const { ui } = setup();
      ui.yearToggle().click();
      expect(ui.prevYear.hidden).toBe(false);
      expect(ui.nextYear.hidden).toBe(false);
      expect(ui.prevMonth.hidden).toBe(true);
      expect(ui.nextMonth.hidden).toBe(true);
      ui.yearToggle().click();
      expect(ui.prevYear.hidden).toBe(true);
      expect(ui.prevMonth.hidden).toBe(false);
    });

    it('lists 100 years either side of this year in a scroller that is not a tab stop', () => {
      const { ui } = setup();
      ui.yearToggle().click();
      const scroller = ui.yearGrid().parentElement;
      expect(scroller.classList.contains('overflow-y-auto')).toBe(true);
      expect(scroller.getAttribute('tabindex')).toBe('-1');
      const years = [...ui.yearGrid().querySelectorAll('td[data-year]')].map((c) => Number(c.getAttribute('data-year')));
      expect(years[0]).toBe(1926);
      expect(years.at(-1)).toBe(2126);
      expect(years.length).toBe(201);
      expect(ui.year(2026).getAttribute('aria-selected')).toBe('true');
      expect(ui.year(2026).getAttribute('aria-current')).toBe('date');
      expect(ui.year(2026).getAttribute('tabindex')).toBe('0');
      expect(ui.yearGrid().querySelectorAll('[tabindex="0"]').length).toBe(1);
    });

    it('follows min/max and widens to the displayed year', () => {
      const bounded = setup({ model: '2025-05-15', config: { min: '2020-06-15', max: '2030-06-15' } });
      bounded.ui.yearToggle().click();
      const years = [...bounded.ui.yearGrid().querySelectorAll('td[data-year]')].map((c) => Number(c.getAttribute('data-year')));
      expect([years[0], years.at(-1), years.length]).toEqual([2020, 2030, 11]);

      const minOnly = setup({ config: { min: '1900-01-01' } });
      minOnly.ui.yearToggle().click();
      const minYears = [...minOnly.ui.yearGrid().querySelectorAll('td[data-year]')].map((c) => Number(c.getAttribute('data-year')));
      expect([minYears[0], minYears.at(-1)]).toEqual([1900, 2126]);

      const maxOnly = setup({ config: { max: '2030-06-15' } });
      maxOnly.ui.yearToggle().click();
      const maxYears = [...maxOnly.ui.yearGrid().querySelectorAll('td[data-year]')].map((c) => Number(c.getAttribute('data-year')));
      expect([maxYears[0], maxYears.at(-1)]).toEqual([1926, 2030]);

      const old = setup({ model: '1850-05-15' });
      old.ui.yearToggle().click();
      expect(old.ui.yearGrid().querySelector('td[data-year]').getAttribute('data-year')).toBe('1850');
      expect(old.ui.year(1850).getAttribute('tabindex')).toBe('0');
    });

    it('year buttons step the displayed year, clamped to the range', () => {
      const { ui } = setup({ model: '2029-05-15', config: { max: '2030-06-15' } });
      ui.yearToggle().click();
      ui.nextYear.click();
      expect(ui.heading.textContent).toBe('May 2030');
      expect(ui.year(2030).getAttribute('aria-selected')).toBe('true');
      expect(ui.year(2030).getAttribute('tabindex')).toBe('0');
      ui.nextYear.click();
      expect(ui.heading.textContent).toBe('May 2030');
      ui.prevYear.click();
      expect(ui.yearToggle().textContent).toBe('2029');
    });

    it('a pick keeps the month, clamped into min/max, and focuses the closest day', () => {
      const { ui } = setup({ model: '2026-01-31', config: { min: '2020-06-15' } });
      ui.yearToggle().click();
      ui.year(2028).click();
      expect(ui.heading.textContent).toBe('January 2028');
      expect(document.activeElement).toBe(ui.day(31));
      ui.yearToggle().click();
      ui.year(2020).click();
      expect(ui.heading.textContent).toBe('June 2020');
      expect(document.activeElement).toBe(ui.day(30));
    });

    it('keys move the tab stop without changing the displayed year, Enter picks', () => {
      const { ui } = setup({ model: '2026-03-10' });
      ui.yearToggle().click();
      const stop = () => ui.yearGrid().querySelector('[tabindex="0"]').getAttribute('data-year');
      key(ui.year(2026), 'ArrowRight');
      expect(stop()).toBe('2027');
      expect(document.activeElement).toBe(ui.year(2027));
      expect(ui.heading.textContent).toBe('March 2026');
      key(ui.year(2027), 'ArrowDown');
      expect(stop()).toBe('2030');
      key(ui.year(2030), 'PageUp');
      expect(stop()).toBe('2018');
      key(ui.year(2018), 'Home');
      expect(stop()).toBe('1926');
      key(ui.year(1926), 'ArrowUp');
      expect(stop()).toBe('1926');
      key(ui.year(1926), 'End');
      expect(stop()).toBe('2126');
      key(ui.year(2126), 'Enter');
      expect(ui.heading.textContent).toBe('March 2126');
      expect(ui.yearGrid()).toBeNull();
    });
  });

  describe('Escape, Tab and reset', () => {
    it('Escape in a grid returns to the days without onEscape, then a second Escape calls it', () => {
      const onEscape = vi.fn();
      const { ui } = setup({ callbacks: { onEscape } });
      ui.monthToggle().click();
      ui.month(3).focus();
      const event = key(ui.month(3), 'Escape');
      expect(event.defaultPrevented).toBe(true);
      expect(onEscape).not.toHaveBeenCalled();
      expect(ui.monthGrid()).toBeNull();
      expect(document.activeElement).toBe(ui.monthToggle());
      key(ui.monthToggle(), 'Escape');
      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('Escape on a year button moves focus to the year toggle as the button hides', () => {
      const { ui } = setup();
      ui.yearToggle().click();
      ui.nextYear.focus();
      key(ui.nextYear, 'Escape');
      expect(ui.nextYear.hidden).toBe(true);
      expect(document.activeElement).toBe(ui.yearToggle());
    });

    it('a grid closing under focus hands it to the toggle', () => {
      const { ui } = setup();
      ui.monthToggle().click();
      ui.month(2).focus();
      ui.yearToggle().click();
      expect(document.activeElement).toBe(ui.yearToggle());
    });

    it('with cycleSelectionTab, Tab wraps between the grid and the first nav button', () => {
      const { ui } = setup({ callbacks: { cycleSelectionTab: true } });
      ui.monthToggle().click();
      ui.month(5).focus();
      expect(key(ui.month(5), 'Tab').defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(ui.prevMonth);
      expect(key(ui.prevMonth, 'Tab', { shiftKey: true }).defaultPrevented).toBe(true);
      expect(document.activeElement).toBe(ui.month(8));
      // In between the natural order applies.
      expect(key(ui.monthToggle(), 'Tab').defaultPrevented).toBe(false);

      ui.yearToggle().click();
      ui.year(1990).focus();
      key(ui.year(1990), 'Tab');
      expect(document.activeElement).toBe(ui.prevYear);
      key(ui.prevYear, 'Tab', { shiftKey: true });
      expect(document.activeElement).toBe(ui.year(2026));
    });

    it('without cycleSelectionTab, Tab keeps its native order', () => {
      const { ui } = setup();
      ui.monthToggle().click();
      ui.month(5).focus();
      expect(key(ui.month(5), 'Tab').defaultPrevented).toBe(false);
      expect(key(ui.prevMonth, 'Tab', { shiftKey: true }).defaultPrevented).toBe(false);
    });

    it('stops toggle and grid clicks, gaps included, with stopNavPropagation', () => {
      const outside = vi.fn();
      document.addEventListener('click', outside);
      const { ui } = setup({ callbacks: { stopNavPropagation: true } });
      ui.monthToggle().click();
      ui.monthGrid().querySelector('tr').click();
      ui.yearToggle().click();
      ui.yearGrid().parentElement.click();
      expect(outside).not.toHaveBeenCalled();
      document.removeEventListener('click', outside);
    });

    it('lets clicks bubble without stopNavPropagation', () => {
      const outside = vi.fn();
      document.addEventListener('click', outside);
      const { ui } = setup();
      ui.monthToggle().click();
      expect(outside).toHaveBeenCalledTimes(1);
      document.removeEventListener('click', outside);
    });

    it('focusDay returns to the day view', () => {
      const { widget, ui } = setup({ model: '2026-01-15' });
      ui.monthToggle().click();
      widget.focusDay();
      expect(ui.monthGrid()).toBeNull();
      expect(ui.dayTable.hidden).toBe(false);
      expect(document.activeElement).toBe(ui.day(15));
    });

    it('render, setConfig and applyModel refresh an open grid without closing it', () => {
      const { el, widget, ui } = setup({ model: '2026-01-15' });
      ui.monthToggle().click();
      widget.setConfig({ locale: 'de-DE' });
      expect(ui.monthGrid()).not.toBeNull();
      expect(ui.monthToggle().textContent).toBe('Januar');
      el._x_model.set('2026-05-10');
      widget.applyModel('2026-05-10');
      expect(ui.month(4).getAttribute('aria-selected')).toBe('true');
      widget.render();
      expect(ui.monthGrid()).not.toBeNull();
    });

    it('cleanup removes the header and grid listeners', () => {
      const { widget, ui } = setup();
      ui.monthToggle().click();
      widget.cleanup();
      ui.month(3).click();
      expect(ui.monthGrid()).not.toBeNull();
      ui.monthToggle().click();
      expect(ui.monthToggle().getAttribute('aria-pressed')).toBe('true');
    });
  });
});

describe('createCalendarWidget min and max', () => {
  // West of UTC, so a bound read as UTC midnight would land on the previous day.
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
    vi.setSystemTime(new Date(2026, 8, 24, 12));
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.replaceChildren();
  });

  function setup(model, config) {
    const el = document.createElement('div');
    document.body.appendChild(el);
    let val = model;
    Object.defineProperty(el, '_x_model', {
      value: {
        get: () => val,
        set: (v) => {
          val = v;
        },
      },
      configurable: true,
    });
    const widget = createCalendarWidget('test', el, defaultCallbacks);
    widget.setConfig({ locale: 'en-US', ...config });
    const disabled = (d) => el.querySelector(`td[data-day="${d}"]`).getAttribute('aria-disabled');
    const toggle = (purpose) => [...el.querySelectorAll('button[aria-pressed]')].find((b) => b.getAttribute('aria-label').endsWith(purpose));
    const years = () => [...el.querySelectorAll('table[aria-label="choose year"] td[data-year]')].map((c) => Number(c.getAttribute('data-year')));
    return { el, widget, disabled, toggle, years };
  }

  it('runs in a timezone west of UTC', () => {
    expect(new Date(2026, 0, 1).getTimezoneOffset()).toBe(300);
  });

  it('a YYYY-MM-DD max keeps its own day selectable', () => {
    const { disabled } = setup('2026-01-15', { max: '2026-01-31' });
    expect(disabled(30)).toBe('false');
    expect(disabled(31)).toBe('false');
  });

  it('a YYYY-MM-DD min disables the day before it', () => {
    const { disabled } = setup('2025-12-15', { min: '2026-01-01' });
    expect(disabled(30)).toBe('true');
    expect(disabled(31)).toBe('true');
  });

  it('the year list and month grid start at the min day', () => {
    const { toggle, years, el } = setup('2025-12-15', { min: '2026-01-01' });
    toggle(', choose month').click();
    expect(el.querySelector('table[aria-label="choose month"] td[data-month="11"]').getAttribute('aria-disabled')).toBe('true');
    toggle(', choose year').click();
    expect(years()[0]).toBe(2026);
  });

  it('accepts a Date as a bound', () => {
    const { disabled } = setup('2025-12-15', { min: new Date(2026, 0, 1) });
    expect(disabled(31)).toBe('true');
  });

  it('a bound left out of a later config no longer applies', () => {
    const { widget, disabled } = setup('2026-03-15', { min: '2026-03-10', max: '2026-03-20' });
    expect([disabled(9), disabled(21)]).toEqual(['true', 'true']);
    widget.setConfig({ locale: 'en-US' });
    expect([disabled(9), disabled(21)]).toEqual(['false', 'false']);
  });

  it('an invalid bound is ignored', () => {
    const { toggle, years, disabled } = setup('2026-03-15', { min: 'not a date', max: 'nope' });
    expect(disabled(1)).toBe('false');
    toggle(', choose year').click();
    expect([years()[0], years().at(-1)]).toEqual([1926, 2126]);
  });

  const heading = (el) => el.querySelector('h2').textContent;
  const nav = (el, label) => el.querySelector(`button[aria-label="${label}"]`);

  it('the month buttons stop at the min and max months, in the day and month views', () => {
    const { el, toggle } = setup('2026-03-15', { min: '2026-02-10', max: '2026-04-20' });
    expect(nav(el, 'next month').hasAttribute('aria-disabled')).toBe(false);
    nav(el, 'next month').click();
    expect(heading(el)).toBe('April 2026');
    expect(nav(el, 'next month').getAttribute('aria-disabled')).toBe('true');
    nav(el, 'next month').click();
    expect(heading(el)).toBe('April 2026');

    toggle(', choose month').click();
    nav(el, 'previous month').click();
    nav(el, 'previous month').click();
    expect(heading(el)).toBe('February 2026');
    expect(nav(el, 'previous month').getAttribute('aria-disabled')).toBe('true');
    nav(el, 'previous month').click();
    expect(heading(el)).toBe('February 2026');
    expect(nav(el, 'next month').hasAttribute('aria-disabled')).toBe(false);
  });

  it('a click on a disabled nav button is still stopped, so a popover stays open', () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    const widget = createCalendarWidget('test', el, { ...defaultCallbacks, stopNavPropagation: true });
    widget.setConfig({ locale: 'en-US', max: '2026-09-30' });
    const reached = vi.fn();
    document.addEventListener('click', reached);
    nav(el, 'next month').click();
    document.removeEventListener('click', reached);
    expect(nav(el, 'next month').getAttribute('aria-disabled')).toBe('true');
    expect(reached).not.toHaveBeenCalled();
  });

  it('an unbounded calendar never disables its nav buttons', () => {
    const { el } = setup('2026-03-15', {});
    expect(el.querySelectorAll('button[aria-disabled]')).toHaveLength(0);
  });

  it('the year buttons stop at the ends of the year list and keep the month inside min/max', () => {
    const { el, toggle } = setup('2021-05-15', { min: '2020-06-15', max: '2022-03-10' });
    toggle(', choose year').click();
    nav(el, 'previous year').click();
    expect(heading(el)).toBe('June 2020');
    expect(nav(el, 'previous year').getAttribute('aria-disabled')).toBe('true');
    nav(el, 'previous year').click();
    expect(heading(el)).toBe('June 2020');

    nav(el, 'next year').click();
    nav(el, 'next year').click();
    expect(heading(el)).toBe('March 2022');
    expect(nav(el, 'next year').getAttribute('aria-disabled')).toBe('true');
    expect(nav(el, 'previous year').hasAttribute('aria-disabled')).toBe(false);
  });

  it('keys keep focus between the min and max days', () => {
    const { el } = setup('2026-03-18', { min: '2026-03-10', max: '2026-03-20' });
    const day = (d) => el.querySelector(`td[data-day="${d}"]`);
    const press = (key) => document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    day(18).focus();
    press('ArrowDown');
    expect(document.activeElement).toBe(day(20));
    press('PageDown');
    expect(document.activeElement).toBe(day(20));
    press('End');
    expect(document.activeElement).toBe(day(20));
    press('PageUp');
    expect(document.activeElement).toBe(day(10));
    press('Home');
    expect(document.activeElement).toBe(day(10));
    press('ArrowLeft');
    expect(document.activeElement).toBe(day(10));
    expect(heading(el)).toBe('March 2026');
  });

  it('without a value it opens on the nearest month inside min/max, with focus on the first allowed day', () => {
    const { el, widget } = setup(undefined, { min: '2027-01-15' });
    expect(heading(el)).toBe('January 2027');
    expect(el.querySelector('td[tabindex="0"]').getAttribute('data-day')).toBe('15');
    widget.focusDay();
    expect(document.activeElement).toBe(el.querySelector('td[data-day="15"]'));

    expect(heading(setup(undefined, { max: '2026-03-31' }).el)).toBe('March 2026');
  });

  it('without a value it follows a bound that changes, and keeps a month inside it', () => {
    const { el, widget } = setup(undefined, { max: '2026-12-31' });
    nav(el, 'next month').click();
    widget.setConfig({ locale: 'en-US', max: '2026-12-31' });
    expect(heading(el)).toBe('October 2026');
    widget.setConfig({ locale: 'en-US', max: '2026-06-30' });
    expect(heading(el)).toBe('June 2026');
  });

  it('a value outside min/max still opens on its own month', () => {
    const { el } = setup('2026-09-10', { min: '2027-01-01' });
    expect(heading(el)).toBe('September 2026');
    expect(nav(el, 'previous month').getAttribute('aria-disabled')).toBe('true');
    expect(nav(el, 'next month').hasAttribute('aria-disabled')).toBe(false);
  });
});

describe('forwardCalendarNavAria', () => {
  it('forwards the nav and view toggle labels that are set', () => {
    const from = document.createElement('div');
    const to = document.createElement('div');
    from.setAttribute('data-aria-prev-year', 'a');
    from.setAttribute('data-aria-next-month', 'b');
    from.setAttribute('data-aria-choose-month', 'c');
    from.setAttribute('data-aria-choose-year', 'd');
    forwardCalendarNavAria(from, to);
    expect(to.getAttribute('data-aria-prev-year')).toBe('a');
    expect(to.getAttribute('data-aria-next-month')).toBe('b');
    expect(to.getAttribute('data-aria-choose-month')).toBe('c');
    expect(to.getAttribute('data-aria-choose-year')).toBe('d');
    expect(to.hasAttribute('data-aria-prev-month')).toBe(false);
  });
});
