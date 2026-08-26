"use client";

import { useState } from "react";
import { useGameStore, type BusColor } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Bus, Paintbrush, Wrench } from "lucide-react";

const COLORS: { id: BusColor; label: string; class: string }[] = [
  { id: "blue", label: "Mavi", class: "bg-blue-500" },
  { id: "red", label: "Kırmızı", class: "bg-red-500" },
  { id: "green", label: "Yeşil", class: "bg-green-500" },
  { id: "black", label: "Siyah", class: "bg-zinc-800 border border-zinc-600" },
  { id: "white", label: "Beyaz", class: "bg-white" },
  { id: "orange", label: "Turuncu", class: "bg-orange-500" },
];

const PAINT_COST = 15000;

export default function GaragePage() {
  const { buses, paintBus, spendMoney } = useGameStore();
  const [selectedBusId, setSelectedBusId] = useState(buses[0]?.id || "");
  const [message, setMessage] = useState("");

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  const handlePaint = (color: BusColor) => {
    if (!selectedBus) return;

    if (selectedBus.color === color) {
      setMessage("Otobüs zaten bu renkte!");
      return;
    }

    const success = spendMoney(PAINT_COST);
    if (!success) {
      setMessage("Yetersiz bakiye! Boyama için 15.000 ₺ gerekli.");
      return;
    }

    paintBus(selectedBus.id, color);
    setMessage(`${selectedBus.name} başarıyla boyandı!`);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Garaj</h1>
        <p className="text-zinc-400 mt-1">Otobüslerini yönet, boya ve bakım yaptır.</p>
      </div>

      {message && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-700 text-sm">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-zinc-400 mb-2">Filom</h2>
          {buses.map((bus) => (
            <button
              key={bus.id}
              onClick={() => {
                setSelectedBusId(bus.id);
                setMessage("");
              }}
              className={`w-full text-left p-4 rounded-xl border transition ${
                selectedBusId === bus.id
                  ? "border-amber-500 bg-amber-500/5"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${COLORS.find((c) => c.id === bus.color)?.class}`}>
                  <Bus className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="font-medium">{bus.name}</div>
                  <div className="text-xs text-zinc-500">
                    {bus.model} • {bus.seatCount} koltuk
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedBus && (
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">{selectedBus.name}</h2>
                <p className="text-zinc-400 text-sm mt-1">
                  {selectedBus.model} • {selectedBus.seatCount} Koltuk
                </p>
              </div>
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${COLORS.find((c) => c.id === selectedBus.color)?.class}`}>
                <Bus className="w-8 h-8 text-black" />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-zinc-400">Motor Durumu</span>
                <span>{selectedBus.engineHealth}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selectedBus.engineHealth > 60 ? "bg-green-500" : selectedBus.engineHealth > 30 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${selectedBus.engineHealth}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Paintbrush className="w-4 h-4 text-amber-400" />
                <h3 className="font-medium">Otobüsü Boya</h3>
                <span className="text-xs text-zinc-500 ml-auto">Ücret: {formatMoney(PAINT_COST)}</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handlePaint(color.id)}
                    className={`w-12 h-12 rounded-xl transition hover:scale-105 ${color.class} ${
                      selectedBus.color === color.id ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-zinc-900" : ""
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800">
              <button disabled className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-500 text-sm cursor-not-allowed">
                <Wrench className="w-4 h-4" />
                Bakım Yaptır (Yakında)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}