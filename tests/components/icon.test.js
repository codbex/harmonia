import { beforeEach, describe, expect, it, vi } from 'vitest';
import iconPlugin from '../../src/components/icon.js';
import { mountDirective } from '../test-utils.js';

describe('h-icon', () => {
  let el;

  beforeEach(() => {
    el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    el.setAttribute('role', 'presentation');
    document.body.appendChild(el);
  });

  it('registers h-icon directive', () => {
    const { alpine } = mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    expect(alpine._directives['h-icon']).toBeDefined();
  });

  it('adds fill-current class', () => {
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    expect(el.classList.contains('fill-current')).toBe(true);
  });

  it('sets data-slot="icon"', () => {
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    expect(el.getAttribute('data-slot')).toBe('icon');
  });

  it('throws if element is not an svg', () => {
    const div = document.createElement('div');
    div.setAttribute('role', 'presentation');
    document.body.appendChild(div);
    expect(() => mountDirective(iconPlugin, 'h-icon', div, { original: 'h-icon' })).toThrow();
  });

  it('throws if svg has no role attribute', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    document.body.appendChild(svg);
    expect(() => mountDirective(iconPlugin, 'h-icon', svg, { original: 'h-icon' })).toThrow();
  });

  it('throws if role=img but no aria-label or aria-labelledby', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    document.body.appendChild(svg);
    expect(() => mountDirective(iconPlugin, 'h-icon', svg, { original: 'h-icon' })).toThrow();
  });

  it('does not throw if role=img with aria-label', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'My icon');
    document.body.appendChild(svg);
    expect(() => mountDirective(iconPlugin, 'h-icon', svg, { original: 'h-icon' })).not.toThrow();
  });

  it('does not throw if role=img with aria-labelledby', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-labelledby', 'label-id');
    document.body.appendChild(svg);
    expect(() => mountDirective(iconPlugin, 'h-icon', svg, { original: 'h-icon' })).not.toThrow();
  });

  it('does not throw for presentation role without aria attributes', () => {
    expect(() => mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' })).not.toThrow();
  });

  it('renders a built-in icon from the data-icon attribute', () => {
    el.setAttribute('data-icon', 'calendar');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    expect(el.children.length).toBeGreaterThan(0);
    expect(el.getAttribute('viewBox')).toBe('0 0 16 16');
  });

  it('renders nothing for an unknown data-icon value', () => {
    el.setAttribute('data-icon', 'not-a-real-icon');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    expect(el.children.length).toBe(0);
  });

  it('replaces the svg content when data-icon changes', async () => {
    // Baseline: a freshly rendered "search" icon, to compare child counts against.
    const fresh = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fresh.setAttribute('role', 'presentation');
    fresh.setAttribute('data-icon', 'search');
    document.body.appendChild(fresh);
    mountDirective(iconPlugin, 'h-icon', fresh, { original: 'h-icon' });
    const searchCount = fresh.children.length;

    el.setAttribute('data-icon', 'calendar');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    expect(el.children.length).toBeGreaterThan(0);

    el.setAttribute('data-icon', 'search');
    await new Promise((resolve) => setTimeout(resolve, 0)); // let the MutationObserver fire

    // Content is replaced (equals a fresh render), not stacked on top of "calendar".
    expect(el.children.length).toBe(searchCount);
  });

  it('fetches icon when data-link attribute is present', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>'),
    });
    vi.stubGlobal('fetch', fetchMock);

    el.setAttribute('data-link', '/icons/test.svg');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });

    expect(fetchMock).toHaveBeenCalledWith('/icons/test.svg');
    vi.unstubAllGlobals();
  });

  it('re-fetches and replaces the content when data-link changes', async () => {
    const svgFor = (paths) => `<svg xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
    const fetchMock = vi.fn((url) =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(url === '/icons/one.svg' ? svgFor('<path d="M0 0"/>') : svgFor('<path d="M1 1"/><path d="M2 2"/>')),
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    el.setAttribute('data-link', '/icons/one.svg');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.children.length).toBe(1);

    el.setAttribute('data-link', '/icons/two.svg');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).toHaveBeenCalledWith('/icons/two.svg');
    expect(el.children.length).toBe(2);
    vi.unstubAllGlobals();
  });

  it('falls back to data-icon when data-link is removed', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve('<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>'),
    });
    vi.stubGlobal('fetch', fetchMock);

    el.setAttribute('data-link', '/icons/test.svg');
    el.setAttribute('data-icon', 'calendar');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.getAttribute('viewBox')).toBeNull();

    el.removeAttribute('data-link');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(el.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(el.children.length).toBeGreaterThan(0);
    vi.unstubAllGlobals();
  });

  it('merges classes from the fetched svg instead of replacing existing ones', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      status: 200,
      text: () => Promise.resolve('<svg xmlns="http://www.w3.org/2000/svg" class="from-svg fill-current"><path d="M0 0"/></svg>'),
    });
    vi.stubGlobal('fetch', fetchMock);

    el.classList.add('author-class');
    el.setAttribute('data-link', '/icons/test.svg');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(el.classList.contains('author-class')).toBe(true);
    expect(el.classList.contains('fill-current')).toBe(true);
    expect(el.classList.contains('from-svg')).toBe(true);
    vi.unstubAllGlobals();
  });

  it('removes the previous svg classes on re-render but keeps pre-existing ones', async () => {
    const svgFor = (classes) => `<svg xmlns="http://www.w3.org/2000/svg" class="${classes}"><path d="M0 0"/></svg>`;
    const fetchMock = vi.fn((url) =>
      Promise.resolve({
        status: 200,
        text: () => Promise.resolve(url === '/icons/one.svg' ? svgFor('one-class author-class') : svgFor('two-class')),
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    el.classList.add('author-class');
    el.setAttribute('data-link', '/icons/one.svg');
    mountDirective(iconPlugin, 'h-icon', el, { original: 'h-icon' });
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(el.classList.contains('one-class')).toBe(true);

    el.setAttribute('data-link', '/icons/two.svg');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(el.classList.contains('one-class')).toBe(false);
    expect(el.classList.contains('two-class')).toBe(true);
    // "author-class" was on the element before the fetch, so the old svg declaring it too must not strip it.
    expect(el.classList.contains('author-class')).toBe(true);
    vi.unstubAllGlobals();
  });
});
