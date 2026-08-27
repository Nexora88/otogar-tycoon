"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import ComplaintModal from "@/components/ComplaintModal";

const menuItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/garage", label: "Garaj", icon: Warehouse },
  { href: "/expeditions", label: "Seferler", icon: Route },
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
  const { companyName, balance, reputation, isGuest, bankDebt, taxDue } =
    useGameStore();
  const [open, setOpen] = useState(false);

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {menuItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              active
                ? "bg-amber-500/15 text-amber-400"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`}
          >
            <Icon className={`w-4 h-4 shrink-0 ${active ? "text-amber-400" : ""}`} />
            {item.label}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0a0a0b] text-zinc-100">
      {/* Mobil üst bar */}
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-[#0a0a0b]/95 backdrop-blur">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Bus className="w-4 h-4 text-black" />
          </div>
          <div className="min-w-0">
            <div className="font-bold text-sm truncate">{companyName}</div>
            <div className="text-[10px] text-amber-400">{formatMoney(balance)}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-lg border border-zinc-700"
          aria-label="Menü"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)}>
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 bg-[#0a0a0b] border-r border-zinc-800 p-3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex-1 space-y-0.5 pt-2">
              <NavLinks onNavigate={() => setOpen(false)} />
            </nav>
            <div className="border-t border-zinc-800 pt-3 text-xs text-zinc-500 space-y-1">
              <div>İtibar {reputation}/100</div>
              {bankDebt > 0 && <div className="text-red-400">Borç {formatMoney(bankDebt)}</div>}
              <Link href="/" className="flex items-center gap-2 text-zinc-500 pt-2">
                <LogOut className="w-3.5 h-3.5" /> Çıkış
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Masaüstü sidebar */}
      <aside className="hidden md:flex w-60 lg:w-64 border-r border-zinc-800 flex-col shrink-0">
        <div className="p-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Bus className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-bold text-sm">Otogar Tycoon</div>
            <div className="text-[10px] text-zinc-500 tracking-wider uppercase">
              Peron Savaşları
            </div>
          </div>
        </div>
        <div className="p-4 border-b border-zinc-800">
          <div className="text-[10px] text-zinc-500">Şirket</div>
          <div className="font-medium text-sm truncate">{companyName}</div>
          {isGuest && <div className="mt-1 text-[10px] text-amber-500/90">Misafir</div>}
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <div>
            <div className="text-[10px] text-zinc-500">Kasa</div>
            <div className="text-lg font-bold text-amber-400">{formatMoney(balance)}</div>
          </div>
          <div className="text-sm">İtibar {reputation}/100</div>
          {bankDebt > 0 && (
            <div className="text-xs text-red-400">Borç {formatMoney(bankDebt)}</div>
          )}
          {taxDue > 0 && (
            <div className="text-xs text-amber-600">Vergi {formatMoney(taxDue)}</div>
          )}
          <Link href="/" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-red-400 pt-2">
            <LogOut className="w-3.5 h-3.5" /> Çıkış
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0 pb-20 md:pb-0">{children}</main>

      {/* Mobil alt sekme */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-zinc-800 bg-[#0a0a0b]/95 backdrop-blur flex justify-around py-2 safe-area-pb">
        {menuItems.slice(0, 5).map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 ${
                active ? "text-amber-400" : "text-zinc-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <ComplaintModal />
    </div>
  );
                }
