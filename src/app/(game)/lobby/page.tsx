"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useGameStore } from "@/store/gameStore";
import {
  joinRoomChannel,
  leaveRoomChannel,
  sendChat,
  sendLeader,
  sendLot,
  sendAuctionBid,
  type ChatMsg,
  type PricePulse,
  type LeaderPing,
  type PeronLot,
} from "@/lib/roomChannel";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { rollLot, lobbyTitle } from "@/data/peronLots";
import { formatMoney } from "@/lib/utils";

const KEY = "otogar-lobby-v1";

export default function LobbyPage() {
  const companyName = useGameStore((s) => s.companyName);
  const playerName = useGameStore((s) => s.playerName);
  const balance = useGameStore((s) => s.balance);
  const reputation = useGameStore((s) => s.reputation);
  const homeCity = useGameStore((s) => s.homeCity);
  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoomStore = useGameStore((s) => s.joinRoom);
  const leaveRoomStore = useGameStore((s) => s.leaveRoom);
  const shareRoomText = useGameStore((s) => s.shareRoomText);
  const roomCode = useGameStore((s) => s.roomCode);
  const roomName = useGameStore((s) => s.roomName);
  const spendMoney = useGameStore((s) => s.spendMoney);
  const addMoney = useGameStore((s) => s.addMoney);
  const addLedger = useGameStore((s) => s.addLedger);

  const [ligaName, setLigaName] = useState("Trakya Ligi");
  const [joinCode, setJoinCode] = useState("");
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const [prices, setPrices] = useState<PricePulse[]>([]);
  const [board, setBoard] = useState<Record<string, LeaderPing>>({});
  const [lot, setLot] = useState<PeronLot | null>(null);
  const [presence, setPresence] = useState(0);
  const [status, setStatus] = useState("");
  const [text, setText] = useState("");
  const [bid, setBid] = useState("");
  const [connected, setConnected] = useState(false);

  const display = playerName || companyName || "Esnaf";
  const firm = companyName || "İsimsiz Tur";
  const score = balance + reputation * 500;
  const title = lobbyTitle(score, homeCity || "Keşan");

  const ranked = useMemo(() => {
    const list = Object.values(board);
    // kendini ekle
    const self: LeaderPing = {
      name: display,
      company: firm,
      score,
      rep: reputation,
      title,
      at: Date.now(),
    };
    const map = { ...board, [display]: self };
    return Object.values(map).sort((a, b) => b.score - a.score);
  }, [board, display, firm, score, reputation, title]);

  const publishSelf = useCallback(() => {
    void sendLeader({
      name: display,
      company: firm,
      score,
      rep: reputation,
      title,
      at: Date.now(),
    });
  }, [display, firm, score, reputation, title]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw && !roomCode) {
        const j = JSON.parse(raw) as { code: string; name: string };
        joinRoomStore(j.code);
        useGameStore.setState({ roomName: j.name });
      }
    } catch {
      /* */
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
      setStatus("Kanala bağlanıyor…");
      const res = await joinRoomChannel(roomCode, display, {
        onChat: (m) => setChat((c) => [...c, m].slice(-50)),
        onPrice: (p) => setPrices((x) => [p, ...x].slice(0, 15)),
        onPresence: (n) => setPresence(n),
        onLeader: (l) =>
          setBoard((b) => ({ ...b, [l.name]: l })),
        onLot: (l) => setLot(l),
        onAuction: (a) => {
          setLot((prev) =>
            prev && prev.id
              ? {
                  ...prev,
                  highBid: a.amount,
                  highBidder: a.bidder,
                }
              : prev
          );
        },
      });
      if (cancelled) return;
      if (res.ok) {
        setConnected(true);
        setStatus("Canlı lobi");
        publishSelf();
      } else {
        setConnected(false);
        setStatus(
          res.reason === "supabase_off"
            ? "Yerel oda — sıralama bu cihazda"
            : `Bağlantı: ${res.reason}`
        );
      }
    })();

    return () => {
      cancelled = true;
      leaveRoomChannel();
    };
  }, [roomCode, display, roomName, publishSelf]);

  // Periyodik skor yayını
  useEffect(() => {
    if (!roomCode) return;
    const id = setInterval(() => publishSelf(), 20000);
    return () => clearInterval(id);
  }, [roomCode, publishSelf]);

  // Ara sıra peron ilanı (oda sahibi hissi — herkes açabilir)
  useEffect(() => {
    if (!roomCode || !connected) return;
    const id = setInterval(() => {
      if (Math.random() > 0.35) return;
      const t = rollLot();
      const lotPayload: PeronLot = {
        id: `lot-${Date.now()}`,
        from: t.from,
        to: t.to,
        capacity: t.capacity,
        minBid: t.minBid,
        highBid: t.minBid,
        highBidder: null,
        endsAt: Date.now() + 90_000,
      };
      setLot(lotPayload);
      void sendLot(lotPayload);
      setChat((c) => [
        ...c,
        {
          id: `sys-${Date.now()}`,
          from: "Peron İdaresi",
          text: `${t.from} → ${t.to} · ${t.capacity} kapasite açık artırmada! Min ${t.minBid} ₺`,
          at: Date.now(),
        },
      ]);
    }, 55_000);
    return () => clearInterval(id);
  }, [roomCode, connected]);

  const create = () => {
    createRoom(ligaName);
  };

  const join = () => {
    if (!joinRoomStore(joinCode)) alert("Geçersiz kod (en az 4)");
  };

  const leave = () => {
    leaveRoomChannel();
    leaveRoomStore();
    localStorage.removeItem(KEY);
    setChat([]);
    setPrices([]);
    setBoard({});
    setLot(null);
    setPresence(0);
  };

  const shareX = () => {
    const top = ranked[0];
    const extra = top
      ? ` Şu an lider: ${top.title} (${top.company}).`
      : "";
    const base = shareRoomText();
    const t = encodeURIComponent(base + extra + " #OtogarTycoon");
    window.open(`https://x.com/intent/tweet?text=${t}`, "_blank");
  };

  const send = async () => {
    const msg = text.trim();
    if (!msg) return;
    const fromLabel = `${display} · ${title}`;
    const ok = await sendChat(fromLabel, msg);
    if (!ok) {
      setChat((c) => [
        ...c,
        {
          id: `local-${Date.now()}`,
          from: fromLabel,
          text: msg,
          at: Date.now(),
        },
      ]);
    }
    setText("");
  };

  const placeBid = async () => {
    if (!lot) return;
    const amount = Math.floor(Number(bid) || 0);
    if (amount < lot.highBid + 500) {
      alert(`En az ${lot.highBid + 500} ₺`);
      return;
    }
    if (balance < amount) {
      alert("Kasa yetmiyor");
      return;
    }
    // Eskort: teklif blokesi (basit)
    if (!spendMoney(amount - (lot.highBidder === display ? lot.highBid : 0))) {
      // basitleştir: sadece fark
    }
    // Daha net: yeni teklif tam tutarı rezerve etmeyelim — sadece kazanınca kes
    await sendAuctionBid(
      `${lot.from}-${lot.to}`,
      display,
      amount
    );
    setLot({
      ...lot,
      highBid: amount,
      highBidder: display,
    });
    setBid("");
    setChat((c) => [
      ...c,
      {
        id: `bid-${Date.now()}`,
        from: "Müzayede",
        text: `${display} ${amount} ₺ teklif etti (${lot.from}→${lot.to})`,
        at: Date.now(),
      },
    ]);
  };

  const claimLot = () => {
    if (!lot || lot.highBidder !== display) return;
    if (Date.now() < lot.endsAt) {
      alert("Süre bitmedi");
      return;
    }
    if (!spendMoney(lot.highBid)) {
      alert("Ödeme başarısız");
      return;
    }
    addLedger(`Peron hakkı ${lot.from}-${lot.to}`, -lot.highBid);
    addMoney(0);
    setChat((c) => [
      ...c,
      {
        id: `win-${Date.now()}`,
        from: "Peron İdaresi",
        text: `${display} ${lot.from}→${lot.to} peronunu ${lot.highBid} ₺ ile aldı!`,
        at: Date.now(),
      },
    ]);
    setLot(null);
    publishSelf();
  };

  const openLotNow = () => {
    const t = rollLot();
    const lotPayload: PeronLot = {
      id: `lot-${Date.now()}`,
      from: t.from,
      to: t.to,
      capacity: t.capacity,
      minBid: t.minBid,
      highBid: t.minBid,
      highBidder: null,
      endsAt: Date.now() + 90_000,
    };
    setLot(lotPayload);
    void sendLot(lotPayload);
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto pb-28 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Lobi · Peron Savaşı</h1>
        <p className="text-xs text-zinc-500 mt-1">
          {title} · skor {score.toLocaleString("tr-TR")}
          {isSupabaseConfigured() ? " · canlı" : " · yerel"}
        </p>
        {status && (
          <p className="text-[11px] text-cyan-500/80 mt-1">{status}</p>
        )}
      </div>

      {!roomCode ? (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Lig / oda kur</div>
            <input
              className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-700 text-sm"
              value={ligaName}
              onChange={(e) => setLigaName(e.target.value)}
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
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="4F9G"
              maxLength={8}
            />
            <button
              type="button"
              onClick={join}
              className="w-full py-2.5 rounded-xl border border-zinc-600 text-sm"
            >
              Katıl
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Oda kartı */}
          <div className="bg-zinc-900 border border-cyan-800/60 rounded-2xl p-5">
            <div className="text-xs text-zinc-500">Aktif lig</div>
            <div className="text-lg font-bold text-cyan-300">
              {roomName || "Oda"}
            </div>
            <div className="text-3xl font-mono tracking-[0.25em] mt-1">
              {roomCode}
            </div>
            <div className="text-xs text-emerald-400 mt-2">
              {presence} esnaf · sen: {title}
            </div>
            <button
              type="button"
              onClick={shareX}
              className="mt-4 w-full py-3 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              X’te meydan oku
            </button>
            <button
              type="button"
              onClick={leave}
              className="w-full py-2 text-xs text-zinc-500 mt-2"
            >
              Odadan çık
            </button>
          </div>

          {/* Sıralama */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-amber-600 font-bold mb-2">
              LİG SIRALAMASI · BAŞ AĞA ADAYLARI
            </div>
            <ul className="space-y-2">
              {ranked.slice(0, 8).map((r, i) => (
                <li
                  key={r.name + i}
                  className="flex items-center gap-2 text-xs border-b border-zinc-800/80 pb-2"
                >
                  <span className="w-5 text-zinc-500 font-mono">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-200 truncate">
                      {r.company}
                    </div>
                    <div className="text-[10px] text-amber-500/90 truncate">
                      {r.title} · {r.name}
                    </div>
                  </div>
                  <div className="text-right font-mono text-emerald-400/90">
                    {r.score.toLocaleString("tr-TR")}
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-[10px] text-zinc-600 mt-2">
              Skor ≈ kasa + itibar×500. 30 oyun günü sonunda zirvedeki Baş Ağa
              (yakında resmi taç).
            </p>
          </div>

          {/* Müzayede */}
          <div className="bg-zinc-900 border border-amber-900/40 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[10px] tracking-widest text-amber-500 font-bold">
                PERON AÇIK ARTIRMA
              </div>
              <button
                type="button"
                onClick={openLotNow}
                className="text-[10px] text-cyan-400"
              >
                İlan aç
              </button>
            </div>
            {!lot ? (
              <p className="text-xs text-zinc-600">
                Bekleniyor… veya “İlan aç”. Örn: Edirne → Keşan Yaylaköy.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-semibold">
                  {lot.from} → {lot.to}
                </div>
                <div className="text-xs text-zinc-400">
                  Kapasite {lot.capacity} · min {formatMoney(lot.minBid)}
                </div>
                <div className="text-sm text-amber-300">
                  Teklif: {formatMoney(lot.highBid)}
                  {lot.highBidder ? ` · ${lot.highBidder}` : ""}
                </div>
                <div className="text-[10px] text-zinc-500">
                  Bitiş ~{Math.max(0, Math.ceil((lot.endsAt - Date.now()) / 1000))}s
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm"
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
                    placeholder={`+500 min`}
                    inputMode="numeric"
                  />
                  <button
                    type="button"
                    onClick={() => void placeBid()}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 text-black text-sm font-bold"
                  >
                    Teklif
                  </button>
                </div>
                {lot.highBidder === display && Date.now() >= lot.endsAt && (
                  <button
                    type="button"
                    onClick={claimLot}
                    className="w-full py-2 rounded-lg bg-emerald-600 text-black text-sm font-bold"
                  >
                    Peronu al · {formatMoney(lot.highBid)}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Fiyat nabzı */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              FİYAT NABZI
            </div>
            {prices.length === 0 ? (
              <p className="text-xs text-zinc-600">Sefer açılınca dolacak.</p>
            ) : (
              <ul className="space-y-1 text-xs max-h-28 overflow-y-auto">
                {prices.map((p, i) => (
                  <li key={i} className="text-amber-200/90">
                    {p.company}: {p.route} · {p.price} ₺
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Sohbet */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              SOHBET · rütbeli isim
            </div>
            <div className="h-44 overflow-y-auto space-y-1.5 text-xs mb-2">
              {chat.map((m) => (
                <div key={m.id}>
                  <span className="text-cyan-400 font-medium">{m.from}</span>
                  <span className="text-zinc-500"> · </span>
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
                placeholder="Keşan Tur Ağası yazıyor…"
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
        </>
      )}
    </div>
  );
          }
