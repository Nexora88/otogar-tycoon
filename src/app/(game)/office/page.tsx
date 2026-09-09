"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";

const QUOTE = "Yurtta sulh, cihanda sulh.";

export default function OfficePage() {
  const careerDone = useCareerStore((s) => s.careerDone);
  const careerStarted = useCareerStore((s) => s.careerStarted);

  const balance = useGameStore((s) => s.balance);
  const bankDebt = useGameStore((s) => s.bankDebt);
  const taxDue = useGameStore((s) => s.taxDue);
  const reputation = useGameStore((s) => s.reputation);
  const companyName = useGameStore((s) => s.companyName);
  const gameDay = useGameStore((s) => s.gameDay);
  const gameHour = useGameStore((s) => s.gameHour);
  const mafiaDebtDue = useGameStore((s) => s.mafiaDebtDue);
  const activeBoss = useGameStore((s) => s.activeBoss);
  const ledger = useGameStore((s) => s.ledger);
  const loanContract = useGameStore((s) => s.loanContract);
  const officeTitle = useGameStore((s) => s.officeTitle);
  const officeNotes = useGameStore((s) => s.officeNotes);
  const setOfficeNotes = useGameStore((s) => s.setOfficeNotes);
  const setOfficeTitle = useGameStore((s) => s.setOfficeTitle);
  const takeBankLoan = useGameStore((s) => s.takeBankLoan);
  const payBankDebt = useGameStore((s) => s.payBankDebt);
  const payTax = useGameStore((s) => s.payTax);
  const payMafia = useGameStore((s) => s.payMafia);
  const refuseMafia = useGameStore((s) => s.refuseMafia);
  const signLoanContract = useGameStore((s) => s.signLoanContract);
  const drinkTea = useGameStore((s) => s.drinkTea);
  const teaStock = useGameStore((s) => s.teaStock);
  const ağaEnergy = useGameStore((s) => s.ağaEnergy);

  const [titleEdit, setTitleEdit] = useState(officeTitle || "Yazıhane");
  const [notes, setNotes] = useState(officeNotes || "");
  const [principal, setPrincipal] = useState("10000");
  const [guarantor, setGuarantor] = useState("");
  const [signed, setSigned] = useState(false);

  useEffect(() => setTitleEdit(officeTitle || "Yazıhane"), [officeTitle]);
  useEffect(() => setNotes(officeNotes || ""), [officeNotes]);

  if (careerStarted && !careerDone) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-lg font-bold text-amber-400">Yazıhane kilitli</h1>
        <p className="text-sm text-zinc-500 mt-2">Önce vardiya / çıraklık.</p>
        <Link href="/shift" className="text-cyan-400 text-sm mt-4 inline-block">
          Vardiyaya git →
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-zinc-950 pb-28">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Duvar + portre */}
        <section className="relative overflow-hidden rounded-2xl border border-amber-900/35 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950">
          <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_24px)]" />
          <div className="relative p-4 sm:p-5 flex flex-col sm:flex-row gap-4">
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="w-28 h-36 rounded-lg border-2 border-amber-900/50 bg-zinc-950 overflow-hidden shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ataturk.jpg"
                  alt="Mustafa Kemal Atatürk"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fb = e.currentTarget.parentElement?.querySelector(
                      "[data-fb]"
                    ) as HTMLElement | null;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div
                  data-fb
                  className="hidden h-full min-h-[9rem] flex-col items-center justify-center text-amber-500/80 font-serif"
                >
                  <span className="text-3xl">A</span>
                  <span className="text-[8px] tracking-widest mt-1 px-2 text-center text-zinc-600">
                    public/ataturk.jpg
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-center text-zinc-600 tracking-[0.15em] mt-1.5">
                M. KEMAL ATATÜRK
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <input
                className="w-full bg-transparent text-[10px] tracking-[0.2em] text-amber-600 font-bold uppercase border-b border-amber-900/30 pb-1 focus:outline-none"
                value={titleEdit}
                onChange={(e) => setTitleEdit(e.target.value)}
                onBlur={() => setOfficeTitle(titleEdit)}
                placeholder="Yazıhane adı"
              />
              <h1 className="text-xl sm:text-2xl font-black text-amber-50 mt-2 truncate">
                {companyName}
              </h1>
              <p className="text-xs text-zinc-500 mt-0.5">
                Gün {gameDay} · {String(gameHour).padStart(2, "0")}:00 · itibar{" "}
                {reputation}
              </p>
              <p className="font-mono text-emerald-400 text-base mt-2">
                {formatMoney(balance)}
              </p>
              <p className="mt-3 text-xs italic text-zinc-500 border-l-2 border-amber-800/50 pl-2">
                “{QUOTE}”
              </p>
            </div>
          </div>
        </section>

        {/* Enerji */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3">
          <div className="text-sm">
            <span className="text-zinc-500 text-xs">Enerji </span>
            <span className="font-mono text-amber-400">
              %{Math.round(ağaEnergy)}
            </span>
            <span className="text-zinc-600 text-xs ml-2">çay {teaStock}</span>
          </div>
          <button
            type="button"
            onClick={() => drinkTea()}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-800/50 text-amber-200/90 hover:bg-amber-950/40"
          >
            Çay yudumla
          </button>
        </div>

        {/* Borç */}
        <section className="rounded-2xl border border-red-900/35 bg-zinc-900/70 p-4">
          <div className="text-[10px] tracking-widest text-red-400 font-bold">
            BORÇ PANELİ
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
            <div>
              <div className="text-[11px] text-zinc-500">Banka</div>
              <div className="font-mono text-red-400">
                {formatMoney(bankDebt)}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-zinc-500">Vergi</div>
              <div className="font-mono text-amber-400">
                {formatMoney(taxDue)}
              </div>
            </div>
          </div>
          {loanContract?.active && (
            <div className="mt-3 p-3 rounded-xl bg-black/40 border border-zinc-700 text-[11px] text-zinc-400 leading-relaxed">
              Sözleşme {formatMoney(loanContract.totalDue)} · Kefil:{" "}
              <strong className="text-zinc-200">{loanContract.guarantor}</strong>
              <br />
              Son:{" "}
              <strong className="text-amber-300">{loanContract.dueLabel}</strong>{" "}
              (gün {loanContract.dueDay})
              {loanContract.lawsuit && (
                <span className="block text-red-400 mt-1 font-bold">
                  İCRA / DAVA — itibar etkilendi
                </span>
              )}
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              type="button"
              disabled={bankDebt <= 0}
              onClick={() => payBankDebt(5000)}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-600 disabled:opacity-40"
            >
              5.000 öde
            </button>
            <button
              type="button"
              disabled={bankDebt <= 0}
              onClick={() => payBankDebt(bankDebt)}
              className="text-xs px-3 py-1.5 rounded-lg border border-emerald-800 text-emerald-400 disabled:opacity-40"
            >
              Tümünü kapat
            </button>
            <button
              type="button"
              disabled={taxDue <= 0}
              onClick={() => payTax()}
              className="text-xs px-3 py-1.5 rounded-lg border border-amber-800 text-amber-400 disabled:opacity-40"
            >
              Vergi öde
            </button>
          </div>
        </section>

        {/* Kredi kâğıdı */}
        <section className="rounded-2xl border border-amber-900/30 bg-[#e8dcc8] text-stone-900 p-4 shadow-inner">
          <div className="text-[10px] font-bold tracking-widest text-stone-600">
            AHMET BANKACILIK — KREDİ SÖZLEŞMESİ
          </div>
          <p className="text-[11px] mt-2 leading-relaxed text-stone-700">
            1.000–50.000 ₺ · ~%15 maliyet · kefil zorunlu · vade ~12 oyun günü.
            Ödenmezse icra ve itibar kaybı.
          </p>
          <input
            className="w-full mt-3 px-3 py-2 rounded-lg border border-stone-400 text-sm bg-white"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Tutar"
            inputMode="numeric"
          />
          <input
            className="w-full mt-2 px-3 py-2 rounded-lg border border-stone-400 text-sm bg-white"
            value={guarantor}
            onChange={(e) => setGuarantor(e.target.value)}
            placeholder="Kefil adı soyadı"
          />
          <label className="flex items-center gap-2 mt-3 text-[11px] text-stone-700">
            <input
              type="checkbox"
              checked={signed}
              onChange={(e) => setSigned(e.target.checked)}
            />
            Okudum — imza / mühür kabul
          </label>
          <button
            type="button"
            onClick={() => {
              if (!signed) {
                alert("İmza gerekli");
                return;
              }
              if (guarantor.trim().length < 3) {
                alert("Kefil yaz");
                return;
              }
              const n = Number(principal) || 0;
              const ok = signLoanContract
                ? signLoanContract(n, guarantor)
                : takeBankLoan(n);
              if (!ok) alert("Limit veya kasa uygun değil");
              setSigned(false);
            }}
            className="mt-3 w-full py-2.5 rounded-xl bg-stone-900 text-amber-100 text-sm font-bold"
          >
            İmzala ve çek
          </button>
        </section>

        {/* Kapı */}
        {(mafiaDebtDue || activeBoss) && (
          <section className="rounded-2xl border border-red-800 bg-red-950/25 p-4">
            <div className="text-[10px] text-red-400 font-bold tracking-widest">
              KAPI
            </div>
            <p className="text-sm font-semibold mt-1">
              {activeBoss?.bossName}
            </p>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              {activeBoss?.message}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                type="button"
                onClick={() => payMafia()}
                className="flex-1 py-2 rounded-lg bg-red-700 text-sm font-semibold"
              >
                Aidat öde
              </button>
              <button
                type="button"
                onClick={() => refuseMafia()}
                className="px-4 py-2 border border-zinc-600 rounded-lg text-xs"
              >
                Red
              </button>
            </div>
          </section>
        )}

        {/* Not defteri */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
            MASA NOTLARI
          </div>
          <textarea
            className="w-full min-h-[88px] text-sm bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-zinc-300 focus:outline-none focus:border-amber-800/50"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={() => setOfficeNotes(notes)}
            placeholder="Ajanda, borç, racon…"
            maxLength={2000}
          />
        </section>

        {/* Defter */}
        <section className="rounded-xl border border-zinc-800 p-3 max-h-40 overflow-y-auto">
          <div className="text-[10px] tracking-widest text-zinc-600 font-bold mb-2">
            DEFTER
          </div>
          {(ledger || []).length === 0 && (
            <p className="text-[11px] text-zinc-600">Kayıt yok.</p>
          )}
          {(ledger || []).slice(0, 12).map((r, i) => (
            <div
              key={i}
              className="flex justify-between text-[11px] text-zinc-500 py-0.5"
            >
              <span className="truncate pr-2">{r.label}</span>
              <span
                className={
                  r.amount < 0 ? "text-red-400/90" : "text-emerald-400/90"
                }
              >
                {r.amount}
              </span>
            </div>
          ))}
        </section>

        <Link
          href="/auction"
          className="block text-center text-xs text-cyan-500/90 hover:text-cyan-400"
        >
          Peron borsası →
        </Link>
      </div>
    </div>
  );
}