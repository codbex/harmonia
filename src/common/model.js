// x-model's modifiers live in the attribute name (e.g. 'x-model.lazy'), so a
// plain getAttribute('x-model') misses every modified form. Returns the
// attribute node (its value is the model expression), or undefined when the
// element carries no x-model. Alpine is passed in so the attribute name
// respects a custom prefix.
export function findModelAttribute(Alpine, el) {
  const name = Alpine.prefixed('model');
  for (const attr of el.attributes) {
    if (attr.name === name || attr.name.startsWith(`${name}.`)) return attr;
  }
  return undefined;
}

// x-model's event modifiers have nothing to defer on a component that writes
// `el._x_model` itself. Worse, each one attaches an Alpine listener that
// corrupts the model: .lazy and .change write the change event's detail
// object over it whole, .blur and .enter write the host element's undefined
// value. Reject them loudly at init.
const eventModifiers = ['lazy', 'change', 'blur', 'enter'];

export function rejectModelEventModifiers(Alpine, el, original) {
  const attr = findModelAttribute(Alpine, el);
  if (!attr) return;
  const modifier = attr.name
    .split('.')
    .slice(1)
    .find((m) => eventModifiers.includes(m));
  if (modifier) console.error(`${original}: ${Alpine.prefixed('model')}.${modifier} is not supported, the model always updates immediately`, el);
}
