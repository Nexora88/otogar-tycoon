"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BusFront, Coins, Crown, Map, ShieldCheck, Star, Trophy } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const KEY = "otogar-achievements-v1";
const GOALS = [
  ["first", "İlk Sefer", "İlk seferini tamamla.", 2500, (s:any)=>s.expeditions.some((e:any)=>e.status==="completed"), BusFront],
  ["fleet", "Küçük Filo", "3 otobüse ulaş.", 7500, (s:any)=>s.buses.length>=3, BusFront],
  ["rep", "Güvenilir Firma", "60 itibar puanına ulaş.", 6000, (s:any)=>s.reputation>=60, ShieldCheck],
  ["cash", "Kasa Gücü", "1.000.000 ₺ kasaya ulaş.", 25000, (s:any)=>s.balance>=1000000, Coins],
  ["network", "Türkiye Ağı", "Terminali kur ve 2 otobüse ulaş.", 10000, (s:any)=>s.setupDone&&s.buses.length>=2, Map],
  ["staff", "Sağlam Kadro", "5 personel çalıştır.", 12000, (s:any)=>s.drivers.length>=5, Star],
  ["master", "Sefer Ustası", "10 sefer tamamla.", 15000, (s:any)=>s.expeditions.filter((e:any)=>e.status==="completed").length>=10, Trophy],
  ["tycoon", "Otogar Ağası", "Terminal + 5 otobüs + 80 itibar.", 50000, (s:any)=>s.terminalBuilt&&s.buses.length>=5&&s.reputation>=80, Crown],
] as const;

export default function AchievementsPage(){
  const state=useGameStore(); const [claimed,setClaimed]=useState<string[]>([]);
  useEffect(()=>{try{setClaimed(JSON.parse(localStorage.getItem(KEY)||"[]"))}catch{setClaimed([])}},[]);
  const done=useMemo(()=>GOALS.filter(g=>g[4](state)).length,[state]);
  const claim=(g:any)=>{const [id,title,,reward,check]=g;if(!check(useGameStore.getState())||claimed.includes(id))return;useGameStore.setState(s=>({balance:s.balance+reward}));useGameStore.getState().addLedger(`Başarı ödülü · ${title}`,reward);useGameStore.getState().pushPhone("Başarı",`${title} tamamlandı. +${formatMoney(reward)}`);const n=[...claimed,id];setClaimed(n);localStorage.setItem(KEY,JSON.stringify(n));};
  return <main className="min-h-full bg-[#0c0a08] text-stone-100 p-4 sm:p-8 pb-28"><div className="max-w-5xl mx-auto">
    <div className="flex items-end justify-between gap-4 mb-5"><div><div className="text-[10px] tracking-[.25em] text-amber-500 font-black">UZUN VADELİ HEDEFLER</div><h1 className="text-3xl font-black mt-1">Başarılar</h1><p className="text-sm text-stone-500 mt-1">Filo, itibar, ağ ve sefer büyümesini ödüllendir.</p></div><div className="rounded-2xl border border-amber-800/40 bg-amber-950/20 px-5 py-3 text-right"><div className="text-[9px] tracking-widest text-amber-600">İLERLEME</div><div className="text-2xl font-black text-amber-300">{done}/{GOALS.length}</div></div></div>
    <div className="h-2 rounded-full bg-white/5 overflow-hidden mb-6"><div className="h-full bg-gradient-to-r from-amber-500 to-orange-400" style={{width:`${done/GOALS.length*100}%`}}/></div>
    <div className="grid md:grid-cols-2 gap-3">{GOALS.map((g:any)=>{const [id,title,desc,reward,check,Icon]=g;const ok=check(state),got=claimed.includes(id);return <article key={id} className={`rounded-2xl border p-4 ${ok?"border-amber-700/50 bg-amber-950/15":"border-zinc-800 bg-zinc-900/70"}`}><div className="flex gap-3"><div className={`h-11 w-11 shrink-0 rounded-xl flex items-center justify-center ${ok?"bg-amber-400 text-black":"bg-zinc-800 text-zinc-500"}`}><Icon size={20}/></div><div className="flex-1"><div className="flex justify-between gap-2"><h2 className="font-bold">{title}</h2><span className="text-xs text-amber-400">+{formatMoney(reward)}</span></div><p className="text-xs text-zinc-500 mt-1">{desc}</p><button disabled={!ok||got} onClick={()=>claim(g)} className="mt-3 px-3 py-1.5 rounded-lg text-[10px] font-black border border-amber-700/40 text-amber-300 disabled:opacity-35">{got?"ÖDÜL ALINDI":ok?"ÖDÜLÜ AL":"DEVAM ET"}</button></div></div></article>})}</div>
    <div className="mt-6 flex gap-3 text-xs"><Link href="/dashboard" className="text-amber-400">← Genel merkez</Link><Link href="/events" className="text-cyan-400">Etkinlikler →</Link></div>
  </div></main>;
}
