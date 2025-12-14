export default function (Alpine) {
  Alpine.directive('h-table-container', (el, { modifiers }) => {
    if (modifiers.includes('scroll')) {
      el.classList.add('overflow-scroll', '[&_thead]:sticky', '[&_thead]:top-0', '[&_thead]:z-10', '[&_tfoot]:sticky', '[&_tfoot]:bottom-0', '[&_tfoot]:z-10', '[&_tbody_tr_th]:sticky', '[&_tbody_tr_th]:left-0', '[&_tbody_tr_th]:z-5');
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
        el.classList.add('[&_tr_td]:border-b', '[&_tr_th]:border-b', 'first:[&_tfoot_tr_td]:border-t', 'first:[&_tfoot_tr_th]:border-t');
        break;
      case 'columns':
        el.classList.add('[&_tr]:divide-x');
        break;
      case 'both':
        el.classList.add('[&_tr_td]:border-b', '[&_tr_th]:border-b', 'first:[&_tfoot_tr_td]:border-t', 'first:[&_tfoot_tr_th]:border-t', '[&_tr]:divide-x');
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
      '[&[data-activable=true]:active]:!bg-table-active',
      '[&[data-activable=true]:active]:!text-table-active-foreground',
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
      'align-middle',
      'whitespace-nowrap',
      '[&:has([role=checkbox])]:pr-0',
      '[&>[role=checkbox]]:flex',
      '[&>[role=checkbox]]:items-center',
      '[&[data-hoverable=true]:hover]:bg-table-hover',
      '[&[data-hoverable=true]:hover]:text-table-hover-foreground',
      '[&[data-activable=true]:active]:!bg-table-active',
      '[&[data-activable=true]:active]:!text-table-active-foreground'
    );
    el.setAttribute('data-slot', 'table-cell');
  });

  Alpine.directive('h-table-body', (el) => {
    el.classList.add(
      '[&_tr:last-child_td]:border-b-0',
      '[&_tr:last-child_th]:border-b-0',
      '[&_tr_th]:bg-table-header',
      '[&_tr[data-hoverable=true]:hover_th]:bg-table-hover',
      '[&_tr[data-hoverable=true]:hover_th]:text-table-hover-foreground',
      '[&_tr[data-activable=true]:active_th]:!bg-table-active',
      '[&_tr[data-activable=true]:active_th]:!text-table-active-foreground'
    );
    el.setAttribute('data-slot', 'table-body');
  });

  Alpine.directive('h-table-row', (el) => {
    el.classList.add(
      '[&[data-hoverable=true]:hover]:bg-table-hover',
      '[&[data-hoverable=true]:hover]:text-table-hover-foreground',
      '[&[data-activable=true]:active]:!bg-table-active',
      '[&[data-activable=true]:active]:!text-table-active-foreground',
      'data-[state=selected]:bg-table-active',
      'data-[state=selected]:text-table-active-foreground'
    );
    el.setAttribute('data-slot', 'table-row');
  });

  Alpine.directive('h-table-caption', (el) => {
    el.classList.add('text-muted-foreground', 'py-2', 'text-sm', 'border-t');
    el.setAttribute('data-slot', 'table-caption');
  });

  Alpine.directive('h-table-footer', (el) => {
    el.classList.add('bg-table-header', 'font-medium', 'last:[&>tr_td]:border-b-0', 'last:[&>tr_th]:border-b-0');
    el.setAttribute('data-slot', 'table-footer');
  });
}
