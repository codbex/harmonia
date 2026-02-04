import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { v4 as uuidv4 } from 'uuid';
import { Check, ChevronDown, Search, createSvg } from './../common/icons';
import { sizeObserver } from './../common/input-size';

const FilterType = Object.freeze({
  'starts-with': 0,
  contains: 1,
  'contains-each': 2,
  none: 3,
});

export default function (Alpine) {
  Alpine.directive('h-select', (el, _, { Alpine, cleanup }) => {
    el._h_select = Alpine.reactive({
      id: undefined,
      controls: `hsc${uuidv4()}`,
      expanded: false,
      multiple: false,
      label: [],
      refreshLabel: undefined,
      listeners: [],
      search: '',
      focusSearch: undefined,
      filterType: FilterType['starts-with'],
    });
    el._h_model = {
      set: undefined,
      get: undefined,
    };
    el.classList.add(
      'cursor-pointer',
      'border-input',
      'has-focus-visible:border-ring',
      'has-focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'has-focus-visible:ring-ring/50',
      'dark:has-[aria-invalid=true]:ring-negative/40',
      'dark:has-[input:invalid]:ring-negative/40',
      'has-[aria-invalid=true]:border-negative',
      'has-[aria-invalid=true]:ring-negative/20',
      'has-[input:invalid]:border-negative',
      'has-[input:invalid]:ring-negative/20',
      'hover:bg-secondary-hover',
      'active:bg-secondary-active',
      'w-full',
      'rounded-control',
      'border',
      'bg-input-inner',
      'text-sm',
      'whitespace-nowrap',
      'shadow-input',
      'transition-[color,box-shadow]',
      'duration-200',
      'outline-none',
      'has-[input:disabled]:pointer-events-none',
      'has-[input:disabled]:opacity-50'
    );
    el.setAttribute('data-slot', 'select');

    const observer = sizeObserver(el);

    cleanup(() => {
      observer.disconnect();
    });
  });

  Alpine.directive('h-select-input', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'INPUT') {
      throw new Error(`${original} must be a readonly input of type "text"`);
    }

    const select = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_select'));

    if (!select) {
      throw new Error(`${original} must be inside a select element`);
    } else if (el.hasOwnProperty('_x_model')) {
      select._h_select.multiple = Array.isArray(el._x_model.get());
      select._h_model.set = (value) => {
        if (select._h_select.multiple) {
          const vIndex = el._x_model.get().indexOf(value);
          if (vIndex > -1) {
            const newArr = el._x_model.get();
            newArr.splice(vIndex, 1);
            el._x_model.set(newArr);
          } else {
            const arr = el._x_model.get();
            arr.push(value);
            el._x_model.set(arr);
          }
        } else if (el._x_model.get() !== value) {
          el._x_model.set(value);
        } else {
          el._x_model.set('');
        }
      };
      select._h_model.get = el._x_model.get;
    } else {
      select._h_model.set = (value) => {
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      select._h_model.get = () => el.value;
    }

    el.classList.add('hidden');
    el.setAttribute('type', 'text');

    const fakeTrigger = document.createElement('span');
    const displayValue = document.createElement('span');
    displayValue.classList.add('text-left', 'truncate', 'w-full');
    fakeTrigger.appendChild(displayValue);
    fakeTrigger.setAttribute('data-slot', 'select-value');
    fakeTrigger.setAttribute('tabindex', '0');
    fakeTrigger.classList.add('flex', 'items-center', 'justify-between', 'gap-2', 'outline-none', 'pl-3', 'pr-2', 'size-full', '[&[data-state=open]>svg]:rotate-180');

    function getPlaceholder() {
      if (!el.value) {
        const value = el.getAttribute('placeholder');
        if (value) {
          displayValue.innerText = value;
          displayValue.classList.add('text-muted-foreground');
        } else {
          displayValue.classList.remove('text-muted-foreground');
        }
      }
    }

    getPlaceholder();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-id') {
          select._h_select.id = el.getAttribute('data-id');
          fakeTrigger.setAttribute('id', select._h_select.id);
        } else if (mutation.attributeName === 'placeholder' && !select._h_select.label.length) {
          getPlaceholder();
        }
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-id', 'placeholder'] });

    effect(() => {
      if (select._h_select.label.length === 1) {
        displayValue.innerText = select._h_select.label[0];
        displayValue.classList.remove('text-muted-foreground');
      } else if (select._h_select.label.length > 1) {
        displayValue.innerText = select._h_select.label.join(', ');
        displayValue.classList.remove('text-muted-foreground');
      } else {
        getPlaceholder();
      }
    });

    fakeTrigger.setAttribute('data-slot', 'select-input');

    select._h_select.id = el.hasAttribute('data-id') ? el.getAttribute('data-id') : `hs${uuidv4()}`;
    fakeTrigger.setAttribute('id', select._h_select.id);
    fakeTrigger.setAttribute('aria-controls', select._h_select.controls);
    fakeTrigger.setAttribute('aria-haspopup', 'listbox');
    fakeTrigger.setAttribute('aria-autocomplete', 'none');
    fakeTrigger.setAttribute('role', 'combobox');

    effect(() => {
      fakeTrigger.setAttribute('data-state', select._h_select.expanded ? 'open' : 'closed');
      fakeTrigger.setAttribute('aria-expanded', select._h_select.expanded);
    });

    const close = (focusSelect = false) => {
      select._h_select.expanded = false;
      top.removeEventListener('click', close);
      el.parentElement.removeEventListener('keydown', onKeyDown);
      options = null;
      if (focusSelect) fakeTrigger.focus();
    };

    let content;
    let options;

    const onKeyDown = (event) => {
      switch (event.key) {
        case 'Down':
        case 'ArrowDown':
          event.preventDefault();
          let nextIndex = 0;
          for (let o = 0; o < options.length; o++) {
            if (options[o].getAttribute('tabindex') === '0') {
              options[o].setAttribute('tabindex', '-1');
              if (o < options.length - 1) nextIndex = o + 1;
              break;
            }
          }
          if (options[nextIndex].getAttribute('data-disabled') === 'true') {
            if (nextIndex === options.length - 1) nextIndex = 0;
            for (let o = nextIndex; o < options.length; o++) {
              if (options[o].getAttribute('data-disabled') !== 'true') {
                nextIndex = o;
                break;
              }
            }
          }
          options[nextIndex].setAttribute('tabindex', '0');
          options[nextIndex].focus();
          break;
        case 'Up':
        case 'ArrowUp':
          event.preventDefault();
          let prevIndex = options.length - 1;
          for (let o = options.length - 1; o >= 0; o--) {
            if (options[o].getAttribute('tabindex') === '0') {
              options[o].setAttribute('tabindex', '-1');
              if (o !== 0) prevIndex = o - 1;
              break;
            }
          }
          if (options[prevIndex].getAttribute('data-disabled') === 'true') {
            if (prevIndex === 0) prevIndex = options.length - 1;
            for (let o = prevIndex; o >= 0; o--) {
              if (options[o].getAttribute('data-disabled') !== 'true') {
                prevIndex = o;
                break;
              }
            }
          }
          options[prevIndex].setAttribute('tabindex', '0');
          options[prevIndex].focus();
          break;
        case 'Home':
        case 'PageUp':
          event.preventDefault();
          for (let o = 0; o < options.length; o++) {
            if (options[o].getAttribute('tabindex') === '0') {
              options[o].setAttribute('tabindex', '-1');
              break;
            }
          }
          options[0].setAttribute('tabindex', '0');
          options[0].focus();
          break;
        case 'End':
        case 'PageDown':
          event.preventDefault();
          for (let o = 0; o < options.length; o++) {
            if (options[o].getAttribute('tabindex') === '0') {
              options[o].setAttribute('tabindex', '-1');
              break;
            }
          }
          options[options.length - 1].setAttribute('tabindex', '0');
          options[options.length - 1].focus();
          break;
        case ' ':
        case 'Enter':
          event.preventDefault();
          if (!select._h_select.multiple) {
            close(true);
          }
          break;
        case 'Escape':
          event.preventDefault();
          close(true);
          break;
        case 'Tab':
          close();
          break;
        case 'Control':
        case 'Shift':
        case 'Alt':
          break;
        default:
          if (select._h_select.focusSearch) {
            for (let o = 0; o < options.length; o++) {
              if (options[o].getAttribute('tabindex') === '0') {
                options[o].setAttribute('tabindex', '-1');
                break;
              }
            }
            select._h_select.focusSearch();
          }
      }
    };

    const onClick = () => {
      select._h_select.expanded = !select._h_select.expanded;
      if (select._h_select.expanded) {
        if (!content) content = select.querySelector(`#${select._h_select.controls}`);
        options = content.querySelectorAll('[role=option]');
      }
      Alpine.nextTick(() => {
        if (select._h_select.expanded) {
          top.addEventListener('click', close, { once: true });
          el.parentElement.addEventListener('keydown', onKeyDown);
        } else {
          top.removeEventListener('click', close);
          el.parentElement.removeEventListener('keydown', onKeyDown);
          options = null;
        }
      });
    };

    const onPress = (event) => {
      if (event.key === 'Escape' && select._h_select.expanded) close(true);
      else if (event.key === 'Enter') {
        event.preventDefault();
        onClick();
      } else if (event.key === ' ') {
        event.preventDefault();
        setTimeout(() => onClick(), 0);
      }
    };

    fakeTrigger.addEventListener('keydown', onPress);
    fakeTrigger.addEventListener('click', onClick);

    const chevronDown = createSvg({
      icon: ChevronDown,
      classes: 'opacity-70 text-foreground size-4 shrink-0 pointer-events-none transition-transform duration-200',
      attrs: {
        'aria-hidden': true,
        role: 'presentation',
      },
    });

    el.parentElement.appendChild(fakeTrigger);
    fakeTrigger.appendChild(chevronDown);

    const onInputChange = () => {
      select._h_select.label.length = 0;
      for (let i = 0; i < select._h_select.listeners.length; i++) {
        const label = select._h_select.listeners[i](select._h_model.get());
        if (label) {
          select._h_select.label.push(label);
        }
      }
    };

    select._h_select.refreshLabel = onInputChange;

    el.addEventListener('change', onInputChange);

    cleanup(() => {
      fakeTrigger.removeEventListener('click', onClick);
      fakeTrigger.removeEventListener('keydown', onPress);
      el.parentElement.removeEventListener('keydown', onKeyDown);
      top.removeEventListener('click', close);
      el.removeEventListener('change', onInputChange);
      observer.disconnect();
    });
  });

  Alpine.directive('h-select-content', (el, { original }, { effect, Alpine }) => {
    const select = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_select'));
    if (!select) {
      throw new Error(`${original} must be inside a select element`);
    }
    el.classList.add('absolute', 'bg-popover', 'text-popover-foreground', 'data-[state=closed]:hidden', 'p-1', 'top-0', 'left-0', 'z-50', 'min-w-[1rem]', 'overflow-x-hidden', 'overflow-y-auto', 'rounded-md', 'border', 'shadow-md');
    el.setAttribute('data-slot', 'select-content');
    el.setAttribute('role', 'listbox');
    el.setAttribute('role', 'presentation');
    el.setAttribute('id', select._h_select.controls);
    el.setAttribute('tabindex', '-1');
    el.setAttribute('data-state', select._h_select.expanded ? 'open' : 'closed');

    const control = select.querySelector(`#${select._h_select.id}`);
    if (!control) {
      throw new Error(`${original}: trigger not found`);
    }

    let autoUpdateCleanup;

    function updatePosition() {
      computePosition(control, el, {
        placement: el.getAttribute('data-align') || 'bottom-start',
        middleware: [
          offset(4),
          flip(),
          shift({ padding: 4 }),
          size({
            apply({ availableWidth, availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                maxWidth: `${Math.max(0, availableWidth) - 4}px`,
                maxHeight: `${Math.max(0, availableHeight) - 4}px`,
              });
            },
          }),
        ],
      }).then(({ x, y }) => {
        Object.assign(el.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    }

    effect(() => {
      el.setAttribute('aria-labelledby', select._h_select.id);
    });

    effect(() => {
      el.setAttribute('data-state', select._h_select.expanded ? 'open' : 'closed');
      if (select._h_select.expanded) {
        autoUpdateCleanup = autoUpdate(control, el, updatePosition);
      } else {
        if (autoUpdateCleanup) autoUpdateCleanup();
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    });
  });

  Alpine.directive('h-select-search', (el, { original }, { effect, cleanup, Alpine }) => {
    const select = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_select'));
    if (!select) {
      throw new Error(`${original} must be inside an h-select element`);
    } else {
      select._h_select.filterType = FilterType[el.getAttribute('data-filter')] ?? FilterType['starts-with'];
    }
    el.classList.add('flex', 'h-8', 'items-center', 'gap-2', 'border-b', 'px-2');
    el.setAttribute('data-slot', 'select-search');
    el.setAttribute('aria-autocomplete', select._h_select.filterType === FilterType.none ? 'both' : 'list');
    el.setAttribute('aria-controls', select._h_select.controls);
    el.setAttribute('aria-haspopup', 'listbox');
    el.setAttribute('role', 'combobox');
    el.setAttribute('autocomplete', 'off');
    el.setAttribute('autocorrect', 'off');
    el.setAttribute('spellcheck', 'false');
    const searchIcon = createSvg({ icon: Search, classes: 'size-4 shrink-0 opacity-50', attrs: { 'aria-hidden': true, role: 'presentation' } });
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('data-slot', 'select-input');
    searchInput.classList.add('placeholder:text-muted-foreground', 'flex', 'h-10', 'w-full', 'rounded-md', 'bg-transparent', 'py-3', 'text-sm', 'outline-hidden', 'disabled:cursor-not-allowed', 'disabled:opacity-50');
    el.appendChild(searchIcon);
    el.appendChild(searchInput);

    select._h_select.focusSearch = () => {
      searchInput.focus();
    };

    function onActivate(event) {
      if (event.type === 'keydown' && (event.key === 'Escape' || event.key === 'ArrowDown' || event.key === 'Down')) return;
      event.stopPropagation();
    }

    el.addEventListener('click', onActivate);
    el.addEventListener('keydown', onActivate);

    if (select._h_select.filterType !== FilterType.none) {
      function onInput() {
        select._h_select.search = searchInput.value.toLowerCase();
      }

      searchInput.addEventListener('keyup', onInput);
    }

    effect(() => {
      if (select._h_select.expanded) searchInput.focus({ preventScroll: true });
      el.setAttribute('aria-expanded', select._h_select.expanded);
    });

    const observer = new MutationObserver(() => {
      select._h_select.filterType = FilterType[el.getAttribute('data-filter')] ?? FilterType['starts-with'];
      el.setAttribute('aria-autocomplete', select._h_select.filterType === FilterType.none ? 'both' : 'list');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-filter'] });

    cleanup(() => {
      el.removeEventListener('click', onActivate);
      el.removeEventListener('keydown', onActivate);
      if (select._h_select.filterType !== FilterType.none) searchInput.removeEventListener('keyup', onInput);
      observer.disconnect();
    });
  });

  Alpine.directive('h-select-group', (el, _, { effect }) => {
    el.setAttribute('data-slot', 'select-group');
    el._h_selectGroup = Alpine.reactive({
      labelledby: undefined,
    });

    effect(() => {
      if (el._h_selectGroup.labelledby) {
        el.setAttribute('aria-labelledby', el._h_selectGroup.labelledby);
      }
    });
  });

  Alpine.directive('h-select-label', (el) => {
    el.classList.add('text-muted-foreground', 'px-2', 'py-1.5', 'text-xs');
    el.setAttribute('data-slot', 'select-label');

    const selectGroup = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_selectGroup'));
    if (selectGroup) {
      const id = `hsl${uuidv4()}`;
      el.setAttribute('id', id);
      selectGroup._h_selectGroup.labelledby = id;
    }
  });

  Alpine.directive('h-select-option', (el, { original, expression }, { effect, evaluateLater, cleanup }) => {
    const select = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_select'));
    if (!select) {
      throw new Error(`${original} must be inside an h-select element`);
    }

    el.classList.add(
      'focus:bg-primary',
      'focus:text-primary-foreground',
      'hover:bg-secondary-hover',
      'hover:text-secondary-foreground',
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      "focus:[&_svg:not([class*='text-'])]:text-primary-foreground",
      "hover:[&_svg:not([class*='text-'])]:text-secondary-foreground",
      'relative',
      'flex',
      'w-full',
      'cursor-default',
      'items-center',
      'gap-2',
      'rounded-sm',
      'py-1.5',
      'pr-8',
      'pl-2',
      'text-sm',
      'outline-hidden',
      'select-none',
      'data-[disabled]:pointer-events-none',
      'data-[disabled]:opacity-50',
      '[&_svg]:pointer-events-none',
      '[&_svg]:shrink-0',
      "[&_svg:not([class*='size-'])]:size-4",
      '*:[span]:last:flex',
      '*:[span]:last:items-center',
      '*:[span]:last:gap-2'
    );
    el.setAttribute('data-slot', 'select-option');
    el.setAttribute('tabindex', '-1');

    const id = `hso${uuidv4()}`;
    el.setAttribute('role', 'option');
    el.setAttribute('aria-labelledby', id);

    const indicatorEl = document.createElement('span');
    const labelEl = document.createElement('span');
    labelEl.setAttribute('id', id);
    indicatorEl.classList.add('absolute', 'right-2', 'flex', 'size-3.5', 'items-center', 'justify-center', 'invisible');
    indicatorEl.setAttribute('aria-hidden', 'true');
    const check = createSvg({ icon: Check, attrs: { 'aria-hidden': true, role: 'presentation' } });
    indicatorEl.appendChild(check);

    el.appendChild(indicatorEl);
    el.appendChild(labelEl);

    function getValue() {
      return el.getAttribute('data-value');
    }

    const getLabel = evaluateLater(expression);

    effect(() => {
      getLabel((label) => {
        labelEl.innerText = label;
        select._h_select.refreshLabel();
      });
    });

    effect(() => {
      if (select._h_select.search) {
        if (select._h_select.filterType === FilterType['starts-with']) {
          if (!labelEl.innerText.toLowerCase().startsWith(select._h_select.search)) {
            el.classList.add('hidden');
          } else el.classList.remove('hidden');
        } else if (select._h_select.filterType === FilterType.contains) {
          if (!labelEl.innerText.toLowerCase().includes(select._h_select.search)) {
            el.classList.add('hidden');
          } else el.classList.remove('hidden');
        } else if (select._h_select.filterType === FilterType['contains-each']) {
          const terms = select._h_select.search.split(' ');
          const label = labelEl.innerText.toLowerCase();
          if (!terms.every((term) => label.includes(term))) el.classList.add('hidden');
          else el.classList.remove('hidden');
        } else {
          el.classList.remove('hidden');
        }
      } else el.classList.remove('hidden');
    });

    function setSelectedState(selected) {
      if (selected) {
        indicatorEl.classList.remove('invisible');
        el.setAttribute('aria-selected', 'true');
        return labelEl.innerText;
      }
      indicatorEl.classList.add('invisible');
      el.setAttribute('aria-selected', 'false');
      return '';
    }

    const onModelChange = (value) => {
      return setSelectedState(select._h_select.multiple ? value.includes(getValue()) : value === getValue());
    };

    select._h_select.listeners.push(onModelChange);

    const onActivate = (event) => {
      if ((event.type === 'keydown' && (event.key === 'Enter' || event.key === ' ')) || event.type === 'click') {
        if (select._h_select.multiple) {
          const vIndex = select._h_model.get().indexOf(getValue());
          if (vIndex > -1) {
            const val = select._h_model.get().splice(vIndex, 1);
            select._h_model.set(val);
          } else {
            select._h_model.get().push(getValue());
          }
        } else if (select._h_model.get() !== getValue()) {
          select._h_model.set(getValue());
        } else {
          select._h_model.set('');
        }
      }
    };

    el.addEventListener('click', onActivate);
    el.addEventListener('keydown', onActivate);

    cleanup(() => {
      el.removeEventListener('click', onActivate);
      el.removeEventListener('keydown', onActivate);
      const lIndex = select._h_select.listeners.indexOf(onModelChange);
      select._h_select.listeners.splice(lIndex, 1);
    });
  });

  Alpine.directive('h-select-separator', (el) => {
    el.classList.add('bg-border', 'pointer-events-none', '-mx-1', 'my-1', 'h-px');
    el.setAttribute('data-slot', 'select-separator');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('role', 'none');
  });
}
