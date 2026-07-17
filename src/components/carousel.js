import { findAncestorState } from '../common/ancestor';
import { disabledControlClasses } from '../common/shared-classes';
import { ChevronLeft, ChevronRight, createSvg } from './../common/icons';

export default function (Alpine) {
  Alpine.directive('h-carousel', (el, _binding, { cleanup, effect, Alpine }) => {
    el.classList.add('relative', 'overflow-hidden', 'outline-ring/50', 'focus-outline');
    el.setAttribute('data-slot', 'carousel');
    el.setAttribute('role', 'region');
    el.setAttribute('aria-roledescription', 'carousel');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.getAttribute('data-label') || 'Carousel');

    const loop = el.getAttribute('data-loop') !== 'false';
    const autoplay = el.hasAttribute('data-autoplay');
    const interval = Number(el.getAttribute('data-interval')) || 5000;
    const start = Number(el.getAttribute('data-start')) || 0;

    const state = Alpine.reactive({ active: start, count: 0 });
    el._h_carousel = state;

    let timer;
    let paused = false;

    function tick() {
      if (!loop && state.active >= state.count - 1) {
        clearInterval(timer);
        return;
      }
      state.goTo(state.active + 1);
    }

    function restartAutoplay() {
      clearInterval(timer);
      if (autoplay && !paused && state.count > 1) {
        timer = setInterval(tick, interval);
      }
    }

    state.goTo = (i) => {
      const n = state.count;
      if (n === 0) return;
      const target = loop ? ((i % n) + n) % n : Math.max(0, Math.min(i, n - 1));
      state.active = target;
      el.dispatchEvent(new CustomEvent('change', { detail: { value: target } }));
      restartAutoplay();
    };
    state.next = () => state.goTo(state.active + 1);
    state.prev = () => state.goTo(state.active - 1);

    const onKeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          state.prev();
          break;
        case 'ArrowRight':
          event.preventDefault();
          state.next();
          break;
        case 'Home':
          event.preventDefault();
          state.goTo(0);
          break;
        case 'End':
          event.preventDefault();
          state.goTo(state.count - 1);
          break;
        default:
          break;
      }
    };

    const onEnter = () => {
      paused = true;
      clearInterval(timer);
    };
    const onLeave = () => {
      paused = false;
      restartAutoplay();
    };

    el.addEventListener('keydown', onKeydown);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('focusin', onEnter);
    el.addEventListener('focusout', onLeave);

    // Start (or restart) autoplay once the slides have registered and bumped the count.
    effect(() => {
      const _count = state.count;
      restartAutoplay();
    });

    cleanup(() => {
      clearInterval(timer);
      el.removeEventListener('keydown', onKeydown);
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('focusin', onEnter);
      el.removeEventListener('focusout', onLeave);
    });
  });

  Alpine.directive('h-carousel-content', (el, { original }, { effect, Alpine }) => {
    const root = findAncestorState(Alpine, el, '_h_carousel');
    if (!root) throw new Error(`${original} must be inside a carousel`);

    el.classList.add('flex', 'transition-transform', 'duration-500', 'ease-out', 'motion-reduce:transition-none');
    el.setAttribute('data-slot', 'carousel-content');

    effect(() => {
      el.style.transform = `translateX(-${root._h_carousel.active * 100}%)`;
    });
  });

  Alpine.directive('h-carousel-item', (el, { original }, { effect, Alpine }) => {
    const root = findAncestorState(Alpine, el, '_h_carousel');
    if (!root) throw new Error(`${original} must be inside a carousel`);

    const index = root._h_carousel.count;
    root._h_carousel.count = index + 1;

    el.classList.add('relative', 'w-full', 'shrink-0', 'grow-0', 'basis-full', 'min-w-0');
    el.setAttribute('data-slot', 'carousel-item');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-roledescription', 'slide');

    const hasLabel = el.hasAttribute('aria-label');

    effect(() => {
      const active = root._h_carousel.active;
      const count = root._h_carousel.count;
      const isActive = active === index;
      el.setAttribute('aria-hidden', String(!isActive));
      el.setAttribute('data-active', String(isActive));
      if (!hasLabel) el.setAttribute('aria-label', `${index + 1} of ${count}`);
    });
  });

  Alpine.directive('h-carousel-control', (el, { modifiers, original }, { effect, cleanup, Alpine }) => {
    const root = findAncestorState(Alpine, el, '_h_carousel');
    if (!root) throw new Error(`${original} must be inside a carousel`);

    const isPrev = modifiers.includes('previous');
    const loop = el.closest('[data-slot=carousel]')?.getAttribute('data-loop') !== 'false';

    el.classList.add(
      'absolute',
      'top-1/2',
      '-translate-y-1/2',
      'z-10',
      'flex',
      'size-9',
      'items-center',
      'justify-center',
      'rounded-full',
      'shadow-button',
      'bg-background/70',
      'text-foreground',
      'cursor-pointer',
      'hover:bg-background',
      'outline-ring/50',
      'focus-outline',
      ...disabledControlClasses,
      'svg-defaults',
      isPrev ? 'left-4' : 'right-4'
    );
    if (el.tagName === 'BUTTON' && !el.hasAttribute('type')) el.setAttribute('type', 'button');
    el.setAttribute('data-slot', 'carousel-control');

    if (!el.hasChildNodes()) {
      el.appendChild(
        createSvg({
          icon: isPrev ? ChevronLeft : ChevronRight,
          classes: 'size-4',
          attrs: { 'aria-hidden': true, role: 'presentation' },
        })
      );
    }

    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', isPrev ? 'Previous slide' : 'Next slide');

    const handler = () => root._h_carousel[isPrev ? 'prev' : 'next']();
    el.addEventListener('click', handler);

    if (!loop) {
      effect(() => {
        const { active, count } = root._h_carousel;
        const atEnd = isPrev ? active <= 0 : active >= count - 1;
        el.disabled = atEnd;
        el.setAttribute('aria-disabled', String(atEnd));
      });
    }

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-carousel-indicators', (el, { original }, { effect, cleanup, Alpine }) => {
    const root = findAncestorState(Alpine, el, '_h_carousel');
    if (!root) throw new Error(`${original} must be inside a carousel`);

    el.classList.add('absolute', 'bottom-3', 'left-1/2', '-translate-x-1/2', 'z-10', 'flex', 'gap-2');
    el.setAttribute('data-slot', 'carousel-indicators');
    el.setAttribute('role', 'group');
    if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.getAttribute('data-label') || 'Choose slide');

    const slideLabel = el.getAttribute('data-slide-label') || 'Slide';

    let dots = [];
    const handlers = [];

    function clearHandlers() {
      handlers.forEach(({ btn, fn }) => btn.removeEventListener('click', fn));
      handlers.length = 0;
    }

    effect(() => {
      const count = root._h_carousel.count;
      const active = root._h_carousel.active;

      if (dots.length !== count) {
        clearHandlers();
        el.replaceChildren();
        dots = [];
        for (let i = 0; i < count; i++) {
          const btn = document.createElement('button');
          btn.setAttribute('type', 'button');
          btn.classList.add('size-3', 'rounded-full', 'shadow-xs', 'cursor-pointer', 'transition-colors', 'motion-reduce:transition-none', 'outline-ring/50', 'focus-outline');
          btn.setAttribute('aria-label', `${slideLabel} ${i + 1}`);
          const fn = () => root._h_carousel.goTo(i);
          btn.addEventListener('click', fn);
          handlers.push({ btn, fn });
          el.appendChild(btn);
          dots.push(btn);
        }
      }

      dots.forEach((btn, i) => {
        const isActive = i === active;
        btn.classList.toggle('bg-primary', isActive);
        btn.classList.toggle('bg-background/70', !isActive);
        if (isActive) btn.setAttribute('aria-current', 'true');
        else btn.removeAttribute('aria-current');
      });
    });

    cleanup(() => {
      clearHandlers();
    });
  });
}
