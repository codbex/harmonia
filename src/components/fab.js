import { buttonVariants, setButtonClasses } from './button';

export const fabSizes = {
  sm: ['size-10', "[&>svg:not([class*='size-'])]:size-5"],
  lg: ['size-14', "[&>svg:not([class*='size-'])]:size-8"],
  extended: ['h-10', 'px-4', 'gap-2', 'text-base', "[&>svg:not([class*='size-'])]:size-4"],
  default: ['size-12', "[&>svg:not([class*='size-'])]:size-6"],
};

//  Positioning is opt-in. Without data-position the button stays in
// normal flow so a surrounding layout can place it.
export const fabPositions = {
  'bottom-left': ['fixed', 'bottom-4', 'left-4', 'z-10'],
  'bottom-right': ['fixed', 'bottom-4', 'right-4', 'z-10'],
  static: [],
};

// 'round' trades the shared control radius for a full one, turning the circular
// sizes into circles and giving the extended pill stadium ends.
export const fabShapes = {
  round: ['rounded-full'],
  default: ['rounded-control'],
};

// Off-screen state for 'data-hide-on-scroll'. 'translate-y-full' alone only
// moves the button down by its own height, which leaves the 1rem 'bottom-4' gap
// of it still on screen, so 'opacity-0' fades that sliver out on the same curve.
// 'pointer-events-none' keeps the invisible button from swallowing taps.
export const fabHiddenClasses = ['translate-y-full', 'opacity-0', 'pointer-events-none'];

// The slide runs on the 'transition-all' the shared button classes already
// bring, so only the timing changes. 100ms reads as a snap over that distance.
export const fabScrollTiming = ['duration-200', 'ease-out'];

// Scroll deltas below this many pixels are ignored, so trackpad jitter and the
// scroll anchoring that follows a layout shift cannot flap the button.
export const FAB_SCROLL_THRESHOLD = 8;

export const getFabSize = (size) => fabSizes[size] ?? fabSizes.default;

export const getFabPosition = (position) => fabPositions[position] ?? fabPositions.static;

export const getFabShape = (shape) => fabShapes[shape] ?? fabShapes.default;

// Only the circular sizes are icon-only and so need an author-supplied
// accessible name. 'extended' carries a visible label.
export const fabNeedsLabel = (size) => size !== 'extended';

// Anything that can be scrolled and watched - a window (scrollY) or an element
// (scrollTop). Guards against an expression that resolved to something else.
export const isFabScrollTarget = (target) => !!target && (typeof target.scrollY === 'number' || typeof target.scrollTop === 'number');

// Current offset of either kind of target, clamped at zero so the negative
// offset iOS reports while rubber-banding past the top cannot read as a
// direction change on release.
export const fabScrollOffset = (target) => {
  if (!isFabScrollTarget(target)) return 0;
  return Math.max(0, typeof target.scrollY === 'number' ? target.scrollY : target.scrollTop);
};

