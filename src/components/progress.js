export default function (Alpine) {
  Alpine.directive('h-progress', (el, { expression }, { effect, evaluateLater }) => {
    el.classList.add('bg-secondary', 'relative', 'h-2', 'w-full', 'overflow-hidden', 'rounded-full');
    el.setAttribute('data-slot', 'progress');

    const indicator = document.createElement('div');
    indicator.classList.add('bg-primary', 'h-full', 'w-full', 'flex-1', 'transition-all', 'motion-reduce:transition-none', 'rounded-full');
    indicator.setAttribute('data-slot', 'progress-indicator');
    Object.assign(indicator.style, {
      transform: `translateX(-${100 - 0}%)`,
    });
    el.appendChild(indicator);

    const getProgress = evaluateLater(expression);

    effect(() => {
      getProgress((progress) => {
        Object.assign(indicator.style, {
          transform: `translateX(-${100 - (progress ?? 0)}%)`,
        });
      });
    });
  });
}
