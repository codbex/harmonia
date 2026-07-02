import { describe, expect, it } from 'vitest';
import { createCalendarWidget, dateOrderMap, isDisabled, nextFocusDate, parseDateValue, sameDay, toDateString } from '../../src/common/calendar';

const noop = () => {};
const defaultCallbacks = {
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

  it('creates 4 navigation buttons', () => {
    const el = makeEl();
    createCalendarWidget('test', el, defaultCallbacks);
    const buttons = el.querySelectorAll('button');
    expect(buttons.length).toBe(4);
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
