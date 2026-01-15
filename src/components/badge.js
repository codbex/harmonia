export default function (Alpine) {
  Alpine.directive('h-badge', (el, _, { cleanup }) => {
    el.classList.add(
      '[a&]:cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'border',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-medium',
      'w-fit',
      'whitespace-nowrap',
      'shrink-0',
      '[&>svg]:size-3',
      'gap-1',
      '[&>svg]:pointer-events-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'transition-[color,box-shadow]',
      'overflow-hidden'
    );
    el.setAttribute('data-slot', 'badge');
    const variants = {
      default: ['border-transparent', 'bg-secondary', 'text-secondary-foreground', '[a&]:hover:bg-secondary-hover', '[a&]:active:bg-secondary-active'],
      primary: ['border-transparent', 'bg-primary', 'text-primary-foreground', '[a&]:hover:bg-primary-hover', '[a&]:active:bg-primary-active'],
      positive: ['border-transparent', 'bg-positive', 'text-positive-foreground', '[a&]:hover:bg-positive-hover', '[a&]:active:bg-positive-active'],
      negative: ['border-transparent', 'bg-negative', 'text-negative-foreground', '[a&]:hover:bg-negative-hover', '[a&]:active:bg-negative-active'],
      warning: ['border-transparent', 'bg-warning', 'text-warning-foreground', '[a&]:hover:bg-warning-hover', '[a&]:active:bg-warning-active'],
      information: ['border-transparent', 'bg-information', 'text-information-foreground', '[a&]:hover:bg-information-hover', '[a&]:active:bg-information-active'],
      outline: ['bg-transparent', 'text-foreground', '[a&]:hover:bg-secondary', '[a&]:hover:text-secondary-foreground', '[a&]:active:bg-secondary-active'],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (variants.hasOwnProperty(variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        setVariant(el.getAttribute('data-variant') ?? 'default');
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => {
      observer.disconnect();
    });
  });
}
