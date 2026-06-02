import { beforeEach, describe, expect, it } from 'vitest';
import { classListStartsWith } from '../../src/common/class-list.js';

describe('classListStartsWith', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    el.className = '';
  });

  it('returns true when a class starts with the given term', () => {
    el.classList.add('btn-primary');
    expect(classListStartsWith(el.classList, 'btn')).toBe(true);
  });

  it('returns true when the class exactly equals the term', () => {
    el.classList.add('btn');
    expect(classListStartsWith(el.classList, 'btn')).toBe(true);
  });

  it('returns false when no class starts with the term', () => {
    el.classList.add('icon-check');
    el.classList.add('size-4');
    expect(classListStartsWith(el.classList, 'btn')).toBe(false);
  });

  it('returns false when classList is empty', () => {
    expect(classListStartsWith(el.classList, 'btn')).toBe(false);
  });

  it('returns true when one of multiple classes starts with the term', () => {
    el.classList.add('flex');
    el.classList.add('items-center');
    el.classList.add('text-sm');
    expect(classListStartsWith(el.classList, 'text')).toBe(true);
  });

  it('returns false when a class contains the term but does not start with it', () => {
    el.classList.add('my-btn-extra');
    expect(classListStartsWith(el.classList, 'btn')).toBe(false);
  });

  it('returns true for the first matching class among many', () => {
    el.classList.add('prefix-one');
    el.classList.add('other-class');
    expect(classListStartsWith(el.classList, 'prefix')).toBe(true);
  });

  it('handles term matching full class name at boundary', () => {
    el.classList.add('h-9');
    el.classList.add('h-6');
    expect(classListStartsWith(el.classList, 'h-')).toBe(true);
  });
});
