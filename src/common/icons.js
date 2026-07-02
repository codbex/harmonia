import { iconPaths } from './icon-data';

// Re-export the generated name constants (Calendar, ChevronRight, ...) and the
// iconPaths map. Icons themselves are the .svg files in icons/; icon-data.js is
// generated from them by scripts/generate-icons.cjs.
export * from './icon-data';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Append an icon's drawable children (paths/circles/...) to an existing svg.
// `name` is a kebab icon name; an unknown or missing name appends nothing.
function appendIconChildren(svg, name) {
  const parts = iconPaths[name];
  if (!parts) return;
  for (const { tag, attrs } of parts) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [key, value] of Object.entries(attrs)) {
      node.setAttributeNS(null, key, value);
    }
    svg.appendChild(node);
  }
}

export function createSvg({ icon, classes = 'size-4', attrs } = {}) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttributeNS(null, 'width', '16');
  svg.setAttributeNS(null, 'height', '16');
  svg.setAttributeNS(null, 'viewBox', '0 0 16 16');
  svg.setAttributeNS(null, 'fill', 'currentColor');
  svg.setAttributeNS(null, 'class', classes);

  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      svg.setAttributeNS(null, key, value);
    }
  }

  appendIconChildren(svg, icon);

  return svg;
}

export function setSvgContent(svg, icon) {
  svg.setAttribute('xmlns', SVG_NS);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.setAttribute('fill', 'currentColor');

  appendIconChildren(svg, icon);
}
