import { findAncestorState } from '../common/ancestor';

export default function (Alpine) {
  // Scrollable conversation thread. Lays its messages out as a flex column so each
  // message aligns itself (own -> end, other -> start) via `self-*`. An optional
  // expression provides the current author id (`x-h-chat="me"`); a message aligns
  // right when its `data-author` equals it, unless the message sets `data-own`.
  Alpine.directive('h-chat', (el, { expression }, { effect, evaluateLater, Alpine }) => {
    el.classList.add('vbox', 'w-full', 'gap-3', 'overflow-y-auto', 'p-4');
    el.setAttribute('data-slot', 'chat');
    el.setAttribute('role', 'log');
    el.setAttribute('aria-live', 'polite');
    if (!el.hasAttribute('aria-label')) {
      el.setAttribute('aria-label', el.getAttribute('data-label') || 'Conversation');
    }

    el._h_chat = Alpine.reactive({ me: '' });

    if (expression) {
      const getMe = evaluateLater(expression);
      effect(() => {
        getMe((value) => {
          el._h_chat.me = value == null ? '' : String(value);
        });
      });
    }
  });

  // One message block: a small author/timestamp header plus the body bubble. Owned
  // messages float to the trailing edge; the body colours itself from `data-own` and
  // `data-variant` (internal | external) through arbitrary-variant selectors, so the
  // consumer only sets those attributes.
  Alpine.directive('h-chat-message', (el, { original }, { effect, Alpine }) => {
    const chat = findAncestorState(Alpine, el, '_h_chat');
    if (!chat) {
      throw new Error(`${original} must be inside an x-h-chat element`);
    }

    el.classList.add('vbox', 'max-w-[85%]', 'gap-1');
    el.setAttribute('data-slot', 'chat-message');
    el.setAttribute('role', 'listitem');

    effect(() => {
      const me = chat._h_chat.me;
      let own;
      if (el.hasAttribute('data-own')) {
        own = el.getAttribute('data-own') === 'true';
      } else {
        const author = el.getAttribute('data-author');
        own = !!me && author === me;
      }
      el.setAttribute('data-own', String(own));
      if (own) {
        el.classList.add('self-end', 'items-end');
        el.classList.remove('self-start', 'items-start');
      } else {
        el.classList.add('self-start', 'items-start');
        el.classList.remove('self-end', 'items-end');
      }
    });
  });

  Alpine.directive('h-chat-message-author', (el) => {
    el.classList.add('text-foreground', 'text-xs', 'font-medium');
    el.setAttribute('data-slot', 'chat-message-author');
  });

  Alpine.directive('h-chat-message-timestamp', (el) => {
    el.classList.add('text-muted-foreground', 'text-xs');
    el.setAttribute('data-slot', 'chat-message-timestamp');
  });

  // The bubble. Base is the "other/external" look; own (not internal) flips to the
  // primary fill, and internal (either side) takes a distinct muted-warning tint so an
  // internal memo can never be mistaken for a reply visible to the requester.
  Alpine.directive('h-chat-message-body', (el) => {
    el.classList.add(
      'rounded-lg',
      'px-3',
      'py-2',
      'text-sm',
      'whitespace-pre-wrap',
      'break-words',
      'bg-secondary',
      'text-secondary-foreground',
      '[[data-own=true]:not([data-variant=internal])_&]:bg-primary',
      '[[data-own=true]:not([data-variant=internal])_&]:text-primary-foreground',
      '[[data-variant=internal]_&]:bg-warning/10',
      '[[data-variant=internal]_&]:text-foreground',
      '[[data-variant=internal]_&]:border',
      '[[data-variant=internal]_&]:border-warning/40'
    );
    el.setAttribute('data-slot', 'chat-message-body');
  });

  // A footer composer. Wires the inner textarea (Enter sends, Shift+Enter newlines) and
  // any element marked data-slot="chat-composer-send" to dispatch a bubbling `send`
  // event carrying the trimmed text, then clears and refocuses the textarea. It injects
  // no markup, so the consumer stays in control of the layout and any extra controls.
  Alpine.directive('h-chat-composer', (el, _, { cleanup }) => {
    el.classList.add('flex', 'items-end', 'gap-2', 'rounded-control', 'border', 'border-input', 'bg-input-inner', 'p-1.5', 'focus-within:border-ring', 'focus-within:ring-ring/50', 'focus-within:ring-[calc(var(--spacing)*0.75)]');
    el.setAttribute('data-slot', 'chat-composer');

    const textarea = el.querySelector('textarea');

    function send() {
      if (!textarea) return;
      const value = textarea.value.trim();
      if (!value) return;
      el.dispatchEvent(new CustomEvent('send', { detail: { value }, bubbles: true }));
      textarea.value = '';
      textarea.focus();
    }

    function onKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        send();
      }
    }

    if (textarea) textarea.addEventListener('keydown', onKeyDown);

    const sendButton = el.querySelector('[data-slot="chat-composer-send"]');
    if (sendButton) sendButton.addEventListener('click', send);

    cleanup(() => {
      if (textarea) textarea.removeEventListener('keydown', onKeyDown);
      if (sendButton) sendButton.removeEventListener('click', send);
    });
  });
}
