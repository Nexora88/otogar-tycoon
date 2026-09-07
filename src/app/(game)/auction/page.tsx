"use client";

import { useCallback, useEffect, useState } from "react";
import ProgressGate from "@/components/ProgressGate";
import { useGameStore } from "@/store/gameStore";
import {
  joinRoomChannel,
  leaveRoomChannel,
  sendAuctionBid,
  sendSabotage,
  type AuctionBid,
  type SabotagePing,
} from "@/lib/roomChannel";
import { formatMoney } from "@/lib/utils";

const PERONS = [
  "İstanbul Esenler 1. Peron",
  "İstanbul Esenler 7. Peron",
  "Ankara AŞTİ 3. Peron",
  "İzmir 2. Peron",
  "Keşan Orta Peron",
];

const KEY = "otogar-lobby-v2";

export default function AuctionPage() {
  return (
    <ProgressGate unlock="auction">
      <AuctionInner />
    </ProgressGate>
  );
}

function AuctionInner() {
  const companyName = useGameStore((s) => s.companyName);
  const balance = useGameStore((s) => s.balance);
  const spendMoney = useGameStore((s) => s.spendMoney);
  const addMoney = useGameStore((s) => s.addMoney);
  const upgradeCrier = useGameStore((s) => s.upgradeCrier);
  const crierLevel = useGameStore((s) => s.crierLevel);
  const crierBonus = useGameStore((s) => s.crierBonus);
  const pushPhone = useGameStore((s) => s.pushPhone);
  const roomCode = useGameStore((s) => s.roomCode);

  const [code, setCode] = useState<string | null>(null);
  const [bids, setBids] = useState<AuctionBid[]>([]);
  const [peron, setPeron] = useState(PERONS[0]!);
  const [bidAmt, setBidAmt] = useState(5000);
  const [target, setTarget] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [live, setLive] = useState(false);

  const connect = useCallback(
    async (c: string) => {
      const res = await joinRoomChannel(c, companyName || "Firma", {
        onAuction: (a) => {
          setBids((b) => [a, ...b].slice(0, 30));
          setLog((l) =>
            [`İHALE: ${a.bidder} → ${a.peron} ${a.amount} ₺`, ...l].slice(0, 40)
          );
        },
        onSabotage: (s: SabotagePing) => {
          setLog((l) =>
            [
              `SABOTAJ: ${s.from} → ${s.target} (${s.kind})`,
              ...l,
            ].slice(0, 40)
          );
          if (
            s.target.toLowerCase() === (companyName || "").toLowerCase()
          ) {
            if (s.kind === "ariza") {
              useGameStore.setState((st) => ({
                balance: Math.max(0, st.balance - 3500),
                reputation: Math.max(0, st.reputation - 2),
              }));
              pushPhone("Garaj", "Gizli arıza şüphesi — 3500 ₺ hasar.");
            } else {
              useGameStore.setState((st) => ({
                fuelPrice: Math.min(80, st.fuelPrice + 3),
              }));
              pushPhone("İstasyon", "Yakıt fiyatın manipüle edilmiş gibi…");
            }
          }
        },
      });
      setLive(res.ok);
      setCode(c);
    },
    [companyName, pushPhone]
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const fromStore = roomCode;
      if (fromStore) void connect(fromStore);
      else if (raw) {
        const j = JSON.parse(raw) as { code: string };
        void connect(j.code);
      }
    } catch {
      /* ignore */
    }
    return () => leaveRoomChannel();
  }, [connect, roomCode]);

  const placeBid = async () => {
    if (!spendMoney(bidAmt)) {
      alert("Kasa yetersiz");
      return;
    }
    useGameStore.getState().addLedger(`Peron ihale teklif`, -bidAmt);
    const mine: AuctionBid = {
      peron,
      bidder: companyName || "Firma",
      amount: bidAmt,
      at: Date.now(),
    };
    setBids((b) => [mine, ...b].slice(0, 30));
    if (live) await sendAuctionBid(peron, mine.bidder, bidAmt);
    setLog((l) => [`Sen: ${peron} ${bidAmt} ₺`, ...l].slice(0, 40));
  };

  const doSabotage = async (kind: "ariza" | "yakit") => {
    const cost = kind === "ariza" ? 6000 : 4500;
    if (!target.trim()) {
      alert("Rakip firma adı");
      return;
    }
    if (!spendMoney(cost)) {
      alert("Kasa yetersiz");
      return;
    }
    useGameStore.getState().addLedger(`Sabotaj (${kind})`, -cost);
    if (live) {
      await sendSabotage(companyName || "Firma", target.trim(), kind);
    }
    setLog((l) =>
      [`Sabotaj gönderildi → ${target} (${kind})`, ...l].slice(0, 40)
    );
    pushPhone("İstihbarat", "Operasyon yolda. İz bırakma.");
  };

  const hireCrier = () => {
    if (!upgradeCrier()) alert("Para yetmiyor veya max seviye");
    else pushPhone("Çığırtkan", `Seviye ${crierLevel + 1}. Peron sesin arttı.`);
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-2xl font-bold text-amber-400">Canlı Peron Masası</h1>
        <p className="text-xs text-zinc-500 mt-1">
          İhale · çığırtkan · sabotaj. Oda: {code || "yok"} ·{" "}
          {live ? "CANLI" : "yerel / bağlan Lobiden"}
        </p>
        <p className="text-sm text-cyan-400 mt-2">Kasa {formatMoney(balance)}</p>
      </div>

      {/* Çığırtkan */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <h2 className="text-sm font-bold mb-1">Çığırtkan</h2>
        <p className="text-xs text-zinc-500 mb-3">
          Seviye {crierLevel}/5 · bilet dolum çarpanı ×{crierBonus().toFixed(2)}
        </p>
        <button
          type="button"
          onClick={hireCrier}
          className="px-4 py-2 rounded-xl bg-amber-500 text-black text-sm font-semibold"
        >
          Çığırtkan yükselt
        </button>
      </section>

      {/* İhale */}
      <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-bold">Peron ihalesi</h2>
        <select
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          value={peron}
          onChange={(e) => setPeron(e.target.value)}
        >
          {PERONS.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
            value={bidAmt}
            onChange={(e) => setBidAmt(Number(e.target.value))}
            min={1000}
            step={500}
          />
          <button
            type="button"
            onClick={() => void placeBid()}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-sm font-bold"
          >
            Teklif
          </button>
        </div>
        <ul className="text-xs text-zinc-400 space-y-1 max-h-28 overflow-y-auto">
          {bids.map((b, i) => (
            <li key={`${b.at}-${i}`}>
              {b.bidder} · {b.peron} ·{" "}
              <span className="text-amber-400">{b.amount} ₺</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Sabotaj */}
      <section className="bg-zinc-900 border border-red-900/40 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-bold text-red-400/90">Sabotaj / istihbarat</h2>
        <p className="text-[11px] text-zinc-500">
          Sadece odadaki rakip firma adına. Yerel odada sadece sen etkilenmezsin;
          canlı odada hedefe bildirim gider.
        </p>
        <input
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
          placeholder="Rakip firma adı"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void doSabotage("ariza")}
            className="px-3 py-2 rounded-lg border border-red-800 text-red-300 text-xs"
          >
            Gizli arıza (6000 ₺)
          </button>
          <button
            type="button"
            onClick={() => void doSabotage("yakit")}
            className="px-3 py-2 rounded-lg border border-red-800 text-red-300 text-xs"
          >
            Yakıt manipülasyonu (4500 ₺)
          </button>
        </div>
      </section>

      <section className="text-[11px] text-zinc-600 space-y-1">
        {log.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </section>
    </div>
  );
}