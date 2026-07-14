import { afterEach, describe, expect, it, vi } from 'vitest';
import carouselPlugin from '../../src/components/carousel.js';
import { mountDirective } from '../test-utils.js';

function makeRoot(attrs = {}) {
  const root = document.createElement('div');
  Object.entries(attrs).forEach(([k, v]) => root.setAttribute(k, v));
  document.body.appendChild(root);
  const { ctx } = mountDirective(carouselPlugin, 'h-carousel', root);
  return { root, ctx };
}

function addItem(root, parent = root) {
  const item = document.createElement('div');
  parent.appendChild(item);
  mountDirective(carouselPlugin, 'h-carousel-item', item, { original: 'x-h-carousel-item' });
  return item;
}

describe('h-carousel', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.useRealTimers();
  });

  it('registers all carousel directives', () => {
    const root = document.createElement('div');
    const { alpine } = mountDirective(carouselPlugin, 'h-carousel', root);
    expect(alpine._directives['h-carousel']).toBeDefined();
    expect(alpine._directives['h-carousel-content']).toBeDefined();
    expect(alpine._directives['h-carousel-item']).toBeDefined();
    expect(alpine._directives['h-carousel-control']).toBeDefined();
    expect(alpine._directives['h-carousel-indicators']).toBeDefined();
  });

  it('sets region roles, tabindex, default label and data-slot', () => {
    const { root } = makeRoot();
    expect(root.getAttribute('data-slot')).toBe('carousel');
    expect(root.getAttribute('role')).toBe('region');
    expect(root.getAttribute('aria-roledescription')).toBe('carousel');
    expect(root.getAttribute('tabindex')).toBe('0');
    expect(root.getAttribute('aria-label')).toBe('Carousel');
  });

  it('honors data-label and a custom aria-label', () => {
    const { root: a } = makeRoot({ 'data-label': 'Photos' });
    expect(a.getAttribute('aria-label')).toBe('Photos');
    const b = document.createElement('div');
    b.setAttribute('aria-label', 'Own name');
    mountDirective(carouselPlugin, 'h-carousel', b);
    expect(b.getAttribute('aria-label')).toBe('Own name');
  });

  it('creates reactive state with active and count plus navigation helpers', () => {
    const { root } = makeRoot({ 'data-start': '1' });
    expect(root._h_carousel.active).toBe(1);
    expect(root._h_carousel.count).toBe(0);
    expect(typeof root._h_carousel.goTo).toBe('function');
    expect(typeof root._h_carousel.next).toBe('function');
    expect(typeof root._h_carousel.prev).toBe('function');
  });

  it('wraps around by default and dispatches a change event', () => {
    const { root } = makeRoot();
    addItem(root);
    addItem(root);
    addItem(root);
    const onChange = vi.fn();
    root.addEventListener('change', onChange);

    root._h_carousel.next();
    expect(root._h_carousel.active).toBe(1);
    root._h_carousel.prev();
    root._h_carousel.prev();
    expect(root._h_carousel.active).toBe(2); // wrapped past the start
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls.at(-1)[0].detail.value).toBe(2);
  });

  it('clamps instead of wrapping when data-loop is false', () => {
    const { root } = makeRoot({ 'data-loop': 'false' });
    addItem(root);
    addItem(root);
    root._h_carousel.prev();
    expect(root._h_carousel.active).toBe(0);
    root._h_carousel.goTo(5);
    expect(root._h_carousel.active).toBe(1);
  });

  it('navigates with the keyboard', () => {
    const { root } = makeRoot();
    addItem(root);
    addItem(root);
    addItem(root);

    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    expect(root._h_carousel.active).toBe(1);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
    expect(root._h_carousel.active).toBe(2);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    expect(root._h_carousel.active).toBe(0);
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    expect(root._h_carousel.active).toBe(2); // wraps
  });

  it('auto-advances when data-autoplay is set and cleans up the timer', () => {
    vi.useFakeTimers();
    const { root, ctx } = makeRoot({ 'data-autoplay': '', 'data-interval': '1000' });
    addItem(root);
    addItem(root);

    vi.advanceTimersByTime(1000);
    expect(root._h_carousel.active).toBe(1);

    expect(ctx.cleanup).toHaveBeenCalled();
    const cleanupFn = ctx.cleanup.mock.calls.at(-1)[0];
    cleanupFn();
    vi.advanceTimersByTime(2000);
    expect(root._h_carousel.active).toBe(1); // no further advance after cleanup
  });
});

describe('h-carousel-content', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('translates the track based on the active index', () => {
    const { root } = makeRoot();
    const content = document.createElement('div');
    root.appendChild(content);
    mountDirective(carouselPlugin, 'h-carousel-content', content, { original: 'x-h-carousel-content' });

    expect(content.getAttribute('data-slot')).toBe('carousel-content');
    expect(content.style.transform).toBe('translateX(-0%)');
    root._h_carousel.active = 2;
    expect(content.style.transform).toBe('translateX(-200%)');
  });

  it('throws without a carousel ancestor', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(carouselPlugin, 'h-carousel-content', orphan, { original: 'x-h-carousel-content' })).toThrow();
  });
});

