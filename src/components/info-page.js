export default function (Alpine) {
  Alpine.directive('h-info-page', (el) => {
    el.classList.add('vbox', 'min-w-0', 'flex-1', 'items-center', 'justify-center', 'gap-6', 'rounded-lg', 'border-dashed', 'p-6', 'text-center', 'text-balance', 'md:p-12');
    el.setAttribute('data-slot', 'info-page');
  });

  Alpine.directive('h-info-page-header', (el) => {
    el.classList.add('vbox', 'max-w-sm', 'items-center', 'gap-2', 'text-center');
    el.setAttribute('data-slot', 'info-page-header');
  });

  Alpine.directive('h-info-page-media', (el, { modifiers }) => {
    el.classList.add('hbox', 'shrink-0', 'items-center', 'justify-center', '[&_svg]:pointer-events-none', '[&_svg]:shrink-0');
    if (modifiers.includes('icon')) el.classList.add('bg-muted', 'text-foreground', 'size-10', 'shrink-0', 'items-center', 'justify-center', 'rounded-lg', "[&_svg:not([class*='size-'])]:size-6");
    else el.classList.add('bg-transparent');
    el.setAttribute('data-slot', 'info-page-media');
  });

  Alpine.directive('h-info-page-title', (el) => {
    el.classList.add('text-lg', 'font-medium', 'tracking-tight');
    el.setAttribute('data-slot', 'info-page-title');
  });

  Alpine.directive('h-info-page-description', (el) => {
    el.classList.add('text-muted-foreground', '[&>a:hover]:text-primary', 'text-sm/relaxed', '[&>a]:underline', '[&>a]:underline-offset-4');
    el.setAttribute('data-slot', 'info-page-description');
  });

  Alpine.directive('h-info-page-content', (el) => {
    el.classList.add('vbox', 'w-full', 'max-w-sm', 'min-w-0', 'items-center', 'gap-4', 'text-sm', 'text-balance');
    el.setAttribute('data-slot', 'info-page-description');
  });
}
