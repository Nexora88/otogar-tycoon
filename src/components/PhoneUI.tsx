"use client";

import { useGameStore } from "@/store/gameStore";
import { Phone, X } from "lucide-react";

export default function PhoneUI() {
  const phoneOpen = useGameStore((s) => s.phoneOpen);
  const setPhoneOpen = useGameStore((s) => s.setPhoneOpen);
  const messages = useGameStore((s) => s.phoneMessages);
  const markPhoneRead = useGameStore((s) => s.markPhoneRead);

  const unread = messages.filter((m) => !m.read).length;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPhoneOpen(true);
          markPhoneRead();
        }}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-40 w-12 h-12 rounded-full bg-zinc-900 border-2 border-amber-600 shadow-lg flex items-center justify-center"
      >
        <Phone className="w-5 h-5 text-amber-400" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-[10px] flex items-center justify-center font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {phoneOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-[280px] rounded-[1.5rem] border-4 border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden">
            <div className="h-28 bg-gradient-to-b from-stone-700 to-stone-900 flex flex-col items-center justify-center border-b border-zinc-600 relative">
              <div className="w-14 h-14 rounded-full bg-stone-600 border-2 border-amber-700/50 flex items-center justify-center text-xl font-serif text-stone-300">
                A
              </div>
              <div className="text-[9px] text-amber-200/70 mt-1 tracking-widest">
                M. K. ATATÜRK
              </div>
              <button
                type="button"
                onClick={() => setPhoneOpen(false)}
                className="absolute top-2 right-2 p-1 text-zinc-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto p-2 space-y-2">
              {messages.length === 0 && (
                <p className="text-xs text-zinc-600 p-3 text-center">
                  Mesaj yok
                </p>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs"
                >
                  <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
                    <span className="text-amber-500/90">{m.from}</span>
                    <span>{m.type === "call" ? "Arama" : "SMS"}</span>
                  </div>
                  <p className="text-zinc-300">{m.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}