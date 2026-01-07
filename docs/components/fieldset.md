# Fieldset

This is a container that combines labels, controls, and text to compose accessible form fields and grouped inputs.

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
| data-invalid     | boolean                                      | false    | Indicates that the field is invalid.                                      |
| data-disabled    | boolean                                      | false    | Applies a disabled style to the field and label. Does NOT disable inputs. |
| data-orientation | `vertical`<br/>`horizontal`<br/>`responsive` | false    | Changes the aligment of the label and input.                              |

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
          <input x-h-input id="formCardName" placeholder="Evil Rabbit" required />
        </div>
        <div x-h-field>
          <label x-h-label.field for="formCardNumber">Card Number</label>
          <input x-h-input id="formCardNumber" placeholder="2141 9614 2401 7895" required />
          <p x-h-field-description>Enter your 16-digit card number</p>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div x-h-field>
            <label x-h-label.field for="formCardMonth">Month</label>
            <div x-h-select>
              <button id="formCardMonth" x-h-select-trigger placeholder="MM"></button>
              <div x-h-select-content>
                <div x-h-select-option="'01'" value="01"></div>
                <div x-h-select-option="'02'" value="02"></div>
                <div x-h-select-option="'03'" value="03"></div>
                <div x-h-select-option="'04'" value="04"></div>
                <div x-h-select-option="'05'" value="05"></div>
                <div x-h-select-option="'06'" value="06"></div>
                <div x-h-select-option="'07'" value="07"></div>
                <div x-h-select-option="'08'" value="08"></div>
                <div x-h-select-option="'09'" value="09"></div>
                <div x-h-select-option="'10'" value="10"></div>
                <div x-h-select-option="'11'" value="11"></div>
                <div x-h-select-option="'12'" value="12"></div>
              </div>
            </div>
          </div>
          <div x-h-field>
            <label x-h-label.field for="formCardYear">Year</label>
            <div x-h-select>
              <button id="formCardYear" x-h-select-trigger placeholder="YYYY"></button>
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
                  <div x-h-select-option="year" :value="year"></div>
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

### Invalid field

<br/>

<ClientOnly>
<component-container>
<form>
  <fieldset x-h-fieldset>
    <div x-h-field-group>
      <div x-h-field data-invalid="true">
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Invalid</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input invalid" required aria-invalid="true" />
        <p x-h-text.xs>The input is required</p>
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
      <div x-h-field data-invalid="true">
        <label x-h-label.field for="visuallyDisabled" data-state="checked">Invalid</label>
        <input x-h-input id="visuallyDisabled" placeholder="Input invalid" />
        <p x-h-text.xs>The input is required</p>
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
        <input x-h-input id="visuallyDisabled" placeholder="Input still active" disabled />
      </div>
    </div>
  </fieldset>
</form>
```
