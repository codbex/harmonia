import { afterEach, describe, expect, it, vi } from 'vitest';
import breadcrumbPlugin from '../../src/components/breadcrumb.js';
import { mountDirective } from '../test-utils.js';

describe('h-breadcrumb', () => {
  it('applies base classes', () => {
    const el = document.createElement('nav');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
  });

  it('applies px-2 and no variant or height classes by default', () => {
    const el = document.createElement('nav');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('border')).toBe(false);
    expect(el.classList.contains('h-9')).toBe(false);
    expect(el.classList.contains('px-3')).toBe(false);
  });

  it('applies border and default size for outline variant', () => {
    const el = document.createElement('nav');
    el.setAttribute('data-variant', 'outline');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(true);
    expect(el.classList.contains('px-3')).toBe(true);
  });

  it('applies md size when data-size is md and variant is outline', () => {
    const el = document.createElement('nav');
    el.setAttribute('data-variant', 'outline');
    el.setAttribute('data-size', 'md');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('h-8')).toBe(true);
    expect(el.classList.contains('px-2.5')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(false);
  });

  it('applies sm size when data-size is sm and variant is outline', () => {
    const el = document.createElement('nav');
    el.setAttribute('data-variant', 'outline');
    el.setAttribute('data-size', 'sm');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('h-6.5')).toBe(true);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(false);
  });

  it('applies only px-2 when data-size is set but no variant', () => {
    const el = document.createElement('nav');
    el.setAttribute('data-size', 'md');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('h-8')).toBe(false);
    expect(el.classList.contains('h-9')).toBe(false);
  });

  it('sets role, aria-label, and data-slot attributes', () => {
    const el = document.createElement('nav');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.getAttribute('role')).toBe('navigation');
    expect(el.getAttribute('aria-label')).toBe('breadcrumb');
    expect(el.getAttribute('data-slot')).toBe('breadcrumb');
  });

  it('applies flex-wrap by default', () => {
    const el = document.createElement('nav');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('flex-wrap')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(false);
  });

  it('applies flex-nowrap and no scroll when data-overflow is nowrap', () => {
    const el = document.createElement('nav');
    el.setAttribute('data-overflow', 'nowrap');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('flex-nowrap')).toBe(true);
    expect(el.classList.contains('flex-wrap')).toBe(false);
    expect(el.classList.contains('overflow-x-scroll')).toBe(false);
  });

  it('applies scroll classes when data-overflow is scroll', () => {
    const el = document.createElement('nav');
    el.setAttribute('data-overflow', 'scroll');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);
    expect(el.classList.contains('overflow-x-scroll')).toBe(true);
    expect(el.classList.contains('scrollbar-none')).toBe(true);
    expect(el.classList.contains('flex-wrap')).toBe(false);
  });

  describe('scroll mode resize behaviour', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('registers resize and scroll listeners and cleans them up', () => {
      const addSpy = vi.spyOn(window, 'addEventListener');
      const removeSpy = vi.spyOn(window, 'removeEventListener');
      const addElSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
      const removeElSpy = vi.spyOn(HTMLElement.prototype, 'removeEventListener');

      const el = document.createElement('nav');
      el.setAttribute('data-overflow', 'scroll');
      const { ctx } = mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);

      expect(addSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(addElSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

      const [cleanupFn] = ctx.cleanup.mock.calls[0];
      cleanupFn();

      expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeElSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('scrolls to end on resize when user has not scrolled left', () => {
      const el = document.createElement('nav');
      el.setAttribute('data-overflow', 'scroll');

      Object.defineProperty(el, 'scrollWidth', { value: 500, configurable: true });
      Object.defineProperty(el, 'clientWidth', { value: 300, configurable: true });

      const addSpy = vi.spyOn(window, 'addEventListener');
      mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);

      const [, resizeHandler] = addSpy.mock.calls.find(([event]) => event === 'resize');
      resizeHandler();

      expect(el.scrollLeft).toBe(500);
    });

    it('does not scroll on resize when user has scrolled left', () => {
      const el = document.createElement('nav');
      el.setAttribute('data-overflow', 'scroll');

      Object.defineProperty(el, 'scrollWidth', { value: 500, configurable: true });
      Object.defineProperty(el, 'clientWidth', { value: 300, configurable: true });

      const addWindowSpy = vi.spyOn(window, 'addEventListener');
      const addElSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
      mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);

      // Simulate user scrolling left
      el.scrollLeft = 50;
      const [, scrollHandler] = addElSpy.mock.calls.find(([event]) => event === 'scroll');
      scrollHandler();

      const [, resizeHandler] = addWindowSpy.mock.calls.find(([event]) => event === 'resize');
      resizeHandler();

      expect(el.scrollLeft).toBe(50);
    });

    it('scrolls to end on resize after user scrolls back to end', () => {
      const el = document.createElement('nav');
      el.setAttribute('data-overflow', 'scroll');

      Object.defineProperty(el, 'scrollWidth', { value: 500, configurable: true });
      Object.defineProperty(el, 'clientWidth', { value: 300, configurable: true });

      const addWindowSpy = vi.spyOn(window, 'addEventListener');
      const addElSpy = vi.spyOn(HTMLElement.prototype, 'addEventListener');
      mountDirective(breadcrumbPlugin, 'h-breadcrumb', el);

      const [, scrollHandler] = addElSpy.mock.calls.find(([event]) => event === 'scroll');
      const [, resizeHandler] = addWindowSpy.mock.calls.find(([event]) => event === 'resize');

      // User scrolls left
      el.scrollLeft = 50;
      scrollHandler();

      // User scrolls back to end
      el.scrollLeft = 200;
      scrollHandler();

      // Resize should now scroll to end again
      resizeHandler();
      expect(el.scrollLeft).toBe(500);
    });
  });
});

