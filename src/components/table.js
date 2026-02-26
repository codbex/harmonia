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
      '[&:has([data-slot|=cell-input])]:p-0',
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
      '[&_svg]:pointer-events-none',
      '[&_svg]:opacity-70',
      '[&_svg]:text-foreground',
      '[&_svg]:transition-transform',
      '[&_svg]:duration-200',
      "[&_svg:not([class*='size-'])]:size-4",
      'shrink-0',
      '[&_svg]:shrink-0',
      'focus-visible:inset-ring-ring/50',
      'focus-visible:inset-ring-2',
      'hover:bg-table-hover',
      'hover:text-table-hover-foreground',
      'active:!bg-table-active',
      'active:!text-table-active-foreground',
      '[&[data-state=open]>svg:not(:first-child):last-child]:rotate-180',
      '[&[data-state=open]>svg:only-child]:rotate-180'
    );
    el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'cell-input-button');
  });

  Alpine.directive('h-table-body', (el) => {
    el.classList.add(
      '[&_tr:last-child_td[data-slot|=table]]:border-b-0',
      '[&_tr:last-child_th[data-slot|=table]]:border-b-0',
      '[&_tr_th[data-slot|=table]]:bg-table-header',
      '[&_tr[data-hoverable=true]:hover_th[data-slot|=table]]:bg-table-hover',
      '[&_tr[data-hoverable=true]:hover_th[data-slot|=table]]:text-table-hover-foreground',
      '[&_tr[data-activable=true]:active_th[data-slot|=table]]:!bg-table-active',
      '[&_tr[data-activable=true]:active_th[data-slot|=table]]:!text-table-active-foreground'
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
    el.classList.add('bg-table-header', 'font-medium', 'last:[&>tr_td[data-slot|=table]]:border-b-0', 'last:[&>tr_th[data-slot|=table]]:border-b-0');
    el.setAttribute('data-slot', 'table-footer');
  });
}
