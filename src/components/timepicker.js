import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { Clock, createElement } from 'lucide';
import { v4 as uuidv4 } from 'uuid';
import { sizeObserver } from './../common/input-size';

const dayPeriodLabels = { am: 'AM', pm: 'PM' };

const getSelectedTime = (rawTime, convertTo12) => {
  let hour = null;
  let minute = null;
  let second = null;
  let period = null;
  if (rawTime.length > 0) {
    let timeParts = rawTime.split(':');
    if (rawTime.toUpperCase().endsWith('AM')) {
      period = dayPeriodLabels.am;
    } else if (rawTime.toUpperCase().endsWith('PM')) {
      period = dayPeriodLabels.pm;
    }
    if (period) {
      timeParts[timeParts.length - 1] = timeParts[timeParts.length - 1].substring(0, timeParts[timeParts.length - 1].length - 3);
    }
    minute = timeParts[1];
    if ((!period && timeParts.length === 3) || (period && timeParts.length === 4)) {
      second = timeParts[2];
    }
    if (convertTo12 && period) {
      hour = timeParts[0];
    } else if (convertTo12 && !period) {
      period = Number(timeParts[0]) >= 12 ? dayPeriodLabels.pm : dayPeriodLabels.am;
      hour = Number(timeParts[0]) % 12 || 12;
      if (hour < 10) hour = `0${hour}`;
    } else if (!convertTo12 && period) {
      if (period === dayPeriodLabels.pm) {
        hour = Number(timeParts[0]) + 12;
      } else {
        hour = timeParts[0];
      }
    } else {
      hour = timeParts[0];
    }
  }
  return { hour, minute, second, period };
};

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
  Alpine.directive('h-time-picker', (el, { expression }, { evaluateLater, cleanup, effect, Alpine }) => {
    el._h_timepicker = Alpine.reactive({
      id: undefined,
      controls: `htpc${uuidv4()}`,
      model: undefined,
      expanded: false,
      is12Hour: false,
      locale: undefined,
      seconds: undefined,
      focusInput: undefined,
      close(focus = false) {
        el._h_timepicker.expanded = false;
        top.removeEventListener('click', el._h_timepicker.close);
        if (focus && this.focusInput) {
          this.focusInput();
        }
      },
    });
    el._h_time = {
      changed: undefined,
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
      '[&>input]:appearance-none',
      'has-[input:focus-visible]:border-ring',
      'has-[input:focus-visible]:ring-[calc(var(--spacing)*0.75)]',
      'has-[input:focus-visible]:ring-ring/50',
      'has-[input[aria-invalid=true]]:ring-negative/20',
      'has-[input[aria-invalid=true]]:border-negative',
      'dark:has-[input[aria-invalid=true]]:ring-negative/40',
      'has-[input:invalid]:ring-negative/20',
      'has-[input:invalid]:border-negative',
      'dark:has-[input:invalid]:ring-negative/40',
      'hover:bg-secondary-hover',
      'active:bg-secondary-active',
      'flex',
      'w-full',
      'items-center',
      'justify-between',
      'gap-2',
      'rounded-control',
      'border',
      'bg-input-inner',
      'pl-3',
      'pr-2',
      'data-[size=sm]:pr-1',
      'text-sm',
      'whitespace-nowrap',
      'shadow-input',
      'transition-[color,box-shadow]',
      'duration-200',
      'outline-none',
      'has-[input:disabled]:pointer-events-none',
      'has-[input:disabled]:opacity-50'
    );
    el.setAttribute('data-slot', 'time-picker');
    el.setAttribute('tabindex', '-1');
    el.appendChild(
      createElement(Clock, {
        class: ['opacity-70 text-foreground size-4 shrink-0 pointer-events-none'],
        width: '16',
        height: '16',
        'aria-hidden': true,
        role: 'presentation',
      })
    );

    if (expression) {
      const getConfig = evaluateLater(expression);

      effect(() => {
        getConfig((config) => {
          if (config) {
            if (config['locale']) el._h_timepicker.locale = config.locale;
            el._h_timepicker.seconds = config['seconds'];
            if (config['is12Hour'] !== undefined) {
              el._h_timepicker.is12Hour = config.is12Hour;
            } else {
              el._h_timepicker.is12Hour = new Intl.DateTimeFormat(el._h_timepicker.locale, { hour: 'numeric' }).resolvedOptions().hour12;
            }
          }
        });
      });
    } else {
      el._h_timepicker.is12Hour = new Intl.DateTimeFormat(el._h_timepicker.locale, { hour: 'numeric' }).resolvedOptions().hour12;
    }

    const handler = (event) => {
      if (event.type === 'keydown' && event.key !== 'Enter') return;
      el._h_timepicker.expanded = !el._h_timepicker.expanded;
      el.setAttribute('aria-expanded', el._h_timepicker.expanded);
      Alpine.nextTick(() => {
        if (el._h_timepicker.expanded) {
          top.addEventListener('click', el._h_timepicker.close);
        } else {
          top.removeEventListener('click', el._h_timepicker.close);
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
      top.removeEventListener('click', el._h_timepicker.close);
    });
  });

  Alpine.directive('h-time-picker-input', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'INPUT') {
      throw new Error(`${original} must be a readonly input of type "text"`);
    }
    const timepicker = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_timepicker'));
    if (!timepicker) {
      throw new Error(`${original} must be inside a time-picker element`);
    }
    timepicker._h_timepicker.focusInput = () => {
      el.focus();
    };
    timepicker._h_time.changed = () => {
      Alpine.nextTick(() => {
        el.dispatchEvent(new Event('change'));
      });
    };
    if (el.hasOwnProperty('_x_model')) {
      timepicker._h_timepicker.model = el._x_model;
    } else {
      timepicker._h_timepicker.model = {
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
    el.classList.add('cursor-pointer', 'bg-transparent', 'text-transparent', 'text-shadow-[0_0_0_var(--foreground)]', 'placeholder:text-muted-foreground', 'outline-none', 'size-full', 'border-0', 'md:text-sm', 'text-base', 'truncate');
    el.setAttribute('aria-autocomplete', 'none');
    el.setAttribute('aria-controls', timepicker._h_timepicker.controls);
    el.setAttribute('aria-expanded', 'false');
    el.setAttribute('aria-haspopup', 'dialog');
    el.setAttribute('type', 'text');
    el.setAttribute('data-slot', 'time-picker-input');

    const rawTime = timepicker._h_timepicker.model.get();

    if (rawTime) {
      const { hour, minute, second, period } = getSelectedTime(rawTime, timepicker._h_timepicker.is12Hour);

      if (timepicker._h_timepicker.seconds === undefined && !second) {
        timepicker._h_timepicker.seconds = false;
      } else if (timepicker._h_timepicker.seconds === undefined && second) {
        timepicker._h_timepicker.seconds = true;
      }

      if (timepicker._h_timepicker.is12Hour) {
        if (timepicker._h_timepicker.seconds) {
          timepicker._h_timepicker.model.set(`${hour}:${minute}:${second ?? '00'} ${period}`);
          timepicker._h_time.parts.second = second ?? '00';
        } else {
          timepicker._h_timepicker.model.set(`${hour}:${minute} ${period}`);
        }
        timepicker._h_time.parts.hour = hour;
        timepicker._h_time.parts.minute = minute;
        timepicker._h_time.parts.period = period;
      } else {
        if (timepicker._h_timepicker.seconds) {
          timepicker._h_timepicker.model.set(`${hour}:${minute}:${second ?? '00'}`);
          timepicker._h_time.parts.second = second ?? '00';
        } else {
          timepicker._h_timepicker.model.set(`${hour}:${minute}`);
        }
        timepicker._h_time.parts.hour = hour;
        timepicker._h_time.parts.minute = minute;
      }
    }

    let placeholder;
    if (timepicker._h_timepicker.seconds) {
      placeholder = timepicker._h_timepicker.is12Hour ? '--:--:-- --' : '--:--:--';
    } else {
      placeholder = timepicker._h_timepicker.is12Hour ? '--:-- --' : '--:--';
    }
    el.setAttribute('placeholder', placeholder);

    const preventInput = (event) => {
      event.preventDefault();
    };

    el.addEventListener('beforeinput', preventInput);
    el.addEventListener('paste', preventInput);

    effect(() => {
      el.setAttribute('data-state', timepicker._h_timepicker.expanded ? 'open' : 'closed');
      el.setAttribute('aria-expanded', timepicker._h_timepicker.expanded);
    });

    cleanup(() => {
      el.removeEventListener('keydown', preventInput);
      el.removeEventListener('paste', preventInput);
    });
  });

  Alpine.directive('h-time-picker-popup', (el, _, { effect, cleanup, Alpine }) => {
    const timepicker = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_timepicker'));
    el.classList.add(
      'overflow-hidden',
      'outline-none',
      'border',
      'rounded-control',
      'absolute',
      'bg-popover',
      'text-popover-foreground',
      'data-[state=open]:flex',
      'data-[state=open]:flex-col',
      'data-[state=closed]:hidden',
      'z-50',
      'shadow-md'
    );
    el.setAttribute('id', timepicker._h_timepicker.controls);
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('data-slot', 'time-picker-popup');
    el.setAttribute('aria-labelledby', timepicker._h_timepicker.id);
    el.setAttribute('data-state', timepicker._h_timepicker.expanded ? 'open' : 'closed');

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
      'aria-disabled:opacity-50',
    ];

    const updateModel = () => {
      let newValue;
      if (timepicker._h_time.parts.hour !== null && timepicker._h_time.parts.minute !== null) {
        if (timepicker._h_timepicker.seconds) {
          if (timepicker._h_time.parts.seconds !== null) {
            newValue = `${timepicker._h_time.parts.hour}:${timepicker._h_time.parts.minute}:${timepicker._h_time.parts.second}`;
          } else return;
        } else {
          newValue = `${timepicker._h_time.parts.hour}:${timepicker._h_time.parts.minute}`;
        }
      } else return;
      if (timepicker._h_timepicker.is12Hour) {
        if (timepicker._h_time.parts.period !== null) {
          newValue += ` ${timepicker._h_time.parts.period}`;
        } else return;
      }
      if (newValue) {
        timepicker._h_timepicker.model.set(newValue);
        timepicker._h_time.changed();
      }
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
          case 'ArrowUp':
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
          case 'Down':
          case 'ArrowDown':
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
          case 'Home':
          case 'PageUp':
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
          case 'End':
          case 'PageDown':
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
          case 'Right':
          case 'ArrowRight':
            let nextColumn = event.target.parentElement.nextElementSibling;
            if (nextColumn) {
              const child = nextColumn.querySelector('li[tabindex="0"]');
              child.focus();
            }
            break;
          case 'Left':
          case 'ArrowLeft':
            let prevColumn = event.target.parentElement.previousElementSibling;
            if (prevColumn) {
              const child = prevColumn.querySelector('li[tabindex="0"]');
              child.focus();
            }
            break;
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
    hoursList.classList.add('flex-1', 'overflow-y-scroll', '[scrollbar-width:thin]');
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
    minutesList.classList.add('flex-1', 'overflow-y-scroll', '[scrollbar-width:thin]');
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
    secondsList.classList.add('flex-1', 'overflow-y-scroll', '[scrollbar-width:thin]');
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
    periodList.classList.add('flex-1', 'overflow-y-scroll', '[scrollbar-width:thin]');
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
      el.setAttribute('data-state', timepicker._h_timepicker.expanded ? 'open' : 'closed');
      if (timepicker._h_timepicker.expanded) {
        render();
        autoUpdateCleanup = autoUpdate(timepicker, el, updatePosition);
        if (selectedHour) scrollIntoCenter(selectedHour.parentElement, selectedHour);
        if (selectedMinute) scrollIntoCenter(selectedMinute.parentElement, selectedMinute);
        if (selectedSecond && timepicker._h_timepicker.seconds) scrollIntoCenter(selectedSecond.parentElement, selectedSecond);
      } else {
        if (autoUpdateCleanup) autoUpdateCleanup();
        focusFirstItem = true;
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    });

    cleanup(() => {
      el.removeEventListener('keydown', onKeyDown);
      el.removeEventListener('click', onClick);
      okButton.removeEventListener('click', timepicker._h_timepicker.close);
      for (let h = 0; h < hoursList.children.length; h++) {
        hoursList.children[h].removeEventListener('click', setHour);
      }
      for (let m = 0; m < minutesList.children.length; m++) {
        minutesList.children[m].removeEventListener('click', setMinute);
      }
      for (let s = 0; s < secondsList.children.length; s++) {
        secondsList.children[s].removeEventListener('click', setSecond);
      }
      for (let p = 0; p < periodList.children.length; p++) {
        periodList.children[p].removeEventListener('click', setPeriod);
      }
    });
  });
}
