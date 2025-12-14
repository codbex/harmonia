export default function (Alpine) {
  Alpine.directive('h-card', (el) => {
    el.classList.add('bg-card', 'text-card-foreground', 'vbox', 'gap-4', 'rounded-xl', 'border', 'py-6', 'shadow-sm');
    el.setAttribute('data-slot', 'card');
  });

  Alpine.directive('h-card-header', (el) => {
    el.classList.add('@container/card-header', 'grid', 'auto-rows-min', 'grid-rows-[auto_auto]', 'items-start', 'gap-2', 'px-6', 'has-data-[slot=card-action]:grid-cols-[1fr_auto]', '[.border-b]:pb-6');
    el.setAttribute('data-slot', 'card-header');
  });

  Alpine.directive('h-card-title', (el) => {
    el.classList.add('leading-none', 'font-semibold');
    el.setAttribute('data-slot', 'card-title');
  });

  Alpine.directive('h-card-description', (el) => {
    el.classList.add('text-muted-foreground', 'text-sm');
    el.setAttribute('data-slot', 'card-description');
  });

  Alpine.directive('h-card-action', (el) => {
    el.classList.add('col-start-2', 'row-span-2', 'row-start-1', 'self-start', 'justify-self-end');
    el.setAttribute('data-slot', 'card-action');
  });

  Alpine.directive('h-card-content', (el) => {
    el.classList.add('px-6');
    el.setAttribute('data-slot', 'card-content');
  });

  Alpine.directive('h-card-footer', (el) => {
    el.classList.add('flex', 'items-center', 'px-6', '[.border-t]:pt-6');
    el.setAttribute('data-slot', 'card-footer');
  });
}
