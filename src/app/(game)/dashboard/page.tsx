"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

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
  const eveningPaper = useGameStore((s) => s.eveningPaper);
  const drinkTea = useGameStore((s) => s.drinkTea);
  const teaStock = useGameStore((s) => s.teaStock);
  const ağaEnergy = useGameStore((s) => s.ağaEnergy);
  const calendarTitle = useGameStore((s) => s.calendarTitle);
  const calendarMood = useGameStore((s) => s.calendarMood);
  const homeCityId = useGameStore((s) => s.homeCityId);

  const activeExps = useMemo(
    () =>
      expeditions.filter(
        (e) => e.status === "filling" || e.status === "departed"
      ),
    [expeditions]
  );
  const doneToday = useMemo(
    () => expeditions.filter((e) => e.status === "completed").length,
    [expeditions]
  );
  const fleet = buses[0];
  const paper = morningPaper[0] || eveningPaper[0];

  const nextHint = useMemo(() => {
    if (mafiaDebtDue) return { href: "/office", text: "Kapı aidatı — ofise bak" };
    if (bankDebt > balance * 2)
      return { href: "/office", text: "Banka borcu şişti — ödeme planı" };
    if (activeExps.length === 0 && buses.length > 0)
      return { href: "/expeditions", text: "Filo boşta — sefer kur" };
    if (teaStock <= 0)
      return { href: "/market", text: "Termos boş — çay seti / stok" };
    if (reputation < 35)
      return { href: "/staff", text: "İtibar düşük — kadro & ikram" };
    return { href: "/map", text: "Haritadan hat seç, ağa gibi yönet" };
  }, [mafiaDebtDue, bankDebt, balance, activeExps.length, buses.length, teaStock, reputation]);

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28">
        {/* Üst kahraman şerit */}
        <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 mb-6">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-600/10 blur-3xl"
            aria-hidden
          />
          <div className="relative flex flex-col sm:flex-row gap-5 p-5 sm:p-6">
            {/* Portre — public/ataturk.jpg */}
            <div className="shrink-0 self-start">
              <div className="w-[88px] h-[112px] sm:w-[100px] sm:h-[128px] rounded-lg border border-amber-900/50 bg-zinc-900 overflow-hidden shadow-lg relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ataturk.jpg"
                  alt="Mustafa Kemal Atatürk"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = "none";
                    const fb = t.parentElement?.querySelector(
                      "[data-portrait-fallback]"
                    ) as HTMLElement | null;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div
                  data-portrait-fallback
                  className="hidden absolute inset-0 flex-col items-center justify-center bg-zinc-900 text-amber-200/80"
                >
                  <span className="text-2xl font-serif">A</span>
                  <span className="text-[8px] tracking-widest mt-1 px-1 text-center">
                    ataturk.jpg
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-center text-zinc-600 mt-1.5 tracking-[0.15em] font-medium">
                M. KEMAL ATATÜRK
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] tracking-[0.2em] text-amber-600 font-bold">
                <span>YAZIHANE</span>
                <span className="text-zinc-700">·</span>
                <span>1987</span>
                {calendarMood === "national" && (
                  <span className="text-amber-400/90 normal-case tracking-normal">
                    {calendarTitle || "Ulusal gün"}
                  </span>
                )}
                {calendarMood === "mourning" && (
                  <span className="text-zinc-400 normal-case tracking-normal">
                    Saygı
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1 truncate">
                {companyName || "Şirket"}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {officeTitle || "Panel"}
                {homeCityId ? ` · ${homeCityId}` : ""} · Gün {gameDay} ·{" "}
                {String(gameHour).padStart(2, "0")}:00 · Mazot {fuelPrice} ₺
              </p>

              {/* KPI şeridi */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Kpi label="Kasa" value={formatMoney(balance)} accent />
                <Kpi label="İtibar" value={`${reputation}`} />
                <Kpi label="Filo" value={`${buses.length}`} />
                <Kpi label="Aktif sefer" value={`${activeExps.length}`} />
              </div>
            </div>
          </div>

          {(bankDebt > 0 || taxDue > 0 || mafiaDebtDue) && (
            <div className="border-t border-zinc-800/80 px-5 py-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              {bankDebt > 0 && (
                <Link href="/office" className="text-red-400 hover:text-red-300">
                  Banka borcu {formatMoney(bankDebt)} →
                </Link>
              )}
              {taxDue > 0 && (
                <span className="text-amber-500/90">
                  Vergi {formatMoney(taxDue)}
                </span>
              )}
              {mafiaDebtDue && (
                <span className="text-red-300 font-medium">Kapı — aidat bekliyor</span>
              )}
            </div>
          )}
        </section>

        {/* Bir sonraki hamle — oyuncuyu bağlar */}
        <Link
          href={nextHint.href}
          className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-800/40 bg-amber-950/20 px-4 py-3 hover:bg-amber-950/35 transition"
        >
          <div>
            <div className="text-[10px] tracking-widest text-amber-600 font-bold">
              ŞİMDİ NE YAPMALI
            </div>
            <div className="text-sm text-amber-50/95 mt-0.5">{nextHint.text}</div>
          </div>
          <span className="text-amber-500 text-lg shrink-0">→</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          {/* Canlı seferler */}
          <section className="lg:col-span-3 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[10px] tracking-widest text-zinc-500 font-bold">
                CANLI SEFERLER
              </h2>
              <span className="text-[10px] text-zinc-600">
                Tamamlanan {doneToday}
              </span>
            </div>
            {activeExps.length === 0 ? (
              <p className="text-sm text-zinc-600 py-6 text-center">
                Yolda araç yok.{" "}
                <Link href="/expeditions" className="text-amber-500/90 underline">
                  Sefer aç
                </Link>
              </p>
            ) : (
              <ul className="space-y-2">
                {activeExps.slice(0, 5).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-2 rounded-lg bg-zinc-950/80 border border-zinc-800 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {e.origin} → {e.destination}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {e.status === "filling" ? "Bilet doluyor" : "Yolda"} ·{" "}
                        {e.soldTickets}/{e.maxSeats} · {e.ticketPrice} ₺
                      </div>
                    </div>
                    <div className="w-16 h-1.5 rounded-full bg-zinc-800 overflow-hidden shrink-0">
                      <div
                        className="h-full bg-amber-500/80"
                        style={{
                          width: `${Math.min(
                            100,
                            (e.soldTickets / Math.max(1, e.maxSeats)) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/expeditions"
              className="mt-3 inline-block text-[11px] text-zinc-500 hover:text-amber-400"
            >
              Tüm seferler →
            </Link>
          </section>

          {/* Sağ kolon */}
          <div className="lg:col-span-2 space-y-4">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
                GAZETE
              </div>
              {paper ? (
                <>
                  <div className="text-sm font-semibold leading-snug text-zinc-100">
                    {paper.headline || paper.title}
                  </div>
                  <p className="text-[12px] text-zinc-500 mt-1 line-clamp-3 leading-relaxed">
                    {paper.body}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openPaperEdition(morningPaper[0] ? "morning" : "evening")
                    }
                    className="mt-3 text-[11px] text-amber-500/90 hover:text-amber-400"
                  >
                    Baskıyı aç
                  </button>
                </>
              ) : (
                <p className="text-[12px] text-zinc-600 leading-relaxed">
                  Manşet yok. Saat ilerleyince sabah/akşam baskısı üretilir;
                  sen açarsın — ekranı basmaz.
                </p>
              )}
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="text-[10px] tracking-widest text-zinc-500 font-bold">
                TERMOS
              </div>
              <div className="mt-2 flex items-end justify-between gap-2">
                <div>
                  <div className="text-2xl font-mono text-amber-400/90">
                    %{Math.round(ağaEnergy)}
                  </div>
                  <div className="text-[11px] text-zinc-600">
                    Çay stok {teaStock}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => drinkTea()}
                  className="px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 hover:border-amber-700/50"
                >
                  Yudumla
                </button>
              </div>
            </section>

            {fleet && (
              <section className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-1">
                  BAŞ OTOBÜS
                </div>
                <div className="text-sm font-medium">{fleet.name}</div>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  {fleet.plate} · motor %{fleet.engineHealth}
                </div>
                <Link
                  href="/garage"
                  className="mt-2 inline-block text-[11px] text-amber-500/80"
                >
                  Garaj →
                </Link>
              </section>
            )}
          </div>
        </div>

        {/* Oda kısayolları — büyük dokunma alanı */}
        <h2 className="text-[10px] tracking-widest text-zinc-600 font-bold mb-2 px-0.5">
          ODALAR
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <Room href="/expeditions" title="Seferler" sub="Kur · takip" />
          <Room href="/garage" title="Garaj" sub="Boya · tamir" />
          <Room href="/office" title="Ofis" sub="Banka · defter" />
          <Room href="/terminal" title="Terminal" sub="İnşaat" />
          <Room href="/market" title="Pazar" sub="Filo büyüt" />
          <Room href="/staff" title="Kadro" sub="Mülakat" />
          <Room href="/map" title="Harita" sub="Hatlar" />
          <Room href="/lobby" title="Lobi" sub="Rakip" />
          <Room href="/events" title="Etkinlik" sub="Açık oda" />
        </div>

        <p className="mt-10 text-center text-[10px] text-zinc-600 tracking-wide">
          Yurtta sulh, cihanda sulh · Gerçek para yok · Otogar Tycoon
        </p>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2.5">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600">
        {label}
      </div>
      <div
        className={`text-base sm:text-lg font-semibold mt-0.5 tabular-nums truncate ${
          accent ? "text-amber-400" : "text-zinc-100"
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
      className="rounded-xl border border-zinc-800 bg-zinc-900/50 hover:border-amber-700/40 hover:bg-zinc-900 px-4 py-3.5 min-h-[72px] flex flex-col justify-center transition"
    >
      <span className="text-sm font-semibold text-zinc-100">{title}</span>
      <span className="text-[11px] text-zinc-500 mt-0.5">{sub}</span>
    </Link>
  );
}