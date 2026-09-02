# Dialog

A modal container that appears in response to a user action, temporarily interrupting the current workflow to request information or confirmation. Dialogs require users to make a decision before they can continue interacting with the underlying interface.

## Usage

Use dialogs to capture critical decisions, confirmations, or inputs that demand immediate attention. Avoid overusing dialogs for non-essential interactions, as frequent interruptions can disrupt the user experience.

## Behavior

By default a dialog is a centered window with a maximum width. In fullscreen mode it fills the whole viewport instead, without rounded corners, border or shadow, which suits long forms and multi-step tasks, especially on small screens.

Wrapping the body of a dialog in `x-h-dialog-content` makes it the only scrolling part, so the header and the footer stay in place while the content scrolls between them. In a fullscreen dialog this keeps the title and the actions visible at all times.

## Accessibility

When a dialog opens, focus moves to a control inside it. The focused element is either the first input/textarea, the first button or a control marked with `autofocus`. Fields that a component keeps behind its own interface are passed over, so an [OTP](/components/otp) in a dialog starts on its first cell rather than on the native field it hides.

While it is open the dialog keeps focus inside itself - `Tab` and `Shift+Tab` cycle through its own focusable content instead of reaching the page behind, and if focus is somewhere else when the user presses `Tab` it is brought back in. Closing hands focus back to whatever had it when the dialog opened, so a keyboard user returns to the button they came from. A dialog with nothing focusable inside holds focus on the overlay itself.

Because the surrounding component owns the open state, wire up your own dismissal, for example closing on `Esc`, to match your use case.

## API Reference

### Component attribute(s)

```
x-h-dialog-overlay
x-h-dialog
x-h-dialog-header
x-h-dialog-title
x-h-dialog-close
x-h-dialog-description
x-h-dialog-content
x-h-dialog-footer
```

### Attributes

#### x-h-dialog

| Attribute       | Type               | Required | Description                                                                                                              |
| --------------- | ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| data-fullscreen | `true`<br/>`false` | false    | Makes the dialog fill the entire viewport. Default is `false`. Can be bound to an expression to switch modes at runtime. |

### Modifiers

#### x-h-dialog-content

| Modifier | Description                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------- |
| flush    | Removes the padding from the body, so that content like a calendar, a table or a list spans the full width of the dialog. |

## Examples

### Basic dialog

<LiveExample data-class="flex flex-col items-center">

```html
<div x-data="{ showDialog: false }">
  <button x-h-button @click="showDialog = !showDialog">Show</button>

  <div x-h-dialog-overlay :data-open="showDialog">
    <div x-h-dialog>
      <div x-h-dialog-header>
        <h2 x-h-dialog-title>Edit profile</h2>
        <p x-h-dialog-description>Make changes to your profile and click save.</p>
      </div>
      <div x-h-dialog-content class="grid gap-4">
        <div class="grid gap-3">
          <label x-h-label for="name-1">Name</label>
          <input x-h-input id="name-1" name="name" value="Olivia Davis" />
        </div>
        <div class="grid gap-3">
          <label x-h-label for="username-1">Username</label>
          <input x-h-input id="username-1" name="username" value="@olivia-davis" />
        </div>
      </div>
      <div x-h-dialog-footer>
        <button x-h-button data-variant="outline" @click="showDialog = false">Cancel</button>
        <button x-h-button data-variant="primary" @click="showDialog = false">Save</button>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Fullscreen dialog

<LiveExample data-class="flex flex-col items-center" data-exclude="generator">

```html
<div x-data="{ showDialog: false, submitted: '' }">
  <button x-h-button @click="showDialog = !showDialog">Show</button>
  <p x-h-text.muted x-show="submitted">Reported: <span x-text="submitted"></span></p>

  <div x-h-dialog-overlay :data-open="showDialog">
    <div x-h-dialog data-fullscreen="true">
      <div x-h-dialog-header>
        <h2 x-h-dialog-title>New report</h2>
        <p x-h-dialog-description>Describe the issue and we will look into it.</p>
        <button x-h-dialog-close aria-label="Close button" @click="showDialog = false">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </button>
      </div>
      <form x-h-dialog-content id="report-form" @submit.prevent="submitted = new FormData($el).get('title'); showDialog = false">
        <div x-h-field-group>
          <div x-h-field>
            <label x-h-label for="report-title">Title</label>
            <input x-h-input id="report-title" name="title" placeholder="Short summary" required />
            <p x-h-field-error>Give the report a title.</p>
          </div>
          <div x-h-field>
            <label x-h-label for="report-area">Area</label>
            <div x-h-select>
              <input x-h-select-input data-id="report-area" name="area" placeholder="Select an area" required />
              <div x-h-select-content>
                <div x-h-select-list>
                  <div x-h-select-option="'Billing'" data-value="billing"></div>
                  <div x-h-select-option="'Account'" data-value="account"></div>
                  <div x-h-select-option="'Other'" data-value="other"></div>
                </div>
              </div>
            </div>
            <p x-h-field-error>Pick the area the report belongs to.</p>
          </div>
          <div x-h-field>
            <label x-h-label for="report-steps">Steps to reproduce</label>
            <textarea x-h-textarea id="report-steps" name="steps" placeholder="What did you do?" required></textarea>
            <p x-h-field-error>Describe what you did.</p>
          </div>
          <div x-h-field>
            <label x-h-label for="report-expected">Expected result</label>
            <textarea x-h-textarea id="report-expected" name="expected" placeholder="What did you expect?"></textarea>
          </div>
          <div x-h-field>
            <label x-h-label for="report-notes">Additional notes</label>
            <textarea x-h-textarea id="report-notes" name="notes" placeholder="Anything else we should know?"></textarea>
          </div>
          <div x-h-field>
            <label x-h-label for="report-reference">Reference</label>
            <input x-h-input id="report-reference" name="reference" placeholder="Order or invoice number" />
          </div>
          <div x-h-field>
            <label x-h-label for="report-priority">Priority</label>
            <div x-h-select>
              <input x-h-select-input data-id="report-priority" name="priority" placeholder="Select a priority" />
              <div x-h-select-content>
                <div x-h-select-list>
                  <div x-h-select-option="'Low'" data-value="low"></div>
                  <div x-h-select-option="'Normal'" data-value="normal"></div>
                  <div x-h-select-option="'High'" data-value="high"></div>
                </div>
              </div>
            </div>
          </div>
          <div x-h-field>
            <label x-h-label for="report-contact">Contact email</label>
            <input x-h-input id="report-contact" name="contact" type="email" placeholder="you@example.com" required />
            <p x-h-field-error>Enter an email address we can reply to.</p>
          </div>
        </div>
      </form>
      <div x-h-dialog-footer>
        <button x-h-button data-variant="primary" type="submit" form="report-form">Submit</button>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>

### Full-bleed body

<LiveExample data-class="flex flex-col items-center" data-exclude="generator">

```html
<div x-data="{ showDialog: false, date: '' }">
  <button x-h-button @click="showDialog = !showDialog">Show</button>

  <div x-h-dialog-overlay :data-open="showDialog">
    <div x-h-dialog>
      <div x-h-dialog-header>
        <h2 x-h-dialog-title>Pick a date</h2>
        <p x-h-dialog-description>Choose the day of your appointment.</p>
        <button x-h-dialog-close aria-label="Close button" @click="showDialog = false">
          <svg x-h-icon data-icon="close" role="presentation"></svg>
        </button>
      </div>
      <div x-h-dialog-content.flush>
        <div x-h-calendar-inline x-model="date" @change="showDialog = false"></div>
      </div>
    </div>
  </div>
</div>
```

</LiveExample>
