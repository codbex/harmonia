import { resolveColor, textColorClass } from '../common/colors';
import { Star, StarHalf, StarHollow, createSvg } from '../common/icons';

const sizeClasses = { sm: 'size-4', default: 'size-5', lg: 'size-6' };

export default function (Alpine) {
  Alpine.directive('h-rating', (el, _, { effect, cleanup }) => {
    const max = Math.max(1, parseInt(el.getAttribute('data-max') || '5', 10) || 5);
    const precision = el.getAttribute('data-precision') === 'full' ? 'full' : 'half';
    const step = precision === 'half' ? 0.5 : 1;
    const starSize = sizeClasses[el.getAttribute('data-size')] || sizeClasses.default;
    const fillColor = textColorClass(resolveColor(el.getAttribute('data-color'), 'yellow'));
    const isDisabled = () => el.hasAttribute('disabled') || el.getAttribute('data-disabled') === 'true';
    const isReadonly = () => isDisabled() || el.hasAttribute('data-readonly') || el.getAttribute('data-readonly') === 'true';
    const isInteractive = () => !isReadonly();

    function clamp(v) {
      if (isNaN(v)) return 0;
      const bounded = Math.max(0, Math.min(max, v));
      return Math.round(bounded / step) * step;
    }

    let value = clamp(parseFloat(el.getAttribute('data-value')));
    let preview = null;

    el.classList.add('inline-flex', 'w-fit', 'items-center', 'gap-0.5', 'outline-none');
    el.setAttribute('data-slot', 'rating');
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', el.getAttribute('data-label') || 'Rating');
    }

    const interactiveClasses = ['cursor-pointer', 'rounded-control', 'focus-visible:ring-ring/50', 'focus-visible:ring-[calc(var(--spacing)*0.75)]'];

    function applyState() {
      const disabled = isDisabled();
      if (isInteractive()) {
        el.setAttribute('role', 'slider');
        el.setAttribute('tabindex', disabled ? '-1' : '0');
        el.setAttribute('aria-valuemin', '0');
        el.setAttribute('aria-valuemax', String(max));
        el.setAttribute('aria-orientation', 'horizontal');
        el.classList.add(...interactiveClasses);
      } else {
        preview = null;
        el.setAttribute('role', 'img');
        el.removeAttribute('tabindex');
        el.removeAttribute('aria-valuemin');
        el.removeAttribute('aria-valuemax');
        el.removeAttribute('aria-valuenow');
        el.removeAttribute('aria-valuetext');
        el.removeAttribute('aria-orientation');
        el.classList.remove(...interactiveClasses);
      }
      if (disabled) {
        el.setAttribute('aria-disabled', 'true');
        el.classList.add('opacity-disabled', 'cursor-not-allowed');
      } else {
        el.removeAttribute('aria-disabled');
        el.classList.remove('opacity-disabled', 'cursor-not-allowed');
      }
      render();
    }

    const stars = [];
    for (let i = 0; i < max; i++) {
      const star = document.createElement('span');
      star.classList.add('inline-flex', 'shrink-0');
      el.appendChild(star);
      stars.push(star);
    }

    function valueText(v) {
      if (v === 0) return el.getAttribute('data-aria-empty') || 'No rating';
      return `${v} of ${max} stars`;
    }

    function render() {
      const shown = preview != null ? preview : value;
      for (let i = 0; i < max; i++) {
        const position = i + 1;
        let icon;
        let colorClass;
        let state;
        if (shown >= position) {
          icon = Star;
          colorClass = fillColor;
          state = 'full';
        } else if (shown >= position - 0.5) {
          icon = StarHalf;
          colorClass = fillColor;
          state = 'half';
        } else {
          icon = StarHollow;
          colorClass = 'text-muted-foreground';
          state = 'empty';
        }
        stars[i].setAttribute('data-state', state);
        stars[i].replaceChildren(createSvg({ icon, classes: `${starSize} ${colorClass}`, attrs: { 'aria-hidden': true, role: 'presentation' } }));
      }
      if (isInteractive()) {
        el.setAttribute('aria-valuenow', String(value));
        el.setAttribute('aria-valuetext', valueText(value));
      } else {
        el.setAttribute('aria-label', valueText(value));
      }
    }

    function setValue(v) {
      preview = null;
      const next = clamp(v);
      if (next === value) {
        render();
        return;
      }
      value = next;
      if (el._x_model) el._x_model.set(value);
      el.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true }));
      render();
    }

    // Map a pointer position to a rating value (left/right half of a star in half mode).
    function valueFromPointer(event) {
      for (let i = 0; i < max; i++) {
        const rect = stars[i].getBoundingClientRect();
        if (event.clientX >= rect.left && event.clientX <= rect.right) {
          if (precision === 'half') return event.clientX < rect.left + rect.width / 2 ? i + 0.5 : i + 1;
          return i + 1;
        }
      }
      if (stars.length && event.clientX < stars[0].getBoundingClientRect().left) return step;
      return max;
    }

    const onPointerMove = (event) => {
      if (!isInteractive()) return;
      preview = clamp(valueFromPointer(event));
      render();
    };
    const onPointerLeave = () => {
      if (!isInteractive()) return;
      preview = null;
      render();
    };
    const onClick = (event) => {
      if (!isInteractive()) return;
      const picked = clamp(valueFromPointer(event));
      // Clicking the current value again clears the rating.
      setValue(picked === value ? 0 : picked);
    };
    const onKeyDown = (event) => {
      if (!isInteractive()) return;
      let handled = true;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          setValue(value + step);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          setValue(value - step);
          break;
        case 'Home':
          setValue(0);
          break;
        case 'End':
          setValue(max);
          break;
        default:
          handled = false;
      }
      if (handled) event.preventDefault();
    };

    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerleave', onPointerLeave);
    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKeyDown);

    applyState();

    const stateObserver = new MutationObserver(applyState);
    stateObserver.observe(el, { attributeFilter: ['disabled', 'data-disabled', 'data-readonly'] });

    // Sync from an external x-model value (the effect runs after Alpine has wired
    // x-model, so el._x_model is available here).
    effect(() => {
      if (!el._x_model) return;
      const modelValue = clamp(parseFloat(el._x_model.get()));
      if (modelValue === value) return;
      value = modelValue;
      if (preview == null) render();
    });

    cleanup(() => {
      stateObserver.disconnect();
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerleave', onPointerLeave);
      el.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onKeyDown);
    });
  });
}
