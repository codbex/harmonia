import { findAncestorState } from '../common/ancestor';
import { disabledControlClasses } from '../common/shared-classes';
import { Close, createSvg } from './../common/icons';

// One entry per variant, split by the element each list belongs on. `surface`
// paints the pill, `icon` tints a leading icon (which can sit on the chip beside
// a static label or inside its button), `states` are the interactive states of
// the buttons inside the pill, and `separator` is the close's divider in the one
// variant whose chip has no border colour of its own to inherit.
const variants = {
  default: {
    surface: ['bg-secondary'],
    icon: [],
    states: ['hover:bg-secondary-hover', 'active:bg-secondary-active', 'aria-pressed:bg-secondary-active', 'inset-ring-ring/50'],
    separator: ['hover:border-foreground/20'],
  },
  primary: {
    surface: ['bg-primary/10', 'border-primary/50'],
    icon: ['[&>svg]:text-primary'],
    states: ['hover:bg-primary/10', 'active:bg-primary/15', 'aria-pressed:bg-primary/15', 'inset-ring-primary/50'],
    separator: [],
  },
  positive: {
    surface: ['bg-positive/10', 'border-positive/50'],
    icon: ['[&>svg]:text-positive'],
    states: ['hover:bg-positive/10', 'active:bg-positive/15', 'aria-pressed:bg-positive/15', 'inset-ring-positive/50'],
    separator: [],
  },
  negative: {
    surface: ['bg-negative/10', 'border-negative/50'],
    icon: ['[&>svg]:text-negative'],
    states: ['hover:bg-negative/10', 'active:bg-negative/15', 'aria-pressed:bg-negative/15', 'inset-ring-negative/50'],
    separator: [],
  },
  warning: {
    surface: ['bg-warning/10', 'border-warning/50'],
    icon: ['[&>svg]:text-warning'],
    states: ['hover:bg-warning/10', 'active:bg-warning/15', 'aria-pressed:bg-warning/15', 'inset-ring-warning/50'],
    separator: [],
  },
  information: {
    surface: ['bg-information/10', 'border-information/50'],
    icon: ['[&>svg]:text-information'],
    states: ['hover:bg-information/10', 'active:bg-information/15', 'aria-pressed:bg-information/15', 'inset-ring-information/50'],
    separator: [],
  },
  outline: {
    surface: ['bg-background'],
    icon: ['[&>svg]:text-secondary-foreground'],
    states: ['hover:bg-secondary-hover', 'active:bg-secondary-active', 'aria-pressed:bg-secondary-active', 'inset-ring-ring/50'],
    separator: [],
  },
};

// Swaps whichever variant's classes are on `el` for `variant`'s. `keys` picks
// the lists that belong on this element, so one table serves all three parts.
function applyVariant(el, variant, keys) {
  for (const value of Object.values(variants)) {
    for (const key of keys) el.classList.remove(...value[key]);
  }
  if (Object.prototype.hasOwnProperty.call(variants, variant)) {
    for (const key of keys) el.classList.add(...variants[variant][key]);
  }
}

// Shared by x-h-chip-button and x-h-chip-close: both fill the height of the pill
// and ring inside it, since an outline would fall outside the chip's border.
const chipControlClasses = [
  'cursor-pointer',
  'inline-flex',
  'items-center',
  'justify-center',
  'h-full',
  'text-sm',
  'bg-transparent',
  'text-secondary-foreground',
  'transition-all',
  'duration-100',
  'motion-reduce:transition-none',
  ...disabledControlClasses,
  'outline-none',
  'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
  'focus-visible:inset-ring',
  'aria-expanded:inset-ring-[calc(var(--spacing)*0.75)]',
  'aria-expanded:inset-ring',
];

export default function (Alpine) {
  Alpine.directive('h-chip', (el, { original }, { cleanup }) => {
    // The chip is a container, never a control. Its controls are the buttons
    // inside it, and a button may not contain another button.
    if (el.tagName === 'BUTTON' || el.tagName === 'A') {
      throw new Error(`${original} must not be an interactive element, put ${Alpine.prefixed('h-chip-button')} on a button inside it instead`);
    }
    el._h_chip = Alpine.reactive({
      variant: 'default',
    });
    el.classList.add(
      'inline-flex',
      'items-center',
      'justify-center',
      'whitespace-nowrap',
      'rounded-full',
      'text-sm',
      'leading-none',
      'transform-gpu',
      'transition-all',
      'duration-100',
      'motion-reduce:transition-none',
      'svg-defaults',
      'shrink-0',
      'h-7',
      'gap-1.5',
      'px-2.5',
      'has-[>svg]:pl-1.5',
      // A button child reaches the edge of the pill, so the padding and the gap
      // for static content get out of its way. Buttons meet at a shared edge,
      // where a gap would leave a strip of the chip's own background between
      // the one being hovered and its neighbour.
      'has-[>[data-slot=chip-button]]:px-0',
      'has-[>[data-slot=chip-button]]:gap-0',
      'has-[>[data-slot=chip-close]]:pr-0',
      'has-[>[data-slot=spinner]]:px-2',
      'text-secondary-foreground',
      'border'
    );
    el.setAttribute('data-slot', 'chip');

    function setVariant(variant) {
      el._h_chip.variant = variant;
      applyVariant(el, variant, ['surface', 'icon']);
    }

    setVariant(el.getAttribute('data-variant') ?? 'default');

    const observer = new MutationObserver(() => {
      setVariant(el.getAttribute('data-variant') ?? 'default');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant'] });

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-chip-button', (el, { original }, { effect }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    const chip = findAncestorState(Alpine, el, '_h_chip');
    if (!chip) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-chip')} element`);
    }
    el.classList.add(...chipControlClasses, 'gap-1.5', 'px-2.5', 'has-[>svg]:pl-1.5', 'has-[>[data-slot=spinner]]:px-2', 'min-w-0', 'truncate', 'first:rounded-l-full', 'last:rounded-r-full');
    el.setAttribute('data-slot', 'chip-button');
    // A chip inside a form can be its submit, so an author-set type wins.
    if (!el.hasAttribute('type')) {
      el.setAttribute('type', 'button');
    }

    effect(() => applyVariant(el, chip._h_chip.variant, ['icon', 'states']));
  });

  Alpine.directive('h-chip-close', (el, { original }, { effect }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    const chip = findAncestorState(Alpine, el, '_h_chip');
    if (!chip) {
      throw new Error(`${original} must be inside a ${Alpine.prefixed('h-chip')} element`);
    }
    el.classList.add(
      ...chipControlClasses,
      'pl-1',
      'pr-1.5',
      'fill-secondary-foreground',
      'rounded-r-full',
      'border-l',
      'border-transparent',
      'hover:[[data-variant]>&]:border-inherit',
      'active:border-inherit',
      'aria-pressed:border-inherit'
    );
    el.setAttribute('data-slot', 'chip-close');
    el.setAttribute('type', 'button');
    el.appendChild(
      createSvg({
        icon: Close,
        classes: 'size-3.5 shrink-0 pointer-events-none',
        attrs: {
          'aria-hidden': true,
          role: 'presentation',
        },
      })
    );

    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      console.error(`${original}: Must have an "aria-label" or "aria-labelledby" attribute`, el);
    }

    effect(() => applyVariant(el, chip._h_chip.variant, ['states', 'separator']));
  });
}
