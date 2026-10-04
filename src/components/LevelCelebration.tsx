"use client";
import { useCareerStore } from "@/store/careerStore";

export default function LevelCelebration(){
  const notice=useCareerStore(s=>s.levelUpNotice);
  const clear=useCareerStore(s=>s.clearLevelUpNotice);
  if(!notice)return null;
  return <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 backdrop-blur-sm p-5" onClick={clear}>
    <div className="w-full max-w-lg rounded-3xl border border-amber-500/40 bg-zinc-950 p-7 text-center shadow-2xl" onClick={e=>e.stopPropagation()}>
      <div className="text-[10px] tracking-[.5em] text-amber-400 font-black">YENİ SEVİYE</div>
      <div className="text-7xl font-black text-white mt-3">LVL {notice.level}</div>
      <div className="text-2xl font-black text-amber-400 mt-2">{notice.title}</div>
      <p className="text-zinc-400 mt-4">{notice.message}</p>
      <div className="mt-6 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider">
        <div className="rounded-xl bg-white/[0.04] p-3">Yeni teklifler</div>
        <div className="rounded-xl bg-white/[0.04] p-3">Yeni dünya</div>
        <div className="rounded-xl bg-white/[0.04] p-3">Yeni hedef</div>
      </div>
      <button onClick={clear} className="mt-6 w-full rounded-xl bg-amber-500 py-3 font-black text-black">DEVAM ET</button>
    </div>
  </div>;
}
