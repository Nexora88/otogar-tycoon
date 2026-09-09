"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [pulse, setPulse] = useState({ rooms: 3, trips: 40 });

  useEffect(() => {
    const t = setInterval(() => {
      setPulse({
        rooms: 2 + Math.floor(Math.random() * 8),
        trips: 30 + Math.floor(Math.random() * 90),
      });
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] bg-[size:48px_48px]" />

        <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-14 text-center">
          <p className="text-[11px] tracking-[0.35em] text-amber-600 font-bold">
            1987 · PERON SAVAŞLARI
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
            Otogar Tycoon
          </h1>
          <p className="mt-4 text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Çıraklıktan terminal ağalığına. İkram, itibar, mafya kapısı, Hakiki
            Peron gazetesi. Gerçek para yok — racon var.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/play"
              className="px-8 py-3.5 rounded-xl bg-amber-500 text-black font-bold text-sm hover:bg-amber-400 transition"
            >
              Misafir oyna
            </Link>
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl border border-zinc-600 text-zinc-200 text-sm hover:border-amber-700/50 transition"
            >
              Hesap oluştur
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl text-zinc-500 text-sm hover:text-zinc-300"
            >
              Giriş
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-[11px] text-zinc-600">
            <span>Açık oda ~{pulse.rooms}</span>
            <span className="text-zinc-800">·</span>
            <span>Canlı sefer nabzı ~{pulse.trips}</span>
            <span className="text-zinc-800">·</span>
            <span>1 oyun günü ≈ birkaç dk</span>
          </div>
        </div>
      </div>

      {/* Üç vaat */}
      <div className="max-w-4xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-4">
        <Card
          title="Ağa modu"
          body="Şoför ata, seferi ofisten yönet. Fiş düşünce deftere işlenir."
        />
        <Card
          title="Peron savaşı"
          body="Aynı hatta fiyat kırılır. Lobi ve açık odalarda nabız tut."
        />
        <Card
          title="1987 ruhu"
          body="Gazete, telsiz, çay, portre. Yurtta sulh — hesap temiz."
        />
      </div>

      {/* Nasıl */}
      <div className="border-y border-zinc-900 bg-zinc-900/40">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h2 className="text-lg font-bold text-center mb-6">Nasıl oynanır?</h2>
          <ol className="space-y-4 text-sm text-zinc-400">
            <li>
              <span className="text-amber-500 font-bold">1.</span> Misafir veya
              hesap — şehir / yazıhane seç.
            </li>
            <li>
              <span className="text-amber-500 font-bold">2.</span> Çırak
              vardiyasında öğren; rütbe yükseldikçe sefer ve terminal açılır.
            </li>
            <li>
              <span className="text-amber-500 font-bold">3.</span> İkram ve fiyat
              dengesi, kadro, borç, kapı — hepsi itibarı etkiler.
            </li>
            <li>
              <span className="text-amber-500 font-bold">4.</span> Lobi / etkinlik
              ile arkadaş odası; X’te kod paylaş.
            </li>
          </ol>
          <div className="text-center mt-8">
            <Link
              href="/how-to-play"
              className="text-sm text-amber-500/90 hover:underline"
            >
              Detaylı rehber →
            </Link>
          </div>
        </div>
      </div>

      {/* Alt */}
      <footer className="max-w-3xl mx-auto px-4 py-10 text-center text-[11px] text-zinc-600 space-y-2">
        <p>
          Geliştirici:{" "}
          <span className="text-zinc-400">Ahmet Eymen Bakraç</span> · Nexora
        </p>
        <p>
          Bu bir simülasyondur. Gerçek para, kumar veya yasadışı faaliyet
          yoktur. Küfürsüz ve siyasetsiz topluluk hedeflenir.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/about" className="hover:text-zinc-400">
            Hakkında
          </Link>
          <Link href="/legal" className="hover:text-zinc-400">
            Yasal
          </Link>
          <Link href="/how-to-play" className="hover:text-zinc-400">
            Nasıl oynanır
          </Link>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h3 className="font-semibold text-amber-100/90">{title}</h3>
      <p className="text-sm text-zinc-500 mt-2 leading-relaxed">{body}</p>
    </div>
  );
}