import { Check, createSvg } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-checkbox', (el) => {
    el.classList.add(
      '[&>input]:absolute',
      '[&>input]:appearance-none',
      '[&>input]:bg-transparent',
      '[&>input]:border-0',
      '[&>input]:cursor-pointer',
      '[&>input]:focus-visible:border-ring',
      '[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]',
      '[&>input]:focus-visible:ring-ring/50',
      '[&>input]:left-0',
      '[&>input]:outline-none',
      '[&>input]:rounded-[0.438rem]',
      '[&>input]:size-full',
      '[&>input]:top-0',
      'aspect-square',
      'bg-input-inner',
      'border',
      'border-input',
      'dark:has-[aria-invalid=true]:ring-negative/40',
      'dark:has-[input:invalid]:ring-negative/40',
      'duration-200',
      'has-[aria-invalid=true]:border-negative',
      'has-[aria-invalid=true]:ring-negative/20',
      'has-[input:checked]:bg-primary',
      'has-[input:checked]:border-primary',
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-50',
      'has-[input:invalid]:border-negative',
      'has-[input:invalid]:ring-negative/20',
      'relative',
      'rounded-[0.438rem]',
      'shadow-input',
      'shrink-0',
      'size-5',
      'transition-color'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'checkbox');

    const check = createSvg({ icon: Check, classes: 'size-full [input:checked~&]:visible invisible fill-primary-foreground', attrs: { 'aria-hidden': true, role: 'presentation' } });
    el.appendChild(check);
  });
}
