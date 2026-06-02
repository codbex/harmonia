import { beforeEach, describe, expect, it } from 'vitest';
import badgePlugin from '../../src/components/badge.js';
import { mountDirective } from '../test-utils.js';

describe('h-badge', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('span');
    document.body.appendChild(el);
  });

  it('registers h-badge and h-badge-indicator directives', () => {
    const { alpine } = mountDirective(badgePlugin, 'h-badge', el);
    expect(alpine._directives['h-badge']).toBeDefined();
    expect(alpine._directives['h-badge-indicator']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('px-2')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('sets data-slot="badge"', () => {
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.getAttribute('data-slot')).toBe('badge');
  });

  it('applies default variant classes', () => {
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('text-secondary-foreground')).toBe(true);
  });

  it('applies primary variant classes', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('text-primary-foreground')).toBe(true);
  });

  it('applies positive variant classes', () => {
    el.setAttribute('data-variant', 'positive');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-positive')).toBe(true);
    expect(el.classList.contains('text-positive-foreground')).toBe(true);
  });

  it('applies negative variant classes', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-negative')).toBe(true);
    expect(el.classList.contains('text-negative-foreground')).toBe(true);
  });

  it('applies warning variant classes', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-warning')).toBe(true);
    expect(el.classList.contains('text-warning-foreground')).toBe(true);
  });

  it('applies information variant classes', () => {
    el.setAttribute('data-variant', 'information');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-information')).toBe(true);
    expect(el.classList.contains('text-information-foreground')).toBe(true);
  });

  it('applies outline variant classes', () => {
    el.setAttribute('data-variant', 'outline');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(true);
  });

  it('does not apply classes from other variants', () => {
    el.setAttribute('data-variant', 'primary');
    mountDirective(badgePlugin, 'h-badge', el);
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('bg-negative')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(badgePlugin, 'h-badge', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-badge-indicator', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('span');
    document.body.appendChild(el);
  });

  it('adds base classes', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('absolute')).toBe(true);
    expect(el.classList.contains('inline-flex')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('font-bold')).toBe(true);
  });

  it('sets data-slot="badge-indicator"', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.getAttribute('data-slot')).toBe('badge-indicator');
  });

  it('applies primary variant by default', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-primary')).toBe(true);
    expect(el.classList.contains('text-primary-foreground')).toBe(true);
  });

  it('applies negative variant', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-negative')).toBe(true);
    expect(el.classList.contains('text-negative-foreground')).toBe(true);
    expect(el.classList.contains('bg-primary')).toBe(false);
  });

  it('applies warning variant', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-warning')).toBe(true);
  });

  it('applies information variant', () => {
    el.setAttribute('data-variant', 'information');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('bg-information')).toBe(true);
  });

  it('adds ping animation variant classes', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('data-[ping=true]:before:animate-ping')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:absolute')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:inline-flex')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:w-full')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:h-full')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:rounded-full')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:opacity-75')).toBe(true);
  });

  it('includes variant-specific ping background class for default (primary) variant', () => {
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('data-[ping=true]:before:bg-primary')).toBe(true);
  });

  it('includes variant-specific ping background class when data-variant is set', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(el.classList.contains('data-[ping=true]:before:bg-negative')).toBe(true);
    expect(el.classList.contains('data-[ping=true]:before:bg-primary')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(badgePlugin, 'h-badge-indicator', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
