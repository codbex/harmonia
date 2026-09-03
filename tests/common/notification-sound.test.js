import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function createAudioContextStub(state = 'running') {
  const osc = {
    type: '',
    frequency: { setValueAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
  };
  const gain = {
    gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
  const instances = [];
  class AudioContextStub {
    constructor() {
      this.state = state;
      this.currentTime = 0;
      this.destination = {};
      this.resume = vi.fn().mockResolvedValue();
      instances.push(this);
    }
    createOscillator() {
      return osc;
    }
    createGain() {
      return gain;
    }
  }
  window.AudioContext = AudioContextStub;
  return { osc, gain, instances };
}

async function importHelper() {
  const { playNotificationSound } = await import('../../src/common/notification-sound.js');
  return playNotificationSound;
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  delete window.AudioContext;
  delete window.Audio;
});

describe('playNotificationSound', () => {
  it('plays the built-in chime through the Web Audio API', async () => {
    const { osc, gain, instances } = createAudioContextStub();
    const playNotificationSound = await importHelper();
    playNotificationSound(true);
    expect(instances.length).toBe(1);
    expect(osc.frequency.setValueAtTime).toHaveBeenNthCalledWith(1, 880, 0);
    expect(osc.frequency.setValueAtTime).toHaveBeenNthCalledWith(2, 1318.5, 0.08);
    expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0.0001, 0);
    expect(gain.gain.exponentialRampToValueAtTime).toHaveBeenCalledTimes(2);
    expect(gain.connect).toHaveBeenCalledWith(instances[0].destination);
    expect(osc.connect).toHaveBeenCalledWith(gain);
    expect(osc.start).toHaveBeenCalledWith(0);
    expect(osc.stop).toHaveBeenCalledWith(0.4);
  });

  it('drops the chime and resumes the context when it is suspended', async () => {
    const { osc, instances } = createAudioContextStub('suspended');
    const playNotificationSound = await importHelper();
    playNotificationSound(true);
    expect(instances[0].resume).toHaveBeenCalledTimes(1);
    expect(osc.start).not.toHaveBeenCalled();
  });

  it('does nothing when the Web Audio API is missing', async () => {
    const playNotificationSound = await importHelper();
    expect(() => playNotificationSound(true)).not.toThrow();
  });

  it('reuses a single AudioContext across chimes', async () => {
    const { instances } = createAudioContextStub();
    const playNotificationSound = await importHelper();
    playNotificationSound(true);
    playNotificationSound(true);
    expect(instances.length).toBe(1);
  });

  it('plays a URL through an Audio element without touching the Web Audio API', async () => {
    const { instances } = createAudioContextStub();
    const play = vi.fn().mockResolvedValue();
    const urls = [];
    window.Audio = class {
      constructor(url) {
        urls.push(url);
        this.play = play;
      }
    };
    const playNotificationSound = await importHelper();
    playNotificationSound('/audio/chime.wav');
    expect(urls).toEqual(['/audio/chime.wav']);
    expect(play).toHaveBeenCalledTimes(1);
    expect(instances.length).toBe(0);
  });

  it('ignores an autoplay rejection from Audio.play()', async () => {
    window.Audio = class {
      constructor() {
        this.play = () => Promise.reject(new Error('NotAllowedError'));
      }
    };
    const playNotificationSound = await importHelper();
    playNotificationSound('/audio/chime.wav');
    // An unhandled rejection would fail the test run; waiting a tick surfaces it.
    await new Promise((resolve) => setTimeout(resolve));
  });
});
