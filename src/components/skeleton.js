export default function (Alpine) {
  Alpine.directive('h-skeleton', (el, { modifiers }) => {
    el.classList.add('bg-secondary', 'animate-pulse');
    if (modifiers.includes('control')) {
      el.classList.add('rounded-control');
      switch (el.getAttribute('data-size')) {
        case 'sm':
          el.classList.add('h-6.5');
          break;
        case 'md':
          el.classList.add('h-8');
          break;
        default:
          el.classList.add('h-9');
          break;
      }
    } else if (modifiers.includes('card')) {
      el.classList.add('rounded-lg');
    } else if (modifiers.includes('avatar')) {
      el.classList.add('rounded-full', 'size-8', 'aspect-square');
    } else el.classList.add('rounded-md');
    el.setAttribute('data-slot', 'skeleton');
  });
}
