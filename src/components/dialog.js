import { focusTrap } from '../common/focus-trap';
import { transitionClose } from '../common/transition-close';
import uuidv4 from '../utils/uuid';
export default function (Alpine) {
  Alpine.directive('h-dialog-overlay', (el, _, { cleanup }) => {
    el.classList.add('hidden', 'fixed', 'inset-0', 'z-50', 'bg-black/60', 'transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out', 'opacity-0', '*:scale-95');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-slot', 'dialog-overlay');

    // Tab and Shift+Tab cycle within the dialog rather than walking out into
    // the page behind it, which is inert to the eye but not to the keyboard.
    const trap = focusTrap(el);

    // Returns the controls of the given tag that the dialog may focus on open,
    // skipping the ones a component has hidden behind its own UI. The OTP keeps
    // such a field: aria-hidden and out of the tab order, so focus landing there
    // would strand the user on a control they cannot see.
    const candidates = (tag) => [...el.getElementsByTagName(tag)].filter((control) => control.getAttribute('aria-hidden') !== 'true' && !(control.getAttribute('tabindex') || '').startsWith('-'));

    // Guarded on the live state, not a class snapshot, so a late transitionend
    // from an abandoned close cannot hide an overlay reopened mid-fade.
    const closer = transitionClose(el, () => {
      if (el.getAttribute('data-open') !== 'true') {
        el.classList.add('hidden');
      }
    });

    const observer = new MutationObserver(() => {
      if (el.getAttribute('data-open') === 'true') {
        closer.cancel();
        // Before the autofocus cascade below, which would otherwise be recorded
        // as the opener the dialog has to hand focus back to.
        trap.trap();
        el.classList.remove('hidden', 'pointer-events-none');
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.remove('*:scale-95', 'opacity-0');
        } else {
          Alpine.nextTick(() => {
            // Reading 'offsetHeight' forces the browser to apply pending styles first.
            // This guarantees that the animation will always happen.
            el.offsetHeight;
            el.classList.remove('*:scale-95', 'opacity-0');
          });
        }
        const inputs = candidates('INPUT');
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
          const textareas = candidates('TEXTAREA');
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
        trap.release();
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', '*:scale-95', 'opacity-0');
        } else {
          // pointer-events-none from the first frame of the fade, so the
          // invisible overlay stops swallowing clicks aimed at the page.
          el.classList.add('*:scale-95', 'opacity-0', 'pointer-events-none');
          closer.schedule();
        }
      }
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-open'] });

    cleanup(() => {
      observer.disconnect();
      trap.dispose();
      closer.dispose();
    });
  });

  Alpine.directive('h-dialog', (el, _, { cleanup }) => {
    el.classList.add('bg-background', 'fixed', 'z-50', 'vbox', 'w-full', 'outline-none', 'transition-[opacity,scale]', 'motion-reduce:transition-none', 'duration-200', 'ease-out');
    el.setAttribute('role', 'dialog');
    el.setAttribute('data-slot', 'dialog');

    // 'inset-0' gives the fullscreen surface a definite height, which the
    // scrolling 'dialog-content' slot needs. 'position-center' is removed
    // rather than overridden, since it applies the centering transforms.
    const getModeClasses = (fullscreen) => (fullscreen ? ['inset-0'] : ['position-center', 'max-w-[calc(100%-2rem)]', 'sm:max-w-lg', 'rounded-lg', 'border', 'shadow-xl']);

    let lastFullscreen;

    const setMode = (fullscreen) => {
      if (fullscreen === lastFullscreen) return;
      if (lastFullscreen !== undefined) {
        el.classList.remove(...getModeClasses(lastFullscreen));
      }
      el.classList.add(...getModeClasses(fullscreen));
      lastFullscreen = fullscreen;
    };

    const observer = new MutationObserver(() => {
      setMode(el.getAttribute('data-fullscreen') === 'true');
    });

    setMode(el.getAttribute('data-fullscreen') === 'true');
    observer.observe(el, { attributes: true, attributeFilter: ['data-fullscreen'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-dialog-header', (el) => {
    el.classList.add('grid', 'grid-cols-[minmax(0,1fr)_auto]', 'place-items-start', 'gap-2', 'px-4', 'pt-4', 'last-rendered:pb-4', 'text-center', 'sm:text-left');
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

  Alpine.directive('h-dialog-content', (el, { modifiers }) => {
    el.classList.add('flex-1', 'min-h-0', 'overflow-y-auto');
    if (!modifiers.includes('flush')) {
      el.classList.add('p-4');
    }
    el.setAttribute('data-slot', 'dialog-content');
  });

  Alpine.directive('h-dialog-footer', (el) => {
    el.classList.add('flex', 'flex-col-reverse', 'gap-2', 'px-4', 'pb-4', '[[data-slot=dialog-header]~&:not([data-slot=dialog-content]~*)]:pt-4', 'sm:flex-row', 'sm:justify-end');
    el.setAttribute('data-slot', 'dialog-footer');
  });
}
