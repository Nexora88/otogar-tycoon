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
import { sendPrice } from "@/lib/roomChannel";
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
    companyName,
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
            if (exp.muavinId) st.setDriverBusy(exp.muavinId, true);
            return;
          }
          const r =
            ROUTES.find(
              (x) =>
                x.origin === exp.origin && x.destination === exp.destination
            ) || route;
          const maxPrice = Math.round(
            (r?.distance || 400) * 2.1 * st.priceCapMultiplier()
          );
          const ratio = exp.ticketPrice / maxPrice;
          const chance =
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

          if (Math.random() < 0.08) st.rollRoadEvent(exp);

          if (elapsed > driveMs) {
            const b = st.buses.find((x) => x.id === exp.busId);
            const fuel = Math.round(
              ((r?.distance || 400) / 100) * (b?.fuelUse || 28) * FUEL_PRICE
            );
            const cat =
              exp.soldTickets * (CATERING_INFO[exp.catering]?.perSeat || 10);
            const mu = b?.muavinCost || 400;
            let revenue = exp.soldTickets * exp.ticketPrice;
            if (exp.smuggle) revenue += exp.smugglePaid || 10000;
            const cost = fuel + cat + mu;
            const profit = revenue - cost;

            const rep = CATERING_INFO[exp.catering]?.repMod || 0;
            if (rep !== 0) {
              useGameStore.setState((s) => ({
                reputation: Math.max(0, Math.min(100, s.reputation + rep)),
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
            if (exp.muavinId) st.setDriverBusy(exp.muavinId, false);

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
      alert("Boşta şoför seç.");
      return;
    }
    if (ticketPrice < minP || ticketPrice > maxP) {
      alert(`Bilet ${minP}–${maxP} ₺`);
      return;
    }

    const busBusy = expeditions.some(
      (e) =>
        e.busId === bus.id &&
        (e.status === "filling" || e.status === "departed")
    );
    if (busBusy) {
      alert("Bu otobüs zaten seferde / peronda.");
      return;
    }
    if (bus.repairingUntil && bus.repairingUntil > Date.now()) {
      alert("Araç tamirde.");
      return;
    }
    if (bus.impoundedUntil && bus.impoundedUntil > Date.now()) {
      alert("Bu araç jandarmada bağlı.");
      return;
    }

    const smugglePaid = smuggle ? 10000 : 0;
    if (smuggle) {
      useGameStore.getState().addMoney(smugglePaid);
      useGameStore.getState().addLedger("Mafya bagaj payı (peşin)", smugglePaid);
      pushPhone("İsimsiz", "Yük bindi ağa. Yolun açık olsun…");
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
    if (muavinId) setDriverBusy(muavinId, true);

    // Lobi nabzı (oda açıksa)
    void sendPrice(
      companyName || "Firma",
      `${route.origin} → ${route.destination}`,
      ticketPrice
    );

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
          <button type="button" onClick={clearLastEvent} className="mt-2 text-xs text-zinc-500">
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
            1 otobüs = 1 sefer · {bayramActive && <span className="text-red-400">Bayram </span>}
            {rivalWeak && <span className="text-emerald-400">Rakip zayıf</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMafiaLine(MAFIA_LINES[Math.floor(Math.random() * MAFIA_LINES.length)]!);
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
                {buses.map((b) => {
                  const busy = expeditions.some(
                    (e) =>
                      e.busId === b.id &&
                      (e.status === "filling" || e.status === "departed")
                  );
                  const repair = b.repairingUntil && b.repairingUntil > Date.now();
                  const imp = b.impoundedUntil && b.impoundedUntil > Date.now();
                  return (
                    <option
                      key={b.id}
                      value={b.id}
                      disabled={busy || !!repair || !!imp}
                    >
                      {b.name} · {b.plate}
                      {busy ? " (seferde)" : ""}
                      {repair ? " (tamir)" : ""}
                      {imp ? " (bağlı)" : ""}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="text-sm block">
              <span className="text-zinc-500 text-xs flex items-center gap-1">
                <User className="w-3 h-3" /> Şoför
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
              <span className="text-zinc-500 text-xs">Muavin</span>
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
            <div className="text-xs text-zinc-500 flex items-end gap-1 pb-2">
              <Fuel className="w-3 h-3" /> Tahmini mazot {formatMoney(fuelEst)}
            </div>
          </div>

          <div>
            <div className="text-xs text-zinc-500 mb-2">İkram</div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CATERING_INFO) as Catering[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCatering(k)}
                  className={`px-3 py-1.5 rounded-lg text-xs border ${
                    catering === k
                      ? "border-amber-500 bg-amber-500/10"
                      : "border-zinc-700"
                  }`}
                >
                  {CATERING_INFO[k].label} · {CATERING_INFO[k].perSeat}₺/koltuk
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={smuggle}
              onChange={(e) => setSmuggle(e.target.checked)}
            />
            <span>
              Riskli bagaj (+10.000 peşin, jandarma riski)
              <br />
              <span className="text-zinc-600">{mafiaLine}</span>
            </span>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2.5 bg-amber-500 text-black font-semibold rounded-xl text-sm"
            >
              Seferi aç
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs text-zinc-500"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {expeditions.length === 0 && (
          <p className="text-sm text-zinc-600">Henüz sefer yok.</p>
        )}
        {expeditions.map((exp) => (
          <div
            key={exp.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm"
          >
            <div className="font-medium">
              {exp.origin} → {exp.destination}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {exp.status} · {exp.soldTickets}/{exp.maxSeats} bilet ·{" "}
              {exp.ticketPrice} ₺
              {exp.status === "departed" &&
                ` · %${Math.round((exp.progress || 0) * 100)}`}
            </div>
            {(exp.log || []).length > 0 && (
              <div className="text-[11px] text-zinc-600 mt-1">
                {(exp.log || []).slice(-2).join(" · ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}