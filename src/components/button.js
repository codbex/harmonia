export const buttonVariants = {
  default: [
    'bg-secondary',
    'text-secondary-foreground',
    'shadow-button',
    'hover:bg-secondary-hover',
    'active:bg-secondary-active',
    'aria-pressed:bg-secondary-active',
    'active:data-[toggled=true]:bg-secondary-active',
    'hover:data-[toggled=true]:bg-secondary-hover',
    'data-[toggled=true]:bg-secondary-active',
  ],
  primary: [
    'bg-primary',
    'text-primary-foreground',
    'shadow-button',
    'hover:bg-primary-hover',
    'active:bg-primary-active',
    'aria-pressed:bg-primary-active',
    'active:data-[toggled=true]:bg-primary-active',
    'hover:data-[toggled=true]:bg-primary-hover',
    'data-[toggled=true]:bg-primary-active',
  ],
  positive: [
    'bg-positive',
    'text-positive-foreground',
    'shadow-button',
    'hover:bg-positive-hover',
    'active:bg-positive-active',
    'aria-pressed:bg-positive-active',
    'active:data-[toggled=true]:bg-positive-active',
    'hover:data-[toggled=true]:bg-positive-hover',
    'data-[toggled=true]:bg-positive-active',
  ],
  negative: [
    'bg-negative',
    'text-negative-foreground',
    'shadow-button',
    'hover:bg-negative-hover',
    'active:bg-negative-active',
    'aria-pressed:bg-negative-active',
    'active:data-[toggled=true]:bg-negative-active',
    'hover:data-[toggled=true]:bg-negative-hover',
    'data-[toggled=true]:bg-negative-active',
  ],
  warning: [
    'bg-warning',
    'text-warning-foreground',
    'shadow-button',
    'hover:bg-warning-hover',
    'active:bg-warning-active',
    'aria-pressed:bg-warning-active',
    'active:data-[toggled=true]:bg-warning-active',
    'hover:data-[toggled=true]:bg-warning-hover',
    'data-[toggled=true]:bg-warning-active',
  ],
  outline: [
    'border',
    'bg-background',
    'text-foreground',
    'hover:bg-secondary',
    'hover:text-secondary-foreground',
    'active:bg-secondary-active',
    'aria-pressed:bg-secondary-active',
    'active:data-[toggled=true]:bg-secondary-active',
    'hover:data-[toggled=true]:bg-secondary-hover',
    'data-[toggled=true]:bg-secondary-active',
  ],
  transparent: [
    'bg-transparent',
    'text-foreground',
    'shadow-none',
    'hover:bg-secondary',
    'hover:text-secondary-foreground',
    'active:bg-secondary-active',
    'aria-pressed:bg-secondary-active',
    'active:data-[toggled=true]:bg-secondary-active',
    'hover:data-[toggled=true]:bg-secondary-hover',
    'data-[toggled=true]:bg-secondary-active',
  ],
  link: ['text-primary', 'underline-offset-4', 'hover:underline'],
};

export const setButtonClasses = (el) => {
  el.classList.add(
    'cursor-pointer',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-control',
    'text-sm',
    'font-medium',
    'transition-all',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
    '[&_svg]:pointer-events-none',
    "[&_svg:not([class*='size-'])]:size-4",
    'shrink-0',
    '[&_svg]:shrink-0',
    'outline-none',
    'focus-visible:border-ring',
    'focus-visible:ring-ring/50',
    'focus-visible:ring-[3px]',
    'aria-invalid:ring-negative/20',
    'dark:aria-invalid:ring-negative/40',
    'aria-invalid:border-negative',
    'invalid:!ring-negative/20',
    'dark:invalid:!ring-negative/40',
    'invalid:!border-negative'
  );
};

