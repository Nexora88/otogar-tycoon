"use client";

import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function OfficePage() {
  const {
    companyName,
    playerName,
    balance,
    reputation,
    gameDay,
    gameYear,
    officeNotes,
    setOfficeNotes,
    mafiaDebtDue,
    activeBoss,
    payMafia,
    refuseMafia,
    ağaEnergy,
    teaStock,
    drinkTea,
    buyTeaStock,
    bankDebt,
    taxDue,
    payTax,
    takeBankLoan,
    payBankDebt,
    deskRented,
    rentDesk,
    accountingLevel,
    upgradeAccounting,
    ledger,
    openNewspaper,
  } = useGameStore();

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto pb-24">
      {/* Masa */}
      <div className="relative rounded-2xl border border-amber-900/30 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 mb-6 overflow-hidden">
        <div className="absolute top-3 right-4 w-16 h-20 border-2 border-amber-800/40 rounded bg-zinc-900/80 flex items-center justify-center text-[9px] text-amber-700 text-center leading-tight px-1">
          Atatürk
          <br />
          Portresi
        </div>
        <div className="text-[10px] tracking-widest text-amber-600 font-bold">
          YAZIHANE · {gameYear}
        </div>
        <h1 className="text-xl font-bold mt-1">{companyName}</h1>
        <p className="text-xs text-zinc-500">
          {playerName} · Gün {gameDay} · Enerji %{ağaEnergy}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => drinkTea()}
            disabled={teaStock <= 0}
            className="px-3 py-1.5 rounded-lg bg-amber-900/40 border border-amber-800 text-xs disabled:opacity-40"
          >
            Çay yudumla ({teaStock})
          </button>
          <button
            type="button"
            onClick={() => buyTeaStock()}
            className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs"
          >
            Çay seti 800 ₺
          </button>
          <button
            type="button"
            onClick={() => openNewspaper()}
            className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs"
          >
            Gazete
          </button>
        </div>
      </div>

      {/* Mafya */}
      {mafiaDebtDue && activeBoss && (
        <div className="mb-6 p-5 rounded-2xl border-2 border-red-800 bg-red-950/40">
          <div className="text-[10px] font-bold text-red-400 tracking-widest">
            KAPIDA · {activeBoss.region.toUpperCase()} ·{" "}
            {activeBoss.tier === "sahte" ? "ŞÜPHELİ" : "AĞIR"}
          </div>
          <div className="text-lg font-bold mt-1">{activeBoss.bossName}</div>
          <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
            {activeBoss.message}
          </p>
          <p className="text-xs text-amber-500/90 mt-2">
            İstenen: {formatMoney(activeBoss.weeklyFee)}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              type="button"
              onClick={() => {
                if (!payMafia()) alert("Kasa yetmiyor.");
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-bold"
            >
              Öde
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    activeBoss.tier === "hakiki"
                      ? "Hakiki ise kundak riski var. Red?"
                      : "Blöf olabilir. Red?"
                  )
                )
                  refuseMafia();
              }}
              className="px-4 py-2 rounded-xl border border-red-700 text-red-300 text-sm"
            >
              Reddet
            </button>
          </div>
        </div>
      )}

      {/* Notlar */}
      <div className="mb-6">
        <div className="text-xs text-zinc-500 mb-1">Masa notları</div>
        <textarea
          value={officeNotes}
          onChange={(e) => setOfficeNotes(e.target.value)}
          rows={5}
          className="w-full bg-amber-50/5 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-300 font-mono"
        />
      </div>

      {/* Muhasebe kısa */}
      <div className="grid sm:grid-cols-2 gap-3 mb-6 text-sm">
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-zinc-500 text-xs">Kasa</div>
          <div className="text-emerald-400 font-mono text-lg">
            {formatMoney(balance)}
          </div>
          <div className="text-xs text-zinc-500 mt-2">
            İtibar {reputation} · Muhasebe sv.{accountingLevel}
          </div>
          <button
            type="button"
            onClick={() => upgradeAccounting()}
            className="mt-2 text-xs text-cyan-400"
          >
            Muhasebe yükselt
          </button>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="text-zinc-500 text-xs">Vergi / Borç</div>
          <div className="text-sm">Vergi: {formatMoney(taxDue)}</div>
          <div className="text-sm">Banka: {formatMoney(bankDebt)}</div>
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => payTax()}
              className="text-xs px-2 py-1 border border-zinc-700 rounded"
            >
              Vergi öde
            </button>
            <button
              type="button"
              onClick={() => takeBankLoan(10000)}
              className="text-xs px-2 py-1 border border-zinc-700 rounded"
            >
              +10k kredi
            </button>
            <button
              type="button"
              onClick={() => payBankDebt(5000)}
              className="text-xs px-2 py-1 border border-zinc-700 rounded"
            >
              Borç 5k
            </button>
          </div>
          {!deskRented && (
            <button
              type="button"
              onClick={() => rentDesk()}
              className="mt-2 text-xs text-amber-400"
            >
              Masa kirala 25.000 ₺
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs text-zinc-500 mb-2">Son hareketler</div>
        <ul className="text-[11px] text-zinc-500 space-y-1 max-h-40 overflow-y-auto">
          {ledger.slice(0, 12).map((l) => (
            <li key={l.id}>
              {l.label}: {formatMoney(l.amount)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}