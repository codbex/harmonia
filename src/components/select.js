import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom';
import { findAncestorState } from '../common/ancestor';
import { isDisabled } from '../common/disabled';
import { invalidInputClasses, userInvalidInputClasses } from '../common/shared-classes';
import { transitionClose } from '../common/transition-close';
import { addDismiss, removeDismiss } from '../utils/dismiss';
import uuidv4 from '../utils/uuid';
import { Check, ChevronDown, Search, createSvg } from './../common/icons';
import { sizeObserver } from './../common/input-size';
import { getFirstChar, isPrintableCharacter } from './../common/typeahead';
const FilterType = Object.freeze({
  'starts-with': 0,
  contains: 1,
  'contains-each': 2,
  none: 3,
});

export default function (Alpine) {
  Alpine.directive('h-select', (el, { modifiers }, { Alpine, cleanup }) => {
    el._h_select = Alpine.reactive({
      fieldLabelId: undefined,
      ariaLabelledby: undefined,
      ariaLabel: undefined,
      trigger: undefined,
      controls: `hsc${uuidv4()}`,
      expanded: false,
      multiple: false,
      label: [],
      refreshLabel: undefined,
      listeners: [],
      search: '',
      focusSearch: undefined,
      filterType: FilterType['starts-with'],
      includeDesc: false,
    });
    el._h_model = {
      set: undefined,
      get: undefined,
    };
    el.classList.add('cursor-pointer', 'outline-none', 'transition-[color,box-shadow]', 'motion-reduce:transition-none', 'duration-200', 'w-full', 'has-[input:disabled]:pointer-events-none', 'has-[input:disabled]:opacity-disabled');
    if (modifiers.includes('table')) {
      el.classList.add(
        'h-10',
        'flex',
        'focus-visible:inset-ring-ring/50',
        'focus-visible:inset-ring-[calc(var(--spacing)*0.75)]',
        '[&>[data-slot="select-input"]]:hover:bg-table-hover',
        '[&>[data-slot="select-input"]]:hover:text-table-hover-foreground',
        '[&>[data-slot="select-input"]]:active:bg-table-active!',
        '[&>[data-slot="select-input"]]:active:text-table-active-foreground!'
      );
      el.setAttribute('data-slot', 'cell-input-select');
    } else {
      el.classList.add(
        'border-input',
        'has-focus-visible:border-ring',
        'has-focus-visible:ring-[calc(var(--spacing)*0.75)]',
        'has-focus-visible:ring-ring/50',
        ...invalidInputClasses,
        ...userInvalidInputClasses,
        '[&>[data-slot="select-input"]]:hover:bg-secondary-hover',
        '[&>[data-slot="select-input"]]:hover:text-secondary-foreground',
        '[&>[data-slot="select-input"]]:active:bg-secondary-active',
        '[&>[data-slot="select-input"]]:active:text-secondary-foreground',
        '[&>[data-slot="select-input"]]:rounded-control',
        'rounded-control',
        'border',
        'bg-input-inner',
        'text-sm',
        'whitespace-nowrap',
        'shadow-input'
      );
      el.setAttribute('data-slot', 'select');

      const observer = sizeObserver(el);

      cleanup(() => {
        observer.disconnect();
      });
    }
  });

  Alpine.directive('h-select-input', (el, { original }, { effect, cleanup, Alpine }) => {
    if (el.tagName !== 'INPUT') {
      throw new Error(`${original} must be an input of type "text"`);
    }

    const select = findAncestorState(Alpine, el, '_h_select');
    const label = (() => {
      const field = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'field');
      if (field) {
        return field.querySelector('[data-slot=field-label]');
      }
      return;
    })();

    if (!select) {
      throw new Error(`${original} must be inside a select element`);
    } else if (Object.prototype.hasOwnProperty.call(el, '_x_model')) {
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
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      select._h_model.get = el._x_model.get;
    } else {
      select._h_model.set = (value) => {
        el.value = value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      select._h_model.get = () => el.value;
    }

    // The input stays validatable but invisible. "display:none" would stop the
    // browser from focusing it on a failed submit. It is out of the tab order
    // and the accessibility tree because the trigger stands in for it.
    el.classList.add('sr-only', 'pointer-events-none');
    el.setAttribute('type', 'text');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('aria-hidden', 'true');

    const fakeTrigger = document.createElement('button');
    const displayValue = document.createElement('span');
    displayValue.classList.add('text-left', 'truncate', 'w-full');
    fakeTrigger.appendChild(displayValue);
    fakeTrigger.setAttribute('data-slot', 'select-value');
    fakeTrigger.setAttribute('type', 'button');
    fakeTrigger.classList.add('flex', 'items-center', 'justify-between', 'gap-2', 'outline-none', 'pl-3', 'pr-2', 'size-full', '[&[aria-expanded=true]>svg]:rotate-180');
    select._h_select.trigger = fakeTrigger;

    // The trigger stands in for the input in the accessibility tree, so what the
    // user writes on the hidden input has to be applied to the trigger instead.
    // A field label is only the fallback, since an explicit aria-labelledby says
    // more about what the user meant.
    function applyLabel() {
      const labelledby = el.getAttribute('aria-labelledby') || select._h_select.fieldLabelId;
      const ariaLabel = el.getAttribute('aria-label');
      select._h_select.ariaLabelledby = labelledby;
      select._h_select.ariaLabel = ariaLabel;
      if (labelledby) fakeTrigger.setAttribute('aria-labelledby', labelledby);
      else fakeTrigger.removeAttribute('aria-labelledby');
      if (ariaLabel) fakeTrigger.setAttribute('aria-label', ariaLabel);
      else fakeTrigger.removeAttribute('aria-label');
    }

    // The input keeps its own id for the user to use, so the trigger gets a
    // separate one. It is what a "<label for>" or a programmatic click can target.
    function applyId() {
      const id = el.getAttribute('data-id');
      if (id) fakeTrigger.setAttribute('id', id);
      else fakeTrigger.removeAttribute('id');
    }

    // aria-invalid mirroring. The input is not announced, so the trigger carries
    // it. An explicit aria-invalid on the input is owned by the consumer and wins
    // over tracked native validity.
    let nativeInvalid = false;
    function renderInvalid() {
      const explicit = el.getAttribute('aria-invalid');
      const invalid = explicit != null ? explicit : nativeInvalid ? 'true' : null;
      if (invalid == null) fakeTrigger.removeAttribute('aria-invalid');
      else fakeTrigger.setAttribute('aria-invalid', invalid);
    }

    // :user-invalid is not observable from JS, so only clear on valid or set
    // when an ancestor opted into immediate validation. The invalid event below
    // covers the submit-attempt case.
    function syncValidity() {
      if (el.validity.valid) nativeInvalid = false;
      else if (el.closest('[data-validate=immediate]')) nativeInvalid = true;
      renderInvalid();
    }

    const onInvalid = () => {
      nativeInvalid = true;
      renderInvalid();
    };

    el.addEventListener('invalid', onInvalid);

    // A natively disabled button is unreachable and announced as disabled, which
    // is what disabling the input asks for. It also refuses clicks, so nothing
    // else has to guard against activating a disabled select.
    function applyState() {
      fakeTrigger.disabled = el.disabled;
      if (el.required) fakeTrigger.setAttribute('aria-required', 'true');
      else fakeTrigger.removeAttribute('aria-required');
      renderInvalid();
    }

    let labelObserver;

    if (label) {
      if (!label.hasAttribute('id')) {
        label.setAttribute('id', `hsil${uuidv4()}`);
      }
      select._h_select.fieldLabelId = label.getAttribute('id');

      labelObserver = new MutationObserver(() => {
        select._h_select.fieldLabelId = label.getAttribute('id');
        applyLabel();
      });

      labelObserver.observe(label, { attributes: true, attributeFilter: ['id'] });
    }

    applyLabel();
    applyId();
    applyState();

    function getPlaceholder() {
      if (!el.value) {
        const value = el.getAttribute('placeholder');
        if (value) {
          displayValue.innerText = value;
          displayValue.classList.add('text-muted-foreground');
        } else {
          displayValue.innerText = '';
          displayValue.classList.remove('text-muted-foreground');
        }
      }
    }

    getPlaceholder();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'placeholder') getPlaceholder();
        else if (mutation.attributeName === 'data-id') applyId();
        else if (mutation.attributeName === 'aria-label' || mutation.attributeName === 'aria-labelledby') applyLabel();
        else applyState();
      });
    });

    observer.observe(el, { attributes: true, attributeFilter: ['placeholder', 'aria-label', 'aria-labelledby', 'data-id', 'disabled', 'aria-invalid', 'required'] });

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
    fakeTrigger.setAttribute('aria-controls', select._h_select.controls);
    fakeTrigger.setAttribute('aria-haspopup', 'listbox');
    fakeTrigger.setAttribute('role', 'combobox');

    effect(() => {
      fakeTrigger.setAttribute('aria-expanded', select._h_select.expanded);
    });

    const close = (focusSelect = false) => {
      select._h_select.expanded = false;
      removeDismiss(el, 'click', close);
      el.parentElement.removeEventListener('keydown', onKeyDown);
      if (focusSelect) fakeTrigger.focus();
    };

    let list;

    // An option the search has filtered out is not on screen, so the keyboard
    // passes over it. A disabled one is on screen and stays reachable, since
    // aria-disabled announces it as unavailable rather than hiding it, and
    // onActivate is what refuses to act on it. Read per keypress, so options
    // added or filtered while the list is open are picked up.
    function getFocusableOptions() {
      if (!list) return [];
      return Array.from(list.querySelectorAll('[role=option]')).filter((option) => !option.classList.contains('hidden'));
    }

    // Options find "the current one" through the roving tabindex, so the stop
    // has to be moved explicitly rather than just followed by focus.
    function clearTabStop() {
      const current = list?.querySelector('[role=option][tabindex="0"]');
      if (current) current.setAttribute('tabindex', '-1');
    }

    function moveFocus(target) {
      if (!target) return;
      clearTabStop();
      target.setAttribute('tabindex', '0');
      target.focus();
    }

    function findMatching(str, candidates) {
      for (const option of candidates) {
        if (getFirstChar(option.textContent).startsWith(str.toLowerCase())) {
          moveFocus(option);
          return true;
        }
      }
      return false;
    }

    const onKeyDown = (event) => {
      switch (event.key) {
        case 'Down':
        case 'ArrowDown': {
          event.preventDefault();
          const options = getFocusableOptions();
          if (!options.length) break;
          const current = options.findIndex((option) => option.getAttribute('tabindex') === '0');
          moveFocus(current === -1 ? options[0] : options[(current + 1) % options.length]);
          break;
        }
        case 'Up':
        case 'ArrowUp': {
          event.preventDefault();
          const options = getFocusableOptions();
          if (!options.length) break;
          const current = options.findIndex((option) => option.getAttribute('tabindex') === '0');
          moveFocus(current === -1 ? options[options.length - 1] : options[(current - 1 + options.length) % options.length]);
          break;
        }
        case 'Home':
        case 'PageUp':
          event.preventDefault();
          moveFocus(getFocusableOptions()[0]);
          break;
        case 'End':
        case 'PageDown': {
          event.preventDefault();
          const options = getFocusableOptions();
          moveFocus(options[options.length - 1]);
          break;
        }
        case ' ':
        case 'Enter':
          event.preventDefault();
          // Activating a disabled option is a complete no-op, so the list does
          // not even close. onActivate has already refused to select it.
          if (isDisabled(event.target.closest('[role=option]'))) break;
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
            clearTabStop();
            select._h_select.focusSearch();
          } else if (isPrintableCharacter(event.key)) {
            // Search from after the current option first, so repeating a letter
            // cycles through the matches instead of sticking on the first.
            const options = getFocusableOptions();
            const current = options.findIndex((option) => option.getAttribute('tabindex') === '0');
            if (!findMatching(event.key, options.slice(current + 1))) {
              findMatching(event.key, options);
            }
          }
      }
    };

    const onClick = () => {
      select._h_select.expanded = !select._h_select.expanded;
      if (select._h_select.expanded && !list) {
        list = select.querySelector(`#${select._h_select.controls}`);
      }
      Alpine.nextTick(() => {
        if (select._h_select.expanded) {
          addDismiss(el, 'click', close);
          el.parentElement.addEventListener('keydown', onKeyDown);
        } else {
          removeDismiss(el, 'click', close);
          el.parentElement.removeEventListener('keydown', onKeyDown);
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
      classes: 'opacity-70 text-inherit size-4 shrink-0 pointer-events-none transition-transform motion-reduce:transition-none duration-200',
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
      // After the labels, so a consumer change handler calling setCustomValidity
      // on the input has already run.
      syncValidity();
    };

    select._h_select.refreshLabel = onInputChange;

    el.addEventListener('change', onInputChange);

    cleanup(() => {
      fakeTrigger.removeEventListener('click', onClick);
      fakeTrigger.removeEventListener('keydown', onPress);
      el.parentElement.removeEventListener('keydown', onKeyDown);
      removeDismiss(el, 'click', close);
      el.removeEventListener('change', onInputChange);
      el.removeEventListener('invalid', onInvalid);
      observer.disconnect();
      if (labelObserver) {
        labelObserver.disconnect();
      }
    });
  });

  Alpine.directive('h-select-content', (el, { original }, { effect, cleanup, Alpine }) => {
    const select = findAncestorState(Alpine, el, '_h_select');
    if (!select) {
      throw new Error(`${original} must be inside a select element`);
    }
    el.classList.add(
      'absolute',
      'bg-popover',
      'text-popover-foreground',
      'hidden',
      'top-0',
      'left-0',
      'z-50',
      'min-w-[1rem]',
      'flex',
      'flex-col',
      'overflow-hidden',
      'rounded-md',
      'border',
      'shadow-md',
      'transition-[opacity,scale]',
      'motion-reduce:transition-none',
      'duration-100',
      'ease-out',
      'opacity-0',
      'scale-95'
    );
    el.setAttribute('data-slot', 'select-content');

    if (!select._h_select.trigger) {
      throw new Error(`${original}: trigger not found`);
    }

    let autoUpdateCleanup;

    function updatePosition() {
      computePosition(select._h_select.trigger, el, {
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
        el.classList.remove('scale-95', 'opacity-0');
      });
    }

    // Guarded on the live state, not a class snapshot, so a late transitionend
    // from an abandoned close cannot hide a popup reopened mid-fade.
    const closer = transitionClose(el, () => {
      if (!select._h_select.expanded) {
        el.classList.add('hidden');
        Object.assign(el.style, {
          left: '0px',
          top: '0px',
        });
      }
    });

    effect(() => {
      if (select._h_select.expanded) {
        closer.cancel();
        el.classList.remove('hidden', 'pointer-events-none');
        autoUpdateCleanup = autoUpdate(select._h_select.trigger, el, updatePosition);
      } else {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          el.classList.add('hidden', 'scale-95', 'opacity-0');
          Object.assign(el.style, {
            left: '0px',
            top: '0px',
          });
        } else {
          // pointer-events-none from the first frame of the fade, so the
          // invisible popup stops swallowing clicks aimed at the page.
          el.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
          closer.schedule();
        }
        if (autoUpdateCleanup) autoUpdateCleanup();
      }
    });

    cleanup(() => {
      closer.dispose();
    });
  });

  Alpine.directive('h-select-list', (el, { original }, { effect, Alpine }) => {
    const select = findAncestorState(Alpine, el, '_h_select');
    if (!select) {
      throw new Error(`${original} must be inside a select element`);
    }

    el.classList.add('p-1', 'min-h-0', 'overflow-x-hidden', 'overflow-y-auto');
    el.setAttribute('data-slot', 'select-list');
    el.setAttribute('role', 'listbox');
    el.setAttribute('id', select._h_select.controls);
    el.setAttribute('tabindex', '-1');

    // The listbox carries the same name as the trigger, so it has to be left
    // nameless when there is none. Writing the missing value would point
    // aria-labelledby at an id that does not exist.
    effect(() => {
      const { ariaLabelledby, ariaLabel } = select._h_select;
      if (ariaLabelledby) el.setAttribute('aria-labelledby', ariaLabelledby);
      else el.removeAttribute('aria-labelledby');
      if (!ariaLabelledby && ariaLabel) el.setAttribute('aria-label', ariaLabel);
      else el.removeAttribute('aria-label');
    });

    effect(() => {
      if (select._h_select.multiple) el.setAttribute('aria-multiselectable', 'true');
      else el.removeAttribute('aria-multiselectable');
    });
  });

  Alpine.directive('h-select-search', (el, { original }, { effect, cleanup, Alpine }) => {
    const select = findAncestorState(Alpine, el, '_h_select');
    if (!select) {
      throw new Error(`${original} must be inside an h-select element`);
    } else {
      select._h_select.filterType = FilterType[el.getAttribute('data-filter')] ?? FilterType['starts-with'];
      select._h_select.includeDesc = el.getAttribute('data-include-desc') === 'true';
    }
    // The row supplies its own inset now that the popup has no padding, so the
    // icon lines up with the option labels one level down.
    el.classList.add('flex', 'items-center', 'gap-2', 'border-b', 'py-1.5', 'px-3');
    el.setAttribute('data-slot', 'select-search');
    const searchIcon = createSvg({ icon: Search, classes: 'size-4 shrink-0 opacity-50', attrs: { 'aria-hidden': true, role: 'presentation' } });
    // The combobox semantics belong on the focusable input, not on the row.
    const searchInput = document.createElement('input');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('data-slot', 'select-search-input');
    searchInput.setAttribute('aria-label', el.getAttribute('aria-label') || 'Search');
    searchInput.setAttribute('aria-autocomplete', select._h_select.filterType === FilterType.none ? 'both' : 'list');
    searchInput.setAttribute('aria-controls', select._h_select.controls);
    searchInput.setAttribute('aria-haspopup', 'listbox');
    searchInput.setAttribute('role', 'combobox');
    searchInput.setAttribute('autocomplete', 'off');
    searchInput.setAttribute('autocorrect', 'off');
    searchInput.setAttribute('spellcheck', 'false');
    searchInput.classList.add('placeholder:text-muted-foreground', 'size-full', 'bg-transparent', 'text-sm', 'outline-hidden', 'disabled:cursor-not-allowed', 'disabled:opacity-disabled');
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

    function onInput() {
      select._h_select.search = searchInput.value.toLowerCase();
    }

    if (select._h_select.filterType !== FilterType.none) {
      searchInput.addEventListener('keyup', onInput);
    }

    effect(() => {
      if (select._h_select.expanded) searchInput.focus({ preventScroll: true });
      searchInput.setAttribute('aria-expanded', select._h_select.expanded);
    });

    const observer = new MutationObserver(() => {
      select._h_select.filterType = FilterType[el.getAttribute('data-filter')] ?? FilterType['starts-with'];
      select._h_select.includeDesc = el.getAttribute('data-include-desc') === 'true';
      searchInput.setAttribute('aria-autocomplete', select._h_select.filterType === FilterType.none ? 'both' : 'list');
    });

    observer.observe(el, { attributes: true, attributeFilter: ['data-filter', 'data-include-desc'] });

    cleanup(() => {
      el.removeEventListener('click', onActivate);
      el.removeEventListener('keydown', onActivate);
      if (select._h_select.filterType !== FilterType.none) searchInput.removeEventListener('keyup', onInput);
      observer.disconnect();
    });
  });

  Alpine.directive('h-select-group', (el, _, { effect }) => {
    el.setAttribute('data-slot', 'select-group');
    el.setAttribute('role', 'group');
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

    const selectGroup = findAncestorState(Alpine, el, '_h_selectGroup');
    if (selectGroup) {
      const id = `hsl${uuidv4()}`;
      el.setAttribute('id', id);
      selectGroup._h_selectGroup.labelledby = id;
    }
  });

  Alpine.directive('h-select-option', (el, { original, expression }, { effect, evaluateLater, cleanup }) => {
    const select = findAncestorState(Alpine, el, '_h_select');
    if (!select) {
      throw new Error(`${original} must be inside an h-select element`);
    }

    el.classList.add(
      'focus:bg-primary',
      'focus:text-primary-foreground',
      'hover:bg-secondary-hover',
      'hover:text-secondary-foreground',
      'flex',
      'w-full',
      'cursor-default',
      'items-center',
      'gap-2',
      'rounded-sm',
      'py-1.5',
      'px-2',
      'text-sm',
      'outline-hidden',
      'select-none',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-disabled',
      'aria-disabled:cursor-not-allowed',
      'svg-defaults',
      '[&>svg]:order-first',
      '[&>svg]:text-inherit',
      '[&>img]:order-first',
      '[&>img:not([class*="size-"])]:size-4',
      '[&>img]:shrink-0',
      '[&>img]:pointer-events-none'
    );
    el.setAttribute('data-slot', 'select-option');
    el.setAttribute('tabindex', '-1');

    const id = `hso${uuidv4()}`;
    el.setAttribute('role', 'option');
    el.setAttribute('aria-labelledby', id);

    const indicatorEl = document.createElement('span');
    const textCol = document.createElement('span');
    const labelEl = document.createElement('span');
    labelEl.setAttribute('id', id);
    textCol.classList.add('flex', 'flex-col');
    textCol.appendChild(labelEl);
    indicatorEl.classList.add('order-last', 'ml-auto', 'flex', 'size-3.5', 'items-center', 'justify-center', 'invisible');
    indicatorEl.setAttribute('aria-hidden', 'true');
    const check = createSvg({ icon: Check, attrs: { 'aria-hidden': true, role: 'presentation' } });
    indicatorEl.appendChild(check);

    el.appendChild(indicatorEl);
    el.appendChild(textCol);

    let descriptionEl;
    const descriptionId = `hsod${uuidv4()}`;

    function renderDescription() {
      const text = el.getAttribute('data-description');
      if (text) {
        if (!descriptionEl) {
          descriptionEl = document.createElement('span');
          descriptionEl.setAttribute('id', descriptionId);
          descriptionEl.classList.add('text-muted-foreground', 'text-xs', '[[data-slot=select-option]:focus_&]:text-primary-foreground/80');
          textCol.appendChild(descriptionEl);
          if (!el.hasAttribute('aria-describedby')) el.setAttribute('aria-describedby', descriptionId);
        }
        descriptionEl.textContent = text;
      } else if (descriptionEl) {
        if (el.getAttribute('aria-describedby') === descriptionId) el.removeAttribute('aria-describedby');
        descriptionEl.remove();
        descriptionEl = undefined;
      }
    }

    renderDescription();

    const descriptionObserver = new MutationObserver(renderDescription);
    descriptionObserver.observe(el, { attributes: true, attributeFilter: ['data-description'] });

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

    // A hidden option is out of the arrow order, so it cannot keep the stop.
    // Left behind it would come back when the search clears, on an option
    // nobody focused.
    function setHidden(hidden) {
      el.classList.toggle('hidden', hidden);
      if (hidden) el.setAttribute('tabindex', '-1');
    }

    effect(() => {
      if (select._h_select.search) {
        const haystack = (select._h_select.includeDesc && descriptionEl ? `${labelEl.innerText} ${descriptionEl.innerText}` : labelEl.innerText).toLowerCase();
        if (select._h_select.filterType === FilterType['starts-with']) {
          // starts-with always keys off the label, since a prefix match inside
          // the description would be surprising.
          setHidden(!labelEl.innerText.toLowerCase().startsWith(select._h_select.search));
        } else if (select._h_select.filterType === FilterType.contains) {
          setHidden(!haystack.includes(select._h_select.search));
        } else if (select._h_select.filterType === FilterType['contains-each']) {
          const terms = select._h_select.search.split(' ');
          setHidden(!terms.every((term) => haystack.includes(term)));
        } else {
          setHidden(false);
        }
      } else setHidden(false);
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
      // Read at event time so a bound aria-disabled that toggles is honoured.
      // pointer-events-none blocks the mouse but never a key press.
      if (isDisabled(el)) return;
      if ((event.type === 'keydown' && (event.key === 'Enter' || event.key === ' ')) || event.type === 'click') {
        if (select._h_select.multiple) {
          event.stopPropagation();
          // The model setter is itself the toggle for the multiple case.
          select._h_model.set(getValue());
        } else if (select._h_model.get() !== getValue()) {
          select._h_model.set(getValue());
        } else if (select.getAttribute('data-clearable') === 'true') {
          select._h_model.set('');
        }
      }
    };

    el.addEventListener('click', onActivate);
    el.addEventListener('keydown', onActivate);

    cleanup(() => {
      el.removeEventListener('click', onActivate);
      el.removeEventListener('keydown', onActivate);
      descriptionObserver.disconnect();
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
