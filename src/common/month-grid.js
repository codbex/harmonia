import { createDateTimeFormatCache } from './intl';

// The twelve-month grid shared by the month picker and the calendar's month view. The calendar's year grid reuses the cell classes.

export const monthGridCellClasses = [
  'p-1',
  'h-9',
  'text-center',
  'align-middle',
  'rounded-control',
  'text-sm',
  'bg-transparent',
  'hover:bg-secondary',
  'hover:text-secondary-foreground',
  'outline-none',
  'focus-visible:ring-ring/50',
  'focus-visible:ring-[calc(var(--spacing)*0.75)]',
  'cursor-pointer',
  'aria-[current=date]:bg-secondary',
  'aria-[current=date]:text-secondary-foreground',
  'aria-selected:bg-primary-active!',
  'aria-selected:text-primary-foreground!',
  'aria-selected:hover:bg-primary-hover!',
  'aria-disabled:pointer-events-none',
  'aria-disabled:opacity-disabled',
];

/**
 * Builds a 4x3 month grid table. Clicks are delegated to the table, so gaps between cells are covered by `stopPropagation` too.
 *
 * @param {{ onPick: (month: number) => void, stopPropagation?: boolean }} options
 *   onPick receives the 0-based month of a clicked cell that is not disabled.
 * @returns {{ table: HTMLTableElement, cells: HTMLTableCellElement[], render: Function, destroy: () => void }}
 */
export function createMonthGrid({ onPick, stopPropagation = false }) {
  const dtf = createDateTimeFormatCache();

  const table = document.createElement('table');
  table.classList.add('table-fixed', 'border-separate', 'border-spacing-1');
  table.setAttribute('role', 'grid');
  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const cells = [];
  for (let r = 0; r < 4; r++) {
    const row = document.createElement('tr');
    row.setAttribute('role', 'row');
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('td');
      cell.setAttribute('data-month', String(r * 3 + c));
      cell.setAttribute('role', 'gridcell');
      cell.setAttribute('tabindex', '-1');
      cell.classList.add(...monthGridCellClasses);
      cells.push(cell);
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }

  function onClick(event) {
    if (stopPropagation) event.stopPropagation();
    const cell = cells.find((c) => c.contains(event.target));
    if (!cell || cell.getAttribute('aria-disabled') === 'true') return;
    onPick(Number(cell.getAttribute('data-month')));
  }
  table.addEventListener('click', onClick);

  /**
   * @param {{ year: number, locale: string, selectedMonth: number|null, focusedMonth: number, isDisabled?: (month: number) => boolean }} state
   */
  function render({ year, locale, selectedMonth, focusedMonth, isDisabled }) {
    const now = new Date();
    const shortFmt = dtf(locale, { month: 'short' });
    const longFmt = dtf(locale, { month: 'long', year: 'numeric' });
    for (let m = 0; m < 12; m++) {
      const cell = cells[m];
      cell.textContent = shortFmt.format(new Date(2020, m, 1));
      // The short name alone ("Sep") can be read oddly by screen readers.
      cell.setAttribute('aria-label', longFmt.format(new Date(year, m, 1)));
      cell.setAttribute('tabindex', m === focusedMonth ? '0' : '-1');
      if (m === selectedMonth) cell.setAttribute('aria-selected', 'true');
      else cell.removeAttribute('aria-selected');
      if (year === now.getFullYear() && m === now.getMonth()) cell.setAttribute('aria-current', 'date');
      else cell.removeAttribute('aria-current');
      if (isDisabled && isDisabled(m)) cell.setAttribute('aria-disabled', 'true');
      else cell.removeAttribute('aria-disabled');
    }
  }

  return {
    table,
    cells,
    render,
    destroy() {
      table.removeEventListener('click', onClick);
    },
  };
}

/**
 * The cell a navigation key moves to from `index` (0-11), and how many years that crosses. Returns null when the key is not a navigation key.
 *
 * @param {number} index
 * @param {string} key
 * @returns {{ index: number, yearDelta: number } | null}
 */
export function monthGridStep(index, key) {
  let next;
  let yearDelta = 0;
  switch (key) {
    case 'ArrowLeft':
      next = index - 1;
      break;
    case 'ArrowRight':
      next = index + 1;
      break;
    case 'ArrowUp':
      next = index - 3;
      break;
    case 'ArrowDown':
      next = index + 3;
      break;
    case 'Home':
      next = 0;
      break;
    case 'End':
      next = 11;
      break;
    case 'PageUp':
      yearDelta = -1;
      next = index;
      break;
    case 'PageDown':
      yearDelta = 1;
      next = index;
      break;
    default:
      return null;
  }
  if (next < 0) {
    yearDelta -= 1;
    next += 12;
  } else if (next > 11) {
    yearDelta += 1;
    next -= 12;
  }
  return { index: next, yearDelta };
}
