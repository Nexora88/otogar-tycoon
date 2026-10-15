"use client";

import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";

export default function ExpeditionLiveList({
  onOpenForm,
}: {
  onOpenForm: () => void;
}) {
  const expeditions = useGameStore((s) => s.expeditions);
  const buses = useGameStore((s) => s.buses);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const live = useMemo(
    () =>
      expeditions.filter(
        (e) => e.status === "filling" || e.status === "departed"
      ),
    [expeditions]
  );
  const done = useMemo(
    () => expeditions.filter((e) => e.status === "completed").slice(0, 8),
    [expeditions]
  );

  return (
    <>
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-3">
          <div className="text-[10px] text-cyan-600">Dolumda</div>
          <div className="text-xl font-black text-cyan-200">
            {live.filter((e) => e.status === "filling").length}
          </div>
        </div>
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-3">
          <div className="text-[10px] text-amber-600">Yolda</div>
          <div className="text-xl font-black text-amber-200">
            {live.filter((e) => e.status === "departed").length}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
          <div className="text-[10px] text-zinc-600">Filo</div>
          <div className="text-xl font-black text-zinc-200">{buses.length}</div>
        </div>
      </div>

      <h2 className="mb-3 text-[10px] font-bold tracking-[0.2em] text-amber-600">
        CANLI
      </h2>
      <div className="space-y-3">
        {live.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-8 text-center">
            <p className="text-sm text-zinc-500">Aktif sefer yok</p>
            <button
              type="button"
              onClick={onOpenForm}
              className="mt-3 text-sm font-medium text-amber-400 hover:underline"
            >
              İlk seferi aç →
            </button>
          </div>
        )}
        {live.map((exp) => {
          const fillPct = Math.min(
            100,
            (exp.soldTickets / Math.max(1, exp.maxSeats)) * 100
          );
          const secsLeft = Math.max(
            0,
            Math.ceil((exp.departureTime - now) / 1000)
          );
          const roadPct = Math.round((exp.progress || 0) * 100);
          const lastLog =
            (exp.log && exp.log[exp.log.length - 1]) ||
            (exp.status === "filling" ? "Bilet kesiliyor…" : "Yolda…");

          return (
            <article
              key={exp.id}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 shadow-lg"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-bold text-stone-100">
                    {exp.origin} → {exp.destination}
                  </div>
                  <div className="mt-0.5 text-[11px] text-zinc-500">
                    {exp.ticketPrice} ₺
                  </div>
                </div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wide ${
                    exp.status === "filling"
                      ? "border-cyan-700/50 bg-cyan-950/40 text-cyan-300"
                      : "border-amber-700/50 bg-amber-950/40 text-amber-300"
                  }`}
                >
                  {exp.status === "filling" ? "DOLUM" : "YOLDA"}
                </span>
              </div>
              <div className="px-4 py-4">
                {exp.status === "filling" ? (
                  <>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-cyan-400/90">
                        Kalkışa {secsLeft}s
                      </span>
                      <span className="font-mono text-zinc-300">
                        {exp.soldTickets}/{exp.maxSeats} koltuk
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500"
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500">{lastLog}</p>
                  </>
                ) : (
                  <>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-amber-400/90">Yol ilerlemesi</span>
                      <span className="font-mono text-zinc-300">%{roadPct}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400 transition-all duration-700"
                        style={{ width: `${roadPct}%` }}
                      />
                    </div>
                    <p className="mt-2 text-[11px] text-zinc-500">{lastLog}</p>
                    <div className="mt-2 text-[11px] text-zinc-600">
                      {exp.soldTickets} yolcu · {exp.ticketPrice} ₺
                    </div>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {done.length > 0 && (
        <>
          <h2 className="mb-3 mt-8 text-[10px] font-bold tracking-[0.2em] text-zinc-600">
            TAMAMLANAN
          </h2>
          <div className="space-y-2">
            {done.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/60 px-4 py-3 text-sm"
              >
                <span className="text-zinc-400">
                  {exp.origin} → {exp.destination}
                </span>
                <span className="text-xs text-zinc-600">
                  {exp.soldTickets}/{exp.maxSeats} · {exp.ticketPrice} ₺
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
