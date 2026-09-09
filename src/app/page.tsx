"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";

export default function LandingPage() {
  const [showSplash, setShowSplash] = useState(true);
  const [live, setLive] = useState({ rooms: 5, trips: 72, online: 18 });

  useEffect(() => {
    try {
      if (sessionStorage.getItem("ot-splash-seen") === "1") {
        setShowSplash(false);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (showSplash) return;
    const t = setInterval(() => {
      setLive({
        rooms: 3 + Math.floor(Math.random() * 10),
        trips: 40 + Math.floor(Math.random() * 120),
        online: 12 + Math.floor(Math.random() * 40),
      });
    }, 6000);
    return () => clearInterval(t);
  }, [showSplash]);

  const onSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 antialiased overflow-x-hidden">
      {showSplash && <SplashScreen onDone={onSplashDone} />}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#f59e0b33,transparent)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_90%_20%,#22d3ee22,transparent_40%)]" />
      </div>

      {/* Sağda dev otobüs silüeti */}
      <div
        className="pointer-events-none fixed right-[-8%] bottom-[8%] z-0 opacity-[0.12] hidden sm:block"
        aria-hidden
      >
        <BusSilhouette className="w-[min(52vw,520px)] h-auto text-amber-200" />
      </div>

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-900/40" />
            <div>
              <div className="text-[10px] tracking-[0.35em] text-amber-500 font-semibold">
                NEXORA
              </div>
              <div className="text-[11px] text-stone-500 -mt-0.5">
                Interactive · 1987
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            <Link
              href="/how-to-play"
              className="hidden sm:inline px-3 py-2 text-stone-400 hover:text-stone-200"
            >
              Rehber
            </Link>
            <Link
              href="/about"
              className="hidden sm:inline px-3 py-2 text-stone-400 hover:text-stone-200"
            >
              Hakkında
            </Link>
            <Link href="/login" className="px-3 py-2 text-stone-300 hover:text-white">
              Giriş
            </Link>
            <Link
              href="/register"
              className="ml-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
            >
              Hesap
            </Link>
          </nav>
        </header>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-100/90 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Otobüs firması simülasyonu · 1987
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.92]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-red-500">
                Otogar
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-500">
                Tycoon
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-stone-400 leading-relaxed">
              Esenler’den AŞTİ’ye, Keşan’dan İzmir’e.{" "}
              <span className="text-amber-200/90">Bilet, ikram, şoför, peron</span>
              — bir otobüs şirketi kur, fiyat savaşında ayakta kal.{" "}
              <span className="text-stone-200">Gerçek para yok</span>, racon var.
            </p>

            {/* Mini hat şeridi — oyun dilini anlatır */}
            <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
              {[
                "İstanbul → Ankara",
                "Keşan → Edirne",
                "O302 emektar",
                "Hakiki Peron gazetesi",
              ].map((t) => (
                <span
                  key={t}
                  className="px-2.5 py-1 rounded-lg border border-amber-900/40 bg-amber-950/30 text-amber-200/70"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                href="/play"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-stone-950 bg-gradient-to-r from-amber-300 via-orange-400 to-orange-500 shadow-[0_0_40px_-8px_rgba(249,115,22,0.5)] hover:brightness-105 transition"
              >
                Hemen oyna
                <span className="ml-2 opacity-70 group-hover:translate-x-0.5 transition">
                  →
                </span>
              </Link>
              <Link
                href="/how-to-play"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold border border-stone-600 text-stone-200 hover:border-cyan-500/40 transition"
              >
                Nasıl oynanır
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8">
              <Stat label="Açık oda" value={`~${live.rooms}`} />
              <Stat label="Sefer nabzı" value={`~${live.trips}`} />
              <Stat label="Peron" value={`~${live.online}`} />
            </div>
          </div>

          {/* Mobil otobüs */}
          <div className="sm:hidden mt-10 opacity-25 flex justify-center">
            <BusSilhouette className="w-64 text-amber-200" />
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 grid md:grid-cols-3 gap-4">
          <Card
            n="01"
            title="Sefer kur"
            body="Hat seç, bilet fiyatı ve ikramı ayarla. Otobüs perondan kalksın."
            c="border-amber-500/20"
            nClass="text-amber-500/80"
          />
          <Card
            n="02"
            title="Yazıhane yönet"
            body="Şoför, borç, gazete, kapı. Ofisten ağa gibi karar ver."
            c="border-cyan-500/20"
            nClass="text-cyan-500/80"
          />
          <Card
            n="03"
            title="Peron kapış"
            body="Rakip fiyat kırar. Lobi ve açık odada nabız tut."
            c="border-rose-500/20"
            nClass="text-rose-500/80"
          />
        </section>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-[12px] text-stone-600 border-t border-white/5">
          <div>
            <span className="text-stone-400">Ahmet Eymen Bakraç</span> · Nexora
            Labs
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/legal" className="hover:text-stone-400">
              Yasal
            </Link>
            <Link href="/about" className="hover:text-stone-400">
              Hakkında
            </Link>
            <span>Simülasyon · Gerçek para yok</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function BusSilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 140"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gövde */}
      <path d="M20 90 V45 c0-8 6-14 14-14 h280 c20 0 40 12 48 28 l20 36 v10 H20 z" />
      {/* Ön */}
      <path d="M362 95 h18 c6 0 10 4 10 10 v5 h-40 v-8 c0-4 3-7 7-7 z" opacity="0.9" />
      {/* Camlar */}
      <rect x="40" y="42" width="36" height="22" rx="3" className="fill-black/40" />
      <rect x="84" y="42" width="36" height="22" rx="3" className="fill-black/40" />
      <rect x="128" y="42" width="36" height="22" rx="3" className="fill-black/40" />
      <rect x="172" y="42" width="36" height="22" rx="3" className="fill-black/40" />
      <rect x="216" y="42" width="36" height="22" rx="3" className="fill-black/40" />
      <rect x="260" y="42" width="36" height="22" rx="3" className="fill-black/40" />
      <rect x="310" y="42" width="42" height="26" rx="4" className="fill-black/35" />
      {/* Far */}
      <circle cx="365" cy="78" r="6" className="fill-amber-300/80" />
      {/* Teker */}
      <circle cx="70" cy="105" r="18" />
      <circle cx="70" cy="105" r="8" className="fill-black/50" />
      <circle cx="300" cy="105" r="18" />
      <circle cx="300" cy="105" r="8" className="fill-black/50" />
      {/* Şerit çizgi */}
      <rect x="30" y="72" width="300" height="4" opacity="0.35" />
    </svg>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold tabular-nums">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-stone-600 mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Card({
  n,
  title,
  body,
  c,
  nClass,
}: {
  n: string;
  title: string;
  body: string;
  c: string;
  nClass: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-b from-white/[0.04] to-transparent p-6 ${c}`}
    >
      <div className={`text-xs font-mono ${nClass}`}>{n}</div>
      <h3 className="mt-2 text-lg font-bold text-stone-100">{title}</h3>
      <p className="mt-2 text-sm text-stone-500 leading-relaxed">{body}</p>
    </div>
  );
}