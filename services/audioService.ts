
// Audio Context Singleton to prevent multiple contexts
let audioCtx: AudioContext | null = null;

const getContext = (): AudioContext => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// Helper to check state and resume if suspended (browser policy)
const resumeContext = async () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx;
};

// SHORT BLIP (For navigation/interaction)
export const playTechClick = async () => {
  try {
    const ctx = await resumeContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Pure Sine for "clean" UI feel
    osc.type = 'sine';
    // Very short high frequency blip (2000Hz)
    osc.frequency.setValueAtTime(2000, ctx.currentTime);
    
    // Quick decay envelope
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {}
};

// POSITIVE SWITCH (For toggles/modes)
export const playSwitch = async () => {
  try {
    const ctx = await resumeContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sine wave, slightly lower pitch than click, distinct "on" sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note

    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {}
};

// SUCCESS CHIME
export const playSuccess = async () => {
  try {
    const ctx = await resumeContext();
    
    // Positive major triad, quick arpeggio (C6, E6, G6)
    const notes = [1046.50, 1318.51, 1567.98]; 
    notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = ctx.currentTime + (i * 0.04);

        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0.05, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.2);
    });
  } catch (e) {}
};

export const playPowerUp = async () => {
  try {
    const ctx = await resumeContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {}
};
