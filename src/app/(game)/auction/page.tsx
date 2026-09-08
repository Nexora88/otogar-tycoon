"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import {
  joinRoomChannel,
  leaveRoomChannel,
  sendLot,
  sendAuctionBid,
  sendSabotage,
  sendChat,
  type PeronLot,
  type ChatMsg,
} from "@/lib/roomChannel";
import { rollLot } from "@/data/peronLots";
import { formatMoney } from "@/lib/utils";
import { playClick, playWarn, playCoin } from "@/lib/audio";

type Intel = {
  id: string;
  title: string;
  body: string;
  cost: number;
};

const INTEL_POOL: Intel[] = [
  {
    id: "fuel",
    title: "Yakıt manipülasyonu",
    body: "Rakip depoda fiyat şişirmiş. Sen ucuza alırsan 1 sefer mazot −%8.",
    cost: 3500,
  },
  {
    id: "peron",
    title: "Peron istihbarat",
    body: "Yarın hangi hat dolu, zabıta hangi kapıda — fısıltı.",
    cost: 2000,
  },
  {
    id: "mafia",
    title: "Kapı bağlantısı",
    body: "İsim yok. ‘Selam söyle’ dersin; aidat pazarlığı yumuşar (bir kez).",
    cost: 5000,
  },
];

