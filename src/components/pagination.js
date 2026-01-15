export default function (Alpine) {
  Alpine.directive('h-pagination', (el) => {
    el.classList.add('mx-auto', 'flex', 'w-full', 'justify-center');
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', 'pagination');
    el.setAttribute('data-slot', 'pagination');
  });

  Alpine.directive('h-pagination-content', (el) => {
    el.classList.add('hbox', 'items-center', 'gap-1');
    el.setAttribute('data-slot', 'pagination-content');
  });

  Alpine.directive('h-pagination-item', (el) => {
    el.setAttribute('data-slot', 'pagination-item');
  });

  Alpine.directive('h-pagination-link', (el, { modifiers, expression }, { effect, evaluateLater }) => {
    el.classList.add(
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-control',
      'text-sm',
      'font-medium',
      'transition-all',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      '[&_svg]:pointer-events-none',
      "[&_svg:not([class*='size-'])]:size-4",
      'shrink-0',
      '[&_svg]:shrink-0',
      'outline-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'h-9',
      'min-w-9',
      'text-foreground',
      'hover:bg-secondary',
      'hover:text-secondary-foreground',
      'active:bg-secondary-active'
    );
    if (modifiers[0]) {
      el.classList.add('gap-1', 'px-2.5', modifiers[0] === 'previous' ? 'sm:pl-2.5' : 'sm:pr-2.5');
    } else {
      const getActive = evaluateLater(expression);

      effect(() => {
        getActive((active) => {
          if (active) {
            el.classList.remove('bg-transparent');
            el.classList.add('border', 'bg-background');
            el.setAttribute('aria-current', 'page');
          } else {
            el.classList.add('bg-transparent');
            el.classList.remove('border', 'bg-background');
            el.setAttribute('aria-current', false);
          }
        });
      });
    }
    el.setAttribute('data-slot', 'pagination-link');
  });

  Alpine.directive('h-pagination-link-label', (el) => {
    el.classList.add('hidden', 'sm:block');
  });

  Alpine.directive('h-pagination-ellipsis', (el) => {
    el.classList.add('flex', 'size-9', 'items-center', 'justify-center');

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttributeNS(null, 'width', '16');
    svg.setAttributeNS(null, 'height', '16');
    svg.setAttributeNS(null, 'viewBox', '0 0 16 16');
    svg.setAttributeNS(null, 'fill', 'currentColor');
    svg.setAttributeNS(null, 'class', 'size-4');

    const circle1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle1.setAttributeNS(null, 'cx', '2');
    circle1.setAttributeNS(null, 'cy', '8');
    circle1.setAttributeNS(null, 'r', '1.5');
    svg.appendChild(circle1);

    const circle2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle2.setAttributeNS(null, 'cx', '8');
    circle2.setAttributeNS(null, 'cy', '8');
    circle2.setAttributeNS(null, 'r', '1.5');
    svg.appendChild(circle2);

    const circle3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle3.setAttributeNS(null, 'cx', '14');
    circle3.setAttributeNS(null, 'cy', '8');
    circle3.setAttributeNS(null, 'r', '1.5');
    svg.appendChild(circle3);

    el.appendChild(svg);

    el.setAttribute('data-slot', 'pagination-ellipsis');
  });
}
