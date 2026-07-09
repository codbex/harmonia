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

  it('renders as a non-interactive image when read-only', () => {
    const el = build({ 'data-readonly': 'true', 'data-value': '4' });
    mount(el);
    expect(el.getAttribute('role')).toBe('img');
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.getAttribute('aria-label')).toBe('4 of 5 stars');
  });

  it('marks disabled state', () => {
    const el = build({ disabled: '', 'data-value': '1' });
    mount(el);
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.classList.contains('opacity-disabled')).toBe(true);
  });

  it('reacts to the disabled attribute being toggled after init', async () => {
    const el = build({ 'data-value': '2' });
    mount(el);
    expect(el.getAttribute('role')).toBe('slider');

    el.setAttribute('disabled', '');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.classList.contains('opacity-disabled')).toBe(true);
    expect(el.getAttribute('role')).toBe('img');
    key(el, 'ArrowRight');
    expect(states(el)).toEqual(['full', 'full', 'empty', 'empty', 'empty']);

    el.removeAttribute('disabled');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.hasAttribute('aria-disabled')).toBe(false);
    expect(el.classList.contains('opacity-disabled')).toBe(false);
    expect(el.getAttribute('role')).toBe('slider');
    key(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('2.5');
  });

  it('reacts to data-readonly being toggled after init', async () => {
    const el = build({ 'data-value': '3' });
    mount(el);

    el.setAttribute('data-readonly', 'true');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.getAttribute('role')).toBe('img');
    expect(el.hasAttribute('tabindex')).toBe(false);
    expect(el.getAttribute('aria-label')).toBe('3 of 5 stars');
    key(el, 'ArrowRight');
    expect(states(el)).toEqual(['full', 'full', 'full', 'empty', 'empty']);

    el.removeAttribute('data-readonly');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.getAttribute('role')).toBe('slider');
    expect(el.getAttribute('tabindex')).toBe('0');
    key(el, 'ArrowRight');
    expect(el.getAttribute('aria-valuenow')).toBe('3.5');
  });

  it('uses a default accessible name unless one is provided', () => {
    const el = build();
    mount(el);
    expect(el.getAttribute('aria-label')).toBe('Rating');

    const labelled = build({ 'aria-label': 'Movie score' });
    mount(labelled);
    expect(labelled.getAttribute('aria-label')).toBe('Movie score');
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
