import { beforeEach, describe, expect, it } from 'vitest';
import buttonPlugin, { buttonVariants, getButtonSize, setButtonClasses } from '../../src/components/button.js';
import { mountDirective } from '../test-utils.js';

describe('buttonVariants', () => {
  it('is an object', () => {
    expect(typeof buttonVariants).toBe('object');
    expect(buttonVariants).not.toBeNull();
  });

  it('has expected variant keys', () => {
    const expectedKeys = ['default', 'primary', 'positive', 'negative', 'outline', 'transparent', 'link'];
    for (const key of expectedKeys) {
      expect(buttonVariants).toHaveProperty(key);
    }
  });

  it('each variant contains arrays of class strings', () => {
    for (const [_, value] of Object.entries(buttonVariants)) {
      expect(Array.isArray(value)).toBe(true);
      for (const cls of value) {
        expect(typeof cls).toBe('string');
      }
    }
  });

  it('default variant includes bg-secondary', () => {
    expect(buttonVariants.default).toContain('bg-secondary');
    expect(buttonVariants.default).toContain('text-secondary-foreground');
  });

  it('primary variant includes bg-primary', () => {
    expect(buttonVariants.primary).toContain('bg-primary');
    expect(buttonVariants.primary).toContain('text-primary-foreground');
  });

  it('positive variant includes bg-positive', () => {
    expect(buttonVariants.positive).toContain('bg-positive');
  });

  it('negative variant includes bg-negative', () => {
    expect(buttonVariants.negative).toContain('bg-negative');
  });

  it('link variant includes text-primary and underline-offset-4', () => {
    expect(buttonVariants.link).toContain('text-primary');
    expect(buttonVariants.link).toContain('underline-offset-4');
  });
});

describe('setButtonClasses', () => {
  it('adds cursor-pointer', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
  });

  it('adds inline-flex', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('inline-flex')).toBe(true);
  });

  it('adds whitespace-nowrap', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('whitespace-nowrap')).toBe(true);
  });

  it('adds font-medium', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('adds disabled:opacity-disabled', () => {
    const el = document.createElement('button');
    setButtonClasses(el);
    expect(el.classList.contains('disabled:opacity-disabled')).toBe(true);
  });
});

describe('getButtonSize', () => {
  it('returns correct classes for sm (non-addon)', () => {
    const classes = getButtonSize('sm', false);
    expect(Array.isArray(classes)).toBe(true);
    expect(classes).toContain('h-6.5');
    expect(classes).toContain('px-2.5');
  });

  it('returns correct classes for sm addon', () => {
    const classes = getButtonSize('sm', true);
    expect(classes).toContain('h-6');
    expect(classes).toContain('px-2');
  });

  it('returns correct classes for md (non-addon)', () => {
    const classes = getButtonSize('md', false);
    expect(classes).toContain('h-8');
    expect(classes).toContain('px-3');
  });

  it('returns correct classes for md addon', () => {
    const classes = getButtonSize('md', true);
    expect(classes).toContain('h-8');
    expect(classes).toContain('px-2.5');
  });

  it('returns default size classes for unknown size', () => {
    const classes = getButtonSize('default');
    expect(classes).toContain('h-9');
    expect(classes).toContain('px-4');
    expect(classes).toContain('py-2');
  });

  it('returns default when no size provided', () => {
    const classes = getButtonSize();
    expect(classes).toContain('h-9');
  });

  it('returns size icon classes', () => {
    const classes = getButtonSize('icon');
    expect(classes).toContain('size-9');
  });
});

describe('h-button directive', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('button');
    document.body.appendChild(el);
  });

  it('registers h-button and related directives', () => {
    const { alpine } = mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(alpine._directives['h-button']).toBeDefined();
    expect(alpine._directives['h-button-group']).toBeDefined();
    expect(alpine._directives['h-button-group-separator']).toBeDefined();
  });

  it('sets data-slot="button"', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.getAttribute('data-slot')).toBe('button');
  });

  it('does not override existing data-slot', () => {
    el.setAttribute('data-slot', 'date-picker-trigger');
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.getAttribute('data-slot')).toBe('date-picker-trigger');
  });

  it('applies base button classes', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('applies default variant classes', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('bg-secondary')).toBe(true);
  });

  it('applies primary variant when data-variant="primary"', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
  });

  it('applies default size classes', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('h-9')).toBe(true);
  });

  it('applies sm size when data-size="sm"', () => {
    el.setAttribute('data-size', 'sm');
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(el.classList.contains('h-6.5')).toBe(true);
    expect(el.classList.contains('h-9')).toBe(false);
  });

  it('applies addon styles with addon modifier', () => {
    mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button', modifiers: ['addon'] });
    expect(el.classList.contains('shadow-none')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(buttonPlugin, 'h-button', el, { original: 'h-button' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-button-group directive', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds flex and items-stretch', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-stretch')).toBe(true);
  });

  it('sets role="group"', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets data-slot="button-group"', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.getAttribute('data-slot')).toBe('button-group');
  });

  it('applies horizontal variant classes by default', () => {
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('[&>*:not(:first-child)]:rounded-l-none')).toBe(true);
  });

  it('applies vertical variant classes when data-orientation="vertical"', () => {
    el.setAttribute('data-orientation', 'vertical');
    mountDirective(buttonPlugin, 'h-button-group', el);
    expect(el.classList.contains('flex-col')).toBe(true);
  });
});

describe('h-button-group-separator directive', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(buttonPlugin, 'h-button-group-separator', el);
    expect(el.classList.contains('bg-foreground/20')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.classList.contains('w-px')).toBe(true);
  });

  it('sets role="none"', () => {
    mountDirective(buttonPlugin, 'h-button-group-separator', el);
    expect(el.getAttribute('role')).toBe('none');
  });

  it('sets data-slot="button-group-separator"', () => {
    mountDirective(buttonPlugin, 'h-button-group-separator', el);
    expect(el.getAttribute('data-slot')).toBe('button-group-separator');
  });
});
