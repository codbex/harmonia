export default function (Alpine) {
  Alpine.directive('h-radio', (el) => {
    // Additional component styles in 'src/styles/radio.css' and in 'src/styles/common.css'
    el.classList.add(
      '[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'aspect-square',
      'before:bg-clip-padding',
      'before:bg-primary',
      'before:block',
      'before:border-3',
      'before:border-transparent',
      'before:invisible',
      'before:pointer-events-none',
      'before:rounded-full',
      'before:size-full',
      'bg-input-inner',
      'border',
      'border-input',
      'dark:has-[input[aria-invalid=true]]:ring-negative/40',
      'dark:has-[input:invalid]:ring-negative/40',
      'has-[input[aria-invalid=true]]:border-negative',
      'has-[input[aria-invalid=true]]:ring-negative/20',
      'has-[input:checked]:before:visible',
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-50',
      'has-[input:invalid]:border-negative',
      'has-[input:invalid]:ring-negative/20',
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
