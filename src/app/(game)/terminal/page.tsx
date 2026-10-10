"use client";

import { useGameStore, SLOT_INFO, type TerminalSlot } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const BUILDABLES = Object.keys(SLOT_INFO) as Exclude<TerminalSlot, "empty">[];


function TerminalTraffic() {
  return (
    <section
      className="ot-terminal-scene mb-6 rounded-2xl border border-zinc-800"
      aria-label="Terminal peronlarında hareket eden otobüsler"
    >
      <div className="relative z-10 flex items-start justify-between gap-3 p-4">
        <div>
          <div className="text-[9px] tracking-[.25em] text-amber-400 font-black">PERON HAREKETİ · 1987</div>
          <div className="text-sm font-bold text-zinc-100 mt-1">Sefer hazırlığı</div>
        </div>
        <div className="text-right text-[9px] text-zinc-500">
          <div>PERON 01 · AÇIK</div>
          <div className="text-emerald-400 mt-1">● Kalkış trafiği</div>
        </div>
      </div>
      <div className="ot-terminal-road" aria-hidden="true">
        <div className="ot-terminal-lane-line" />
        <svg className="ot-traffic-bus ot-traffic-bus-first" viewBox="0 0 240 92" aria-hidden="true">
          <ellipse cx="118" cy="80" rx="93" ry="6" fill="#000" opacity=".4" />
          <path d="M16 25 Q20 17 30 17 H190 Q205 17 216 31 L226 42 V66 H16 Z" fill="#b45309" stroke="#fbbf24" strokeWidth="1.5" />
          <path d="M30 23 H188 Q199 23 208 34 H30 Z" fill="#1e293b" />
          <path d="M34 25 H58 V40 H34 Z M63 25 H87 V40 H63 Z M92 25 H116 V40 H92 Z M121 25 H145 V40 H121 Z M150 25 H174 V40 H150 Z" fill="#7dd3fc" opacity=".8" />
          <path d="M180 24 H191 Q201 25 209 37 H180 Z" fill="#bae6fd" opacity=".9" />
          <path d="M18 48 H224 V54 H18 Z" fill="#fef3c7" opacity=".8" />
          <rect x="19" y="43" width="7" height="9" rx="1" fill="#fef08a" />
          <rect x="218" y="48" width="7" height="8" rx="1" fill="#fca5a5" />
          <circle cx="57" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="57" cy="68" r="4" fill="#d4d4d8" />
          <circle cx="185" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="185" cy="68" r="4" fill="#d4d4d8" />
          <text x="118" y="49" textAnchor="middle" fontSize="8" fill="#fff7ed" fontWeight="700">NEXORA LINES</text>
        </svg>
        <svg className="ot-traffic-bus ot-traffic-bus-second" viewBox="0 0 240 92" aria-hidden="true">
          <ellipse cx="118" cy="80" rx="93" ry="6" fill="#000" opacity=".4" />
          <path d="M16 25 Q20 17 30 17 H190 Q205 17 216 31 L226 42 V66 H16 Z" fill="#1d4ed8" stroke="#93c5fd" strokeWidth="1.5" />
          <path d="M30 23 H188 Q199 23 208 34 H30 Z" fill="#1e293b" />
          <path d="M34 25 H58 V40 H34 Z M63 25 H87 V40 H63 Z M92 25 H116 V40 H92 Z M121 25 H145 V40 H121 Z M150 25 H174 V40 H150 Z" fill="#bae6fd" opacity=".85" />
          <path d="M180 24 H191 Q201 25 209 37 H180 Z" fill="#e0f2fe" />
          <path d="M18 48 H224 V54 H18 Z" fill="#f8fafc" opacity=".85" />
          <rect x="19" y="43" width="7" height="9" rx="1" fill="#fef08a" />
          <rect x="218" y="48" width="7" height="8" rx="1" fill="#fca5a5" />
          <circle cx="57" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="57" cy="68" r="4" fill="#d4d4d8" />
          <circle cx="185" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="185" cy="68" r="4" fill="#d4d4d8" />
          <text x="118" y="49" textAnchor="middle" fontSize="8" fill="#eff6ff" fontWeight="700">TRAKYA TUR</text>
        </svg>
      </div>
    </section>
  );
}

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

      <TerminalTraffic />

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
            className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8"
            style={{ perspective: "600px" }}
          >
            {terminalSlots.map((slot, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950 p-3 sm:p-4 min-h-[120px]"
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
                        className="block w-full min-h-9 text-left text-xs px-2 py-2 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-800 active:bg-zinc-800 transition-colors"
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