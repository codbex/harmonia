import { getFocusable } from './focusable';

/**
 * The element that really has focus, looked up through shadow roots.
 *
 * document.activeElement stops at the shadow host, so a component rendered
 * inside a shadow tree would otherwise always look unfocused, and every Tab
 * would be treated as focus arriving from outside.
 *
 * @returns {Element|null} the innermost focused element.
 */
function activeElement() {
  let active = document.activeElement;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement;
  }
  return active;
}

/**
 * Keeps keyboard focus inside an element while it is open.
 *
 * The page behind an open overlay is inert to the eye but not to the keyboard,
 * so Tab and Shift+Tab have to be cycled within the overlay instead. trap() is
 * called when it opens, release() when it closes and dispose() when the
 * directive is torn down.
 *
 * @param {Element} el element to contain focus within.
 * @returns {{trap: () => void, release: () => void, dispose: () => void}} the trap controls.
 */
export function focusTrap(el) {
  // Whatever had focus when the element opened, so it can be handed back on
  // close instead of dropping the user at the top of the document.
  let opener = null;

  function onKeyDown(event) {
    if (event.key !== 'Tab') return;
    const focusable = getFocusable(el);
    if (!focusable.length) {
      // Nothing inside to hold focus, so the element itself does. It carries
      // tabindex="-1", so it takes focus without becoming a tab stop.
      event.preventDefault();
      el.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const focused = activeElement();
    const active = el.contains(focused) ? focused : null;
    if (event.shiftKey && (active === first || active === null)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === null)) {
      event.preventDefault();
      first.focus();
    }
  }

  return {
    trap() {
      opener = activeElement();
      // On the document rather than the element, so Tab is caught even when
      // focus never entered it in the first place.
      document.addEventListener('keydown', onKeyDown);
    },
    release() {
      document.removeEventListener('keydown', onKeyDown);
      // Restored now rather than after the fade, so the user is not left
      // waiting on a transition to get their place back.
      if (opener && opener.isConnected) opener.focus();
      opener = null;
    },
    dispose() {
      // Teardown does not steal focus, so the opener is deliberately left alone.
      document.removeEventListener('keydown', onKeyDown);
    },
  };
}
