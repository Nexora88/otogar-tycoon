"use client";

import { useGameStore } from "@/store/gameStore";

export default function MeetingModal() {
  const open = useGameStore((s) => s.meetingOpen);
  const topic = useGameStore((s) => s.meetingTopic);
  const resolve = useGameStore((s) => s.resolveMeeting);
  const close = useGameStore((s) => s.closeMeeting);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[64] flex items-center justify-center bg-black/75 p-4">
      <div className="bg-[#1a1410] border border-stone-600 rounded-xl max-w-md w-full p-6">
        <div className="text-xs text-stone-500 mb-1">MESAİ / TOPLANTI ODASI</div>
        <h2 className="font-bold text-amber-100 text-lg">Personel toplantısı</h2>
        <p className="text-sm text-stone-400 mt-2">{topic}</p>
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={() => resolve("warn")}
            className="w-full text-left px-3 py-2.5 rounded-lg border border-stone-600 text-sm hover:bg-stone-800"
          >
            Uyar — “Bir daha olmasın.”
          </button>
          <button
            type="button"
            onClick={() => resolve("fine")}
            className="w-full text-left px-3 py-2.5 rounded-lg border border-stone-600 text-sm hover:bg-stone-800"
          >
            Kız / kesinti — disiplin
          </button>
          <button
            type="button"
            onClick={() => resolve("bonus")}
            className="w-full text-left px-3 py-2.5 rounded-lg border border-amber-800 text-sm text-amber-200"
          >
            Ödül ver — ₺2.000 ikramiye
          </button>
          <button
            type="button"
            onClick={() => resolve("fire")}
            className="w-full text-left px-3 py-2.5 rounded-lg border border-red-900 text-sm text-red-300"
          >
            Şüpheliyi kapıya koy
          </button>
          <button
            type="button"
            onClick={close}
            className="w-full text-center text-xs text-stone-500 pt-2"
          >
            Ertele
          </button>
        </div>
      </div>
    </div>
  );
}