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
  sendSabotage,
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
  const terminalName = useGameStore((s) => s.terminalName);
  const createRoom = useGameStore((s) => s.createRoom);
  const joinRoomStore = useGameStore((s) => s.joinRoom);
  const leaveRoomStore = useGameStore((s) => s.leaveRoom);
  const shareRoomText = useGameStore((s) => s.shareRoomText);
  const roomCode = useGameStore((s) => s.roomCode);
  const roomName = useGameStore((s) => s.roomName);
  const spendMoney = useGameStore((s) => s.spendMoney);
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
  const [boardTab, setBoardTab] = useState<"money" | "score">("money");
  const [targets, setTargets] = useState<string[]>([]);
  const [saboLog, setSaboLog] = useState<string[]>([]);

  const display = playerName || companyName || "Esnaf";
  const firm = companyName || "İsimsiz Tur";
  const cityHint =
    (terminalName && terminalName.split(/\s+/)[0]) ||
    firm.split(/\s+/)[0] ||
    "Keşan";
  const score = balance + reputation * 500;
  const title = lobbyTitle(score, cityHint);

  const selfPing: LeaderPing = useMemo(
    () => ({
      name: display,
      company: firm,
      score,
      rep: reputation,
      title,
      at: Date.now(),
    }),
    [display, firm, score, reputation, title]
  );

  const rankedScore = useMemo(() => {
    const map = { ...board, [display]: { ...selfPing, score } };
    return Object.values(map).sort((a, b) => b.score - a.score);
  }, [board, display, selfPing, score]);

  const rankedMoney = useMemo(() => {
    const map = { ...board, [display]: selfPing };
    return Object.values(map)
      .map((r) => ({
        ...r,
        money: Math.max(0, r.score - r.rep * 500),
      }))
      .sort((a, b) => b.money - a.money);
  }, [board, display, selfPing]);

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
        onLeader: (l) => {
          setBoard((b) => ({ ...b, [l.name]: l }));
          setTargets((t) =>
            Array.from(new Set([...t, l.company].filter(Boolean))).slice(0, 12)
          );
        },
        onLot: (l) => setLot(l),
        onAuction: (a) => {
          setLot((prev) =>
            prev
              ? { ...prev, highBid: a.amount, highBidder: a.bidder }
              : prev
          );
        },
        onSabotage: (s) => {
          setSaboLog((x) =>
            [`${s.from} → ${s.target}: ${s.kind}`, ...x].slice(0, 8)
          );
          if (s.target === display || s.target === firm) {
            const penalty = s.kind === "ariza" ? 1500 : 800;
            useGameStore.setState((st) => ({
              balance: Math.max(0, st.balance - penalty),
              reputation: Math.max(
                0,
                st.reputation - (s.kind === "ariza" ? 2 : 0)
              ),
            }));
            useGameStore.getState().addLedger("Rakip darbesi", -penalty);
          }
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
            ? "Yerel oda"
            : `Bağlantı: ${res.reason}`
        );
      }
    })();

    return () => {
      cancelled = true;
      leaveRoomChannel();
    };
  }, [roomCode, display, firm, roomName, publishSelf]);

  useEffect(() => {
    if (!roomCode) return;
    const id = setInterval(() => publishSelf(), 18000);
    return () => clearInterval(id);
  }, [roomCode, publishSelf]);

  useEffect(() => {
    if (!roomCode || !connected) return;
    const id = setInterval(() => {
      if (Math.random() > 0.4) return;
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
    }, 60_000);
    return () => clearInterval(id);
  }, [roomCode, connected]);

  const create = () => createRoom(ligaName);
  const join = () => {
    if (!joinRoomStore(joinCode)) alert("Geçersiz kod");
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
    setTargets([]);
  };

  const shareX = () => {
    const rich = rankedMoney[0];
    const extra = rich ? ` Zirve kasa: ${rich.company}.` : "";
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(
        shareRoomText() + extra + " #OtogarTycoon"
      )}`,
      "_blank"
    );
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
    await sendAuctionBid(`${lot.from}-${lot.to}`, display, amount);
    setLot({ ...lot, highBid: amount, highBidder: display });
    setBid("");
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
    addLedger(`Peron ${lot.from}-${lot.to}`, -lot.highBid);
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
          {title} · kasa {formatMoney(balance)}
          {isSupabaseConfigured() ? " · canlı" : " · yerel"}
        </p>
        {status && (
          <p className="text-[11px] text-cyan-500/80 mt-1">{status}</p>
        )}
      </div>

      {!roomCode ? (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="text-sm font-semibold mb-3">Lig kur</div>
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
          <div className="bg-zinc-900 border border-cyan-800/60 rounded-2xl p-5">
            <div className="text-xs text-zinc-500">Aktif lig</div>
            <div className="text-lg font-bold text-cyan-300">
              {roomName || "Oda"}
            </div>
            <div className="text-3xl font-mono tracking-[0.25em] mt-1">
              {roomCode}
            </div>
            <div className="text-xs text-emerald-400 mt-2">
              {presence} esnaf · {title}
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

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setBoardTab("money")}
                className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold ${
                  boardTab === "money"
                    ? "bg-emerald-600 text-black"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                EN ZENGİN KASA
              </button>
              <button
                type="button"
                onClick={() => setBoardTab("score")}
                className={`flex-1 text-[10px] py-1.5 rounded-lg font-bold ${
                  boardTab === "score"
                    ? "bg-amber-600 text-black"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                LİG SKORU
              </button>
            </div>
            <ul className="space-y-2">
              {(boardTab === "money" ? rankedMoney : rankedScore)
                .slice(0, 8)
                .map((r, i) => {
                  const money = Math.max(0, r.score - r.rep * 500);
                  return (
                    <li
                      key={r.name + String(i)}
                      className="flex items-center gap-2 text-xs border-b border-zinc-800/80 pb-2"
                    >
                      <span className="w-5 text-zinc-500 font-mono">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{r.company}</div>
                        <div className="text-[10px] text-amber-500/90 truncate">
                          {r.title}
                        </div>
                      </div>
                      <div className="text-right font-mono text-emerald-400/90">
                        {boardTab === "money"
                          ? formatMoney(money)
                          : r.score.toLocaleString("tr-TR")}
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <div className="bg-zinc-900 border border-amber-900/40 rounded-2xl p-4">
            <div className="flex justify-between mb-2">
              <div className="text-[10px] tracking-widest text-amber-500 font-bold">
                PERON MÜZAYEDESİ
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
              <p className="text-xs text-zinc-600">İlan yok</p>
            ) : (
              <div className="space-y-2">
                <div className="text-sm font-semibold">
                  {lot.from} → {lot.to}
                </div>
                <div className="text-xs text-zinc-400">
                  Kapasite {lot.capacity} · {formatMoney(lot.highBid)}
                  {lot.highBidder ? ` · ${lot.highBidder}` : ""}
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm"
                    value={bid}
                    onChange={(e) => setBid(e.target.value)}
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
                    Peronu al
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-zinc-900 border border-red-900/30 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-red-400 font-bold mb-1">
              ESNAF DARBESİ · 2500₺
            </div>
            <div className="flex flex-wrap gap-1">
              {targets
                .filter((t) => t !== firm)
                .map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="text-[10px] px-2 py-1 rounded border border-zinc-700"
                    onClick={() => {
                      if (!spendMoney(2500)) {
                        alert("Para yetmiyor");
                        return;
                      }
                      addLedger(`Darb · ${t}`, -2500);
                      void sendSabotage(display, t, "ariza");
                    }}
                  >
                    {t}
                  </button>
                ))}
            </div>
            {saboLog.map((l, i) => (
              <div key={i} className="text-[10px] text-red-300/80 mt-1">
                {l}
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              FİYAT NABZI
            </div>
            {prices.length === 0 ? (
              <p className="text-xs text-zinc-600">Sefer açılınca…</p>
            ) : (
              <ul className="space-y-1 text-xs max-h-28 overflow-y-auto">
                {prices.map((p, i) => (
                  <li key={i}>
                    {p.company}: {p.route} · {p.price} ₺
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-[10px] tracking-widest text-zinc-500 font-bold mb-2">
              SOHBET
            </div>
            <div className="h-40 overflow-y-auto space-y-1 text-xs mb-2">
              {chat.map((m) => (
                <div key={m.id}>
                  <span className="text-cyan-400">{m.from}</span>
                  {" · "}
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