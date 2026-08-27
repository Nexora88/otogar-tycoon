"use client";

import { AlertTriangle } from "lucide-react";
import { useGameStore } from "@/store/gameStore";

export default function ComplaintModal() {
  const show = useGameStore((s) => s.showComplaintModal);
  const text = useGameStore((s) => s.currentComplaint);
  const closeComplaint = useGameStore((s) => s.closeComplaint);

  if (!show || !text) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-900 border border-red-900/50 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="font-bold text-red-300">Yolcu şikayeti</div>
            <div className="text-xs text-zinc-500">İtibar etkilendi</div>
          </div>
        </div>
        <p className="text-zinc-200 text-sm leading-relaxed mb-6">“{text}”</p>
        <button
          onClick={closeComplaint}
          className="w-full py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-sm hover:bg-zinc-750 hover:border-zinc-500 transition"
        >
          Anlaşıldı
        </button>
      </div>
    </div>
  );
}