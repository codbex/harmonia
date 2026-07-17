import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import bubblePlugin from '../../src/components/bubble.js';
import { mountDirective } from '../test-utils.js';

const bubbleCss = readFileSync('src/styles/bubble.css', 'utf8');

describe('h-bubble', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers all bubble directives', () => {
    const { alpine } = mountDirective(bubblePlugin, 'h-bubble', el);
    expect(alpine._directives['h-bubble']).toBeDefined();
    expect(alpine._directives['h-bubble-header']).toBeDefined();
    expect(alpine._directives['h-bubble-content']).toBeDefined();
    expect(alpine._directives['h-bubble-footer']).toBeDefined();
    expect(alpine._directives['h-bubble-image']).toBeDefined();
    expect(alpine._directives['h-bubble-gallery']).toBeDefined();
    expect(alpine._directives['h-bubble-gallery-more']).toBeDefined();
    expect(alpine._directives['h-bubble-audio']).toBeDefined();
    expect(alpine._directives['h-bubble-file']).toBeDefined();
    expect(alpine._directives['h-bubble-link']).toBeDefined();
    expect(alpine._directives['h-bubble-reactions']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-fit')).toBe(true);
    expect(el.classList.contains('max-w-full')).toBe(true);
    expect(el.classList.contains('px-3')).toBe(true);
    expect(el.classList.contains('py-2')).toBe(true);
    expect(el.classList.contains('wrap-break-word')).toBe(true);
  });

  it('sets data-slot="bubble"', () => {
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.getAttribute('data-slot')).toBe('bubble');
  });

  it('preserves an author-set data-slot', () => {
    el.setAttribute('data-slot', 'custom');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.getAttribute('data-slot')).toBe('custom');
  });

  it('applies the secondary variant by default', () => {
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('text-secondary-foreground')).toBe(true);
  });

  it('applies primary variant classes', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('text-primary-foreground')).toBe(true);
  });

  it('applies warning variant classes', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('bg-warning')).toBe(true);
    expect(el.classList.contains('text-warning-foreground')).toBe(true);
  });

  it('applies negative variant classes', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('bg-negative')).toBe(true);
    expect(el.classList.contains('text-negative-foreground')).toBe(true);
  });

  it('applies outline variant classes', () => {
    el.setAttribute('data-variant', 'outline');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('bg-background')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(true);
  });

  it('applies transparent variant classes', () => {
    el.setAttribute('data-variant', 'transparent');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(true);
  });

  it('does not apply classes from other variants', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('bg-negative')).toBe(false);
  });

  it('normalizes the align attribute and applies left alignment by default', () => {
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.getAttribute('data-align')).toBe('left');
    expect(el.classList.contains('self-start')).toBe(true);
    expect(el.classList.contains('mr-auto')).toBe(true);
    expect(el.classList.contains('rounded-xl')).toBe(true);
  });

  it('applies right alignment classes', () => {
    el.setAttribute('data-align', 'right');
    mountDirective(bubblePlugin, 'h-bubble', el);
    expect(el.getAttribute('data-align')).toBe('right');
    expect(el.classList.contains('self-end')).toBe(true);
    expect(el.classList.contains('ml-auto')).toBe(true);
    expect(el.classList.contains('rounded-xl')).toBe(true);
    expect(el.classList.contains('self-start')).toBe(false);
    expect(el.classList.contains('mr-auto')).toBe(false);
  });

  it('re-applies the variant when data-variant changes', async () => {
    mountDirective(bubblePlugin, 'h-bubble', el);
    el.setAttribute('data-variant', 'primary');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
  });

  it('re-applies the alignment when data-align changes', async () => {
    mountDirective(bubblePlugin, 'h-bubble', el);
    el.setAttribute('data-align', 'right');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('self-end')).toBe(true);
    expect(el.classList.contains('self-start')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(bubblePlugin, 'h-bubble', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-bubble-header', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds header classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-header', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('sets data-slot="bubble-header"', () => {
    mountDirective(bubblePlugin, 'h-bubble-header', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-header');
  });
});

describe('h-bubble-content', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds content classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-content', el);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-normal')).toBe(true);
  });

  it('sets data-slot="bubble-content"', () => {
    mountDirective(bubblePlugin, 'h-bubble-content', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-content');
  });
});

describe('h-bubble-footer', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds footer classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-footer', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.classList.contains('opacity-70')).toBe(true);
  });

  it('sets data-slot="bubble-footer"', () => {
    mountDirective(bubblePlugin, 'h-bubble-footer', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-footer');
  });
});

