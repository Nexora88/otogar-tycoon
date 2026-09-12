"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Newspaper, Coffee, BusFront } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { TycoonHud, TerminalScene, DecisionCard, LiveOperations } from "./TycoonTerminal";

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
  const mafiaDebtDue = useGameStore((s) => s.mafiaDebtDue);
  const openPaperEdition = useGameStore((s) => s.openPaperEdition);
  const morningPaper = useGameStore((s) => s.morningPaper);
  const eveningPaper = useGameStore((s) => s.eveningPaper);
  const drinkTea = useGameStore((s) => s.drinkTea);
  const teaStock = useGameStore((s) => s.teaStock);
  const ağaEnergy = useGameStore((s) => s.ağaEnergy);
  const calendarTitle = useGameStore((s) => s.calendarTitle);

  const active = useMemo(() => expeditions.filter((e) => e.status === "filling" || e.status === "departed"), [expeditions]);
  const paper = morningPaper[0] || eveningPaper[0];
  const occupancy = active.length ? Math.round(active.reduce((n, e) => n + e.soldTickets / Math.max(1, e.maxSeats), 0) / active.length * 100) : 0;

  const hint = useMemo(() => {
    if (mafiaDebtDue) return { href: "/office", title: "Kapıda aidat var", text: "Ofisi aç ve kasayı kontrol et." };
    if (bankDebt > 0 && bankDebt >= balance) return { href: "/office", title: "Banka borcu kritik", text: "Ödeme planını gözden geçir." };
    if (active.length === 0 && buses.length > 0) return { href: "/expeditions", title: "Filo boşta", text: "Bir hat seç ve perona sefer koy." };
    if (reputation < 40) return { href: "/staff", title: "İtibar düşüyor", text: "Kadro ve müşteri hizmetlerine bak." };
    return { href: "/map", title: "Otogar hazır", text: "Haritadan yeni bir hat seç." };
  }, [mafiaDebtDue, bankDebt, balance, active.length, buses.length, reputation]);

  return <main className="min-h-full bg-[#080b0d] text-stone-100 overflow-hidden">
    <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-7 py-3 pb-28">
      <TycoonHud companyName={companyName || "Yeni Şirket"} gameDay={gameDay} gameHour={gameHour} balance={formatMoney(balance)} reputation={reputation} buses={buses.length} fuelPrice={fuelPrice} occupancy={occupancy}/>
      <TerminalScene occupancy={occupancy}/>

      <section className="grid lg:grid-cols-3 gap-3 mt-3">
        <div className="lg:col-span-2"><DecisionCard href={hint.href} title={hint.title} text={hint.text}/></div>
        <div className="rounded-2xl border border-white/10 bg-[#101519] p-4">
          <div className="flex items-center gap-2 text-cyan-300"><Newspaper size={15}/><b className="text-[9px] tracking-[.2em]">BUGÜNÜN MANŞETİ</b></div>
          {paper ? <><h3 className="mt-2 text-sm font-bold line-clamp-2">{paper.headline || paper.title}</h3><p className="mt-1 text-[10px] text-stone-500 line-clamp-2">{paper.body}</p><button onClick={() => openPaperEdition(morningPaper[0] ? "morning" : "evening")} className="mt-2 text-[10px] font-black text-cyan-400">GAZETEYİ AÇ →</button></> : <p className="mt-2 text-xs text-stone-600">Yeni baskı bekleniyor.</p>}
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-3 mt-3">
        <div className="lg:col-span-2"><LiveOperations active={active}/></div>
        <div className="space-y-3">
          <div className="rounded-2xl border border-orange-400/15 bg-[#15120f] p-4"><div className="flex items-center gap-2 text-orange-300"><Coffee size={15}/><b className="text-[9px] tracking-[.2em]">AĞA ENERJİSİ</b></div><div className="mt-2 flex items-end justify-between"><strong className="text-3xl text-orange-200">%{Math.round(ağaEnergy)}</strong><button onClick={() => drinkTea()} disabled={teaStock <= 0} className="rounded-xl border border-orange-400/20 bg-orange-400/10 px-3 py-2 text-[9px] font-black text-orange-300 disabled:opacity-30">ÇAY · {teaStock}</button></div><div className="mt-3 h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-300" style={{ width: `${Math.min(100, ağaEnergy)}%` }}/></div></div>
          {buses[0] && <div className="rounded-2xl border border-emerald-400/15 bg-[#0d1512] p-4"><div className="flex items-center gap-2 text-emerald-400"><BusFront size={15}/><b className="text-[9px] tracking-[.2em]">BAŞ OTOBÜS</b></div><div className="mt-2 text-sm font-black">{buses[0].name}</div><div className="text-[10px] text-stone-500">{buses[0].plate} · motor %{buses[0].engineHealth}</div><Link href="/garage" className="mt-2 inline-block text-[10px] font-black text-emerald-400">GARAJA GİT →</Link></div>}
          {(taxDue > 0 || bankDebt > 0 || mafiaDebtDue) && <div className="rounded-2xl border border-red-400/15 bg-red-950/10 p-4"><b className="text-[9px] tracking-[.2em] text-red-400">DİKKAT</b><div className="mt-2 space-y-1 text-[10px] text-stone-400">{bankDebt > 0 && <Link href="/office" className="block hover:text-red-300">Banka borcu: {formatMoney(bankDebt)} →</Link>}{taxDue > 0 && <div>Vergi: {formatMoney(taxDue)}</div>}{mafiaDebtDue && <div className="text-orange-300">Kapıda aidat talebi var</div>}</div></div>}
        </div>
      </section>

      <div className="mt-6 text-center text-[8px] tracking-[.2em] text-stone-700">{calendarTitle || "1987"} · PERON SAVAŞLARI · GERÇEK PARA YOK · NEXORA LABS</div>
    </div>
  </main>;
}
