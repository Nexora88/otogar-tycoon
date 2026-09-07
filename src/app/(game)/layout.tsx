"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore, RANK_LABEL } from "@/store/careerStore";
import { TelsizTicker } from "@/components/TelsizTicker";
import NewspaperModal from "@/components/NewspaperModal";
import PhoneUI from "@/components/PhoneUI";
import { formatMoney } from "@/lib/utils";
import {
  LayoutDashboard,
  Bus,
  Route,
  Building2,
  Map,
  Store,
  Warehouse,
  Radio,
  Users,
  Briefcase,
  Newspaper,
} from "lucide-react";

const NAV: {
  href: string;
  label: string;
  icon: React.ElementType;
  /** true = sadece ağa (careerDone) */
  tycoonOnly?: boolean;
}[] = [
  { href: "/shift", label: "Vardiya", icon: Briefcase },
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/map", label: "Harita", icon: Map, tycoonOnly: true },
  { href: "/expeditions", label: "Seferler", icon: Route, tycoonOnly: true },
  { href: "/garage", label: "Garaj", icon: Bus, tycoonOnly: true },
  { href: "/market", label: "Pazar", icon: Store, tycoonOnly: true },
  { href: "/office", label: "Ofis", icon: Building2, tycoonOnly: true },
  { href: "/terminal", label: "Terminal", icon: Warehouse, tycoonOnly: true },
  { href: "/staff", label: "Kadro", icon: Users, tycoonOnly: true },
  { href: "/lobby", label: "Lobi", icon: Radio },
];

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const balance = useGameStore((s) => s.balance);
  const reputation = useGameStore((s) => s.reputation);
  const companyName = useGameStore((s) => s.companyName);
  const gameDay = useGameStore((s) => s.gameDay);
  const gameHour = useGameStore((s) => s.gameHour);
  const paperNotify = useGameStore((s) => s.paperNotify);
  const mafiaDebtDue = useGameStore((s) => s.mafiaDebtDue);
  const activeBoss = useGameStore((s) => s.activeBoss);
  const openNewspaper = useGameStore((s) => s.openNewspaper);
  const openPaperEdition = useGameStore((s) => s.openPaperEdition);
  const tickGameTime = useGameStore((s) => s.tickGameTime);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);

  const careerStarted = useCareerStore((s) => s.careerStarted);
  const careerDone = useCareerStore((s) => s.careerDone);
  const rank = useCareerStore((s) => s.rank);
  const displayHitap = useCareerStore((s) => s.displayHitap);
  const savings = useCareerStore((s) => s.savings);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => tickGameTime(), 4000);
    return () => clearInterval(id);
  }, [tickGameTime]);

  const isCirak = careerStarted && !careerDone;

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex flex-col md:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-56 flex-col border-r border-zinc-800/80 bg-zinc-950/90">
        <div className="p-4 border-b border-zinc-800">
          <div className="text-[10px] tracking-[0.2em] text-amber-600 font-bold">
            OTOGAR TYCOON
          </div>
          <div className="text-sm font-semibold mt-1 truncate">
            {isCirak ? displayHitap || "Çırak" : companyName}
          </div>
          <div className="text-[11px] text-zinc-500 mt-0.5">
            1987 · Gün {gameDay} · {String(gameHour).padStart(2, "0")}:00
          </div>
          {isCirak && (
            <div className="mt-2 text-[10px] px-2 py-1 rounded bg-amber-950/50 text-amber-400 border border-amber-900/40">
              {RANK_LABEL[rank]} · birikim {savings} ₺
            </div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5">
          {NAV.map((item) => {
            const locked = item.tycoonOnly && isCirak;
            const active = path.startsWith(item.href);
            const Icon = item.icon;
            if (locked) {
              return (
                <div
                  key={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-zinc-600 cursor-not-allowed"
                  title="Bağımsız olunca açılır"
                >
                  <Icon className="w-4 h-4 opacity-40" />
                  {item.label}
                  <span className="ml-auto text-[9px] opacity-50">🔒</span>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                  active
                    ? "bg-amber-500/15 text-amber-300 border border-amber-700/40"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <TelsizTicker />

        <div className="p-3 border-t border-zinc-800 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Kasa</span>
            <span className="font-mono text-emerald-400">
              {mounted ? formatMoney(balance) : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">İtibar</span>
            <span className="text-cyan-400">{reputation}</span>
          </div>
          <button
            type="button"
            onClick={() => openNewspaper()}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-zinc-700 text-xs hover:border-amber-600"
          >
            <Newspaper className="w-3.5 h-3.5" />
            Gazete
            {paperNotify && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setPhoneOpen(true)}
            className="w-full py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-xs"
          >
            Telefon
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar mobile + desktop strip */}
        <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-[#0a0c10]/95 backdrop-blur px-3 py-2 flex items-center gap-3">
          <div className="md:hidden text-[10px] font-bold text-amber-600 tracking-widest">
            OTOGAR
          </div>
          <div className="flex-1 text-xs text-zinc-500 truncate">
            {mounted && (
              <>
                Gün {gameDay} · {String(gameHour).padStart(2, "0")}:00 ·{" "}
                <span className="text-emerald-400/90">
                  {formatMoney(balance)}
                </span>
              </>
            )}
          </div>
          {mafiaDebtDue && (
            <Link
              href="/office"
              className="text-[10px] px-2 py-1 rounded bg-red-950 border border-red-800 text-red-300 animate-pulse"
            >
              {activeBoss?.bossName || "Aidat"}!
            </Link>
          )}
          {paperNotify && (
            <button
              type="button"
              onClick={() => openPaperEdition(paperNotify)}
              className="text-[10px] px-2 py-1 rounded bg-amber-950 border border-amber-800 text-amber-300"
            >
              {paperNotify === "morning" ? "Sabah baskı" : "Akşam baskı"}
            </button>
          )}
        </header>

        <main className="flex-1 overflow-auto pb-20 md:pb-6">{children}</main>

        {/* Mobile nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur flex overflow-x-auto">
          {NAV.filter((n) => !n.tycoonOnly || !isCirak)
            .slice(0, 6)
            .map((item) => {
              const Icon = item.icon;
              const active = path.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 min-w-[4.5rem] flex flex-col items-center py-2 text-[10px] ${
                    active ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </div>

      <NewspaperModal />
      <PhoneUI />
    </div>
  );
}