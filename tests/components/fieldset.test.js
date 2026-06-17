import { beforeEach, describe, expect, it } from 'vitest';
import fieldsetPlugin from '../../src/components/fieldset.js';
import { mountDirective } from '../test-utils.js';

describe('h-fieldset', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('fieldset');
  });

  it('registers all fieldset-related directives', () => {
    const { alpine } = mountDirective(fieldsetPlugin, 'h-fieldset', el);
    expect(alpine._directives['h-fieldset']).toBeDefined();
    expect(alpine._directives['h-legend']).toBeDefined();
    expect(alpine._directives['h-field-group']).toBeDefined();
    expect(alpine._directives['h-field']).toBeDefined();
    expect(alpine._directives['h-field-content']).toBeDefined();
    expect(alpine._directives['h-field-title']).toBeDefined();
    expect(alpine._directives['h-field-description']).toBeDefined();
    expect(alpine._directives['h-field-error']).toBeDefined();
  });

  it('adds vbox and gap-6 classes', () => {
    mountDirective(fieldsetPlugin, 'h-fieldset', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('gap-6')).toBe(true);
  });

  it('sets data-slot="fieldset"', () => {
    mountDirective(fieldsetPlugin, 'h-fieldset', el);
    expect(el.getAttribute('data-slot')).toBe('fieldset');
  });
});

describe('h-legend', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('legend');
  });

  it('adds mb-3 and font-medium', () => {
    mountDirective(fieldsetPlugin, 'h-legend', el);
    expect(el.classList.contains('mb-3')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('adds text-base by default', () => {
    mountDirective(fieldsetPlugin, 'h-legend', el);
    expect(el.classList.contains('text-base')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(false);
  });

  it('adds text-sm with label modifier', () => {
    mountDirective(fieldsetPlugin, 'h-legend', el, { modifiers: ['label'] });
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('text-base')).toBe(false);
  });

  it('sets data-slot="legend"', () => {
    mountDirective(fieldsetPlugin, 'h-legend', el);
    expect(el.getAttribute('data-slot')).toBe('legend');
  });
});

describe('h-field-group', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(fieldsetPlugin, 'h-field-group', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('gap-7')).toBe(true);
  });

  it('sets data-slot="field-group"', () => {
    mountDirective(fieldsetPlugin, 'h-field-group', el);
    expect(el.getAttribute('data-slot')).toBe('field-group');
  });
});

describe('h-field', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds group/field and w-full', () => {
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.classList.contains('group/field')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('gap-3')).toBe(true);
  });

  it('sets role="group"', () => {
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.getAttribute('role')).toBe('group');
  });

  it('sets data-slot="field"', () => {
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.getAttribute('data-slot')).toBe('field');
  });

  it('applies vertical layout by default', () => {
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.classList.contains('vbox')).toBe(true);
  });

  it('applies horizontal layout when data-orientation="horizontal"', () => {
    el.setAttribute('data-orientation', 'horizontal');
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.classList.contains('hbox')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
  });

  it('switches to a grid when a horizontal field has an error or description child', () => {
    el.setAttribute('data-orientation', 'horizontal');
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.classList.contains('has-[>[data-slot=field-error]]:grid')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=field-description]]:grid')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=field-error]]:grid-cols-[auto_1fr]')).toBe(true);
    expect(el.classList.contains('[&>[data-slot=field-error]]:col-start-2')).toBe(true);
    expect(el.classList.contains('[&>[data-slot=field-description]]:col-start-2')).toBe(true);
  });

  it('applies responsive layout when data-orientation="responsive"', () => {
    el.setAttribute('data-orientation', 'responsive');
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('@md/field-group:flex-row')).toBe(true);
  });

  it('switches to a grid at @md when a responsive field has an error or description child', () => {
    el.setAttribute('data-orientation', 'responsive');
    mountDirective(fieldsetPlugin, 'h-field', el);
    expect(el.classList.contains('@md/field-group:has-[>[data-slot=field-error]]:grid')).toBe(true);
    expect(el.classList.contains('@md/field-group:has-[>[data-slot=field-description]]:grid')).toBe(true);
    expect(el.classList.contains('@md/field-group:[&>[data-slot=field-error]]:col-start-2')).toBe(true);
    expect(el.classList.contains('@md/field-group:[&>[data-slot=field-description]]:col-start-2')).toBe(true);
  });
});

describe('h-field-content', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds base classes', () => {
    mountDirective(fieldsetPlugin, 'h-field-content', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('gap-1.5')).toBe(true);
  });

  it('sets data-slot="field-content"', () => {
    mountDirective(fieldsetPlugin, 'h-field-content', el);
    expect(el.getAttribute('data-slot')).toBe('field-content');
  });
});

describe('h-field-title', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('adds flex and text-sm', () => {
    mountDirective(fieldsetPlugin, 'h-field-title', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('sets data-slot="field-title"', () => {
    mountDirective(fieldsetPlugin, 'h-field-title', el);
    expect(el.getAttribute('data-slot')).toBe('field-title');
  });
});

describe('h-field-description', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('p');
  });

  it('adds base classes', () => {
    mountDirective(fieldsetPlugin, 'h-field-description', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-normal')).toBe(true);
  });

  it('sets data-slot="field-description"', () => {
    mountDirective(fieldsetPlugin, 'h-field-description', el);
    expect(el.getAttribute('data-slot')).toBe('field-description');
  });

  it('adds hide-on-error classes when data-hide-on-error="true"', () => {
    el.setAttribute('data-hide-on-error', 'true');
    mountDirective(fieldsetPlugin, 'h-field-description', el);
    expect(el.classList.contains('group-has-[input:invalid]/field:hidden')).toBe(true);
  });
});

describe('h-field-error', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('p');
  });

  it('adds hidden and text-negative classes', () => {
    mountDirective(fieldsetPlugin, 'h-field-error', el);
    expect(el.classList.contains('hidden')).toBe(true);
    expect(el.classList.contains('text-negative')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
  });

  it('sets data-slot="field-error"', () => {
    mountDirective(fieldsetPlugin, 'h-field-error', el);
    expect(el.getAttribute('data-slot')).toBe('field-error');
  });

  it('adds block classes for invalid states', () => {
    mountDirective(fieldsetPlugin, 'h-field-error', el);
    expect(el.classList.contains('group-has-[input:invalid]/field:block')).toBe(true);
    expect(el.classList.contains('group-has-[[aria-invalid=true]]/field:block')).toBe(true);
  });
});
