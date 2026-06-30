// Harmonia's standard, general-purpose colors. Each chromatic color maps to a
// `<utility>-<name>-500` class and a `--color-<name>-500` CSS variable; white and
// black have no step. All are safelisted in src/styles/harmonia.css. These are the
// plain palette, intentionally separate from the semantic tokens (primary,
// negative, etc.). Shared by the chart, rating, and any other component that lets
// the consumer pick from the standard colors.
export const KNOWN_COLORS = ['white', 'black', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink', 'gray'];

// Resolve a color name to its underlying token (chromatic colors use the 500 step).
export function colorToken(name) {
  return name === 'white' || name === 'black' ? name : `${name}-500`;
}

export function colorClass(name) {
  return `bg-${colorToken(name)}`;
}

export function textColorClass(name) {
  return `text-${colorToken(name)}`;
}

export function colorVar(name) {
  return `var(--color-${colorToken(name)})`;
}

// Return `name` when it is a known standard color, otherwise `fallback`.
export function resolveColor(name, fallback) {
  return KNOWN_COLORS.includes(name) ? name : fallback;
}
