"use client";

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

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div
        className="bg-[#f5f0e6] text-stone-900 w-full max-w-xs shadow-2xl border border-stone-400"
        style={{ fontFamily: "monospace" }}
      >
        <div className="border-b border-dashed border-stone-400 p-3 text-center">
          <div className="text-[10px] tracking-widest">YOLCU TAŞIMA FİŞİ</div>
          <div className="font-bold text-sm">OTOGAR TYCOON</div>
          <div className="text-[9px] text-stone-500">Peron Savaşları · 1987</div>
        </div>
        <div className="p-3 text-[11px] space-y-1">
          <div>
            {origin} → {destination}
          </div>
          <div>
            Yolcu: {sold} · Bilet: {formatMoney(price)}
          </div>
          <div>Şoför: {driverName}</div>
          <div className="border-t border-dashed border-stone-400 pt-1 mt-1">
            Hasılat: {formatMoney(revenue)}
          </div>
          <div>Gider: {formatMoney(cost)}</div>
          <div className="font-bold">Net: {formatMoney(profit)}</div>
        </div>
        <div className="p-2 text-center text-[9px] text-stone-500 border-t border-dashed">
          *** İyi yolculuklar ***
        </div>
        <button
          type="button"
          onClick={() => setLastTicket(null)}
          className="w-full py-2 bg-stone-800 text-stone-100 text-xs"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}