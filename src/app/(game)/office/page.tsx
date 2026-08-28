"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import LoanContractModal from "@/components/LoanContractModal";
import {
  Calculator,
  Landmark,
  ScrollText,
  Coffee,
  FileText,
} from "lucide-react";

const QUOTES = [
  "Yurtta sulh, cihanda sulh.",
  "Hayatta en hakiki mürşit ilimdir.",
  "Egemenlik kayıtsız şartsız milletindir.",
];

const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

export default function OfficePage() {
  const {
    balance,
    reputation,
    bankDebt,
    taxDue,
    kdvDue,
    incomeTaxDue,
    ledger,
    gameYear,
    gameDay,
    gameHour,
    officeNotes,
    setOfficeNotes,
    accountingLevel,
    upgradeAccounting,
    payTax,
    payBankDebt,
    openPaperEdition,
    morningPaper,
    eveningPaper,
    mafiaDebtDue,
    payMafia,
    refuseMafia,
    drinkTea,
    teaStock,
    ağaEnergy,
    buyTeaStock,
    openMeeting,
  } = useGameStore();

  const [loanOpen, setLoanOpen] = useState(false);
  const [quoteI, setQuoteI] = useState(0);
  const [notes, setNotes] = useState(officeNotes);

  useEffect(() => {
    setNotes(officeNotes);
  }, [officeNotes]);

  useEffect(() => {
    const t = setInterval(() => setQuoteI((i) => (i + 1) % QUOTES.length), 10000);
    return () => clearInterval(t);
  }, []);

  const month = MONTHS[(gameDay * 3) % 12];

  return (
    <div className="min-h-full bg-[#2a2218] text-stone-200">
      {/* Oda duvarı */}
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <h1 className="text-xl font-bold text-amber-100">Yazıhane · 1987</h1>
          <div className="text-xs text-stone-500">
            Gün {gameDay} · {String(gameHour).padStart(2, "0")}:00 · Enerji %
            {Math.round(ağaEnergy)}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-4">
          {/* Sol duvar — portre + takvim */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-stone-900 border border-amber-900/40 p-3 text-center rounded">
              <div className="aspect-[3/4] bg-stone-800 border border-stone-600 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-stone-600 flex items-center justify-center font-serif text-xl text-stone-300">
                  A
                </div>
                <div className="text-[10px] text-amber-200/80 mt-2 tracking-widest">
                  ATATÜRK
                </div>
              </div>
            </div>
            <div className="bg-[#3d2e22] border border-stone-600 rounded overflow-hidden">
              <div className="bg-red-900 text-center text-white text-[10px] font-bold py-1">
                TAKVİM
              </div>
              <div className="p-3 text-center">
                <div className="text-xs text-stone-400">{month}</div>
                <div className="text-3xl font-bold">{((gameDay - 1) % 28) + 1}</div>
                <div className="text-amber-500 font-serif">{gameYear}</div>
              </div>
            </div>
          </div>

          {/* Masa */}
          <div className="lg:col-span-6 space-y-3">
            <div className="bg-[#4a3728] border-2 border-[#3a2a1c] rounded-lg p-4 shadow-xl">
              <div className="flex items-start gap-2 mb-3">
                <ScrollText className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-serif italic text-amber-100/90 text-sm">
                  “{QUOTES[quoteI]}”
                </p>
              </div>

              {/* Not defteri */}
              <div className="bg-[#f5e6c8] text-stone-900 rounded p-2 border border-stone-500">
                <div className="text-[10px] text-stone-500 mb-1 font-mono">
                  NOT DEFTERİ
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => setOfficeNotes(notes)}
                  rows={5}
                  className="w-full bg-transparent text-sm font-mono resize-y outline-none"
                  placeholder="Bugün yapılacaklar…"
                />
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                <button
                  type="button"
                  onClick={drinkTea}
                  className="flex items-center gap-1 text-xs px-3 py-2 bg-stone-800 border border-stone-600 rounded"
                >
                  <Coffee className="w-3.5 h-3.5" /> Çay ({teaStock})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!buyTeaStock()) alert("₺800 yok");
                  }}
                  className="text-xs px-3 py-2 border border-stone-600 rounded"
                >
                  Çay seti al ₺800
                </button>
                <button
                  type="button"
                  onClick={() => openMeeting()}
                  className="text-xs px-3 py-2 border border-amber-800 text-amber-200 rounded"
                >
                  Toplantı
                </button>
              </div>
            </div>

            {/* Gazete rafları */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openPaperEdition("morning")}
                className="p-3 bg-[#e8dcc8] text-stone-900 rounded text-left border-2 border-stone-700"
              >
                <div className="text-[10px] font-bold">SABAH BASKISI</div>
                <div className="text-xs font-black">Hakiki Peron</div>
                <div className="text-[10px] mt-1">
                  {morningPaper.length} haber
                </div>
              </button>
              <button
                type="button"
                onClick={() => openPaperEdition("evening")}
                className="p-3 bg-[#d4c4a8] text-stone-900 rounded text-left border-2 border-stone-700"
              >
                <div className="text-[10px] font-bold">AKŞAM BASKISI</div>
                <div className="text-xs font-black">Hakiki Peron</div>
                <div className="text-[10px] mt-1">
                  {eveningPaper.length} haber
                </div>
              </button>
            </div>
          </div>

          {/* Sağ — kasa özeti */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-stone-900 border border-stone-700 rounded-lg p-3">
              <div className="text-[10px] text-stone-500">KASA</div>
              <div className="text-xl font-bold text-amber-400 font-mono">
                {formatMoney(balance)}
              </div>
              <div className="text-xs text-stone-500 mt-1">
                İtibar {reputation}/100
              </div>
            </div>
            <div className="bg-stone-900 border border-stone-700 rounded-lg p-3 text-xs space-y-1">
              <div className="flex justify-between">
                <span>KDV</span>
                <span>{formatMoney(kdvDue ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>GV</span>
                <span>{formatMoney(incomeTaxDue ?? 0)}</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Toplam vergi</span>
                <span>{formatMoney(taxDue)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!payTax()) alert("Ödenemez");
                }}
                className="w-full mt-2 py-1.5 border border-emerald-800 text-emerald-300 rounded"
              >
                Vergi öde
              </button>
            </div>
            <button
              type="button"
              onClick={() => setLoanOpen(true)}
              className="w-full py-2 bg-amber-900/40 border border-amber-700 text-amber-100 text-sm rounded-lg flex items-center justify-center gap-2"
            >
              <Landmark className="w-4 h-4" /> Kredi (A4)
            </button>
            <button
              type="button"
              onClick={() => {
                if (!upgradeAccounting()) alert("Max veya kasa");
              }}
              className="w-full py-2 border border-stone-600 text-xs rounded-lg flex items-center justify-center gap-2"
            >
              <Calculator className="w-3.5 h-3.5" /> Muhasebe sv.
              {accountingLevel}
            </button>
            <Link href="/terminal" className="block text-center text-xs text-amber-500">
              → Terminalim
            </Link>
          </div>
        </div>

        {/* Defter */}
        <div className="mt-6 bg-stone-950/80 border border-stone-800 rounded-lg p-3 max-h-36 overflow-y-auto">
          <div className="text-[10px] text-stone-500 flex items-center gap-1 mb-2">
            <FileText className="w-3 h-3" /> Defter
          </div>
          {(ledger ?? []).slice(0, 8).map((row) => (
            <div
              key={row.id}
              className="flex justify-between text-[11px] border-b border-stone-900 py-1"
            >
              <span className="text-stone-500 truncate">{row.label}</span>
              <span
                className={
                  row.amount >= 0 ? "text-emerald-400" : "text-red-400"
                }
              >
                {formatMoney(row.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mafya haraç */}
      {mafiaDebtDue && (
        <div className="fixed inset-0 z-[66] flex items-center justify-center bg-black/80 p-4">
          <div className="bg-zinc-950 border-2 border-red-900 rounded-xl max-w-sm w-full p-6">
            <div className="text-xs text-red-500 tracking-widest mb-1">
              KAPIDA İKİ ADAM
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              “Ağa, haftalık hesap.{" "}
              <strong className="text-amber-400">₺8.000</strong> — bu peronun
              sükûneti. Yoksa gece otobüsler üşür.”
            </p>
            <div className="mt-4 space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (!payMafia()) alert("Kasa yetmiyor");
                }}
                className="w-full py-2.5 bg-stone-800 border border-stone-600 rounded-lg text-sm"
              >
                Öde — ₺8.000
              </button>
              <button
                type="button"
                onClick={() => refuseMafia()}
                className="w-full py-2.5 border border-red-800 text-red-300 rounded-lg text-sm"
              >
                Defolun (kundak riski)
              </button>
            </div>
          </div>
        </div>
      )}

      <LoanContractModal open={loanOpen} onClose={() => setLoanOpen(false)} />
    </div>
  );
}