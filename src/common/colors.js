// Harmonia's standard, general-purpose colors. Each chromatic color maps to a
// `<utility>-<name>-500` class and a `--color-<name>-500` CSS variable; white and
// black have no step. All are safelisted in src/styles/harmonia.css. These are the
// plain palette, intentionally separate from the semantic tokens (primary,
// negative, etc.). Shared by the chart, rating, and any other component that lets
// the consumer pick from the standard colors.
export const KNOWN_COLORS = ['white', 'black', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'indigo', 'purple', 'pink', 'gray'];

// The chart colors `color-1` to `color-12`.
// Each paints with the theme's `--chart-color-<n>` variable (src/styles/globals.css) through the `<utility>-chart-<n>` classes, so a theme can restyle the charts.
export const CHART_COLORS = Array.from({ length: 12 }, (_, i) => `color-${i + 1}`);

// Resolve a color name to its underlying token (chromatic colors use the 500 <step, chart colors their `chart-<n>` theme key).
export function colorToken(name) {
  if (CHART_COLORS.includes(name)) return name.replace('color-', 'chart-');
  return name === 'white' || name === 'black' ? name : `${name}-500`;
}

export function colorClass(name) {
  return `bg-${colorToken(name)}`;
}

export function fillClass(name) {
  return `fill-${colorToken(name)}`;
}

export function strokeClass(name) {
  return `stroke-${colorToken(name)}`;
}

export function textColorClass(name) {
  return `text-${colorToken(name)}`;
}

export function colorVar(name) {
  // The chart keys are `@theme inline`, so at runtime only `--chart-color-<n>` exists.
  return CHART_COLORS.includes(name) ? `var(--chart-${name})` : `var(--color-${colorToken(name)})`;
}

// Return `name` when it is a known standard color, otherwise `fallback`.
export function resolveColor(name, fallback) {
  return KNOWN_COLORS.includes(name) ? name : fallback;
}
