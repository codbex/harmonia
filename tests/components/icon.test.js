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
});
