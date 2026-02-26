export default function (Alpine) {
  Alpine.directive('h-sidebar', (el, { modifiers }, { cleanup }) => {
    el.classList.add('group/sidebar', 'bg-sidebar', 'text-sidebar-foreground', 'border-sidebar-border', 'vbox', 'h-full', 'w-(--sidebar-width,16rem)', 'data-[collapsed=true]:w-min');
    if (modifiers.includes('right')) el.classList.add('border-l');
    else el.classList.add('border-r');

    el.setAttribute('data-slot', 'sidebar');

    const setFloating = () => {
      if (el.getAttribute('data-floating') === 'true') {
        el.classList.add('border', 'rounded-lg', 'shadow-sm');
      } else {
        el.classList.remove('border', 'rounded-lg', 'shadow-sm');
      }
    };

    setFloating();

    const observer = new MutationObserver(() => {
      setFloating();
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-floating'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-sidebar-header', (el) => {
    el.classList.add('vbox', 'gap-2', 'px-2', 'h-12', 'justify-center', 'border-b');
    if (el.dataset.borderless && el.dataset.borderless === 'true') el.classList.remove('border-b');
    el.setAttribute('data-slot', 'sidebar-header');
  });

  Alpine.directive('h-sidebar-content', (el) => {
    el.classList.add('vbox', 'min-h-0', 'flex-1', 'gap-2', 'overflow-auto', 'group-data-[collapsed=true]/sidebar:overflow-hidden');
    el.setAttribute('data-slot', 'sidebar-content');
  });

  Alpine.directive('h-sidebar-group', (el) => {
    el.classList.add('relative', 'vbox', 'w-full', 'min-w-0', 'p-2');
    el.setAttribute('data-slot', 'sidebar-group');
  });

  Alpine.directive('h-sidebar-group-label', (el, { modifiers }) => {
    el.classList.add(
      'text-sidebar-foreground/70',
      'ring-sidebar-ring',
      'flex',
      'h-8',
      'shrink-0',
      'items-center',
      'rounded-md',
      'px-2',
      'text-xs',
      'font-medium',
      'outline-hidden',
      'transition-[margin,opacity]',
      'duration-200',
      'ease-linear',
      'focus-visible:ring-2',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0',
      'group-data-[collapsed=true]/sidebar:!hidden'
    );
    if (modifiers.includes('action')) el.classList.add('hover:bg-secondary-hover', 'active:bg-secondary-active');
    el.setAttribute('data-slot', 'sidebar-group-label');
  });

  Alpine.directive('h-sidebar-group-action', (el) => {
    el.classList.add(
      'text-sidebar-foreground',
      'ring-sidebar-ring',
      'hover:bg-sidebar-secondary',
      'hover:text-sidebar-secondary-foreground',
      'absolute',
      'top-3.5',
      'right-3',
      'flex',
      'aspect-square',
      'w-5',
      'items-center',
      'justify-center',
      'rounded-md',
      'p-0',
      'outline-hidden',
      'transition-transform',
      'focus-visible:ring-2',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0',
      'after:absolute',
      'after:-inset-2',
      'md:after:hidden',
      'group-data-[collapsed=true]/sidebar:hidden'
    );
    if (el.tagName !== 'BUTTON') {
      el.setAttribute('role', 'button');
    } else {
      el.setAttribute('type', 'button');
    }
    el.setAttribute('data-slot', 'sidebar-group-action');
  });

  Alpine.directive('h-sidebar-group-content', (el) => {
    el.classList.add('w-full', 'text-sm');
    el.setAttribute('data-slot', 'sidebar-group-content');
  });

  Alpine.directive('h-sidebar-menu', (el) => {
    el.classList.add('vbox', 'w-full', 'min-w-0', 'gap-1');
    el.setAttribute('data-slot', 'sidebar-menu');
  });

  Alpine.directive('h-sidebar-menu-item', (el, { original }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button`);
    }
    el.classList.add('group/menu-item', 'relative');
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'sidebar-menu-item');
  });

  Alpine.directive('h-sidebar-menu-button', (el) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button`);
    }
    el.classList.add(
      'peer/menu-button',
      'flex',
      'w-full',
      'items-center',
      'gap-2',
      'overflow-hidden',
      'rounded-md',
      'p-2',
      'text-left',
      'text-sm',
      'align-middle',
      'outline-hidden',
      'ring-sidebar-ring',
      'transition-[width,height,padding]',
      'hover:bg-sidebar-secondary',
      'hover:text-sidebar-secondary-foreground',
      'focus-visible:ring-2',
      'active:bg-sidebar-primary',
      'active:text-sidebar-primary-foreground',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'group-has-data-[sidebar=menu-action]/menu-item:pr-8',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-50',
      'data-[active=true]:bg-sidebar-primary',
      'data-[active=true]:font-medium',
      'data-[active=true]:text-sidebar-primary-foreground',
      'data-[state=open]:hover:bg-sidebar-secondary',
      'data-[state=open]:hover:text-sidebar-secondary-foreground',
      'group-data-[collapsed=true]/sidebar:!size-8',
      'group-data-[collapsed=true]/sidebar:!p-2',
      'group-data-[collapsed=true]/sidebar:[&>*:not(svg:first-child):not([data-slot=menu])]:!hidden',
      '[&>span]:truncate',
      '[&>span]:align-middle',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0',
      '[&>svg:not(:first-child):last-child]:ml-auto'
    );
    el.setAttribute('type', 'button');
    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'sidebar-menu-button');

    const sizes = {
      default: ['h-8', 'text-sm'],
      sm: ['h-7', 'text-xs'],
      lg: ['h-12', 'text-sm', 'group-data-[collapsed=true]/sidebar:p-0!'],
    };
    function setSize(size) {
      if (sizes.hasOwnProperty(size)) {
        el.classList.add(...sizes[size]);
      }
    }
    if (!el.hasAttribute('data-size')) el.setAttribute('data-size', 'default');
    setSize(el.getAttribute('data-size'));
  });

  Alpine.directive('h-sidebar-menu-action', (el, { modifiers }) => {
    el.classList.add(
      'text-sidebar-foreground',
      'ring-sidebar-ring',
      'hover:bg-sidebar-secondary',
      'hover:text-sidebar-secondary-foreground',
      'peer-hover/menu-button:text-sidebar-secondary-foreground',
      'absolute',
      'top-1.5',
      'right-1.5',
      'flex',
      'aspect-square',
      'w-5',
      'items-center',
      'justify-center',
      'rounded-md',
      'p-0',
      'outline-hidden',
      'transition-transform',
      'focus-visible:ring-2',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0',
      'after:absolute',
      'after:-inset-2',
      'md:after:hidden',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsed=true]/sidebar:hidden'
    );
    if (modifiers.includes('autohide')) {
      el.classList.add('peer-data-[active=true]/menu-button:text-sidebar-secondary-foreground', 'group-focus-within/menu-item:opacity-100', 'group-hover/menu-item:opacity-100', 'data-[state=open]:opacity-100', 'md:opacity-0');
    }
    if (el.tagName !== 'BUTTON') {
      el.setAttribute('role', 'button');
    } else {
      el.setAttribute('type', 'button');
    }
    el.setAttribute('data-slot', 'sidebar-menu-action');
  });

  Alpine.directive('h-sidebar-menu-badge', (el) => {
    el.classList.add(
      'text-sidebar-foreground',
      'pointer-events-none',
      'absolute',
      'right-1.5',
      'flex',
      'h-5',
      'min-w-5',
      'items-center',
      'justify-center',
      'rounded-md',
      'px-1',
      'text-xs',
      'font-medium',
      'tabular-nums',
      'select-none',
      'peer-hover/menu-button:text-sidebar-secondary-foreground',
      'peer-data-[active=true]/menu-button:text-sidebar-primary-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsed=true]/sidebar:hidden'
    );
    el.setAttribute('data-slot', 'sidebar-menu-badge');
  });

  Alpine.directive('h-sidebar-menu-skeleton', (el, { modifiers }) => {
    el.classList.add('flex', 'h-8', 'items-center', 'gap-2', 'rounded-md', 'px-2');
    if (modifiers.includes('icon')) {
      const icon = document.createElement('div');
      icon.classList.add('size-4', 'rounded-md', 'bg-sidebar-secondary', 'animate-pulse', 'rounded-md');
      el.appendChild(icon);
    }
    const skeleton = document.createElement('div');
    skeleton.classList.add('h-4', 'flex-1', 'bg-sidebar-secondary', 'animate-pulse', 'rounded-md');
    skeleton.style.maxWidth = `${Math.floor(Math.random() * 40) + 50}%`;
    el.appendChild(skeleton);
    el.setAttribute('data-slot', 'sidebar-menu-skeleton');
  });

  Alpine.directive('h-sidebar-separator', (el) => {
    el.classList.add('bg-sidebar-border', 'w-auto', 'bg-border', 'shrink-0', 'h-px', 'w-full');
    el.setAttribute('data-slot', 'sidebar-separator');
    el.setAttribute('role', 'none');
  });

  Alpine.directive('h-sidebar-menu-sub', (el, { modifiers }) => {
    el.classList.add('vbox', 'min-w-0', 'translate-x-px', 'gap-1', 'py-0.5', 'group-data-[collapsed=true]/sidebar:!hidden');
    if (!modifiers.includes('flat')) {
      el.classList.add('border-sidebar-border', 'mx-3.5', 'border-l', 'px-2.5');
    }
    el.setAttribute('data-slot', 'sidebar-menu-sub');
  });

  Alpine.directive('h-sidebar-menu-sub-item', (el) => {
    el.classList.add('group/menu-sub-item', 'relative');
    el.setAttribute('data-slot', 'sidebar-menu-sub-item');
  });

  Alpine.directive('h-sidebar-menu-sub-button', (el) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button`);
    }
    el.classList.add(
      'text-sidebar-foreground',
      'ring-sidebar-ring',
      'hover:bg-sidebar-secondary',
      'hover:text-sidebar-secondary-foreground',
      'active:bg-primary-secondary',
      'active:text-sidebar-primary-foreground',
      '[&>svg]:text-sidebar-secondary-foreground',
      'flex',
      'h-7',
      'w-full',
      'min-w-0',
      '-translate-x-px',
      'items-center',
      'gap-2',
      'overflow-hidden',
      'rounded-md',
      'px-2',
      'align-middle',
      'outline-hidden',
      'focus-visible:ring-2',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-50',
      '[&>span]:truncate',
      '[&>span]:align-middle',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0',
      '[&>svg:not(:first-child):last-child]:ml-auto',
      'data-[active=true]:bg-sidebar-primary',
      'data-[active=true]:text-sidebar-primary-foreground',
      'group-data-[collapsed=true]/sidebar:hidden'
    );
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'sidebar-menu-sub-button');

    const sizes = {
      sm: ['text-xs'],
      md: ['text-sm'],
    };
    function setSize(size) {
      if (sizes.hasOwnProperty(size)) {
        el.classList.add(...sizes[size]);
      }
    }
    if (!el.hasAttribute('data-size')) el.setAttribute('data-size', 'md');
    setSize(el.getAttribute('data-size'));
  });

  Alpine.directive('h-sidebar-footer', (el) => {
    el.classList.add('vbox', 'gap-2', 'px-2', 'h-12', 'justify-center', 'border-t');
    if (el.dataset.borderless && el.dataset.borderless === 'true') el.classList.remove('border-t');
    el.setAttribute('data-slot', 'sidebar-footer');
  });
}
