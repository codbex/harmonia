import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import lucidePlugin from '../../src/plugins/lucide';
import { mountDirective } from '../test-utils';

// Minimal Lucide global stub. `createElement` returns a fresh <svg>, mirroring
// the real UMD build.
function mockLucide() {
  return {
    icons: { Home: ['svg', {}, []], ArrowUpRight: ['svg', {}, []] },
    createElement() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('lucide');
      return svg;
    },
  };
}

function setup(attrs = {}, { expression = '', evaluate } = {}) {
  const parent = document.createElement('div');
  document.body.appendChild(parent);
  const el = document.createElement('i');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  mountDirective(lucidePlugin, 'h-lucide', el, { expression, original: 'x-h-lucide' }, evaluate ? { evaluate } : {});
  return { parent, el };
}

describe('x-h-lucide directive', () => {
  beforeEach(() => {
    window.lucide = mockLucide();
  });

  afterEach(() => {
    delete window.lucide;
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders the icon from data-lucide and replaces the placeholder with an svg', () => {
    const { parent } = setup({ 'data-lucide': 'home' });
    expect(parent.querySelector('i')).toBeNull();
    expect(parent.querySelector('svg')).toBeTruthy();
  });

  it('reads the icon name from the expression when there is no data-lucide', () => {
    const { parent } = setup({}, { expression: 'iconName', evaluate: () => 'home' });
    expect(parent.querySelector('svg')).toBeTruthy();
  });

  it('copies class / role / aria-* onto the svg and drops data-lucide', () => {
    const { parent } = setup({ 'data-lucide': 'home', class: 'size-4 text-primary', role: 'img', 'aria-label': 'Home' });
    const svg = parent.querySelector('svg');
    expect(svg.classList.contains('size-4')).toBe(true);
    expect(svg.classList.contains('text-primary')).toBe(true);
    expect(svg.getAttribute('role')).toBe('img');
    expect(svg.getAttribute('aria-label')).toBe('Home');
    expect(svg.hasAttribute('data-lucide')).toBe(false);
  });

  it('adds the identifying lucide classes so icons match native Lucide output', () => {
    // The real UMD createElement (unlike createIcons/replaceElement) does not add
    // these classes, so the directive must add them itself. Use a stub that mirrors
    // that by returning a bare svg with no classes.
    window.lucide = {
      icons: { Home: ['svg', {}, []] },
      createElement: () => document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    };
    const { parent } = setup({ 'data-lucide': 'home' });
    const svg = parent.querySelector('svg');
    expect(svg.classList.contains('lucide')).toBe(true);
    expect(svg.classList.contains('lucide-home')).toBe(true);
  });

  it('normalizes a multi-word icon name to a kebab-case lucide-<name> class', () => {
    const { parent } = setup({ 'data-lucide': 'arrow-up-right' });
    const svg = parent.querySelector('svg');
    expect(svg.classList.contains('lucide-arrow-up-right')).toBe(true);
  });

  it('does not copy the x-h-lucide directive attribute onto the svg', () => {
    // Otherwise Alpine re-initializes the directive on the rendered clone,
    // which has no data-lucide, producing a spurious "no icon name" error.
    const { parent } = setup({ 'x-h-lucide': '', 'data-lucide': 'home' });
    const svg = parent.querySelector('svg');
    expect(svg.hasAttribute('x-h-lucide')).toBe(false);
  });

  it('falls back to scoped createIcons when createElement is unavailable', () => {
    window.lucide = {
      createIcons({ root }) {
        // Emulate Lucide: replace each [data-lucide] within root with an <svg>.
        root.querySelectorAll('[data-lucide]').forEach((node) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          node.replaceWith(svg);
        });
      },
    };
    const { parent } = setup({ 'data-lucide': 'home' });
    expect(parent.querySelector('i')).toBeNull();
    expect(parent.querySelector('svg')).toBeTruthy();
    expect(parent.querySelector('span')).toBeNull(); // temporary holder is unwrapped
  });

  it('logs an error and leaves the element untouched when lucide is missing', () => {
    delete window.lucide;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { parent } = setup({ 'data-lucide': 'home' });
    expect(spy).toHaveBeenCalled();
    expect(parent.querySelector('i')).toBeTruthy();
  });

  it('logs an error for an unknown icon name', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { parent } = setup({ 'data-lucide': 'definitely-not-an-icon' });
    expect(spy).toHaveBeenCalled();
    expect(parent.querySelector('svg')).toBeNull();
  });

  it('logs an error when no icon name can be resolved', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    setup({});
    expect(spy).toHaveBeenCalled();
  });
});
