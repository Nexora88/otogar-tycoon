"use client";

import { useState } from "react";
import { useGameStore, type BusColor } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Warehouse, Paintbrush, Hash } from "lucide-react";

const COLORS: { id: BusColor; label: string; className: string }[] = [
  { id: "blue", label: "Mavi", className: "bg-blue-600" },
  { id: "red", label: "Kırmızı", className: "bg-red-600" },
  { id: "green", label: "Yeşil", className: "bg-green-600" },
  { id: "black", label: "Siyah", className: "bg-zinc-800 border border-zinc-500" },
  { id: "white", label: "Beyaz", className: "bg-zinc-200" },
  { id: "orange", label: "Turuncu", className: "bg-orange-500" },
];

const PLATE_CITY = ["34", "06", "35", "16", "01", "07", "42", "27"];

export default function GaragePage() {
  const { buses, balance, paintBus, setBusPlate, spendMoney } = useGameStore();
  const [selectedId, setSelectedId] = useState(buses[0]?.id || "");
  const bus = buses.find((b) => b.id === selectedId) || buses[0];

  const [plateCity, setPlateCity] = useState("34");
  const [plateMid, setPlateMid] = useState("TYC");
  const [plateNum, setPlateNum] = useState("01");

  if (!bus) {
    return (
      <div className="p-8 text-zinc-500">
        Filoda araç yok. Pazardan otobüs al.
      </div>
    );
  }

  const applyPlate = () => {
    const plate = `${plateCity} ${plateMid.toUpperCase().slice(0, 3)} ${plateNum}`.trim();
    if (!spendMoney(2500)) {
      alert("Özel plaka 2.500 ₺ — yetersiz bakiye");
      return;
    }
    setBusPlate(bus.id, plate);
  };

  const paint = (color: BusColor) => {
    if (color === bus.color) return;
    if (!spendMoney(5000)) {
      alert("Boya 5.000 ₺ — yetersiz bakiye");
      return;
    }
    paintBus(bus.id, color);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-1">
        <Warehouse className="w-6 h-6 text-amber-400" />
        Garaj
      </h1>
      <p className="text-zinc-400 text-sm mb-6">
        Boya, özel plaka, motor durumu — eski ustalar gibi bakımlı tut.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Liste */}
        <div className="lg:col-span-2 space-y-2">
          {buses.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selectedId === b.id
                  ? "border-amber-500 bg-amber-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
              }`}
            >
              <div className="font-semibold">{b.name}</div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {b.model} · {b.seatCount} koltuk
              </div>
              <div className="mt-2 inline-block font-mono text-sm bg-white text-black px-2 py-0.5 rounded border-2 border-black tracking-wider">
                {b.plate || "34 YOK 00"}
              </div>
            </button>
          ))}
          <p className="text-xs text-zinc-600 pt-2">Kasa: {formatMoney(balance)}</p>
        </div>

        {/* Detay */}
        <div className="lg:col-span-3 space-y-5">
          {/* Silüet + plaka */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-center mb-6">
              <div
                className="relative w-64 h-28"
                style={{
                  transform: "perspective(400px) rotateY(-8deg)",
                }}
              >
                <div
                  className={`absolute inset-0 rounded-lg border border-black/40 shadow-2xl bg-gradient-to-br ${
                    bus.color === "blue"
                      ? "from-blue-500 to-blue-800"
                      : bus.color === "red"
                      ? "from-red-500 to-red-800"
                      : bus.color === "green"
                      ? "from-green-500 to-green-800"
                      : bus.color === "orange"
                      ? "from-orange-400 to-orange-700"
                      : bus.color === "white"
                      ? "from-zinc-100 to-zinc-300"
                      : "from-zinc-600 to-zinc-900"
                  }`}
                  style={{ boxShadow: "10px 12px 0 rgba(0,0,0,0.35)" }}
                >
                  <div className="absolute top-3 left-3 right-16 h-8 bg-sky-950/40 rounded border border-black/20" />
                  <div className="absolute bottom-2 left-4 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-500" />
                  <div className="absolute bottom-2 right-4 w-5 h-5 rounded-full bg-zinc-900 border-2 border-zinc-500" />
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="inline-block bg-white text-black font-mono text-xl font-bold px-4 py-1.5 rounded border-[3px] border-black tracking-[0.2em] shadow-md">
                {bus.plate || "34 YOK 00"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-zinc-500">Motor</div>
                <div className="font-semibold text-emerald-400">%{bus.engineHealth}</div>
              </div>
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-zinc-500">Muavin / sefer</div>
                <div className="font-semibold">
                  {formatMoney(bus.muavinCost || 400)}
                </div>
              </div>
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-zinc-500">Yakıt</div>
                <div className="font-semibold">{bus.fuelUse || 32} lt/100km</div>
              </div>
              <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
                <div className="text-xs text-zinc-500">Koltuk</div>
                <div className="font-semibold">{bus.seatCount}</div>
              </div>
            </div>
          </div>

          {/* Boya */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 font-medium">
              <Paintbrush className="w-4 h-4 text-amber-400" />
              Boya — 5.000 ₺
            </div>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => paint(c.id)}
                  className={`w-10 h-10 rounded-full ${c.className} ${
                    bus.color === c.id ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900" : ""
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Özel plaka */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3 font-medium">
              <Hash className="w-4 h-4 text-amber-400" />
              Özel plaka — 2.500 ₺
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <select
                value={plateCity}
                onChange={(e) => setPlateCity(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono"
              >
                {PLATE_CITY.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <input
                value={plateMid}
                onChange={(e) =>
                  setPlateMid(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3))
                }
                className="w-20 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-center"
                maxLength={3}
                placeholder="ABC"
              />
              <input
                value={plateNum}
                onChange={(e) =>
                  setPlateNum(e.target.value.replace(/\D/g, "").slice(0, 3))
                }
                className="w-16 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 font-mono text-center"
                maxLength={3}
                placeholder="01"
              />
            </div>
            <div className="text-xs text-zinc-500 mb-3">
              Önizleme:{" "}
