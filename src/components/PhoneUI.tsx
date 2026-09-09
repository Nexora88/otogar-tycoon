"use client";

import { useGameStore } from "@/store/gameStore";

/** Wikimedia Commons — kamu malı Atatürk portresi */
const ATATURK_SRC =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ataturk.jpg/220px-Ataturk.jpg";

const ADS = [
  "Nexora Elektronik · 1987 model radyo",
  "Bakraç Ticaret · Bilgisayarlı sistemler",
  "Yerli malı · Herkes onu kullanmalı",
  "Otogar Tycoon · Peron Savaşları",
];

export default function PhoneUI() {
  const phoneOpen = useGameStore((s) => s.phoneOpen);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);
  const messages = useGameStore((s) => s.phoneMessages);
  const markPhoneRead = useGameStore((s) => s.markPhoneRead);

  const unread = messages.filter((m) => !m.read).length;
  const ad = ADS[Math.floor(Date.now() / 60000) % ADS.length]!;

  return (
    <>
      {/* Yüzen tuş — sabit köşe */}
      <button
        type="button"
        onClick={() => {
          setPhoneOpen(true);
          markPhoneRead();
        }}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-12 h-12 rounded-lg bg-zinc-800 border-2 border-zinc-600 shadow-lg flex flex-col items-center justify-center"
        aria-label="Telefon"
      >
        <span className="text-[9px] text-amber-500/90 font-mono leading-none">
          TEL
        </span>
        <span className="text-[8px] text-zinc-500 font-mono">87</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-4 px-0.5 rounded bg-red-700 text-[9px] flex items-center justify-center font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {phoneOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 p-4">
          {/* Kasa — tuğla grisi, kalın çerçeve */}
          <div className="w-full max-w-[260px] rounded-sm border-[6px] border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
            {/* Üst: hoparlör ızgarası */}
            <div className="bg-zinc-950 px-4 pt-2 pb-1">
              <div className="mx-auto w-16 h-1 rounded-full bg-zinc-700" />
            </div>

            {/* Duvar kâğıdı: Atatürk portresi + yazı */}
            <div className="relative h-32 bg-gradient-to-b from-stone-800 to-stone-950 border-b border-zinc-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ATATURK_SRC}
                alt="Mustafa Kemal Atatürk"
                className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-2 left-0 right-0 text-center px-2">
                <div className="text-[10px] tracking-[0.25em] text-amber-100/90 font-serif">
                  M. KEMAL ATATÜRK
                </div>
                <div className="text-[8px] text-zinc-400 mt-0.5">
                  Yurtta sulh, cihanda sulh
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPhoneOpen(false)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-sm bg-zinc-900/80 border border-zinc-600 text-zinc-400 text-xs"
                aria-label="Kapat"
              >
                ×
              </button>
            </div>

            {/* Reklam şeridi — Nexora */}
            <div className="bg-amber-950/80 border-y border-amber-900/50 px-2 py-1">
              <div className="text-[8px] text-amber-200/90 font-mono tracking-wide truncate text-center">
                ★ {ad}
              </div>
            </div>

            {/* Mesaj listesi — küçük ekran */}
            <div className="max-h-52 overflow-y-auto bg-zinc-950 p-2 space-y-1.5 min-h-[120px]">
              {messages.length === 0 && (
                <p className="text-[10px] text-zinc-600 p-3 text-center font-mono">
                  Mesaj yok
                  <br />
                  <span className="text-[8px]">1987 · sesli hat yok</span>
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`rounded-sm border p-1.5 text-[10px] ${
                    m.read
                      ? "border-zinc-800 bg-zinc-900/80"
                      : "border-amber-900/40 bg-zinc-900"
                  }`}
                >
                  <div className="flex justify-between gap-1 text-[8px] text-zinc-500 mb-0.5 font-mono">
                    <span className="text-amber-500/90 truncate max-w-[70%]">
                      {m.from}
                    </span>
                    <span>{m.type === "call" ? "ARAMA" : "SMS"}</span>
                  </div>
                  <p className="text-zinc-300 leading-snug">{m.body}</p>
                </div>
              ))}
            </div>

            {/* Tuş takımı — dekoratif 1987 */}
            <div className="bg-zinc-900 border-t border-zinc-700 p-2">
              <div className="grid grid-cols-3 gap-1">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
                  (k) => (
                    <div
                      key={k}
                      className="h-7 rounded-sm bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-500 font-mono select-none"
                    >
                      {k}
                    </div>
                  )
                )}
              </div>
              <div className="mt-1.5 text-center text-[7px] text-zinc-600 font-mono tracking-widest">
                NEXORA · BAKRAÇ · OTOGAR TYCOON
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}