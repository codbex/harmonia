// Finds the nearest ancestor carrying a Harmonia state marker (e.g. '_h_accordion').
// Alpine is passed in so the lookup matches the framework's own traversal
// (teleport/root aware) in both the browser and ESM builds. Returns the ancestor
// element, or undefined when none is found - callers decide how to handle a miss.
export function findAncestorState(Alpine, el, prop) {
  return Alpine.findClosest(el.parentElement, (parent) => Object.prototype.hasOwnProperty.call(parent, prop));
}
