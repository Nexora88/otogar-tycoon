"use client";

import { useGameStore } from "@/store/gameStore";

export default function NewspaperModal() {
  const open = useGameStore((s) => s.newspaperOpen);
  const edition = useGameStore((s) => s.paperEdition);
  const news = useGameStore((s) => s.newspaper);
  const close = useGameStore((s) => s.closeNewspaper);
  const day = useGameStore((s) => s.gameDay);
  const year = useGameStore((s) => s.gameYear);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-3">
      <div className="bg-[#e8dcc8] text-stone-900 max-w-md w-full shadow-2xl border-4 border-stone-800 max-h-[90vh] overflow-y-auto">
        <div className="border-b-4 border-stone-900 p-3 text-center">
          <div className="text-2xl font-black" style={{ fontFamily: "serif" }}>
            HAKİKİ PERON GAZETESİ
          </div>
          <div className="text-[10px] mt-1 font-bold uppercase tracking-widest">
            {edition === "evening" ? "Akşam baskısı" : "Sabah baskısı"} · Gün{" "}
            {day} · {year}
          </div>
        </div>
        <div className="p-4 space-y-4">
          {news.length === 0 && (
            <p className="text-sm text-stone-600">Bu baskıda haber yok.</p>
          )}
          {news.map((n) => (
            <article
              key={n.id}
              className={`border-b border-stone-400 pb-3 ${
                n.aboutPlayer ? "bg-amber-100/60 -mx-2 px-2 rounded" : ""
              }`}
            >
              {n.aboutPlayer && (
                <span className="text-[9px] font-bold text-amber-900">
                  ★ SİZİN FİRMA
                </span>
              )}
              <h2 className="font-black text-sm leading-tight">{n.headline}</h2>
              <p className="text-[11px] mt-1 text-stone-700">{n.body}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          onClick={close}
          className="w-full py-2 bg-stone-900 text-stone-100 text-xs font-bold"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}