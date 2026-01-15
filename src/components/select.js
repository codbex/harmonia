import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { Check, ChevronDown, createElement, Search } from 'lucide';
import { v4 as uuidv4 } from 'uuid';
import { buttonVariants, getButtonSize, setButtonClasses } from './button';

const FilterType = Object.freeze({
  'starts-with': 0,
  contains: 1,
  'contains-each': 2,
  none: 3,
});

export default function (Alpine) {
  Alpine.directive('h-select', (el, _, { Alpine }) => {
    el._h_select = Alpine.reactive({
      id: undefined,
      controls: `hsc${uuidv4()}`,
      expanded: false,
      model: undefined,
      multiple: false,
      label: [],
      search: '',
      focusSearch: undefined,
      filterType: FilterType['starts-with'],
    });
    el.setAttribute('data-slot', 'select');
  });

  Alpine.directive('h-select-trigger', (el, { original }, { effect, cleanup, Alpine }) => {
    const select = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_select'));

    if (!select) {
      throw new Error(`${original} must be inside a select element`);
    } else if (el.hasOwnProperty('_x_model')) {
      select._h_select.multiple = Array.isArray(el._x_model.get());
      select._h_select.model = el._x_model.get();
    }
    setButtonClasses(el);
    const setVariant = (variant) => {
      if (variant === 'secondary') {
        el.classList.add(...buttonVariants['default']);
        return;
      } else if (variant === 'transparent') {
        el.classList.add(...buttonVariants['transparent']);
      } else el.classList.add('shadow-input', ...buttonVariants['outline']);
    };
    const setSize = (size) => {
      const sizes = ['sm', 'xs', 'lg'];
      if (sizes.includes(size)) {
        el.classList.add(...getButtonSize(size));
      } else el.classList.add(...getButtonSize());
    };
    setVariant(el.getAttribute('data-variant'));
    setSize(el.getAttribute('data-size'));
    el.classList.add('w-full', '[&_svg]:opacity-50', '[&[data-state=open]>svg]:rotate-180');
    el.setAttribute('type', 'button');

    const selectValue = document.createElement('span');
    selectValue.setAttribute('data-slot', 'select-value');
    selectValue.classList.add('text-left', 'truncate', 'pointer-events-none', 'w-full');

    function getPlaceholder() {
      if (!el.value) {
        const value = el.getAttribute('placeholder');
        if (value) {
          selectValue.innerText = value;
          selectValue.classList.add('text-muted-foreground');
        } else {
          selectValue.classList.remove('text-muted-foreground');
        }
      }
    }

    getPlaceholder();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'value') {
          el.dispatchEvent(new Event('change', { bubbles: true }));
          if (el.value) selectValue.classList.remove('text-muted-foreground');
        } else if (mutation.attributeName === 'placeholder' && !select._h_select.label.length) {
          getPlaceholder();
        }
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['value', 'placeholder'] });

    effect(() => {
      if (select._h_select.label.length === 1) {
        selectValue.innerText = select._h_select.label[0];
      } else if (select._h_select.label.length > 1) {
        selectValue.innerText = select._h_select.label.join(', ');
      } else {
        getPlaceholder();
      }
    });

    el.setAttribute('data-slot', 'select-trigger');

    if (el.hasAttribute('id')) {
      select._h_select.id = el.getAttribute('id');
    } else {
      select._h_select.id = `hs${uuidv4()}`;
      el.setAttribute('id', select._h_select.id);
    }
    el.setAttribute('aria-controls', select._h_select.controls);
    el.setAttribute('aria-haspopup', 'listbox');
    el.setAttribute('aria-autocomplete', 'none');
    el.setAttribute('role', 'combobox');

    effect(() => {
      el.setAttribute('data-state', select._h_select.expanded ? 'open' : 'closed');
      el.setAttribute('aria-expanded', select._h_select.expanded);
    });

    const close = () => {
      select._h_select.expanded = false;
    };

    let content;
    let options;

    const shiftFocus = (event) => {
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
        case 'Enter':
        case 'Escape':
          handler();
          el.focus();
          break;
        case 'Tab':
          handler();
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

    const handler = () => {
      select._h_select.expanded = !select._h_select.expanded;
      if (select._h_select.expanded) {
        if (!content) content = select.querySelector(`#${select._h_select.controls}`);
        options = content.querySelectorAll('[role=option]');
      }
      Alpine.nextTick(() => {
        if (select._h_select.expanded) {
          top.addEventListener('click', close, { once: true });
          el.parentElement.addEventListener('keydown', shiftFocus);
        } else {
          top.removeEventListener('click', close);
          el.parentElement.removeEventListener('keydown', shiftFocus);
          options = null;
        }
      });
    };

    el.addEventListener('click', handler);

    const chevronDown = createElement(ChevronDown, {
      class: ['opacity-50 size-4 transition-transform duration-200'],
      width: '16',
      height: '16',
      'aria-hidden': true,
      role: 'presentation',
    });

    el.appendChild(selectValue);
    el.appendChild(chevronDown);

    cleanup(() => {
      el.removeEventListener('click', handler);
      el.parentElement.removeEventListener('keydown', shiftFocus);
      top.removeEventListener('click', close);
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
    el.setAttribute('aria-labelledby', select._h_select.id);
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

  Alpine.directive('h-select-search', (el, { original, modifiers }, { effect, cleanup }) => {
    const select = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_select'));
    if (!select) {
      throw new Error(`${original} must be inside an h-select element`);
    } else {
      select._h_select.filterType = FilterType[modifiers[0]] ?? FilterType['starts-with'];
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
    const searchIcon = createElement(Search, { class: ['size-4 shrink-0 opacity-50'], width: '16', height: '16', 'aria-hidden': true, role: 'presentation' });
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('data-slot', 'select-input');
    searchInput.classList.add('placeholder:text-muted-foreground', 'flex', 'h-10', 'w-full', 'rounded-md', 'bg-transparent', 'py-3', 'text-sm', 'outline-hidden', 'disabled:cursor-not-allowed', 'disabled:opacity-50');
    el.appendChild(searchIcon);
    el.appendChild(searchInput);

    select._h_select.focusSearch = () => {
      searchInput.focus();
    };

    function handler(event) {
      if (event.type === 'keydown' && (event.key === 'Escape' || event.key === 'ArrowDown' || event.key === 'Down')) return;
      event.stopPropagation();
    }

    el.addEventListener('click', handler);
    el.addEventListener('keydown', handler);

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

    cleanup(() => {
      el.removeEventListener('click', handler);
      el.removeEventListener('keydown', handler);
      if (select._h_select.filterType !== FilterType.none) searchInput.removeEventListener('keyup', onInput);
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
    const check = createElement(Check, { class: ['size-4'], width: '16', height: '16', 'aria-hidden': true, role: 'presentation' });
    indicatorEl.appendChild(check);

    el.appendChild(indicatorEl);
    el.appendChild(labelEl);

    function getValue() {
      if (el.hasOwnProperty('_x_bindings') && el._x_bindings.hasOwnProperty('value')) return el._x_bindings.value;
      else return el.getAttribute('value');
    }

    const getLabel = evaluateLater(expression);
    effect(() => {
      getLabel((label) => {
        if (select._h_select.multiple && select._h_select.model.includes(getValue())) {
          select._h_select.label[select._h_select.label.indexOf(labelEl.innerText)] = label;
        } else if (select._h_select.model === getValue()) {
          select._h_select.label[0] = label;
        }
        labelEl.innerText = label;
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
        if (!select._h_select.label.length) {
          select._h_select.label.push(labelEl.innerText);
        } else if (!select._h_select.label.includes(labelEl.innerText)) {
          if (select._h_select.multiple) select._h_select.label.push(labelEl.innerText);
          else select._h_select.label[0] = labelEl.innerText;
        }
      } else {
        indicatorEl.classList.add('invisible');
        el.setAttribute('aria-selected', 'false');
      }
    }

    function removeLabel() {
      const lIndex = select._h_select.label.indexOf(labelEl.innerText);
      if (lIndex > -1) select._h_select.label.splice(lIndex, 1);
    }

    effect(() => {
      if (select._h_select.multiple) {
        setSelectedState(select._h_select.model.includes(getValue()));
      } else {
        setSelectedState(select._h_select.model === getValue());
      }
    });

    const handler = (event) => {
      if ((event.type === 'keydown' && event.key === 'Enter') || event.type === 'click') {
        if (select._h_select.multiple) {
          const vIndex = select._h_select.model.indexOf(getValue());
          if (vIndex > -1) {
            select._h_select.model.splice(vIndex, 1);
            removeLabel();
          } else {
            select._h_select.model.push(getValue());
          }
        } else if (select._h_select.model !== getValue()) {
          select._h_select.model = getValue();
        } else {
          select._h_select.model = '';
          removeLabel();
        }
      }
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', handler);

    cleanup(() => {
      el.removeEventListener('click', handler);
      el.removeEventListener('keydown', handler);
    });
  });

  Alpine.directive('h-select-separator', (el) => {
    el.classList.add('bg-border', 'pointer-events-none', '-mx-1', 'my-1', 'h-px');
    el.setAttribute('data-slot', 'select-separator');
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('role', 'none');
  });
}
