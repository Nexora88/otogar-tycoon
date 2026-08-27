"use client";

import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function TicketReceipt() {
  const lastTicket = useGameStore((s) => s.lastTicket);
  const setLastTicket = useGameStore((s) => s.setLastTicket);

  if (!lastTicket) return null;

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
            {lastTicket.origin} → {lastTicket.destination}
          </div>
          <div>Yolcu: {lastTicket.sold} · Bilet: {formatMoney(lastTicket.price)}</div>
          <div>Şoför: {lastTicket.driverName}</div>
          <div className="border-t border-dashed border-stone-400 pt-1 mt-1">
            Hasılat: {formatMoney(lastTicket.revenue)}
          </div>
          <div>Gider: {formatMoney(lastTicket.cost)}</div>
          <div className="font-bold">
            Net: {formatMoney(lastTicket.profit)}
          </div>
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