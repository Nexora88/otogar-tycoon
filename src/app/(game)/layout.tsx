"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Warehouse,
  Route,
  ShoppingBag,
  Building2,
  Landmark,
  LogOut,
  Bus,
  Menu,
  X,
  MapPin,
  Users,
  Coffee,
  Swords,
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";
import ComplaintModal from "@/components/ComplaintModal";
import PhoneUI from "@/components/PhoneUI";
import TicketReceipt from "@/components/TicketReceipt";
import NewspaperModal from "@/components/NewspaperModal";
import InspectorModal from "@/components/InspectorModal";
import MeetingModal from "@/components/MeetingModal";
import ForceRegisterModal from "@/components/ForceRegisterModal";
import PaperToast from "@/components/PaperToast";

const menuItems = [
  { href: "/shift", label: "Vardiya", icon: Coffee },
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/map", label: "Harita", icon: MapPin },
  { href: "/lobby", label: "Lobi", icon: Swords },
  { href: "/garage", label: "Garaj", icon: Warehouse },
  { href: "/expeditions", label: "Seferler", icon: Route },
  { href: "/staff", label: "Kadro", icon: Users },
  { href: "/office", label: "Ofis", icon: Landmark },
  { href: "/terminal", label: "Terminal", icon: Building2 },
  { href: "/market", label: "Pazar", icon: ShoppingBag },
];

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const companyName = useGameStore((s) => s.companyName);
  const balance = useGameStore((s) => s.balance);
  const reputation = useGameStore((s) => s.reputation);
  const isGuest = useGameStore((s) => s.isGuest);
  const bankDebt = useGameStore((s) => s.bankDebt);
  const taxDue = useGameStore((s) => s.taxDue);
  const gameDay = useGameStore((s) => s.gameDay);
  const gameHour = useGameStore((s) => s.gameHour);
  const gameYear = useGameStore((s) => s.gameYear);
  const tickGameTime = useGameStore((s) => s.tickGameTime);
  const openPaperEdition = useGameStore((s) => s.openPaperEdition);
  const newspaperSeenDay = useGameStore((s) => s.newspaperSeenDay);
  const drinkTea = useGameStore((s) => s.drinkTea);
  const teaStock = useGameStore((s) => s.teaStock);
  const ağaEnergy = useGameStore((s) => s.ağaEnergy);
  const fuelPrice = useGameStore((s) => s.fuelPrice);

  const patronCalling = useCareerStore((s) => s.patronCalling);
  const careerStarted = useCareerStore((s) => s.careerStarted);
  const displayHitap = useCareerStore((s) => s.displayHitap);
  const syncShift = useCareerStore((s) => s.syncShiftFromClock);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    tickGameTime?.();
    const t = setInterval(() => {
      tickGameTime?.();
      syncShift?.();
    }, 5000);
    return () => clearInterval(t);
  }, [tickGameTime, syncShift]);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {menuItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        const badge = item.href === "/shift" && patronCalling;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition relative ${
              active
                ? "bg-cyan-500/10 text-cyan-300"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`}
          >
            <Icon
              className={`w-4 h-4 shrink-0 ${active ? "text-cyan-400" : ""}`}
            />
            {item.label}
            {badge && (
              <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0D0D1A] text-zinc-100">
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#0D0D1A]/95">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg,#7B2CFF,#00F0FF)",
            }}
          >
            <Bus className="w-4 h-4 text-[#0D0D1A]" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">
              {careerStarted && displayHitap ? displayHitap : companyName}
            </div>
            <div className="text-[10px] text-cyan-400">
              {formatMoney(balance)}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {patronCalling && (
            <Link
              href="/shift"
              className="text-[10px] px-2 py-1 rounded bg-amber-600 text-black font-bold"
            >
              PATRON
            </Link>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-lg border border-zinc-700"
            aria-label="Menü"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#0D0D1A] border-r border-zinc-800 p-3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 space-y-0.5 pt-2 overflow-y-auto">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>
            <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500">
              <div>
                Gün {gameDay} · {String(gameHour ?? 0).padStart(2, "0")}:00
              </div>
              <Link href="/" className="flex items-center gap-2 pt-2">
                <LogOut className="w-3.5 h-3.5" /> Çıkış
              </Link>
            </div>
          </aside>
        </div>
      )}

      <aside className="hidden md:flex w-60 lg:w-64 border-r border-zinc-800 flex-col shrink-0">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#7B2CFF,#00F0FF)",
            }}
          >
            <Bus className="w-5 h-5 text-[#0D0D1A]" />
          </div>
          <div>
            <div className="font-bold text-sm">Otogar Tycoon</div>
            <div className="text-[10px] text-zinc-500 tracking-wider uppercase">
              Peron Savaşları · 1987
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-zinc-800">
          <div className="text-[10px] text-zinc-500">
            {careerStarted ? "Hitap / Şirket" : "Şirket"}
          </div>
          <div className="font-medium text-sm truncate">
            {careerStarted && displayHitap ? displayHitap : companyName}
          </div>
          {isGuest && (
            <div className="mt-1 text-[10px] text-cyan-500/90">Misafir</div>
          )}
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-2 text-xs">
          <div className="text-lg font-bold text-cyan-400">
            {formatMoney(balance)}
          </div>
          <div>İtibar {reputation}/100</div>
          <div className="text-zinc-500">
            Gün {gameDay} · {String(gameHour ?? 0).padStart(2, "0")}:00 ·{" "}
            {gameYear ?? 1987}
          </div>
          {fuelPrice != null && (
            <div className="text-amber-600/90">Mazot {fuelPrice} ₺</div>
          )}
          <button
            type="button"
            onClick={() => openPaperEdition?.("morning")}
            className="block text-left text-amber-500/90"
          >
            📰 Sabah
            {newspaperSeenDay != null && newspaperSeenDay < gameDay
              ? " · YENİ"
              : ""}
          </button>
          <button
            type="button"
            onClick={() => openPaperEdition?.("evening")}
            className="block text-left text-amber-600/80"
          >
            📰 Akşam
          </button>
          <button
            type="button"
            onClick={() => drinkTea?.()}
            className="block text-left text-zinc-400"
          >
            ☕ Çay ({teaStock ?? 0}) · Enerji %
            {Math.round(ağaEnergy ?? 0)}
          </button>
          {patronCalling && (
            <Link
              href="/shift"
              className="block text-left text-amber-400 font-bold animate-pulse"
            >
              ⚠ Patron çağırdı
            </Link>
          )}
          {bankDebt > 0 && (
            <div className="text-red-400">Borç {formatMoney(bankDebt)}</div>
          )}
          {taxDue > 0 && (
            <div className="text-amber-600">Vergi {formatMoney(taxDue)}</div>
          )}
          <Link
            href="/"
            className="flex items-center gap-2 text-zinc-500 hover:text-red-400 pt-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Çıkış
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0 pb-20 md:pb-0">
        {children}
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-zinc-800 bg-[#0D0D1A]/95 flex justify-around py-2">
        {[
          menuItems[0],
          menuItems[1],
          menuItems[2],
          menuItems[5],
          menuItems[3],
        ].map((item) => {
          if (!item) return null;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-1 relative ${
                active ? "text-cyan-400" : "text-zinc-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px]">{item.label}</span>
              {item.href === "/shift" && patronCalling && (
                <span className="absolute top-0 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      <ComplaintModal />
      <PhoneUI />
      <TicketReceipt />
      <NewspaperModal />
      <InspectorModal />
      <MeetingModal />
      <ForceRegisterModal />
      <PaperToast />
    </div>
  );
}