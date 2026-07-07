// Optional, opt-in plugin: keep Lucide icons in sync with the Alpine/Harmonia
// lifecycle. Place `x-h-lucide` on a placeholder and it renders that one icon
// when Alpine initializes the node - including dynamically added DOM
// (x-h-include, routers like Pinecone-router, x-for) - with no global scans or
// event listeners. Lucide is treated as an external global (`window.lucide`)
// and is never bundled.
//
// Two placeholder forms are supported:
// - `<svg x-h-lucide>`: the icon is rendered INTO the element, which stays in
//   the DOM as the svg root. Because the node is never replaced, Alpine
//   directives on it (x-show, :class, x-transition, @click, ...) keep working.
// - `<i x-h-lucide>` (or any other tag): the element is REPLACED by the
//   rendered <svg>, mirroring Lucide's native createIcons behavior. Alpine
//   bindings cannot survive that replacement, so any other directive on such
//   a placeholder throws; `:data-lucide` is the one exception, because x-bind
//   runs first and the bound name is consumed at render time.

function pascal(name) {
  return String(name)
    .trim()
    .replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase());
}

function kebab(name) {
  return String(name)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function copyAttributes(from, to, skip) {
  for (const attr of [...from.attributes]) {
    if (attr.name === 'data-lucide') continue;
    // Never copy the directive attribute itself onto the rendered svg, or
    // Alpine would re-initialize x-h-lucide on the clone (now missing
    // data-lucide) and report a spurious "no icon name found" error.
    if (skip && attr.name === skip) continue;
    if (attr.name === 'class') {
      const classes = attr.value.split(/\s+/).filter(Boolean);
      if (classes.length) to.classList.add(...classes);
      continue;
    }
    to.setAttribute(attr.name, attr.value);
  }
}

// An Alpine binding on a placeholder that gets replaced would silently die
// with the replaced node, so it is an authoring error (use <svg> instead).
// `:data-lucide` / `x-bind:data-lucide` are exempt: they exist to feed the
// icon name and have done their job before the replacement happens.
function findIncompatibleDirective(el, original) {
  for (const attr of [...el.attributes]) {
    const name = attr.name;
    if (name === original || name === ':data-lucide' || name === 'x-bind:data-lucide') continue;
    if (name.startsWith('x-') || name.startsWith(':') || name.startsWith('@')) return name;
  }
  return null;
}

// Build a rendered lucide <svg> for `name`, detached from the document. Uses
// lucide.createElement when the global provides it; otherwise falls back to a
// createIcons pass scoped to a temporary holder (inserted next to `el` and
// removed again), so siblings are never touched. Returns null on failure.
function buildSvg(el, name) {
  const lucide = window.lucide;
  const node = (lucide.icons && lucide.icons[pascal(name)]) || lucide[pascal(name)];

  // When the icon registry is available and the name is not in it, fail loudly
  // instead of silently leaving the placeholder.
  if (lucide.icons && !node) {
    console.error(`x-h-lucide: unknown Lucide icon "${name}".`);
    return null;
  }

  if (node && typeof lucide.createElement === 'function') {
    const svg = lucide.createElement(node);
    // lucide.createElement only merges the default svg attributes; unlike
    // createIcons/replaceElement it does not add Lucide's identifying classes.
    // Add them so these icons match native Lucide output (`lucide lucide-<name>`).
    svg.classList.add('lucide', 'lucide-icon', `lucide-${kebab(name)}`);
    return svg;
  }

  if (typeof lucide.createIcons === 'function') {
    const parent = el.parentNode;
    if (!parent) return null;
    const holder = document.createElement('span');
    parent.insertBefore(holder, el);
    const temp = document.createElement('i');
    temp.setAttribute('data-lucide', name);
    holder.appendChild(temp);
    lucide.createIcons({ root: holder });
    const svg = holder.firstElementChild;
    holder.remove();
    return svg && svg !== temp ? svg : null;
  }

  console.error(`x-h-lucide: unable to render icon "${name}" - the Lucide global exposes neither createElement nor createIcons.`);
  return null;
}

// Render the icon for `el`. An <svg> placeholder is filled in place; any other
// tag is replaced by the rendered <svg>, mirroring Lucide's native behavior so
// the svg becomes the direct child of Harmonia components (their `[&>svg]` /
// `[&_svg]` selectors target it).
function renderIcon(el, name, original) {
  if (!el.isConnected) return;
  const svg = buildSvg(el, name);
  if (!svg) return;

  if (el.tagName.toLowerCase() === 'svg') {
    // Merge the rendered svg into the placeholder: lucide classes are added to
    // the author's, generated attributes are applied only where the author has
    // not set that attribute, and the icon's shapes become the children.
    for (const attr of [...svg.attributes]) {
      if (attr.name === 'data-lucide') continue;
      if (attr.name === 'class') {
        const classes = attr.value.split(/\s+/).filter(Boolean);
        if (classes.length) el.classList.add(...classes);
        continue;
      }
      if (!el.hasAttribute(attr.name)) el.setAttribute(attr.name, attr.value);
    }
    el.replaceChildren(...svg.childNodes);
    return;
  }

  copyAttributes(el, svg, original);
  el.replaceWith(svg);
}

export default function (Alpine) {
  Alpine.directive('h-lucide', (el, { expression, original }, { evaluate }) => {
    if (typeof window === 'undefined' || !window.lucide) {
      console.error(`${original}: the global "lucide" library is not available. Load Lucide before using x-h-lucide.`);
      return;
    }

    // A non-svg placeholder is replaced by the rendered svg, which would
    // orphan any Alpine binding on it (an x-show, for example, would keep
    // toggling the detached placeholder while the visible icon stays frozen).
    if (el.tagName.toLowerCase() !== 'svg') {
      const incompatible = findIncompatibleDirective(el, original);
      if (incompatible) {
        throw new Error(
          `${original}: "${incompatible}" cannot be used on a <${el.tagName.toLowerCase()}> placeholder, because the element is replaced by the rendered svg and the binding would be lost. Use an <svg x-h-lucide> placeholder instead; it is rendered in place and keeps Alpine directives working.`
        );
      }
    }

    const name = el.getAttribute('data-lucide') || (expression ? evaluate(expression) : null);
    if (!name) {
      console.error(`${original}: no icon name found. Set a "data-lucide" attribute or pass the name as the expression.`);
      return;
    }

    renderIcon(el, String(name), original);
  });
}
