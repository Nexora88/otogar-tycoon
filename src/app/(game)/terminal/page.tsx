"use client";

import { useEffect, useState } from "react";
import { useGameStore, type TerminalSlot, SLOT_INFO } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Building2, Hammer } from "lucide-react";

const BUILD_LIST = (
  Object.entries(SLOT_INFO) as [
    Exclude<TerminalSlot, "empty">,
    (typeof SLOT_INFO)[Exclude<TerminalSlot, "empty">]
  ][]
).map(([type, info]) => ({ type, ...info }));

export default function TerminalPage() {
  const {
    terminalName,
    terminalBuilt,
    terminalSlots,
    balance,
    securityRisk,
    setTerminalName,
    startTerminalConstruction,
    buildSlot,
    collectPassiveIncome,
    triggerSecurityRaid,
  } = useGameStore();

  const [nameInput, setNameInput] = useState(terminalName || "");
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    collectPassiveIncome();
    const t = setInterval(() => {
      collectPassiveIncome();
      if (Math.random() > 0.9) triggerSecurityRaid();
    }, 2500);
    return () => clearInterval(t);
  }, [collectPassiveIncome, triggerSecurityRaid]);

  const cps = terminalSlots.reduce(
    (a, s) => a + (s === "empty" ? 0 : SLOT_INFO[s].cps),
    0
  );

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Building2 className="w-6 h-6 text-amber-400" />
        Terminalim
      </h1>
      <p className="text-zinc-400 text-sm mt-1 mb-6">
        Arsaya yerleştir · pasif gelir · 80&apos;ler otogar ruhu
      </p>

      {!terminalBuilt ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md">
          <div className="flex items-center gap-2 text-amber-400 mb-3">
            <Hammer className="w-5 h-5" />
            <span className="font-semibold">İnşaat ruhsatı</span>
          </div>
          <p className="text-sm text-zinc-400 mb-4">
            Temel atmak <span className="text-zinc-200 font-medium">{formatMoney(100000)}</span>
          </p>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="örn. Bakraç Otogarı"
            className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg mb-4"
          />
          <button
            onClick={() => {
              setTerminalName(nameInput.trim() || "Yeni Terminal");
              if (!startTerminalConstruction()) alert("100.000 ₺ gerekli");
            }}
            className="w-full py-3 bg-amber-500 text-black font-semibold rounded-xl"
          >
            İnşaata başla
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 justify-between mb-6">
            <div>
              <div className="text-xl font-bold text-amber-400">{terminalName}</div>
              <div className="text-xs text-zinc-500">
                Pasif: ~{cps.toFixed(1)} ₺/sn · Risk: %{securityRisk}
              </div>
            </div>
            <div className="text-sm text-zinc-400">Kasa {formatMoney(balance)}</div>
          </div>

          {/* İzometrik grid */}
          <div
            className="relative mx-auto mb-8"
            style={{
              width: "min(100%, 420px)",
              height: 280,
              perspective: "600px",
            }}
          >
            <div
              className="absolute inset-0 grid grid-cols-3 gap-3 p-4"
              style={{
                transform: "rotateX(48deg) rotateZ(-12deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {terminalSlots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`relative rounded-lg border-2 text-left p-3 transition shadow-xl ${
                    selected === i
                      ? "border-amber-400 bg-amber-500/20"
                      : slot === "empty"
                      ? "border-dashed border-zinc-600 bg-zinc-800/80"
                      : "border-zinc-600 bg-zinc-700"
                  }`}
                  style={{
                    transform: "translateZ(8px)",
                    minHeight: 72,
                  }}
                >
                  <div className="text-[9px] text-zinc-500">Arsa {i + 1}</div>
                  <div className="text-xs font-semibold text-zinc-100 leading-tight mt-1">
                    {slot === "empty" ? "Boş" : SLOT_INFO[slot].label}
                  </div>
                  {slot === "toilet" && (
                    <div className="text-[9px] text-zinc-400 mt-1">0.50–1₺ turnike</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {selected !== null && terminalSlots[selected] === "empty" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="text-sm font-medium mb-3">Arsa {selected + 1} — inşa et</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BUILD_LIST.map((o) => (
                  <button
                    key={o.type}
                    onClick={() => {
                      if (!buildSlot(selected, o.type)) alert("Yetersiz bakiye");
                      else setSelected(null);
                    }}
                    className="text-left p-3 rounded-lg border border-zinc-700 hover:border-amber-500/50"
                  >
                    <div className="font-medium text-sm">{o.label}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">{o.desc}</div>
                    <div className="text-xs text-amber-400 mt-1">
                      {formatMoney(o.cost)} · +{o.cps}₺/sn
                      {o.risk > 0 && ` · risk ${o.risk}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selected !== null && terminalSlots[selected] !== "empty" && (
            <div className="text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              {SLOT_INFO[terminalSlots[selected] as Exclude<TerminalSlot, "empty">].desc}
            </div>
          )}
        </>
      )}
    </div>
  );
}