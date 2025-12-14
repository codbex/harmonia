export default function (Alpine) {
  Alpine.directive('h-radio', (el) => {
    el.classList.add(
      '[&>input]:absolute',
      '[&>input]:appearance-none',
      '[&>input]:bg-transparent',
      '[&>input]:border-0',
      '[&>input]:cursor-pointer',
      '[&>input]:focus-visible:border-ring',
      '[&>input]:focus-visible:ring-[3px]',
      '[&>input]:focus-visible:ring-ring/50',
      '[&>input]:left-0',
      '[&>input]:outline-none',
      '[&>input]:rounded-full',
      '[&>input]:size-full',
      '[&>input]:top-0',
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
      'dark:has-[aria-invalid=true]:ring-negative/40',
      'dark:has-[input:invalid]:ring-negative/40',
      'has-[aria-invalid=true]:border-negative',
      'has-[aria-invalid=true]:ring-negative/20',
      'has-[input:checked]:before:visible',
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-50',
      'has-[input:invalid]:border-negative',
      'has-[input:invalid]:ring-negative/20',
      'relative',
      'rounded-full',
      'shadow-control',
      'shrink-0',
      'size-5'
    );
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'radio');
  });
}
