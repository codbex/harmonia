# Backdrop

A full-screen overlay that dims the page and animates its content in and out. Use it as the scrim behind transient surfaces such as command palettes, custom modals, or any panel that should sit above the rest of the interface.

## Usage

Wrap the surface you want to overlay in a backdrop and bind its `data-open` attribute to a boolean in your state. When the value becomes true the backdrop fades in and scales its content up. When it becomes false it animates back out and hides itself. The backdrop only provides the dimmed layer and the show and hide animation, so you remain in control of what it contains and of when it opens and closes.

Mark each direct child that should animate with `x-h-backdrop-item`. The backdrop scales its direct children as it opens and closes, and `x-h-backdrop-item` gives those children the matching transition timing so their scale and fade stay in step with the scrim. A child without it still moves, but the change is abrupt rather than smooth.

## Accessibility

The backdrop is focusable through `tabindex="-1"`, and its show and hide transitions respect the user's `prefers-reduced-motion` setting. Because the surrounding component owns the open state, wire up your own dismissal (for example closing on a click of the scrim or on `Esc`) to match your use case.

## API Reference

### Component attribute(s)

```
x-h-backdrop
x-h-backdrop-item
```

## Examples

A command palette where a button opens the backdrop, the scrim closes it, and picking a command closes it too.

<LiveExample data-class="flex flex-col items-center">

```html
<div x-data="{ open: false, query: '', commands: ['New File', 'Open Folder', 'Toggle Sidebar', 'Split Editor', 'Find in Files'] }">
  <button x-h-button @click="open = true">Open command palette</button>

  <div x-h-backdrop :data-open="open" @click.self="open = false" class="vbox items-center gap-4 p-12">
    <input class="max-w-xl" x-h-input x-h-backdrop-item type="text" placeholder="Type a command..." x-model="query" x-h-focus="open" />
    <div x-h-listbox class="w-full max-w-xl" x-h-backdrop-item>
      <ul x-h-list>
        <template x-for="command in commands.filter((c) => c.toLowerCase().includes(query.toLowerCase()))" :key="command">
          <li x-h-list-item @click="open = false" x-text="command"></li>
        </template>
      </ul>
    </div>
  </div>
</div>
```

</LiveExample>
