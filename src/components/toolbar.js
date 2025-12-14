export default function (Alpine) {
  Alpine.directive('h-toolbar', (el, { modifiers }) => {
    el.classList.add(
      'bg-object-header',
      'text-object-header-foreground',
      'hbox',
      'shrink-0',
      'items-center',
      'px-1',
      'has-[>[data-slot="avatar"]:last-child]:pr-2',
      'has-[>[data-slot="toolbar-image"]:first-child]:pl-2',
      'gap-1',
      modifiers.includes('footer') ? 'border-t' : 'border-b',
      'w-full',
      'h-12',
      'data-[size=sm]:h-8',
      'data-[variant=transparent]:bg-transparent',
      'data-[variant=transparent]:text-foreground',
      'data-[floating=true]:shadow-xs',
      'data-[floating=true]:rounded-lg',
      'data-[floating=true]:border'
    );
    el.setAttribute('data-slot', 'toolbar');
  });

  Alpine.directive('h-toolbar-image', (el) => {
    el.classList.add('size-8', '[[data-size=sm]_&]:size-6');
    el.setAttribute('data-slot', 'toolbar-image');
  });

  Alpine.directive('h-toolbar-title', (el) => {
    el.classList.add('text', '[[data-size=sm]_&]:text-sm', 'first:pl-2', 'font-medium', 'whitespace-nowrap', 'text-ellipsis', 'overflow-hidden');
    el.setAttribute('data-slot', 'toolbar-title');
  });

  Alpine.directive('h-toolbar-spacer', (el) => {
    el.classList.add('flex-[1_auto]', 'h-full');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'toolbar-spacer');
  });

  Alpine.directive('h-toolbar-separator', (el) => {
    el.classList.add('w-px', 'h-8', '[[data-size=sm]_&]:h-6', 'border-l');
    el.setAttribute('data-slot', 'toolbar-separator');
  });
}
