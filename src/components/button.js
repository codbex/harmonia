import { findAncestorState } from '../common/ancestor';
import { rejectModelEventModifiers } from '../common/model';
import { disabledControlClasses } from '../common/shared-classes';

export const buttonVariants = {
  default: [
    'bg-secondary',
    'text-secondary-foreground',
    'fill-secondary-foreground',
    'shadow-button',
    'hover:bg-secondary-hover',
    'active:bg-secondary-active',
    'aria-pressed:bg-secondary-active',
    'active:data-[toggled=true]:bg-secondary-active',
    'hover:data-[toggled=true]:bg-secondary-hover',
    'data-[toggled=true]:bg-secondary-active',
  ],
  primary: [
    'bg-primary',
    'text-primary-foreground',
    'fill-primary-foreground',
    'shadow-button',
    'focus-visible:outline-primary/50',
    'hover:bg-primary-hover',
    'active:bg-primary-active',
    'aria-pressed:bg-primary-active',
    'active:data-[toggled=true]:bg-primary-active',
    'hover:data-[toggled=true]:bg-primary-hover',
    'data-[toggled=true]:bg-primary-active',
  ],
  positive: [
    'bg-positive',
    'text-positive-foreground',
    'fill-positive-foreground',
    'shadow-button',
    'focus-visible:outline-positive/50',
    'hover:bg-positive-hover',
    'active:bg-positive-active',
    'aria-pressed:bg-positive-active',
    'active:data-[toggled=true]:bg-positive-active',
    'hover:data-[toggled=true]:bg-positive-hover',
    'data-[toggled=true]:bg-positive-active',
  ],
  negative: [
    'bg-negative',
    'text-negative-foreground',
    'fill-negative-foreground',
    'shadow-button',
    'focus-visible:outline-negative/50',
    'hover:bg-negative-hover',
    'active:bg-negative-active',
    'aria-pressed:bg-negative-active',
    'active:data-[toggled=true]:bg-negative-active',
    'hover:data-[toggled=true]:bg-negative-hover',
    'data-[toggled=true]:bg-negative-active',
  ],
  warning: [
    'bg-warning',
    'text-warning-foreground',
    'fill-warning-foreground',
    'shadow-button',
    'focus-visible:outline-warning/50',
    'hover:bg-warning-hover',
    'active:bg-warning-active',
    'aria-pressed:bg-warning-active',
    'active:data-[toggled=true]:bg-warning-active',
    'hover:data-[toggled=true]:bg-warning-hover',
    'data-[toggled=true]:bg-warning-active',
  ],
  information: [
    'bg-information',
    'text-information-foreground',
    'fill-information-foreground',
    'shadow-button',
    'focus-visible:outline-information/50',
    'hover:bg-information-hover',
    'active:bg-information-active',
    'aria-pressed:bg-information-active',
    'active:data-[toggled=true]:bg-information-active',
    'hover:data-[toggled=true]:bg-information-hover',
    'data-[toggled=true]:bg-information-active',
  ],
  outline: [
    'border',
    'bg-background',
    'text-foreground',
    'fill-foreground',
    'hover:bg-secondary',
    'hover:text-secondary-foreground',
    'hover:fill-secondary-foreground',
    'active:bg-secondary-active',
    'active:text-secondary-foreground',
    'active:fill-secondary-foreground',
    'aria-pressed:bg-secondary-active',
    'aria-pressed:text-secondary-foreground',
    'aria-pressed:fill-secondary-foreground',
    'active:data-[toggled=true]:bg-secondary-active',
    'active:data-[toggled=true]:text-secondary-foreground',
    'active:data-[toggled=true]:fill-secondary-foreground',
    'hover:data-[toggled=true]:bg-secondary-hover',
    'hover:data-[toggled=true]:text-secondary-foreground',
    'hover:data-[toggled=true]:fill-secondary-foreground',
    'data-[toggled=true]:bg-secondary-active',
    'data-[toggled=true]:text-secondary-foreground',
    'data-[toggled=true]:fill-secondary-foreground',
  ],
  transparent: [
    'bg-transparent',
    'text-foreground',
    'fill-foreground',
    'shadow-none',
    'hover:bg-secondary',
    'hover:text-secondary-foreground',
    'hover:fill-secondary-foreground',
    'active:bg-secondary-active',
    'active:text-secondary-foreground',
    'active:fill-secondary-foreground',
    'aria-pressed:bg-secondary-active',
    'aria-pressed:text-secondary-foreground',
    'aria-pressed:fill-secondary-foreground',
    'active:data-[toggled=true]:bg-secondary-active',
    'active:data-[toggled=true]:text-secondary-foreground',
    'active:data-[toggled=true]:fill-secondary-foreground',
    'hover:data-[toggled=true]:bg-secondary-hover',
    'hover:data-[toggled=true]:text-secondary-foreground',
    'hover:data-[toggled=true]:fill-secondary-foreground',
    'data-[toggled=true]:bg-secondary-active',
    'data-[toggled=true]:text-secondary-foreground',
    'data-[toggled=true]:fill-secondary-foreground',
  ],
  link: ['text-primary', 'underline-offset-4', 'hover:underline'],
};

