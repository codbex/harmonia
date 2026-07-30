// aria-disabled marks an element unavailable while leaving it focusable and
// announced, so navigation must still reach it. Only activation is blocked. The
// native disabled attribute is the opposite - unreachable and unannounced.
// The explicit "true" is required, so an attribute bound to a false expression
// leaves the element usable.
export function isDisabled(el) {
  return el?.getAttribute('aria-disabled') === 'true';
}

// Disabling a container dims everything inside it, so a descendant is equally
// unavailable even without its own aria-disabled.
export function isDisabledOrInside(el) {
  return !!el?.closest('[aria-disabled="true"]');
}
