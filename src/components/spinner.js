export default function (Alpine) {
  Alpine.directive('h-spinner', (el) => {
    el.classList.add(
      'size-4',
      'border-2',
      'border-primary',
      '[[data-slot=button]_&]:border-secondary-foreground',
      '[[data-slot=button][data-variant=primary]_&]:border-primary-foreground',
      '[[data-slot=button][data-variant=positive]_&]:border-positive-foreground',
      '[[data-slot=button][data-variant=negative]_&]:border-negative-foreground',
      '[[data-slot=button][data-variant=warning]_&]:border-warning-foreground',
      '[[data-slot=button][data-variant=information]_&]:border-information-foreground',
      '!border-t-transparent',
      'rounded-full',
      'animate-spin'
    );
    el.setAttribute('role', 'status');
    el.setAttribute('data-slot', 'spinner');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Loading');
  });
}
