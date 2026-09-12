"use client";

import { useGameStore, SLOT_INFO, type TerminalSlot } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import TerminalNPCs from "./TerminalNPCs";

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
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-500/80">Terminal Yönetimi</div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Terminalim</h1>
          <p className="mt-1 text-sm text-zinc-500">Arsa üzerine 2.5D peron · Kasa {formatMoney(balance)}</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-right">
          <div className="text-[10px] uppercase tracking-wider text-zinc-600">Terminal durumu</div>
          <div className="mt-0.5 text-sm font-semibold text-emerald-400">{terminalBuilt ? "Açık · Canlı" : "Kurulum bekliyor"}</div>
        </div>
      </div>

      {!terminalBuilt ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-xl">
          <div className="mb-5 rounded-xl border border-cyan-900/40 bg-cyan-950/20 p-4">
            <div className="text-sm font-semibold text-cyan-200">Kendi terminalini kur</div>
            <p className="mt-1 text-xs leading-5 text-zinc-500">Peronlar, büfe, emanet ve yazıhane açıldıkça terminalin büyür. NPC yolcular da terminaline gelmeye başlar.</p>
          </div>
          <input
            className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-cyan-700"
            placeholder="Terminal adı"
            defaultValue={terminalName}
            onBlur={(e) => setTerminalName(e.target.value)}
          />
          <button
            type="button"
            onClick={() => {
              if (!startTerminalConstruction()) alert("₺100.000 ve inşaat şart");
            }}
            className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-400"
          >
            İnşaata başla — ₺100.000
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
            <span className="mr-2 font-semibold text-amber-200">{terminalName}</span>
            <button type="button" onClick={() => collectPassiveIncome()} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-emerald-700 hover:text-emerald-300">Gelir topla</button>
            <button type="button" onClick={() => triggerSecurityRaid()} className="rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-600 transition hover:text-zinc-300">Güvenlik denetimi</button>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"><div className="text-[10px] text-zinc-600">PERON</div><div className="mt-1 text-lg font-bold text-zinc-200">{terminalSlots.filter((s) => s === "peron").length}</div></div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"><div className="text-[10px] text-zinc-600">TESİS</div><div className="mt-1 text-lg font-bold text-zinc-200">{terminalSlots.filter((s) => s !== "empty").length}</div></div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"><div className="text-[10px] text-zinc-600">ÇIĞIRTKAN</div><div className="mt-1 text-lg font-bold text-amber-200">Sv. {crierLevel}</div></div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3"><div className="text-[10px] text-zinc-600">GELİR</div><div className="mt-1 text-lg font-bold text-emerald-300">/sn</div></div>
          </div>

          {/* 2.5D terminal grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3" style={{ perspective: "600px" }}>
            {terminalSlots.map((slot, i) => (
              <div key={i} className="relative min-h-[120px] rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-950 p-4 transition hover:-translate-y-0.5 hover:border-zinc-600" style={{ transform: "rotateX(8deg)", boxShadow: "0 12px 24px rgba(0,0,0,0.45)" }}>
                <div className="text-[10px] text-zinc-500">Parsel {i + 1}</div>
                {slot === "empty" ? (
                  <div className="mt-2 space-y-1">
                    {BUILDABLES.map((t) => (
                      <button key={t} type="button" onClick={() => { if (!buildSlot(i, t)) alert("Kasa / dolu"); }} className="block w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-left text-[10px] transition hover:border-cyan-800 hover:bg-zinc-800">
                        {SLOT_INFO[t].label} · {formatMoney(SLOT_INFO[t].cost)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="text-sm font-semibold text-cyan-200">{SLOT_INFO[slot].label}</div>
                    <div className="mt-1 text-[10px] text-zinc-500">+{SLOT_INFO[slot].cps}/sn · {SLOT_INFO[slot].desc}</div>
                    <div className="mt-3 flex h-16 items-end justify-center rounded border border-zinc-800 bg-zinc-900/80 pb-2">
                      <div className="h-10 w-3/4 rounded-t bg-gradient-to-t from-zinc-700 to-zinc-500 shadow-lg" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <TerminalNPCs />

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="text-sm font-semibold">Çığırtkan · Sv. {crierLevel}/5</div>
            <p className="mt-1 text-xs text-zinc-500">“Ankara kalkıyor!” — dolum hızı +%{crierLevel * 8}</p>
            <button type="button" disabled={crierLevel >= 5} onClick={() => { if (!upgradeCrier()) alert("Kasa / max"); }} className="mt-3 rounded-lg border border-amber-700 px-4 py-2 text-sm text-amber-200 disabled:opacity-40">
              {crierLevel >= 5 ? "Max" : `Yükselt ${formatMoney(crierCost)}`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
