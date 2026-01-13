import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, createElement } from 'lucide';
import { v4 as uuidv4 } from 'uuid';

export default function (Alpine) {
  Alpine.directive('h-calendar', (el, { original, expression }, { effect, evaluateLater, cleanup, Alpine }) => {
    const datepicker = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_datepicker'));
    el.classList.add('border', 'rounded-control', 'gap-2', 'p-2');
    el.setAttribute('tabindex', '-1');
    if (datepicker) {
      el.classList.add('fixed', 'bg-popover', 'text-popover-foreground', 'data-[state=open]:flex', 'data-[state=open]:flex-col', 'data-[state=closed]:hidden', 'z-50', 'shadow-md');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('data-slot', 'date-picker-calendar');
      el.setAttribute('data-state', datepicker._h_datepicker.expanded ? 'open' : 'closed');
    } else {
      el.classList.add('shadow-input', 'data-[invalid=true]:border-negative', 'data-[invalid=true]:ring-negative/20', 'dark:data-[invalid=true]:ring-negative/40');
    }

    let date = new Date();
    let selected = undefined;
    let focusedDay = undefined;

    let locale = undefined;
    let formatter = undefined;
    let modelAsIso = false;
    let firstDay = 0;
    let minDate = undefined;
    let maxDate = undefined;

    function modelChange(triggerInput = false) {
      Alpine.nextTick(() => {
        el.dispatchEvent(new CustomEvent('change', { detail: { date: selected } }));
      });
      if (el._x_model) {
        if (modelAsIso) {
          el._x_model.set(selected.toISOString());
        } else {
          el._x_model.set(formatter.format(selected));
        }
      }
      if (datepicker) {
        datepicker._h_datepicker.input.value = formatter.format(selected);
        datepicker._h_datepicker.input.setCustomValidity('');
        if (triggerInput) datepicker._h_datepicker.input.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        el.setAttribute('data-invalid', 'false');
      }
    }

    const onInputChange = () => {
      const newValue = new Date(datepicker._h_datepicker.input.value);
      if (isNaN(newValue)) {
        console.error(`${original}: input value is not a valid date - ${datepicker._h_datepicker.input.value}`);
        datepicker._h_datepicker.input.setCustomValidity('Input value is not a valid date.');
        return;
      } else if (selected.getTime() !== newValue.getTime()) {
        selected = newValue;
        modelChange();
        render();
      }
      datepicker._h_datepicker.input.setCustomValidity('');
    };

    if (datepicker) {
      datepicker._h_datepicker.input.addEventListener('change', onInputChange);
    }

    function checkForModel() {
      if (el.hasOwnProperty('_x_model') && el._x_model.get()) {
        selected = new Date(el._x_model.get());
        if (isNaN(selected)) {
          console.error(`${original}: input value is not a valid date - ${el._x_model.get()}`);
          if (datepicker) datepicker._h_datepicker.input.setCustomValidity('Input value is not a valid date.');
          else el.setAttribute('data-invalid', 'true');
        } else if (datepicker) {
          datepicker._h_datepicker.input.value = formatter.format(selected);
        }
      }
    }

    function dayClick(event) {
      if (event.target.getAttribute('aria-disabled') === 'true') return;
      focusedDay = new Date(event.target.dataset.year, event.target.dataset.month, event.target.dataset.day);
      selected = new Date(focusedDay);
      modelChange(true);
      render();
      if (datepicker) datepicker._h_datepicker.expanded = false;
    }

    function isDisabled(d) {
      if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true;
      if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true;
      return false;
    }

    function sameDay(dateA, dateB) {
      return dateA && dateB && dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
    }

    const weekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
    function getWeekdayNames() {
      return Array.from({ length: 7 }, (_, i) => {
        const weekday = (i + firstDay) % 7;
        return weekdayFormat.format(new Date(2020, 9, weekday + 4));
      });
    }

    const fullWeekdayFormat = new Intl.DateTimeFormat(locale, { weekday: 'long' });
    function getFullWeekdayNames() {
      return Array.from({ length: 7 }, (_, i) => {
        const weekday = (i + firstDay) % 7;
        return fullWeekdayFormat.format(new Date(2020, 9, weekday + 4));
      });
    }

    let weekdayNames = undefined;
    let fullWeekdayNames = undefined;

    const header = document.createElement('div');
    header.classList.add('hbox', 'gap-2', 'items-center', 'justify-between');
    const buttonClasses = [
      'size-9',
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'justify-center',
      'rounded-control',
      'text-sm',
      'font-medium',
      'transition-all',
      'outline-none',
      'focus-visible:border-ring',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[3px]',
      'bg-transparent',
      'text-foreground',
      'hover:bg-secondary',
      'hover:text-secondary-foreground',
      'active:bg-secondary-active',
      'aria-pressed:bg-secondary-active',
    ];
    const previousYearBtn = document.createElement('button');
    previousYearBtn.classList.add(...buttonClasses);
    previousYearBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-year') ? el.hasAttribute('data-aria-prev-year') : 'previous year');
    previousYearBtn.setAttribute('type', 'button');
    previousYearBtn.appendChild(
      createElement(ChevronsLeft, {
        class: ['opacity-50 size-4 shrink-0 pointer-events-none'],
        width: '16',
        height: '16',
        'aria-hidden': true,
        role: 'presentation',
      })
    );
    previousYearBtn.addEventListener('click', () => {
      date.setFullYear(date.getFullYear() - 1);
      render();
    });
    header.appendChild(previousYearBtn);

    const previousMonthBtn = document.createElement('button');
    previousMonthBtn.classList.add(...buttonClasses);
    previousMonthBtn.setAttribute('aria-label', el.hasAttribute('data-aria-prev-month') ? el.hasAttribute('data-aria-prev-month') : 'previous month');
    previousMonthBtn.setAttribute('type', 'button');
    previousMonthBtn.appendChild(
      createElement(ChevronLeft, {
        class: ['opacity-50 size-4 shrink-0 pointer-events-none'],
        width: '16',
        height: '16',
        'aria-hidden': true,
        role: 'presentation',
      })
    );
    previousMonthBtn.addEventListener('click', () => {
      date.setMonth(date.getMonth() - 1);
      render();
    });
    header.appendChild(previousMonthBtn);

    const headerLabel = document.createElement('h2');
    headerLabel.classList.add('min-w-[8rem]', 'text-center');
    headerLabel.setAttribute('id', `hdpl${uuidv4()}`);
    headerLabel.setAttribute('aria-live', 'polite');
    header.appendChild(headerLabel);

    const nextMonthBtn = document.createElement('button');
    nextMonthBtn.classList.add(...buttonClasses);
    nextMonthBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-month') ? el.hasAttribute('data-aria-next-month') : 'next month');
    nextMonthBtn.setAttribute('type', 'button');
    nextMonthBtn.appendChild(
      createElement(ChevronRight, {
        class: ['opacity-50 size-4 shrink-0 pointer-events-none'],
        width: '16',
        height: '16',
        'aria-hidden': true,
        role: 'presentation',
      })
    );
    nextMonthBtn.addEventListener('click', () => {
      date.setMonth(date.getMonth() + 1);
      render();
    });
    header.appendChild(nextMonthBtn);

    const nextYearBtn = document.createElement('button');
    nextYearBtn.classList.add(...buttonClasses);
    nextYearBtn.setAttribute('aria-label', el.hasAttribute('data-aria-next-year') ? el.hasAttribute('data-aria-next-year') : 'next year');
    nextYearBtn.setAttribute('type', 'button');
    nextYearBtn.appendChild(
      createElement(ChevronsRight, {
        class: ['opacity-50 size-4 shrink-0 pointer-events-none'],
        width: '16',
        height: '16',
        'aria-hidden': true,
        role: 'presentation',
      })
    );
    nextYearBtn.addEventListener('click', () => {
      date.setFullYear(date.getFullYear() + 1);
      render();
    });
    header.appendChild(nextYearBtn);
    el.appendChild(header);

    const datesTable = document.createElement('table');
    if (datepicker) datesTable.setAttribute('aria-labelledby', `hdpl${uuidv4()}`);
    datesTable.classList.add('table-fixed', 'border-separate', 'border-spacing-1');
    if (!datepicker) datesTable.classList.add('w-full');
    const thead = document.createElement('thead');
    datesTable.appendChild(thead);
    const theadRow = document.createElement('tr');
    thead.appendChild(theadRow);
    const tbody = document.createElement('tbody');
    datesTable.appendChild(tbody);

    // Weekday headers with ARIA columnheader
    function setWeekdayHeaders() {
      theadRow.replaceChildren();
      for (let i = 0; i < 7; i++) {
        const th = document.createElement('th');
        th.setAttribute('scope', 'col');
        th.setAttribute('abbr', weekdayNames[i]);
        th.setAttribute('aria-label', fullWeekdayNames[i]);
        th.classList.add('text-sm', 'font-medium');
        th.innerText = weekdayNames[i];
        theadRow.appendChild(th);
      }
    }

    el.appendChild(datesTable);

    const dayCells = [];

    for (let r = 0; r < 6; r++) {
      const row = document.createElement('tr');
      for (let d = 0; d < 7; d++) {
        const cell = document.createElement('td');
        cell.classList.add(
          'cursor-pointer',
          'text-sm',
          'align-middle',
          'text-center',
          'size-8',
          'rounded-control',
          'outline-none',
          'hover:bg-secondary-hover',
          'hover:text-secondary-foreground',
          'focus:bg-secondary-hover',
          'focus:text-secondary-foreground',
          'aria-[current=date]:bg-secondary',
          'hover:aria-[current=date]:bg-secondary-hover',
          'aria-[current=date]:text-secondary-foreground',
          'aria-selected:!bg-primary-active',
          'aria-selected:hover:!bg-primary-hover',
          'aria-selected:focus:!bg-primary-hover',
          'aria-selected:!text-primary-foreground',
          'aria-disabled:pointer-events-none',
          'aria-disabled:opacity-50'
        );
        cell.setAttribute('tabindex', '-1');
        dayCells.push(row.appendChild(cell));
      }
      tbody.appendChild(row);
    }

    function render(fromNav = false) {
      const year = date.getFullYear();
      const month = date.getMonth();

      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 0);
      const days = end.getDate();

      const prevEndDay = new Date(year, month, 1);
      prevEndDay.setDate(prevEndDay.getDate() - 1);

      let lastPrevMonthDay = prevEndDay.getDate();
      let startDay = (start.getDay() - firstDay + 7) % 7;

      headerLabel.innerText = new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(start);

      let cellIndex = 0;

      function updateDateCell(cell, dayNum) {
        cell.setAttribute('tabindex', '-1');
        cell.setAttribute('aria-disabled', 'true');
        cell.removeAttribute('data-day');
        cell.removeAttribute('data-month');
        cell.removeAttribute('data-year');
        cell.removeAttribute('aria-selected');
        cell.removeAttribute('aria-current');
        if (dayNum < 10) {
          cell.innerText = `0${dayNum}`;
        } else {
          cell.innerText = dayNum;
        }
        cell.removeEventListener('click', dayClick);
      }

      // Previous month days at the beginning
      for (let d = startDay - 1; d >= 0; d--) {
        updateDateCell(dayCells[d], lastPrevMonthDay);
        lastPrevMonthDay--;
        cellIndex++;
      }

      // Active month days
      for (let d = 1; d <= days; d++) {
        const curr = new Date(year, month, d);
        const focusable = focusedDay && sameDay(focusedDay, curr);
        dayCells[cellIndex].setAttribute('data-day', d);
        dayCells[cellIndex].setAttribute('data-month', month);
        dayCells[cellIndex].setAttribute('data-year', year);
        dayCells[cellIndex].setAttribute('tabindex', focusable ? '0' : '-1');
        dayCells[cellIndex].setAttribute('aria-selected', selected && sameDay(selected, curr) ? 'true' : 'false');
        dayCells[cellIndex].setAttribute('aria-disabled', isDisabled(curr));
        if (fromNav && focusable) {
          dayCells[cellIndex].focus();
        }
        if (sameDay(new Date(), curr)) {
          dayCells[cellIndex].setAttribute('aria-current', 'date');
          if (focusedDay === undefined) dayCells[cellIndex].setAttribute('tabindex', '0');
        } else dayCells[cellIndex].removeAttribute('aria-current');
        if (d < 10) {
          dayCells[cellIndex].innerText = `0${d}`;
        } else {
          dayCells[cellIndex].innerText = d;
        }
        dayCells[cellIndex].addEventListener('click', dayClick);
        cellIndex++;
      }

      // Next month days at the end
      let lastDayNum = 1;
      for (cellIndex; cellIndex < 42; cellIndex++) {
        updateDateCell(dayCells[cellIndex], lastDayNum);
        lastDayNum++;
      }
    }

    function focusDay() {
      if (selected) {
        for (let d = 0; d < dayCells.length; d++) {
          if (dayCells[d].getAttribute('aria-selected') === 'true') {
            dayCells[d].focus();
            return;
          }
        }
      }
      for (let d = 0; d < dayCells.length; d++) {
        if (dayCells[d].hasAttribute('aria-current')) {
          dayCells[d].focus();
          return;
        }
      }
    }

    function onKeyDown(event) {
      event.stopPropagation();
      if (!focusedDay) focusedDay = selected || new Date(date.getFullYear(), date.getMonth(), 1);
      let newDay = new Date(focusedDay);

      switch (event.key) {
        case 'ArrowLeft':
          newDay.setDate(newDay.getDate() - 1);
          break;
        case 'ArrowRight':
          newDay.setDate(newDay.getDate() + 1);
          break;
        case 'ArrowUp':
          newDay.setDate(newDay.getDate() - 7);
          break;
        case 'ArrowDown':
          newDay.setDate(newDay.getDate() + 7);
          break;
        case 'Home':
          newDay.setDate(1);
          break;
        case 'End':
          newDay.setDate(end.getDate());
          break;
        case 'PageUp':
          newDay.setMonth(newDay.getMonth() - 1);
          break;
        case 'PageDown':
          newDay.setMonth(newDay.getMonth() + 1);
          break;
        case 'Escape':
          if (datepicker) datepicker._h_datepicker.expanded = false;
          return;

        case 'Enter':
        case ' ':
          if (!isDisabled(focusedDay)) {
            selected = new Date(focusedDay);
            modelChange();
            render(true);
          }
          return;

        default:
          return;
      }

      // If the user has navigated to a date from a previous or next month
      if (newDay.getMonth() !== date.getMonth()) {
        date = newDay;
        focusedDay = newDay;
        render(true);
        return;
      }

      focusedDay = newDay;
      render(true);
    }

    el.addEventListener('keydown', onKeyDown);

    if (expression) {
      const getConfig = evaluateLater(expression);

      effect(() => {
        getConfig((config) => {
          if (config.locale) locale = config.locale;
          if (config.firstDay) firstDay = config.firstDay;
          if (config.options) formatter = new Intl.DateTimeFormat(locale, config.options);
          else formatter = new Intl.DateTimeFormat(locale);
          modelAsIso = config.modelAsIso === false;
          if (config.min) minDate = new Date(config.min);
          if (config.max) maxDate = new Date(config.max);
          weekdayNames = getWeekdayNames();
          fullWeekdayNames = getFullWeekdayNames();
          setWeekdayHeaders();
          checkForModel();
          render();
        });
      });
    } else {
      formatter = new Intl.DateTimeFormat();
      weekdayNames = getWeekdayNames();
      fullWeekdayNames = getFullWeekdayNames();
      setWeekdayHeaders();
      checkForModel();
      render();
    }

    let autoUpdateCleanup;

    function updatePosition() {
      computePosition(datepicker, el, {
        placement: el.getAttribute('data-align') || 'bottom-start',
        strategy: 'fixed',
        middleware: [offset(4), flip(), shift({ padding: 4 })],
      }).then(({ x, y }) => {
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }

    if (datepicker) {
      effect(() => {
        el.setAttribute('data-state', datepicker._h_datepicker.expanded ? 'open' : 'closed');
        if (datepicker._h_datepicker.expanded) {
          autoUpdateCleanup = autoUpdate(datepicker, el, updatePosition);
          Alpine.nextTick(() => {
            focusDay();
          });
        } else {
          if (autoUpdateCleanup) autoUpdateCleanup();
          Object.assign(el.style, {
            left: '0px',
            top: '0px',
          });
        }
      });
    }

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      for (let d = 0; d < dayCells.length; d++) {
        dayCells[d].removeEventListener('click', dayClick);
      }
      if (datepicker) {
        datepicker._h_datepicker.input.removeEventListener('change', onInputChange);
      }
    });
  });
}
