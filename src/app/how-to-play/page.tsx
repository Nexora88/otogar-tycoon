"use client";

import Link from "next/link";

const SECTIONS = [
  {
    title: "Amaç",
    body: "Küçük filoyla başla, itibar ve kasa biriktir, terminal büyüt. İstersen çıraklıktan yüksel; istersen ağa modunda sefer yönet. Gerçek para yoktur.",
  },
  {
    title: "Zaman",
    body: "Oyun günü gerçek hayattan hızlı akar (yaklaşık birkaç dakikada bir gün). Sabah ve akşam gazete üretilir; sen açarsın, ekranı kilitlemez.",
  },
  {
    title: "Sefer",
    body: "Hat seç, fiyat ve ikram belirle. Ucuz ikram kâr bırakır ama itibar yer; lüks ikram pahalıdır. Doluluk fiyata göre değişir. Şoför/muavin yorgunsa risk artar.",
  },
  {
    title: "Kadro",
    body: "Kapıdan aday gelir. İstihbarat (eski firma) alabilirsin. Şüpheli kayıtlar ileride baş ağrıtır. Çığırtkan seviyesi peronda dolumu hızlandırır.",
  },
  {
    title: "Para & borç",
    body: "Bankadan imzalı kredi: kefil, vade, faiz. Ödemezsen icra ve itibar kaybı. Vergi birikir; ofisten kapat.",
  },
  {
    title: "Kapı (aidat)",
    body: "Bölgesel ‘selam’ gelebilir. Hakiki kapı reddi hasar getirir; sahte kabadayı blöf olabilir. İstihbarat ve racon seçenekleri vardır.",
  },
  {
    title: "Lobi & etkinlik",
    body: "Özel oda kodu üret, X’te paylaş. Açık odalarda sohbet ve sıralama nabzı. Canlı rakip altyapısı gelişmeye açık.",
  },
  {
    title: "Misafir",
    body: "Kısa deneme sonrası hesap önerilir; ilerlemenin kaybolmaması için kayıt iyi fikirdir.",
  },
];

export default function HowToPlayPage() {
  return (
    <div className="min-h-screen bg-[#1a1008] text-stone-100">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,#f59e0b18,transparent_50%)]" />

      <div className="relative max-w-2xl mx-auto px-4 py-10 pb-20">
        <Link
          href="/"
          className="text-sm text-amber-500/90 hover:text-amber-400"
        >
          ← Açılış
        </Link>

        <h1 className="mt-4 text-3xl font-black">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
            Nasıl oynanır?
          </span>
        </h1>
        <p className="mt-2 text-stone-400 text-sm leading-relaxed">
          Otogar Tycoon bir yönetim simülasyonu. Acele etme; defter ve itibar uzun
          oyun.
        </p>

        <div className="mt-8 space-y-4">
          {SECTIONS.map((s, i) => (
            <section
              key={s.title}
              className="rounded-2xl border border-amber-900/40 bg-gradient-to-br from-stone-900/90 to-[#1c140c] p-5"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-orange-400 font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-bold text-amber-100">{s.title}</h2>
              </div>
              <p className="mt-2 text-sm text-stone-400 leading-relaxed">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/play"
            className="text-center px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950 text-sm"
          >
            Misafir oyna
          </Link>
          <Link
            href="/register"
            className="text-center px-6 py-3 rounded-xl border border-cyan-600/50 text-cyan-200 text-sm"
          >
            Hesap oluştur
          </Link>
        </div>

        <p className="mt-8 text-center text-[11px] text-stone-600">
          Yurtta sulh, cihanda sulh · Gerçek para yok
        </p>
      </div>
    </div>
  );
}