
const createOscillator = (ctx: AudioContext, frequency: number, type: OscillatorType = 'sine') => {
  const oscillator = ctx.createOscillator();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  return oscillator;
};

const createGain = (ctx: AudioContext, startValue: number, endValue: number, startTime: number, duration: number) => {
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(startValue, startTime);
  gainNode.gain.exponentialRampToValueAtTime(endValue, startTime + duration);
  return gainNode;
};

export const playWinSound = (ctx: AudioContext) => {
  const now = ctx.currentTime;
  const gainNode = createGain(ctx, 0.2, 0.001, now, 0.4);
  gainNode.connect(ctx.destination);

  const osc1 = createOscillator(ctx, 523.25); // C5
  osc1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + 0.1);

  const osc2 = createOscillator(ctx, 783.99); // G5
  osc2.connect(gainNode);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.3);
};

export const playLoseSound = (ctx: AudioContext) => {
  const now = ctx.currentTime;
  const gainNode = createGain(ctx, 0.2, 0.001, now, 0.4);
  gainNode.connect(ctx.destination);

  const osc1 = createOscillator(ctx, 392.00, 'sawtooth'); // G4
  osc1.connect(gainNode);
  osc1.start(now);
  osc1.stop(now + 0.1);

  const osc2 = createOscillator(ctx, 261.63, 'sawtooth'); // C4
  osc2.connect(gainNode);
  osc2.start(now + 0.1);
  osc2.stop(now + 0.3);
};

export const playFlipSound = (ctx: AudioContext) => {
  const now = ctx.currentTime;
  const duration = 0.5;

  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(100, now);
  bandpass.frequency.linearRampToValueAtTime(2000, now + duration * 0.8);
  bandpass.Q.value = 1;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0.3, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration);
};

export const playClickSound = (ctx: AudioContext) => {
    const now = ctx.currentTime;
    const duration = 0.1;
    const gainNode = createGain(ctx, 0.3, 0.001, now, duration);
    gainNode.connect(ctx.destination);
    
    const osc = createOscillator(ctx, 880, 'triangle'); // A5
    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration);
};

export const playDiceSound = (ctx: AudioContext) => {
    const now = ctx.currentTime;
    const duration = 0.2;
    for (let i = 0; i < 4; i++) {
        const gainNode = createGain(ctx, 0.2, 0.001, now + i * 0.04, duration);
        gainNode.connect(ctx.destination);
        const osc = createOscillator(ctx, 200 + Math.random() * 200, 'square');
        osc.connect(gainNode);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + duration);
    }
};

export const playCardSound = (ctx: AudioContext) => {
    const now = ctx.currentTime;
    const duration = 0.15;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(4000, now);
    lowpass.frequency.linearRampToValueAtTime(100, now + duration);

    const gainNode = createGain(ctx, 0.3, 0.001, now, duration);

    noise.connect(lowpass);
    lowpass.connect(gainNode);
    gainNode.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + duration);
};
