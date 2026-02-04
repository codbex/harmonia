import { v4 as uuidv4 } from 'uuid';
import { Calendar, createSvg } from './../common/icons';
import { sizeObserver } from './../common/input-size';

export default function (Alpine) {
  Alpine.directive('h-date-picker', (el, { original }, { Alpine, cleanup }) => {
    el._h_datepicker = Alpine.reactive({
      id: undefined,
      controls: `hdpc${uuidv4()}`,
      input: undefined,
      expanded: false,
    });
    el._h_datepicker.input = el.querySelector('input');
    if (!el._h_datepicker.input || el._h_datepicker.input.tagName !== 'INPUT') {
      throw new Error(`${original} must contain an input`);
    } else if (el._h_datepicker.input.hasAttribute('id')) {
      el._h_datepicker.id = el._h_datepicker.input.getAttribute('id');
    } else {
      const id = `hdp${uuidv4()}`;
      el._h_datepicker.input.setAttribute('id', id);
      el._h_datepicker.id = id;
    }

    el.classList.add(
      'border-input',
      'bg-input-inner',
      'flex',
      'w-full',
      'items-center',
      'rounded-control',
      'border',
      'shadow-input',
      'transition-[color,box-shadow]',
      'duration-200',
      'outline-none',
      'pl-3',
      'min-w-0',
      'has-[input:focus-visible]:border-ring',
      'has-[input:focus-visible]:ring-ring/50',
      'has-[input:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
      'has-[input[aria-invalid=true]]:ring-negative/20',
      'has-[input[aria-invalid=true]]:border-negative',
      'dark:has-[input[aria-invalid=true]]:ring-negative/40',
      'has-[input:invalid]:ring-negative/20',
      'has-[input:invalid]:border-negative',
      'dark:has-[input:invalid]:ring-negative/40'
    );
    el.setAttribute('data-slot', 'date-picker');

    el._h_datepicker.input.classList.add(
      'bg-transparent',
      'outline-none',
      'size-full',
      'pr-1',
      'border-r',
      'border-input',
      'aria-invalid:border-negative',
      'invalid:border-negative',
      'focus-visible:ring-0',
      'disabled:pointer-events-none',
      'disabled:cursor-not-allowed',
      'disabled:opacity-50',
      'md:text-sm',
      'text-base',
      'truncate'
    );
    el._h_datepicker.input.setAttribute('aria-autocomplete', 'none');
    el._h_datepicker.input.setAttribute('type', 'text');

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-date-picker-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button`);
    }
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      throw new Error(`${original}: must have an "aria-label" or "aria-labelledby" attribute`);
    }
    const datepicker = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_datepicker'));
    if (!datepicker) {
      throw new Error(`${original} must be inside an date-picker element`);
    }
    el.classList.add(
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-r-control',
      'h-full',
      'aspect-square',
      'bg-transparent',
      'hover:bg-secondary',
      'active:bg-secondary-active',
      'outline-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      '[input[aria-invalid=true]~&]:ring-negative/20',
      '[input[aria-invalid=true]~&]:border-negative',
      'dark:[input[aria-invalid=true]~&]:ring-negative/40',
      '[input:invalid~&]:ring-negative/20',
      '[input:invalid~&]:border-negative',
      'dark:[input:invalid~&]:ring-negative/40'
    );
    el.setAttribute('aria-controls', datepicker._h_datepicker.controls);
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-haspopup', 'dialog');
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'date-picker-trigger');

    el.appendChild(
      createSvg({
        icon: Calendar,
        classes: 'opacity-70 text-foreground size-4',
        attrs: {
          'aria-hidden': true,
          role: 'presentation',
        },
      })
    );

    effect(() => {
      el.setAttribute('data-state', datepicker._h_datepicker.expanded ? 'open' : 'closed');
      el.setAttribute('aria-expanded', datepicker._h_datepicker.expanded);
    });

    const close = () => {
      datepicker._h_datepicker.expanded = false;
    };

    const handler = () => {
      datepicker._h_datepicker.expanded = !datepicker._h_datepicker.expanded;
      el.setAttribute('aria-expanded', datepicker._h_datepicker.expanded);
      Alpine.nextTick(() => {
        if (datepicker._h_datepicker.expanded) {
          top.addEventListener('click', close, { once: true });
        } else {
          top.removeEventListener('click', close);
        }
      });
    };

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
      top.removeEventListener('click', close);
    });
  });
}
