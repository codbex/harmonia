export default function (Alpine) {
  Alpine.directive('h-tag', (el) => {
    el.classList.add(
      'bg-muted',
      'text-muted-foreground',
      'pointer-events-none',
      'inline-flex',
      'h-5',
      'w-fit',
      'min-w-5',
      'items-center',
      'justify-center',
      'gap-1',
      'rounded-sm',
      'px-1',
      'font-sans',
      'text-xs',
      'font-medium',
      'select-none',
      "[&_svg:not([class*='size-'])]:size-3",
      '[[data-slot=tooltip]_&]:bg-background/20',
      '[[data-slot=tooltip]_&]:text-background'
    );
    el.setAttribute('data-slot', 'tag');
  });

  Alpine.directive('h-tag-group', (el) => {
    el.classList.add('inline-flex', 'items-center', 'gap-1');
    el.setAttribute('data-slot', 'tag-group');
  });
}