export default function (Alpine) {
  Alpine.directive('h-fab', (el, { original, expression }, { cleanup, evaluate }) => {
    setButtonClasses(el);
    el.classList.add('shadow-md');

    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'fab');
    }

    let lastSize;
    let lastPosition;
    let lastShape;

    function setVariant(variant) {
      for (const [_, value] of Object.entries(buttonVariants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(buttonVariants, variant)) el.classList.add(...buttonVariants[variant]);
      // Most variants carry 'shadow-button' (and 'transparent' carries
      // 'shadow-none'), both of which would fight the fab's own elevation.
      el.classList.remove('shadow-button', 'shadow-none');
    }

    function setSize(size = 'default') {
      el.classList.remove(...getFabSize(lastSize));
      el.classList.add(...getFabSize(size));
      if (fabNeedsLabel(size) && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
        console.error(`${original}: Icon-only floating action buttons must have an "aria-label" or "aria-labelledby" attribute`, el);
      }
      lastSize = size;
    }

    function setPosition(position = 'static') {
      el.classList.remove(...getFabPosition(lastPosition));
      el.classList.add(...getFabPosition(position));
      lastPosition = position;
    }

    function setShape(shape = 'default') {
      el.classList.remove(...getFabShape(lastShape));
      el.classList.add(...getFabShape(shape));
      lastShape = shape;
    }

    // Hide on scroll. State for the attached target. Behavior is off whenever
    // the 'scrollTarget' is null, which is what every guard below tests.
    let scrollTarget = null;
    let lastOffset = 0;
    let frame = 0;
    let scrolledAway = false;

    // The scrolling element comes from the directive expression, so an author
    // names it with Alpine's own tools ('x-h-fab="$refs.panel"'). It is never
    // inferred from the ancestors. The button is often a sibling of the scroller
    // rather than inside it and guessing wrong would watch the whole page.
    // Without an expression the page itself scrolls.
    function resolveScrollTarget() {
      if (!expression) return el.ownerDocument.defaultView;
      const target = evaluate(expression);
      if (!isFabScrollTarget(target)) {
        console.error(`${original}: the expression must resolve to the scrolling element, for example x-h-fab="$refs.panel"`, el);
        return null;
      }
      return target;
    }

    // Slide the button away or back. While it is away it also leaves the tab
    // order and the accessibility tree, so nobody is sent to a button they
    // cannot see. Unlike 'hidden' this keeps the element rendered, so the slide
    // still animates.
    function setScrolledAway(next) {
      if (next === scrolledAway) return;
      scrolledAway = next;
      if (next) {
        el.classList.add(...fabHiddenClasses);
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.classList.remove(...fabHiddenClasses);
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    }

    // Compare against the offset of the last decision rather than the last
    // event, so a slow drag keeps accumulating until it passes the threshold
    // instead of never tripping it.
    //
    // Only the top of the range overrides the direction. Arriving at offset 0 is
    // itself an upward gesture, so showing there agrees with the delta. The
    // bottom deliberately gets no such rule - reaching it is the end of a
    // downward scroll, and popping the button back exactly as someone finishes
    // scrolling it away reads as a glitch.
    function evaluateScroll() {
      frame = 0;
      if (!scrollTarget) return;
      const offset = fabScrollOffset(scrollTarget);
      if (offset <= 0) {
        lastOffset = offset;
        setScrolledAway(false);
        return;
      }
      const delta = offset - lastOffset;
      if (Math.abs(delta) < FAB_SCROLL_THRESHOLD) return;
      lastOffset = offset;
      setScrolledAway(delta > 0);
    }

    // Coalesce a burst of scroll events into a single frame. This keeps the
    // leading edge, unlike the trailing-edge shape in 'h-responsive', because
    // here the first frame's decision is what reads as responsive.
    function onScroll() {
      if (frame) return;
      if (typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(evaluateScroll);
      else evaluateScroll();
    }

    function detachScroll() {
      if (frame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
      frame = 0;
      if (scrollTarget) scrollTarget.removeEventListener('scroll', onScroll);
      scrollTarget = null;
      el.classList.remove(...fabScrollTiming);
      setScrolledAway(false);
    }

    function setHideOnScroll(enabled) {
      // Always detach first, so retargeting cannot leave a stale listener
      // behind or measure the next target against the previous offset.
      detachScroll();
      if (!enabled) return;
      const target = resolveScrollTarget();
      if (!target) return;
      scrollTarget = target;
      lastOffset = fabScrollOffset(target);
      el.classList.add(...fabScrollTiming);
      // The handler never calls preventDefault, so saying so up front keeps
      // scrolling off the main thread.
      target.addEventListener('scroll', onScroll, { passive: true });
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');
    setSize(el.getAttribute('data-size') ?? 'default');
    setPosition(el.getAttribute('data-position') ?? 'static');
    setShape(el.getAttribute('data-shape') ?? 'default');
    setHideOnScroll(el.getAttribute('data-hide-on-scroll') === 'true');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-variant') setVariant(el.getAttribute('data-variant') ?? 'default');
        else if (mutation.attributeName === 'data-position') setPosition(el.getAttribute('data-position') ?? 'static');
        else if (mutation.attributeName === 'data-shape') setShape(el.getAttribute('data-shape') ?? 'default');
        else if (mutation.attributeName === 'data-hide-on-scroll') setHideOnScroll(el.getAttribute('data-hide-on-scroll') === 'true');
        else setSize(el.getAttribute('data-size') ?? 'default');
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-size', 'data-position', 'data-shape', 'data-hide-on-scroll'] });

    cleanup(() => {
      observer.disconnect();
      detachScroll();
    });
  });
}
