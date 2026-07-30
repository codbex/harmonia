import { findAncestorState } from '../common/ancestor';
import { disabledControlClasses } from '../common/shared-classes';
import { FAB_SCROLL_THRESHOLD, fabScrollOffset, fabScrollTiming, isFabScrollTarget } from './fab';

// Positioning is opt-in. Without data-position the bar stays in normal flow, so
// an app shell can place it as the last row of its own layout. 'sticky' reserves
// its own height and survives a transformed ancestor, so it is the default choice.
// 'fixed' is for a bar that has to escape an ancestor clipping it.
export const bottomNavPositions = {
  sticky: ['sticky', 'z-10', 'bottom-0'],
  fixed: ['fixed', 'z-50', 'inset-x-0', 'bottom-0'],
  static: [],
};

// The two modes that dock the bar to the bottom, as opposed to leaving it in flow.
export const bottomNavDockedPositions = ['sticky', 'fixed'];

// A floating bar is a detached card, so it trades the docked bar's top border for
// a full border, a radius and an elevation, matching the floating toolbar and tab bar.
export const bottomNavFloatingClasses = ['data-[floating=true]:rounded-lg', 'data-[floating=true]:border', 'data-[floating=true]:shadow-xs', '[&:not([data-floating=true])]:border-t'];

// Padding for the area a phone reserves below the bar (the iOS home indicator).
// Only a docked bar sits in that region, so a bar left in flow gets none. Written
// as a literal because Tailwind only scans 'src', which is what makes the
// arbitrary variant reach the shipped stylesheet.
export const bottomNavSafeAreaClasses = ['data-[position=sticky]:pb-[env(safe-area-inset-bottom)]', 'data-[position=fixed]:pb-[env(safe-area-inset-bottom)]'];

// Off-screen state for 'data-hide-on-scroll'. 'translate-y-full' only clears a bar
// flush with the bottom edge, so a floating one fades out the gap it was lifted by,
// as the fab does. 'pointer-events-none' keeps it from swallowing taps on the way out.
export const bottomNavHiddenClasses = ['translate-y-full', 'pointer-events-none', 'data-[floating=true]:opacity-0'];

export const getBottomNavPosition = (position) => bottomNavPositions[position] ?? bottomNavPositions.static;

// 'true' follows the page, any other non-empty value is an expression naming the
// scrolling element. It arrives as an attribute because the directive's own
// expression is already taken by the active value.
export const isBottomNavScrollEnabled = (value) => typeof value === 'string' && value !== '' && value !== 'false';

