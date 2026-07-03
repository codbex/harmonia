# Dialog

A modal container that appears in response to a user action, temporarily interrupting the current workflow to request information or confirmation. Dialogs require users to make a decision before they can continue interacting with the underlying interface.

## Usage

Use dialogs to capture critical decisions, confirmations, or inputs that demand immediate attention. Avoid overusing dialogs for non-essential interactions, as frequent interruptions can disrupt the user experience.

## API Reference

### Component attribute(s)

```
x-h-dialog-overlay
x-h-dialog
x-h-dialog-header
x-h-dialog-title
x-h-dialog-close
x-h-dialog-description
x-h-dialog-footer
```

## Examples

<ClientOnly>
<component-container src="/components/dialog/dialog.html" data-class="flex flex-col items-center">
</component-container>
</ClientOnly>

<<< @/public/components/dialog/dialog.html
