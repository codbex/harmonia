// Named colors for calendar events and slot-picker slots. Each color maps to a
// filled variant (solid background), an outlined variant (border only), and a
// ring class (matching the fill step at 50% opacity) for a selection ring.
//
// These class strings must stay LITERAL here: the standard-palette safelist in
// src/styles/harmonia.css only covers the -500 step, so the -300/-400/-600 steps
// (and the ring/opacity variants) below are generated purely because Tailwind
// scans this file (src/**). Never compose these dynamically (e.g. `bg-${color}-500`)
// or they won't be emitted.
//
// This is intentionally separate from src/common/colors.js, which is the plain
// single-step palette (KNOWN_COLORS, `<utility>-<name>-500`) used by the chart
// and rating components.
export const EVENT_COLORS = {
  blue: { filled: ['bg-blue-500', 'text-white'], outlined: ['border', 'border-blue-500', 'text-blue-600'], ring: 'ring-blue-500/50' },
  red: { filled: ['bg-red-500', 'text-white'], outlined: ['border', 'border-red-500', 'text-red-600'], ring: 'ring-red-500/50' },
  green: { filled: ['bg-green-500', 'text-white'], outlined: ['border', 'border-green-500', 'text-green-600'], ring: 'ring-green-500/50' },
  yellow: { filled: ['bg-yellow-300', 'text-foreground'], outlined: ['border', 'border-yellow-300', 'text-yellow-600'], ring: 'ring-yellow-300/50' },
  purple: { filled: ['bg-purple-500', 'text-white'], outlined: ['border', 'border-purple-500', 'text-purple-600'], ring: 'ring-purple-500/50' },
  pink: { filled: ['bg-pink-400', 'text-white'], outlined: ['border', 'border-pink-400', 'text-pink-600'], ring: 'ring-pink-400/50' },
  indigo: { filled: ['bg-indigo-500', 'text-white'], outlined: ['border', 'border-indigo-500', 'text-indigo-600'], ring: 'ring-indigo-500/50' },
  orange: { filled: ['bg-orange-400', 'text-white'], outlined: ['border', 'border-orange-400', 'text-orange-600'], ring: 'ring-orange-400/50' },
  gray: { filled: ['bg-gray-400', 'text-white'], outlined: ['border', 'border-gray-400', 'text-gray-600'], ring: 'ring-gray-400/50' },
  teal: { filled: ['bg-teal-400', 'text-white'], outlined: ['border', 'border-teal-400', 'text-teal-600'], ring: 'ring-teal-400/50' },
};

export function colorClasses(color, status) {
  const palette = EVENT_COLORS[color] || EVENT_COLORS.blue;
  if (status === 'unconfirmed') return palette.outlined;
  // 'rejected' looks like 'unconfirmed' but with a dashed border. Spread so the
  // shared palette.outlined array is never mutated; 'border-dashed' stays a literal
  // (also safelisted in src/styles/harmonia.css) so Tailwind emits it.
  if (status === 'rejected') return [...palette.outlined, 'border-dashed'];
  return palette.filled;
}

// The color-matched selection ring class (fill step at 50% opacity).
export function ringClass(color) {
  return (EVENT_COLORS[color] || EVENT_COLORS.blue).ring;
}
