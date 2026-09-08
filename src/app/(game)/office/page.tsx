"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";
import { playClick, playCoin, playWarn } from "@/lib/audio";

/** Kamu malı portre (Wikimedia) */
const ATATURK_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ataturk.jpg/440px-Ataturk.jpg";

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
  const loanContract = useGameStore(
    (s) => (s as { loanContract?: GameLoan | null }).loanContract
  );
  const officeTitle = useGameStore(
    (s) => (s as { officeTitle?: string }).officeTitle || "Yazıhane"
  );

  const takeBankLoan = useGameStore((s) => s.takeBankLoan);
  const payBankDebt = useGameStore((s) => s.payBankDebt);
  const payTax = useGameStore((s) => s.payTax);
  const payMafia = useGameStore((s) => s.payMafia);
  const refuseMafia = useGameStore((s) => s.refuseMafia);

  const signLoanContract = useGameStore(
    (s) =>
      (s as { signLoanContract?: (p: number, g: string) => boolean })
        .signLoanContract
  );
  const setOfficeTitle = useGameStore(
    (s) => (s as { setOfficeTitle?: (t: string) => void }).setOfficeTitle
  );

  const [titleEdit, setTitleEdit] = useState(officeTitle);
  const [principal, setPrincipal] = useState("10000");
  const [guarantor, setGuarantor] = useState("");
  const [signed, setSigned] = useState(false);

  useEffect(() => setTitleEdit(officeTitle), [officeTitle]);

  if (careerStarted && !careerDone) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-lg font-bold text-amber-400">Yazıhane kilitli</h1>
        <Link href="/shift" className="text-cyan-400 text-sm mt-4 inline-block">
          Vardiya
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto pb-28 space-y-4">
      <div className="rounded-xl border border-amber-900/40 bg-zinc-950 p-4">
        <input
          className="w-full bg-transparent text-[10px] tracking-[0.2em] text-amber-600 font-black uppercase border-b border-amber-900/30 pb-1"
          value={titleEdit}
          onChange={(e) => setTitleEdit(e.target.value)}
          onBlur={() => setOfficeTitle?.(titleEdit)}
          placeholder="Yazıhane adı"
        />
        <h1 className="text-xl font-black text-amber-50 mt-2">{companyName}</h1>
        <p className="text-xs text-zinc-500">
          Gün {gameDay} · {String(gameHour).padStart(2, "0")}:00 · itibar{" "}
          {reputation}
        </p>
        <p className="font-mono text-emerald-400 text-sm mt-1">
          {formatMoney(balance)}
        </p>
      </div>

      {/* Portre */}
      <div className="rounded-xl border border-zinc-700 bg-[#1a1510] p-3 flex gap-3 items-center">
        <div className="relative w-20 h-24 shrink-0 overflow-hidden rounded border border-amber-900/50 bg-zinc-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ATATURK_SRC}
            alt="Mustafa Kemal Atatürk"
            className="object-cover w-full h-full grayscale-[20%]"
          />
        </div>
        <div className="text-xs text-zinc-400 leading-relaxed">
          <div className="text-amber-200/90 font-semibold text-sm">
            Mustafa Kemal Atatürk
          </div>
          <p className="mt-1 italic text-zinc-500">
            “Yurtta sulh, cihanda sulh.”
          </p>
          <p className="mt-2 text-[10px] text-zinc-600">
            Telefon arka planı / yazıhane duvarı — saygı çerçevesi.
          </p>
        </div>
      </div>

      {/* Borç özeti */}
      <div className="rounded-2xl border border-red-900/40 bg-zinc-900 p-4">
        <div className="text-[10px] text-red-400 font-bold tracking-widest">
          BORÇ PANELİ
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>
            <div className="text-xs text-zinc-500">Banka</div>
            <div className="font-mono text-red-400">{formatMoney(bankDebt)}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Vergi</div>
            <div className="font-mono text-amber-400">{formatMoney(taxDue)}</div>
          </div>
        </div>
        {loanContract?.active && (
          <div className="mt-3 p-2 rounded-lg bg-black/40 border border-zinc-700 text-[11px] text-zinc-400">
            Sözleşme: {formatMoney(loanContract.totalDue)} · Kefil:{" "}
            <strong className="text-zinc-200">{loanContract.guarantor}</strong>
            <br />
            Son ödeme: <strong className="text-amber-300">{loanContract.dueLabel}</strong>{" "}
            (oyun gün {loanContract.dueDay})
            {loanContract.lawsuit && (
              <span className="block text-red-400 mt-1 font-bold">
                İCRA / DAVA AÇILDI — itibar düştü
              </span>
            )}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            disabled={bankDebt <= 0}
            onClick={() => (payBankDebt(5000) ? playCoin() : playWarn())}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-600 disabled:opacity-40"
          >
            5.000 öde
          </button>
          <button
            type="button"
            disabled={bankDebt <= 0}
            onClick={() =>
              payBankDebt(bankDebt) ? playCoin() : playWarn()
            }
            className="text-xs px-3 py-1.5 rounded-lg border border-emerald-800 text-emerald-400 disabled:opacity-40"
          >
            Tümünü kapat
          </button>
          <button
            type="button"
            disabled={taxDue <= 0}
            onClick={() => (payTax() ? playCoin() : playWarn())}
            className="text-xs px-3 py-1.5 rounded-lg border border-amber-800 text-amber-400 disabled:opacity-40"
          >
            Vergi öde
          </button>
        </div>
      </div>

      {/* İmzalı kredi */}
      <div className="rounded-2xl border border-zinc-700 bg-[#f5f0e6] text-zinc-900 p-4">
        <div className="text-[10px] font-bold tracking-widest text-zinc-600">
          AHMET BANKACILIK — KREDİ SÖZLEŞMESİ
        </div>
        <p className="text-[11px] mt-2 leading-relaxed">
          Tutar 1.000–50.000 ₺. Maliyet ~%15. Kefil zorunlu. Vade ~12 oyun günü;
          ödenmezse kefil kayıtta, dava ve itibar kaybı.
        </p>
        <input
          className="w-full mt-2 px-2 py-1.5 rounded border border-zinc-400 text-sm bg-white"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          placeholder="Tutar"
          inputMode="numeric"
        />
        <input
          className="w-full mt-2 px-2 py-1.5 rounded border border-zinc-400 text-sm bg-white"
          value={guarantor}
          onChange={(e) => setGuarantor(e.target.value)}
          placeholder="Kefil adı soyadı"
        />
        <label className="flex items-center gap-2 mt-2 text-[11px]">
          <input
            type="checkbox"
            checked={signed}
            onChange={(e) => setSigned(e.target.checked)}
          />
          Okudum, imza / mühür kabul
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
            const ok = signLoanContract
              ? signLoanContract(Number(principal) || 0, guarantor)
              : takeBankLoan(Number(principal) || 0);
            if (ok) playCoin();
            else playWarn();
            setSigned(false);
          }}
          className="mt-3 w-full py-2 rounded bg-zinc-900 text-amber-100 text-sm font-bold"
        >
          İmzala ve çek
        </button>
      </div>

      {(mafiaDebtDue || activeBoss) && (
        <div className="rounded-2xl border border-red-800 bg-red-950/30 p-4">
          <div className="text-[10px] text-red-400 font-bold">KAPI</div>
          <p className="text-sm mt-1">{activeBoss?.bossName}</p>
          <p className="text-xs text-zinc-400 mt-1">{activeBoss?.message}</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => payMafia()}
              className="flex-1 py-2 rounded-lg bg-red-700 text-sm font-semibold"
            >
              Öde
            </button>
            <button
              type="button"
              onClick={() => refuseMafia()}
              className="px-3 py-2 border border-zinc-600 rounded-lg text-xs"
            >
              Red
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-zinc-800 p-3 max-h-32 overflow-y-auto text-[11px] text-zinc-500">
        {(ledger || []).slice(0, 10).map((r, i) => (
          <div key={i} className="flex justify-between">
            <span>{r.label}</span>
            <span>{r.amount}</span>
          </div>
        ))}
      </div>

      <Link href="/auction" className="block text-center text-xs text-cyan-500">
        Peron borsası / istihbarat →
      </Link>
    </div>
  );
}

type GameLoan = {
  principal: number;
  totalDue: number;
  paid: number;
  guarantor: string;
  signedAtDay: number;
  dueDay: number;
  dueLabel: string;
  active: boolean;
  lawsuit: boolean;
};