"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import {
  Route,
  Warehouse,
  Building2,
  Landmark,
  ShoppingBag,
  Bus,
} from "lucide-react";

export default function DashboardPage() {
  const { companyName, balance, reputation, buses, expeditions, bankDebt, taxDue } =
    useGameStore();

  const active = expeditions.filter((e) => e.status !== "completed").length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">{companyName}</h1>
      <p className="text-zinc-400 text-sm mb-8">Panel — günlük özet</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Card label="Kasa" value={formatMoney(balance)} accent />
        <Card label="İtibar" value={`${reputation}/100`} />
        <Card label="Filo" value={`${buses.length} araç`} />
        <Card label="Aktif sefer" value={`${active}`} />
      </div>

      {(bankDebt > 0 || taxDue > 0) && (
        <div className="mb-6 text-sm text-zinc-400 flex flex-wrap gap-4">
          {bankDebt > 0 && (
            <span>
              Borç: <span className="text-red-400">{formatMoney(bankDebt)}</span>
            </span>
          )}
          {taxDue > 0 && (
            <span>
              Vergi: <span className="text-amber-500">{formatMoney(taxDue)}</span>
            </span>
          )}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Quick href="/expeditions" icon={Route} title="Seferler" desc="Yola çık" />
        <Quick href="/garage" icon={Warehouse} title="Garaj" desc="Boya & plaka" />
        <Quick href="/office" icon={Landmark} title="Ofis" desc="Muhasebe & banka" />
        <Quick href="/terminal" icon={Building2} title="Terminalim" desc="İnşaat" />
        <Quick href="/market" icon={ShoppingBag} title="Pazar" desc="Otobüs al" />
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3 opacity-60">
          <Bus className="w-5 h-5 text-zinc-500" />
          <div>
            <div className="font-medium text-sm">İlk otobüs</div>
            <div className="text-xs text-zinc-500">{buses[0]?.name} · {buses[0]?.plate}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{label}</div>
      <div className={`text-lg font-bold mt-1 ${accent ? "text-amber-400" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Quick({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-amber-500/40 transition flex items-center gap-3"
    >
      <Icon className="w-5 h-5 text-amber-400 shrink-0" />
      <div>
        <div className="font-medium text-sm">{title}</div>
        <div className="text-xs text-zinc-500">{desc}</div>
      </div>
    </Link>
  );
}