"use client";

import { useCallback, useEffect, useState } from "react";
import {
  joinRoomChannel,
  leaveRoomChannel,
  sendChat,
  sendPrice,
  type ChatMsg,
  type PricePulse,
} from "@/lib/roomChannel";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useGameStore } from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";

const KEY = "otogar-lobby-v2";

export default function LobbyPage() {
  const companyName = useGameStore((s) => s.companyName);
  const reputation = useGameStore((s) => s.reputation);
  const careerHitap = useCareerStore((s) => s.displayHitap);
  const displayName =
    (careerHitap && careerHitap.trim()) || companyName || "Esnaf";

  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [nameInput, setNameInput] = useState("Trakya Ligi");
  const [joinCode, setJoinCode] = useState("");
  const [live, setLive] = useState(false);
  const [online, setOnline] = useState(1);
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [prices, setPrices] = useState<PricePulse[]>([]);
  const [route, setRoute] = useState("İstanbul → Ankara");
  const [myPrice, setMyPrice] = useState(350);
  const [status, setStatus] = useState("");

  const persist = (code: string, n: string) => {
    localStorage.setItem(KEY, JSON.stringify({ code, name: n }));
    setRoomCode(code);
    setRoomName(n);
  };

  const connect = useCallback(
    async (code: string) => {
      setStatus("Odaya bağlanılıyor…");
      const res = await joinRoomChannel(code, displayName, {
        onChat: (m) => setChat((c) => [...c.slice(-80), m]),
        onPrice: (p) => setPrices((list) => [p, ...list].slice(0, 20)),
        onPresence: (n) => setOnline(Math.max(1, n)),
      });
      if (res.ok) {
        setLive(true);
        setStatus("Canlı oda açık");
        setChat((c) => [
          ...c,
          {
            id: `sys-${Date.now()}`,
            from: "Sistem",
            text: `${displayName} odaya girdi.`,
            at: Date.now(),
          },
        ]);
      } else {
        setLive(false);
        setStatus(
          res.reason === "supabase_off"
            ? "Supabase yok — oda kodu yerel; sohbet/canlı kapalı. Env ekle."
            : `Bağlantı: ${res.reason}`
        );
      }
    },
    [displayName]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const j = JSON.parse(raw) as { code: string; name: string };
        setRoomCode(j.code);
        setRoomName(j.name);
        void connect(j.code);
      }
    } catch {
      /* ignore */
    }
    return () => leaveRoomChannel();
  }, [connect]);

  const create = async () => {
    const code = Math.random().toString(36).slice(2, 6).toUpperCase();
    const n = nameInput.trim() || "Trakya Ligi";
    persist(code, n);
    useGameStore.getState().createRoom?.(n);
    await connect(code);
  };

  const joinRoom = async () => {
    const c = joinCode.trim().toUpperCase();
    if (c.length < 4) {
      alert("Kod en az 4 karakter");
      return;
    }
    persist(c, `Oda ${c}`);
    useGameStore.getState().joinRoom?.(c);
    await connect(c);
  };

  const leave = () => {
    leaveRoomChannel();
    localStorage.removeItem(KEY);
    setRoomCode(null);
    setRoomName("");
    setLive(false);
    setChat([]);
    setPrices([]);
    setOnline(1);
    useGameStore.getState().leaveRoom?.();
  };

  const shareX = () => {
    const text = encodeURIComponent(
      `Otogar Tycoon'da yazıhanemi kurdum, peron savaşlarında arkadaşlarıma meydan okuyorum! Oda Kodum: ${roomCode}, gel esnaf gör!`
    );
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  const onSend = async () => {
    const t = text.trim();
    if (!t) return;
    if (live) {
      await sendChat(displayName, t);
      // broadcast bazen kendini göstermez — lokal ekle
      setChat((c) => [
        ...c,
        {
          id: `local-${Date.now()}`,
          from: displayName,
          text: t,
          at: Date.now(),
        },
      ]);
    } else {
      setChat((c) => [
        ...c,
        {
          id: `local-${Date.now()}`,
          from: displayName,
          text: t,
          at: Date.now(),
        },
      ]);
    }
    setText("");
  };

  const publishPrice = async () => {
    if (live) {
      await sendPrice(displayName, route, myPrice);
    }
    setPrices((list) => [
      {
        company: displayName,
        route,
        price: myPrice,
        at: Date.now(),
      },
      ...list,
    ].slice(0, 20));
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-1">Lobi · Peron Savaşı</h1>
      <p className="text-zinc-500 text-sm mb-2">
        Oda kodu · sohbet · fiyat nabzı.{" "}
        {isSupabaseConfigured()
          ? "Supabase canlı kanal hazır."
          : "Canlı için NEXT_PUBLIC_SUPABASE_* gerekli."}
      </p>
      <p className="text-xs text-zinc-600 mb-6">
        Sen: {displayName} · İtibar {reputation}/100 · Online (oda): {online}
      </p>

      {!roomCode ? (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Lobi oluştur</div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Örn: Trakya Ligi"
            />
            <button
              type="button"
              onClick={() => void create()}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-sm"
            >
              Oda kodu al + bağlan
            </button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Koda katıl</div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm uppercase"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="4F9G"
              maxLength={8}
            />
            <button
              type="button"
              onClick={() => void joinRoom()}
              className="w-full py-2.5 rounded-xl border border-zinc-600 text-sm"
            >
              Katıl
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-cyan-800 rounded-2xl p-5">
            <div className="text-xs text-zinc-500">Aktif oda</div>
            <div className="text-lg font-bold text-cyan-300">{roomName}</div>
            <div className="text-3xl font-mono tracking-[0.3em] text-white my-2">
              {roomCode}
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              {status} · {live ? "CANLI" : "YEREL"}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={shareX}
                className="px-4 py-2 rounded-xl text-sm font-bold text-[#0D0D1A]"
                style={{
                  background: "linear-gradient(90deg,#00F0FF,#007BFF)",
                }}
              >
                X&apos;te paylaş
              </button>
              <button
                type="button"
                onClick={leave}
                className="px-4 py-2 text-xs text-zinc-500"
              >
                Odadan çık
              </button>
            </div>
          </div>

          {/* Canlı fiyat nabzı */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-xs font-bold text-amber-500 tracking-widest mb-2">
              CANLI BİLET NABZI
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <select
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-sm"
                value={route}
                onChange={(e) => setRoute(e.target.value)}
              >
                <option>İstanbul → Ankara</option>
                <option>İstanbul → İzmir</option>
                <option>Ankara → Antalya</option>
                <option>Keşan → İstanbul</option>
                <option>Adana → Ankara</option>
              </select>
              <input
                type="number"
                className="w-28 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-2 text-sm"
                value={myPrice}
                onChange={(e) => setMyPrice(Number(e.target.value))}
              />
              <button
                type="button"
                onClick={() => void publishPrice()}
                className="px-3 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold"
              >
                Yayınla
              </button>
            </div>
            <ul className="space-y-1 max-h-32 overflow-y-auto text-xs">
              {prices.length === 0 && (
                <li className="text-zinc-600">Henüz nabız yok.</li>
              )}
              {prices.map((p, i) => (
                <li key={`${p.at}-${i}`} className="text-zinc-400">
                  <span className="text-cyan-400">{p.company}</span> · {p.route}{" "}
                  · <span className="text-amber-400">{p.price} ₺</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sohbet */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col h-72">
            <div className="text-xs font-bold text-zinc-500 tracking-widest mb-2">
              ODA SOHBETİ
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 text-sm mb-2">
              {chat.map((m) => (
                <div key={m.id}>
                  <span className="text-cyan-500 text-xs font-semibold">
                    {m.from}
                  </span>
                  <span className="text-zinc-300"> {m.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") void onSend();
                }}
                placeholder="Yaz…"
                maxLength={200}
              />
              <button
                type="button"
                onClick={() => void onSend()}
                className="px-4 py-2 rounded-lg bg-cyan-600 text-sm font-semibold"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}