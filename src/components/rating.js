import { resolveColor, textColorClass } from '../common/colors';
import { isDisabled } from '../common/disabled';
import { Star, StarHalf, StarHollow, createSvg } from '../common/icons';

const sizeClasses = { sm: 'size-4', default: 'size-5', lg: 'size-6' };

export default function (Alpine) {
  Alpine.directive('h-rating', (el, _, { effect, cleanup }) => {
    const max = Math.max(1, parseInt(el.getAttribute('data-max') || '5', 10) || 5);
    const precision = el.getAttribute('data-precision') === 'full' ? 'full' : 'half';
    const step = precision === 'half' ? 0.5 : 1;
    const starSize = sizeClasses[el.getAttribute('data-size')] || sizeClasses.default;
    const fillColor = textColorClass(resolveColor(el.getAttribute('data-color'), 'yellow'));
    // A disabled rating stays focusable and announced, so the rating is always a
    // slider and only editing is disabled.
    const isEditable = () => !isDisabled(el);

    function clamp(v) {
      if (isNaN(v)) return 0;
      const bounded = Math.max(0, Math.min(max, v));
      return Math.round(bounded / step) * step;
    }

    let value = clamp(parseFloat(el.getAttribute('data-value')));
    let preview = null;

    // The focus ring belongs with the tab stop, which every state now has, so it
    // sits here rather than with the editing-only classes below.
    el.classList.add('inline-flex', 'w-fit', 'items-center', 'gap-0.5', 'outline-none', 'rounded-control', 'focus-visible:ring-ring/50', 'focus-visible:ring-[calc(var(--spacing)*0.75)]');
    el.setAttribute('data-slot', 'rating');
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      el.setAttribute('aria-label', 'Rating');
    }

    const interactiveClasses = ['cursor-pointer'];

    function applyState() {
      // The slider role, the tab stop and the value bounds hold in every state.
      // A locked rating still has a value worth announcing, and dropping it from
      // the tab order would leave a keyboard user unable to discover it at all.
      el.setAttribute('role', 'slider');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-valuemin', '0');
      el.setAttribute('aria-valuemax', String(max));
      el.setAttribute('aria-orientation', 'horizontal');
      if (isEditable()) {
        el.classList.add(...interactiveClasses);
      } else {
        preview = null;
        el.classList.remove(...interactiveClasses);
      }
      // aria-disabled is the author's to set, so the component only reads it.
      // Dimming is the one thing it adds on top.
      if (isDisabled(el)) {
        el.classList.add('opacity-disabled', 'cursor-not-allowed');
      } else {
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
      // A whole template rather than separate words, so a translation can put the
      // numbers wherever its language needs them.
      const template = el.getAttribute('data-value-label') || '{value} of {max} stars';
      return template.replace('{value}', String(v)).replace('{max}', String(max));
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
      // The value goes in the value attributes, never in aria-label, so whatever
      // name the author gave the rating survives.
      el.setAttribute('aria-valuenow', String(value));
      el.setAttribute('aria-valuetext', valueText(value));
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
      if (!isEditable()) return;
      preview = clamp(valueFromPointer(event));
      render();
    };
    const onPointerLeave = () => {
      if (!isEditable()) return;
      preview = null;
      render();
    };
    const onClick = (event) => {
      if (!isEditable()) return;
      const picked = clamp(valueFromPointer(event));
      // Clicking the current value again clears the rating.
      setValue(picked === value ? 0 : picked);
    };
    const onKeyDown = (event) => {
      if (!isEditable()) return;
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
    stateObserver.observe(el, { attributeFilter: ['aria-disabled'] });

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
