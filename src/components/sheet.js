export default function (Alpine) {
  Alpine.directive('h-sheet-overlay', (el, { expression }, { effect, evaluate, evaluateLater, cleanup }) => {
    el._h_sheet_overlay = {
      showSheet: undefined,
      hideSheet: undefined,
      state: Alpine.reactive({
        open: evaluate(expression || 'false'),
      }),
    };
    el.classList.add('hidden', 'fixed', 'inset-0', 'z-50', 'bg-black/50', 'transition-opacity', 'motion-reduce:transition-none', 'duration-200', 'ease-out', 'opacity-0');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'sheet-overlay');

    const getIsOpen = evaluateLater(expression);

    effect(() => {
      getIsOpen((isOpen) => {
        el._h_sheet_overlay.state.open = isOpen;
      });
    });

    effect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (el._h_sheet_overlay.state.open) {
          el.classList.remove('hidden', 'opacity-0');
        } else {
          el.classList.add('hidden', 'opacity-0');
        }
      } else if (el._h_sheet_overlay.state.open) {
        el.classList.remove('hidden');
        el.offsetHeight;
        el.classList.remove('opacity-0');
      } else {
        el.classList.add('opacity-0');
      }
    });

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
        el.classList.add('hidden');
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    const onClick = (event) => {
      if (event.target.getAttribute('data-slot') === 'sheet-overlay') {
        evaluate(`${expression} = false`);
      }
    };

    el.addEventListener('click', onClick);
    cleanup(() => {
      el.removeEventListener('click', onClick);
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });

  Alpine.directive('h-sheet', (el, { original }, { effect, cleanup }) => {
    const overlay = Alpine.findClosest(el.parentElement, (parent) => Object.prototype.hasOwnProperty.call(parent, '_h_sheet_overlay'));
    if (!overlay) {
      throw new Error(`${original} must be placed inside a sheet overlay`);
    }
    el.classList.add('hidden', 'bg-background', 'fixed', 'shadow-lg', 'transform', 'transition-all', 'motion-reduce:transition-none', 'duration-200', 'ease-out');
    el.setAttribute('data-slot', 'sheet');

    let lastSide;

    const getTranslateClass = (side) => {
      switch (side) {
        case 'top':
          return '-translate-y-full';
        case 'right':
          return 'translate-x-full';
        case 'left':
          return '-translate-x-full';
        default:
          return 'translate-y-full';
      }
    };

    const getSideClasses = (side) => {
      switch (side) {
        case 'top':
          return ['inset-x-0', 'top-0', 'h-auto'];
        case 'right':
          return ['inset-y-0', 'right-0', 'h-full', 'w-auto', 'sm:max-w-sm'];
        case 'left':
          return ['inset-y-0', 'left-0', 'h-full', 'w-auto', 'sm:max-w-sm'];
        default:
          return ['inset-x-0', 'bottom-0', 'h-auto'];
      }
    };

    const setSide = (side) => {
      el.classList.remove(...getSideClasses(lastSide));
      el.classList.add(...getSideClasses(side));
      lastSide = side;
    };

    const observer = new MutationObserver(() => {
      setSide(el.getAttribute('data-align'));
    });

    setSide(el.getAttribute('data-align'));
    el.classList.add(getTranslateClass(lastSide));

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains(getTranslateClass(lastSide))) {
        el.classList.add('hidden');
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    effect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (overlay._h_sheet_overlay.state.open) {
          el.classList.remove('hidden', getTranslateClass(lastSide));
        } else {
          el.classList.add('hidden', getTranslateClass(lastSide));
        }
      } else if (overlay._h_sheet_overlay.state.open) {
        el.classList.remove('hidden');
        el.offsetHeight;
        el.classList.remove(getTranslateClass(lastSide));
      } else {
        el.classList.add(getTranslateClass(lastSide));
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-align'] });

    cleanup(() => {
      observer.disconnect();
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });
}
