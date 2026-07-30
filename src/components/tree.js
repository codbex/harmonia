import { findAncestorState } from '../common/ancestor';
import { isAssignable } from '../common/assignable';
import { isDisabledOrInside } from '../common/disabled';
import { ChevronRight, createSvg } from './../common/icons';

// Typeahead buffer lifetime, matching the WAI-ARIA tree pattern.
const TYPEAHEAD_TIMEOUT = 500;

function hasSubtreeChild(el) {
  return [...el.children].some((child) => child.getAttribute('data-slot') === 'subtree');
}

export default function (Alpine) {
  Alpine.directive('h-tree', (el, { modifiers, original }, { effect, cleanup }) => {
    el.classList.add('vbox', 'w-full', 'min-w-0');

    if (modifiers.includes('sub')) {
      // The subtree carries the indentation, so a nested row is a narrower box
      // rather than a full-width one with padding, which makes the guide an
      // ordinary left border. No 'w-full', as a flex item it already stretches to
      // the parent, and that stretch accounts for the margin where width:100%
      // would push the box past the container once per level.
      el.classList.remove('w-full');
      el.classList.add('py-0.5', 'ml-3', 'pl-2');
      if (el.getAttribute('data-line') === 'true') {
        el.classList.add('border-border', 'border-l');
      }
      el.setAttribute('data-slot', 'subtree');
      el.setAttribute('role', 'group');

      const treeItem = findAncestorState(Alpine, el, '_h_tree_item');
      if (!treeItem) throw new Error(`${original}.sub must be inside a ${Alpine.prefixed('h-tree-item')} element`);

      effect(() => {
        if (treeItem._h_tree_item.expanded) {
          el.classList.remove('hidden!');
        } else {
          el.classList.add('hidden!');
        }
      });
      return;
    }

    el.setAttribute('data-slot', 'tree');
    el.setAttribute('role', 'tree');
    el.setAttribute('tabindex', '-1');

    // A collapsed ancestor genuinely hides its subtree, so those items are not on
    // screen to reach. aria-disabled is the opposite, it leaves an item visible and
    // focusable, so it stays in the arrow order and is blocked at activation.
    function getNavigableItems() {
      return [...el.querySelectorAll('[role="treeitem"]')].filter((item) => {
        let parent = item.parentElement.closest('[role="group"]');
        while (parent) {
          const parentItem = parent.closest('[role="treeitem"]');
          if (parentItem && parentItem.getAttribute('aria-expanded') === 'false') return false;
          parent = parentItem?.parentElement.closest('[role="group"]');
        }
        return true;
      });
    }

    function focusItem(item) {
      [...el.querySelectorAll('[role="treeitem"]')].forEach((i) => i.setAttribute('tabindex', '-1'));
      item.setAttribute('tabindex', '0');
      item.focus();
    }

    let typeahead = '';
    let typeaheadTimer;

    function onTypeahead(items, index, key) {
      clearTimeout(typeaheadTimer);
      typeahead += key.toLowerCase();
      typeaheadTimer = setTimeout(() => {
        typeahead = '';
      }, TYPEAHEAD_TIMEOUT);

      // Start after the current item and wrap, so repeating a letter walks
      // through every item sharing that prefix.
      for (let offset = 1; offset <= items.length; offset++) {
        const candidate = items[(index + offset) % items.length];
        const label = candidate.querySelector('[data-slot=tree-label]');
        if (label && label.textContent.trim().toLowerCase().startsWith(typeahead)) {
          focusItem(candidate);
          return;
        }
      }
    }

    function onKeyDown(event) {
      const items = getNavigableItems();
      if (!items.length) return;
      const current = el.querySelector('[role="treeitem"][tabindex="0"]');
      let index = items.indexOf(current);

      if (index === -1) {
        // The stop was left on an item that is no longer navigable, e.g. a bound
        // expression collapsed its ancestor. Recover rather than leaving every
        // key dead until the next click.
        focusItem(items[0]);
        index = 0;
      }

      const item = items[index];

      switch (event.key) {
        case 'Down':
        case 'ArrowDown':
          event.preventDefault();
          if (items[index + 1]) focusItem(items[index + 1]);
          break;
        case 'Up':
        case 'ArrowUp':
          event.preventDefault();
          if (items[index - 1]) focusItem(items[index - 1]);
          break;
        case 'Right':
        case 'ArrowRight':
          event.preventDefault();
          // Expanding is a state change, so it is blocked on a disabled item,
          // but moving into an already open subtree is only navigation.
          if (item._h_tree_item?.hasSubtree && !item._h_tree_item.expanded) {
            if (!isDisabledOrInside(item)) item._h_tree_item.expand();
          } else {
            const firstChild = item.querySelector('[role="group"] [role="treeitem"]');
            if (firstChild) focusItem(firstChild);
          }
          break;
        case 'Left':
        case 'ArrowLeft':
          event.preventDefault();
          if (item._h_tree_item?.hasSubtree && item._h_tree_item.expanded) {
            if (!isDisabledOrInside(item)) item._h_tree_item.collapse();
          } else {
            const parentItem = item.parentElement.closest('[role="treeitem"]');
            if (parentItem) focusItem(parentItem);
          }
          break;
        case 'Home':
          event.preventDefault();
          focusItem(items[0]);
          break;
        case 'End':
          event.preventDefault();
          focusItem(items[items.length - 1]);
          break;
        case ' ': {
          // Prevented before the guard, so Space never scrolls the page even when
          // focus sits on a disabled item.
          event.preventDefault();
          if (isDisabledOrInside(item)) break;
          // In a checkbox tree the checkbox is the control Space would operate on.
          // Otherwise it activates like Enter.
          const checkbox = item.querySelector('[data-slot=tree-row] [data-slot=checkbox] input[type=checkbox]');
          if (checkbox && !checkbox.disabled) {
            checkbox.click();
          } else {
            item._h_tree_item?.activate();
          }
          break;
        }
        case 'Enter':
          event.preventDefault();
          if (isDisabledOrInside(item)) break;
          item._h_tree_item?.activate();
          break;
        default:
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && event.key !== ' ') {
            event.preventDefault();
            onTypeahead(items, index, event.key);
          }
      }
    }

    el.addEventListener('keydown', onKeyDown);
    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      clearTimeout(typeaheadTimer);
    });
  });

  Alpine.directive('h-tree-item', (el, { original, expression }, { evaluate, evaluateLater, effect, cleanup }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }

    let depth = 0;
    let group = el.parentElement?.closest('[data-slot=subtree]');
    while (group) {
      depth++;
      group = group.parentElement?.closest('[data-slot=subtree]');
    }

    // A literal is an initial value the item owns from then on. Any other
    // expression is the author's state, read and written back instead of copied.
    const isControlled = expression !== '' && expression !== 'true' && expression !== 'false';

    el._h_tree_item = Alpine.reactive({
      expanded: expression === 'true',
      disabled: el.getAttribute('aria-disabled') === 'true',
      // Set after mount, once Alpine has walked the children.
      hasSubtree: false,
      depth,
    });

    const setExpanded = (expanded) => {
      el._h_tree_item.expanded = expanded;
      if (el._h_tree_item.hasSubtree) {
        el.setAttribute('aria-expanded', expanded);
      }
    };

    // Writing back interpolates the expression onto the left of an assignment,
    // which only works for a reference. Checked up front because Alpine rethrows
    // the resulting SyntaxError asynchronously, where nothing can catch it.
    const canWriteExpanded = !isControlled || isAssignable(expression);
    if (!canWriteExpanded) {
      console.error(`${original}: the expression "${expression}" cannot be assigned to, so the expanded state cannot be written back. Use a property such as "node.expanded".`, el);
    }

    const writeExpanded = (value) => {
      if (canWriteExpanded) evaluate(`${expression} = ${value}`);
    };

    el._h_tree_item.expand = () => {
      if (isControlled) writeExpanded(true);
      else setExpanded(true);
    };
    el._h_tree_item.collapse = () => {
      if (isControlled) writeExpanded(false);
      else setExpanded(false);
    };
    el._h_tree_item.toggle = () => {
      if (el._h_tree_item.expanded) el._h_tree_item.collapse();
      else el._h_tree_item.expand();
    };
    el._h_tree_item.activate = () => {
      if (el._h_tree_item.hasSubtree) el._h_tree_item.toggle();
      el.dispatchEvent(
        new CustomEvent('tree-item-click', {
          detail: { expanded: el._h_tree_item.expanded, depth },
          bubbles: true,
        })
      );
    };

    el.classList.add('group/tree-item', 'relative', 'min-w-0', 'outline-none', 'aria-disabled:opacity-disabled', 'aria-disabled:pointer-events-none', 'aria-disabled:cursor-not-allowed');
    el.setAttribute('data-slot', 'tree-item');
    el.setAttribute('role', 'treeitem');

    const treeRoot = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'tree');
    if (treeRoot && treeRoot.querySelector('[data-slot=tree-item]') === el) {
      el.setAttribute('tabindex', '0');
    } else {
      el.setAttribute('tabindex', '-1');
    }

    // The subtree does not exist yet when this runs, and with x-if or x-for it may
    // appear or disappear long after, so it is detected from the DOM rather than
    // declared by the author.
    const syncSubtree = () => {
      const hasSubtree = hasSubtreeChild(el);
      if (hasSubtree === el._h_tree_item.hasSubtree) return;
      el._h_tree_item.hasSubtree = hasSubtree;
      if (hasSubtree) {
        el.setAttribute('aria-expanded', el._h_tree_item.expanded);
      } else {
        el.removeAttribute('aria-expanded');
      }
    };
    queueMicrotask(syncSubtree);

    const subtreeObserver = new MutationObserver(syncSubtree);
    subtreeObserver.observe(el, { childList: true });

    // aria-disabled is usually bound, so descendants have to follow it at
    // runtime rather than reading it once at mount.
    const disabledObserver = new MutationObserver(() => {
      el._h_tree_item.disabled = el.getAttribute('aria-disabled') === 'true';
    });
    disabledObserver.observe(el, { attributes: true, attributeFilter: ['aria-disabled'] });

    const onClick = (event) => {
      // pointer-events-none stops a real click, but not the synthetic one the key
      // handler dispatches. Disabling an item dims its whole subtree, so a
      // descendant is equally inert.
      if (isDisabledOrInside(el)) return;
      // Actions and checkboxes are their own controls. Matching on the zone rather
      // than calling stopPropagation inside it keeps a nested menu's document-level
      // dismiss listener working.
      if (event.target.closest('[data-slot=tree-actions],[data-slot=checkbox]')) return;
      // A click on a nested item bubbles through every ancestor item, which would
      // otherwise collapse the whole branch on the way up.
      if (event.target.closest('[data-slot=tree-item]') !== el) return;

      if (treeRoot) {
        [...treeRoot.querySelectorAll('[role="treeitem"]')].forEach((i) => i.setAttribute('tabindex', '-1'));
      }
      el.setAttribute('tabindex', '0');
      el._h_tree_item.activate();
    };

    el.addEventListener('click', onClick);

    cleanup(() => {
      el.removeEventListener('click', onClick);
      subtreeObserver.disconnect();
      disabledObserver.disconnect();
    });

    if (isControlled) {
      const getExpanded = evaluateLater(expression);
      effect(() => {
        getExpanded((expanded) => {
          setExpanded(!!expanded);
        });
      });
    }
  });

  Alpine.directive('h-tree-row', (el, { original }, { effect }) => {
    const treeItem = findAncestorState(Alpine, el, '_h_tree_item');
    if (!treeItem) throw new Error(`${original} must be inside a ${Alpine.prefixed('h-tree-item')} element`);

    el.classList.add(
      'relative',
      'flex',
      'h-8',
      'w-full',
      'min-w-0',
      'items-center',
      'gap-1.5',
      'pr-2',
      'pl-1',
      'rounded-md',
      'text-left',
      'text-sm',
      'align-middle',
      'select-none',
      'cursor-pointer',
      'outline-hidden',
      'ring-ring/50',
      'svg-defaults',
      'transition-colors',
      'motion-reduce:transition-none',
      'hover:bg-secondary',
      'hover:text-secondary-foreground',
      // The item carries the state, the row is painted. Read from the direct parent
      // rather than a group-* variant, which matches every descendant and would
      // paint nested items' rows too.
      '[[data-slot=tree-item]:focus-visible>&]:ring-[calc(var(--spacing)*0.75)]',
      '[[data-slot=tree-item][aria-selected=true]>&]:bg-primary',
      '[[data-slot=tree-item][aria-selected=true]>&]:font-medium',
      '[[data-slot=tree-item][aria-selected=true]>&]:text-primary-foreground',
      // A selected row keeps its primary colour when hovered, one step darker.
      '[[data-slot=tree-item][aria-selected=true]>&]:hover:bg-primary-active',
      '[[data-slot=tree-item][aria-selected=true]>&]:hover:text-primary-foreground',
      // Two hover backgrounds at once read as one large highlight rather than a
      // button on a row, so the row yields while the pointer is on an action.
      // Tinting the action instead fails on a theme whose selected colour is
      // already at the end of its range.
      'has-[[data-slot=tree-action]:hover]:bg-transparent!',
      'has-[[data-slot=tree-action]:hover]:text-foreground!',
      '[[data-slot=tree-item][aria-selected=true]>&]:has-[[data-slot=tree-action]:hover]:bg-primary!',
      '[[data-slot=tree-item][aria-selected=true]>&]:has-[[data-slot=tree-action]:hover]:text-primary-foreground!',
      // The checkbox is sized for a form, not for a tree row.
      '[&>[data-slot=checkbox]]:size-4'
    );
    el.setAttribute('data-slot', 'tree-row');

    // Every row gets a chevron so the content after it lines up. A leaf's is
    // invisible rather than absent, which also survives a subtree arriving later.
    const chevron = createSvg({
      icon: ChevronRight,
      classes: 'size-4 shrink-0 transition-transform motion-reduce:transition-none duration-200 [[data-expanded=true]>&]:rotate-90',
      attrs: {
        'aria-hidden': true,
        role: 'presentation',
      },
    });
    el.prepend(chevron);

    effect(() => {
      chevron.classList.toggle('invisible', !treeItem._h_tree_item.hasSubtree);
    });

    effect(() => {
      el.setAttribute('data-expanded', treeItem._h_tree_item.expanded);
    });
  });

  Alpine.directive('h-tree-label', (el) => {
    // pointer-events-none so a click on the text always resolves to the row.
    el.classList.add('min-w-0', 'flex-1', 'truncate', 'align-middle', 'pointer-events-none');
    el.setAttribute('data-slot', 'tree-label');
  });

  Alpine.directive('h-tree-actions', (el, { modifiers }) => {
    el.classList.add('flex', 'shrink-0', 'items-center', 'gap-0.5');
    if (modifiers.includes('autohide')) {
      // sr-only rather than hidden keeps the actions reachable by screen readers
      // and by the keyboard while they are visually out of the way.
      el.classList.add('sr-only', 'focus-within:not-sr-only', 'group-hover/tree-item:not-sr-only', 'group-aria-selected/tree-item:not-sr-only');
    }
    el.setAttribute('data-slot', 'tree-actions');
  });

  Alpine.directive('h-tree-action', (el, { original }) => {
    el.classList.add(
      'flex',
      'size-6',
      'shrink-0',
      'items-center',
      'justify-center',
      'rounded-sm',
      'p-0',
      'cursor-pointer',
      'bg-transparent',
      'text-inherit',
      'hover:bg-secondary-hover',
      'hover:text-secondary-foreground',
      'active:bg-secondary-active',
      'active:text-secondary-foreground',
      // An open dropdown stays lit, so the row it belongs to is obvious.
      'aria-[expanded=true]:bg-secondary-active',
      'aria-[expanded=true]:text-secondary-foreground',
      'outline-hidden',
      'outline-ring/50',
      'focus-outline',
      'transition-colors',
      'motion-reduce:transition-none',
      'svg-defaults'
    );
    if (el.tagName === 'BUTTON') {
      el.setAttribute('type', 'button');
    } else {
      el.setAttribute('role', 'button');
    }
    el.setAttribute('data-slot', 'tree-action');
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      console.error(`${original}: Icon-only buttons must have an "aria-label" or "aria-labelledby" attribute`, el);
    }
  });

  Alpine.directive('h-tree-indicator', (el) => {
    el.classList.add(
      'shrink-0',
      'flex',
      'items-center',
      'justify-center',
      'min-w-4',
      'text-xs',
      'font-medium',
      'tabular-nums',
      'pointer-events-none',
      'data-[indicator=positive]:text-positive',
      'data-[indicator=negative]:text-negative',
      'data-[indicator=warning]:text-warning',
      'data-[indicator=information]:text-information',
      // A selected row paints its own foreground, which the status colour would
      // clash with. Flagged because the colour rules above match on two attributes
      // and would otherwise win on specificity.
      '[[data-slot=tree-item][aria-selected=true]_&]:text-primary-foreground!',
      // data-dot keeps the badge's box and centres a dot inside it, so dots and
      // letters line up in the same column.
      "data-[dot]:before:content-['']",
      'data-[dot]:before:size-2',
      'data-[dot]:before:rounded-full',
      'data-[dot]:before:bg-current'
    );
    el.setAttribute('data-slot', 'tree-indicator');
    if (!el.hasAttribute('aria-hidden') && !el.hasAttribute('aria-label')) {
      el.setAttribute('aria-hidden', 'true');
    }
  });
}
