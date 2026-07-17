import uuidv4 from '../utils/uuid';
export default function (Alpine) {
  Alpine.directive('h-dialog-overlay', (el, _, { cleanup }) => {
    el.classList.add('hidden', 'fixed', 'inset-0', 'z-50', 'bg-black/60', 'transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out', 'opacity-0', '*:scale-95');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'dialog-overlay');

    const observer = new MutationObserver(() => {
      if (el.getAttribute('data-open') === 'true') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.remove('hidden', '*:scale-95', 'opacity-0');
        } else {
          el.classList.remove('hidden');
          Alpine.nextTick(() => {
            // Reading 'offsetHeight' forces the browser to apply pending styles first.
            // This guarantees that the animation will always happen.
            el.offsetHeight;
            el.classList.remove('*:scale-95', 'opacity-0');
          });
        }
        const inputs = el.getElementsByTagName('INPUT');
        if (inputs.length) {
          for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].autofocus) {
              inputs[i].focus();
              return;
            }
          }
          inputs[0].focus();
          return;
        } else {
          const textareas = el.getElementsByTagName('TEXTAREA');
          if (textareas.length) {
            for (let i = 0; i < textareas.length; i++) {
              if (textareas[i].autofocus) {
                textareas[i].focus();
                return;
              }
            }
            textareas[0].focus();
            return;
          }
        }
        const buttons = el.getElementsByTagName('BUTTON');
        if (buttons.length) {
          buttons[0].focus();
        }
      } else {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', '*:scale-95', 'opacity-0');
        } else {
          el.classList.add('*:scale-95', 'opacity-0');
        }
      }
    });

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
        el.classList.add('hidden');
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    observer.observe(el, { attributes: true, attributeFilter: ['data-open'] });

    cleanup(() => {
      observer.disconnect();
      el.removeEventListener('transitionend', onTransitionEnd);
    });
  });

  Alpine.directive('h-dialog', (el) => {
    el.classList.add(
      'bg-background',
      'fixed',
      'position-center',
      'z-50',
      'vbox',
      'w-full',
      'max-w-[calc(100%-2rem)]',
      'gap-4',
      'rounded-lg',
      'border',
      'p-4',
      'shadow-xl',
      'sm:max-w-lg',
      'outline-none',
      'transition-[opacity,scale]',
      'motion-reduce:transition-none',
      'duration-200',
      'ease-out'
    );
    el.setAttribute('role', 'dialog');
    el.setAttribute('data-slot', 'dialog');
  });

  Alpine.directive('h-dialog-header', (el) => {
    el.classList.add('grid', 'grid-cols-[minmax(0,1fr)_auto]', 'place-items-start', 'gap-2', 'text-center', 'sm:text-left');
    el.setAttribute('data-slot', 'dialog-header');
  });

  Alpine.directive('h-dialog-title', (el, _, { Alpine }) => {
    el.classList.add('order-1', 'text-lg', 'leading-none', 'font-semibold');
    el.setAttribute('data-slot', 'dialog-title');
    const dialog = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'dialog');
    if (dialog && !dialog.hasAttribute('aria-labelledby') && !dialog.hasAttribute('aria-label')) {
      if (!el.hasAttribute('id')) {
        const id = `dht${uuidv4()}`;
        el.setAttribute('id', id);
      }
      dialog.setAttribute('aria-labelledby', el.getAttribute('id'));
    }
  });

  Alpine.directive('h-dialog-close', (el) => {
    el.classList.add(
      'order-2',
      'ring-offset-background',
      'focus:ring-ring',
      'rounded-xs',
      'opacity-70',
      'transition-opacity',
      'motion-reduce:transition-none',
      'hover:opacity-100',
      'focus:ring-[calc(var(--spacing)*0.75)]',
      'focus:ring-offset-2',
      'focus:outline-hidden',
      'disabled:pointer-events-none',
      'svg-defaults'
    );
    el.setAttribute('data-slot', 'dialog-close');
    el.setAttribute('type', 'button');
  });

  Alpine.directive('h-dialog-description', (el, _, { Alpine }) => {
    el.classList.add('order-3', 'col-span-full', 'text-muted-foreground', 'text-sm');
    el.setAttribute('data-slot', 'dialog-description');
    const dialog = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('role') === 'dialog');
    if (dialog && !dialog.hasAttribute('aria-describedby') && !dialog.hasAttribute('aria-description')) {
      if (!el.hasAttribute('id')) {
        const id = `dhd${uuidv4()}`;
        el.setAttribute('id', id);
      }
      dialog.setAttribute('aria-describedby', el.getAttribute('id'));
    }
  });

  Alpine.directive('h-dialog-footer', (el) => {
    el.classList.add('flex', 'flex-col-reverse', 'gap-2', 'sm:flex-row', 'sm:justify-end');
    el.setAttribute('data-slot', 'dialog-footer');
  });
}
