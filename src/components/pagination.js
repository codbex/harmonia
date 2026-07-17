import { disabledControlClasses } from '../common/shared-classes';
import { Ellipsis, createSvg } from './../common/icons';

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
      'motion-reduce:transition-none',
      ...disabledControlClasses,
      'svg-defaults',
      'shrink-0',
      'outline-none',
      'focus-ring',
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

    el.appendChild(
      createSvg({
        icon: Ellipsis,
        attrs: {
          'aria-hidden': true,
          role: 'presentation',
        },
      })
    );

    el.setAttribute('data-slot', 'pagination-ellipsis');
  });
}
