"use client";

import { useEffect, useState } from "react";
import {
  useGameStore,
  generatePassengers,
  type Catering,
} from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { ROUTES } from "@/data/routes";
import { Route, Plus, Fuel, User } from "lucide-react";

const CATERING_OPTIONS: { id: Catering; label: string; cost: number }[] = [
  { id: "water", label: "Sadece Su", cost: 0 },
  { id: "snack", label: "Kek + Kola", cost: 25 },
  { id: "vip", label: "VIP İkram", cost: 65 },
];

const FUEL_PRICE = 42;

export default function ExpeditionsPage() {
  const {
    buses,
    drivers,
    expeditions,
    addExpedition,
    updateExpedition,
    settleExpeditionProfit,
    triggerRoadEvent,
    lastEvent,
    clearLastEvent,
    openComplaint,
    setHasPlayedOnce,
    addFatigue,
    setLastTicket,
    pushPhone,
  } = useGameStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0]?.id || "");
  const [ticketPrice, setTicketPrice] = useState(320);
  const [catering, setCatering] = useState<Catering>("snack");
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || "");
  const [selectedDriverId, setSelectedDriverId] = useState(
    drivers.find((d) => d.role === "driver")?.id || ""
  );

  const selectedRoute =
    ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];
  const selectedBus = buses.find((b) => b.id === selectedBusId);
  const driverList = drivers.filter((d) => d.role === "driver");

  const minTicketPrice = 90;
  const maxTicketPrice = Math.round((selectedRoute?.distance || 400) * 2.1);

  const estimatedFuelCost = selectedBus
    ? Math.round(
        ((selectedRoute?.distance || 400) / 100) *
          (selectedBus.fuelUse || 28) *
          FUEL_PRICE
      )
    : 0;

  useEffect(() => {
    const interval = setInterval(() => {
      const state = useGameStore.getState();
      state.expeditions.forEach((exp) => {
        const route =
          ROUTES.find(
            (r) =>
              r.origin === exp.origin && r.destination === exp.destination
          ) || selectedRoute;
        const maxPrice = Math.round((route?.distance || 400) * 2.1);

        if (exp.status === "filling") {
          const remaining = exp.departureTime - Date.now();
          if (remaining <= 0) {
            state.updateExpedition(exp.id, { status: "departed" });
            return;
          }
          const ratio = exp.ticketPrice / maxPrice;
          const chance = Math.max(0.15, 0.85 - ratio * 0.7);
          if (Math.random() < chance && exp.soldTickets < exp.maxSeats) {
            const add =
              ratio < 0.4
                ? Math.floor(Math.random() * 4) + 2
                : ratio < 0.7
                ? Math.floor(Math.random() * 3) + 1
                : Math.random() > 0.5
                ? 1
                : 0;
            if (add > 0) {
              const newSold = Math.min(exp.soldTickets + add, exp.maxSeats);
              state.updateExpedition(exp.id, {
                soldTickets: newSold,
                passengers: generatePassengers(newSold),
              });
            }
          }
        }

        if (exp.status === "departed") {
          if (Math.random() > 0.94) state.triggerRoadEvent(exp.id);

          const driveMs = Math.min(
            120000,
            Math.max(45000, (route?.distance || 400) * 100)
          );

          if (Date.now() - exp.departureTime > driveMs) {
            const bus = state.buses.find((b) => b.id === exp.busId);
            const fuelCost = Math.round(
              ((route?.distance || 400) / 100) *
                (bus?.fuelUse || 28) *
                FUEL_PRICE
            );
            const catCost =
              exp.soldTickets *
              (CATERING_OPTIONS.find((c) => c.id === exp.catering)?.cost || 0);
            const muavin = bus?.muavinCost || 400;
            const revenue = exp.soldTickets * exp.ticketPrice;
            const cost = fuelCost + catCost + muavin;
            const profit = revenue - cost;

            state.settleExpeditionProfit(profit);
            state.updateExpedition(exp.id, {
              status: "completed",
              currentEvent: null,
            });
            state.setHasPlayedOnce();

            if (exp.driverId) {
              state.addFatigue(
                exp.driverId,
                20 + Math.floor(Math.random() * 15)
              );
            }

            const drv = state.drivers.find((d) => d.id === exp.driverId);
            state.setLastTicket({
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

            state.pushPhone(
              "Sefer Servisi",
              `${exp.origin.split(" ")[0]} → ${exp.destination.split(" ")[0]} kapandı. Fiş yazdırıldı.`
            );
          }
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  const handleCreate = () => {
    if (!selectedBus || !selectedRoute) return;
    if (!selectedDriverId) {
      alert("Önce Kadro'dan şoför işe al ve seç.");
      return;
    }
    if (ticketPrice < minTicketPrice || ticketPrice > maxTicketPrice) {
      alert(`Bilet ${minTicketPrice}–${maxTicketPrice} ₺ olmalı.`);
      return;
    }
    const drv = drivers.find((d) => d.id === selectedDriverId);
    if (drv && drv.fatigue > 85) {
      alert("Şoför çok yorgun. Dinlendirin.");
      return;
    }

    addExpedition({
      id: `exp-${Date.now()}`,
      busId: selectedBus.id,
      origin: selectedRoute.origin,
      destination: selectedRoute.destination,
      departureTime: Date.now() + 35 * 1000,
      ticketPrice,
      catering,
      status: "filling",
      soldTickets: 0,
      maxSeats: selectedBus.seatCount,
      passengers: [],
      createdAt: Date.now(),
      currentEvent: null,
      driverId: selectedDriverId,
      driveMode: "driver",
    });
    setShowForm(false);
    pushPhone(
      "Sefer",
      `${selectedRoute.origin} seferi planlandı. Şoför yola çıkacak.`
    );
  };

  return (
    <div className="p-4 sm:p-8 relative">
      {lastEvent && (
        <div className="fixed bottom-24 md:bottom-6 right-4 z-40 max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{lastEvent.emoji}</span>
            <div>
              <div className="font-semibold">{lastEvent.title}</div>
              <p className="text-sm text-zinc-400 mt-1">
                {lastEvent.description}
              </p>
              {lastEvent.moneyChange < 0 && (
                <p className="text-sm text-red-400 mt-1">
                  {formatMoney(Math.abs(lastEvent.moneyChange))}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={clearLastEvent}
            className="mt-3 text-xs text-zinc-500 hover:text-white"
          >
            Kapat
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Route className="w-6 h-6 text-amber-400" />
            Seferler
          </h1>
          <p className="text-zinc-400 mt-1 text-sm">
            Ağa modu · Şoför zorunlu · Sürüş sonra açılacak
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400"
        >
          <Plus className="w-4 h-4" />
          Yeni Sefer
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-5">Yeni Sefer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">Hat</label>
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              >
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.origin} → {r.destination} ({r.distance} km)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Otobüs
              </label>
              <select
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.model}) — {b.seatCount} koltuk
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Şoför (zorunlu)
              </label>
              <select
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              >
                <option value="">Şoför seç…</option>
                {driverList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — yorgunluk %{Math.round(d.fatigue)}
                    {d.suspicious ? " ⚠" : ""}
                  </option>
                ))}
              </select>
              {driverList.length === 0 && (
                <p className="text-xs text-red-400 mt-1">
                  Kadro menüsünden şoför işe al.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Bilet (₺)
              </label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              />
              <p className="text-xs text-zinc-500 mt-1">
                {minTicketPrice}–{maxTicketPrice} ₺
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-zinc-400 mb-1.5">İkram</label>
              <div className="flex flex-wrap gap-2">
                {CATERING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCatering(opt.id)}
                    className={`px-4 py-2 rounded-lg text-sm border ${
                      catering === opt.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-zinc-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3 text-sm">
            <Fuel className="w-5 h-5 text-amber-400" />
            <span className="text-zinc-400">Tahmini mazot: </span>
            <span className="text-amber-400 font-medium">
              {formatMoney(estimatedFuelCost)}
            </span>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleCreate}
              className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg"
            >
              Seferi başlat
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-zinc-700 rounded-lg"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {expeditions.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            Henüz sefer yok. Şoför al → sefer kur.
          </div>
        )}
        {expeditions.map((exp) => {
          const drv = drivers.find((d) => d.id === exp.driverId);
          return (
            <div
              key={exp.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-wrap justify-between gap-3"
            >
              <div>
                <div className="font-medium">
                  {exp.origin} → {exp.destination}
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  {exp.soldTickets}/{exp.maxSeats} bilet ·{" "}
                  {formatMoney(exp.ticketPrice)} · Şoför:{" "}
                  {drv?.name || "—"}
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
                  <span className="text-amber-400">Yolda (otomatik)</span>
                )}
                {exp.status === "completed" && (
                  <span className="text-emerald-400">Tamamlandı</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}