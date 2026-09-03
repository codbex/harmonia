// Shared pointer plumbing for drag interactions (calendar events, slot picker slots).

// Pointer travel in px before a press becomes a drag.
export const DRAG_THRESHOLD = 4;

export function capturePointer(target, e) {
  if (target.setPointerCapture) {
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Pointer capture is best-effort. Ignore environments that lack it.
    }
  }
}

export function releasePointer(target, e) {
  if (target.releasePointerCapture) {
    try {
      target.releasePointerCapture(e.pointerId);
    } catch {
      // Pointer capture is best-effort. Ignore environments that lack it.
    }
  }
}

// Day-target drag: the source element stays in place (dimmed) while the cell or
// column under the pointer is highlighted as the drop target. The caller maps
// pointer coordinates to targets via resolveTarget(x, y) -> { el, ... } | null
// and receives the final target (or null when the drop landed on none) in
// onDrop, which fires only after a real drag (past the threshold) ends with a
// pointerup, never on pointercancel. canStart(e) can veto a press (e.g. one
// that begins on a nested interactive element), and onPointerDown runs for
// every accepted press. Listeners live on the source element itself (pointer
// capture routes moves there), so they die with the render and nothing
// outlives the directive.
export function attachDayDrag(source, { canStart, onPointerDown, resolveTarget, onDrop }) {
  source.addEventListener('pointerdown', (e) => {
    if (e.button > 0) return;
    if (canStart && !canStart(e)) return;
    onPointerDown?.();
    const startX = e.clientX;
    const startY = e.clientY;
    let dragging = false;
    let target = null;

    const setTarget = (next) => {
      if (next?.el === target?.el) return;
      if (target) {
        target.el.removeAttribute('data-drop-target');
        target.el.classList.remove('bg-muted/50');
      }
      target = next;
      if (target) {
        target.el.setAttribute('data-drop-target', 'true');
        target.el.classList.add('bg-muted/50');
      }
    };

    const move = (me) => {
      if (!source.isConnected) return finish(false);
      if (!dragging) {
        if (Math.abs(me.clientX - startX) < DRAG_THRESHOLD && Math.abs(me.clientY - startY) < DRAG_THRESHOLD) return;
        dragging = true;
        source.setAttribute('data-dragging', 'true');
        source.classList.add('opacity-50');
      }
      setTarget(resolveTarget(me.clientX, me.clientY));
    };

    const finish = (commit) => {
      source.removeEventListener('pointermove', move);
      source.removeEventListener('pointerup', up);
      source.removeEventListener('pointercancel', cancel);
      releasePointer(source, e);
      if (!dragging) return;
      const drop = target;
      setTarget(null);
      source.removeAttribute('data-dragging');
      source.classList.remove('opacity-50');
      if (commit) onDrop(drop);
    };
    const up = () => finish(true);
    const cancel = () => finish(false);

    capturePointer(source, e);
    source.addEventListener('pointermove', move);
    source.addEventListener('pointerup', up);
    source.addEventListener('pointercancel', cancel);
  });
}
