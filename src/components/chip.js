import { Close, createSvg } from './../common/icons';
export default function (Alpine) {
  Alpine.directive('h-chip', (el, { original }, { cleanup }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    el._h_chip = Alpine.reactive({
      variant: 'default',
    });
    el.classList.add(
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-full',
      'text-sm',
      'leading-none',
      'transform-gpu',
      'overflow-hidden',
      'transition-all',
      'duration-100',
      'motion-reduce:transition-none',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      '[&_svg]:pointer-events-none',
      "[&_svg:not([class*='size-'])]:size-4",
      'shrink-0',
      '[&_svg]:shrink-0',
      'aria-expanded:outline-[calc(var(--spacing)*0.75)]',
      'aria-expanded:outline',
      'focus:outline-[calc(var(--spacing)*0.75)]',
      'focus:outline',
      'focus-visible:outline-[calc(var(--spacing)*0.75)]',
      'focus-visible:outline',
      'h-7',
      'gap-1.5',
      'px-2.5',
      'has-[>svg]:pl-1.5',
      'has-[>[data-slot=chip-close]]:pr-0',
      'has-[>[data-slot=spinner]]:px-2',
      'text-secondary-foreground',
      'border'
    );
    if (!el.hasAttribute('type')) {
      el.setAttribute('type', 'button');
    }
    el.setAttribute('data-slot', 'chip');
    const variants = {
      default: ['bg-secondary', '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-secondary-hover', '[&:active:not(:has([data-slot=chip-close]:active))]:bg-secondary-active', 'outline-ring/50'],
      primary: [
        'bg-primary/10',
        'border-primary/50',
        '[&>svg]:text-primary',
        '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-primary/15',
        '[&:active:not(:has([data-slot=chip-close]:active))]:bg-primary/20',
        'outline-primary/50',
      ],
      positive: [
        'bg-positive/10',
        'border-positive/50',
        '[&>svg]:text-positive',
        '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-positive/15',
        '[&:active:not(:has([data-slot=chip-close]:active))]:bg-positive/20',
        'outline-positive/50',
      ],
      negative: [
        'bg-negative/10',
        'border-negative/50',
        '[&>svg]:text-negative',
        '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-negative/15',
        '[&:active:not(:has([data-slot=chip-close]:active))]:bg-negative/20',
        'outline-negative/50',
      ],
      warning: [
        'bg-warning/10',
        'border-warning/50',
        '[&>svg]:text-warning',
        '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-warning/15',
        '[&:active:not(:has([data-slot=chip-close]:active))]:bg-warning/20',
        'outline-warning/50',
      ],
      information: [
        'bg-information/10',
        'border-information/50',
        '[&>svg]:text-information',
        '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-information/15',
        '[&:active:not(:has([data-slot=chip-close]:active))]:bg-information/20',
        'outline-information/50',
      ],
      outline: [
        'bg-background',
        '[&>svg]:text-secondary-foreground',
        '[&:hover:not(:has([data-slot=chip-close]:hover)):not(:active)]:bg-secondary-hover',
        '[&:active:not(:has([data-slot=chip-close]:active))]:bg-secondary-active',
        'outline-ring/50',
      ],
    };

    function setVariant(variant) {
      el._h_chip.variant = variant;
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

  Alpine.directive('h-chip-close', (el, { original }, { effect, cleanup }) => {
    if (el.tagName === 'BUTTON') {
      throw new Error(`${original} must NOT be a button element`);
    }
    const chip = Alpine.findClosest(el.parentElement, (parent) => Object.prototype.hasOwnProperty.call(parent, '_h_chip'));
    el.classList.add(
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-center',
      'pl-1',
      'pr-1.5',
      'h-full',
      'text-sm',
      'transition-all',
      'duration-100',
      'motion-reduce:transition-none',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'bg-transparent',
      'text-secondary-foreground',
      'fill-secondary-foreground',
      'rounded-r-full',
      'border-l',
      'border-transparent',
      'outline-none',
      'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
      'focus-visible:inset-ring',
      'hover:[[data-variant]>&]:border-inherit',
      'active:border-inherit',
      'aria-pressed:border-inherit'
    );
    el.setAttribute('data-slot', 'chip-close');
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.appendChild(
      createSvg({
        icon: Close,
        classes: 'size-3.5 shrink-0 pointer-events-none',
        attrs: {
          'aria-hidden': true,
          role: 'presentation',
        },
      })
    );

    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      console.error(`${original}: Must have an "aria-label" or "aria-labelledby" attribute`, el);
    }

    const variants = {
      default: ['hover:border-foreground/20', 'hover:bg-secondary-hover', 'active:bg-secondary-active', 'focus-visible:inset-ring-ring/50'],
      primary: ['hover:bg-primary/10', 'active:bg-primary/15', 'aria-pressed:bg-primary/15', 'focus-visible:inset-ring-primary/50'],
      positive: ['hover:bg-positive/10', 'active:bg-positive/15', 'aria-pressed:bg-positive/15', 'focus-visible:inset-ring-positive/50'],
      negative: ['hover:bg-negative/10', 'active:bg-negative/15', 'aria-pressed:bg-negative/15', 'focus-visible:inset-ring-negative/50'],
      warning: ['hover:bg-warning/10', 'active:bg-warning/15', 'aria-pressed:bg-warning/15', 'focus-visible:inset-ring-warning/50'],
      information: ['hover:bg-information/10', 'active:bg-information/15', 'aria-pressed:bg-information/15', 'focus-visible:inset-ring-information/50'],
      outline: ['hover:bg-secondary-hover', 'active:bg-secondary-active', 'aria-pressed:bg-secondary-active', 'focus-visible:inset-ring-ring/50'],
    };

    effect(() => {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(variants, chip._h_chip.variant)) {
        el.classList.add(...variants[chip._h_chip.variant]);
      }
    });

    const stopPropagation = (event) => {
      // Do not stop propagation when the chip has an expanded popover or a menu attached to it.
      // This allows for confirmation dialogs to show, without the popover/menu staying expanded.
      if (chip.getAttribute('aria-expanded') !== 'true') event.stopPropagation();
    };
    el.addEventListener('click', stopPropagation);

    cleanup(() => {
      el.removeEventListener('click', stopPropagation);
    });
  });
}
