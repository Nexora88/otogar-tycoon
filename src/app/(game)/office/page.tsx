"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import {
  Calculator,
  Headphones,
  Building2,
  Phone,
  User,
  Landmark,
  ScrollText,
} from "lucide-react";

const QUOTES = [
  "Yurtta sulh, cihanda sulh.",
  "Hayatta en hakiki mürşit ilimdir.",
  "Öğretmenler: Yeni nesil sizin eseriniz olacaktır.",
  "Egemenlik kayıtsız şartsız milletindir.",
  "Bir millet ki res steplerini, topraklarını, bilgisini korur; o millet yükselir.",
];

const MONTHS_TR = [
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
    gameYear,
    upgradeAccounting,
    upgradeCustomerService,
    rentDesk,
    pendingCustomer,
    spawnCustomer,
    resolveCustomer,
    takeBankLoan,
    payBankDebt,
    payTax,
    setOfficeMode,
  } = useGameStore();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const month = MONTHS_TR[new Date().getMonth()];
  const day = new Date().getDate();

  useEffect(() => {
    const t = setInterval(() => {
      if (!pendingCustomer && Math.random() > 0.65) spawnCustomer();
    }, 16000);
    return () => clearInterval(t);
  }, [pendingCustomer, spawnCustomer]);

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % QUOTES.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const accCost = 15000 * accountingLevel;
  const csCost = 12000 * customerServiceLevel;

  return (
    <div className="min-h-full bg-[#1a1410] text-stone-200">
      {/* Duvar kağıdı hissi */}
      <div
        className="min-h-full"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 24px, rgba(0,0,0,0.04) 24px, rgba(0,0,0,0.04) 25px)",
        }}
      >
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {/* Üst bar: mod + yıl */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-amber-100/95 tracking-tight">
                Yönetim Yazıhanesi
              </h1>
              <p className="text-stone-500 text-sm mt-0.5">
                Muhasebe · Müşteri Hizmetleri · Resmî işler
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/expeditions"
                onClick={() => setOfficeMode("drive")}
                className="px-4 py-2 rounded-lg border border-stone-600 text-sm text-stone-300 hover:border-amber-600/50 hover:bg-stone-900/50 transition"
              >
                🚌 Direksiyon
              </Link>
              <span className="px-4 py-2 rounded-lg bg-amber-700/90 text-amber-50 text-sm font-semibold border border-amber-600">
                🏢 Ofis
              </span>
            </div>
          </div>

          {/* Portre + Takvim + Söz şeridi */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
            {/* Atatürk portresi (çerçeveli stilize) */}
            <div className="md:col-span-3 bg-stone-900/80 border-2 border-amber-900/60 rounded-sm p-3 shadow-xl">
              <div className="aspect-[3/4] relative bg-gradient-to-b from-stone-700 to-stone-900 border border-stone-600 flex flex-col items-center justify-center overflow-hidden">
                {/* Stilize silüet / portre alanı */}
                <div className="w-20 h-20 rounded-full bg-stone-600/50 border-2 border-stone-500 mb-3 flex items-center justify-center">
                  <span className="text-3xl text-stone-400 font-serif">A</span>
                </div>
                <div className="text-center px-2">
                  <div className="text-amber-200/90 text-xs font-semibold tracking-wide">
                    MUSTAFA KEMAL
                  </div>
                  <div className="text-amber-200/70 text-[10px] tracking-[0.2em] mt-0.5">
                    ATATÜRK
                  </div>
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-stone-500">
                  Yazıhane duvarı · Resmî portre
                </div>
              </div>
              <p className="text-[10px] text-stone-500 text-center mt-2 italic">
                Her resmî dairede olduğu gibi
              </p>
            </div>

            {/* Orta: söz + atmosfer */}
            <div className="md:col-span-6 bg-stone-900/60 border border-stone-700 rounded-sm p-5 flex flex-col justify-between min-h-[200px]">
              <div className="flex items-start gap-2">
                <ScrollText className="w-4 h-4 text-amber-600/80 shrink-0 mt-0.5" />
                <p className="text-amber-100/90 text-lg md:text-xl font-serif leading-relaxed italic">
                  “{QUOTES[quoteIndex]}”
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-700/80 flex justify-between text-[11px] text-stone-500">
                <span>Gazi Mustafa Kemal Atatürk</span>
                <span>Türkiye Cumhuriyeti</span>
              </div>
            </div>

            {/* Takvim 1980'ler */}
            <div className="md:col-span-3 bg-[#2a2218] border-2 border-stone-600 rounded-sm shadow-lg overflow-hidden">
              <div className="bg-red-900 text-center py-1.5 text-white text-xs font-bold tracking-widest">
                TAKVİM
              </div>
              <div className="p-4 text-center">
                <div className="text-stone-400 text-xs uppercase tracking-wider">{month}</div>
                <div className="text-5xl font-bold text-stone-100 my-1 tabular-nums">{day}</div>
                <div className="text-2xl font-serif text-amber-500/90">{gameYear}</div>
                <div className="mt-2 text-[10px] text-stone-500 leading-tight">
                  Perşembe ruhu · Eski Türkiye
                  <br />
                  Yazıhane saati
                </div>
              </div>
            </div>
          </div>

          {/* Odalar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <OfficeCard
              icon={<Calculator className="w-5 h-5 text-emerald-400" />}
              title="Muhasebe"
              level={`Seviye ${accountingLevel}/5`}
              desc={`Sefer kârı +%${accountingLevel * 5}. Defterler burada.`}
              actionLabel={accountingLevel >= 5 ? "Maksimum" : `Yükselt — ${formatMoney(accCost)}`}
              onAction={() => {
                if (!upgradeAccounting()) alert("Yetersiz bakiye veya max seviye");
              }}
              disabled={accountingLevel >= 5}
              accent="emerald"
            />
            <OfficeCard
              icon={<Headphones className="w-5 h-5 text-sky-400" />}
              title="Müşteri Hizmetleri"
              level={`Seviye ${customerServiceLevel}/5`}
              desc="Şikayet, kayıp eşya, rötar. İtibar burada korunur."
              actionLabel={
                customerServiceLevel >= 5 ? "Maksimum" : `Yükselt — ${formatMoney(csCost)}`
              }
              onAction={() => {
                if (!upgradeCustomerService()) alert("Yetersiz bakiye veya max seviye");
              }}
              disabled={customerServiceLevel >= 5}
              accent="sky"
            />
            <OfficeCard
              icon={<Building2 className="w-5 h-5 text-amber-400" />}
              title="Yazıhane Masası"
              level={deskRented ? "Kiralandı" : "Boş"}
              desc="Otogarda masa. Boncuk Turizm işleri için."
              actionLabel={deskRented ? "Aktif" : `Kirala — ${formatMoney(25000)}`}
              onAction={() => {
                if (!rentDesk()) alert(deskRented ? "Zaten var" : "25.000 ₺ gerekli");
              }}
              disabled={deskRented}
              accent="amber"
            />
          </div>

          {/* Banka & vergi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-stone-900/70 border border-stone-700 rounded-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Landmark className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-stone-200">Banka Ziraat — Kredi</span>
              </div>
              <p className="text-sm text-stone-500 mb-3">
                Borç: <span className="text-red-400 font-mono">{formatMoney(bankDebt)}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => takeBankLoan(20000)}
                  className="px-3 py-1.5 text-xs rounded border border-stone-600 hover:border-amber-600 text-stone-300"
                >
                  +20.000 borç al
                </button>
                <button
                  onClick={() => payBankDebt(10000)}
                  className="px-3 py-1.5 text-xs rounded border border-stone-600 hover:border-emerald-600 text-stone-300"
                >
                  10.000 öde
                </button>
              </div>
            </div>
            <div className="bg-stone-900/70 border border-stone-700 rounded-sm p-5">
              <div className="font-semibold text-stone-200 mb-2">Vergi Dairesi</div>
              <p className="text-sm text-stone-500 mb-3">
                Tahakkuk: <span className="text-amber-400 font-mono">{formatMoney(taxDue)}</span>
              </p>
              <button
                onClick={() => {
                  if (!payTax()) alert("Vergi yok veya bakiye yetersiz");
                }}
                className="px-3 py-1.5 text-xs rounded bg-amber-800/40 border border-amber-700 text-amber-200 hover:bg-amber-800/60"
              >
                Vergiyi öde (itibar +2)
              </button>
            </div>
          </div>

          {/* Özet */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
            <Stat label="Kasa" value={formatMoney(balance)} />
            <Stat label="İtibar" value={`${reputation}/100`} />
            <Stat label="Borç" value={formatMoney(bankDebt)} />
            <Stat
              label="Hat"
              value={pendingCustomer ? "Müşteri var!" : "Sakin"}
              alert={!!pendingCustomer}
            />
          </div>

          <div className="text-center">
            <Link
              href="/terminal"
              className="inline-flex items-center gap-2 text-sm text-amber-500/90 hover:text-amber-400"
            >
              <Building2 className="w-4 h-4" />
              Terminalim → İnşaat ve dükkânlar
            </Link>
          </div>
        </div>
      </div>

      {/* Müşteri modal */}
      {pendingCustomer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 p-4">
          <div className="bg-stone-900 border border-stone-600 rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-stone-800 border-2 border-stone-500 flex items-center justify-center">
                <User className="w-7 h-7 text-stone-400" />
              </div>
              <div>
                <div className="font-bold text-lg text-stone-100">{pendingCustomer.name}</div>
                <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3" />
                  {pendingCustomer.mood === "angry"
                    ? "Öfkeli"
                    : pendingCustomer.mood === "ironic"
                    ? "İğneleyici"
                    : "Nazik"}
                </div>
              </div>
            </div>

            <div className="relative bg-stone-800/80 border border-stone-600 rounded-lg p-4 mb-5">
              <div className="absolute -top-2 left-6 w-3 h-3 bg-stone-800 border-l border-t border-stone-600 rotate-45" />
              <p className="text-stone-200 text-sm leading-relaxed">
                “{pendingCustomer.issue}”
              </p>
            </div>

            <p className="text-[11px] text-stone-500 mb-3">Cevabınız?</p>
            <div className="space-y-2">
              <button
                onClick={() => resolveCustomer("dismiss")}
                className="w-full text-left px-4 py-2.5 rounded border border-stone-600 text-sm text-stone-300 hover:bg-stone-800"
              >
                “Kayıp eşya bizi ilgilendirmez.” <span className="text-red-400/80 text-xs">(İtibar −)</span>
              </button>
              <button
                onClick={() => resolveCustomer("help")}
                className="w-full text-left px-4 py-2.5 rounded border border-emerald-800/50 text-sm text-emerald-200/90 hover:bg-emerald-950/40"
              >
                “Hemen bakıyoruz, eşya neydi efendim?” <span className="text-emerald-500/80 text-xs">(İtibar +)</span>
              </button>
              <button
                onClick={() => resolveCustomer("compensate")}
                className="w-full text-left px-4 py-2.5 rounded border border-amber-800/50 text-sm text-amber-200/90 hover:bg-amber-950/30"
              >
                “Özür dileriz — tazminat ödüyoruz.” <span className="text-amber-500/80 text-xs">(₺ − / İtibar ++)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OfficeCard({
  icon,
  title,
  level,
  desc,
  actionLabel,
  onAction,
  disabled,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  level: string;
  desc: string;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
  accent: string;
}) {
  return (
    <div className="bg-stone-900/70 border border-stone-700 rounded-sm p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded bg-stone-800 flex items-center justify-center">{icon}</div>
        <div>
          <div className="font-semibold text-stone-100">{title}</div>
          <div className="text-[11px] text-stone-500">{level}</div>
        </div>
      </div>
      <p className="text-sm text-stone-400 mb-4 leading-relaxed">{desc}</p>
      <button
        onClick={onAction}
        disabled={disabled}
        className={`w-full py-2 rounded text-sm border transition disabled:opacity-40 ${
          accent === "emerald"
            ? "border-emerald-800 text-emerald-400 hover:bg-emerald-950/40"
            : accent === "sky"
            ? "border-sky-800 text-sky-400 hover:bg-sky-950/40"
            : "border-amber-800 text-amber-400 hover:bg-amber-950/40"
        }`}
      >
        {actionLabel}
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  alert,
}: {
  label: string;
  value: string;
  alert?: boolean;
}) {
  return (
    <div className="bg-stone-950/80 border border-stone-800 rounded px-3 py-2">
      <div className="text-[9px] text-stone-500 tracking-wider">{label}</div>
      <div className={`text-sm font-semibold ${alert ? "text-amber-400" : "text-stone-200"}`}>
        {value}
      </div>
    </div>
  );
}