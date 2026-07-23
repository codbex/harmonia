import { findAncestorState } from '../common/ancestor';
import { disabledControlClasses } from '../common/shared-classes';
export default function (Alpine) {
  Alpine.directive('h-step-indicator', (el, { expression }, { Alpine }) => {
    if (!el.hasAttribute('data-orientation')) {
      el.setAttribute('data-orientation', 'horizontal');
    }

    el.classList.add(
      'group/step-indicator',
      'flex',
      'gap-2',
      'data-[orientation=horizontal]:flex-row',
      'data-[orientation=horizontal]:items-start',
      'data-[orientation=vertical]:flex-col',
      // Collapsed mode stacks the surviving active step, counter and progress
      // bar into a compact column. The important flag makes it win over the
      // orientation row/column direction above whatever the source order.
      'data-[collapsed=true]:flex-col!',
      'data-[collapsed=true]:items-start!',
      'data-[collapsed=true]:gap-3'
    );
    el.setAttribute('data-slot', 'step-indicator');

    // Items self-register here so the collapsed-mode counter and progress bar
    // can read the total step count (the active step comes from `expression`).
    const items = Alpine.reactive([]);
    el._h_step_indicator = {
      expression,
      items,
      register(state) {
        if (!items.includes(state)) items.push(state);
      },
      unregister(state) {
        const index = items.indexOf(state);
        if (index !== -1) items.splice(index, 1);
      },
    };
  });

  Alpine.directive('h-step-indicator-item', (el, { original, expression }, { effect, evaluateLater, Alpine, cleanup }) => {
    const root = findAncestorState(Alpine, el, '_h_step_indicator');

    if (!root) {
      throw new Error(`${original} must be inside a step indicator`);
    }

    el.classList.add(
      'group/step-item',
      'flex',
      'not-last:flex-1',
      'group-data-[orientation=horizontal]/step-indicator:flex-row',
      'group-data-[orientation=horizontal]/step-indicator:items-center',
      'group-data-[orientation=horizontal]/step-indicator:gap-2',
      'group-data-[orientation=vertical]/step-indicator:flex-col',
      'group-data-[orientation=vertical]/step-indicator:gap-1',
      // Collapsed mode keeps only the active step; the rest fold away so the
      // footprint stays constant regardless of the number of steps.
      'group-data-[collapsed=true]/step-indicator:data-[state=inactive]:hidden',
      'group-data-[collapsed=true]/step-indicator:data-[state=completed]:hidden',
      'group-data-[collapsed=true]/step-indicator:flex-none'
    );
    el.setAttribute('data-slot', 'step-indicator-item');

    el._h_step_indicator_item = Alpine.reactive({
      step: NaN,
      state: 'inactive',
    });

    root._h_step_indicator.register(el._h_step_indicator_item);
    cleanup(() => root._h_step_indicator.unregister(el._h_step_indicator_item));

    // The step is a JS expression evaluated in the element's Alpine scope, not a
    // literal, so items generated with x-for (e.g. `i + 1`) resolve correctly.
    const getStep = evaluateLater(expression);
    const getActiveStep = evaluateLater(root._h_step_indicator.expression);

    effect(() => {
      getStep((rawStep) => {
        const step = Number(rawStep);
        el._h_step_indicator_item.step = step;
        getActiveStep((active) => {
          const activeStep = Number(active);
          const state = activeStep < step ? 'inactive' : activeStep === step ? 'active' : 'completed';
          el._h_step_indicator_item.state = state;
          el.setAttribute('data-state', state);
        });
      });
    });
  });

  Alpine.directive('h-step-indicator-trigger', (el, { original }, { effect, evaluate, Alpine, cleanup }) => {
    const root = findAncestorState(Alpine, el, '_h_step_indicator');
    const item = findAncestorState(Alpine, el, '_h_step_indicator_item');

    if (!root || !item) {
      throw new Error(`${original} must be inside a step indicator item`);
    }

    el.classList.add(
      'cursor-pointer',
      'inline-flex',
      'items-center',
      'gap-3',
      'text-left',
      'outline-none',
      'rounded-control',
      'transition-colors',
      'motion-reduce:transition-none',
      'focus-visible:ring-ring/50',
      'focus-visible:ring-[calc(var(--spacing)*0.75)]',
      'data-[non-interactive=true]:pointer-events-none',
      'data-[non-interactive=true]:cursor-none',
      ...disabledControlClasses
    );
    el.setAttribute('data-slot', 'step-indicator-trigger');

    const handler = () => {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true' || el.getAttribute('data-non-interactive') === 'true') return;
      evaluate(`${root._h_step_indicator.expression} = ${item._h_step_indicator_item.step}`);
    };

    el.addEventListener('click', handler);

    effect(() => {
      if (item._h_step_indicator_item.state === 'active') {
        el.setAttribute('aria-current', 'step');
      } else {
        el.removeAttribute('aria-current');
      }
    });

    cleanup(() => {
      el.removeEventListener('click', handler);
    });
  });

  Alpine.directive('h-step-indicator-marker', (el, { original }, { Alpine }) => {
    const item = findAncestorState(Alpine, el, '_h_step_indicator_item');

    if (!item) {
      throw new Error(`${original} must be inside a step indicator item`);
    }

    el.classList.add(
      'relative',
      'flex',
      'size-8',
      'shrink-0',
      'items-center',
      'justify-center',
      'rounded-full',
      'border',
      'text-sm',
      'font-medium',
      'transition-colors',
      'motion-reduce:transition-none',
      '[&>svg]:size-4',
      'group-data-[state=inactive]/step-item:bg-background',
      'group-data-[state=inactive]/step-item:text-muted-foreground',
      'group-data-[state=inactive]/step-item:border-border',
      'group-data-[state=active]/step-item:bg-primary',
      'group-data-[state=active]/step-item:text-primary-foreground',
      'group-data-[state=active]/step-item:border-primary-foreground',
      'group-data-[state=active]/step-item:ring-primary/50',
      'group-data-[state=active]/step-item:ring-[calc(var(--spacing)*0.75)]',
      'group-data-[state=completed]/step-item:bg-primary',
      'group-data-[state=completed]/step-item:text-primary-foreground',
      'group-data-[state=completed]/step-item:border-primary'
    );
    el.setAttribute('data-slot', 'step-indicator-marker');
  });

  Alpine.directive('h-step-indicator-content', (el) => {
    el.classList.add('vbox', 'gap-1');
    el.setAttribute('data-slot', 'step-indicator-content');
  });

  Alpine.directive('h-step-indicator-title', (el) => {
    el.classList.add('text-sm', 'font-medium', 'text-foreground', 'leading-none', 'group-data-[state=inactive]/step-item:text-muted-foreground');
    el.setAttribute('data-slot', 'step-indicator-title');
  });

  Alpine.directive('h-step-indicator-description', (el) => {
    el.classList.add('text-muted-foreground', 'text-xs', 'leading-none');
    el.setAttribute('data-slot', 'step-indicator-description');
  });

  Alpine.directive('h-step-indicator-separator', (el, { original }, { Alpine }) => {
    const item = findAncestorState(Alpine, el, '_h_step_indicator_item');

    if (!item) {
      throw new Error(`${original} must be inside a step indicator item`);
    }

    el.classList.add(
      'flex-1',
      'rounded-full',
      'bg-border',
      'transition-colors',
      'motion-reduce:transition-none',
      'group-data-[state=completed]/step-item:bg-primary',
      'group-data-[orientation=horizontal]/step-indicator:h-px',
      'group-data-[orientation=horizontal]/step-indicator:mx-2',
      'group-data-[orientation=vertical]/step-indicator:w-px',
      'group-data-[orientation=vertical]/step-indicator:min-h-6',
      'group-data-[orientation=vertical]/step-indicator:my-1',
      'group-data-[orientation=vertical]/step-indicator:ml-4',
      'group-data-[collapsed=true]/step-indicator:hidden'
    );
    el.setAttribute('data-slot', 'step-indicator-separator');
  });

  Alpine.directive('h-step-indicator-counter', (el, { original }, { effect, evaluateLater, Alpine }) => {
    const root = findAncestorState(Alpine, el, '_h_step_indicator');

    if (!root) {
      throw new Error(`${original} must be inside a step indicator`);
    }

    el.classList.add('hidden', 'text-muted-foreground', 'text-sm', 'leading-none', 'tabular-nums', 'group-data-[collapsed=true]/step-indicator:block');
    el.setAttribute('data-slot', 'step-indicator-counter');

    // Each user-facing word is overridable so the counter can be localized.
    const stepWord = el.getAttribute('data-step-label') || 'Step';
    const ofWord = el.getAttribute('data-of-label') || 'of';

    const getActiveStep = evaluateLater(root._h_step_indicator.expression);

    effect(() => {
      getActiveStep((active) => {
        const total = root._h_step_indicator.items.length;
        el.textContent = `${stepWord} ${Number(active)} ${ofWord} ${total}`;
      });
    });
  });

  Alpine.directive('h-step-indicator-progress', (el, { original }, { effect, evaluateLater, Alpine }) => {
    const root = findAncestorState(Alpine, el, '_h_step_indicator');

    if (!root) {
      throw new Error(`${original} must be inside a step indicator`);
    }

    el.classList.add('hidden', 'bg-secondary', 'relative', 'h-1', 'w-full', 'overflow-hidden', 'rounded-full', 'group-data-[collapsed=true]/step-indicator:block');
    el.setAttribute('data-slot', 'step-indicator-progress');
    el.setAttribute('role', 'progressbar');
    el.setAttribute('aria-valuemin', '0');

    // Reuse the progress bar's fill idiom - a full-width indicator slid left by
    // the remaining percentage (see src/components/progress.js).
    const indicator = document.createElement('div');
    indicator.classList.add('bg-primary', 'h-full', 'w-full', 'rounded-full', 'transition-all', 'motion-reduce:transition-none');
    indicator.setAttribute('data-slot', 'step-indicator-progress-indicator');
    Object.assign(indicator.style, { transform: `translateX(-${100 - 0}%)` });
    el.appendChild(indicator);

    const getActiveStep = evaluateLater(root._h_step_indicator.expression);

    effect(() => {
      getActiveStep((active) => {
        const step = Number(active);
        const total = root._h_step_indicator.items.length;
        const pct = total > 0 ? Math.min(Math.max((step / total) * 100, 0), 100) : 0;
        el.setAttribute('aria-valuemax', String(total));
        el.setAttribute('aria-valuenow', String(step));
        Object.assign(indicator.style, { transform: `translateX(-${100 - pct}%)` });
      });
    });
  });
}
