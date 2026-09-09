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
    if (bankDebt > 0 && bankDebt > balance)
      return { href: "/office", t: "Banka borcu kritik" };
    if (active.length === 0 && buses.length > 0)
      return { href: "/expeditions", t: "Filo boşta — sefer kur" };
    if (reputation < 40)
      return { href: "/staff", t: "İtibar toparla — kadro & ikram" };
    return { href: "/map", t: "Haritadan hat seç" };
  }, [mafiaDebtDue, bankDebt, balance, active.length, buses.length, reputation]);

  return (
    <div className="min-h-full bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28">
        {/* Hero HQ */}
        <section className="relative overflow-hidden rounded-3xl border border-zinc-800/90 bg-zinc-900/80 mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 via-transparent to-cyan-600/5" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row gap-6">
            <div className="shrink-0">
              <div className="w-24 h-30 sm:w-28 sm:h-[8.5rem] rounded-2xl border border-amber-900/40 bg-zinc-950 overflow-hidden shadow-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/ataturk.jpg"
                  alt="Mustafa Kemal Atatürk"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const f = e.currentTarget.parentElement?.querySelector(
                      "[data-fb]"
                    ) as HTMLElement | null;
                    if (f) f.style.display = "flex";
                  }}
                />
                <div
                  data-fb
                  className="hidden h-full min-h-[8rem] flex-col items-center justify-center text-amber-500/70 font-serif text-2xl"
                >
                  A
                </div>
              </div>
              <p className="text-[9px] text-center text-zinc-600 tracking-[0.2em] mt-2">
                M. KEMAL ATATÜRK
              </p>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-amber-500/90">
                <span>YAZIHANE</span>
                <span className="text-zinc-700">·</span>
                <span>1987</span>
                {calendarTitle && (
                  <span className="text-zinc-400 tracking-normal font-normal">
                    · {calendarTitle}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-1 truncate">
                {companyName || "Şirket"}
              </h1>
              <p className="text-sm text-zinc-500 mt-1">
                {officeTitle || "Panel"} · Gün {gameDay} ·{" "}
                {String(gameHour).padStart(2, "0")}:00 · Mazot {fuelPrice} ₺
              </p>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Kpi label="Kasa" value={formatMoney(balance)} hot />
                <Kpi label="İtibar" value={`${reputation}`} />
                <Kpi label="Filo" value={`${buses.length}`} />
                <Kpi label="Aktif" value={`${active.length}`} />
              </div>
            </div>
          </div>

          {(bankDebt > 0 || taxDue > 0 || mafiaDebtDue) && (
            <div className="relative border-t border-zinc-800 px-5 sm:px-7 py-2.5 flex flex-wrap gap-4 text-[11px]">
              {bankDebt > 0 && (
                <Link href="/office" className="text-red-400 hover:text-red-300">
                  Borç {formatMoney(bankDebt)}
                </Link>
              )}
              {taxDue > 0 && (
                <span className="text-amber-500">Vergi {formatMoney(taxDue)}</span>
              )}
              {mafiaDebtDue && (
                <span className="text-red-300 font-medium">Kapı — aidat</span>
              )}
            </div>
          )}
        </section>

        {/* CTA */}
        <Link
          href={hint.href}
          className="mb-6 flex items-center justify-between rounded-2xl border border-amber-600/30 bg-gradient-to-r from-amber-950/40 to-transparent px-5 py-4 hover:border-amber-500/50 transition"
        >
          <div>
            <div className="text-[10px] tracking-[0.2em] text-amber-600 font-bold">
              SONRAKİ HAMLE
            </div>
            <div className="text-sm sm:text-base text-amber-50 mt-0.5">
              {hint.t}
            </div>
          </div>
          <span className="text-amber-400 text-xl">→</span>
        </Link>

        <div className="grid lg:grid-cols-5 gap-4 mb-6">
          <section className="lg:col-span-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold">
                CANLI SEFERLER
              </h2>
              <Link
                href="/expeditions"
                className="text-[11px] text-amber-500/80 hover:text-amber-400"
              >
                Tümü
              </Link>
            </div>
            {active.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-zinc-600">Yolda araç yok</p>
                <Link
                  href="/expeditions"
                  className="inline-block mt-3 text-sm text-amber-500 hover:underline"
                >
                  Sefer oluştur
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {active.slice(0, 6).map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 px-3 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">
                        {e.origin} → {e.destination}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {e.status === "filling" ? "Dolum" : "Yolda"} ·{" "}
                        {e.soldTickets}/{e.maxSeats} · {e.ticketPrice} ₺
                      </div>
                    </div>
                    <div className="w-14 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
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

          <div className="lg:col-span-2 space-y-4">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold mb-2">
                GAZETE
              </div>
              {paper ? (
                <>
                  <h3 className="text-sm font-semibold leading-snug">
                    {paper.headline || paper.title}
                  </h3>
                  <p className="text-[12px] text-zinc-500 mt-1.5 line-clamp-3 leading-relaxed">
                    {paper.body}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openPaperEdition(morningPaper[0] ? "morning" : "evening")
                    }
                    className="mt-3 text-[11px] text-amber-500 hover:text-amber-400"
                  >
                    Baskıyı aç
                  </button>
                </>
              ) : (
                <p className="text-[12px] text-zinc-600 leading-relaxed">
                  Manşet yok. Saat dolunca üretilir; sen açarsın.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold">
                    TERMOS
                  </div>
                  <div className="text-3xl font-mono text-amber-400 mt-1">
                    %{Math.round(ağaEnergy)}
                  </div>
                  <div className="text-[11px] text-zinc-600">Stok {teaStock}</div>
                </div>
                <button
                  type="button"
                  onClick={() => drinkTea()}
                  className="px-3 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs hover:border-amber-700/50"
                >
                  Yudumla
                </button>
              </div>
            </section>

            {fleet && (
              <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <div className="text-[10px] tracking-[0.2em] text-zinc-500 font-bold">
                  BAŞ OTOBÜS
                </div>
                <div className="text-sm font-medium mt-1">{fleet.name}</div>
                <div className="text-[11px] font-mono text-zinc-500">
                  {fleet.plate} · %{fleet.engineHealth}
                </div>
                <Link
                  href="/garage"
                  className="text-[11px] text-amber-500/80 mt-2 inline-block"
                >
                  Garaj →
                </Link>
              </section>
            )}
          </div>
        </div>

        <h2 className="text-[10px] tracking-[0.2em] text-zinc-600 font-bold mb-3">
          ODALAR
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            ["/expeditions", "Seferler", "Kur & takip"],
            ["/garage", "Garaj", "Boya & tamir"],
            ["/office", "Ofis", "Banka & defter"],
            ["/terminal", "Terminal", "İnşaat"],
            ["/market", "Pazar", "Filo"],
            ["/staff", "Kadro", "Mülakat"],
            ["/map", "Harita", "Hatlar"],
            ["/lobby", "Lobi", "Rakip"],
            ["/events", "Etkinlik", "Açık oda"],
          ].map(([href, title, sub]) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-amber-700/35 hover:bg-zinc-900/70 px-4 py-3.5 min-h-[76px] flex flex-col justify-center transition"
            >
              <span className="text-sm font-semibold">{title}</span>
              <span className="text-[11px] text-zinc-500 mt-0.5">{sub}</span>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-center text-[10px] text-zinc-600 tracking-wide">
          Yurtta sulh, cihanda sulh · Gerçek para yok
        </p>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hot,
}: {
  label: string;
  value: string;
  hot?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/70 px-3 py-3">
      <div className="text-[9px] uppercase tracking-wider text-zinc-600">
        {label}
      </div>
      <div
        className={`text-lg font-semibold tabular-nums mt-0.5 truncate ${
          hot ? "text-amber-400" : "text-zinc-100"
        }`}
      >
        {value}
      </div>
    </div>
  );
}