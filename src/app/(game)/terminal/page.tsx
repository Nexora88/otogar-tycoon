"use client";

import { useGameStore, SLOT_INFO, type TerminalSlot } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const BUILDABLES = Object.keys(SLOT_INFO) as Exclude<TerminalSlot, "empty">[];

export default function TerminalPage() {
  const {
    terminalBuilt,
    terminalName,
    terminalSlots,
    balance,
    startTerminalConstruction,
    buildSlot,
    setTerminalName,
    collectPassiveIncome,
    crierLevel,
    upgradeCrier,
    triggerSecurityRaid,
  } = useGameStore();

  const crierCost = 3000 + crierLevel * 4000;

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Terminalim</h1>
      <p className="text-zinc-500 text-sm mb-6">
        Arsa üzerine 2.5D peron · Kasa {formatMoney(balance)}
      </p>

      {!terminalBuilt ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <input
            className="w-full mb-4 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-sm"
            placeholder="Terminal adı"
            defaultValue={terminalName}
            onBlur={(e) => setTerminalName(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              if (!startTerminalConstruction())
                alert("₺100.000 ve inşaat şart");
            }}
            className="px-5 py-2.5 bg-cyan-500 text-black font-semibold rounded-xl text-sm"
          >
            İnşaata başla — ₺100.000
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <span className="font-semibold text-amber-200">{terminalName}</span>
            <button
              type="button"
              onClick={() => collectPassiveIncome()}
              className="text-xs px-3 py-1 border border-zinc-700 rounded-lg"
            >
              Gelir topla
            </button>
            <button
              type="button"
              onClick={() => triggerSecurityRaid()}
              className="text-xs px-3 py-1 border border-zinc-800 text-zinc-600 rounded-lg"
            >
              (Test) zabıta
            </button>
          </div>

          {/* 2.5D grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
            style={{ perspective: "600px" }}
          >
            {terminalSlots.map((slot, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 min-h-[120px]"
                style={{
                  transform: "rotateX(8deg)",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.45)",
                }}
              >
                <div className="text-[10px] text-zinc-500">Parsel {i + 1}</div>
                {slot === "empty" ? (
                  <div className="mt-2 space-y-1">
                    {BUILDABLES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          if (!buildSlot(i, t)) alert("Kasa / dolu");
                        }}
                        className="block w-full text-left text-[10px] px-2 py-1 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-800"
                      >
                        {SLOT_INFO[t].label} · {formatMoney(SLOT_INFO[t].cost)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-cyan-200">
                      {SLOT_INFO[slot].label}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      +{SLOT_INFO[slot].cps}/sn · {SLOT_INFO[slot].desc}
                    </div>
                    <div className="mt-3 h-16 rounded bg-zinc-900/80 border border-zinc-800 flex items-end justify-center pb-2">
                      <div className="w-3/4 h-10 bg-gradient-to-t from-zinc-700 to-zinc-500 rounded-t shadow-lg" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="font-semibold text-sm">Çığırtkan · Sv. {crierLevel}/5</div>
            <p className="text-xs text-zinc-500 mt-1">
              “Ankara kalkıyor!” — dolum hızı +%{crierLevel * 8}
            </p>
            <button
              type="button"
              disabled={crierLevel >= 5}
              onClick={() => {
                if (!upgradeCrier()) alert("Kasa / max");
              }}
              className="mt-3 px-4 py-2 text-sm rounded-lg border border-amber-700 text-amber-200 disabled:opacity-40"
            >
              {crierLevel >= 5 ? "Max" : `Yükselt ${formatMoney(crierCost)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}