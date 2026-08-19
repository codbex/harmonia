import { findAncestorState } from '../common/ancestor';
import { isDisabled } from '../common/disabled';
import { disabledControlClasses } from '../common/shared-classes';
import { buttonVariants, setButtonClasses } from './button';

// Orientation and floating cross rather than layer, so each combination gets its
// own class list. Any property written by more than one state lives entirely in
// these maps. The classes have equal specificity, so a half-static property would
// be decided by stylesheet order instead of by the state.
const stateKey = (vertical, floating) => `${vertical ? 'vertical' : 'horizontal'}-${floating ? 'floating' : 'docked'}`;

// Removes every state first, so the element cannot accumulate a stale set.
function applyStateClasses(el, classes, vertical, floating) {
  for (const set of Object.values(classes)) {
    el.classList.remove(...set);
  }
  el.classList.add(...classes[stateKey(vertical, floating)]);
}

// data-size only affects the docked horizontal bar, so the size variants appear
// on that key alone rather than being excluded by a selector.
const tabBarStateClasses = {
  'horizontal-docked': ['flex-row', 'h-10', 'min-h-10', 'data-[size=sm]:h-8', 'data-[size=sm]:min-h-8', 'data-[size=lg]:h-12', 'data-[size=lg]:min-h-12', 'inset-shadow-[0_-.063rem_var(--border)]'],
  'vertical-docked': ['flex-col', 'inset-shadow-[-.063rem_0_var(--border)]'],
  'horizontal-floating': ['flex-row'],
  'vertical-floating': ['flex-col'],
};

const tabStateClasses = {
  'horizontal-docked': ['border-0', 'px-2', 'h-full', 'hover:inset-shadow-[0_-.188rem_var(--border)]', 'aria-selected:inset-shadow-[0_-.125rem_var(--primary)]', 'hover:aria-selected:inset-shadow-[0_-.188rem_var(--primary)]'],
  'vertical-docked': ['border-0', 'px-3', 'w-full', 'h-8', 'hover:inset-shadow-[-.188rem_0_var(--border)]', 'aria-selected:inset-shadow-[-.125rem_0_var(--primary)]', 'hover:aria-selected:inset-shadow-[-.188rem_0_var(--primary)]'],
  'horizontal-floating': ['rounded-md', 'border', 'border-transparent', 'px-2', 'h-full', 'hover:bg-background', 'hover:border-border', 'aria-selected:bg-background', 'aria-selected:border-border'],
  'vertical-floating': ['rounded-md', 'border', 'border-transparent', 'px-2', 'w-full', 'h-8', 'hover:bg-background', 'hover:border-border', 'aria-selected:bg-background', 'aria-selected:border-border'],
};

const tabListActionsEndClasses = {
  'horizontal-docked': ['ml-auto', 'mr-1.5'],
  'vertical-docked': ['mt-auto', 'mb-1.5'],
  'horizontal-floating': ['ml-auto'],
  'vertical-floating': ['mt-auto'],
};

// The radius is repeated on every key rather than left to setButtonClasses'
// rounded-control, so that a single class owns it here too and the two never race.
const tabListActionStateClasses = {
  'horizontal-docked': ['rounded-md', 'aspect-square', 'w-auto', 'h-[75%]'],
  'vertical-docked': ['rounded-md', 'h-9', 'w-[80%]'],
  'horizontal-floating': ['rounded-md', 'aspect-square', 'w-auto', 'h-full'],
  'vertical-floating': ['rounded-md', 'h-9', 'w-full'],
};

// The scrollbar is hidden, so overflow shows as a faded edge instead. mask-image
// does not combine, so the both-ends case needs the single fade-x-8 or fade-y-8
// class rather than the two one-edge classes at once.
const tabListFadeClasses = ['fade-x-8', 'fade-l-8', 'fade-r-8', 'fade-y-8', 'fade-t-8', 'fade-b-8'];

