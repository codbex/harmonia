import { findAncestorState } from '../common/ancestor';
import { transitionClose } from '../common/transition-close';
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

    // Guarded on the live state, not a class snapshot, so a late transitionend
    // from an abandoned close cannot hide an overlay reopened mid-fade.
    const closer = transitionClose(el, () => {
      if (!el._h_sheet_overlay.state.open) {
        el.classList.add('hidden');
      }
    });

    effect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (el._h_sheet_overlay.state.open) {
          closer.cancel();
          el.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
        } else {
          el.classList.add('hidden', 'opacity-0');
        }
      } else if (el._h_sheet_overlay.state.open) {
        closer.cancel();
        el.classList.remove('hidden', 'pointer-events-none');
        el.offsetHeight;
        el.classList.remove('opacity-0');
      } else {
        // pointer-events-none from the first frame of the fade, so the
        // invisible overlay stops swallowing clicks aimed at the page.
        el.classList.add('opacity-0', 'pointer-events-none');
        closer.schedule();
      }
    });

    const onClick = (event) => {
      if (event.target.getAttribute('data-slot') === 'sheet-overlay') {
        evaluate(`${expression} = false`);
      }
    };

    el.addEventListener('click', onClick);
    cleanup(() => {
      el.removeEventListener('click', onClick);
      closer.dispose();
    });
  });

  Alpine.directive('h-sheet', (el, { original }, { effect, cleanup }) => {
    const overlay = findAncestorState(Alpine, el, '_h_sheet_overlay');
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

    // Guarded on the live state, not a class snapshot, so a late transitionend
    // from an abandoned close cannot hide a sheet reopened mid-slide.
    const closer = transitionClose(el, () => {
      if (!overlay._h_sheet_overlay.state.open) {
        el.classList.add('hidden');
      }
    });

    effect(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        if (overlay._h_sheet_overlay.state.open) {
          closer.cancel();
          el.classList.remove('hidden', getTranslateClass(lastSide), 'pointer-events-none');
        } else {
          el.classList.add('hidden', getTranslateClass(lastSide));
        }
      } else if (overlay._h_sheet_overlay.state.open) {
        closer.cancel();
        el.classList.remove('hidden', 'pointer-events-none');
        el.offsetHeight;
        el.classList.remove(getTranslateClass(lastSide));
      } else {
        // pointer-events-none from the first frame of the slide, so the
        // departing sheet stops swallowing clicks aimed at the page.
        el.classList.add(getTranslateClass(lastSide), 'pointer-events-none');
        closer.schedule();
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-align'] });

    cleanup(() => {
      observer.disconnect();
      closer.dispose();
    });
  });
}
