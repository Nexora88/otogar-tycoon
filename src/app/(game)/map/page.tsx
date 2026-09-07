"use client";

import Link from "next/link";
import { useGameStore, CITIES } from "@/store/gameStore";
import { MapPin, Star, Bus } from "lucide-react";

export default function MapPage() {
  const homeCityId = useGameStore((s) => s.homeCityId);
  const terminalName = useGameStore((s) => s.terminalName);
  const setupDone = useGameStore((s) => s.setupDone);
  const expeditions = useGameStore((s) => s.expeditions);
  const companyName = useGameStore((s) => s.companyName);
  const reputation = useGameStore((s) => s.reputation);

  const active = expeditions.filter(
    (e) => e.status === "departed" || e.status === "filling"
  );

  if (!setupDone) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-500 text-sm mb-3">Terminal kurulmadan harita kilitli.</p>
        <Link href="/shift" className="text-amber-400 underline mr-3">
          Vardiya
        </Link>
        <Link href="/setup" className="text-cyan-400 underline">
          Kurulum
        </Link>
      </div>
    );
  }

  const home = CITIES.find((c) => c.id === homeCityId);
  const rank =
    reputation >= 85
      ? "Baş Ağa"
      : reputation >= 70
        ? "Peron Ağası"
        : reputation >= 50
          ? "Esnaf"
          : reputation >= 30
            ? "Çırak"
            : "Yeni Gelen";

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            1987 Türkiye Haritası
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            ★ {terminalName || "Terminal"} · {companyName} ·{" "}
            <span className="text-amber-400/90">{rank}</span>
          </p>
        </div>
        <Link
          href="/expeditions"
          className="px-4 py-2 bg-amber-500 text-black font-semibold rounded-xl text-sm self-start"
        >
          Sefer planla
        </Link>
      </div>

      <div className="relative w-full aspect-[5/3] rounded-2xl overflow-hidden border-2 border-zinc-700 mb-6 shadow-2xl">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg,#0f1a14 0%,#1a2a22 40%,#152030 100%)",
          }}
        />
        <div
          className="absolute left-0 top-[18%] w-[22%] h-[40%] opacity-30 rounded-full blur-2xl"
          style={{ background: "#1e4a6e" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
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
                <div className="relative">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 drop-shadow" />
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] bg-amber-500 text-black px-1 rounded whitespace-nowrap font-bold">
                    MERKEZ
                  </span>
                </div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-cyan-700/80 ring-1 ring-cyan-500/40" />
              )}
              <span
                className={`text-[8px] sm:text-[9px] mt-0.5 whitespace-nowrap ${
                  isHome ? "text-amber-300 font-bold" : "text-zinc-400"
                }`}
              >
                {c.name}
              </span>
            </div>
          );
        })}

        {active.map((exp) => {
          const destToken = exp.destination.split(" ")[0];
          const dest =
            CITIES.find((c) =>
              c.name.toLowerCase().includes(destToken.toLowerCase().slice(0, 3))
            ) || CITIES[2];
          const p =
            exp.status === "filling" ? 0.02 : Math.min(0.98, exp.progress || 0);
          const x0 = home?.x ?? 18;
          const y0 = home?.y ?? 26;
          const x = x0 + (dest.x - x0) * p;
          const y = y0 + (dest.y - y0) * p;
          return (
            <div
              key={exp.id}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              title={`${exp.origin} → ${exp.destination}`}
            >
              <Bus className="w-4 h-4 text-amber-300 drop-shadow animate-pulse" />
            </div>
          );
        })}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h2 className="text-xs font-semibold text-zinc-400 mb-2">CANLI SEFERLER</h2>
          {active.length === 0 && (
            <p className="text-xs text-zinc-600">Yolda / peronda sefer yok.</p>
          )}
          {active.map((exp) => (
            <div key={exp.id} className="text-xs border-b border-zinc-800 py-2 last:border-0">
              <div className="text-amber-400/90">
                {exp.origin} → {exp.destination}
              </div>
              <div className="text-zinc-500">
                {exp.status === "filling"
                  ? `Bilet: ${exp.soldTickets}/${exp.maxSeats}`
                  : `%${Math.round((exp.progress || 0) * 100)}`}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h2 className="text-xs font-semibold text-zinc-400 mb-2">RÜTBE</h2>
          <p className="text-2xl font-bold text-amber-400">{rank}</p>
          <p className="text-xs text-zinc-500 mt-1">İtibar {reputation}/100</p>
          <Link href="/lobby" className="inline-block mt-3 text-xs text-cyan-400 underline">
            Lobi / oda
          </Link>
        </div>
      </div>
    </div>
  );
}