describe('h-bubble-image', () => {
  let el;
  let errorSpy;

  beforeEach(() => {
    el = document.createElement('img');
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('adds image classes', () => {
    el.setAttribute('alt', 'Preview');
    mountDirective(bubblePlugin, 'h-bubble-image', el);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('max-w-full')).toBe(true);
    expect(el.classList.contains('h-auto')).toBe(true);
    expect(el.classList.contains('object-cover')).toBe(true);
  });

  it('sets data-slot="bubble-image"', () => {
    el.setAttribute('alt', 'Preview');
    mountDirective(bubblePlugin, 'h-bubble-image', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-image');
  });

  it('logs an error when the alt attribute is missing', () => {
    mountDirective(bubblePlugin, 'h-bubble-image', el, { original: 'x-h-bubble-image' });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('does not log an error when the alt attribute is present', () => {
    el.setAttribute('alt', 'Preview');
    mountDirective(bubblePlugin, 'h-bubble-image', el, { original: 'x-h-bubble-image' });
    expect(errorSpy).not.toHaveBeenCalled();
  });
});

describe('h-bubble-gallery', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds gallery grid classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-gallery', el);
    expect(el.classList.contains('grid')).toBe(true);
    expect(el.classList.contains('grid-cols-2')).toBe(true);
  });

  it('sets data-slot="bubble-gallery"', () => {
    mountDirective(bubblePlugin, 'h-bubble-gallery', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-gallery');
  });
});

describe('h-bubble-gallery-more', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds wrapper classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-gallery-more', el);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
  });

  it('styles the button overlay through bubble.css', () => {
    expect(bubbleCss).toContain('[data-slot="bubble-gallery-more"] > button');
  });

  it('sets data-slot="bubble-gallery-more"', () => {
    mountDirective(bubblePlugin, 'h-bubble-gallery-more', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-gallery-more');
  });

  it('preserves an author-set data-slot', () => {
    el.setAttribute('data-slot', 'custom');
    mountDirective(bubblePlugin, 'h-bubble-gallery-more', el);
    expect(el.getAttribute('data-slot')).toBe('custom');
  });
});

