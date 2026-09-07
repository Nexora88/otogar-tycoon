"use client";

import { useGameStore, STICKERS, type BusColor } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const COLORS: BusColor[] = [
  "blue",
  "red",
  "green",
  "black",
  "white",
  "orange",
];

const colorClass: Record<BusColor, string> = {
  blue: "from-blue-800 to-blue-600",
  red: "from-red-800 to-red-600",
  green: "from-emerald-800 to-emerald-600",
  black: "from-zinc-800 to-zinc-600",
  white: "from-zinc-300 to-zinc-100",
  orange: "from-orange-700 to-orange-500",
};

export default function GaragePage() {
  const buses = useGameStore((s) => s.buses);
  const paintBus = useGameStore((s) => s.paintBus);
  const setBusPlate = useGameStore((s) => s.setBusPlate);
  const applySticker = useGameStore((s) => s.applySticker);
  const startBusRepair = useGameStore((s) => s.startBusRepair);
  const canUseBus = useGameStore((s) => s.canUseBus);
  const balance = useGameStore((s) => s.balance);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-1">Garaj</h1>
      <p className="text-xs text-zinc-500 mb-6">
        Boya, plaka, arka cam yazısı · Kasa {formatMoney(balance)}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {buses.map((b) => {
          const busy = !canUseBus(b.id);
          const now = Date.now();
          const repairing = b.repairingUntil && b.repairingUntil > now;
          return (
            <div
              key={b.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden"
            >
              {/* Silüet */}
              <div
                className={`h-24 bg-gradient-to-r ${colorClass[b.color]} relative flex items-end px-4 pb-2`}
              >
                <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(0,0,0,0.15)_8px,rgba(0,0,0,0.15)_16px)]" />
                <div className="relative z-10">
                  <div
                    className={`text-xs font-mono font-bold ${
                      b.color === "white" ? "text-zinc-900" : "text-white"
                    }`}
                  >
                    {b.plate}
                  </div>
                  {b.sticker && (
                    <div
                      className={`text-[10px] mt-0.5 ${
                        b.color === "white" ? "text-zinc-800" : "text-white/90"
                      }`}
                    >
                      « {b.sticker} »
                    </div>
                  )}
                </div>
                {busy && (
                  <span className="absolute top-2 right-2 text-[10px] bg-black/50 px-2 py-0.5 rounded text-amber-300">
                    {repairing ? "Tamir" : "Seferde"}
                  </span>
                )}
              </div>

              <div className="p-4">
                <div className="font-semibold">
                  {b.name}{" "}
                  <span className="text-zinc-500 text-xs">{b.model}</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {b.seatCount} koltuk · motor %{b.engineHealth} · yakıt{" "}
                  {b.fuelUse}
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => paintBus(b.id, c)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        b.color === c ? "border-amber-400" : "border-zinc-700"
                      } bg-gradient-to-br ${colorClass[c]}`}
                      title={c}
                    />
                  ))}
                </div>

                <input
                  className="mt-3 w-full text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 font-mono"
                  value={b.plate}
                  onChange={(e) => setBusPlate(b.id, e.target.value)}
                  maxLength={14}
                />

                <div className="mt-3">
                  <div className="text-[10px] text-zinc-500 mb-1">
                    Arka cam yazısı
                  </div>
                  <div className="flex flex-col gap-1 max-h-32 overflow-y-auto">
                    {STICKERS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          if (!applySticker(b.id, st.id))
                            alert("Para yetmiyor");
                        }}
                        className="text-left text-[11px] px-2 py-1 rounded border border-zinc-800 hover:border-amber-700"
                      >
                        {st.label} · {st.cost} ₺ · +{st.rep} itibar
                      </button>
                    ))}
                  </div>
                </div>

                {b.engineHealth < 70 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!startBusRepair(b.id)) alert("8000 ₺ veya meşgul");
                    }}
                    className="mt-3 text-xs text-cyan-400"
                  >
                    Tamir 8.000 ₺
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}