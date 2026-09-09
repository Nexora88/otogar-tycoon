"use client";

import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";

export default function PhoneUI() {
  const open = useGameStore((s) => s.phoneOpen);
  const setOpen = useGameStore((s) => s.setPhoneOpen);
  const messages = useGameStore((s) => s.phoneMessages);
  const markRead = useGameStore((s) => s.markPhoneRead);

  const unread = useMemo(
    () => messages.filter((m) => !m.read).length,
    [messages]
  );

  const list = useMemo(() => {
    const out: typeof messages = [];
    let prev = "";
    for (const m of messages) {
      const k = m.from + m.body.slice(0, 32);
      if (k === prev) continue;
      out.push(m);
      prev = k;
      if (out.length >= 15) break;
    }
    return out;
  }, [messages]);

  const close = () => setOpen(false);

  const openPhone = () => {
    setOpen(true);
    markRead();
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={openPhone}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[80] w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-600 shadow-xl flex flex-col items-center justify-center"
      >
        <span className="text-[10px] font-mono text-amber-500">TEL</span>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-600 text-[10px] font-bold flex items-center justify-center px-1">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4"
      onClick={close}
      role="presentation"
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-zinc-600 bg-zinc-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700 bg-zinc-950">
          <div>
            <div className="text-[10px] tracking-widest text-zinc-500">
              NEXORA TEL
            </div>
            <div className="text-sm font-semibold text-zinc-200">Mesajlar</div>
          </div>
          <button
            type="button"
            onClick={close}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-600 text-sm text-zinc-200 hover:bg-zinc-700"
          >
            Kapat
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto p-3 space-y-2">
          {list.length === 0 && (
            <p className="text-center text-sm text-zinc-600 py-10">
              Kutu boş.
            </p>
          )}
          {list.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2.5"
            >
              <div className="flex justify-between gap-2 text-[11px]">
                <span className="font-semibold text-zinc-200">{m.from}</span>
                <span className="text-zinc-600">
                  {m.type === "call" ? "ARA" : "SMS"}
                </span>
              </div>
              <p className="text-[12px] text-zinc-400 mt-1 leading-snug">
                {m.body}
              </p>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={close}
            className="w-full py-3 rounded-xl bg-amber-600 text-black font-bold text-sm hover:bg-amber-500"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}