describe('h-bubble-audio', () => {
  let el;
  let errorSpy;

  const player = () => el.nextElementSibling;
  const dispatch = (type) => el.dispatchEvent(new Event(type));
  const key = (target, k) => target.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

  beforeEach(() => {
    el = document.createElement('audio');
    el.setAttribute('src', 'clip.wav');
    document.body.appendChild(el);
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    el.remove();
    if (player()) player().remove();
    errorSpy.mockRestore();
  });

  it('hides the native element and drops its controls', () => {
    el.setAttribute('controls', '');
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.hasAttribute('controls')).toBe(false);
  });

  it('builds a custom player with button, seek slider and time readout', () => {
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    const p = player();
    expect(p).toBeTruthy();
    expect(p.getAttribute('data-slot')).toBe('bubble-audio');
    expect(p.querySelector('button')).toBeTruthy();
    const track = p.querySelector('[role="slider"]');
    expect(track).toBeTruthy();
    expect(track.getAttribute('tabindex')).toBe('0');
    expect(track.getAttribute('aria-label')).toBe('Seek');
    expect(p.querySelector('span').textContent).toBe('0:00 / 0:00');
  });

  it('logs an error when there is no src or source child', () => {
    el.removeAttribute('src');
    mountDirective(bubblePlugin, 'h-bubble-audio', el, { original: 'x-h-bubble-audio' });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('does not log an error when a src is present', () => {
    mountDirective(bubblePlugin, 'h-bubble-audio', el, { original: 'x-h-bubble-audio' });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it('toggles playback when the button is clicked', () => {
    const playSpy = vi.spyOn(el, 'play').mockImplementation(() => Promise.resolve());
    const pauseSpy = vi.spyOn(el, 'pause').mockImplementation(() => {});
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    const button = player().querySelector('button');

    Object.defineProperty(el, 'paused', { configurable: true, value: true });
    button.click();
    expect(playSpy).toHaveBeenCalled();

    Object.defineProperty(el, 'paused', { configurable: true, value: false });
    button.click();
    expect(pauseSpy).toHaveBeenCalled();
  });

  it('flips the button label between play and pause with playback state', () => {
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    const button = player().querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Play');
    dispatch('play');
    expect(button.getAttribute('aria-label')).toBe('Pause');
    dispatch('pause');
    expect(button.getAttribute('aria-label')).toBe('Play');
  });

  it('honors localized play/pause and seek labels', () => {
    el.setAttribute('data-play-label', 'Lecture');
    el.setAttribute('data-pause-label', 'Pause audio');
    el.setAttribute('data-label', 'Position');
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    const button = player().querySelector('button');
    expect(button.getAttribute('aria-label')).toBe('Lecture');
    expect(player().querySelector('[role="slider"]').getAttribute('aria-label')).toBe('Position');
    dispatch('play');
    expect(button.getAttribute('aria-label')).toBe('Pause audio');
  });

  it('reflects time updates in the fill, time readout and slider value', () => {
    Object.defineProperty(el, 'duration', { configurable: true, get: () => 100 });
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    dispatch('loadedmetadata');
    el.currentTime = 25;
    dispatch('timeupdate');

    const track = player().querySelector('[role="slider"]');
    expect(track.firstElementChild.style.width).toBe('25%');
    expect(player().querySelector('span').textContent).toBe('0:25 / 1:40');
    expect(track.getAttribute('aria-valuenow')).toBe('25');
    expect(track.getAttribute('aria-valuemax')).toBe('100');
  });

  it('seeks with the keyboard', () => {
    Object.defineProperty(el, 'duration', { configurable: true, get: () => 100 });
    mountDirective(bubblePlugin, 'h-bubble-audio', el);
    dispatch('loadedmetadata');
    const track = player().querySelector('[role="slider"]');

    key(track, 'ArrowRight');
    expect(el.currentTime).toBe(5);
    key(track, 'End');
    expect(el.currentTime).toBe(100);
    key(track, 'Home');
    expect(el.currentTime).toBe(0);
  });

  it('registers a cleanup callback', () => {
    const { ctx } = mountDirective(bubblePlugin, 'h-bubble-audio', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-bubble-file', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds file panel classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-file', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('bg-current/10')).toBe(true);
  });

  it('sets data-slot="bubble-file"', () => {
    mountDirective(bubblePlugin, 'h-bubble-file', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-file');
  });
});

describe('h-bubble-link', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('a');
  });

  it('adds link preview classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-link', el);
    expect(el.classList.contains('block')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('bg-current/10')).toBe(true);
    expect(el.classList.contains('no-underline')).toBe(true);
  });

  it('sets data-slot="bubble-link"', () => {
    mountDirective(bubblePlugin, 'h-bubble-link', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-link');
  });
});

describe('h-bubble-reactions', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds positioning and pill classes', () => {
    mountDirective(bubblePlugin, 'h-bubble-reactions', el);
    expect(el.classList.contains('absolute')).toBe(true);
    expect(el.classList.contains('-bottom-3')).toBe(true);
    expect(el.classList.contains('end-2')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('bg-background')).toBe(true);
    expect(el.classList.contains('shadow-sm')).toBe(true);
  });

  it('styles the reaction buttons and right-aligned flip through bubble.css', () => {
    expect(bubbleCss).toContain('[data-slot="bubble-reactions"] > button');
    expect(bubbleCss).toContain('[data-align="right"] [data-slot="bubble-reactions"]');
  });

  it('sets data-slot="bubble-reactions"', () => {
    mountDirective(bubblePlugin, 'h-bubble-reactions', el);
    expect(el.getAttribute('data-slot')).toBe('bubble-reactions');
  });

  it('sets role="group" and a default aria-label', () => {
    mountDirective(bubblePlugin, 'h-bubble-reactions', el);
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('Reactions');
  });

  it('uses data-label for the accessible name', () => {
    el.setAttribute('data-label', 'Reaktionen');
    mountDirective(bubblePlugin, 'h-bubble-reactions', el);
    expect(el.getAttribute('aria-label')).toBe('Reaktionen');
  });

  it('preserves an author-set aria-label and role', () => {
    el.setAttribute('role', 'toolbar');
    el.setAttribute('aria-label', 'Message reactions');
    mountDirective(bubblePlugin, 'h-bubble-reactions', el);
    expect(el.getAttribute('role')).toBe('toolbar');
    expect(el.getAttribute('aria-label')).toBe('Message reactions');
  });

  it('does not set aria-label when aria-labelledby is present', () => {
    el.setAttribute('aria-labelledby', 'reactions-heading');
    mountDirective(bubblePlugin, 'h-bubble-reactions', el);
    expect(el.hasAttribute('aria-label')).toBe(false);
  });
});
