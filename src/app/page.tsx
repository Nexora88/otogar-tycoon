"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { SplashScreen } from "@/components/SplashScreen";
import { RadioPanel } from "@/components/RadioPanel";
import { playHorn, playClick } from "@/lib/audio";

export default function HomePage() {
  const [splash, setSplash] = useState(true);
  const done = useCallback(() => setSplash(false), []);

  if (splash) {
    return <SplashScreen onDone={done} />;
  }

  return (
    <div className="min-h-screen bg-[#07090d] text-zinc-100">
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.04)_2px,rgba(255,255,255,0.04)_3px)]" />

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

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-20">
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
          Hakiki Peron gazetesi, yazıhane aidatı, bilet fiyat savaşı ve
          nostaljik radyo. Gerçek para yok — sadece peron raconu.
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
            href="/register"
            className="px-6 py-3 rounded-xl border border-zinc-600 text-sm hover:border-zinc-400"
          >
            Hesap oluştur
          </Link>
          <Link
            href="/play?guest=1"
            className="px-6 py-3 rounded-xl text-sm text-zinc-500 hover:text-zinc-300"
          >
            Misafir dene
          </Link>
        </div>

        <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
          {[
            {
              t: "Çırak → Ağa",
              d: "Vardiya, patron, birikim. Sefer sonra.",
            },
            {
              t: "Peron savaşı",
              d: "Fiyat kır, çığırtkan tut, gazete oku.",
            },
            {
              t: "Yazıhane",
              d: "Aidat, vergi, mafya kapısı, racon.",
            },
          ].map((x) => (
            <div
              key={x.t}
              className="p-4 rounded-xl border border-zinc-800 bg-zinc-950/80"
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
          Geliştirici: Ahmet Eymen Bakraç · Nexora Labs · Gerçek para ile
          kumar / yatırım yoktur.
        </p>
      </main>
    </div>
  );
}