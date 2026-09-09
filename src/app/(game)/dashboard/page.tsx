"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const ATATURK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ataturk.jpg/440px-Ataturk.jpg";

export default function DashboardPage() {
  const companyName = useGameStore((s) => s.companyName);
  const balance = useGameStore((s) => s.balance);
  const reputation = useGameStore((s) => s.reputation);
  const buses = useGameStore((s) => s.buses);
  const expeditions = useGameStore((s) => s.expeditions);
  const bankDebt = useGameStore((s) => s.bankDebt);
  const taxDue = useGameStore((s) => s.taxDue);
  const gameDay = useGameStore((s) => s.gameDay);
  const gameHour = useGameStore((s) => s.gameHour);
  const fuelPrice = useGameStore((s) => s.fuelPrice);
  const officeTitle = useGameStore((s) => s.officeTitle);
  const mafiaDebtDue = useGameStore((s) => s.mafiaDebtDue);
  const openPaperEdition = useGameStore((s) => s.openPaperEdition);
  const morningPaper = useGameStore((s) => s.morningPaper);
  const drinkTea = useGameStore((s) => s.drinkTea);
  const teaStock = useGameStore((s) => s.teaStock);
  const ağaEnergy = useGameStore((s) => s.ağaEnergy);

  const active = expeditions.filter((e) => e.status !== "completed").length;
  const bus = buses[0];
  const headline = morningPaper[0];

  return (
    <div className="min-h-full bg-[#12100e] text-stone-200">
      {/* Masa üstü — tek sahne */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-28">
        {/* Duvar + portre şeridi */}
        <div className="relative rounded-2xl border border-stone-700/80 overflow-hidden mb-6 bg-gradient-to-b from-[#2a2218] to-[#1a1510] shadow-2xl">
          <div className="absolute inset-0 opacity-[0.07] bg-[url('data:image/svg+xml,%3Csvg width=\'4\' height=\'4\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h1v1H0z\' fill=\'%23fff\'/%3E%3C/svg%3E')]" />

          <div className="relative flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
            {/* Portre */}
            <div className="shrink-0 mx-auto sm:mx-0">
              <div className="w-28 h-36 sm:w-32 sm:h-40 rounded-sm border-4 border-amber-900/60 shadow-lg overflow-hidden bg-stone-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ATATURK}
                  alt="Mustafa Kemal Atatürk"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-[9px] text-center text-amber-200/50 mt-1 tracking-widest font-serif">
                M. KEMAL ATATÜRK
              </p>
            </div>

            {/* Firma / saat */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="text-[10px] tracking-[0.2em] text-amber-600/90 font-bold">
                  YAZIHANE · 1987
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-50 mt-1 truncate">
                  {companyName || "Yazıhane"}
                </h1>
                <p className="text-sm text-stone-500 mt-0.5">
                  {officeTitle || "Panel"} · Gün {gameDay} ·{" "}
                  {String(gameHour).padStart(2, "0")}:00 · Mazot {fuelPrice} ₺
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Stat label="Kasa" value={formatMoney(balance)} hot />
                <Stat label="İtibar" value={`${reputation}`} />
                <Stat label="Filo" value={`${buses.length}`} />
                <Stat label="Sefer" value={`${active}`} />
              </div>
            </div>
          </div>

          {(bankDebt > 0 || taxDue > 0 || mafiaDebtDue) && (
            <div className="border-t border-stone-800 px-5 py-2 flex flex-wrap gap-3 text-[11px]">
              {bankDebt > 0 && (
                <Link href="/office" className="text-red-400 hover:underline">
                  Banka borcu {formatMoney(bankDebt)}
                </Link>
              )}
              {taxDue > 0 && (
                <span className="text-amber-500">Vergi {formatMoney(taxDue)}</span>
              )}
              {mafiaDebtDue && (
                <span className="text-red-300 animate-pulse">Kapı — aidat</span>
              )}
            </div>
          )}
        </div>

        {/* Defter + çay + gazete özeti */}
        <div className="grid sm:grid-cols-5 gap-4 mb-6">
          <div className="sm:col-span-3 rounded-xl border border-stone-700 bg-[#1c1814] p-4">
            <div className="text-[10px] tracking-widest text-stone-500 font-bold mb-2">
              BUGÜN MASADA
            </div>
            {headline ? (
              <div>
                <div className="text-sm font-semibold text-stone-200 leading-snug">
                  {headline.headline || headline.title}
                </div>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                  {headline.body}
                </p>
                <button
                  type="button"
                  onClick={() => openPaperEdition("morning")}
                  className="mt-3 text-[11px] text-amber-500/90 hover:text-amber-400"
                >
                  Gazeteyi aç →
                </button>
              </div>
            ) : (
              <p className="text-xs text-stone-600">
                Sabah baskısı henüz yok. Saat ilerleyince masaya düşer.
              </p>
            )}
          </div>

          <div className="sm:col-span-2 rounded-xl border border-stone-700 bg-[#1c1814] p-4 flex flex-col justify-between">
            <div>
              <div className="text-[10px] tracking-widest text-stone-500 font-bold">
                TERMOS · ENERJİ
              </div>
              <div className="mt-2 text-2xl font-mono text-amber-200/90">
                %{Math.round(ağaEnergy)}
              </div>
              <div className="text-[11px] text-stone-500">Çay stok: {teaStock}</div>
            </div>
            <button
              type="button"
              onClick={() => drinkTea()}
              className="mt-3 w-full py-2 rounded-lg bg-amber-900/40 border border-amber-800/60 text-amber-100 text-xs font-medium"
            >
              Çay yudumla
            </button>
          </div>
        </div>

        {/* Büyük kısayollar — eski “oda” hissi */}
        <div className="text-[10px] tracking-widest text-stone-600 font-bold mb-2 px-1">
          ODALAR
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Room href="/expeditions" title="Seferler" sub="Yola çık · doluluk" />
          <Room href="/garage" title="Garaj" sub={bus ? `${bus.name} · ${bus.plate}` : "Filo"} />
          <Room href="/office" title="Ofis" sub="Banka · defter · borç" />
          <Room href="/terminal" title="Terminal" sub="İnşaat · büfe" />
          <Room href="/market" title="Pazar" sub="Otobüs al" />
          <Room href="/staff" title="Kadro" sub="Mülakat · çığırtkan" />
          <Room href="/events" title="Etkinlik" sub="Açık oda · lig" />
          <Room href="/lobby" title="Lobi" sub="Rakip · sohbet" />
          <Room href="/shift" title="Vardiya" sub="Çıraklık işleri" />
        </div>

        <p className="mt-8 text-center text-[10px] text-stone-600 tracking-wide">
          Yurtta sulh, cihanda sulh · Gerçek para yok · Otogar Tycoon
        </p>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hot,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className="rounded-lg bg-black/30 border border-stone-800 px-2.5 py-2">
      <div className="text-[9px] text-stone-500 uppercase tracking-wider">{label}</div>
      <div
        className={`text-sm font-semibold mt-0.5 truncate ${
          hot ? "text-amber-400" : "text-stone-200"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Room({
  href,
  title,
  sub,
}: {
  href: string;
  title: string;
  sub: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-stone-700 bg-[#1a1612] hover:border-amber-700/50 hover:bg-[#221c16] transition p-4 min-h-[88px] flex flex-col justify-center"
    >
      <div className="font-semibold text-stone-100 text-sm group-hover:text-amber-100">
        {title}
      </div>
      <div className="text-[11px] text-stone-500 mt-1 leading-snug">{sub}</div>
    </Link>
  );
}