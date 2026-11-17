let soundEnabled = true;

export function setSoundEnabled(value: boolean) {
  soundEnabled = value;
}

export function isSpeechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

function pickEnglishVoice(): SpeechSynthesisVoice | null {
  if (!isSpeechSupported()) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === "en-US" && v.localService) ||
    voices.find((v) => v.lang.startsWith("en")) ||
    null
  );
}

/** Speak an English phrase. Returns false when speech synthesis is unavailable. */
export function speak(text: string, rate = 1): boolean {
  if (!soundEnabled || !text) return false;
  if (!isSpeechSupported()) {
    console.warn("Speech synthesis is not supported in this browser.");
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    const voice = pickEnglishVoice();
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}

export function speakSlow(text: string): boolean {
  return speak(text, 0.72);
}

function audioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    return new Ctor();
  } catch {
    return null;
  }
}

function tone(freq: number, duration: number, delay = 0) {
  if (!soundEnabled) return;
  const ctx = audioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + delay + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    ctx.currentTime + delay + duration,
  );
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration + 0.02);
  osc.onended = () => {
    void ctx.close();
  };
}

export function playSuccess() {
  tone(660, 0.14, 0);
  tone(880, 0.18, 0.12);
}

export function playError() {
  tone(220, 0.22, 0);
}

export function playPop() {
  tone(520, 0.09, 0);
}