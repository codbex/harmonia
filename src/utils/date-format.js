// Locale-aware date string formatting / parsing, extracted from the calendar
// widget so the date picker, date-time picker and the `x-h-date-format`
// directive can all share one implementation.

export const dateOrderMap = { Y: 'year', M: 'month', D: 'day' };

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
// Invisible directional marks (e.g. the U+200F RTL mark some locales add) and
// odd spaces (NBSP / narrow NBSP) must be stripped so regexes match user input.
const BIDI_MARKS = /[\u200E\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
const ODD_SPACES = /[\u00A0\u202F]/g;
const REGEX_SPECIALS = /[.*+?^${}()|[\]\\]/g;

function isoDateToParts(value) {
  const iso = ISO_DATE.exec(value);
  return iso ? new Date(parseInt(iso[1]), parseInt(iso[2]) - 1, parseInt(iso[3])) : null;
}

/**
 * Coerce an arbitrary model value into a `Date`. Accepts a `Date`, a timestamp,
 * an ISO `YYYY-MM-DD` string (parsed without timezone drift) or anything the
 * `Date` constructor understands. Returns `undefined` for empty input.
 */
export function toDate(value) {
  if (value === null || value === undefined || value === '') return undefined;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  return isoDateToParts(String(value)) ?? new Date(value);
}

/**
 * Build a reusable date formatter/parser bound to a locale and display options.
 *
 * @param {{
 *   locale?: string,
 *   options?: Intl.DateTimeFormatOptions,
 *   delimiter?: string,        // override the locale's field separator
 *   order?: string,            // field order as a 'Y'/'M'/'D' string, e.g. 'DMY'
 *   rangeSeparator?: string,   // string between start/end in range output (default ' - ')
 * }} [config]
 * @returns {{
 *   format: (date: Date) => string,
 *   parse: (value: string) => Date,
 *   formatRange: (start?: Date, end?: Date) => string|undefined,
 *   parseRange: (value: string) => { start: Date, end?: Date },
 *   rangeSeparator: string,
 *   locale: string|undefined,
 *   formatter: Intl.DateTimeFormat,
 * }}
 */
export function createDateFormatter(config = {}) {
  const locale = config.locale || undefined;
  const delimiter = config.delimiter;
  const order = config.order;
  const rangeSeparator = config.rangeSeparator !== undefined ? config.rangeSeparator : ' - ';
  const formatter = config.options ? new Intl.DateTimeFormat(locale, config.options) : new Intl.DateTimeFormat(locale);

  let inputParser = null;
  let digitNormalizer = null;

  function fieldOrderFromParts(parts) {
    return order ? [...order].map((c) => dateOrderMap[c]) : parts.filter((p) => p.type === 'year' || p.type === 'month' || p.type === 'day').map((p) => p.type);
  }

  function buildInputParser() {
    const probe = new Date(2001, 2, 5);
    const parts = formatter.formatToParts(probe);

    // Non-Gregorian calendars (e.g. Solar Hijri for fa-IR) require calendar conversion -
    // skip the parser and fall back to new Date(), which browsers handle better.
    const { calendar: resolvedCalendar, locale: resolvedLocale } = formatter.resolvedOptions();
    if (resolvedCalendar !== 'gregory' && resolvedCalendar !== 'iso8601') {
      inputParser = null;
      digitNormalizer = null;
      return;
    }

    // Build a digit normalizer for locales that use non-ASCII numerals (e.g. Arabic-Indic for ar-SA).
    const nf = new Intl.NumberFormat(resolvedLocale);
    if (nf.format(1) !== '1') {
      const digitMap = {};
      for (let i = 0; i <= 9; i++) digitMap[nf.format(i)] = String(i);
      digitNormalizer = (str) => str.replace(/./gu, (c) => digitMap[c] ?? c);
    }

    const monthPart = parts.find((p) => p.type === 'month');
    const normalizedMonth = monthPart ? (digitNormalizer ? digitNormalizer(monthPart.value) : monthPart.value) : null;
    if (normalizedMonth && !/^\d/.test(normalizedMonth)) {
      inputParser = null;
      return;
    }

    if (order === undefined && delimiter === undefined) {
      // Default: iterate all parts so locale prefix/suffix literals are included in the regex.
      let regexStr = '^';
      const fieldOrder = [];
      for (const part of parts) {
        if (part.type === 'year') {
          regexStr += '(\\d{2,4})';
          fieldOrder.push('year');
        } else if (part.type === 'month') {
          regexStr += '(\\d{1,2})';
          fieldOrder.push('month');
        } else if (part.type === 'day') {
          regexStr += '(\\d{1,2})';
          fieldOrder.push('day');
        } else if (part.type === 'literal') {
          const normalized = part.value.replace(BIDI_MARKS, '').replace(ODD_SPACES, ' ');
          if (normalized) regexStr += normalized.replace(REGEX_SPECIALS, '\\$&');
        }
      }
      inputParser = fieldOrder.length === 3 ? { regex: new RegExp(regexStr + '$'), fieldOrder } : null;
      return;
    }

    // Custom order or delimiter: format() strips locale prefix/suffix, so regex needs only fields + sep.
    const sep = delimiter !== undefined ? delimiter : (parts.find((p) => p.type === 'literal')?.value ?? '');
    const fieldOrder = fieldOrderFromParts(parts);
    if (fieldOrder.length !== 3 || fieldOrder.some((f) => f === undefined)) {
      inputParser = null;
      return;
    }

    const escapedSep = sep.replace(REGEX_SPECIALS, '\\$&');
    const regexStr = '^' + fieldOrder.map((f) => (f === 'year' ? '(\\d{2,4})' : '(\\d{1,2})')).join(escapedSep) + '$';
    inputParser = { regex: new RegExp(regexStr), fieldOrder };
  }

  function format(d) {
    if (delimiter === undefined && order === undefined) return formatter.format(d);

    const parts = formatter.formatToParts(d);
    const sep = delimiter !== undefined ? delimiter : (parts.find((p) => p.type === 'literal')?.value ?? '');
    const fieldValues = {};
    for (const p of parts) {
      if (p.type === 'year' || p.type === 'month' || p.type === 'day') fieldValues[p.type] = p.value;
    }
    return fieldOrderFromParts(parts)
      .map((f) => fieldValues[f])
      .join(sep);
  }

  function parse(value) {
    const iso = isoDateToParts(value);
    if (iso) return iso;
    if (inputParser) {
      let normalized = digitNormalizer ? digitNormalizer(value) : value;
      normalized = normalized.replace(BIDI_MARKS, '').replace(ODD_SPACES, ' ');
      const match = inputParser.regex.exec(normalized);
      if (match) {
        const fields = {};
        inputParser.fieldOrder.forEach((field, i) => {
          fields[field] = parseInt(match[i + 1]);
        });
        const year = fields.year < 100 ? 2000 + fields.year : fields.year;
        return new Date(year, fields.month - 1, fields.day);
      }
    }
    return new Date(value);
  }

  function formatRange(start, end) {
    if (!start) return undefined;
    return end ? `${format(start)}${rangeSeparator}${format(end)}` : format(start);
  }

  function parseRange(value) {
    const parts = String(value).split(rangeSeparator);
    const start = parse((parts[0] ?? '').trim());
    const end = parts.length > 1 ? parse((parts[1] ?? '').trim()) : undefined;
    return { start, end };
  }

  buildInputParser();

  return { format, parse, formatRange, parseRange, rangeSeparator, locale, formatter };
}

/**
 * `x-h-date-format` - render a date value (or the element's own text content)
 * as a locale-aware date string into the element's text content.
 *
 * - Value source: the directive expression (a `Date`, timestamp, ISO string, or
 *   `{ start, end }` when `data-range="true"`); when there is no expression the
 *   element's current text content is used as the source value.
 * - Formatting is configured with `data-locale`, `data-order` (e.g. `DMY`),
 *   `data-delimiter`, `data-range`, `data-range-separator` and `data-options`
 *   (a JSON `Intl.DateTimeFormat` options object). Changing any of these
 *   re-renders.
 */
export default function (Alpine) {
  Alpine.directive('h-date-format', (el, { expression }, { effect, evaluateLater, cleanup }) => {
    const sourceText = expression ? null : el.textContent.trim();
    const getValue = expression ? evaluateLater(expression) : null;
    let formatter = build();

    function build() {
      const config = {};
      const locale = el.getAttribute('data-locale');
      if (locale) config.locale = locale;
      const order = el.getAttribute('data-order');
      if (order) config.order = order;
      if (el.hasAttribute('data-delimiter')) config.delimiter = el.getAttribute('data-delimiter');
      if (el.hasAttribute('data-range-separator')) config.rangeSeparator = el.getAttribute('data-range-separator');
      const options = el.getAttribute('data-options');
      if (options) {
        try {
          config.options = JSON.parse(options);
        } catch {
          console.error('x-h-date-format: data-options must be a valid JSON object');
        }
      }
      return createDateFormatter(config);
    }

    function valid(d) {
      return d && !isNaN(d) ? d : undefined;
    }

    function render(value) {
      let out;
      if (el.getAttribute('data-range') === 'true') {
        const { start, end } = value || {};
        const validStart = valid(toDate(start));
        out = validStart ? (formatter.formatRange(validStart, valid(toDate(end))) ?? '') : '';
        el.removeAttribute('datetime');
      } else {
        const d = valid(toDate(value));
        out = d ? formatter.format(d) : '';
        // Keep a machine-readable value on <time> elements.
        if (el.tagName === 'TIME') {
          if (d) el.setAttribute('datetime', `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
          else el.removeAttribute('datetime');
        }
      }
      el.textContent = out;
    }

    function refresh() {
      if (getValue) getValue((value) => render(value));
      else render(sourceText);
    }

    if (getValue) effect(() => getValue((value) => render(value)));
    else refresh();

    // Re-render when any formatting attribute changes.
    const observer = new MutationObserver(() => {
      formatter = build();
      refresh();
    });
    observer.observe(el, {
      attributes: true,
      attributeFilter: ['data-locale', 'data-order', 'data-delimiter', 'data-range', 'data-range-separator', 'data-options'],
    });

    cleanup(() => observer.disconnect());
  });
}
