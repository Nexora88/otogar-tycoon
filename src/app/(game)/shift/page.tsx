"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCareerStore, RANK_LABEL, MEMLEKET_HITAP } from "@/store/careerStore";
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

  /* —— Henüz başlamadı —— */
  if (!c.careerStarted) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center p-6">
        <div className="text-[10px] font-bold tracking-[0.3em] text-amber-500">
          ÇIRAKLIK
        </div>
        <h1 className="mt-2 text-2xl font-black text-stone-100">Perona yazıl</h1>
        <p className="mt-2 text-sm text-zinc-500">
          Çay, ayak işi, patron. Sefer sonra.
        </p>

        <label className="mt-6 text-[11px] text-zinc-500">Ad</label>
        <input
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Örn. Eymen"
          maxLength={24}
        />

        <label className="mt-3 text-[11px] text-zinc-500">Memleket</label>
        <select
          className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm"
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
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3.5 text-sm font-black text-stone-950"
        >
          Vardiyaya başla
        </button>

        <p className="mt-4 text-center text-[11px] text-zinc-600">
          Hikâye açılışından geldiysen zaten kayıtlısın — panelden dene.
        </p>
      </div>
    );
  }

  /* —— Bağımsız —— */
  if (c.careerDone) {
    return (
      <div className="mx-auto max-w-sm p-8 text-center">
        <div className="text-[10px] font-bold tracking-[0.25em] text-emerald-500">
          BAĞIMSIZ
        </div>
        <h1 className="mt-2 text-xl font-black text-emerald-300">
          Esnaf oldun
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Birikim {c.savings.toLocaleString("tr-TR")} ₺
        </p>
        <Link
          href="/setup"
          className="mt-6 inline-block w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-black"
        >
          Terminal kur
        </Link>
        <Link href="/dashboard" className="mt-3 block text-xs text-zinc-500">
          Panel
        </Link>
      </div>
    );
  }

  const fatiguePct = Math.round(c.fatigue);

  return (
    <div className="mx-auto max-w-md p-4 pb-28 sm:p-6">
      {/* Üst şerit — kısa */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-bold tracking-[0.2em] text-amber-500">
            VARDİYA · {String(gameHour).padStart(2, "0")}:00
          </div>
          <h1 className="truncate text-lg font-black text-stone-100">
            {c.displayHitap || c.playerName}
          </h1>
          <p className="truncate text-[11px] text-zinc-500">
            {c.companyName} · {RANK_LABEL[c.rank]}
          </p>
        </div>
        <button
          type="button"
          onClick={() => c.rollShiftTasks()}
          className="shrink-0 rounded-lg border border-amber-800/50 bg-amber-950/30 px-3 py-2 text-[11px] font-semibold text-amber-200"
        >
          Yeni işler
        </button>
      </div>

      {/* 3 sayı — metin yok */}
      <div className="mb-4 grid grid-cols-4 gap-1.5 text-center">
        <Stat label="Güven" value={String(c.trust)} tone="cyan" />
        <Stat label="Ün" value={String(c.fame)} tone="amber" />
        <Stat label="₺" value={String(c.savings)} tone="emerald" />
        <Stat label="Yorgun" value={`%${fatiguePct}`} tone="zinc" />
      </div>

      {/* Patron / teklif / drama — kompakt */}
      {c.drama && (
        <div className="mb-3 rounded-2xl border border-red-800 bg-red-950/50 p-3">
          <div className="text-[10px] font-bold text-red-400">ANİ OLAY</div>
          <div className="mt-1 text-sm font-semibold">{c.drama.title}</div>
          <p className="mt-1 line-clamp-3 text-xs text-zinc-400">{c.drama.body}</p>
          <div className="mt-3 flex flex-col gap-1.5">
            {c.drama.choices.map((ch) => (
              <button
                key={ch.id}
                type="button"
                onClick={() => c.resolveDrama(ch.id)}
                className="rounded-lg border border-red-900/70 bg-zinc-950 px-3 py-2.5 text-left text-sm hover:border-red-500"
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {c.patronCalling && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-600/60 bg-amber-950/40 p-3">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-bold text-amber-400">PATRON</div>
            <div className="truncate text-sm">{c.patronName} çağırıyor</div>
          </div>
          <button
            type="button"
            onClick={() => c.answerPatronCall()}
            className="rounded-lg bg-amber-500 px-3 py-2 text-xs font-bold text-black"
          >
            Git
          </button>
          <button
            type="button"
            onClick={() => c.ignorePatronCall()}
            className="rounded-lg border border-zinc-600 px-2 py-2 text-[10px] text-zinc-400"
          >
            Yok
          </button>
        </div>
      )}

      {c.jobOffer && (
        <div className="mb-3 rounded-xl border border-cyan-800/60 bg-zinc-900 p-3">
          <div className="text-[10px] font-bold text-cyan-400">İŞ TEKLİFİ</div>
          <div className="text-sm font-semibold">{c.jobOffer.company}</div>
          <p className="mt-1 line-clamp-2 text-xs text-zinc-500">{c.jobOffer.body}</p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => c.acceptJobOffer()}
              className="flex-1 rounded-lg bg-cyan-600 py-2 text-xs font-bold"
            >
              Kabul
            </button>
            <button
              type="button"
              onClick={() => c.refuseJobOffer()}
              className="rounded-lg border border-zinc-600 px-3 py-2 text-xs"
            >
              Red
            </button>
          </div>
        </div>
      )}

      {c.mafiaWhisper && (
        <button
          type="button"
          onClick={() => c.clearOutcome()}
          className="mb-3 w-full rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-left text-[11px] text-red-200/90"
        >
          📰 {c.mafiaWhisper}
        </button>
      )}

      {c.lastOutcome && !c.drama && (
        <button
          type="button"
          onClick={() => c.clearOutcome()}
          className="mb-3 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-left text-sm text-zinc-300"
        >
          {c.lastOutcome}
          <span className="mt-1 block text-[10px] text-zinc-600">dokun · kapat</span>
        </button>
      )}

      {/* Aktif görev — tek diyalog */}
      {!c.drama && c.activeTask ? (
        <div className="mb-4 rounded-2xl border border-amber-800/50 bg-zinc-900 p-4">
          <div className="text-[10px] font-bold tracking-wider text-amber-500">
            {c.activeTask.speakerName}
          </div>
          <p className="mt-2 text-sm leading-snug text-stone-200">
            “{shorten(c.activeTask.prompt, 140)}”
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {c.activeTask.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => c.resolveOption(o)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-3 text-left text-sm font-medium hover:border-amber-600"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : !c.drama ? (
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold tracking-[0.2em] text-zinc-500">
              İŞLER
            </h2>
            <button
              type="button"
              onClick={() => c.rest?.()}
              className="text-[10px] text-zinc-500 hover:text-zinc-300"
            >
              Dinlen
            </button>
          </div>
          {c.tasks.length === 0 && (
            <button
              type="button"
              onClick={() => c.rollShiftTasks()}
              className="w-full rounded-xl border border-dashed border-zinc-700 py-8 text-sm text-zinc-500"
            >
              İş yok · Yeni işler
            </button>
          )}
          {c.tasks.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => c.openTask(t.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-left hover:border-amber-800/50"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-950/40 text-xs font-bold text-amber-400">
                {(t.kind || "iş").slice(0, 2).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] text-zinc-500">
                  {t.speakerName}
                </span>
                <span className="block truncate text-sm text-zinc-200">
                  {shorten(t.prompt, 72)}
                </span>
              </span>
              <span className="text-amber-600">→</span>
            </button>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            if (confirm("İstifa edip kendi işine bakmak istiyor musun?"))
              c.resign();
          }}
          className="rounded-lg border border-red-900/60 px-3 py-2 text-[11px] text-red-400"
        >
          İstifa
        </button>
        <Link
          href="/story"
          className="rounded-lg border border-zinc-800 px-3 py-2 text-[11px] text-zinc-500"
        >
          Hikâye
        </Link>
      </div>

      {c.log.length > 0 && (
        <details className="mt-6 text-[11px] text-zinc-600">
          <summary className="cursor-pointer text-zinc-500">Log</summary>
          <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto">
            {c.log.slice(0, 12).map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function shorten(s: string, n: number) {
  const t = (s || "").trim();
  if (t.length <= n) return t;
  return t.slice(0, n - 1) + "…";
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "amber" | "emerald" | "zinc";
}) {
  const map = {
    cyan: "text-cyan-400 border-cyan-900/40",
    amber: "text-amber-400 border-amber-900/40",
    emerald: "text-emerald-400 border-emerald-900/40",
    zinc: "text-zinc-300 border-zinc-800",
  };
  return (
    <div className={`rounded-lg border bg-zinc-950/80 py-2 ${map[tone]}`}>
      <div className="text-[9px] uppercase tracking-wide text-zinc-600">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-bold tabular-nums">{value}</div>
    </div>
  );
}
