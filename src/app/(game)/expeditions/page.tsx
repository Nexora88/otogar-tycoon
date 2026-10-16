"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useGameStore,
  generatePassengers,
  CATERING_INFO,
  type Catering,
} from "@/store/gameStore";
import { useCareerStore } from "@/store/careerStore";
import { formatMoney } from "@/lib/utils";
import { maxTicketPrice, minTicketPrice } from "@/lib/economy";
import { ROUTES } from "@/data/routes";
import { sendPrice } from "@/lib/roomChannel";
import { Route, Plus, Fuel, User } from "lucide-react";
import ExpeditionLiveList from "@/components/ExpeditionLiveList";

const MAFIA_LINES = [
  "Ağa, 5 koli ‘hediye’ Ankara’ya. Bagaja at, temiz ₺10.000.",
  "Sınırdan geldi, soru sorma. Senin payın peşin.",
  "Jandarma yoksa kimse bilmez. Varırsa… sen bilirsin.",
];

export default function ExpeditionsPage() {
  const careerStarted = useCareerStore((s) => s.careerStarted);
  const careerDone = useCareerStore((s) => s.careerDone);

  const {
    buses,
    drivers,
    companyName,
    addExpedition,
    lastEvent,
    lastTicket,
    clearLastEvent,
    demandMultiplier,
    officeUpgradeLevel,
    serviceUpgradeLevel,
    restStopDealLevel,
    pushPhone,
    setDriverBusy,
    crierBonus,
    priceCapMultiplier,
    bayramActive,
    rivalWeak,
    canUseBus,
  } = useGameStore();

  const [showForm, setShowForm] = useState(false);
  const [routeId, setRouteId] = useState(ROUTES[0]?.id || "");
  const [ticketPrice, setTicketPrice] = useState(220);
  const [catering, setCatering] = useState<Catering>("snack");
  const [busId, setBusId] = useState(buses[0]?.id || "");
  const [driverId, setDriverId] = useState("");
  const [muavinId, setMuavinId] = useState("");
  const [smuggle, setSmuggle] = useState(false);
  const [mafiaLine, setMafiaLine] = useState(MAFIA_LINES[0]);

  const route = ROUTES.find((r) => r.id === routeId) || ROUTES[0];
  const bus = buses.find((b) => b.id === busId);
  const selectedDriver = drivers.find((d) => d.id === driverId);
  const conditionMultiplier = 0.75 + (bus?.engineHealth ?? 75) / 400;
  const skillMultiplier = 0.9 + (selectedDriver?.skill ?? 50) / 500;
  const fatigueMultiplier = 1 - (selectedDriver?.fatigue ?? 75) / 500;
  const driversFree = drivers.filter(
    (d) => d.role === "driver" && !d.onExpedition && d.fatigue < 88
  );
  const muavinsFree = drivers.filter(
    (d) => d.role === "muavin" && !d.onExpedition
  );

  const mult = priceCapMultiplier();
  const minP = minTicketPrice(route?.distance || 400);
  const maxP = maxTicketPrice(route?.distance || 400, mult);
  const fuelEst = bus
    ? Math.round(
        ((route?.distance || 400) / 100) *
          (bus.fuelUse || 28) *
          useGameStore.getState().fuelPrice
      )
    : 0;

  const priceRatio = ticketPrice / Math.max(1, maxP);
  const boardingChance = Math.min(
    0.98,
    Math.max(0.12, 0.82 - priceRatio * 0.7) *
      crierBonus() *
      demandMultiplier *
      (1 + officeUpgradeLevel * 0.025) *
      conditionMultiplier *
      skillMultiplier *
      fatigueMultiplier
  );
  const estimatedPassengers = bus
    ? Math.min(
        bus.seatCount,
        Math.max(0, Math.round(19 * boardingChance * (priceRatio < 0.4 ? 3 : 1)))
      )
    : 0;
  const estimatedCateringCost = Math.round(
    estimatedPassengers *
      (CATERING_INFO[catering]?.perSeat || 10) *
      Math.max(0.7, 1 - serviceUpgradeLevel * 0.05)
  );
  const estimatedRestStopBonus = estimatedPassengers * restStopDealLevel * 4;
  const estimatedRevenue =
    estimatedPassengers * ticketPrice + estimatedRestStopBonus;
  const estimatedCosts =
    fuelEst + estimatedCateringCost + (bus?.muavinCost || 0) + 350;
  const estimatedProfit = estimatedRevenue - estimatedCosts;

  const completedReport = lastTicket as {
    origin?: string;
    destination?: string;
    sold?: number;
    price?: number;
    revenue?: number;
    cost?: number;
    profit?: number;
    driverName?: string;
  } | null;

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
            ) || ROUTES[0];
          const maxPrice = maxTicketPrice(
            r?.distance || 400,
            st.priceCapMultiplier()
          );
          const ratio = exp.ticketPrice / Math.max(1, maxPrice);
          const boardingDriver = st.drivers.find((d) => d.id === exp.driverId);
          const boardingBus = st.buses.find((b) => b.id === exp.busId);
          const cM = 0.75 + (boardingBus?.engineHealth ?? 75) / 400;
          const sM = 0.9 + (boardingDriver?.skill ?? 50) / 500;
          const fM = 1 - (boardingDriver?.fatigue ?? 75) / 500;
          const chance = Math.min(
            0.98,
            Math.max(0.12, 0.82 - ratio * 0.7) *
              st.crierBonus() *
              st.demandMultiplier *
              (1 + st.officeUpgradeLevel * 0.025) *
              cM *
              sM *
              fM
          );
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
            ) || ROUTES[0];
          const driveMs = Math.min(
            100000,
            Math.max(40000, (r?.distance || 400) * 90)
          );
          const elapsed = Date.now() - exp.departureTime;
          const prog = Math.min(0.99, elapsed / driveMs);
          const logs = [...(exp.log || [])];
          if (prog > 0.25 && logs.length < 1)
            logs.push("İzmit sapağı — ikram dağıtılıyor.");
          if (prog > 0.55 && logs.length < 2)
            logs.push("Bolu etekleri — takograf yeşilde.");
          if (prog > 0.8 && logs.length < 3)
            logs.push("Varışa yakın — peron anonsu.");

          st.updateExpedition(exp.id, { progress: prog, log: logs });
          if (Math.random() < 0.08) st.rollRoadEvent(exp);

          if (elapsed > driveMs) {
            const b = st.buses.find((x) => x.id === exp.busId);
            const fuel = Math.round(
              ((r?.distance || 400) / 100) * (b?.fuelUse || 28) * st.fuelPrice
            );
            const cat = Math.round(
              exp.soldTickets *
                (CATERING_INFO[exp.catering]?.perSeat || 10) *
                Math.max(0.7, 1 - st.serviceUpgradeLevel * 0.05)
            );
            const mu = b?.muavinCost || 400;
            const peronFee = 350;
            const restBonus = exp.soldTickets * st.restStopDealLevel * 4;
            const revenue = exp.soldTickets * exp.ticketPrice + restBonus;
            const cost = fuel + cat + mu + peronFee;
            const profit = revenue - cost;
            const driver = st.drivers.find((d) => d.id === exp.driverId);
            const wear = Math.min(
              18,
              Math.max(
                2,
                Math.ceil((r?.distance || 400) / 180) +
                  Math.floor((driver?.fatigue || 0) / 25)
              )
            );
            if (b) {
              useGameStore.setState((s) => ({
                buses: s.buses.map((x) =>
                  x.id === b.id
                    ? {
                        ...x,
                        engineHealth: Math.max(5, x.engineHealth - wear),
                      }
                    : x
                ),
              }));
            }

            const rep =
              (CATERING_INFO[exp.catering]?.repMod || 0) +
              st.serviceUpgradeLevel;
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
              st.addFatigue(
                exp.driverId,
                18 + Math.floor(Math.random() * 12)
              );
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
  }, []);

  if (careerStarted && !careerDone) {
    return (
      <div className="mx-auto max-w-md p-8 text-center">
        <h1 className="text-lg font-bold text-amber-400">Sefer yok — çıraksın</h1>
        <p className="mt-3 text-sm text-zinc-500">
          Seferi patron açar. Bağımsız olunca sen planlarsın.
        </p>
        <Link href="/shift" className="mt-6 inline-block text-sm text-cyan-400 underline">
          Vardiyaya dön
        </Link>
      </div>
    );
  }

  const handleCreate = () => {
    if (!bus || !route) return;
    if (!driverId) {
      alert("Boşta şoför seç.");
      return;
    }
    if (ticketPrice < minP || ticketPrice > maxP) {
      alert(`Bilet ${minP}–${maxP} ₺ (tavan sabit)`);
      return;
    }
    if (!canUseBus(bus.id)) {
      alert("Bu otobüs meşgul veya tamirde.");
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

    void sendPrice(
      companyName || "Firma",
      `${route.origin} → ${route.destination}`,
      ticketPrice
    );

    setShowForm(false);
    setSmuggle(false);
  };

  return (
    <div className="relative mx-auto max-w-4xl p-4 pb-28 sm:p-8">
      {lastEvent && (
        <div className="fixed bottom-24 right-4 z-40 max-w-sm rounded-xl border border-amber-800/40 bg-zinc-900 p-4 md:bottom-6">
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

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.25em] text-amber-500">
            PERON OPERASYON
          </div>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-black">
            <Route className="h-7 w-7 text-amber-400" />
            Seferler
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Bilet tavanı mesafe + ekonomi kuralları.
            {bayramActive && <span className="ml-2 text-red-400">Bayram</span>}
            {rivalWeak && <span className="ml-2 text-emerald-400">Rakip zayıf</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setMafiaLine(MAFIA_LINES[Math.floor(Math.random() * MAFIA_LINES.length)]!);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 font-bold text-stone-950"
        >
          <Plus className="h-4 w-4" /> Yeni sefer
        </button>
      </div>

      {showForm && (
        <div className="mb-8 space-y-4 rounded-2xl border border-amber-900/35 bg-zinc-900/90 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs text-zinc-500">Hat</span>
              <select
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                className="mt-1 min-h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              >
                {ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.origin} → {r.destination}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-zinc-500">Otobüs</span>
              <select
                value={busId}
                onChange={(e) => setBusId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              >
                {buses.map((b) => {
                  const ok = canUseBus(b.id);
                  return (
                    <option key={b.id} value={b.id} disabled={!ok}>
                      {b.name} · {b.plate}
                      {!ok ? " (meşgul)" : ""}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="block text-sm">
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <User className="h-3 w-3" /> Şoför
              </span>
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              >
                <option value="">Seç…</option>
                {driversFree.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} · yorgun %{Math.round(d.fatigue)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-zinc-500">Muavin</span>
              <select
                value={muavinId}
                onChange={(e) => setMuavinId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              >
                <option value="">Yok</option>
                {muavinsFree.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-zinc-500">
                Bilet ({minP}–{maxP} ₺)
              </span>
              <input
                type="number"
                value={ticketPrice}
                onChange={(e) => setTicketPrice(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
              />
            </label>
            <div className="flex items-end gap-1 pb-2 text-xs text-zinc-500">
              <Fuel className="h-3 w-3" /> Mazot {formatMoney(fuelEst)} · peron 350₺
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATERING_INFO) as Catering[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setCatering(k)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${
                  catering === k
                    ? "border-amber-500 bg-amber-500/10"
                    : "border-zinc-700"
                }`}
              >
                {CATERING_INFO[k].label} · {CATERING_INFO[k].perSeat}₺
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm xl:grid-cols-4">
            <div className="rounded-lg border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500">Yolcu ~</div>
              <div className="font-black">{estimatedPassengers}</div>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500">Gelir ~</div>
              <div className="font-black text-emerald-300">
                {formatMoney(estimatedRevenue)}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500">Gider ~</div>
              <div className="font-black text-orange-200">
                {formatMoney(estimatedCosts)}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-800 p-3">
              <div className="text-[10px] text-zinc-500">Net ~</div>
              <div
                className={`font-black ${
                  estimatedProfit >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {formatMoney(estimatedProfit)}
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={smuggle}
              onChange={(e) => setSmuggle(e.target.checked)}
            />
            <span>Riskli bagaj (+10.000) — {mafiaLine}</span>
          </label>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-black"
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

      {completedReport && (
        <section className="mb-5 rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-4">
          <div className="text-[10px] font-black text-emerald-400">SON FİŞ</div>
          <div className="mt-1 flex justify-between gap-2">
            <span className="text-sm font-bold">
              {completedReport.origin} → {completedReport.destination}
            </span>
            <span
              className={`font-black ${
                (completedReport.profit ?? 0) >= 0
                  ? "text-emerald-300"
                  : "text-red-300"
              }`}
            >
              {formatMoney(completedReport.profit ?? 0)}
            </span>
          </div>
        </section>
      )}

      <ExpeditionLiveList onOpenForm={() => setShowForm(true)} />
    </div>
  );
}
