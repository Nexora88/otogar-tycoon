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
    <div className="min-h-screen bg-[#0a0908] text-stone-100 antialiased">
      {showSplash && <SplashScreen onDone={onSplashDone} />}

      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#f59e0b33,transparent)]" />
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_85%_15%,#22d3ee28,transparent_42%)]" />
        <div className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,#000_3px,#000_4px)]" />
      </div>

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-900/50" />
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

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-22 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-100/90 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Peron Savaşları · Erken erişim
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.92]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-red-500">
                Otogar
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-500">
                Tycoon
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-400 leading-relaxed max-w-xl">
              1987 Türkiye’si. Yazıhane, emektar otobüs, peron kapışması.
              Çıraklıktan terminal ağalığına —{" "}
              <span className="text-stone-200">gerçek para yok</span>, racon var.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/play"
                className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-stone-950 bg-gradient-to-r from-amber-300 via-orange-400 to-orange-500 shadow-[0_0_48px_-8px_rgba(249,115,22,0.55)] hover:brightness-105 transition"
              >
                Hemen oyna
                <span className="ml-2 opacity-70 group-hover:translate-x-0.5 transition">
                  →
                </span>
              </Link>
              <Link
                href="/how-to-play"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold border border-stone-600 text-stone-200 hover:border-cyan-500/40 hover:bg-cyan-950/25 transition"
              >
                Nasıl oynanır
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-8 sm:gap-12">
              <Stat label="Açık oda" value={`~${live.rooms}`} />
              <Stat label="Sefer nabzı" value={`~${live.trips}`} />
              <Stat label="Peron" value={`~${live.online}`} />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid md:grid-cols-3 gap-4">
          <Card
            n="01"
            title="Yönet"
            body="Sefer, ikram, kadro, borç. Ofisten ağa gibi yönet."
            c="text-amber-500/80 border-amber-500/20"
          />
          <Card
            n="02"
            title="Kapış"
            body="Fiyat savaşı, lobi kodu, açık odada nabız."
            c="text-cyan-500/80 border-cyan-500/20"
          />
          <Card
            n="03"
            title="Hisset"
            body="Gazete, kapı, 1987 yazıhanesi. Yurtta sulh."
            c="text-rose-500/80 border-rose-500/20"
          />
        </section>

        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold">Bir günün hikâyesi</h2>
              <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                Sabah baskısı, sefer dolumu, kapı, akşam defter. Gün hızlı akar;
                kararlar kalır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Çırak", "Sefer", "Kadro", "Terminal", "Lobi"].map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5 text-stone-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row justify-between gap-4 text-[12px] text-stone-600">
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
}: {
  n: string;
  title: string;
  body: string;
  c: string;
}) {
  return (
    <div
      className={`rounded-2xl border bg-gradient-to-b from-white/[0.04] to-transparent p-6 ${c}`}
    >
      <div className="text-xs font-mono opacity-90">{n}</div>
      <h3 className="mt-2 text-lg font-bold text-stone-100">{title}</h3>
      <p className="mt-2 text-sm text-stone-500 leading-relaxed">{body}</p>
    </div>
  );
}