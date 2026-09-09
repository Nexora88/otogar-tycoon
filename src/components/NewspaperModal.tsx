"use client";

import { useGameStore } from "@/store/gameStore";

export default function NewspaperModal() {
  const open = useGameStore((s) => s.newspaperOpen);
  const edition = useGameStore((s) => s.paperEdition);
  const paper = useGameStore((s) => s.newspaper);
  const close = useGameStore((s) => s.closeNewspaper);
  const companyName = useGameStore((s) => s.companyName);
  const gameDay = useGameStore((s) => s.gameDay);
  const calendarMood = useGameStore((s) => s.calendarMood);
  const calendarTitle = useGameStore((s) => s.calendarTitle);

  if (!open) return null;

  const mourning = calendarMood === "mourning";
  const national = calendarMood === "national";

  const sheet = mourning
    ? "bg-[#1a1a1a] text-stone-300 border-stone-600"
    : "bg-[#e8dcc8] text-stone-900 border-stone-500";

  const items = paper.slice(0, 6);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-3 sm:p-6">
      <div
        className={`relative w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-sm border-2 shadow-2xl ${sheet}`}
      >
        {/* Gazete üst bandı */}
        <div
          className={`px-4 pt-4 pb-2 border-b ${
            mourning ? "border-stone-700" : "border-stone-800/40"
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              <div
                className={`text-[10px] tracking-[0.35em] font-bold uppercase ${
                  mourning ? "text-stone-500" : "text-stone-700"
                }`}
              >
                Hakiki Peron Gazetesi
              </div>
              <div className="font-serif text-xl sm:text-2xl font-bold mt-1 leading-tight">
                {edition === "evening" ? "Akşam Baskısı" : "Sabah Baskısı"}
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className={`text-xs px-2 py-1 rounded border ${
                mourning
                  ? "border-stone-600 text-stone-400"
                  : "border-stone-700 text-stone-800"
              }`}
            >
              Kapat
            </button>
          </div>
          <div
            className={`text-[11px] mt-2 font-serif ${
              mourning ? "text-stone-500" : "text-stone-600"
            }`}
          >
            Gün {gameDay} · {companyName || "Esnaf"} · 1987
            {calendarTitle ? ` · ${calendarTitle}` : ""}
            {national ? " · Coşku" : ""}
            {mourning ? " · Saygı" : ""}
          </div>
        </div>

        {/* Manşet */}
        {items[0] && (
          <article className="px-4 py-4 border-b border-stone-800/20">
            <div
              className={`text-[9px] uppercase tracking-widest mb-1 ${
                mourning ? "text-stone-500" : "text-red-900/70"
              }`}
            >
              {items[0].tag || "Manşet"}
              {items[0].aboutPlayer ? " · Sizin haberiniz" : ""}
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold leading-snug">
              {items[0].headline || items[0].title}
            </h2>
            <p
              className={`mt-2 text-sm leading-relaxed font-serif ${
                mourning ? "text-stone-400" : "text-stone-800"
              }`}
            >
              {items[0].body}
            </p>
          </article>
        )}

        {/* Diğer sütunlar */}
        <div className="px-4 py-3 space-y-4">
          {items.slice(1).map((n) => (
            <article key={n.id} className="border-b border-stone-800/15 pb-3 last:border-0">
              <div
                className={`text-[9px] uppercase tracking-wider mb-0.5 ${
                  mourning ? "text-stone-600" : "text-stone-500"
                }`}
              >
                {n.tag || "Haber"}
                {n.aboutPlayer ? " · Esnaf" : ""}
              </div>
              <h3 className="font-serif font-bold text-[15px] leading-snug">
                {n.headline || n.title}
              </h3>
              <p
                className={`mt-1 text-[13px] leading-relaxed font-serif ${
                  mourning ? "text-stone-400" : "text-stone-700"
                }`}
              >
                {n.body}
              </p>
            </article>
          ))}

          {items.length === 0 && (
            <p className="text-sm font-serif text-stone-500 py-6 text-center">
              Bu baskıda sütun boş. Saat ilerlesin.
            </p>
          )}
        </div>

        <div
          className={`px-4 py-3 text-center text-[10px] font-serif border-t ${
            mourning
              ? "border-stone-700 text-stone-600"
              : "border-stone-800/30 text-stone-600"
          }`}
        >
          Yurtta sulh, cihanda sulh · Otogar Tycoon · Gerçek para yoktur
        </div>
      </div>
    </div>
  );
}