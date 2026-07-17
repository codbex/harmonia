import { findAncestorState } from '../common/ancestor';
import { createCalendarWidget, forwardCalendarNavAria, parseDateValue, toDateString } from '../common/calendar';
import { eventInsidePicker, setupPopover, setupTrigger } from '../common/picker-popover';
import { disabledControlClasses, pickerCellWrapperClasses, pickerFieldWrapperClasses, pickerWrapperClasses } from '../common/shared-classes';
import { dayPeriodLabels, formatTimeDisplay, getSelectedTime, getSystemTime, pad2, partsToValue24 } from '../common/time';
import uuidv4 from '../utils/uuid';
import { sizeObserver } from './../common/input-size';

const segmentClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'min-w-8',
  'h-full',
  'tabular-nums',
  'outline-none',
  'cursor-default',
  'select-none',
  'transition-[color,box-shadow]',
  'first:rounded-l-control',
  'last:rounded-r-control',
  'motion-reduce:transition-none',
  'hover:bg-secondary-hover',
  'hover:text-secondary-foreground',
  'focus:bg-secondary-hover',
  'focus:text-secondary-foreground',
  'focus-visible:inset-ring-ring/50',
  'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
];

// Numeric segments are real inputs (with inputmode="numeric") so that typing
// digits works and mobile shows the number keyboard. The caret is hidden so they
// still read as segments rather than free text fields.
const numberSegmentClasses = [
  'w-8',
  'h-full',
  'text-center',
  'tabular-nums',
  'bg-transparent',
  'caret-transparent',
  'outline-none',
  'select-none',
  'transition-[color,box-shadow]',
  'first:rounded-l-control',
  'last:rounded-r-control',
  'motion-reduce:transition-none',
  'hover:bg-secondary-hover',
  'hover:text-secondary-foreground',
  'focus:bg-secondary-hover',
  'focus:text-secondary-foreground',
  'focus-visible:inset-ring-ring/50',
  'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
];

