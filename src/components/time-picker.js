import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { findAncestorState } from '../common/ancestor';
import { disabledInputClasses, invalidInputClasses, pickerCellWrapperClasses, userInvalidInputClasses } from '../common/shared-classes';
import { dayPeriodLabels, formatTimeDisplay, getSelectedTime, partsToValue24 } from '../common/time';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import uuidv4 from '../utils/uuid';
import { Clock, createSvg } from './../common/icons';
import { sizeObserver } from './../common/input-size';

function scrollIntoCenter(container, element, behavior = 'instant') {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const offset = elementRect.top - containerRect.top - container.clientHeight / 2 + element.clientHeight / 2;

  container.scrollBy({
    top: offset,
    behavior,
  });
}

export default function (Alpine) {
  Alpine.directive('h-time-picker', (el, { expression, modifiers }, { evaluateLater, cleanup, effect, Alpine }) => {
    el._h_timepicker = Alpine.reactive({
      id: undefined,
      controls: `htpc${uuidv4()}`,
      expanded: false,
      is12Hour: false,
      locale: undefined,
      seconds: undefined,
      focusInput: undefined,
      close(focus = false) {
        el._h_timepicker.expanded = false;
        removeDismiss(el, 'click', el._h_timepicker.close);
        if (focus && this.focusInput) {
          this.focusInput();
        }
      },
    });
    el._h_time = {
      changed: undefined,
      model: undefined,
      setDisplay: undefined,
      parts: {
        hour: null,
        minute: null,
        second: null,
        period: null,
      },
    };

    el.classList.add(
      'cursor-pointer',
      'border-input',
      'flex',
      'items-center',
      'justify-between',
      'gap-2',
      'pl-3',
      'pr-2',
      'data-[size=sm]:pr-1',
      'text-sm',
      'whitespace-nowrap',
      'transition-[color,box-shadow]',
      'motion-reduce:transition-none',
      'duration-200',
      'outline-none',
      ...disabledInputClasses,
      'has-[input[readonly]]:bg-muted',
      'has-[input[readonly]]:cursor-default',
      'has-[input[readonly]]:text-foreground'
    );
    if (modifiers.includes('table')) {
      el.classList.add(
        ...pickerCellWrapperClasses,
        'hover:bg-table-hover',
        'hover:text-table-hover-foreground',
        'active:bg-table-active!',
        'active:text-table-active-foreground!',
        'has-[[aria-expanded=true]]:bg-transparent',
        'has-[[aria-expanded=true]]:text-foreground'
      );
      el.setAttribute('data-slot', 'cell-input-time');
    } else {
      el.classList.add(
        'w-full',
        'hover:bg-secondary-hover',
        'hover:text-secondary-foreground',
        '[&>[data-slot="time-picker-input"]]:hover:text-secondary-foreground',
        'active:bg-secondary-active',
        'active:text-secondary-foreground',
        '[&>[data-slot="time-picker-input"]]:active:text-secondary-foreground',
        'rounded-control',
        'border',
        'bg-input-inner',
        'shadow-input',
        'has-[[aria-expanded=true]]:bg-input-inner',
        'has-[[aria-expanded=true]]:text-foreground',
        'has-[input:focus-visible]:border-ring',
        'has-[input:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
        'has-[input:focus-visible]:ring-ring/50',
        ...invalidInputClasses,
        ...userInvalidInputClasses
      );
      el.setAttribute('data-slot', 'time-picker');
    }
    el.setAttribute('tabindex', '-1');
    el.appendChild(
      createSvg({
        icon: Clock,
        classes: 'opacity-70 text-inherit size-4 shrink-0 pointer-events-none',
        attrs: {
          'aria-hidden': true,
          role: 'presentation',
        },
      })
    );

    if (expression) {
      const getConfig = evaluateLater(expression);

      effect(() => {
        getConfig((config) => {
          if (config) {
            if (config['locale']) el._h_timepicker.locale = config.locale;
            el._h_timepicker.seconds = config['seconds'];
            el._h_timepicker.is12Hour = config['is12Hour'] === true;
          }
        });
      });
    }

    const handler = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      const input = el.querySelector('input');
      if (input && (input.readOnly || input.disabled)) return;
      el._h_timepicker.expanded = !el._h_timepicker.expanded;
      el.setAttribute('aria-expanded', el._h_timepicker.expanded);
      Alpine.nextTick(() => {
        if (el._h_timepicker.expanded) {
          addDismiss(el, 'click', el._h_timepicker.close);
        } else {
          removeDismiss(el, 'click', el._h_timepicker.close);
        }
      });
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', handler);

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
      el.removeEventListener('click', handler);
      el.removeEventListener('keydown', handler);
      removeDismiss(el, 'click', el._h_timepicker.close);
    });
  });

  Alpine.directive('h-time-picker-input', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'INPUT') {
      throw new Error(`${original} must be a readonly input of type "text"`);
    }
    const timepicker = findAncestorState(Alpine, el, '_h_timepicker');
    if (!timepicker) {
      throw new Error(`${original} must be inside a time-picker element`);
    }
    timepicker._h_timepicker.focusInput = () => {
      el.focus();
    };
    timepicker._h_time.changed = () => {
      Alpine.nextTick(() => {
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    };
    const updateDisplay = (value24h) => {
      el.value = formatTimeDisplay(value24h, { is12Hour: timepicker._h_timepicker.is12Hour, seconds: timepicker._h_timepicker.seconds });
    };
    timepicker._h_time.setDisplay = updateDisplay;

    if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
      timepicker._h_time.model = el._x_model;
      effect(() => {
        updateDisplay(el._x_model.get());
      });
    } else {
      timepicker._h_time.model = {
        get() {
          return el.value;
        },
        set(newValue) {
          el.value = newValue;
        },
      };
    }
    if (el.hasAttribute('id')) {
      timepicker._h_timepicker.id = el.getAttribute('id');
    } else {
      timepicker._h_timepicker.id = `htp${uuidv4()}`;
      el.setAttribute('id', timepicker._h_timepicker.id);
    }
    el.classList.add(
      'appearance-none',
      'cursor-pointer',
      '[&[readonly]]:cursor-default',
      'bg-transparent',
      'text-transparent',
      'text-shadow-[0_0_0_var(--foreground)]',
      'placeholder:text-muted-foreground',
      'outline-none',
      'size-full',
      'border-0',
      'md:text-sm',
      'text-base',
      'truncate'
    );
    el.setAttribute('aria-autocomplete', 'none');
    el.setAttribute('aria-controls', timepicker._h_timepicker.controls);
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-haspopup', 'dialog');
    el.setAttribute('type', 'text');
    el.setAttribute('data-slot', 'time-picker-input');

    const rawTime = timepicker._h_time.model.get();

    if (rawTime) {
      const { hour, minute, second, period } = getSelectedTime(rawTime, timepicker._h_timepicker.is12Hour);

      if (timepicker._h_timepicker.seconds === undefined && !second) {
        timepicker._h_timepicker.seconds = false;
      } else if (timepicker._h_timepicker.seconds === undefined && second) {
        timepicker._h_timepicker.seconds = true;
      }

      timepicker._h_time.parts.hour = hour;
      timepicker._h_time.parts.minute = minute;
      if (timepicker._h_timepicker.seconds) {
        timepicker._h_time.parts.second = second ?? '00';
      }
      timepicker._h_time.parts.period = period;
      updateDisplay(rawTime);
    }

    const is12Hour = timepicker._h_timepicker.is12Hour;
    const hasSeconds = timepicker._h_timepicker.seconds;
    let placeholder;
    if (hasSeconds) {
      placeholder = is12Hour ? '--:--:-- --' : '--:--:--';
    } else {
      placeholder = is12Hour ? '--:-- --' : '--:--';
    }
    el.setAttribute('placeholder', placeholder);

    const preventInput = (event) => {
      event.preventDefault();
    };

    el.addEventListener('beforeinput', preventInput);
    el.addEventListener('paste', preventInput);

    effect(() => {
      el.setAttribute('aria-expanded', timepicker._h_timepicker.expanded);
    });

    cleanup(() => {
      el.removeEventListener('beforeinput', preventInput);
      el.removeEventListener('paste', preventInput);
    });
  });

  Alpine.directive('h-time-picker-popup', (el, _, { effect, cleanup, Alpine }) => {
    const timepicker = findAncestorState(Alpine, el, '_h_timepicker');
    el.classList.add(
      'overflow-hidden',
      'outline-none',
      'border',
      'rounded-control',
      'absolute',
      'bg-popover',
      'text-popover-foreground',
      'flex',
      'flex-col',
      'hidden',
      'z-50',
      'shadow-md',
      'transition-[opacity,scale]',
      'motion-reduce:transition-none',
      'duration-100',
      'ease-out',
      'opacity-0',
      'scale-95'
    );
    el.setAttribute('id', timepicker._h_timepicker.controls);
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'time-picker-popup');
    el.setAttribute('aria-labelledby', timepicker._h_timepicker.id);

    const optionClasses = [
      'px-3.5',
      'py-2',
      'hover:bg-secondary-hover',
      'hover:text-secondary-foreground',
      'aria-selected:bg-primary-active',
      'aria-selected:text-primary-foreground',
      'focus:bg-secondary-hover',
      'focus:text-secondary-foreground',
      'focus:aria-selected:bg-primary-hover',
      'focus:aria-selected:text-primary-foreground',
      'text-sm',
      'text-center',
      'outline-hidden',
      'select-none',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-disabled',
    ];

    const updateModel = () => {
      if (timepicker._h_time.parts.hour === null || timepicker._h_time.parts.minute === null) return;
      if (timepicker._h_timepicker.is12Hour && timepicker._h_time.parts.period === null) return;
      if (timepicker._h_timepicker.seconds && timepicker._h_time.parts.second === null) return;

      const newValue = partsToValue24(timepicker._h_time.parts, { is12Hour: timepicker._h_timepicker.is12Hour, seconds: timepicker._h_timepicker.seconds });

      timepicker._h_time.model.set(newValue);
      timepicker._h_time.setDisplay?.(newValue);
      timepicker._h_time.changed();
    };

    const getCurrentTime = () => {
      let date = new Date();
      let hour = date.getHours();
      timepicker._h_time.parts.period = hour >= 12 ? dayPeriodLabels.pm : dayPeriodLabels.am;
      if (timepicker._h_timepicker.is12Hour) {
        hour = date.getHours() % 12 || 12;
      }
      let minute = date.getMinutes();
      timepicker._h_time.parts.hour = hour < 10 ? `0${hour}` : hour.toString();
      timepicker._h_time.parts.minute = minute < 10 ? `0${minute}` : minute.toString();
      if (timepicker._h_timepicker.seconds) {
        let second = date.getSeconds();
        timepicker._h_time.parts.second = second < 10 ? `0${second}` : second.toString();
      }
      updateModel();
      timepicker._h_timepicker.close();
    };

    function onKeyDown(event) {
      if (event.key === 'Escape') {
        timepicker._h_timepicker.close(true);
      } else if (event.target.tagName === 'LI') {
        let list;
        let inHoursList = event.target.parentElement.dataset.type === 'hours';
        if (inHoursList) {
          list = hoursList;
        } else if (event.target.parentElement.dataset.type === 'minutes') {
          list = minutesList;
        } else if (event.target.parentElement.dataset.type === 'seconds') {
          list = secondsList;
        } else if (event.target.parentElement.dataset.type === 'period') {
          list = periodList;
        }
        switch (event.key) {
          case 'Up':
          case 'ArrowUp': {
            event.target.setAttribute('tabindex', '-1');
            let prevElem = event.target.previousElementSibling;
            if (prevElem === null || prevElem.classList.contains('hidden')) {
              if (inHoursList && timepicker._h_timepicker.is12Hour) {
                prevElem = list.children[12];
              } else {
                prevElem = list.lastChild;
              }
            }
            prevElem.setAttribute('tabindex', '0');
            prevElem.focus();
            break;
          }
          case 'Down':
          case 'ArrowDown': {
            event.target.setAttribute('tabindex', '-1');
            let nextElem = event.target.nextElementSibling;
            if (nextElem === null || nextElem.classList.contains('hidden')) {
              if (inHoursList && timepicker._h_timepicker.is12Hour) {
                nextElem = list.children[1];
              } else {
                nextElem = list.firstChild;
              }
            }
            nextElem.setAttribute('tabindex', '0');
            nextElem.focus();
            break;
          }
          case 'Home':
          case 'PageUp': {
            let firstChild;
            if (list.firstChild === event.target) {
              break;
            } else if (inHoursList && timepicker._h_timepicker.is12Hour) {
              if (list.children[1] === event.target) {
                break;
              } else {
                firstChild = list.children[1];
              }
            } else {
              firstChild = list.firstChild;
            }
            event.target.setAttribute('tabindex', '-1');
            firstChild.setAttribute('tabindex', '0');
            firstChild.focus();
            break;
          }
          case 'End':
          case 'PageDown': {
            let lastElem;
            if (list.lastChild === event.target) {
              break;
            } else if (inHoursList && timepicker._h_timepicker.is12Hour) {
              if (list.children[12] !== event.target) {
                lastElem = list.children[12];
              } else {
                break;
              }
            } else {
              lastElem = list.lastChild;
            }
            event.target.setAttribute('tabindex', '-1');
            lastElem.setAttribute('tabindex', '0');
            lastElem.focus();
            break;
          }
          case 'Right':
          case 'ArrowRight': {
            let nextColumn = event.target.parentElement.nextElementSibling;
            if (nextColumn) {
              const child = nextColumn.querySelector('li[tabindex="0"]');
              child.focus();
            }
            break;
          }
          case 'Left':
          case 'ArrowLeft': {
            let prevColumn = event.target.parentElement.previousElementSibling;
            if (prevColumn) {
              const child = prevColumn.querySelector('li[tabindex="0"]');
              child.focus();
            }
            break;
          }
          case 'Enter':
          case ' ':
            event.target.click();
            break;
          default:
            return;
        }
        event.stopPropagation();
        event.preventDefault();
      } else if (event.key === 'Tab' && event.target.tagName === 'BUTTON') {
        if (event.target.dataset.action === 'close' || (event.target.dataset.action === 'time' && event.target.nextElementSibling.disabled)) {
          if (selectedHour) {
            selectedHour.focus();
          } else {
            hoursList.children[timepicker._h_timepicker.is12Hour ? 1 : 0].focus();
          }
          event.stopPropagation();
          event.preventDefault();
        }
      }
    }

    el.addEventListener('keydown', onKeyDown);

    function setTime(event) {
      if (event.target.tagName === 'LI') {
        if (event.target.parentElement.dataset.type === 'hours') {
          timepicker._h_time.parts.hour = event.target.innerText;
        } else if (event.target.parentElement.dataset.type === 'minutes') {
          timepicker._h_time.parts.minute = event.target.innerText;
        } else if (event.target.parentElement.dataset.type === 'seconds') {
          timepicker._h_time.parts.second = event.target.innerText;
        } else if (event.target.parentElement.dataset.type === 'period') {
          timepicker._h_time.parts.period = event.target.innerText;
        }
        render();
        updateModel();
      }
    }

    const timeContainer = document.createElement('div');
    timeContainer.classList.add('hbox', 'max-h-[14rem]', '[&>ul]:border-r', '[&>ul:last-of-type]:border-r-0');
    if (el.firstChild) el.classList.add('border-b');
    timeContainer.setAttribute('role', 'group');
    timeContainer.addEventListener('click', setTime);
    el.appendChild(timeContainer);

    const hoursList = document.createElement('ul');
    hoursList.classList.add('flex-1', 'overflow-y-auto', '[scrollbar-width:thin]');
    hoursList.setAttribute('role', 'listbox');
    hoursList.setAttribute('tabindex', '-1');
    hoursList.setAttribute('aria-label', el.dataset.labelHours ?? 'Select hour');
    hoursList.setAttribute('data-type', 'hours');
    timeContainer.appendChild(hoursList);

    for (let h = 0; h < 24; h++) {
      const hour = document.createElement('li');
      hour.classList.add(...optionClasses);
      hour.setAttribute('role', 'option');
      hour.setAttribute('tabindex', '-1');
      hour.setAttribute('aria-label', h);
      hour.setAttribute('aria-selected', false);
      hour.innerText = h < 10 ? `0${h}` : h;
      hoursList.appendChild(hour);
    }

    const minutesList = document.createElement('ul');
    minutesList.classList.add('flex-1', 'overflow-y-auto', '[scrollbar-width:thin]');
    minutesList.setAttribute('role', 'listbox');
    minutesList.setAttribute('tabindex', '-1');
    minutesList.setAttribute('aria-label', el.dataset.labelMinutes ?? 'Select minute');
    minutesList.setAttribute('data-type', 'minutes');
    timeContainer.appendChild(minutesList);

    for (let m = 0; m < 60; m++) {
      const minute = document.createElement('li');
      minute.classList.add(...optionClasses);
      minute.setAttribute('role', 'option');
      minute.setAttribute('tabindex', '-1');
      minute.setAttribute('aria-label', m);
      minute.setAttribute('aria-selected', false);
      minute.innerText = m < 10 ? `0${m}` : m;
      minutesList.appendChild(minute);
    }

    const secondsList = document.createElement('ul');
    secondsList.classList.add('flex-1', 'overflow-y-auto', '[scrollbar-width:thin]');
    if (!timepicker._h_timepicker.seconds) {
      secondsList.classList.add('hidden');
    }
    secondsList.setAttribute('role', 'listbox');
    secondsList.setAttribute('tabindex', '-1');
    secondsList.setAttribute('aria-label', el.dataset.labelSeconds ?? 'Select second');
    secondsList.setAttribute('data-type', 'seconds');
    timeContainer.appendChild(secondsList);

    for (let s = 0; s < 60; s++) {
      const second = document.createElement('li');
      second.classList.add(...optionClasses);
      second.setAttribute('role', 'option');
      second.setAttribute('tabindex', '-1');
      second.setAttribute('aria-label', s);
      second.setAttribute('aria-selected', false);
      second.innerText = s < 10 ? `0${s}` : s;
      secondsList.appendChild(second);
    }

    const periodList = document.createElement('ul');
    periodList.classList.add('flex-1', 'overflow-y-auto', '[scrollbar-width:thin]');
    if (!timepicker._h_timepicker.is12Hour) {
      periodList.classList.add('hidden');
    }
    periodList.setAttribute('role', 'listbox');
    periodList.setAttribute('tabindex', '-1');
    periodList.setAttribute('aria-label', el.dataset.labelMeridiem ?? 'Select meridiem');
    periodList.setAttribute('data-type', 'period');
    timeContainer.appendChild(periodList);

    const am = document.createElement('li');
    am.classList.add(...optionClasses);
    am.setAttribute('role', 'option');
    am.setAttribute('tabindex', '-1');
    am.setAttribute('aria-selected', false);
    am.innerText = dayPeriodLabels.am;
    periodList.appendChild(am);

    const pm = document.createElement('li');
    pm.classList.add(...optionClasses);
    pm.setAttribute('role', 'option');
    pm.setAttribute('tabindex', '-1');
    pm.setAttribute('aria-selected', false);
    pm.innerText = dayPeriodLabels.pm;
    periodList.appendChild(pm);

    const footer = document.createElement('div');
    footer.classList.add('hbox', 'justify-between', 'gap-1', 'border-t', 'p-2');
    footer.setAttribute('tabindex', '-1');

    const nowButton = document.createElement('button');
    nowButton.setAttribute('type', 'button');
    nowButton.setAttribute(Alpine.prefixed('h-button'), '');
    nowButton.setAttribute('data-size', 'sm');
    nowButton.setAttribute('data-action', 'time');
    nowButton.innerText = el.dataset.labelNow ?? 'Now';
    nowButton.addEventListener('click', getCurrentTime);
    footer.appendChild(nowButton);

    const okButton = document.createElement('button');
    okButton.setAttribute('type', 'button');
    okButton.setAttribute(Alpine.prefixed('h-button'), '');
    okButton.setAttribute('data-variant', 'primary');
    okButton.setAttribute('data-size', 'sm');
    okButton.setAttribute('data-action', 'close');
    okButton.innerText = el.dataset.labelOk ?? 'OK';
    okButton.disabled = true;
    okButton.addEventListener('click', timepicker._h_timepicker.close);
    footer.appendChild(okButton);

    el.appendChild(footer);
    Alpine.initTree(footer);

    let selectedHour;
    let selectedMinute;
    let selectedSecond;
    let selectedPeriod;

    function render() {
      if (timepicker._h_timepicker.is12Hour) {
        hoursList.firstChild.classList.add('hidden');
        for (let h = 1; h < 13; h++) {
          if (hoursList.children[h].innerText === timepicker._h_time.parts.hour) {
            hoursList.children[h].setAttribute('tabindex', '0');
            hoursList.children[h].setAttribute('aria-selected', true);
            selectedHour = hoursList.children[h];
          } else {
            hoursList.children[h].setAttribute('tabindex', '-1');
            hoursList.children[h].setAttribute('aria-selected', false);
          }
        }
        for (let h = 13; h < hoursList.children.length; h++) {
          hoursList.children[h].classList.add('hidden');
          hoursList.children[h].setAttribute('tabindex', '-1');
          hoursList.children[h].setAttribute('aria-selected', false);
        }
      } else {
        for (let h = 0; h < hoursList.children.length; h++) {
          hoursList.children[h].classList.remove('hidden');
          if (hoursList.children[h].innerText === timepicker._h_time.parts.hour) {
            hoursList.children[h].setAttribute('tabindex', '0');
            hoursList.children[h].setAttribute('aria-selected', true);
            selectedHour = hoursList.children[h];
          } else {
            hoursList.children[h].setAttribute('tabindex', '-1');
            hoursList.children[h].setAttribute('aria-selected', false);
          }
        }
      }
      if (!selectedHour) {
        hoursList.children[timepicker._h_timepicker.is12Hour ? 1 : 0].setAttribute('tabindex', '0');
      }

      for (let m = 0; m < minutesList.children.length; m++) {
        if (minutesList.children[m].innerText === timepicker._h_time.parts.minute) {
          minutesList.children[m].setAttribute('tabindex', '0');
          minutesList.children[m].setAttribute('aria-selected', true);
          selectedMinute = minutesList.children[m];
        } else {
          minutesList.children[m].setAttribute('tabindex', '-1');
          minutesList.children[m].setAttribute('aria-selected', false);
        }
      }
      if (!selectedMinute) {
        minutesList.firstChild.setAttribute('tabindex', '0');
      }

      if (timepicker._h_timepicker.seconds) {
        secondsList.classList.remove('hidden');
        for (let s = 0; s < secondsList.children.length; s++) {
          if (secondsList.children[s].innerText === timepicker._h_time.parts.second) {
            secondsList.children[s].setAttribute('tabindex', '0');
            secondsList.children[s].setAttribute('aria-selected', true);
            selectedSecond = secondsList.children[s];
          } else {
            secondsList.children[s].setAttribute('tabindex', '-1');
            secondsList.children[s].setAttribute('aria-selected', false);
          }
        }
        if (!selectedSecond) {
          secondsList.firstChild.setAttribute('tabindex', '0');
        }
        if (timepicker._h_timepicker.is12Hour) {
          okButton.disabled = timepicker._h_time.parts.hour && timepicker._h_time.parts.minute && timepicker._h_time.parts.second && timepicker._h_time.parts.period ? false : true;
        } else {
          okButton.disabled = timepicker._h_time.parts.hour && timepicker._h_time.parts.minute && timepicker._h_time.parts.second ? false : true;
        }
      } else {
        secondsList.classList.add('hidden');
        if (timepicker._h_timepicker.is12Hour) {
          okButton.disabled = timepicker._h_time.parts.hour && timepicker._h_time.parts.minute && timepicker._h_time.parts.period ? false : true;
        } else {
          okButton.disabled = timepicker._h_time.parts.hour && timepicker._h_time.parts.minute ? false : true;
        }
      }

      if (timepicker._h_timepicker.is12Hour) {
        periodList.classList.remove('hidden');
        for (let p = 0; p < periodList.children.length; p++) {
          if (periodList.children[p].innerText === timepicker._h_time.parts.period) {
            periodList.children[p].setAttribute('tabindex', '0');
            periodList.children[p].setAttribute('aria-selected', true);
            selectedPeriod = periodList.children[p];
          } else {
            periodList.children[p].setAttribute('tabindex', '-1');
            periodList.children[p].setAttribute('aria-selected', false);
          }
        }
        if (!selectedPeriod) {
          periodList.firstChild.setAttribute('tabindex', '0');
        }
      } else {
        periodList.classList.add('hidden');
      }
    }

    const onClick = (event) => {
      event.stopPropagation();
    };

    el.addEventListener('click', onClick);

    let autoUpdateCleanup;

    let focusFirstItem = true;

    function updatePosition() {
      computePosition(timepicker, el, {
        placement: el.getAttribute('data-align') || 'bottom-start',
        middleware: [offset(4), flip(), shift({ padding: 4 })],
      }).then(({ x, y }) => {
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        el.classList.remove('scale-95', 'opacity-0');
        if (focusFirstItem) {
          focusFirstItem = false;
          Alpine.nextTick(() => {
            if (selectedHour) {
              selectedHour.focus();
            } else {
              hoursList.children[timepicker._h_timepicker.is12Hour ? 1 : 0].focus();
            }
          });
        }
      });
    }

    effect(() => {
      if (timepicker._h_timepicker.expanded) {
        render();
        el.classList.remove('hidden');
        autoUpdateCleanup = autoUpdate(timepicker, el, updatePosition);
        if (selectedHour) scrollIntoCenter(selectedHour.parentElement, selectedHour);
        if (selectedMinute) scrollIntoCenter(selectedMinute.parentElement, selectedMinute);
        if (selectedSecond && timepicker._h_timepicker.seconds) scrollIntoCenter(selectedSecond.parentElement, selectedSecond);
      } else {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', 'scale-95', 'opacity-0');
          Object.assign(el.style, {
            left: '0px',
            top: '0px',
          });
        } else {
          el.classList.add('scale-95', 'opacity-0');
        }
        if (autoUpdateCleanup) autoUpdateCleanup();
        focusFirstItem = true;
      }
    });

    function onTransitionEnd(event) {
      if (event.target === el && event.target.classList.contains('opacity-0')) {
        el.classList.add('hidden');
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    }

    el.addEventListener('transitionend', onTransitionEnd);

    cleanup(() => {
      if (autoUpdateCleanup) autoUpdateCleanup();
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('click', onClick);
      el.removeEventListener('transitionend', onTransitionEnd);
      okButton.removeEventListener('click', timepicker._h_timepicker.close);
      nowButton.removeEventListener('click', getCurrentTime);
      timeContainer.removeEventListener('click', setTime);
      Alpine.destroyTree(footer);
    });
  });
}
