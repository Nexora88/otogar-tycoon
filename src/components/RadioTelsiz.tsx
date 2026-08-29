"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

export default function RadioTelsiz() {
  const line = useGameStore((s) => s.radioLine);
  const tickRadio = useGameStore((s) => s.tickRadio);
  const setRadioLine = useGameStore((s) => s.setRadioLine);

  useEffect(() => {
    tickRadio();
    const t = setInterval(() => tickRadio(), 28000);
    return () => clearInterval(t);
  }, [tickRadio]);

  if (!line) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:max-w-sm z-40">
      <div className="rounded-xl border border-amber-900/50 bg-zinc-950/95 shadow-xl p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] tracking-widest text-amber-500/90 font-bold">
            OTOGAR TELSİZİ
          </span>
          <button
            type="button"
            onClick={() => setRadioLine(null)}
            className="text-[10px] text-zinc-500"
          >
            kapat
          </button>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed font-mono">
          {line}
        </p>
      </div>
    </div>
  );
}
