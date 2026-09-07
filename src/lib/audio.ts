/** Hafif ses motoru — Web Audio. Büyük mp3 şart değil; isteğe public/audio/*.mp3 eklenebilir. */

let ctx: AudioContext | null = null;
let muted = false;
let master = 0.35;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new Ctx();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function setMuted(v: boolean) {
  muted = v;
}

export function isMuted() {
  return muted;
}

export function setMasterVolume(v: number) {
  master = Math.max(0, Math.min(1, v));
}

function beep(
  freq: number,
  dur: number,
  type: OscillatorType = "square",
  vol = 0.15,
  slide = 0
) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.linearRampToValueAtTime(freq + slide, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol * master, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

/** Nostaljik otobüs kornası: tııııt-tıt */
export function playHorn() {
  if (muted) return;
  beep(180, 0.35, "sawtooth", 0.2, -40);
  setTimeout(() => beep(220, 0.12, "sawtooth", 0.18), 380);
  setTimeout(() => beep(160, 0.2, "sawtooth", 0.12), 520);
}

/** Selektör flaş tık */
export function playClick() {
  beep(800, 0.04, "square", 0.08);
}

/** Telsiz cızırtı */
export function playStatic(ms = 180) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime;
  const bufferSize = 2 * c.sampleRate * (ms / 1000);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
  const src = c.createBufferSource();
  const g = c.createGain();
  src.buffer = buffer;
  g.gain.setValueAtTime(0.12 * master, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + ms / 1000);
  src.connect(g);
  g.connect(c.destination);
  src.start(t0);
}

/** Çığırtkan kısa düdük */
export function playCrier() {
  beep(520, 0.08, "square", 0.12);
  setTimeout(() => beep(680, 0.1, "square", 0.1), 90);
  setTimeout(() => beep(440, 0.15, "square", 0.08), 200);
}

/** Para / başarı */
export function playCoin() {
  beep(880, 0.06, "sine", 0.1);
  setTimeout(() => beep(1175, 0.08, "sine", 0.08), 70);
}

/** Uyarı / ceza */
export function playWarn() {
  beep(140, 0.25, "triangle", 0.15, -20);
}

/** Opsiyonel gerçek dosya (public/audio/xxx.mp3) — yoksa sessiz geçer */
export function playFile(path: string, volume = 0.4) {
  if (muted || typeof window === "undefined") return;
  try {
    const a = new Audio(path);
    a.volume = volume * master;
    void a.play().catch(() => {});
  } catch {
    /* ignore */
  }
}

export type RadioChannelId = "esnaf" | "kral" | "yurt";

const RADIO_LABEL: Record<RadioChannelId, string> = {
  esnaf: "Esnaf FM",
  kral: "Kral FM",
  yurt: "Yurt FM",
};

export function radioLabel(id: RadioChannelId) {
  return RADIO_LABEL[id];
}

/** Kanal “müzik” hissi — kısa arpej (lisans sorunu yok) */
export function playRadioSting(channel: RadioChannelId) {
  if (muted) return;
  playStatic(120);
  const base =
    channel === "esnaf" ? 220 : channel === "kral" ? 165 : 196;
  const notes =
    channel === "esnaf"
      ? [0, 4, 7, 12]
      : channel === "kral"
        ? [0, 3, 7, 10]
        : [0, 5, 7, 12];
  notes.forEach((n, i) => {
    setTimeout(
      () => beep(base * Math.pow(2, n / 12), 0.18, "triangle", 0.07),
      130 + i * 160
    );
  });
}