export default function (Alpine) {
  Alpine.directive('h-range', (el, { original, modifiers }, { Alpine, effect, cleanup }) => {
    const vertical = modifiers.includes('vertical');
    const dual = modifiers.includes('dual');

    // The consumer-authored native input carries the value into forms and,
    // like the other form components, holds the disabled and aria-invalid
    // state plus any constraints or custom validity.
    const input = Array.from(el.children).find((child) => child.tagName === 'INPUT');
    if (!input) {
      throw new Error(`${original} must contain a native input element as a direct child`);
    }
    if (input.type === 'hidden') console.warn(`${original}: use a text or number input, type="hidden" is excluded from form validation`);

    let min = parseFloat(el.getAttribute('data-min'));
    let max = parseFloat(el.getAttribute('data-max'));
    if (!Number.isFinite(min)) min = 0;
    if (!Number.isFinite(max)) max = 100;
    if (!(max > min)) {
      console.warn(`${original}: data-min must be less than data-max`);
      min = 0;
      max = 100;
    }
    let step = parseFloat(el.getAttribute('data-step'));
    if (!Number.isFinite(step) || step <= 0) step = 1;

    const attrDecimals = (name) => ((el.getAttribute(name) || '').split('.')[1] || '').length;
    const decimals = Math.max(attrDecimals('data-step'), attrDecimals('data-min'));
    const unit = el.getAttribute('data-unit') || '';
    const autoTooltips = el.getAttribute('data-tooltips') === 'auto';
    const isDisabled = () => input.disabled;
    const isRtl = () => !vertical && getComputedStyle(el).direction === 'rtl';

    function snap(raw) {
      const stepped = min + Math.round((raw - min) / step) * step;
      const clamped = Math.min(max, Math.max(min, stepped));
      return parseFloat(clamped.toFixed(decimals));
    }

    function initialValues() {
      const attr = el.getAttribute('data-value');
      if (attr != null) {
        const parts = attr.split(',').map((part) => parseFloat(part));
        if (dual && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
          const low = snap(parts[0]);
          const high = snap(parts[1]);
          return low <= high ? [low, high] : [high, low];
        }
        if (!dual && Number.isFinite(parts[0])) return [snap(parts[0])];
      }
      return dual ? [min, max] : [min];
    }

    const state = Alpine.reactive({ values: initialValues() });
    const modelValue = () => (dual ? [...state.values] : state.values[0]);

    el.classList.add(
      'relative',
      'rounded-full',
      'border',
      'border-input',
      'bg-input-inner',
      'shadow-input',
      'select-none',
      'touch-none',
      'has-[input[aria-invalid=true]]:border-negative',
      'has-[input:user-invalid]:border-negative',
      '[[data-validate=immediate]_&:has(input:invalid)]:border-negative'
    );
    if (vertical) el.classList.add('w-2');
    else el.classList.add('h-2', 'w-full');
    el.setAttribute('data-slot', 'range');
    el.setAttribute('data-orientation', vertical ? 'vertical' : 'horizontal');
    if (dual) {
      el.setAttribute('role', 'group');
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
        el.setAttribute('aria-label', el.getAttribute('data-label') || 'Range');
      }
    }

    // The input stays validatable but invisible: display:none would stop the
    // browser from focusing it on a failed submit.
    input.setAttribute('data-slot', 'range-input');
    input.classList.add('absolute', 'inset-0', 'opacity-0', 'pointer-events-none');
    input.setAttribute('tabindex', '-1');
    input.setAttribute('aria-hidden', 'true');
    input.defaultValue = dual ? `${state.values[0]},${state.values[1]}` : String(state.values[0]);

    const fill = document.createElement('div');
    fill.classList.add(
      'absolute',
      'rounded-full',
      'bg-primary',
      '[input:disabled~&]:bg-muted',
      '[input[aria-invalid=true]~&]:bg-negative',
      '[input:user-invalid~&]:bg-negative',
      '[[data-validate=immediate]_input:invalid~&]:bg-negative',
      vertical ? 'inset-x-0' : 'inset-y-0'
    );
    fill.setAttribute('data-slot', 'range-fill');
    el.appendChild(fill);

    const withTooltips = el.hasAttribute('data-tooltips');
    const handles = [];
    const tooltips = [];
    for (let i = 0; i < (dual ? 2 : 1); i++) {
      const handle = document.createElement('div');
      handle.classList.add(
        'absolute',
        'size-5',
        'cursor-pointer',
        'rounded-full',
        'border-2',
        'border-primary',
        'bg-background',
        'shadow-input',
        'ring-ring/50',
        'outline-none',
        'hover:ring-4',
        'focus-visible:ring-4',
        '[input:disabled~&]:border-muted',
        '[input:disabled~&]:cursor-not-allowed',
        '[input:disabled~&]:hover:ring-0',
        '[input[aria-invalid=true]~&]:border-negative',
        '[input[aria-invalid=true]~&]:ring-negative/20',
        'dark:[input[aria-invalid=true]~&]:ring-negative/40',
        '[input:user-invalid~&]:border-negative',
        '[input:user-invalid~&]:ring-negative/20',
        'dark:[input:user-invalid~&]:ring-negative/40',
        '[[data-validate=immediate]_input:invalid~&]:border-negative',
        '[[data-validate=immediate]_input:invalid~&]:ring-negative/20',
        'dark:[[data-validate=immediate]_input:invalid~&]:ring-negative/40'
      );
      if (vertical) handle.classList.add('left-1/2', '-translate-x-1/2', 'translate-y-1/2');
      else handle.classList.add('top-1/2', '-translate-y-1/2', isRtl() ? 'translate-x-1/2' : '-translate-x-1/2');
      handle.setAttribute('data-slot', 'range-handle');
      handle.setAttribute('data-index', String(i));
      handle.setAttribute('role', 'slider');
      handle.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
      handle.setAttribute('aria-valuemin', String(min));
      handle.setAttribute('aria-valuemax', String(max));
      const label = dual ? (i === 0 ? el.getAttribute('data-min-label') || 'Minimum' : el.getAttribute('data-max-label') || 'Maximum') : el.getAttribute('data-label') || 'Value';
      handle.setAttribute('aria-label', label);
      if (withTooltips) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('pointer-events-none', 'absolute', 'rounded-md', 'border', 'bg-background', 'px-2', 'py-0.5', 'text-center', 'text-base', 'whitespace-nowrap', 'text-foreground', 'shadow-md');
        if (vertical) tooltip.classList.add('end-full', 'top-1/2', 'me-2.5', '-translate-y-1/2');
        else tooltip.classList.add('bottom-full', 'left-1/2', 'mb-2.5', '-translate-x-1/2');
        if (autoTooltips) tooltip.classList.add('hidden');
        tooltip.setAttribute('data-slot', 'range-tooltip');
        handle.appendChild(tooltip);
        tooltips.push(tooltip);
      }
      el.appendChild(handle);
      handles.push(handle);
    }

    function dispatch(type) {
      // Alpine's own x-model listener reads CustomEvent detail; a plain Event
      // would overwrite the bound model with the element's undefined value.
      el.dispatchEvent(new CustomEvent(type, { detail: modelValue(), bubbles: true }));
    }

    // aria-invalid mirroring: the hidden input is not announced, so the
    // focusable role=slider handles carry it. An explicit aria-invalid on the
    // input is owned by the consumer and wins over tracked native validity.
    let nativeInvalid = false;
    function renderInvalid() {
      const explicit = input.getAttribute('aria-invalid');
      const invalid = explicit != null ? explicit : nativeInvalid ? 'true' : null;
      for (const handle of handles) {
        if (invalid == null) handle.removeAttribute('aria-invalid');
        else handle.setAttribute('aria-invalid', invalid);
      }
    }
    // :user-invalid is not observable from JS, so only clear on valid or set
    // when an ancestor opted into immediate validation; the invalid event
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

    function setHandleValue(index, raw) {
      let value = snap(raw);
      const values = state.values.slice();
      if (dual) value = index === 0 ? Math.min(value, values[1]) : Math.max(value, values[0]);
      if (value === values[index]) return false;
      values[index] = value;
      // Write the model before the state so the model sync effect, which the
      // state write triggers, already sees the two sides equal and bails.
      if (el._x_model) el._x_model.set(dual ? [...values] : values[0]);
      state.values = values;
      dispatch('input');
      // After dispatch, so a consumer input handler calling setCustomValidity
      // on the native input has already run.
      syncValidity();
      return true;
    }

    function valueFromPointer(event) {
      const rect = el.getBoundingClientRect();
      const size = vertical ? rect.height : rect.width;
      if (!(size > 0)) return null;
      let ratio = vertical ? (rect.bottom - event.clientY) / size : (event.clientX - rect.left) / size;
      if (isRtl()) ratio = 1 - ratio;
      return snap(min + Math.min(1, Math.max(0, ratio)) * (max - min));
    }

    function pickHandle(value) {
      if (!dual) return 0;
      const [low, high] = state.values;
      if (value <= low) return 0;
      if (value >= high) return 1;
      return value - low <= high - value ? 0 : 1;
    }

    let activeIndex = -1;
    let activePointer = null;
    let dragChanged = false;

    function endDrag() {
      if (activeIndex < 0) return;
      handles[activeIndex].classList.remove('ring-4');
      handles[activeIndex].removeAttribute('data-active');
      if (activePointer != null && el.releasePointerCapture) {
        try {
          el.releasePointerCapture(activePointer);
        } catch {
          // pointer capture is best-effort; ignore environments that lack it
        }
      }
      activeIndex = -1;
      activePointer = null;
      if (dragChanged) {
        dragChanged = false;
        dispatch('change');
      }
    }

    const onPointerDown = (event) => {
      if (isDisabled() || event.button > 0) return;
      const value = valueFromPointer(event);
      if (value == null) return;
      activeIndex = pickHandle(value);
      dragChanged = false;
      handles[activeIndex].classList.add('ring-4');
      handles[activeIndex].setAttribute('data-active', '');
      handles[activeIndex].focus({ preventScroll: true });
      if (el.setPointerCapture) {
        try {
          el.setPointerCapture(event.pointerId);
          activePointer = event.pointerId;
        } catch {
          // pointer capture is best-effort; ignore environments that lack it
        }
      }
      if (setHandleValue(activeIndex, value)) dragChanged = true;
      event.preventDefault();
    };
    const onPointerMove = (event) => {
      if (activeIndex < 0) return;
      const value = valueFromPointer(event);
      if (value == null) return;
      if (setHandleValue(activeIndex, value)) dragChanged = true;
    };
    const onPointerUp = () => {
      endDrag();
    };
    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);

    const handleListeners = handles.map((handle, index) => {
      const onKeyDown = (event) => {
        if (isDisabled()) return;
        const current = state.values[index];
        let next;
        switch (event.key) {
          case 'ArrowUp':
            next = current + step;
            break;
          case 'ArrowDown':
            next = current - step;
            break;
          case 'ArrowRight':
            next = isRtl() ? current - step : current + step;
            break;
          case 'ArrowLeft':
            next = isRtl() ? current + step : current - step;
            break;
          case 'PageUp':
            next = current + step * 10;
            break;
          case 'PageDown':
            next = current - step * 10;
            break;
          case 'Home':
            next = min;
            break;
          case 'End':
            next = max;
            break;
          default:
            return;
        }
        event.preventDefault();
        if (setHandleValue(index, next)) dispatch('change');
      };
      handle.addEventListener('keydown', onKeyDown);

      // Auto tooltips show while the handle is focused (dragging focuses it too).
      const onFocus = autoTooltips ? () => tooltips[index].classList.remove('hidden') : null;
      const onBlur = autoTooltips ? () => tooltips[index].classList.add('hidden') : null;
      if (autoTooltips) {
        handle.addEventListener('focus', onFocus);
        handle.addEventListener('blur', onBlur);
      }
      return { onKeyDown, onFocus, onBlur };
    });

    // Disabled and invalid visuals are pure CSS driven by the input's state;
    // only focusability and the aria mirroring need JS.
    function applyState() {
      const disabled = isDisabled();
      if (disabled) endDrag();
      for (const handle of handles) {
        handle.setAttribute('tabindex', disabled ? '-1' : '0');
        if (disabled) handle.setAttribute('aria-disabled', 'true');
        else handle.removeAttribute('aria-disabled');
      }
      syncValidity();
    }
    applyState();

    const stateObserver = new MutationObserver(applyState);
    stateObserver.observe(input, { attributeFilter: ['disabled', 'aria-invalid'] });

    // Form reset restores the input's default, then the slider follows it
    // back to its initial values on the next tick.
    const formEl = input.form;
    let resetTimer;
    const onFormReset = () => {
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        const values = initialValues();
        if (values[0] === state.values[0] && (!dual || values[1] === state.values[1])) return;
        if (el._x_model) el._x_model.set(dual ? [...values] : values[0]);
        state.values = values;
        dispatch('input');
        dispatch('change');
        syncValidity();
      });
    };
    if (formEl) formEl.addEventListener('reset', onFormReset);

    effect(() => {
      const values = state.values;
      input.value = dual ? `${values[0]},${values[1]}` : String(values[0]);
      const percents = values.map((value) => ((value - min) / (max - min)) * 100);
      values.forEach((value, i) => {
        if (vertical) handles[i].style.bottom = `${percents[i]}%`;
        else handles[i].style.insetInlineStart = `${percents[i]}%`;
        handles[i].setAttribute('aria-valuenow', String(value));
        if (unit) handles[i].setAttribute('aria-valuetext', `${value}${unit}`);
        if (tooltips[i]) tooltips[i].textContent = `${value}${unit}`;
      });
      const startPercent = dual ? percents[0] : 0;
      const sizePercent = dual ? percents[1] - percents[0] : percents[0];
      if (vertical) {
        fill.style.bottom = `${startPercent}%`;
        fill.style.height = `${sizePercent}%`;
      } else {
        fill.style.insetInlineStart = `${startPercent}%`;
        fill.style.width = `${sizePercent}%`;
      }
      if (dual) {
        handles[0].setAttribute('aria-valuemax', String(values[1]));
        handles[1].setAttribute('aria-valuemin', String(values[0]));
      }
    });

    function normalizeModel(raw) {
      if (dual) {
        if (!Array.isArray(raw) || raw.length < 2) return null;
        const low = snap(parseFloat(raw[0]));
        const high = snap(parseFloat(raw[1]));
        if (!Number.isFinite(low) || !Number.isFinite(high)) return null;
        return low <= high ? [low, high] : [high, low];
      }
      const value = snap(parseFloat(raw));
      return Number.isFinite(value) ? [value] : null;
    }

    // Sync from an external x-model value (the effect runs after Alpine has
    // wired x-model, so el._x_model is available here).
    effect(() => {
      if (!el._x_model) return;
      const next = normalizeModel(el._x_model.get());
      if (!next || (next[0] === state.values[0] && (!dual || next[1] === state.values[1]))) return;
      state.values = next;
    });

    cleanup(() => {
      stateObserver.disconnect();
      clearTimeout(resetTimer);
      if (formEl) formEl.removeEventListener('reset', onFormReset);
      input.removeEventListener('invalid', onInvalid);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      handles.forEach((handle, index) => {
        handle.removeEventListener('keydown', handleListeners[index].onKeyDown);
        if (autoTooltips) {
          handle.removeEventListener('focus', handleListeners[index].onFocus);
          handle.removeEventListener('blur', handleListeners[index].onBlur);
        }
      });
    });
  });
}