describe('h-carousel-item', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers a zero-based index, bumps the count and sets slide roles', () => {
    const { root } = makeRoot();
    const first = addItem(root);
    const second = addItem(root);

    expect(root._h_carousel.count).toBe(2);
    expect(first.getAttribute('data-slot')).toBe('carousel-item');
    expect(first.getAttribute('role')).toBe('group');
    expect(first.getAttribute('aria-roledescription')).toBe('slide');
    expect(first.getAttribute('aria-hidden')).toBe('false');
    expect(second.getAttribute('aria-hidden')).toBe('true');
    expect(first.getAttribute('aria-label')).toBe('1 of 2');
  });

  it('reacts to the active index', () => {
    const { root } = makeRoot();
    const first = addItem(root);
    const second = addItem(root);
    root._h_carousel.active = 1;
    expect(first.getAttribute('aria-hidden')).toBe('true');
    expect(second.getAttribute('aria-hidden')).toBe('false');
    expect(second.getAttribute('data-active')).toBe('true');
  });

  it('throws without a carousel ancestor', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(carouselPlugin, 'h-carousel-item', orphan, { original: 'x-h-carousel-item' })).toThrow();
  });
});

describe('h-carousel-control', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mountControl(root, modifiers) {
    const btn = document.createElement('button');
    root.appendChild(btn);
    mountDirective(carouselPlugin, 'h-carousel-control', btn, { modifiers, original: 'x-h-carousel-control' });
    return btn;
  }

  it('auto-inserts a chevron and a default label per direction', () => {
    const { root } = makeRoot();
    const prev = mountControl(root, ['previous']);
    const next = mountControl(root, []);
    expect(prev.querySelector('svg')).toBeTruthy();
    expect(prev.getAttribute('aria-label')).toBe('Previous slide');
    expect(next.getAttribute('aria-label')).toBe('Next slide');
    expect(prev.getAttribute('data-slot')).toBe('carousel-control');
    expect(prev.getAttribute('type')).toBe('button');
  });

  it('advances the carousel on click', () => {
    const { root } = makeRoot();
    addItem(root);
    addItem(root);
    addItem(root);
    const next = mountControl(root, []);
    const prev = mountControl(root, ['previous']);
    const nextSpy = vi.spyOn(root._h_carousel, 'next');
    const prevSpy = vi.spyOn(root._h_carousel, 'prev');
    next.dispatchEvent(new Event('click'));
    prev.dispatchEvent(new Event('click'));
    expect(nextSpy).toHaveBeenCalled();
    expect(prevSpy).toHaveBeenCalled();
  });

  it('disables controls at the ends when looping is off', () => {
    const { root } = makeRoot({ 'data-loop': 'false' });
    addItem(root);
    addItem(root);
    const prev = mountControl(root, ['previous']);
    const next = mountControl(root, []);
    expect(prev.disabled).toBe(true); // at first slide
    expect(next.disabled).toBe(false);
    root._h_carousel.active = 1;
    expect(prev.disabled).toBe(false);
    expect(next.disabled).toBe(true); // at last slide
  });

  it('throws without a carousel ancestor', () => {
    const orphan = document.createElement('button');
    document.body.appendChild(orphan);
    expect(() => mountDirective(carouselPlugin, 'h-carousel-control', orphan, { modifiers: [], original: 'x-h-carousel-control' })).toThrow();
  });
});

describe('h-carousel-indicators', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mountIndicators(root, attrs = {}) {
    const el = document.createElement('div');
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    root.appendChild(el);
    const { ctx } = mountDirective(carouselPlugin, 'h-carousel-indicators', el, { original: 'x-h-carousel-indicators' });
    return { el, ctx };
  }

  it('builds one dot per slide and marks the active one', () => {
    const { root } = makeRoot();
    addItem(root);
    addItem(root);
    addItem(root);
    const { el } = mountIndicators(root);

    const dots = el.querySelectorAll('button');
    expect(dots.length).toBe(3);
    expect(el.getAttribute('role')).toBe('group');
    expect(el.getAttribute('aria-label')).toBe('Choose slide');
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[1].hasAttribute('aria-current')).toBe(false);
    expect(dots[0].getAttribute('aria-label')).toBe('Slide 1');

    root._h_carousel.active = 2;
    expect(dots[0].hasAttribute('aria-current')).toBe(false);
    expect(dots[2].getAttribute('aria-current')).toBe('true');
  });

  it('seeks to a slide when a dot is clicked', () => {
    const { root } = makeRoot();
    addItem(root);
    addItem(root);
    addItem(root);
    const { el } = mountIndicators(root);
    const goToSpy = vi.spyOn(root._h_carousel, 'goTo');
    el.querySelectorAll('button')[2].dispatchEvent(new Event('click'));
    expect(goToSpy).toHaveBeenCalledWith(2);
    expect(root._h_carousel.active).toBe(2);
  });

  it('rebuilds when the slide count changes', () => {
    const { root } = makeRoot();
    addItem(root);
    const { el } = mountIndicators(root);
    expect(el.querySelectorAll('button').length).toBe(1);
    addItem(root);
    addItem(root);
    expect(el.querySelectorAll('button').length).toBe(3);
  });

  it('honors data-label and data-slide-label', () => {
    const { root } = makeRoot();
    addItem(root);
    const { el } = mountIndicators(root, { 'data-label': 'Pick a photo', 'data-slide-label': 'Photo' });
    expect(el.getAttribute('aria-label')).toBe('Pick a photo');
    expect(el.querySelector('button').getAttribute('aria-label')).toBe('Photo 1');
  });

  it('throws without a carousel ancestor', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(carouselPlugin, 'h-carousel-indicators', orphan, { original: 'x-h-carousel-indicators' })).toThrow();
  });
});
