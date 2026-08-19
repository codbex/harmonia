import { transitionClose } from '../common/transition-close';

export default function (Alpine) {
  Alpine.directive('h-backdrop', (el, _, { cleanup }) => {
    el.classList.add('hidden', 'fixed', 'inset-0', 'z-50', 'bg-black/60', 'transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out', 'opacity-0', '*:scale-95');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'backdrop');

    // Guarded on the live state, not a class snapshot, so a late transitionend
    // from an abandoned close cannot hide a backdrop reopened mid-fade.
    const closer = transitionClose(el, () => {
      if (el.getAttribute('data-open') !== 'true') {
        el.classList.add('hidden');
      }
    });

    const observer = new MutationObserver(() => {
      if (el.getAttribute('data-open') === 'true') {
        closer.cancel();
        el.classList.remove('hidden', 'pointer-events-none');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.remove('*:scale-95', 'opacity-0');
        } else {
          Alpine.nextTick(() => {
            // Reading 'offsetHeight' forces the browser to apply pending styles first.
            // This guarantees that the animation will always happen.
            el.offsetHeight;
            el.classList.remove('*:scale-95', 'opacity-0');
          });
        }
      } else {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', '*:scale-95', 'opacity-0');
        } else {
          // pointer-events-none from the first frame of the fade, so the
          // invisible backdrop stops swallowing clicks aimed at the page.
          el.classList.add('*:scale-95', 'opacity-0', 'pointer-events-none');
          closer.schedule();
        }
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-open'] });

    cleanup(() => {
      observer.disconnect();
      closer.dispose();
    });
  });

  Alpine.directive('h-backdrop-item', (el) => {
    el.classList.add('transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out');
  });
}
