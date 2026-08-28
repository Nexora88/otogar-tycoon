"use client";

import { useState } from "react";
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import { Bus } from "lucide-react";

export default function HomePage() {
  const [splash, setSplash] = useState(true);

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div
        className={`min-h-screen flex flex-col items-center justify-center px-4 transition-opacity duration-700 ${
          splash ? "opacity-0" : "opacity-100"
        }`}
        style={{ background: "#0D0D1A" }}
      >
        <div className="text-center max-w-lg">
          <div
            className="inline-flex w-14 h-14 rounded-xl items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg,#7B2CFF,#007BFF,#00F0FF)",
            }}
          >
            <Bus className="w-7 h-7 text-[#0D0D1A]" />
          </div>
          <h1 className="text-4xl font-black text-white">
            Otogar{" "}
            <span style={{ color: "#00F0FF" }}>Tycoon</span>
          </h1>
          <p className="text-amber-500/90 text-sm tracking-[0.25em] uppercase mt-2">
            Peron Savaşları
          </p>
          <p className="text-zinc-500 text-sm mt-4 leading-relaxed">
            1980&apos;ler Türkiye otogarları. Terminal kur, şoför al, sefer
            yönet — ağa ol.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/play"
              className="px-8 py-3 rounded-xl font-bold text-[#0D0D1A] text-sm"
              style={{
                background: "linear-gradient(90deg,#00F0FF,#007BFF)",
              }}
            >
              Oyuna başla
            </Link>
            <button
              type="button"
              onClick={() => setSplash(true)}
              className="px-8 py-3 rounded-xl border border-zinc-700 text-zinc-400 text-sm"
            >
              Açılışı tekrar izle
            </button>
          </div>

          <p className="mt-12 text-[11px] text-zinc-600">
            Geliştirici: Ahmet Eymen Bakraç · Nexora AI
          </p>
        </div>
      </div>
    </>
  );
}