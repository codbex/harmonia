// Optional, opt-in plugin: keep Lucide icons in sync with the Alpine/Harmonia
// lifecycle. Place `x-h-lucide` on a Lucide placeholder and it renders that one
// icon when Alpine initializes the node - including dynamically added DOM
// (x-h-include, routers like Pinecone-router, x-for) - with no global scans or
// event listeners. Lucide is treated as an external global (`window.lucide`)
// and is never bundled.

function pascal(name) {
  return String(name)
    .trim()
    .replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase());
}

function copyAttributes(from, to) {
  for (const attr of [...from.attributes]) {
    if (attr.name === 'data-lucide') continue;
    if (attr.name === 'class') {
      const classes = attr.value.split(/\s+/).filter(Boolean);
      if (classes.length) to.classList.add(...classes);
      continue;
    }
    to.setAttribute(attr.name, attr.value);
  }
}

// Render a single Lucide icon for `el` and replace `el` with the resulting
// <svg>, mirroring Lucide's native behavior so the svg becomes the direct child
// of Harmonia components (their `[&>svg]` / `[&_svg]` selectors target it).
function renderIcon(el, name) {
  if (!el.isConnected) return;
  const lucide = window.lucide;
  const node = (lucide.icons && lucide.icons[pascal(name)]) || lucide[pascal(name)];

  // When the icon registry is available and the name is not in it, fail loudly
  // instead of silently leaving the placeholder.
  if (lucide.icons && !node) {
    console.error(`x-h-lucide: unknown Lucide icon "${name}".`);
    return;
  }

  if (node && typeof lucide.createElement === 'function') {
    const svg = lucide.createElement(node);
    copyAttributes(el, svg);
    el.replaceWith(svg);
    return;
  }

  // Fallback for globals without `createElement`: scope `createIcons` to a
  // temporary holder that contains only `el`, so siblings are never touched.
  if (typeof lucide.createIcons === 'function') {
    const parent = el.parentNode;
    if (!parent) return;
    const holder = document.createElement('span');
    parent.insertBefore(holder, el);
    holder.appendChild(el);
    el.setAttribute('data-lucide', name);
    lucide.createIcons({ root: holder });
    const svg = holder.firstElementChild;
    if (svg) holder.replaceWith(svg);
    else holder.remove();
    return;
  }

  console.error(`x-h-lucide: unable to render icon "${name}" - the Lucide global exposes neither createElement nor createIcons.`);
}

export default function (Alpine) {
  Alpine.directive('h-lucide', (el, { expression, original }, { evaluate }) => {
    if (typeof window === 'undefined' || !window.lucide) {
      console.error(`${original}: the global "lucide" library is not available. Load Lucide before using x-h-lucide.`);
      return;
    }

    const name = el.getAttribute('data-lucide') || (expression ? evaluate(expression) : null);
    if (!name) {
      console.error(`${original}: no icon name found. Set a "data-lucide" attribute or pass the name as the expression.`);
      return;
    }

    renderIcon(el, String(name));
  });
}
