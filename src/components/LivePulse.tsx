"use client";

import { useEffect, useState } from "react";
import {
  subscribeGlobalPresence,
  estimateSeferCount,
  estimatePeronSavasi,
} from "@/lib/globalPresence";

export function LivePulse() {
  const [online, setOnline] = useState(1);
  const [live, setLive] = useState(false);
  const [sefer, setSefer] = useState(48);
  const [peron, setPeron] = useState(3);

  useEffect(() => {
    let unsub = () => {};
    void (async () => {
      unsub = await subscribeGlobalPresence("landing", (p) => {
        setOnline(p.online);
        setLive(p.live);
        setSefer(estimateSeferCount(p.online));
        setPeron(estimatePeronSavasi(p.online));
      });
    })();
    const id = setInterval(() => {
      setSefer(estimateSeferCount(online));
      setPeron(estimatePeronSavasi(online));
    }, 5000);
    return () => {
      unsub();
      clearInterval(id);
    };
  }, [online]);

  return (
    <div className="flex flex-wrap gap-2 text-[11px]">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-800/50 bg-emerald-950/30 px-3 py-1 text-emerald-300">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        {online} çevrimiçi{live ? "" : " (yerel)"}
      </span>
      <span className="rounded-full border border-cyan-900/50 bg-cyan-950/20 px-3 py-1 text-cyan-300/90">
        Aktif peron savaşı: {peron}
      </span>
      <span className="rounded-full border border-amber-900/40 bg-amber-950/20 px-3 py-1 text-amber-200/80">
        Canlı sefer nabzı: {sefer}
      </span>
    </div>
  );
}