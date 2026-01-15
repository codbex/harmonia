export default function (Alpine) {
  Alpine.directive('h-sheet-overlay', (el, { expression }, { effect, evaluate, evaluateLater, cleanup }) => {
    el.classList.add('data-[open=false]:hidden', 'fixed', 'inset-0', 'z-50', 'bg-black/50');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'sheet-overlay');
    el.setAttribute('data-open', evaluate(expression));

    const getIsOpen = evaluateLater(expression);

    effect(() => {
      getIsOpen((isOpen) => {
        el.setAttribute('data-open', isOpen);
      });
    });

    const onClick = (event) => {
      if (event.target.getAttribute('data-slot') === 'sheet-overlay') {
        evaluate(`${expression} = false`);
      }
    };

    el.addEventListener('click', onClick);
    cleanup(() => {
      el.removeEventListener('click', onClick);
    });
  });

  Alpine.directive('h-sheet', (el, _, { cleanup }) => {
    el.classList.add('bg-background', 'fixed', 'shadow-lg');
    el.setAttribute('data-slot', 'sheet');

    let lastSide;

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

    observer.observe(el, { attributes: true, attributeFilter: ['data-align'] });

    cleanup(() => {
      observer.disconnect();
    });
  });
}
