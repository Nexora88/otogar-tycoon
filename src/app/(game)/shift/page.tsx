"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCareerStore } from "@/store/careerStore";
import { RANK_LABEL, MEMLEKET_HITAP, rankNeed } from "@/store/careerStore";
// rankNeed careerStore'da export; yoksa apprenticeContent'ten
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
        <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
          Çırakken <strong className="text-zinc-300">sefer düzenleyemezsin</strong>.
          Yardım et, olaylara karış, birik, sonra kendi terminalin.
        </p>
        <label className="text-xs text-zinc-500">Ad</label>
        <input
          className="w-full mb-3 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ahmet"
        />
        <label className="text-xs text-zinc-500">Memleket</label>
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
      </div>
    );
  }

  if (c.careerDone) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h1 className="text-xl font-bold text-emerald-400">Bağımsız esnaf</h1>
        <p className="text-sm text-zinc-400 mt-3">
          Peron seni tanıdı. Birikim: {c.savings} ₺ — kasaya aktarılacak.
        </p>
        <Link
          href="/setup"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm"
        >
          Kendi terminalini kur
        </Link>
        <Link href="/dashboard" className="block mt-3 text-xs text-zinc-500">
          Panel
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-lg mx-auto pb-24">
      <div className="mb-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-500 leading-relaxed">
        <strong className="text-amber-500/90">Çırak modu:</strong> Sefer / garaj /
        pazar kilitli. Görev + ani olay (kavga, kapı, yolcu). Hedef: rütbe veya
        ~12.000 ₺ birikim → istifa / bağımsız → terminal.
      </div>

      <div className="flex flex-wrap justify-between gap-2 mb-4">
        <div>
          <h1 className="text-xl font-bold">{c.displayHitap}</h1>
          <p className="text-xs text-zinc-500">
            {c.companyName} · {c.workCity} · {RANK_LABEL[c.rank]}
          </p>
          <p className="text-xs text-amber-500/90 mt-1">
            {c.shiftLabelText} · {String(gameHour).padStart(2, "0")}:00 · yorgun %
            {Math.round(c.fatigue)}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => c.rollShiftTasks()}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-600"
          >
            Vardiya yenile
          </button>
          <button
            type="button"
            onClick={() => c.rest?.()}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400"
          >
            Dinlen
          </button>
        </div>
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
          <div className="text-lg font-bold text-emerald-400">{c.savings} ₺</div>
        </div>
      </div>

      {/* ANİ OLAY */}
      {c.drama && (
        <div className="mb-4 p-4 rounded-2xl border-2 border-red-800 bg-red-950/40">
          <div className="text-[10px] font-bold text-red-400 tracking-widest">
            ANİ OLAY · {c.drama.kind.toUpperCase()}
          </div>
          <div className="font-bold text-sm mt-1">{c.drama.title}</div>
          <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
            {c.drama.body}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {c.drama.choices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => c.resolveDrama(ch.id)}
                className="text-left px-3 py-2.5 rounded-lg border border-red-900/60 bg-zinc-950 text-sm hover:border-red-500"
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {c.patronCalling && (
        <div className="mb-4 p-4 rounded-xl border-2 border-amber-600 bg-amber-950/40">
          <div className="text-xs font-bold text-amber-400">PATRON ÇAĞIRDI</div>
          <p className="text-sm mt-1">{c.patronName} yazıhanede.</p>
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
          <button type="button" className="block mt-1 text-zinc-500" onClick={() => c.clearOutcome()}>
            kapat
          </button>
        </div>
      )}

      {c.lastOutcome && !c.drama && (
        <div className="mb-4 p-4 rounded-xl bg-zinc-900 border border-zinc-700 text-sm">
          {c.lastOutcome}
          <button type="button" onClick={() => c.clearOutcome()} className="block mt-2 text-xs text-zinc-500">
            Tamam
          </button>
        </div>
      )}

      {!c.drama && c.activeTask ? (
        <div className="bg-zinc-900 border border-amber-900/40 rounded-2xl p-5 mb-4">
          <div className="text-[10px] tracking-widest text-amber-500 font-bold">
            {c.activeTask.from.toUpperCase()} · {c.activeTask.speakerName}
          </div>
          <p className="text-sm mt-2 leading-relaxed">“{c.activeTask.prompt}”</p>
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
      ) : !c.drama ? (
        <div className="space-y-2 mb-6">
          <h2 className="text-xs font-bold text-zinc-500 tracking-widest">GÖREVLER</h2>
          {c.tasks.length === 0 && (
            <p className="text-xs text-zinc-600">Liste boş — vardiyayı yenile.</p>
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
      ) : null}

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => {
            if (confirm("İstifa? (yeterli birikim/rütbe gerekir)")) c.resign();
          }}
          className="px-3 py-2 border border-red-900 text-red-400 rounded-lg"
        >
          İstifa / kendi işim
        </button>
      </div>

      <ul className="mt-6 text-[11px] text-zinc-500 space-y-1 max-h-32 overflow-y-auto">
        {c.log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}