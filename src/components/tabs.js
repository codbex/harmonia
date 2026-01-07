import { buttonVariants, setButtonClasses } from './button';

export default function (Alpine) {
  Alpine.directive('h-tabs', (el) => {
    el.classList.add('group/tabs', 'flex', 'data-[orientation=horizontal]:flex-col', 'data-[orientation=vertical]:flex-row');
    el.setAttribute('data-slot', 'tabs');
  });

  Alpine.directive('h-tab-bar', (el) => {
    el.classList.add(
      'group/tab-bar',
      'flex',
      'gap-1',
      'bg-object-header',
      'text-object-header-foreground',
      'group-data-[orientation=horizontal]/tabs:flex-row',
      'group-data-[orientation=vertical]/tabs:flex-col',
      '[&:not([data-floating=true])]:group-data-[orientation=horizontal]/tabs:inset-shadow-[0_-.063rem_var(--border)]',
      '[&:not([data-floating=true])]:group-data-[orientation=vertical]/tabs:inset-shadow-[-.063rem_0_var(--border)]',
      '[&:not([data-floating=true])]:group-data-[orientation=horizontal]/tabs:h-10',
      '[&:not([data-floating=true])]:group-data-[orientation=horizontal]/tabs:min-h-10',
      '[&:not([data-floating=true])]:data-[size=sm]:group-data-[orientation=horizontal]/tabs:h-8',
      '[&:not([data-floating=true])]:data-[size=sm]:group-data-[orientation=horizontal]/tabs:min-h-8',
      '[&:not([data-floating=true])]:data-[size=lg]:group-data-[orientation=horizontal]/tabs:h-12',
      '[&:not([data-floating=true])]:data-[size=lg]:group-data-[orientation=horizontal]/tabs:min-h-12',
      'data-[floating=true]:border',
      'data-[floating=true]:shadow-xs',
      'data-[floating=true]:z-1',
      'data-[floating=true]:rounded-lg',
      'data-[floating=true]:p-[0.188rem]'
    );
    el.setAttribute('data-slot', 'tab-bar');
  });

  Alpine.directive('h-tab-list', (el) => {
    el.classList.add(
      'text-muted-foreground',
      'flex',
      'items-start',
      'justify-start',
      'group-data-[orientation=horizontal]/tabs:flex-row',
      'group-data-[orientation=vertical]/tabs:flex-col',
      'group-data-[orientation=vertical]/tabs:h-fit',
      'gap-2',
      'group-data-[floating=true]/tab-bar:gap-1'
    );
    el.setAttribute('role', 'tablist');
    el.setAttribute('data-slot', 'tab-list');
  });

  Alpine.directive('h-tab', (el) => {
    el.classList.add(
      'cursor-pointer',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:outline-ring',
      'text-muted-foreground',
      'hover:text-foreground',
      'aria-selected:text-foreground',
      'inline-flex',
      'group-data-[orientation=vertical]/tabs:w-full',
      'group-data-[orientation=vertical]/tabs:h-8',
      'group-data-[orientation=horizontal]/tabs:h-full',
      'items-center',
      'justify-start',
      'gap-1.5',
      'px-2',
      'py-1',
      'text-sm',
      'font-medium',
      'whitespace-nowrap',
      'transition-[color,box-shadow]',
      'group-data-[floating=true]/tab-bar:rounded-md',
      'group-data-[floating=true]/tab-bar:border',
      'group-data-[floating=true]/tab-bar:border-transparent',
      'group-data-[floating=true]/tab-bar:aria-selected:bg-background',
      'group-data-[floating=true]/tab-bar:aria-selected:border-border',
      'group-data-[floating=true]/tab-bar:hover:bg-background',
      'group-data-[floating=true]/tab-bar:hover:border-border',
      'group-[&:not([data-floating=true])]/tab-bar:border-0',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=horizontal]/tabs:hover:inset-shadow-[0_-.188rem_var(--border)]',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=horizontal]/tabs:aria-selected:inset-shadow-[0_-.125rem_var(--primary)]',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=horizontal]/tabs:hover:aria-selected:inset-shadow-[0_-.188rem_var(--primary)]',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=vertical]/tabs:px-3',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=vertical]/tabs:hover:inset-shadow-[-.188rem_0_var(--border)]',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=vertical]/tabs:aria-selected:inset-shadow-[-.125rem_0_var(--primary)]',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=vertical]/tabs:hover:aria-selected:inset-shadow-[-.188rem_0_var(--primary)]',
      'focus-visible:ring-[3px]',
      'focus-visible:outline-1',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      "[&_svg:not([class*='size-'])]:size-4"
    );
    el.setAttribute('role', 'tab');
    el.setAttribute('data-slot', 'tab');
    if (!el.hasAttribute('id')) throw new Error('h-tab: Tabs must have an id');
    if (!el.hasAttribute('aria-controls')) throw new Error('h-tab: aria-controls must be set to the tab-content id.');
  });

  Alpine.directive('h-tab-action', (el) => {
    el.classList.add('cursor-pointer', 'ml-auto', 'rounded-md', 'text-foreground', 'hover:bg-secondary', 'hover:text-secondary-foreground', 'active:bg-secondary-active');
    el.setAttribute('role', 'button');
    el.setAttribute('data-slot', 'tab-action');
  });

  Alpine.directive('h-tab-list-actions', (el, { modifiers }) => {
    el.classList.add('flex', 'gap-1.5', 'items-center', 'justify-center');
    if (modifiers.includes('end'))
      el.classList.add(
        'group-data-[orientation=horizontal]/tabs:ml-auto',
        'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=horizontal]/tabs:mr-1.5',
        'group-data-[orientation=vertical]/tabs:mt-auto',
        'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=vertical]/tabs:mb-1.5'
      );
    el.setAttribute('data-slot', 'tab-list-actions');
  });

  Alpine.directive('h-tab-list-action', (el) => {
    setButtonClasses(el);
    el.classList.add(
      'group-data-[floating=true]/tab-bar:rounded-md',
      'group-data-[orientation=horizontal]/tabs:aspect-square',
      'group-data-[orientation=horizontal]/tabs:w-auto',
      'group-data-[floating=true]/tab-bar:group-data-[orientation=horizontal]/tabs:h-full',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=horizontal]/tabs:h-[75%]',
      'group-data-[orientation=vertical]/tabs:h-9',
      'group-data-[floating=true]/tab-bar:group-data-[orientation=vertical]/tabs:w-full',
      'group-[&:not([data-floating=true])]/tab-bar:group-data-[orientation=vertical]/tabs:w-[80%]'
    );
    el.classList.add(...buttonVariants[el.getAttribute('data-variant') ?? 'outline']);
    el.setAttribute('role', 'button');
    el.setAttribute('data-slot', 'tab-list-action');
  });

  Alpine.directive('h-tabs-content', (el) => {
    el.classList.add('flex-1', 'outline-none');
    el.setAttribute('role', 'tabpanel');
    el.setAttribute('tabindex', '0');
    el.setAttribute('data-slot', 'tabs-content');
    if (!el.hasAttribute('id')) throw new Error('h-tabs-content: Tab content must have an id');
    if (!el.hasAttribute('aria-labelledby')) throw new Error('h-tabs-content: aria-labelledby must be set to the tab id.');
  });
}
