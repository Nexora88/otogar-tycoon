"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import type { PricePulse } from "@/lib/roomChannel";

const RIVALS = [
  "Boncuk Turizm",
  "Keşan Seyahat",
  "Trakya Express",
  "AŞTİ Realtime",
  "Yolcu Dostu",
];
const ROUTES = [
  "İstanbul → Ankara",
  "Edirne → İstanbul",
  "İstanbul → İzmir",
  "Bursa → İstanbul",
  "Ankara → İzmir",
];

export default function LobbyPriceBoard({
  roomCode,
  firm,
  display,
  externalPrices,
}: {
  roomCode: string | null;
  firm: string;
  display: string;
  externalPrices: PricePulse[];
}) {
  const expeditions = useGameStore((s) => s.expeditions);
  const [local, setLocal] = useState<PricePulse[]>([]);
  const [priceAlert, setPriceAlert] = useState<string | null>(null);

  const prices = [...externalPrices, ...local]
    .sort((a, b) => b.at - a.at)
    .slice(0, 20);

  useEffect(() => {
    if (!roomCode) return;
    const id = setInterval(() => {
      if (Math.random() > 0.55) return;
      const company = RIVALS[Math.floor(Math.random() * RIVALS.length)]!;
      const route = ROUTES[Math.floor(Math.random() * ROUTES.length)]!;
      const price = 180 + Math.floor(Math.random() * 320);
      const p: PricePulse = { company, route, price, at: Date.now() };
      setLocal((x) => [p, ...x].slice(0, 15));
      const mine = useGameStore
        .getState()
        .expeditions.find(
          (e) =>
            e.status === "filling" &&
            `${e.origin} → ${e.destination}` === route
        );
      if (mine && price < mine.ticketPrice) {
        const msg = `Dikkat! ${company} ${route} hattında ${price} ₺ — sen ${mine.ticketPrice} ₺.`;
        setPriceAlert(msg);
        useGameStore.getState().pushPhone("Peron Savaşı", msg);
      }
    }, 22000);
    return () => clearInterval(id);
  }, [roomCode]);

  useEffect(() => {
    if (!externalPrices.length) return;
    const p = externalPrices[0]!;
    if (p.company === firm || p.company === display) return;
    const mine = expeditions.find(
      (e) =>
        (e.status === "filling" || e.status === "departed") &&
        `${e.origin} → ${e.destination}` === p.route
    );
    if (mine && p.price < mine.ticketPrice) {
      const msg = `${p.company} ${p.route} hattında ${p.price} ₺ — sen ${mine.ticketPrice} ₺. Yolcu kaybedebilirsin!`;
      setPriceAlert(msg);
      useGameStore.getState().pushPhone("Peron Savaşı", msg);
    }
  }, [externalPrices, firm, display, expeditions]);

  return (
    <>
      {priceAlert && (
        <div className="rounded-2xl border-2 border-red-500/60 bg-red-950/50 p-4 shadow-lg shadow-red-950/30">
          <div className="text-[10px] font-black tracking-widest text-red-400">
            PERON SAVAŞI
          </div>
          <p className="mt-2 text-sm font-semibold text-red-100">{priceAlert}</p>
          <div className="mt-3 flex gap-2">
            <Link
              href="/expeditions"
              className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black"
            >
              Fiyatı ayarla
            </Link>
            <button
              type="button"
              onClick={() => setPriceAlert(null)}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-xs text-zinc-400"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-zinc-950 border border-cyan-800/50 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] tracking-widest text-cyan-400 font-bold">
            CANLI BİLET BORSASI
          </div>
          <span className="text-[10px] text-zinc-500">{prices.length} nabız</span>
        </div>
        <p className="text-[11px] text-zinc-500 mb-3">
          Aynı hatta rakip ucuzlarsa yolcu kaçar. Sefer açınca senin fiyatın da odaya düşer.
        </p>
        {prices.length === 0 ? (
          <p className="text-xs text-zinc-600 py-4 text-center border border-dashed border-zinc-800 rounded-xl">
            Henüz hareket yok — sefer aç veya bekle
          </p>
        ) : (
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {prices.map((p, i) => {
              const mine = expeditions.find(
                (e) =>
                  (e.status === "filling" || e.status === "departed") &&
                  `${e.origin} → ${e.destination}` === p.route
              );
              const undercut =
                !!mine && p.price < mine.ticketPrice && p.company !== firm;
              return (
                <li
                  key={`${p.at}-${i}`}
                  className={`flex items-start justify-between gap-2 rounded-lg border px-3 py-2 text-xs ${
                    undercut
                      ? "border-red-700/60 bg-red-950/30"
                      : "border-zinc-800 bg-zinc-950/60"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-200 truncate">
                      {p.company}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">
                      {p.route}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div
                      className={`font-mono font-bold ${
                        undercut ? "text-red-300" : "text-cyan-300"
                      }`}
                    >
                      {p.price} ₺
                    </div>
                    {undercut && (
                      <div className="text-[9px] text-red-400">kırdı!</div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