export default function (Alpine) {
  Alpine.directive('h-bottom-nav', (el, { original, expression }, { cleanup, evaluate }) => {
    if (el.tagName !== 'NAV') {
      throw new Error(`${original} must be a nav element`);
    }
    if (!el.hasAttribute('aria-label')) {
      throw new Error(`${original} must have an "aria-label" attribute`);
    }

    el.classList.add(
      'group/bottom-nav',
      'bg-object-header',
      'text-object-header-foreground',
      'shrink-0',
      'w-full',
      'h-bottom-nav',
      // Tailwind's translate utilities set the 'translate' property, not
      // 'transform', so naming only 'transform' would animate nothing.
      'transition-[translate,opacity]',
      'motion-reduce:transition-none',
      ...bottomNavFloatingClasses,
      ...bottomNavSafeAreaClasses
    );
    el.setAttribute('data-slot', 'bottom-nav');

    if (!el.hasAttribute('data-position')) {
      el.setAttribute('data-position', 'static');
    }

    // Stored as the expression string rather than a snapshot so items can read it
    // reactively and assign back through it, as the step indicator does.
    el._h_bottom_nav = {
      expression,
      setValue(value) {
        if (!expression) return;
        evaluate(`${expression} = __h_bottom_nav_value`, { scope: { __h_bottom_nav_value: value } });
      },
    };

    let lastPosition;

    function setPosition(position = 'static') {
      el.classList.remove(...getBottomNavPosition(lastPosition));
      el.classList.add(...getBottomNavPosition(position));
      lastPosition = position;
    }

    // Hide on scroll. A null 'scrollTarget' means the behavior is off, which is
    // what every guard below tests.
    let scrollTarget = null;
    let lastOffset = 0;
    let frame = 0;
    let scrolledAway = false;

    function resolveScrollTarget(value) {
      if (value === 'true') return el.ownerDocument.defaultView;
      const target = evaluate(value);
      if (!isFabScrollTarget(target)) {
        console.error(`${original}: data-hide-on-scroll must be "true" for the page, or an expression naming the scrolling element, for example data-hide-on-scroll="$refs.panel"`, el);
        return null;
      }
      return target;
    }

    // While away the bar leaves the tab order and the accessibility tree, so nobody
    // reaches a destination they cannot see. Unlike 'hidden' it stays rendered, so
    // the slide animates.
    function setScrolledAway(next) {
      if (next === scrolledAway) return;
      scrolledAway = next;
      if (next) {
        el.classList.add(...bottomNavHiddenClasses);
        el.setAttribute('inert', '');
        el.setAttribute('aria-hidden', 'true');
      } else {
        el.classList.remove(...bottomNavHiddenClasses);
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
    }

    // Compared against the last decision rather than the last event, so a slow drag
    // accumulates to the threshold instead of never tripping it.
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

    // Coalesce a burst of scroll events into a single frame, keeping the leading
    // edge so the first frame's decision is what reads as responsive.
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

    function setHideOnScroll(value) {
      // Always detach first, so retargeting cannot leave a stale listener behind
      // or measure the next target against the previous offset.
      detachScroll();
      if (!isBottomNavScrollEnabled(value)) return;
      const target = resolveScrollTarget(value);
      if (!target) return;
      scrollTarget = target;
      lastOffset = fabScrollOffset(target);
      el.classList.add(...fabScrollTiming);
      // The handler never calls preventDefault, so saying so up front keeps
      // scrolling off the main thread.
      target.addEventListener('scroll', onScroll, { passive: true });
    }

    setPosition(el.getAttribute('data-position') ?? 'static');
    setHideOnScroll(el.getAttribute('data-hide-on-scroll'));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-hide-on-scroll') setHideOnScroll(el.getAttribute('data-hide-on-scroll'));
        else setPosition(el.getAttribute('data-position') ?? 'static');
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-position', 'data-hide-on-scroll'] });

    cleanup(() => {
      observer.disconnect();
      detachScroll();
    });
  });

  Alpine.directive('h-bottom-nav-list', (el, { original }, { Alpine }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be a ul element`);
    }
    if (!findAncestorState(Alpine, el, '_h_bottom_nav')) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-bottom-nav')} element`);
    }

    el.classList.add('flex', 'w-full', 'list-none', 'items-stretch', 'justify-around', 'p-0', 'h-full', 'group-data-[floating=true]/bottom-nav:overflow-hidden', 'group-data-[floating=true]/bottom-nav:rounded-lg');
    el.setAttribute('data-slot', 'bottom-nav-list');
  });

  Alpine.directive('h-bottom-nav-item', (el, { original, expression }, { Alpine, effect, evaluateLater }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }
    if (el.parentElement?.getAttribute('data-slot') !== 'bottom-nav-list') {
      throw new Error(`${original} must be a direct child of a ${Alpine.prefixed('h-bottom-nav-list')} element`);
    }

    const root = findAncestorState(Alpine, el, '_h_bottom_nav');
    if (!root) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-bottom-nav')} element`);
    }

    el.classList.add('group/bottom-nav-item', 'flex', 'min-w-0', 'flex-1');
    el.setAttribute('data-slot', 'bottom-nav-item');

    // An expression evaluated in the element's scope rather than a literal, so items
    // generated with x-for resolve. Kept here for the link to write back on click.
    el._h_bottom_nav_item = Alpine.reactive({ value: undefined });

    const activeExpression = root._h_bottom_nav.expression;

    // With no expression on the bar there is nothing to compare against, so
    // 'data-active' is left to the consumer and the styling still works.
    if (!expression || !activeExpression) return;

    const getValue = evaluateLater(expression);
    const getActive = evaluateLater(activeExpression);

    effect(() => {
      getValue((value) => {
        el._h_bottom_nav_item.value = value;
        getActive((active) => {
          if (active === value) el.setAttribute('data-active', 'true');
          else el.removeAttribute('data-active');
        });
      });
    });
  });

  Alpine.directive('h-bottom-nav-link', (el, { original }, { Alpine, cleanup }) => {
    if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be an anchor or button element`);
    } else if (el.tagName === 'BUTTON') {
      el.setAttribute('type', 'button');
    }

    const item = findAncestorState(Alpine, el, '_h_bottom_nav_item');
    if (!item) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-bottom-nav-item')} element`);
    }
    const root = findAncestorState(Alpine, el, '_h_bottom_nav');

    el.classList.add(
      // 'relative' anchors a nested badge indicator to the destination.
      'relative',
      'flex',
      'min-w-0',
      'flex-1',
      'cursor-pointer',
      'flex-col',
      'items-center',
      'justify-center',
      'gap-1',
      'px-1',
      'text-xs',
      'font-medium',
      'text-muted-foreground',
      'no-underline',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'focus-outline',
      'hover:bg-secondary-hover',
      'hover:text-secondary-foreground',
      'group-data-[active=true]/bottom-nav-item:text-primary',
      'group-data-[active=true]/bottom-nav-item:bg-secondary',
      'group-data-[active=true]/bottom-nav-item:hover:text-primary-hover',
      'group-data-[active=true]/bottom-nav-item:font-semibold',
      'svg-defaults',
      // Larger than the default, since a destination reads at a glance from its
      // icon. An explicit size on the icon still wins.
      "[&_svg:not([class*='size-'])]:size-6",
      ...disabledControlClasses
    );
    el.setAttribute('data-slot', 'bottom-nav-link');

    // With the labels hidden the destination has no visible text left, so it
    // needs a name from the author.
    if (root?.getAttribute('data-labels') === 'false' && !el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      console.error(`${original}: destinations in an icon-only bottom navigation must have an "aria-label" or "aria-labelledby" attribute`, el);
    }

    // The flag lives on the item so one group can style both the icon and the
    // label, but 'aria-current' belongs on the link that is the destination.
    function syncActive() {
      if (item.getAttribute('data-active') === 'true') {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    }

    syncActive();

    const observer = new MutationObserver(syncActive);
    observer.observe(item, { attributes: true, attributeFilter: ['data-active'] });

    // On an anchor the href is the navigation and this only keeps the highlight
    // in sync, so the default is never prevented.
    function onClick() {
      const value = item._h_bottom_nav_item.value;
      if (value === undefined) return;
      root?._h_bottom_nav.setValue(value);
      el.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true }));
    }

    el.addEventListener('click', onClick);

    cleanup(() => {
      observer.disconnect();
      el.removeEventListener('click', onClick);
    });
  });

  Alpine.directive('h-bottom-nav-label', (el) => {
    el.classList.add('w-full', 'truncate', 'text-center', 'select-none', 'group-data-[labels=false]/bottom-nav:hidden');
    el.setAttribute('data-slot', 'bottom-nav-label');
  });
}
