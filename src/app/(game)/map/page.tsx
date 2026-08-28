"use client";

import Link from "next/link";
import { useGameStore, CITIES } from "@/store/gameStore";
import { MapPin, Star } from "lucide-react";

export default function MapPage() {
  const homeCityId = useGameStore((s) => s.homeCityId);
  const terminalName = useGameStore((s) => s.terminalName);
  const setupDone = useGameStore((s) => s.setupDone);
  const expeditions = useGameStore((s) => s.expeditions);

  const active = expeditions.filter((e) => e.status === "departed");

  if (!setupDone) {
    return (
      <div className="p-8 text-center">
        <Link href="/setup" className="text-amber-400 underline">
          Önce terminal kur
        </Link>
      </div>
    );
  }

  const home = CITIES.find((c) => c.id === homeCityId);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
        <MapPin className="w-6 h-6 text-amber-400" />
        Harita merkezi
      </h1>
      <p className="text-zinc-500 text-sm mb-4">
        ★ {terminalName} · Canlı sefer takibi
      </p>

      <div className="relative w-full aspect-[4/3] bg-[#1a2332] border-2 border-zinc-700 rounded-xl overflow-hidden mb-6">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 25% 35%, #2d4a3e, transparent 50%)",
          }}
        />
        {CITIES.map((c) => {
          const isHome = c.id === homeCityId;
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              {isHome ? (
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              ) : (
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
              )}
              <span
                className={`text-[9px] mt-0.5 ${
                  isHome ? "text-amber-300 font-bold" : "text-zinc-500"
                }`}
              >
                {c.name}
              </span>
            </div>
          );
        })}

        {/* Aktif otobüs noktası (basit: home → hedef interpolate) */}
        {active.map((exp) => {
          const destName = exp.destination.split(" ")[0];
          const dest =
            CITIES.find((c) =>
              c.name.toLowerCase().includes(destName.toLowerCase().slice(0, 4))
            ) || CITIES[2];
          const p = exp.progress || 0;
          const x = (home?.x ?? 12) + ((dest.x - (home?.x ?? 12)) * p);
          const y = (home?.y ?? 22) + ((dest.y - (home?.y ?? 22)) * p);
          return (
            <div
              key={exp.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={exp.log?.slice(-1)[0]}
            >
              <div className="w-3 h-3 bg-amber-400 rounded-sm rotate-45 shadow animate-pulse" />
            </div>
          );
        })}
      </div>

      <div className="space-y-2 mb-6">
        <h2 className="text-sm font-semibold text-zinc-400">Canlı log</h2>
        {active.length === 0 && (
          <p className="text-xs text-zinc-600">Yolda sefer yok.</p>
        )}
        {active.map((exp) => (
          <div
            key={exp.id}
            className="text-xs bg-zinc-900 border border-zinc-800 rounded-lg p-3"
          >
            <div className="text-amber-400/90">
              {exp.origin} → {exp.destination} · %
              {Math.round((exp.progress || 0) * 100)}
            </div>
            <div className="text-zinc-500 mt-1">
              {(exp.log || []).slice(-2).join(" · ")}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/expeditions"
        className="inline-block px-5 py-2.5 bg-amber-500 text-black font-semibold rounded-xl text-sm"
      >
        Sefer planla
      </Link>
    </div>
  );
}