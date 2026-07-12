# Chat

A conversation thread that lays out messages as aligned bubbles with an author, a timestamp and a body, plus a composer for writing new messages. Own messages align to the trailing edge, and internal messages take a distinct tint so they read differently from replies shared with the other party.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use the chat to show a back-and-forth conversation, such as a support case, a comment thread or an internal discussion. Mark a message as own with `data-own`, or let the thread decide by giving `x-h-chat` the current author id and each message a `data-author`. Set `data-variant="internal"` on messages that should stand apart from the ones the other party can see.

## Directives

`x-h-chat` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-chat`
- `x-h-chat-message`
- `x-h-chat-message-author`
- `x-h-chat-message-timestamp`
- `x-h-chat-message-body`
- `x-h-chat-composer`

## API

### Attributes

#### x-h-chat

| Attribute               | Description                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `x-h-chat` (expression) | Optional current-author id. A message whose `data-author` equals it renders as own. |
| `data-label`            | Accessible name for the conversation region (defaults to `Conversation`).           |

#### x-h-chat-message

| Attribute      | Description                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `data-own`     | `true` / `false` to force alignment and own colouring, overriding the author comparison.       |
| `data-author`  | The message author id; compared to the thread's current author to decide own vs other.         |
| `data-variant` | `internal` gives the bubble a muted-warning tint; anything else is a normal (external) bubble. |

### Events

| Event  | Target              | Description                                                                                                                                                                                      |
| ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `send` | `x-h-chat-composer` | Dispatched (bubbling) when the user presses Enter or activates a `data-slot="chat-composer-send"` control. `event.detail.value` is the trimmed text; the textarea is then cleared and refocused. |

## Accessibility

The thread is a `role="log"` region with `aria-live="polite"` so assistive technology announces new messages as they arrive. Each message is a `listitem`. Give the composer's textarea an accessible label, and set `data-label` on `x-h-chat` to name the conversation.

## Examples

### Conversation

```html
<div x-h-chat data-label="Support conversation" style="max-height: 22rem">
  <div x-h-chat-message data-author="agent">
    <div class="hbox items-baseline gap-2">
      <span x-h-chat-message-author>Mina (Support)</span>
      <span x-h-chat-message-timestamp>09:14</span>
    </div>
    <div x-h-chat-message-body>Hi! Thanks for reaching out. Could you share the order number?</div>
  </div>
  <div x-h-chat-message data-own="true">
    <div class="hbox items-baseline gap-2">
      <span x-h-chat-message-author>You</span>
      <span x-h-chat-message-timestamp>09:16</span>
    </div>
    <div x-h-chat-message-body>Sure, it is SO-00042.</div>
  </div>
  <div x-h-chat-message data-own="true" data-variant="internal">
    <div class="hbox items-baseline gap-2">
      <span x-h-chat-message-author>Note to team</span>
      <span x-h-chat-message-timestamp>09:17</span>
    </div>
    <div x-h-chat-message-body>Internal: waiting on warehouse to confirm stock before replying.</div>
  </div>
</div>
```

### With composer

```html
<div x-data="{ me: 'me', messages: [{ id: 1, author: 'agent', name: 'Mina', body: 'How can I help?' }], add(value) { this.messages.push({ id: Date.now(), author: 'me', name: 'You', body: value }); } }" class="vbox gap-3">
  <div x-h-chat="me" data-label="Conversation" style="max-height: 18rem">
    <template x-for="m in messages" :key="m.id">
      <div x-h-chat-message :data-own="m.author === me">
        <div class="hbox items-baseline gap-2">
          <span x-h-chat-message-author x-text="m.name"></span>
        </div>
        <div x-h-chat-message-body x-text="m.body"></div>
      </div>
    </template>
  </div>
  <div x-h-chat-composer @send="add($event.detail.value)">
    <textarea x-h-textarea.group rows="1" aria-label="Write a message" placeholder="Write a message..."></textarea>
    <button x-h-button data-variant="primary" data-slot="chat-composer-send">Send</button>
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/chat.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
