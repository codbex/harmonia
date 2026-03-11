import { v4 as uuidv4 } from 'uuid';
import { ChevronRight, createSvg } from './../common/icons';

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
    el.classList.add('vbox', 'min-h-0', 'flex-1', 'overflow-auto', 'scrollbar-none');
    el.setAttribute('data-slot', 'sidebar-content');
  });

  Alpine.directive('h-sidebar-group', (el, { expression, modifiers }, { effect, evaluate, evaluateLater, Alpine }) => {
    el.classList.add('relative', 'vbox', 'w-full', 'min-w-0', 'p-2');
    el.setAttribute('data-slot', 'sidebar-group');
    el._h_sidebar_group = {
      collapsable: modifiers.includes('collapsed'),
      controlId: undefined,
      controls: undefined,
      state: Alpine.reactive({
        collapsed: evaluate(expression || 'false'),
      }),
    };
    if (expression) {
      el._h_sidebar_group.state = Alpine.reactive({
        collapsed: evaluate(expression || 'false'),
      });
      const getCollapsed = evaluateLater(expression);
      effect(() => {
        getCollapsed((collapsed) => {
          el._h_sidebar_group.state.collapsed = collapsed;
        });
      });
    }
  });

  Alpine.directive('h-sidebar-group-label', (el, { original }, { cleanup }) => {
    const group = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_sidebar_group'));
    if (!group) {
      throw new Error(`${original} must be placed inside a sidebar group`);
    }
    el.classList.add(
      'ring-sidebar-ring',
      'flex',
      'h-8',
      'shrink-0',
      'items-center',
      'rounded-md',
      'px-2',
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
    el.setAttribute('data-slot', 'sidebar-group-label');

    if (group._h_sidebar_group.collapsable) {
      el.classList.add('text-sidebar-foreground', 'text-sm', 'hover:bg-secondary-hover', 'active:bg-secondary-active');

      if (el.hasAttribute('id')) {
        group._h_sidebar_group.controlId = el.getAttribute('id');
      } else {
        group._h_sidebar_group.controlId = `sgl${uuidv4()}`;
        el.setAttribute('id', group._h_sidebar_group.controlId);
      }
      group._h_sidebar_group.controls = `sgc${uuidv4()}`;
      el.setAttribute('aria-controls', group._h_sidebar_group.controls);
      el.setAttribute('aria-expanded', !group._h_sidebar_group.state.collapsed);

      const handler = () => {
        group._h_sidebar_group.state.collapsed = !group._h_sidebar_group.state.collapsed;
        el.setAttribute('aria-expanded', !group._h_sidebar_group.state.collapsed);
      };

      el.appendChild(
        createSvg({
          icon: ChevronRight,
          classes: 'ml-auto pointer-events-none size-4 shrink-0 transition-transform duration-200 [[aria-expanded=true]>&]:rotate-90',
          attrs: {
            'aria-hidden': true,
            role: 'presentation',
          },
        })
      );

      el.addEventListener('click', handler);

      cleanup(() => {
        el.removeEventListener('click', handler);
      });
    } else {
      el.classList.add('text-sidebar-foreground/70', 'text-xs');
    }
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

  Alpine.directive('h-sidebar-group-content', (el, { original }, { effect }) => {
    const group = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_sidebar_group'));
    if (!group) {
      throw new Error(`${original} must be placed inside a sidebar group`);
    }
    el.classList.add('w-full', 'text-sm', 'data-[collapsed=true]:hidden', 'group-data-[collapsed=true]/sidebar:!block');
    el.setAttribute('data-slot', 'sidebar-group-content');

    if (group._h_sidebar_group.collapsable) {
      el.setAttribute('id', group._h_sidebar_group.controls);
      el.setAttribute('aria-labelledby', group._h_sidebar_group.controlId);
      el.setAttribute('data-collapsed', group._h_sidebar_group.state.collapsed);
      effect(() => {
        el.setAttribute('data-collapsed', group._h_sidebar_group.state.collapsed);
      });
    }
  });

  Alpine.directive('h-sidebar-menu', (el, { original }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be an ul element`);
    }
    el.classList.add('vbox', 'w-full', 'min-w-0', 'gap-1');
    el.setAttribute('data-slot', 'sidebar-menu');
  });

  Alpine.directive('h-sidebar-menu-item', (el, { original, expression, modifiers }, { effect, evaluate, evaluateLater, Alpine }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a li element`);
    }
    el._h_sidebar_menu_item = {
      isSub: false,
      collapsable: modifiers.includes('collapsed'),
      controlId: undefined,
      controls: undefined,
      state: Alpine.reactive({
        collapsed: evaluate(expression || 'false'),
      }),
    };
    let parent = el.parentElement;
    while (parent) {
      if (parent.getAttribute('data-slot') === 'sidebar-menu-sub') {
        el._h_sidebar_menu_item.isSub = true;
        break;
      } else if (parent.getAttribute('data-slot') === 'sidebar') {
        break;
      }
      parent = parent.parentElement;
    }
    if (!el._h_sidebar_menu_item.isSub) {
      el.classList.add('group/menu-item', 'relative');
    } else {
      el.classList.add('relative');
    }
    el.setAttribute('data-slot', 'sidebar-menu-item');

    if (expression) {
      const getCollapsed = evaluateLater(expression);
      effect(() => {
        getCollapsed((collapsed) => {
          el._h_sidebar_menu_item.state.collapsed = collapsed;
        });
      });
    }
  });

  Alpine.directive('h-sidebar-menu-button', (el, { original }, { cleanup, Alpine }) => {
    if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
      throw new Error(`${original} must be a button or a link`);
    } else if (el.tagName === 'BUTTON') {
      el.setAttribute('type', 'button');
    }
    const menuItem = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_sidebar_menu_item'));
    el.classList.add(
      'flex',
      'w-full',
      'items-center',
      'gap-2',
      'overflow-hidden',
      'rounded-md',
      'align-middle',
      '[&>span]:align-middle',
      'outline-hidden',
      'ring-sidebar-ring',
      'hover:bg-sidebar-secondary',
      'hover:text-sidebar-secondary-foreground',
      'focus-visible:ring-2',
      'active:bg-sidebar-primary',
      'active:text-sidebar-primary-foreground',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-50',
      'data-[active=true]:bg-sidebar-primary',
      'data-[active=true]:text-sidebar-primary-foreground',
      '[&>span]:truncate',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0'
    );

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

    setSize(el.getAttribute('data-size') || 'default');

    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'sidebar-menu-button');

    if (menuItem && menuItem._h_sidebar_menu_item.isSub) {
      el.classList.add('text-sidebar-foreground', 'h-7', 'min-w-0', '-translate-x-px', 'px-2', '[&>svg:not(:first-child):last-child]:ml-auto', 'group-data-[collapsed=true]/sidebar:hidden');
      if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'sidebar-menu-sub-button');
    } else {
      el.classList.add(
        'peer/menu-button',
        'p-2',
        'text-left',
        'text-sm',
        'duration-200',
        'transition-[width,height,padding]',
        'group-has-data-[sidebar=menu-action]/menu-item:pr-8',
        'data-[active=true]:font-medium',
        'data-[state=open]:hover:bg-sidebar-secondary',
        'data-[state=open]:hover:text-sidebar-secondary-foreground',
        'group-data-[collapsed=true]/sidebar:!size-8',
        'group-data-[collapsed=true]/sidebar:!p-2',
        'group-data-[collapsed=true]/sidebar:[&>*:not(svg:first-child):not([data-slot=menu])]:!hidden'
      );
    }

    if (menuItem && menuItem._h_sidebar_menu_item.collapsable) {
      if (el.hasAttribute('id')) {
        menuItem._h_sidebar_menu_item.controlId = el.getAttribute('id');
      } else {
        menuItem._h_sidebar_menu_item.controlId = `sgl${uuidv4()}`;
        el.setAttribute('id', menuItem._h_sidebar_menu_item.controlId);
      }
      menuItem._h_sidebar_menu_item.controls = `sgc${uuidv4()}`;
      el.setAttribute('aria-controls', menuItem._h_sidebar_menu_item.controls);
      el.setAttribute('aria-expanded', !menuItem._h_sidebar_menu_item.state.collapsed);

      const handler = () => {
        menuItem._h_sidebar_menu_item.state.collapsed = !menuItem._h_sidebar_menu_item.state.collapsed;
        el.setAttribute('aria-expanded', !menuItem._h_sidebar_menu_item.state.collapsed);
      };

      el.appendChild(
        createSvg({
          icon: ChevronRight,
          classes: 'ml-auto pointer-events-none size-4 shrink-0 transition-transform duration-200 [[aria-expanded=true]>&]:rotate-90',
          attrs: {
            'aria-hidden': true,
            role: 'presentation',
          },
        })
      );

      el.addEventListener('click', handler);

      cleanup(() => {
        el.removeEventListener('click', handler);
      });
    } else {
      el.classList.add('[&>svg:not(:first-child):last-child]:ml-auto');
    }
  });

  Alpine.directive('h-sidebar-menu-action', (el, { modifiers }) => {
    el.classList.add(
      'text-sidebar-foreground',
      'ring-sidebar-ring',
      'hover:bg-sidebar-secondary',
      'active:bg-sidebar-secondary/70',
      'hover:text-sidebar-secondary-foreground',
      'peer-hover/menu-button:text-sidebar-secondary-foreground',
      'peer-active/menu-button:text-sidebar-primary-foreground',
      'peer-data-[active=true]/menu-button:text-sidebar-primary-foreground',
      'absolute',
      'top-0.5',
      'right-0.5',
      'bottom-0.5',
      'flex',
      'aspect-square',
      'h-auto',
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
    if (modifiers.includes('autohide')) {
      el.classList.add('group-focus-within/menu-item:opacity-100', 'group-hover/menu-item:opacity-100', 'data-[state=open]:opacity-100', 'md:opacity-0');
    }
    if (el.tagName !== 'BUTTON') {
      el.setAttribute('role', 'button');
    } else {
      el.setAttribute('type', 'button');
    }
    el.setAttribute('data-slot', 'sidebar-menu-action');
  });

  Alpine.directive('h-sidebar-menu-badge', (el, { original }) => {
    if (el.tagName !== 'SPAN') {
      throw new Error(`${original} must be a span element`);
    }
    el.classList.add('flex-1', 'pointer-events-none', 'flex', 'h-full', 'min-w-min', 'items-center', 'justify-end', 'text-xs', 'font-medium', 'tabular-nums', 'select-none', 'group-data-[collapsed=true]/sidebar:hidden');
    el.setAttribute('data-slot', 'sidebar-menu-badge');
  });

  Alpine.directive('h-sidebar-menu-skeleton', (el, { modifiers }) => {
    el.classList.add('flex', 'h-8', 'items-center', 'gap-2', 'rounded-md', 'px-2');
    const skeleton = document.createElement('div');
    skeleton.classList.add('h-4', 'flex-1', 'bg-sidebar-secondary', 'animate-pulse', 'rounded-md');
    if (modifiers.includes('icon')) {
      skeleton.classList.add('group-data-[collapsed=true]/sidebar:!hidden');
      const icon = document.createElement('div');
      icon.classList.add('size-4', 'rounded-md', 'bg-sidebar-secondary', 'animate-pulse', 'rounded-md');
      el.appendChild(icon);
    } else {
      skeleton.classList.add('group-data-[collapsed=true]/sidebar:!w-4', 'group-data-[collapsed=true]/sidebar:!max-w-4');
    }
    skeleton.style.maxWidth = `${Math.floor(Math.random() * 40) + 50}%`;
    el.appendChild(skeleton);
    el.setAttribute('data-slot', 'sidebar-menu-skeleton');
  });

  Alpine.directive('h-sidebar-separator', (el) => {
    el.classList.add('bg-sidebar-border', 'w-auto', 'bg-border', 'shrink-0', 'h-px', 'w-full');
    el.setAttribute('data-slot', 'sidebar-separator');
    el.setAttribute('role', 'none');
  });

  Alpine.directive('h-sidebar-menu-sub', (el, { original }, { effect, Alpine }) => {
    if (el.tagName !== 'UL') {
      throw new Error(`${original} must be an ul element`);
    }
    const menuItem = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_sidebar_menu_item'));
    if (!menuItem) {
      throw new Error(`${original} must be placed inside a sidebar menu item`);
    }
    el.classList.add('vbox', 'min-w-0', 'translate-x-px', 'gap-1', 'pl-2.5', 'py-0.5', 'ml-3.5', 'data-[collapsed=true]:!hidden', 'group-data-[collapsed=true]/sidebar:!hidden');
    if (el.getAttribute('data-line') !== 'false') {
      el.classList.add('border-sidebar-border', 'border-l');
    }
    el.setAttribute('data-slot', 'sidebar-menu-sub');

    if (menuItem._h_sidebar_menu_item.collapsable) {
      el.setAttribute('id', menuItem._h_sidebar_menu_item.controls);
      el.setAttribute('aria-labelledby', menuItem._h_sidebar_menu_item.controlId);
      el.setAttribute('data-collapsed', menuItem._h_sidebar_menu_item.state.collapsed);
      effect(() => {
        el.setAttribute('data-collapsed', menuItem._h_sidebar_menu_item.state.collapsed);
      });
    }
  });

  Alpine.directive('h-sidebar-footer', (el) => {
    el.classList.add('vbox', 'gap-2', 'px-2', 'h-12', 'justify-center', 'border-t');
    if (el.dataset.borderless && el.dataset.borderless === 'true') el.classList.remove('border-t');
    el.setAttribute('data-slot', 'sidebar-footer');
  });
}
