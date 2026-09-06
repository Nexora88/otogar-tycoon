"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCareerStore } from "@/store/careerStore";
import { RANK_LABEL, MEMLEKET_HITAP } from "@/data/apprenticeContent";
import { useGameStore } from "@/store/gameStore";

export default function ShiftPage() {
  const gameHour = useGameStore((s) => s.gameHour);
  const c = useCareerStore();
  const [name, setName] = useState("");
  const [mem, setMem] = useState(MEMLEKET_HITAP[0] || "Keşanlı");

  useEffect(() => {
    if (!c.careerStarted) return;
    c.syncShiftFromClock();
  }, [gameHour, c.careerStarted]);

  if (!c.careerStarted) {
    return (
      <div className="p-4 sm:p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Perona yazıl</h1>
        <p className="text-sm text-zinc-500 mb-6">
          Adın ve memleketin hitap olur. Firma ve patron rastgele.
        </p>
        <label className="text-xs text-zinc-500">Ad</label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ahmet"
        />
        <label className="text-xs text-zinc-500">Memleket hitabı</label>
        <select
          className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={mem}
          onChange={(e) => setMem(e.target.value)}
        >
          {MEMLEKET_HITAP.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => c.startCareer(name, mem)}
          className="w-full py-3 rounded-xl font-bold text-sm text-black bg-amber-500"
        >
          Vardiyaya başla
        </button>
        <Link href="/dashboard" className="block text-center text-xs text-zinc-500 mt-4">
          Panele dön
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto pb-24">
      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div>
          <h1 className="text-xl font-bold">{c.displayHitap}</h1>
          <p className="text-xs text-zinc-500">
            {c.companyName} · {c.workCity} · {RANK_LABEL[c.rank]}
          </p>
          <p className="text-xs text-amber-500/90 mt-1">
            {c.shiftLabelText} · {String(gameHour).padStart(2, "0")}:00
          </p>
        </div>
        <button
          type="button"
          onClick={() => c.rollShiftTasks()}
          className="text-xs px-3 py-1.5 rounded-lg border border-zinc-600"
        >
          Vardiyayı yenile
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 text-center text-xs">
        <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800">
          <div className="text-zinc-500">Güven</div>
          <div className="text-lg font-bold text-cyan-400">{c.trust}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800">
          <div className="text-zinc-500">Tanınırlık</div>
          <div className="text-lg font-bold text-amber-400">{c.fame}</div>
        </div>
        <div className="bg-zinc-900 rounded-lg p-2 border border-zinc-800">
          <div className="text-zinc-500">Birikim</div>
          <div className="text-lg font-bold text-emerald-400">
            {c.savings} ₺
          </div>
        </div>
      </div>

      {c.patronCalling && (
        <div className="mb-4 p-4 rounded-xl border-2 border-amber-600 bg-amber-950/40">
          <div className="text-xs font-bold text-amber-400 tracking-widest">
            PATRON ÇAĞIRDI
          </div>
          <p className="text-sm mt-1">{c.patronName} yazıhanede bekliyor.</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => c.answerPatronCall()}
              className="flex-1 py-2 rounded-lg bg-amber-500 text-black text-sm font-semibold"
            >
              Yanına git
            </button>
            <button
              type="button"
              onClick={() => c.ignorePatronCall()}
              className="px-3 py-2 rounded-lg border border-zinc-600 text-xs"
            >
              Yok say
            </button>
          </div>
        </div>
      )}

      {c.jobOffer && (
        <div className="mb-4 p-4 rounded-xl border border-cyan-800 bg-zinc-900">
          <div className="text-xs text-cyan-400 font-bold">İŞ TEKLİFİ</div>
          <div className="font-semibold mt-1">{c.jobOffer.company}</div>
          <p className="text-sm text-zinc-400 mt-1">{c.jobOffer.body}</p>
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={() => c.acceptJobOffer()}
              className="flex-1 py-2 rounded-lg bg-cyan-600 text-sm font-semibold"
            >
              Kabul
            </button>
            <button
              type="button"
              onClick={() => c.refuseJobOffer()}
              className="px-3 py-2 text-xs border border-zinc-600 rounded-lg"
            >
              Red
            </button>
          </div>
        </div>
      )}

      {c.mafiaWhisper && (
        <div className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-900 text-xs text-red-200">
          📰 {c.mafiaWhisper}
          <button
            type="button"
            className="block mt-1 text-zinc-500"
            onClick={() => c.clearOutcome()}
          >
            kapat
          </button>
        </div>
      )}

      {c.lastOutcome && (
        <div className="mb-4 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-sm">
          {c.lastOutcome}
          <button
            type="button"
            onClick={() => c.clearOutcome()}
            className="block mt-2 text-xs text-zinc-500"
          >
            Tamam
          </button>
        </div>
      )}

      {c.activeTask ? (
        <div className="bg-zinc-900 border border-amber-900/40 rounded-2xl p-5 mb-4">
          <div className="text-[10px] tracking-widest text-amber-500 font-bold">
            {c.activeTask.from.toUpperCase()} · {c.activeTask.speakerName}
          </div>
          <p className="text-sm mt-2 leading-relaxed">
            “{c.activeTask.prompt}”
          </p>
          <div className="mt-4 flex flex-col gap-2">
            {c.activeTask.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => c.resolveOption(o)}
                className="w-full text-left px-3 py-2.5 rounded-lg border border-zinc-700 text-sm hover:border-amber-600"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          <h2 className="text-xs font-bold text-zinc-500 tracking-widest">
            GÖREVLER
          </h2>
          {c.tasks.length === 0 && (
            <p className="text-xs text-zinc-600">
              Liste boş. Vardiyayı yenile veya saat ilerlesin.
            </p>
          )}
          {c.tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => c.openTask(t.id)}
              className="w-full text-left p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-600"
            >
              <div className="text-[10px] text-zinc-500">
                {t.speakerName} · {t.kind}
              </div>
              <div className="text-sm mt-0.5 line-clamp-2">{t.prompt}</div>
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <Link href="/dashboard" className="px-3 py-2 border border-zinc-700 rounded-lg">
          Panel
        </Link>
        <button
          type="button"
          onClick={() => {
            if (confirm("İstifa? Peron unutmaz.")) c.resign();
          }}
          className="px-3 py-2 border border-red-900 text-red-400 rounded-lg"
        >
          İstifa
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xs font-bold text-zinc-500 mb-2">LOG</h2>
        <ul className="text-[11px] text-zinc-500 space-y-1 max-h-40 overflow-y-auto">
          {c.log.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      </div>

      {c.careerDone && (
        <div className="mt-4 p-4 rounded-xl border border-emerald-800 bg-emerald-950/30 text-sm">
          Kariyer aşaması bitti. Kendi firmana geçebilirsin (setup / panel).
          <Link href="/setup" className="block mt-2 text-amber-400 underline">
            Terminal kur
          </Link>
        </div>
      )}
    </div>
  );
}