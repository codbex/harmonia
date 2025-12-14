export default function (Alpine) {
  Alpine.directive('h-skeleton', (el, { modifiers }) => {
    el.classList.add('bg-secondary', 'animate-pulse');
    if (modifiers.includes('control')) {
      el.classList.add('rounded-control');
    } else if (modifiers.includes('card')) {
      el.classList.add('rounded-lg');
    } else if (modifiers.includes('avatar')) {
      el.classList.add('rounded-full', 'size-8');
    } else el.classList.add('rounded-md');
    el.setAttribute('data-slot', 'skeleton');
  });
}
