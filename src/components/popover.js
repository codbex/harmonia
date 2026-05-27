import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import uuidv4 from '../utils/uuid';
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
      el.classList.add('[&_svg]:transition-transform', 'motion-reduce:[&_svg]:transition-none', '[&[aria-expanded=true]>svg:not(:first-child):last-child]:rotate-180');
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
      el.setAttribute('aria-expanded', el._popover.expanded);
    };

    const close = () => {
      el._popover.expanded = false;
      el.addEventListener('click', handler);
      setAttributes();
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

  Alpine.directive('h-popover', (el, { original, modifiers }, { effect, cleanup }) => {
    const popover = (() => {
      let sibling = el.previousElementSibling;
      while (sibling && !sibling.hasOwnProperty('_popover')) {
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
    el.setAttribute('id', popover._popover.controls);
    el.setAttribute('aria-labelledby', popover._popover.id);

    let noScroll = modifiers.includes('no-scroll');
    if (noScroll) {
      el.classList.remove('overflow-auto');
      el.classList.add('overflow-none');
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
        el.classList.remove('scale-95', 'opacity-0');
      });
    }

    effect(() => {
      if (popover._popover.expanded) {
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
