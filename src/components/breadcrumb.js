import { ChevronRight, createSvg } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-breadcrumb', (el, _, { Alpine, cleanup }) => {
    el.classList.add('flex', 'items-center', 'break-words', 'text-sm', 'text-muted-foreground', 'rounded-control');
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', 'breadcrumb');
    el.setAttribute('data-slot', 'breadcrumb');

    const variants = {
      outline: ['border'],
    };
    const allVariantClasses = Object.values(variants).flat();

    const sizes = {
      default: ['h-9', 'px-3'],
      md: ['h-8', 'px-2.5'],
      sm: ['h-6.5', 'px-2'],
    };
    const allSizeClasses = Object.values(sizes).flat();

    function applyClasses() {
      const variant = el.getAttribute('data-variant');
      const size = el.getAttribute('data-size') ?? 'default';
      el.classList.remove(...allVariantClasses, ...allSizeClasses);
      if (variant && Object.prototype.hasOwnProperty.call(variants, variant)) {
        el.classList.add(...variants[variant]);
        el.classList.add(...(sizes[size] ?? sizes.default));
      } else {
        el.classList.add('px-2');
      }
    }

    applyClasses();

    const observer = new MutationObserver(() => applyClasses());

    observer.observe(el, { attributes: true, attributeFilter: ['data-variant', 'data-size'] });

    if (el.getAttribute('data-overflow') === 'scroll') {
      el.classList.add('overflow-x-scroll', 'scrollbar-none');

      let preserveScroll = false;
      const scrollToEnd = () => {
        el.scrollLeft = el.scrollWidth;
      };

      Alpine.nextTick(scrollToEnd);

      const handleScroll = () => {
        preserveScroll = el.scrollLeft < el.scrollWidth - el.clientWidth - 1;
      };

      const handleResize = () => {
        if (!preserveScroll) scrollToEnd();
      };

      el.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      cleanup(() => {
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
      });
    } else if (el.getAttribute('data-overflow') === 'nowrap') {
      el.classList.add('flex-nowrap');
      cleanup(() => observer.disconnect());
    } else {
      el.classList.add('flex-wrap');
      cleanup(() => observer.disconnect());
    }
  });

  Alpine.directive('h-breadcrumb-list', (el, _, { Alpine }) => {
    el.classList.add('flex', 'items-center', 'gap-1.5');
    el.setAttribute('data-slot', 'breadcrumb-list');

    const nav = Alpine.findClosest(el, (node) => node.getAttribute('data-slot') === 'breadcrumb');
    const overflow = nav?.getAttribute('data-overflow');
    if (overflow === 'scroll' || overflow === 'nowrap') {
      el.classList.add('flex-nowrap');
    } else {
      el.classList.add('flex-wrap');
    }
  });

  Alpine.directive('h-breadcrumb-item', (el) => {
    el.classList.add('group', 'inline-flex', 'items-center', 'gap-1.5');
    el.setAttribute('data-slot', 'breadcrumb-item');

    const separator = createSvg({
      icon: ChevronRight,
      classes: 'size-3.5 group-first-of-type:hidden',
      attrs: { 'aria-hidden': 'true', role: 'presentation' },
    });

    el.prepend(separator);
  });

  Alpine.directive('h-breadcrumb-link', (el) => {
    el.classList.add(
      'cursor-pointer',
      'hbox',
      'gap-1.5',
      'items-center',
      'whitespace-nowrap',
      'text-primary',
      'transition-colors',
      'underline-offset-4',
      'hover:underline',
      'hover:text-primary-hover',
      'active:text-primary-active',
      '[&>svg]:size-4',
      '[&>svg]:text-current'
    );
    el.setAttribute('data-slot', 'breadcrumb-link');
  });

  Alpine.directive('h-breadcrumb-page', (el) => {
    el.classList.add('hbox', 'gap-1.5', 'items-center', 'whitespace-nowrap', 'text-foreground', 'font-normal', '[&>svg]:size-4', '[&>svg]:text-current');
    el.setAttribute('role', 'link');
    el.setAttribute('aria-current', 'page');
    el.setAttribute('aria-disabled', 'true');
    el.setAttribute('data-slot', 'breadcrumb-page');
  });
}
