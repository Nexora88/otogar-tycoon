"use client";

import { useGameStore, STICKERS } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function GaragePage() {
  const buses = useGameStore((s) => s.buses);
  const paintBus = useGameStore((s) => s.paintBus);
  const applySticker = useGameStore((s) => s.applySticker);
  const balance = useGameStore((s) => s.balance);

  const now = Date.now();

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Garaj</h1>
      <p className="text-zinc-500 text-sm mb-6">
        Boya, arka cam yazısı, tamir · Kasa {formatMoney(balance)}
      </p>
      <div className="space-y-4">
        {buses.map((b) => {
          const repairingUntil = (b as typeof b & { repairingUntil?: number })
            .repairingUntil;
          const repairing = repairingUntil && repairingUntil > now;
          return (
            <div
              key={b.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <div className="font-semibold">
                    {b.name}{" "}
                    <span className="text-zinc-500 text-sm">{b.plate}</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    Motor %{b.engineHealth}
                    {b.sticker && (
                      <span className="text-amber-500/90"> · «{b.sticker}»</span>
                    )}
                  </div>
                  {repairing && (
                    <div className="text-xs text-red-400 mt-1">
                      TAMİRDE / KULLANILAMAZ — bitiş{" "}
                      {new Date(repairingUntil!).toLocaleTimeString("tr-TR")}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {(
                  ["blue", "red", "green", "black", "white", "orange"] as const
                ).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => paintBus(b.id, c)}
                    className="w-7 h-7 rounded-full border border-zinc-600"
                    style={{
                      background:
                        c === "blue"
                          ? "#1e4a8c"
                          : c === "red"
                          ? "#9b1b1b"
                          : c === "green"
                          ? "#1b5e3a"
                          : c === "black"
                          ? "#222"
                          : c === "white"
                          ? "#eee"
                          : "#c45c12",
                    }}
                    title={c}
                  />
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {STICKERS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (!applySticker(b.id, s.id))
                        alert("Yetersiz kasa veya hata");
                    }}
                    className="text-[10px] px-2 py-1 border border-zinc-700 rounded text-zinc-400 hover:text-amber-300"
                  >
                    {s.label.slice(0, 22)}… {formatMoney(s.cost)}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}