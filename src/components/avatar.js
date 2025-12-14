export default function (Alpine) {
  Alpine.directive('h-avatar', (el, {}, { Alpine }) => {
    el.classList.add(
      'relative',
      'bg-secondary',
      'text-secondary-foreground',
      'fill-secondary-foreground',
      '[[data-slot=toolbar]:not([data-variant=transparent])_&]:border',
      'has-[img]:border-0',
      'flex',
      'size-8',
      'shrink-0',
      'overflow-hidden',
      'rounded-full',
      'items-center',
      'justify-center',
      'text-sm',
      '[&>svg]:size-5'
    );
    el.setAttribute('data-slot', 'avatar');
    el._avatar = Alpine.reactive({
      fallback: false,
    });
    if (el.tagName === 'BUTTON') {
      el.classList.add('cursor-pointer', 'hover:bg-secondary-hover', 'active:bg-secondary-active');
    }
  });

  Alpine.directive('h-avatar-image', (el, {}, { cleanup }) => {
    const avatar = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_avatar'));
    if (!avatar) {
      throw new Error('h-avatar-image must be inside an h-avatar element');
    }

    el.classList.add('aspect-square', 'size-full');
    el.setAttribute('data-slot', 'avatar-image');
    el.setAttribute('role', 'img');

    let interval;

    function fallback(active = false) {
      if (active) el.classList.add('hidden');
      else el.classList.remove('hidden');
      avatar._avatar.fallback = active;
    }

    function completeCheck() {
      if (el.complete) {
        clearInterval(interval);
        fallback(el.naturalHeight === 0);
      }
    }

    if (el.complete && el.naturalHeight === 0) {
      fallback(true);
    } else {
      interval = setInterval(completeCheck, 10);
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          if (mutation.attributeName === 'src') interval = setInterval(completeCheck, 10);
        }
      });
    });

    observer.observe(el, { attributes: true });

    cleanup(() => {
      if (interval) clearInterval(interval);
      observer.disconnect();
    });
  });

  Alpine.directive('h-avatar-fallback', (el, {}, { effect }) => {
    const avatar = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_avatar'));
    if (!avatar) {
      throw new Error('h-avatar-fallback must be inside an h-avatar element');
    }

    el.classList.add('hidden', 'bg-muted', 'flex', 'size-full', 'items-center', 'justify-center');
    el.setAttribute('data-slot', 'avatar-fallback');

    effect(() => {
      if (avatar._avatar.fallback) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
  });
}
