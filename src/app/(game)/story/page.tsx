"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Check, Lock, Newspaper, Route, Shield, Users } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";
import { STORY_CAMPAIGN, type StoryChapter, type StoryChoice } from "@/data/storyCampaign";

const KEY = "otogar-story-campaign-v2";
type Progress = { completed: string[]; branch: string; choiceHistory: string[] };

export default function StoryPage() {
  const state = useGameStore();
  const career = useCareerStore();
  const [progress, setProgress] = useState<Progress>({ completed: [], branch: "başlangıç", choiceHistory: [] });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "");
      if (saved?.completed) setProgress(saved);
    } catch {}
  }, []);

  const choose = (chapter: StoryChapter, choice: StoryChoice) => {
    if (progress.completed.includes(chapter.id)) return;
    if (choice.savings < 0 && !state.spendMoney(-choice.savings)) {
      state.pushPhone("Hikâye", "Bu karar için şirket kasan yetmiyor.");
      return;
    }
    if (choice.savings > 0) state.addMoney(choice.savings);
    if (choice.savings) state.addLedger("Hikâye · " + chapter.title, choice.savings);
    useGameStore.setState((s) => ({
      reputation: Math.max(0, Math.min(100, s.reputation + choice.trust)),
    }));
    const next = {
      completed: [...progress.completed, chapter.id],
      branch: choice.branch,
      choiceHistory: [...progress.choiceHistory, chapter.id + ":" + choice.id],
    };
    setProgress(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    state.pushPhone("Hikâye", chapter.title + " · " + choice.text);
  };

  const next = STORY_CAMPAIGN.find((c) => {
    if (progress.completed.includes(c.id)) return false;
    return (c.unlock.day || 0) <= state.gameDay;
  });

  return (
    <main className="min-h-full bg-[#090807] text-stone-100 p-4 sm:p-8 pb-28">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-br from-amber-950/30 via-[#11100e] to-cyan-950/20 p-6 sm:p-8 mb-6 overflow-hidden">
          <div className="text-[10px] tracking-[0.28em] text-amber-500 font-black">1987 · OTOGAR GÜNLÜĞÜ</div>
          <h1 className="text-4xl sm:text-5xl font-black mt-2">Bir otobüs değil.<br />Bir hayat kuruyorsun.</h1>
          <p className="text-sm sm:text-base text-stone-400 max-w-2xl mt-4 leading-7">
            Hikâye çıraklıkta başlar. Çay taşımak sadece ilk sahnedir; kimin güvenini kazandığın, hangi patronla yol yürüdüğün, rakiplerine nasıl cevap verdiğin ve sermayeyi nasıl kullandığın yıllar sonra şirketinin kaderine dönüşür.
          </p>
          <div className="flex flex-wrap gap-2 mt-5 text-[10px]">
            <span className="px-3 py-1.5 rounded-full bg-black/30 border border-amber-900/50">ÇIRAKLIK</span>
            <span className="px-3 py-1.5 rounded-full bg-black/30 border border-zinc-800">FİRMA</span>
            <span className="px-3 py-1.5 rounded-full bg-black/30 border border-zinc-800">ULUSAL AĞ</span>
            <span className="px-3 py-1.5 rounded-full bg-black/30 border border-zinc-800">SERMAYE</span>
            <span className="px-3 py-1.5 rounded-full bg-black/30 border border-zinc-800">HALKA ARZ</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <section className="lg:col-span-2 space-y-3">
            {STORY_CAMPAIGN.map((c) => {
              const open = (c.unlock.day || 0) <= state.gameDay;
              const done = progress.completed.includes(c.id);
              return (
                <article key={c.id} className={"rounded-2xl border p-5 transition " + (done ? "border-emerald-900/40 bg-emerald-950/10" : open ? "border-amber-900/40 bg-[#15110e]" : "border-zinc-900 bg-zinc-950/70 opacity-55")}>
                  <div className="flex gap-4">
                    <div className={"h-11 w-11 rounded-xl flex items-center justify-center shrink-0 " + (done ? "bg-emerald-500 text-black" : open ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-600")}>
                      {done ? <Check size={19} /> : open ? <BookOpen size={19} /> : <Lock size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-[9px] tracking-widest text-amber-600 font-bold">{c.location} · {c.year} · GÜN {c.unlock.day}+</div>
                      <h2 className="text-xl font-black mt-1">{c.title}</h2>
                      {open ? (
                        <>
                          <p className="text-sm text-stone-300 mt-3 leading-6">{c.intro}</p>
                          <div className="mt-3 p-3 rounded-xl bg-black/30 border border-zinc-800 text-xs text-stone-400 leading-5">{c.scene}</div>
                          {!done ? (
                            <div className="grid sm:grid-cols-3 gap-2 mt-3">
                              {c.choices.map((o) => (
                                <button key={o.id} onClick={() => choose(c, o)} className="text-left rounded-xl border border-zinc-800 bg-black/25 p-3 hover:border-amber-700/50">
                                  <div className="text-sm font-bold text-amber-100">{o.label}</div>
                                  <div className="text-[11px] text-zinc-500 mt-1">{o.text}</div>
                                  <div className="text-[10px] text-emerald-500 mt-2">{o.savings >= 0 ? "+" : ""}{formatMoney(o.savings)} · güven {o.trust > 0 ? "+" : ""}{o.trust}</div>
                                </button>
                              ))}
                            </div>
                          ) : <div className="mt-3 text-xs text-emerald-400">Bu sahne yaşandı. Seçimin: {progress.choiceHistory.find((x) => x.startsWith(c.id + ":"))?.split(":")[1] || "kaydedildi"}.</div>}
                        </>
                      ) : <p className="text-xs text-zinc-600 mt-2">Gün {c.unlock.day}'de açılacak.</p>}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="space-y-3">
            <div className="rounded-2xl border border-cyan-900/30 bg-[#10171b] p-5">
              <div className="flex items-center gap-2 text-cyan-400"><Route size={17} /><span className="text-[10px] tracking-widest font-bold">HİKÂYE DURUMU</span></div>
              <div className="text-2xl font-black mt-2">{progress.completed.length}/{STORY_CAMPAIGN.length}</div>
              <p className="text-xs text-zinc-500 mt-1">Aktif yol: <span className="text-cyan-300">{progress.branch}</span></p>
              {next && <p className="text-xs text-zinc-400 mt-3">Sıradaki sahne: <strong>{next.title}</strong></p>}
            </div>

            <div className="rounded-2xl border border-amber-900/30 bg-[#15110e] p-5">
              <div className="flex items-center gap-2 text-amber-400"><Users size={17} /><span className="text-[10px] tracking-widest font-bold">SENİN HİKÂYEN</span></div>
              <p className="text-sm text-stone-300 mt-3">{career.careerStarted ? career.displayHitap : "Henüz karakterini tanımlamadın."}</p>
              <p className="text-xs text-zinc-500 mt-1">{career.careerStarted ? career.companyName + " · " + career.workCity : "Vardiya ekranından çıraklığı başlat."}</p>
              {!career.careerStarted && <Link href="/shift" className="inline-block mt-3 text-xs text-amber-300">Çıraklığa git →</Link>}
            </div>

            <div className="rounded-2xl border border-orange-900/30 bg-[#17100c] p-5">
              <div className="flex items-center gap-2 text-orange-400"><Shield size={17} /><span className="text-[10px] tracking-widest font-bold">DÜNYA TEPKİ VERİYOR</span></div>
              <p className="text-sm text-stone-400 mt-3 leading-6">Kararların yalnızca hikâyede kalmayacak: itibar, pazar, sermaye, gazete ve ileride ortaklık sistemine bağlanacak.</p>
              <Link href="/capital" className="inline-block mt-3 text-xs text-orange-300">Sermaye masası →</Link>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
              <div className="flex items-center gap-2 text-zinc-400"><Newspaper size={17} /><span className="text-[10px] tracking-widest font-bold">OTOGAR GÜNDEM</span></div>
              <p className="text-xs text-zinc-600 mt-3">Seçimlerin sonuçları telefonuna ve gazeteye düşecek. Büyük kararlar şirket haberine dönüşecek.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
