import { invalidInputClasses, userInvalidInputClasses } from '../common/shared-classes';
import { Check, createSvg } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-checkbox', (el) => {
    // Additional component styles in 'src/styles/checkbox.css' and in 'src/styles/common.css'
    el.classList.add(
      '[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]',
      '[&>input]:rounded-[0.438rem]',
      'aspect-square',
      'bg-input-inner',
      'border',
      'border-input',
      'duration-200',
      'text-primary-foreground',
      ...invalidInputClasses,
      ...userInvalidInputClasses,
      'has-[input:checked]:bg-primary',
      'has-[input:checked]:border-primary',
      "has-[input:indeterminate]:after:content-['']",
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-disabled',
      '[&:has(input:disabled)~label]:cursor-not-allowed',
      '[&:has(input:disabled)~label]:opacity-disabled',
      'relative',
      'rounded-[0.438rem]',
      'shadow-input',
      'shrink-0',
      'size-5',
      'transition-colors',
      'motion-reduce:transition-none'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'checkbox');

    const check = createSvg({ icon: Check, classes: 'size-full [input:checked~&]:visible invisible text-inherit', attrs: { 'aria-hidden': true, role: 'presentation' } });
    el.appendChild(check);
  });
}
