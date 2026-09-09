"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

/** Sabit ortak odalar — herkese açık “etkinlik lobileri” */
const PUBLIC_ROOMS = [
  {
    id: "trakya",
    name: "Trakya Ligi",
    tag: "Açık · max 10",
    blurb: "Keşan–Edirne–İstanbul hattı. Fiyat kıran konuşulur.",
    mood: "rekabet",
  },
  {
    id: "asati",
    name: "AŞTİ Meydanı",
    tag: "Açık · max 12",
    blurb: "Ankara peronu. Bayramda doluluk, zabıta, çığırtkan.",
    mood: "merkez",
  },
  {
    id: "ege",
    name: "9 Eylül Ege",
    tag: "Özel gün · açık",
    blurb: "İzmir kurtuluşu anısına coşku + esnaf yarışı. Gazete manşeti düşer.",
    mood: "milli",
  },
  {
    id: "gece",
    name: "Gece Seferi Kulübü",
    tag: "Açık · max 8",
    blurb: "Gece kaptanları. Telsiz, sis, lastik, damar radyo.",
    mood: "gece",
  },
  {
    id: "esnaf",
    name: "Esnaf Çay Ocağı",
    tag: "Sohbet · açık",
    blurb: "Haraç değil, dedikodu. Racon, pişmaniye, Nexora reklamı.",
    mood: "sohbet",
  },
] as const;

type ChatLine = {
  id: string;
  who: string;
  text: string;
  at: number;
  system?: boolean;
};

const BOT_LINES = [
  "Keşan hattında 50 kırdılar, yolcu kayıyor.",
  "Mazot yine konuşuluyor, akşam baskısına bakın.",
  "3 nolu peronda çığırtkanlar bağırıyor.",
  "Yurtta sulh — fiyatı insan gibi tutun.",
  "Nexora Elektronik vitrin ışığı yandı, 1987 model.",
  "Bakraç Ticaret: defter temiz tutanın yolu açık.",
  "Sahte kabadayı yine mesaj atmış, istihbarat alın.",
  "Travego alan var mı pazarda?",
  "Misafir süre bitince hesap açın, ilerleme kaybolmasın.",
];

function isSept9Local(): boolean {
  const d = new Date();
  return d.getMonth() === 8 && d.getDate() === 9;
}

