import { classListStartsWith } from '../common/class-list';
import { getBreakpointListener } from '../utils/breakpoint-listener';
import uuidv4 from '../utils/uuid';
export default function (Alpine) {
  Alpine.store('_h_notifications', {
    items: [],
    listeners: [],

    push(id = `hn${uuidv4()}`, template, position = 'top-right', timeout = 5000, data = {}) {
      if (!template) {
        throw new Error('Notification must have a template ID');
      }
      const item = {
        id,
        template,
        position,
        timeout,
        data: Alpine.reactive(data),
      };
      this.items.push(item);
      this.listeners.forEach((listener) => {
        if (listener.hasOwnProperty('added')) listener.added(item);
      });
    },

    update(id, data) {
      if (!id) {
        throw new Error('Cannot update a notification if an ID is not provided');
      }
      const index = this.items.findIndex((item) => item.id === id);
      if (index > -1) {
        for (const [key, value] of Object.entries(data)) {
          this.items[index].data[key] = value;
        }
        this.listeners.forEach((listener) => {
          if (listener.hasOwnProperty('updated')) listener.updated(id, data);
        });
      } else {
        console.error(`Notification with id "${id}" does not exist`);
      }
    },

    remove(id) {
      if (!id) {
        throw new Error('Cannot remove a notification if an ID is not provided');
      }
      this.listeners.forEach((listener) => {
        if (listener.hasOwnProperty('removed')) listener.removed(id);
      });
      this.items = this.items.filter((n) => n.id !== id);
    },
  });

  Alpine.magic('notifications', () => {
    return {
      add({ id, template, position, timeout, data } = {}) {
        Alpine.store('_h_notifications').push(id, template, position, timeout, data);
      },
      update({ id, data } = {}) {
        Alpine.store('_h_notifications').update(id, data);
      },
      remove(id) {
        Alpine.store('_h_notifications').remove(id);
      },
      addListener(listener) {
        Alpine.store('_h_notifications').listeners.push(listener);
        return Alpine.store('_h_notifications').listeners[Alpine.store('_h_notifications').listeners.length - 1];
      },
      removeListener(listener) {
        Alpine.store('_h_notifications').listeners = Alpine.store('_h_notifications').listeners.filter((item) => item !== listener);
      },
    };
  });

  Alpine.directive('h-notification-overlay', (el, { original }, { cleanup, Alpine }) => {
    if (el.tagName !== 'SECTION') {
      throw new Error(`${original} must be a button`);
    }
    const notificationTemplates = {};
    el.querySelectorAll('template').forEach((template) => {
      if (!template.hasAttribute('id')) {
        throw new Error('Notification templates must have an ID');
      }
      notificationTemplates[template.getAttribute('id')] = template;
    });
    el.classList.add('fixed', 'w', 'inset-0', 'z-60', 'pointer-events-none', 'grid', 'grid-rows-2', 'grid-cols-1', 'lg:grid-cols-2', 'xl:grid-cols-3');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'false');
    el.setAttribute('data-slot', 'notification-overlay');

    const commonListClasses = ['flex', 'flex-col', 'py-4', 'p-10', 'gap-4', 'overflow-visible', 'size-full'];
    const commonTopClasses = ['[mask-image:linear-gradient(to_bottom,black_80%,transparent)]', 'row-1'];
    const commonBottomClasses = ['[mask-image:linear-gradient(to_top,black_80%,transparent)]', 'row-2'];

    const olTopLeft = document.createElement('ol');
    olTopLeft.classList.add(...commonListClasses, ...commonTopClasses, 'max-lg:hidden', 'items-start');
    olTopLeft.setAttribute('tabindex', '-1');
    el.appendChild(olTopLeft);

    const olTopCenter = document.createElement('ol');
    olTopCenter.classList.add(...commonListClasses, ...commonTopClasses, 'lg:col-2', 'items-center');
    olTopCenter.setAttribute('tabindex', '-1');
    el.appendChild(olTopCenter);

    const olTopRight = document.createElement('ol');
    olTopRight.classList.add(...commonListClasses, ...commonTopClasses, 'max-lg:hidden', 'lg:col-2', 'xl:col-3', 'items-end');
    olTopRight.setAttribute('tabindex', '-1');
    el.appendChild(olTopRight);

    const olBottomLeft = document.createElement('ol');
    olBottomLeft.classList.add(...commonListClasses, ...commonBottomClasses, 'max-lg:hidden', 'items-start', 'justify-end');
    olBottomLeft.setAttribute('tabindex', '-1');
    el.appendChild(olBottomLeft);

    const olBottomCenter = document.createElement('ol');
    olBottomCenter.classList.add(...commonListClasses, ...commonBottomClasses, 'lg:col-2', 'items-center', 'justify-end');
    olBottomCenter.setAttribute('tabindex', '-1');
    el.appendChild(olBottomCenter);

    const olBottomRight = document.createElement('ol');
    olBottomRight.classList.add(...commonListClasses, ...commonBottomClasses, 'max-lg:hidden', 'lg:col-2', 'xl:col-3', 'items-end', 'justify-end');
    olBottomRight.setAttribute('tabindex', '-1');
    el.appendChild(olBottomRight);

    let isLarge = true;
    let isExtraLarge = true;

    const lgBreakpointListener = getBreakpointListener((matches) => {
      isLarge = !matches;
    }, getComputedStyle(el).getPropertyValue('--breakpoint-lg').trim());

    const xlBreakpointListener = getBreakpointListener((matches) => {
      isExtraLarge = !matches;
    }, getComputedStyle(el).getPropertyValue('--breakpoint-xl').trim());

    const listener = {
      added(item) {
        const clone = notificationTemplates[item.template].content.firstElementChild.cloneNode(true);
        clone.classList.add('transform', 'transition-all', 'duration-300', 'ease-out', 'opacity-0');
        clone.setAttribute('id', item.id);
        Alpine.addScopeToNode(clone, item.data);
        if (!isExtraLarge && !isLarge) {
          if (item.position.startsWith('top-')) {
            item.position = 'top-center';
          } else {
            item.position = 'bottom-center';
          }
        } else if (!isExtraLarge) {
          if (item.position === 'top-center') {
            item.position = 'top-right';
          } else if (item.position === 'bottom-center') {
            item.position = 'bottom-right';
          }
        }
        if (item.position === 'top-left') {
          clone._h_animation_class = '-translate-x-full';
          clone.classList.add(clone._h_animation_class);
          olTopLeft.appendChild(clone);
        } else if (item.position === 'top-center') {
          clone._h_animation_class = '-translate-y-full';
          clone.classList.add(clone._h_animation_class);
          olTopCenter.appendChild(clone);
        } else if (item.position === 'top-right') {
          clone._h_animation_class = 'translate-x-full';
          clone.classList.add(clone._h_animation_class);
          olTopRight.appendChild(clone);
        } else if (item.position === 'bottom-left') {
          clone._h_animation_class = '-translate-x-full';
          clone.classList.add(clone._h_animation_class);
          olBottomLeft.appendChild(clone);
        } else if (item.position === 'bottom-center') {
          clone._h_animation_class = 'translate-y-full';
          clone.classList.add(clone._h_animation_class);
          olBottomCenter.appendChild(clone);
        } else {
          clone._h_animation_class = 'translate-x-full';
          clone.classList.add(clone._h_animation_class);
          olBottomRight.appendChild(clone);
        }
        Alpine.initTree(clone);
        Alpine.nextTick(() => {
          // Reading 'offsetHeight' forces the browser to apply pending styles first.
          // This guarantees that the animation will always happen.
          clone.offsetHeight;
          clone.classList.remove(clone._h_animation_class, 'opacity-0');
        });
        if (item.timeout > 0) {
          setTimeout(() => {
            Alpine.store('_h_notifications').remove(item.id);
          }, item.timeout);
        }
      },
      removed(id) {
        const element = el.querySelector(`#${id}`);
        if (element) {
          element.addEventListener(
            'transitionend',
            () => {
              Alpine.destroyTree(element);
              element.remove();
            },
            { once: true }
          );
          element.classList.add(element._h_animation_class, 'opacity-0');
        }
      },
    };
    Alpine.store('_h_notifications').listeners.push(listener);
    if (Alpine.store('_h_notifications').items.length) {
      Alpine.store('_h_notifications').items.forEach((item) => {
        listener.added(item);
      });
    }

    cleanup(() => {
      lgBreakpointListener.remove();
      xlBreakpointListener.remove();
    });
  });

  Alpine.directive('h-notification-list', (el, { original }) => {
    if (el.tagName !== 'OL' && el.tagName !== 'UL') {
      throw new Error(`${original} must be a list element`);
    }
    el.classList.add('flex', 'flex-col', 'divide-solid', 'divide-y');
    el.setAttribute('data-slot', 'notification-list');
    el.setAttribute('role', 'group');
  });

  Alpine.directive('h-notification', (el, { original, modifiers }) => {
    if (el.tagName !== 'LI') {
      throw new Error(`${original} must be a list item element`);
    }
    el.classList.add('pointer-events-auto', 'p-3', 'flex', 'gap-2');
    if (modifiers.includes('floating')) {
      el.classList.add('rounded-lg', 'data-[variant=toast]:rounded-full', 'data-[variant=toast]:py-2', 'border', 'shadow-lg', 'bg-popover', 'text-popover-foreground');
    } else {
      el.classList.add('data-[unread=true]:border-l-warning', 'data-[unread=true]:border-l-3');
    }
    el.setAttribute('data-slot', 'notification');
    el.setAttribute('role', 'alert');
  });

  Alpine.directive('h-notification-media', (el) => {
    if (!classListStartsWith(el.classList, 'items-')) {
      el.classList.add('items-center');
    }
    if (!classListStartsWith(el.classList, 'justify-')) {
      el.classList.add('justify-center');
    }
    el.classList.add('flex', 'flex-col', '[&_svg]:pointer-events-none', "[&_svg:not([class*='size-'])]:size-4", '[&>svg]:text-current');
    el.setAttribute('data-slot', 'notification-media');
  });

  Alpine.directive('h-notification-title', (el) => {
    el.classList.add('line-clamp-1', 'text-sm', 'font-medium', 'tracking-tight');
    el.setAttribute('data-slot', 'notification-title');
  });

  Alpine.directive('h-notification-description', (el) => {
    el.classList.add('text-muted-foreground', 'text-sm', 'font-medium', '[&_p]:leading-relaxed');
    el.setAttribute('data-slot', 'notification-description');
  });

  Alpine.directive('h-notification-actions', (el) => {
    if (!classListStartsWith(el.classList, 'justify-')) {
      el.classList.add('[&[data-orientation=vertical]]:justify-center');
    }
    el.classList.add('flex', 'gap-2', 'data-[orientation=vertical]:flex-col');
    el.setAttribute('data-slot', 'notification-actions');
  });

  Alpine.directive('h-notification-close', (el, { original }, { cleanup, Alpine }) => {
    if (!el.hasAttribute('data-slot')) el.setAttribute('data-slot', 'notification-close');
    let nId;
    function close() {
      Alpine.store('_h_notifications').remove(nId);
    }
    Alpine.findClosest(el.parentElement, (parent) => {
      if (parent.getAttribute('data-slot') === 'notification') {
        nId = parent.id;
        return true;
      }
      return false;
    });
    if (nId) {
      el.addEventListener('click', close);
      cleanup(() => {
        el.removeEventListener('click', close);
      });
    } else {
      console.error(`${original} must be inside a notification with an id`);
    }
  });
}
