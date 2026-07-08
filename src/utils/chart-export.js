// Chart image export. Charts render as a single inline SVG styled by classes
// and CSS variables, so exporting means cloning that SVG and resolving the
// computed presentation values onto attributes - the result is a standalone,
// scalable file that needs no stylesheet.

// Presentation properties to resolve. Shapes need paint and stroke geometry;
// text additionally needs its font.
const SHAPE_PROPERTIES = ['fill', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-linejoin', 'stroke-linecap', 'opacity', 'fill-opacity', 'paint-order'];
const TEXT_PROPERTIES = [...SHAPE_PROPERTIES, 'font-size', 'font-family', 'font-weight'];

// Values equal to the SVG default are skipped to keep the output lean.
const DEFAULTS = {
  opacity: '1',
  'fill-opacity': '1',
  'stroke-opacity': '1',
  stroke: 'none',
  'stroke-linejoin': 'miter',
  'stroke-linecap': 'butt',
  'paint-order': 'normal',
  'font-weight': '400',
};

function resolveStyles(source, target) {
  if (source.nodeType === Node.ELEMENT_NODE && source.tagName !== 'title') {
    const computed = getComputedStyle(source);
    const properties = source.tagName === 'text' ? TEXT_PROPERTIES : SHAPE_PROPERTIES;
    for (const property of properties) {
      const value = computed.getPropertyValue(property);
      if (value && value !== DEFAULTS[property]) target.setAttribute(property, value);
    }
    target.removeAttribute('class');
  }
  for (let i = 0; i < source.childNodes.length; i++) {
    resolveStyles(source.childNodes[i], target.childNodes[i]);
  }
}

// The canvas color painted behind the chart. `undefined` resolves to the
// theme background; `null` or 'transparent' keeps the export transparent;
// any other string is used as-is.
function resolveBackground(el, background) {
  if (background === null || background === 'transparent') return null;
  if (typeof background === 'string') return background;
  const themeBackground = getComputedStyle(el).getPropertyValue('--background').trim();
  return themeBackground || '#ffffff';
}

function chartSvgOf(el) {
  if (!el || typeof el.getAttribute !== 'function' || el.getAttribute('data-slot') !== 'chart') {
    throw new Error('chart export expects a chart element (an element with a x-h-chart-* directive)');
  }
  const svg = el.querySelector('[data-slot=chart-svg]');
  if (!svg) {
    throw new Error('the chart has no drawn content to export');
  }
  return svg;
}

/**
 * Serialize a chart to standalone SVG markup. `el` is the element carrying
 * the `x-h-chart-*` directive. Options: `background` (defaults to the theme
 * background; pass `null` for transparent or any CSS color).
 */
export function chartToSvg(el, options = {}) {
  const svg = chartSvgOf(el);
  const clone = svg.cloneNode(true);
  resolveStyles(svg, clone);

  const width = svg.getAttribute('width');
  const height = svg.getAttribute('height');
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('viewBox', `0 0 ${width} ${height}`);
  clone.removeAttribute('aria-hidden');
  clone.removeAttribute('data-slot');

  const background = resolveBackground(el, options.background);
  if (background) {
    const rect = clone.ownerDocument.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', '100%');
    rect.setAttribute('height', '100%');
    rect.setAttribute('fill', background);
    clone.insertBefore(rect, clone.firstChild);
  }
  return new XMLSerializer().serializeToString(clone);
}

/**
 * Rasterize a chart to an image data URL. Options: `scale` (pixel density,
 * default 2), `background` (as in `chartToSvg`), `type` (default 'image/png')
 * and `quality`, passed to `toDataURL`.
 */
export function chartToImage(el, options = {}) {
  const svg = chartSvgOf(el);
  const width = Number(svg.getAttribute('width'));
  const height = Number(svg.getAttribute('height'));
  const scale = typeof options.scale === 'number' && options.scale > 0 ? options.scale : 2;
  const markup = chartToSvg(el, options);

  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const context = canvas.getContext('2d');
      context.scale(scale, scale);
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL(options.type || 'image/png', options.quality));
    };
    image.onerror = () => reject(new Error('the chart SVG could not be rasterized'));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });
}
