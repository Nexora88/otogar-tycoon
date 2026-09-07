"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import {
  joinRoomChannel,
  leaveRoomChannel,
  sendChat,
  type ChatMsg,
  type PricePulse,
} from "@/lib/roomChannel";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const KEY = "otogar-lobby-v1";

export default function LobbyPage() {
  const companyName = useGameStore((s) => s.companyName);
  const playerName = useGameStore((s) => s.playerName);
  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoomStore = useGameStore((s) => s.joinRoom);
  const leaveRoomStore = useGameStore((s) => s.leaveRoom);
  const shareRoomText = useGameStore((s) => s.shareRoomText);
  const roomCode = useGameStore((s) => s.roomCode);
  const roomName = useGameStore((s) => s.roomName);

  const [name, setName] = useState("Trakya Ligi");
  const [join, setJoin] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [prices, setPrices] = useState<PricePulse[]>([]);
  const [presence, setPresence] = useState(0);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);

  // localStorage senkron
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw && !roomCode) {
        const j = JSON.parse(raw) as { code: string; name: string };
        joinRoomStore(j.code);
        useGameStore.setState({ roomName: j.name });
      }
    } catch {
      /* ignore */
    }
  }, [roomCode, joinRoomStore]);

  useEffect(() => {
    if (!roomCode) {
      leaveRoomChannel();
      setConnected(false);
      return;
    }
    localStorage.setItem(
      KEY,
      JSON.stringify({ code: roomCode, name: roomName || roomCode })
    );
    let cancelled = false;
    void (async () => {
      setStatus("Bağlanıyor…");
      const res = await joinRoomChannel(
        roomCode,
        playerName || companyName || "Esnaf",
        {
          onChat: (m) => setChat((c) => [...c, m].slice(-40)),
          onPrice: (p) => setPrices((x) => [p, ...x].slice(0, 12)),
          onPresence: (n) => setPresence(n),
        }
      );
      if (cancelled) return;
      if (res.ok) {
        setConnected(true);
        setStatus("Canlı kanal açık");
      } else {
        setConnected(false);
        setStatus(
          res.reason === "supabase_off"
            ? "Supabase yok — kod kaydı yerel; canlı chat kapalı"
            : `Bağlantı: ${res.reason}`
        );
      }
    })();
    return () => {
      cancelled = true;
      leaveRoomChannel();
    };
  }, [roomCode, playerName, companyName, roomName]);

  const create = () => {
    const code = createRoom(name);
    setStatus(`Oda ${code}`);
  };

  const joinRoom = () => {
    if (!joinRoomStore(join)) {
      alert("Geçersiz kod");
      return;
    }
  };

  const leave = () => {
    leaveRoomChannel();
    leaveRoomStore();
    localStorage.removeItem(KEY);
    setChat([]);
    setPrices([]);
    setPresence(0);
    setConnected(false);
  };

  const shareX = () => {
    const t = encodeURIComponent(shareRoomText());
    window.open(`https://x.com/intent/tweet?text=${t}`, "_blank");
  };

  const send = async () => {
    if (!text.trim()) return;
    const ok = await sendChat(
      playerName || companyName || "Esnaf",
      text.trim()
    );
    if (!ok) {
      // yerel echo
      setChat((c) => [
        ...c,
        {
          id: `local-${Date.now()}`,
          from: playerName || "Sen",
          text: text.trim(),
          at: Date.now(),
        },
      ]);
    }
    setText("");
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-1">Lobi · Peron Savaşı</h1>
      <p className="text-zinc-500 text-sm mb-2">
        Oda kodu · sohbet · fiyat nabzı
        {isSupabaseConfigured() ? " · Supabase canlı" : " · yerel mod"}
      </p>
      {status && (
        <p className="text-[11px] text-cyan-500/80 mb-4">{status}</p>
      )}

      {roomCode ? (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-cyan-800 rounded-2xl p-5">
            <div className="text-xs text-zinc-500">Aktif oda</div>
            <div className="text-lg font-bold text-cyan-300">
              {roomName || "Oda"}
            </div>
            <div className="text-3xl font-mono tracking-[0.3em] text-white mt-1">
              {roomCode}
            </div>
            <div className="text-xs text-emerald-400 mt-2">
              {presence} kişi odada
              {connected ? " · bağlı" : ""}
            </div>
            <button
              type="button"
              onClick={shareX}
              className="mt-4 w-full py-3 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              X’te paylaş
            </button>
            <button
              type="button"
              onClick={leave}
              className="w-full py-2 text-xs text-zinc-500 mt-2"
            >
              Odadan çık
            </button>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              FİYAT NABZI
            </div>
            {prices.length === 0 && (
              <p className="text-xs text-zinc-600">
                Sefer açılınca rakip fiyatları burada.
              </p>
            )}
            <ul className="space-y-1 text-xs max-h-28 overflow-y-auto">
              {prices.map((p, i) => (
                <li key={i} className="text-amber-200/90">
                  {p.company}: {p.route} · {p.price} ₺
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              SOHBET
            </div>
            <div className="h-40 overflow-y-auto space-y-1 text-xs mb-2">
              {chat.map((m) => (
                <div key={m.id}>
                  <span className="text-cyan-400">{m.from}: </span>
                  <span className="text-zinc-300">{m.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void send()}
                placeholder="Yazıhane telsizi…"
              />
              <button
                type="button"
                onClick={() => void send()}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 text-sm font-semibold"
              >
                Gönder
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Lobi oluştur</div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Trakya Ligi"
            />
            <button
              type="button"
              onClick={create}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-sm"
            >
              Oda kodu al
            </button>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Koda katıl</div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm uppercase"
              value={join}
              onChange={(e) => setJoin(e.target.value)}
              placeholder="4F9G"
              maxLength={8}
            />
            <button
              type="button"
              onClick={joinRoom}
              className="w-full py-2.5 rounded-xl border border-zinc-600 text-sm"
            >
              Katıl
            </button>
          </div>
        </div>
      )}
    </div>
  );
}