import { v4 as uuidv4 } from 'uuid';
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
      'outline-none',
      'file:inline-flex',
      'file:h-7',
      'file:border-0',
      'file:bg-transparent',
      'file:text-sm',
      'file:font-medium',
      'disabled:pointer-events-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'md:text-sm',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'aria-invalid:ring-negative/20',
      'dark:aria-invalid:ring-negative/40',
      'aria-invalid:border-negative',
      'invalid:!ring-negative/20',
      'dark:invalid:!ring-negative/40',
      'invalid:!border-negative'
    );
    if (modifiers.includes('group')) {
      el.classList.add('h-full', 'flex-1', 'rounded-none', 'border-0', 'bg-transparent', 'shadow-none', 'focus-visible:ring-0');
      el.setAttribute('data-slot', 'input-group-control');
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
      'data-[disabled=true]:opacity-50',
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
      if (variants.hasOwnProperty(variant)) el.classList.add(...variants[variant]);
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
    el.classList.add('text-muted-foreground', 'flex', 'items-center', 'gap-2', 'text-sm', '[&_svg]:pointer-events-none', "[&_svg:not([class*='size-'])]:size-4");
    el.setAttribute('data-slot', 'label');
  });

  Alpine.directive('h-input-number', (el, { original }, { cleanup }) => {
    el.classList.add(
      'group/input-number',
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
      'outline-none',
      'min-w-0',
      'has-[[data-slot=input-number-control]:focus-visible]:border-ring',
      'has-[[data-slot=input-number-control]:focus-visible]:ring-ring/50',
      'has-[[data-slot=input-number-control]:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
      'has-[[data-slot][aria-invalid=true]]:ring-negative/20',
      'has-[[data-slot][aria-invalid=true]]:border-negative',
      'dark:has-[[data-slot][aria-invalid=true]]:ring-negative/40'
    );
    el.setAttribute('role', 'group');
    el.setAttribute('data-slot', 'input-number');
    const input = el.querySelector('input');
    if (!input || input.getAttribute('type') !== 'number') {
      throw new Error(`${original} must contain an input of type 'number'`);
    }
    if (!input.hasAttribute('type')) input.setAttribute('type', 'number');
    if (!input.hasAttribute('inputmode')) input.setAttribute('inputmode', 'numeric');
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
    input.classList.add('rounded-l-control', 'size-full', 'px-3', 'py-1', 'outline-none');

    const stepDown = document.createElement('button');
    stepDown.setAttribute('type', 'button');
    stepDown.setAttribute('tabIndex', '-1');
    stepDown.setAttribute('aria-label', 'Decrease');
    stepDown.setAttribute('aria-controls', input.getAttribute('id'));
    stepDown.setAttribute('data-slot', 'step-up-trigger');
    stepDown.classList.add(
      'cursor-pointer',
      'border-l',
      'border-input',
      '[input[aria-invalid=true]~&]:border-negative',
      '[input:invalid~&]:border-negative',
      'h-full',
      'aspect-square',
      'bg-transparent',
      'hover:bg-secondary',
      'active:bg-secondary-active',
      'outline-none',
      'relative',
      'before:block',
      'before:opacity-70',
      'before:rounded-full',
      'before:h-0.5',
      'before:min-h-px',
      'before:w-3',
      'before:mx-auto',
      'before:bg-foreground',
      'before:hover:bg-secondary-foreground'
    );
    el.appendChild(stepDown);

    const onStepDown = () => {
      input.stepDown();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    stepDown.addEventListener('click', onStepDown);

    const stepUp = document.createElement('button');
    stepUp.setAttribute('type', 'button');
    stepUp.setAttribute('tabIndex', '-1');
    stepUp.setAttribute('aria-label', 'Increase');
    stepUp.setAttribute('aria-controls', input.getAttribute('id'));
    stepUp.setAttribute('data-slot', 'step-up-trigger');
    stepUp.classList.add(
      'cursor-pointer',
      'border-l',
      'border-input',
      '[input[aria-invalid=true]~&]:border-negative',
      '[input:invalid~&]:border-negative',
      'rounded-r-control',
      'h-full',
      'aspect-square',
      'bg-transparent',
      'hover:bg-secondary',
      'active:bg-secondary-active',
      'outline-none',
      'relative',
      'before:block',
      'before:opacity-70',
      'before:absolute',
      'before:rounded-full',
      'before:h-0.5',
      'before:min-h-px',
      'before:w-3',
      'before:top-1/2',
      'before:left-1/2',
      'before:-translate-x-1/2',
      'before:-translate-y-1/2',
      'before:bg-foreground',
      'before:hover:bg-secondary-foreground',
      'after:block',
      'after:opacity-70',
      'after:absolute',
      'after:rounded-full',
      'after:h-3',
      'after:min-w-px',
      'after:w-0.5',
      'after:top-1/2',
      'after:left-1/2',
      'after:-translate-x-1/2',
      'after:-translate-y-1/2',
      'after:bg-foreground',
      'after:hover:bg-secondary-foreground'
    );

    el.appendChild(stepUp);

    const onStepUp = () => {
      input.stepUp();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    stepUp.addEventListener('click', onStepUp);

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
      stepDown.removeEventListener('click', onStepDown);
      stepUp.removeEventListener('click', onStepUp);
    });
  });
}
