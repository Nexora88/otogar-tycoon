"use client";

import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Bus, Route, Warehouse, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  const { companyName, balance, reputation, buses, isGuest } = useGameStore();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Hoş geldin, {companyName}</h1>
        <p className="text-zinc-400 mt-1">
          {isGuest
            ? "Misafir olarak oynuyorsun. İlerledikçe kayıt olmanı önereceğiz."
            : "Şirketinin genel durumu burada."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard title="Kasa" value={formatMoney(balance)} icon={<TrendingUp className="w-5 h-5 text-amber-400" />} />
        <StatCard title="İtibar" value={`${reputation}/100`} icon={<TrendingUp className="w-5 h-5 text-green-400" />} />
        <StatCard title="Filo" value={`${buses.length} Otobüs`} icon={<Bus className="w-5 h-5 text-blue-400" />} />
        <StatCard title="Aktif Sefer" value="0" icon={<Route className="w-5 h-5 text-purple-400" />} />
      </div>

      <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickAction href="/garage" title="Garaja Git" description="Otobüslerini gör, boya, bakım yaptır" icon={<Warehouse className="w-6 h-6" />} />
        <QuickAction href="/expeditions" title="Sefer Koy" description="Yeni sefer oluştur, yolcu topla" icon={<Route className="w-6 h-6" />} />
        <QuickAction href="/market" title="Pazara Git" description="Yeni otobüs al veya sat" icon={<Bus className="w-6 h-6" />} />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-zinc-400">{title}</span>
        {icon}
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function QuickAction({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <Link href={href} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-amber-500/50 hover:bg-zinc-900/80 transition group">
      <div className="w-11 h-11 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition">
        {icon}
      </div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{description}</p>
    </Link>
  );
}