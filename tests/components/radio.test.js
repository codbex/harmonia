import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import radioPlugin from '../../src/components/radio.js';
import { mountDirective } from '../test-utils.js';

describe('h-radio', () => {
  it('applies base classes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('aspect-square')).toBe(true);
    expect(el.classList.contains('bg-input-inner')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-full')).toBe(true);
    expect(el.classList.contains('size-5')).toBe(true);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('sets tabindex=-1 and data-slot attributes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.getAttribute('tabindex')).toBe('-1');
    expect(el.getAttribute('data-slot')).toBe('radio');
  });

  it('applies input-related classes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('[&>input]:focus-visible:ring-[calc(var(--spacing)*0.75)]')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:before:visible')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:opacity-disabled')).toBe(true);
  });

  it('applies before pseudo-element classes', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('before:invisible')).toBe(true);
    // The indicator dot itself is styled in radio.css.
    const radioCss = readFileSync('src/styles/radio.css', 'utf8');
    expect(radioCss).toContain('[data-slot="radio"]::before');
    expect(radioCss).toMatch(/::before\s*{[^}]*bg-primary/);
    expect(radioCss).toMatch(/::before\s*{[^}]*rounded-full/);
  });

  it('defers native-constraint styling to :user-invalid with an immediate opt-in', () => {
    const el = document.createElement('span');
    mountDirective(radioPlugin, 'h-radio', el);
    expect(el.classList.contains('has-[input:user-invalid]:border-negative')).toBe(true);
    expect(el.classList.contains('[[data-validate=immediate]_&:has(input:invalid)]:border-negative')).toBe(true);
    expect(el.classList.contains('has-[input:invalid]:border-negative')).toBe(false);
    // The dot is colored in radio.css and must follow the same gate.
    const radioCss = readFileSync('src/styles/radio.css', 'utf8');
    expect(radioCss).toContain('[data-validate="immediate"] [data-slot="radio"]:has(input:invalid)::before');
    expect(radioCss).not.toMatch(/^\[data-slot="radio"\]:has\(input:invalid\)/m);
  });
});
