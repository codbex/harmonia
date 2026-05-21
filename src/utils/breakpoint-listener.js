export function getBreakpointListener(handler, breakpoint = 768, frame = false) {
  let bps = Number.isFinite(breakpoint) ? `${breakpoint}px` : breakpoint;
  const mql = frame ? window.matchMedia(`(width <= ${bps})`) : top.matchMedia(`(width <= ${bps})`);
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
