"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Lock, Newspaper, Sparkles, Wallet, X } from "lucide-react";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";
import { STORY_CAMPAIGN, type StoryChapter, type StoryChoice } from "@/data/storyCampaign";

const KEY = "otogar-story-campaign-v2";
type Progress = { completed: string[]; branch: string; choiceHistory: string[] };

const emptyProgress: Progress = { completed: [], branch: "başlangıç", choiceHistory: [] };

export default function StoryPage() {
  const state = useGameStore();
  const career = useCareerStore();
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [selectedId, setSelectedId] = useState(STORY_CAMPAIGN[0]?.id || "");
  const [choiceFlash, setChoiceFlash] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "");
      if (saved?.completed) {
        setProgress(saved);
        const next = STORY_CAMPAIGN.find((c) => !saved.completed.includes(c.id) && (c.unlock.day || 0) <= state.gameDay);
        if (next) setSelectedId(next.id);
      }
    } catch {}
  }, [state.gameDay]);

  const selected = useMemo(
    () => STORY_CAMPAIGN.find((c) => c.id === selectedId) || STORY_CAMPAIGN[0],
    [selectedId]
  );

  const currentIndex = STORY_CAMPAIGN.findIndex((c) => c.id === selected.id);
  const open = (selected.unlock.day || 0) <= state.gameDay;
  const done = progress.completed.includes(selected.id);
  const nextChapter = STORY_CAMPAIGN.find((c) => !progress.completed.includes(c.id) && (c.unlock.day || 0) <= state.gameDay);

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
    setChoiceFlash(choice.label);
  };

  const goChapter = (index: number) => {
    const c = STORY_CAMPAIGN[index];
    if (!c || (c.unlock.day || 0) > state.gameDay) return;
    setSelectedId(c.id);
    setChoiceFlash(null);
  };

  return (
    <main className="min-h-full bg-[#060708] text-zinc-100 pb-28">
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,154,74,.18),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(29,121,145,.14),transparent_35%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[10px] tracking-[.32em] text-amber-500 font-black">OTOGAR GÜNLÜĞÜ · 1987 →</div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mt-2">Senaryoyu okumuyorsun.<br /><span className="text-amber-400">İçinde yaşıyorsun.</span></h1>
              <p className="text-sm text-zinc-400 max-w-2xl mt-4 leading-6">
                Aynı görevler, ama artık görev listesi gibi değil: her vardiya bir sahnenin parçası. Kararın para, itibar, ilişkiler ve şirketinin geleceği üzerinde iz bırakır.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-black/40 px-4 py-3 min-w-[170px]">
              <div className="text-[9px] tracking-widest text-zinc-500">HİKÂYE İLERLEMESİ</div>
              <div className="text-3xl font-black mt-1">{progress.completed.length}<span className="text-zinc-600 text-lg"> / {STORY_CAMPAIGN.length}</span></div>
              <div className="h-1.5 bg-zinc-900 rounded-full mt-2 overflow-hidden"><div className="h-full bg-amber-500 transition-all" style={{width: (progress.completed.length / STORY_CAMPAIGN.length) * 100 + "%"}} /></div>
            </div>
          </div>

          <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-2">
            {STORY_CAMPAIGN.map((chapter, i) => {
              const unlocked = (chapter.unlock.day || 0) <= state.gameDay;
              const completed = progress.completed.includes(chapter.id);
              const active = chapter.id === selected.id;
              return (
                <button key={chapter.id} type="button" onClick={() => goChapter(i)} disabled={!unlocked}
                  className={"relative shrink-0 w-28 h-16 rounded-xl border text-left p-2 transition-all " +
                    (active ? "border-amber-500 bg-amber-950/30 -translate-y-1" : completed ? "border-emerald-900/60 bg-emerald-950/15" : unlocked ? "border-zinc-700 bg-zinc-950 hover:border-zinc-500" : "border-zinc-900 bg-black/30 opacity-40")}>
                  <div className="text-[8px] text-zinc-500">BÖLÜM {i + 1}</div>
                  <div className="text-[11px] font-bold mt-1 line-clamp-2">{chapter.title}</div>
                  {completed && <Check size={12} className="absolute top-2 right-2 text-emerald-400" />}
                  {!unlocked && <Lock size={11} className="absolute top-2 right-2 text-zinc-700" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 grid lg:grid-cols-[1fr_300px] gap-5">
        <section>
          {!open ? (
            <div className="rounded-3xl border border-zinc-800 bg-[#0b0d10] p-8 sm:p-12 text-center">
              <Lock className="mx-auto text-zinc-600" size={30} />
              <div className="text-xl font-black mt-4">Bu bölüm henüz yaşanmadı.</div>
              <p className="text-sm text-zinc-500 mt-2">Gün {selected.unlock.day} geldiğinde peron seni buraya getirecek.</p>
              <Link href="/shift" className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-sm">Vardiyaya dön <ArrowRight size={15}/></Link>
            </div>
          ) : (
            <>
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#0b0d10] shadow-2xl">
                <div className="relative aspect-[16/8] overflow-hidden">
                  <img src={selected.visual} alt="" className="w-full h-full object-cover transition duration-700 scale-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-black/20" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur border border-white/10 text-[9px] tracking-widest font-bold">{selected.year} · {selected.location}</span>
                    <span className="px-2.5 py-1 rounded-full bg-black/55 backdrop-blur border border-white/10 text-[9px] text-amber-200">{selected.mood}</span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="text-[10px] tracking-[.28em] text-amber-400 font-black">BÖLÜM {currentIndex + 1}</div>
                    <h2 className="text-3xl sm:text-4xl font-black mt-1">{selected.title}</h2>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <p className="text-base sm:text-lg text-zinc-200 leading-7 font-medium">{selected.intro}</p>
                  <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/30 p-5">
                    <div className="flex items-center gap-2 text-amber-400 text-[10px] tracking-widest font-black"><Sparkles size={14}/> SAHNE</div>
                    <p className="text-sm sm:text-base text-zinc-400 leading-7 mt-2">{selected.scene}</p>
                  </div>

                  {done ? (
                    <div className="mt-5 rounded-2xl border border-emerald-900/50 bg-emerald-950/15 p-5">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm"><Check size={17}/> Bu sahne yaşandı.</div>
                      <p className="text-xs text-zinc-500 mt-2">Seçimin: <span className="text-zinc-300">{progress.choiceHistory.find((x) => x.startsWith(selected.id + ":"))?.split(":")[1] || "kaydedildi"}</span>. Dünya bu kararını taşıyor.</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <button onClick={() => goChapter(Math.min(STORY_CAMPAIGN.length - 1, currentIndex + 1))} className="px-4 py-2 rounded-xl bg-zinc-100 text-black text-xs font-bold inline-flex items-center gap-2">Sonraki bölüm <ArrowRight size={14}/></button>
                        <Link href="/shift" className="px-4 py-2 rounded-xl border border-zinc-700 text-xs font-bold">Vardiyaya dön</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[10px] tracking-widest text-zinc-500 font-black">SÖZ SENDE</div>
                        <div className="text-[10px] text-zinc-600">Bir seçim. Bir iz.</div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-3">
                        {selected.choices.map((choice, i) => (
                          <button key={choice.id} type="button" onClick={() => choose(selected, choice)}
                            className="group text-left rounded-2xl border border-zinc-800 bg-zinc-950 p-4 hover:border-amber-600/70 hover:bg-amber-950/10 transition-all hover:-translate-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-zinc-600 font-black">0{i + 1}</span>
                              <ArrowRight size={14} className="text-zinc-700 group-hover:text-amber-400 transition" />
                            </div>
                            <div className="text-sm font-black text-zinc-100 mt-4">{choice.label}</div>
                            <p className="text-[11px] text-zinc-500 leading-5 mt-2">{choice.text}</p>
                            <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-2 text-[10px]">
                              <span className={choice.savings >= 0 ? "text-emerald-400" : "text-red-400"}><Wallet size={11} className="inline mr-1"/>{choice.savings >= 0 ? "+" : ""}{formatMoney(choice.savings)}</span>
                              <span className="text-cyan-400">güven {choice.trust > 0 ? "+" : ""}{choice.trust}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {choiceFlash && (
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-900/40 bg-amber-950/15 px-4 py-3">
                      <span className="text-xs text-amber-200">Seçimin kaydedildi: <strong>{choiceFlash}</strong></span>
                      <button onClick={() => setChoiceFlash(null)}><X size={14} className="text-zinc-500"/></button>
                    </div>
                  )}

                  <div className="mt-7 flex items-center justify-between">
                    <button disabled={currentIndex <= 0} onClick={() => goChapter(currentIndex - 1)} className="text-xs text-zinc-500 disabled:opacity-20 inline-flex items-center gap-1"><ChevronLeft size={15}/> Önceki</button>
                    <button disabled={currentIndex >= STORY_CAMPAIGN.length - 1} onClick={() => goChapter(currentIndex + 1)} className="text-xs text-zinc-500 disabled:opacity-20 inline-flex items-center gap-1">Sonraki <ChevronRight size={15}/></button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        <aside className="space-y-3">
          <div className="rounded-2xl border border-zinc-800 bg-[#0b0d10] p-5 sticky top-16">
            <div className="flex items-center gap-2 text-cyan-400"><BookOpen size={16}/><span className="text-[10px] tracking-widest font-black">KARAKTERİN</span></div>
            <div className="text-lg font-black mt-3">{career.careerStarted ? career.displayHitap : "Henüz yazılmadı"}</div>
            <div className="text-xs text-zinc-500 mt-1">{career.careerStarted ? career.companyName + " · " + career.workCity : "İlk vardiya hikâyenin kapısı."}</div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3"><div className="text-[9px] text-zinc-600">GÜVEN</div><div className="font-black text-cyan-400 mt-1">{career.trust}</div></div>
              <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3"><div className="text-[9px] text-zinc-600">TANINIRLIK</div><div className="font-black text-amber-400 mt-1">{career.fame}</div></div>
            </div>
            {!career.careerStarted && <Link href="/shift" className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-black">Çıraklığa başla <ArrowRight size={14}/></Link>}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-[#0b0d10] p-5">
            <div className="text-[10px] tracking-widest text-zinc-500 font-black">AKTİF YOL</div>
            <div className="text-xl font-black mt-1 text-amber-300">{progress.branch}</div>
            <p className="text-xs text-zinc-500 leading-5 mt-2">Bu etiket ileride kulis, rakip ilişkileri, gazete ve sermaye kararlarına bağlanacak.</p>
          </div>

          <div className="rounded-2xl border border-orange-900/30 bg-orange-950/10 p-5">
            <div className="flex items-center gap-2 text-orange-300"><Newspaper size={15}/><span className="text-[10px] tracking-widest font-black">DÜNYA TEPKİ VERİYOR</span></div>
            <p className="text-xs text-zinc-500 leading-5 mt-2">Büyük seçimler telefonuna, gazeteye ve pazar ekranına yansıyacak. Hikâye ayrı bir menü değil; oyunun omurgası.</p>
          </div>

          {nextChapter && (
            <button onClick={() => setSelectedId(nextChapter.id)} className="w-full text-left rounded-2xl border border-amber-900/30 bg-amber-950/10 p-5 hover:bg-amber-950/20">
              <div className="text-[9px] tracking-widest text-amber-500 font-black">SIRADAKİ SAHNE</div>
              <div className="font-black mt-1">{nextChapter.title}</div>
              <div className="text-xs text-zinc-500 mt-1">Gün {nextChapter.unlock.day} · devam et</div>
            </button>
          )}
        </aside>
      </div>
    </main>
  );
}
