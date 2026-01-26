# Fieldset

A container that groups related form elements, including labels, controls, and helper text, to create accessible and organized input sections. Fieldsets improve the structure and clarity of complex forms.

## Usage

Use fieldsets to logically group related inputs, such as multiple options within a survey or sections of a settings form. Each fieldset should include a descriptive legend or label to maintain accessibility and provide context for users navigating the form.

## API Reference

### Component attubute(s)

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
| data-orientation | `vertical`<br/>`horizontal`<br/>`responsive` | false    | Changes the aligment of the label and input.                              |

#### x-h-field-description

| Attribute          | Values  | Required | Description                                                                                                        |
| ------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| data-hide-on-error | boolean | false    | When enabled, the description will be hidden when the input is invalid, and the error message will appear instead. |

### Modifiers

#### x-h-legend

| Modifier | Description                    |
| -------- | ------------------------------ |
| label    | Makes the legend text smaller. |

## Examples

<ClientOnly>
<component-container data-html="/components/fieldset/full.html">
</component-container>
</ClientOnly>

```html
<form>
  <div x-h-field-group>
    <fieldset x-h-fieldset>
      <legend x-h-legend>Card Payment</legend>
      <p x-h-field-description>Enter your card and billing information</p>
      <div x-h-field-group>
        <div x-h-field>
          <label x-h-label.field for="formCardName" data-state="checked">Name on Card</label>
          <input x-h-input id="formCardName" placeholder="John Doe" required />
        </div>
        <div x-h-field>
          <label x-h-label.field for="formCardNumber">Card Number</label>
          <input x-h-input type="text" id="formCardNumber" placeholder="2141 9614 2401 7895" required />
          <p x-h-field-error>Enter your 16-digit card number</p>
          <p x-h-field-description data-hide-on-error="true">This is just a demo. Do NOT enter your real card number.</p>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div x-h-field>
            <label x-h-label.field for="formCardMonth">Month</label>
            <div x-h-select>
              <input data-id="formCardMonth" x-h-select-input placeholder="MM" required />
              <div x-h-select-content>
                <div x-h-select-option="'01'" data-value="01"></div>
                <div x-h-select-option="'02'" data-value="02"></div>
                <div x-h-select-option="'03'" data-value="03"></div>
                <div x-h-select-option="'04'" data-value="04"></div>
                <div x-h-select-option="'05'" data-value="05"></div>
                <div x-h-select-option="'06'" data-value="06"></div>
                <div x-h-select-option="'07'" data-value="07"></div>
                <div x-h-select-option="'08'" data-value="08"></div>
                <div x-h-select-option="'09'" data-value="09"></div>
                <div x-h-select-option="'10'" data-value="10"></div>
                <div x-h-select-option="'11'" data-value="11"></div>
                <div x-h-select-option="'12'" data-value="12"></div>
              </div>
            </div>
          </div>
          <div x-h-field>
            <label x-h-label.field for="formCardYear">Year</label>
            <div x-h-select>
              <input data-id="formCardYear" x-h-select-input placeholder="YYYY" required />
              <div
                x-h-select-content
                x-data="{
                  years: (() => {
                    let year = new Date().getFullYear();
                    let allYears = [];
                    for (let y = 0; y <= 10; y++) allYears.push(year + y);
                    return allYears;
                  })(),
                }"
              >
                <template x-for="year in years">
                  <div x-h-select-option="year" :data-value="year"></div>
                </template>
              </div>
            </div>
          </div>
          <div x-h-field>
            <label x-h-label.field for="formCVV">CVV</label>
            <input x-h-input id="formCVV" placeholder="123" required />
          </div>
        </div>
      </div>
    </fieldset>
    <div x-h-separator data-orientation="horizontal"></div>
    <fieldset x-h-fieldset>
      <legend x-h-legend>Delivery time</legend>
      <p x-h-field-description>The date and time when the package will be delivered to you</p>
      <div x-h-field-group>
        <div class="grid grid-cols-2 gap-4">
          <div x-h-field>
            <label x-h-label.field for="delivery-dp">Date</label>
            <div x-h-date-picker>
              <input type="text" id="delivery-dp" required />
              <button x-h-date-picker-trigger aria-label="Choose date"></button>
              <div x-h-calendar></div>
            </div>
          </div>
          <div x-h-field>
            <label x-h-label.field for="delivery-tp">Time</label>
            <div x-h-time-picker>
              <input type="text" id="delivery-tp" x-h-time-picker-input required />
              <div x-h-time-picker-popup></div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
    <div x-h-separator data-orientation="horizontal"></div>
    <fieldset x-h-fieldset>
      <legend x-h-legend>Billing Address</legend>
      <p x-h-field-description>The billing address associated with your payment method</p>
      <div x-h-field-group>
        <div x-h-field data-orientation="horizontal">
          <span x-h-checkbox>
            <input type="checkbox" id="formShippingCheckbox" checked />
          </span>
          <label x-h-label.field for="formShippingCheckbox" class="font-normal">Same as shipping address</label>
        </div>
      </div>
    </fieldset>
    <fieldset x-h-fieldset>
      <div x-h-field-group>
        <div x-h-field>
          <label x-h-label.field for="formComments">Comments</label>
          <textarea x-h-textarea id="formComments" placeholder="Add any additional comments" class="resize-none"></textarea>
        </div>
      </div>
    </fieldset>
    <div x-h-field data-orientation="horizontal">
      <span class="flex-1"></span>
      <button x-h-button data-variant="primary" type="submit">Submit</button>
      <button x-h-button data-variant="outline" type="button">Cancel</button>
    </div>
  </div>
</form>
```

### Invalid field with error message

When you type something in the input below, it will no longer be invalid and the error message will disappear.

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field>
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Invalid</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input invalid" required/>
        <p x-h-field-error>The input is cannot be empty</p>
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
      <div x-h-field>
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Invalid</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input invalid" required />
        <p x-h-field-error>The input is cannot be empty</p>
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
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Label Disabled</label>
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
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Label Disabled</label>
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
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Label Disabled</label>
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
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Label Disabled</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input inactive" disabled />
      </div>
    </div>
  </fieldset>
</form>
```
