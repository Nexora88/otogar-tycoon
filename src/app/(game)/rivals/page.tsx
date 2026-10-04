"use client";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function RivalsPage() {
  const s = useGameStore();
  const rivals = [...s.rivals].sort((a,b) => b.cash - a.cash);
  return <div className="p-4 sm:p-8 max-w-6xl mx-auto pb-28">
    <div className="flex justify-between gap-4 mb-6">
      <div><div className="text-[10px] tracking-[0.25em] text-cyan-400 font-bold">OTOGAR PİYASASI</div><h1 className="text-3xl font-black mt-1">Rakip şirketler yaşıyor.</h1><p className="text-sm text-zinc-500 mt-2 max-w-2xl">Sen kapalıyken de filo alıyor, fiyat değiştiriyor, yeni hat açıyor veya batıyor. Artık yalnızca senin şirketinin hikâyesi değil.</p></div>
      <div className="text-right text-xs text-zinc-500">Gün {s.gameDay}<div className="font-mono text-emerald-400 text-sm mt-1">{formatMoney(s.balance)}</div></div>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {rivals.map((r,i) => <article key={r.id} className={"rounded-2xl border p-5 bg-zinc-950 " + (r.active ? "border-zinc-800" : "border-red-900/50 opacity-60")}>
        <div className="flex justify-between gap-3"><div><div className="text-[10px] text-zinc-600">#{i+1} · {r.style}</div><h2 className="font-bold text-lg mt-1">{r.name}</h2></div><div className={r.active ? "text-emerald-400 text-xs" : "text-red-400 text-xs"}>{r.active ? "FAAL" : "İFLAS"}</div></div>
        <div className="grid grid-cols-3 gap-2 mt-5 text-xs"><Metric label="Kasa" value={formatMoney(r.cash)} /><Metric label="Filo" value={String(r.fleet)} /><Metric label="İtibar" value={String(r.reputation)} /></div>
        <div className="mt-4 text-xs"><span className="text-zinc-600">Bilet endeksi </span><span className="font-mono text-amber-300">{r.ticketIndex.toFixed(2)}×</span></div>
        <div className="mt-4"><div className="text-[10px] text-zinc-600 mb-1">Hat ağı</div><div className="flex flex-wrap gap-1">{r.routes.map(x => <span key={x} className="text-[10px] px-2 py-1 rounded-full border border-zinc-800 text-zinc-400">{x}</span>)}</div></div>
      </article>)}
    </div>
    <div className="mt-5 rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5 text-sm text-zinc-400"><b className="text-amber-200">Ekosistem yönü</b><p className="mt-2 leading-relaxed">Buradan sonraki hedef pazar payı, ortaklık, franchise, marka değeri ve sermaye piyasası. Halka arz da şirket belli büyüklüğe ulaştığında açılan ayrı bir sistem olmalı.</p></div>
    <div className="mt-4 flex gap-4 text-xs"><Link href="/lobby" className="text-cyan-400 underline">Canlı lige dön</Link><Link href="/upgrades" className="text-cyan-400 underline">Yatırımlar</Link><Link href="/dashboard" className="text-cyan-400 underline">Şirket</Link></div>
  </div>;
}
function Metric({label,value}:{label:string;value:string}) { return <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2"><div className="text-zinc-600">{label}</div><div className="text-zinc-200 mt-0.5">{value}</div></div>; }