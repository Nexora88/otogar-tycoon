"use client";

import { useState } from "react";
import Link from "next/link";
import { Bus, Trophy, Zap, Users } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white">
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      <main className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500 mb-6">
            <Bus className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Otogar <span className="text-amber-500">Tycoon</span>
          </h1>
          <p className="mt-4 text-zinc-400 text-lg max-w-xl mx-auto">
            Peron savaşları, eski yollar, radyo ve kasa. Şoförlükten terminal
            ağalığına.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link
              href="/play"
              className="px-8 py-3.5 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition"
            >
              Misafir Olarak Oyna
            </Link>
            <a
              href="#ozellikler"
              className="px-8 py-3.5 border border-zinc-700 rounded-xl text-zinc-300 hover:border-zinc-500 transition"
            >
              Özellikler
            </a>
          </div>
        </div>

        <div id="ozellikler" className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: Zap,
              title: "Canlı sefer",
              text: "Bilet dolsun, yola çık, mazot yak, kâr et.",
            },
            {
              icon: Trophy,
              title: "İtibar & ofis",
              text: "Muhasebe, müşteri, banka, yazıhane.",
            },
            {
              icon: Users,
              title: "Terminalim",
              text: "Tuvalet, büfe, emanet — pasif gelir.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
            >
              <f.icon className="w-6 h-6 text-amber-400 mb-3" />
              <div className="font-semibold mb-1">{f.title}</div>
              <p className="text-sm text-zinc-400">{f.text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-600 text-xs mt-16">
          Geliştirici: Ahmet Eymen Bakraç · 1980&apos;ler ruhu
        </p>
      </main>
    </div>
  );
}