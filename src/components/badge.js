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
      'transition-colors',
      'transition-shadow',
      'motion-reduce:transition-none',
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

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'default');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-badge-indicator', (el, _, { cleanup }) => {
    el.classList.add(
      'absolute',
      '-end-1',
      '-top-1',
      '[.rounded-full>&]:end-0',
      '[.rounded-full>&]:top-0',
      'inline-flex',
      'h-4',
      'min-w-4',
      'items-center',
      'justify-center',
      'rounded-full',
      'py-0.5',
      'px-1',
      'text-xs',
      'font-bold',
      'leading-none',
      'transform-gpu',
      'data-[dot=true]:p-0',
      'data-[dot=true]:min-w-3',
      'data-[dot=true]:h-3',
      'data-[ping=true]:before:absolute',
      'data-[ping=true]:before:inline-flex',
      'data-[ping=true]:before:w-full',
      'data-[ping=true]:before:h-full',
      'data-[ping=true]:before:rounded-full',
      'data-[ping=true]:before:opacity-75',
      'data-[ping=true]:before:animate-ping'
    );
    el.setAttribute('data-slot', 'badge-indicator');
    const variants = {
      primary: ['bg-primary', 'text-primary-foreground', 'data-[ping=true]:before:bg-primary'],
      positive: ['bg-positive', 'text-positive-foreground', 'data-[ping=true]:before:bg-positive'],
      negative: ['bg-negative', 'text-negative-foreground', 'data-[ping=true]:before:bg-negative'],
      warning: ['bg-warning', 'text-warning-foreground', 'data-[ping=true]:before:bg-warning'],
      information: ['bg-information', 'text-information-foreground', 'data-[ping=true]:before:bg-information'],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (variants.hasOwnProperty(variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-variant') ?? 'primary');

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'primary');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => {
      observer.disconnect();
    });
  });
}
