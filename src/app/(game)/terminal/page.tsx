"use client";

import { useState } from "react";
import { useGameStore, type TerminalSlot } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Building2, Hammer } from "lucide-react";

const BUILD_OPTIONS: { type: Exclude<TerminalSlot, "empty">; label: string; cost: number }[] = [
  { type: "toilet", label: "Tuvalet", cost: 18000 },
  { type: "cayci", label: "Çay Ocağı", cost: 22000 },
  { type: "bilet", label: "Bilet Gişesi", cost: 28000 },
  { type: "bakkal", label: "Bakkal", cost: 35000 },
  { type: "mescit", label: "Mescit", cost: 15000 },
  { type: "otopark", label: "Otopark", cost: 40000 },
];

const SLOT_LABEL: Record<TerminalSlot, string> = {
  empty: "Boş arsa",
  toilet: "🚻 Tuvalet",
  cayci: "🍵 Çay ocağı",
  bilet: "🎫 Gişe",
  bakkal: "🏪 Bakkal",
  mescit: "🕌 Mescit",
  otopark: "🅿️ Otopark",
};

export default function TerminalPage() {
  const {
    terminalName,
    terminalBuilt,
    terminalSlots,
    balance,
    setTerminalName,
    startTerminalConstruction,
    buildSlot,
  } = useGameStore();

  const [nameInput, setNameInput] = useState(terminalName || "");
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
        <Building2 className="w-6 h-6 text-amber-400" />
        Terminalim
      </h1>
      <p className="text-zinc-400 text-sm mb-8">
        Kendi terminalini kur, dükkân ve hizmet alanları inşa et.
      </p>

      {!terminalBuilt ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-lg">
          <div className="flex items-center gap-2 text-amber-400 mb-4">
            <Hammer className="w-5 h-5" />
            <span className="font-semibold">İnşaat ruhsatı</span>
          </div>
          <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
            Temel atmak <strong className="text-zinc-200">{formatMoney(100000)}</strong>.
            Sonra parsel parsel tuvalet, bakkal, gişe ekleyebilirsin.
          </p>
          <label className="block text-xs text-zinc-500 mb-1">Terminal adı</label>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="örn. Bakraç Otogarı"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg mb-4"
          />
          <button
            onClick={() => {
              setTerminalName(nameInput.trim() || "Yeni Terminal");
              if (!startTerminalConstruction()) {
                alert("100.000 ₺ gerekli veya zaten kurulu");
              }
            }}
            className="w-full py-3 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400"
          >
            İnşaata başla — {formatMoney(100000)}
          </button>
          <p className="text-xs text-zinc-600 mt-3">Kasa: {formatMoney(balance)}</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xl font-bold text-amber-400">{terminalName}</div>
              <div className="text-xs text-zinc-500">Senin terminalin · inşaat devam edebilir</div>
            </div>
            <div className="text-sm text-zinc-400">Kasa: {formatMoney(balance)}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {terminalSlots.map((slot, i) => (
              <button
                key={i}
                onClick={() => setSelectedSlot(i)}
                className={`p-6 rounded-xl border text-left transition min-h-[100px] ${
                  selectedSlot === i
                    ? "border-amber-500 bg-amber-500/10"
                    : slot === "empty"
                    ? "border-dashed border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                    : "border-zinc-700 bg-zinc-900 hover:border-zinc-500"
                }`}
              >
                <div className="text-xs text-zinc-500 mb-1">Parsel {i + 1}</div>
                <div className="font-medium">{SLOT_LABEL[slot]}</div>
              </button>
            ))}
          </div>

          {selectedSlot !== null && terminalSlots[selectedSlot] === "empty" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-sm font-medium mb-3">
                Parsel {selectedSlot + 1} — ne inşa edilsin?
              </div>
              <div className="flex flex-wrap gap-2">
                {BUILD_OPTIONS.map((o) => (
                  <button
                    key={o.type}
                    onClick={() => {
                      if (!buildSlot(selectedSlot, o.type)) {
                        alert("Yetersiz bakiye veya dolu parsel");
                      } else {
                        setSelectedSlot(null);
                      }
                    }}
                    className="px-3 py-2 rounded-lg border border-zinc-700 text-sm hover:border-amber-500/50"
                  >
                    {o.label} · {formatMoney(o.cost)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}