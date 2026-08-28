import { disabledControlClasses, invalidControlClasses } from '../common/shared-classes';
import uuidv4 from '../utils/uuid';
import { Minus, Plus, createSvg } from './../common/icons';
import { sizeObserver } from './../common/input-size';
export default function (Alpine) {
  Alpine.directive('h-input', (el, { modifiers }, { cleanup }) => {
    el.classList.add(
      'file:text-foreground',
      'placeholder:text-muted-foreground',
      'selection:bg-primary',
      'selection:text-primary-foreground',
      'border-input',
      'min-w-0',
      "[&:not([type='color'])]:px-3",
      "[&:not([type='color'])]:py-1",
      "[&[type='color']]:overflow-hidden",
      '[&::-moz-color-swatch]:border-0',
      '[&::-webkit-color-swatch]:border-0',
      '[&::-webkit-color-swatch-wrapper]:rounded-0',
      '[&::-webkit-color-swatch-wrapper]:p-0',
      'text-base',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'outline-none',
      'file:inline-flex',
      'file:h-7',
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium',
      ...disabledControlClasses,
      'disabled:cursor-not-allowed',
      '[&[readonly]]:bg-muted',
      'md:text-sm',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      ...invalidControlClasses
    );
    if (modifiers.includes('group')) {
      el.classList.add('h-full', 'flex-1', 'rounded-none', 'border-0', 'bg-transparent', 'shadow-none', 'focus-visible:ring-0');
      el.setAttribute('data-slot', 'input-group-control');
    } else if (modifiers.includes('table')) {
      el.classList.add(
        'size-full',
        'h-10',
        'focus-visible:inset-ring-ring/50',
        'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
        'aria-invalid:inset-ring-negative/20',
        'dark:aria-invalid:inset-ring-negative/40',
        'user-invalid:inset-ring-negative/20!',
        'dark:user-invalid:inset-ring-negative/40!',
        '[[data-validate=immediate]_&:invalid]:inset-ring-negative/20!',
        'dark:[[data-validate=immediate]_&:invalid]:inset-ring-negative/40!'
      );
      el.setAttribute('data-slot', 'cell-input');
    } else {
      el.classList.add('w-full', 'rounded-control', 'border', 'bg-input-inner', 'shadow-input', 'focus-visible:ring-[calc(var(--spacing)*0.75)]');
      el.setAttribute('data-slot', 'input');

      const observer = sizeObserver(el);

      cleanup(() => {
        observer.disconnect();
      });
    }
  });

  Alpine.directive('h-input-group', (el, _, { cleanup }) => {
    el.classList.add(
      'group/input-group',
      'border-input',
      'bg-input-inner',
      'relative',
      'flex',
      'w-full',
      'items-center',
      'rounded-control',
      'border',
      'shadow-input',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'outline-none',
      'min-w-0',
      'has-[>textarea]:h-auto',
      'has-[>[data-align=inline-start]]:[&>input]:pl-2',
      'has-[>[data-align=inline-end]]:[&>input]:pr-2',
      'has-[>[data-align=block-start]]:h-auto',
      'has-[>[data-align=block-start]]:flex-col',
      'has-[>[data-align=block-start]]:[&>input]:pb-3',
      'has-[>[data-align=block-end]]:h-auto',
      'has-[>[data-align=block-end]]:flex-col',
      'has-[>[data-align=block-end]]:[&>input]:pt-3',
      'has-[[data-slot=input-group-control]:focus-visible]:border-ring',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50',
      'has-[[data-slot=input-group-control]:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
      'has-[[data-slot][aria-invalid=true]]:ring-negative/20',
      'has-[[data-slot][aria-invalid=true]]:border-negative',
      'dark:has-[[data-slot][aria-invalid=true]]:ring-negative/40'
    );
    el.setAttribute('role', 'group');
    el.setAttribute('data-slot', 'input-group');

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-input-group-addon', (el, _, { cleanup }) => {
    el.classList.add(
      'text-muted-foreground',
      'flex',
      'h-auto',
      'cursor-text',
      'items-center',
      'justify-center',
      'gap-2',
      'text-sm',
      'font-medium',
      'select-none',
      "[&>svg:not([class*='size-'])]:size-4",
      '[&>[data-slot=tag]]:rounded-[calc(var(--radius)-5px)]',
      'data-[disabled=true]:opacity-disabled',
      'data-[disabled=true]:pointer-events-none'
    );
    el.setAttribute('role', 'group');
    el.setAttribute('data-slot', 'input-group-addon');

    const variants = {
      'inline-start': [
        'order-first',
        'pl-3',
        '[[data-slot=input-group][data-size=sm]_&]:pl-1.25',
        'has-[>button]:pl-1.25',
        '[[data-slot=input-group][data-size=sm]_&]:has-[>button]:pl-0.5',
        'has-[>[data-slot|=tag]]:pl-1.5',
        '[[data-slot=input-group][data-size=sm]_&]:has-[>[data-slot|=tag]]:pl-0.5',
      ],
      'inline-end': [
        'order-last',
        'pr-3',
        '[[data-slot=input-group][data-size=sm]_&]:pr-1.25',
        'has-[>button]:pr-1.25',
        '[[data-slot=input-group][data-size=sm]_&]:has-[>button]:pr-0.5',
        'has-[>[data-slot|=tag]]:pr-1.5',
        '[[data-slot=input-group][data-size=sm]_&]:has-[>[data-slot|=tag]]:pr-0.5',
      ],
      'block-start': ['order-first', 'w-full', 'justify-start', 'px-3', 'pt-3', '[.border-b]:pb-3', 'group-has-[>input]/input-group:pt-2.5'],
      'block-end': ['order-last', 'w-full', 'justify-start', 'px-3', 'pb-3', '[.border-t]:pt-3', 'group-has-[>input]/input-group:pb-2.5'],
    };

    function setVariant(variant) {
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
    }

    setVariant(el.getAttribute('data-align') ?? 'inline-start');

    const handler = (event) => {
      if (event.target.closest('button')) {
        return;
      }
      let input = event.currentTarget.parentElement?.querySelector('input');
      if (!input) input = event.currentTarget.parentElement?.querySelector('textarea');
      input?.focus();
    };

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-input-group-text', (el) => {
    el.classList.add('text-muted-foreground', 'flex', 'items-center', 'gap-2', 'text-sm', 'svg-defaults');
    el.setAttribute('data-slot', 'label');
  });

  Alpine.directive('h-input-number', (el, { original, modifiers }, { cleanup }) => {
    const inTable = modifiers.includes('table');
    el.classList.add(
      'overflow-hidden',
      'group/input-number',
      'border-input',
      'relative',
      'flex',
      'items-center',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'duration-200',
      'outline-none',
      'min-w-0',
      'has-[input:disabled]:pointer-events-none',
      'has-[input:disabled]:cursor-not-allowed',
      'has-[input:disabled]:opacity-disabled',
      'has-[input[readonly]]:bg-muted'
    );
    if (inTable) {
      el.classList.add(
        'size-full',
        'h-10',
        'has-[input:focus-visible]:inset-ring-ring/50',
        'has-[input:focus-visible]:inset-ring-[calc(var(--spacing)*0.75)]',
        'has-[input[aria-invalid=true]]:inset-ring-negative/20',
        'has-[input[aria-invalid=true]]:border-negative',
        'dark:has-[input[aria-invalid=true]]:inset-ring-negative/40',
        'has-[input:user-invalid]:inset-ring-negative/20',
        'has-[input:user-invalid]:border-negative',
        'dark:has-[input:user-invalid]:inset-ring-negative/40',
        '[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/20',
        '[[data-validate=immediate]_&:has(input:invalid)]:border-negative',
        'dark:[[data-validate=immediate]_&:has(input:invalid)]:inset-ring-negative/40'
      );
      el.setAttribute('data-slot', 'cell-input-number');
    } else {
      el.classList.add(
        'w-full',
        'rounded-control',
        'border',
        'bg-input-inner',
        'shadow-input',
        'has-[input:focus-visible]:border-ring',
        'has-[input:focus-visible]:ring-ring/50',
        'has-[input:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
        'has-[input[aria-invalid=true]]:ring-negative/20',
        'has-[input[aria-invalid=true]]:border-negative',
        'dark:has-[input[aria-invalid=true]]:ring-negative/40',
        'has-[input:user-invalid]:ring-negative/20',
        'has-[input:user-invalid]:border-negative',
        'dark:has-[input:user-invalid]:ring-negative/40',
        '[[data-validate=immediate]_&:has(input:invalid)]:ring-negative/20',
        '[[data-validate=immediate]_&:has(input:invalid)]:border-negative',
        'dark:[[data-validate=immediate]_&:has(input:invalid)]:ring-negative/40'
      );
      el.setAttribute('data-slot', 'input-number');
    }
    el.setAttribute('role', 'group');
    const input = el.querySelector('input');
    if (!input || input.getAttribute('type') !== 'number') {
      throw new Error(`${original} must contain an input of type 'number'`);
    }
    if (!input.hasAttribute('inputmode')) input.setAttribute('inputmode', 'decimal');
    if (!input.hasAttribute('aria-roledescription')) {
      input.setAttribute('aria-roledescription', 'Number field');
    }

    if (!input.hasAttribute('id')) {
      input.setAttribute('id', `in${uuidv4()}`);
    }
    input.setAttribute('tabindex', '0');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('spellcheck', 'off');
    input.setAttribute('data-slot', 'input-number-control');
    input.classList.add('size-full', 'px-3', 'py-1', 'outline-none');
    if (inTable) input.classList.add('min-w-0', 'flex-1');

    let restoreForceModelUpdate = null;
    let destroyed = false;
    // x-model on the inner input initializes after this handler (parent-first
    // walk). A microtask runs after the walk, the same timing Alpine's own
    // x-modelable relies on.
    queueMicrotask(() => {
      if (destroyed) return;
      const original = input._x_forceModelUpdate;
      if (!original) return;
      const wrapped = (value) => {
        // While the browser holds a bad-input editing buffer (e.g. a typed
        // decimal separator the number widget rejects), any value write would
        // destroy the user's visible text. Skip only while the user is editing
        // so an external model change after blur still heals the display.
        if (input.validity.badInput && input.getRootNode().activeElement === input) return;
        original(value);
      };
      input._x_forceModelUpdate = wrapped;
      restoreForceModelUpdate = () => {
        if (input._x_forceModelUpdate === wrapped) input._x_forceModelUpdate = original;
      };
    });

    // The number widget silently drops a typed decimal separator it does not
    // accept, so the field can end up holding a different number than the user
    // typed (typing 123,5 can become 1235). The drop leaves no trace in the
    // value or the validity state, but its beforeinput fires without a matching
    // input event, so pair the two per keystroke and flag the input as invalid
    // until the entry is revised.
    let pendingSeparator = null;
    let separatorTimer;
    let valueBefore = input.value;
    let flagged = false;

    const disarm = () => {
      clearTimeout(separatorTimer);
      pendingSeparator = null;
    };

    // Only ever remove a message this directive installed, never a consumer's.
    const clearFlag = () => {
      if (!flagged) return;
      input.setCustomValidity('');
      flagged = false;
    };

    const flagDroppedSeparator = () => {
      if (pendingSeparator === null) return;
      input.setCustomValidity(el.getAttribute('data-invalid-label') || 'A typed decimal separator was not recognized.');
      flagged = true;
      pendingSeparator = null;
    };

    const onBeforeInput = (event) => {
      // beforeinput fires before the value changes, so this read is always
      // fresh even after Alpine rewrote the value without an input event.
      valueBefore = input.value;
      if (event.inputType !== 'insertText' || event.isComposing) return;
      if (typeof event.data !== 'string' || !/[.,]/.test(event.data)) return;
      if (input.readOnly || input.disabled) return;
      // With a separator already held by the field a second one is dropped
      // natively in every locale, which is not worth flagging. A blocked
      // re-arm must leave an already armed timer alive.
      if (input.validity.badInput || String(input.value).includes('.')) return;
      clearTimeout(separatorTimer);
      pendingSeparator = event.data;
      // The keystroke's own input event runs in the same task while timers run
      // in a later one, so an accepted separator always disarms this in time.
      separatorTimer = setTimeout(flagDroppedSeparator);
    };

    const onInput = (event) => {
      const isInsert = event instanceof InputEvent && event.inputType === 'insertText' && typeof event.data === 'string' && event.data.length > 0;
      const pairedAccept = pendingSeparator !== null && isInsert && event.data === pendingSeparator;
      // Digits appended right after a dropped separator are the corruption
      // this guard exists for, the only edit that keeps the flag alive. Every
      // other edit counts as a revision and clears, so unknown event shapes
      // can never strand a stale flag.
      const digitAppend = isInsert && !/[.,]/.test(event.data) && input.value.length > valueBefore.length;
      if (pairedAccept || !digitAppend) {
        disarm();
        clearFlag();
      }
      valueBefore = input.value;
    };

    input.addEventListener('beforeinput', onBeforeInput);
    input.addEventListener('input', onInput);

    const form = input.form;
    const onFormReset = () => {
      disarm();
      clearFlag();
    };
    if (form) form.addEventListener('reset', onFormReset);

    const buildStepButton = (icon, label) => {
      const btn = document.createElement('button');
      btn.setAttribute('type', 'button');
      btn.setAttribute('tabIndex', '-1');
      btn.setAttribute('aria-label', label);
      btn.setAttribute('aria-controls', input.getAttribute('id'));
      btn.appendChild(
        createSvg({
          icon,
          classes: 'opacity-70 text-inherit size-4 shrink-0 pointer-events-none',
          attrs: {
            'aria-hidden': true,
            role: 'presentation',
          },
        })
      );
      btn.classList.add(
        'inline-flex',
        'items-center',
        'justify-center',
        'cursor-pointer',
        'border-input',
        'transition-colors',
        'motion-reduce:transition-none',
        'duration-100',
        'bg-transparent',
        'hover:bg-secondary',
        'hover:text-secondary-foreground',
        'active:bg-secondary-active',
        'active:text-secondary-foreground',
        'outline-none',
        'relative',
        '[&:hover>svg]:text-secondary-foreground'
      );
      return btn;
    };

    const invalidBorderClasses = ['[input[aria-invalid=true]~&]:border-negative', '[input:user-invalid~&]:border-negative', '[[data-validate=immediate]_input:invalid~&]:border-negative'];
    const readonlyHide = 'group-has-[input[readonly]]/input-number:hidden';

    const stepDown = buildStepButton(Minus, 'Decrease');
    stepDown.setAttribute('data-slot', 'step-down-trigger');
    const stepUp = buildStepButton(Plus, 'Increase');
    stepUp.setAttribute('data-slot', 'step-up-trigger');

    if (inTable) {
      // Stack the steppers into a single narrow column so they never overlap the
      // number when the cell is narrow (Plus on top, Minus below).
      const steppers = document.createElement('div');
      steppers.setAttribute('data-slot', 'step-controls');
      // The inner dividers appear only when the table draws horizontal row lines
      // (data-borders="rows"/"both"); a borderless or column-only table reads as
      // fully borderless.
      steppers.classList.add('flex', 'flex-col', 'h-full', 'w-6', 'shrink-0', '[table[data-borders=rows]_&]:border-l', '[table[data-borders=both]_&]:border-l', 'border-input', readonlyHide, ...invalidBorderClasses);
      stepUp.classList.add('w-full', 'flex-1');
      stepDown.classList.add('w-full', 'flex-1', '[table[data-borders=rows]_&]:border-t', '[table[data-borders=both]_&]:border-t', 'border-input');
      steppers.appendChild(stepUp);
      steppers.appendChild(stepDown);
      el.appendChild(steppers);
    } else {
      for (const btn of [stepDown, stepUp]) {
        btn.classList.add('border-l', 'h-full', 'aspect-square', readonlyHide, ...invalidBorderClasses);
      }
      el.appendChild(stepDown);
      el.appendChild(stepUp);
    }

    const attrNumber = (name) => {
      const raw = input.getAttribute(name);
      if (raw === null || raw === '' || raw === 'any') return null;
      const parsed = parseFloat(raw);
      return isNaN(parsed) ? null : parsed;
    };

    const clamp = (value) => {
      const min = attrNumber('min');
      const max = attrNumber('max');
      if (min !== null && value < min) return min;
      if (max !== null && value > max) return max;
      return value;
    };

    const onStepDown = () => {
      if (input.readOnly || input.disabled) return;
      if (input.step === 'any') {
        input.value = clamp((parseFloat(input.value) || 0) - 1);
      } else input.stepDown();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    stepDown.addEventListener('click', onStepDown);

    const onStepUp = () => {
      if (input.readOnly || input.disabled) return;
      if (input.step === 'any') {
        input.value = clamp((parseFloat(input.value) || 0) + 1);
      } else input.stepUp();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    stepUp.addEventListener('click', onStepUp);

    const observer = sizeObserver(el);

    cleanup(() => {
      destroyed = true;
      if (restoreForceModelUpdate) restoreForceModelUpdate();
      disarm();
      clearFlag();
      input.removeEventListener('beforeinput', onBeforeInput);
      input.removeEventListener('input', onInput);
      if (form) form.removeEventListener('reset', onFormReset);
      observer.disconnect();
      stepDown.removeEventListener('click', onStepDown);
      stepUp.removeEventListener('click', onStepUp);
    });
  });
}
