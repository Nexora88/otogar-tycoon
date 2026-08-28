"use client";

import { useState } from "react";
import Link from "next/link";
import SplashScreen from "@/components/SplashScreen";
import OnlineBadge from "@/components/OnlineBadge";
import { Bus, BookOpen, Shield, Users, Info } from "lucide-react";

export default function HomePage() {
  const [splash, setSplash] = useState(true);

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      <div
        className={`min-h-screen transition-opacity duration-700 ${
          splash ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ background: "#0D0D1A" }}
      >
        {/* Üst bar */}
        <header className="border-b border-zinc-800/80">
          <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
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
                  Peron Savaşları
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OnlineBadge />
              <Link
                href="/auth/login"
                className="text-xs text-zinc-400 hover:text-white"
              >
                Giriş
              </Link>
              <Link
                href="/auth/register"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold text-[#0D0D1A]"
                style={{
                  background: "linear-gradient(90deg,#00F0FF,#007BFF)",
                }}
              >
                Hesap oluştur
              </Link>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="max-w-5xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-[11px] tracking-[0.3em] text-cyan-400/80 uppercase mb-4">
              Nexora Labs · Simülasyon
            </p>
            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
              Otogar{" "}
              <span style={{ color: "#00F0FF" }}>Tycoon</span>
            </h1>
            <p className="text-amber-500/90 text-sm tracking-[0.2em] uppercase mt-3 font-semibold">
              Peron Savaşları
            </p>
            <p className="text-zinc-400 text-sm sm:text-base mt-6 leading-relaxed">
              1980’ler Türkiye otogarları. Terminal kur, kadro yönet, sefer
              planla. Gerçek para yoktur — tamamen eğlence amaçlı bir yönetim
              simülasyonudur.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/play"
                className="px-8 py-3.5 rounded-xl font-bold text-[#0D0D1A] text-sm"
                style={{
                  background: "linear-gradient(90deg,#00F0FF,#007BFF)",
                }}
              >
                Misafir olarak oyna
              </Link>
              <Link
                href="/auth/register"
                className="px-8 py-3.5 rounded-xl border border-zinc-600 text-zinc-200 text-sm font-medium hover:border-cyan-600"
              >
                Hesap oluştur & kaydet
              </Link>
            </div>

            {/* Online / gerçek dünya */}
            <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" />
                  Canlı oyuncular
                </div>
                <p className="text-[11px] text-zinc-500 mt-2 leading-relaxed">
                  Lobide çevrimiçi sayı (Supabase Presence). Aynı anda siteyi
                  açan oyuncular sayılır.
                </p>
              </div>
              <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950/80 p-4 opacity-90">
                <div className="text-xs font-semibold text-zinc-400">
                  Gerçek dünya modu
                </div>
                <p className="text-[11px] text-zinc-600 mt-2 leading-relaxed">
                  Canlı oyuncularla hat kapışması —{" "}
                  <span className="text-amber-600/90">yakında</span>. Şimdilik
                  tek oyunculu ağa modu aktif.
                </p>
                <button
                  type="button"
                  disabled
                  className="mt-3 w-full py-2 text-[11px] rounded-lg border border-zinc-800 text-zinc-600 cursor-not-allowed"
                >
                  Canlı oyuncularla oyna (yakında)
                </button>
              </div>
            </div>
          </div>

          {/* Link kartları */}
          <div className="mt-20 grid sm:grid-cols-3 gap-4">
            <Link
              href="/how-to-play"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-cyan-800 transition"
            >
              <BookOpen className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-semibold text-sm text-white">Nasıl oynanır?</div>
              <p className="text-xs text-zinc-500 mt-2">
                Terminal, kadro, sefer ve ofis döngüsü.
              </p>
            </Link>
            <Link
              href="/about"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-cyan-800 transition"
            >
              <Info className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-semibold text-sm text-white">Hakkımızda</div>
              <p className="text-xs text-zinc-500 mt-2">
                Nexora Labs ve geliştirici notu.
              </p>
            </Link>
            <Link
              href="/legal"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:border-cyan-800 transition"
            >
              <Shield className="w-5 h-5 text-cyan-400 mb-3" />
              <div className="font-semibold text-sm text-white">Yasal & kurallar</div>
              <p className="text-xs text-zinc-500 mt-2">
                Gerçek para yok, içerik kuralları, sorumluluk.
              </p>
            </Link>
          </div>
        </main>

        <footer className="border-t border-zinc-900 py-8 text-center text-[11px] text-zinc-600 space-y-2">
          <p>
            Otogar Tycoon bir <strong className="text-zinc-500">simülasyon</strong>
            dur. Gerçek para, kumar veya finansal vaat içermez.
          </p>
          <p>
            Geliştirici: Ahmet Eymen Bakraç · Nexora AI · İçerik küfürsüz ve
            siyasetsiz tutulur.
          </p>
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
          </div>
        </footer>
      </div>
    </>
  );
}