import { beforeEach, describe, expect, it, vi } from 'vitest';
import chatPlugin from '../../src/components/chat.js';
import { mountDirective } from '../test-utils.js';

describe('h-chat', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('registers all chat directives', () => {
    const { alpine } = mountDirective(chatPlugin, 'h-chat', el);
    expect(alpine._directives['h-chat']).toBeDefined();
    expect(alpine._directives['h-chat-message']).toBeDefined();
    expect(alpine._directives['h-chat-message-author']).toBeDefined();
    expect(alpine._directives['h-chat-message-timestamp']).toBeDefined();
    expect(alpine._directives['h-chat-message-body']).toBeDefined();
    expect(alpine._directives['h-chat-composer']).toBeDefined();
  });

  it('sets data-slot, role="log" and a default aria-label', () => {
    mountDirective(chatPlugin, 'h-chat', el);
    expect(el.getAttribute('data-slot')).toBe('chat');
    expect(el.getAttribute('role')).toBe('log');
    expect(el.getAttribute('aria-live')).toBe('polite');
    expect(el.getAttribute('aria-label')).toBe('Conversation');
  });

  it('honours a custom data-label as the aria-label', () => {
    el.setAttribute('data-label', 'Case #12');
    mountDirective(chatPlugin, 'h-chat', el);
    expect(el.getAttribute('aria-label')).toBe('Case #12');
  });

  it('creates reactive _h_chat state with an empty me by default', () => {
    mountDirective(chatPlugin, 'h-chat', el);
    expect(el._h_chat.me).toBe('');
  });

  it('resolves me from the expression', () => {
    mountDirective(chatPlugin, 'h-chat', el, { expression: 'me' }, { evaluateLater: () => (cb) => cb('user-1') });
    expect(el._h_chat.me).toBe('user-1');
  });
});

describe('h-chat-message', () => {
  let parentEl, el;

  beforeEach(() => {
    parentEl = document.createElement('div');
    parentEl._h_chat = { me: '' };
    el = document.createElement('div');
    parentEl.appendChild(el);
    document.body.appendChild(parentEl);
  });

  it('sets data-slot and listitem role', () => {
    mountDirective(chatPlugin, 'h-chat-message', el);
    expect(el.getAttribute('data-slot')).toBe('chat-message');
    expect(el.getAttribute('role')).toBe('listitem');
  });

  it('throws without an x-h-chat ancestor', () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    expect(() => mountDirective(chatPlugin, 'h-chat-message', orphan, { original: 'h-chat-message' })).toThrow();
  });

  it('aligns to the start for other authors', () => {
    mountDirective(chatPlugin, 'h-chat-message', el, { modifiers: [], expression: '' });
    expect(el.getAttribute('data-own')).toBe('false');
    expect(el.classList.contains('self-start')).toBe(true);
  });

  it('honours an explicit data-own', () => {
    el.setAttribute('data-own', 'true');
    mountDirective(chatPlugin, 'h-chat-message', el);
    expect(el.getAttribute('data-own')).toBe('true');
    expect(el.classList.contains('self-end')).toBe(true);
  });

  it('marks a message own when its author matches the thread me', () => {
    parentEl._h_chat = { me: 'user-1' };
    el.setAttribute('data-author', 'user-1');
    mountDirective(chatPlugin, 'h-chat-message', el);
    expect(el.getAttribute('data-own')).toBe('true');
    expect(el.classList.contains('self-end')).toBe(true);
  });
});

describe('h-chat-message parts', () => {
  it.each([
    ['h-chat-message-author', 'chat-message-author'],
    ['h-chat-message-timestamp', 'chat-message-timestamp'],
    ['h-chat-message-body', 'chat-message-body'],
  ])('%s sets data-slot="%s"', (directive, slot) => {
    const el = document.createElement('div');
    mountDirective(chatPlugin, directive, el);
    expect(el.getAttribute('data-slot')).toBe(slot);
  });

  it('body carries own and internal variant selectors', () => {
    const el = document.createElement('div');
    mountDirective(chatPlugin, 'h-chat-message-body', el);
    expect(el.classList.contains('bg-secondary')).toBe(true);
    expect(el.classList.contains('[[data-own=true]:not([data-variant=internal])_&]:bg-primary')).toBe(true);
    expect(el.classList.contains('[[data-variant=internal]_&]:bg-warning/10')).toBe(true);
  });
});

describe('h-chat-composer', () => {
  let el, textarea;

  beforeEach(() => {
    el = document.createElement('div');
    textarea = document.createElement('textarea');
    el.appendChild(textarea);
    document.body.appendChild(el);
  });

  it('sets data-slot="chat-composer"', () => {
    mountDirective(chatPlugin, 'h-chat-composer', el);
    expect(el.getAttribute('data-slot')).toBe('chat-composer');
  });

  it('dispatches a bubbling send event with the trimmed value on Enter and clears the textarea', () => {
    mountDirective(chatPlugin, 'h-chat-composer', el);
    const handler = vi.fn();
    el.addEventListener('send', handler);
    textarea.value = '  hello  ';
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail.value).toBe('hello');
    expect(textarea.value).toBe('');
  });

  it('does not send on Shift+Enter', () => {
    mountDirective(chatPlugin, 'h-chat-composer', el);
    const handler = vi.fn();
    el.addEventListener('send', handler);
    textarea.value = 'multi';
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true, bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
    expect(textarea.value).toBe('multi');
  });

  it('does not send an empty message', () => {
    mountDirective(chatPlugin, 'h-chat-composer', el);
    const handler = vi.fn();
    el.addEventListener('send', handler);
    textarea.value = '   ';
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(handler).not.toHaveBeenCalled();
  });

  it('sends when a data-slot="chat-composer-send" control is clicked', () => {
    const sendBtn = document.createElement('button');
    sendBtn.setAttribute('data-slot', 'chat-composer-send');
    el.appendChild(sendBtn);
    mountDirective(chatPlugin, 'h-chat-composer', el);
    const handler = vi.fn();
    el.addEventListener('send', handler);
    textarea.value = 'via button';
    sendBtn.click();
    expect(handler).toHaveBeenCalledOnce();
    expect(handler.mock.calls[0][0].detail.value).toBe('via button');
  });

  it('calls cleanup', () => {
    const { ctx } = mountDirective(chatPlugin, 'h-chat-composer', el);
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
