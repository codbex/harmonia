export default function (Alpine) {
  Alpine.directive('h-progress', (el, { expression }, { effect, evaluateLater, cleanup }) => {
    el.setAttribute('data-slot', 'progress');
    el.setAttribute('role', 'progressbar');
    el.setAttribute('aria-valuemin', '0');
    el.setAttribute('aria-valuemax', '100');

    const getProgress = evaluateLater(expression);

    let value = 0;
    // Assigned by whichever branch runs below, so the observer at the end can
    // repaint without knowing which shape it is looking at.
    let repaint = () => {};

    // A loading progress is indeterminate, so there is no value to announce:
    // 'aria-valuenow' goes away and 'aria-busy' says the work is still running.
    // Screen readers announce a progressbar without a value as busy rather than
    // as zero, which is the difference this guards.
    const applyAria = () => {
      if (el.getAttribute('data-loading') === 'true') {
        el.removeAttribute('aria-valuenow');
        el.setAttribute('aria-busy', 'true');
        return;
      }
      el.removeAttribute('aria-busy');
      el.setAttribute('aria-valuenow', String(Math.round(Math.min(100, Math.max(0, value ?? 0)))));
    };

    if (el.getAttribute('data-type') === 'circle') {
      const LOADING_ARC = 30;
      el.classList.add('relative', 'w-10', 'rounded-full', 'shrink-0', 'aspect-square');

      const indicator = document.createElement('div');
      indicator.classList.add('absolute', 'inset-0', 'rounded-full', 'transition-all', 'motion-reduce:transition-none', 'motion-reduce:animate-none');
      indicator.setAttribute('data-slot', 'progress-indicator');
      const mask = 'radial-gradient(circle closest-side, transparent calc(100% - 0.5rem), #000 calc(100% - 0.5rem))';
      indicator.style.webkitMask = mask;
      indicator.style.mask = mask;
      el.appendChild(indicator);

      const VARIANT_VARS = { information: '--information', warning: '--warning', positive: '--positive', negative: '--negative' };
      const fill = () => `var(${VARIANT_VARS[el.getAttribute('data-variant')] || '--primary'})`;

      repaint = () => {
        const loading = el.getAttribute('data-loading') === 'true';
        const p = loading ? LOADING_ARC : Math.min(100, Math.max(0, value ?? 0));
        indicator.style.background = `conic-gradient(${fill()} ${p}%, var(--secondary) ${p}%)`;
        indicator.classList.toggle('animate-spin', loading);
      };

      effect(() => {
        getProgress((progress) => {
          value = progress;
          repaint();
          applyAria();
        });
      });
    } else {
      el.classList.add('bg-secondary', 'relative', 'h-2', 'w-full', 'overflow-hidden', 'rounded-full');

      const indicator = document.createElement('div');
      indicator.classList.add(
        'bg-primary',
        '[[data-variant=information]>&]:bg-information',
        '[[data-variant=warning]>&]:bg-warning',
        '[[data-variant=positive]>&]:bg-positive',
        '[[data-variant=negative]>&]:bg-negative',
        'h-full',
        'w-full',
        'flex-1',
        'transition-all',
        'motion-reduce:transition-none',
        'rounded-full',
        // Indeterminate: a 30%-wide bar that sweeps left to right on a loop. The
        // animation drives `transform`, overriding the inline translate below.
        '[[data-loading=true]>&]:flex-none',
        '[[data-loading=true]>&]:w-[30%]',
        '[[data-loading=true]>&]:animate-progress-loading'
      );
      indicator.setAttribute('data-slot', 'progress-indicator');
      Object.assign(indicator.style, {
        transform: `translateX(-${100 - 0}%)`,
      });
      el.appendChild(indicator);

      effect(() => {
        getProgress((progress) => {
          value = progress;
          Object.assign(indicator.style, {
            transform: `translateX(-${100 - (progress ?? 0)}%)`,
          });
          applyAria();
        });
      });
    }

    // `data-loading` / `data-variant` are not part of the reactive expression, so
    // observe them to repaint and re-announce when they are toggled at runtime.
    const observer = new MutationObserver(() => {
      repaint();
      applyAria();
    });
    observer.observe(el, { attributes: true, attributeFilter: ['data-loading', 'data-variant'] });
    cleanup(() => observer.disconnect());

    // The effects above run on the first pass, but only once the expression has
    // been evaluated. This makes the element announceable from the very start.
    applyAria();
  });
}
