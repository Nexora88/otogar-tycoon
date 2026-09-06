"use client";

import { useGameStore, MARKET_BUSES } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

const BODY: Record<string, string> = {
  blue: "#1e4a8c",
  red: "#9b1b1b",
  green: "#1b5e3a",
  black: "#222",
  white: "#e8e8e8",
  orange: "#c45c12",
};

function BusArt({
  color,
  model,
  sticker,
}: {
  color: string;
  model: string;
  sticker?: string | null;
}) {
  const fill = BODY[color] || "#333";
  const darkText = color === "white" || color === "orange";
  return (
    <svg viewBox="0 0 240 110" className="w-full h-32">
      <ellipse cx="120" cy="98" rx="90" ry="8" fill="#000" opacity="0.3" />
      {/* gövde 2.5D */}
      <path
        d="M20 40 L30 28 H200 L220 40 V78 H20 Z"
        fill={fill}
      />
      <path d="M200 28 L220 40 V78 H200 Z" fill="#000" opacity="0.25" />
      {/* camlar */}
      <rect x="36" y="34" width="28" height="20" rx="2" fill="#7ec8e8" opacity="0.9" />
      <rect x="70" y="34" width="28" height="20" rx="2" fill="#6ab0d4" opacity="0.85" />
      <rect x="104" y="34" width="28" height="20" rx="2" fill="#7ec8e8" opacity="0.9" />
      <rect x="138" y="34" width="28" height="20" rx="2" fill="#6ab0d4" opacity="0.85" />
      <rect x="172" y="34" width="22" height="20" rx="2" fill="#5a9bb8" opacity="0.8" />
      {/* şerit */}
      <rect x="20" y="58" width="200" height="5" fill="#f5d76e" opacity="0.85" />
      {/* teker */}
      <circle cx="55" cy="82" r="12" fill="#1a1a1a" />
      <circle cx="55" cy="82" r="6" fill="#666" />
      <circle cx="175" cy="82" r="12" fill="#1a1a1a" />
      <circle cx="175" cy="82" r="6" fill="#666" />
      {/* far */}
      <rect x="18" y="48" width="8" height="10" rx="1" fill="#f5e6a3" />
      <text
        x="120"
        y="72"
        textAnchor="middle"
        fill={darkText ? "#222" : "#f0f0f0"}
        fontSize="10"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {model}
      </text>
      {sticker && (
        <text
          x="120"
          y="52"
          textAnchor="middle"
          fill={darkText ? "#444" : "#ddd"}
          fontSize="6"
          fontFamily="serif"
        >
          {sticker.slice(0, 28)}
        </text>
      )}
    </svg>
  );
}

export default function MarketPage() {
  const balance = useGameStore((s) => s.balance);
  const buses = useGameStore((s) => s.buses);
  const buyBus = useGameStore((s) => s.buyBus);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Pazar · Galeri</h1>
      <p className="text-cyan-400 text-sm mb-6">Kasa: {formatMoney(balance)}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MARKET_BUSES.map((b) => {
          const can = balance >= b.price;
          return (
            <div
              key={b.name}
              className={`rounded-2xl border bg-zinc-900 overflow-hidden ${
                can ? "border-zinc-700" : "border-zinc-900 opacity-60"
              }`}
            >
              <div className="bg-gradient-to-b from-zinc-800 to-zinc-950 px-3 pt-3">
                <BusArt color={b.color} model={b.model} />
              </div>
              <div className="p-4">
                <div className="font-bold">{b.name}</div>
                <div className="text-xs text-zinc-500">
                  {b.seatCount} koltuk · %{b.engineHealth} motor · {b.fuelUse} lt
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-amber-400 font-bold">
                    {formatMoney(b.price)}
                  </span>
                  <button
                    type="button"
                    disabled={!can}
                    onClick={() => {
                      if (!buyBus(b)) alert("Yetersiz kasa");
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                      can ? "bg-cyan-500 text-black" : "bg-zinc-800 text-zinc-500"
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
      {buses.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {buses.map((b) => (
            <span
              key={b.id}
              className="text-xs px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
            >
              {b.name} · {b.plate}
              {b.sticker ? ` · «${b.sticker.slice(0, 16)}»` : ""}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}