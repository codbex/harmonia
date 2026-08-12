// The cut-out is drawn with clip-path: path(), whose coordinates are unitless
// user units, so this is the one piece of geometry that stays in px.
const CUTOUT_GAP = 0.125;
// How far past the host the kept region reaches. Large enough that nothing the
// host paints outside itself (border, focus outline, shadow) and nothing it
// contains is clipped away with it, so only the gap is ever removed.
const CUTOUT_REACH = 10000;

const round = (value) => Math.round(value * 100) / 100;

// A stadium (a rectangle with semicircular ends) collapses into a circle when
// w === h, so dots and count pills share one shape. The winding direction is
// what turns the outer stadium into a hole. Under the default nonzero fill rule
// a counter-clockwise subpath inside a clockwise one cancels it out.
function stadium(x, y, w, h, clockwise) {
  const r = Math.min(w, h) / 2;
  const left = round(x + r);
  const right = round(x + w - r);
  const top = round(y);
  const bottom = round(y + h);
  const arc = `A${round(r)} ${round(r)} 0 0`;
  return clockwise ? `M${left} ${top}H${right}${arc} 1 ${right} ${bottom}H${left}${arc} 1 ${left} ${top}Z` : `M${left} ${top}${arc} 0 ${left} ${bottom}H${right}${arc} 0 ${right} ${top}Z`;
}

// Carves a gap out of the host around every indicator it hosts, so the
// indicator reads as a hole and stays legible on a host of its own color.
// Only the gap is removed, never the indicator itself, which sits inside the
// hole's inner edge and so survives its own parent's clip.
// Measured from the layout box, never getBoundingClientRect: clip-path
// coordinates live in the host's own untransformed space, so a scaled ancestor
// (the dialog opens its panel at scale(0.95)) would skew a rect-derived hole,
// and a transform resizes nothing, so the resize observer would never correct it.
function updateCutout(host) {
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const gap = CUTOUT_GAP * rootSize;
  let holes = '';
  if (host.offsetWidth && host.offsetHeight) {
    for (const indicator of host._h_badge_cutout) {
      // Null offsetParent covers a hidden indicator (x-show) and a host that is
      // not the element the indicator is positioned against, where offsetLeft
      // would be measured from the wrong origin.
      if (indicator.offsetParent !== host) continue;
      const w = indicator.offsetWidth;
      const h = indicator.offsetHeight;
      if (!w || !h) continue;
      // offsetLeft/offsetTop start at the host's padding box, clip-path's
      // reference box at its border box.
      const x = indicator.offsetLeft + host.clientLeft;
      const y = indicator.offsetTop + host.clientTop;
      holes += stadium(x - gap, y - gap, w + gap * 2, h + gap * 2, false) + stadium(x, y, w, h, true);
    }
  }
  if (!holes) {
    host.style.clipPath = '';
    return;
  }
  const outer = `M${-CUTOUT_REACH} ${-CUTOUT_REACH}H${round(host.offsetWidth + CUTOUT_REACH)}V${round(host.offsetHeight + CUTOUT_REACH)}H${-CUTOUT_REACH}Z`;
  host.style.clipPath = `path("${outer}${holes}")`;
}

