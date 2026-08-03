// When this frame is embedded by another origin, `top` is a restricted Window proxy
// and reading any property off it that is not on its small whitelist throws, so
// matching the topmost frame is opt-in and degrades to this frame when unreachable.
function topMatchMedia(query) {
  try {
    return top.matchMedia(query);
  } catch {
    // cross-origin ancestor window: inaccessible, measure this frame instead.
    return window.matchMedia(query);
  }
}

// Matches this frame by default. The CSS breakpoint variants a handler usually pairs
// with resolve against this frame too, so the two would disagree inside an iframe.
export function getBreakpointListener(handler, breakpoint = 768, topFrame = false) {
  let bps = Number.isFinite(breakpoint) ? `${breakpoint}px` : breakpoint;
  const query = `(width <= ${bps})`;
  const mql = topFrame ? topMatchMedia(query) : window.matchMedia(query);
  const onWidthChange = (event) => {
    handler(event.matches);
  };
  mql.addEventListener('change', onWidthChange);
  handler(mql.matches);
  return {
    _mql: mql,
    _onWidthChange: onWidthChange,
    remove() {
      this._mql.removeEventListener('change', this._onWidthChange);
    },
  };
}
