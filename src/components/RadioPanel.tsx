"use client";

import { useState } from "react";
import {
  playRadioSting,
  playCrier,
  playStatic,
  radioLabel,
  setMuted,
  isMuted,
  type RadioChannelId,
} from "@/lib/audio";

const CHANNELS: RadioChannelId[] = ["esnaf", "kral", "yurt"];

const TRACK_FAKE: Record<RadioChannelId, string[]> = {
  esnaf: ["Şiki Şiki Kaptan", "AŞTİ Realtime", "Kostak Muavin"],
  kral: ["Taht Kurmuşsun Koltuğuma", "Rötar Blues", "Gece Seferi"],
  yurt: ["Havasına Suyuna", "Neslin Baban", "Sulh ve Selamet Seferi"],
};

export function RadioPanel({ compact = false }: { compact?: boolean }) {
  const [ch, setCh] = useState<RadioChannelId>("esnaf");
  const [on, setOn] = useState(false);
  const [mute, setMute] = useState(isMuted());
  const [track, setTrack] = useState(TRACK_FAKE.esnaf[0]!);

  const power = () => {
    if (!on) {
      playStatic(150);
      playRadioSting(ch);
      setOn(true);
      const list = TRACK_FAKE[ch];
      setTrack(list[Math.floor(Math.random() * list.length)]!);
    } else {
      setOn(false);
    }
  };

  const switchCh = (id: RadioChannelId) => {
    setCh(id);
    if (on) {
      playStatic(100);
      playRadioSting(id);
      const list = TRACK_FAKE[id];
      setTrack(list[Math.floor(Math.random() * list.length)]!);
    }
  };

  const crier = () => {
    playCrier();
    playStatic(80);
  };

  return (
    <div
      className={`rounded-xl border border-zinc-700 bg-zinc-950 ${
        compact ? "p-2" : "p-3"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] tracking-widest text-amber-600 font-bold">
          RADYO
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
              setMute(m);
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

      {on && (
        <div className="mt-2 text-[10px] text-zinc-400 font-mono truncate">
          ♪ {track}
        </div>
      )}

      <button
        type="button"
        onClick={crier}
        className="mt-2 w-full text-[10px] py-1.5 rounded-lg border border-amber-900/50 text-amber-500/90 hover:bg-amber-950/30"
      >
        Çığırtkan düdüğü
      </button>
    </div>
  );
}