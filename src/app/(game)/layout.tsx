"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";
import PhoneUI from "@/components/PhoneUI";
import NewspaperModal from "@/components/NewspaperModal";
import MafiaModal from "@/components/MafiaModal";
import MeetingModal from "@/components/MeetingModal";
import TicketReceipt from "@/components/TicketReceipt";
import ComplaintModal from "@/components/ComplaintModal";
import { CalendarMood } from "@/components/CalendarMood";

const NAV: { href: string; label: string; icon: string; needBoss?: boolean }[] =
  [
    { href: "/dashboard", label: "Panel", icon: "▣" },
    { href: "/shift", label: "Vardiya", icon: "◎" },
    { href: "/map", label: "Harita", icon: "◈", needBoss: true },
    { href: "/expeditions", label: "Sefer", icon: "▸", needBoss: true },
    { href: "/garage", label: "Garaj", icon: "▣", needBoss: true },
    { href: "/office", label: "Ofis", icon: "▤", needBoss: true },
    { href: "/terminal", label: "Terminal", icon: "▦", needBoss: true },
    { href: "/market", label: "Pazar", icon: "◇", needBoss: true },
    { href: "/lobby", label: "Lobi", icon: "◎" },
    { href: "/staff", label: "Kadro", icon: "☺", needBoss: true },
    { href: "/auction", label: "Borsa", icon: "⚡", needBoss: true },
  ];

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const balance = useGameStore((s) => s.balance);
  const reputation = useGameStore((s) => s.reputation);
  const companyName = useGameStore((s) => s.companyName);
  const gameDay = useGameStore((s) => s.gameDay);
  const gameHour = useGameStore((s) => s.gameHour);
  const gameYear = useGameStore((s) => s.gameYear);
  const paperNotify = useGameStore((s) => s.paperNotify);
  const openPaperEdition = useGameStore((s) => s.openPaperEdition);
  const clearPaperNotify = useGameStore((s) => s.clearPaperNotify);
  const tickGameTime = useGameStore((s) => s.tickGameTime);
  const forceRegister = useGameStore((s) => s.forceRegister);
  const isGuest = useGameStore((s) => s.isGuest);
  const setupDone = useGameStore((s) => s.setupDone);
  const bankDebt = useGameStore((s) => s.bankDebt);
  const taxDue = useGameStore((s) => s.taxDue);
  const mafiaDebtDue = useGameStore((s) => s.mafiaDebtDue);
  const calendarMood = useGameStore((s) => s.calendarMood);
  const calendarTitle = useGameStore((s) => s.calendarTitle);
  const fuelPrice = useGameStore((s) => s.fuelPrice);

  const careerStarted = useCareerStore((s) => s.careerStarted);
  const careerDone = useCareerStore((s) => s.careerDone);
  const rank = useCareerStore((s) => s.rank);
  const displayHitap = useCareerStore((s) => s.displayHitap);

  const isBoss = careerDone || setupDone || rank === "bagimsiz";

  // Saat / gün nabzı
  useEffect(() => {
    tickGameTime();
    const id = setInterval(() => tickGameTime(), 15000);
    return () => clearInterval(id);
  }, [tickGameTime]);

  // Misafir süresi
  useEffect(() => {
    if (forceRegister && isGuest) {
      // soft uyarı — hard redirect istersen /register
    }
  }, [forceRegister, isGuest]);

  const mourning = calendarMood === "mourning";
  const national = calendarMood === "national";

  return (
    <div
      className={`min-h-screen text-zinc-100 flex flex-col ${
        mourning ? "bg-black" : national ? "bg-[#0c0a06]" : "bg-zinc-950"
      }`}
    >
      <CalendarMood />

      {/* Üst şerit */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-md ${
          mourning
            ? "border-zinc-800 bg-black/90"
            : "border-zinc-800/80 bg-zinc-950/90"
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 py-2 flex flex-wrap items-center gap-2 justify-between">
          <div className="min-w-0">
            <div className="text-[10px] tracking-[0.2em] text-amber-600 font-bold">
              OTOGAR TYCOON · {gameYear || 1987}
            </div>
            <div className="font-semibold text-sm truncate">
              {companyName || displayHitap || "Yazıhane"}
            </div>
            <div className="text-[10px] text-zinc-500">
              Gün {gameDay} · {String(gameHour).padStart(2, "0")}:00
              {calendarTitle ? ` · ${calendarTitle}` : ""}
              {" · "}mazot {fuelPrice} ₺
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="text-right">
              <div className="font-mono text-emerald-400 text-sm">
                {formatMoney(balance)}
              </div>
              <div className="text-zinc-500">itibar {reputation}</div>
            </div>
            {(bankDebt > 0 || taxDue > 0) && (
              <button
                type="button"
                onClick={() => router.push("/office")}
                className="text-[10px] px-2 py-1 rounded border border-red-900/60 text-red-300"
              >
                Borç {bankDebt > 0 ? formatMoney(bankDebt) : ""}
                {taxDue > 0 ? ` · vergi` : ""}
              </button>
            )}
            {mafiaDebtDue && (
              <span className="text-[10px] px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800 animate-pulse">
                Kapı
              </span>
            )}
            {paperNotify && (
              <button
                type="button"
                onClick={() => openPaperEdition(paperNotify)}
                className="text-[10px] px-2 py-1 rounded bg-amber-900/40 text-amber-200 border border-amber-800"
              >
                Gazete
                {paperNotify === "evening" ? " (akşam)" : " (sabah)"}
              </button>
            )}
            {forceRegister && isGuest && (
              <Link
                href="/register"
                className="text-[10px] px-2 py-1 rounded bg-cyan-900/50 text-cyan-200 border border-cyan-800"
              >
                Hesap aç
              </Link>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-2 pb-2 flex gap-1 overflow-x-auto text-[11px]">
          {NAV.map((item) => {
            if (item.needBoss && !isBoss && careerStarted) {
              return null;
            }
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg border ${
                  active
                    ? "border-amber-600 bg-amber-950/40 text-amber-100"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="mr-1 opacity-70">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Yas / bayram şeridi */}
      {(mourning || national) && (
        <div
          className={`text-center text-[11px] py-1.5 font-semibold tracking-wide ${
            mourning
              ? "bg-zinc-900 text-zinc-400"
              : "bg-amber-950/50 text-amber-200"
          }`}
        >
          {mourning
            ? "Saygı günü — peronlar sessiz"
            : `Ulusal coşku — ${calendarTitle || "bayram"}`}
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto">{children}</main>

      {/* Alt mobilde hızlı link */}
      <footer className="md:hidden sticky bottom-0 z-20 border-t border-zinc-800 bg-zinc-950/95 px-2 py-1.5 flex justify-around text-[10px] text-zinc-500">
        <Link href="/shift">Vardiya</Link>
        <Link href="/dashboard">Panel</Link>
        <Link href="/lobby">Lobi</Link>
        <Link href="/office">Ofis</Link>
        <button
          type="button"
          onClick={() => {
            if (paperNotify) openPaperEdition(paperNotify);
            else openPaperEdition("morning");
          }}
        >
          Gazete
        </button>
      </footer>

      {/* Modallar / ambient UI */}
      <PhoneUI />
      <NewspaperModal />
      <MafiaModal />
      <MeetingModal />
      <TicketReceipt />
      <ComplaintModal />
    </div>
  );
}