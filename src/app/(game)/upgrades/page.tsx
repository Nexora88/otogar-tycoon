"use client";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const ITEMS = [
  ["office", "Yazıhane", "Klima, koltuk ve tabela yatırımı. Müşteri akışını güçlendirir.", 5],
  ["service", "İkram mutfağı", "Kek, çay ve servis maliyetini düşürür; memnuniyeti artırır.", 5],
  ["rest", "Dinlenme tesisi ağı", "Yol üstü tesis anlaşmaları sefer başına küçük komisyon getirir.", 4],
  ["crier", "Çığırtkan", "Peron dolum hızını artırır; canlı odalarda anlık rekabet hamlesini güçlendirir.", 5],
] as const;

export default function UpgradesPage() {
  const s = useGameStore();
  const levels = { office: s.officeUpgradeLevel, service: s.serviceUpgradeLevel, rest: s.restStopDealLevel, crier: s.crierLevel };
  const buy = (key: string) => {
    const ok = key === "office" ? s.upgradeOffice() : key === "service" ? s.upgradeService() : key === "rest" ? s.signRestStopDeal() : s.upgradeCrier();
    if (!ok) alert("Kasa yetmiyor veya seviye sınırına ulaştın.");
  };
  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto pb-28">
      <div className="flex justify-between gap-4 mb-6"><div><div className="text-[10px] tracking-[0.22em] text-amber-500 font-bold">YATIRIM MASASI</div><h1 className="text-2xl font-black mt-1">Şirketi büyüt</h1><p className="text-sm text-zinc-500 mt-1">Operasyon + hizmet + tesis + peron gücü.</p></div><div className="text-right"><div className="text-xs text-zinc-500">Kasa</div><div className="font-mono text-emerald-400">{formatMoney(s.balance)}</div></div></div>
      {s.offlineReport && <section className="mb-5 rounded-2xl border border-cyan-900/60 bg-cyan-950/20 p-4"><div className="flex justify-between"><div><div className="text-[10px] tracking-widest text-cyan-400 font-bold">DÖNDÜN — MUHASEBE RAPORU</div><p className="text-sm text-zinc-200 mt-1">{s.offlineReport.minutesAway} dk kapalı kaldın · {s.offlineReport.gameDays} oyun günü işlendi.</p><div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-[11px]"><Metric label="Maaş" value={formatMoney(-s.offlineReport.wages)} /><Metric label="Terminal" value={formatMoney(s.offlineReport.terminalIncome)} /><Metric label="Sefer" value={String(s.offlineReport.completedExpeditions)} /><Metric label="Mazot" value={formatMoney(-s.offlineReport.fuelSpent)} /></div></div><button onClick={s.clearOfflineReport} className="text-[10px] text-zinc-500">Kapat</button></div></section>}
      <div className="grid md:grid-cols-2 gap-4">{ITEMS.map(([key,title,desc,max]) => {
        const level = levels[key as keyof typeof levels];
        const cost = key === "office" ? 7000 * (level + 1) : key === "service" ? 9000 * (level + 1) : key === "rest" ? 12000 * (level + 1) : 3000 * (level + 1);
        return <section key={key} className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5"><div className="flex justify-between"><h2 className="font-bold text-amber-100">{title}</h2><span className="text-[10px] text-zinc-500">Sv. {level}/{max}</span></div><p className="text-xs text-zinc-500 mt-2 leading-relaxed">{desc}</p><div className="mt-4 h-1.5 rounded-full bg-zinc-800 overflow-hidden"><div className="h-full bg-amber-500" style={{width:(level/max*100)+"%"}} /></div><button disabled={level>=max} onClick={() => buy(key)} className="mt-4 w-full py-2.5 rounded-xl border border-amber-800 text-amber-200 text-sm font-semibold disabled:opacity-40">{level>=max ? "Maksimum" : "Yükselt · "+formatMoney(cost)}</button></section>;
      })}</div>
      <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-500"><b className="text-zinc-300">Ekonomi mantığı</b><p className="mt-1 leading-relaxed">Mazot fiyatı sefer hesabına bağlı. Kilometre motoru yıpratıyor, şoför yoruluyor, bayram talebi yükseliyor. Böylece bilet, servis, bakım ve nakit arasında gerçek tercih oluşuyor.</p></div>
      <div className="mt-4 flex gap-3 text-xs"><Link href="/garage" className="text-cyan-400 underline">Garaj</Link><Link href="/terminal" className="text-cyan-400 underline">Terminal</Link><Link href="/expeditions" className="text-cyan-400 underline">Seferler</Link></div>
    </div>
  );
}

function Metric({label,value}:{label:string;value:string}) { return <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-2"><div className="text-zinc-600">{label}</div><div className="text-zinc-200 mt-0.5">{value}</div></div>; }