"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [stats, setStats] = useState({ rooms: 4, trips: 56 });

  useEffect(() => {
    const t = setInterval(() => {
      setStats({
        rooms: 2 + Math.floor(Math.random() * 9),
        trips: 28 + Math.floor(Math.random() * 100),
      });
    }, 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen text-stone-100 bg-[#1a1008]">
      {/* Gökyüzü / afiş zemini */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#3d1f0f] via-[#2a1810] to-[#1a1008]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#f59e0b33,transparent_45%),radial-gradient(circle_at_80%_10%,#ef444433,transparent_40%),radial-gradient(circle_at_50%_80%,#0ea5e933,transparent_40%)]" />
        {/* Nostaljik çizgi tarama */}
        <div className="absolute inset-0 opacity-[0.06] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_2px,#000_4px)]" />

        <header className="relative z-10 flex flex-wrap items-center justify-between gap-2 px-4 py-4 max-w-5xl mx-auto">
          <span className="text-[11px] tracking-[0.3em] text-amber-400/90 font-bold">
            NEXORA · 1987
          </span>
          <div className="flex gap-2 text-xs">
            <Link
              href="/login"
              className="px-3 py-1.5 rounded-lg text-amber-100/80 hover:bg-white/5"
            >
              Giriş
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-200"
            >
              Hesap
            </Link>
          </div>
        </header>

        <div className="relative z-10 max-w-3xl mx-auto px-4 pt-10 pb-16 text-center">
          <p className="text-sm font-bold tracking-[0.25em] text-orange-400 drop-shadow">
            PERON SAVAŞLARI
          </p>

          {/* Renkli logo yazısı */}
          <h1 className="mt-3 text-5xl sm:text-6xl font-black leading-none select-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-[0_2px_0_#7c2d12]">
              Otogar
            </span>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 drop-shadow-[0_2px_0_#1e3a8a]">
              Tycoon
            </span>
          </h1>

          <p className="mt-2 text-amber-200/70 text-sm tracking-wide">
            Çırak → Muavin → Kaptan → Terminal Ağası
          </p>

          <p className="mt-6 text-stone-300/90 text-base sm:text-lg leading-relaxed max-w-lg mx-auto">
            1987 Türkiye’sinde otobüs firması yönet. İkram, itibar, gazete,
            kapı, lobi.{" "}
            <span className="text-amber-200">Gerçek para yok</span> — peron
            savaşı var.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/play"
              className="px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 shadow-lg shadow-orange-900/40 hover:from-amber-300 hover:to-orange-400 transition"
            >
              Misafir oyna
            </Link>
            <Link
              href="/how-to-play"
              className="px-8 py-3.5 rounded-xl font-semibold text-sm border-2 border-cyan-500/50 text-cyan-200 bg-cyan-950/30 hover:bg-cyan-900/40 transition"
            >
              Nasıl oynanır?
            </Link>
          </div>

          <div className="mt-8 inline-flex flex-wrap justify-center gap-3 rounded-full bg-black/30 border border-amber-900/40 px-4 py-2 text-[11px] text-amber-200/70">
            <span className="text-emerald-400">●</span> ~{stats.rooms} açık oda
            <span className="text-stone-600">|</span>
            Sefer nabzı ~{stats.trips}
            <span className="text-stone-600">|</span>
            1 gün ≈ birkaç dk
          </div>
        </div>
      </div>

      {/* Renkli özellik şeridi */}
      <div className="max-w-5xl mx-auto px-4 -mt-4 relative z-20 grid sm:grid-cols-3 gap-3 pb-12">
        <Feature
          color="from-orange-600/30 to-amber-900/20 border-orange-700/40"
          title="Yazıhane"
          body="Sefer kur, şoför ata, fiş ve defter. Ağa gibi otur."
        />
        <Feature
          color="from-cyan-600/25 to-blue-900/20 border-cyan-700/40"
          title="Peron savaşı"
          body="Fiyat kır, lobi kur, açık odada sıralama kap."
        />
        <Feature
          color="from-red-600/25 to-rose-900/20 border-red-800/40"
          title="Kapı & gazete"
          body="Aidat, racon, sabah baskısı. İtibar her şey."
        />
      </div>

      <div className="border-t border-amber-950/80 bg-[#120c08] px-4 py-10">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-amber-300 font-bold text-lg">Dört adım</h2>
          <ol className="mt-4 text-left text-sm text-stone-400 space-y-2">
            <li>
              <span className="text-orange-400 font-bold">1.</span> Misafir veya
              hesap — şehir seç.
            </li>
            <li>
              <span className="text-orange-400 font-bold">2.</span> Vardiyada
              çırak işleri; rütbe açıldıkça sefer.
            </li>
            <li>
              <span className="text-orange-400 font-bold">3.</span> İkram / fiyat
              dengesi, kadro, borç.
            </li>
            <li>
              <span className="text-orange-400 font-bold">4.</span> Lobi & etkinlik
              — arkadaşını çağır.
            </li>
          </ol>
          <Link
            href="/how-to-play"
            className="inline-block mt-6 text-cyan-400 text-sm hover:underline"
          >
            Tam rehber →
          </Link>
        </div>
      </div>

      <footer className="px-4 py-8 text-center text-[11px] text-stone-600 space-y-2">
        <p>
          <span className="text-amber-700/90">Ahmet Eymen Bakraç</span> · Nexora
          Labs
        </p>
        <p>Simülasyon · Gerçek para / kumar yok · Küfürsüz topluluk</p>
        <div className="flex justify-center gap-4 pt-1">
          <Link href="/about" className="hover:text-stone-400">
            Hakkında
          </Link>
          <Link href="/legal" className="hover:text-stone-400">
            Yasal
          </Link>
          <Link href="/register" className="hover:text-stone-400">
            Kayıt
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-lg ${color}`}
    >
      <h3 className="font-bold text-amber-50">{title}</h3>
      <p className="text-sm text-stone-300/80 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}