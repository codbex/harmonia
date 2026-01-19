export default function (Alpine) {
  Alpine.directive('h-alert', (el, { modifiers }, { cleanup }) => {
    el.classList.add(
      'relative',
      'w-full',
      'rounded-lg',
      'bg-card',
      'border',
      'px-3',
      'py-2',
      'text-sm',
      'grid',
      'has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr_auto]',
      'grid-cols-[0_1fr_auto]',
      'has-[>svg]:gap-x-3',
      'gap-y-0.5',
      'items-center',
      '[&>svg]:size-4',
      '[&>svg]:text-current',
      modifiers.includes('floating') ? 'shadow-lg' : undefined
    );
    el.setAttribute('data-slot', 'alert');
    el.setAttribute('role', 'alert');

    const variants = {
      default: ['text-foreground'],
      positive: ['text-positive'],
      negative: ['text-negative'],
      warning: ['text-warning'],
      information: ['text-information'],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (variants.hasOwnProperty(variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'default');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-alert-title', (el) => {
    el.classList.add('col-start-2', 'line-clamp-1', 'min-h-4', 'font-medium', 'tracking-tight');
    el.setAttribute('data-slot', 'alert-title');
  });

  Alpine.directive('h-alert-description', (el) => {
    el.classList.add('text-muted-foreground', 'col-start-2', 'vbox', 'gap-1', 'text-sm', '[&_p]:leading-relaxed');
    el.setAttribute('data-slot', 'alert-description');
  });

  Alpine.directive('h-alert-actions', (el) => {
    el.classList.add('col-start-3', 'row-start-1');
    el.setAttribute('data-slot', 'alert-actions');
  });
}
