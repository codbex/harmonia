export default function (Alpine) {
  Alpine.directive('h-tile-group', (el) => {
    el.classList.add('group/tile-group', 'gap-2');
    el.setAttribute('role', 'list');
    el.setAttribute('data-slot', 'tile-group');
  });

  Alpine.directive('h-tile', (el) => {
    el.classList.add(
      'group/tile',
      'flex',
      'items-center',
      'text-sm',
      'rounded-lg',
      'transition-colors',
      '[a]:hover:bg-secondary-hover',
      '[a]:hover:text-secondary-foreground',
      '[a]:transition-colors',
      'duration-100',
      'flex-wrap',
      'outline-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]'
    );
    el.setAttribute('data-slot', 'tile');

    const sizes = {
      default: ['p-4', 'gap-4'],
      sm: ['py-3', 'px-4', 'gap-2.5'],
    };

    function setSize(size) {
      el.classList.add(...sizes[size]);
      el.setAttribute('data-size', size);
    }

    switch (el.getAttribute('data-variant')) {
      case 'outline':
        el.classList.add('border', 'border-border');
        break;
      case 'shadow':
        el.classList.add('border', 'shadow-sm');
        break;
      case 'muted':
        el.classList.add('bg-muted');
        break;
      default:
        el.classList.add('border', 'bg-transparent', 'border-transparent');
    }

    if (el.getAttribute('data-size') === 'sm') {
      setSize('sm');
    } else setSize('sm');
  });

  Alpine.directive('h-tile-header', (el) => {
    el.classList.add('flex', 'basis-full', 'items-center', 'justify-between', 'gap-2');
    el.setAttribute('data-slot', 'tile-header');
  });

  Alpine.directive('h-tile-media', (el) => {
    el.classList.add('flex', 'shrink-0', 'items-center', 'justify-center', 'gap-2', 'group-has-[[data-slot=tile-description]]/tile:self-start', '[&_svg]:pointer-events-none', 'group-has-[[data-slot=tile-description]]/tile:translate-y-0.5');
    el.setAttribute('role', 'list');
    el.setAttribute('data-slot', 'tile-media');

    switch (el.getAttribute('data-variant')) {
      case 'icon':
        el.classList.add('size-8', 'border', 'rounded-lg', 'bg-muted', "[&_svg:not([class*='size-'])]:size-4");
        break;
      case 'image':
        el.classList.add('size-10', 'rounded-lg', 'overflow-hidden', '[&_img]:size-full', '[&_img]:object-cover');
        break;
      default:
        el.classList.add('bg-transparent');
    }
  });

  Alpine.directive('h-tile-content', (el) => {
    el.classList.add('vbox', 'flex-1', 'gap-1', '[&+[data-slot=tile-content]]:flex-none');
    el.setAttribute('data-slot', 'tile-content');
  });

  Alpine.directive('h-tile-title', (el) => {
    el.classList.add('flex', 'w-fit', 'items-center', 'gap-2', 'text-sm', 'leading-snug', 'font-medium');
    el.setAttribute('data-slot', 'tile-title');
  });

  Alpine.directive('h-tile-description', (el) => {
    el.classList.add('text-muted-foreground', 'line-clamp-2', 'text-sm', 'leading-normal', 'font-normal', 'text-balance', '[&>a:hover]:text-primary', '[&>a]:underline', '[&>a]:underline-offset-4');
    el.setAttribute('data-slot', 'tile-description');
  });

  Alpine.directive('h-tile-actions', (el) => {
    el.classList.add('flex', 'items-center', 'gap-2');
    el.setAttribute('data-slot', 'tile-actions');
  });

  Alpine.directive('h-tile-footer', (el) => {
    el.classList.add('flex', 'basis-full', 'items-center', 'justify-between', 'gap-2');
    el.setAttribute('data-slot', 'tile-footer');
  });
}
