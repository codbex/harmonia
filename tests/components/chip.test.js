import { beforeEach, describe, expect, it, vi } from 'vitest';
import chipPlugin from '../../src/components/chip.js';
import { mountDirective } from '../test-utils.js';

// MutationObserver callbacks are async microtasks, so state driven by one is only
// visible after a flush.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('h-chip', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers h-chip, h-chip-button and h-chip-close directives', () => {
    const { alpine } = mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(alpine._directives['h-chip']).toBeDefined();
    expect(alpine._directives['h-chip-button']).toBeDefined();
    expect(alpine._directives['h-chip-close']).toBeDefined();
  });

  it('throws when the element is interactive', () => {
    for (const tag of ['button', 'a']) {
      const interactive = document.createElement(tag);
      document.body.appendChild(interactive);
      expect(() => mountDirective(chipPlugin, 'h-chip', interactive, { original: 'x-h-chip' }), tag).toThrow(/h-chip-button/);
    }
  });

  it('accepts any non-interactive element', () => {
    const item = document.createElement('li');
    document.body.appendChild(item);
    mountDirective(chipPlugin, 'h-chip', item, { original: 'h-chip' });
    expect(item.getAttribute('data-slot')).toBe('chip');
  });

  it('initializes _h_chip reactive state with default variant', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el._h_chip).toBeDefined();
    expect(el._h_chip.variant).toBe('default');
  });

  it('adds base classes', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('h-7')).toBe(true);
  });

  it('makes room for a button child at the edges of the pill', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('has-[>[data-slot=chip-button]]:px-0')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=chip-close]]:pr-0')).toBe(true);
  });

  it('closes the gap between button children, keeping it for static content', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('gap-1.5')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=chip-button]]:gap-0')).toBe(true);
  });

  it('is not styled as a control', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    for (const className of ['cursor-pointer', 'overflow-hidden', 'disabled:pointer-events-none', 'disabled:opacity-disabled', 'focus-outline']) {
      expect(el.classList.contains(className), className).toBe(false);
    }
  });

  it('sets data-slot="chip"', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.getAttribute('data-slot')).toBe('chip');
  });

  it('writes no type attribute of its own', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.hasAttribute('type')).toBe(false);
  });

  it('applies default variant classes', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el._h_chip.variant).toBe('default');
  });

  it('applies primary variant classes', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-primary/10')).toBe(true);
    expect(el.classList.contains('border-primary/50')).toBe(true);
    expect(el.classList.contains('[&>svg]:text-primary')).toBe(true);
    expect(el._h_chip.variant).toBe('primary');
  });

  it('applies positive variant classes', () => {
    el.setAttribute('data-variant', 'positive');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-positive/10')).toBe(true);
    expect(el.classList.contains('border-positive/50')).toBe(true);
  });

  it('applies negative variant classes', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-negative/10')).toBe(true);
    expect(el.classList.contains('border-negative/50')).toBe(true);
  });

  it('applies warning variant classes', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-warning/10')).toBe(true);
    expect(el.classList.contains('border-warning/50')).toBe(true);
  });

  it('applies information variant classes', () => {
    el.setAttribute('data-variant', 'information');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-information/10')).toBe(true);
    expect(el.classList.contains('border-information/50')).toBe(true);
  });

  it('applies outline variant classes', () => {
    el.setAttribute('data-variant', 'outline');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-background')).toBe(true);
  });

  it('does not apply classes from other variants', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('bg-negative/10')).toBe(false);
    expect(el.classList.contains('bg-background')).toBe(false);
  });

  it('takes no state classes of its own', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(false);
    expect(el.classList.contains('inset-ring-ring/50')).toBe(false);
  });

  it('swaps its variant when data-variant changes at runtime', async () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    el.setAttribute('data-variant', 'warning');
    await flush();
    expect(el.classList.contains('bg-warning/10')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el._h_chip.variant).toBe('warning');
  });

  it('stops observing on cleanup', () => {
    const { ctx } = mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    const disconnect = vi.spyOn(MutationObserver.prototype, 'disconnect');
    ctx.cleanup.mock.calls[0][0]();
    expect(disconnect).toHaveBeenCalled();
    disconnect.mockRestore();
  });
});

