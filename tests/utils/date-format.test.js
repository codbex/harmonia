import { describe, expect, it } from 'vitest';
import dateFormatPlugin, { createDateFormatter, toDate } from '../../src/utils/date-format';
import { mountDirective } from '../test-utils';

const JUN_19 = new Date(2026, 5, 19);

describe('toDate', () => {
  it('parses ISO YYYY-MM-DD without timezone drift', () => {
    const d = toDate('2026-06-19');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
  });

  it('passes through Date instances and parses timestamps', () => {
    expect(toDate(JUN_19)).toBe(JUN_19);
    expect(toDate(JUN_19.getTime()).getTime()).toBe(JUN_19.getTime());
  });

  it('returns undefined for empty input', () => {
    expect(toDate('')).toBeUndefined();
    expect(toDate(null)).toBeUndefined();
    expect(toDate(undefined)).toBeUndefined();
  });

  it('falls back to the Date constructor for other strings', () => {
    const d = toDate('June 19, 2026');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
  });

  it('parses a full ISO 8601 date-time string', () => {
    const d = toDate('2026-06-19T14:30:00');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
    expect(d.getHours()).toBe(14);
    expect(d.getMinutes()).toBe(30);
  });
});

describe('createDateFormatter', () => {
  it('formats with the locale default pattern', () => {
    const f = createDateFormatter({ locale: 'en-US' });
    expect(f.format(JUN_19)).toBe('6/19/2026');
  });

  it('round-trips format/parse', () => {
    const f = createDateFormatter({ locale: 'en-US' });
    const parsed = f.parse(f.format(JUN_19));
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(5);
    expect(parsed.getDate()).toBe(19);
  });

  it('parses ISO regardless of locale', () => {
    const f = createDateFormatter({ locale: 'bg-BG' });
    const d = f.parse('2026-06-19');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
  });

  it('honours a custom delimiter', () => {
    const f = createDateFormatter({ locale: 'en-US', delimiter: '-' });
    const out = f.format(JUN_19);
    expect(out).toContain('-');
    expect(out).not.toContain('/');
    expect(f.parse(out).getDate()).toBe(19);
  });

  it('honours a custom field order', () => {
    const f = createDateFormatter({ locale: 'en-US', order: 'YMD', delimiter: '-' });
    expect(f.format(JUN_19)).toBe('2026-6-19');
    const d = f.parse('2026-6-19');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
  });

  it('handles the bg-BG trailing suffix (regression)', () => {
    const f = createDateFormatter({ locale: 'bg-BG' });
    const d = f.parse('18.06.2027 г.');
    expect(d.getFullYear()).toBe(2027);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(18);
  });

  it('does not throw for non-Gregorian calendars (fa-IR)', () => {
    const f = createDateFormatter({ locale: 'fa-IR' });
    expect(() => f.parse('1405/03/29')).not.toThrow();
  });

  it('normalizes Arabic-Indic digits (ar-SA)', () => {
    const f = createDateFormatter({ locale: 'ar-SA' });
    // '19/6/2026' written with Arabic-Indic digits and RTL marks
    const d = f.parse('\u0661\u0669\u200F/\u0666\u200F/\u0662\u0660\u0662\u0666');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(5);
    expect(d.getDate()).toBe(19);
  });

  it('formats a range with the configured separator', () => {
    const f = createDateFormatter({ locale: 'en-US', rangeSeparator: ' to ' });
    expect(f.formatRange(new Date(2026, 5, 1), new Date(2026, 5, 5))).toBe('6/1/2026 to 6/5/2026');
  });

  it('formats a one-sided range as just the start, and an empty range as undefined', () => {
    const f = createDateFormatter({ locale: 'en-US' });
    expect(f.formatRange(new Date(2026, 5, 1), undefined)).toBe('6/1/2026');
    expect(f.formatRange(undefined, undefined)).toBeUndefined();
  });

  it('parses a range string into start/end dates', () => {
    const f = createDateFormatter({ locale: 'en-US' });
    const { start, end } = f.parseRange('6/1/2026 - 6/5/2026');
    expect(start.getDate()).toBe(1);
    expect(end.getDate()).toBe(5);
  });
});

describe('x-h-date-format directive', () => {
  const withValue = (value) => ({ evaluateLater: () => (cb) => cb(value) });

  it('formats an expression value into the element text', () => {
    const el = document.createElement('span');
    el.setAttribute('data-locale', 'en-US');
    mountDirective(dateFormatPlugin, 'h-date-format', el, { expression: 'value' }, withValue('2026-06-19'));
    expect(el.textContent).toBe('6/19/2026');
  });

  it("formats the element's own text content when there is no expression", () => {
    const el = document.createElement('span');
    el.setAttribute('data-locale', 'en-US');
    el.textContent = '2026-06-19';
    mountDirective(dateFormatPlugin, 'h-date-format', el);
    expect(el.textContent).toBe('6/19/2026');
  });

  it('sets a machine-readable datetime attribute on <time> elements', () => {
    const el = document.createElement('time');
    el.setAttribute('data-locale', 'en-US');
    mountDirective(dateFormatPlugin, 'h-date-format', el, { expression: 'value' }, withValue('2026-06-19'));
    expect(el.getAttribute('datetime')).toBe('2026-06-19');
  });

  it('honours data-order and data-delimiter', () => {
    const el = document.createElement('span');
    el.setAttribute('data-locale', 'en-US');
    el.setAttribute('data-order', 'YMD');
    el.setAttribute('data-delimiter', '-');
    mountDirective(dateFormatPlugin, 'h-date-format', el, { expression: 'value' }, withValue('2026-06-19'));
    expect(el.textContent).toBe('2026-6-19');
  });

  it('formats a range when data-range is set', () => {
    const el = document.createElement('span');
    el.setAttribute('data-locale', 'en-US');
    el.setAttribute('data-range', 'true');
    mountDirective(dateFormatPlugin, 'h-date-format', el, { expression: 'value' }, withValue({ start: '2026-06-01', end: '2026-06-05' }));
    expect(el.textContent).toBe('6/1/2026 - 6/5/2026');
  });

  it('renders empty text for an empty or invalid value', () => {
    const el = document.createElement('span');
    el.setAttribute('data-locale', 'en-US');
    mountDirective(dateFormatPlugin, 'h-date-format', el, { expression: 'value' }, withValue(''));
    expect(el.textContent).toBe('');
  });
});
