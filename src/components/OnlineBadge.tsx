"use client";

import { useEffect, useState } from "react";

export default function OnlineBadge() {
  const [count, setCount] = useState<number | null>(null);
  const [mode, setMode] = useState<"live" | "local">("local");

  useEffect(() => {
    setMode("local");
    setCount(1);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/60 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      {count === null ? (
        <span>Bağlanıyor…</span>
      ) : (
        <span>
          {count} çevrimiçi
          {mode === "local" ? " (yerel)" : ""}
        </span>
      )}
    </div>
  );
}