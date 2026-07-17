import { invalidControlClasses } from '../common/shared-classes';

export default function (Alpine) {
  Alpine.directive('h-textarea', (el, { modifiers }) => {
    el.classList.add(
      'border-input',
      'placeholder:text-muted-foreground',
      'focus-ring',
      ...invalidControlClasses,
      'bg-input-inner',
      'flex',
      'field-sizing-content',
      'min-h-16',
      'w-full',
      'rounded-control',
      'border',
      'px-3',
      'py-2',
      'text-base',
      'shadow-input',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'outline-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-disabled',
      '[&[readonly]]:bg-muted',
      'md:text-sm'
    );
    if (modifiers.includes('group')) {
      el.classList.remove('rounded-control', 'border', 'bg-input-inner', 'py-2', 'shadow-input', 'focus-ring');
      el.classList.add('flex-1', 'resize-none', 'rounded-none', 'border-0', 'bg-transparent', 'py-3', 'shadow-none', 'focus-visible:ring-0');
      el.setAttribute('data-slot', 'input-group-control');
    } else el.setAttribute('data-slot', 'textarea');
  });
}
