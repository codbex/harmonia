import { setupAudioPlayer } from '../common/audio-player';

export const bubbleVariants = {
  primary: ['bg-primary', 'text-primary-foreground', 'fill-primary-foreground'],
  secondary: ['bg-secondary', 'text-secondary-foreground', 'fill-secondary-foreground'],
  positive: ['bg-positive', 'text-positive-foreground', 'fill-positive-foreground'],
  negative: ['bg-negative', 'text-negative-foreground', 'fill-negative-foreground'],
  warning: ['bg-warning', 'text-warning-foreground', 'fill-warning-foreground'],
  information: ['bg-information', 'text-information-foreground', 'fill-information-foreground'],
  outline: ['border', 'bg-background', 'text-foreground', 'fill-foreground'],
  transparent: ['bg-transparent', 'text-foreground', 'fill-foreground'],
  custom: ['bg-(--bg-bubble)', 'text-(--fg-bubble)', 'fill-(--fg-bubble)'],
};

const bubbleAligns = {
  left: ['self-start', 'mr-auto', 'rounded-xl'],
  right: ['self-end', 'ml-auto', 'rounded-xl'],
};

export default function (Alpine) {
  Alpine.directive('h-bubble', (el, _, { cleanup }) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('relative', 'vbox', 'w-fit', 'max-w-full', 'gap-2', 'px-3', 'py-2', 'text-sm', 'wrap-break-word');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble');
    }
    // The reactions pill flips sides based on the bubble's data-align (see the
    // ancestor rule in bubble.css), so the attribute must always be present.
    if (!el.hasAttribute('data-align')) {
      el.setAttribute('data-align', 'left');
    }

    function setVariant(variant) {
      for (const [_, value] of Object.entries(bubbleVariants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(bubbleVariants, variant)) el.classList.add(...bubbleVariants[variant]);
    }

    function setAlign(align) {
      for (const [_, value] of Object.entries(bubbleAligns)) {
        el.classList.remove(...value);
      }
      el.classList.add(...(bubbleAligns[align] ?? bubbleAligns.left));
    }

    setVariant(el.getAttribute('data-variant') ?? 'secondary');
    setAlign(el.getAttribute('data-align'));

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-variant') setVariant(el.getAttribute('data-variant') ?? 'secondary');
        else setAlign(el.getAttribute('data-align') ?? 'left');
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-align'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-bubble-header', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('hbox', 'items-center', 'gap-2', 'text-sm', 'font-semibold');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-header');
    }
  });

  Alpine.directive('h-bubble-content', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('text-sm', 'font-normal');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-content');
    }
  });

  Alpine.directive('h-bubble-footer', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('hbox', 'items-center', 'gap-1', 'text-xs', 'opacity-70');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-footer');
    }
  });

  Alpine.directive('h-bubble-image', (el, { original }) => {
    el.classList.add('rounded-lg', 'max-w-full', 'h-auto', 'object-cover');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-image');
    }
    if (!el.hasAttribute('alt')) {
      console.error(`${original}: Bubble images must have an "alt" attribute`, el);
    }
  });

  Alpine.directive('h-bubble-gallery', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('grid', 'grid-cols-2', 'gap-1.5');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-gallery');
    }
  });

  Alpine.directive('h-bubble-gallery-more', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('relative', 'overflow-hidden', 'rounded-lg');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-gallery-more');
    }
  });

  Alpine.directive('h-bubble-audio', (el, { original }, { cleanup, effect, Alpine }) => {
    if (!el.hasAttribute('src') && !el.querySelector('source')) {
      console.error(`${original}: Bubble audio must have a "src" attribute or a <source> child`, el);
    }
    // The player mechanics are shared with the Audio Player component.
    // See 'src/common/audio-player.js'.
    const player = document.createElement('div');
    player.setAttribute('data-slot', 'bubble-audio');
    player.classList.add('w-full', 'min-w-3xs', 'max-w-full', 'rounded-lg', 'bg-current/10', 'p-2');
    setupAudioPlayer(el, { container: player, labelsFrom: el, slotPrefix: 'bubble-audio', Alpine, effect, cleanup });
    el.after(player);

    cleanup(() => {
      player.remove();
    });
  });

  Alpine.directive('h-bubble-file', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('hbox', 'items-center', 'gap-2.5', 'rounded-lg', 'bg-current/10', 'p-2.5');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-file');
    }
  });

  Alpine.directive('h-bubble-link', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('block', 'overflow-hidden', 'rounded-lg', 'bg-current/10', 'no-underline', 'hover:bg-current/20', 'outline-ring/50', 'focus-outline');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-link');
    }
  });

  Alpine.directive('h-bubble-reactions', (el) => {
    // Additional component styles in 'src/styles/bubble.css'
    el.classList.add('absolute', '-bottom-3', 'end-2', 'hbox', 'items-center', 'rounded-full', 'bg-background', 'text-foreground', 'text-xs', 'shadow-sm');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-reactions');
    }
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'group');
    }
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Reactions');
    }
  });
}