export const setButtonClasses = (el) => {
  el.classList.add(
    'cursor-pointer',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-2',
    'whitespace-nowrap',
    'rounded-control',
    'text-sm',
    'font-medium',
    'transition-all',
    'duration-100',
    'motion-reduce:transition-none',
    ...disabledControlClasses,
    'svg-defaults',
    'shrink-0',
    'outline-ring/50',
    'focus-outline'
  );
};

export const getButtonSize = (size, isAddon = false) => {
  switch (size) {
    case 'sm':
      return isAddon
        ? ['h-6', '[[data-slot=input-group][data-size=sm]_&]:h-5', 'gap-1', 'px-2', "[&>svg:not([class*='size-'])]:size-3.5", 'has-[>svg]:px-2', 'has-[>[data-slot=spinner]]:px-2']
        : ['h-6.5', 'gap-1.5', 'px-2.5', 'has-[>svg]:px-2', 'has-[>[data-slot=spinner]]:px-2'];
    case 'md':
      return isAddon ? ['h-8', 'px-2.5', 'gap-1.5', 'has-[>svg]:px-2.5', 'has-[>[data-slot=spinner]]:px-2.5'] : ['h-8', 'gap-1.5', 'px-3', 'has-[>svg]:px-2.5', 'has-[>[data-slot=spinner]]:px-2.5'];
    case 'icon-sm':
      return isAddon ? ['size-6', '[[data-slot=input-group][data-size=sm]_&]:size-5', 'p-0', 'has-[>svg]:p-0', 'has-[>[data-slot=spinner]]:p-0'] : ['size-6.5'];
    case 'icon-md':
      return isAddon ? ['size-8', 'p-0', 'has-[>svg]:p-0'] : ['size-8'];
    case 'icon':
      return ['size-9'];
    default:
      return ['h-9', 'px-4', 'py-2', 'has-[>svg]:px-3', 'has-[>[data-slot=spinner]]:px-3'];
  }
};

