"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [live, setLive] = useState({ rooms: 5, trips: 72, online: 18 });

  useEffect(() => {
    const t = setInterval(() => {
      setLive({
        rooms: 3 + Math.floor(Math.random() * 10),
        trips: 40 + Math.floor(Math.random() * 120),
        online: 12 + Math.floor(Math.random() * 40),
      });
    }, 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 antialiased">
      {/* Film grain + ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a1208] via-[#0f0d0b] to-[#070605]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,#f59e0b33,transparent)]" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_90%_10%,#22d3ee22,transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.035] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <header className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-900/40" />
            <div>
              <div className="text-[10px] tracking-[0.35em] text-amber-500/90 font-semibold">
                NEXORA
              </div>
              <div className="text-xs text-stone-500 -mt-0.5">Interactive · 1987</div>
            </div>
          </div>
          <nav className="flex items-center gap-1 sm:gap-2 text-sm">
            <Link
              href="/how-to-play"
              className="hidden sm:inline px-3 py-2 text-stone-400 hover:text-stone-200 transition"
            >
              Rehber
            </Link>
            <Link
              href="/about"
              className="hidden sm:inline px-3 py-2 text-stone-400 hover:text-stone-200 transition"
            >
              Hakkında
            </Link>
            <Link
              href="/login"
              className="px-3 py-2 text-stone-300 hover:text-white transition"
            >
              Giriş
            </Link>
            <Link
              href="/register"
              className="ml-1 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-stone-100 hover:bg-white/10 transition text-sm"
            >
              Hesap oluştur
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] text-amber-200/90 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Peron Savaşları serisi · Erken erişim
            </div>

            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.95]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-400 to-red-500">
                Otogar
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-cyan-400 to-blue-500">
                Tycoon
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-stone-400 leading-relaxed max-w-xl">
              Türkiye 1987. Bir yazıhane, bir emektar otobüs, sonsuz peron
              kapışması. Çıraklıktan terminal ağalığına —{" "}
              <span className="text-stone-200">gerçek para yok</span>, racon var.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/play"
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-bold text-stone-950 bg-gradient-to-r from-amber-300 via-orange-400 to-orange-500 shadow-[0_0_40px_-8px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_-6px_rgba(249,115,22,0.65)] transition"
              >
                Hemen oyna
                <span className="ml-2 opacity-60 group-hover:translate-x-0.5 transition">
                  →
                </span>
              </Link>
              <Link
                href="/how-to-play"
                className="inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold border border-stone-600/80 text-stone-200 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition"
              >
                Nasıl oynanır
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-6 sm:gap-10 text-sm">
              <LiveStat label="Açık oda" value={`~${live.rooms}`} />
              <LiveStat label="Sefer nabzı" value={`~${live.trips}`} />
              <LiveStat label="Peron hareketi" value={`~${live.online}`} />
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 grid md:grid-cols-3 gap-4">
          <Pillar
            k="01"
            title="Yönet"
            body="Sefer, ikram, kadro, borç. Ofisten ağa gibi yönet; fiş düşünce deftere işlenir."
            accent="amber"
          />
          <Pillar
            k="02"
            title="Kapış"
            body="Aynı hatta fiyat savaşı. Lobi kur, kodunu paylaş, açık odada nabız tut."
            accent="cyan"
          />
          <Pillar
            k="03"
            title="Hisset"
            body="Hakiki Peron gazetesi, kapı, 1987 yazıhanesi. Yurtta sulh — hesap temiz."
            accent="rose"
          />
        </section>

        {/* Strip */}
        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-md">
              <h2 className="text-2xl font-bold text-stone-100">
                Bir günün hikâyesi
              </h2>
              <p className="mt-2 text-stone-500 text-sm leading-relaxed">
                Sabah baskısı, sefer dolumu, öğleden sonra kapı, akşam defter.
                Oyun günü gerçek zamandan hızlı — ama kararlar ağır.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Çırak vardiyası", "Sefer & ikram", "Kadro", "Terminal", "Lobi"].map(
                (t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-full text-xs border border-white/10 bg-white/5 text-stone-400"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row justify-between gap-4 text-[12px] text-stone-600">
          <div>
            <span className="text-stone-400">Ahmet Eymen Bakraç</span>
            {" · "}
            Nexora Labs · Otogar Tycoon
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

function LiveStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold tabular-nums text-stone-100">
        {value}
      </div>
      <div className="text-[11px] tracking-wide text-stone-600 uppercase mt-0.5">
        {label}
      </div>
    </div>
  );
}

function Pillar({
  k,
  title,
  body,
  accent,
}: {
  k: string;
  title: string;
  body: string;
  accent: "amber" | "cyan" | "rose";
}) {
  const border =
    accent === "amber"
      ? "border-amber-500/20 hover:border-amber-500/40"
      : accent === "cyan"
        ? "border-cyan-500/20 hover:border-cyan-500/40"
        : "border-rose-500/20 hover:border-rose-500/40";
  const num =
    accent === "amber"
      ? "text-amber-500/80"
      : accent === "cyan"
        ? "text-cyan-500/80"
        : "text-rose-500/80";

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition ${border}`}
    >
      <div className={`text-xs font-mono ${num}`}>{k}</div>
      <h3 className="mt-2 text-lg font-bold text-stone-100">{title}</h3>
      <p className="mt-2 text-sm text-stone-500 leading-relaxed">{body}</p>
    </div>
  );
}