import { invalidInputClasses, userInvalidInputClasses } from '../common/shared-classes';

export default function (Alpine) {
  Alpine.directive('h-radio', (el) => {
    // Additional component styles in 'src/styles/radio.css' and in 'src/styles/common.css'
    el.classList.add(
      '[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'aspect-square',
      'bg-input-inner',
      'border',
      'border-input',
      ...invalidInputClasses,
      ...userInvalidInputClasses,
      'before:invisible',
      'has-[input:checked]:before:visible',
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-disabled',
      '[&:has(input:disabled)~label]:cursor-not-allowed',
      '[&:has(input:disabled)~label]:opacity-disabled',
      'relative',
      'rounded-full',
      'shadow-input',
      'shrink-0',
      'size-5'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'radio');
  });
}
