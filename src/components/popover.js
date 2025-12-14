import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { v4 as uuidv4 } from 'uuid';

export default function (Alpine) {
  Alpine.directive('h-popover-trigger', (el, { expression, modifiers }, { effect, evaluate, evaluateLater, Alpine, cleanup }) => {
    el._popover = Alpine.reactive({
      id: undefined,
      controls: `hpc${uuidv4()}`,
      auto: expression ? false : true,
      expanded: expression ? evaluate(expression) : false,
    });
    if (expression) {
      const getExpanded = evaluateLater(expression);
      effect(() => {
        getExpanded((expanded) => {
          el._popover.expanded = expanded;
        });
      });
    }
    el.setAttribute('type', 'button');
    if (modifiers.includes('chevron')) {
      el.classList.add('[&_svg]:transition-transform', '[&[data-state=open]>svg:not(:first-child):last-child]:rotate-180');
    }

    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'popover-trigger');

    if (el.hasAttribute('id')) {
      el._popover.id = el.getAttribute('id');
    } else {
      el._popover.id = `hp${uuidv4()}`;
      el.setAttribute('id', el._popover.id);
    }
    el.setAttribute('aria-controls', el._popover.controls);
    el.setAttribute('aria-haspopup', 'dialog');

    const setAttributes = () => {
      el.setAttribute('data-state', el._popover.expanded ? 'open' : 'closed');
      el.setAttribute('aria-expanded', el._popover.expanded);
    };

    const close = () => {
      el._popover.expanded = false;
      el.addEventListener('click', handler);
    };

    const handler = () => {
      el._popover.expanded = !el._popover.expanded;
      setAttributes();
      Alpine.nextTick(() => {
        if (el._popover.auto && el._popover.expanded) {
          top.addEventListener('click', close, { once: true });
          el.removeEventListener('click', handler);
        }
      });
    };
    setAttributes();

    if (el._popover.auto) {
      el.addEventListener('click', handler);

      cleanup(() => {
        el.removeEventListener('click', handler);
        top.removeEventListener('click', close);
      });
    } else {
      effect(() => {
        setAttributes();
      });
    }
  });

  Alpine.directive('h-popover', (el, { modifiers }, { effect }) => {
    const popover = (() => {
      let sibling = el.previousElementSibling;
      while (sibling && !sibling.hasOwnProperty('_popover')) {
        sibling = sibling.previousElementSibling;
      }
      return sibling;
    })();

    if (!popover) {
      throw new Error('h-popover-content must be placed after an h-popover element');
    }
    el.classList.add('absolute', 'bg-popover', 'text-popover-foreground', 'data-[state=closed]:hidden', 'top-0', 'left-0', 'z-50', 'min-w-[1rem]', 'rounded-md', 'border', 'shadow-md', 'outline-hidden', 'overflow-scroll');
    el.setAttribute('data-slot', 'popover');
    el.setAttribute('role', 'dialog');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('id', popover._popover.controls);
    el.setAttribute('aria-labelledby', popover._popover.id);
    el.setAttribute('data-state', popover._popover.expanded ? 'open' : 'closed');

    let noScroll = modifiers.includes('no-scroll');
    if (noScroll) {
      el.classList.remove('overflow-scroll');
      el.classList.add('overflow-none');
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
                  Object.assign(elements.floating.style, {
                    maxWidth: `${Math.max(0, availableWidth) - 4}px`,
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
      });
    }

    effect(() => {
      el.setAttribute('data-state', popover._popover.expanded ? 'open' : 'closed');
      if (popover._popover.expanded) {
        autoUpdateCleanup = autoUpdate(popover, el, updatePosition);
      } else {
        if (autoUpdateCleanup) autoUpdateCleanup();
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    });
  });
}
