import { createSvg, Pause, Play, setSvgContent } from '../common/icons';
import { formatDuration } from '../common/time';

export const bubbleVariants = {
  primary: ['bg-primary', 'text-primary-foreground', 'fill-primary-foreground'],
  secondary: ['bg-secondary', 'text-secondary-foreground', 'fill-secondary-foreground'],
  warning: ['bg-warning', 'text-warning-foreground', 'fill-warning-foreground'],
  negative: ['bg-negative', 'text-negative-foreground', 'fill-negative-foreground'],
  outline: ['border', 'bg-background', 'text-foreground', 'fill-foreground'],
  transparent: ['bg-transparent', 'text-foreground', 'fill-foreground'],
};

const bubbleAligns = {
  left: ['self-start', 'mr-auto', 'rounded-xl'],
  right: ['self-end', 'ml-auto', 'rounded-xl'],
};

export default function (Alpine) {
  Alpine.directive('h-bubble', (el, _, { cleanup }) => {
    el.classList.add('relative', 'vbox', 'w-fit', 'max-w-full', 'gap-2', 'px-3', 'py-2', 'text-sm', 'wrap-break-word', 'has-data-[slot=bubble-reactions]:mb-3', 'has-data-[slot=bubble-reactions]:pb-4');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble');
    }
    // The reactions pill flips sides with [[data-align=right]_&] ancestor variants,
    // so the attribute must always be present on the bubble.
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
    el.classList.add('hbox', 'items-center', 'gap-2', 'text-sm', 'font-semibold', '[&>time]:font-normal', '[&>time]:text-xs', '[&>time]:opacity-70');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-header');
    }
  });

  Alpine.directive('h-bubble-content', (el) => {
    el.classList.add('text-sm', 'font-normal', '[&_p]:leading-relaxed');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-content');
    }
  });

  Alpine.directive('h-bubble-footer', (el) => {
    el.classList.add('hbox', 'items-center', 'gap-1', 'text-xs', 'opacity-70', '[&>svg]:size-3', '[&>svg]:fill-current');
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
    el.classList.add('grid', 'grid-cols-2', 'gap-1.5', '[&_img]:aspect-square', '[&_img]:size-full', '[&_img]:object-cover', '[&_img]:rounded-lg');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-gallery');
    }
  });

  Alpine.directive('h-bubble-gallery-more', (el) => {
    el.classList.add(
      'relative',
      'overflow-hidden',
      'rounded-lg',
      '[&>button]:absolute',
      '[&>button]:inset-0',
      '[&>button]:hbox',
      '[&>button]:items-center',
      '[&>button]:justify-center',
      '[&>button]:rounded-lg',
      '[&>button]:bg-black/50',
      '[&>button]:text-lg',
      '[&>button]:font-semibold',
      '[&>button]:text-white',
      '[&>button]:backdrop-blur-xs',
      '[&>button]:cursor-pointer',
      '[&>button]:hover:bg-black/60',
      '[&>button]:outline-ring/50',
      '[&>button]:focus-visible:outline',
      '[&>button]:focus-visible:outline-[calc(var(--spacing)*0.75)]'
    );
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-gallery-more');
    }
  });

  Alpine.directive('h-bubble-audio', (el, { original }, { cleanup, effect, Alpine }) => {
    if (!el.hasAttribute('src') && !el.querySelector('source')) {
      console.error(`${original}: Bubble audio must have a "src" attribute or a <source> child`, el);
    }
    // The custom UI is the interactive surface; keep the native element hidden
    // in the DOM as the playback engine, and load metadata so the duration is
    // known before playback starts.
    el.removeAttribute('controls');
    el.classList.add('hidden');
    if (!el.hasAttribute('preload')) {
      el.preload = 'metadata';
    }

    const SEEK_STEP = 5;
    const state = Alpine.reactive({ playing: false, current: 0, duration: 0 });

    const player = document.createElement('div');
    player.setAttribute('data-slot', 'bubble-audio');
    player.classList.add('hbox', 'items-center', 'gap-3', 'w-full', 'min-w-3xs', 'max-w-full', 'rounded-lg', 'bg-current/10', 'p-2');

    const playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.classList.add(
      'hbox',
      'items-center',
      'justify-center',
      'shrink-0',
      'size-8',
      'rounded-full',
      'cursor-pointer',
      'hover:bg-current/20',
      'outline-ring/50',
      'focus-visible:outline',
      'focus-visible:outline-[calc(var(--spacing)*0.75)]',
      '[&>svg]:fill-current'
    );
    const playIcon = createSvg({ icon: Play, classes: 'size-4', attrs: { 'aria-hidden': 'true' } });
    playBtn.appendChild(playIcon);

    const track = document.createElement('div');
    track.setAttribute('role', 'slider');
    track.setAttribute('tabindex', '0');
    track.setAttribute('aria-label', el.getAttribute('data-label') || 'Seek');
    track.setAttribute('aria-valuemin', '0');
    track.classList.add('relative', 'h-1.5', 'flex-1', 'rounded-full', 'bg-current/20', 'cursor-pointer', 'outline-ring/50', 'focus-visible:outline', 'focus-visible:outline-[calc(var(--spacing)*0.75)]');

    const fill = document.createElement('div');
    fill.classList.add('absolute', 'inset-y-0', 'left-0', 'rounded-full', 'bg-current');
    fill.style.width = '0%';

    const thumb = document.createElement('div');
    thumb.classList.add('absolute', 'top-1/2', '-translate-x-1/2', '-translate-y-1/2', 'size-3', 'rounded-full', 'bg-current');
    thumb.style.left = '0%';

    track.appendChild(fill);
    track.appendChild(thumb);

    const time = document.createElement('span');
    time.classList.add('text-xs', 'tabular-nums', 'shrink-0', 'opacity-80');
    time.textContent = '0:00 / 0:00';

    player.appendChild(playBtn);
    player.appendChild(track);
    player.appendChild(time);
    el.after(player);

    function clamp(t) {
      if (!Number.isFinite(state.duration) || state.duration <= 0) return 0;
      return Math.min(Math.max(t, 0), state.duration);
    }

    function seekTo(t) {
      const target = clamp(t);
      el.currentTime = target;
      state.current = target;
    }

    // Audio element -> state
    const onLoadedMetadata = () => {
      state.duration = Number.isFinite(el.duration) ? el.duration : 0;
    };
    const onTimeUpdate = () => {
      state.current = el.currentTime;
    };
    const onPlay = () => {
      state.playing = true;
    };
    const onPause = () => {
      state.playing = false;
    };
    const onEnded = () => {
      state.playing = false;
      state.current = 0;
    };
    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('durationchange', onLoadedMetadata);
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);

    // Controls -> audio element
    const onPlayClick = () => {
      if (el.paused) el.play();
      else el.pause();
    };
    playBtn.addEventListener('click', onPlayClick);

    const onKeyDown = (event) => {
      let handled = true;
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          seekTo(state.current + SEEK_STEP);
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          seekTo(state.current - SEEK_STEP);
          break;
        case 'Home':
          seekTo(0);
          break;
        case 'End':
          seekTo(state.duration);
          break;
        default:
          handled = false;
      }
      if (handled) event.preventDefault();
    };
    track.addEventListener('keydown', onKeyDown);

    function seekFromPointer(clientX) {
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      seekTo(ratio * state.duration);
    }
    let dragging = false;
    const onPointerDown = (event) => {
      dragging = true;
      if (track.setPointerCapture) {
        try {
          track.setPointerCapture(event.pointerId);
        } catch {
          // pointer capture is best-effort; ignore environments that lack it
        }
      }
      seekFromPointer(event.clientX);
    };
    const onPointerMove = (event) => {
      if (dragging) seekFromPointer(event.clientX);
    };
    const onPointerUp = () => {
      dragging = false;
    };
    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    const playLabel = () => el.getAttribute('data-play-label') || 'Play';
    const pauseLabel = () => el.getAttribute('data-pause-label') || 'Pause';

    // State -> UI
    effect(() => {
      playIcon.replaceChildren();
      setSvgContent(playIcon, state.playing ? Pause : Play);
      playBtn.setAttribute('aria-label', state.playing ? pauseLabel() : playLabel());
    });
    effect(() => {
      const ratio = Number.isFinite(state.duration) && state.duration > 0 ? Math.min(state.current / state.duration, 1) : 0;
      const pct = `${ratio * 100}%`;
      fill.style.width = pct;
      thumb.style.left = pct;
      track.setAttribute('aria-valuemax', String(Math.floor(state.duration)));
      track.setAttribute('aria-valuenow', String(Math.floor(state.current)));
      track.setAttribute('aria-valuetext', `${formatDuration(state.current)} of ${formatDuration(state.duration)}`);
      time.textContent = `${formatDuration(state.current)} / ${formatDuration(state.duration)}`;
    });

    cleanup(() => {
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('durationchange', onLoadedMetadata);
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
      playBtn.removeEventListener('click', onPlayClick);
      track.removeEventListener('keydown', onKeyDown);
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
      player.remove();
    });
  });

  Alpine.directive('h-bubble-file', (el) => {
    el.classList.add('hbox', 'items-center', 'gap-2.5', 'rounded-lg', 'bg-current/10', 'p-2.5', '[&>svg]:size-7', '[&>svg]:shrink-0', '[&>svg]:fill-current');
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-file');
    }
  });

  Alpine.directive('h-bubble-link', (el) => {
    el.classList.add(
      'block',
      'overflow-hidden',
      'rounded-lg',
      'bg-current/10',
      'no-underline',
      'hover:bg-current/20',
      'outline-ring/50',
      'focus-visible:outline',
      'focus-visible:outline-[calc(var(--spacing)*0.75)]',
      '[&_img]:w-full',
      '[&_img]:max-h-40',
      '[&_img]:object-cover'
    );
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-link');
    }
  });

  Alpine.directive('h-bubble-reactions', (el) => {
    el.classList.add(
      'absolute',
      '-bottom-3',
      'end-2',
      '[[data-align=right]_&]:end-auto',
      '[[data-align=right]_&]:start-2',
      'hbox',
      'items-center',
      'rounded-full',
      'bg-background',
      'text-foreground',
      'text-xs',
      'shadow-sm',
      '[&>button]:cursor-pointer',
      '[&>button]:px-2',
      '[&>button]:py-1',
      '[&>button:first-child]:rounded-s-full',
      '[&>button:last-child]:rounded-e-full',
      '[&>button]:hover:bg-secondary-hover',
      '[&>button]:active:bg-secondary-active'
    );
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'bubble-reactions');
    }
    if (!el.hasAttribute('role')) {
      el.setAttribute('role', 'group');
    }
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', el.getAttribute('data-label') || 'Reactions');
    }
  });
}