export default function EventsPage() {
  const companyName = useGameStore((s) => s.companyName);
  const playerName = useGameStore((s) => s.playerName);
  const balance = useGameStore((s) => s.balance);
  const reputation = useGameStore((s) => s.reputation);
  const roomCode = useGameStore((s) => s.roomCode);
  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoom = useGameStore((s) => s.joinRoom);
  const leaveRoom = useGameStore((s) => s.leaveRoom);
  const shareRoomText = useGameStore((s) => s.shareRoomText);
  const pushPhone = useGameStore((s) => s.pushPhone);
  const gameDay = useGameStore((s) => s.gameDay);
  const calendarTitle = useGameStore((s) => s.calendarTitle);
  const calendarMood = useGameStore((s) => s.calendarMood);

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [chat, setChat] = useState<ChatLine[]>([]);
  const [draft, setDraft] = useState("");
  const [pulse, setPulse] = useState(0);
  const [board, setBoard] = useState<
    { name: string; score: number; city: string }[]
  >([]);

  const roomMeta = useMemo(
    () => PUBLIC_ROOMS.find((r) => r.id === activeRoom) || null,
    [activeRoom]
  );

  const sept9 = isSept9Local();

  const pushSystem = useCallback((text: string) => {
    setChat((c) =>
      [
        {
          id: `sys-${Date.now()}`,
          who: "Peron Hoparlörü",
          text,
          at: Date.now(),
          system: true,
        },
        ...c,
      ].slice(0, 80)
    );
  }, []);

  // Odaya girince sohbet + sahte sıralama
  useEffect(() => {
    if (!activeRoom) return;
    const meta = PUBLIC_ROOMS.find((r) => r.id === activeRoom);
    pushSystem(
      `${meta?.name || "Oda"} açıldı. Herkese açık peron — racon ve rekabet.`
    );
    if (sept9 || activeRoom === "ege") {
      pushSystem(
        "9 Eylül · İzmir’in kurtuluşu. Bugün manşet coşkulu, fiyatları insan gibi tutun."
      );
    }
    setBoard([
      {
        name: companyName || "Sen",
        score: Math.max(100, reputation * 12 + Math.floor(balance / 500)),
        city: "Senin yazıhane",
      },
      { name: "Boncuk Turizm", score: 4200 + pulse, city: "Keşan" },
      { name: "Yıldız Seyahat", score: 3900 + pulse / 2, city: "Edirne" },
      { name: "Sahil Express", score: 3600, city: "İzmir" },
      { name: "Anadolu Koç", score: 3400, city: "Ankara" },
    ]);
  }, [activeRoom, companyName, reputation, balance, pushSystem, sept9, pulse]);

  // Ambient bot mesaj + nabız
  useEffect(() => {
    if (!activeRoom) return;
    const t = setInterval(() => {
      setPulse((p) => p + 1);
      if (Math.random() > 0.45) {
        const who = [
          "Çığırtkan Remzi",
          "Muavin Salih",
          "Esnaf FM",
          "Hakiki Peron",
          "Nexora Anons",
        ][Math.floor(Math.random() * 5)]!;
        const text = BOT_LINES[Math.floor(Math.random() * BOT_LINES.length)]!;
        setChat((c) =>
          [
            {
              id: `bot-${Date.now()}`,
              who,
              text,
              at: Date.now(),
            },
            ...c,
          ].slice(0, 80)
        );
      }
    }, 14000);
    return () => clearInterval(t);
  }, [activeRoom]);

  const enterPublic = (id: string) => {
    setActiveRoom(id);
    setChat([]);
    // Store oda kodu — canlı kanal bağlanacaksa aynı id
    joinRoom(`PUB-${id.toUpperCase()}`);
    pushPhone(
      "Etkinlik",
      `${PUBLIC_ROOMS.find((r) => r.id === id)?.name || id} odasına girdin.`
    );
  };

  const exitPublic = () => {
    setActiveRoom(null);
    setChat([]);
    leaveRoom();
  };

  const sendChat = () => {
    const t = draft.trim().slice(0, 160);
    if (!t) return;
    setChat((c) =>
      [
        {
          id: `me-${Date.now()}`,
          who: playerName || companyName || "Ağa",
          text: t,
          at: Date.now(),
        },
        ...c,
      ].slice(0, 80)
    );
    setDraft("");
  };

  const createPrivate = () => {
    const code = createRoom(`${companyName || "Firma"} Ligi`);
    pushSystem(`Özel oda: ${code}. X’te paylaş.`);
    setActiveRoom("private");
  };

  const shareX = () => {
    const text = shareRoomText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto pb-28">
      <div className="mb-6">
        <div className="text-[10px] tracking-[0.25em] text-amber-600 font-bold">
          ETKİNLİK · ORTAK PERON
        </div>
        <h1 className="text-2xl font-bold mt-1">Etkinlikler & Açık Odalar</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Gün {gameDay}
          {calendarTitle ? ` · ${calendarTitle}` : ""} ·{" "}
          {calendarMood === "mourning"
            ? "Saygı günü"
            : calendarMood === "national"
              ? "Ulusal coşku"
              : "Normal gün"}
          {sept9 ? " · Gerçek takvim: 9 Eylül" : ""}
        </p>
        <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
          Burası özel oda + herkese açık liglerin buluştuğu yer. Aynı peronda fiyat
          savaşı, sohbet ve (ileride) canlı sıralama. Gerçek para yok — racon var.
        </p>
      </div>

      {/* 9 Eylül / milli şerit */}
      {(sept9 || calendarMood === "national") && (
        <div className="mb-5 rounded-xl border border-amber-800/60 bg-amber-950/30 px-4 py-3">
          <div className="text-xs font-bold text-amber-200">
            {sept9 ? "9 Eylül — İzmir’in Kurtuluşu" : calendarTitle || "Ulusal gün"}
          </div>
          <p className="text-[11px] text-amber-100/70 mt-1">
            Gazetede manşet, telefonda Bakraç mesajı, Ege odasında ekstra coşku.
            Fahiş fiyat zabıtayı çeker — insan gibi tut.
          </p>
        </div>
      )}

      {/* Hızlı özel oda */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Özel lig odası</div>
          <div className="text-[11px] text-zinc-500">
            Kod: {roomCode || "—"} · Arkadaş daveti / X paylaş
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={createPrivate}
            className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 text-black font-semibold"
          >
            Oda kur
          </button>
          <button
            type="button"
            onClick={shareX}
            disabled={!roomCode}
            className="px-3 py-1.5 text-xs rounded-lg border border-zinc-600 text-zinc-300 disabled:opacity-40"
          >
            X’te paylaş
          </button>
          <Link
            href="/lobby"
            className="px-3 py-1.5 text-xs rounded-lg border border-cyan-800 text-cyan-300"
          >
            Lobi detay
          </Link>
        </div>
      </div>

      {!activeRoom && (
        <div className="grid sm:grid-cols-2 gap-3">
          {PUBLIC_ROOMS.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => enterPublic(r.id)}
              className="text-left rounded-xl border border-zinc-800 bg-zinc-900/90 p-4 hover:border-amber-700/60 transition"
            >
              <div className="flex justify-between gap-2">
                <span className="font-semibold text-sm">{r.name}</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider">
                  {r.tag}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                {r.blurb}
              </p>
              <div className="mt-3 text-[10px] text-amber-600/90">
                Gir · sohbet + sıralama
              </div>
            </button>
          ))}
        </div>
      )}

      {activeRoom && roomMeta && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-lg">{roomMeta.name}</h2>
              <p className="text-[11px] text-zinc-500">{roomMeta.blurb}</p>
            </div>
            <button
              type="button"
              onClick={exitPublic}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-600 text-zinc-400"
            >
              Odadan çık
            </button>
          </div>

          {/* Sıralama */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              ANLIK SIRALAMA (nabız)
            </div>
            <ul className="space-y-1.5">
              {[...board]
                .sort((a, b) => b.score - a.score)
                .map((row, i) => (
                  <li
                    key={row.name}
                    className={`flex justify-between text-xs px-2 py-1.5 rounded ${
                      i === 0
                        ? "bg-amber-950/40 text-amber-100"
                        : "text-zinc-400"
                    }`}
                  >
                    <span>
                      <span className="text-zinc-600 mr-2">#{i + 1}</span>
                      {row.name}
                      <span className="text-zinc-600 ml-1">· {row.city}</span>
                    </span>
                    <span className="font-mono">{row.score}</span>
                  </li>
                ))}
            </ul>
            <p className="text-[9px] text-zinc-600 mt-2">
              Puan ≈ itibar + kasa / pasif. Canlı Supabase ile gerçek rakipler
              bağlanacak.
            </p>
          </div>

          {/* Sohbet */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden flex flex-col min-h-[280px]">
            <div className="px-3 py-2 border-b border-zinc-800 text-[10px] tracking-widest text-zinc-500 font-bold">
              PERON SOHBETİ · {roomMeta.mood}
            </div>
            <div className="flex-1 max-h-64 overflow-y-auto p-3 space-y-2 flex flex-col-reverse">
              {chat.map((m) => (
                <div
                  key={m.id}
                  className={`text-[11px] leading-snug ${
                    m.system ? "text-amber-600/80 italic" : "text-zinc-300"
                  }`}
                >
                  <span className="text-zinc-500 font-mono text-[9px] mr-1">
                    {m.who}:
                  </span>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-2 border-t border-zinc-800 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Mesaj yaz… (küfürsüz, siyasetsiz)"
                maxLength={160}
                className="flex-1 text-xs bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2"
              />
              <button
                type="button"
                onClick={sendChat}
                className="px-3 py-2 text-xs rounded-lg bg-amber-600 text-black font-semibold"
              >
                Gönder
              </button>
            </div>
          </div>

          <div className="text-[10px] text-zinc-600 leading-relaxed">
            İpucu: Rakibe fiyat baskısı ve sabotaj için{" "}
            <Link href="/lobby" className="text-cyan-500 underline">
              Lobi
            </Link>{" "}
            · Peron satışı{" "}
            <Link href="/auction" className="text-cyan-500 underline">
              Borsa
            </Link>
            . Kasa {formatMoney(balance)}.
          </div>
        </div>
      )}
    </div>
  );
}