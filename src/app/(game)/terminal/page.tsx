"use client";

import { useGameStore, SLOT_INFO, type TerminalSlot } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const BUILDABLES = Object.keys(SLOT_INFO) as Exclude<TerminalSlot, "empty">[];

function TerminalTraffic() {
  return (
    <section
      className="ot-terminal-scene mb-6 rounded-2xl border border-zinc-800"
      aria-label="1987 otogar sahnesi, dükkân ve peronlarda hareket eden otobüsler"
    >
      <div className="relative z-10 flex items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <div className="text-[9px] tracking-[.25em] text-amber-400 font-black">PERON HAREKETİ · 1987</div>
          <div className="text-sm sm:text-base font-bold text-zinc-100 mt-1">Şehirlerarası otogar</div>
        </div>
        <div className="shrink-0 text-right text-[9px] text-zinc-500">
          <div>PERON 01 · AÇIK</div>
          <div className="text-emerald-400 mt-1">● Kalkış trafiği</div>
        </div>
      </div>

      <div className="ot-terminal-architecture" aria-hidden="true">
        <div className="ot-terminal-shop">
          <div className="ot-shop-roof" />
          <div className="ot-shop-sign">YAZIHANE <span>·</span> BÜFE</div>
          <div className="ot-shop-front">
            <div className="ot-shop-window" />
            <div className="ot-shop-door" />
            <div className="ot-shop-window ot-shop-window-small" />
          </div>
          <div className="ot-shop-side" />
          <div className="ot-shop-base" />
        </div>
        <div className="ot-terminal-platform">
          <span>PERON 01</span><span>PERON 02</span><span>PERON 03</span>
        </div>
        <div className="ot-terminal-lamp ot-terminal-lamp-one" />
        <div className="ot-terminal-lamp ot-terminal-lamp-two" />
      </div>

      <div className="ot-terminal-road" aria-hidden="true">
        <div className="ot-terminal-lane-line" />
        <svg className="ot-traffic-bus ot-traffic-bus-first" viewBox="0 0 240 92" aria-hidden="true">
          <defs>
            <linearGradient id="busAmberBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="58%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
            <linearGradient id="busGlass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
          <ellipse cx="118" cy="82" rx="94" ry="6" fill="#000" opacity=".5" />
          <path d="M16 25 Q20 17 30 17 H190 Q205 17 216 31 L226 42 V66 H16 Z" fill="#713f12" opacity=".8" transform="translate(0 4)" />
          <path d="M16 25 Q20 17 30 17 H190 Q205 17 216 31 L226 42 V66 H16 Z" fill="url(#busAmberBody)" stroke="#fbbf24" strokeWidth="1.5" />
          <path d="M30 22 H188 Q199 22 208 34 H30 Z" fill="#1e293b" />
          <path d="M34 25 H58 V40 H34 Z M63 25 H87 V40 H63 Z M92 25 H116 V40 H92 Z M121 25 H145 V40 H121 Z M150 25 H174 V40 H150 Z" fill="url(#busGlass)" />
          <path d="M180 24 H191 Q201 25 209 37 H180 Z" fill="#bae6fd" />
          <path d="M18 48 H224 V54 H18 Z" fill="#fef3c7" opacity=".9" />
          <path d="M28 58 H212" stroke="#78350f" strokeWidth="2" opacity=".7" />
          <rect x="19" y="43" width="7" height="9" rx="1" fill="#fef08a" />
          <rect x="218" y="48" width="7" height="8" rx="1" fill="#fca5a5" />
          <rect x="91" y="43" width="54" height="9" rx="1" fill="#92400e" />
          <text x="118" y="49" textAnchor="middle" fontSize="6.5" fill="#fff7ed" fontWeight="700">NEXORA LINES</text>
          <circle cx="57" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="57" cy="68" r="5" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
          <circle cx="185" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="185" cy="68" r="5" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
        </svg>
        <svg className="ot-traffic-bus ot-traffic-bus-second" viewBox="0 0 240 92" aria-hidden="true">
          <defs>
            <linearGradient id="busBlueBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="60%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <ellipse cx="118" cy="82" rx="94" ry="6" fill="#000" opacity=".5" />
          <path d="M16 25 Q20 17 30 17 H190 Q205 17 216 31 L226 42 V66 H16 Z" fill="#172554" transform="translate(0 4)" />
          <path d="M16 25 Q20 17 30 17 H190 Q205 17 216 31 L226 42 V66 H16 Z" fill="url(#busBlueBody)" stroke="#93c5fd" strokeWidth="1.5" />
          <path d="M30 22 H188 Q199 22 208 34 H30 Z" fill="#1e293b" />
          <path d="M34 25 H58 V40 H34 Z M63 25 H87 V40 H63 Z M92 25 H116 V40 H92 Z M121 25 H145 V40 H121 Z M150 25 H174 V40 H150 Z" fill="#bae6fd" opacity=".9" />
          <path d="M180 24 H191 Q201 25 209 37 H180 Z" fill="#e0f2fe" />
          <path d="M18 48 H224 V54 H18 Z" fill="#f8fafc" opacity=".9" />
          <path d="M28 58 H212" stroke="#172554" strokeWidth="2" opacity=".8" />
          <rect x="19" y="43" width="7" height="9" rx="1" fill="#fef08a" />
          <rect x="218" y="48" width="7" height="8" rx="1" fill="#fca5a5" />
          <text x="118" y="49" textAnchor="middle" fontSize="7" fill="#eff6ff" fontWeight="700">TRAKYA TUR</text>
          <circle cx="57" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="57" cy="68" r="5" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
          <circle cx="185" cy="68" r="12" fill="#09090b" stroke="#71717a" strokeWidth="3" />
          <circle cx="185" cy="68" r="5" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
        </svg>
      </div>
      <div className="relative z-10 flex justify-between gap-2 px-3 py-2 text-[9px] tracking-wider text-zinc-600">
        <span>1987 · OTOGAR SAATİ</span><span>YOLCULUK BAŞLIYOR</span>
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
    <div className="mx-auto w-full max-w-5xl min-w-0 p-3 pb-24 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-1">Terminalim</h1>
      <p className="text-zinc-500 text-sm mb-5 sm:mb-6">
        Terminal sahnesi · Kasa {formatMoney(balance)}
      </p>

      <TerminalTraffic />

      {!terminalBuilt ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6">
          <label className="block text-xs text-zinc-500 mb-2" htmlFor="terminal-name">Terminal adı</label>
          <input
            id="terminal-name"
            className="w-full min-h-11 mb-4 px-3 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg text-sm"
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
            className="w-full sm:w-auto min-h-11 px-5 py-2.5 bg-cyan-500 text-black font-semibold rounded-xl text-sm active:scale-[.99]"
          >
            İnşaata başla — ₺100.000
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center">
            <span className="font-semibold text-amber-200 min-w-0 break-words">{terminalName}</span>
            <div className="grid grid-cols-2 sm:flex gap-2">
              <button
                type="button"
                onClick={() => collectPassiveIncome()}
                className="min-h-10 text-xs px-3 py-2 border border-zinc-700 rounded-lg active:bg-zinc-800"
              >
                Gelir topla
              </button>
              <button
                type="button"
                onClick={() => triggerSecurityRaid()}
                className="min-h-10 text-xs px-3 py-2 border border-zinc-800 text-zinc-500 rounded-lg active:bg-zinc-800"
              >
                Zabıta denetimi
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8">
            {terminalSlots.map((slot, i) => (
              <div
                key={i}
                className="ot-terminal-parcel relative min-w-0 rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950 p-3 sm:p-4"
              >
                <div className="text-[10px] text-zinc-500">Parsel {i + 1}</div>
                {slot === "empty" ? (
                  <div className="mt-2 space-y-1.5">
                    {BUILDABLES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          if (!buildSlot(i, t)) alert("Kasa / dolu");
                        }}
                        className="block w-full min-h-10 text-left text-xs px-2.5 py-2 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-800 active:bg-zinc-800 transition-colors"
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
                    <div className="ot-terminal-building-preview mt-3 h-20 rounded border border-zinc-800 flex items-end justify-center pb-2">
                      <div className="ot-terminal-mini-shop" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-5">
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
              className="mt-3 min-h-10 w-full sm:w-auto px-4 py-2 text-sm rounded-lg border border-amber-700 text-amber-200 disabled:opacity-40"
            >
              {crierLevel >= 5 ? "Max" : `Yükselt ${formatMoney(crierCost)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
