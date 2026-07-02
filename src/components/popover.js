import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import uuidv4 from '../utils/uuid';
export default function (Alpine) {
  Alpine.directive('h-popover-trigger', (el, { expression, modifiers }, { effect, evaluate, evaluateLater, Alpine, cleanup }) => {
    // The trigger is fully MANUAL only when the author both binds a variable AND
    // wires their own click handler: they then drive open/close entirely through
    // that variable. In every other case the directive handles opening and
    // closing AUTOMATICALLY (toggle on trigger click, dismiss on outside click);
    // and when a variable is bound it is kept in sync two-way, so setting it
    // shows/hides the popover and an automatic open/close writes back to it.
    const hasClickHandler = [...el.attributes].some((a) => a.name === '@click' || a.name.startsWith('@click.') || a.name === 'x-on:click' || a.name.startsWith('x-on:click.'));

    el._h_popover = Alpine.reactive({
      id: undefined,
      controls: `hpc${uuidv4()}`,
      auto: !(expression && hasClickHandler),
      expanded: expression ? evaluate(expression) : false,
    });
    el.setAttribute('type', 'button');
    if (modifiers.includes('chevron')) {
      el.classList.add('[&>svg]:transition-transform', 'motion-reduce:[&>svg]:transition-none', '[&[aria-expanded=true]>svg:not(:first-child):last-child]:rotate-180');
    }

    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'popover-trigger');

    if (el.hasAttribute('id')) {
      el._h_popover.id = el.getAttribute('id');
    } else {
      el._h_popover.id = `hp${uuidv4()}`;
      el.setAttribute('id', el._h_popover.id);
    }
    el.setAttribute('aria-controls', el._h_popover.controls);
    el.setAttribute('aria-haspopup', 'dialog');

    const setAttributes = () => {
      el.setAttribute('aria-expanded', el._h_popover.expanded);
    };

    // Reflect external changes to the bound variable into the popover state and
    // aria. Runs in both manual and automatic modes.
    if (expression) {
      const getExpanded = evaluateLater(expression);
      effect(() => {
        getExpanded((expanded) => {
          el._h_popover.expanded = expanded;
          setAttributes();
        });
      });
    }

    setAttributes();

    if (el._h_popover.auto) {
      // Update the state (and aria), and mirror it back to the bound variable
      // when there is one, so automatic open/close stays two-way.
      const setExpanded = (value) => {
        el._h_popover.expanded = value;
        setAttributes();
        if (expression) evaluate(`${expression} = ${value}`);
      };

      const open = () => setExpanded(true);
      const close = () => setExpanded(false);

      // Swap the trigger-toggle and outside-dismiss listeners off the CURRENT
      // expanded state rather than off the click handlers, so the listeners
      // re-sync even when the popover is opened or closed through the bound
      // variable (for example a button elsewhere setting it to false).
      effect(() => {
        const expanded = el._h_popover.expanded;
        Alpine.nextTick(() => {
          if (expanded) {
            el.removeEventListener('click', open);
            addDismiss(el, 'click', close);
          } else {
            removeDismiss(el, 'click', close);
            el.addEventListener('click', open);
          }
        });
      });

      cleanup(() => {
        el.removeEventListener('click', open);
        removeDismiss(el, 'click', close);
      });
    }
  });

  Alpine.directive('h-popover', (el, { original, modifiers }, { effect, cleanup }) => {
    const popover = (() => {
      let sibling = el.previousElementSibling;
      while (sibling && !Object.prototype.hasOwnProperty.call(sibling, '_h_popover')) {
        sibling = sibling.previousElementSibling;
      }
      return sibling;
    })();

    if (!popover) {
      throw new Error(`${original} must be placed after a popover element`);
    }
    el.classList.add(
      'absolute',
      'bg-popover',
      'text-popover-foreground',
      'hidden',
      'top-0',
      'left-0',
      'z-50',
      'min-w-[1rem]',
      'rounded-md',
      'border',
      'shadow-md',
      'outline-hidden',
      'overflow-auto',
      'transition-[opacity,scale]',
      'motion-reduce:transition-none',
      'duration-100',
      'ease-out',
      'opacity-0',
      'scale-95'
    );
    el.setAttribute('data-slot', 'popover');
    el.setAttribute('role', 'dialog');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('id', popover._h_popover.controls);
    el.setAttribute('aria-labelledby', popover._h_popover.id);

    let noScroll = modifiers.includes('no-scroll');
    if (noScroll) {
      el.classList.remove('overflow-auto');
      el.classList.add('overflow-hidden');
    }

    const stopPropagation = (event) => {
      event.stopPropagation();
    };

    if (el.getAttribute('data-innerclicks') === 'true') {
      el.addEventListener('click', stopPropagation);
    }

    let autoUpdateCleanup;

    function updatePosition() {
      computePosition(popover, el, {
        placement: el.getAttribute('data-align') || 'bottom-start',
        middleware: [
          offset(4),
          flip(),
          shift({ padding: 4 }),
          !noScroll
            ? size({
                apply({ availableWidth, availableHeight, elements }) {
                  const maxW = el.getAttribute('data-max-w');
                  const available = `${Math.max(0, availableWidth) - 4}px`;
                  Object.assign(elements.floating.style, {
                    maxWidth: maxW ? `min(${available}, calc(var(--container-${maxW}) - 4px))` : available,
                    maxHeight: `${Math.max(0, availableHeight) - 4}px`,
                  });
                },
              })
            : undefined,
        ],
      }).then(({ x, y }) => {
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        el.classList.remove('scale-95', 'opacity-0');
      });
    }

    effect(() => {
      if (popover._h_popover.expanded) {
        el.classList.remove('hidden');
        autoUpdateCleanup = autoUpdate(popover, el, updatePosition);
      } else {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', 'scale-95', 'opacity-0');
          Object.assign(el.style, {
            left: '0px',
            top: '0px',
          });
        } else {
          el.classList.add('scale-95', 'opacity-0');
        }
        if (autoUpdateCleanup) autoUpdateCleanup();
      }
    });

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
        el.classList.add('hidden');
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    cleanup(() => {
      el.removeEventListener('click', stopPropagation);
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });
}
