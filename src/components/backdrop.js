export default function (Alpine) {
  Alpine.directive('h-backdrop', (el, _, { cleanup }) => {
    el.classList.add('hidden', 'fixed', 'inset-0', 'z-50', 'bg-black/60', 'transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out', 'opacity-0', '*:scale-95');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'backdrop');

    const observer = new MutationObserver(() => {
      if (el.getAttribute('data-open') === 'true') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.remove('hidden', '*:scale-95', 'opacity-0');
        } else {
          el.classList.remove('hidden');
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
          el.classList.add('*:scale-95', 'opacity-0');
        }
      }
    });

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
        el.classList.add('hidden');
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    observer.observe(el, { attributes: true, attributeFilter: ['data-open'] });

    cleanup(() => {
      observer.disconnect();
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });

  Alpine.directive('h-backdrop-item', (el) => {
    el.classList.add('transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out');
  });
}
