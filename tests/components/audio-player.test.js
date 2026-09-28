import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import audioPlayerPlugin from '../../src/components/audio-player.js';
import { createMockAlpine, mountDirective } from '../test-utils.js';

describe('h-audio-player', () => {
  let el;
  let audio;
  let errorSpy;

  const dispatch = (type) => audio.dispatchEvent(new Event(type));
  const key = (target, k) => target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
  const mount = (bindings) => mountDirective(audioPlayerPlugin, 'h-audio-player', el, { original: 'x-h-audio-player', ...bindings });
  const withDuration = (seconds) => Object.defineProperty(audio, 'duration', { configurable: true, get: () => seconds });

  beforeEach(() => {
    el = document.createElement('div');
    audio = document.createElement('audio');
    audio.setAttribute('src', 'clip.wav');
    el.appendChild(audio);
    document.body.appendChild(el);
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    el.remove();
    errorSpy.mockRestore();
  });

  it('registers the h-audio-player directive', () => {
    const alpine = createMockAlpine();
    audioPlayerPlugin(alpine);
    expect(alpine._directives['h-audio-player']).toBeDefined();
  });

  it('sets data-slot="audio-player" on the host', () => {
    mount();
    expect(el.getAttribute('data-slot')).toBe('audio-player');
  });

  it('preserves an author-set data-slot', () => {
    el.setAttribute('data-slot', 'custom');
    mount();
    expect(el.getAttribute('data-slot')).toBe('custom');
  });

  it('applies layout and surface classes to the host', () => {
    mount();
    for (const cls of ['hbox', 'items-center', 'gap-3', 'w-full', 'max-w-full', 'min-w-3xs', 'rounded-lg', 'p-2']) {
      expect(el.classList.contains(cls), cls).toBe(true);
    }
  });

  it('applies the secondary variant by default', () => {
    mount();
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('text-secondary-foreground')).toBe(true);
    expect(el.classList.contains('border')).toBe(false);
  });

  it('applies the outline variant', () => {
    el.setAttribute('data-variant', 'outline');
    mount();
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('bg-background')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
  });

  it('applies the transparent variant', () => {
    el.setAttribute('data-variant', 'transparent');
    mount();
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
  });

  it('adds no variant classes for an unknown variant', () => {
    el.setAttribute('data-variant', 'nope');
    mount();
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('border')).toBe(false);
    expect(el.classList.contains('bg-transparent')).toBe(false);
  });

  it('re-applies the variant when data-variant changes', async () => {
    mount();
    expect(el.classList.contains('bg-secondary')).toBe(true);
    el.setAttribute('data-variant', 'outline');
    await new Promise((r) => setTimeout(r, 0));
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('border')).toBe(true);
  });

  it('defaults to role="group" with an "Audio player" label', () => {
    mount();
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('Audio player');
  });

  it('keeps an author-set aria-label', () => {
    el.setAttribute('aria-label', 'Episode 12');
    mount();
    expect(el.getAttribute('aria-label')).toBe('Episode 12');
  });

  it('adds no aria-label when aria-labelledby is set', () => {
    el.setAttribute('aria-labelledby', 'title');
    mount();
    expect(el.hasAttribute('aria-label')).toBe(false);
  });

  it('hides the native element, drops its controls and sets data-slot="audio-player-native"', () => {
    audio.setAttribute('controls', '');
    mount();
    expect(audio.classList.contains('hidden')).toBe(true);
    expect(audio.hasAttribute('controls')).toBe(false);
    expect(audio.getAttribute('data-slot')).toBe('audio-player-native');
  });

  it('logs an error and renders nothing without an <audio> child', () => {
    audio.remove();
    mount();
    expect(errorSpy).toHaveBeenCalled();
    expect(el.querySelector('button')).toBeNull();
    expect(el.hasAttribute('data-slot')).toBe(false);
  });

  it('logs an error when the audio has no src or source child', () => {
    audio.removeAttribute('src');
    mount();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('does not log an error when a src is present', () => {
    mount();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('does not log an error when a <source> child is present', () => {
    audio.removeAttribute('src');
    const source = document.createElement('source');
    source.setAttribute('src', 'clip.wav');
    audio.appendChild(source);
    mount();
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('appends the button, seek slider and time readout after the audio', () => {
    mount();
    expect(el.firstElementChild).toBe(audio);
    expect(el.querySelector('button')).toBeTruthy();
    const track = el.querySelector('[role="slider"]');
    expect(track).toBeTruthy();
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('aria-label')).toBe('Seek');
    expect(track.getAttribute('aria-valuemin')).toBe('0');
    expect(el.querySelector('span').textContent).toBe('0:00 / 0:00');
  });

  it('sets data-slot on the created parts', () => {
    mount();
    expect(el.querySelector('button').getAttribute('data-slot')).toBe('audio-player-play');
    expect(el.querySelector('[role="slider"]').getAttribute('data-slot')).toBe('audio-player-seek');
    expect(el.querySelector('span').getAttribute('data-slot')).toBe('audio-player-time');
  });

  it('toggles playback when the button is clicked', () => {
    const playSpy = vi.spyOn(audio, 'play').mockImplementation(() => Promise.resolve());
    const pauseSpy = vi.spyOn(audio, 'pause').mockImplementation(() => {});
    mount();
    const button = el.querySelector('button');

    Object.defineProperty(audio, 'paused', { configurable: true, value: true });
    button.click();
    expect(playSpy).toHaveBeenCalled();

    Object.defineProperty(audio, 'paused', { configurable: true, value: false });
    button.click();
    expect(pauseSpy).toHaveBeenCalled();
  });

  it('flips the button label between play and pause with playback state', () => {
    mount();
    const button = el.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Play');
    dispatch('play');
    expect(button.getAttribute('aria-label')).toBe('Pause');
    dispatch('pause');
    expect(button.getAttribute('aria-label')).toBe('Play');
  });

  it('reads localized labels from the wrapper, not the audio', () => {
    el.setAttribute('data-play-label', 'Lecture');
    el.setAttribute('data-pause-label', 'Pause audio');
    el.setAttribute('data-seek-label', 'Position');
    audio.setAttribute('data-play-label', 'Ignored');
    mount();
    const button = el.querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Lecture');
    expect(el.querySelector('[role="slider"]').getAttribute('aria-label')).toBe('Position');
    dispatch('play');
    expect(button.getAttribute('aria-label')).toBe('Pause audio');
  });

  it('reflects time updates in the fill, time readout and slider value', () => {
    withDuration(100);
    mount();
    dispatch('loadedmetadata');
    audio.currentTime = 25;
    dispatch('timeupdate');

    const track = el.querySelector('[role="slider"]');
    expect(track.firstElementChild.style.width).toBe('25%');
    expect(el.querySelector('span').textContent).toBe('0:25 / 1:40');
    expect(track.getAttribute('aria-valuenow')).toBe('25');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.getAttribute('aria-valuetext')).toBe('0:25 of 1:40');
  });

  it('seeds the state from an element whose metadata already loaded', () => {
    withDuration(100);
    Object.defineProperty(audio, 'readyState', { configurable: true, get: () => 1 });
    audio.currentTime = 25;
    mount();

    const track = el.querySelector('[role="slider"]');
    expect(el.querySelector('span').textContent).toBe('0:25 / 1:40');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
    expect(track.firstElementChild.style.width).toBe('25%');
  });

  it('builds aria-valuetext from data-valuetext-label on the wrapper', () => {
    withDuration(100);
    el.setAttribute('data-valuetext-label', '{current} von {duration}');
    mount();
    dispatch('loadedmetadata');
    audio.currentTime = 25;
    dispatch('timeupdate');

    const track = el.querySelector('[role="slider"]');
    expect(track.getAttribute('aria-valuetext')).toBe('0:25 von 1:40');
    expect(el.querySelector('span').textContent).toBe('0:25 / 1:40');
  });

  it('seeks with the keyboard', () => {
    withDuration(100);
    mount();
    dispatch('loadedmetadata');
    const track = el.querySelector('[role="slider"]');

    key(track, 'ArrowRight');
    expect(audio.currentTime).toBe(5);
    key(track, 'ArrowLeft');
    expect(audio.currentTime).toBe(0);
    key(track, 'End');
    expect(audio.currentTime).toBe(100);
    key(track, 'Home');
    expect(audio.currentTime).toBe(0);
  });

  it('seeks with the pointer and stops following it after release', () => {
    withDuration(100);
    mount();
    dispatch('loadedmetadata');
    const track = el.querySelector('[role="slider"]');
    track.getBoundingClientRect = () => ({ left: 0, width: 200 });
    const pointer = (type, clientX) => track.dispatchEvent(new PointerEvent(type, { clientX, bubbles: true }));

    pointer('pointerdown', 50);
    expect(audio.currentTime).toBe(25);
    pointer('pointermove', 100);
    expect(audio.currentTime).toBe(50);
    pointer('pointerup', 100);
    pointer('pointermove', 150);
    expect(audio.currentTime).toBe(50);
  });

  it('returns to the start when playback ends', () => {
    withDuration(100);
    mount();
    dispatch('loadedmetadata');
    audio.currentTime = 25;
    dispatch('timeupdate');
    dispatch('play');
    dispatch('ended');

    expect(el.querySelector('span').textContent).toBe('0:00 / 1:40');
    expect(el.querySelector('button').getAttribute('aria-label')).toBe('Play');
  });

  it('registers a cleanup callback', () => {
    const { ctx } = mount();
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
