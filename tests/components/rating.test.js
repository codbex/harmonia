import { describe, expect, it, vi } from 'vitest';
import ratingPlugin from '../../src/components/rating.js';
import { mountDirective } from '../test-utils.js';

function build(attrs = {}) {
  const el = document.createElement('div');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  document.body.appendChild(el);
  return el;
}

function mount(el, ctxOverrides = {}) {
  return mountDirective(ratingPlugin, 'h-rating', el, { original: 'h-rating' }, ctxOverrides);
}

const states = (el) => Array.from(el.querySelectorAll('[data-state]')).map((s) => s.getAttribute('data-state'));
const key = (el, k) => el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

describe('h-rating', () => {
  it('registers the directive', () => {
    const { alpine } = mount(build());
    expect(alpine._directives['h-rating']).toBeDefined();
  });

  it('renders 5 stars by default and honors data-max', () => {
    const def = build();
    mount(def);
    expect(def.querySelectorAll('[data-state]').length).toBe(5);

    const el = build({ 'data-max': '10' });
    mount(el);
    expect(el.querySelectorAll('[data-state]').length).toBe(10);
  });

  it('is a slider with value bounds when interactive', () => {
    const el = build({ 'data-max': '5' });
    mount(el);
    expect(el.getAttribute('role')).toBe('slider');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('aria-valuemin')).toBe('0');
    expect(el.getAttribute('aria-valuemax')).toBe('5');
  });

  it('renders an initial data-value with a half star', () => {
    const el = build({ 'data-value': '2.5' });
    mount(el);
    expect(states(el)).toEqual(['full', 'full', 'half', 'empty', 'empty']);
    expect(el.getAttribute('aria-valuenow')).toBe('2.5');
    expect(el.getAttribute('aria-valuetext')).toBe('2.5 of 5 stars');
  });

  it('increases and decreases by half on arrow keys, clamped to bounds', () => {
    const el = build({ 'data-value': '2' });
    mount(el);
    key(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('2.5');
    key(el, 'ArrowLeft');
    key(el, 'ArrowLeft');
    key(el, 'ArrowLeft');
    key(el, 'ArrowLeft');
    key(el, 'ArrowLeft');
    expect(el.getAttribute('aria-valuenow')).toBe('0');
    key(el, 'End');
    expect(el.getAttribute('aria-valuenow')).toBe('5');
  });

  it('steps by whole stars in full precision', () => {
    const el = build({ 'data-precision': 'full', 'data-value': '2' });
    mount(el);
    key(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('3');
    expect(states(el)).toEqual(['full', 'full', 'full', 'empty', 'empty']);
  });

  it('writes to and reads from x-model', () => {
    let stored = 3;
    const el = build();
    Object.defineProperty(el, '_x_model', {
      value: { get: () => stored, set: vi.fn((v) => (stored = v)) },
      configurable: true,
    });
    mount(el);
    // initial sync from model
    expect(el.getAttribute('aria-valuenow')).toBe('3');
    expect(states(el)).toEqual(['full', 'full', 'full', 'empty', 'empty']);
    // keyboard updates the model
    key(el, 'ArrowRight');
    expect(stored).toBe(3.5);
    expect(el._x_model.set).toHaveBeenCalledWith(3.5);
  });

  it('dispatches a bubbling change event carrying the value', () => {
    const el = build({ 'data-value': '2' });
    mount(el);
    const changes = [];
    document.body.addEventListener('change', (event) => changes.push(event.detail));
    key(el, 'ArrowRight');
    expect(changes).toEqual([{ value: 2.5 }]);
  });

  // Alpine's .lazy listener would write the change event's detail object over
  // the bound value, so the event modifiers are rejected at init.
  it('rejects x-model event modifiers with a console error', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = build({ 'x-model.lazy': 'score' });
    mount(el);
    expect(error).toHaveBeenCalledWith('h-rating: x-model.lazy is not supported, the model always updates immediately', el);
    error.mockRestore();
  });

  // A disabled rating still has a value worth announcing, so it stays a focusable
  // slider and only refuses input. Dropping it from the tab order, as it once
  // did, left a keyboard user unable to discover it at all.
  it('stays an announced slider when disabled', () => {
    const el = build({ 'aria-disabled': 'true', 'data-value': '1' });
    mount(el);
    expect(el.getAttribute('role')).toBe('slider');
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('aria-valuenow')).toBe('1');
    expect(el.getAttribute('aria-valuetext')).toBe('1 of 5 stars');
    expect(el.classList.contains('opacity-disabled')).toBe(true);
  });

  it('refuses input while disabled', () => {
    const el = build({ 'aria-disabled': 'true', 'data-value': '2' });
    mount(el);
    key(el, 'ArrowRight');
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el.getAttribute('aria-valuenow')).toBe('2');
  });

  // The value used to be written into aria-label, which destroyed whatever name
  // the author had given the rating.
  it('never overwrites the accessible name with the value', async () => {
    const el = build({ 'aria-disabled': 'true', 'data-value': '4.5', 'aria-label': 'Average rating' });
    mount(el);
    expect(el.getAttribute('aria-label')).toBe('Average rating');

    const labelled = build({ 'aria-labelledby': 'heading-id', 'data-value': '3' });
    mount(labelled);
    labelled.setAttribute('aria-disabled', 'true');
    await new Promise((resolve) => setTimeout(resolve, 0));
    // No competing aria-label, so the referenced heading still names it and the
    // value is announced from aria-valuetext instead.
    expect(labelled.hasAttribute('aria-label')).toBe(false);
    expect(labelled.getAttribute('aria-valuetext')).toBe('3 of 5 stars');
  });

  it('reacts to aria-disabled being toggled after init', async () => {
    const el = build({ 'data-value': '2' });
    mount(el);
    expect(el.getAttribute('role')).toBe('slider');

    el.setAttribute('aria-disabled', 'true');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('opacity-disabled')).toBe(true);
    expect(el.getAttribute('role')).toBe('slider');
    key(el, 'ArrowRight');
    expect(states(el)).toEqual(['full', 'full', 'empty', 'empty', 'empty']);

    el.removeAttribute('aria-disabled');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('opacity-disabled')).toBe(false);
    expect(el.getAttribute('role')).toBe('slider');
    key(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('2.5');
  });

  it('requires the explicit "true" value to lock the rating', () => {
    // A bound attribute renders the literal string "false", so a presence check
    // would lock exactly the rating the author meant to keep usable.
    const el = build({ 'aria-disabled': 'false', 'data-value': '2' });
    mount(el);
    key(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('2.5');
  });

  it('uses a default accessible name unless one is provided', () => {
    const el = build();
    mount(el);
    expect(el.getAttribute('aria-label')).toBe('Rating');

    const labelled = build({ 'aria-label': 'Movie score' });
    mount(labelled);
    expect(labelled.getAttribute('aria-label')).toBe('Movie score');

    const referenced = build({ 'aria-labelledby': 'heading-id' });
    mount(referenced);
    expect(referenced.hasAttribute('aria-label')).toBe(false);
  });

  it('sets a horizontal orientation and hides the star icons', () => {
    const el = build({ 'data-value': '3' });
    mount(el);
    expect(el.getAttribute('aria-orientation')).toBe('horizontal');
    for (const svg of el.querySelectorAll('svg')) {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
      expect(svg.getAttribute('role')).toBe('presentation');
    }
  });

  it('announces the zero state, overridable with data-aria-empty', () => {
    const el = build();
    mount(el);
    expect(el.getAttribute('aria-valuetext')).toBe('No rating');

    const custom = build({ 'data-aria-empty': 'Keine Bewertung' });
    mount(custom);
    expect(custom.getAttribute('aria-valuetext')).toBe('Keine Bewertung');
  });

  // A whole template rather than separate words, so a translation can put the
  // numbers wherever its language needs them.
  it('builds the value text from data-value-label', () => {
    const el = build({ 'data-value-label': '{value} von {max} Sternen', 'data-value': '2.5' });
    mount(el);
    expect(el.getAttribute('aria-valuetext')).toBe('2.5 von 5 Sternen');

    const reordered = build({ 'data-value-label': '{max} 中 {value}', 'data-value': '3' });
    mount(reordered);
    expect(reordered.getAttribute('aria-valuetext')).toBe('5 中 3');
  });

  it('fills stars with yellow by default and honors data-color', () => {
    const def = build({ 'data-value': '3' });
    mount(def);
    expect(def.querySelector('[data-state="full"] svg').classList.contains('text-yellow-500')).toBe(true);

    const red = build({ 'data-value': '3', 'data-color': 'red' });
    mount(red);
    expect(red.querySelector('[data-state="full"] svg').classList.contains('text-red-500')).toBe(true);

    const unknown = build({ 'data-value': '3', 'data-color': 'chartreuse' });
    mount(unknown);
    expect(unknown.querySelector('[data-state="full"] svg').classList.contains('text-yellow-500')).toBe(true);
  });

  it('calls cleanup', () => {
    const { ctx } = mount(build());
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
