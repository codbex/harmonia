export const dayPeriodLabels = { am: 'AM', pm: 'PM' };

// Zero-pad a number to two digits (e.g. 5 -> "05").
export function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

// Convert a "HH:MM" string to minutes since midnight, and back.
export function timeToMins(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export function minsToTime(mins) {
  return `${pad2(Math.floor(mins / 60))}:${pad2(mins % 60)}`;
}

/**
 * Parse a 24-hour "HH:mm" / "HH:mm:ss" string into its parts. When
 * `convertTo12` is true the hour is converted to 12-hour form and a `period`
 * (AM/PM) is produced. Returns null parts for an empty input.
 */
export function getSelectedTime(rawTime, convertTo12) {
  let hour = null;
  let minute = null;
  let second = null;
  let period = null;
  if (rawTime && rawTime.length > 0) {
    const timeParts = rawTime.split(':');
    const h24 = parseInt(timeParts[0], 10);
    minute = timeParts[1];
    if (timeParts.length === 3) {
      second = timeParts[2];
    }
    if (convertTo12) {
      period = h24 >= 12 ? dayPeriodLabels.pm : dayPeriodLabels.am;
      const h12 = h24 % 12 || 12;
      hour = h12 < 10 ? `0${h12}` : h12.toString();
    } else {
      hour = h24 < 10 ? `0${h24}` : h24.toString();
    }
  }
  return { hour, minute, second, period };
}

/**
 * Convert selected time parts back to a 24-hour "HH:mm" / "HH:mm:ss" string.
 * The hour is interpreted as 12-hour (with `parts.period`) when `is12Hour`.
 * Assumes the required parts are present.
 */
export function partsToValue24(parts, { is12Hour = false, seconds = false } = {}) {
  let h24;
  if (is12Hour) {
    const h12 = parseInt(parts.hour, 10);
    if (parts.period === dayPeriodLabels.am) {
      h24 = h12 === 12 ? 0 : h12;
    } else {
      h24 = h12 === 12 ? 12 : h12 + 12;
    }
  } else {
    h24 = parseInt(parts.hour, 10);
  }
  const h24Str = h24 < 10 ? `0${h24}` : h24.toString();
  return seconds ? `${h24Str}:${parts.minute}:${parts.second}` : `${h24Str}:${parts.minute}`;
}

/**
 * Format a 24-hour value for display, optionally as 12-hour with an AM/PM
 * suffix and/or including seconds. Returns an empty string for an empty value.
 */
export function formatTimeDisplay(value24h, { is12Hour = false, seconds = false } = {}) {
  if (!value24h) return '';
  if (is12Hour) {
    const { hour, minute, second, period } = getSelectedTime(value24h, true);
    return seconds ? `${hour}:${minute}:${second ?? '00'} ${period}` : `${hour}:${minute} ${period}`;
  }
  return value24h;
}

/**
 * Current wall-clock time as a 24-hour "HH:mm" / "HH:mm:ss" string.
 */
export function getSystemTime({ seconds = false } = {}) {
  const d = new Date();
  return seconds ? `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}` : `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}
