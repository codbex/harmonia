import { setupAudioPlayer } from '../common/audio-player';

const audioPlayerVariants = {
  secondary: ['bg-secondary', 'text-secondary-foreground', 'fill-secondary-foreground'],
  outline: ['border', 'bg-background', 'text-foreground', 'fill-foreground'],
  transparent: ['bg-transparent', 'text-foreground', 'fill-foreground'],
};

export default function (Alpine) {
  Alpine.directive('h-audio-player', (el, { original }, { cleanup, effect, Alpine }) => {
    const audio = el.querySelector('audio');
    if (!audio) {
      console.error(`${original}: Audio player must contain an <audio> element`, el);
      return;
    }
    if (!audio.hasAttribute('src') && !audio.querySelector('source')) {
      console.error(`${original}: Audio player must have a "src" attribute or a <source> child on its <audio> element`, audio);
    }

    // The player mechanics are shared with the bubble audio attachment.
    // See 'src/common/audio-player.js'.
    el.classList.add('w-full', 'max-w-full', 'min-w-3xs', 'rounded-lg', 'p-2');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'audio-player');
    }
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'group');
    }
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Audio player');
    }

    function setVariant(variant) {
      for (const [_, value] of Object.entries(audioPlayerVariants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(audioPlayerVariants, variant)) el.classList.add(...audioPlayerVariants[variant]);
    }

    setVariant(el.getAttribute('data-variant') ?? 'secondary');

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'secondary');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    setupAudioPlayer(audio, { container: el, labelsFrom: el, slotPrefix: 'audio-player', Alpine, effect, cleanup });

    cleanup(() => {
      observer.disconnect();
    });
  });
}
