"use client";

import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";
import { formatMoney } from "@/lib/utils";

export default function CapitalPage() {
  const balance = useGameStore((s) => s.balance);
  const patronBalance = useGameStore((s) => s.patronBalance);
  const valuation = useGameStore((s) => s.companyValuation);
  const reputation = useGameStore((s) => s.reputation);
  const buses = useGameStore((s) => s.buses);
  const companyRoutes = useGameStore((s) => s.companyRoutes);
  const routeMarket = useGameStore((s) => s.routeMarket);
  const listed = useGameStore((s) => s.listed);
  const founderShares = useGameStore((s) => s.founderShares);
  const publicShares = useGameStore((s) => s.publicShares);
  const stockPrice = useGameStore((s) => s.stockPrice);
  const companyProfit = useGameStore((s) => s.companyProfit);
  const refreshMarket = useGameStore((s) => s.refreshMarket);
  const payOwnerSalary = useGameStore((s) => s.payOwnerSalary);
  const prepareIPO = useGameStore((s) => s.prepareIPO);

  useEffect(() => {
    refreshMarket();
  }, [refreshMarket, buses.length, reputation, companyRoutes.length]);

  const routes = Object.entries(routeMarket);
  const avgShare = routes.length
    ? Math.round(routes.reduce((sum, [, r]) => sum + r.playerShare, 0) / routes.length)
    : 0;
  const canIpo =
    valuation >= 1_000_000 &&
    buses.length >= 5 &&
    reputation >= 60 &&
    routes.length >= 3;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      <div>
        <div className="text-[10px] tracking-[0.25em] text-emerald-400 font-bold">ŞİRKET EKONOMİSİ</div>
        <h1 className="text-3xl font-black mt-1">Sermaye Masası</h1>
        <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
          Otobüs artık sadece araç değil. Şirketin değeri, yolcu talebi, pazar payı ve sermayesi birlikte büyüyor.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Metric title="Şirket kasası" value={formatMoney(balance)} />
        <Metric title="Patron cüzdanı" value={formatMoney(patronBalance)} />
        <Metric title="Tahmini şirket değeri" value={formatMoney(valuation)} />
        <Metric title="Ortalama pazar payı" value={"%" + avgShare} />
      </div>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6">
        <div className="flex flex-wrap justify-between gap-3 items-center mb-4">
          <div>
            <h2 className="font-bold text-lg">Gerçek yolcu havuzu</h2>
            <p className="text-xs text-zinc-500">Aynı yolcu kitlesi artık seninle rakipler arasında bölünüyor.</p>
          </div>
          <button onClick={refreshMarket} className="px-3 py-2 rounded-lg bg-zinc-800 text-xs hover:bg-zinc-700">Piyasayı yenile</button>
        </div>
        {routes.length === 0 ? (
          <div className="text-sm text-zinc-600 py-8 text-center">İlk seferini aç. Pazar burada canlı oluşacak.</div>
        ) : (
          <div className="space-y-2">
            {routes.map(([route, data]) => (
              <div key={route} className="grid grid-cols-[1fr_auto] sm:grid-cols-[1.5fr_100px_90px_90px] gap-3 items-center border border-zinc-800 rounded-xl p-3">
                <div>
                  <div className="font-semibold text-sm">{route}</div>
                  <div className="text-[10px] text-zinc-600">{data.dailyPassengers} tahmini yolcu/gün · {data.unmet} karşılanmamış</div>
                </div>
                <div className="text-right text-xs text-emerald-300">Sen %{data.playerShare}</div>
                <div className="hidden sm:block text-right text-xs text-red-300">Rakip %{data.rivalShare}</div>
                <div className="hidden sm:block text-right text-xs text-zinc-500">Havuz</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5">
          <div className="text-xs text-zinc-500 uppercase tracking-wider">Patron / şirket ayrımı</div>
          <h2 className="font-bold text-xl mt-1">Para kimin?</h2>
          <p className="text-sm text-zinc-500 mt-2">Şirket kasası otobüs, personel, rota ve yatırımlar içindir. Patron parası ise maaş ve ileride temettü ile oluşur.</p>
          <button
            onClick={() => payOwnerSalary(5000)}
            disabled={balance < 5000}
            className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-sm disabled:opacity-40"
          >
            Patron maaşı al · 5.000 ₺
          </button>
          <div className="mt-3 text-xs text-zinc-600">Sefer gelirini doğrudan kişisel hesaba kaçırmak yok: muhasebe kaydı tutulur.</div>
        </div>

        <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/10 p-5">
          <div className="text-xs text-emerald-400 uppercase tracking-wider">Devrimsel kilit</div>
          <h2 className="font-bold text-xl mt-1">Halka Arz</h2>
          {listed ? (
            <div className="space-y-3 mt-3">
              <div className="text-sm">Şirket artık halka açık.</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <Metric title="Hisse" value={formatMoney(stockPrice)} />
                <Metric title="Kurucu" value={"%" + Math.round((founderShares / 1_000_000) * 100)} />
                <Metric title="Halka açık" value={publicShares.toLocaleString("tr-TR")} />
              </div>
              <div className="text-xs text-zinc-500">Bir sonraki katman: gerçek oyuncuların hissedar olması, temettü ve şirketler arası satın alma.</div>
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              <div className="text-sm text-zinc-300">Halka arz henüz açılmadı.</div>
              <div className="text-xs text-zinc-500">Gerekenler: 1M ₺ değerleme · 5 otobüs · 60 itibar · 3 hat.</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Requirement ok={valuation >= 1_000_000} label="Değerleme" value={formatMoney(valuation)} />
                <Requirement ok={buses.length >= 5} label="Filo" value={buses.length + " otobüs"} />
                <Requirement ok={reputation >= 60} label="İtibar" value={reputation.toString()} />
                <Requirement ok={routes.length >= 3} label="Hat" value={routes.length.toString()} />
              </div>
              <button onClick={() => prepareIPO()} disabled={!canIpo} className="w-full mt-2 py-2.5 rounded-xl bg-emerald-400 text-black font-bold disabled:opacity-30">
                {canIpo ? "Halka arzı başlat" : "Şartları tamamla"}
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="text-xs text-zinc-600 border-t border-zinc-900 pt-4">
        Şirket kârı: {formatMoney(companyProfit)} · Bu sistem ileride ortaklık, franchise, holding, temettü ve oyuncular arası sermaye piyasasının temelidir.
      </div>
    </div>
  );
}

function Metric({ title, value }: { title: string; value: string }) {
  return <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3"><div className="text-[10px] text-zinc-600">{title}</div><div className="font-bold mt-1">{value}</div></div>;
}

function Requirement({ ok, label, value }: { ok: boolean; label: string; value: string }) {
  return <div className={"rounded-lg p-2 border " + (ok ? "border-emerald-800 bg-emerald-950/20" : "border-zinc-800 bg-zinc-900")}><div className="text-zinc-600">{label}</div><div className={ok ? "text-emerald-300" : "text-zinc-400"}>{value}</div></div>;
}
