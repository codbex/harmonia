export default function (Alpine) {
  Alpine.directive('h-textarea', (el, { modifiers }) => {
    el.classList.add(
      'border-input',
      'placeholder:text-muted-foreground',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'aria-invalid:ring-negative/20',
      'dark:aria-invalid:ring-negative/40',
      'aria-invalid:border-negative',
      'invalid:!ring-negative/20',
      'dark:invalid:!ring-negative/40',
      'invalid:!border-negative',
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
      'shadow-control',
      'transition-[color,box-shadow]',
      'outline-none',
      'focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'md:text-sm'
    );
    if (modifiers.includes('group')) {
      el.classList.remove('rounded-control', 'border', 'bg-input-inner', 'py-2', 'shadow-control', 'focus-visible:ring-[3px]');
      el.classList.add('flex-1', 'resize-none', 'rounded-none', 'border-0', 'bg-transparent', 'py-3', 'shadow-none', 'focus-visible:ring-0');
      el.setAttribute('data-slot', 'input-group-control');
    } else el.setAttribute('data-slot', 'textarea');
  });
}
