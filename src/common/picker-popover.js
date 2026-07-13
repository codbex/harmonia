import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import { Calendar, createSvg } from './icons';

// Shared trigger + popover mechanics for the date / date-time pickers. Each
// picker keeps its own `_h_*` state object; these helpers are passed that object
// (`pickerState`, with `state.expanded`, `controls`, `inTable`) and the wrapper
// element (`anchor`) so they stay name-agnostic.

const triggerBaseClasses = [
  'cursor-pointer',
  'inline-flex',
  'items-center',
  'justify-center',
  'h-full',
  'aspect-square',
  'bg-transparent',
  'hover:bg-secondary',
  'hover:text-secondary-foreground',
  'active:bg-secondary-active',
  'active:text-secondary-foreground',
  '[input[readonly]~&]:pointer-events-none',
  'outline-none',
  'focus-visible:inset-ring-ring/50',
  'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
  '[input[aria-invalid=true]~&]:inset-ring-negative/20',
  'dark:[input[aria-invalid=true]~&]:inset-ring-negative/40',
  '[input:user-invalid~&]:inset-ring-negative/20!',
  'dark:[input:user-invalid~&]:inset-ring-negative/40!',
  '[[data-validate=immediate]_input:invalid~&]:inset-ring-negative/20!',
  'dark:[[data-validate=immediate]_input:invalid~&]:inset-ring-negative/40!',
];

const triggerStandaloneClasses = ['focus-visible:border-ring', '[input[aria-invalid=true]~&]:border-negative', '[input:user-invalid~&]:border-negative', '[[data-validate=immediate]_input:invalid~&]:border-negative'];

const popoverClasses = [
  'border',
  'rounded-control',
  'gap-2',
  'p-2',
  'absolute',
  'bg-popover',
  'text-popover-foreground',
  'flex',
  'flex-col',
  'hidden',
  'z-50',
  'shadow-md',
  'transition-[opacity,scale]',
  'motion-reduce:transition-none',
  'duration-100',
  'ease-out',
  'opacity-0',
  'scale-95',
];

// True when the click originated inside the picker. Uses composedPath() rather
// than contains(): inside a shadow tree (e.g. the docs' component-container)
// event.target is retargeted to the shadow host, which the picker does not
// contain, so contains() would wrongly report the click as outside.
export function eventInsidePicker(anchor, event) {
  return event.composedPath ? event.composedPath().includes(anchor) : anchor.contains(event.target);
}

/**
 * Wire up a picker trigger button: validation, classes, ARIA, the icon, the
 * open/close toggle and the outside-click listener.
 *
 * @param {HTMLElement} el - the trigger button
 * @param {{ pickerState, Alpine, effect, cleanup, original, slot, icon?, stayOpenInside? }} opts
 *   stayOpenInside(event) - return true to keep the popover open for this click.
 */
export function setupTrigger(el, { pickerState, Alpine, effect, cleanup, original, slot, icon, stayOpenInside }) {
  if (el.tagName !== 'BUTTON') {
    throw new Error(`${original} must be a button`);
  }
  if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
    throw new Error(`${original}: must have an "aria-label" or "aria-labelledby" attribute`);
  }

  el.classList.add(...triggerBaseClasses);
  if (pickerState.inTable) {
    el.classList.add(...triggerStandaloneClasses);
  } else {
    el.classList.add('rounded-r-control');
  }

  el.setAttribute('aria-controls', pickerState.controls);
  el.setAttribute('aria-expanded', 'false');
  el.setAttribute('aria-haspopup', 'dialog');
  el.setAttribute('type', 'button');
  el.setAttribute('data-slot', slot);

  el.appendChild(
    createSvg({
      icon: icon || Calendar,
      classes: 'opacity-70 text-inherit size-4',
      attrs: { 'aria-hidden': true, role: 'presentation' },
    })
  );

  // Persistent listener (not once), removed when it actually closes.
  const close = (event) => {
    if (event && stayOpenInside && stayOpenInside(event)) return;
    pickerState.state.expanded = false;
    removeDismiss(el, 'click', close);
  };

  effect(() => {
    el.setAttribute('data-state', pickerState.state.expanded ? 'open' : 'closed');
    el.setAttribute('aria-expanded', pickerState.state.expanded);
    // A close that does not come from a click (Escape, keyboard selection)
    // must still disarm the outside-click dismiss, or the stale listener
    // immediately re-closes the popover on the next trigger click.
    if (!pickerState.state.expanded) removeDismiss(el, 'click', close);
  });

  // aria-readonly is not valid on a button, so a readonly (or disabled) picker
  // exposes its locked trigger as aria-disabled; the observer keeps it in sync
  // when either attribute is toggled at runtime.
  const inputLocked = () => pickerState.input && (pickerState.input.readOnly || pickerState.input.disabled);
  const syncLocked = () => {
    if (inputLocked()) {
      el.setAttribute('aria-disabled', 'true');
    } else {
      el.removeAttribute('aria-disabled');
    }
  };
  let lockedObserver;
  if (pickerState.input) {
    syncLocked();
    lockedObserver = new MutationObserver(syncLocked);
    lockedObserver.observe(pickerState.input, { attributeFilter: ['readonly', 'disabled'] });
  }

  const handler = () => {
    if (inputLocked()) return;
    pickerState.state.expanded = !pickerState.state.expanded;
    Alpine.nextTick(() => {
      if (pickerState.state.expanded) {
        addDismiss(el, 'click', close);
      } else {
        removeDismiss(el, 'click', close);
      }
    });
  };

  el.addEventListener('click', handler);

  cleanup(() => {
    if (lockedObserver) lockedObserver.disconnect();
    el.removeEventListener('click', handler);
    removeDismiss(el, 'click', close);
  });
}

/**
 * Wire up the popover container: shared classes, the show/hide + floating-ui
 * positioning effect (driven by `pickerState.state.expanded`), and the
 * transition-end hide. `onOpen` runs after the popover is shown (e.g. to move
 * focus). The caller still sets role / aria / data-slot and the content.
 */
export function setupPopover(el, { anchor, pickerState, Alpine, effect, cleanup, onOpen }) {
  el.classList.add(...popoverClasses);

  let autoUpdateCleanup;

  function updatePosition() {
    computePosition(anchor, el, {
      placement: el.getAttribute('data-align') || 'bottom-start',
      middleware: [offset(4), flip(), shift({ padding: 4 })],
    }).then(({ x, y }) => {
      Object.assign(el.style, { left: `${x}px`, top: `${y}px` });
      el.classList.remove('scale-95', 'opacity-0');
    });
  }

  effect(() => {
    if (pickerState.state.expanded) {
      el.classList.remove('hidden');
      if (autoUpdateCleanup) autoUpdateCleanup();
      autoUpdateCleanup = autoUpdate(anchor, el, updatePosition);
      Alpine.nextTick(() => {
        if (onOpen) onOpen();
      });
    } else {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.classList.add('hidden', 'scale-95', 'opacity-0');
        Object.assign(el.style, { left: '0px', top: '0px' });
      } else {
        el.classList.add('scale-95', 'opacity-0');
      }
      if (autoUpdateCleanup) autoUpdateCleanup();
    }
  });

  const onTransitionEnd = (event) => {
    if (event.target === el && event.target.classList.contains('opacity-0')) {
      el.classList.add('hidden');
      Object.assign(el.style, { left: '0px', top: '0px' });
    }
  };
  el.addEventListener('transitionend', onTransitionEnd);

  cleanup(() => {
    el.removeEventListener('transitionend', onTransitionEnd);
    if (autoUpdateCleanup) autoUpdateCleanup();
  });
}
