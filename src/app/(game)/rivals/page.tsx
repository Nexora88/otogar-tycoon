"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function RivalsPage() {
  const balance = useGameStore((s) => s.balance);
  const gameDay = useGameStore((s) => s.gameDay);
  const companyName = useGameStore((s) => s.companyName);
  const rivalsRaw = useGameStore((s) => s.rivals);

  const rivals = useMemo(
    () => [...(rivalsRaw || [])].sort((a, b) => b.cash - a.cash),
    [rivalsRaw]
  );

  const youRank = useMemo(() => {
    const richer = rivals.filter((r) => r.active && r.cash > balance).length;
    return richer + 1;
  }, [rivals, balance]);

  return (
    <div className="mx-auto max-w-6xl p-4 pb-28 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-[0.25em] text-cyan-400">
            OTOGAR PİYASASI
          </div>
          <h1 className="mt-1 text-3xl font-black text-stone-100">
            Rakipler uyumuyor.
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
            Sen sefer kurarken onlar da fiyat oynuyor, filo büyütüyor veya
            batıyor. Bu ekran pazarın nabzı — canlı lobi ile birlikte oku.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 px-4 py-3 text-right">
          <div className="text-[10px] text-amber-600">Sen · {companyName}</div>
          <div className="font-mono text-sm text-emerald-400">
            {formatMoney(balance)}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Gün {gameDay} · sıra #{youRank}
          </div>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <Hint
          title="Ucuz bilet"
          body="Rakip endeksi düşükse aynı hatta fiyat kırma baskısı artar."
        />
        <Hint
          title="Filo"
          body="Çok araç = daha sık sefer. Senin boş otobüsün fırsattır."
        />
        <Hint
          title="Lobi"
          body="Gerçek oyuncularla oda kur; burada simüle rakipler var."
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {rivals.map((r, i) => (
          <article
            key={r.id}
            className={`rounded-2xl border bg-zinc-950 p-5 ${
              r.active
                ? "border-zinc-800 hover:border-cyan-900/50"
                : "border-red-900/50 opacity-60"
            }`}
          >
            <div className="flex justify-between gap-3">
              <div>
                <div className="text-[10px] text-zinc-600">
                  #{i + 1} · {r.style}
                </div>
                <h2 className="mt-1 text-lg font-bold">{r.name}</h2>
              </div>
              <div
                className={
                  r.active ? "text-xs text-emerald-400" : "text-xs text-red-400"
                }
              >
                {r.active ? "FAAL" : "İFLAS"}
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
              <Metric label="Kasa" value={formatMoney(r.cash)} />
              <Metric label="Filo" value={String(r.fleet)} />
              <Metric label="İtibar" value={String(r.reputation)} />
            </div>
            <div className="mt-4 text-xs">
              <span className="text-zinc-600">Bilet endeksi </span>
              <span className="font-mono text-amber-300">
                {Number(r.ticketIndex).toFixed(2)}×
              </span>
              {r.ticketIndex < 0.95 && (
                <span className="ml-2 text-red-400/90">fiyat kırıyor</span>
              )}
            </div>
            <div className="mt-4">
              <div className="mb-1 text-[10px] text-zinc-600">Hat ağı</div>
              <div className="flex flex-wrap gap-1">
                {(r.routes || []).map((x: string) => (
                  <span
                    key={x}
                    className="rounded-full border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {rivals.length === 0 && (
        <p className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center text-sm text-zinc-500">
          Rakip listesi henüz dolmadı. Oyun günü ilerledikçe piyasa ısınır.
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-amber-900/40 bg-amber-950/10 p-5 text-sm text-zinc-400">
        <b className="text-amber-200">Ne yapmalısın?</b>
        <p className="mt-2 leading-relaxed">
          Endeksi düşük rakiplerin hatlarında biletini biraz indir veya ikramı
          yükselt. Sen #1 değilsen Seferler’den agresif dolum dene; lobiye de
          bak.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs">
        <Link href="/expeditions" className="text-amber-400 underline">
          Sefer kur
        </Link>
        <Link href="/lobby" className="text-cyan-400 underline">
          Canlı lobi
        </Link>
        <Link href="/dashboard" className="text-zinc-500 underline">
          Panel
        </Link>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2">
      <div className="text-zinc-600">{label}</div>
      <div className="mt-0.5 text-zinc-200">{value}</div>
    </div>
  );
}

function Hint({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3">
      <div className="text-xs font-semibold text-cyan-200/90">{title}</div>
      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">{body}</p>
    </div>
  );
}
