import { Calendar, createElement } from 'lucide';
import { v4 as uuidv4 } from 'uuid';

export default function (Alpine) {
  Alpine.directive('h-date-picker', (el, {}, { Alpine }) => {
    el._datepicker = Alpine.reactive({
      id: undefined,
      controls: `hdpc${uuidv4()}`,
      input: undefined,
      expanded: false,
    });
    el._datepicker.input = el.querySelector('input');
    if (!el._datepicker.input || el._datepicker.input.tagName !== 'INPUT') {
      throw new Error('h-date-picker must have an input inside it');
    } else if (el._datepicker.input.hasAttribute('id')) {
      el._datepicker.id = el._datepicker.input.getAttribute('id');
    } else {
      const id = `hdp${uuidv4()}`;
      el._datepicker.input.setAttribute('id', id);
      el._datepicker.id = id;
    }

    el.classList.add(
      'border-input',
      'bg-input-inner',
      'flex',
      'w-full',
      'items-center',
      'rounded-control',
      'border',
      'shadow-control',
      'transition-[color,box-shadow]',
      'duration-200',
      'outline-none',
      'h-9',
      'pl-3',
      'pr-1',
      'gap-2',
      'min-w-0',
      'has-[input:focus-visible]:border-ring',
      'has-[input:focus-visible]:ring-ring/50',
      'has-[input:focus-visible]:ring-[3px]',
      'has-[input[aria-invalid=true]]:ring-negative/20',
      'has-[input[aria-invalid=true]]:border-negative',
      'dark:has-[input[aria-invalid=true]]:ring-negative/40',
      'has-[input:invalid]:ring-negative/20',
      'has-[input:invalid]:border-negative',
      'dark:has-[input:invalid]:ring-negative/40'
    );
    el.setAttribute('data-slot', 'date-picker');

    el._datepicker.input.classList.add('bg-transparent', 'outline-none', 'flex-1', 'border-0', 'focus-visible:ring-0', 'disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'disabled:opacity-50', 'md:text-sm', 'text-base');
    el._datepicker.input.setAttribute('aria-autocomplete', 'none');
    el._datepicker.input.setAttribute('type', 'text');
  });

  Alpine.directive('h-date-picker-trigger', (el, {}, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error('h-date-picker-trigger must be a button');
    }
    if (!el.hasAttribute('aria-labelledby') && !el.hasAttribute('aria-label')) {
      throw new Error('h-date-picker-trigger: must have an "aria-label" or "aria-labelledby" attribute');
    }
    const datepicker = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_datepicker'));
    if (!datepicker) {
      throw new Error('h-date-picker-trigger must be inside an h-date-picker element');
    }
    el.setAttribute('aria-controls', datepicker._datepicker.controls);
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-haspopup', 'dialog');
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'date-picker-trigger');

    el.appendChild(
      createElement(Calendar, {
        class: ['opacity-50 size-4 transition-transform duration-200'],
        width: '16',
        height: '16',
        'aria-hidden': true,
        role: 'presentation',
      })
    );

    effect(() => {
      el.setAttribute('data-state', datepicker._datepicker.expanded ? 'open' : 'closed');
      el.setAttribute('aria-expanded', datepicker._datepicker.expanded);
    });

    const close = () => {
      datepicker._datepicker.expanded = false;
    };

    const handler = () => {
      datepicker._datepicker.expanded = !datepicker._datepicker.expanded;
      el.setAttribute('aria-expanded', datepicker._datepicker.expanded);
      Alpine.nextTick(() => {
        if (datepicker._datepicker.expanded) {
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
  }).before('h-button');
}
