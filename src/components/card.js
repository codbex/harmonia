export default function (Alpine) {
  Alpine.directive('h-card', (el) => {
    el.classList.add('bg-card', '[--badge-ring:var(--card)]', 'text-card-foreground', 'vbox', 'rounded-xl', 'border', 'shadow-sm');
    el.setAttribute('data-slot', 'card');
  });

  Alpine.directive('h-card-header', (el) => {
    el.classList.add('@container/card-header', 'grid', 'auto-rows-min', 'items-start', 'gap-2', 'px-6', 'pt-6', 'last-rendered:pb-6', 'has-data-[slot=card-action]:grid-cols-[minmax(0,1fr)_auto]', '[.border-b]:pb-6');
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

  Alpine.directive('h-card-content', (el, { modifiers }) => {
    el.setAttribute('data-slot', 'card-content');
    el.classList.add('min-h-0');
    if (!modifiers.includes('flush')) {
      el.classList.add('px-6', 'py-4', 'first-rendered:pt-6', 'last-rendered:pb-6');
    }
  });

  Alpine.directive('h-card-footer', (el) => {
    // The 16 between a header and the content is paid by the content, so a
    // footer only pays it where there is no content to do so. An x-if template
    // between the two is a sibling that renders nothing, so the header cannot be
    // matched with '+'. Asking for "a header before me and no content before me"
    // instead picks the same set given the slot order, and no template defeats it.
    el.classList.add('flex', 'items-center', 'px-6', 'pb-6', 'first-rendered:pt-6', '[[data-slot=card-header]~&:not([data-slot=card-content]~*)]:pt-4', '[.border-t]:pt-6');
    el.setAttribute('data-slot', 'card-footer');
  });
}
