import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { v4 as uuidv4 } from 'uuid';

export default function (Alpine) {
  Alpine.directive('h-tooltip-trigger', (el, _, { Alpine, cleanup }) => {
    el._tooltip = Alpine.reactive({
      id: undefined,
      controls: `hpc${uuidv4()}`,
      shown: false,
    });

    if (el.hasAttribute('id')) {
      el._tooltip.id = el.getAttribute('id');
    } else {
      el._tooltip.id = `hp${uuidv4()}`;
      el.setAttribute('id', el._tooltip.id);
    }
    el.setAttribute('aria-describedby', el._tooltip.controls);

    const handler = (event) => {
      el._tooltip.shown = event.type === 'pointerenter';
    };

    el.addEventListener('pointerenter', handler);
    el.addEventListener('pointerleave', handler);

    cleanup(() => {
      el.removeEventListener('pointerenter', handler);
      el.removeEventListener('pointerleave', handler);
    });
  });

  Alpine.directive('h-tooltip', (el, { original }, { effect }) => {
    const tooltip = (() => {
      let sibling = el.previousElementSibling;
      while (sibling && !sibling.hasOwnProperty('_tooltip')) {
        sibling = sibling.previousElementSibling;
      }
      return sibling;
    })();

    if (!tooltip) {
      throw new Error(`${original} must be placed after a tooltip trigger element`);
    }
    el.classList.add('absolute', 'bg-foreground', 'text-background', 'z-50', 'w-fit', 'rounded-md', 'px-3', 'py-1.5', 'text-xs', 'text-balance');
    el.setAttribute('data-slot', 'tooltip');
    el.setAttribute('id', tooltip._tooltip.controls);

    const arrowEl = document.createElement('span');
    arrowEl.classList.add('absolute', 'bg-foreground', 'size-2.5', 'rotate-45');
    el.appendChild(arrowEl);

    function updatePosition() {
      computePosition(tooltip, el, {
        placement: 'top',
        middleware: [offset(10), flip(), shift({ padding: 4 }), arrow({ element: arrowEl })],
      }).then(({ x, y, middlewareData, placement }) => {
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        if (middlewareData.arrow) {
          Object.assign(arrowEl.style, {
            left: middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : '',
            top: placement === 'top' ? `${el.offsetHeight - arrowEl.clientHeight / 2}px` : `-${arrowEl.clientHeight / 2}px`,
          });
        }
      });
    }

    effect(() => {
      if (tooltip._tooltip.shown) {
        el.classList.remove('hidden');
        updatePosition();
      } else {
        el.classList.add('hidden');
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
        Object.assign(arrowEl.style, {
          left: '0px',
          top: '0px',
        });
      }
    });
  });
}
