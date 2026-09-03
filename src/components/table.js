import { findAncestorState } from '../common/ancestor';
import uuidv4 from '../utils/uuid';
import { ChevronRight, createSvg } from './../common/icons';
export default function (Alpine) {
  Alpine.directive('h-table-container', (el, { modifiers }) => {
    if (modifiers.includes('scroll')) {
      el.classList.add(
        'overflow-scroll',
        '[&_thead[data-slot|=table]]:sticky',
        '[&_thead[data-slot|=table]]:top-0',
        '[&_thead[data-slot|=table]]:z-2',
        '[&_tfoot[data-slot|=table]]:sticky',
        '[&_tfoot[data-slot|=table]]:bottom-0',
        '[&_tfoot[data-slot|=table]]:z-2',
        '[&_tbody_tr_th[data-slot|=table]]:sticky',
        '[&_tbody_tr_th[data-slot|=table]]:left-0',
        '[&_tbody_tr_th[data-slot|=table]]:z-1'
      );
    } else {
      el.classList.add('relative', 'w-full', 'overflow-x-auto');
    }
    el.setAttribute('data-slot', 'table');

    if (el.getAttribute('data-border') === 'true') {
      el.classList.add('border', 'rounded-md');
    }
  });

  Alpine.directive('h-table', (el) => {
    el.classList.add('group', 'w-full', 'caption-bottom', 'text-sm', 'border-separate', 'border-spacing-0');
    if (el.getAttribute('data-fixed') === 'true') el.classList.add('table-fixed');
    el.setAttribute('data-slot', 'table');

    switch (el.getAttribute('data-borders')) {
      case 'rows':
        el.classList.add('[&_tr_td[data-slot|=table]]:border-b', '[&_tr_th[data-slot|=table]]:border-b', 'first:[&_tfoot_tr_td[data-slot|=table]]:border-t', 'first:[&_tfoot_tr_th[data-slot|=table]]:border-t');
        break;
      case 'columns':
        el.classList.add('[&_tr[data-slot|=table]]:divide-x');
        break;
      case 'both':
        el.classList.add(
          '[&_tr_td[data-slot|=table]]:border-b',
          '[&_tr_th[data-slot|=table]]:border-b',
          'first:[&_tfoot_tr_td[data-slot|=table]]:border-t',
          'first:[&_tfoot_tr_th[data-slot|=table]]:border-t',
          '[&_tr[data-slot|=table]]:divide-x'
        );
        break;
    }
  });

  Alpine.directive('h-table-header', (el) => {
    el.classList.add('bg-table-header');
    el.setAttribute('data-slot', 'table-header');
  });

  Alpine.directive('h-table-head', (el) => {
    el.classList.add(
      'text-foreground',
      '[&[data-hoverable=true]:hover]:bg-table-hover',
      '[&[data-hoverable=true]:hover]:text-table-hover-foreground',
      '[&[data-activable=true]:active]:bg-table-active!',
      '[&[data-activable=true]:active]:text-table-active-foreground!',
      '[[data-slot=table-header][data-bordered=true]_&]:border-t',
      '[[data-slot=table-header][data-bordered=true]_&]:border-b',
      '[[data-slot=table-header][data-bordered=true]_&:first-child]:border-l',
      '[[data-slot=table-header][data-bordered=true]_&:last-child]:border-r',
      'h-10',
      'px-2',
      'text-left',
      'align-middle',
      'font-medium',
      'whitespace-nowrap',
      '[&:has([role=checkbox])]:pr-0',
      '[&>[role=checkbox]]:flex',
      '[&>[role=checkbox]]:items-center'
    );
    el.setAttribute('data-slot', 'table-head');
  });

  Alpine.directive('h-table-cell', (el) => {
    el.classList.add(
      'p-2',
      '[&:has([data-slot|=cell-input])]:p-0',
      '[&:has([data-slot=table-group-button])]:p-0',
      'align-middle',
      'whitespace-nowrap',
      '[&:has([role=checkbox])]:pr-0',
      '[&>[role=checkbox]]:flex',
      '[&>[role=checkbox]]:items-center',
      '[&[data-hoverable=true]:hover]:bg-table-hover',
      '[&[data-hoverable=true]:hover]:text-table-hover-foreground',
      '[&[data-activable=true]:active]:bg-table-active!',
      '[&[data-activable=true]:active]:text-table-active-foreground!'
    );
    el.setAttribute('data-slot', 'table-cell');
  });

  Alpine.directive('h-table-cell-button', (el) => {
    el.classList.add(
      'px-2',
      'size-full',
      'h-10',
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-between',
      'outline-none',
      'gap-2',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'svg-defaults',
      '[&_svg]:opacity-70',
      '[&_svg]:text-foreground',
      '[&_svg]:transition-transform',
      'motion-reduce:[&_svg]:transition-none',
      '[&_svg]:duration-200',
      'shrink-0',
      'focus-visible:inset-ring-ring/50',
      'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
      'hover:bg-table-hover',
      'hover:text-table-hover-foreground',
      'active:bg-table-active!',
      'active:text-table-active-foreground!',
      '[&[data-state=open]>svg:not(:first-child):last-child]:rotate-180',
      '[&[data-state=open]>svg:only-child]:rotate-180'
    );
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'cell-input-button');
  });

  Alpine.directive('h-table-body', (el) => {
    el.classList.add(
      '[&:last-of-type_tr:last-of-type_td[data-slot|=table]]:border-b-0',
      '[&:last-of-type_tr:last-of-type_th[data-slot|=table]]:border-b-0',
      '[&_tr_th[data-slot|=table]]:bg-table-header',
      '[&_tr[data-hoverable=true]:hover_th[data-slot|=table]]:bg-table-hover',
      '[&_tr[data-hoverable=true]:hover_th[data-slot|=table]]:text-table-hover-foreground',
      '[&_tr[data-activable=true]:active_th[data-slot|=table]]:bg-table-active!',
      '[&_tr[data-activable=true]:active_th[data-slot|=table]]:text-table-active-foreground!'
    );
    el.setAttribute('data-slot', 'table-body');
  });

  Alpine.directive('h-table-row', (el) => {
    el.classList.add(
      '[&[data-hoverable=true]:hover]:bg-table-hover',
      '[&[data-hoverable=true]:hover]:text-table-hover-foreground',
      '[&[data-activable=true]:active]:bg-table-active!',
      '[&[data-activable=true]:active]:text-table-active-foreground!',
      'data-[state=selected]:bg-table-active',
      'data-[state=selected]:text-table-active-foreground'
    );
    el.setAttribute('data-slot', 'table-row');
  });

  Alpine.directive('h-table-group', (el, { expression, original }, { effect, evaluate, evaluateLater, Alpine }) => {
    if (el.tagName !== 'TBODY') {
      throw new Error(`${original} must be a tbody element`);
    }
    el.classList.add('[&[data-collapsed=true]>tr:not([data-slot=table-group-row])]:hidden');
    if (!el.hasAttribute('id')) el.setAttribute('id', `tgc${uuidv4()}`);
    el._h_table_group = {
      controlId: undefined,
      controls: el.getAttribute('id'),
      state: Alpine.reactive({
        collapsed: evaluate(expression || 'false'),
      }),
    };
    if (expression) {
      const getCollapsed = evaluateLater(expression);
      effect(() => {
        getCollapsed((collapsed) => {
          el._h_table_group.state.collapsed = collapsed;
        });
      });
    }
    effect(() => {
      el.setAttribute('data-collapsed', el._h_table_group.state.collapsed);
    });
  });

  Alpine.directive('h-table-group-row', (el) => {
    el.classList.add('bg-table-header', 'text-table-header-foreground', 'font-medium');
    el.setAttribute('data-slot', 'table-group-row');
  });

  Alpine.directive('h-table-group-button', (el, { original }, { cleanup, effect }) => {
    if (el.tagName !== 'BUTTON') {
      throw new Error(`${original} must be a button element`);
    }
    const group = findAncestorState(Alpine, el, '_h_table_group');
    if (!group) {
      throw new Error(`${original} must be placed inside a table group`);
    }
    el.classList.add(
      'px-2',
      'size-full',
      'h-10',
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-start',
      'outline-none',
      'gap-2',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'svg-defaults',
      '[&_svg]:opacity-70',
      '[&_svg]:text-foreground',
      '[&_svg]:transition-transform',
      'motion-reduce:[&_svg]:transition-none',
      '[&_svg]:duration-200',
      'shrink-0',
      'focus-visible:inset-ring-ring/50',
      'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
      'hover:bg-table-hover',
      'hover:text-table-hover-foreground',
      'active:bg-table-active!',
      'active:text-table-active-foreground!'
    );
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'table-group-button');

    if (el.hasAttribute('id')) {
      group._h_table_group.controlId = el.getAttribute('id');
    } else {
      group._h_table_group.controlId = `tgb${uuidv4()}`;
      el.setAttribute('id', group._h_table_group.controlId);
    }
    el.setAttribute('aria-controls', group._h_table_group.controls);
    group.setAttribute('aria-labelledby', group._h_table_group.controlId);

    // Written through an effect rather than once, since a bound expression can
    // collapse the group without the click handler ever running. The arrow
    // turns off this attribute, so it would point the wrong way too.
    effect(() => {
      el.setAttribute('aria-expanded', !group._h_table_group.state.collapsed);
    });

    const handler = () => {
      group._h_table_group.state.collapsed = !group._h_table_group.state.collapsed;
    };

    el.prepend(
      createSvg({
        icon: ChevronRight,
        classes: 'pointer-events-none size-4 shrink-0 transition-transform motion-reduce:transition-none duration-200 [[aria-expanded=true]>&]:rotate-90',
        attrs: {
          'aria-hidden': true,
          role: 'presentation',
        },
      })
    );

    el.addEventListener('click', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-table-caption', (el) => {
    el.classList.add('text-muted-foreground', 'py-2', 'text-sm', 'border-t');
    el.setAttribute('data-slot', 'table-caption');
  });

  Alpine.directive('h-table-footer', (el) => {
    el.classList.add('bg-table-header', 'font-medium', 'last:[&>tr_td[data-slot|=table]]:border-b-0', 'last:[&>tr_th[data-slot|=table]]:border-b-0');
    el.setAttribute('data-slot', 'table-footer');
  });
}
