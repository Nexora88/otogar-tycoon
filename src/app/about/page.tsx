import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0D0D1A] text-zinc-200">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="text-xs text-cyan-500">
          ← Ana sayfa
        </Link>
        <h1 className="text-3xl font-bold mt-4 mb-6">Hikâyemiz</h1>

        <div className="space-y-5 text-sm text-zinc-400 leading-relaxed">
          <p>
            <strong className="text-white">Otogar Tycoon: Peron Savaşları</strong>,
            1980’ler–90’lar Anadolu otogarlarının tozunu, çayını, korna sesini ve
            esnaf hesabını tarayıcıya taşıyan bir yönetim simülasyonudur.
          </p>
          <p>
            Geliştirici <strong className="text-white">Ahmet Eymen Bakraç</strong>,
            Nexora Labs çatısı altında hem nostaljiyi hem de “terminal ağalığı”
            gerilimini bir araya getirdi: sefer planı, kadro, vergi, gazete,
            haraç ve peron kapışması.
          </p>
          <p>
            <strong className="text-cyan-300">Nexora AI</strong> — Veri · Zekâ ·
            Gelecek. Oyun bir yan ürün; asıl vizyon yerli teknoloji ve yaratıcı
            yazılım üretmek. Bu proje o yolda bir durak.
          </p>
          <p>
            Gerçek para yoktur. Kumar yoktur. Amaç eğlenmek, öğrenmek ve “bir
            otobüs firması yönetiyorum” hissini yaşatmaktır. İçerik küfürsüz ve
            siyasetten uzak tutulmaya çalışılır.
          </p>
          <p>
            Canlı oyuncu sayısı lobide Supabase Presence ile ölçülür. Gerçek
            dünya / çok oyunculu hat savaşları yol haritasındadır.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/play" className="px-5 py-2.5 rounded-xl bg-cyan-500 text-black text-sm font-bold">
            Oyna
          </Link>
          <Link href="/legal" className="px-5 py-2.5 rounded-xl border border-zinc-700 text-sm">
            Yasal
          </Link>
          <Link href="/register" className="px-5 py-2.5 rounded-xl border border-zinc-700 text-sm">
            Hesap oluştur
          </Link>
        </div>
      </div>
    </div>
  );
}