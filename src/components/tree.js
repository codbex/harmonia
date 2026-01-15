export default function (Alpine) {
  Alpine.directive('h-tree', (el, { modifiers }, { effect }) => {
    el.classList.add('vbox', 'w-full', 'min-w-0', 'gap-1');
    el.setAttribute('tabindex', '-1');
    if (modifiers.includes('sub')) {
      el.classList.add(
        'relative',
        'translate-x-px',
        'py-0.5',
        'pl-4',
        'data-[border=true]:before:absolute',
        'data-[border=true]:before:left-[calc(var(--spacing)*3)]',
        'data-[border=true]:before:block',
        'data-[border=true]:before:h-full',
        'data-[border=true]:before:min-w-px',
        'data-[border=true]:before:w-[calc(var(--spacing)*0.25)]',
        'data-[border=true]:before:bg-border'
      );
      el.setAttribute('data-slot', 'subtree');
      el.setAttribute('role', 'group');
      const treeItem = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_tree_item'));
      effect(() => {
        if (treeItem._h_tree_item.expanded) {
          el.classList.remove('!hidden');
        } else {
          el.classList.add('!hidden');
        }
      });
    } else {
      el.setAttribute('data-slot', 'tree');
      el.setAttribute('role', 'tree');

      function getVisibleItems(tree) {
        return [...tree.querySelectorAll('[role="treeitem"]')].filter((item) => {
          let parent = item.parentElement.closest('[role="group"]');
          while (parent) {
            const parentItem = parent.closest('[role="treeitem"]');
            if (parentItem && parentItem.getAttribute('aria-expanded') === 'false') {
              return false;
            }
            parent = parentItem?.parentElement.closest('[role="group"]');
          }
          return true;
        });
      }

      function focusItem(item) {
        [...el.querySelectorAll('[role="treeitem"]')].forEach((i) => i.setAttribute('tabindex', '-1'));
        item.setAttribute('tabindex', '0');
        item.focus();
      }

      el.addEventListener('keydown', (e) => {
        const items = getVisibleItems(el);
        const current = el.querySelector('li[tabindex="0"]');
        const index = items.indexOf(current);

        // console.log(items, current, index);

        if (index === -1) return;

        switch (e.key) {
          // case 'Tab':
          //   break;
          case 'ArrowDown':
            e.preventDefault();
            if (items[index + 1]) focusItem(items[index + 1]);
            break;

          case 'ArrowUp':
            e.preventDefault();
            if (items[index - 1]) focusItem(items[index - 1]);
            break;

          case 'ArrowRight':
            if (current.getAttribute('aria-expanded') === 'false') {
              current.click();
            } else {
              const firstChild = current.querySelector('[role="group"] [role="treeitem"]');
              if (firstChild) focusItem(firstChild);
            }
            break;

          case 'ArrowLeft':
            if (current.getAttribute('aria-expanded') === 'true') {
              current.click();
            } else {
              const parentItem = current.parentElement.closest('[role="treeitem"]');
              if (parentItem) focusItem(parentItem);
            }
            break;

          case 'Home':
            e.preventDefault();
            focusItem(items[0]);
            break;

          case 'End':
            e.preventDefault();
            focusItem(items[items.length - 1]);
            break;

          case 'Enter':
          case ' ':
            e.preventDefault();
            current.click();
            break;
        }
      });
    }
  });

  Alpine.directive('h-tree-item', (el, { modifiers, expression }, { evaluate, evaluateLater, effect, cleanup }) => {
    el._h_tree_item = Alpine.reactive({
      hasSubtree: modifiers.includes('expanded'),
      expanded: true,
    });
    el.classList.add(
      'group/tree-item',
      'relative',
      'aria-expanded:[&_ul]:!vbox',
      'outline-none',
      'focus:[&>[data-slot="tree-button"]]:bg-secondary',
      'focus:[&>[data-slot="tree-button"]]:text-secondary-foreground',
      'aria-selected:[&>[data-slot="tree-button"]]:bg-primary',
      'aria-selected:[&>[data-slot="tree-button"]]:font-medium',
      'aria-selected:[&>[data-slot="tree-button"]]:text-primary-foreground'
    );
    el.setAttribute('data-slot', 'tree-item');
    el.setAttribute('role', 'treeitem');
    const treeRoot = Alpine.findClosest(el.parentElement, (parent) => parent.getAttribute('data-slot') === 'tree');
    if (treeRoot && treeRoot.querySelector('[data-slot=tree-item]') === el) {
      el.setAttribute('tabindex', '0');
    } else {
      el.setAttribute('tabindex', '-1');
    }

    effect(() => {
      if (!el.closest('[role="tree"]')) return;
    });

    const onClick = (event) => {
      if (event.target === el || event.target.parentElement === el) {
        if (el._h_tree_item.hasSubtree) {
          if (expression === 'false' || expression === 'true') {
            el._h_tree_item.expanded = el.getAttribute('aria-expanded') === 'true' ? false : true;
            el.setAttribute('aria-expanded', el._h_tree_item.expanded);
          } else {
            el._h_tree_item.expanded = !evaluate(expression);
            evaluate(`${expression} = !${expression}`);
          }
        }
        [...treeRoot.querySelectorAll('[role="treeitem"]')].forEach((i) => i.setAttribute('tabindex', '-1'));
        el.setAttribute('tabindex', '0');
      }
    };

    el.addEventListener('click', onClick);

    cleanup(() => {
      el.removeEventListener('click', onClick);
    });

    if (el._h_tree_item.hasSubtree) {
      const setExpanded = (expanded) => {
        el._h_tree_item.expanded = expanded;
        el.setAttribute('aria-expanded', expanded);
      };
      const getExpanded = evaluateLater(expression);

      effect(() => {
        getExpanded((expanded) => {
          setExpanded(expanded);
        });
      });
    }
  });

  Alpine.directive('h-tree-button', (el, { original }, { effect }) => {
    const treeItem = Alpine.findClosest(el.parentElement, (parent) => parent.hasOwnProperty('_h_tree_item'));
    if (!treeItem) throw new Error(`${original} must be inside a tree item`);
    el.classList.add(
      'flex',
      'w-full',
      'items-center',
      'gap-2',
      'overflow-hidden',
      'rounded-md',
      'p-2',
      'leading-none',
      'text-left',
      'text-sm',
      'align-middle',
      'outline-hidden',
      'ring-ring',
      'transition-[width,height,padding]',
      'hover:bg-secondary',
      'hover:text-secondary-foreground',
      'focus-visible:ring-2',
      'active:bg-primary',
      'active:text-primary-foreground',
      'disabled:pointer-events-none',
      'disabled:opacity-50',
      'aria-disabled:pointer-events-none',
      'aria-disabled:opacity-50',
      '[&>span]:truncate',
      '[&>span]:align-middle',
      '[&>svg]:size-4',
      '[&>svg]:shrink-0'
    );
    el.setAttribute('data-slot', 'tree-button');
    el.setAttribute('tabindex', '-1');
    el.setAttribute('role', 'presentation');

    if (treeItem._h_tree_item.hasSubtree) {
      el.classList.add(
        'before:block',
        'before:mr-1',
        'before:bg-transparent',
        'before:border-t-[calc(var(--spacing)*0.25)]',
        'before:border-r-[calc(var(--spacing)*0.25)]',
        'before:border-foreground',
        'active:before:border-primary-foreground',
        'before:pointer-events-none',
        'before:min-w-1.5',
        'before:size-1.5',
        'before:rounded-[calc(var(--spacing)*0.25)]',
        'before:rotate-135',
        'before:translate-x-1/2',
        'before:-translate-y-0.25',
        'data-[expanded=false]:before:rotate-45',
        'data-[expanded=false]:before:translate-x-1/2',
        'data-[expanded=false]:before:-translate-y-0',
        'aria-selected:before:border-primary-foreground'
      );
    }

    effect(() => {
      el.setAttribute('data-expanded', treeItem._h_tree_item.expanded);
    });
  });
}
