"use client";

import { useEffect, useRef, useState } from "react";
import {
  playRadioSting,
  playCrier,
  playStatic,
  playHorn,
  radioLabel,
  setMuted,
  isMuted,
  type RadioChannelId,
} from "@/lib/audio";

const CHANNELS: RadioChannelId[] = ["esnaf", "kral", "yurt"];

const TRACKS: Record<RadioChannelId, string[]> = {
  esnaf: ["Şiki Şiki Kaptan", "AŞTİ Realtime", "Kostak Muavin", "Çilli Travego"],
  kral: ["Taht Kurmuşsun Koltuğuma", "Rötar Blues", "Gece Seferi", "Damar Hat"],
  yurt: ["Havasına Suyuna", "Neslin Baban", "Sulh Seferi", "Ufuktaki Anıtkabir"],
};

/** Kendi marka reklamları — telif yok, metin + sting */
const ADS = [
  "Reklam: Bakraç Ticaret — geleceğin bilgisayarlı sistemleri, peronun aklı.",
  "Reklam: Nexora Elektronik 1987 — yerli malı, herkes onu kullanmalı.",
  "Reklam: Otogar Tycoon — yolcuların ve kaptanların hakiki dostu.",
  "Reklam: Ahmet Bankacılık — esnaf kredisi, net faiz, net racon.",
  "Reklam: Yurtta sulh, cihanda sulh — yolda da selamet.",
];

export function RadioPanel({ compact = false }: { compact?: boolean }) {
  const [ch, setCh] = useState<RadioChannelId>("esnaf");
  const [on, setOn] = useState(false);
  const [mute, setMuteLocal] = useState(isMuted());
  const [line, setLine] = useState("Kapalı");
  const [isAd, setIsAd] = useState(false);
  const tick = useRef(0);

  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => {
      tick.current += 1;
      // Her 3. dilimde reklam
      if (tick.current % 3 === 0) {
        setIsAd(true);
        const ad = ADS[Math.floor(Math.random() * ADS.length)]!;
        setLine(ad);
        playStatic(100);
        playRadioSting("yurt");
      } else {
        setIsAd(false);
        const list = TRACKS[ch];
        setLine("♪ " + list[Math.floor(Math.random() * list.length)]!);
        playRadioSting(ch);
      }
    }, 22000);
    return () => clearInterval(id);
  }, [on, ch]);

  const power = () => {
    if (!on) {
      playStatic(120);
      playRadioSting(ch);
      setOn(true);
      setIsAd(false);
      setLine("♪ " + TRACKS[ch][0]!);
    } else {
      setOn(false);
      setLine("Kapalı");
    }
  };

  const switchCh = (id: RadioChannelId) => {
    setCh(id);
    if (on) {
      playStatic(80);
      playRadioSting(id);
      setIsAd(false);
      setLine("♪ " + TRACKS[id][0]!);
    }
  };

  return (
    <div
      className={`rounded-xl border border-zinc-700 bg-zinc-950 ${
        compact ? "p-2" : "p-3"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] tracking-widest text-amber-600 font-bold">
          RADYO 87.5
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={power}
            className={`text-[10px] px-2 py-0.5 rounded ${
              on ? "bg-emerald-600 text-black" : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {on ? "AÇIK" : "KAPALI"}
          </button>
          <button
            type="button"
            onClick={() => {
              const m = !mute;
              setMuteLocal(m);
              setMuted(m);
            }}
            className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400"
          >
            {mute ? "Sessiz" : "Ses"}
          </button>
        </div>
      </div>

      <div className="flex gap-1 mt-2">
        {CHANNELS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => switchCh(id)}
            className={`flex-1 text-[9px] py-1 rounded border ${
              ch === id
                ? "border-amber-600 text-amber-300 bg-amber-950/40"
                : "border-zinc-800 text-zinc-500"
            }`}
          >
            {radioLabel(id)}
          </button>
        ))}
      </div>

      <div
        className={`mt-2 text-[10px] font-mono leading-snug line-clamp-2 ${
          isAd ? "text-amber-400/90" : "text-zinc-400"
        }`}
      >
        {line}
      </div>

      <div className="flex gap-1 mt-2">
        <button
          type="button"
          onClick={() => {
            playCrier();
            playStatic(60);
          }}
          className="flex-1 text-[10px] py-1 rounded-lg border border-amber-900/50 text-amber-500/90"
        >
          Çığırtkan
        </button>
        <button
          type="button"
          onClick={() => playHorn()}
          className="flex-1 text-[10px] py-1 rounded-lg border border-zinc-700 text-zinc-400"
        >
          Korna
        </button>
      </div>
    </div>
  );
}