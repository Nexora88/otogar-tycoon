"use client";

import { useState, useEffect } from "react";
import { useGameStore, generatePassengers, type Catering } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { ROUTES } from "@/data/routes";
import { Route, Plus, Clock, Users } from "lucide-react";

const CATERING_OPTIONS: { id: Catering; label: string; cost: number }[] = [
  { id: "water", label: "Sadece Su", cost: 0 },
  { id: "snack", label: "Kek + Kola", cost: 25 },
  { id: "vip", label: "VIP İkram", cost: 65 },
];

const COMPLAINTS = [
  "İkram diye su verdiniz, ayıp oluyor artık!",
  "Otobüs çok eski, her virajda ses geliyor.",
  "Klima yok, yazın böyle yolculuk mu olur?",
  "Muavin hiç ilgilenmiyor, şikayetçiyim.",
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
  const [selectedRouteId, setSelectedRouteId] = useState(ROUTES[0].id);
  const [ticketPrice, setTicketPrice] = useState(350);
  const [catering, setCatering] = useState<Catering>("snack");
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || "");
  const [showFlash, setShowFlash] = useState(false);

  const selectedRoute = ROUTES.find((r) => r.id === selectedRouteId) || ROUTES[0];

  useEffect(() => {
    const interval = setInterval(() => {
      expeditions.forEach((exp) => {
        if (exp.status === "filling") {
          const remaining = exp.departureTime - Date.now();

          if (remaining <= 0) {
            updateExpedition(exp.id, { status: "departed" });
            return;
          }

          if (Math.random() > 0.55 && exp.soldTickets < exp.maxSeats) {
            const add = Math.floor(Math.random() * 3) + 1;
            const newSold = Math.min(exp.soldTickets + add, exp.maxSeats);
            updateExpedition(exp.id, {
              soldTickets: newSold,
              passengers: generatePassengers(newSold),
            });
          }

          if (exp.catering === "water" && remaining < 15000 && Math.random() > 0.97) {
            openComplaint(COMPLAINTS[Math.floor(Math.random() * COMPLAINTS.length)]);
          }
        }

        if (exp.status === "departed") {
          if (Math.random() > 0.93) {
            triggerRoadEvent(exp.id);
          }

          if (Date.now() - exp.departureTime > 25000) {
            const revenue = exp.soldTickets * exp.ticketPrice;
            const fuel = Math.round(selectedRoute.distance * 16);
            const catCost = exp.soldTickets * (CATERING_OPTIONS.find((c) => c.id === exp.catering)?.cost || 0);
            addMoney(revenue - fuel - catCost);
            updateExpedition(exp.id, { status: "completed", currentEvent: null });
            setHasPlayedOnce();
          }
        }
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [expeditions]);

  useEffect(() => {
    if (lastEvent?.type === "eds") {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 380);
      return () => clearTimeout(t);
    }
  }, [lastEvent]);

  const handleCreate = () => {
    const bus = buses.find((b) => b.id === selectedBusId);
    if (!bus || ticketPrice < 80) return;

    const newExp = {
      id: `exp-${Date.now()}`,
      busId: bus.id,
      origin: selectedRoute.origin,
      destination: selectedRoute.destination,
      departureTime: Date.now() + 40 * 1000,
      ticketPrice,
      catering,
      status: "filling" as const,
      soldTickets: 0,
      maxSeats: bus.seatCount,
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
      {showFlash && <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-eds-flash" />}

      {lastEvent && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm bg-zinc-900 border border-zinc-700 rounded-xl p-4 shadow-xl animate-slide-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{lastEvent.emoji}</span>
            <div>
              <div className="font-semibold">{lastEvent.title}</div>
              <p className="text-sm text-zinc-400 mt-1">{lastEvent.description}</p>
              {lastEvent.moneyChange < 0 && (
                <p className="text-sm text-red-400 mt-1">Ceza: {formatMoney(Math.abs(lastEvent.moneyChange))}</p>
              )}
            </div>
          </div>
          <button onClick={clearLastEvent} className="mt-3 text-xs text-zinc-500 hover:text-white">
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
          <p className="text-zinc-400 mt-1">Sefer oluştur, yolcu bekle, yolda olaylar yaşa.</p>
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
              <label className="block text-sm text-zinc-400 mb-1.5">Bilet Fiyatı (₺)</label>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">İkram</label>
              <div className="flex gap-2">
                {CATERING_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCatering(opt.id)}
                    className={`flex-1 py-2.5 rounded-lg text-sm border ${
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

          <div className="flex gap-3 mt-6">
            <button onClick={handleCreate} className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg">
              Seferi Başlat
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-zinc-700 rounded-lg">
              İptal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {expeditions.length === 0 && (
          <div className="text-center py-16 text-zinc-500">Henüz sefer yok. İlk seferini oluştur!</div>
        )}

        {expeditions.map((exp) => (
          <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-semibold">
                  {exp.origin} → {exp.destination}
                </div>
                <div className="text-sm text-zinc-400 mt-1">
                  {formatMoney(exp.ticketPrice)} • {CATERING_OPTIONS.find((c) => c.id === exp.catering)?.label}
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
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">Yolda...</div>
                )}
                {exp.status === "completed" && (
                  <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">Tamamlandı</div>
                )}
              </div>
            </div>

            {exp.status === "filling" && (
              <div className="mt-4 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full progress-bar"
                  style={{ width: `${(exp.soldTickets / exp.maxSeats) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}