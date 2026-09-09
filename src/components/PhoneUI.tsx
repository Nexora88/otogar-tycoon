"use client";

import { useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";

const ATATURK =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Ataturk.jpg/440px-Ataturk.jpg";

const ADS = [
  "Nexora Elektronik · 1987 model radyo",
  "Bakraç Ticaret · Defter temiz, yol açık",
  "Yerli malı kullanmalı",
  "Otogar Tycoon · Gerçek para yok",
];

export default function PhoneUI() {
  const open = useGameStore((s) => s.phoneOpen);
  const setOpen = useGameStore((s) => s.setPhoneOpen);
  const messages = useGameStore((s) => s.phoneMessages);
  const markRead = useGameStore((s) => s.markPhoneRead);
  const companyName = useGameStore((s) => s.companyName);

  const [tab, setTab] = useState<"inbox" | "home">("inbox");
  const [adIx, setAdIx] = useState(0);

  const unread = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  // Aynı kaynaktan gelen peş peşe tekrarları gizle (spam kırpma)
  const cleaned = useMemo(() => {
    const out: typeof messages = [];
    let lastKey = "";
    for (const m of messages) {
      const key = `${m.from}|${m.body.slice(0, 40)}`;
      if (key === lastKey) continue;
      // ambient gürültüyü kıs: aynı from’dan 3’ten fazla gösterme listede
      const fromCount = out.filter((x) => x.from === m.from).length;
      if (fromCount >= 3 && m.from !== "Ahmet Eymen Bakraç") continue;
      out.push(m);
      lastKey = key;
      if (out.length >= 18) break;
    }
    return out;
  }, [messages]);

  const openPhone = () => {
    setOpen(true);
    markRead();
    setTab("inbox");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPhone}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-14 h-14 rounded-2xl bg-stone-900 border border-stone-600 shadow-xl flex flex-col items-center justify-center"
        aria-label="Telefon"
      >
        <span className="text-[10px] font-mono text-amber-500/90">TEL</span>
        <span className="text-[9px] text-stone-500">87</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-black/70 p-3 sm:p-6">
      {/* Cihaz gövdesi */}
      <div className="w-full max-w-[320px] rounded-[28px] bg-[#1a1612] border-2 border-stone-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Üst anten / marka */}
        <div className="bg-[#0c0a08] px-4 pt-3 pb-2 text-center">
          <div className="text-[9px] tracking-[0.25em] text-stone-500">
            NEXORA · EL TELFONU
          </div>
          <div className="text-[10px] text-amber-700/80 font-mono mt-0.5">
            87.5 MHz · {companyName?.slice(0, 16) || "Ağa"}
          </div>
        </div>

        {/* Ekran */}
        <div className="mx-3 rounded-lg border border-stone-700 bg-[#0e0c0a] overflow-hidden flex flex-col min-h-[360px]">
          {/* Wallpaper / portre şeridi */}
          <div className="relative h-28 bg-stone-900 border-b border-stone-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ATATURK}
              alt=""
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-top opacity-90"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c0a] via-transparent to-black/30" />
            <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
              <div>
                <div className="text-[9px] text-amber-200/70 tracking-wider">
                  ARKA PLAN
                </div>
                <div className="text-xs font-serif text-amber-50">
                  M. Kemal Atatürk
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAdIx((i) => (i + 1) % ADS.length);
                }}
                className="text-[9px] text-stone-400 border border-stone-600 px-1.5 py-0.5 rounded"
              >
                Reklam
              </button>
            </div>
          </div>

          {/* Reklam şeridi */}
          <div className="px-2 py-1 bg-amber-950/30 border-b border-stone-800 text-[9px] text-amber-200/60 truncate text-center">
            {ADS[adIx]}
          </div>

          {/* Sekmeler */}
          <div className="flex border-b border-stone-800 text-[11px]">
            <button
              type="button"
              onClick={() => setTab("inbox")}
              className={`flex-1 py-2 ${
                tab === "inbox"
                  ? "text-amber-200 border-b border-amber-600"
                  : "text-stone-500"
              }`}
            >
              Gelen ({cleaned.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("home")}
              className={`flex-1 py-2 ${
                tab === "home"
                  ? "text-amber-200 border-b border-amber-600"
                  : "text-stone-500"
              }`}
            >
              Ana ekran
            </button>
          </div>

          {tab === "inbox" && (
            <div className="flex-1 overflow-y-auto max-h-[240px] p-2 space-y-1.5">
              {cleaned.length === 0 && (
                <p className="text-center text-[11px] text-stone-600 py-8">
                  Kutusu boş. Telsiz sessiz.
                </p>
              )}
              {cleaned.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-stone-800 bg-stone-900/80 px-2.5 py-2"
                >
                  <div className="flex justify-between gap-2">
                    <span className="text-[11px] font-semibold text-stone-200 truncate">
                      {m.from}
                    </span>
                    <span className="text-[9px] text-stone-600 shrink-0">
                      {m.type === "call" ? "ARA" : "SMS"}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">
                    {m.body}
                  </p>
                </div>
              ))}
            </div>
          )}

          {tab === "home" && (
            <div className="p-4 text-center space-y-3">
              <p className="text-xs text-stone-400 leading-relaxed">
                1987 Nexora el cihazı. Mesajlar süzülür; her sefer fişi ve her
                ambient satır ekranı doldurmaz.
              </p>
              <p className="text-[10px] text-stone-600 font-serif italic">
                “Yurtta sulh, cihanda sulh.”
              </p>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {["SMS", "SAAT", "RADYO"].map((x) => (
                  <div
                    key={x}
                    className="rounded-lg border border-stone-800 py-3 text-[10px] text-stone-500"
                  >
                    {x}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tuş takımı görseli */}
        <div className="p-3 grid grid-cols-3 gap-1.5">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map(
            (k) => (
              <div
                key={k}
                className="h-8 rounded-md bg-stone-900 border border-stone-700 text-center text-xs text-stone-500 leading-8 font-mono"
              >
                {k}
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mx-3 mb-3 py-2.5 rounded-xl bg-stone-800 border border-stone-600 text-sm text-stone-300"
        >
          Kapat
        </button>
      </div>
    </div>
  );
}