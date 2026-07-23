# Step Indicator

Communicates progress through a sequence of steps, showing which steps are completed, which one is active, and which are still ahead. Useful for multi-step forms, wizards, and onboarding flows.

Part of the Harmonia Alpine.js component library. Every directive uses the `x-h-` prefix.

## Usage

Use a step indicator when a task is split into a clear, ordered sequence of steps. Steps are numbered starting from 1. The first item is step 1, the second is step 2, and so on. You keep the number of the currently active step in a variable in your Alpine scope and pass that variable to the component, so it stays in sync with "Next"/"Back" controls. Clicking a step also updates the variable, letting users jump straight to that step. The content of each marker is up to you: a number, an icon, or anything else.

For narrow spaces, set `data-collapsed="true"` to switch to a compact summary. Only the active step stays visible and the connectors hide, so the footprint stays roughly constant no matter how many steps there are. Add the optional counter and progress parts to show which step you are on. The collapsed layout keeps its constant footprint even with many steps, where a full row would otherwise overflow.

## Directives

`x-h-step-indicator` is the root. The directives compose one component and must be nested as shown in the Examples below (the library throws at runtime when a required ancestor is missing):

- `x-h-step-indicator`
- `x-h-step-indicator-item`
- `x-h-step-indicator-trigger`
- `x-h-step-indicator-marker`
- `x-h-step-indicator-content`
- `x-h-step-indicator-title`
- `x-h-step-indicator-description`
- `x-h-step-indicator-separator`
- `x-h-step-indicator-counter`
- `x-h-step-indicator-progress`

## API

### Attributes

#### x-h-step-indicator

| Attribute        | Type                         | Required | Description                                                                                                                                                                                             |
| ---------------- | ---------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `self`           | number                       | true     | A reference to the variable that holds the number of the active step. Clicking a step writes the new number to it.                                                                                      |
| data-orientation | `horizontal`<br />`vertical` | false    | Layout direction. Defaults to `horizontal`. Reactive, so you can bind it to switch orientation at runtime.                                                                                              |
| data-collapsed   | `true`<br />`false`          | false    | When `true`, switches to the compact summary. Only the active step stays visible, connectors hide, and the counter and progress parts appear. Reactive, so you can bind it. Works in both orientations. |

#### x-h-step-indicator-item

| Attribute | Type   | Required | Description                                                          |
| --------- | ------ | -------- | -------------------------------------------------------------------- |
| `self`    | number | true     | The number of this step. The first step is 1, the next 2, and so on. |

Each item exposes its state through a `data-state` attribute of `inactive`, `active`, or `completed`, which the child parts use for their styling.

#### x-h-step-indicator-trigger

| Attribute            | Type    | Required | Description                                                                                                                                                                                                          |
| -------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| data-non-interactive | boolean | false    | When `true`, clicking this step does not change the active step. A common use is to let users return to steps they have already passed while preventing them from skipping ahead to steps they have not reached yet. |

#### x-h-step-indicator-counter

Place inside the step indicator to show a "Step X of Y" label. It is only visible when the indicator is collapsed. The total is counted from the items automatically, so it works with `x-for`.

| Attribute       | Type   | Required | Description                                                    |
| --------------- | ------ | -------- | -------------------------------------------------------------- |
| data-step-label | string | false    | Word before the current step number. Defaults to `Step`.       |
| data-of-label   | string | false    | Word between the current step and the total. Defaults to `of`. |

#### x-h-step-indicator-progress

Place inside the step indicator to show a thin progress bar that fills to the active step over the total. It is only visible when the indicator is collapsed and needs no attributes.

## Examples

### Default

```html
<div x-data="{ step: 2, total: 3 }" class="vbox w-full gap-6">
  <div x-h-step-indicator="step">
    <div x-h-step-indicator-item="1">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>
          <svg x-h-icon data-icon="circle-user" role="img" aria-label="step account"></svg>
        </span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Account</span>
          <span x-h-step-indicator-description>Your details</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="2">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>
          <svg x-h-lucide role="img" aria-label="step address" data-lucide="map-pin"></svg>
        </span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Address</span>
          <span x-h-step-indicator-description>Shipping info</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="3">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>
          <svg x-h-lucide role="img" data-lucide="banknote" aria-label="step payment"></svg>
        </span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Payment</span>
          <span x-h-step-indicator-description>Confirm order</span>
        </span>
      </button>
    </div>
  </div>
  <div class="hbox justify-between gap-2">
    <button x-h-button data-variant="outline" @click="step = Math.max(step - 1, 1)" :disabled="step === 1">Back</button>
    <button x-h-button data-variant="primary" @click="step = Math.min(step + 1, total)" :disabled="step === total">Next</button>
  </div>
</div>
```

