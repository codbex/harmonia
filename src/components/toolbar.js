export default function (Alpine) {
  Alpine.directive('h-toolbar', (el, { modifiers }) => {
    el.classList.add(
      'bg-object-header',
      'text-object-header-foreground',
      'hbox',
      'shrink-0',
      'items-center',
      'px-1',
      'has-[>[data-slot="avatar"]:last-of-type]:pr-2',
      'has-[>[data-slot="toolbar-image"]:first-of-type]:pl-2',
      'gap-1',
      modifiers.includes('footer') ? 'border-t' : 'border-b',
      'w-full',
      'h-12',
      'data-[size=sm]:h-8',
      'data-[size=md]:h-10',
      'data-[variant=transparent]:bg-transparent',
      'data-[variant=transparent]:text-foreground',
      'data-[floating=true]:shadow-xs',
      'data-[floating=true]:rounded-lg',
      'data-[floating=true]:border'
    );
    el.setAttribute('data-slot', 'toolbar');
  });

  Alpine.directive('h-toolbar-image', (el) => {
    el.classList.add('size-8', '[[data-size=md]_&]:size-7', '[[data-size=sm]_&]:size-6');
    el.setAttribute('data-slot', 'toolbar-image');
  });

  Alpine.directive('h-toolbar-branding', (el) => {
    el.classList.add(
      'flex',
      'flex-col',
      'pl-2',
      '[[data-slot=toolbar-image]~&]:pl-1',
      '[[data-size=sm]_&,[data-size=md]_&]:flex-row',
      '[[data-size=sm]_&,[data-size=md]_&]:items-baseline',
      '[[data-size=sm]_&,[data-size=md]_&]:gap-1',
      '[[data-size=sm]_&_[data-slot=toolbar-subtitle],[data-size=md]_&_[data-slot=toolbar-subtitle]]:pl-0'
    );
    el.setAttribute('data-slot', 'toolbar-branding');
  });

  Alpine.directive('h-toolbar-title', (el) => {
    el.classList.add('pl-2', '[[data-slot=toolbar-branding]_&]:pl-0', 'font-medium', 'whitespace-nowrap', 'text-ellipsis', 'overflow-hidden');
    el.setAttribute('data-slot', 'toolbar-title');
  });

  Alpine.directive('h-toolbar-subtitle', (el) => {
    el.classList.add('text-xs', 'font-normal', 'whitespace-nowrap', 'text-ellipsis', 'overflow-hidden');
    el.setAttribute('data-slot', 'toolbar-subtitle');
  });

  Alpine.directive('h-toolbar-spacer', (el) => {
    el.classList.add('flex-[1_auto]', 'h-full');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'toolbar-spacer');
  });

  Alpine.directive('h-toolbar-separator', (el) => {
    el.classList.add('w-px', 'h-8', '[[data-size=md]_&,[data-size=sm]_&]:h-6', 'border-l');
    el.setAttribute('data-slot', 'toolbar-separator');
  });
}
