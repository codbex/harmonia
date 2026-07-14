import { describe, expect, it } from 'vitest';
import { dayPeriodLabels, formatDuration, formatTimeDisplay, getSelectedTime, getSystemTime, partsToValue24 } from '../../src/common/time';

describe('formatDuration', () => {
  it('formats seconds as m:ss', () => {
    expect(formatDuration(0)).toBe('0:00');
    expect(formatDuration(5)).toBe('0:05');
    expect(formatDuration(65)).toBe('1:05');
    expect(formatDuration(600)).toBe('10:00');
  });

  it('formats an hour or more as h:mm:ss', () => {
    expect(formatDuration(3600)).toBe('1:00:00');
    expect(formatDuration(3661)).toBe('1:01:01');
  });

  it('floors fractional seconds', () => {
    expect(formatDuration(65.9)).toBe('1:05');
  });

  it('returns 0:00 for NaN, negative or non-finite input', () => {
    expect(formatDuration(NaN)).toBe('0:00');
    expect(formatDuration(-5)).toBe('0:00');
    expect(formatDuration(Infinity)).toBe('0:00');
    expect(formatDuration(undefined)).toBe('0:00');
  });
});

describe('getSelectedTime', () => {
  it('parses 24-hour HH:mm', () => {
    expect(getSelectedTime('14:30', false)).toEqual({ hour: '14', minute: '30', second: null, period: null });
  });

  it('parses HH:mm:ss', () => {
    expect(getSelectedTime('09:05:45', false)).toEqual({ hour: '09', minute: '05', second: '45', period: null });
  });

  it('converts to 12-hour with AM/PM', () => {
    expect(getSelectedTime('14:30', true)).toEqual({ hour: '02', minute: '30', second: null, period: dayPeriodLabels.pm });
    expect(getSelectedTime('00:15', true)).toEqual({ hour: '12', minute: '15', second: null, period: dayPeriodLabels.am });
    expect(getSelectedTime('12:00', true)).toEqual({ hour: '12', minute: '00', second: null, period: dayPeriodLabels.pm });
  });

  it('returns nulls for an empty value', () => {
    expect(getSelectedTime('', false)).toEqual({ hour: null, minute: null, second: null, period: null });
    expect(getSelectedTime(null, false)).toEqual({ hour: null, minute: null, second: null, period: null });
  });
});

describe('partsToValue24', () => {
  it('joins 24-hour parts', () => {
    expect(partsToValue24({ hour: '14', minute: '30', second: null, period: null }, { is12Hour: false })).toBe('14:30');
  });

  it('includes seconds when enabled', () => {
    expect(partsToValue24({ hour: '09', minute: '05', second: '45', period: null }, { is12Hour: false, seconds: true })).toBe('09:05:45');
  });

  it('converts 12-hour AM/PM to 24-hour', () => {
    expect(partsToValue24({ hour: '02', minute: '30', period: dayPeriodLabels.pm }, { is12Hour: true })).toBe('14:30');
    expect(partsToValue24({ hour: '12', minute: '00', period: dayPeriodLabels.am }, { is12Hour: true })).toBe('00:00');
    expect(partsToValue24({ hour: '12', minute: '00', period: dayPeriodLabels.pm }, { is12Hour: true })).toBe('12:00');
  });
});

describe('formatTimeDisplay', () => {
  it('returns the 24-hour value unchanged in 24-hour mode', () => {
    expect(formatTimeDisplay('14:30', { is12Hour: false })).toBe('14:30');
  });

  it('formats as 12-hour with AM/PM', () => {
    expect(formatTimeDisplay('14:30', { is12Hour: true })).toBe('02:30 PM');
  });

  it('includes seconds when enabled', () => {
    expect(formatTimeDisplay('14:30:05', { is12Hour: true, seconds: true })).toBe('02:30:05 PM');
  });

  it('returns an empty string for an empty value', () => {
    expect(formatTimeDisplay('', { is12Hour: true })).toBe('');
  });
});

describe('getSystemTime', () => {
  it('returns a 24-hour HH:mm string', () => {
    expect(getSystemTime()).toMatch(/^\d{2}:\d{2}$/);
  });

  it('includes seconds when requested', () => {
    expect(getSystemTime({ seconds: true })).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
