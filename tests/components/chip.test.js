import { beforeEach, describe, expect, it, vi } from 'vitest';
import chipPlugin from '../../src/components/chip.js';
import { mountDirective } from '../test-utils.js';

describe('h-chip', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('button');
    document.body.appendChild(el);
  });

  it('registers h-chip and h-chip-close directives', () => {
    const { alpine } = mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(alpine._directives['h-chip']).toBeDefined();
    expect(alpine._directives['h-chip-close']).toBeDefined();
  });

  it('throws when element is not a button', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);
    expect(() => mountDirective(chipPlugin, 'h-chip', div, { original: 'h-chip' })).toThrow();
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
    expect(el.classList.contains('overflow-hidden')).toBe(true);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
  });

  it('sets data-slot="chip"', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.getAttribute('data-slot')).toBe('chip');
  });

  it('sets type="button" when type is not already set', () => {
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.getAttribute('type')).toBe('button');
  });

  it('does not override an existing type attribute', () => {
    el.setAttribute('type', 'submit');
    mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(el.getAttribute('type')).toBe('submit');
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

  it('calls cleanup', () => {
    const { ctx } = mountDirective(chipPlugin, 'h-chip', el, { original: 'h-chip' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-chip-close', () => {
  let chipEl, el;

  beforeEach(() => {
    chipEl = document.createElement('button');
    chipEl._h_chip = { variant: 'default' };
    el = document.createElement('span');
    el.setAttribute('aria-label', 'Remove');
    chipEl.appendChild(el);
    document.body.appendChild(chipEl);
  });

  it('throws when element is a button', () => {
    const btn = document.createElement('button');
    btn.setAttribute('aria-label', 'Remove');
    chipEl.appendChild(btn);
    expect(() => mountDirective(chipPlugin, 'h-chip-close', btn, { original: 'h-chip-close' })).toThrow();
  });

  it('adds base classes', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('rounded-r-full')).toBe(true);
    expect(el.classList.contains('h-full')).toBe(true);
  });

  it('sets data-slot="chip-close"', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.getAttribute('data-slot')).toBe('chip-close');
  });

  it('sets tabindex="0" and role="button"', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.getAttribute('tabindex')).toBe('0');
    expect(el.getAttribute('role')).toBe('button');
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
  });

  it('applies primary variant classes when parent chip variant is primary', () => {
    chipEl._h_chip.variant = 'primary';
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('hover:bg-primary/10')).toBe(true);
    expect(el.classList.contains('active:bg-primary/15')).toBe(true);
  });

  it('does not apply classes from other variants', () => {
    chipEl._h_chip.variant = 'negative';
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(el.classList.contains('hover:bg-negative/10')).toBe(true);
    expect(el.classList.contains('hover:bg-primary/10')).toBe(false);
    expect(el.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('stops click propagation to the chip when chip is not expanded', () => {
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    const chipHandler = vi.fn();
    chipEl.addEventListener('click', chipHandler);
    el.dispatchEvent(new Event('click', { bubbles: true }));
    expect(chipHandler).not.toHaveBeenCalled();
  });

  it('allows click propagation when the chip has aria-expanded="true"', () => {
    chipEl.setAttribute('aria-expanded', 'true');
    mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    const chipHandler = vi.fn();
    chipEl.addEventListener('click', chipHandler);
    el.dispatchEvent(new Event('click', { bubbles: true }));
    expect(chipHandler).toHaveBeenCalled();
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(chipPlugin, 'h-chip-close', el, { original: 'h-chip-close' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
