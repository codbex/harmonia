// Runs `finish` when a close fade ends, without trusting transitionend to
// arrive: the browser drops it when the transition never runs to completion
// (interrupting styles, an ancestor turning display:none mid-fade, a hidden
// tab), which would leave the invisible element in place forever. schedule()
// arms a fallback timer instead of listening for transitioncancel, because
// cancel also fires on a plain reversal and would cut the fade-out short.
// Every fade is duration-200 or shorter, 250ms adds margin.
// `finish` must be idempotent and check the component's live open state
// itself: it can also fire from the opening fade's transitionend or after
// the element was already hidden.
export function transitionClose(el, finish) {
  let timer;
  function onTransitionEnd(event) {
    if (event.target === el) finish();
  }
  el.addEventListener('transitionend', onTransitionEnd);
  return {
    schedule() {
      clearTimeout(timer);
      timer = setTimeout(finish, 250);
    },
    cancel() {
      clearTimeout(timer);
    },
    dispose() {
      clearTimeout(timer);
      el.removeEventListener('transitionend', onTransitionEnd);
    },
  };
}
