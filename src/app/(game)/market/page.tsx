"use client";

import { useGameStore, MARKET_BUSES } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Bus, Fuel, User } from "lucide-react";

const COLOR_CLASS: Record<string, string> = {
  blue: "from-blue-600 to-blue-900",
  red: "from-red-600 to-red-900",
  green: "from-green-600 to-green-900",
  black: "from-zinc-600 to-zinc-900",
  white: "from-zinc-200 to-zinc-400",
  orange: "from-orange-500 to-orange-800",
};

export default function MarketPage() {
  const { balance, buses, buyBus } = useGameStore();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-1">Pazar — Otobüs Galerisi</h1>
      <p className="text-zinc-400 text-sm mb-2">
        Filona araç ekle. Muavin ve yakıt modele göre.
      </p>
      <p className="text-amber-400 text-sm mb-6 sm:mb-8">
        Kasa: {formatMoney(balance)}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {MARKET_BUSES.map((b) => {
          const canBuy = balance >= b.price;
          return (
            <div
              key={b.name}
              className={`bg-zinc-900 border rounded-2xl overflow-hidden transition ${
                canBuy ? "border-zinc-800 hover:border-zinc-600" : "border-zinc-900 opacity-75"
              }`}
            >
              <div className="relative h-32 sm:h-36 flex items-end justify-center pb-4 bg-zinc-950">
                <div
                  className={`w-36 sm:w-40 h-14 sm:h-16 rounded-md bg-gradient-to-br ${COLOR_CLASS[b.color]} relative border border-black/40`}
                  style={{
                    transform: "perspective(400px) rotateX(18deg) rotateY(-12deg)",
                    boxShadow: "8px 12px 0 rgba(0,0,0,0.35)",
                  }}
                >
                  <div className="absolute top-1 left-2 right-8 h-5 bg-sky-900/50 rounded-sm border border-black/30" />
                  <div className="absolute bottom-1 left-3 w-3 h-3 rounded-full bg-zinc-900 border border-zinc-500" />
                  <div className="absolute bottom-1 right-3 w-3 h-3 rounded-full bg-zinc-900 border border-zinc-500" />
                  <Bus className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                </div>
              </div>

              <div className="p-4">
                <div className="font-bold">{b.name}</div>
                <div className="text-xs text-zinc-500 mb-3">
                  {b.model} · {b.seatCount} koltuk · Motor %{b.engineHealth}
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-zinc-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> {b.fuelUse} lt/100km
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> Muavin {formatMoney(b.muavinCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-amber-400 font-bold text-sm sm:text-base">
                    {formatMoney(b.price)}
                  </span>
                  <button
                    type="button"
                    disabled={!canBuy}
                    onClick={() => {
                      if (!buyBus(b)) alert("Yetersiz bakiye!");
                    }}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-semibold ${
                      canBuy
                        ? "bg-amber-500 text-black hover:bg-amber-400"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    {canBuy ? "Satın al" : "Yetersiz"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 sm:mt-10">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">
          Filodaki araçlar ({buses.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {buses.map((b) => (
            <div
              key={b.id}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs"
            >
              {b.name} · {b.plate || b.model}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
