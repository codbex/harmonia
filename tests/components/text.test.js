import { describe, expect, it } from 'vitest';
import textPlugin from '../../src/components/text.js';
import { mountDirective } from '../test-utils.js';

describe('h-text', () => {
  it('applies h1 classes for h1 modifier', () => {
    const el = document.createElement('h1');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['h1'] });
    expect(el.classList.contains('text-4xl')).toBe(true);
    expect(el.classList.contains('font-extrabold')).toBe(true);
    expect(el.classList.contains('tracking-tight')).toBe(true);
  });

  it('applies h2 classes for h2 modifier', () => {
    const el = document.createElement('h2');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['h2'] });
    expect(el.classList.contains('text-3xl')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('applies h3 classes for h3 modifier', () => {
    const el = document.createElement('h3');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['h3'] });
    expect(el.classList.contains('text-2xl')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('applies h4 classes for h4 modifier', () => {
    const el = document.createElement('h4');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['h4'] });
    expect(el.classList.contains('text-xl')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('applies h5 classes for h5 modifier', () => {
    const el = document.createElement('h5');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['h5'] });
    expect(el.classList.contains('text-base')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('applies h6 classes for h6 modifier', () => {
    const el = document.createElement('h6');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['h6'] });
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('applies blockquote classes for blockquote modifier', () => {
    const el = document.createElement('blockquote');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['blockquote'] });
    expect(el.classList.contains('mt-6')).toBe(true);
    expect(el.classList.contains('border-l-2')).toBe(true);
    expect(el.classList.contains('pl-6')).toBe(true);
    expect(el.classList.contains('italic')).toBe(true);
  });

  it('applies code-inline classes for code-inline modifier', () => {
    const el = document.createElement('code');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['code-inline'] });
    expect(el.classList.contains('bg-muted')).toBe(true);
    expect(el.classList.contains('font-mono')).toBe(true);
    expect(el.classList.contains('whitespace-pre')).toBe(true);
  });

  it('applies code classes for code modifier', () => {
    const el = document.createElement('pre');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['code'] });
    expect(el.classList.contains('bg-muted')).toBe(true);
    expect(el.classList.contains('font-mono')).toBe(true);
    expect(el.classList.contains('p-3')).toBe(true);
    expect(el.classList.contains('whitespace-pre')).toBe(true);
  });

  it('applies lead classes for lead modifier', () => {
    const el = document.createElement('p');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['lead'] });
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-xl')).toBe(true);
  });

  it('applies lg classes for lg modifier', () => {
    const el = document.createElement('p');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['lg'] });
    expect(el.classList.contains('text-lg')).toBe(true);
    expect(el.classList.contains('font-semibold')).toBe(true);
  });

  it('applies sm classes for sm modifier', () => {
    const el = document.createElement('p');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['sm'] });
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('leading-none')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('applies xs classes for xs modifier', () => {
    const el = document.createElement('p');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['xs'] });
    expect(el.classList.contains('text-xs')).toBe(true);
    expect(el.classList.contains('leading-none')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
  });

  it('applies muted classes for muted modifier', () => {
    const el = document.createElement('p');
    mountDirective(textPlugin, 'h-text', el, { modifiers: ['muted'] });
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
  });

  it('applies default leading-7 class when no modifier', () => {
    const el = document.createElement('p');
    mountDirective(textPlugin, 'h-text', el, { modifiers: [] });
    expect(el.classList.contains('leading-7')).toBe(true);
  });
});
