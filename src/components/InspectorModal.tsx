"use client";

import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function InspectorModal() {
  const inspector = useGameStore((s) => s.inspector);
  const resolve = useGameStore((s) => s.resolveInspector);

  if (!inspector) return null;

  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-black/80 p-4">
      <div className="bg-stone-900 border-2 border-amber-800 rounded-xl max-w-md w-full p-6">
        <div className="text-xs text-amber-500/80 tracking-widest mb-1">KAPI ÇALDI</div>
        <h2 className="text-lg font-bold text-amber-100">{inspector.title}</h2>
        <p className="text-sm text-stone-400 mt-3 leading-relaxed">{inspector.body}</p>
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => resolve("pay")}
            className="w-full text-left px-4 py-3 rounded-lg border border-stone-600 hover:border-emerald-600 text-sm"
          >
            <span className="font-semibold text-emerald-300">Dürüst yol</span>
            <span className="block text-xs text-stone-500 mt-0.5">
              “Kanun ne diyorsa o.” Ceza {formatMoney(inspector.fine)}
            </span>
          </button>
          <button
            type="button"
            onClick={() => resolve("bribe")}
            className="w-full text-left px-4 py-3 rounded-lg border border-stone-600 hover:border-red-700 text-sm"
          >
            <span className="font-semibold text-red-300">Çorba parası</span>
            <span className="block text-xs text-stone-500 mt-0.5">
              Dosyayı kapat — {formatMoney(inspector.bribe)} (riskli)
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}