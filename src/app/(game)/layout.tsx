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
import InspectorModal from "@/components/InspectorModal";

const NAV: {
  href: string;
  label: string;
  needBoss?: boolean;
}[] = [
  { href: "/dashboard", label: "Panel" },
  { href: "/shift", label: "Vardiya" },
  { href: "/map", label: "Harita", needBoss: true },
  { href: "/expeditions", label: "Seferler", needBoss: true },
  { href: "/garage", label: "Garaj", needBoss: true },
  { href: "/office", label: "Ofis", needBoss: true },
  { href: "/terminal", label: "Terminal", needBoss: true },
  { href: "/market", label: "Pazar", needBoss: true },
  { href: "/staff", label: "Kadro", needBoss: true },
  { href: "/events", label: "Etkinlik" },
  { href: "/lobby", label: "Lobi" },
  { href: "/auction", label: "Borsa", needBoss: true },
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
  const inspector = useGameStore((s) => s.inspector);

  const careerStarted = useCareerStore((s) => s.careerStarted);
  const careerDone = useCareerStore((s) => s.careerDone);
  const rank = useCareerStore((s) => s.rank);

  const isBoss = careerDone || setupDone || rank === "bagimsiz";

  useEffect(() => {
    tickGameTime();
    const id = setInterval(() => tickGameTime(), 15000);
    return () => clearInterval(id);
  }, [tickGameTime]);

  const mourning = calendarMood === "mourning";
  const national = calendarMood === "national";

  return (
    <div
      className={`min-h-screen text-zinc-100 flex ${
        mourning ? "bg-black" : "bg-zinc-950"
      }`}
    >
      {/* Sol menü — masaüstü */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950/95">
        <div className="p-4 border-b border-zinc-800">
          <div className="text-[10px] tracking-[0.2em] text-amber-600 font-bold">
            OTOGAR TYCOON
          </div>
          <div className="text-sm font-semibold mt-1 truncate">
            {companyName || "Yazıhane"}
          </div>
          <div className="text-[10px] text-zinc-500 mt-0.5">
            {gameYear || 1987} · Gün {gameDay} ·{" "}
            {String(gameHour).padStart(2, "0")}:00
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {NAV.map((item) => {
            if (item.needBoss && !isBoss && careerStarted) return null;
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  active
                    ? "bg-amber-950/50 text-amber-100 border border-amber-800/50"
                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-zinc-800 text-[10px] text-zinc-600 space-y-1">
          <div className="font-mono text-emerald-400/90 text-xs">
            {formatMoney(balance)}
          </div>
          <div>İtibar {reputation} · Mazot {fuelPrice} ₺</div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* İnce üst bar */}
        <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
          <div className="px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 justify-between">
            <div className="md:hidden min-w-0">
              <div className="text-[10px] text-amber-600 font-bold tracking-wider">
                OTOGAR · {gameYear || 1987}
              </div>
              <div className="text-sm font-semibold truncate">
                {companyName}
              </div>
            </div>
            <div className="hidden md:block text-xs text-zinc-500">
              {calendarTitle || "Peron açık"}
              {national ? " · Coşku" : ""}
              {mourning ? " · Saygı" : ""}
            </div>

            <div className="flex items-center gap-2 text-xs flex-wrap justify-end">
              <div className="text-right">
                <div className="font-mono text-emerald-400 text-sm">
                  {formatMoney(balance)}
                </div>
                <div className="text-zinc-500 md:hidden">itibar {reputation}</div>
              </div>
              {(bankDebt > 0 || taxDue > 0) && (
                <button
                  type="button"
                  onClick={() => router.push("/office")}
                  className="text-[10px] px-2 py-1 rounded border border-red-900/50 text-red-300"
                >
                  Borç {formatMoney(bankDebt || taxDue)}
                </button>
              )}
              {mafiaDebtDue && (
                <span className="text-[10px] px-2 py-1 rounded bg-red-950 text-red-300 border border-red-800">
                  Kapı
                </span>
              )}
              {inspector && (
                <span className="text-[10px] px-2 py-1 rounded bg-amber-950 text-amber-200 border border-amber-800">
                  Müfettiş
                </span>
              )}
              {paperNotify && (
                <button
                  type="button"
                  onClick={() => openPaperEdition(paperNotify)}
                  className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-300"
                >
                  Gazete
                </button>
              )}
              {forceRegister && isGuest && (
                <Link
                  href="/register"
                  className="text-[10px] px-2 py-1 rounded border border-cyan-800 text-cyan-300"
                >
                  Hesap
                </Link>
              )}
            </div>
          </div>

          {/* Mobil yatay menü */}
          <nav className="md:hidden flex gap-1 overflow-x-auto px-2 pb-2 text-[11px]">
            {NAV.map((item) => {
              if (item.needBoss && !isBoss && careerStarted) return null;
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 px-2.5 py-1 rounded-lg ${
                    active
                      ? "bg-amber-950/50 text-amber-100 border border-amber-800/40"
                      : "text-zinc-500 border border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        {(mourning || national) && (
          <div
            className={`text-center text-[11px] py-1 font-medium ${
              mourning
                ? "bg-zinc-900 text-zinc-400"
                : "bg-amber-950/40 text-amber-200"
            }`}
          >
            {mourning
              ? "Saygı günü — peronlar sakin"
              : calendarTitle || "Ulusal coşku"}
          </div>
        )}

        <main className="flex-1 w-full">{children}</main>
      </div>

      <PhoneUI />
      <NewspaperModal />
      <MafiaModal />
      <MeetingModal />
      <TicketReceipt />
      <InspectorModal />
    </div>
  );
}