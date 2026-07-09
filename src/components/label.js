export default function (Alpine) {
  Alpine.directive('h-label', (el) => {
    el.classList.add(
      'flex',
      'items-center',
      'gap-2',
      'text-sm',
      'font-medium',
      'select-none',
      'group-data-[disabled=true]:pointer-events-none',
      'group-data-[disabled=true]:opacity-disabled',
      'peer-disabled:cursor-not-allowed',
      'peer-disabled:opacity-disabled'
    );
    if (el.parentElement.getAttribute('data-slot') === 'field') {
      el.classList.add(
        'group/field-label',
        'peer/field-label',
        'w-fit',
        'leading-snug',
        'group-data-[disabled=true]/field:opacity-disabled',
        'has-[>[data-slot=field]]:w-full',
        'has-[>[data-slot=field]]:flex-col',
        'has-[>[data-slot=field]]:rounded-md',
        'has-[>[data-slot=field]]:border',
        '[&>[data-slot=field]]:p-4'
      );
      el.setAttribute('data-slot', 'field-label');
    } else {
      el.classList.add('leading-none');
      el.setAttribute('data-slot', 'label');
    }
  });
}
