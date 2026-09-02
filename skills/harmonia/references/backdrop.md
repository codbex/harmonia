# Backdrop

A full-screen overlay that dims the page and animates its content in and out. Use it as the scrim behind transient surfaces such as command palettes, custom modals, or any panel that should sit above the rest of the interface.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Wrap the surface you want to overlay in a backdrop and bind its `data-open` attribute to a boolean in your state. When the value becomes true the backdrop fades in and scales its content up. When it becomes false it animates back out and hides itself. The backdrop only provides the dimmed layer and the show and hide animation, so you remain in control of what it contains and of when it opens and closes.

Mark each direct child that should animate with `x-h-backdrop-item`. The backdrop scales its direct children as it opens and closes, and `x-h-backdrop-item` gives those children the matching transition timing so their scale and fade stay in step with the scrim. A child without it still moves, but the change is abrupt rather than smooth.

## Directives

`x-h-backdrop` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-backdrop`
- `x-h-backdrop-item`

## Accessibility

The backdrop is focusable through `tabindex="-1"`, and its show and hide transitions respect the user's `prefers-reduced-motion` setting. Because the surrounding component owns the open state, wire up your own dismissal (for example closing on a click of the scrim or on `Esc`) to match your use case.

While it is open the backdrop keeps focus inside itself. `Tab` and `Shift+Tab` cycle through its own focusable content instead of reaching the page behind, and if focus is somewhere else when the user presses `Tab` it is brought in. Closing hands focus back to whatever had it when the backdrop opened, so a keyboard user returns to the button they came from. A backdrop with nothing focusable inside holds focus on itself.

The backdrop stays a scrim rather than a dialog, so it sets no `role` or `aria-modal` of its own. If the content you put inside is a modal dialog, give that content the dialog semantics.

## Binding

Binds through Alpine `x-model`. See the Examples for the expected value shape.

## Examples

A command palette where a button opens the backdrop and the scrim closes it. The results come from a Combobox, so typing filters them, the arrow keys move through them, and picking one closes the palette. `Enter` before any arrow key runs the first match.

```html
<div
  x-data="{
    open: false,
    query: '',
    commands: ['New File', 'Open Folder', 'Toggle Sidebar', 'Split Editor', 'Find in Files'],
    get matches() { return this.commands.filter((c) => c.toLowerCase().includes(this.query.toLowerCase())) }
  }"
>
  <button x-h-button @click="open = true">Open command palette</button>

  <div x-h-backdrop :data-open="open" @click.self="open = false" class="vbox items-center gap-4 p-4 sm:p-12">
    <input
      class="max-w-xl"
      x-h-input
      x-h-backdrop-item
      x-ref="query"
      type="text"
      placeholder="Type a command..."
      aria-label="Type a command"
      :aria-expanded="open"
      x-model="query"
      x-h-focus="open"
      @keydown.enter.prevent="if (matches.length) open = false"
    />
    <div x-h-combobox="$refs.query" class="w-full max-w-xl" x-h-backdrop-item>
      <ul x-h-list>
        <template x-for="command in matches" :key="command">
          <li x-h-list-item @click="open = false" x-text="command"></li>
        </template>
      </ul>
    </div>
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/backdrop.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
