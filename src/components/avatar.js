import { findAncestorState } from '../common/ancestor';
import { classListStartsWith } from '../common/class-list';
import { colorClass, resolveColor } from '../common/colors';
export default function (Alpine) {
  Alpine.directive('h-avatar', (el, _, { Alpine }) => {
    if (!classListStartsWith(el.classList, 'rounded')) {
      el.classList.add('rounded-full');
    }
    el.classList.add(
      'relative',
      'bg-secondary',
      'text-secondary-foreground',
      '[[data-slot=toolbar]:not([data-variant=transparent])>&]:border',
      'data-[variant="primary"]:bg-primary/10',
      'data-[variant="primary"]:text-primary',
      'data-[variant="primary"]:border-primary',
      'data-[variant="information"]:bg-information/10',
      'data-[variant="information"]:text-information',
      'data-[variant="information"]:border-information',
      'data-[variant="warning"]:bg-warning/10',
      'data-[variant="warning"]:text-warning',
      'data-[variant="warning"]:border-warning',
      'data-[variant="positive"]:bg-positive/10',
      'data-[variant="positive"]:text-positive',
      'data-[variant="positive"]:border-positive',
      'data-[variant="negative"]:bg-negative/10',
      'data-[variant="negative"]:text-negative',
      'data-[variant="negative"]:border-negative',
      'has-[img]:border-0',
      'flex',
      'size-8',
      'aspect-square',
      'shrink-0',
      'items-center',
      'justify-center',
      'text-sm',
      '[&>svg]:size-5'
    );
    el.setAttribute('data-slot', 'avatar');
    el._h_avatar = Alpine.reactive({
      fallback: false,
    });

    // A standard palette color (data-color) fills the avatar solid, overriding the
    // secondary base and the semantic data-variant tint. Light backgrounds get a
    // dark foreground for contrast; everything else gets white.
    const color = resolveColor(el.getAttribute('data-color'), null);
    if (color) {
      el.classList.remove('bg-secondary', 'text-secondary-foreground');
      const lightBackground = color === 'white' || color === 'yellow';
      el.classList.add(colorClass(color), lightBackground ? 'text-black' : 'text-white');
    }

    if (el.tagName === 'BUTTON') {
      el.classList.add('cursor-pointer');
      if (!color) el.classList.add('hover:bg-secondary-hover', 'active:bg-secondary-active');
    }
  });

  Alpine.directive('h-avatar-image', (el, { original }, { cleanup }) => {
    const avatar = findAncestorState(Alpine, el, '_h_avatar');
    if (!avatar) {
      throw new Error(`${original} must be inside an avatar element`);
    }

    el.classList.add('aspect-square', 'size-full', 'rounded-[inherit]');
    el.setAttribute('data-slot', 'avatar-image');
    el.setAttribute('role', 'img');

    let interval;

    function fallback(active = false) {
      if (active) el.classList.add('hidden');
      else el.classList.remove('hidden');
      avatar._h_avatar.fallback = active;
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

    const observer = new MutationObserver(() => {
      interval = setInterval(completeCheck, 10);
    });

    observer.observe(el, { attributes: true, attributeFilter: ['src'] });

    cleanup(() => {
      if (interval) clearInterval(interval);
      observer.disconnect();
    });
  });

  Alpine.directive('h-avatar-fallback', (el, { original }, { effect }) => {
    const avatar = findAncestorState(Alpine, el, '_h_avatar');
    if (!avatar) {
      throw new Error(`${original} must be inside an avatar element`);
    }

    el.classList.add('hidden', 'flex', 'size-full', 'items-center', 'justify-center', 'rounded-[inherit]');
    el.setAttribute('data-slot', 'avatar-fallback');

    effect(() => {
      if (avatar._h_avatar.fallback) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });
  });
}
