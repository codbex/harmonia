import { beforeEach, describe, expect, it } from 'vitest';
import alertPlugin from '../../src/components/alert.js';
import { mountDirective } from '../test-utils.js';

describe('h-alert', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers all alert directives', () => {
    const { alpine } = mountDirective(alertPlugin, 'h-alert', el);
    expect(alpine._directives['h-alert']).toBeDefined();
    expect(alpine._directives['h-alert-title']).toBeDefined();
    expect(alpine._directives['h-alert-description']).toBeDefined();
    expect(alpine._directives['h-alert-actions']).toBeDefined();
  });

  it('adds base classes including relative and w-full', () => {
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
  });

  it('sets role="alert"', () => {
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('sets data-slot="alert"', () => {
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.getAttribute('data-slot')).toBe('alert');
  });

  it('applies default variant class text-foreground when no data-variant', () => {
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('text-foreground')).toBe(true);
  });

  it('applies positive variant class', () => {
    el.setAttribute('data-variant', 'positive');
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('text-positive')).toBe(true);
    expect(el.classList.contains('text-foreground')).toBe(false);
  });

  it('applies negative variant class', () => {
    el.setAttribute('data-variant', 'negative');
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('text-negative')).toBe(true);
  });

  it('applies warning variant class', () => {
    el.setAttribute('data-variant', 'warning');
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('text-warning')).toBe(true);
  });

  it('applies information variant class', () => {
    el.setAttribute('data-variant', 'information');
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('text-information')).toBe(true);
  });

  it('adds shadow-lg with floating modifier', () => {
    mountDirective(alertPlugin, 'h-alert', el, { modifiers: ['floating'] });
    expect(el.classList.contains('shadow-lg')).toBe(true);
  });

  it('does not add shadow-lg without floating modifier', () => {
    mountDirective(alertPlugin, 'h-alert', el);
    expect(el.classList.contains('shadow-lg')).toBe(false);
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(alertPlugin, 'h-alert', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});

describe('h-alert-title', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(alertPlugin, 'h-alert-title', el);
    expect(el.classList.contains('col-start-2')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('sets data-slot="alert-title"', () => {
    mountDirective(alertPlugin, 'h-alert-title', el);
    expect(el.getAttribute('data-slot')).toBe('alert-title');
  });
});

describe('h-alert-description', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(alertPlugin, 'h-alert-description', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('col-start-2')).toBe(true);
  });

  it('sets data-slot="alert-description"', () => {
    mountDirective(alertPlugin, 'h-alert-description', el);
    expect(el.getAttribute('data-slot')).toBe('alert-description');
  });
});

describe('h-alert-actions', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(alertPlugin, 'h-alert-actions', el);
    expect(el.classList.contains('col-start-3')).toBe(true);
    expect(el.classList.contains('row-start-1')).toBe(true);
  });

  it('sets data-slot="alert-actions"', () => {
    mountDirective(alertPlugin, 'h-alert-actions', el);
    expect(el.getAttribute('data-slot')).toBe('alert-actions');
  });
});