### Collapsed

Set `data-collapsed="true"` for a compact summary that keeps a constant footprint no matter how many steps there are. Only the active step stays visible, and the optional counter and progress parts show which step you are on. Bind `data-collapsed` to switch between the two layouts, as the toggle below does.

```html
<div x-data="{ step: 3, total: 5, collapsed: true }" class="vbox w-full gap-6">
  <div x-h-step-indicator="step" :data-collapsed="collapsed">
    <div x-h-step-indicator-item="1">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>1</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Account</span>
          <span x-h-step-indicator-description>Your details</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="2">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>2</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Address</span>
          <span x-h-step-indicator-description>Shipping info</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="3">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>3</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Payment</span>
          <span x-h-step-indicator-description>Confirm order</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="4">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>4</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Review</span>
          <span x-h-step-indicator-description>Check details</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="5">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>5</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Done</span>
          <span x-h-step-indicator-description>All set</span>
        </span>
      </button>
    </div>
    <div x-h-step-indicator-counter></div>
    <div x-h-step-indicator-progress></div>
  </div>
  <div class="hbox justify-between gap-2">
    <button x-h-button data-variant="outline" @click="step = Math.max(step - 1, 1)" :disabled="step === 1">Back</button>
    <button x-h-button data-variant="ghost" @click="collapsed = !collapsed" x-text="collapsed ? 'Expand' : 'Collapse'"></button>
    <button x-h-button data-variant="primary" @click="step = Math.min(step + 1, total)" :disabled="step === total">Next</button>
  </div>
</div>
```

### Markers only

```html
<div x-data="{ step: 2 }">
  <div x-h-step-indicator="step">
    <div x-h-step-indicator-item="1">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>1</span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="2">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>2</span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="3">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>3</span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="4">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>4</span>
      </button>
    </div>
  </div>
</div>
```

### Generated with x-for

Because each item's step is an expression, you can generate the steps from an array with `x-for`, deriving the step number from the loop index.

```html
<div x-data="{ step: 2, steps: ['Account', 'Address', 'Payment'] }" class="vbox w-full gap-6">
  <div x-h-step-indicator="step">
    <template x-for="(label, i) in steps" :key="i">
      <div x-h-step-indicator-item="i + 1">
        <button x-h-step-indicator-trigger>
          <span x-h-step-indicator-marker x-text="i + 1"></span>
          <span x-h-step-indicator-content>
            <span x-h-step-indicator-title x-text="label"></span>
          </span>
        </button>
        <div x-h-step-indicator-separator x-show="i < steps.length - 1"></div>
      </div>
    </template>
  </div>
  <div class="hbox justify-between gap-2">
    <button x-h-button data-variant="outline" @click="step = Math.max(step - 1, 1)" :disabled="step === 1">Back</button>
    <button x-h-button data-variant="primary" @click="step = Math.min(step + 1, steps.length)" :disabled="step === steps.length">Next</button>
  </div>
</div>
```

### Vertical

```html
<div x-data="{ step: 2 }">
  <div x-h-step-indicator="step" data-orientation="vertical">
    <div x-h-step-indicator-item="1">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>1</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Account</span>
          <span x-h-step-indicator-description>Your details</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="2">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>2</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Address</span>
          <span x-h-step-indicator-description>Shipping info</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="3">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>3</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Payment</span>
          <span x-h-step-indicator-description>Confirm order</span>
        </span>
      </button>
    </div>
  </div>
</div>
```

### Disabled trigger

```html
<div x-data="{ step: 2 }">
  <div x-h-step-indicator="step">
    <div x-h-step-indicator-item="1">
      <button x-h-step-indicator-trigger disabled>
        <span x-h-step-indicator-marker>1</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Account</span>
          <span x-h-step-indicator-description>Your details</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
    <div x-h-step-indicator-item="2">
      <button x-h-step-indicator-trigger>
        <span x-h-step-indicator-marker>2</span>
        <span x-h-step-indicator-content>
          <span x-h-step-indicator-title>Address</span>
          <span x-h-step-indicator-description>Shipping info</span>
        </span>
      </button>
      <div x-h-step-indicator-separator></div>
    </div>
  </div>
</div>
```

Full docs: https://www.codbex.com/harmonia/components/step-indicator.html

## Notes

- Directive values are Alpine expressions, so quote string literals: `x-h-...="'Label'"`.
- Components render only after Alpine has registered Harmonia. See SKILL.md for setup.
