"use client";

import { useEffect, useState } from "react";
import { randomTelsiz } from "@/data/telsizLines";

export function TelsizTicker() {
  const [line, setLine] = useState(() => randomTelsiz());
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLine(randomTelsiz());
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 28000 + Math.floor(Math.random() * 20000));
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`mx-3 mb-2 px-3 py-2 rounded-lg border text-[11px] leading-snug transition-colors ${
        flash
          ? "border-amber-600/60 bg-amber-950/40 text-amber-100"
          : "border-zinc-800 bg-zinc-950/80 text-zinc-400"
      }`}
    >
      <span className="text-amber-600 font-bold tracking-wider mr-2">
        TELSIZ
      </span>
      {line}
    </div>
  );
}