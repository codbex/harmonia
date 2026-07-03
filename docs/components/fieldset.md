# Fieldset

A container that groups related form elements, including labels, controls, and helper text, to create accessible and organized input sections. Fieldsets improve the structure and clarity of complex forms.

## Usage

Use fieldsets to logically group related inputs, such as multiple options within a survey or sections of a settings form. Each fieldset should include a descriptive legend or label to maintain accessibility and provide context for users navigating the form.

## API Reference

### Component attribute(s)

```
x-h-fieldset
x-h-legend
x-h-field-group
x-h-field
x-h-field-content
x-h-field-title
x-h-field-description
x-h-field-error
```

### Attributes

#### x-h-field

| Attribute        | Values                                       | Required | Description                                                               |
| ---------------- | -------------------------------------------- | -------- | ------------------------------------------------------------------------- |
| data-disabled    | boolean                                      | false    | Applies a disabled style to the field and label. Does NOT disable inputs. |
| data-orientation | `vertical`<br/>`horizontal`<br/>`responsive` | false    | Changes the alignment of the label and input.                             |

#### x-h-field-description

| Attribute          | Values  | Required | Description                                                                                                        |
| ------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| data-hide-on-error | boolean | false    | When enabled, the description will be hidden when the input is invalid, and the error message will appear instead. |

### Modifiers

#### x-h-legend

| Modifier | Description                    |
| -------- | ------------------------------ |
| label    | Makes the legend text smaller. |

### Validation timing

By default a control with a failing native constraint (for example a `required` empty input) only shows its invalid styling after the user has interacted with it (edited and blurred it) or attempted to submit the form, not on page load. Set `data-validate` to change when native-constraint errors appear:

| Value         | Behavior                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------- |
| `interaction` | Default. Invalid styling appears only after user interaction or a submit attempt.           |
| `immediate`   | Invalid styling appears immediately, including on page load, while the constraint is unmet. |

`data-validate` is read from an ancestor, so put it on `x-h-fieldset`, `x-h-field`, or any wrapping element to control every control inside it:

```html
<fieldset x-h-fieldset data-validate="immediate">
  <!-- every control inside validates on load -->
</fieldset>
```

This affects only native constraint validation (`:invalid`). Setting `aria-invalid="true"` yourself always shows the invalid styling immediately, in either mode - use it for programmatic or server-side errors.

## Examples

<ClientOnly>
<component-container src="/components/fieldset/full.html">
</component-container>
</ClientOnly>

<<< @/public/components/fieldset/full.html

### Invalid field with error message

When you type something in the input below, it will no longer be invalid and the error message will disappear.

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset data-validate="immediate">
    <div x-h-field-group>
      <div x-h-field>
        <label x-h-label for="errorMessage">Invalid</label>
        <input x-h-input id="errorMessage" placeholder="Input invalid" required/>
        <p x-h-field-error>The input cannot be empty</p>
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset data-validate="immediate">
    <div x-h-field-group>
      <div x-h-field>
        <label x-h-label for="errorMessage">Invalid</label>
        <input x-h-input id="errorMessage" placeholder="Input invalid" required />
        <p x-h-field-error>The input cannot be empty</p>
      </div>
    </div>
  </fieldset>
</form>
```

### Field with description and error message

When you type something in the input below, the error message will dissapear and the description will be shown.

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset data-validate="immediate">
    <div x-h-field-group>
      <div x-h-field>
        <label x-h-label for="descError">Word</label>
        <input x-h-input id="descError" placeholder="Something" required />
        <p x-h-field-error>Must not be empty!</p>
        <p x-h-field-description data-hide-on-error="true">This filed holds random text.</p>
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset data-validate="immediate">
    <div x-h-field-group>
      <div x-h-field>
        <label x-h-label for="descError">Word</label>
        <input x-h-input id="descError" placeholder="Something" required />
        <p x-h-field-error>Must not be empty!</p>
        <p x-h-field-description data-hide-on-error="true">This filed holds random text.</p>
      </div>
    </div>
  </fieldset>
</form>
```

### Responsive field

_You may need to resize the window to see it switching between horizintal and vertical._

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-orientation="responsive">
        <label x-h-label for="responsiveDemo">Word</label>
        <input x-h-input id="responsiveDemo" placeholder="Something" />
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-orientation="responsive">
        <label x-h-label for="responsiveDemo">Word</label>
        <input x-h-input id="responsiveDemo" placeholder="Something" />
      </div>
    </div>
  </fieldset>
</form>
```

### Horizontal field

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-orientation="horizontal">
        <label x-h-label for="horizontalDemo">Word</label>
        <input x-h-input id="horizontalDemo" placeholder="Something" />
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-orientation="horizontal">
        <label x-h-label for="horizontalDemo">Word</label>
        <input x-h-input id="horizontalDemo" placeholder="Something" />
      </div>
    </div>
  </fieldset>
</form>
```

### Horizontal field with description and error message

In horizontal orientation the label stays beside the input, while the error and description are shown below the input. When you type something in the input below, the error message will disappear and the description will be shown.

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset data-validate="immediate">
    <div x-h-field-group>
      <div x-h-field data-orientation="horizontal">
        <label x-h-label for="horizontalDescError">Word</label>
        <input x-h-input id="horizontalDescError" placeholder="Something" required />
        <p x-h-field-error>Must not be empty!</p>
        <p x-h-field-description data-hide-on-error="true">This field holds random text.</p>
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset data-validate="immediate">
    <div x-h-field-group>
      <div x-h-field data-orientation="horizontal">
        <label x-h-label for="horizontalDescError">Word</label>
        <input x-h-input id="horizontalDescError" placeholder="Something" required />
        <p x-h-field-error>Must not be empty!</p>
        <p x-h-field-description data-hide-on-error="true">This field holds random text.</p>
      </div>
    </div>
  </fieldset>
</form>
```

### Disabled field with enabled input

<br/>

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-disabled="true">
        <label x-h-label for="visuallyDisabled">Label Disabled</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input still active" />
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-disabled="true">
        <label x-h-label for="visuallyDisabled">Label Disabled</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input still active" />
      </div>
    </div>
  </fieldset>
</form>
```

### Disabled field with disabled input

<br/>

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-disabled="true">
        <label x-h-label for="visuallyDisabled">Label Disabled</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input inactive" disabled />
      </div>
    </div>
  </fieldset>
</form>
</component-container>
</ClientOnly>

```html
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-disabled="true">
        <label x-h-label for="visuallyDisabled">Label Disabled</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input inactive" disabled />
      </div>
    </div>
  </fieldset>
</form>
```
