"use client";

import { useGameStore } from "@/store/gameStore";

export default function NewspaperModal() {
  const open = useGameStore((s) =>
    Boolean(
      (s as { newspaperOpen?: boolean }).newspaperOpen ||
        s.paperNotify
    )
  );
  const edition =
    useGameStore((s) => (s as { paperEdition?: "morning" | "evening" }).paperEdition) ||
    useGameStore((s) => s.paperNotify) ||
    "morning";
  const news = useGameStore((s) => s.newspaper);
  const close = useGameStore((s) => s.closeNewspaper);
  const day = useGameStore((s) => s.gameDay);
  const year = useGameStore((s) => s.gameYear);
  const fuel = useGameStore((s) => s.fuelPrice);
  const mood = useGameStore((s) => s.calendarMood);
  const calendarTitle = useGameStore((s) => s.calendarTitle);

  if (!open) return null;

  const isMourning = mood === "mourning";
  const isNational = mood === "national";
  const paperBg = isMourning ? "#1a1a1a" : "#e8dcc8";
  const ink = isMourning ? "#e5e5e5" : "#1c1917";
  const headerBg = isMourning ? "#0a0a0a" : "#d4c4a8";
  const border = isMourning ? "#444" : "#1c1917";

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-3">
      <div
        className="max-w-md w-full shadow-2xl border-4 max-h-[90vh] overflow-y-auto"
        style={{
          background: paperBg,
          color: ink,
          borderColor: border,
        }}
      >
        <div
          className="border-b-4 p-3 text-center"
          style={{ background: headerBg, borderColor: border }}
        >
          <div
            className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70"
          >
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
            {day} · {year || 1987} · Mazot {fuel} ₺
          </div>
          {(isMourning || isNational) && calendarTitle && (
            <div
              className={`mt-2 text-xs font-bold ${
                isMourning ? "text-zinc-400" : "text-amber-900"
              }`}
            >
              {isMourning ? "◆ " : "★ "}
              {calendarTitle}
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          {news.length === 0 && (
            <p className="text-sm opacity-70">Bu baskıda haber yok.</p>
          )}
          {news.map((n, i) => {
            const head = n.headline || n.title;
            const about = Boolean(n.aboutPlayer);
            return (
              <article
                key={n.id}
                className={`border-b pb-3 ${
                  about && !isMourning
                    ? "bg-amber-100/70 -mx-2 px-2 rounded"
                    : ""
                }`}
                style={{ borderColor: isMourning ? "#333" : "#a8a29e" }}
              >
                {i === 0 && (
                  <div
                    className={`text-[9px] font-bold mb-0.5 ${
                      isMourning ? "text-zinc-500" : "text-red-800"
                    }`}
                  >
                    MANŞET
                  </div>
                )}
                {about && (
                  <span
                    className={`text-[9px] font-bold ${
                      isMourning ? "text-amber-200/80" : "text-amber-900"
                    }`}
                  >
                    ★ SİZİN FİRMA
                  </span>
                )}
                {n.tag && (
                  <span className="ml-1 text-[9px] uppercase tracking-wider opacity-50">
                    {n.tag}
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
                <p className="text-[11px] mt-1 leading-relaxed opacity-90">
                  {n.body}
                </p>
              </article>
            );
          })}
        </div>

        <div
          className="px-4 py-2 text-[9px] opacity-60 border-t"
          style={{ borderColor: border }}
        >
          İlan: Bakraç Ticaret · Nexora Elektronik · Yerli malı · Otogar Tycoon
        </div>
        <button
          type="button"
          onClick={() => close()}
          className="w-full py-2.5 text-xs font-bold"
          style={{
            background: isMourning ? "#333" : "#1c1917",
            color: isMourning ? "#eee" : "#f5f5f4",
          }}
        >
          Kapat
        </button>
      </div>
    </div>
  );
}