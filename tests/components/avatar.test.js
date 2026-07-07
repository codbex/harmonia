import { beforeEach, describe, expect, it } from 'vitest';
import avatarPlugin from '../../src/components/avatar.js';
import { mountDirective } from '../test-utils.js';

describe('h-avatar', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  it('registers all avatar directives', () => {
    const { alpine } = mountDirective(avatarPlugin, 'h-avatar', el);
    expect(alpine._directives['h-avatar']).toBeDefined();
    expect(alpine._directives['h-avatar-image']).toBeDefined();
    expect(alpine._directives['h-avatar-fallback']).toBeDefined();
  });

  it('adds rounded-full when no rounded class present', () => {
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('rounded-full')).toBe(true);
  });

  it('does not add rounded-full if element already has a rounded class', () => {
    el.classList.add('rounded-lg');
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('rounded-full')).toBe(false);
    expect(el.classList.contains('rounded-lg')).toBe(true);
  });

  it('adds base layout classes', () => {
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('relative')).toBe(true);
    expect(el.classList.contains('flex')).toBe(true);
    expect(el.classList.contains('size-8')).toBe(true);
    expect(el.classList.contains('shrink-0')).toBe(true);
  });

  it('adds primary variant classes', () => {
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('data-[variant="primary"]:bg-primary/10')).toBe(true);
    expect(el.classList.contains('data-[variant="primary"]:text-primary')).toBe(true);
    expect(el.classList.contains('data-[variant="primary"]:border-primary')).toBe(true);
  });

  it('sets data-slot="avatar"', () => {
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.getAttribute('data-slot')).toBe('avatar');
  });

  it('creates reactive _h_avatar with fallback=false', () => {
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el._h_avatar).toBeDefined();
    expect(el._h_avatar.fallback).toBe(false);
  });

  it('fills solid with a standard palette color via data-color', () => {
    el.setAttribute('data-color', 'red');
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('bg-red-500')).toBe(true);
    expect(el.classList.contains('text-white')).toBe(true);
    expect(el.classList.contains('bg-secondary')).toBe(false);
    expect(el.classList.contains('text-secondary-foreground')).toBe(false);
  });

  it('uses a dark foreground for light data-color backgrounds', () => {
    el.setAttribute('data-color', 'white');
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('bg-white')).toBe(true);
    expect(el.classList.contains('text-black')).toBe(true);
  });

  it('ignores an unknown data-color and keeps the secondary base', () => {
    el.setAttribute('data-color', 'not-a-color');
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('text-white')).toBe(false);
  });

  it('skips secondary hover classes on a button when data-color is set', () => {
    const btn = document.createElement('button');
    btn.setAttribute('data-color', 'blue');
    document.body.appendChild(btn);
    mountDirective(avatarPlugin, 'h-avatar', btn);
    expect(btn.classList.contains('cursor-pointer')).toBe(true);
    expect(btn.classList.contains('bg-blue-500')).toBe(true);
    expect(btn.classList.contains('hover:bg-secondary-hover')).toBe(false);
  });

  it('adds cursor-pointer for button elements', () => {
    const btn = document.createElement('button');
    document.body.appendChild(btn);
    mountDirective(avatarPlugin, 'h-avatar', btn);
    expect(btn.classList.contains('cursor-pointer')).toBe(true);
    expect(btn.classList.contains('hover:bg-secondary-hover')).toBe(true);
  });

  it('does not add cursor-pointer for non-button elements', () => {
    mountDirective(avatarPlugin, 'h-avatar', el);
    expect(el.classList.contains('cursor-pointer')).toBe(false);
  });
});

describe('h-avatar-image', () => {
  let parentEl, imgEl;

  beforeEach(() => {
    parentEl = document.createElement('div');
    parentEl._h_avatar = { fallback: false };

    imgEl = document.createElement('img');
    parentEl.appendChild(imgEl);
    document.body.appendChild(parentEl);
  });

  it('adds base classes', () => {
    mountDirective(avatarPlugin, 'h-avatar-image', imgEl, { original: 'h-avatar-image' });
    expect(imgEl.classList.contains('aspect-square')).toBe(true);
    expect(imgEl.classList.contains('size-full')).toBe(true);
  });

  it('sets data-slot="avatar-image"', () => {
    mountDirective(avatarPlugin, 'h-avatar-image', imgEl, { original: 'h-avatar-image' });
    expect(imgEl.getAttribute('data-slot')).toBe('avatar-image');
  });

  it('sets role="img"', () => {
    mountDirective(avatarPlugin, 'h-avatar-image', imgEl, { original: 'h-avatar-image' });
    expect(imgEl.getAttribute('role')).toBe('img');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(avatarPlugin, 'h-avatar-image', imgEl, { original: 'h-avatar-image' });
    expect(ctx.cleanup).toHaveBeenCalled();
  });

  it('throws if no avatar parent', () => {
    const orphan = document.createElement('img');
    document.body.appendChild(orphan);
    expect(() => mountDirective(avatarPlugin, 'h-avatar-image', orphan, { original: 'h-avatar-image' })).toThrow();
  });
});

describe('h-avatar-fallback', () => {
  let parentEl, fallbackEl;

  beforeEach(() => {
    parentEl = document.createElement('div');
    parentEl._h_avatar = { fallback: false };

    fallbackEl = document.createElement('span');
    parentEl.appendChild(fallbackEl);
    document.body.appendChild(parentEl);
  });

  it('adds base classes including hidden', () => {
    mountDirective(avatarPlugin, 'h-avatar-fallback', fallbackEl, { original: 'h-avatar-fallback' });
    expect(fallbackEl.classList.contains('hidden')).toBe(true);
    expect(fallbackEl.classList.contains('flex')).toBe(true);
    expect(fallbackEl.classList.contains('size-full')).toBe(true);
  });

  it('sets data-slot="avatar-fallback"', () => {
    mountDirective(avatarPlugin, 'h-avatar-fallback', fallbackEl, { original: 'h-avatar-fallback' });
    expect(fallbackEl.getAttribute('data-slot')).toBe('avatar-fallback');
  });

  it('throws if no avatar parent', () => {
    const orphan = document.createElement('span');
    document.body.appendChild(orphan);
    expect(() => mountDirective(avatarPlugin, 'h-avatar-fallback', orphan, { original: 'h-avatar-fallback' })).toThrow();
  });

  it('removes hidden when avatar.fallback is true', () => {
    parentEl._h_avatar.fallback = true;
    mountDirective(avatarPlugin, 'h-avatar-fallback', fallbackEl, { original: 'h-avatar-fallback' });
    expect(fallbackEl.classList.contains('hidden')).toBe(false);
  });
});
