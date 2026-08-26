"use client";

import { useState, useEffect } from "react";
import {
  useGameStore,
  generatePassengers,
  type Catering,
} from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { ROUTES } from "@/data/routes";
import DrivingView from "@/components/DrivingView";
import { Route, Plus, Clock, Users, Fuel } from "lucide-react";

const CATERING_OPTIONS: { id: Catering; label: string; cost: number }[] = [
  { id: "water", label: "Sadece Su", cost: 0 },
  { id: "snack", label: "Kek + Kola", cost: 25 },
  { id: "vip", label: "VIP İkram", cost: 65 },
];

const FUEL_CONSUMPTION: Record<string, number> = {
  O302: 32,
  Travego: 24,
  Tourismo: 22,
  Setra: 20,
  Neoplan: 18,
};

const FUEL_PRICE = 42;

const COMPLAINTS = [
  "İkram diye su verdiniz, ayıp oluyor artık!",
  "Otobüs çok eski, her virajda ses geliyor.",
  "Klima yok, böyle yolculuk mu olur?",
  "Muavin hiç ilgilenmiyor.",
  "Bilet pahalı ama hizmet aynı değil.",
  "Araç çok sarsıyor, başım ağrıdı.",
];

export default function ExpeditionsPage() {
  const {
    buses,
    expeditions,
    addExpedition,
    updateExpedition,
    addMoney,
    triggerRoadEvent,
    lastEvent,
    clearLastEvent,
    openComplaint,
    setHasPlayedOnce,
  } = useGameStore();

  const [showForm, setShowForm] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0]?.id || "");
  const [ticketPrice, setTicketPrice] = useState(320);
  const [catering, setCatering] = useState<Catering>("snack");
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || "");
  const [showFlash, setShowFlash] = useState(false);

  const selectedRoute =
    ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];
  const selectedBus = buses.find((b) => b.id === selectedBusId);

  const minTicketPrice = 90;
  const maxTicketPrice = Math.round((selectedRoute?.distance || 400) * 2.1);

  const estimatedFuelCost = selectedBus
    ? Math.round(
        ((selectedRoute?.distance || 400) / 100) *
          (FUEL_CONSUMPTION[selectedBus.model] || 28) *
          FUEL_PRICE
      )
    : 0;

  // Fiyat ne kadar yüksekse dolum o kadar yavaş
  const getFillChance = (price: number, maxPrice: number) => {
    const ratio = price / maxPrice; // 0..1+
    // ucuz (~0.3) => yüksek şans, pahalı (~1) => düşük şans
    return Math.max(0.15, 0.85 - ratio * 0.7);
  };

  const getTicketsPerTick = (price: number, maxPrice: number) => {
    const ratio = price / maxPrice;
    if (ratio < 0.4) return Math.floor(Math.random() * 4) + 2; // ucuz: 2-5
    if (ratio < 0.7) return Math.floor(Math.random() * 3) + 1; // orta: 1-3
    return Math.random() > 0.5 ? 1 : 0; // pahalı: 0-1
  };

  useEffect(() => {
    const interval = setInterval(() => {
      expeditions.forEach((exp) => {
        const route =
          ROUTES.find(
            (r) => r.origin === exp.origin && r.destination === exp.destination
          ) || selectedRoute;
        const maxPrice = Math.round((route?.distance || 400) * 2.1);

        if (exp.status === "filling") {
          const remaining = exp.departureTime - Date.now();

          if (remaining <= 0) {
            updateExpedition(exp.id, { status: "departed" });
            return;
          }

          const chance = getFillChance(exp.ticketPrice, maxPrice);
          if (Math.random() < chance && exp.soldTickets < exp.maxSeats) {
            const add = getTicketsPerTick(exp.ticketPrice, maxPrice);
            if (add > 0) {
              const newSold = Math.min(exp.soldTickets + add, exp.maxSeats);
              updateExpedition(exp.id, {
                soldTickets: newSold,
                passengers: generatePassengers(newSold),
              });
            }
          }

          // Kötü ikram + pahalı bilet şikayeti
          if (
            (exp.catering === "water" || exp.ticketPrice > maxPrice * 0.85) &&
            remaining < 14000 &&
            Math.random() > 0.97
          ) {
            openComplaint(
              COMPLAINTS[Math.floor(Math.random() * COMPLAINTS.length)]
            );
          }
        }

        if (exp.status === "departed") {
          if (Math.random() > 0.93) {
            triggerRoadEvent(exp.id);
          }

          // Mesafeye göre sürüş süresi (ms) — min 90sn, max 3dk
const driveMs = Math.min(
  180000,
  Math.max(90000, (route?.distance || 400) * 180)
);

if (Date.now() - exp.departureTime > driveMs) {
            const bus = buses.find((b) => b.id === exp.busId);
            const consumption = FUEL_CONSUMPTION[bus?.model || "O302"] || 28;
            const fuelCost = Math.round(
              ((route?.distance || 400) / 100) * consumption * FUEL_PRICE
            );
            const cateringCost =
              exp.soldTickets *
              (CATERING_OPTIONS.find((c) => c.id === exp.catering)?.cost || 0);
            const revenue = exp.soldTickets * exp.ticketPrice;
            const profit = revenue - fuelCost - cateringCost;

            addMoney(profit);
            updateExpedition(exp.id, {
              status: "completed",
              currentEvent: null,
            });
            setHasPlayedOnce();
          }
        }
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [expeditions, buses]);

  useEffect(() => {
    if (lastEvent?.type === "eds") {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 380);
      return () => clearTimeout(t);
    }
  }, [lastEvent]);

  const handleCreate = () => {
    if (!selectedBus || !selectedRoute) return;

    if (ticketPrice < minTicketPrice) {
      alert(`Bilet fiyatı en az ${minTicketPrice} ₺ olmalı.`);
      return;
    }
    if (ticketPrice > maxTicketPrice) {
      alert(`Bu hat için maksimum bilet fiyatı ${maxTicketPrice} ₺.`);
      return;
    }

    const newExp = {
      id: `exp-${Date.now()}`,
      busId: selectedBus.id,
      origin: selectedRoute.origin,
      destination: selectedRoute.destination,
      departureTime: Date.now() + 40 * 1000,
      ticketPrice,
      catering,
      status: "filling" as const,
      soldTickets: 0,
      maxSeats: selectedBus.seatCount,
      passengers: [],
      createdAt: Date.now(),
      currentEvent: null,
    };

    addExpedition(newExp);
    setShowForm(false);
  };

  const getTimeLeft = (ts: number) => {
    const s = Math.max(0, Math.floor((ts - Date.now()) / 1000));
    return `${s}s`;
  };

  return (
    <div className="p-8 relative">
      {/* Sürüş ekranı */}
      {expeditions
        .filter((e) => e.status === "departed")
        .map((e) => (
          <DrivingView key={e.id} expeditionId={e.id} />
        ))}

      {showFlash && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-eds-flash" />
      )}

      {lastEvent && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl animate-slide-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{lastEvent.emoji}</span>
            <div>
              <div className="font-semibold">{lastEvent.title}</div>
              <p className="text-sm text-zinc-400 mt-1">{lastEvent.description}</p>
              {lastEvent.moneyChange < 0 && (
                <p className="text-sm text-red-400 mt-1">
                  Ceza: {formatMoney(Math.abs(lastEvent.moneyChange))}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={clearLastEvent}
            className="mt-3 text-xs text-zinc-500 hover:text-white"
          >
            Kapat
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Route className="w-6 h-6 text-amber-400" />
            Seferler
          </h1>
          <p className="text-zinc-400 mt-1">
            Ucuz bilet = çok yolcu • Pahalı bilet = az yolcu
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 text-black font-medium rounded-xl hover:bg-amber-400 transition"
        >
          <Plus className="w-4 h-4" />
          Yeni Sefer
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-5">Yeni Sefer Oluştur</h2>

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
              <label className="block text-sm text-zinc-400 mb-1.5">Otobüs</label>
              <select
                value={selectedBusId}
                onChange={(e) => setSelectedBusId(e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.model}) - {b.seatCount} koltuk
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Bilet Fiyatı (₺)
              </label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Sınır: {minTicketPrice} ₺ – {maxTicketPrice} ₺
                {ticketPrice <= maxTicketPrice * 0.4 && (
                  <span className="text-green-400 ml-2">• Çok yolcu çeker</span>
                )}
                {ticketPrice > maxTicketPrice * 0.75 && (
                  <span className="text-amber-400 ml-2">• Az yolcu gelir</span>
                )}
              </p>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">İkram</label>
              <div className="flex gap-2">
                {CATERING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCatering(opt.id)}
                    className={`flex-1 py-2.5 rounded-lg text-sm border transition ${
                      catering === opt.id
                        ? "border-amber-500 bg-amber-500/10 text-amber-400"
                        : "border-zinc-700 hover:border-zinc-500"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3">
            <Fuel className="w-5 h-5 text-amber-400" />
            <div className="text-sm">
              <span className="text-zinc-400">Tahmini mazot: </span>
              <span className="font-medium text-amber-400">
                {formatMoney(estimatedFuelCost)}
              </span>
              <span className="text-zinc-500 ml-2">
                ({selectedBus?.model || "O302"})
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreate}
              className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition"
            >
              Seferi Başlat
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {expeditions.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            Henüz sefer yok. İlk seferini oluştur!
          </div>
        )}

        {expeditions.map((exp) => (
          <div
            key={exp.id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-semibold">
                  {exp.origin} → {exp.destination}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {formatMoney(exp.ticketPrice)} •{" "}
                  {CATERING_OPTIONS.find((c) => c.id === exp.catering)?.label}
                </div>
              </div>

              <div className="flex items-center gap-6">
                {exp.status === "filling" && (
                  <>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500">Kalan</div>
                      <div className="font-mono text-amber-400 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {getTimeLeft(exp.departureTime)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500">Bilet</div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {exp.soldTickets}/{exp.maxSeats}
                      </div>
                    </div>
                  </>
                )}
                {exp.status === "departed" && (
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                    Yolda... (WASD ile sür)
                  </div>
                )}
                {exp.status === "completed" && (
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">
                    Tamamlandı
                  </div>
                )}
              </div>
            </div>

            {exp.status === "filling" && (
              <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full progress-bar"
                  style={{
                    width: `${(exp.soldTickets / exp.maxSeats) * 100}%`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}