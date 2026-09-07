"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { SplashScreen } from "@/components/SplashScreen";
import { RadioPanel } from "@/components/RadioPanel";
import { LivePulse } from "@/components/LivePulse";
import { playHorn, playClick } from "@/lib/audio";

export default function HomePage() {
  const [splash, setSplash] = useState(true);
  const done = useCallback(() => setSplash(false), []);

  if (splash) return <SplashScreen onDone={done} />;

  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100 relative overflow-hidden">
      {/* Hareketli neon çizgiler */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0 animate-[pulse_8s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_30%_20%,rgba(34,211,238,0.35),transparent_50%)]" />
        <div className="absolute inset-0 animate-[pulse_12s_ease-in-out_infinite] bg-[radial-gradient(ellipse_at_70%_80%,rgba(245,158,11,0.25),transparent_45%)]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0 48px, rgba(0,240,255,0.06) 48px 49px)",
            animation: "slideX 40s linear infinite",
          }}
        />
      </div>

      {/* Otobüs silüeti */}
      <div
        className="pointer-events-none absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[min(90vw,520px)] opacity-[0.06]"
        aria-hidden
      >
        <svg viewBox="0 0 400 120" className="w-full h-auto">
          <rect x="20" y="35" width="320" height="50" rx="8" fill="#94a3b8" />
          <rect x="40" y="42" width="40" height="22" rx="3" fill="#0f172a" />
          <rect x="95" y="42" width="40" height="22" rx="3" fill="#0f172a" />
          <rect x="150" y="42" width="40" height="22" rx="3" fill="#0f172a" />
          <rect x="205" y="42" width="40" height="22" rx="3" fill="#0f172a" />
          <rect x="260" y="42" width="50" height="28" rx="4" fill="#cbd5e1" />
          <circle cx="80" cy="95" r="16" fill="#64748b" />
          <circle cx="280" cy="95" r="16" fill="#64748b" />
          <circle cx="80" cy="95" r="7" fill="#1e293b" />
          <circle cx="280" cy="95" r="7" fill="#1e293b" />
        </svg>
      </div>

      <style jsx global>{`
        @keyframes slideX {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-49px);
          }
        }
      `}</style>

      <header className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-zinc-800/80">
        <div className="text-[10px] tracking-[0.3em] text-amber-600 font-bold">
          OTOGAR TYCOON
        </div>
        <div className="flex gap-3 text-xs text-zinc-500">
          <Link href="/how-to-play" className="hover:text-zinc-300">
            Nasıl oynanır
          </Link>
          <Link href="/about" className="hover:text-zinc-300">
            Hakkında
          </Link>
          <Link href="/login" className="hover:text-zinc-300">
            Giriş
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="mb-6">
          <LivePulse />
        </div>

        <p className="text-amber-600/90 text-xs tracking-widest font-bold mb-3">
          1987 · PERON SAVAŞLARI
        </p>
        <h1 className="text-4xl sm:text-6xl font-black leading-[0.95]">
          Çıraklıktan
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-400">
            terminal ağalığına
          </span>
        </h1>
        <p className="mt-5 text-zinc-400 text-sm sm:text-base max-w-xl leading-relaxed">
          Oda kur, X’te meydan oku, aynı hatta fiyat kır. Gazete, aidat, radyo —
          gerçek para yok.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/play"
            onClick={() => {
              playHorn();
              playClick();
            }}
            className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-900/30"
          >
            Oyuna gir
          </Link>
          <Link
            href="/lobby"
            className="px-6 py-3 rounded-xl border border-cyan-700/60 text-cyan-300 text-sm hover:bg-cyan-950/30"
          >
            Canlı lobi / oda
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl border border-zinc-600 text-sm"
          >
            Hesap oluştur
          </Link>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { t: "Oda kodu", d: "Arkadaşını çağır, peron kapış." },
            { t: "Canlı fiyat", d: "Rakip kırınca nabız düşer." },
            { t: "Sohbet", d: "Yazıhane telsizi gibi oda chat." },
          ].map((x) => (
            <div
              key={x.t}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/70 backdrop-blur"
            >
              <div className="font-semibold text-amber-200/90">{x.t}</div>
              <p className="text-xs text-zinc-500 mt-1">{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 max-w-sm">
          <RadioPanel />
        </div>

        <p className="mt-16 text-[11px] text-zinc-600">
          Geliştirici: Ahmet Eymen Bakraç · Nexora Labs · Kumar / gerçek para yok.
        </p>
      </main>
    </div>
  );
}