export default function AuctionPage() {
  const companyName = useGameStore((s) => s.companyName);
  const playerName = useGameStore((s) => s.playerName);
  const balance = useGameStore((s) => s.balance);
  const roomCode = useGameStore((s) => s.roomCode);
  const spendMoney = useGameStore((s) => s.spendMoney);
  const addLedger = useGameStore((s) => s.addLedger);
  const pushPhone = useGameStore((s) => s.pushPhone);
  const fuelPrice = useGameStore((s) => s.fuelPrice);

  const display = playerName || companyName || "Esnaf";
  const [lot, setLot] = useState<PeronLot | null>(null);
  const [bid, setBid] = useState("");
  const [feed, setFeed] = useState<string[]>([]);
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [status, setStatus] = useState("");
  const [fuelTip, setFuelTip] = useState(false);

  useEffect(() => {
    if (!roomCode) {
      setStatus("Önce lobide oda aç / katıl");
      return;
    }
    let cancelled = false;
    void (async () => {
      const res = await joinRoomChannel(roomCode, display, {
        onLot: (l) => {
          setLot(l);
          setFeed((f) =>
            [
              `PERON SATIŞTA: ${l.from} → ${l.to} · min ${l.minBid} ₺`,
              ...f,
            ].slice(0, 20)
          );
          pushPhone(
            "Hakiki Peron",
            `${l.from}→${l.to} açık artırmada! Kapasite ${l.capacity}.`
          );
        },
        onAuction: (a) => {
          setLot((prev) =>
            prev
              ? { ...prev, highBid: a.amount, highBidder: a.bidder }
              : prev
          );
          setFeed((f) =>
            [`Teklif: ${a.bidder} ${a.amount} ₺ (${a.peron})`, ...f].slice(
              0,
              20
            )
          );
        },
        onChat: (m) => setMsgs((c) => [...c, m].slice(-30)),
        onSabotage: (s) => {
          setFeed((f) =>
            [`Darb: ${s.from} → ${s.target} (${s.kind})`, ...f].slice(0, 20)
          );
        },
      });
      if (cancelled) return;
      setStatus(res.ok ? "Canlı müzayede kanalı" : res.reason || "Kapalı");
    })();
    return () => {
      cancelled = true;
      // lobby de kanal kullanıyorsa leave etme — tek kanal
    };
  }, [roomCode, display, pushPhone]);

  const openSale = () => {
    if (!roomCode) {
      alert("Lobi odası yok");
      return;
    }
    const t = rollLot();
    const lotPayload: PeronLot = {
      id: `lot-${Date.now()}`,
      from: t.from,
      to: t.to,
      capacity: t.capacity,
      minBid: t.minBid,
      highBid: t.minBid,
      highBidder: null,
      endsAt: Date.now() + 120_000,
    };
    setLot(lotPayload);
    void sendLot(lotPayload);
    void sendChat(
      "Peron İdaresi",
      `${t.from} → ${t.to} SATIŞTA · ${t.capacity} kapasite · min ${t.minBid} ₺`
    );
    pushPhone(
      "Hakiki Peron Gazetesi",
      `Manşet: ${t.from}-${t.to} peronu açık artırmada.`
    );
    playClick();
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
    playClick();
  };

  const claim = () => {
    if (!lot || lot.highBidder !== display) return;
    if (Date.now() < lot.endsAt) {
      alert("Süre bitmedi");
      return;
    }
    if (!spendMoney(lot.highBid)) {
      playWarn();
      return;
    }
    addLedger(`Peron ihalesi ${lot.from}-${lot.to}`, -lot.highBid);
    pushPhone(
      "Hakiki Peron Gazetesi",
      `${companyName} ${lot.from}→${lot.to} peronunu ${lot.highBid} ₺ ile aldı.`
    );
    void sendChat(
      "Peron İdaresi",
      `SATILDI → ${display} / ${companyName} · ${lot.from}-${lot.to} · ${lot.highBid} ₺`
    );
    setLot(null);
    playCoin();
  };

  const buyIntel = (intel: Intel) => {
    if (!spendMoney(intel.cost)) {
      playWarn();
      return;
    }
    addLedger(intel.title, -intel.cost);
    if (intel.id === "fuel") {
      setFuelTip(true);
      useGameStore.setState((s) => ({
        fuelPrice: Math.max(20, Math.round(s.fuelPrice * 0.92)),
      }));
    }
    if (intel.id === "mafia") {
      pushPhone("İsimsiz", "Selam iletildi. Bu hafta kapı biraz yumuşak.");
    }
    setFeed((f) => [`İstihbarat: ${intel.title}`, ...f].slice(0, 20));
    playClick();
  };

  return (
    <div className="p-4 sm:p-6 max-w-lg mx-auto pb-28 space-y-4">
      <div>
        <div className="text-[10px] tracking-widest text-amber-600 font-bold">
          PERON BORSASI
        </div>
        <h1 className="text-xl font-black">Açık artırma & istihbarat</h1>
        <p className="text-xs text-zinc-500 mt-1">
          {status || "—"} · mazot {fuelPrice} ₺/L
          {fuelTip ? " · istihbarat aktif" : ""}
        </p>
        {!roomCode && (
          <Link href="/lobby" className="text-cyan-400 text-xs underline">
            Önce lobi odası aç
          </Link>
        )}
      </div>

      <div className="rounded-2xl border border-amber-900/40 bg-zinc-900 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-amber-500 tracking-widest">
            CANLI SATIŞ
          </span>
          <button
            type="button"
            onClick={openSale}
            className="text-[10px] px-2 py-1 rounded bg-amber-600 text-black font-bold"
          >
            Peron satışa çıkar
          </button>
        </div>
        {!lot ? (
          <p className="text-xs text-zinc-600">
            Satış yok. İlan açılınca odadaki herkese nabız + telefon düşer.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="text-sm font-bold">
              {lot.from} → {lot.to}
            </div>
            <div className="text-xs text-zinc-400">
              Kapasite {lot.capacity} · süre ~
              {Math.max(0, Math.ceil((lot.endsAt - Date.now()) / 1000))}s
            </div>
            <div className="text-amber-300 font-mono">
              {formatMoney(lot.highBid)}
              {lot.highBidder ? ` · ${lot.highBidder}` : " · açılış"}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-2 py-1.5 text-sm"
                value={bid}
                onChange={(e) => setBid(e.target.value)}
                inputMode="numeric"
                placeholder="+500"
              />
              <button
                type="button"
                onClick={() => void placeBid()}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-black text-sm font-bold"
              >
                Teklif
              </button>
            </div>
            {lot.highBidder === display && Date.now() >= lot.endsAt && (
              <button
                type="button"
                onClick={claim}
                className="w-full py-2 rounded-lg bg-emerald-600 text-black font-bold text-sm"
              >
                Kazandın — öde ve al
              </button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 space-y-2">
        <div className="text-[10px] tracking-widest text-zinc-500 font-bold">
          İSTİHBARAT / MANİPÜLASYON
        </div>
        {INTEL_POOL.map((i) => (
          <button
            key={i.id}
            type="button"
            onClick={() => buyIntel(i)}
            className="w-full text-left p-3 rounded-xl border border-zinc-800 hover:border-zinc-600"
          >
            <div className="text-sm font-semibold">{i.title}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{i.body}</p>
            <div className="text-[10px] text-amber-500 mt-1">
              {formatMoney(i.cost)}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-red-900/30 bg-zinc-900 p-4">
        <div className="text-[10px] tracking-widest text-red-400 font-bold mb-2">
          SABOTAJ (oda)
        </div>
        <button
          type="button"
          onClick={() => {
            if (!spendMoney(2500)) {
              playWarn();
              return;
            }
            addLedger("Sabotaj paketi", -2500);
            void sendSabotage(display, "rakip", "ariza");
            void sendChat(display, "Peronda ‘arıza’ dedikodusu yayıldı…");
            playClick();
          }}
          className="text-xs px-3 py-2 rounded-lg border border-red-900 text-red-300"
        >
          Arıza dedikodusu · 2.500 ₺
        </button>
      </div>

      <div className="rounded-xl border border-zinc-800 p-3 max-h-40 overflow-y-auto text-[11px] text-zinc-500 space-y-1">
        {feed.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
        {msgs.slice(-5).map((m) => (
          <div key={m.id}>
            <span className="text-cyan-500">{m.from}</span>: {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}