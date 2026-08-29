"use client";

import { useEffect, useState } from "react";

const KEY = "otogar-lobby-v1";

export default function LobbyPage() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("Trakya Ligi");
  const [join, setJoin] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const j = JSON.parse(raw) as { code: string; name: string };
        setRoomCode(j.code);
        setRoomName(j.name);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const save = (code: string, n: string) => {
    localStorage.setItem(KEY, JSON.stringify({ code, name: n }));
    setRoomCode(code);
    setRoomName(n);
  };

  const create = () => {
    const code = Math.random().toString(36).slice(2, 6).toUpperCase();
    save(code, name.trim() || "Trakya Ligi");
  };

  const joinRoom = () => {
    const c = join.trim().toUpperCase();
    if (c.length < 4) {
      alert("En az 4 karakter kod");
      return;
    }
    save(c, `Oda ${c}`);
  };

  const leave = () => {
    localStorage.removeItem(KEY);
    setRoomCode(null);
    setRoomName("");
  };

  const shareX = () => {
    const text = encodeURIComponent(
      `Otogar Tycoon'da yazıhanemi kurdum, peron savaşlarında arkadaşlarıma meydan okuyorum! Oda Kodum: ${roomCode}, gel esnaf gör!`
    );
    window.open(`https://x.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-1">Lobi · Peron Savaşı</h1>
      <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
        Oda kodu üret, X’te meydan oku. Canlı fiyat kapışması sonraki sürüm —
        şimdilik davet + kod.
      </p>

      {roomCode ? (
        <div className="bg-zinc-900 border border-cyan-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs text-zinc-500">Aktif oda</div>
          <div className="text-lg font-bold text-cyan-300">{roomName}</div>
          <div className="text-3xl font-mono tracking-[0.3em] text-white">
            {roomCode}
          </div>
          <p className="text-xs text-zinc-500">
            En fazla 10 arkadaş. Herkes kendi firması. 30 oyun günü sonra Baş
            Ağa (yakında).
          </p>
          <button
            type="button"
            onClick={shareX}
            className="w-full py-3 rounded-xl font-bold text-sm text-[#0D0D1A]"
            style={{ background: "linear-gradient(90deg,#00F0FF,#007BFF)" }}
          >
            X&apos;te paylaş / arkadaşını çağır
          </button>
          <button
            type="button"
            onClick={leave}
            className="w-full py-2 text-xs text-zinc-500"
          >
            Odadan çık
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Lobi oluştur</div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Trakya Ligi"
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