describe('h-chip-button', () => {
  let chipEl, el;

  beforeEach(() => {
    chipEl = document.createElement('div');
    chipEl._h_chip = { variant: 'default' };
    el = document.createElement('button');
    chipEl.appendChild(el);
    document.body.appendChild(chipEl);
  });

  it('throws when the element is not a button', () => {
    const span = document.createElement('span');
    chipEl.appendChild(span);
    expect(() => mountDirective(chipPlugin, 'h-chip-button', span, { original: 'x-h-chip-button' })).toThrow(/button element/);
  });

  it('throws without a chip ancestor', () => {
    const orphan = document.createElement('button');
    document.body.appendChild(orphan);
    expect(() => mountDirective(chipPlugin, 'h-chip-button', orphan, { original: 'x-h-chip-button' })).toThrow(/h-chip/);
  });

  it('adds base classes', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('px-2.5')).toBe(true);
    expect(el.classList.contains('disabled:opacity-disabled')).toBe(true);
  });

  it('rounds only the ends of the pill it reaches', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('first:rounded-l-full')).toBe(true);
    expect(el.classList.contains('last:rounded-r-full')).toBe(true);
  });

  it('sets data-slot="chip-button"', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.getAttribute('data-slot')).toBe('chip-button');
  });

  it('sets type="button" when type is not already set', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.getAttribute('type')).toBe('button');
  });

  it('does not override an existing type attribute', () => {
    el.setAttribute('type', 'submit');
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.getAttribute('type')).toBe('submit');
  });

  it('writes no role or tabindex of its own', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('applies default state classes from the parent chip', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(true);
    expect(el.classList.contains('active:bg-secondary-active')).toBe(true);
    expect(el.classList.contains('inset-ring-ring/50')).toBe(true);
  });

  it('applies the icon tint and state classes of the parent chip variant', () => {
    chipEl._h_chip.variant = 'primary';
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('[&>svg]:text-primary')).toBe(true);
    expect(el.classList.contains('hover:bg-primary/10')).toBe(true);
    expect(el.classList.contains('aria-pressed:bg-primary/15')).toBe(true);
  });

  it('does not apply classes from other variants', () => {
    chipEl._h_chip.variant = 'negative';
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('hover:bg-negative/10')).toBe(true);
    expect(el.classList.contains('hover:bg-primary/10')).toBe(false);
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('takes none of the chip surface classes', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('border')).toBe(false);
  });

  it('does not draw the close separator', () => {
    mountDirective(chipPlugin, 'h-chip-button', el, { original: 'h-chip-button' });
    expect(el.classList.contains('hover:border-foreground/20')).toBe(false);
    expect(el.classList.contains('border-l')).toBe(false);
  });
});

describe('h-chip-close', () => {
  let chipEl, el;

  beforeEach(() => {
    chipEl = document.createElement('div');
    chipEl._h_chip = { variant: 'default' };
    el = document.createElement('button');
    el.setAttribute('aria-label', 'Remove');
    chipEl.appendChild(el);
    document.body.appendChild(chipEl);
  });

  it('throws when the element is not a button', () => {
    const span = document.createElement('span');
    span.setAttribute('aria-label', 'Remove');
    chipEl.appendChild(span);
    expect(() => mountDirective(chipPlugin, 'h-chip-close', span, { original: 'x-h-chip-close' })).toThrow(/button element/);
  });

  it('throws without a chip ancestor', () => {
    const orphan = document.createElement('button');
    orphan.setAttribute('aria-label', 'Remove');
    document.body.appendChild(orphan);
    expect(() => mountDirective(chipPlugin, 'h-chip-close', orphan, { original: 'x-h-chip-close' })).toThrow(/h-chip/);
  });

  it('adds base classes', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('rounded-r-full')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
    expect(el.classList.contains('disabled:opacity-disabled')).toBe(true);
  });

  it('sets data-slot="chip-close" and type="button"', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.getAttribute('data-slot')).toBe('chip-close');
    expect(el.getAttribute('type')).toBe('button');
  });

  it('writes no role or tabindex of its own', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.hasAttribute('role')).toBe(false);
    expect(el.hasAttribute('tabindex')).toBe(false);
  });

  it('appends a close svg icon', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.querySelector('svg')).toBeTruthy();
  });

  it('logs a console error when both aria-label and aria-labelledby are missing', () => {
    el.removeAttribute('aria-label');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does not log an error when aria-label is present', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does not log an error when aria-labelledby is present', () => {
    el.removeAttribute('aria-label');
    el.setAttribute('aria-labelledby', 'chip-label-id');
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('applies default variant classes from the parent chip', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(true);
    expect(el.classList.contains('active:bg-secondary-active')).toBe(true);
    expect(el.classList.contains('hover:border-foreground/20')).toBe(true);
  });

  it('applies primary variant classes when parent chip variant is primary', () => {
    chipEl._h_chip.variant = 'primary';
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('hover:bg-primary/10')).toBe(true);
    expect(el.classList.contains('active:bg-primary/15')).toBe(true);
    expect(el.classList.contains('hover:border-foreground/20')).toBe(false);
  });

  it('does not apply classes from other variants', () => {
    chipEl._h_chip.variant = 'negative';
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('hover:bg-negative/10')).toBe(true);
    expect(el.classList.contains('hover:bg-primary/10')).toBe(false);
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('takes no icon tint, since its own icon is drawn from the current colour', () => {
    chipEl._h_chip.variant = 'primary';
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('[&>svg]:text-primary')).toBe(false);
  });

  it('adds no listeners, since a sibling button needs no propagation stop', () => {
    const addEventListener = vi.spyOn(el, 'addEventListener');
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(addEventListener).not.toHaveBeenCalled();
  });
});
