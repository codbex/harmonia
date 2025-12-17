export default function (Alpine) {
  Alpine.directive('h-input', (el, { modifiers }) => {
    el.classList.add(
      'file:text-foreground',
      'placeholder:text-muted-foreground',
      'selection:bg-primary',
      'selection:text-primary-foreground',
      'bg-input-inner',
      'border-input',
      'w-full',
      'min-w-0',
      'rounded-control',
      'border',
      "[&:not([type='color'])]:px-3",
      "[&:not([type='color'])]:py-1",
      "[&[type='color']]:overflow-hidden",
      '[&::-moz-color-swatch]:border-0',
      '[&::-webkit-color-swatch]:border-0',
      '[&::-webkit-color-swatch-wrapper]:rounded-0',
      '[&::-webkit-color-swatch-wrapper]:p-0',
      'text-base',
      'shadow-control',
      'transition-[color,box-shadow]',
      'outline-none',
      'file:inline-flex',
      'file:h-7',
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium',
      'disabled:pointer-events-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'md:text-sm',
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
    if (modifiers.includes('group')) {
      el.classList.remove('rounded-control', 'border', 'bg-input-inner', 'shadow-control', 'focus-visible:ring-[3px]');
      el.classList.add('flex-1', 'rounded-none', 'border-0', 'bg-transparent', 'shadow-none', 'focus-visible:ring-0');
      el.setAttribute('data-slot', 'input-group-control');
    } else el.setAttribute('data-slot', 'input');
    if (el.getAttribute('data-size') === 'sm') el.classList.add('h-8');
    else if (el.getAttribute('data-size') === 'xs') el.classList.add('h-6.5');
    else el.classList.add('h-9');
  });

  Alpine.directive('h-input-group', (el) => {
    el.classList.add(
      'group/input-group',
      'border-input',
      'bg-input-inner',
      'relative',
      'flex',
      'w-full',
      'items-center',
      'rounded-control',
      'border',
      'shadow-control',
      'transition-[color,box-shadow]',
      'outline-none',
      'h-9',
      'min-w-0',
      'has-[>textarea]:h-auto',
      'has-[>[data-align=inline-start]]:[&>input]:pl-2',
      'has-[>[data-align=inline-end]]:[&>input]:pr-2',
      'has-[>[data-align=block-start]]:h-auto',
      'has-[>[data-align=block-start]]:flex-col',
      'has-[>[data-align=block-start]]:[&>input]:pb-3',
      'has-[>[data-align=block-end]]:h-auto',
      'has-[>[data-align=block-end]]:flex-col',
      'has-[>[data-align=block-end]]:[&>input]:pt-3',
      'has-[[data-slot=input-group-control]:focus-visible]:border-ring',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',
      'has-[[data-slot][aria-invalid=true]]:ring-negative/20',
      'has-[[data-slot][aria-invalid=true]]:border-negative',
      'dark:has-[[data-slot][aria-invalid=true]]:ring-negative/40'
    );
    el.setAttribute('role', 'group');
    el.setAttribute('data-slot', 'input-group');
  });

  Alpine.directive('h-input-group-addon', (el, {}, { cleanup }) => {
    el.classList.add(
      'text-muted-foreground',
      'flex',
      'h-auto',
      'cursor-text',
      'items-center',
      'justify-center',
      'gap-2',
      'py-1.5',
      'text-sm',
      'font-medium',
      'select-none',
      "[&>svg:not([class*='size-'])]:size-4",
      '[&>[data-slot=tag]]:rounded-[calc(var(--radius)-5px)]',
      'data-[disabled=true]:opacity-50',
      'data-[disabled=true]:pointer-events-none'
    );
    el.setAttribute('role', 'group');
    el.setAttribute('data-slot', 'input-group-addon');

    const variants = {
      'inline-start': ['order-first', 'pl-3', 'has-[>button]:ml-[-0.45rem]', 'has-[>[data-slot=tag]]:ml-[-0.35rem]'],
      'inline-end': ['order-last', 'pr-3', 'has-[>button]:mr-[-0.45rem]', 'has-[>[data-slot=tag]]:mr-[-0.35rem]'],
      'block-start': ['order-first', 'w-full', 'justify-start', 'px-3', 'pt-3', '[.border-b]:pb-3', 'group-has-[>input]/input-group:pt-2.5'],
      'block-end': ['order-last', 'w-full', 'justify-start', 'px-3', 'pb-3', '[.border-t]:pt-3', 'group-has-[>input]/input-group:pb-2.5'],
    };

    function setVariant(variant) {
      if (variants.hasOwnProperty(variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-align') ?? 'inline-start');

    const handler = (event) => {
      if (event.target.closest('button')) {
        return;
      }
      let input = event.currentTarget.parentElement?.querySelector('input');
      if (!input) input = event.currentTarget.parentElement?.querySelector('textarea');
      input?.focus();
    };

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-input-group-text', (el) => {
    el.classList.add('text-muted-foreground', 'flex', 'items-center', 'gap-2', 'text-sm', '[&_svg]:pointer-events-none', "[&_svg:not([class*='size-'])]:size-4");
    el.setAttribute('data-slot', 'label');
  });
}
