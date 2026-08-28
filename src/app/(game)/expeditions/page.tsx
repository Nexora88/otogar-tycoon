"use client";

import { useEffect, useState } from "react";
import {
  useGameStore,
  generatePassengers,
  CATERING_INFO,
  type Catering,
} from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { ROUTES } from "@/data/routes";
import { Route, Plus, Fuel, User } from "lucide-react";

const FUEL_PRICE = 42;

const MAFIA_LINES = [
  "Ağa, 5 koli ‘hediye’ Ankara’ya. Bagaja at, temiz ₺10.000.",
  "Sınırdan geldi, soru sorma. Senin payın peşin.",
  "Jandarma yoksa kimse bilmez. Varırsa… sen bilirsin.",
];

export default function ExpeditionsPage() {
  const {
    buses,
    drivers,
    expeditions,
    addExpedition,
    updateExpedition,
    settleExpeditionProfit,
    lastEvent,
    clearLastEvent,
    setHasPlayedOnce,
    addFatigue,
    setLastTicket,
    pushPhone,
    setDriverBusy,
    rollRoadEvent,
    crierBonus,
    priceCapMultiplier,
    bayramActive,
    rivalWeak,
  } = useGameStore();

  const [showForm, setShowForm] = useState(false);
  const [routeId, setRouteId] = useState(ROUTES[0]?.id || "");
  const [ticketPrice, setTicketPrice] = useState(320);
  const [catering, setCatering] = useState<Catering>("snack");
  const [busId, setBusId] = useState(buses[0]?.id || "");
  const [driverId, setDriverId] = useState("");
  const [muavinId, setMuavinId] = useState("");
  const [smuggle, setSmuggle] = useState(false);
  const [mafiaLine, setMafiaLine] = useState(MAFIA_LINES[0]);

  const route = ROUTES.find((r) => r.id === routeId) || ROUTES[0];
  const bus = buses.find((b) => b.id === busId);
  const driversFree = drivers.filter(
    (d) => d.role === "driver" && !d.onExpedition && d.fatigue < 88
  );
  const muavinsFree = drivers.filter(
    (d) => d.role === "muavin" && !d.onExpedition
  );

  const mult = priceCapMultiplier();
  const minP = 90;
  const maxP = Math.round((route?.distance || 400) * 2.1 * mult);
  const fuelEst = bus
    ? Math.round(
        ((route?.distance || 400) / 100) * (bus.fuelUse || 28) * FUEL_PRICE
      )
    : 0;

  useEffect(() => {
    const t = setInterval(() => {
      const st = useGameStore.getState();
      st.expeditions.forEach((exp) => {
        if (exp.status === "filling") {
          if (Date.now() >= exp.departureTime) {
            st.updateExpedition(exp.id, { status: "departed", progress: 0 });
            if (exp.driverId) st.setDriverBusy(exp.driverId, true);
            return;
          }
          const r =
            ROUTES.find(
              (x) =>
                x.origin === exp.origin && x.destination === exp.destination
            ) || route;
          const maxPrice = Math.round((r?.distance || 400) * 2.1 * st.priceCapMultiplier());
          const ratio = exp.ticketPrice / maxPrice;
          let chance =
            Math.max(0.12, 0.82 - ratio * 0.7) * st.crierBonus();
          if (Math.random() < chance && exp.soldTickets < exp.maxSeats) {
            const add = ratio < 0.4 ? 2 + Math.floor(Math.random() * 3) : 1;
            const sold = Math.min(exp.soldTickets + add, exp.maxSeats);
            st.updateExpedition(exp.id, {
              soldTickets: sold,
              passengers: generatePassengers(sold),
            });
          }
        }

        if (exp.status === "departed") {
          const r =
            ROUTES.find(
              (x) =>
                x.origin === exp.origin && x.destination === exp.destination
            ) || route;
          const driveMs = Math.min(
            100000,
            Math.max(40000, (r?.distance || 400) * 90)
          );
          const elapsed = Date.now() - exp.departureTime;
          const prog = Math.min(0.99, elapsed / driveMs);
          const logs = [...(exp.log || [])];
          if (prog > 0.25 && logs.length < 1)
            logs.push("İzmit sapağı — muavin ikram dağıtıyor.");
          if (prog > 0.55 && logs.length < 2)
            logs.push("Bolu etekleri — takograf yeşilde.");
          if (prog > 0.8 && logs.length < 3)
            logs.push("Varışa yakın — peron anonsu.");

          st.updateExpedition(exp.id, { progress: prog, log: logs });

          // Seyrek olay (her 1.5sn tick'te düşük şans)
          if (Math.random() < 0.08) {
            st.rollRoadEvent(exp);
          }

          if (elapsed > driveMs) {
            const b = st.buses.find((x) => x.id === exp.busId);
            const fuel = Math.round(
              ((r?.distance || 400) / 100) * (b?.fuelUse || 28) * FUEL_PRICE
            );
            const cat =
              exp.soldTickets *
              (CATERING_INFO[exp.catering]?.perSeat || 10);
            const mu = b?.muavinCost || 400;
            let revenue = exp.soldTickets * exp.ticketPrice;
            if (exp.smuggle) revenue += exp.smugglePaid || 10000;
            const cost = fuel + cat + mu;
            const profit = revenue - cost;

            // İkram itibar
            const rep = CATERING_INFO[exp.catering]?.repMod || 0;
            if (rep !== 0) {
              useGameStore.setState((s) => ({
                reputation: Math.max(
                  0,
                  Math.min(100, s.reputation + rep)
                ),
              }));
            }

            st.settleExpeditionProfit(profit);
            st.updateExpedition(exp.id, {
              status: "completed",
              progress: 1,
              currentEvent: null,
            });
            if (exp.driverId) {
              st.setDriverBusy(exp.driverId, false);
              st.addFatigue(exp.driverId, 18 + Math.floor(Math.random() * 12));
            }
            const drv = st.drivers.find((d) => d.id === exp.driverId);
            st.setLastTicket({
              expId: exp.id,
              origin: exp.origin,
              destination: exp.destination,
              sold: exp.soldTickets,
              price: exp.ticketPrice,
              revenue,
              cost,
              profit,
              driverName: drv?.name || "Şoför",
              at: Date.now(),
            });
            st.setHasPlayedOnce();
            st.pushPhone(
              "Sefer",
              `${exp.origin.split(" ")[0]} seferi kapandı. Fiş hazır.`
            );
          }
        }
      });
    }, 1500);
    return () => clearInterval(t);
  }, [route]);

  const handleCreate = () => {
    if (!bus || !route) return;
    if (!driverId) {
      alert("Boşta şoför seç (seferde olan veya çok yorgun olamaz).");
      return;
    }
    if (ticketPrice < minP || ticketPrice > maxP) {
      alert(`Bilet ${minP}–${maxP} ₺`);
      return;
    }
    if (bus.impoundedUntil && bus.impoundedUntil > Date.now()) {
      alert("Bu araç jandarmada bağlı.");
      return;
    }

    const smugglePaid = smuggle ? 10000 : 0;
    if (smuggle) {
      // peşin mafya ödemesi
      useGameStore.getState().addMoney(smugglePaid);
      useGameStore.getState().addLedger("Mafya bagaj payı (peşin)", smugglePaid);
      pushPhone("İsimsiz", "Yük bindi ağa. Yolun açık olsun… dikkat et.");
    }

    addExpedition({
      id: `exp-${Date.now()}`,
      busId: bus.id,
      origin: route.origin,
      destination: route.destination,
      departureTime: Date.now() + 30_000,
      ticketPrice,
      catering,
      status: "filling",
      soldTickets: 0,
      maxSeats: bus.seatCount,
      passengers: [],
      createdAt: Date.now(),
      driverId,
      muavinId: muavinId || null,
      driveMode: "driver",
      progress: 0,
      log: ["Peronda bilet kesiliyor…"],
      smuggle,
      smugglePaid,
    });
    setDriverBusy(driverId, true);
    setShowForm(false);
    setSmuggle(false);
  };

  return (
    <div className="p-4 sm:p-8 relative">
      {lastEvent && (
        <div className="fixed bottom-24 md:bottom-6 right-4 z-40 max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-4">
          <div className="flex gap-2">
            <span className="text-2xl">{lastEvent.emoji}</span>
            <div>
              <div className="font-semibold">{lastEvent.title}</div>
              <p className="text-sm text-zinc-400">{lastEvent.description}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={clearLastEvent}
            className="mt-2 text-xs text-zinc-500"
          >
            Kapat
          </button>
        </div>
      )}

      <div className="flex flex-wrap justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Route className="w-6 h-6 text-amber-400" />
            Seferler
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {bayramActive && (
              <span className="text-red-400 mr-2">Bayram — tavan yüksek</span>
            )}
            {rivalWeak && (
              <span className="text-emerald-400">Rakip zayıf — fiyat +</span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMafiaLine(
              MAFIA_LINES[Math.floor(Math.random() * MAFIA_LINES.length)]
            );
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-medium rounded-xl"
        >
          <Plus className="w-4 h-4" /> Yeni sefer
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="text-sm block">
              <span className="text-zinc-500 text-xs">Hat</span>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
              >
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.origin} → {r.destination}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-zinc-500 text-xs">Otobüs</span>
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} · {b.plate}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-zinc-500 text-xs flex items-center gap-1">
                <User className="w-3 h-3" /> Şoför (boşta)
              </span>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
              >
                <option value="">Seç…</option>
                {driversFree.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · yorgun %{Math.round(d.fatigue)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-zinc-500 text-xs">Muavin (opsiyonel)</span>
              <select
                value={muavinId}
                onChange={(e) => setMuavinId(e.target.value)}
                className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
              >
                <option value="">Yok</option>
                {muavinsFree.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-zinc-500 text-xs">
                Bilet ({minP}–{maxP} ₺)
              </span>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="mt-1 w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2"
              />
            </label>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-2">İkram (maliyet / itibar)</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATERING_INFO) as Catering[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCatering(k)}
                  className={`text-left px-3 py-2 rounded-lg border text-xs max-w-[200px] ${
                    catering === k
                      ? "border-amber-500 bg-amber-500/10 text-amber-300"
                      : "border-zinc-700 text-zinc-400"
                  }`}
                >
                  <div className="font-medium">{CATERING_INFO[k].label}</div>
                  <div className="text-[10px] opacity-80">
                    {formatMoney(CATERING_INFO[k].perSeat)}/koltuk · itibar{" "}
                    {CATERING_INFO[k].repMod >= 0 ? "+" : ""}
                    {CATERING_INFO[k].repMod}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mafya / kaçak */}
          <div className="border border-red-900/50 bg-red-950/20 rounded-xl p-4">
            <div className="text-xs text-red-400 font-semibold mb-1">
              Kara bagaj teklifi
            </div>
            <p className="text-sm text-stone-400 italic mb-3">“{mafiaLine}”</p>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={smuggle}
                onChange={(e) => setSmuggle(e.target.checked)}
              />
              <span>
                Kabul et — peşin ₺10.000 · jandarma riski yüksek
              </span>
            </label>
          </div>

          <div className="text-xs text-zinc-500 flex items-center gap-2">
            <Fuel className="w-4 h-4 text-amber-400" />
            Mazot ~{formatMoney(fuelEst)} · Dolum x{crierBonus().toFixed(2)}{" "}
            (çığırtkan)
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="px-6 py-2.5 bg-amber-500 text-black font-semibold rounded-lg"
            >
              Seferi başlat
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-zinc-600 rounded-lg"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {expeditions.length === 0 && (
          <p className="text-zinc-600 text-center py-12 text-sm">
            Sefer yok. Şoför al → sefer kur.
          </p>
        )}
        {expeditions.map((exp) => {
          const drv = drivers.find((d) => d.id === exp.driverId);
          return (
            <div
              key={exp.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <div className="font-medium">
                    {exp.origin} → {exp.destination}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">
                    {exp.soldTickets}/{exp.maxSeats} · {formatMoney(exp.ticketPrice)}{" "}
                    · {drv?.name || "—"}
                    {exp.smuggle && (
                      <span className="text-red-400 ml-2">kaçak yük</span>
                    )}
                  </div>
                </div>
                <div className="text-xs">
                  {exp.status === "filling" && (
                    <span className="text-sky-400">
                      Kalkış{" "}
                      {Math.max(
                        0,
                        Math.ceil((exp.departureTime - Date.now()) / 1000)
                      )}
                      s
                    </span>
                  )}
                  {exp.status === "departed" && (
                    <span className="text-amber-400">
                      Yolda %{Math.round((exp.progress || 0) * 100)}
                    </span>
                  )}
                  {exp.status === "completed" && (
                    <span className="text-emerald-400">Bitti</span>
                  )}
                </div>
              </div>
              {exp.status === "departed" && (
                <>
                  <div className="mt-2 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${(exp.progress || 0) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    {(exp.log || []).slice(-1)[0]}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}