import { findAncestorState } from '../common/ancestor';
import { disabledControlClasses, disabledInputClasses, invalidInputClasses, userInvalidInputClasses } from '../common/shared-classes';
import { isPrintableCharacter } from '../common/typeahead';

const CHARSETS = {
  numeric: /^[0-9]$/,
  alphanumeric: /^[0-9a-zA-Z]$/,
};

export default function (Alpine) {
  Alpine.directive('h-otp', (el, { original }, { Alpine, effect, cleanup }) => {
    // The consumer-authored native input carries the value into forms and,
    // like the other form components, holds the disabled and aria-invalid
    // state plus any constraints or custom validity.
    const input = Array.from(el.children).find((child) => child.tagName === 'INPUT');
    if (!input) {
      throw new Error(`${original} must contain a native input element as a direct child`);
    }
    if (input.type === 'hidden') console.warn(`${original}: use a text input, type="hidden" is excluded from form validation`);

    const type = el.getAttribute('data-type') === 'alphanumeric' ? 'alphanumeric' : 'numeric';
    const charset = CHARSETS[type];
    const masked = el.hasAttribute('data-mask');

    // The model lives on the native input, so x-model is bound there. Without
    // one, the input's own value is the source of truth.
    const fallbackModel = {
      get: () => input.value,
      set: (value) => {
        input.value = value;
      },
    };
    // x-model initialises on the child input after this handler has run
    // (Alpine walks the parent first), so the model is resolved on every
    // access rather than captured here.
    const model = () => (Object.prototype.hasOwnProperty.call(input, '_x_model') ? input._x_model : fallbackModel);

    const isDisabled = () => input.disabled;
    const isReadonly = () => input.readOnly;

    function normalizeChar(raw) {
      if (!raw) return '';
      return charset.test(raw) ? raw : '';
    }

    // Cells register themselves as their groups initialise, so the length is
    // only known once that has settled.
    const cells = Alpine.reactive([]);
    const state = Alpine.reactive({ size: el.getAttribute('data-size') === 'sm' ? 'sm' : 'default' });

    function readChars() {
      return cells.map((cell) => normalizeChar(cell.value));
    }

    function writeChars(chars) {
      cells.forEach((cell, index) => {
        const char = chars[index] || '';
        cell.value = char;
        cell.setAttribute('data-filled', char ? 'true' : 'false');
      });
    }

    function charsFromString(raw) {
      const chars = new Array(cells.length).fill('');
      let index = 0;
      for (const char of raw == null ? '' : String(raw)) {
        if (index >= cells.length) break;
        // Skip characters outside the charset instead of stopping, so a pasted
        // "123-456" or a model value with spaces still lands correctly.
        const normalized = normalizeChar(char);
        if (normalized) chars[index++] = normalized;
      }
      return chars;
    }

    el.classList.add('relative', 'flex', 'items-center', 'gap-2', ...disabledInputClasses);
    el.setAttribute('data-slot', 'otp');
    el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', 'One-time password');
    }

    // The input stays validatable but invisible. "display:none" would stop the
    // browser from focusing it on a failed submit.
    input.setAttribute('data-slot', 'otp-input');
    input.classList.add('absolute', 'inset-0', 'opacity-0', 'pointer-events-none');
    input.setAttribute('tabindex', '-1');
    input.setAttribute('aria-hidden', 'true');

    function dispatch(type_) {
      // Dispatched on the native input so Alpine's x-model listener, which is
      // bound there, picks the new value up.
      input.dispatchEvent(new Event(type_, { bubbles: true }));
    }

    // aria-invalid mirroring. The hidden input is not announced, so the
    // focusable cells carry it. An explicit aria-invalid on the input is owned
    // by the consumer and wins over tracked native validity.
    let nativeInvalid = false;
    function renderInvalid() {
      const explicit = input.getAttribute('aria-invalid');
      const invalid = explicit != null ? explicit : nativeInvalid ? 'true' : null;
      for (const cell of cells) {
        if (invalid == null) cell.removeAttribute('aria-invalid');
        else cell.setAttribute('aria-invalid', invalid);
      }
    }
    // :user-invalid is not observable from JS, so only clear on valid or set
    // when an ancestor opted into immediate validation. The invalid event
    // below covers the submit-attempt case.
    function syncValidity() {
      if (input.validity.valid) nativeInvalid = false;
      else if (el.closest('[data-validate=immediate]')) nativeInvalid = true;
      renderInvalid();
    }
    const onInvalid = () => {
      nativeInvalid = true;
      renderInvalid();
    };
    input.addEventListener('invalid', onInvalid);

    function focusCell(index) {
      if (!cells.length) return;
      const clamped = Math.min(cells.length - 1, Math.max(0, index));
      const cell = cells[clamped];
      cell.focus({ preventScroll: true });
      // Select so the next character overwrites rather than appends.
      cell.select();
    }

    let completed = false;
    function maybeComplete(chars) {
      const full = cells.length > 0 && chars.every((char) => char !== '');
      if (full && !completed) {
        completed = true;
        el.dispatchEvent(new CustomEvent('complete', { detail: { value: chars.join('') }, bubbles: true }));
      } else if (!full) {
        completed = false;
      }
    }

    function commit(chars) {
      const value = chars.join('');
      if (value === model().get() && value === input.value) {
        writeChars(chars);
        return false;
      }
      writeChars(chars);
      model().set(value);
      // Keep the input's own value in step when the model is external.
      if (input.value !== value) input.value = value;
      dispatch('input');
      // After dispatch, so a consumer input handler calling setCustomValidity
      // on the native input has already run.
      syncValidity();
      return true;
    }

    // Fills forward from `start`, skipping characters outside the charset (so
    // "123-456" and "Your code is 482913" both work), then dispatches a single
    // input/change pair for the whole batch.
    function distribute(text, start) {
      const chars = readChars();
      let index = start;
      for (const raw of String(text)) {
        if (index >= cells.length) break;
        const char = normalizeChar(raw);
        if (!char) continue;
        chars[index++] = char;
      }
      if (index === start) return;
      if (commit(chars)) dispatch('change');
      // Land on the first still-empty cell, or the last cell when full.
      const next = chars.indexOf('');
      focusCell(next === -1 ? cells.length - 1 : next);
      maybeComplete(chars);
    }

    function setCharAt(index, char) {
      const chars = readChars();
      chars[index] = char;
      if (commit(chars)) dispatch('change');
      maybeComplete(chars);
      return chars;
    }

    function applyState() {
      const disabled = isDisabled();
      const readonly = isReadonly();
      for (const cell of cells) {
        cell.disabled = disabled;
        cell.readOnly = readonly;
        if (input.required) cell.setAttribute('aria-required', 'true');
        else cell.removeAttribute('aria-required');
      }
      syncValidity();
    }

    const cellLabelTemplate = el.getAttribute('data-cell-label') || (type === 'numeric' ? 'Digit {index} of {length}' : 'Character {index} of {length}');

    // Cells are labelled with their position in the whole code, which is only
    // known once every group has registered.
    let labelsQueued = false;
    function labelCells() {
      labelsQueued = false;
      cells.forEach((cell, index) => {
        cell.setAttribute('data-index', String(index));
        // Only the first cell advertises the SMS code, so the platform offers
        // the suggestion once instead of on every cell.
        cell.setAttribute('autocomplete', index === 0 ? 'one-time-code' : 'off');
        cell.setAttribute('aria-label', cellLabelTemplate.replace('{index}', String(index + 1)).replace('{length}', String(cells.length)));
      });
    }

    el._h_otp = {
      state,
      type,
      masked,
      cells,
      queueLabels() {
        if (labelsQueued) return;
        labelsQueued = true;
        queueMicrotask(labelCells);
      },
      isDisabled,
      isReadonly,
      normalizeChar,
      readChars,
      focusCell,
      distribute,
      setCharAt,
      maybeComplete,
      register(cell) {
        cells.push(cell);
      },
      unregister(cell) {
        const index = cells.indexOf(cell);
        if (index !== -1) cells.splice(index, 1);
      },
      applyState,
    };

    // Groups have not initialised yet, so the initial value can only be spread
    // across the cells once they have registered.
    let seeded = false;
    const seed = () => {
      if (seeded || !cells.length) return;
      seeded = true;
      const attr = el.getAttribute('data-value');
      const chars = charsFromString(attr != null ? attr : model().get() || input.value);
      writeChars(chars);
      const value = chars.join('');
      input.value = value;
      input.defaultValue = value;
      if (attr != null) model().set(value);
      applyState();
      maybeComplete(chars);
    };
    let destroyed = false;
    queueMicrotask(() => {
      if (destroyed) return;
      seed();
      // Sync from an external model value. Registered after the directive walk
      // so the read below tracks the real x-model, not the fallback.
      effect(() => {
        const raw = model().get();
        if (!cells.length) return;
        const next = charsFromString(raw);
        if (next.join('') === readChars().join('')) return;
        writeChars(next);
        if (input.value !== next.join('')) input.value = next.join('');
        maybeComplete(next);
      });
    });

    const sizeObserver = new MutationObserver(() => {
      state.size = el.getAttribute('data-size') === 'sm' ? 'sm' : 'default';
    });
    sizeObserver.observe(el, { attributes: true, attributeFilter: ['data-size'] });

    const stateObserver = new MutationObserver(applyState);
    stateObserver.observe(input, { attributeFilter: ['disabled', 'readonly', 'required', 'aria-invalid'] });

    // Form reset restores the input's default, then the cells follow it back to
    // their initial characters on the next tick.
    const formEl = input.form;
    let resetTimer;
    const onFormReset = () => {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        const chars = charsFromString(input.defaultValue);
        if (chars.join('') === readChars().join('')) return;
        commit(chars);
        dispatch('change');
        maybeComplete(chars);
      });
    };
    if (formEl) formEl.addEventListener('reset', onFormReset);

    cleanup(() => {
      destroyed = true;
      sizeObserver.disconnect();
      stateObserver.disconnect();
      clearTimeout(resetTimer);
      if (formEl) formEl.removeEventListener('reset', onFormReset);
      input.removeEventListener('invalid', onInvalid);
    });
  });

  Alpine.directive('h-otp-group', (el, { original }, { Alpine, effect, cleanup }) => {
    const root = findAncestorState(Alpine, el, '_h_otp');
    if (!root) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-otp')} element`);
    }
    const otp = root._h_otp;

    let length = parseInt(el.getAttribute('data-length'), 10);
    if (!Number.isInteger(length) || length < 1) {
      console.warn(`${original}: data-length must be a positive integer, falling back to 1`);
      length = 1;
    }

    el.classList.add(
      'flex',
      'items-center',
      'rounded-control',
      'border',
      'border-input',
      'bg-input-inner',
      'shadow-input',
      'overflow-hidden',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      ...invalidInputClasses,
      ...userInvalidInputClasses
    );
    el.setAttribute('data-slot', 'otp-group');

    const owned = [];
    for (let i = 0; i < length; i++) {
      const cell = document.createElement('input');
      cell.setAttribute('type', otp.masked ? 'password' : 'text');
      cell.setAttribute('data-slot', 'otp-cell');
      cell.setAttribute('maxlength', '1');
      cell.setAttribute('inputmode', otp.type === 'numeric' ? 'numeric' : 'text');
      cell.setAttribute('autocorrect', 'off');
      cell.setAttribute('autocapitalize', 'off');
      cell.setAttribute('spellcheck', 'false');
      cell.setAttribute('data-filled', 'false');
      cell.classList.add(
        'h-full',
        'rounded-none',
        'border-0',
        'border-l',
        'first:border-l-0',
        'border-input',
        'bg-transparent',
        'shadow-none',
        'text-center',
        'font-mono',
        'tabular-nums',
        'text-foreground',
        'outline-none',
        'transition-[color,box-shadow]',
        'motion-reduce:transition-none',
        'focus-visible:inset-ring-ring/50',
        'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
        ...disabledControlClasses,
        'disabled:cursor-not-allowed',
        '[&[readonly]]:bg-muted'
      );
      el.appendChild(cell);
      owned.push(cell);
      otp.register(cell);
    }

    // Index within the whole code, not within this group, so labels and the
    // autofill hint stay correct however the cells are split up.
    const indexOf = (cell) => otp.cells.indexOf(cell);

    // The total is only known once every group has registered, so labelling
    // waits for that rather than counting the cells registered so far.
    otp.queueLabels();

    effect(() => {
      const small = otp.state.size === 'sm';
      el.classList.toggle('h-9', !small);
      el.classList.toggle('h-6.5', small);
      for (const cell of owned) {
        cell.classList.toggle('w-9', !small);
        cell.classList.toggle('w-8', small);
        cell.classList.toggle('text-base', !small);
        cell.classList.toggle('text-sm', small);
      }
    });

    let composing = false;

    function handleInput(cell) {
      const index = indexOf(cell);
      if (otp.isDisabled() || otp.isReadonly()) {
        cell.value = otp.readChars()[index] || '';
        return;
      }
      const raw = cell.value;
      if (raw.length > 1) {
        // Autofill or a soft keyboard wrote a whole code into one cell.
        otp.distribute(raw, index);
        return;
      }
      const char = otp.normalizeChar(raw);
      const chars = otp.readChars();
      if (char === chars[index] && cell.value === char) return;
      const updated = otp.setCharAt(index, char);
      if (char && index < otp.cells.length - 1) otp.focusCell(index + 1);
      return updated;
    }

    const listeners = [];
    owned.forEach((cell) => {
      const onKeyDown = (event) => {
        if (otp.isDisabled() || otp.isReadonly()) return;
        const index = indexOf(cell);
        const rtl = getComputedStyle(el).direction === 'rtl';

        switch (event.key) {
          case 'Backspace':
            event.preventDefault();
            if (otp.readChars()[index]) {
              otp.setCharAt(index, '');
            } else if (index > 0) {
              otp.setCharAt(index - 1, '');
              otp.focusCell(index - 1);
            }
            return;
          case 'Delete':
            event.preventDefault();
            if (otp.readChars()[index]) otp.setCharAt(index, '');
            return;
          case 'ArrowLeft':
            event.preventDefault();
            otp.focusCell(rtl ? index + 1 : index - 1);
            return;
          case 'ArrowRight':
            event.preventDefault();
            otp.focusCell(rtl ? index - 1 : index + 1);
            return;
          case 'Home':
            event.preventDefault();
            otp.focusCell(0);
            return;
          case 'End':
            event.preventDefault();
            otp.focusCell(otp.cells.length - 1);
            return;
          case 'ArrowUp':
          case 'ArrowDown':
            // A single-character field has no vertical navigation, so swallow
            // these to stop the page scrolling while the group has focus.
            event.preventDefault();
            return;
          default:
            break;
        }

        // Let shortcuts (paste, select all), Tab, Enter and IME keys through.
        if (event.metaKey || event.ctrlKey || event.altKey) return;
        if (event.isComposing || composing) return;
        if (!isPrintableCharacter(event.key)) return;

        // The value is written here rather than by the browser, so a rejected
        // character never flashes into the cell.
        event.preventDefault();
        const char = otp.normalizeChar(event.key);
        if (!char) return;
        otp.setCharAt(index, char);
        if (index < otp.cells.length - 1) otp.focusCell(index + 1);
        else cell.select();
      };

      const onInput = (event) => {
        if (event.isComposing || composing) return;
        handleInput(cell);
      };

      const onPaste = (event) => {
        if (otp.isDisabled() || otp.isReadonly()) return;
        event.preventDefault();
        const text = event.clipboardData ? event.clipboardData.getData('text') : '';
        otp.distribute(text, indexOf(cell));
      };

      const onFocus = () => {
        cell.select();
      };

      const onCompositionStart = () => {
        composing = true;
      };

      const onCompositionEnd = () => {
        composing = false;
        handleInput(cell);
      };

      cell.addEventListener('keydown', onKeyDown);
      cell.addEventListener('input', onInput);
      cell.addEventListener('paste', onPaste);
      cell.addEventListener('focus', onFocus);
      cell.addEventListener('compositionstart', onCompositionStart);
      cell.addEventListener('compositionend', onCompositionEnd);
      listeners.push({ onKeyDown, onInput, onPaste, onFocus, onCompositionStart, onCompositionEnd });
    });

    otp.applyState();

    cleanup(() => {
      owned.forEach((cell, index) => {
        cell.removeEventListener('keydown', listeners[index].onKeyDown);
        cell.removeEventListener('input', listeners[index].onInput);
        cell.removeEventListener('paste', listeners[index].onPaste);
        cell.removeEventListener('focus', listeners[index].onFocus);
        cell.removeEventListener('compositionstart', listeners[index].onCompositionStart);
        cell.removeEventListener('compositionend', listeners[index].onCompositionEnd);
        otp.unregister(cell);
      });
    });
  });

  Alpine.directive('h-otp-separator', (el, { original }, { Alpine }) => {
    if (!findAncestorState(Alpine, el, '_h_otp')) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-otp')} element`);
    }
    el.classList.add('text-muted-foreground', 'select-none', 'px-1');
    el.setAttribute('data-slot', 'otp-separator');
    el.setAttribute('aria-hidden', 'true');
  });
}
