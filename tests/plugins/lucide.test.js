import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import lucidePlugin from '../../src/plugins/lucide';
import { mountDirective } from '../test-utils';

// Minimal Lucide global stub. `createElement` returns a fresh <svg> with the
// default attributes and one shape child, mirroring the real UMD build.
function mockLucide() {
  return {
    icons: { Home: ['svg', {}, []], ArrowUpRight: ['svg', {}, []] },
    createElement() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('lucide');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M0 0');
      svg.appendChild(path);
      return svg;
    },
  };
}

function setup(attrs = {}, { expression = '', evaluate, tag = 'i' } = {}) {
  const parent = document.createElement('div');
  document.body.appendChild(parent);
  const el = tag === 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  parent.appendChild(el);
  const { ctx } = mountDirective(lucidePlugin, 'h-lucide', el, { expression, original: 'x-h-lucide' }, evaluate ? { evaluate } : {});
  return { parent, el, ctx };
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
    expect(svg.classList.contains('lucide-icon')).toBe(true);
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

  describe('svg placeholders (rendered in place)', () => {
    it('keeps the same element and renders the icon inside it', () => {
      const { parent, el } = setup({ 'data-lucide': 'home' }, { tag: 'svg' });
      expect(parent.querySelector('svg')).toBe(el);
      expect(el.querySelector('path')).toBeTruthy();
    });

    it('merges the lucide classes with the author classes', () => {
      const { el } = setup({ 'data-lucide': 'home', class: 'size-4 text-primary' }, { tag: 'svg' });
      expect(el.classList.contains('size-4')).toBe(true);
      expect(el.classList.contains('text-primary')).toBe(true);
      expect(el.classList.contains('lucide')).toBe(true);
      expect(el.classList.contains('lucide-home')).toBe(true);
    });

    it('applies generated attributes only where the author has not set them', () => {
      const { el } = setup({ 'data-lucide': 'home', fill: 'currentColor' }, { tag: 'svg' });
      expect(el.getAttribute('fill')).toBe('currentColor'); // the author wins
      expect(el.getAttribute('viewBox')).toBe('0 0 24 24'); // generated fills the gap
    });

    it('keeps data-lucide and Alpine directive attributes on the element and does not throw', () => {
      const { el } = setup({ 'data-lucide': 'home', 'x-show': 'open', 'x-bind:class': 'cls', 'x-on:click': 'go()' }, { tag: 'svg' });
      expect(el.getAttribute('data-lucide')).toBe('home');
      expect(el.getAttribute('x-show')).toBe('open');
      expect(el.getAttribute('x-bind:class')).toBe('cls');
      expect(el.querySelector('path')).toBeTruthy();
    });

    it('re-renders the icon when data-lucide changes', async () => {
      const { el } = setup({ 'data-lucide': 'home', class: 'size-4' }, { tag: 'svg' });
      expect(el.classList.contains('lucide-home')).toBe(true);
      el.setAttribute('data-lucide', 'arrow-up-right');
      await new Promise((resolve) => setTimeout(resolve, 0)); // let the MutationObserver fire
      expect(el.classList.contains('lucide-arrow-up-right')).toBe(true);
      expect(el.classList.contains('lucide-home')).toBe(false); // previous icon class removed
      expect(el.classList.contains('size-4')).toBe(true); // author classes untouched
      expect(el.querySelector('path')).toBeTruthy();
    });

    it('keeps the current icon when data-lucide changes to an unknown name', async () => {
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const { el } = setup({ 'data-lucide': 'home' }, { tag: 'svg' });
      el.setAttribute('data-lucide', 'definitely-not-an-icon');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(spy).toHaveBeenCalled();
      expect(el.classList.contains('lucide-home')).toBe(true);
      expect(el.querySelector('path')).toBeTruthy();
    });

    it('stops observing data-lucide on cleanup', async () => {
      const { el, ctx } = setup({ 'data-lucide': 'home' }, { tag: 'svg' });
      for (const [fn] of ctx.cleanup.mock.calls) fn();
      el.setAttribute('data-lucide', 'arrow-up-right');
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(el.classList.contains('lucide-home')).toBe(true);
      expect(el.classList.contains('lucide-arrow-up-right')).toBe(false);
    });

    it('renders in place through the scoped createIcons fallback too', () => {
      window.lucide = {
        createIcons({ root }) {
          root.querySelectorAll('[data-lucide]').forEach((node) => {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 24 24');
            svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
            node.replaceWith(svg);
          });
        },
      };
      const { parent, el } = setup({ 'data-lucide': 'home', 'x-show': 'open' }, { tag: 'svg' });
      expect(parent.querySelector('svg')).toBe(el);
      expect(el.querySelector('path')).toBeTruthy();
      expect(parent.querySelector('span')).toBeNull(); // temporary holder removed
      expect(parent.querySelector('i')).toBeNull(); // temporary placeholder removed with it
    });
  });

  describe('directives on replaced placeholders', () => {
    it('throws for x-show on an <i> placeholder', () => {
      expect(() => setup({ 'data-lucide': 'home', 'x-show': 'open' })).toThrow(/cannot be used on a <i> placeholder/);
    });

    it('throws for event and bind directives on an <i> placeholder', () => {
      expect(() => setup({ 'data-lucide': 'home', 'x-on:click': 'go()' })).toThrow(/x-on:click/);
      expect(() => setup({ 'data-lucide': 'home', 'x-bind:class': 'cls' })).toThrow(/x-bind:class/);
      expect(() => setup({ 'data-lucide': 'home', '@click': 'go()' })).toThrow(/@click/);
      expect(() => setup({ 'data-lucide': 'home', ':class': 'cls' })).toThrow(/:class/);
    });

    it('points the error at the <svg> placeholder form', () => {
      expect(() => setup({ 'data-lucide': 'home', 'x-show': 'open' })).toThrow(/<svg x-h-lucide>/);
    });

    it('allows :data-lucide (the dynamic icon name form) on an <i>', () => {
      // x-bind runs before this directive and has already written data-lucide,
      // so the binding is consumed at render time and losing it is harmless.
      const { parent } = setup({ ':data-lucide': "kind === 'a' ? 'home' : 'arrow-up-right'", 'data-lucide': 'home' });
      expect(parent.querySelector('svg')).toBeTruthy();
    });

    it('allows x-bind:data-lucide on an <i>', () => {
      const { parent } = setup({ 'x-bind:data-lucide': 'icon', 'data-lucide': 'home' });
      expect(parent.querySelector('svg')).toBeTruthy();
    });
  });
});
