# Focus

The focus utility component enables programmatic focus management for an element based on a specified condition.

## API Reference

### Component attubute(s)

```
x-h-focus
```

### Arguments

| Attribute | Type    | Required | Description                          |
| --------- | ------- | -------- | ------------------------------------ |
| `self`    | boolean | true     | When true, the element gets focused. |

## Examples

### Focus an input with a delay

```html
<div x-data="mainCtl">
  <input x-h-input x-h-focus="focusInput" />
</div>
<script>
  document.addEventListener('alpine:init', () => {
    Alpine.data('mainCtl', () => ({
      focusInput: false,
      init() {
        setTimeout(() => {
          this.focusInput = true;
        }, 2000);
      },
    }));
  });
</script>
```

### Show sheet and focus textarea

<br />

<ClientOnly>
<component-container>
<div x-data="{ sheetVisible: false }">
  <div x-h-sheet-overlay="sheetVisible">
    <div x-h-sheet class="vbox gap-4 p-4" data-align="bottom">
      <div x-h-field>
        <label x-h-label.field for="focusExample-2">Write comment</label>
        <textarea x-h-textarea id="focusExample-2" class="resize-none" placeholder="Comment..." x-h-focus="sheetVisible"></textarea>
      </div>
      <div class="hbox justify-end gap-2">
        <button x-h-button data-variant="primary" x-on:click="sheetVisible = false">Send</button>
        <button x-h-button data-variant="outline" x-on:click="sheetVisible = false">Cancel</button>
      </div>
    </div>
  </div>
  <button x-h-button x-on:click="sheetVisible = true">Show</button>
</div>
</component-container>
</ClientOnly>

```html
<div x-data="{ sheetVisible: false }">
  <div x-h-sheet-overlay="sheetVisible">
    <div x-h-sheet class="vbox gap-4 p-4" data-align="bottom">
      <div x-h-field>
        <label x-h-label.field for="focusExample-2">Write comment</label>
        <textarea x-h-textarea id="focusExample-2" class="resize-none" placeholder="Comment..." x-h-focus="sheetVisible"></textarea>
      </div>
      <div class="hbox justify-end gap-2">
        <button x-h-button data-variant="primary" @click="sheetVisible = false">Send</button>
        <button x-h-button data-variant="outline" @click="sheetVisible = false">Cancel</button>
      </div>
    </div>
  </div>
  <button x-h-button @click="sheetVisible = true">Show</button>
</div>
```