export default function (Alpine) {
  Alpine.directive('h-badge', (el, _, { cleanup }) => {
    el.classList.add(
      '[a&]:cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'border',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-medium',
      'w-fit',
      'whitespace-nowrap',
      'shrink-0',
      '[&>svg]:size-3',
      'gap-1',
      '[&>svg]:pointer-events-none',
      'focus-ring',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'overflow-hidden'
    );
    el.setAttribute('data-slot', 'badge');
    const variants = {
      default: ['border-transparent', 'bg-secondary', 'text-secondary-foreground', '[a&]:hover:bg-secondary-hover', '[a&]:active:bg-secondary-active'],
      primary: ['border-transparent', 'bg-primary', 'text-primary-foreground', '[a&]:hover:bg-primary-hover', '[a&]:active:bg-primary-active'],
      positive: ['border-transparent', 'bg-positive', 'text-positive-foreground', '[a&]:hover:bg-positive-hover', '[a&]:active:bg-positive-active'],
      negative: ['border-transparent', 'bg-negative', 'text-negative-foreground', '[a&]:hover:bg-negative-hover', '[a&]:active:bg-negative-active'],
      warning: ['border-transparent', 'bg-warning', 'text-warning-foreground', '[a&]:hover:bg-warning-hover', '[a&]:active:bg-warning-active'],
      information: ['border-transparent', 'bg-information', 'text-information-foreground', '[a&]:hover:bg-information-hover', '[a&]:active:bg-information-active'],
      outline: ['bg-transparent', 'text-foreground', '[a&]:hover:bg-secondary', '[a&]:hover:text-secondary-foreground', '[a&]:active:bg-secondary-active'],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'default');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-badge-indicator', (el, _, { cleanup }) => {
    el.classList.add(
      'absolute',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'py-0.5',
      'px-1',
      'font-bold',
      'leading-none',
      'transform-gpu',
      'data-[dot=true]:p-0',
      'data-[ping=true]:before:absolute',
      'data-[ping=true]:before:inline-flex',
      'data-[ping=true]:before:w-full',
      'data-[ping=true]:before:h-full',
      'data-[ping=true]:before:rounded-full',
      'data-[ping=true]:before:opacity-75',
      'data-[ping=true]:before:animate-ping'
    );
    el.setAttribute('data-slot', 'badge-indicator');
    const variants = {
      primary: ['bg-primary', 'text-primary-foreground', 'data-[ping=true]:before:bg-primary'],
      positive: ['bg-positive', 'text-positive-foreground', 'data-[ping=true]:before:bg-positive'],
      negative: ['bg-negative', 'text-negative-foreground', 'data-[ping=true]:before:bg-negative'],
      warning: ['bg-warning', 'text-warning-foreground', 'data-[ping=true]:before:bg-warning'],
      information: ['bg-information', 'text-information-foreground', 'data-[ping=true]:before:bg-information'],
    };

    const positions = {
      'top-right': ['-end-0.75', '-top-0.75', '[.rounded-full>&]:-end-0.25', '[.rounded-full>&]:-top-0.25'],
      'top-left': ['-start-0.75', '-top-0.75', '[.rounded-full>&]:-start-0.25', '[.rounded-full>&]:-top-0.25'],
      'bottom-left': ['-start-0.75', '-bottom-0.75', '[.rounded-full>&]:-start-0.25', '[.rounded-full>&]:-bottom-0.25'],
      'bottom-right': ['-end-0.75', '-bottom-0.75', '[.rounded-full>&]:-end-0.25', '[.rounded-full>&]:-bottom-0.25'],
    };

    const sizes = {
      default: { regular: ['h-4', 'min-w-4', 'text-xs'], dot: ['h-3', 'min-w-3'] },
      sm: { regular: ['h-3', 'min-w-3', 'text-2xs'], dot: ['h-2.5', 'min-w-2.5'] },
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
    }

    function setPosition(position) {
      for (const [_, value] of Object.entries(positions)) {
        el.classList.remove(...value);
      }
      el.classList.add(...(positions[position] ?? positions['top-right']));
    }

    function setSize() {
      el.classList.remove('h-4', 'min-w-4', 'h-3', 'min-w-3', 'h-2.5', 'min-w-2.5', 'text-xs', 'text-2xs');
      const size = sizes[el.getAttribute('data-size')] ?? sizes.default;
      el.classList.add(...(el.getAttribute('data-dot') === 'true' ? size.dot : size.regular));
    }

    setVariant(el.getAttribute('data-variant') ?? 'primary');
    setPosition(el.getAttribute('data-position') ?? 'top-right');
    setSize();

    // Several indicators can share a host, so they register on it and the clip
    // is rebuilt from all of them at once rather than each overwriting the last.
    const host = el.parentElement;
    let resizeObserver;
    if (host) {
      if (!host._h_badge_cutout) host._h_badge_cutout = new Set();
      host._h_badge_cutout.add(el);
      resizeObserver = new ResizeObserver(() => updateCutout(host));
      resizeObserver.observe(host);
      resizeObserver.observe(el);
    }

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'primary');
      setPosition(el.getAttribute('data-position') ?? 'top-right');
      setSize();
      // A position change moves the indicator without resizing it, so the
      // resize observer would not fire.
      if (host) updateCutout(host);
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-position', 'data-size', 'data-dot'] });

    cleanup(() => {
      observer.disconnect();
      if (host) {
        resizeObserver.disconnect();
        host._h_badge_cutout.delete(el);
        updateCutout(host);
      }
    });
  });
}
