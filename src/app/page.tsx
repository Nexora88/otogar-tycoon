"use client";

import { useState } from "react";
import Link from "next/link";
import { Bus, Trophy, Zap, Users } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Bus className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Otogar <span className="text-amber-500">Tycoon</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition">
            Giriş Yap
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition">
            Kayıt Ol
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-medium">
          <Zap className="w-3.5 h-3.5" />
          Canlı Rekabet • Peron Savaşları
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Türkiye&apos;nin En Rekabetçi
          <br />
          <span className="text-amber-500">Otobüs İmparatorluğu</span>
        </h1>

        <p className="mt-6 text-zinc-400 max-w-xl text-lg leading-relaxed">
          Sefer koy, fiyat kır, rakiplerinin yolcularını çal.
          Anlık peron savaşlarıyla otobüs şirketini büyüt.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/play"
            className="px-8 py-3.5 bg-amber-500 text-black font-semibold rounded-xl hover:bg-amber-400 transition text-base"
          >
            Misafir Olarak Oyna
          </Link>
          <Link
            href="/register"
            className="px-8 py-3.5 border border-zinc-700 rounded-xl hover:bg-zinc-900 transition text-base"
          >
            Kayıt Ol & Başla
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-amber-400" />}
            title="Peron Savaşları"
            description="Aynı hatta rakibinle fiyat kapışması yap. Son saniyede fiyat kırarak yolcuları kap."
          />
          <FeatureCard
            icon={<Users className="w-5 h-5 text-amber-400" />}
            title="Canlı Rekabet"
            description="Rakiplerinin seferlerini anlık gör. Stratejini değiştir, baltala."
          />
          <FeatureCard
            icon={<Trophy className="w-5 h-5 text-amber-400" />}
            title="Garaj & Boyama"
            description="Otobüslerini boya, yükselt, filonu büyüt. İtibar kazan."
          />
        </div>
      </main>

      <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
        Otogar Tycoon • Peron Savaşları • 2026
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 text-left hover:border-zinc-700 transition">
      <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}