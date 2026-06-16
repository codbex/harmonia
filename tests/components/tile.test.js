import { describe, expect, it, vi } from 'vitest';
import tilePlugin from '../../src/components/tile.js';
import { mountDirective } from '../test-utils.js';

describe('h-tile-group', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-group', el);
    expect(el.classList.contains('group/tile-group')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.getAttribute('role')).toBe('list');
    expect(el.getAttribute('data-slot')).toBe('tile-group');
  });

  it('preserves an author-set role instead of forcing list', () => {
    const el = document.createElement('div');
    el.setAttribute('role', 'radiogroup');
    mountDirective(tilePlugin, 'h-tile-group', el);
    expect(el.getAttribute('role')).toBe('radiogroup');
  });
});

describe('h-tile', () => {
  it('applies base classes', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('group/tile')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile');
  });

  it('applies outline variant classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'outline');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('border-border')).toBe(true);
  });

  it('applies shadow variant classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'shadow');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('shadow-sm')).toBe(true);
  });

  it('applies muted variant classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'muted');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('bg-muted')).toBe(true);
  });

  it('applies default transparent variant classes when no variant set', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('bg-transparent')).toBe(true);
    expect(el.classList.contains('border-transparent')).toBe(true);
  });

  it('does not apply selectable classes on a non-label element', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('cursor-pointer')).toBe(false);
    expect(el.classList.contains('has-[input:checked]:border-primary')).toBe(false);
  });
});

describe('h-tile (selectable label)', () => {
  it('applies selectable classes when mounted on a label', () => {
    const el = document.createElement('label');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('cursor-pointer')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:bg-secondary/20')).toBe(true);
    expect(el.classList.contains('has-[input:checked]:border-primary')).toBe(true);
    expect(el.classList.contains('has-[input:focus-visible]:ring-primary/50')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:opacity-50')).toBe(true);
    expect(el.classList.contains('has-[input:disabled]:cursor-not-allowed')).toBe(true);
  });

  it('forces the outline look on a label', () => {
    const el = document.createElement('label');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('border-border')).toBe(true);
  });

  it('ignores data-variant on a label', () => {
    const el = document.createElement('label');
    el.setAttribute('data-variant', 'muted');
    mountDirective(tilePlugin, 'h-tile', el);
    expect(el.classList.contains('border-border')).toBe(true);
    expect(el.classList.contains('bg-muted')).toBe(false);
  });

  it('warns when a selectable tile wraps extra interactive elements', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('label');
    el.innerHTML = '<input type="checkbox" /><button>Action</button>';
    mountDirective(tilePlugin, 'h-tile', el);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('does not warn for a valid single-control selectable tile', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const el = document.createElement('label');
    el.innerHTML = '<input type="checkbox" /><span>Label text</span>';
    mountDirective(tilePlugin, 'h-tile', el);
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe('h-tile-header', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-header', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('basis-full')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('justify-between')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile-header');
  });
});

describe('h-tile-media', () => {
  it('applies base classes and attributes', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-media', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.getAttribute('role')).toBe('list');
    expect(el.getAttribute('data-slot')).toBe('tile-media');
  });

  it('applies icon variant classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'icon');
    mountDirective(tilePlugin, 'h-tile-media', el);
    expect(el.classList.contains('size-8')).toBe(true);
    expect(el.classList.contains('border')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('bg-muted')).toBe(true);
  });

  it('applies image variant classes', () => {
    const el = document.createElement('div');
    el.setAttribute('data-variant', 'image');
    mountDirective(tilePlugin, 'h-tile-media', el);
    expect(el.classList.contains('size-10')).toBe(true);
    expect(el.classList.contains('rounded-lg')).toBe(true);
    expect(el.classList.contains('overflow-hidden')).toBe(true);
  });

  it('applies default transparent bg for no variant', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-media', el);
    expect(el.classList.contains('bg-transparent')).toBe(true);
  });
});

describe('h-tile-content', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-content', el);
    expect(el.classList.contains('vbox')).toBe(true);
    expect(el.classList.contains('flex-1')).toBe(true);
    expect(el.classList.contains('gap-1')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile-content');
  });
});

describe('h-tile-title', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-title', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('w-fit')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('font-medium')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile-title');
  });
});

describe('h-tile-description', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-description', el);
    expect(el.classList.contains('text-muted-foreground')).toBe(true);
    expect(el.classList.contains('text-sm')).toBe(true);
    expect(el.classList.contains('line-clamp-2')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile-description');
  });
});

describe('h-tile-actions', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-actions', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('gap-2')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile-actions');
  });
});

describe('h-tile-footer', () => {
  it('applies base classes and data-slot', () => {
    const el = document.createElement('div');
    mountDirective(tilePlugin, 'h-tile-footer', el);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('basis-full')).toBe(true);
    expect(el.classList.contains('items-center')).toBe(true);
    expect(el.classList.contains('justify-between')).toBe(true);
    expect(el.getAttribute('data-slot')).toBe('tile-footer');
  });
});
