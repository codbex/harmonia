# Masks

Fade out the edges of an element with a mask, typically to hint that there is more content to scroll to.

## Class names

| Class  | Description                         |
| ------ | ----------------------------------- |
| h-mask | Fades out the left and right edges. |
| v-mask | Fades out the top and bottom edges. |

## Examples

### Horizontal

<LiveExample>

```html
<div class="h-mask hbox w-3xs scrollbar-none gap-2 overflow-x-auto px-2 py-1">
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Apples</span>
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Bananas</span>
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Cherries</span>
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Grapes</span>
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Oranges</span>
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Peaches</span>
  <span class="rounded-full bg-muted px-3 py-1 text-sm whitespace-nowrap">Strawberries</span>
</div>
```

</LiveExample>

### Vertical

<LiveExample>

```html
<div class="v-mask vbox w-3xs scrollbar-none gap-2 overflow-y-auto px-1 py-2" style="height: 10rem">
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Inbox</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Drafts</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Sent</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Archive</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Spam</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Trash</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Starred</span>
  <span class="rounded-md bg-muted px-3 py-1 text-sm">Important</span>
</div>
```

</LiveExample>
