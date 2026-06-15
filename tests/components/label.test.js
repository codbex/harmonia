import { beforeEach, describe, expect, it } from 'vitest';
import labelPlugin from '../../src/components/label.js';
import { mountDirective } from '../test-utils.js';

describe('h-label', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('label');
    document.body.appendChild(el);
  });

  it('registers h-label directive', () => {
    const { alpine } = mountDirective(labelPlugin, 'h-label', el);
    expect(alpine._directives['h-label']).toBeDefined();
  });

  it('adds base classes', () => {
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.classList.contains('select-none')).toBe(true);
  });

  it('adds disabled state classes', () => {
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.classList.contains('group-data-[disabled=true]:pointer-events-none')).toBe(true);
    expect(el.classList.contains('group-data-[disabled=true]:opacity-50')).toBe(true);
    expect(el.classList.contains('peer-disabled:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('peer-disabled:opacity-50')).toBe(true);
  });

  it('sets data-slot="label" without modifier', () => {
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.getAttribute('data-slot')).toBe('label');
  });

  it('sets data-slot="field-label" inside a field element', () => {
    const parent = document.createElement('div');
    parent.setAttribute('data-slot', 'field');
    parent.appendChild(el);
    document.body.appendChild(parent);
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.getAttribute('data-slot')).toBe('field-label');
  });

  it('adds field-specific classes inside a field element', () => {
    const parent = document.createElement('div');
    parent.setAttribute('data-slot', 'field');
    parent.appendChild(el);
    document.body.appendChild(parent);
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.classList.contains('group/field-label')).toBe(true);
    expect(el.classList.contains('peer/field-label')).toBe(true);
    expect(el.classList.contains('w-fit')).toBe(true);
    expect(el.classList.contains('leading-snug')).toBe(true);
  });

  it('adds nested field wrapping classes inside a field element', () => {
    const parent = document.createElement('div');
    parent.setAttribute('data-slot', 'field');
    parent.appendChild(el);
    document.body.appendChild(parent);
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.classList.contains('has-[>[data-slot=field]]:w-full')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=field]]:flex-col')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=field]]:rounded-md')).toBe(true);
    expect(el.classList.contains('has-[>[data-slot=field]]:border')).toBe(true);
  });

  it('does not set data-slot="field-label" without field modifier', () => {
    mountDirective(labelPlugin, 'h-label', el);
    expect(el.getAttribute('data-slot')).not.toBe('field-label');
  });
});
