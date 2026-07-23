const OPERATORS = {
  '>=': (w, target) => w >= target,
  '>': (w, target) => w > target,
  '<': (w, target) => w < target,
  '<=': (w, target) => w <= target,
  '==': (w, target) => w === target,
};

// Turn the authored config into a clean list of predicates. `width` must be a
// number of pixels. Each condition reacts by toggling `classes` (a list of
// strings), invoking a `callback` (a function), or both. A bad operator, a
// non-numeric width, a non-function callback, or a condition that reacts in
// neither way throws so the mistake surfaces immediately instead of silently
// doing nothing. `name` is the directive's full attribute name (with the
// author's chosen prefix) for error messages.
function normalize(config, name) {
  if (!Array.isArray(config)) {
    throw new Error(`${name} expects an array of { op, width, classes } conditions.`);
  }
  const conditions = [];
  for (const row of config) {
    if (!row || typeof row !== 'object') {
      throw new Error(`${name}: each condition must be an object with op, width and classes.`);
    }
    const op = OPERATORS[row.op];
    if (!op) {
      throw new Error(`${name}: unknown operator "${row.op}". Use one of >=, >, <, <=, ==.`);
    }
    if (typeof row.width !== 'number' || !Number.isFinite(row.width)) {
      throw new Error(`${name}: "width" must be a number of pixels.`);
    }
    const add = Array.isArray(row.classes) ? row.classes.filter((cls) => typeof cls === 'string' && cls) : [];
    let cb;
    if (row.callback !== undefined && row.callback !== null) {
      if (typeof row.callback !== 'function') {
        throw new Error(`${name}: "callback" must be a function.`);
      }
      cb = row.callback;
    }
    if (!add.length && !cb) {
      throw new Error(`${name}: each condition needs "classes" or "callback".`);
    }
    // `lastState` tracks the callback's last-fired boolean so it fires only when
    // the match state changes. It seeds to undefined, so the first apply() always
    // differs and fires the callback with the initial state, then reacts again on
    // every later flip. Reactive config changes rebuild these objects, so the
    // next apply() re-announces the current state through the fresh callbacks.
    conditions.push({ op, width: row.width, add, cb, lastState: undefined });
  }
  return conditions;
}

export default function (Alpine) {
  Alpine.directive('h-responsive', (el, { original, expression, modifiers }, { evaluateLater, effect, cleanup }) => {
    let conditions = [];
    // The classes this directive currently owns. We only ever add or remove
    // classes we put here, so classes the author set elsewhere are untouched.
    let applied = new Set();

    // By default the element measures its own width. The `.parent` modifier
    // measures the parent instead, which is needed when a toggled class
    // collapses the element's own box (e.g. `hidden` -> display:none would
    // report a width of 0 and the element could never grow back).
    const target = (modifiers.includes('parent') && el.parentElement) || el;

    const apply = () => {
      const width = target.getBoundingClientRect().width;
      const want = new Set();
      for (const condition of conditions) {
        const matched = condition.op(width, condition.width);
        if (matched) {
          for (const cls of condition.add) want.add(cls);
        }
        // Fire the callback only when its match state changes (once on mount, then
        // on every flip). Record the state before calling so a throwing callback
        // does not re-fire the same edge on a later pass.
        if (condition.cb && matched !== condition.lastState) {
          condition.lastState = matched;
          condition.cb(matched);
        }
      }
      for (const cls of applied) {
        if (!want.has(cls)) el.classList.remove(cls);
      }
      for (const cls of want) {
        if (!applied.has(cls)) el.classList.add(cls);
      }
      applied = want;
    };

    const getConfig = evaluateLater(expression);
    effect(() =>
      getConfig((config) => {
        conditions = normalize(config, original);
        apply();
      })
    );

    // The measured element's width drives the conditions, so watch it directly
    // rather than the viewport.
    if (typeof ResizeObserver !== 'undefined') {
      let frame = 0;
      let lastWidth = -1;
      const observer = new ResizeObserver(() => {
        const width = target.getBoundingClientRect().width;
        if (width === lastWidth) return;
        lastWidth = width;
        if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
        if (typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(apply);
        else apply();
      });
      observer.observe(target);
      cleanup(() => {
        if (frame && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
        observer.disconnect();
      });
    }
  });
}
