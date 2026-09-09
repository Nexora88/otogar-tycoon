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

  const active = useMemo(
    () =>
      expeditions.filter(
        (e) => e.status === "filling" || e.status === "departed"
      ),
    [expeditions]
  );
  const paper = morningPaper[0] || eveningPaper[0];
  const fleet = buses[0];

  const hint = useMemo(() => {
    if (mafiaDebtDue)
      return { href: "/office", t: "Kapıda aidat — ofisi aç" };
    if (bankDebt > 0 && bankDebt >= balance)
      return { href: "/office", t: "Banka borcu kritik — ödeme planı" };
    if (active.length === 0 && buses.length > 0)
      return { href: "/expeditions", t: "Filo boşta — sefer kur" };
    if (reputation < 40)
      return { href: "/staff", t: "İtibar toparla — kadro & ikram" };
    return { href: "/map", t: "Haritadan hat seç, peronu yönet" };
  }, [mafiaDebtDue, bankDebt, balance, active.length, buses.length, reputation]);

  return (
    <div className="min-h-full bg-[#0c0a08] text-stone-100">
      {/* Hafif ambient */}
      <div className="pointer-events-none fixed inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-64 bg-amber-600/15 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-orange-700/10 blur-[80px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28">
        {/* HQ kart */}
        <section className="relative overflow-hidden rounded-3xl border border-amber-900/40 bg-gradient-to-br from-[#2a1810] via-[#1a1410] to-[#12100e] mb-5 shadow-xl shadow-orange-950/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#f59e0b18,transparent_55%)]" />
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
            {/* Portre */}
            <div className="shrink-0 self-center sm:self-start">
              <div className="w-[100px] h-[128px] rounded-2xl border-2 border-amber-700/50 bg-[#1a120c] overflow-hidden shadow-[0_0_24px_-4px_rgba(245,158,11,0.35)] relative">
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
                  className="hidden absolute inset-0 flex-col items-center justify-center bg-gradient-to-b from-amber-950/80 to-[#1a120c] text-amber-400/90"
                >
                  <span className="text-3xl font-serif">★</span>
                  <span className="text-[9px] tracking-widest mt-2 text-amber-600/80">
                    ATATÜRK
                  </span>
                  <span className="text-[8px] text-zinc-600 mt-1 px-2 text-center">
                    public/ataturk.jpg
                  </span>
                </div>
              </div>
              <p className="text-[9px] text-center text-amber-700/80 tracking-[0.18em] mt-2 font-medium">
                M. KEMAL ATATÜRK
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-amber-500">
                <span>YAZIHANE</span>
                <span className="text-amber-900">·</span>
                <span className="text-orange-400/90">1987</span>
                {calendarTitle && (
                  <span className="text-stone-500 tracking-normal font-normal">
                    · {calendarTitle}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1 truncate text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200">
                {companyName || "Şirket"}
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                {officeTitle || "Panel"} · Gün {gameDay} ·{" "}
                {String(gameHour).padStart(2, "0")}:00 · Mazot{" "}
                <span className="text-amber-600/90">{fuelPrice} ₺</span>
              </p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Kpi label="Kasa" value={formatMoney(balance)} tone="amber" />
                <Kpi label="İtibar" value={`${reputation}`} tone="orange" />
                <Kpi label="Filo" value={`${buses.length}`} tone="cyan" />
                <Kpi label="Aktif" value={`${active.length}`} tone="emerald" />
              </div>
            </div>
          </div>

          {(bankDebt > 0 || taxDue > 0 || mafiaDebtDue) && (
            <div className="relative border-t border-amber-950/80 px-5 py-2.5 flex flex-wrap gap-4 text-[11px] bg-black/20">
              {bankDebt > 0 && (
                <Link
                  href="/office"
                  className="text-red-400 hover:text-red-300 font-medium"
                >
                  Borç {formatMoney(bankDebt)} →
                </Link>
              )}
              {taxDue > 0 && (
                <span className="text-amber-500">
                  Vergi {formatMoney(taxDue)}
                </span>
              )}
              {mafiaDebtDue && (
                <span className="text-orange-300 font-medium animate-pulse">
                  Kapı — aidat
                </span>
              )}
            </div>
          )}
        </section>

        {/* Sonraki hamle */}
        <Link
          href={hint.href}
          className="mb-5 flex items-center justify-between rounded-2xl border border-orange-600/40 bg-gradient-to-r from-orange-950/50 via-amber-950/30 to-transparent px-5 py-4 hover:border-orange-500/60 transition shadow-lg shadow-orange-950/20"
        >
          <div>
            <div className="text-[10px] tracking-[0.2em] text-orange-400 font-bold">
              SONRAKİ HAMLE
            </div>
            <div className="text-sm sm:text-base text-amber-50 mt-0.5">
              {hint.t}
            </div>
          </div>
          <span className="text-orange-400 text-xl">→</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-4 mb-5">
          <section className="lg:col-span-3 rounded-2xl border border-amber-900/30 bg-[#161210]/90 p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[10px] tracking-[0.2em] text-amber-600/90 font-bold">
                CANLI SEFERLER
              </h2>
              <Link
                href="/expeditions"
                className="text-[11px] text-orange-400/90 hover:text-orange-300"
              >
                Tümü
              </Link>
            </div>
            {active.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-stone-600">Yolda araç yok</p>
                <Link
                  href="/expeditions"
                  className="inline-block mt-2 text-sm text-amber-500 hover:underline"
                >
                  Sefer oluştur
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {active.slice(0, 6).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 rounded-xl bg-black/30 border border-amber-950/50 px-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate text-amber-50/95">
                        {e.origin} → {e.destination}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {e.status === "filling" ? "Dolum" : "Yolda"} ·{" "}
                        {e.soldTickets}/{e.maxSeats} ·{" "}
                        <span className="text-amber-600/80">
                          {e.ticketPrice} ₺
                        </span>
                      </div>
                    </div>
                    <div className="w-16 h-2 rounded-full bg-zinc-900 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400"
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
          </section>

          <div className="lg:col-span-2 space-y-3">
            <section className="rounded-2xl border border-cyan-900/30 bg-[#12181c]/90 p-4">
              <div className="text-[10px] tracking-[0.2em] text-cyan-600 font-bold mb-2">
                GAZETE
              </div>
              {paper ? (
                <>
                  <h3 className="text-sm font-semibold text-cyan-50/90 leading-snug">
                    {paper.headline || paper.title}
                  </h3>
                  <p className="text-[12px] text-stone-500 mt-1 line-clamp-3">
                    {paper.body}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openPaperEdition(morningPaper[0] ? "morning" : "evening")
                    }
                    className="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300"
                  >
                    Baskıyı aç
                  </button>
                </>
              ) : (
                <p className="text-[12px] text-stone-600">
                  Manşet yok — saat dolunca üretilir.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-orange-900/35 bg-[#1a1410] p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-orange-600 font-bold">
                    TERMOS
                  </div>
                  <div className="text-3xl font-mono text-amber-400 mt-1">
                    %{Math.round(ağaEnergy)}
                  </div>
                  <div className="text-[11px] text-stone-600">
                    Çay stok {teaStock}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => drinkTea()}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-700/40 to-orange-800/40 border border-amber-700/40 text-xs text-amber-100"
                >
                  Yudumla
                </button>
              </div>
            </section>

            {fleet && (
              <section className="rounded-2xl border border-emerald-900/30 bg-[#0f1612] p-4">
                <div className="text-[10px] tracking-[0.2em] text-emerald-600 font-bold">
                  BAŞ OTOBÜS
                </div>
                <div className="text-sm font-medium mt-1 text-emerald-50/90">
                  {fleet.name}
                </div>
                <div className="text-[11px] font-mono text-stone-500">
                  {fleet.plate} · motor %{fleet.engineHealth}
                </div>
                <Link
                  href="/garage"
                  className="text-[11px] text-emerald-500/90 mt-2 inline-block"
                >
                  Garaj →
                </Link>
              </section>
            )}
          </div>
        </div>

        <h2 className="text-[10px] tracking-[0.2em] text-amber-800 font-bold mb-2">
          ODALAR
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            ["/expeditions", "Seferler", "Kur & takip", "border-amber-800/40"],
            ["/garage", "Garaj", "Boya & tamir", "border-orange-900/40"],
            ["/office", "Ofis", "Banka & defter", "border-red-900/35"],
            ["/terminal", "Terminal", "İnşaat", "border-amber-900/35"],
            ["/market", "Pazar", "Filo", "border-cyan-900/35"],
            ["/staff", "Kadro", "Mülakat", "border-violet-900/30"],
            ["/map", "Harita", "Hatlar", "border-emerald-900/30"],
            ["/lobby", "Lobi", "Rakip", "border-sky-900/30"],
            ["/events", "Etkinlik", "Açık oda", "border-rose-900/30"],
          ].map(([href, title, sub, border]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-2xl border ${border} bg-[#161210]/80 hover:bg-[#1c1610] px-4 py-3.5 min-h-[72px] flex flex-col justify-center transition hover:border-amber-600/40`}
            >
              <span className="text-sm font-semibold text-amber-50/95">
                {title}
              </span>
              <span className="text-[11px] text-stone-500 mt-0.5">{sub}</span>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-[10px] text-amber-900/80 tracking-wide">
          Yurtta sulh, cihanda sulh · Gerçek para yok
        </p>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "orange" | "cyan" | "emerald";
}) {
  const tones = {
    amber: "text-amber-400 border-amber-800/40 bg-amber-950/30",
    orange: "text-orange-300 border-orange-900/40 bg-orange-950/25",
    cyan: "text-cyan-400 border-cyan-900/40 bg-cyan-950/25",
    emerald: "text-emerald-400 border-emerald-900/40 bg-emerald-950/25",
  };
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${tones[tone]}`}>
      <div className="text-[9px] uppercase tracking-wider text-stone-500">
        {label}
      </div>
      <div className="text-lg font-semibold tabular-nums mt-0.5 truncate">
        {value}
      </div>
    </div>
  );
}