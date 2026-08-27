"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import LoanContractModal from "@/components/LoanContractModal";
import {
  Calculator,
  Headphones,
  Building2,
  Landmark,
  ScrollText,
  User,
  Phone,
  FileText,
  Scale,
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
    accountingLevel,
    customerServiceLevel,
    deskRented,
    balance,
    reputation,
    bankDebt,
    taxDue,
    kdvDue,
    incomeTaxDue,
    ledger,
    gameYear,
    upgradeAccounting,
    upgradeCustomerService,
    rentDesk,
    pendingCustomer,
    spawnCustomer,
    resolveCustomer,
    payBankDebt,
    payTax,
    setOfficeMode,
  } = useGameStore();

  const [quoteI, setQuoteI] = useState(0);
  const [loanOpen, setLoanOpen] = useState(false);
  const day = new Date().getDate();
  const month = MONTHS[new Date().getMonth()];

  useEffect(() => {
    const t = setInterval(() => {
      if (!pendingCustomer && Math.random() > 0.72) spawnCustomer();
    }, 16000);
    return () => clearInterval(t);
  }, [pendingCustomer, spawnCustomer]);

  useEffect(() => {
    const t = setInterval(
      () => setQuoteI((i) => (i + 1) % QUOTES.length),
      9000
    );
    return () => clearInterval(t);
  }, []);

  const accCost = 15000 * accountingLevel;
  const csCost = 12000 * customerServiceLevel;

  return (
    <div className="min-h-full bg-[#1a1410] text-stone-200">
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-amber-100">
              Yönetim Yazıhanesi
            </h1>
            <p className="text-stone-500 text-sm">
              Muhasebe · Vergi · Banka (A4) · Müşteri
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/expeditions"
              onClick={() => setOfficeMode("drive")}
              className="px-3 py-2 rounded-lg border border-stone-600 text-sm text-stone-300"
            >
              Direksiyon
            </Link>
            <span className="px-3 py-2 rounded-lg bg-amber-800/80 text-amber-50 text-sm font-semibold">
              Ofis
            </span>
          </div>
        </div>

        {/* Portre / söz / takvim */}
        <div className="grid md:grid-cols-12 gap-3 mb-6">
          <div className="md:col-span-3 bg-stone-900 border border-amber-900/50 rounded p-3 text-center">
            <div className="aspect-[3/4] bg-stone-800 border border-stone-600 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-stone-600 mb-2 flex items-center justify-center text-2xl text-stone-400 font-serif">
                A
              </div>
              <div className="text-amber-200/90 text-xs font-semibold">
                MUSTAFA KEMAL
              </div>
              <div className="text-amber-200/60 text-[10px] tracking-widest">
                ATATÜRK
              </div>
            </div>
          </div>
          <div className="md:col-span-6 bg-stone-900/70 border border-stone-700 rounded p-5 flex flex-col justify-between">
            <div className="flex gap-2">
              <ScrollText className="w-4 h-4 text-amber-600 shrink-0 mt-1" />
              <p className="font-serif text-lg italic text-amber-100/90">
                “{QUOTES[quoteI]}”
              </p>
            </div>
            <p className="text-[11px] text-stone-500 mt-3">
              Gazi Mustafa Kemal Atatürk
            </p>
          </div>
          <div className="md:col-span-3 bg-[#2a2218] border border-stone-600 rounded overflow-hidden">
            <div className="bg-red-900 text-center text-white text-xs font-bold py-1 tracking-widest">
              TAKVİM
            </div>
            <div className="p-4 text-center">
              <div className="text-stone-400 text-xs">{month}</div>
              <div className="text-4xl font-bold my-1">{day}</div>
              <div className="text-xl text-amber-500 font-serif">{gameYear}</div>
            </div>
          </div>
        </div>

        {/* Muhasebe */}
        <div className="bg-stone-900/80 border border-stone-700 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-lg">Muhasebe & Vergi</h2>
            <span className="text-xs text-stone-500 ml-auto">
              Sv. {accountingLevel}/5 · kâr +%{accountingLevel * 5}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <TaxCard title="Kasa" value={formatMoney(balance)} sub="Nakit" color="text-amber-400" />
            <TaxCard
              title="KDV"
              value={formatMoney(kdvDue ?? 0)}
              sub="%8 sefer kârı"
              color="text-sky-400"
            />
            <TaxCard
              title="Gelir vergisi"
              value={formatMoney(incomeTaxDue ?? 0)}
              sub="%5 sefer kârı"
              color="text-violet-400"
            />
            <TaxCard
              title="Toplam vergi"
              value={formatMoney(taxDue)}
              sub="Ödenecek"
              color="text-red-400"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                if (!payTax()) alert("Vergi yok veya kasa yetersiz");
              }}
              className="px-4 py-2 rounded-lg bg-emerald-800/40 border border-emerald-700 text-emerald-200 text-sm"
            >
              Vergileri öde ({formatMoney(taxDue)})
            </button>
            <button
              type="button"
              onClick={() => {
                if (!upgradeAccounting()) alert("Yetersiz bakiye veya max");
              }}
              disabled={accountingLevel >= 5}
              className="px-4 py-2 rounded-lg border border-stone-600 text-sm text-stone-300 disabled:opacity-40"
            >
              Muhasebe yükselt — {formatMoney(accCost)}
            </button>
          </div>

          <div className="text-xs text-stone-500 mb-2 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Defter-i kebir
          </div>
          <div className="max-h-40 overflow-y-auto rounded border border-stone-800 bg-stone-950/80">
            {(ledger ?? []).length === 0 ? (
              <p className="p-3 text-xs text-stone-600">
                Kayıt yok. Sefer veya kredi sonrası dolar.
              </p>
            ) : (
              <table className="w-full text-xs">
                <thead className="text-stone-500 border-b border-stone-800">
                  <tr>
                    <th className="text-left p-2">Açıklama</th>
                    <th className="text-right p-2">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {(ledger ?? []).slice(0, 15).map((row) => (
                    <tr key={row.id} className="border-b border-stone-900">
                      <td className="p-2 text-stone-400">{row.label}</td>
                      <td
                        className={`p-2 text-right font-mono ${
                          row.amount >= 0 ? "text-emerald-400" : "text-red-400"
                        }`}
                      >
                        {row.amount >= 0 ? "+" : ""}
                        {formatMoney(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Banka + özet */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-stone-900/70 border border-stone-700 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">Banka kredisi</span>
            </div>
            <p className="text-sm text-stone-500 mb-3">
              Borç:{" "}
              <span className="text-red-400 font-mono">
                {formatMoney(bankDebt)}
              </span>
            </p>
            <button
              type="button"
              onClick={() => setLoanOpen(true)}
              className="w-full py-2.5 rounded-lg bg-amber-900/50 border border-amber-600 text-amber-100 text-sm font-medium hover:bg-amber-900/70"
            >
              Kredi başvurusu (A4 sözleşme)
            </button>
            <button
              type="button"
              onClick={() => {
                if (!payBankDebt(10000)) alert("Ödeme yapılamadı");
              }}
              className="w-full mt-2 py-2 rounded-lg border border-stone-600 text-xs text-stone-300"
            >
              10.000 ₺ borç öde
            </button>
          </div>

          <div className="bg-stone-900/70 border border-stone-700 rounded-lg p-5">
            <div className="font-semibold mb-2">Özet</div>
            <ul className="text-sm text-stone-400 space-y-1">
              <li>İtibar: {reputation}/100</li>
              <li>Muhasebe: +%{accountingLevel * 5} sefer kârı</li>
              <li>Müşteri hizmetleri: Sv. {customerServiceLevel}</li>
              <li>Yazıhane: {deskRented ? "Kiralı" : "Boş"}</li>
            </ul>
          </div>
        </div>

        {/* Odalar */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Room
            icon={<Calculator className="w-5 h-5 text-emerald-400" />}
            title="Muhasebe ofisi"
            level={`Sv. ${accountingLevel}/5`}
            desc="Defter, vergi, kâr."
            btn={accountingLevel >= 5 ? "Max" : `Yükselt ${formatMoney(accCost)}`}
            onClick={() => {
              if (!upgradeAccounting()) alert("Olmadı");
            }}
            disabled={accountingLevel >= 5}
          />
          <Room
            icon={<Headphones className="w-5 h-5 text-sky-400" />}
            title="Müşteri hizmetleri"
            level={`Sv. ${customerServiceLevel}/5`}
            desc="Şikayet ve kayıp eşya."
            btn={
              customerServiceLevel >= 5 ? "Max" : `Yükselt ${formatMoney(csCost)}`
            }
            onClick={() => {
              if (!upgradeCustomerService()) alert("Olmadı");
            }}
            disabled={customerServiceLevel >= 5}
          />
          <Room
            icon={<Building2 className="w-5 h-5 text-amber-400" />}
            title="Yazıhane masası"
            level={deskRented ? "Aktif" : "Boş"}
            desc="25.000 ₺ kira."
            btn={deskRented ? "Kiralandı" : "Kirala 25.000 ₺"}
            onClick={() => {
              if (!rentDesk()) alert("Olmadı");
            }}
            disabled={deskRented}
          />
        </div>

        <Link href="/terminal" className="text-sm text-amber-500 hover:text-amber-400">
          → Terminalim
        </Link>
      </div>

      {/* Müşteri modal */}
      {pendingCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg max-w-md w-full p-6">
            <div className="flex gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-500 flex items-center justify-center">
                <User className="w-6 h-6 text-stone-400" />
              </div>
              <div>
                <div className="font-bold">{pendingCustomer.name}</div>
                <div className="text-xs text-stone-500 flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {pendingCustomer.mood}
                </div>
              </div>
            </div>
            <p className="text-sm text-stone-300 mb-4 bg-stone-800/80 p-3 rounded border border-stone-700">
              “{pendingCustomer.issue}”
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => resolveCustomer("dismiss")}
                className="w-full text-left text-sm px-3 py-2 border border-stone-600 rounded hover:bg-stone-800"
              >
                İlgilenmiyoruz (itibar −)
              </button>
              <button
                type="button"
                onClick={() => resolveCustomer("help")}
                className="w-full text-left text-sm px-3 py-2 border border-emerald-800 rounded text-emerald-200"
              >
                Yardımcı olalım (itibar +)
              </button>
              <button
                type="button"
                onClick={() => resolveCustomer("compensate")}
                className="w-full text-left text-sm px-3 py-2 border border-amber-800 rounded text-amber-200"
              >
                Tazminat öde (₺ − / itibar ++)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* A4 kredi sözleşmesi */}
      <LoanContractModal open={loanOpen} onClose={() => setLoanOpen(false)} />
    </div>
  );
}

function TaxCard({
  title,
  value,
  sub,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div className="bg-stone-950 border border-stone-800 rounded-lg p-3">
      <div className="text-[10px] text-stone-500 uppercase tracking-wider">
        {title}
      </div>
      <div className={`text-lg font-bold font-mono ${color}`}>{value}</div>
      <div className="text-[10px] text-stone-600">{sub}</div>
    </div>
  );
}

function Room({
  icon,
  title,
  level,
  desc,
  btn,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  title: string;
  level: string;
  desc: string;
  btn: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="bg-stone-900/70 border border-stone-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div>
          <div className="font-semibold text-sm">{title}</div>
          <div className="text-[10px] text-stone-500">{level}</div>
        </div>
      </div>
      <p className="text-xs text-stone-400 mb-3">{desc}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full py-2 text-xs rounded border border-stone-600 text-stone-300 disabled:opacity-40"
      >
        {btn}
      </button>
    </div>
  );
}