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
      'focus-ring',
      'transition-[color,box-shadow]',
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
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
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
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-full',
      'py-0.5',
      'px-1',
      'font-bold',
      'leading-none',
      'transform-gpu',
      'data-[dot=true]:p-0',
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

    const positions = {
      'top-right': ['-end-0.75', '-top-0.75', '[.rounded-full>&]:-end-0.25', '[.rounded-full>&]:-top-0.25'],
      'top-left': ['-start-0.75', '-top-0.75', '[.rounded-full>&]:-start-0.25', '[.rounded-full>&]:-top-0.25'],
      'bottom-left': ['-start-0.75', '-bottom-0.75', '[.rounded-full>&]:-start-0.25', '[.rounded-full>&]:-bottom-0.25'],
      'bottom-right': ['-end-0.75', '-bottom-0.75', '[.rounded-full>&]:-end-0.25', '[.rounded-full>&]:-bottom-0.25'],
    };

    const sizes = {
      default: { regular: ['h-4', 'min-w-4', 'text-xs'], dot: ['h-3', 'min-w-3'] },
      sm: { regular: ['h-3', 'min-w-3', 'text-2xs'], dot: ['h-2.5', 'min-w-2.5'] },
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
    }

    function setPosition(position) {
      for (const [_, value] of Object.entries(positions)) {
        el.classList.remove(...value);
      }
      el.classList.add(...(positions[position] ?? positions['top-right']));
    }

    function setSize() {
      el.classList.remove('h-4', 'min-w-4', 'h-3', 'min-w-3', 'h-2.5', 'min-w-2.5', 'text-xs', 'text-2xs');
      const size = sizes[el.getAttribute('data-size')] ?? sizes.default;
      el.classList.add(...(el.getAttribute('data-dot') === 'true' ? size.dot : size.regular));
    }

    setVariant(el.getAttribute('data-variant') ?? 'primary');
    setPosition(el.getAttribute('data-position') ?? 'top-right');
    setSize();

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'primary');
      setPosition(el.getAttribute('data-position') ?? 'top-right');
      setSize();
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-position', 'data-size', 'data-dot'] });

    cleanup(() => {
      observer.disconnect();
    });
  });
}
