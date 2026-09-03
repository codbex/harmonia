import { isDisabled } from '../common/disabled';
import { listboxSurfaceClasses, optionPanelClasses } from '../common/shared-classes';
import uuidv4 from '../utils/uuid';

export default function (Alpine) {
  Alpine.directive('h-combobox', (el, { expression, original }, { cleanup, evaluate }) => {
    if (!expression) {
      throw new Error(`${original} must be given the text field that drives it, for example ${original}="$refs.query"`);
    }

    el.classList.add(...optionPanelClasses);
    // The popup of a combobox is a listbox in ARIA terms, so its items are the
    // same options a listbox holds. `x-h-list` and `x-h-list-item` recognise the
    // slot (see OPTION_CONTAINERS in src/components/list.js).
    el.setAttribute('data-slot', 'combobox');
    el.setAttribute('role', 'listbox');

    // The surface of the panel. "listbox" is the look shared with `x-h-listbox`,
    // "popover" is the surface of a popover panel, and "inline" leaves the
    // panel frameless and transparent for nesting inside another component.
    const variants = {
      listbox: listboxSurfaceClasses,
      popover: ['bg-popover', '[--badge-ring:var(--popover)]', 'text-popover-foreground', 'border', 'rounded-md', 'shadow-md'],
      inline: [],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-variant') ?? 'listbox');

    const variantObserver = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'listbox');
    });

    variantObserver.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    // The text field. Resolved late so it can sit anywhere in the document
    // rather than having to mount before the popup.
    let control = null;

    function getOptions() {
      return [...el.querySelectorAll('[role=option]')];
    }

    function getActive() {
      return el.querySelector('[role=option][data-active="true"]');
    }

    // Marks the option the user is on instead of focusing it. Focus belongs to
    // the text field, so the option is named to assistive technology through
    // aria-activedescendant rather than reached with the keyboard.
    function setActive(target) {
      const current = getActive();
      if (current && current !== target) current.removeAttribute('data-active');
      if (!target) {
        control?.removeAttribute('aria-activedescendant');
        return;
      }
      if (!target.hasAttribute('id')) target.setAttribute('id', `cbo${uuidv4()}`);
      target.setAttribute('data-active', 'true');
      target.scrollIntoView({ block: 'nearest' });
      control?.setAttribute('aria-activedescendant', target.getAttribute('id'));
    }

    // Only the keys a text field does not need are taken, and only when there is
    // something to use them on. Typing, Home and End keep working on the text
    // the user is entering. Handled keys are stopped as well as prevented, so an
    // author's own handler on the field does not fire for them too.
    function onKeyDown(event) {
      const options = getOptions();
      if (!options.length) return;
      const index = options.indexOf(getActive());
      switch (event.key) {
        case 'Up':
        case 'ArrowUp':
          // Nothing is marked until the user asks for it, so the first press
          // enters the list from the near end. The ends wrap from there.
          setActive(index === -1 ? options[options.length - 1] : options[(index - 1 + options.length) % options.length]);
          break;
        case 'Down':
        case 'ArrowDown':
          setActive(index === -1 ? options[0] : options[(index + 1) % options.length]);
          break;
        case 'Enter': {
          const active = getActive();
          // With nothing marked the field's own Enter handler decides what to
          // do, so the event is left completely alone.
          if (!active || isDisabled(active)) return;
          // Activating through a click is what an option's own handler listens
          // for, so one handler per option serves the mouse and the keyboard.
          active.click();
          break;
        }
        default:
          return;
      }
      event.preventDefault();
      event.stopPropagation();
    }

    // The marked option only means anything while the field has focus, so it is
    // dropped once focus leaves the pair. Coming back therefore starts in the
    // same unmarked state a first visit gets, which keeps Enter answering to the
    // author's handler until the user has picked something out with the arrows.
    function onFocusOut(event) {
      // Moving between the field and its own popup stays inside the widget.
      // Clicking an option really does focus it, since options are focusable.
      const next = event.relatedTarget;
      if (next === control || el.contains(next)) return;
      setActive(null);
    }

    // Re-rendering the results drops the marked option. Leaving the mark behind
    // would point Enter and aria-activedescendant at a row that is gone. No new
    // option takes its place, since the mark is the user's to set.
    const observer = new MutationObserver(() => {
      if (!getActive()) setActive(null);
    });
    observer.observe(el, { childList: true, subtree: true });

    queueMicrotask(() => {
      control = evaluate(expression);
      if (!control) {
        throw new Error(`${original}="${expression}" did not resolve to an element`);
      }
      if (!el.hasAttribute('id')) el.setAttribute('id', `cb${uuidv4()}`);
      if (!control.hasAttribute('role')) control.setAttribute('role', 'combobox');
      if (!control.hasAttribute('aria-controls')) control.setAttribute('aria-controls', el.getAttribute('id'));
      if (!control.hasAttribute('aria-autocomplete')) control.setAttribute('aria-autocomplete', 'list');
      // Capturing, so the keys this component owns are seen before any handler
      // the author bound on the field itself.
      control.addEventListener('keydown', onKeyDown, true);
      // Both ends of the pair, since focus can leave from either one, and
      // focusout rather than blur because it bubbles up from a focused option.
      control.addEventListener('focusout', onFocusOut);
      el.addEventListener('focusout', onFocusOut);
    });

    cleanup(() => {
      observer.disconnect();
      variantObserver.disconnect();
      el.removeEventListener('focusout', onFocusOut);
      control?.removeEventListener('keydown', onKeyDown, true);
      control?.removeEventListener('focusout', onFocusOut);
      // The field outlives this popup, so the one attribute written on it that
      // names an option has to go too. Left behind it would point at an id that
      // no longer exists, which the observer above cannot catch: it watches this
      // element's children, not this element being removed.
      setActive(null);
    });
  });
}
