// Cyberpunk Web Audio Synthesizer & Soundtrack Controller for LOGIN 2K26

let audioCtx: AudioContext | null = null;
let isMuted = false;
let bgAudio: HTMLAudioElement | null = null;
let isMusicPlaying = false;

// Initialize Web Audio API on gesture
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const bgMusic = {
  isPlaying: () => isMusicPlaying,
  play: () => {
    if (typeof window === 'undefined') return;
    if (!bgAudio) {
      bgAudio = new Audio('/sound.mp3');
      bgAudio.loop = true;
      bgAudio.volume = 0.45;
    }
    bgAudio.play()
      .then(() => {
        isMusicPlaying = true;
      })
      .catch(() => {
        // Autoplay policy prevented playback until gesture
      });
  },
  pause: () => {
    if (bgAudio) {
      bgAudio.pause();
      isMusicPlaying = false;
    }
  },
  toggle: () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      return false;
    } else {
      bgMusic.play();
      return true;
    }
  },
  setVolume: (vol: number) => {
    if (bgAudio) {
      bgAudio.volume = Math.max(0, Math.min(1, vol));
    }
  }
};

export const soundFx = {
  isMuted: () => isMuted,
  setMuted: (muted: boolean) => {
    isMuted = muted;
    try {
      localStorage.setItem('login_sfx_muted', String(muted));
    } catch {
      // ignore
    }
  },
  toggleMute: () => {
    isMuted = !isMuted;
    try {
      localStorage.setItem('login_sfx_muted', String(isMuted));
    } catch {
      // ignore
    }
    if (isMuted) {
      bgMusic.pause();
    }
    return isMuted;
  },
  initMuteState: () => {
    try {
      const saved = localStorage.getItem('login_sfx_muted');
      if (saved !== null) {
        isMuted = saved === 'true';
      }
    } catch {
      // ignore
    }
  },

  // Subtle typewriter blip
  type: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // ignore audio errors
    }
  },

  // Interactive option click
  click: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  },

  // Alert / Signal ping
  ping: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // ignore
    }
  },

  // Glitch sound
  glitch: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const bufferSize = ctx.sampleRate * 0.06;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      
      noise.connect(gain);
      gain.connect(ctx.destination);
      
      noise.start();
    } catch {
      // ignore
    }
  },

  // Climax reveal dramatic sound
  reveal: () => {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.4);
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(440, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.6);
      osc2.stop(ctx.currentTime + 0.6);
    } catch {
      // ignore
    }
  }
};
