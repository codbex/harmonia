// Elements the browser puts in the sequential tab order. `tabindex="-1"` is
// excluded on purpose: it makes an element programmatically focusable without
// making it a tab stop, which is exactly what it is used for inside composite
// widgets such as the listbox.
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'audio[controls]',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]:not([tabindex^="-"])',
].join(',');

/**
 * The focusable descendants of an element, in tab order.
 *
 * checkVisibility covers `display:none`, `visibility:hidden` and `content-visibility`
 * in one call. Environments without it (such as the test DOM) fall back to
 * treating every match as visible, which is the safe direction: a trap that
 * considers one element too many still contains focus.
 *
 * @param {Element} root element to search within.
 * @returns {Element[]} the focusable descendants.
 */
export function getFocusable(root) {
  return [...root.querySelectorAll(FOCUSABLE_SELECTOR)].filter((el) => !el.hasAttribute('inert') && (el.checkVisibility?.() ?? true));
}
