"use client";

import { useGameStore } from "@/store/gameStore";

export default function NewspaperModal() {
  const open = useGameStore((s) => s.newspaperOpen);
  const edition = useGameStore((s) => s.paperEdition);
  const paper = useGameStore((s) => s.newspaper);
  const close = useGameStore((s) => s.closeNewspaper);
  const company = useGameStore((s) => s.companyName);
  const day = useGameStore((s) => s.gameDay);
  const mood = useGameStore((s) => s.calendarMood);
  const title = useGameStore((s) => s.calendarTitle);
  const year = useGameStore((s) => s.gameYear);

  if (!open) return null;

  const mourning = mood === "mourning";
  const national = mood === "national";
  const items = paper.slice(0, 10);
  const lead = items[0];

  const shell = mourning
    ? "bg-[#111111] text-stone-200 border-stone-700"
    : national
      ? "bg-[#f4e7c8] text-stone-950 border-amber-700"
      : "bg-[#eee2c9] text-stone-950 border-stone-500";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-2 sm:p-6 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-5xl max-h-[94vh] overflow-y-auto border-2 shadow-2xl ${shell}`}
      >
        <div className="border-b-4 border-double border-current/40 p-4 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[9px] uppercase tracking-[0.5em] opacity-60">
                NEXORA PRESS · OTOGAR GÜNDEMİ
              </div>
              <h1 className="mt-2 font-serif text-4xl font-black leading-none tracking-tight sm:text-6xl">
                HAKİKİ PERON
              </h1>
              <div className="mt-2 font-serif text-xs opacity-70 sm:text-sm">
                {year || 1987} · Gün {day} ·{" "}
                {edition === "evening" ? "AKŞAM BASKISI" : "SABAH BASKISI"} ·{" "}
                {company || "Esnaf"}
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-current/40 px-4 py-2 text-xs font-bold"
            >
              Kapat
            </button>
          </div>
          {title ? (
            <div className="mt-5 border-y border-current/30 p-3 text-center font-serif font-bold">
              {title} · {mourning ? "SAYGI BASKISI" : "ÖZEL GÜN BASKISI"}
            </div>
          ) : null}
        </div>

        <div className="grid divide-y divide-current/20 lg:grid-cols-[1.7fr_1fr_1fr] lg:divide-x lg:divide-y-0">
          <article className="p-5 sm:p-7 lg:min-h-[390px]">
            {lead ? (
              <>
                <div className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
                  {lead.tag || "MANŞET"}
                  {lead.aboutPlayer ? " · OTOGARDA SİZ" : ""}
                </div>
                <h2 className="mt-2 font-serif text-3xl font-black leading-[0.95] sm:text-5xl">
                  {lead.headline || lead.title}
                </h2>
                <p className="mt-5 font-serif text-base leading-relaxed opacity-80 sm:text-lg">
                  {lead.body}
                </p>
                <div className="mt-7 border-t border-current/20 pt-3 text-[10px] uppercase tracking-widest opacity-50">
                  Peron · Ekonomi · Yol · Şehir · Rakipler
                </div>
              </>
            ) : (
              <div className="py-20 text-center opacity-50">Baskı hazırlanıyor.</div>
            )}
          </article>

          <section className="space-y-5 p-5 sm:p-6">
            <h3 className="border-b border-current/30 pb-2 font-serif text-xl font-black">
              ŞEHİR &amp; YOL
            </h3>
            {items.slice(1, 5).map((n) => (
              <article key={n.id}>
                <div className="text-[8px] uppercase tracking-widest opacity-50">
                  {n.tag || "Haber"}
                </div>
                <h4 className="mt-1 font-serif text-lg font-bold leading-tight">
                  {n.headline || n.title}
                </h4>
                <p className="mt-1 font-serif text-sm leading-relaxed opacity-70">
                  {n.body}
                </p>
              </article>
            ))}
          </section>

          <section className="space-y-5 p-5 sm:p-6">
            <h3 className="border-b border-current/30 pb-2 font-serif text-xl font-black">
              OTOGAR EKONOMİ
            </h3>
            {items.slice(5, 10).map((n) => (
              <article key={n.id}>
                <div className="text-[8px] uppercase tracking-widest opacity-50">
                  {n.tag || "Piyasa"}
                </div>
                <h4 className="mt-1 font-serif text-lg font-bold leading-tight">
                  {n.headline || n.title}
                </h4>
                <p className="mt-1 font-serif text-sm leading-relaxed opacity-70">
                  {n.body}
                </p>
              </article>
            ))}
            {national ? (
              <div className="border-2 border-current/30 p-4 text-center font-serif font-bold">
                NEXORA LABS
                <br />
                <span className="text-sm font-normal">Bayramımız kutlu olsun.</span>
              </div>
            ) : null}
            {mourning ? (
              <div className="border border-current/30 p-4 text-center font-serif">
                Saygıyla ve minnetle.
              </div>
            ) : null}
          </section>
        </div>

        <footer className="flex flex-wrap justify-between gap-2 border-t-4 border-double border-current/40 p-3 text-[9px] uppercase tracking-widest opacity-55 sm:p-4">
          <span>Nexora Labs · Otogar Tycoon</span>
          <span>Gerçek para yoktur · Simülasyon</span>
          <span>Yurtta sulh, cihanda sulh</span>
        </footer>
      </div>
    </div>
  );
}
