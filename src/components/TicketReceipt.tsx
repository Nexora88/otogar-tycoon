"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function TicketReceipt() {
  const lastTicket = useGameStore((s) => s.lastTicket);
  const setLastTicket = useGameStore((s) => s.setLastTicket);

  if (!lastTicket) return null;

  const origin = String(lastTicket.origin ?? "");
  const destination = String(lastTicket.destination ?? "");
  const sold = Number(lastTicket.sold ?? 0);
  const price = Number(lastTicket.price ?? 0);
  const driverName = String(lastTicket.driverName ?? "Şoför");
  const revenue = Number(lastTicket.revenue ?? 0);
  const cost = Number(lastTicket.cost ?? 0);
  const profit = Number(lastTicket.profit ?? 0);
  const win = profit >= 0;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sefer fişi"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-amber-900/40 bg-[#f3ead8] text-stone-900 shadow-2xl">
        <div className="border-b border-dashed border-stone-400/80 bg-[#ebe2d0] px-4 py-3 text-center">
          <div className="text-[10px] font-bold tracking-[0.35em] text-stone-600">
            YOLCU TAŞIMA FİŞİ
          </div>
          <div className="mt-1 text-base font-black tracking-tight">OTOGAR TYCOON</div>
          <div className="text-[10px] text-stone-500">Peron Savaşları · 1987</div>
        </div>

        <div className="space-y-2 px-4 py-4 text-[12px] leading-relaxed">
          <div className="text-sm font-bold">
            {origin} → {destination}
          </div>
          <div className="flex justify-between gap-3 text-stone-700">
            <span>Yolcu · bilet</span>
            <span className="font-mono">
              {sold} × {formatMoney(price)}
            </span>
          </div>
          <div className="flex justify-between gap-3 text-stone-700">
            <span>Şoför</span>
            <span>{driverName}</span>
          </div>

          <div className="my-2 border-t border-dashed border-stone-400/80" />

          <div className="flex justify-between gap-3">
            <span>Hasılat</span>
            <span className="font-mono">{formatMoney(revenue)}</span>
          </div>
          <div className="flex justify-between gap-3 text-stone-600">
            <span>Gider</span>
            <span className="font-mono">{formatMoney(cost)}</span>
          </div>
          <div
            className={`mt-1 flex justify-between gap-3 rounded-lg px-2 py-2 text-sm font-black ${
              win
                ? "bg-emerald-900/15 text-emerald-900"
                : "bg-red-900/15 text-red-900"
            }`}
          >
            <span>Net</span>
            <span className="font-mono">{formatMoney(profit)}</span>
          </div>

          <p className="pt-1 text-center text-[10px] text-stone-500">
            {win
              ? "Peron kazandı. Deftere işlendi."
              : "Zarar yazıldı. Fiyat veya ikramı gözden geçir."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-0 border-t border-stone-400/60">
          <Link
            href="/expeditions"
            onClick={() => setLastTicket(null)}
            className="bg-amber-600 py-3 text-center text-xs font-bold text-stone-950 hover:bg-amber-500"
          >
            Yeni sefer
          </Link>
          <button
            type="button"
            onClick={() => setLastTicket(null)}
            className="bg-stone-900 py-3 text-xs font-semibold text-stone-100 hover:bg-stone-800"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