export default function (Alpine) {
  Alpine.directive('h-datetime-picker', (el, { original, modifiers }, { Alpine, cleanup }) => {
    const state = Alpine.reactive({ expanded: false });
    el._h_datetimepicker = {
      id: undefined,
      controls: `hdtpc${uuidv4()}`,
      input: undefined,
      state,
      inTable: modifiers.includes('table'),
    };
    el._h_datetimepicker.input = el.querySelector('input');
    if (!el._h_datetimepicker.input || el._h_datetimepicker.input.tagName !== 'INPUT') {
      throw new Error(`${original} must contain an input`);
    } else if (el._h_datetimepicker.input.hasAttribute('id')) {
      el._h_datetimepicker.id = el._h_datetimepicker.input.getAttribute('id');
    } else {
      const id = `hdtp${uuidv4()}`;
      el._h_datetimepicker.input.setAttribute('id', id);
      el._h_datetimepicker.id = id;
    }

    el.classList.add(...pickerWrapperClasses);
    if (el._h_datetimepicker.inTable) {
      el.classList.add(...pickerCellWrapperClasses);
      el.setAttribute('data-slot', 'cell-input-datetime');
    } else {
      el.classList.add(...pickerFieldWrapperClasses);
      el.setAttribute('data-slot', 'datetime-picker');
    }

    el._h_datetimepicker.input.classList.add(
      'bg-transparent',
      'outline-none',
      'size-full',
      'pr-1',
      'border-input',
      'aria-invalid:border-negative',
      'user-invalid:border-negative',
      '[[data-validate=immediate]_&:invalid]:border-negative',
      'focus-visible:ring-0',
      ...disabledControlClasses,
      'disabled:cursor-not-allowed',
      'md:text-sm',
      'text-base',
      'truncate'
    );
    if (el._h_datetimepicker.inTable) {
      // The input-to-trigger divider shows only when the table has horizontal borders.
      el._h_datetimepicker.input.classList.add('min-w-0', '[table[data-borders=rows]_&]:border-r', '[table[data-borders=both]_&]:border-r');
    } else {
      el._h_datetimepicker.input.classList.add('border-r');
    }
    el._h_datetimepicker.input.setAttribute('aria-autocomplete', 'none');
    el._h_datetimepicker.input.setAttribute('type', 'text');

    // The main field is display-only; the date is chosen in the calendar and the
    // time in the in-popup segmented editor.
    const preventInput = (event) => event.preventDefault();
    el._h_datetimepicker.input.addEventListener('beforeinput', preventInput);
    el._h_datetimepicker.input.addEventListener('paste', preventInput);

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
      el._h_datetimepicker.input.removeEventListener('beforeinput', preventInput);
      el._h_datetimepicker.input.removeEventListener('paste', preventInput);
    });
  });

  Alpine.directive('h-datetime-picker-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    const picker = findAncestorState(Alpine, el, '_h_datetimepicker');
    if (!picker) {
      throw new Error(`${original} must be inside an datetime-picker element`);
    }
    setupTrigger(el, {
      pickerState: picker._h_datetimepicker,
      Alpine,
      effect,
      cleanup,
      original,
      slot: 'datetime-picker-trigger',
      // Any click inside the picker (a day, a time segment, the Now button) keeps
      // the popover open; only an outside click closes it.
      stayOpenInside: (event) => eventInsidePicker(picker, event),
    });
  });

  Alpine.directive('h-datetime-picker-popup', (el, { original, expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    const picker = findAncestorState(Alpine, el, '_h_datetimepicker');
    if (!picker) {
      console.warn(`${original}: must be used inside an x-h-datetime-picker element`);
      return;
    }

    const { input } = picker._h_datetimepicker;
    const model = Object.prototype.hasOwnProperty.call(el, '_x_model') ? el._x_model : null;

    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'datetime-picker-calendar');

    // Time state.
    let is12Hour = false;
    let seconds = false;
    let secondsExplicit = false;
    const parts = { hour: null, minute: null, second: null, period: null };
    // Per-segment digit buffer for native-style typed entry; reset when a segment
    // gains focus so each visit starts fresh.
    const typeBuffers = { hour: '', minute: '', second: '' };
    let lastModelValue = '';

    // The calendar lives on its own child element so the widget never reads or
    // writes el._x_model (which holds the ISO datetime, not a bare date).
    const calendarEl = document.createElement('div');
    calendarEl.classList.add('vbox');
    el.appendChild(calendarEl);
    // Forward the popup's calendar nav labels onto the calendar element so the widget's
    // prev/next month/year buttons can be localized. Without this they fall back to English.
    forwardCalendarNavAria(el, calendarEl);

    const widget = createCalendarWidget('x-h-datetime-picker-popup', calendarEl, {
      Alpine,
      onSelectionChanged: () => combineAndWrite(),
      onEscape: () => {
        picker._h_datetimepicker.state.expanded = false;
      },
      onInvalidModel: () => {},
      onModelValid: () => {},
      stopNavPropagation: true,
      tableFullWidth: false,
    });

    // --- Segmented time editor ---

    const timeRow = document.createElement('div');
    timeRow.classList.add('flex', 'items-center', 'justify-between', 'gap-2', 'border-t', 'border-border', 'pt-2');
    const segGroup = document.createElement('div');
    segGroup.setAttribute('role', 'group');
    segGroup.setAttribute('aria-label', el.getAttribute('data-label-time') || 'Time');
    segGroup.classList.add('h-8', 'overflow-hidden', 'inline-flex', 'items-center', 'text-sm', 'border', 'border-input', 'bg-input-inner', 'rounded-control', 'outline-none');
    const nowButton = document.createElement('button');
    nowButton.setAttribute('type', 'button');
    nowButton.textContent = el.getAttribute('data-label-now') || 'Now';
    nowButton.setAttribute(Alpine.prefixed('h-button'), '');
    nowButton.setAttribute('data-size', 'md');
    Alpine.initTree(nowButton);
    timeRow.append(segGroup, nowButton);
    el.appendChild(timeRow);

    const segmentEls = {};
    let orderedSegments = [];

    function hourRange() {
      return is12Hour ? [1, 12] : [0, 23];
    }

    function makeNumberSegment(type, label) {
      const seg = document.createElement('input');
      seg.setAttribute('type', 'text');
      seg.setAttribute('inputmode', 'numeric');
      seg.setAttribute('autocomplete', 'off');
      seg.setAttribute('autocorrect', 'off');
      seg.setAttribute('spellcheck', 'false');
      seg.setAttribute('role', 'spinbutton');
      seg.setAttribute('tabindex', '0');
      seg.setAttribute('data-part', type);
      seg.setAttribute('aria-label', label);
      seg.classList.add(...numberSegmentClasses);
      return seg;
    }

    function makePeriodSegment(label) {
      const seg = document.createElement('span');
      seg.setAttribute('role', 'spinbutton');
      seg.setAttribute('tabindex', '0');
      seg.setAttribute('data-part', 'period');
      seg.setAttribute('aria-label', label);
      seg.classList.add(...segmentClasses);
      return seg;
    }

    // Inputs hold their value in `.value`; the period span uses textContent.
    function writeSeg(seg, text) {
      if (seg.tagName === 'INPUT') seg.value = text;
      else seg.textContent = text;
    }

    function makeSeparator(ch) {
      const sep = document.createElement('span');
      sep.setAttribute('aria-hidden', 'true');
      sep.classList.add('select-none', 'text-muted-foreground');
      sep.textContent = ch;
      return sep;
    }

    function buildSegments() {
      segGroup.replaceChildren();
      orderedSegments = [];
      for (const key of Object.keys(segmentEls)) delete segmentEls[key];

      segmentEls.hour = makeNumberSegment('hour', el.getAttribute('data-label-hours') || 'Hour');
      segGroup.appendChild(segmentEls.hour);
      segGroup.appendChild(makeSeparator(':'));
      segmentEls.minute = makeNumberSegment('minute', el.getAttribute('data-label-minutes') || 'Minute');
      segGroup.appendChild(segmentEls.minute);
      if (seconds) {
        segGroup.appendChild(makeSeparator(':'));
        segmentEls.second = makeNumberSegment('second', el.getAttribute('data-label-seconds') || 'Second');
        segGroup.appendChild(segmentEls.second);
      }
      if (is12Hour) {
        segGroup.appendChild(makeSeparator(' '));
        segmentEls.period = makePeriodSegment(el.getAttribute('data-label-meridiem') || 'AM/PM');
        segGroup.appendChild(segmentEls.period);
      }
      orderedSegments = [segmentEls.hour, segmentEls.minute, segmentEls.second, segmentEls.period].filter(Boolean);
      renderSegments();
    }

    function setSeg(seg, type) {
      if (!seg) return;
      if (type === 'period') {
        writeSeg(seg, parts.period ?? '--');
        seg.setAttribute('aria-valuemin', '0');
        seg.setAttribute('aria-valuemax', '1');
        seg.setAttribute('aria-valuenow', parts.period === dayPeriodLabels.pm ? '1' : '0');
        seg.setAttribute('aria-valuetext', parts.period ?? 'empty');
        return;
      }
      const [min, max] = type === 'hour' ? hourRange() : [0, 59];
      const value = parts[type];
      writeSeg(seg, value ?? '--');
      seg.setAttribute('aria-valuemin', String(min));
      seg.setAttribute('aria-valuemax', String(max));
      if (value != null) {
        seg.setAttribute('aria-valuenow', String(parseInt(value, 10)));
        seg.setAttribute('aria-valuetext', value);
      } else {
        seg.removeAttribute('aria-valuenow');
        seg.setAttribute('aria-valuetext', 'empty');
      }
    }

    function renderSegments() {
      setSeg(segmentEls.hour, 'hour');
      setSeg(segmentEls.minute, 'minute');
      setSeg(segmentEls.second, 'second');
      setSeg(segmentEls.period, 'period');
    }

    function stepValue(type, delta) {
      if (type === 'period') {
        parts.period = parts.period === dayPeriodLabels.am ? dayPeriodLabels.pm : dayPeriodLabels.am;
        return;
      }
      const [min, max] = type === 'hour' ? hourRange() : [0, 59];
      const current = parts[type] == null ? null : parseInt(parts[type], 10);
      let next;
      if (current == null) {
        next = delta > 0 ? min : max;
      } else {
        next = current + delta;
        if (next > max) next = min;
        if (next < min) next = max;
      }
      parts[type] = pad2(next);
    }

    function setExtreme(type, edge) {
      if (type === 'period') {
        parts.period = edge === 'min' ? dayPeriodLabels.am : dayPeriodLabels.pm;
        return;
      }
      const [min, max] = type === 'hour' ? hourRange() : [0, 59];
      parts[type] = pad2(edge === 'min' ? min : max);
    }

    function focusSibling(seg, delta) {
      const index = orderedSegments.indexOf(seg);
      const target = orderedSegments[index + delta];
      if (target) target.focus();
    }

    // Apply a typed digit to a numeric segment, native-style: accumulate up to two
    // digits, restart when the running value would exceed the max, and report when
    // the segment is "full" so focus can auto-advance to the next one.
    function typeDigit(type, digitChar) {
      const [min, max] = type === 'hour' ? hourRange() : [0, 59];
      let candidate = (typeBuffers[type] || '') + digitChar;
      let value = parseInt(candidate, 10);
      if (isNaN(value) || value > max) {
        candidate = digitChar;
        value = parseInt(candidate, 10);
      }
      const advance = candidate.length >= 2 || value * 10 > max;
      if (advance && value < min) value = min;
      parts[type] = pad2(value);
      typeBuffers[type] = advance ? '' : candidate;
      return advance;
    }

    function clearSegment(type) {
      if (type === 'period') {
        parts.period = null;
        return;
      }
      parts[type] = null;
      typeBuffers[type] = '';
    }

    function currentTime24() {
      if (parts.hour == null || parts.minute == null) return null;
      if (is12Hour && parts.period == null) return null;
      if (seconds && parts.second == null) return null;
      return partsToValue24(parts, { is12Hour, seconds });
    }

    function mainDisplay(date, time24) {
      const dateStr = date ? widget.formatSelectedDate() : '';
      const timeStr = time24 ? formatTimeDisplay(time24, { is12Hour, seconds }) : '';
      if (dateStr && timeStr) return `${dateStr} ${timeStr}`;
      return dateStr || timeStr || '';
    }

    function combineAndWrite() {
      const date = widget.getSelected();
      const time24 = currentTime24();
      const value = date && time24 ? `${toDateString(date)}T${time24}` : '';
      input.value = mainDisplay(date, time24);
      const changed = value !== lastModelValue;
      lastModelValue = value;
      if (model) model.set(value);
      if (changed) input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function onTimeKeydown(event) {
      if (event.key === 'Escape') {
        picker._h_datetimepicker.state.expanded = false;
        return;
      }
      const type = event.target.dataset && event.target.dataset.part;
      if (!type) return;
      switch (event.key) {
        case 'Up':
        case 'ArrowUp':
          event.preventDefault();
          stepValue(type, 1);
          renderSegments();
          combineAndWrite();
          break;
        case 'Down':
        case 'ArrowDown':
          event.preventDefault();
          stepValue(type, -1);
          renderSegments();
          combineAndWrite();
          break;
        case 'Home':
          event.preventDefault();
          setExtreme(type, 'min');
          renderSegments();
          combineAndWrite();
          break;
        case 'End':
          event.preventDefault();
          setExtreme(type, 'max');
          renderSegments();
          combineAndWrite();
          break;
        case 'Left':
        case 'ArrowLeft':
          event.preventDefault();
          focusSibling(event.target, -1);
          break;
        case 'Right':
        case 'ArrowRight':
          event.preventDefault();
          focusSibling(event.target, 1);
          break;
        default: {
          // The AM/PM segment is not an editable input, so handle its typing
          // (a/p) and clearing here. Numeric segments receive digits through the
          // beforeinput handler so the mobile number keyboard works.
          if (type !== 'period') return;
          const k = event.key.toLowerCase();
          if (k === 'a' || k === 'p') {
            event.preventDefault();
            parts.period = k === 'a' ? dayPeriodLabels.am : dayPeriodLabels.pm;
          } else if (event.key === 'Backspace' || event.key === 'Delete') {
            event.preventDefault();
            clearSegment('period');
          } else {
            return;
          }
          renderSegments();
          combineAndWrite();
          break;
        }
      }
      event.stopPropagation();
    }
    segGroup.addEventListener('keydown', onTimeKeydown);

    // Typed digit entry on the numeric segments. Using beforeinput (rather than
    // keydown) means it works with mobile virtual keyboards, where keydown is
    // unreliable. The native insertion is prevented; we apply our own logic.
    function onSegInput(event) {
      const type = event.target.dataset && event.target.dataset.part;
      if (!type || type === 'period') return;
      event.preventDefault();
      if (event.inputType && event.inputType.indexOf('delete') === 0) {
        clearSegment(type);
        renderSegments();
        combineAndWrite();
        return;
      }
      let advance = false;
      for (const ch of event.data || '') {
        if (/[0-9]/.test(ch)) advance = typeDigit(type, ch);
      }
      renderSegments();
      combineAndWrite();
      if (advance) focusSibling(event.target, 1);
    }
    segGroup.addEventListener('beforeinput', onSegInput);

    // Start each segment visit with a clean digit buffer.
    function onSegFocusIn(event) {
      const type = event.target.dataset && event.target.dataset.part;
      if (type && typeBuffers[type] !== undefined) typeBuffers[type] = '';
    }
    segGroup.addEventListener('focusin', onSegFocusIn);

    // Tapping the AM/PM segment toggles it (no keyboard needed on touch).
    function onSegClick(event) {
      const type = event.target.dataset && event.target.dataset.part;
      if (type !== 'period') return;
      stepValue('period', 1);
      renderSegments();
      combineAndWrite();
    }
    segGroup.addEventListener('click', onSegClick);

    function onNow() {
      const today = new Date();
      const seeded = getSelectedTime(getSystemTime({ seconds }), is12Hour);
      parts.hour = seeded.hour;
      parts.minute = seeded.minute;
      parts.second = seconds ? (seeded.second ?? '00') : null;
      parts.period = is12Hour ? seeded.period : null;
      renderSegments();
      widget.setSelectedAndSync(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
      widget.render();
      combineAndWrite();
    }
    nowButton.addEventListener('click', onNow);

    // --- Config + model ---

    function applyConfig(config) {
      const cfg = config || {};
      widget.setConfig(cfg);
      is12Hour = !!cfg.is12Hour;
      if (cfg.seconds !== undefined) {
        secondsExplicit = true;
        seconds = !!cfg.seconds;
      }
      buildSegments();
    }

    if (expression) {
      const getConfig = evaluateLater(expression);
      effect(() => {
        getConfig((config) => applyConfig(config));
      });
    } else {
      applyConfig({});
    }

    function applyModel(value) {
      const incoming = value || '';
      if (incoming === lastModelValue) return;
      lastModelValue = incoming;

      if (!incoming) {
        widget.clearSelected();
        parts.hour = parts.minute = parts.second = parts.period = null;
        renderSegments();
        input.value = '';
        return;
      }

      const tIndex = String(incoming).indexOf('T');
      const datePart = tIndex >= 0 ? incoming.slice(0, tIndex) : incoming;
      const timePart = tIndex >= 0 ? incoming.slice(tIndex + 1) : '';

      if (!secondsExplicit && !seconds && timePart && timePart.split(':').length === 3) {
        seconds = true;
        buildSegments();
      }

      if (timePart) {
        const seeded = getSelectedTime(timePart, is12Hour);
        parts.hour = seeded.hour;
        parts.minute = seeded.minute;
        parts.second = seconds ? (seeded.second ?? '00') : null;
        parts.period = is12Hour ? seeded.period : null;
      }
      renderSegments();

      if (datePart) {
        const date = parseDateValue(datePart);
        if (!isNaN(date)) {
          widget.setSelectedAndSync(date);
          widget.render();
        }
      }

      input.value = mainDisplay(widget.getSelected(), currentTime24());
    }

    if (model) {
      const evaluateModel = evaluateLater(el.getAttribute('x-model'));
      effect(() => {
        evaluateModel((value) => applyModel(value));
      });
    }

    setupPopover(el, {
      anchor: picker,
      pickerState: picker._h_datetimepicker,
      Alpine,
      effect,
      cleanup,
      onOpen: () => widget.focusDay(),
    });

    cleanup(() => {
      widget.cleanup();
      Alpine.destroyTree(nowButton);
      segGroup.removeEventListener('keydown', onTimeKeydown);
      segGroup.removeEventListener('beforeinput', onSegInput);
      segGroup.removeEventListener('focusin', onSegFocusIn);
      segGroup.removeEventListener('click', onSegClick);
      nowButton.removeEventListener('click', onNow);
    });
  });
}
