"use client";

import { useGameStore } from "@/store/gameStore";
import { AlertTriangle, X } from "lucide-react";

export default function ComplaintModal() {
  const { showComplaintModal, currentComplaint, closeComplaint } = useGameStore();

  if (!showComplaintModal || !currentComplaint) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-zinc-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={closeComplaint}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Yolcu Şikayeti!</h3>
            <p className="text-xs text-zinc-500">İtibar -2</p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed">"{currentComplaint}"</p>

        <button
          onClick={closeComplaint}
          className="mt-6 w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition"
        >
          Anlaşıldı
        </button>
      </div>
    </div>
  );
}