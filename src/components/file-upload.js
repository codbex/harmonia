import uuidv4 from '../utils/uuid';

export default function (Alpine) {
  Alpine.directive('h-file-upload', (el, { original }, { cleanup, Alpine }) => {
    const fileInput = el.querySelector('input[type="file"]');
    if (!fileInput) {
      throw new Error(`${original} must contain an <input type="file">`);
    }
    const tagGroup = el.querySelector(`[${Alpine.prefixed('h-tag-group')}]`);
    if (!tagGroup) {
      throw new Error(`${original} must contain an ${Alpine.prefixed('h-tag-group')} element to hold the file tags`);
    }

    // The native input stays the form control but is visually hidden; it remains
    // focusable so keyboard users can open the dialog with Enter/Space, and the
    // group's focus / invalid styling responds via data-slot=input-group-control.
    fileInput.classList.add('sr-only');
    fileInput.setAttribute('data-slot', 'input-group-control');
    if (!fileInput.hasAttribute('id')) {
      fileInput.setAttribute('id', `fin${uuidv4()}`);
    }

    // The tag group is the display area: stretch it and clip overflow so it reads
    // like the text region of a regular input.
    const display = tagGroup.parentElement;
    if (display) display.classList.add('flex-1', 'min-w-0', 'justify-start', 'overflow-hidden');
    tagGroup.classList.add('min-w-0', 'overflow-hidden');
    tagGroup.setAttribute('aria-live', 'polite');

    const placeholder = document.createElement('span');
    placeholder.setAttribute('data-slot', 'file-input-placeholder');
    placeholder.classList.add('text-muted-foreground', 'truncate', 'px-1.5', 'font-normal');
    placeholder.textContent = el.getAttribute('data-placeholder') || 'No file chosen';

    el.classList.add('has-[input:disabled]:pointer-events-none', 'has-[input:disabled]:opacity-disabled');

    // Tags are Alpine-managed (the x-h-tag directive runs via initTree), so each
    // must be destroyed before it is removed to avoid leaking reactive effects.
    let renderedTags = [];
    function clearTags() {
      for (const tag of renderedTags) Alpine.destroyTree(tag);
      renderedTags = [];
      tagGroup.replaceChildren();
    }

    function render() {
      clearTags();
      const files = fileInput.files;
      if (!files || files.length === 0) {
        tagGroup.appendChild(placeholder);
        return;
      }
      for (const file of files) {
        const tag = document.createElement('div');
        tag.setAttribute(Alpine.prefixed('h-tag'), '');
        tag.setAttribute('data-file', file.name);
        tag.setAttribute('title', file.name);
        tag.classList.add('max-w-40', 'min-w-0');
        const name = document.createElement('span');
        name.classList.add('min-w-0', 'truncate');
        name.textContent = file.name;
        tag.appendChild(name);
        tagGroup.appendChild(tag);
        Alpine.initTree(tag);
        renderedTags.push(tag);
      }
    }

    // Clicking anywhere in the group (the display area or the Browse button) opens
    // the native picker. The guard ignores the synthetic click that fileInput.click()
    // dispatches (which bubbles back here) to avoid reopening it in a loop.
    const onClick = (event) => {
      if (fileInput.disabled) return;
      if (event.target === fileInput || fileInput.contains(event.target)) return;
      fileInput.click();
    };
    el.addEventListener('click', onClick);

    const onChange = () => render();
    fileInput.addEventListener('change', onChange);

    // Mirror a form reset (which clears the input without firing `change`).
    const form = el.closest('form');
    const onReset = () => queueMicrotask(render);
    if (form) form.addEventListener('reset', onReset);

    render();

    cleanup(() => {
      el.removeEventListener('click', onClick);
      fileInput.removeEventListener('change', onChange);
      if (form) form.removeEventListener('reset', onReset);
      clearTags();
    });
  });
}
