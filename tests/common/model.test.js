import { describe, expect, it, vi } from 'vitest';
import { findModelAttribute, rejectModelEventModifiers } from '../../src/common/model.js';
import { createMockAlpine } from '../test-utils.js';

const alpine = createMockAlpine();

function build(attrs = {}) {
  const el = document.createElement('div');
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

describe('findModelAttribute', () => {
  it('finds a plain x-model', () => {
    const attr = findModelAttribute(alpine, build({ 'x-model': 'value' }));
    expect(attr.name).toBe('x-model');
    expect(attr.value).toBe('value');
  });

  it('finds x-model behind its modifiers', () => {
    const attr = findModelAttribute(alpine, build({ 'x-model.lazy.number': 'value' }));
    expect(attr.name).toBe('x-model.lazy.number');
    expect(attr.value).toBe('value');
  });

  it('returns undefined without an x-model', () => {
    expect(findModelAttribute(alpine, build())).toBeUndefined();
  });

  it('does not mistake a longer directive for x-model', () => {
    expect(findModelAttribute(alpine, build({ 'x-modelable': 'prop' }))).toBeUndefined();
  });
});

describe('rejectModelEventModifiers', () => {
  it.each(['lazy', 'change', 'blur', 'enter'])('logs an error for x-model.%s', (modifier) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const el = build({ [`x-model.${modifier}`]: 'value' });
    rejectModelEventModifiers(alpine, el, 'x-h-rating');
    expect(error).toHaveBeenCalledWith(`x-h-rating: x-model.${modifier} is not supported, the model always updates immediately`, el);
    error.mockRestore();
  });

  it('stays silent for a plain x-model and non-event modifiers', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    rejectModelEventModifiers(alpine, build({ 'x-model': 'value' }), 'x-h-rating');
    rejectModelEventModifiers(alpine, build({ 'x-model.number.debounce.500ms': 'value' }), 'x-h-rating');
    rejectModelEventModifiers(alpine, build(), 'x-h-rating');
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});
