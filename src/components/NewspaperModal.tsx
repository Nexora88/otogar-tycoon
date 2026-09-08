"use client";

import { useGameStore } from "@/store/gameStore";

export default function NewspaperModal() {
  const open = useGameStore((s) => {
    const value =
      (s as any).newspaperOpen ??
      (s as any).isNewspaperOpen ??
      (s as any).paperOpen ??
      false;
    return Boolean(value);
  });
  const edition = useGameStore((s) => {
    const value = (s as any).paperEdition ?? (s as any).openPaperEdition ?? "morning";
    return typeof value === "string" ? value : "morning";
  });
  const news = useGameStore((s) => s.newspaper);
  const close = useGameStore((s) => s.closeNewspaper);
  const day = useGameStore((s) => s.gameDay);
  const year = useGameStore((s) => s.gameYear);
  const fuel = useGameStore((s) => s.fuelPrice);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3">
      <div className="bg-[#e8dcc8] text-stone-900 max-w-md w-full shadow-2xl border-4 border-stone-900 max-h-[90vh] overflow-y-auto">
        <div className="border-b-4 border-stone-900 p-3 text-center bg-[#d4c4a8]">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-stone-600">
            Küfürsüz · Siyasetsiz · Esnaf gazetesi
          </div>
          <div
            className="text-2xl font-black mt-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            HAKİKİ PERON
          </div>
          <div className="text-[10px] mt-1 font-bold uppercase tracking-widest">
            {edition === "evening" ? "Akşam baskısı" : "Sabah baskısı"} · Gün{" "}
            {day} · {year} · Mazot {fuel} ₺
          </div>
        </div>

        <div className="p-4 space-y-4">
          {news.length === 0 && (
            <p className="text-sm text-stone-600">Bu baskıda haber yok.</p>
          )}
          {news.map((n, i) => {
            const head = ((n as any).headline ?? (n as any).title ?? "") as string;
            const about = "aboutPlayer" in n && Boolean((n as any).aboutPlayer);
            const body = ((n as any).body ?? "") as string;
            return (
              <article
                key={n.id}
                className={`border-b border-stone-400 pb-3 ${
                  about ? "bg-amber-100/70 -mx-2 px-2 rounded" : ""
                }`}
              >
                {i === 0 && (
                  <div className="text-[9px] font-bold text-red-800 mb-0.5">
                    MANŞET
                  </div>
                )}
                {about && (
                  <span className="text-[9px] font-bold text-amber-900">
                    ★ SİZİN FİRMA
                  </span>
                )}
                <h2
                  className={`font-black leading-tight ${
                    i === 0 ? "text-base" : "text-sm"
                  }`}
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {head}
                </h2>
                <p className="text-[11px] mt-1 text-stone-700 leading-relaxed">
                  {n.body}
                </p>
              </article>
            );
          })}
        </div>

        <div className="px-4 py-2 text-[9px] text-stone-500 border-t border-stone-400">
          İlan: Bakraç Ticaret · Nexora Elektronik · Yerli malı
        </div>
        <button
          type="button"
          onClick={close}
          className="w-full py-2.5 bg-stone-900 text-stone-100 text-xs font-bold"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}