export default function (Alpine) {
  Alpine.directive('h-tabs', (el, _, { Alpine, cleanup }) => {
    el.classList.add('flex', 'data-[orientation=horizontal]:flex-col', 'data-[orientation=vertical]:flex-row');
    el.setAttribute('data-slot', 'tabs');

    // Selection stays with the consumer, so orientation is the only state the root
    // owns. Anything other than 'vertical' is horizontal, resolved here so the rule
    // lives in one place.
    el._h_tabs = Alpine.reactive({ vertical: el.getAttribute('data-orientation') === 'vertical' });

    const observer = new MutationObserver(() => {
      el._h_tabs.vertical = el.getAttribute('data-orientation') === 'vertical';
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-orientation'] });

    cleanup(() => observer.disconnect());
  });

  Alpine.directive('h-tab-bar', (el, _, { Alpine, effect, cleanup }) => {
    el.classList.add(
      'flex',
      'gap-1',
      'bg-object-header',
      'text-object-header-foreground',
      'data-[floating=true]:border',
      'data-[floating=true]:shadow-xs',
      'data-[floating=true]:z-1',
      'data-[floating=true]:rounded-lg',
      'data-[floating=true]:p-[calc(var(--spacing)*0.75)]'
    );
    el.setAttribute('data-slot', 'tab-bar');

    // Only the literal 'true' floats, so a bar without the attribute is docked,
    // matching how a tab list with no bar above it reads.
    el._h_tab_bar = Alpine.reactive({ floating: el.getAttribute('data-floating') === 'true' });

    const observer = new MutationObserver(() => {
      el._h_tab_bar.floating = el.getAttribute('data-floating') === 'true';
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-floating'] });

    const root = findAncestorState(Alpine, el, '_h_tabs');

    effect(() => applyStateClasses(el, tabBarStateClasses, root?._h_tabs.vertical === true, el._h_tab_bar.floating));

    cleanup(() => observer.disconnect());
  });

  Alpine.directive('h-tab-list', (el, { original }, { Alpine, effect, cleanup }) => {
    const root = findAncestorState(Alpine, el, '_h_tabs');
    if (!root) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-tabs')} element`);
    }
    const tabsState = root._h_tabs;
    // Optional. The root is looked up directly, so a list that skips the bar still
    // works and reads as docked.
    const bar = findAncestorState(Alpine, el, '_h_tab_bar');

    el.classList.add('text-muted-foreground', 'flex', 'items-start', 'justify-start', 'scrollbar-none');
    el.setAttribute('role', 'tablist');
    el.setAttribute('data-slot', 'tab-list');

    // The axis classes and aria-orientation share one effect rather than reading
    // the same state twice.
    effect(() => {
      const vertical = tabsState.vertical;
      el.classList.remove(vertical ? 'flex-row' : 'flex-col', vertical ? 'overflow-x-scroll' : 'overflow-y-scroll');
      el.classList.add(vertical ? 'flex-col' : 'flex-row', vertical ? 'overflow-y-scroll' : 'overflow-x-scroll');
      if (vertical) {
        el.classList.add('h-fit');
      } else {
        el.classList.remove('h-fit');
      }
      el.setAttribute('aria-orientation', vertical ? 'vertical' : 'horizontal');
      updateFades();
    });

    // Floating only tightens the gap here, so it stays separate from the axis
    // classes above instead of multiplying out into a four-key map.
    effect(() => {
      const floating = bar?._h_tab_bar.floating === true;
      el.classList.remove(floating ? 'gap-2' : 'gap-1');
      el.classList.add(floating ? 'gap-1' : 'gap-2');
      // The gap change moves scrollWidth without resizing the list box or any
      // tab, so neither resize observer target would notice it.
      updateFades();
    });

    // The edge that hides more tabs fades out. Everything that can change the
    // overflow re-checks it: the scroll listener, the two effects above,
    // registration, and a resize observer watching the list and each tab, so a
    // late size change (fonts loading, a renamed label) is caught even when the
    // list box itself does not move.
    function updateFades() {
      const vertical = tabsState.vertical;
      const position = vertical ? el.scrollTop : el.scrollLeft;
      const overflow = vertical ? el.scrollHeight - el.clientHeight : el.scrollWidth - el.clientWidth;
      const start = position > 1;
      const end = position < overflow - 1;
      el.classList.remove(...tabListFadeClasses);
      if (start && end) el.classList.add(vertical ? 'fade-y-8' : 'fade-x-8');
      else if (start) el.classList.add(vertical ? 'fade-t-8' : 'fade-l-8');
      else if (end) el.classList.add(vertical ? 'fade-b-8' : 'fade-r-8');
    }

    let fadeFrame = 0;

    // Coalesces a burst of triggers (an x-for mounting its tabs) into one layout read.
    function scheduleFadeUpdate() {
      if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(fadeFrame);
      if (typeof requestAnimationFrame === 'function') fadeFrame = requestAnimationFrame(updateFades);
      else updateFades();
    }

    // The initial reveal may have run before the stylesheet or fonts gave the
    // list a box (every rect zero), so the first resize with real geometry
    // finishes it. A settled reveal never re-runs, so later resizes cannot
    // fight the user's scrolling.
    function onResize() {
      if (!revealSettled && revealedTab) revealTab(revealedTab);
      scheduleFadeUpdate();
    }

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
    resizeObserver?.observe(el);

    // Tabs register themselves rather than being queried, so the set is never read
    // mid-render. Registration is in mount order, which x-for and later insertions
    // make differ from visual order, so navigation order is recovered on read.
    const tabs = [];

    function orderedTabs() {
      return [...tabs].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    }

    // A native disabled button cannot be focused at all, so it leaves the order. An
    // aria-disabled one can, and is announced as unavailable, so it keeps its place.
    function focusableTabs() {
      return orderedTabs().filter((tab) => !tab.disabled);
    }

    // A tab's action shares its place in the tab order, so Tab reaches the action
    // of the tab that holds the stop and no other.
    function setTabStop(target) {
      for (const tab of tabs) {
        const stop = tab === target ? '0' : '-1';
        tab.setAttribute('tabindex', stop);
        tab._h_tab?.action?.setAttribute('tabindex', stop);
      }
    }

    // The stop follows the selected tab, so Tab from outside lands on the tab whose
    // panel is showing. The first selected tab wins, falling back to the first tab.
    function syncTabStop() {
      const focusable = focusableTabs();
      if (!focusable.length) return;
      setTabStop(focusable.find((tab) => tab.getAttribute('aria-selected') === 'true') ?? focusable[0]);
    }

    function moveFocus(target) {
      if (!target) return;
      setTabStop(target);
      target.focus();
    }

    // The selected tab is brought into view only when a different element becomes
    // selected, so attribute noise on the same selection (a disabled toggle
    // re-firing selectionChanged) can never move the user's scroll position.
    let revealedTab = null;
    let revealSettled = false;

    // Nearest-edge reveal: scrolls just enough for the tab to be fully visible,
    // so the rest of the list stays where the user left it.
    function revealTab(tab) {
      const listRect = el.getBoundingClientRect();
      if (!listRect.width && !listRect.height) return;
      revealSettled = true;
      const tabRect = tab.getBoundingClientRect();
      if (tabsState.vertical) {
        if (tabRect.top < listRect.top) el.scrollTop += tabRect.top - listRect.top;
        else if (tabRect.bottom > listRect.bottom) el.scrollTop += tabRect.bottom - listRect.bottom;
      } else if (tabRect.left < listRect.left) {
        el.scrollLeft += tabRect.left - listRect.left;
      } else if (tabRect.right > listRect.right) {
        el.scrollLeft += tabRect.right - listRect.right;
      }
    }

    // Reads the ordered rather than the focusable set, so a selected but natively
    // disabled tab is still kept in view even though it cannot hold the tab stop.
    function selectionChanged() {
      syncTabStop();
      const selected = orderedTabs().find((tab) => tab.getAttribute('aria-selected') === 'true') ?? null;
      if (selected === revealedTab) return;
      revealedTab = selected;
      if (selected) revealTab(selected);
    }

    el._h_tab_list = {
      // Registration is the only hook that sees a tab mounting already selected,
      // since x-bind writes aria-selected before the directive runs and the
      // tab's observer never fires for it.
      register(tab) {
        if (!tabs.includes(tab)) tabs.push(tab);
        resizeObserver?.observe(tab);
        selectionChanged();
        scheduleFadeUpdate();
      },
      unregister(tab) {
        const index = tabs.indexOf(tab);
        if (index !== -1) tabs.splice(index, 1);
        resizeObserver?.unobserve(tab);
        selectionChanged();
        scheduleFadeUpdate();
      },
      // A tab calls this when its own aria-selected (or disabled state) changed,
      // so the stop follows selection without the list watching the DOM.
      selectionChanged,
    };

    function onKeyDown(event) {
      const tab = event.target.closest?.('[data-slot=tab]');
      if (!tab || !tabs.includes(tab)) return;

      const vertical = tabsState.vertical;
      const nextKeys = vertical ? ['Down', 'ArrowDown'] : ['Right', 'ArrowRight'];
      const previousKeys = vertical ? ['Up', 'ArrowUp'] : ['Left', 'ArrowLeft'];
      const focusable = focusableTabs();
      const index = focusable.indexOf(tab);

      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        if (index !== -1) moveFocus(focusable[(index + 1) % focusable.length]);
      } else if (previousKeys.includes(event.key)) {
        event.preventDefault();
        if (index !== -1) moveFocus(focusable[(index - 1 + focusable.length) % focusable.length]);
      } else if (event.key === 'Home') {
        event.preventDefault();
        moveFocus(focusable[0]);
      } else if (event.key === 'End') {
        event.preventDefault();
        moveFocus(focusable[focusable.length - 1]);
      }
      // Enter and Space are left alone. The tabs are native buttons, so the browser
      // already fires the author's click handler. Arrows only move focus.
    }

    // Focus can also arrive by click or by Tab, so the stop is re-synced to
    // wherever it actually landed. 'focus' does not bubble, hence focusin.
    function onFocusIn(event) {
      const tab = event.target.closest?.('[data-slot=tab]');
      if (tab && tabs.includes(tab)) setTabStop(tab);
    }

    el.addEventListener('keydown', onKeyDown);
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('scroll', updateFades);

    // By nextTick the whole tree has mounted, so the initially selected tab's
    // reveal and the first fade state both see settled layout. The register-time
    // reveal ran before the tab's own children (an icon, an action) mounted and
    // padded it wider, hence this second pass on the already revealed tab.
    Alpine.nextTick(() => {
      if (revealedTab) revealTab(revealedTab);
      updateFades();
    });

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('scroll', updateFades);
      if (fadeFrame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(fadeFrame);
      resizeObserver?.disconnect();
    });
  });

  Alpine.directive('h-tab', (el, { original }, { Alpine, effect, cleanup }) => {
    const list = findAncestorState(Alpine, el, '_h_tab_list');
    if (!list) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-tab-list')} element`);
    }
    const root = findAncestorState(Alpine, el, '_h_tabs');
    if (!root) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-tabs')} element`);
    }
    // Optional, like on the tab list. No bar reads as docked.
    const bar = findAncestorState(Alpine, el, '_h_tab_bar');

    el.classList.add(
      'cursor-pointer',
      'focus-visible:border-ring',
      'focus-visible:inset-ring-ring/50',
      'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
      'outline-none',
      'text-muted-foreground',
      'hover:text-foreground',
      'aria-selected:text-foreground',
      'inline-flex',
      'items-center',
      'justify-start',
      'gap-1.5',
      'py-1',
      'text-sm',
      'font-medium',
      'whitespace-nowrap',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      ...disabledControlClasses,
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-disabled',
      'aria-disabled:cursor-not-allowed',
      'svg-defaults'
    );

    effect(() => applyStateClasses(el, tabStateClasses, root._h_tabs.vertical, bar?._h_tab_bar.floating === true));

    el.setAttribute('role', 'tab');
    el.setAttribute('data-slot', 'tab');
    if (!el.hasAttribute('id')) throw new Error(`${original}: Tabs must have an id`);
    if (!el.hasAttribute('aria-controls')) throw new Error(`${original}: aria-controls must be set to the tab-content id.`);

    // Defaulted so a tab written without the attribute is still announced as
    // not selected.
    if (!el.hasAttribute('aria-selected')) el.setAttribute('aria-selected', 'false');
    // Starts out of the tab order and register() hands the stop to the selected tab.
    el.setAttribute('tabindex', '-1');

    // pointer-events-none blocks a real click but never the synthetic one Enter and
    // Space fire on a button, so the author's handler is stopped here in the capture
    // phase, before any handler bound on the tab itself.
    const blockDisabledActivation = (event) => {
      if (!isDisabled(el)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    el.addEventListener('click', blockDisabledActivation, true);

    // The list reads this so the action shares the tab's place in the tab order. It
    // has to exist before register(), which syncs the tab stop straight away.
    el._h_tab = { action: null };

    list._h_tab_list.register(el);

    // Only this tab knows when its own aria-selected changed. tabindex is
    // deliberately not observed, so writing the tab stop cannot feed back in here.
    const observer = new MutationObserver(() => list._h_tab_list.selectionChanged());

    observer.observe(el, { attributes: true, attributeFilter: ['aria-selected', 'disabled', 'aria-disabled'] });

    cleanup(() => {
      el.removeEventListener('click', blockDisabledActivation, true);
      observer.disconnect();
      list._h_tab_list.unregister(el);
    });
  });

  Alpine.directive('h-tab-action', (el, { original }, { Alpine, cleanup }) => {
    // A span, since the action sits inside the tab's own button where nested
    // interactive content would be invalid. Same reason as h-chip-close.
    if (el.tagName !== 'SPAN') {
      throw new Error(`${original} must be a span element`);
    }
    const tab = findAncestorState(Alpine, el, '_h_tab');
    if (!tab) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-tab')} element`);
    }
    // The tab stop is keyed off the single action slot, so a second action would
    // leave the first stranded out of the tab order.
    if (tab._h_tab.action) {
      throw new Error(`${original}: a tab can only have one action`);
    }

    el.classList.add('p-0.5', 'cursor-pointer', 'ml-auto', 'rounded-md', 'text-foreground', 'hover:bg-secondary', 'hover:text-secondary-foreground', 'active:bg-secondary-active', 'outline-ring/50', 'focus-outline');
    el.setAttribute('role', 'button');
    el.setAttribute('data-slot', 'tab-action');
    // Copied rather than assumed to be -1. The tab mounts first and may already
    // hold the stop.
    el.setAttribute('tabindex', tab.getAttribute('tabindex') ?? '-1');

    // The action's content is whatever the author put there, so only they can name it.
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      console.error(`${original}: Must have an "aria-label" or "aria-labelledby" attribute`, el);
    }

    tab._h_tab.action = el;

    // The action lives inside the tab's button, so without this every activation
    // would also select the tab.
    function onClick(event) {
      event.stopPropagation();
    }

    // A span gets no native activation, so Enter and Space route through click,
    // keeping the keyboard and the mouse on one path including the stop above.
    function onKeyDown(event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      el.click();
    }

    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKeyDown);

    cleanup(() => {
      el.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onKeyDown);
      tab._h_tab.action = null;
    });
  });

  Alpine.directive('h-tab-list-actions', (el, { modifiers }, { Alpine, effect }) => {
    el.classList.add('flex', 'gap-1.5', 'items-center', 'justify-center');
    // Only the end alignment depends on the surrounding state, so the default case
    // needs no ancestor lookup and no effect.
    if (modifiers.includes('end')) {
      const root = findAncestorState(Alpine, el, '_h_tabs');
      const bar = findAncestorState(Alpine, el, '_h_tab_bar');
      effect(() => applyStateClasses(el, tabListActionsEndClasses, root?._h_tabs.vertical === true, bar?._h_tab_bar.floating === true));
    }
    el.setAttribute('data-slot', 'tab-list-actions');
  });

  Alpine.directive('h-tab-list-action', (el, { original }, { Alpine, effect }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    setButtonClasses(el);
    el.classList.add(...buttonVariants[el.getAttribute('data-variant') ?? 'outline']);
    el.setAttribute('data-slot', 'tab-list-action');

    // Both ancestors are optional, and their falsy defaults are exactly the
    // horizontal docked state, so no extra branch is needed.
    const root = findAncestorState(Alpine, el, '_h_tabs');
    const bar = findAncestorState(Alpine, el, '_h_tab_bar');

    effect(() => applyStateClasses(el, tabListActionStateClasses, root?._h_tabs.vertical === true, bar?._h_tab_bar.floating === true));
  });

  Alpine.directive('h-tabs-content', (el, { original }) => {
    el.classList.add('flex-1', 'outline-none', 'focus-visible:inset-ring-ring/50', 'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]');
    el.setAttribute('role', 'tabpanel');
    // The ARIA tabs pattern only wants this when the panel has no focusable child
    // of its own, so authors with focusable content opt out with tabindex="-1".
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.setAttribute('data-slot', 'tabs-content');
    if (!el.hasAttribute('id')) throw new Error(`${original}: Tab content must have an id`);
    if (!el.hasAttribute('aria-labelledby')) throw new Error(`${original}: aria-labelledby must be set to the tab id.`);
  });
}
