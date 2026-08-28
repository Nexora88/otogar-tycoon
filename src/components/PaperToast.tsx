"use client";

import { useGameStore } from "@/store/gameStore";

export default function PaperToast() {
  const notify = useGameStore((s) => s.paperNotify);
  const openPaperEdition = useGameStore((s) => s.openPaperEdition);
  const clear = useGameStore((s) => s.clearPaperNotify);

  if (!notify) return null;

  const label =
    notify === "morning" ? "Sabah baskısı çıktı" : "Akşam baskısı çıktı";

  return (
    <div className="fixed top-4 right-4 z-[55] max-w-xs bg-amber-100 text-stone-900 border-2 border-stone-800 rounded-lg shadow-xl p-3">
      <div className="text-[10px] font-bold tracking-widest">
        HAKİKİ PERON GAZETESİ
      </div>
      <div className="text-sm font-semibold mt-1">{label}</div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={() => {
            openPaperEdition(notify);
            clear();
          }}
          className="flex-1 py-1.5 bg-stone-900 text-amber-100 text-xs rounded"
        >
          Oku
        </button>
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1.5 text-xs border border-stone-600 rounded"
        >
          Sonra
        </button>
      </div>
    </div>
  );
}