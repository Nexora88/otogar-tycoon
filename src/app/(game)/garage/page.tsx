"use client";

import { useGameStore, STICKERS, type BusColor, type GameBus } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const COLORS: BusColor[] = [
  "blue",
  "red",
  "green",
  "black",
  "white",
  "orange",
  "cream",
];

const colorClass: Record<BusColor, string> = {
  blue: "from-blue-900 via-blue-700 to-blue-500",
  red: "from-red-900 via-red-700 to-red-500",
  green: "from-emerald-900 via-emerald-700 to-emerald-500",
  black: "from-zinc-900 via-zinc-700 to-zinc-500",
  white: "from-zinc-200 via-zinc-100 to-white",
  orange: "from-orange-900 via-orange-600 to-orange-400",
  cream: "from-amber-200 via-stone-200 to-stone-100",
};

const bodyHex: Record<BusColor, string> = {
  blue: "#1e3a8a",
  red: "#7f1d1d",
  green: "#064e3b",
  black: "#18181b",
  white: "#e4e4e7",
  orange: "#9a3412",
  cream: "#d6d3d1",
};

function BusSilhouette({ bus }: { bus: GameBus }) {
  const dark = bus.color === "white" || bus.color === "cream";
  const ink = dark ? "#1c1917" : "#fafafa";
  const fill = bodyHex[bus.color] || "#1e3a8a";

  return (
    <div className="relative h-32 overflow-hidden bg-zinc-950">
      {/* Garaj zemini */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#27272a_0%,#09090b_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-[repeating-linear-gradient(90deg,#3f3f46_0_12px,#27272a_12px_24px)] opacity-60" />

      {/* CSS otobüs silüeti */}
      <div className="absolute left-4 right-4 bottom-6 h-16">
        <div
          className="absolute inset-0 rounded-t-md rounded-b-sm border border-black/40 shadow-lg"
          style={{
            background: `linear-gradient(180deg, ${fill} 0%, ${fill}cc 100%)`,
          }}
        />
        {/* Camlar */}
        <div className="absolute top-1.5 left-3 right-10 flex gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-4 flex-1 rounded-sm bg-sky-900/50 border border-sky-950/40"
            />
          ))}
        </div>
        {/* Ön cam */}
        <div className="absolute top-1.5 right-1.5 w-8 h-5 rounded-sm bg-sky-800/40 border border-sky-950/50" />
        {/* Farlar */}
        <div className="absolute bottom-2 right-2 flex gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24]" />
          <div className="w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_6px_#fbbf24]" />
        </div>
        {/* Teker */}
        <div className="absolute -bottom-2 left-6 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-600" />
        <div className="absolute -bottom-2 right-10 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-600" />
        {/* Plaka */}
        <div
          className="absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-bold tracking-wider"
          style={{ background: "#f5f5f4", color: "#18181b" }}
        >
          {bus.plate}
        </div>
      </div>

      {bus.sticker && (
        <div
          className="absolute top-2 left-3 right-3 text-[9px] font-semibold truncate opacity-90"
          style={{ color: ink }}
        >
          « {bus.sticker} »
        </div>
      )}
    </div>
  );
}

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
      <h1 className="text-2xl font-bold mb-1 tracking-tight">Garaj</h1>
      <p className="text-xs text-zinc-500 mb-6">
        1987 · Boya · Plaka · Arka cam · Motor · Kasa {formatMoney(balance)}
      </p>

      {buses.length === 0 && (
        <p className="text-sm text-zinc-600">Filo boş. Pazardan otobüs al.</p>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {buses.map((b) => {
          const busy = !canUseBus(b.id);
          const now = Date.now();
          const repairing = !!(b.repairingUntil && b.repairingUntil > now);
          const healthColor =
            b.engineHealth < 40
              ? "text-red-400"
              : b.engineHealth < 70
                ? "text-amber-400"
                : "text-emerald-400";

          return (
            <div
              key={b.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/90 overflow-hidden shadow-xl"
            >
              <BusSilhouette bus={b} />

              <div className="p-4 relative">
                {busy && (
                  <span className="absolute top-3 right-3 text-[10px] bg-black/70 px-2 py-0.5 rounded text-amber-300 border border-amber-900/50">
                    {repairing ? "Tamirde" : "Seferde"}
                  </span>
                )}

                <div className="font-semibold text-sm">
                  {b.name}{" "}
                  <span className="text-zinc-500 text-xs font-normal">
                    {b.model}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-1 flex flex-wrap gap-x-2">
                  <span>{b.seatCount} koltuk</span>
                  <span className={healthColor}>motor %{b.engineHealth}</span>
                  <span>yakıt {b.fuelUse}</span>
                  <span>muavin {b.muavinCost} ₺</span>
                </div>

                {/* Motor bar */}
                <div className="mt-2 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      b.engineHealth < 40
                        ? "bg-red-500"
                        : b.engineHealth < 70
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(100, b.engineHealth)}%` }}
                  />
                </div>

                <div className="text-[10px] text-zinc-600 mt-3 mb-1">Boya</div>
                <div className="flex flex-wrap gap-1.5">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => paintBus(b.id, c)}
                      className={`w-7 h-7 rounded-full border-2 bg-gradient-to-br ${
                        colorClass[c]
                      } ${
                        b.color === c
                          ? "border-amber-400 scale-110"
                          : "border-zinc-700"
                      }`}
                      title={c}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-zinc-600 mt-1">Boya 2.500 ₺</p>

                <div className="text-[10px] text-zinc-600 mt-3 mb-1">Plaka</div>
                <input
                  className="w-full text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 font-mono tracking-wider"
                  value={b.plate}
                  onChange={(e) => setBusPlate(b.id, e.target.value)}
                  maxLength={14}
                />

                <div className="mt-3">
                  <div className="text-[10px] text-zinc-600 mb-1">
                    Arka cam yazısı (itibar +)
                  </div>
                  <div className="flex flex-col gap-1 max-h-36 overflow-y-auto pr-1">
                    {STICKERS.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          if (!applySticker(b.id, st.id))
                            alert("Para yetmiyor");
                        }}
                        className={`text-left text-[11px] px-2 py-1.5 rounded-lg border transition ${
                          b.sticker === st.label
                            ? "border-amber-600 bg-amber-950/30 text-amber-100"
                            : "border-zinc-800 hover:border-amber-800 text-zinc-400"
                        }`}
                      >
                        {st.label}
                        <span className="text-zinc-600">
                          {" "}
                          · {st.cost} ₺ · +{st.rep}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {b.engineHealth < 85 && (
                  <button
                    type="button"
                    disabled={busy && !repairing}
                    onClick={() => {
                      if (!startBusRepair(b.id))
                        alert("8.000 ₺ yok veya seferde");
                    }}
                    className="mt-4 w-full text-xs py-2 rounded-lg border border-cyan-800 text-cyan-300 hover:bg-cyan-950/40 disabled:opacity-40"
                  >
                    Usta çağır · Tamir 8.000 ₺
                    {repairing ? " (devam ediyor)" : ""}
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