// Shared player mechanics for the Audio Player component and the Bubble audio
// attachment. It's a hidden native <audio> as the playback engine, driven by a
// play/pause button, a seek slider and a time readout built into a container.

import { capturePointer } from './drag';
import { createSvg, Pause, Play, setSvgContent } from './icons';
import { formatDuration } from './time';

const SEEK_STEP = 5;

/**
 * Turn `audio` into a hidden playback engine and fill `container` with the
 * play/pause button, the seek slider and the time readout. The container is
 * caller-owned: the caller styles it, sets its data-slot and inserts it.
 *
 * @param {HTMLAudioElement} audio
 * @param {object} opts
 * @param {HTMLElement} opts.container Element that receives the controls.
 * @param {HTMLElement} opts.labelsFrom Element whose data-*-label attributes name the controls.
 * @param {string} opts.slotPrefix Prefix of the data-slot values set on the created parts.
 */
export function setupAudioPlayer(audio, { container, labelsFrom, slotPrefix, Alpine, effect, cleanup }) {
  // The custom UI is the interactive surface. Keep the native element hidden
  // in the DOM as the playback engine, and load metadata so the duration is known before playback starts.
  audio.removeAttribute('controls');
  audio.classList.add('hidden');
  if (!audio.hasAttribute('data-slot')) {
    audio.setAttribute('data-slot', `${slotPrefix}-native`);
  }
  if (!audio.hasAttribute('preload')) {
    audio.preload = 'metadata';
  }

  const state = Alpine.reactive({ playing: false, current: 0, duration: 0 });

  container.classList.add('hbox', 'items-center', 'gap-3');

  const playBtn = document.createElement('button');
  playBtn.type = 'button';
  playBtn.setAttribute('data-slot', `${slotPrefix}-play`);
  playBtn.classList.add('hbox', 'items-center', 'justify-center', 'shrink-0', 'size-8', 'rounded-full', 'cursor-pointer', 'hover:bg-current/20', 'outline-ring/50', 'focus-outline');
  const playIcon = createSvg({ icon: Play, classes: 'size-4 fill-current', attrs: { 'aria-hidden': 'true' } });
  playBtn.appendChild(playIcon);

  const track = document.createElement('div');
  track.setAttribute('data-slot', `${slotPrefix}-seek`);
  track.setAttribute('role', 'slider');
  track.setAttribute('tabindex', '0');
  track.setAttribute('aria-label', labelsFrom.getAttribute('data-seek-label') || 'Seek');
  track.setAttribute('aria-valuemin', '0');
  track.classList.add('relative', 'h-1.5', 'flex-1', 'rounded-full', 'bg-current/20', 'cursor-pointer', 'outline-ring/50', 'focus-outline');

  const fill = document.createElement('div');
  fill.classList.add('absolute', 'inset-y-0', 'left-0', 'rounded-full', 'bg-current');
  fill.style.width = '0%';

  const thumb = document.createElement('div');
  thumb.classList.add('absolute', 'top-1/2', '-translate-x-1/2', '-translate-y-1/2', 'size-3', 'rounded-full', 'bg-current');
  thumb.style.left = '0%';

  track.appendChild(fill);
  track.appendChild(thumb);

  const time = document.createElement('span');
  time.setAttribute('data-slot', `${slotPrefix}-time`);
  time.classList.add('text-xs', 'tabular-nums', 'shrink-0', 'opacity-80');
  time.textContent = '0:00 / 0:00';

  container.appendChild(playBtn);
  container.appendChild(track);
  container.appendChild(time);

  function clamp(t) {
    if (!Number.isFinite(state.duration) || state.duration <= 0) return 0;
    return Math.min(Math.max(t, 0), state.duration);
  }

  function seekTo(t) {
    const target = clamp(t);
    audio.currentTime = target;
    state.current = target;
  }

  // Audio element -> state
  const onLoadedMetadata = () => {
    state.duration = Number.isFinite(audio.duration) ? audio.duration : 0;
  };
  const onTimeUpdate = () => {
    state.current = audio.currentTime;
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
  audio.addEventListener('loadedmetadata', onLoadedMetadata);
  audio.addEventListener('durationchange', onLoadedMetadata);
  audio.addEventListener('timeupdate', onTimeUpdate);
  audio.addEventListener('play', onPlay);
  audio.addEventListener('pause', onPause);
  audio.addEventListener('ended', onEnded);
  // The metadata can already be loaded when the directive initializes (the element sat in the initial HTML and Alpine started later),
  // in which case loadedmetadata has already fired. Seed the state from the element instead.
  if (audio.readyState >= 1 /* HAVE_METADATA */) {
    onLoadedMetadata();
    onTimeUpdate();
  }

  // Controls -> audio element
  const onPlayClick = () => {
    if (audio.paused) audio.play();
    else audio.pause();
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
    capturePointer(track, event);
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

  const playLabel = () => labelsFrom.getAttribute('data-play-label') || 'Play';
  const pauseLabel = () => labelsFrom.getAttribute('data-pause-label') || 'Pause';
  // Read once rather than per tick, since the effect below runs several times
  // a second while the audio plays.
  const valueTextLabel = labelsFrom.getAttribute('data-valuetext-label') || '{current} of {duration}';

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
    track.setAttribute('aria-valuetext', valueTextLabel.replace('{current}', formatDuration(state.current)).replace('{duration}', formatDuration(state.duration)));
    time.textContent = `${formatDuration(state.current)} / ${formatDuration(state.duration)}`;
  });

  cleanup(() => {
    audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    audio.removeEventListener('durationchange', onLoadedMetadata);
    audio.removeEventListener('timeupdate', onTimeUpdate);
    audio.removeEventListener('play', onPlay);
    audio.removeEventListener('pause', onPause);
    audio.removeEventListener('ended', onEnded);
    playBtn.removeEventListener('click', onPlayClick);
    track.removeEventListener('keydown', onKeyDown);
    track.removeEventListener('pointerdown', onPointerDown);
    track.removeEventListener('pointermove', onPointerMove);
    track.removeEventListener('pointerup', onPointerUp);
    track.removeEventListener('pointercancel', onPointerUp);
  });
}