export const getButtonSize = (size, inGroup = false) => {
  switch (size) {
    case 'xs':
      return inGroup ? ['h-6', 'gap-1', 'px-2', "[&>svg:not([class*='size-'])]:size-3.5", 'has-[>svg]:px-2'] : ['h-6.5', 'gap-1.5', 'px-2.5', 'has-[>svg]:px-2.5'];
    case 'sm':
      return inGroup ? ['h-8', 'px-2.5', 'gap-1.5', 'has-[>svg]:px-2.5'] : ['h-8', 'gap-1.5', 'px-3', 'has-[>svg]:px-2.5'];
    case 'lg':
      return ['h-10', 'px-6', 'has-[>svg]:px-4'];
    case 'icon-xs':
      return inGroup ? ['size-6', 'p-0', 'has-[>svg]:p-0'] : ['size-6.5'];
    case 'icon-sm':
      return inGroup ? ['size-8', 'p-0', 'has-[>svg]:p-0'] : ['size-8'];
    case 'icon':
      return ['size-9'];
    case 'icon-lg':
      return ['size-10'];
    default:
      return ['h-9', 'px-4', 'py-2', 'has-[>svg]:px-3'];
  }
};

export default function (Alpine) {
  Alpine.directive('h-button', (el, { original, modifiers }, { cleanup }) => {
    setButtonClasses(el);
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'button');
    }

    const inGroup = modifiers.includes('group');

    let lastSize;

    function setVariant(variant) {
      for (const [_, value] of Object.entries(buttonVariants)) {
        el.classList.remove(...value);
      }
      if (buttonVariants.hasOwnProperty(variant)) el.classList.add(...buttonVariants[variant]);
    }

    function setSize(size = 'default') {
      el.classList.remove(...getButtonSize(lastSize, inGroup));
      el.classList.add(...getButtonSize(size, inGroup));
      if (size.startsWith('icon') && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
        console.error(`${original}: Icon-only buttons must have an "aria-label" or "aria-labelledby" attribute`, el);
      }
      lastSize = size;
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');
    if (inGroup) {
      el.classList.remove('shadow-button', 'inline-flex');
      el.classList.add('shadow-none', 'flex');
      setSize(el.getAttribute('data-size') ?? 'xs');
    } else {
      if (el.hasAttribute('data-size')) {
        setSize(el.getAttribute('data-size'));
      } else {
        if (['date-picker-trigger', 'time-picker-trigger'].includes(el.getAttribute('data-slot'))) {
          setSize('icon-xs');
        } else {
          setSize();
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-variant') setVariant(el.getAttribute('data-variant') ?? 'default');
        else setSize(el.getAttribute('data-size') ?? (inGroup ? 'xs' : 'default'));
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-size'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-button-group', (el) => {
    el.classList.add(
      'flex',
      'w-fit',
      'items-stretch',
      '[&>*]:focus-visible:z-10',
      '[&>*]:focus-visible:relative',
      "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
      '[&>input]:flex-1',
      'has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-control',
      'has-[>[data-slot=button-group]]:gap-2'
    );
    el.setAttribute('role', 'group');
    el.setAttribute('data-slot', 'button-group');
    const variants = {
      horizontal: ['[&>*:not(:first-child)]:rounded-l-none', '[&>*:not(:first-child)]:border-l-0', '[&>*:not(:last-child)]:rounded-r-none'],
      vertical: ['flex-col', '[&>*:not(:first-child)]:rounded-t-none', '[&>*:not(:first-child)]:border-t-0', '[&>*:not(:last-child)]:rounded-b-none'],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (variants.hasOwnProperty(variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-orientation') ?? 'horizontal');
  });

  Alpine.directive('h-button-group-separator', (el) => {
    el.classList.add('bg-foreground/20', 'shrink-0', '[[data-orientation=vertical]_&]:h-px', '[[data-orientation=vertical]_&]:w-full', 'h-auto', 'w-px', 'relative', '!m-0', 'self-stretch');
    el.setAttribute('role', 'none');
    el.setAttribute('data-slot', 'button-group-separator');
  });
}
