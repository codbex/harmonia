import { describe, expect, it } from 'vitest';
import textareaPlugin from '../../src/components/textarea.js';
import { mountDirective } from '../test-utils.js';

describe('h-textarea', () => {
  it('applies base classes', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: [] });
    expect(el.classList.contains('border-input')).toBe(true);
    expect(el.classList.contains('bg-input-inner')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('w-full')).toBe(true);
    expect(el.classList.contains('rounded-control')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('px-3')).toBe(true);
    expect(el.classList.contains('py-2')).toBe(true);
    expect(el.classList.contains('text-base')).toBe(true);
    expect(el.classList.contains('shadow-input')).toBe(true);
  });

  it('sets data-slot=textarea for default', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: [] });
    expect(el.getAttribute('data-slot')).toBe('textarea');
  });

  it('applies group modifier classes', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: ['group'] });
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('resize-none')).toBe(true);
    expect(el.classList.contains('rounded-none')).toBe(true);
    expect(el.classList.contains('border-0')).toBe(true);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('input-group-control');
  });

  it('removes rounded-control for group modifier', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: ['group'] });
    expect(el.classList.contains('rounded-control')).toBe(false);
  });

  it('applies placeholder and focus classes', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: [] });
    expect(el.classList.contains('placeholder:text-muted-foreground')).toBe(true);
    expect(el.classList.contains('focus-ring')).toBe(true);
    expect(el.classList.contains('outline-none')).toBe(true);
  });

  it('applies disabled classes', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: [] });
    expect(el.classList.contains('disabled:cursor-not-allowed')).toBe(true);
    expect(el.classList.contains('disabled:opacity-disabled')).toBe(true);
  });

  it('applies the readonly background class', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: [] });
    expect(el.classList.contains('[&[readonly]]:bg-muted')).toBe(true);
  });

  it('defers native-constraint styling to :user-invalid with an immediate opt-in', () => {
    const el = document.createElement('textarea');
    mountDirective(textareaPlugin, 'h-textarea', el, { modifiers: [] });
    expect(el.classList.contains('user-invalid:border-negative!')).toBe(true);
    expect(el.classList.contains('[[data-validate=immediate]_&:invalid]:border-negative!')).toBe(true);
    expect(el.classList.contains('invalid:border-negative!')).toBe(false);
    expect(el.classList.contains('aria-invalid:border-negative')).toBe(true);
  });
});
