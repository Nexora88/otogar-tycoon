"use client";

import Link from "next/link";
import { useGameStore, CITIES } from "@/store/gameStore";
import { MapPin, Star } from "lucide-react";

export default function MapPage() {
  const homeCityId = useGameStore((s) => s.homeCityId);
  const terminalName = useGameStore((s) => s.terminalName);
  const setupDone = useGameStore((s) => s.setupDone);

  if (!setupDone) {
    return (
      <div className="p-8 text-center">
        <p className="text-zinc-400 mb-4">Önce terminal kur.</p>
        <Link href="/setup" className="text-amber-400 underline">
          Kuruluma git
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
        <MapPin className="w-6 h-6 text-amber-400" />
        Türkiye — Hat Haritası
      </h1>
      <p className="text-zinc-500 text-sm mb-6">
        Yıldız = senin ofisin ({terminalName || "—"})
      </p>

      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-[#1a2332] border-2 border-zinc-700 rounded-xl overflow-hidden">
        {/* Basit bölge zemini */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, #2d4a3e 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, #3d3a2a 0%, transparent 45%)",
          }}
        />
        <div className="absolute inset-4 border border-dashed border-zinc-600/40 rounded-lg" />

        {CITIES.map((c) => {
          const isHome = c.id === homeCityId;
          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              {isHome ? (
                <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-zinc-500 border border-zinc-300" />
              )}
              <span
                className={`text-[10px] mt-0.5 whitespace-nowrap ${
                  isHome ? "text-amber-300 font-bold" : "text-zinc-400"
                }`}
              >
                {c.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/expeditions"
          className="px-5 py-2.5 bg-amber-500 text-black font-semibold rounded-xl text-sm"
        >
          Sefer planla
        </Link>
        <Link
          href="/staff"
          className="px-5 py-2.5 border border-zinc-600 rounded-xl text-sm text-zinc-300"
        >
          Kadro / şoför
        </Link>
      </div>
    </div>
  );
}