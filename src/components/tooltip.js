import { arrow, computePosition, flip, offset, shift } from '@floating-ui/dom';
import uuidv4 from '../utils/uuid';
export default function (Alpine) {
  Alpine.directive('h-tooltip-trigger', (el, _, { Alpine, cleanup }) => {
    el._h_tooltip = Alpine.reactive({
      id: undefined,
      controls: `htp${uuidv4()}`,
      shown: false,
    });

    if (el.hasAttribute('id')) {
      el._h_tooltip.id = el.getAttribute('id');
    } else {
      el._h_tooltip.id = `htt${uuidv4()}`;
      el.setAttribute('id', el._h_tooltip.id);
    }
    if (!el.hasAttribute('aria-describedby')) el.setAttribute('aria-describedby', el._h_tooltip.controls);

    function setVisibility(shown = false) {
      el._h_tooltip.shown = shown;
      if (shown) {
        el.addEventListener('keydown', onKeyDown);
        el.addEventListener('pointerleave', handler);
        el.addEventListener('blur', handler);
      } else {
        el.removeEventListener('keydown', onKeyDown);
        el.removeEventListener('pointerleave', handler);
        el.removeEventListener('blur', handler);
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setVisibility(false);
    };

    const handler = (event) => {
      setVisibility(event.type === 'pointerenter' || event.type === 'focus');
    };

    el.addEventListener('pointerenter', handler);
    el.addEventListener('focus', handler);

    cleanup(() => {
      el.removeEventListener('pointerenter', handler);
      el.removeEventListener('focus', handler);
      el.removeEventListener('pointerleave', handler);
      el.removeEventListener('blur', handler);
      el.removeEventListener('keydown', onKeyDown);
    });
  });

  Alpine.directive('h-tooltip', (el, { original }, { effect, cleanup }) => {
    const tooltip = (() => {
      let sibling = el.previousElementSibling;
      while (sibling && !Object.prototype.hasOwnProperty.call(sibling, '_h_tooltip')) {
        sibling = sibling.previousElementSibling;
      }
      return sibling;
    })();

    if (!tooltip) {
      throw new Error(`${original} must be placed after a tooltip trigger element`);
    }
    el.classList.add(
      'absolute',
      'bg-foreground',
      'text-background',
      'z-50',
      'w-fit',
      'rounded-md',
      'px-3',
      'py-1.5',
      'text-xs',
      'text-balance',
      'transition-[opacity,scale]',
      'motion-reduce:transition-none',
      'duration-100',
      'ease-out',
      'opacity-0',
      'scale-95',
      'hidden'
    );
    el.setAttribute('data-slot', 'tooltip');
    el.setAttribute('role', 'tooltip');
    el.setAttribute('id', tooltip._h_tooltip.controls);

    const arrowEl = document.createElement('span');
    arrowEl.classList.add('absolute', 'bg-foreground', 'size-2.5', 'rotate-45');
    arrowEl.setAttribute('aria-hidden', 'true');
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
        el.classList.remove('scale-95', 'opacity-0');
        if (middlewareData.arrow) {
          Object.assign(arrowEl.style, {
            left: middlewareData.arrow.x != null ? `${middlewareData.arrow.x}px` : '',
            top: placement === 'top' ? `${el.offsetHeight - arrowEl.clientHeight / 2}px` : `-${arrowEl.clientHeight / 2}px`,
          });
        }
      });
    }

    effect(() => {
      if (tooltip._h_tooltip.shown) {
        el.classList.remove('hidden');
        updatePosition();
      } else {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', 'scale-95', 'opacity-0');
          Object.assign(el.style, {
            left: '0px',
            top: '0px',
          });
          Object.assign(arrowEl.style, {
            left: '0px',
            top: '0px',
          });
        } else {
          el.classList.add('scale-95', 'opacity-0');
        }
      }
    });

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
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
    }

    el.addEventListener('transitionend', onTransitionEnd);

    cleanup(() => {
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });
}
