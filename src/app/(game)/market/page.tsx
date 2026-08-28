"use client";

import { useGameStore, MARKET_BUSES } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";
import { Fuel, User } from "lucide-react";

const BODY: Record<string, string> = {
  blue: "#1e4a8c",
  red: "#9b1b1b",
  green: "#1b5e3a",
  black: "#1a1a1a",
  white: "#e8e8e8",
  orange: "#c45c12",
};

function BusArt({ color, model }: { color: string; model: string }) {
  const fill = BODY[color] || "#333";
  const light = color === "white" || color === "orange";
  return (
    <svg viewBox="0 0 200 90" className="w-full h-28">
      <ellipse cx="100" cy="82" rx="70" ry="6" fill="#000" opacity="0.25" />
      <rect x="20" y="28" width="160" height="42" rx="6" fill={fill} />
      <rect x="28" y="34" width="100" height="18" rx="2" fill="#7ec8e8" opacity="0.85" />
      <rect x="132" y="34" width="40" height="18" rx="2" fill="#5a9bb8" opacity="0.7" />
      <rect x="20" y="52" width="160" height="4" fill="#000" opacity="0.2" />
      <circle cx="50" cy="72" r="10" fill="#222" />
      <circle cx="50" cy="72" r="5" fill="#666" />
      <circle cx="150" cy="72" r="10" fill="#222" />
      <circle cx="150" cy="72" r="5" fill="#666" />
      <rect x="18" y="40" width="6" height="10" fill="#f5d76e" />
      <text
        x="100"
        y="64"
        textAnchor="middle"
        fill={light ? "#222" : "#eee"}
        fontSize="9"
        fontFamily="monospace"
      >
        {model}
      </text>
    </svg>
  );
}

export default function MarketPage() {
  const { balance, buses, buyBus } = useGameStore();

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Pazar — Galeri</h1>
      <p className="text-amber-400 text-sm mb-6">Kasa: {formatMoney(balance)}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MARKET_BUSES.map((b) => {
          const can = balance >= b.price;
          return (
            <div
              key={b.name}
              className={`rounded-2xl border overflow-hidden bg-zinc-900 ${
                can ? "border-zinc-700" : "border-zinc-900 opacity-70"
              }`}
            >
              <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 px-4 pt-4">
                <BusArt color={b.color} model={b.model} />
              </div>
              <div className="p-4">
                <div className="font-bold">{b.name}</div>
                <div className="text-xs text-zinc-500 mb-2">
                  {b.seatCount} koltuk · Motor %{b.engineHealth}
                </div>
                <div className="flex gap-3 text-[11px] text-zinc-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Fuel className="w-3 h-3" /> {b.fuelUse} lt
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {formatMoney(b.muavinCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400 font-bold">
                    {formatMoney(b.price)}
                  </span>
                  <button
                    type="button"
                    disabled={!can}
                    onClick={() => {
                      if (!buyBus(b)) alert("Yetersiz");
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      can
                        ? "bg-amber-500 text-black"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {can ? "Satın al" : "Yetersiz"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        {buses.map((b) => (
          <span
            key={b.id}
            className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            {b.name} · {b.plate}
          </span>
        ))}
      </div>
    </div>
  );
}