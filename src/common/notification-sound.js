// Lazily created and shared for the page's lifetime. Browsers cap the number
// of AudioContexts, and a fire-and-forget chime has nothing to clean up.
let audioContext = null;

function getAudioContext() {
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') return null;
  if (!audioContext) audioContext = new window.AudioContext();
  return audioContext;
}

function scheduleChime(ctx) {
  const now = ctx.currentTime;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
  gain.connect(ctx.destination);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(1318.5, now + 0.08);
  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
  osc.connect(gain);
  osc.start(now);
  osc.stop(now + 0.4);
}

// `sound` is `true` for the built-in chime or a non-empty audio file URL.
export function playNotificationSound(sound) {
  if (typeof sound === 'string') {
    if (typeof window === 'undefined' || typeof window.Audio === 'undefined') return;
    // play() rejects under autoplay policies; the notification itself still shows.
    new window.Audio(sound).play().catch(() => {});
    return;
  }
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state !== 'running') {
    // Autoplay policy: the context unlocks on a later user gesture. Playing a
    // chime late would be out of context, so it is dropped rather than queued.
    ctx.resume().catch(() => {});
    return;
  }
  scheduleChime(ctx);
}
