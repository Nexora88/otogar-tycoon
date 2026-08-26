"use client";

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
} from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import ComplaintModal from "@/components/ComplaintModal";

const menuItems = [
  { href: "/dashboard", label: "Panel", icon: LayoutDashboard },
  { href: "/garage", label: "Garaj", icon: Warehouse },
  { href: "/expeditions", label: "Seferler", icon: Route },
  { href: "/office", label: "Ofis", icon: Landmark },
  { href: "/terminal", label: "Terminalim", icon: Building2 },
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

  return (
    <div className="min-h-screen flex bg-[#0a0a0b]">
      <aside className="w-64 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Bus className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">Otogar Tycoon</div>
            <div className="text-xs text-zinc-500">Peron Savaşları</div>
          </div>
        </div>

        <div className="p-4 border-b border-zinc-800">
          <div className="text-xs text-zinc-500 mb-1">Şirket</div>
          <div className="font-medium truncate">{companyName}</div>
          {isGuest && (
            <div className="mt-1 text-xs text-amber-500/80">Misafir Modu</div>
          )}
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 space-y-3">
          <div>
            <div className="text-xs text-zinc-500">Kasa</div>
            <div className="text-lg font-bold text-amber-400">
              {formatMoney(balance)}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">İtibar</div>
            <div className="text-sm font-medium">{reputation}/100</div>
          </div>
          {bankDebt > 0 && (
            <div>
              <div className="text-xs text-zinc-500">Banka borcu</div>
              <div className="text-sm text-red-400/90">{formatMoney(bankDebt)}</div>
            </div>
          )}
          {taxDue > 0 && (
            <div>
              <div className="text-xs text-zinc-500">Vergi</div>
              <div className="text-sm text-amber-600/90">{formatMoney(taxDue)}</div>
            </div>
          )}

          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition mt-2"
          >
            <LogOut className="w-4 h-4" />
            Çıkış
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto min-w-0">{children}</main>

      <ComplaintModal />
    </div>
  );
}