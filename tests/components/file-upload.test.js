import { describe, expect, it, vi } from 'vitest';
import fileUploadPlugin from '../../src/components/file-upload.js';
import { mountDirective } from '../test-utils.js';

function build({ multiple = false, disabled = false, placeholder, withInput = true, withTagGroup = true } = {}) {
  const group = document.createElement('div');
  if (placeholder) group.setAttribute('data-placeholder', placeholder);

  let input;
  if (withInput) {
    input = document.createElement('input');
    input.setAttribute('type', 'file');
    if (multiple) input.setAttribute('multiple', '');
    if (disabled) input.disabled = true;
    group.appendChild(input);
  }

  let tagGroup;
  if (withTagGroup) {
    const addon = document.createElement('div');
    tagGroup = document.createElement('div');
    tagGroup.setAttribute('x-h-tag-group', '');
    addon.appendChild(tagGroup);
    group.appendChild(addon);
  }

  const btnAddon = document.createElement('div');
  const browse = document.createElement('button');
  browse.setAttribute('type', 'button');
  browse.textContent = 'Browse';
  btnAddon.appendChild(browse);
  group.appendChild(btnAddon);

  document.body.appendChild(group);
  return { group, input, tagGroup, browse };
}

function setFiles(input, names) {
  Object.defineProperty(input, 'files', {
    value: names.map((name) => ({ name })),
    configurable: true,
  });
}

function mount(group) {
  return mountDirective(fileUploadPlugin, 'h-file-upload', group, { original: 'h-file-upload' });
}

describe('h-file-upload', () => {
  it('registers the directive', () => {
    const { group } = build();
    const { alpine } = mount(group);
    expect(alpine._directives['h-file-upload']).toBeDefined();
  });

  it('throws when there is no file input', () => {
    const { group } = build({ withInput: false });
    expect(() => mount(group)).toThrow();
  });

  it('throws when there is no tag group', () => {
    const { group } = build({ withTagGroup: false });
    expect(() => mount(group)).toThrow();
  });

  it('hides the native input and marks it as the group control', () => {
    const { group, input } = build();
    mount(group);
    expect(input.classList.contains('sr-only')).toBe(true);
    expect(input.getAttribute('data-slot')).toBe('input-group-control');
    expect(input.hasAttribute('id')).toBe(true);
  });

  it('shows the placeholder when nothing is selected', () => {
    const { group, tagGroup } = build({ placeholder: 'Pick a file' });
    mount(group);
    const placeholder = tagGroup.querySelector('[data-slot="file-input-placeholder"]');
    expect(placeholder).toBeTruthy();
    expect(placeholder.textContent).toBe('Pick a file');
  });

  it('opens the native picker when the group (e.g. Browse) is clicked', () => {
    const { group, input, browse } = build();
    mount(group);
    const clickSpy = vi.spyOn(input, 'click');
    browse.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('does not recurse when the click originates from the file input', () => {
    const { group, input } = build();
    mount(group);
    const clickSpy = vi.spyOn(input, 'click');
    input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('does not open when the input is disabled', () => {
    const { group, input, browse } = build({ disabled: true });
    mount(group);
    expect(group.classList.contains('has-[input:disabled]:pointer-events-none')).toBe(true);
    expect(group.classList.contains('has-[input:disabled]:opacity-disabled')).toBe(true);
    const clickSpy = vi.spyOn(input, 'click');
    browse.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('reacts to the disabled attribute being toggled after init', () => {
    const { group, input, browse } = build();
    mount(group);
    const clickSpy = vi.spyOn(input, 'click');

    input.disabled = true;
    browse.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clickSpy).not.toHaveBeenCalled();

    input.disabled = false;
    browse.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('renders a tag per selected file on change and hides the placeholder', () => {
    const { group, input, tagGroup } = build({ multiple: true });
    mount(group);
    setFiles(input, ['a.png', 'b.pdf']);
    input.dispatchEvent(new Event('change'));

    const tags = tagGroup.querySelectorAll('[data-file]');
    expect(tags.length).toBe(2);
    expect(tags[0].textContent).toBe('a.png');
    expect(tags[1].textContent).toBe('b.pdf');
    expect(tagGroup.querySelector('[data-slot="file-input-placeholder"]')).toBeNull();
  });

  it('restores the placeholder when the selection is cleared', () => {
    const { group, input, tagGroup } = build();
    mount(group);
    setFiles(input, ['a.png']);
    input.dispatchEvent(new Event('change'));
    expect(tagGroup.querySelectorAll('[data-file]').length).toBe(1);

    setFiles(input, []);
    input.dispatchEvent(new Event('change'));
    expect(tagGroup.querySelectorAll('[data-file]').length).toBe(0);
    expect(tagGroup.querySelector('[data-slot="file-input-placeholder"]')).toBeTruthy();
  });

  it('destroys rendered tags before re-rendering and on cleanup', () => {
    const { group, input } = build({ multiple: true });
    const { ctx, alpine } = mount(group);
    setFiles(input, ['a.png', 'b.pdf']);
    input.dispatchEvent(new Event('change'));
    // re-render replaces the two tags
    setFiles(input, ['c.txt']);
    input.dispatchEvent(new Event('change'));
    expect(alpine.destroyTree).toHaveBeenCalled();
    expect(ctx.cleanup).toHaveBeenCalled();
  });
});
