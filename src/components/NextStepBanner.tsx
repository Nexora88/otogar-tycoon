"use client";

import Link from "next/link";
import { useCareerStore } from "@/store/careerStore";
import { useGameStore } from "@/store/gameStore";

/** İlk 3 dakika: ne yapacağını net söyle */
export default function NextStepBanner() {
  const careerStarted = useCareerStore((s) => s.careerStarted);
  const careerDone = useCareerStore((s) => s.careerDone);
  const rank = useCareerStore((s) => s.rank);
  const activeTask = useCareerStore((s) => s.activeTask);
  const setupDone = useGameStore((s) => s.setupDone);
  const expeditions = useGameStore((s) => s.expeditions);
  const buses = useGameStore((s) => s.buses);

  const isBoss = careerDone || setupDone || rank === "bagimsiz";
  const filling = expeditions.some((e) => e.status === "filling");
  const onRoad = expeditions.some((e) => e.status === "departed");

  if (!isBoss && careerStarted) {
    return (
      <div className="rounded-2xl border border-amber-800/50 bg-gradient-to-r from-amber-950/60 to-zinc-950 p-4">
        <div className="text-[10px] font-black tracking-[0.25em] text-amber-500">
          ÇIRAK VARDİYASI
        </div>
        <p className="mt-1 text-sm font-semibold text-amber-50">
          {activeTask
            ? `${activeTask.speakerName}: ${activeTask.prompt.slice(0, 90)}`
            : "Bugün peronda iş var — Vardiya’ya geç."}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">
          Sefer henüz yok. Çay, tost, kasa, patron. Rütbe yükselsin, yazıhane senin olsun.
        </p>
        <Link
          href="/shift"
          className="mt-3 inline-flex rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black"
        >
          Vardiyaya git →
        </Link>
      </div>
    );
  }

  if (filling || onRoad) {
    return (
      <div className="rounded-2xl border border-cyan-800/50 bg-gradient-to-r from-cyan-950/50 to-zinc-950 p-4">
        <div className="text-[10px] font-black tracking-[0.25em] text-cyan-400">
          CANLI OPERASYON
        </div>
        <p className="mt-1 text-sm font-semibold text-cyan-50">
          {filling
            ? "Peronda dolum var — fiyatını izle."
            : "Otobüs yolda — varışı bekle."}
        </p>
        <Link
          href="/expeditions"
          className="mt-3 inline-flex rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-black"
        >
          Seferlere bak →
        </Link>
      </div>
    );
  }

  if (isBoss && buses.length === 0) {
    return (
      <div className="rounded-2xl border border-orange-800/50 bg-gradient-to-r from-orange-950/50 to-zinc-950 p-4">
        <div className="text-[10px] font-black tracking-[0.25em] text-orange-400">
          FİLO
        </div>
        <p className="mt-1 text-sm font-semibold">Garaj boş — ilk otobüsünü al.</p>
        <Link
          href="/market"
          className="mt-3 inline-flex rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-black"
        >
          Pazara git →
        </Link>
      </div>
    );
  }

  if (!isBoss) {
    return (
      <div className="rounded-2xl border border-zinc-700 bg-zinc-950 p-4">
        <div className="text-[10px] font-black tracking-[0.25em] text-zinc-500">
          BAŞLANGIÇ
        </div>
        <p className="mt-1 text-sm font-semibold">Önce vardiya, sonra yazıhane.</p>
        <Link
          href="/shift"
          className="mt-3 inline-flex rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black"
        >
          Vardiya →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-emerald-800/40 bg-gradient-to-r from-emerald-950/40 to-zinc-950 p-4">
      <div className="text-[10px] font-black tracking-[0.25em] text-emerald-400">
        SIRADAKİ HAMLE
      </div>
      <p className="mt-1 text-sm font-semibold text-emerald-50">
        Hat seç, bilet koy, peronu doldur.
      </p>
      <p className="mt-1 text-[11px] text-zinc-500">
        Pahalı bilet az yolcu · ucuz bilet çok yolcu. Rakip kırarsa Lobi’den görürsün.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href="/expeditions"
          className="inline-flex rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black"
        >
          Sefer aç →
        </Link>
        <Link
          href="/lobby"
          className="inline-flex rounded-xl border border-zinc-600 px-4 py-2 text-xs text-zinc-300"
        >
          Lobi
        </Link>
      </div>
    </div>
  );
}
