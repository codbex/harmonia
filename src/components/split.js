export default function (Alpine) {
  Alpine.directive('h-split', (el) => {
    el.classList.add('flex', 'data-[orientation=horizontal]:flex-row', 'data-[orientation=vertical]:flex-col');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'split');
  });

  Alpine.directive('h-split-panel', (el) => {
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'split-panel');
  });

  Alpine.directive('h-split-gutter', (el, _, { cleanup }) => {
    el.classList.add(
      'relative',
      'shrink-0',
      'touch-none',
      'bg-border',
      'outline-none',
      'hover:bg-primary-hover',
      'active:bg-primary-active',
      'before:absolute',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:block',
      'before:bg-transparent',
      'hover:before:bg-primary-hover',
      '[[data-locked=true]>&]:pointer-events-none',
      '[[data-orientation=horizontal]>&]:cursor-col-resize',
      '[[data-orientation=vertical]>&]:cursor-row-resize'
    );
    const borderClasses = [
      'bg-border',
      'outline-none',
      'hover:bg-primary-hover',
      'active:bg-primary-active',
      'before:absolute',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:block',
      'before:bg-transparent',
      'hover:before:bg-primary-hover',
      '[[data-orientation=horizontal]>&]:!w-px',
      '[[data-orientation=horizontal]>&]:before:h-full',
      '[[data-orientation=horizontal]>&]:before:w-[calc(var(--spacing)*1.25)]',
      '[[data-orientation=vertical]>&]:!h-px',
      '[[data-orientation=vertical]>&]:before:w-full',
      '[[data-orientation=vertical]>&]:before:h-[calc(var(--spacing)*1.25)]',
    ];
    const handleClasses = [
      'bg-transparent',
      'outline-none',
      'after:absolute',
      'after:block',
      'after:rounded-sm',
      'after:bg-background',
      'after:border-split-handle',
      'after:border-2',
      'after:shadow-xs',
      'after:top-1/2',
      'after:left-1/2',
      'after:-translate-x-1/2',
      'after:-translate-y-1/2',
      'hover:after:border-primary-hover',
      'active:after:border-primary-active',
      'before:absolute',
      'before:block',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:rounded-sm',
      'before:from-transparent',
      'before:from-15%',
      'before:via-split-handle',
      'before:to-85%',
      'before:to-transparent',
      'hover:before:bg-primary-hover',
      'hover:before:via-transparent',
      'active:before:bg-primary-active',
      'active:before:via-transparent',
      // Orientation classes
      '[[data-orientation=horizontal]>&]:before:h-full',
      '[[data-orientation=horizontal]>&]:before:w-0.5',
      '[[data-orientation=horizontal]>&]:before:bg-gradient-to-b',
      '[[data-orientation=vertical]>&]:before:h-0.5',
      '[[data-orientation=vertical]>&]:before:w-full',
      '[[data-orientation=vertical]>&]:before:bg-gradient-to-r',
      // Size classes
      '[[data-orientation=horizontal]>&]:!w-4',
      '[[data-orientation=horizontal]>&]:after:w-2.5',
      '[[data-orientation=horizontal]>&]:after:h-5',
      '[[data-orientation=vertical]>&]:!h-4',
      '[[data-orientation=vertical]>&]:after:w-5',
      '[[data-orientation=vertical]>&]:after:h-2.5',
    ];
    el.setAttribute('data-slot', 'split-gutter');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'separator');

    function setVariant(variant = 'handle') {
      if (variant === 'border') {
        el.classList.remove(...handleClasses);
        el.classList.add(...borderClasses);
      } else {
        el.classList.remove(...borderClasses);
        el.classList.add(...handleClasses);
      }
    }

    const observer = new MutationObserver(() => {
      setVariant(el.parentElement.getAttribute('data-variant'));
    });

    observer.observe(el.parentElement, { attributes: true, attributeFilter: ['data-variant'] });

    setVariant(el.parentElement.getAttribute('data-variant'));

    cleanup(() => {
      observer.disconnect();
    });
  });
}
