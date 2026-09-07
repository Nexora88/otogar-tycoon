"use client";

import { useState } from "react";
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import OnlineBadge from "@/components/OnlineBadge";
import { Bus, BookOpen, Shield, Info, Coffee, Swords } from "lucide-react";

const FAKE_HEADLINES = [
  "MAZOT ZAMMI BEKLENİYOR — peronlar gerildi",
  "EDS flaş yağmuru: Bolu–Ankara hattı",
  "Bayram seferi: bilet tavanı konuşuluyor",
  "Yazıhane dedikodusu: aidat fısıltıları",
];

export default function HomePage() {
  const [splash, setSplash] = useState(true);
  const headline =
    FAKE_HEADLINES[Math.floor(Math.random() * FAKE_HEADLINES.length)]!;

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div
        className={`min-h-screen transition-opacity duration-700 ${
          splash ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at 20% 0%,#1a1020 0%,#0D0D1A 45%,#0a0a12 100%)",
        }}
      >
        {/* Gazete şeridi */}
        <div className="bg-amber-950/80 border-b border-amber-900/50 overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 py-1.5 flex items-center gap-3 text-[10px] sm:text-xs">
            <span className="shrink-0 font-bold text-amber-400 tracking-widest">
              HAKİKİ PERON · 1987
            </span>
            <span className="text-amber-200/90 truncate">{headline}</span>
          </div>
        </div>

        <header className="border-b border-zinc-800/80">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-900/30"
                style={{
                  background: "linear-gradient(135deg,#7B2CFF,#007BFF,#00F0FF)",
                }}
              >
                <Bus className="w-5 h-5 text-[#0D0D1A]" />
              </div>
              <div>
                <div className="font-bold text-white text-sm tracking-tight">
                  Otogar Tycoon
                </div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
                  Peron Savaşları · 1987
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OnlineBadge />
              <Link href="/login" className="text-xs text-zinc-400 hover:text-white">
                Giriş
              </Link>
              <Link
                href="/register"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold text-[#0D0D1A]"
                style={{ background: "linear-gradient(90deg,#00F0FF,#007BFF)" }}
              >
                Hesap oluştur
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
          {/* Afiş hero */}
          <div className="relative rounded-2xl border-2 border-amber-900/40 overflow-hidden mb-14">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.15) 2px,rgba(0,0,0,0.15) 3px)",
              }}
            />
            <div className="relative px-6 py-12 sm:py-16 text-center">
              <p className="text-[11px] tracking-[0.35em] text-amber-500/90 uppercase mb-3">
                Nexora Labs · Ahmet Eymen Bakraç
              </p>
              <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.05]">
                OTOGAR
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">
                  TYCOON
                </span>
              </h1>
              <p className="mt-3 text-amber-400 font-bold tracking-[0.25em] text-xs sm:text-sm uppercase">
                Peron Savaşları
              </p>
              <p className="mt-6 max-w-xl mx-auto text-zinc-300 text-sm sm:text-base leading-relaxed">
                Peronda fiyat kırılır. Yazıhanede hesap tutulur.
                <br />
                <span className="text-zinc-500">
                  Çıraklıktan başla, patronun gözünde büyü, kendi terminalini kur.
                </span>
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/play"
                  className="px-8 py-3.5 rounded-xl font-bold text-[#0D0D1A] text-sm shadow-lg shadow-cyan-900/40"
                  style={{
                    background: "linear-gradient(90deg,#00F0FF,#007BFF)",
                  }}
                >
                  Misafir dene — perona yazıl
                </Link>
                <Link
                  href="/how-to-play"
                  className="px-8 py-3.5 rounded-xl border border-amber-800/60 text-amber-200/90 text-sm font-medium hover:bg-amber-950/40"
                >
                  Nasıl oynanır?
                </Link>
              </div>
              <p className="mt-4 text-[11px] text-zinc-600">
                Misafir ~5 oyun günü · sonra hesap · gerçek para yok
              </p>
            </div>
          </div>

          {/* 3 vaat kartı */}
          <div className="grid sm:grid-cols-3 gap-4 mb-14">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <Coffee className="w-5 h-5 text-amber-400 mb-3" />
              <div className="font-bold text-sm text-white">Çırak vardiyası</div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Çay, gazete, kasa sayımı, patron çağrısı. Hitabın memleketinle
                birleşir. Ağa olmak ödül.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <Bus className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-bold text-sm text-white">Terminal & sefer</div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Bağımsız olunca ruhsat, filo, ikram, 1 otobüs = 1 sefer. Ofis,
                vergi, gazete.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5">
              <Swords className="w-5 h-5 text-red-400/90 mb-3" />
              <div className="font-bold text-sm text-white">Oda & nabız</div>
              <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                Oda kodu, X’te davet, sohbet, canlı bilet nabzı. Tam borsa
                kapışması yol haritasında.
              </p>
            </div>
          </div>

          {/* Tabela şeridi */}
          <div className="flex flex-wrap justify-center gap-2 mb-14 text-[10px] sm:text-xs">
            {[
              "Yurtta sulh, cihanda sulh",
              "Yerli malı · herkes onu kullanmalı",
              "Nexora Elektronik — 1987",
              "Bakraç Ticaret",
              "Esnaf FM · Yurt FM",
            ].map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900/60 text-zinc-400"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/how-to-play"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-cyan-800 transition"
            >
              <BookOpen className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-semibold text-sm text-white">Nasıl oynanır?</div>
              <p className="text-xs text-zinc-500 mt-2">
                Vardiya → rütbe → terminal → sefer.
              </p>
            </Link>
            <Link
              href="/about"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-cyan-800 transition"
            >
              <Info className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-semibold text-sm text-white">Hakkımızda</div>
              <p className="text-xs text-zinc-500 mt-2">Nexora Labs · geliştirici.</p>
            </Link>
            <Link
              href="/legal"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-cyan-800 transition"
            >
              <Shield className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-semibold text-sm text-white">Yasal</div>
              <p className="text-xs text-zinc-500 mt-2">
                Gerçek para yok · küfürsüz · siyasetsiz.
              </p>
            </Link>
          </div>
        </main>

        <footer className="border-t border-zinc-900 py-8 text-center text-[11px] text-zinc-600 space-y-2">
          <p>
            Otogar Tycoon bir{" "}
            <strong className="text-zinc-500">simülasyon</strong>dur. Gerçek para,
            kumar veya finansal vaat içermez.
          </p>
          <p>Geliştirici: Ahmet Eymen Bakraç · Nexora AI / Nexora Labs</p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/legal" className="hover:text-zinc-400">
              Yasal
            </Link>
            <Link href="/how-to-play" className="hover:text-zinc-400">
              Rehber
            </Link>
            <Link href="/about" className="hover:text-zinc-400">
              Hakkında
            </Link>
            <Link href="/register" className="hover:text-zinc-400">
              Kayıt
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
}