// Document realms that should receive an outside-dismiss listener for `el`:
// always the element's own document; plus the top window's document when that
// is a different, same-origin realm (component inside an iframe), so a click in
// the parent page also dismisses. Cross-origin ancestors are inaccessible and
// silently skipped (listen within the local document only).
function dismissTargets(el) {
  const doc = el.ownerDocument;
  const targets = [doc];
  try {
    const topDoc = doc.defaultView && doc.defaultView.top && doc.defaultView.top.document;
    if (topDoc && topDoc !== doc) targets.push(topDoc);
  } catch {
    // cross-origin ancestor window: inaccessible, dismiss within the local document only.
  }
  return targets;
}

export function addDismiss(el, type, handler, options) {
  dismissTargets(el).forEach((t) => t.addEventListener(type, handler, options));
}

export function removeDismiss(el, type, handler, options) {
  dismissTargets(el).forEach((t) => t.removeEventListener(type, handler, options));
}