export default function (Alpine) {
  Alpine.directive('h-button', (el, { original, modifiers }, { cleanup }) => {
    setButtonClasses(el);
    if (!el.hasAttribute('data-slot')) {
      el.setAttribute('data-slot', 'button');
    }

    const isAddon = modifiers.includes('addon');

    let lastSize;

    function setVariant(variant) {
      for (const [_, value] of Object.entries(buttonVariants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(buttonVariants, variant)) el.classList.add(...buttonVariants[variant]);
    }

    function setSize(size = 'default') {
      el.classList.remove(...getButtonSize(lastSize, isAddon));
      el.classList.add(...getButtonSize(size, isAddon));
      if (size.startsWith('icon') && !el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
        console.error(`${original}: Icon-only buttons must have an "aria-label" or "aria-labelledby" attribute`, el);
      }
      lastSize = size;
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');
    if (isAddon) {
      el.classList.remove('shadow-button', 'inline-flex');
      el.classList.add('shadow-none', 'flex');
      setSize(el.getAttribute('data-size') ?? 'sm');
    } else {
      if (el.hasAttribute('data-size')) {
        setSize(el.getAttribute('data-size'));
      } else {
        if (['date-picker-trigger', 'time-picker-trigger'].includes(el.getAttribute('data-slot'))) {
          setSize('icon-sm');
        } else {
          setSize();
        }
      }
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-variant') setVariant(el.getAttribute('data-variant') ?? 'default');
        else setSize(el.getAttribute('data-size') ?? (isAddon ? 'sm' : 'default'));
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-size'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-button-group', (el, { original }, { cleanup }) => {
    el.classList.add(
      'flex',
      'w-fit',
      'items-stretch',
      '[&>*]:focus-visible:z-10',
      '[&>*]:focus-visible:relative',
      "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit",
      '[&>input]:flex-1',
      'has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-control',
      'data-[borderless=true]:[&>*]:rounded-none'
    );

    // An x-model turns the group into a single choice, where the bound value is
    // the value of the selected button. Alpine initializes x-model ahead of its
    // own unknown directives, so the marker is already on the element here.
    const isSingleChoice = Object.prototype.hasOwnProperty.call(el, '_x_model');

    if (!el.hasAttribute('role')) el.setAttribute('role', isSingleChoice ? 'radiogroup' : 'group');
    el.setAttribute('data-slot', 'button-group');
    const variants = {
      horizontal: [
        '[&>*:not(:first-child)]:rounded-l-none',
        '[&>*:not(:first-child)]:border-l-0',
        '[&>*:not(:last-child)]:rounded-r-none',
        'divide-x',
        'data-[borderless=true]:[&>*]:border-y-0',
        'data-[borderless=true]:[&>*:first-child]:border-l-0',
        'data-[borderless=true]:[&>*:last-child]:border-r-0',
      ],
      vertical: [
        'flex-col',
        '[&>*:not(:first-child)]:rounded-t-none',
        '[&>*:not(:first-child)]:border-t-0',
        '[&>*:not(:last-child)]:rounded-b-none',
        'divide-y',
        'data-[borderless=true]:[&>*]:border-x-0',
        'data-[borderless=true]:[&>*:first-child]:border-t-0',
        'data-[borderless=true]:[&>*:last-child]:border-b-0',
      ],
    };

    function setVariant(variant) {
      for (const [_, value] of Object.entries(variants)) {
        el.classList.remove(...value);
      }
      if (Object.prototype.hasOwnProperty.call(variants, variant)) el.classList.add(...variants[variant]);
    }

    const isVertical = () => el.getAttribute('data-orientation') === 'vertical';

    setVariant(el.getAttribute('data-orientation') ?? 'horizontal');

    // The marker goes up whether or not this is a single choice, so a choice
    // inside a plain group can say so rather than silently doing nothing.
    el._h_button_group = { singleChoice: isSingleChoice };

    if (!isSingleChoice) return;

    rejectModelEventModifiers(Alpine, el, original);

    if (isVertical()) el.setAttribute('aria-orientation', 'vertical');

    // A radio group is announced by its name, and there is no label element for
    // it to fall back on, so the name has to come from the author.
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      console.error(`${original}: a single choice button group must have an "aria-label" or "aria-labelledby" attribute`, el);
    }

    // Choices register themselves rather than being queried, so the set is never
    // read mid-render. Registration is in mount order, which x-for and later
    // insertions make differ from visual order, so it is recovered on read.
    const choices = [];

    function orderedChoices() {
      return [...choices].sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    }

    // A native disabled button cannot be focused at all, so it leaves the order.
    function focusableChoices() {
      return orderedChoices().filter((choice) => !choice.disabled);
    }

    // The group is a single tab stop, held by the selected choice so Tab from
    // outside lands on the current one. With nothing selected it falls to the
    // first choice, so the group is always reachable.
    function selectionChanged() {
      const focusable = focusableChoices();
      if (!focusable.length) return;
      const stop = focusable.find((choice) => choice.getAttribute('aria-checked') === 'true') ?? focusable[0];
      for (const choice of choices) choice.setAttribute('tabindex', choice === stop ? '0' : '-1');
    }

    Object.assign(el._h_button_group, {
      getValue: () => el._x_model?.get(),
      setValue: (value) => el._x_model?.set(value),
      register(choice) {
        if (!choices.includes(choice)) choices.push(choice);
        selectionChanged();
      },
      unregister(choice) {
        const index = choices.indexOf(choice);
        if (index !== -1) choices.splice(index, 1);
        selectionChanged();
      },
      selectionChanged,
    });

    // Selection follows focus, which is how a radio group behaves. Going through
    // the choice's own click keeps one path for selecting, whatever moved to it.
    function moveTo(choice) {
      if (!choice) return;
      choice.click();
      choice.focus();
    }

    function onKeyDown(event) {
      // Resolved from the registered set rather than a selector, since a choice
      // is an ordinary button and carries no marker attribute of its own.
      const choice = choices.find((registered) => registered.contains(event.target));
      if (!choice) return;

      // Read per keystroke, since the group does not watch its orientation.
      const vertical = isVertical();
      const nextKeys = vertical ? ['Down', 'ArrowDown'] : ['Right', 'ArrowRight'];
      const previousKeys = vertical ? ['Up', 'ArrowUp'] : ['Left', 'ArrowLeft'];
      const focusable = focusableChoices();
      const index = focusable.indexOf(choice);
      if (index === -1) return;

      if (nextKeys.includes(event.key)) {
        event.preventDefault();
        moveTo(focusable[(index + 1) % focusable.length]);
      } else if (previousKeys.includes(event.key)) {
        event.preventDefault();
        moveTo(focusable[(index - 1 + focusable.length) % focusable.length]);
      } else if (event.key === 'Home') {
        event.preventDefault();
        moveTo(focusable[0]);
      } else if (event.key === 'End') {
        event.preventDefault();
        moveTo(focusable[focusable.length - 1]);
      }
      // Enter and Space are left alone. The choices are native buttons, so the
      // browser already fires the click that selects them.
    }

    el.addEventListener('keydown', onKeyDown);

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
    });
  });

  // Pairs with x-h-button on the same element, which styles it. Only the choice
  // semantics are added here, so nothing the button already sets is touched.
  Alpine.directive('h-button-group-radio', (el, { original, expression }, { Alpine, effect, evaluateLater, cleanup }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }

    const root = findAncestorState(Alpine, el, '_h_button_group');
    if (!root) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-button-group')} element`);
    }

    const group = root._h_button_group;
    if (!group.singleChoice) {
      throw new Error(`${original} requires an "${Alpine.prefixed('model')}" on the ${Alpine.prefixed('h-button-group')} element to bind the choice to`);
    }

    // A choice never submits the form it happens to sit in.
    el.setAttribute('type', 'button');
    el.setAttribute('role', 'radio');

    // An expression evaluated in the element's scope rather than a literal, so
    // choices generated with x-for resolve. Kept for the click to write back.
    let value;

    const getValue = evaluateLater(expression);

    // 'aria-checked' carries the state to assistive technology and 'data-toggled'
    // draws it. Never 'aria-pressed', which is invalid on a radio.
    effect(() => {
      getValue((own) => {
        value = own;
        if (own === group.getValue()) {
          el.setAttribute('aria-checked', 'true');
          el.setAttribute('data-toggled', 'true');
        } else {
          el.setAttribute('aria-checked', 'false');
          el.removeAttribute('data-toggled');
        }
        group.selectionChanged();
      });
    });

    // Choosing what is already chosen is not a change, so it writes nothing and
    // announces nothing.
    function onClick() {
      if (el.getAttribute('aria-checked') === 'true') return;
      group.setValue(value);
      el.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true }));
    }

    el.addEventListener('click', onClick);
    group.register(el);

    cleanup(() => {
      el.removeEventListener('click', onClick);
      group.unregister(el);
    });
  });
}