describe('h-breadcrumb-list', () => {
  it('applies base classes', () => {
    const el = document.createElement('ol');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-list', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('ol');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-list', el);
    expect(el.getAttribute('data-slot')).toBe('breadcrumb-list');
  });

  it('applies flex-wrap by default', () => {
    const el = document.createElement('ol');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-list', el);
    expect(el.classList.contains('flex-wrap')).toBe(true);
    expect(el.classList.contains('flex-nowrap')).toBe(false);
  });

  it('applies flex-nowrap when parent breadcrumb has data-overflow nowrap', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('data-slot', 'breadcrumb');
    nav.setAttribute('data-overflow', 'nowrap');
    const el = document.createElement('ol');
    nav.appendChild(el);
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-list', el);
    expect(el.classList.contains('flex-nowrap')).toBe(true);
    expect(el.classList.contains('flex-wrap')).toBe(false);
  });

  it('applies flex-nowrap when parent breadcrumb has data-overflow scroll', () => {
    const nav = document.createElement('nav');
    nav.setAttribute('data-slot', 'breadcrumb');
    nav.setAttribute('data-overflow', 'scroll');
    const el = document.createElement('ol');
    nav.appendChild(el);
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-list', el);
    expect(el.classList.contains('flex-nowrap')).toBe(true);
    expect(el.classList.contains('flex-wrap')).toBe(false);
  });
});

describe('h-breadcrumb-item', () => {
  it('applies base classes', () => {
    const el = document.createElement('li');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-item', el);
    expect(el.classList.contains('group')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('li');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-item', el);
    expect(el.getAttribute('data-slot')).toBe('breadcrumb-item');
  });

  it('prepends a separator svg with aria-hidden and role presentation', () => {
    const el = document.createElement('li');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-item', el);
    const separator = el.firstChild;
    expect(separator).toBeTruthy();
    expect(separator.tagName.toLowerCase()).toBe('svg');
    expect(separator.getAttribute('aria-hidden')).toBe('true');
    expect(separator.getAttribute('role')).toBe('presentation');
  });

  it('separator has group-first-of-type:hidden class', () => {
    const el = document.createElement('li');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-item', el);
    expect(el.firstChild.classList.contains('group-first-of-type:hidden')).toBe(true);
  });

  it('prepends separator before existing children', () => {
    const el = document.createElement('li');
    const link = document.createElement('a');
    el.appendChild(link);
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-item', el);
    expect(el.children[0].tagName.toLowerCase()).toBe('svg');
    expect(el.children[1].tagName).toBe('A');
  });

  it('prepends separator when element has no children', () => {
    const el = document.createElement('li');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-item', el);
    expect(el.children.length).toBe(1);
    expect(el.children[0].tagName.toLowerCase()).toBe('svg');
  });
});

describe('h-breadcrumb-link', () => {
  it('applies base classes', () => {
    const el = document.createElement('a');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-link', el);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
    expect(el.classList.contains('text-primary')).toBe(true);
    expect(el.classList.contains('transition-colors')).toBe(true);
    expect(el.classList.contains('underline-offset-4')).toBe(true);
    expect(el.classList.contains('hover:underline')).toBe(true);
    expect(el.classList.contains('hover:text-primary-hover')).toBe(true);
    expect(el.classList.contains('active:text-primary-active')).toBe(true);
    expect(el.classList.contains('[&>svg]:size-4')).toBe(true);
    expect(el.classList.contains('[&>svg]:text-current')).toBe(true);
  });

  it('sets data-slot attribute', () => {
    const el = document.createElement('a');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-link', el);
    expect(el.getAttribute('data-slot')).toBe('breadcrumb-link');
  });
});

describe('h-breadcrumb-page', () => {
  it('applies base classes', () => {
    const el = document.createElement('span');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-page', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(true);
    expect(el.classList.contains('font-normal')).toBe(true);
    expect(el.classList.contains('[&>svg]:size-4')).toBe(true);
    expect(el.classList.contains('[&>svg]:text-current')).toBe(true);
  });

  it('sets accessibility attributes and data-slot', () => {
    const el = document.createElement('span');
    mountDirective(breadcrumbPlugin, 'h-breadcrumb-page', el);
    expect(el.getAttribute('role')).toBe('link');
    expect(el.getAttribute('aria-current')).toBe('page');
    expect(el.getAttribute('aria-disabled')).toBe('true');
    expect(el.getAttribute('data-slot')).toBe('breadcrumb-page');
  });
});
